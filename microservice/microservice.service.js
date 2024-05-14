/** @module microservice */

// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

const http = await import('node:http');
const https = await import('node:https');
const fs = await import('node:fs');

const {file_get, file_get_log, file_append_log} = await import(`file://${process.cwd()}/server/db/file.service.js`);

const CONFIG = await file_get('MICROSERVICE_CONFIG').then((/**@type{Types.db_file_result_file_get}*/file)=>file.file_content);
const CONFIG_SERVICES = await file_get('MICROSERVICE_SERVICES').then((/**@type{Types.db_file_result_file_get}*/file)=>file.file_content?file.file_content.SERVICES:null);

const timeout_message = '🗺⛔?';
const resource_id_string = ':RESOURCE_ID';
/**
 * Returns resource id from URI path
 * if resource id not requested for a route using resource id and last part of path is string then return null
 * @param {string} uri_path
 * @returns {number|string|null}
 */
 const resource_id_get = (uri_path) => isNaN(getNumberValue(uri_path.substring(uri_path.lastIndexOf('/') + 1))??0)?
                                            uri_path.substring(uri_path.lastIndexOf('/') + 1):
                                                getNumberValue(uri_path.substring(uri_path.lastIndexOf('/') + 1));
/**
 * 
 * @param {string} route_path
 * @param {string} route_method
 * @param {string} request_path
 * @param {string} request_method 
 * @returns {boolean}
 */
const route = (route_path, route_method, request_path , request_method) => 
 (route_path.indexOf('/:RESOURCE_ID')>-1?route_path. replace('/:RESOURCE_ID', request_path.substring(request_path.lastIndexOf('/'))):route_path) == request_path && 
  route_method == request_method;

/**
 * 
 * @param {'GEOLOCATION'|'WORLDCITIES'|'MAIL'|'PDF'} service 
 * @returns {number}
 */
 const microservice_api_version = service =>{
    /**@type{Types.microservice_config_service_record} */
    const config_service = ConfigServices(service)
    return config_service.CONFIG.filter((/**@type{*}*/row)=>'APP_REST_API_VERSION' in row)[0].APP_REST_API_VERSION;
} 
class CircuitBreaker {
    constructor() {
        /**@type{[index:any][*]} */
        this.states = {};
        this.failureThreshold = CONFIG?CONFIG.CIRCUITBREAKER_FAILURETHRESHOLD_SECONDS:5;
        this.cooldownPeriod = CONFIG?CONFIG.CIRCUITBREAKER_COOLDOWNPERIOD_SECONDS:10;
        this.requestTimetout = CONFIG?CONFIG.CIRCUITBREAKER_REQUESTTIMEOUT_SECONDS:20;
    }
    /**
     * 
     * @param {boolean} admin 
     * @param {string} path 
     * @param {string} query
     * @param {string} method 
     * @param {string} client_ip 
     * @param {string} authorization 
     * @param {string} headers_user_agent 
     * @param {string} headers_accept_language 
     * @param {object} body 
     * @returns {Promise.<string>}
     */
    async MicroServiceCall(admin, path, query, method, client_ip, authorization, headers_user_agent, headers_accept_language, body){
        const service = (path?path.split('/')[1]:'').toUpperCase();
        if (!this.canRequest(service))
            return '';
        try {
            let timeout;
            if (admin)
                timeout = 60 * 1000 * (CONFIG?CONFIG.CIRCUITBREAKER_REQUESTTIMEOUT_ADMIN_MINUTES:60);
            else
                timeout = this.requestTimetout * 1000;
            const response = await httpRequest (service, path, query, method, timeout, client_ip, authorization, headers_user_agent, headers_accept_language, body);
            this.onSuccess(service);
            return response;    
        } catch (error) {
            this.onFailure(service);
            throw error;
        }
    }
    /**
     * 
     * @param {string} service
     */
    onSuccess(service){
        this.initState(service);
    }
    /**
     * 
     * @param {string} service 
     */
    onFailure(service){
        const state = this.states[service];
        state.failures +=1;
        if (state.failures > this.failureThreshold){
            state.circuit = 'OPEN';
            state.nexttry = +new Date() / 1000 + this.cooldownPeriod;
        }
    }
    /**
     * 
     * @param {string} service
     * @returns 
     */
    canRequest (service){
        if (!this.states[service]) this.initState(service);
        const state = this.states[service];
        if (state.circuit==='CLOSED') return true;
        const now = +new Date() / 1000;
        if (state.nexttry <= now){
            state.circuit='HALF';
            return true;
        }
        return false;
    }
    /**
     * 
     * @param {string} service 
     */
    initState(service){
        this.states[service]={
            failures: 0,
            cooldownPeriod: this.cooldownPeriod,
            circuit: 'CLOSED',
            nexttry: 0,
        };
    }
}
const microservice_circuitbreak = new CircuitBreaker();
/**
 * 
 * @param {boolean} admin 
 * @param {string} path 
 * @param {string} query
 * @param {string} method 
 * @param {string} client_ip 
 * @param {string} authorization 
 * @param {string} headers_user_agent 
 * @param {string} headers_accept_language 
 * @param {object} data 
 */
