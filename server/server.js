/** 
 * @module server/server 
 */

/**
 * @import {server_req_method, server_server_response_type, 
 *          server_server_error, server_server_req, server_server_res,
 *          server_db_document_ConfigServer,
 *          server_db_table_ServiceRegistry,
 *          server_bff_endpoint_type,
 *          server_server_req_id_number} from './types.js'
 */

 /**
 *  Returns response to client
 *  @param {{app_id?:number|null,
 *           type:server_server_response_type,
 *           result:string,
 *           route:'APP'|'REST_API'|null,
 *           method?:server_req_method,
 *           statusMessage: string,
 *           statusCode: number,
 *           sse_message?:string,
 *           res:server_server_res}} parameters
 *  @returns {Promise.<void>}
 */
const serverResponse = async parameters =>{
    /**
     * Sets response type
     * @param {server_server_response_type} type
     */
    const setType = async type => {
        const ConfigServer = await import('./db/ConfigServer.js');
        /**@type{server_db_document_ConfigServer['SERVICE_APP']} */
        const CONFIG_SERVICE_APP = ConfigServer.get({app_id:parameters.app_id??0,data:{ config_group:'SERVICE_APP'}}).result;    
        const app_cache_control =       CONFIG_SERVICE_APP.filter(parameter=>parameter.APP_CACHE_CONTROL)[0].APP_CACHE_CONTROL;
        switch (type){
            case 'JSON':{
                if (app_cache_control !='')
                    parameters.res.setHeader('Cache-Control', app_cache_control);
                parameters.res.type('application/json; charset=utf-8');
                break;
            }
            case 'HTML':{
                if (app_cache_control !='')
                    parameters.res.setHeader('Cache-Control', app_cache_control);
                parameters.res.type('text/html; charset=utf-8');
                break;
            }
            default:{
                break;
            }
        }
    };
    /**
     * @param {string} response
     */
    const write = response =>{
        parameters.res.write(response, 'utf8');
    };

    if (parameters.sse_message){
        write(parameters.sse_message);
    }
    else{
        parameters.res.setHeader('Connection', 'Close');
        await setType(parameters.type);
        if (parameters.route=='APP' && parameters.res.statusCode==301){
            //result from APP can request to redirect
            parameters.res.redirect('/');
        }
        else{        
            if(parameters.type){
                parameters.res.setHeader('Cache-control', 'no-cache');
                parameters.res.setHeader('Access-Control-Max-Age', '0');
            }
            parameters.res.statusMessage = parameters.statusMessage;
            parameters.res.statusCode = parameters.statusCode;
    
            if (parameters.res.getHeader('Content-Type')==undefined)
                parameters.res.type('text/html; charset=utf-8');
            
            write(parameters.result);
            parameters.res.end();
        }
    }
    
};

/**
 * @name serverUtilNumberValue
 * @description Get number value from request key
 *              returns number or null for numbers
 *              so undefined and '' are avoided sending argument to service functions
 * @function
 * @param {server_server_req_id_number} param
 * @returns {number|null}
 */
 const serverUtilNumberValue = param => (param==null||param===undefined||param==='undefined'||param==='')?null:Number(param);

/**
 * @name serverUtilResponseTime
 * @description Calculate responsetime
 * @function
 * @param {server_server_res} res
 * @returns {number}
 */
const serverUtilResponseTime = (res) => {
    const diff = serverProcess.hrtime(res.getHeader('x-response-time'));
    return diff[0] * 1e3 + diff[1] * 1e-6;
};    

/**
 * @name serverUtilAppFilename
 * @description Returns filename/module used
 * @function
 * @param {string} module
 * @returns {string}
 */
const serverUtilAppFilename = module =>{
    
    const from_app_root = ('file://' + serverProcess.cwd()).length;
    return module.substring(from_app_root);
};
/**
 * @name serverUtilAppLine
 * @description Returns function row number from Error stack
 * @function
 * @returns {number}
 */
const serverUtilAppLine = () =>{
    /**@type {server_server_error} */
    const e = new Error() || '';
    const frame = e.stack.split('\n')[2];
    const lineNumber = frame.split(':').reverse()[1];
    return lineNumber;
};

