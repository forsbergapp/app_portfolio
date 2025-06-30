/** @module serviceregistry/microservice */

/**
 * @import {microservice_registry_service, server_db_document_ConfigServer,
 *          server_server_response, server_bff_endpoint_type, server_req_method} from '../server/types.js'
 */

const {registryConfigServices} = await import('./registry.js');
const { iamAuthenticateApp } = await import('../server/iam.js');
const {serverUtilNumberValue} = await import('../server/server.js');
const ConfigServer = await import('../server/db/ConfigServer.js');
const AppSecret = await import('../server/db/AppSecret.js');
const {registryMicroserviceApiVersion}= await import('./registry.js');
const {serverCircuitBreakerMicroService, serverRequest} = await import('../server/server.js');

const circuitBreaker = await serverCircuitBreakerMicroService();
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
 *          microservice:string, 
 *          service:string, 
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

    /**@type{server_db_document_ConfigServer} */
    const CONFIG_SERVER = ConfigServer.get({app_id:0}).result;
    
    /**@type{microservice_registry_service} */
    if ((parameters.microservice == 'GEOLOCATION' && serverUtilNumberValue(CONFIG_SERVER.SERVICE_IAM
                                                        .filter(parameter=>'ENABLE_GEOLOCATION' in parameter)[0].ENABLE_GEOLOCATION)==1)||
        parameters.microservice != 'GEOLOCATION'){
        
        
        //use app id, CLIENT_ID and CLIENT_SECRET for microservice IAM
        const authorization = `Basic ${Buffer.from(     AppSecret.get({app_id:parameters.app_id, resource_id:parameters.app_id}).result[0].client_id + ':' + 
                                                        AppSecret.get({app_id:parameters.app_id, resource_id:parameters.app_id}).result[0].client_secret,'utf-8').toString('base64')}`;
        //convert data object to string if method=GET, add always app_id parameter for authentication and send as base64 encoded
        const query = Buffer.from((parameters.method=='GET'?Object.entries({...parameters.data, ...{service:parameters.service}}).reduce((query, param)=>query += `${param[0]}=${param[1]}&`, ''):'')
                                    + `app_id=${parameters.app_id}`
                                ).toString('base64');
        const ServiceRegistry = await registryConfigServices(parameters.microservice);
        return await circuitBreaker.serverRequest( 
                        {
                            request_function:   serverRequest,
                            service:            parameters.microservice,
                            protocol:           ServiceRegistry.server_protocol,
                            url:                null,
                            host:               ServiceRegistry.server_host,
                            port:               ServiceRegistry.server_port,
                            admin:              parameters.app_id == serverUtilNumberValue(
                                                            ConfigServer.get({  app_id:parameters.app_id, 
                                                                                data:{  config_group:'SERVICE_APP', 
                                                                                        parameter:'APP_COMMON_APP_ID'}}).result
                                                        ),
                            path:               `/api/v${await registryMicroserviceApiVersion(parameters.microservice)}?${query}`,
                            body:               parameters.data,
                            method:             parameters.method,
                            client_ip:          parameters.ip,
                            user_agent:         parameters.user_agent,
                            accept_language:    parameters.accept_language,
                            authorization:      authorization,
                            encryption_type:    'MICROSERVICE',
                            'app-id':           parameters.app_id,
                            endpoint:           parameters.endpoint
                        })
                        .then((/**@type{*}*/result)=>{
                            return result.http?result:{result:JSON.parse(result), type:'JSON'};
                        })
                        .catch((/**@type{*}*/error)=>{
                            return {http:500, 
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

export {MICROSERVICE_RESOURCE_ID_STRING, microserviceUtilResourceIdNumberGet, microserviceUtilResourceIdStringGet, microserviceRequest, iamAuthenticateApp};