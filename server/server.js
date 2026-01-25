/** 
 * @module server/server 
 */

/**
 * @import {server} from './types.js'
 */

const http = await import('node:http');
const net = await import('node:net');
/**
 * @name serverClass
 * @description server class, uses Dependency Injection pattern
 * @class
 */
class serverClass {
    
    constructor(){
        this.CONTENT_TYPE_JSON = 'application/json; charset=utf-8';	
		this.CONTENT_TYPE_HTML = 'text/html; charset=utf-8';	
		this.CONTENT_TYPE_SSE = 'text/event-stream; charset=utf-8';
        /**@type{*} */
        this.server_app = {};
        /**@type{*} */
		this.server_admin = {};
        /**@type{*} */
        this.server_dummy = {}
        /** @type {import('./bff.js')}*/
        this.bff;
        /**@type {import('./iam.js')}*/
        this.iam;
        /**@type {import('./installation.js')}*/
        this.installation;
        /**@type {import('./security.js')}*/
        this.security;
        /**@type {import('./socket.js')}*/
        this.socket;
        /**@type {import('../apps/common/src/common.js')}*/
        this.app_common;
        /**@type{{css:string, db_records:server['ORM']['Object']['IamEncryption'][]}}*/
        this.commonCssFonts;
        /**@type{import('./db/ORM.js')['ORM']}*/
        this.ORM;
        /**
         * @name serverCircuitBreakerMicroService
         * @description Circuitbreaker for MicroService
         * @type{serverCircuitBreakerClass}
         */
        this.serverCircuitBreakerMicroService;

        /**
         * @name serverCircuitBreakerBFE
         * @description Circuitbreaker for backend for external (BFE)
         * @type{serverCircuitBreakerClass}
         */
        this.serverCircuitBreakerBFE;
        this.init = this.InitAsync;
    }
    /**
     * @name InitAsync
     * @description Server init
     * @method
     * @param {import('./db/ORM.js')['ORM']} ORM
     * @returns {Promise.<*>}
     */
    InitAsync = async (ORM)=>{
        this.ORM = ORM;
        this.bff = await import('./bff.js');
        this.iam = await import('./iam.js');
        this.installation = await import('./installation.js');
        this.security = await import('./security.js');
        this.socket   = await import('./socket.js');
        this.app_common = await import('../apps/common/src/common.js');
    };
    /**
     * @name request
     * @description Server app using Express pattern
     * @method
     * @param {server['server']['req']} req
     * @param {server['server']['res']} res
     * @returns {Promise.<*>}
     */
    request = async (req, res)=>{
        res.on('close',()=>{
            if (server.iam.iamObserveLimitReached(req.socket.remoteAddress?.replace('::ffff:',''))){
                //do not log blocked ip that could cause unwanted logs
                res.statusMessage = '';
                res.end();
            }
            else
                //SSE response time will be time connected until disconnected
                server.ORM.db.Log.post({  app_id:0, 
                    data:{  object:'LogRequestInfo', 
                            request:{   Host:req.headers.host,
                                        Ip:req.socket.remoteAddress,
                                        RequestId: RequestData.Id,
                                        CorrelationId:RequestData.CorrelationId,
                                        Url:req.url,
                                        HttpInfo:req.httpVersion,
                                        Method:req.method,
                                        StatusCode:res.statusCode,
                                        StatusMessage:typeof res.statusMessage == 'string'?res.statusMessage:JSON.stringify(res.statusMessage)??'',
                                        UserAgent:req.headers['user-agent'],
                                        AcceptLanguage:req.headers['accept-language'],
                                        Referer:req.headers.referer,
                                        SizeReceived:req.socket.bytesRead,
                                        SizeSent:req.socket.bytesWritten,
                                        ResponseTime:Date.now() - RequestData.RequestStart,
                                        XAppId:RequestData.XAppId,
                                        XAppIdAuth:RequestData.XAppIdAuth,
                                        XUrl:RequestData.XUrl,
                                        XMethod:RequestData.XMethod,
                                        Req:null
                                    },
                            log:''
                        }
                    }).then(() => {
                        // do not return any StatusMessage to client, this is only used for logging purpose
                        res.statusMessage = '';
                        res.end();
                    });
        });
        const read_body = async () =>{
            return new Promise((resolve,reject)=>{
                if (req.headers['content-type'] ==this.CONTENT_TYPE_JSON){
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
        /**
         * @type {{ Id:string,
         *          CorrelationId:string,
         *          RequestStart:number,
         *          XAppId:server['ORM']['Object']['App']['Id']|null,
         *          XAppIdAuth:server['ORM']['Object']['App']['Id']|null,
         *          XUrl:server['server']['req']['url']|null,
         *          XMethod:server['server']['req']['method']|null}}
         */
        const RequestData = { 
                                Id:             this.security.securityRequestIdCreate(),
                                CorrelationId:  this.security.securityCorrelationIdCreate(  req.headers.host ??'' +  
                                                                                            req.socket.remoteAddress + 
                                                                                            req.method),
                                RequestStart:   Date.now(),
                                XAppId:         null,
                                XAppIdAuth:     null,
                                XUrl:           null,
                                XMethod:        null
                            };
        await read_body().catch(()=>null);
        req.path =          req.url??'';
        /**@ts-ignore */
        req.query =         req.path.indexOf('?')>-1?Array.from(new URLSearchParams(req.path
                            .substring(req.path.indexOf('?')+1)))
                            .reduce((query, param)=>{
                                const key = {[param[0]] : param[1]};
                                return {...query, ...key};
                            }, {}):null;
        if (server.ORM.OpenApiComponentParameters.config.IAM_CONTENT_SECURITY_POLICY_ENABLE.default == '1'){
            res.setHeader('content-security-policy', server.ORM.OpenApiComponentParameters.config.IAM_CONTENT_SECURITY_POLICY.default);
        }
        
        //Backend for frontend (BFF) start
        return this.bff.bff(req, res, RequestData);            
    };
    /**
     * @name response
     * @description Returns response to client
     * @param {{app_id?:number|null,
     *          type:server['server']['response']['type'],
     *          result:string,
     *          route:'APP'|'REST_API'|null,
     *          statusMessage: string,
     *          statusCode: number,
     *          sse_message?:string,
     *          res:server['server']['res']}} parameters
     * @method
     * @returns {Promise.<void>}
     */
    response = async parameters =>{
        /**
         * Sets response type
         * @param {server['server']['response']['type']} type
         */
        const setType = async type => {
            const app_cache_control =  server.ORM.OpenApiComponentParameters.config.APP_CACHE_CONTROL.default;
            switch (type){
                case 'JSON':{
                    if (app_cache_control !='')
                        parameters.res.setHeader('Cache-Control', app_cache_control);
                    parameters.res.setHeader('Content-Type', this.CONTENT_TYPE_JSON);
                    break;
                }
                case 'HTML':{
                    if (app_cache_control !='')
                        parameters.res.setHeader('Cache-Control', app_cache_control);
                    parameters.res.setHeader('Content-Type', this.CONTENT_TYPE_HTML);
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
            if(parameters.type){
                parameters.res.setHeader('Cache-control', 'no-cache');
                parameters.res.setHeader('Access-Control-Max-Age', '0');
            }
            parameters.res.statusMessage = parameters.statusMessage;
            parameters.res.statusCode = parameters.statusCode;
    
            if (parameters.res.getHeader('Content-Type')==undefined)
                parameters.res.setHeader('Content-Type', this.CONTENT_TYPE_HTML);
            
            write(parameters.result);
            parameters.res.end();
        }
    };
    /**
     * @name serverRequest
     * @description Request url, use parameter url or protocol, host, port and path
     *              Returns raw response from request
     * @method
     * @param {{service:'BATCH'|'BFE',
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
    serverRequest = async parameters =>{
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
                                        uuid:   this.security.securityUUIDCreate(),
                                        secret: await this.security.securityTransportCreateSecrets()
                                                    .then(result=>Buffer.from(JSON.stringify(result),'utf-8').toString('base64'))
                                    }:
                                        this.ORM.db.ServiceRegistry.get({ app_id:parameters['app-id'], 
                                                                            resource_id:null, 
                                                                            data:{name:parameters.service}}).result
                                        .map((/**@type{server['ORM']['Object']['ServiceRegistry']}*/row)=>{
                                            return {
                                                uuid:row.Uuid,
                                                secret:row.Secret
                                            };
                                        })[0]);
        //if BFE then save encryption record
        parameters.encryption_type=='BFE'?
            await this.ORM.db.IamEncryption.post(0, { AppId:parameters['app-id'], 
                                                        IamAppIdTokenId: null,
                                                        Url:url_unencrypted,
                                                        Uuid: uuid,
                                                        Type:parameters.encryption_type,
                                                        Secret: secret}):
                null;
        const basePathRESTAPI = server.ORM.db.OpenApi.get({app_id:0}).result.servers.filter((/**@type{server['ORM']['Object']['OpenApi']['servers'][0]}*/server)=>server['x-type'].default=='REST_API')[0].variables.basePath.default;
        const url = (parameters.url?
                            //external url should be syntax [protocol]://[host + optional port]/[path]
                            //implements same path for external url
                            (protocol + '://' + parameters.url.split('/')[2] + basePathRESTAPI + uuid):
                                (protocol + '://' + parameters.host + ':' + parameters.port + basePathRESTAPI + uuid));

        /**@type{import('node:http').RequestOptions['headers'] & {'app-id'?:number, 'app-signature'?:string}} */
        const headers = {
            'User-Agent':       parameters.user_agent,
            'Accept-Language':  parameters.accept_language,
            'x-forwarded-for':  parameters.client_ip,
            ...(parameters.authorization && {Authorization: parameters.authorization}),
            ...(parameters.encryption_type=='BFE' && {'app-id':         parameters['app-id']}),
            ...(parameters.encryption_type=='BFE' && {'app-signature':  this.security.securityTransportEncrypt({
                                                                                                    app_id:parameters['app-id'],
                                                                                                    jwk:JSON.parse(atob(secret)).jwk,
                                                                                                    iv:JSON.parse(atob(secret)).iv,
                                                                                                    data:JSON.stringify({app_id: parameters['app-id'] })})})
        };
        
        const body =    JSON.stringify({
                                x: this.security.securityTransportEncrypt({
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
                                        'Content-Type':  this.CONTENT_TYPE_JSON,
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
                        resolve(this.security.securityTransportDecrypt({ 
                                        app_id:parameters['app-id'],
                                        encrypted:  responseBody,
                                        jwk:        JSON.parse(Buffer.from(secret, 'base64').toString('utf-8')).jwk,
                                        iv:         JSON.parse(Buffer.from(secret, 'base64').toString('utf-8')).iv
                                        }));
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
     * @name postServer
     * @description Post server
     * @method
     * @returns {void}
     */
    postServer = () =>{
        /**@type{string} */
        const NETWORK_INTERFACE = server.ORM.OpenApiComponentParameters.config.SERVER_NETWORK_INTERFACE.default;
        /**@type{string} */
        const PORT_APP = server.ORM.OpenApiServers.filter(row=>row['x-type'].default=='APP')[0].variables.port.default;
        /**@type{string} */
        const PORT_ADMIN = server.ORM.OpenApiServers.filter(row=>row['x-type'].default=='ADMIN')[0].variables.port.default;
        /**@type{string} */
        const PORT_DUMMY = server.ORM.OpenApiServers.filter(row=>row['x-type'].default=='NOHANGING_HTTPS')[0].variables.port.default;
        //Start http server and listener for apps
        this.server_app = http.createServer((req,res)=>server.request(
                                            /**@ts-ignore*/
                                            req,
                                            res))
            .listen(server.ORM.UtilNumberValue(PORT_APP)??80, NETWORK_INTERFACE, () => {
                server.ORM.db.Log.post({app_id:0, 
                                        data:{  object:'LogServerInfo', 
                                                log:'HTTP Server PORT: ' + (PORT_APP??80)
                                            }
                                        });
        });
        //Start http server and listener for admin
        this.server_admin = http.createServer((req,res)=>server.request(
                                            /**@ts-ignore*/
                                            req,
                                            res)).listen(server.ORM.UtilNumberValue(PORT_ADMIN)??3333, NETWORK_INTERFACE, () => {
            server.ORM.db.Log.post({app_id:0, 
                                    data:{  object:'LogServerInfo', 
                                            log:'HTTP Server Admin  PORT: ' + (server.ORM.UtilNumberValue(PORT_ADMIN)??3333)
                                        }
                                    });
        });
        //create dummy default https listener that will be destroyed or browser might hang
        this.server_dummy = net.createServer(socket => socket.destroy()).listen(server.ORM.UtilNumberValue(PORT_DUMMY)??443, () => null);
        
    }
    /**
     * @name updateServer
     * @description Updates server
     * @method
     * @returns {void}
     */
    updateServer = () =>{
        //changing port and NETWORK_INTERFACE, must use close()
        //restart app server, admin server and dummy net server for any change
        this.server_app.close();
        this.server_admin.close();
        this.server_dummy.close();
        this.postServer();
    }
    /**
     * @name UtilAppFilename
     * @description Returns filename/module used
     * @function
     * @param {string} module
     * @returns {string}
     */
    UtilAppFilename = module =>{
        const from_app_root = ('file://' + serverProcess.cwd()).length;
        return module.substring(from_app_root);
    };
    /**
     * @name UtilAppLine
     * @description Returns function row number from Error stack
     * @function
     * @returns {number}
     */
    UtilAppLine = () =>{
        /**@type {server['server']['error']} */
        const e = new Error() || '';
        const frame = e.stack.split('\n')[2];
        const lineNumber = frame.split(':').reverse()[1];
        return lineNumber;
    };    
}
const {serverProcess} = await import('./info.js');

/**
 * @type {serverClass}
 */
let server;

/**
 * @name serverCircuitBreakerClass
 * @description Circuit breaker
 *              Uses circuit states CLOSED, HALF, OPEN
 *              Origin   Timeout
 *              server   1 second
 *              users    1 second * CONFIG.SERVER_CIRCUITBREAKER_REQUESTTIMEOUT_SECONDS or default 20 seconds
 *              admin    1 minute * CONFIG.SERVER_CIRCUITBREAKER_REQUESTTIMEOUT_ADMIN_MINUTES or default 60 minutes
 * 
 *              Failure threshold    CONFIG.SERVER_CIRCUITBREAKER_FAILURETHRESHOLD_SECONDS or default 5 seconds
 *              Cooldown period      CONFIG.SERVER_CIRCUITBREAKER_COOLDOWNPERIOD_SECONDS or default 10 seconds
 * @class
 */
class serverCircuitBreakerClass {

    constructor() {
        /**@type{[index:any][*]} */
        this.states = {};
                                                        
        this.requestTimeout =       server.ORM.OpenApiComponentParameters.config.SERVER_CIRCUITBREAKER_REQUESTTIMEOUT_SECONDS.default ?? 20;
        this.requestTimeoutAdmin =  server.ORM.OpenApiComponentParameters.config.SERVER_CIRCUITBREAKER_REQUESTTIMEOUT_ADMIN_MINUTES.default ?? 60;
        this.failureThreshold =     server.ORM.OpenApiComponentParameters.config.SERVER_CIRCUITBREAKER_FAILURETHRESHOLD_SECONDS.default ?? 5;
        this.cooldownPeriod =       server.ORM.OpenApiComponentParameters.config.SERVER_CIRCUITBREAKER_COOLDOWNPERIOD_SECONDS.default ?? 10;

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
     *          endpoint:server['bff']['parameters']['endpoint']|null}} parameters
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
 * @name serverStart
 * @description Server start
 *              Logs uncaughtException and unhandledRejection
 *              Start http server for users and admin
 * @function
 * @returns{Promise.<void>}
 */
const serverStart = async () =>{
    serverProcess.env.TZ = 'UTC';
    try {
        //Create ORM and server instances
        server = new serverClass();
        const {ORM} = await import('./db/ORM.js');
        //Using Static Asynchronous Factory Method pattern in serverClass
        await server.init(ORM);
        //Using Static Asynchronous Factory Method pattern in ORM_class
        await ORM.init();       
        Object.seal(ORM);
        //Set server process events that need ORM started
        serverProcess.on('uncaughtException', err =>{
            console.log(err);
            server.ORM.db.Log.post({   app_id:0, 
                data:{  object:'LogServerError', 
                        log:'Process uncaughtException: ' + err.stack
                    }
                });
        });
        serverProcess.on('unhandledRejection', (/**@type{*}*/reason) =>{
            console.log(reason?.stack ?? reason?.message ?? reason ?? new Error().stack);
            server.ORM.db.Log.post({   app_id:0, 
                data:{  object:'LogServerError', 
                        log:'Process unhandledRejection: ' + (reason?.stack ?? reason?.message ?? reason ?? new Error().stack)
                    }
                });
        });
        //add objects that need ORM started
        server.serverCircuitBreakerMicroService = new serverCircuitBreakerClass();
        server.serverCircuitBreakerBFE = new serverCircuitBreakerClass();
        //CSS for REST API from app
        server.commonCssFonts = await server.app_common.commonCssFonts();
        Object.seal(server);

        //Startup functions
    
        //Update secrets
        if (server.ORM.OpenApiComponentParameters.config.IAM_SERVER_UPDATE_SECRETS_START.default=='1')
            await server.installation.updateConfigSecrets();

        //common font css contain many font urls, return css file with each url replaced with a secure url
        //and save encryption data for all records directly in table at start to speed up performance
        await server.ORM.postAdmin('IamEncryption', server.commonCssFonts.db_records);
    
        server.socket.socketIntervalCheck();
        server.postServer();

    } catch (/**@type{server['server']['error']}*/error) {
        server.ORM.db.Log.post({app_id:0, 
                                data:{  object:'LogServerError', 
                                        log:'serverStart: ' + error.stack
                                    }
                                });
    }
};

export {server,
        serverStart};