/**
 * @name server
 * @description Server app using Express pattern
 * @param {server_server_req} req
 * @param {server_server_res} res
 * @returns {Promise.<*>}
 */
const server = async (req, res)=>{
    const ConfigServer = await import('./db/ConfigServer.js');
    const {securityUUIDCreate, securityRequestIdCreate, securityCorrelationIdCreate}= await import('./security.js');
   
    /**@type{server_db_document_ConfigServer} */
    const CONFIG_SERVER = ConfigServer.get({app_id:0}).result;
    const read_body = async () =>{
        return new Promise((resolve,reject)=>{
            if (req.headers['content-type'] =='application/json'){
                let body= '';
                /**@ts-ignore */
                req.on('data', chunk =>{
                    body += chunk.toString();
                });
                /**@ts-ignore */
                req.on('end', ()=>{
                    try {
                        req.body = JSON.parse(body);
                        resolve(null);
                    } catch (error) {
                        /**@ts-ignore */
                        req.body = {};
                        reject(null);
                    }
                    
                });
            }
            else{
                /**@ts-ignore */
                req.body = {};
                resolve(null);
            }
        });
        
    };
    await read_body().catch(()=>null);
    req.ip =            req.socket.remoteAddress ??'';
    req.hostname =      req.headers.host ??'';
    req.path =          req.url??'';
    req.originalUrl =   req.url;
    /**@ts-ignore */
    req.query =         req.path.indexOf('?')>-1?Array.from(new URLSearchParams(req.path
                        .substring(req.path.indexOf('?')+1)))
                        .reduce((query, param)=>{
                            const key = {[param[0]] : decodeURIComponent(param[1])};
                            return {...query, ...key};
                        }, {}):null;           
    res.type =          (/**@type{string}*/type)=>{
                            res.setHeader('Content-Type', type);
                        };

    res.redirect =      (/**@type{string}*/url) =>{
                            res.writeHead(301, {'Location':url});
                            res.end();
                        };

    //set headers
    res.setHeader('x-response-time', serverProcess.hrtime());
    req.headers['x-request-id'] =  securityUUIDCreate().replaceAll('-','');
    if (req.headers.authorization)
        req.headers['x-correlation-id'] = securityRequestIdCreate();
    else
        req.headers['x-correlation-id'] = securityCorrelationIdCreate(req.hostname +  req.ip + req.method);
    res.setHeader('Access-Control-Max-Age','5');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    
    if (CONFIG_SERVER.SERVICE_IAM.filter(row=>'CONTENT_SECURITY_POLICY_ENABLE' in row)[0].CONTENT_SECURITY_POLICY_ENABLE == '1'){
        res.setHeader('content-security-policy', CONFIG_SERVER.SERVICE_IAM.filter(row=>'CONTENT_SECURITY_POLICY' in row)[0].CONTENT_SECURITY_POLICY);
    }
    res.setHeader('cross-origin-opener-policy','same-origin');
    res.setHeader('cross-origin-resource-policy',	'same-origin');
    res.setHeader('referrer-policy', 'strict-origin-when-cross-origin');
    //res.setHeader('x-content-type-options', 'nosniff');
    res.setHeader('x-dns-prefetch-control', 'off');
    res.setHeader('x-download-options', 'noopen');
    res.setHeader('x-frame-options', 'SAMEORIGIN');
    res.setHeader('x-permitted-cross-domain-policies', 'none');
    res.setHeader('x-xss-protection', '0');

    const bff = await import('./bff.js');
    //Backend for frontend (BFF) start
    return bff.bff(req, res);
};


class ClassServerProcess {
    cwd = () => import.meta.dirname
                .replaceAll('\\','/')
                .replaceAll('/server','');