const microserviceRequest = async (admin, path, query, method,client_ip,authorization, headers_user_agent, headers_accept_language, data) =>{
    return microservice_circuitbreak.MicroServiceCall(admin, path, query, method,client_ip,authorization, headers_user_agent, headers_accept_language, data);
}; 

/**
 * Get number value from request key
 * returns number or null for numbers
 * so undefined and '' are avoided sending arguement to service functions
 * @param {Types.req_id_number} param
 * @returns {number|null}
 */
 const getNumberValue = param => (param==null||param===undefined||param==='')?null:Number(param);

/**
 * 
 * @param {number} code 
 * @param {string|null} error 
 * @param {*} result 
 * @param {*} pdf
 * @param {Types.res_microservice} res
 */
 const return_result = (code, error, result, pdf, res)=>{
    res.statusCode = code;
    if (error){
        console.log(error);
        //ISO20022 error format
        const message = {"error":{
                            "http":code, 
                            "code":'MICROSERVICE',
                            "text":error, 
                            "developer_text":null, 
                            "more_info":null}};
        res.write(message, 'utf8');
    }
    else{
        if (pdf){
            res.setHeader('Content-Type',  'application/pdf');
            res.write(pdf);
        }
        else{
            res.setHeader('Content-Type',  'application/json; charset=utf-8');
            res.write(JSON.stringify(result), 'utf8');
        }
    }
    res.end();
};

/**
 * Reads config services
 * @param {string} servicename
 * @returns {Types.microservice_config_service_record}
 */
const ConfigServices = (servicename) =>{
    return CONFIG_SERVICES.filter((/**@type{Types.microservice_config_service_record}*/service)=>service.NAME == servicename)[0];        
};

/**
 * 
 * @param {string} service 
 * @returns {Promise.<{ server:object,
 *                      port:number,
 *                      options?:object}>}
 */
const MicroServiceServer = async (service) =>{
    const env_key_path = ConfigServices(service).HTTPS_KEY;
    const env_cert_path = ConfigServices(service).HTTPS_CERT;
    
    if (ConfigServices(service).HTTPS_ENABLE==1)
        return {
            server  : https,
            port	: ConfigServices(service).HTTPS_PORT,
            options : {
                key: env_key_path?await fs.promises.readFile(process.cwd() + env_key_path, 'utf8'):null,
                cert: env_key_path?await fs.promises.readFile(process.cwd() + env_cert_path, 'utf8'):null
            }
        };
    else
        return {
            server  : http,
            port 	: ConfigServices(service).PORT
        };
};

/**
 * 
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
const httpRequest = async (service, path, query, method, timeout, client_ip, authorization, headers_user_agent, headers_accept_language, body) =>{

    const request_protocol = ConfigServices(service).HTTPS_ENABLE ==1?https:http;
    const port = ConfigServices(service).HTTPS_ENABLE ==1?ConfigServices(service).HTTPS_PORT:ConfigServices(service).PORT;
    
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
                    reject(responseBody);
            });
        });
        if (method !='GET')
            request.write(JSON.stringify(body));
        request.on('error', (error) => {
            reject('MICROSERVICE ERROR: ' + error);
        });
        request.on('timeout', () => {
            reject(timeout_message);
        });
        request.end();
    });
};

/**
 * 
 * @param {string} service 
 * @param {string} message_type 
 * @param {object|null} message
 * @param {string} message_id 
 * @returns 
 */
