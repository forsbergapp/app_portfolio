const http = await import('node:http');
const https = await import('node:https');
const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);

const ServiceConfig = async (parameter) =>{
    const fs = await import('node:fs');
    const config = await fs.promises.readFile(`${process.cwd()}/config/config.json`, 'utf8');
    const rows =  JSON.parse(config).SERVER;
                                    
    const value = rows.filter(row=>Object.prototype.hasOwnProperty.call(row, parameter))[0][parameter];
    return value;
};

const MICROSERVICE = [
                        {'SERVICE':'GEOLOCATION', 'PORT':3001, 'HTTPS_KEY': await ServiceConfig('HTTPS_KEY'), 'HTTPS_CERT': await ServiceConfig('HTTPS_CERT')},
                        {'SERVICE':'WORLDCITIES', 'PORT':3002, 'HTTPS_KEY': await ServiceConfig('HTTPS_KEY'), 'HTTPS_CERT': await ServiceConfig('HTTPS_CERT')},
                        {'SERVICE':'BATCH',       'PORT':3003, 'HTTPS_KEY': await ServiceConfig('HTTPS_KEY'), 'HTTPS_CERT': await ServiceConfig('HTTPS_CERT')}
                     ];

const IAM = async (app_id, authorization) =>{
    const fs = await import('node:fs');
    const apps = await fs.promises.readFile(`${process.cwd()}/config/apps.json`, 'utf8');
    const rows =  await  JSON.parse(apps).APPS;
    const CLIENT_ID = rows.filter(row=>row.APP_ID == app_id)[0].CLIENT_ID;
    const CLIENT_SECRET = rows.filter(row=>row.APP_ID == app_id)[0].CLIENT_SECRET;

    const userpass = new Buffer.from((authorization || '').split(' ')[1] || '', 'base64').toString();
    if (userpass == CLIENT_ID + ':' + CLIENT_SECRET)
        return 1;
    else
        return 0;
};
                    
