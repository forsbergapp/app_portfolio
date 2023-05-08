const https = await import('node:https');
const service_request = async (hostname, path, method, timeout, authorization, language, body) =>{
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
                'User-Agent': 'Server',
                'Accept-Language': language,
                'Authorization': authorization
            };
        else
            headers = {
                'User-Agent': 'Server',
                'Accept-Language': language,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body),
                'Authorization': authorization
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
        this.requestTimetout = 10;
    }
    async callService(hostname, path, service, method, authorization, language, body){
        if (!this.canRequest(service))
            return false;
        try {
            const response = await service_request (hostname, path, method, this.requestTimetout * 1000, authorization, language, body);
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
export {CircuitBreaker}