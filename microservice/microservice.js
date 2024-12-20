/** @module microservice/microservice */

/**
 * @import {server_server_req_id_number} from '../server/types.js'
 * @import {microservice_res} from './types.js'
 */

const http = await import('node:http');
const https = await import('node:https');

/**@type{import('./registry.js')} */
const {registryConfigServices} = await import(`file://${process.cwd()}/microservice/registry.js`);

/**@type{import('../server/iam.service.js')} */
const { iamAuthenticateApp } = await import(`file://${process.cwd()}/server/iam.service.js`);

const MICROSERVICE_MESSAGE_TIMEOUT = '🗺⛔?';
const MICROSERVICE_RESOURCE_ID_STRING = ':RESOURCE_ID';
/**
 * Returns resource id number from URI path
 * if resource id not requested for a route using resource id and last part of path is string then return null
 * @function
 * @param {string} uri_path
 * @returns {number|null}
 */
 const microserviceUtilResourceIdNumberGet = uri_path => microserviceUtilNumberValue(uri_path.substring(uri_path.lastIndexOf('/') + 1));
/**
 * Returns resource id string from URI path
 * if resource id not requested for a route using resource id and last part of path is string then return null
 * @function
 * @param {string} uri_path
 * @returns {string|null}
 */
 const microserviceUtilResourceIdStringGet = uri_path => uri_path.substring(uri_path.lastIndexOf('/') + 1);
/**
 * Route match
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
 * Request microservice using circuitbreaker
 * @function
 * @param {boolean} admin 
 * @param {string} path 
 * @param {string} query
 * @param {string} method 
 * @param {string} client_ip 
 * @param {string} authorization 
 * @param {string} headers_user_agent 
 * @param {string} headers_accept_language 
 * @param {object} data 
 * @param {boolean} server_app_timeout
 */
const microserviceRequest = async (admin, path, query, method,client_ip,authorization, headers_user_agent, headers_accept_language, data, server_app_timeout) =>{
    /**@type{import('./circuitbreaker.js')} */
    const {circuitBreaker} = await import(`file://${process.cwd()}/microservice/circuitbreaker.js`);

    return circuitBreaker.MicroServiceCall(microserviceHttpRequest, admin, path, query, method,client_ip,authorization, headers_user_agent, headers_accept_language, data, server_app_timeout);
}; 

/**
 * Get number value from request key
 * returns number or null for numbers
 * so undefined and '' are avoided sending arguement to service functions
 * @function
 * @param {server_server_req_id_number} param
 * @returns {number|null}
 */
 const microserviceUtilNumberValue = param => (param==null||param===undefined||param==='')?null:Number(param);

/**
 * Return result from microservice
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
 * Request microservice
 * @function
 * @param {string} service
 * @param {string|undefined} path
 * @param {string} query
 * @param {string} method 
 * @param {number} timeout 
 * @param {string} client_ip 
 * @param {string} authorization 
 * @param {string} headers_user_agent 
 * @param {string} headers_accept_language 
 * @param {object} body 
 * @returns {Promise.<string>}
 */                    
const microserviceHttpRequest = async (service, path, query, method, timeout, client_ip, authorization, headers_user_agent, headers_accept_language, body) =>{

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
                    'X-Forwarded-For': client_ip
                };
            else
                headers = {
                    'User-Agent': headers_user_agent,
                    'Accept-Language': headers_accept_language,
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(JSON.stringify(body)),
                    'Authorization': authorization,
                    'X-Forwarded-For': client_ip
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
                    resolve (responseBody);
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