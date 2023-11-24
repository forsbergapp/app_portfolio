/** @module server/express/service */

// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

const http = await import('node:http');
const https = await import('node:https');
const {ConfigGet} = await import(`file://${process.cwd()}/server/config.service.js`);
const fs = await import('node:fs');


const timeout_message = '🗺⛔?';

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
 * @param {string} parameter 
 * @returns {Promise.<string|null>}
 */
const ServiceConfig = async (parameter) =>{
    let value=null;
    try {
        //fetch config parameters if config file exists
        const config = await fs.promises.readFile(`${process.cwd()}/config/config.json`, 'utf8');
        /**@type{[]} */
        const rows =  JSON.parse(config).SERVER;
        value = rows.filter(row=>Object.prototype.hasOwnProperty.call(row, parameter))[0][parameter];    
    } catch (error) {
        //config file still does not exists
        value = null;
    }
    return value;
};
/**
 * 
 * @param {string} service 
 * @returns {Promise.<{ server:object,
 *                      port:number,
 *                      options:object}>}
 */
const MicroserviceServer = async (service) =>{
    const env_https_enabled = await ServiceConfig('HTTPS_ENABLE');
    const env_key_path = await ServiceConfig('HTTPS_KEY');
    const env_cert_path = await ServiceConfig('HTTPS_CERT');
    let env_key = null;
    let env_cert = null;
    if (env_key_path){
        env_key = await fs.promises.readFile(process.cwd() + env_key_path, 'utf8');
        env_cert = await fs.promises.readFile(process.cwd() + env_cert_path, 'utf8');
    }
    const env_http_port = MICROSERVICE.filter(row=>row.SERVICE==service)[0].PORT;
    const env_https_port = MICROSERVICE.filter(row=>row.SERVICE==service)[0].HTTPS_PORT;
    
    const options = {
        key: env_key,
        cert: env_cert
    };
    if (env_https_enabled=='1')
        return {
            server  : https,
            port	: env_https_port,
            options : options
        };
    else
        return {
            server  : http,
            port 	: env_http_port,
            options : options
        };
};

const MICROSERVICE = [
                        {'SERVICE':'GEOLOCATION', 'PORT':3001, 'HTTPS_PORT': 4001 },
                        {'SERVICE':'WORLDCITIES', 'PORT':3002, 'HTTPS_PORT': 4002 },
                        {'SERVICE':'BATCH',       'PORT':3003, 'HTTPS_PORT': 4003 }
                     ];
/**
 * 
 * @param {number} app_id 
 * @param {string} authorization 
 * @returns {Promise.<boolean>}
 */
const IAM = async (app_id, authorization) =>{
    const apps = await fs.promises.readFile(`${process.cwd()}/config/apps.json`, 'utf8');
    /**@type{Types.config_apps[]} */
    const rows =  await  JSON.parse(apps).APPS;
    const CLIENT_ID = rows.filter(row=>row.APP_ID == app_id)[0].CLIENT_ID;
    const CLIENT_SECRET = rows.filter(row=>row.APP_ID == app_id)[0].CLIENT_SECRET;

    const userpass = Buffer.from((authorization || '').split(' ')[1] || '', 'base64').toString();
    if (userpass == CLIENT_ID + ':' + CLIENT_SECRET)
        return true;
    else
        return false;
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
const service_request = async (service, path, method, timeout, client_ip, authorization, headers_user_agent, headers_accept_language, body) =>{
    return new Promise ((resolve, reject)=>{
        let headers;
        let options;
        let request_protocol;
        const hostname = 'localhost';
        let port;
        switch (service){
            //mail and pdf microservice use message queue and have no servers
            //batch microservice is not callable, only used to run batch jobs
            case 'GEOLOCATION':{
                if (ConfigGet('SERVER', 'HTTPS_ENABLE')=='1'){
                    request_protocol = https;
                    port = MICROSERVICE.filter(row=>row.SERVICE=='GEOLOCATION')[0].HTTPS_PORT;
                }
                else{
                    request_protocol = http;
                    port = MICROSERVICE.filter(row=>row.SERVICE=='GEOLOCATION')[0].PORT;
                }
                break;
            }
            case 'WORLDCITIES':{
                if (ConfigGet('SERVER', 'HTTPS_ENABLE')=='1'){
                    request_protocol = https;
                    port = MICROSERVICE.filter(row=>row.SERVICE=='WORLDCITIES')[0].HTTPS_PORT;
                }
                else{
                    request_protocol = http;
                    port = MICROSERVICE.filter(row=>row.SERVICE=='WORLDCITIES')[0].PORT;
                }
                break;
            }
            default:{
                if (ConfigGet('SERVER', 'HTTPS_ENABLE')=='1'){
                    request_protocol = https;
                    port = ConfigGet('SERVER', 'HTTPS_PORT');
                }
                else{
                    request_protocol = http;
                    port = ConfigGet('SERVER', 'PORT');
                }   
                break;
            }
        }

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
class CircuitBreaker {
    constructor() {
        /**@type{[index:any][*]} */
        this.states = {};
        this.failureThreshold = ConfigGet('SERVER', 'SERVICE_CIRCUITBREAKER_FAILURETHRESHOLD');
        this.cooldownPeriod = ConfigGet('SERVER', 'SERVICE_CIRCUITBREAKER_COOLDOWNPERIOD');
        this.requestTimetout = ConfigGet('SERVER', 'SERVICE_CIRCUITBREAKER_REQUESTTIMEOUT');
    }
    /**
     * 
     * @param {number} app_id 
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
    async callService(app_id, path, service, method, client_ip, authorization, headers_user_agent, headers_accept_language, body){
        if (!this.canRequest(service))
            return '';
        try {
            let timeout;
            if (app_id == getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')))
                timeout = 60 * 1000 * ConfigGet('SERVER', 'SERVICE_CIRCUITBREAKER_REQUESTTIMEOUT_ADMIN');
            else
                timeout = this.requestTimetout * 1000;
            const response = await service_request (service, path, method, timeout, client_ip, authorization, headers_user_agent, headers_accept_language, body);
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
                        filename = '/service/logs/message_queue_error.json';
                        json_message = JSON.stringify({'message_id': new Date().toISOString(), 'message':   message, 'result':result});
                        break;
                    }
                    case 1:{
                        filename = '/service/logs/message_queue_publish.json';
                        json_message = JSON.stringify(message);
                        break;
                    }
                    case 2:{
                        filename = '/service/logs/message_queue_consume.json';
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
                    /**@type{Types.service_message_queue_publish} */
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
                    fs.promises.readFile(`${process.cwd()}/service/logs/message_queue_publish.json`, 'utf8')
                    .then((/**@type{string}*/message_queue)=>{
                        /**@type{Types.service_message_queue_consume} */
                        let message_consume = { message_id: null,
                                                service:    null,
                                                message:    null,
                                                start:      null,
                                                finished:   null,
                                                result:     null};
                        for (const row of message_queue.split('\r\n')){
                            /**@type{Types.service_message_queue_publish} */
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
                                import(`file://${process.cwd()}/service/mail/mail.service.js`).then(({sendEmail})=>{
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
                                import(`file://${process.cwd()}/service/pdf/pdf.service.js`).then(({getPDF})=>{
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
export {getNumberValue, IAM, MicroserviceServer, MICROSERVICE, CircuitBreaker, MessageQueue};