const MessageQueue = async (service, message_type, message, message_id) => {
    return new Promise((resolve, reject) =>{
        /**
         * 
         * @param {number} file 
         * @param {object|null} message 
         * @param {*} result 
         * @returns {Promise.<null>}
         */
        const write_file = (file, message, result) =>{
            return new Promise((resolve, reject)=>{
                //add record:
                let json_message;
                let filename;
                switch (file){
                    case 0:{
                        filename = 'MESSAGE_QUEUE_ERROR';
                        json_message = {'message_id': new Date().toISOString(), 'message':   message, 'result':result};
                        break;
                    }
                    case 1:{
                        filename = 'MESSAGE_QUEUE_PUBLISH';
                        json_message = message;
                        break;
                    }
                    case 2:{
                        filename = 'MESSAGE_QUEUE_CONSUME';
                        json_message = message;
                        break;
                    }
                }
                file_append_log(filename, json_message)
                .then(()=>resolve(null))
                .catch((/**@type{Types.error}*/error)=>reject(error));
            });
        };
        try {
            switch (message_type) {
                case 'PUBLISH': {
                    //message PUBLISH message in message_queue_publish.json
                    const new_message_id = new Date().toISOString();
                    /**@type{Types.microservice_message_queue_publish} */
                    const message_queue = {message_id: new_message_id, service: service, message:   message};
                    write_file(1, message_queue, null)
                    .then(()=>{
                        resolve (MessageQueue(service, 'CONSUME', null, new_message_id));
                    })
                    .catch((/**@type{Types.error}*/error)=>{
                        reject(error);
                    });
                    break;
                }
                case 'CONSUME': {
                    //message CONSUME
                    //direct microservice call
                    file_get_log('MESSAGE_QUEUE_PUBLISH')
                    .then((/**@type{Types.microservice_message_queue_publish[]}*/message_queue)=>{
                        /**@type{Types.microservice_message_queue_consume} */
                        let message_consume = { message_id: null,
                                                service:    null,
                                                message:    null,
                                                start:      null,
                                                finished:   null,
                                                result:     null};
                        for (const row of message_queue){
                            if (row.message_id == message_id){
                                message_consume = { message_id: row.message_id,
                                                    service:    row.service,
                                                    message:    row.message,
                                                    start:      null,
                                                    finished:   null,
                                                    result:     null};
                                break;
                            }
                        }
                        switch (service){
                            case 'MAIL':{
                                message_consume.start = new Date().toISOString();
                                import(`file://${process.cwd()}/microservice/mail/service.js`).then(({sendEmail})=>{
                                    sendEmail(message_consume.message)
                                    .then((/**@type{object}*/result_sendEmail)=>{
                                        message_consume.finished = new Date().toISOString();
                                        message_consume.result = result_sendEmail;
                                        //write to message_queue_consume.json
                                        write_file(2, message_consume, result_sendEmail)
                                        .then(()=>{
                                            resolve (null);
                                        })
                                        .catch((/**@type{Types.error}*/error)=>{
                                            write_file(0, message_consume, error)
                                            .then(()=>{
                                                reject (error);
                                            })
                                            .catch(error=>{
                                                reject(error);
                                            });
                                        });
                                    })
                                    .catch((/**@type{Types.error}*/error)=>{
                                        write_file(0, message_consume, error)
                                        .then(()=>{
                                            reject (error);
                                        })
                                        .catch((/**@type{Types.error}*/error)=>{
                                            reject(error);
                                        });
                                    });
                                });
                                break;
                            }
                            case 'PDF':{
                                message_consume.start = new Date().toISOString();
                                import(`file://${process.cwd()}/microservice/pdf/service.js`).then(({getPDF})=>{
                                    getPDF(message_consume.message).then((/**@type{string}*/pdf)=>{
                                        message_consume.finished = new Date().toISOString();
                                        message_consume.result = 'PDF';
                                        //write to message_queue_consume.json
                                        write_file(2, message_consume, 'PDF')
                                        .then(()=>{
                                            resolve(pdf);
                                        })
                                        .catch((/**@type{Types.error}*/error)=>{
                                            write_file(0, message_consume, error)
                                            .then(()=>{
                                                reject (error);
                                            })
                                            .catch((/**@type{Types.error}*/error)=>{
                                                reject(error);
                                            });
                                        });
                                        
                                    })
                                    .catch((/**@type{Types.error}*/error)=>{
                                        write_file(0, message_consume, error)
                                        .then(()=>{
                                            reject (error);
                                        })
                                        .catch((/**@type{Types.error}*/error)=>{
                                            reject(error);
                                        });
                                    });
                                });
                                break;
                            }
                        }
                    })
                    .catch((/**@type{Types.error}*/error)=>{
                        write_file(0, message, error).then(()=>{
                            reject(message);
                        });
                    });
                    break;
                }
                default: {
                    //unknown message, add record:
                    write_file(0, message, '?').then(()=>{
                        reject(message);
                    });
                }
            }
        } catch (/**@type{Types.error}*/error){
            write_file(0, message, error).then(()=>{
                reject(message);
            });
        }
    });
};
export {resource_id_string, resource_id_get, route, microservice_api_version, getNumberValue, return_result, MicroServiceServer, CONFIG, ConfigServices, microserviceRequest, MessageQueue};