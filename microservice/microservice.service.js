/** @module microservice */

/**@type{import('../server/db/file.service.js')} */
const {file_get, file_get_log, file_append_log} = await import(`file://${process.cwd()}/server/db/file.service.js`);

const http = await import('node:http');
const https = await import('node:https');
const fs = await import('node:fs');

const CONFIG = await file_get('MICROSERVICE_CONFIG').then((/**@type{import('../types.js').db_file_result_file_get}*/file)=>file.file_content);
const CONFIG_SERVICES = await file_get('MICROSERVICE_SERVICES').then((/**@type{import('../types.js').db_file_result_file_get}*/file)=>file.file_content?file.file_content.SERVICES:null);

const timeout_message = '🗺⛔?';
const resource_id_string = ':RESOURCE_ID';
/**
 * Returns resource id number from URI path
 * if resource id not requested for a route using resource id and last part of path is string then return null
 * @param {string} uri_path
 * @returns {number|null}
 */
 const resource_id_get_number = uri_path => getNumberValue(uri_path.substring(uri_path.lastIndexOf('/') + 1));
/**
 * Returns resource id string from URI path
 * if resource id not requested for a route using resource id and last part of path is string then return null
 * @param {string} uri_path
 * @returns {string|null}
 */
 const resource_id_get_string = uri_path => uri_path.substring(uri_path.lastIndexOf('/') + 1);
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
 * @param {'GEOLOCATION'|'WORLDCITIES'|'MAIL'} service 
 * @returns {number}
 */
 const microservice_api_version = service =>{
    /**@type{import('../types.js').microservice_config_service_record} */
    const config_service = ConfigServices(service);
    return config_service.CONFIG.filter((/**@type{*}*/row)=>'APP_REST_API_VERSION' in row)[0].APP_REST_API_VERSION;
}; 
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
     * @param {boolean} server_app_timeout
     * @returns {Promise.<string>}
     */
    async MicroServiceCall(admin, path, query, method, client_ip, authorization, headers_user_agent, headers_accept_language, body, server_app_timeout){
        const service = (path?path.split('/')[1]:'').toUpperCase();
        if (!this.canRequest(service))
            return '';
        try {
            let timeout;
            if (server_app_timeout){
                //wait max 1 second when service called from SERVER_APP to speed up app start
                timeout = 1000;
            }
            else
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
 * @param {boolean} server_app_timeout
 */
const microserviceRequest = async (admin, path, query, method,client_ip,authorization, headers_user_agent, headers_accept_language, data, server_app_timeout) =>{
    return microservice_circuitbreak.MicroServiceCall(admin, path, query, method,client_ip,authorization, headers_user_agent, headers_accept_language, data, server_app_timeout);
}; 

/**
 * Get number value from request key
 * returns number or null for numbers
 * so undefined and '' are avoided sending arguement to service functions
 * @param {import('../types.js').req_id_number} param
 * @returns {number|null}
 */
 const getNumberValue = param => (param==null||param===undefined||param==='')?null:Number(param);

/**
 * 
 * @param {number} code 
 * @param {string|null} error 
 * @param {*} result 
 * @param {import('../types.js').res_microservice} res
 */
 const return_result = (code, error, result, res)=>{
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
 * Reads config services
 * @param {string} servicename
 * @returns {import('../types.js').microservice_config_service_record}
 */
const ConfigServices = (servicename) =>{
    return CONFIG_SERVICES.filter((/**@type{import('../types.js').microservice_config_service_record}*/service)=>service.NAME == servicename)[0];        
};

/**
 * 
 * @param {string} service 
 * @returns {Promise.<{ server:{createServer:function},
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
                    reject(JSON.parse(responseBody));
            });
        });
        if (method !='GET')
            request.write(JSON.stringify(body));
        request.on('error', error => {
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
    /**@type{import('../microservice/mail/service.js')} */
    const {sendEmail} = await import(`file://${process.cwd()}/microservice/mail/service.js`);
    return new Promise((resolve, reject) =>{
        /**
         * 
         * @param {number} file 
         * @param {object|null} message 
         * @param {*} result 
         * @returns {Promise.<void>}
         */
        const write_file = async (file, message, result) =>{
            file_append_log(file==0?'MESSAGE_QUEUE_ERROR':file==1?'MESSAGE_QUEUE_PUBLISH':file==2?'MESSAGE_QUEUE_CONSUME':'MESSAGE_QUEUE_ERROR', 
                            file==0?{message_id: new Date().toISOString(), message:   message, result:result}:message??{})
            .catch((/**@type{import('../types.js').error}*/error)=>{throw error;});
        };
        try {
            switch (message_type) {
                case 'PUBLISH': {
                    //message PUBLISH message in message_queue_publish.json
                    const new_message_id = new Date().toISOString();
                    /**@type{import('../types.js').microservice_message_queue_publish} */
                    const message_queue = {message_id: new_message_id, service: service, message:   message};
                    write_file(1, message_queue, null)
                    .then(()=>{
                        resolve (MessageQueue(service, 'CONSUME', null, new_message_id));
                    })
                    .catch((/**@type{import('../types.js').error}*/error)=>{
                        reject(error);
                    });
                    break;
                }
                case 'CONSUME': {
                    //message CONSUME
                    //direct microservice call
                    file_get_log('MESSAGE_QUEUE_PUBLISH')
                    .then((/**@type{import('../types.js').microservice_message_queue_publish[]}*/message_queue)=>{
                        /**@type{import('../types.js').microservice_message_queue_consume} */
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
                                sendEmail(message_consume.message)
                                .then((/**@type{object}*/result_sendEmail)=>{
                                    message_consume.finished = new Date().toISOString();
                                    message_consume.result = result_sendEmail;
                                    //write to message_queue_consume.json
                                    write_file(2, message_consume, result_sendEmail)
                                    .then(()=>{
                                        resolve (null);
                                    })
                                    .catch((/**@type{import('../types.js').error}*/error)=>{
                                        write_file(0, message_consume, error)
                                        .then(()=>{
                                            reject (error);
                                        })
                                        .catch(error=>{
                                            reject(error);
                                        });
                                    });
                                })
                                .catch((/**@type{import('../types.js').error}*/error)=>{
                                    write_file(0, message_consume, error)
                                    .then(()=>{
                                        reject (error);
                                    })
                                    .catch((/**@type{import('../types.js').error}*/error)=>{
                                        reject(error);
                                    });
                                });
                                break;
                            }
                        }
                    })
                    .catch((/**@type{import('../types.js').error}*/error)=>{
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
        } catch (/**@type{import('../types.js').error}*/error){
            write_file(0, message, error).then(()=>{
                reject(message);
            });
        }
    });
};
export {resource_id_string, resource_id_get_number, resource_id_get_string, route, microservice_api_version, getNumberValue, return_result, MicroServiceServer, CONFIG, ConfigServices, microserviceRequest, MessageQueue};