const service_request = async (service, path, method, timeout, client_ip, authorization, headers_user_agent, headers_accept_language, body) =>{
    return new Promise ((resolve, reject)=>{
        let headers;
        let options;
        let request_protocol;
        const hostname = 'localhost';
        let port;
        switch (service){
            case 'GEOLOCATION':{
                //always call microservices with https
                request_protocol = https;
                port = MICROSERVICE.filter(row=>row.SERVICE=='GEOLOCATION')[0].PORT;
                break;
            }
            case 'WORLDCITIES':{
                //always call microservices with https
                request_protocol = https;
                port = MICROSERVICE.filter(row=>row.SERVICE=='WORLDCITIES')[0].PORT;
                break;
            }
            default:{
                if (ConfigGet(1, 'SERVER', 'HTTPS_ENABLE')=='1'){
                    request_protocol = https;
                    port = ConfigGet(1, 'SERVER', 'HTTPS_PORT');
                }
                else{
                    request_protocol = http;
                    port = ConfigGet(1, 'SERVER', 'PORT');
                }   
                break;
            }
        }

        if (client_ip == null && headers_user_agent == null && headers_accept_language == null){    
            headers = {
                'User-Agent': 'server',
                'Accept-Language': '*',
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body),
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
                    'Content-Length': Buffer.byteLength(body),
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
            //for REPORT statucode 301 is returned, resolve the redirected path
            if (res.statusCode==301)
                resolve(service_request(hostname, res.headers.location, method, timeout, client_ip, authorization, headers_user_agent, headers_accept_language, body));
            else{
                res.setEncoding('UTF8');
                res.on('data', (chunk) =>{
                    responseBody += chunk;
                });
                res.on('end', ()=>{
                    if (res.statusCode == 200)
                        resolve (responseBody);
                    else
                        reject(responseBody);
                });
            }
            
        });
        if (method !='GET')
            request.write(body);
        request.on('timeout', () => {
            reject('timeout');
        });
        request.end();
    });
};
class CircuitBreaker {
    constructor() {
        this.states = {};
        this.failureThreshold = ConfigGet(1, 'SERVER', 'SERVICE_CIRCUITBREAKER_FAILURETHRESHOLD');
        this.cooldownPeriod = ConfigGet(1, 'SERVER', 'SERVICE_CIRCUITBREAKER_COOLDOWNPERIOD');
        this.requestTimetout = ConfigGet(1, 'SERVER', 'SERVICE_CIRCUITBREAKER_REQUESTTIMEOUT');
    }
    async callService(app_id, path, service, method, client_ip, authorization, headers_user_agent, headers_accept_language, body){
        if (!this.canRequest(service))
            return false;
        try {
            let timeout;
            if (app_id == ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'))
                timeout = 60 * 1000 * ConfigGet(1, 'SERVER', 'SERVICE_CIRCUITBREAKER_REQUESTTIMEOUT_ADMIN');
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
    onSuccess(service){
        this.initState(service);
    }
    onFailure(service){
        const state = this.states[service];
        state.failures +=1;
        if (state.failures > this.failureThreshold){
            state.circuit = 'OPEN';
            state.nexttry = new Date() / 1000 + this.cooldownPeriod;
        }
    }
    canRequest (service){
        if (!this.states[service]) this.initState(service);
        const state = this.states[service];
        if (state.circuit==='CLOSED') return true;
        const now = new Date() / 1000;
        if (state.nexttry <= now){
            state.circuit='HALF';
            return true;
        }
        return false;
    }
    initState(service){
        this.states[service]={
            failures: 0,
            cooldownPeriod: this.cooldownPeriod,
            circuit: 'CLOSED',
            nexttry: 0,
        };
    }
}

const MessageQueue = async (service, message_type, message, message_id) => {
    const fs = await import('node:fs');
    
    return new Promise((resolve, reject) =>{
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
                        resolve();
                });
            });
        };
        try {
            switch (message_type) {
                case 'PUBLISH': {
                    //message PUBLISH message in message_queue_publish.json
                    const message_id = new Date().toISOString();
                    const message_queue = {'message_id': message_id, service: service, message:   message};
                    write_file(1, message_queue, null)
                    .then(()=>{
                        resolve (MessageQueue(service, 'CONSUME', null, message_id));
                    })
                    .catch(error=>{
                        reject(error);
                    });
                    break;
                }
                case 'CONSUME': {
                    //message CONSUME
                    //direct microservice call
                    fs.promises.readFile(`${process.cwd()}/service/logs/message_queue_publish.json`, 'utf8')
                    .then((message_queue)=>{
                        let message_consume = null;
                        for (const row of message_queue.split('\r\n')){
                            const row_obj = JSON.parse(row);
                            if (row_obj.message_id == message_id){
                                message_consume = row_obj;
                                break;
                            }
                        }
                        switch (service){
                            case 'MAIL':{
                                message_consume.start = new Date().toISOString();
                                import(`file://${process.cwd()}/service/mail/mail.service.js`).then(({sendEmail})=>{
                                    sendEmail(message_consume.message)
                                    .then((result)=>{
                                        message_consume.finished = new Date().toISOString();
                                        message_consume.result = result;
                                        //write to message_queue_consume.json
                                        write_file(2, message_consume, result)
                                        .then(()=>{
                                            resolve ();
                                        })
                                        .catch(error=>{
                                            write_file(0, message_consume, error)
                                            .then(()=>{
                                                reject (error);
                                            })
                                            .catch(error=>{
                                                reject(error);
                                            });
                                        });
                                    })
                                    .catch((error)=>{
                                        write_file(0, message_consume, error)
                                        .then(()=>{
                                            reject (error);
                                        })
                                        .catch(error=>{
                                            reject(error);
                                        });
                                    });
                                });
                                break;
                            }
                            case 'PDF':{
                                message_consume.start = new Date().toISOString();
                                import(`file://${process.cwd()}/service/pdf/pdf.service.js`).then(({getPDF})=>{
                                    getPDF(message_consume.message).then((pdf)=>{
                                        message_consume.finished = new Date().toISOString();
                                        message_consume.result = 'PDF';
                                        //write to message_queue_consume.json
                                        write_file(2, message_consume, 'PDF')
                                        .then(()=>{
                                            resolve(pdf);
                                        })
                                        .catch(error=>{
                                            write_file(0, message_consume, error)
                                            .then(()=>{
                                                reject (error);
                                            })
                                            .catch(error=>{
                                                reject(error);
                                            });
                                        });
                                        
                                    })
                                    .catch(error=>{
                                        write_file(0, message_consume, error)
                                        .then(()=>{
                                            reject (error);
                                        })
                                        .catch(error=>{
                                            reject(error);
                                        });
                                    });
                                });
                                break;
                            }
                        }
                    })
                    .catch((error)=>{
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
        } catch (error) {
            write_file(0, message, error).then(()=>{
                reject(message);
            });
        }
    });
};
export {IAM, MICROSERVICE, CircuitBreaker, MessageQueue};