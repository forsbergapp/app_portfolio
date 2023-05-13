const https = await import('node:https');
const service_request = async (hostname, path, method, timeout, client_ip, authorization, headers_user_agent, headers_accept_language, body) =>{
    return new Promise ((resolve, reject)=>{
        //implement CLIENT_ID and CLIENT_SECRET so microservice can only be called from server
        //and not directly from apps
        //all requests with authorization header
        //GET
        // response can be HTML, PDF or JSON, let the app decide what to do with the response
        //POST, PUT, PATCH and DELETE always should use JSON in body
        //response should be JSON, return unparsed
        let headers;
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

        
        let request;
        const options = {
            method: method,
            timeout: timeout,
            headers : headers,
            path: path,
            host: hostname,
            rejectUnauthorized: false
        };
        request = https.request(options, res =>{
            let responseBody = '';
            //for REPORT statucode 301 is returned, resolve the redirected path
            if (res.statusCode==301)
                resolve(service_request(hostname, res.headers.location, method, timeout, client_ip, authorization, headers_user_agent, headers_accept_language, body));
            else{
                res.setEncoding('UTF8');
                res.on('data', (chunk) =>{
                    responseBody += chunk;
                })
                res.on('end', ()=>{
                    if (res.statusCode == 200)
                        resolve (responseBody);
                    else
                        reject(responseBody);
                });
            }
            
        })
        if (method !='GET')
            request.write(body);
        request.on('timeout', () => {
            reject('timeout');
        });
        request.end();
    })
}
class CircuitBreaker {
    constructor() {
        this.states = {};
        this.failureThreshold = 5;
        this.cooldownPeriod = 10;
        this.requestTimetout = 20;
    }
    async callService(hostname, path, service, method, client_ip, authorization, headers_user_agent, headers_accept_language, body){
        if (!this.canRequest(service))
            return false;
        try {
            const response = await service_request (hostname, path, method, this.requestTimetout * 1000, client_ip, authorization, headers_user_agent, headers_accept_language, body);
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
        }
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
                        json_message = JSON.stringify({"message_id": new Date().toISOString(), "message":   message, "result":result});
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
                        reject(err)
                    }
                    else
                        resolve();
                })
            })
        }
        try {
            switch (message_type) {
                case 'PUBLISH': {
                    //message PUBLISH message in message_queue_publish.json
                    let message_id = new Date().toISOString();
                    let message_queue = {"message_id": message_id, service: service, message:   message};
                    write_file(1, message_queue, null)
                    .then(()=>{
                        resolve (MessageQueue(service, 'CONSUME', null, message_id));
                    })
                    .catch(error=>{
                        reject(error);
                    })
                    break;
                }
                case 'CONSUME': {
                    //message CONSUME
                    //direct microservice call
                    fs.promises.readFile(`${process.cwd()}/service/logs/message_queue_publish.json`, 'utf8')
                    .then((message_queue)=>{
                        let message_consume = null;
                        for (let row of message_queue.split('\r\n')){
                            let row_obj = JSON.parse(row);
                            if (row_obj.message_id == message_id){
                                message_consume = row_obj;
                                break;
                            }
                        }
                        if (service === 'MAIL') {
                            import(`file://${process.cwd()}/service/mail/mail.service.js`).then(({ sendEmail })=>{
                                message_consume.start = new Date().toISOString();
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
                                        })
                                    })
                                })
                                .catch((error)=>{
                                    write_file(0, message_consume, error)
                                    .then(()=>{
                                        reject (error);
                                    })
                                    .catch(error=>{
                                        reject(error);
                                    })
                                })
                            });
                        }
                    })
                    .catch((error)=>{
                        write_file(0, message, error).then(()=>{
                            reject(message);
                        })
                    })
                    break;
                }
                default: {
                    //unknown message, add record:
                    write_file(0, message, '?').then(()=>{
                        reject(message);
                    })
                }
            }
        } catch (error) {
            write_file(0, message, error).then(()=>{
                reject(message);
            })
        }
    })
};

export {CircuitBreaker, MessageQueue}