    uptime = () => process.uptime();
    memoryUsage = () => {
        return {rss:process.memoryUsage().rss,
                heapTotal:process.memoryUsage().heapTotal,
                heapUsed:process.memoryUsage().heapUsed,
                external:process.memoryUsage().external,
                arrayBuffers:process.memoryUsage().arrayBuffers
        };
    };
    /**
     * @param {*} [value]
     */
    hrtime = value => process.hrtime(value);
    /**
     * @param {string|symbol} event
     * @param {(...args: any[]) => void} listener
     */
    on = (event, listener) => process.on(event, listener);

    argv = process.argv;
    env = process.env;
    version = process.version;
}
const serverProcess = new ClassServerProcess();

/**
 * @name serverCircuitBreakerClass
 * @description Circuit breaker
 *              Uses circuit states CLOSED, HALF, OPEN
 *              Origin   Timeout
 *              server   1 second
 *              users    1 second * CONFIG.CIRCUITBREAKER_REQUESTTIMEOUT_SECONDS or default 20 seconds
 *              admin    1 minute * CONFIG.CIRCUITBREAKER_REQUESTTIMEOUT_ADMIN_MINUTES or default 60 minutes
 * 
 *              Failure threshold    CONFIG.CIRCUITBREAKER_FAILURETHRESHOLD_SECONDS or default 5 seconds
 *              Cooldown period      CONFIG.CIRCUITBREAKER_COOLDOWNPERIOD_SECONDS or default 10 seconds
 * @class
 */
