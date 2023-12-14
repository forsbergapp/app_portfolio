/** @module microservice */

// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

const http = await import('node:http');
const https = await import('node:https');
const {ConfigGet} = await import(`file://${process.cwd()}/server/config.service.js`);
const fs = await import('node:fs');

/**@type {Types.microservice_config_service[]|[]}*/
let MICROSERVICE = [];

let SLASH;
if (process.platform == 'win32')
    SLASH = '\\';
else
    SLASH = '/';

/**@type{Types.microservice_config} */
const CONFIG = {
    SERVER_CONFIG                       : `${SLASH}config${SLASH}config.json`,
    MICROSERVICE_CONFIG                 : `${SLASH}microservice${SLASH}config${SLASH}config.json`,
    MICROSERVICE_CONFIG_BATCH           : `${SLASH}microservice${SLASH}config${SLASH}config_batch.json`,
    MICROSERVICE_CONFIG_PDF             : `${SLASH}microservice${SLASH}config${SLASH}config_pdf.json`,
    MICROSERVICE_MESSAGE_QUEUE_ERROR    : `${SLASH}microservice${SLASH}logs${SLASH}message_queue_error.json`,
    MICROSERVICE_MESSAGE_QUEUE_PUBLISH  : `${SLASH}microservice${SLASH}logs${SLASH}message_queue_publish.json`,
    MICROSERVICE_MESSAGE_QUEUE_CONSUME  : `${SLASH}microservice${SLASH}logs${SLASH}message_queue_consume.json`,
    MICROSERVICE_PATH_BATCH             : `${SLASH}microservice${SLASH}batch${SLASH}`,
    MICROSERVICE_PATH_GEOLOCATION       : `${SLASH}microservice${SLASH}geolocation${SLASH}`,
    MICROSERVICE_PATH_MAIL              : `${SLASH}microservice${SLASH}mail${SLASH}`,
    MICROSERVICE_PATH_PDF               : `${SLASH}microservice${SLASH}pdf${SLASH}`,
    MICROSERVICE_PATH_WORLDCITIES       : `${SLASH}microservice${SLASH}worldcities${SLASH}`,
    MICROSERVICE_PATH_LOGS              : `${SLASH}microservice${SLASH}logs${SLASH}`,
    MICROSERVICE_PATH_TEMP              : `${SLASH}microservice${SLASH}temp${SLASH}`
};

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
/**
 * 
 * @param {*} parameter 
 * @returns 
 */
const ServerConfig = async (parameter) =>{
    let value=null;
    try {
        //fetch config parameters if config file exists
        const config = await fs.promises.readFile(`${process.cwd()}${CONFIG.SERVER_CONFIG}`, 'utf8');
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
 * Reads config file and saves in MICROSERVICE module variable for better performance
 * @returns {Promise.<void>}
 */
const MicroServiceConfig = async () => {
    const MICROSERVICE_JSON = await fs.promises.readFile(`${process.cwd()}${CONFIG.MICROSERVICE_CONFIG}`, 'utf8');
    MICROSERVICE =  JSON.parse(MICROSERVICE_JSON);
};
/**
 * Returns value for given parameter in CONFIG module variable
 * @param {Types.microservice_config_keys} config 
 * @returns {string}
 */
const MicroServiceConfigGet = config => CONFIG[config];
/**
 * 
 * @param {string} service 
 * @returns {Promise.<{ server:object,
 *                      port:number,
 *                      options?:object}>}
 */
const MicroServiceServer = async (service) =>{
    await MicroServiceConfig();
    const env_https_enabled = await ServerConfig('HTTPS_ENABLE');
    const env_key_path = await ServerConfig('HTTPS_KEY');
    const env_cert_path = await ServerConfig('HTTPS_CERT');
    
    if (env_https_enabled=='1')
        return {
            server  : https,
            port	: MICROSERVICE.filter(row=>row.SERVICE==service)[0].HTTPS_PORT,
            options : {
                key: env_key_path?await fs.promises.readFile(process.cwd() + env_key_path, 'utf8'):null,
                cert: env_key_path?await fs.promises.readFile(process.cwd() + env_cert_path, 'utf8'):null
            }
        };
    else
        return {
            server  : http,
            port 	: MICROSERVICE.filter(row=>row.SERVICE==service)[0].PORT
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
const MicroServiceRequest = async (service, path, method, timeout, client_ip, authorization, headers_user_agent, headers_accept_language, body) =>{
    return new Promise ((resolve, reject)=>{
        let headers;
        let options;
        let request_protocol;
        const hostname = 'localhost';
        let port;
        switch (service.toUpperCase()){
            //mail and pdf microservice use message queue and have no servers
            //batch microservice is not callable, only used to run batch jobs
            case 'GEOLOCATION':
            case 'WORLDCITIES':{
                if (ConfigGet('SERVER', 'HTTPS_ENABLE')=='1'){
                    request_protocol = https;
                    port = MICROSERVICE.filter(row=>row.SERVICE==service.toUpperCase())[0].HTTPS_PORT;
                }
                else{
                    request_protocol = http;
                    port = MICROSERVICE.filter(row=>row.SERVICE==service.toUpperCase())[0].PORT;
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
                    port = ConfigGet('SERVER', 'HTTP_PORT');
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
    async MicroServiceCall(app_id, path, service, method, client_ip, authorization, headers_user_agent, headers_accept_language, body){
        if (!this.canRequest(service))
            return '';
        try {
            let timeout;
            if (app_id == getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')))
                timeout = 60 * 1000 * ConfigGet('SERVER', 'SERVICE_CIRCUITBREAKER_REQUESTTIMEOUT_ADMIN');
            else
                timeout = this.requestTimetout * 1000;
            const response = await MicroServiceRequest (service, path, method, timeout, client_ip, authorization, headers_user_agent, headers_accept_language, body);
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
                        filename = CONFIG.MICROSERVICE_MESSAGE_QUEUE_ERROR;
                        json_message = JSON.stringify({'message_id': new Date().toISOString(), 'message':   message, 'result':result});
                        break;
                    }
                    case 1:{
                        filename = CONFIG.MICROSERVICE_MESSAGE_QUEUE_PUBLISH;
                        json_message = JSON.stringify(message);
                        break;
                    }
                    case 2:{
                        filename = CONFIG.MICROSERVICE_MESSAGE_QUEUE_CONSUME;
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
                    fs.promises.readFile(`${process.cwd()}${CONFIG.MICROSERVICE_MESSAGE_QUEUE_PUBLISH}`, 'utf8')
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
                                import(`file://${process.cwd()}/microservice/mail/mail.service.js`).then(({sendEmail})=>{
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
export {getNumberValue, MicroServiceConfig, MicroServiceConfigGet, MicroServiceServer, MICROSERVICE, CircuitBreaker, MessageQueue};