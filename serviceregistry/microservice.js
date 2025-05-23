/** @module serviceregistry/microservice */

/**
 * @import {microservice_registry_service, 
 *          server_server_response, server_bff_endpoint_type, server_req_method} from '../server/types.js'
 */

const http = await import('node:http');
const https = await import('node:https');

const {registryConfigServices} = await import('./registry.js');
const { iamAuthenticateApp } = await import('../server/iam.js');
const {serverUtilNumberValue} = await import('../server/server.js');

const MICROSERVICE_MESSAGE_TIMEOUT = '🗺⛔?';
const MICROSERVICE_RESOURCE_ID_STRING = ':RESOURCE_ID';
/**
 * @name microserviceUtilResourceIdNumberGet
 * @description Returns resource id number from URI path
 *              if resource id not requested for a route using resource id and last part of path is string then return null
 * @function
 * @param {string} uri_path
 * @returns {number|null}
 */
 const microserviceUtilResourceIdNumberGet = uri_path => serverUtilNumberValue(uri_path.substring(uri_path.lastIndexOf('/') + 1));
/**
 * @name microserviceUtilResourceIdStringGet
 * @description Returns resource id string from URI path
 *              if resource id not requested for a route using resource id and last part of path is string then return null
 * @function
 * @param {string} uri_path
 * @returns {string|null}
 */
 const microserviceUtilResourceIdStringGet = uri_path => uri_path.substring(uri_path.lastIndexOf('/') + 1);

/**
 * @name microserviceRequest
 * @description Request microservice using circuitbreaker
 *              Uses client_id and client_secret defined for given app
 *              microservice REST API syntax:
 *              [microservice protocol]://[microservice host]:[microservice port]/api/v[microservice API version]/[resource]/[optional resource id]?[base64 encoded URI query]
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          path:string, 
 *          method:server_req_method,
 *          data:*,
 *          ip:string,
 *          user_agent:string,
 *          accept_language:string,
 *          endpoint:server_bff_endpoint_type
 *       }} parameters
 * @returns {Promise.<server_server_response>}
 */
const microserviceRequest = async parameters =>{
    const {circuitBreaker} = await import('./circuitbreaker.js');
    const ConfigServer = await import('../server/db/ConfigServer.js');
    const AppSecret = await import('../server/db/AppSecret.js');
    const {registryMicroserviceApiVersion}= await import('./registry.js');

    /**@type{microservice_registry_service} */
    const microservice = parameters.path.split('/')[1].toUpperCase();
    if ((microservice == 'GEOLOCATION' && serverUtilNumberValue(ConfigServer.get({app_id:parameters.app_id, data:{ config_group:'SERVICE_IAM', parameter:'ENABLE_GEOLOCATION'}}).result)==1)||
        microservice != 'GEOLOCATION'){
        //use app id, CLIENT_ID and CLIENT_SECRET for microservice IAM
        const authorization = `Basic ${Buffer.from(     AppSecret.get({app_id:parameters.app_id, resource_id:parameters.app_id}).result[0].common_client_id + ':' + 
                                                        AppSecret.get({app_id:parameters.app_id, resource_id:parameters.app_id}).result[0].common_client_secret,'utf-8').toString('base64')}`;
        //convert data object to string if method=GET, add always app_id parameter for authentication and send as base64 encoded
        const query = Buffer.from((parameters.method=='GET'?Object.entries(parameters.data).reduce((query, param)=>query += `${param[0]}=${param[1]}&`, ''):'')
                                    + `app_id=${parameters.app_id}`
                                ).toString('base64');
        /**@ts-ignore */
        return await circuitBreaker.MicroServiceCall( microserviceHttpRequest, 
                                                microservice, 
                                                
                                                parameters.app_id == serverUtilNumberValue(ConfigServer.get({app_id:parameters.app_id, data:{ config_group:'SERVER', parameter:'APP_COMMON_APP_ID'}}).result), //if appid = APP_COMMON_APP_ID then admin, 
                                                `/api/v${registryMicroserviceApiVersion(microservice)}${parameters.path}`, 
                                                query, 
                                                parameters.data, 
                                                parameters.method,
                                                parameters.ip,
                                                authorization, 
                                                parameters.user_agent, 
                                                parameters.accept_language, 
                                                parameters.endpoint == 'SERVER')
                                                .then(result=>{
                                                    return {result:result, type:'JSON'};
                                                })
                                                .catch((error)=>{
                                                    return error.error?.http?
                                                                error.error:
                                                                {   http:503, 
                                                                    code:'MICROSERVICE', 
                                                                    text:error, 
                                                                    developerText:null, 
                                                                    moreInfo:null,
                                                                    type:'JSON'};
                                                });
        }
    else{
        const  {iamUtilMessageNotAuthorized} = await import('../server/iam.js');
        return {
                http:503, 
                code:'MICROSERVICE', 
                text:iamUtilMessageNotAuthorized(), 
                developerText:null, 
                moreInfo:null,
                type:'JSON'};
    }
}; 

/**
 * @name microserviceHttpRequest
 * @description Request microservice
 * @function
 * @param {string} service
 * @param {string|undefined} path
 * @param {string} query
 * @param {object} body 
 * @param {string} method 
 * @param {number} timeout 
 * @param {string} client_ip 
 * @param {string} authorization 
 * @param {string} headers_user_agent 
 * @param {string} headers_accept_language 
 
 * @returns {Promise.<string>}
 */                    
const microserviceHttpRequest = async (service, path, query, body, method, timeout, client_ip, authorization, headers_user_agent, headers_accept_language) =>{

    const request_protocol = registryConfigServices(service).HTTPS_ENABLE ==1?https:http;
    const port = registryConfigServices(service).HTTPS_ENABLE ==1?registryConfigServices(service).HTTPS_PORT:registryConfigServices(service).PORT;
    
    return new Promise ((resolve, reject)=>{
        const headers = method=='GET'? {
                'User-Agent': headers_user_agent,
                'Accept-Language': headers_accept_language,
                'Authorization': authorization,
                'x-forwarded-for': client_ip
            }: {
                'User-Agent': headers_user_agent,
                'Accept-Language': headers_accept_language,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(JSON.stringify(body)),
                'Authorization': authorization,
                'x-forwarded-for': client_ip
            };
        const options = {
            method: method,
            timeout: timeout,
            headers : headers,
            host: registryConfigServices(service).HOST,
            port: port,
            path: `${path}?${query}`,
            rejectUnauthorized: false
        };
        const request = request_protocol.request(options, res =>{
            let responseBody = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) =>{
                responseBody += chunk;
            });
            res.on('end', ()=>{
                if (res.statusCode == 200)
                    resolve (JSON.parse(responseBody));
                else
                    reject(JSON.parse(responseBody));
            });
        });
        if (method !='GET')
            request.write(JSON.stringify(body));
        request.on('error', error => {
            reject(error);
        });
        request.on('timeout', () => {
            reject(MICROSERVICE_MESSAGE_TIMEOUT);
        });
        request.end();
    });
};


export {MICROSERVICE_RESOURCE_ID_STRING, microserviceUtilResourceIdNumberGet, microserviceUtilResourceIdStringGet, registryConfigServices, microserviceRequest, iamAuthenticateApp};