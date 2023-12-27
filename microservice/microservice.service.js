/** @module microservice */

// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

const http = await import('node:http');
const https = await import('node:https');
const fs = await import('node:fs');

const {file_get} = await import(`file://${process.cwd()}/server/db/file.service.js`);

const CONFIG = await file_get('MICROSERVICE_CONFIG').then((/**@type{Types.db_file_result_file_get}*/file)=>file.file_content);
const CONFIG_SERVICES = await file_get('MICROSERVICE_SERVICES').then((/**@type{Types.db_file_result_file_get}*/file)=>file.file_content?file.file_content.SERVICES:null);

const timeout_message = '🗺⛔?';

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
     * @param {string} service 
     * @param {string} method 
     * @param {string} client_ip 
     * @param {string} authorization 
     * @param {string} headers_user_agent 
     * @param {string} headers_accept_language 
     * @param {object} body 
     * @returns {Promise.<string>}
     */
    async MicroServiceCall(admin, path, service, method, client_ip, authorization, headers_user_agent, headers_accept_language, body){
        if (!this.canRequest(service))
            return '';
        try {
            let timeout;
            if (admin)
                timeout = 60 * 1000 * (CONFIG?CONFIG.CIRCUITBREAKER_REQUESTTIMEOUT_ADMIN_MINUTES:60);
            else
                timeout = this.requestTimetout * 1000;
            const response = await httpRequest (service, path, method, timeout, client_ip, authorization, headers_user_agent, headers_accept_language, body);
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
 * @param {string} service 
 * @param {string} method 
 * @param {string} client_ip 
 * @param {string} authorization 
 * @param {string} headers_user_agent 
 * @param {string} headers_accept_language 
 * @param {object} data 
 */
const microserviceRequest = async (admin, path,service, method,client_ip,authorization, headers_user_agent, headers_accept_language, data) =>{
    return microservice_circuitbreak.MicroServiceCall(admin, path,service, method,client_ip,authorization, headers_user_agent, headers_accept_language, data);
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
        res.write(error, 'utf8');
    }
    else{
        if (pdf){
            res.setHeader('Content-Type',  'application/pdf');
            res.send(pdf);
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
 * @param {string} method 
 * @param {number} timeout 
 * @param {string} client_ip 
 * @param {string} authorization 
 * @param {string} headers_user_agent 
 * @param {string} headers_accept_language 
 * @param {object} body 
 * @returns {Promise.<string>}
 */                    
const httpRequest = async (service, path, method, timeout, client_ip, authorization, headers_user_agent, headers_accept_language, body) =>{
    const request_protocol = ConfigServices(service.toUpperCase()).HTTPS_ENABLE ==1?https:http;
    const port = ConfigServices(service.toUpperCase()).HTTPS_ENABLE ==1?ConfigServices(service.toUpperCase()).HTTPS_PORT:ConfigServices(service.toUpperCase()).PORT;
    
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
                path: path,
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
                path: path,
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
                        filename = CONFIG?CONFIG.MESSAGE_QUEUE_ERROR:'';
                        json_message = JSON.stringify({'message_id': new Date().toISOString(), 'message':   message, 'result':result});
                        break;
                    }
                    case 1:{
                        filename = CONFIG?CONFIG.MESSAGE_QUEUE_PUBLISH:'';
                        json_message = JSON.stringify(message);
                        break;
                    }
                    case 2:{
                        filename = CONFIG?CONFIG.MESSAGE_QUEUE_CONSUME:'';
                        json_message = JSON.stringify(message);
                        break;
                    }
                }
                fs.appendFile(process.cwd() + filename, json_message + '\r\n', 'utf8', (err) => {
                    if (err) {
                        reject(err);
                    }
                    else
                        resolve(null);
                });
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
                    fs.promises.readFile(`${process.cwd()}${CONFIG?CONFIG.MESSAGE_QUEUE_PUBLISH:''}`, 'utf8')
                    .then((/**@type{string}*/message_queue)=>{
                        /**@type{Types.microservice_message_queue_consume} */
                        let message_consume = { message_id: null,
                                                service:    null,
                                                message:    null,
                                                start:      null,
                                                finished:   null,
                                                result:     null};
                        for (const row of message_queue.split('\r\n')){
                            /**@type{Types.microservice_message_queue_publish} */
                            const row_obj = JSON.parse(row);
                            if (row_obj.message_id == message_id){
                                message_consume = { message_id: row_obj.message_id,
                                                    service:    row_obj.service,
                                                    message:    row_obj.message,
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
export {getNumberValue, return_result, MicroServiceServer, CONFIG, ConfigServices, microserviceRequest, MessageQueue};