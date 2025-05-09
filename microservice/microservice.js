/** @module microservice/microservice */

/**
 * @import {server_server_response, server_bff_endpoint_type, server_server_req_id_number,server_req_method} from '../server/types.js'
 * @import {microservice_res, microservice_registry_service} from './types.js'
 */

const http = await import('node:http');
const https = await import('node:https');

/**@type{import('./registry.js')} */
const {registryConfigServices} = await import(`file://${process.cwd()}/microservice/registry.js`);

/**@type{import('../server/iam.js')} */
const { iamAuthenticateApp } = await import(`file://${process.cwd()}/server/iam.js`);

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
 const microserviceUtilResourceIdNumberGet = uri_path => microserviceUtilNumberValue(uri_path.substring(uri_path.lastIndexOf('/') + 1));
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
 * @name microserviceRouteMatch
 * @description Route match
 * @function
 * @param {string} route_path
 * @param {string} route_method
 * @param {string} request_path
 * @param {string} request_method 
 * @returns {boolean}
 */
const microserviceRouteMatch = (route_path, route_method, request_path , request_method) => 
 (route_path.indexOf('/:RESOURCE_ID')>-1?route_path. replace('/:RESOURCE_ID', request_path.substring(request_path.lastIndexOf('/'))):route_path) == request_path && 
  route_method == request_method;

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
    /**@type{import('./circuitbreaker.js')} */
    const {circuitBreaker} = await import(`file://${process.cwd()}/microservice/circuitbreaker.js`);
    /**@type{import('../server/db/Config.js')} */
    const Config = await import(`file://${process.cwd()}/server/db/Config.js`);
    /**@type{import('../server/db/AppSecret.js')} */
    const AppSecret = await import(`file://${process.cwd()}/server/db/AppSecret.js`);
    /**@type{import('./registry.js')} */
    const {registryMicroserviceApiVersion}= await import(`file://${process.cwd()}/microservice/registry.js`);

    /**@type{microservice_registry_service} */
    const microservice = parameters.path.split('/')[1].toUpperCase();
    if ((microservice == 'GEOLOCATION' && microserviceUtilNumberValue(Config.get({app_id:parameters.app_id, data:{object:'ConfigServer', config_group:'SERVICE_IAM', parameter:'ENABLE_GEOLOCATION'}}))==1)||
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
                                                
                                                parameters.app_id == microserviceUtilNumberValue(Config.get({app_id:parameters.app_id, data:{object:'ConfigServer', config_group:'SERVER', parameter:'APP_COMMON_APP_ID'}})), //if appid = APP_COMMON_APP_ID then admin, 
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
        /**@type{import('../server/iam.js')} */
        const  {iamUtilMessageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);
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
 * @name microserviceUtilNumberValue
 * @description Get number value from request key
 *              returns number or null for numbers
 *              so undefined and '' are avoided sending arguement to service functions
 * @function
 * @param {server_server_req_id_number} param
 * @returns {number|null}
 */
 const microserviceUtilNumberValue = param => (param==null||param===undefined||param==='')?null:Number(param);

/**
 * @name microserviceResultReturn
 * @description Return result from microservice
 * @function
 * @param {number} code 
 * @param {string|null} error 
 * @param {*} result 
 * @param {microservice_res} res
 * @returns {void}
 */
 const microserviceResultReturn = (code, error, result, res)=>{
    res.statusCode = code;
    if (error){
        console.log(error);
        //ISO20022 error format
        const message = JSON.stringify({error:{
                                        http:code, 
                                        code:'MICROSERVICE',
                                        text:error, 
                                        developer_text:null, 
                                        more_info:null}});
        res.write(message, 'utf8');
    }
    else{
        res.setHeader('Content-Type',  'application/json; charset=utf-8');
        res.write(JSON.stringify(result), 'utf8');
    }
    res.end();
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
        let headers;
        let options;
        const hostname = 'localhost';
        if (client_ip == null && headers_user_agent == null && headers_accept_language == null){    
            headers = {
                'User-Agent': 'server',
                'Accept-Language': '*',
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(JSON.stringify(body)),
                'Authorization': authorization
            };
            //host: 'localhost',
            options = {
                method: method,
                timeout: timeout,
                headers : headers,
                port: port,
                path: `${path}?${query}`,
                rejectUnauthorized: false
            };
        }
        else{
            if (method == 'GET')
                headers = {
                    'User-Agent': headers_user_agent,
                    'Accept-Language': headers_accept_language,
                    'Authorization': authorization,
                    'x-forwarded-for': client_ip
                };
            else
                headers = {
                    'User-Agent': headers_user_agent,
                    'Accept-Language': headers_accept_language,
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(JSON.stringify(body)),
                    'Authorization': authorization,
                    'x-forwarded-for': client_ip
                };
            options = {
                method: method,
                timeout: timeout,
                headers : headers,
                host: hostname,
                port: port,
                path: `${path}?${query}`,
                rejectUnauthorized: false
            };
        }
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
            reject('MICROSERVICE ERROR: ' + error);
        });
        request.on('timeout', () => {
            reject(MICROSERVICE_MESSAGE_TIMEOUT);
        });
        request.end();
    });
};


export {MICROSERVICE_RESOURCE_ID_STRING, microserviceUtilResourceIdNumberGet, microserviceUtilResourceIdStringGet, microserviceRouteMatch, microserviceUtilNumberValue, microserviceResultReturn, registryConfigServices, microserviceRequest, iamAuthenticateApp};