class serverCircuitBreakerClass {
    /**
     * @param {import('./db/ConfigServer.js')} ConfigServer
     */
    constructor(ConfigServer) {
        /**@type{server_db_document_ConfigServer} */
        const CONFIG_SERVER = ConfigServer.get({app_id:0}).result;
        /**@type{[index:any][*]} */
        this.states = {};
                                                        
        this.requestTimeout =       CONFIG_SERVER.SERVER
                                    .filter(parameter=>'CIRCUITBREAKER_REQUESTTIMEOUT_SECONDS' in parameter)[0]
                                    .CIRCUITBREAKER_REQUESTTIMEOUT_SECONDS ?? 20;
        this.requestTimeoutAdmin =  CONFIG_SERVER.SERVER
                                    .filter(parameter=>'CIRCUITBREAKER_REQUESTTIMEOUT_ADMIN_MINUTES' in parameter)[0]
                                    .CIRCUITBREAKER_REQUESTTIMEOUT_ADMIN_MINUTES ?? 60;
        this.failureThreshold =     CONFIG_SERVER.SERVER
                                    .filter(parameter=>'CIRCUITBREAKER_FAILURETHRESHOLD_SECONDS' in parameter)[0]
                                    .CIRCUITBREAKER_FAILURETHRESHOLD_SECONDS ?? 5;
        this.cooldownPeriod =       CONFIG_SERVER.SERVER
                                    .filter(parameter=>'CIRCUITBREAKER_COOLDOWNPERIOD_SECONDS' in parameter)[0]
                                    .CIRCUITBREAKER_COOLDOWNPERIOD_SECONDS ?? 10;

    }
    /**
     * @name serverRequest
     * @description Request url
     * @method
     * @param {{request_function:function,
     *          service:string,
     *          admin:boolean,
     *          url:string|null,
     *          protocol:'http'|null,
     *          host:string|null,
     *          port:number|null,
     *          path:string|null,
     *          body:{}|null,
     *          method:string,
     *          client_ip:string,
     *          user_agent:string,
     *          accept_language:string,
     *          authorization:string|null,
     *          encryption_type:'BFE' | 'APP' | 'FONT'|'MICROSERVICE',
     *          'app-id':number,
     *          endpoint:server_bff_endpoint_type|null}} parameters
     * @returns {Promise.<string>}
     */
    async serverRequest(parameters){
        if (!this.canRequest(parameters.service))
            return '';
        try {
            let timeout;
            if (parameters.endpoint == 'SERVER'){
                //wait max 1 second when service called from SERVER to speed up app start
                timeout = 1000;
            }
            else
                if (parameters.admin)
                    timeout = 60 * 1000 * this.requestTimeoutAdmin;
                else
                    timeout = this.requestTimeout * 1000;
            const response = await parameters.request_function ({   service:parameters.service,
                                                                    protocol:parameters.protocol,
                                                                    url:parameters.url,
                                                                    host:parameters.host,
                                                                    port:parameters.port,
                                                                    path:parameters.path,
                                                                    body:parameters.body,
                                                                    method:parameters.method,
                                                                    client_ip:parameters.client_ip,
                                                                    user_agent:parameters.user_agent,
                                                                    accept_language:parameters.accept_language,
                                                                    authorization:parameters.authorization,
                                                                    encryption_type:parameters.encryption_type,
                                                                    'app-id':parameters['app-id'],
                                                                    timeout:timeout});
            this.onSuccess(parameters.service);
            return response;    
        } catch (error) {
            this.onFailure(parameters.service);
            throw error;
        }
    }
    /**
     * @name onSuccess
     * @description Circuitbreaker on success
     * @method
     * @param {string} service
     */
    onSuccess(service){
        this.initState(service);
    }
    /**
     * @name onFailure
     * @description Circuitbreaker on failure
     * @method
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
     * @name canRequest
     * @description Circuitbreaker can request
     * @method
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
     * @name initState
     * @description Circuitbreaker init
     * @method
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
 * @name serverCircuitBreakerMicroService
 * @description Circuitbreaker for MicroService
 * @function
 * @returns {Promise.<serverCircuitBreakerClass>}
 */
const serverCircuitBreakerMicroService = async ()=> new serverCircuitBreakerClass(await import('./db/ConfigServer.js'));

/**
 * @name serverCircuitBreakerBFE
 * @description Circuitbreaker for backend for external (BFE)
 * @function
 * @returns {Promise.<serverCircuitBreakerClass>}
 */
const serverCircuitBreakerBFE = async () => new serverCircuitBreakerClass(await import('./db/ConfigServer.js'));


/**
 * @name serverRequest
 * @description Request url, use parameter url or protocol, host, port and path
 *              Returns raw response from request
 * @function
 * @param {{service:'GEOLOCATION'|'BATCH'|'BFE',
 *          protocol:'http'|null,
 *          url:string|null,
 *          host:string|null,
 *          port:number|null,
 *          path:string|null,
 *          body:{}|null,
 *          method:string,
 *          client_ip:string,
 *          user_agent:string,
 *          accept_language:string,
 *          authorization:string|null,
 *          encryption_type:'BFE' | 'APP' | 'FONT'|'MICROSERVICE',
 *          'app-id':number,
 *          timeout:number}} parameters
 * @returns {Promise.<*>}
 */                    
const serverRequest = async parameters =>{
    const Security = await import('./security.js');
    const IamEncryption = await import('./db/IamEncryption.js');
    const ServiceRegistry = await import('./db/ServiceRegistry.js');
    const MESSAGE_TIMEOUT = '🗺⛔?';
    
    /**@type {'http'|string} */
    const protocol = parameters.protocol?.toLowerCase() ??'http';
    /**@type {import('node:http')} */
    const request_protocol = await import(`node:${protocol}`);
    
    //BFE uses url, microservice uses host, port and path
    const url_unencrypted = parameters.url?
                                //use path for BFE
                                parameters.url.split(protocol + '://' + parameters.url.split('/')[2])[1]:
                                    //use full url for microservice
                                    (protocol + '://' + parameters.host + ':' + parameters.port + parameters.path);

    //get new encryption parameters for BFE or existing for microservice in ServiceRegistry if using encryption
    const {uuid, secret} = (parameters.encryption_type=='BFE'?
                                {
                                    uuid:   Security.securityUUIDCreate(),
                                    secret: await Security.securityTransportCreateSecrets()
                                                .then(result=>Buffer.from(JSON.stringify(result),'utf-8').toString('base64'))
                                }:
                                    ServiceRegistry.get({   app_id:parameters['app-id'], 
                                                            resource_id:null, 
                                                            data:{name:parameters.service}}).result
                                    .map((/**@type{server_db_table_ServiceRegistry}*/row)=>{
                                        return {
                                            uuid:row.uuid,
                                            secret:row.secret
                                        };
                                    })[0]);
    //if BFE then save encryption record
    parameters.encryption_type=='BFE'?
        await IamEncryption.post(0, {   app_id:parameters['app-id'], 
                                        iam_app_id_token_id: null,
                                        url:url_unencrypted,
                                        uuid: uuid,
                                        type:parameters.encryption_type,
                                        secret: secret}):
            null;
    const url = (parameters.url?
                        //external url should be syntax [protocol]://[host + optional port]/[path]
                        //implements same path for external url
                        (protocol + '://' + parameters.url.split('/')[2] + '/bff/x/' + uuid):
                            (protocol + '://' + parameters.host + ':' + parameters.port + '/bff/x/' + uuid));

    /**@type{import('node:http').RequestOptions['headers'] & {'app-id'?:number, 'app-signature'?:string}} */
    const headers = {
        'User-Agent':       parameters.user_agent,
        'Accept-Language':  parameters.accept_language,
        'x-forwarded-for':  parameters.client_ip,
        ...(parameters.authorization && {Authorization: parameters.authorization}),
        ...(parameters.encryption_type=='BFE' && {'app-id':         parameters['app-id']}),
        ...(parameters.encryption_type=='BFE' && {'app-signature':  await Security.securityTransportEncrypt({
                                                                                                app_id:parameters['app-id'],
                                                                                                jwk:JSON.parse(atob(secret)).jwk,
                                                                                                iv:JSON.parse(atob(secret)).iv,
                                                                                                data:JSON.stringify({app_id: parameters['app-id'] })})})
    };
    
    const body =    JSON.stringify({
                            x: await Security.securityTransportEncrypt({
                                app_id:parameters['app-id'],
                                jwk:JSON.parse(atob(secret)).jwk,
                                iv: JSON.parse(atob(secret)).iv,
                                data:JSON.stringify({  
                                        headers:headers,
                                        method: parameters.method,
                                        url:    url_unencrypted,
                                        ...(parameters.method!='GET' && {body:  parameters.body?
                                            JSON.stringify(parameters.body):
                                                ''})
                                    })
                                })
                        });
    /**@type{import('node:http').RequestOptions}*/    
    const options = {
                        family: 4,
                        method: 'POST',
                        timeout: parameters.timeout,
                        headers:{
                                    'Content-Type':  'application/json',
                                    'Connection':   'close'
                                },
                    };
            
    return new Promise ((resolve, reject)=>{
        /**
         * @param {import('node:http').IncomingMessage} res
         * @returns {void}
         */
        const response = res =>{
            let responseBody = '';
            res.setEncoding('utf8');
            //no compression supported in server requests
            res.on('data', (/**@type{*}*/chunk) =>{
                responseBody += chunk;
            });
            res.on('end', ()=>{
                if ([200,201].includes(res.statusCode??0))
                    Security.securityTransportDecrypt({ 
                                    app_id:parameters['app-id'],
                                    encrypted:  responseBody,
                                    jwk:        JSON.parse(Buffer.from(secret, 'base64').toString('utf-8')).jwk,
                                    iv:         JSON.parse(Buffer.from(secret, 'base64').toString('utf-8')).iv
                                    }).then(result=>resolve(result));
                else
                    reject({   
                            http:res.statusCode,
                            code:'SERVER',
                            /**@ts-ignore */
                            text:null,
                            developerText:'serverRequest',
                            moreInfo:null,
                            type:'JSON'
                    });
            });
        };
        const request = request_protocol.request(new URL(url), options, response);
        //only method POST used, write body always
        request.write(body);
        request.on('error', error => {
            resolve({   
                        http:500,
                        code:'SERVER',
                        /**@ts-ignore */
                        text:error,
                        developerText:'serverRequest',
                        moreInfo:null,
                        type:'JSON'
            });
        });
        request.on('timeout', () => {
            resolve({
                http:503,
                code:'SERVER',
                text:MESSAGE_TIMEOUT,
                developerText:'serverRequest',
                moreInfo:null,
                type:'JSON'
            });
        });
        request.end();
    });
};
/**
 * @name serverStart
 * @description Server start
 *              Logs uncaughtException and unhandledRejection
 *              Start http server for users and admin
 * @function
 * @returns{Promise.<void>}
 */
const serverStart = async () =>{
    
    const Log = await import('./db/Log.js');
    const ConfigServer = await import('./db/ConfigServer.js');
    const Installation = await import('./installation.js');
    
    const ORM = await  import('./db/ORM.js');

    const http = await import('node:http');

    serverProcess.env.TZ = 'UTC';
    serverProcess.on('uncaughtException', err =>{
        console.log(err);
        Log.post({   app_id:0, 
            data:{  object:'LogServerError', 
                    log:'Process uncaughtException: ' + err.stack
                }
            });
    });
    serverProcess.on('unhandledRejection', (/**@type{*}*/reason) =>{
        console.log(reason?.stack ?? reason?.message ?? reason ?? new Error().stack);
        Log.post({   app_id:0, 
            data:{  object:'LogServerError', 
                    log:'Process unhandledRejection: ' + reason?.stack ?? reason?.message ?? reason ?? new Error().stack
                }
            });
    });
    try {       
        const result_data = await ORM.getFsDataExists();
        if (result_data==false)
            await Installation.postConfigDefault();
        await ORM.Init();
        /**@type{server_db_document_ConfigServer} */
        const configServer = ConfigServer.get({app_id:0}).result;

        const common = await import ('../apps/common/src/common.js');
        //common font css contain many font urls, return css file with each url replaced with a secure url
        //and save encryption data for all records directly in table at start to speed up performance
        await ORM.postAdmin('IamEncryption', common.commonCssFonts.db_records);

        if (configServer.SERVICE_IAM.filter(parameter=> 'SERVER_UPDATE_SECRETS_START' in parameter)[0].SERVER_UPDATE_SECRETS_START=='1')
            await Installation.updateConfigSecrets();

        const {socketIntervalCheck} = await import('./socket.js');
        socketIntervalCheck();
                                            
        const NETWORK_INTERFACE = configServer.SERVER.filter(parameter=> 'NETWORK_INTERFACE' in parameter)[0].NETWORK_INTERFACE;
        //START HTTP SERVER                                                     
        http.createServer((req,res)=>server(
                                            /**@ts-ignore*/
                                            req,
                                            res))
            .listen(serverUtilNumberValue(configServer.SERVER.filter(parameter=> 'HTTP_PORT' in parameter)[0].HTTP_PORT)??80, NETWORK_INTERFACE, () => {
            Log.post({   app_id:0, 
                data:{  object:'LogServerInfo', 
                        log:'HTTP Server PORT: ' + serverUtilNumberValue(configServer.SERVER.filter(parameter=> 'HTTP_PORT' in parameter)[0].HTTP_PORT)??80
                    }
                });
        });
        http.createServer((req,res)=>server(
                                            /**@ts-ignore*/
                                            req,
                                            res)).listen(serverUtilNumberValue(configServer.SERVER.filter(parameter=> 'HTTP_PORT_ADMIN' in parameter)[0].HTTP_PORT_ADMIN)??5000, NETWORK_INTERFACE, () => {
            Log.post({   app_id:0, 
                data:{  object:'LogServerInfo', 
                        log:'HTTP Server Admin  PORT: ' + serverUtilNumberValue(configServer.SERVER.filter(parameter=> 'HTTP_PORT_ADMIN' in parameter)[0].HTTP_PORT_ADMIN)??5000
                    }
                });
        });
        //create dummy default https listener that will be destroyed or browser might hang
        const net = await import('node:net');
        net.createServer(socket => socket.destroy()).listen(443, () => null);

    } catch (/**@type{server_server_error}*/error) {
        Log.post({   app_id:0, 
            data:{  object:'LogServerError', 
                    log:'serverStart: ' + error.stack
                }
            });
    }
    
};
export {serverResponse, 
        serverUtilNumberValue, serverUtilResponseTime, serverUtilAppFilename,serverUtilAppLine , 
        serverProcess,
        serverCircuitBreakerMicroService,
        serverCircuitBreakerBFE,
        serverRequest,
        serverStart,};