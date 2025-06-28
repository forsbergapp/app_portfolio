/** 
 * @module server/server 
 */

/**
 * @import {server_req_method, server_server_response_type, 
 *          server_server_error, server_server_req, server_server_res,
 *          server_db_document_ConfigServer,
 *          server_bff_endpoint_type,
 *          server_server_req_id_number} from './types.js'
 */

/**
 *  Returns response to client
 *  Uses host parameter for errors in requests or unknown route paths
 *  Returns result using ISO20022 format
 *  Error
 *           http:          statusCode,
 *           code:          optional app Code,
 *           text:          error,
 *           developerText: optional text,
 *           moreInfo:      optionlal text
 *  Result
 *          Single resource format supported return types
 *             JSON, HTML, CSS, JS, WEBP, PNG, WOFF, TTF
 *             can be returned as result or using sendfile key with file path that validates path before returned
 * 
 *          Multiple resources in JSON format:
 *              list_header : {	total_count:	number of records,
 *                              offset: 		offset parameter or 0,
 *                              count:			limit parameter or number of records
 *                            }
 *              rows        : array of anything
 *          Pagination result
 *              page_header : {	total_count:	number of records or 0,
 *								offset: 		offset parameter or 0,
 *								count:			least number of limit parameter and number of records
 *                            }
 *              rows        : array of anything
 * 
 *  @param {{app_id?:number|null,
 *           result_request:{   http?:number|null,
 *                              code?:number|string|null,
 *                              text?:*,
 *                              developerText?:string|null,
 *                              moreInfo?:string|null,
 *                              result?:*,
 *                              sendfile?:string|null,
 *                              type:server_server_response_type,
 *                              singleResource?:boolean},
 *           host?:string|null,
 *           route:'APP'|'REST_API'|null,
 *           method?:server_req_method,
 *           decodedquery?:string|null,
 *           res:server_server_res}} parameters
 *  @returns {Promise.<void>}
 */
const serverResponse = async parameters =>{
    const ConfigServer = await import('./db/ConfigServer.js');
    /**@type{server_db_document_ConfigServer['SERVICE_APP']} */
    const CONFIG_SERVICE_APP = ConfigServer.get({app_id:parameters.app_id??0,data:{ config_group:'SERVICE_APP'}}).result;

    const common_app_id = serverUtilNumberValue(CONFIG_SERVICE_APP.filter(parameter=>parameter.APP_COMMON_APP_ID)[0].APP_COMMON_APP_ID) ?? 0;
    const admin_app_id = serverUtilNumberValue(CONFIG_SERVICE_APP.filter(parameter=>parameter.APP_ADMIN_APP_ID)[0].APP_ADMIN_APP_ID);
    /**
     * Sets response type
     * @param {server_server_response_type} type
     */
    const setType = type => {
        
        const app_cache_control =       CONFIG_SERVICE_APP.filter(parameter=>parameter.APP_CACHE_CONTROL)[0].APP_CACHE_CONTROL;
        const app_cache_control_font =  CONFIG_SERVICE_APP.filter(parameter=>parameter.APP_CACHE_CONTROL_FONT)[0].APP_CACHE_CONTROL_FONT;
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
            case 'CSS':{
                if (app_cache_control !='')
                    parameters.res.setHeader('Cache-Control', app_cache_control);
                parameters.res.type('text/css; charset=utf-8');
                break;
            }
            case 'JS':{
                if (app_cache_control !='')
                    parameters.res.setHeader('Cache-Control', app_cache_control);
                parameters.res.type('text/javascript; charset=utf-8');
                break;
            }
            case 'WEBP':{
                if (app_cache_control !='')
                    parameters.res.setHeader('Cache-Control', app_cache_control);
                parameters.res.type('image/webp; charset=utf-8');
                break;
            }
            case 'PNG':{
                if (app_cache_control !='')
                    parameters.res.setHeader('Cache-Control', app_cache_control);
                parameters.res.type('image/png; charset=utf-8');
                break;
            }
            case 'WOFF':{
                if (app_cache_control_font !='')
                    parameters.res.setHeader('Cache-Control', app_cache_control_font);
                parameters.res.type('font/woff; charset=utf-8');
                break;
            }
            case 'TTF':{
                if (app_cache_control_font !='')
                    parameters.res.setHeader('Cache-Control', app_cache_control_font);
                parameters.res.type('font/ttf; charset=utf-8');
                break;
            }
            default:{
                break;
            }
        }
    };
    if (parameters.result_request.http){
        
    
        //ISO20022 error format
        const message = {error:{
                                http:parameters.result_request.http, 
                                code:parameters.result_request.code, 
                                //return SERVER ERROR if status code starts with 5
                                text:(admin_app_id!=parameters.app_id && parameters.result_request.http.toString().startsWith('5'))?
                                        'SERVER ERROR':
                                            parameters.result_request.text?.code=='DB'?
                                                parameters.result_request.text.text:
                                                    parameters.result_request.text?.message?
                                                        parameters.result_request.text?.message:
                                                            parameters.result_request.text, 
                                developer_text:parameters.result_request.developerText, 
                                more_info:parameters.result_request.moreInfo}};
        //remove statusMessage or [ERR_INVALID_CHAR] might occur and is moved to inside message
        parameters.res.statusMessage = '';
        parameters.res.statusCode = parameters.result_request.http ?? 500;
        setType('JSON');
        parameters.res.send(JSON.stringify(message), 'utf8');
    }
    else{
        if (parameters.res.getHeader('Content-Type')?.startsWith('text/event-stream')){
            //For SSE so no more update of response
            null;
        }
        else{
            parameters.res.setHeader('Connection', 'Close');
            setType(parameters.result_request.type);
            if (parameters.route=='APP' && parameters.res.statusCode==301){
                //result from APP can request to redirect
                parameters.res.redirect('/');
            }
            else{
                if (parameters.method?.toUpperCase() == 'POST')
                    parameters.res.statusCode =201;
                else
                    parameters.res.statusCode =200;
                if (parameters.result_request?.sendfile){
                    const fs = await import('node:fs');
                    const Log = await import('./db/Log.js');
                    const  {iamUtilMessageNotAuthorized} = await import('./iam.js');
                    await fs.promises.access(parameters.result_request.sendfile)
                    .then(()=>{
                        parameters.res.sendFile(parameters.result_request.sendfile);
                    })
                    .catch(error=>{
                        Log.post({    app_id:parameters.app_id ?? common_app_id, 
                            data:{  object:'LogServiceInfo', 
                                    service:{service:parameters.result_request.code?.toString()??'',
                                            parameters:parameters.decodedquery??''
                                    },
                                    log:error
                                }
                            })
                        .then(result=>{if (result.http)
                            parameters.res.statusCode =400;
                            parameters.res.send(iamUtilMessageNotAuthorized(), 'utf8');
                        });
                    });
                }
                else{
                    if(parameters.result_request.type){
                        if (parameters.result_request?.type=='JSON'){
                            //set no cache for JSON
                            parameters.res.setHeader('Cache-control', 'no-cache');
                            parameters.res.setHeader('Access-Control-Max-Age', '0');
                            if (parameters.decodedquery && new URLSearchParams(parameters.decodedquery).get('fields')){
                                if (parameters.result_request.result[0]){
                                    //limit fields/keys in rows
                                    const limit_fields = parameters.result_request.result.map((/**@type{*}*/row)=>{
                                        const row_new = {};
                                        /**@ts-ignore */
                                        for (const field of new URLSearchParams(parameters.decodedquery).get('fields').split(',')){
                                            /**@ts-ignore */
                                            row_new[field] = row[field];
                                        }
                                        return row_new;
                                    });
                                    parameters.result_request.result = limit_fields;
                                }
                                else{
                                    //limit fields/keys in object
                                    const result_service_fields = {};
                                    /**@ts-ignore */
                                    for (const field of new URLSearchParams(parameters.decodedquery).get('fields').split(',')){
                                        /**@ts-ignore */
                                        result_service_fields[field] = parameters.result_request.result[field];
                                    }
                                    parameters.result_request.result = result_service_fields;
                                }
                            }
                            //records limit in controlled by server, apps can not set limits
                                                                          
                            const limit = serverUtilNumberValue(CONFIG_SERVICE_APP.filter(parameter=>parameter.APP_LIMIT_RECORDS)[0].APP_LIMIT_RECORDS??0);
                            if (parameters.result_request.singleResource)
                                //limit rows if single resource response contains rows
                                parameters.res.send(JSON.stringify((typeof parameters.result_request.result!='string' && parameters.result_request.result?.length>0)?
                                                                        parameters.result_request.result
                                                                        .filter((/**@type{*}*/row, /**@type{number}*/index)=>(limit??0)>0?
                                                                        (index+1)<=(limit??0)
                                                                            :true):
                                                                            parameters.result_request.result), 'utf8');
                            else{
                                
                                let result;
                                if (parameters.decodedquery && new URLSearchParams(parameters.decodedquery).has('offset')){
                                    const offset = serverUtilNumberValue(new URLSearchParams(parameters.decodedquery).get('offset'));
                                    //return pagination format
                                    result = {  
                                                page_header:
                                                    {	total_count:	parameters.result_request.result.length,
                                                        offset: 		offset??0,
                                                        count:			parameters.result_request.result
                                                                        .filter((/**@type{*}*/row, /**@type{number}*/index)=>(offset??0)>0?
                                                                                                                                (index+1)>=(offset??0):
                                                                                                                                    true)
                                                                        .filter((/**@type{*}*/row, /**@type{number}*/index)=>(limit??0)>0?
                                                                                                                                (index+1)<=(limit??0)
                                                                                                                                    :true).length
                                                    },
                                                rows:               parameters.result_request.result
                                                                    .filter((/**@type{*}*/row, /**@type{number}*/index)=>(offset??0)>0?
                                                                                                                            (index+1)>=(offset??0):
                                                                                                                                true)
                                                                    .filter((/**@type{*}*/row, /**@type{number}*/index)=>(limit??0)>0?
                                                                                                                            (index+1)<=(limit??0)
                                                                                                                                :true)
                                    };
                                }
                                else{
                                    //return list header format
                                    result = {  
                                                list_header:
                                                    {	
                                                        total_count:	parameters.result_request.result.length,
                                                        offset: 		0,
                                                        count:			Math.min(limit??0,parameters.result_request.result.length)
                                                    },
                                                rows:               (typeof parameters.result_request.result!='string' && parameters.result_request.result?.length>0)?
                                                                        parameters.result_request.result
                                                                        .filter((/**@type{*}*/row, /**@type{number}*/index)=>(limit??0)>0?
                                                                                                                                (index+1)<=(limit??0)
                                                                                                                                    :true):
                                                                            parameters.result_request.result
                                            };
                                }
                                parameters.res.send(JSON.stringify(result), 'utf8');    
                            }    
                        }
                        else
                            parameters.res.send(parameters.result_request.result, 'utf8');
                    }
                    else{
                        const  {iamUtilMessageNotAuthorized} = await import('./iam.js');
                        parameters.res.statusCode =500;
                        parameters.res.send(iamUtilMessageNotAuthorized(), 'utf8');
                    }
                }        
            }    
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
    const Log = await import('./db/Log.js');
    const ConfigServer = await import('./db/ConfigServer.js');
    const {securityUUIDCreate, securityRequestIdCreate, securityCorrelationIdCreate}= await import('./security.js');
    const {iamUtilMessageNotAuthorized} = await import('./iam.js');
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
    req.protocol =      req.socket.encrypted?'https':'http';
    req.ip =            req.socket.remoteAddress;
    req.hostname =      req.headers.host;
    req.path =          req.url;
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
    res.send =          async (/**@type{*}*/result) =>{
                            if (res.getHeader('Content-Type')==undefined)
                                res.type('text/html; charset=utf-8');
                            res.setHeader('Content-Encoding', 'gzip');
                            res.removeHeader('Content-Length');
                            /**
                             * @name compress
                             * @description compress all requests (SSE uses res.write)
                             * @param {*} data
                             */
                            const compress = async data =>{
                                const zlib = await import('node:zlib');
                                return new Promise(resolve=>{
                                    try {
                                        zlib.gzip(Buffer.from(data.toString(), 'utf8'), (err, compressed)=>{
                                            if (err)
                                                resolve(data);
                                            else
                                                resolve(compressed);
                                        });    
                                    } catch (error) {
                                        resolve(data);
                                    }
                                });
                            };
                            const compressed = await compress(result);
                            res.write(compressed, 'utf8');
                            res.end();
                        };
    res.sendFile =      async (/**@type{*}*/path) =>{
                            const fs = await import('node:fs');
                            const readStream = fs.createReadStream(path);
                            readStream.on ('error', streamErr =>{
                                streamErr;
                                res.writeHead(500);
                                res.end(iamUtilMessageNotAuthorized());
                            });
                            if (res.getHeader('Content-Type')?.startsWith('font')) 
                                /**@ts-ignore */
                                readStream.pipe(res);
                            else{
                                const zlib = await import('node:zlib');
                                const gzip = zlib.createGzip();
                                res.setHeader('Content-Encoding', 'gzip');
                                res.removeHeader('Content-Length');
                                
                                /**@ts-ignore */
                                readStream.pipe(gzip).pipe(res);
                            }
                            
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

    // check JSON maximum size, parameter uses megabytes (MB)
    if (req.body && JSON.stringify(req.body).length/1024/1024 > 
            (serverUtilNumberValue((CONFIG_SERVER.SERVER.filter(parameter=>parameter.JSON_LIMIT)[0].JSON_LIMIT ?? '0').replace('MB',''))??0)){
        //log error                                        
        Log.post({  app_id:0, 
                    data:{  object:'LogRequestError', 
                            request:{   req:req,
                                        responsetime:serverUtilResponseTime(res),
                                        statusCode:res.statusCode,
                                        statusMessage:res.statusMessage
                                    },
                            log:'PayloadTooLargeError'
                        }
                    }).then(() => {
            serverResponse({
                            result_request:{http:400, 
                                            code:null, 
                                            text:iamUtilMessageNotAuthorized(), 
                                            developerText:'',
                                            moreInfo:'',
                                            type:'HTML'},
                            host:req.headers.host,
                            route:null,
                            res:res});
        });
    }
    else{
        const bff = await import('./bff.js');
        //Backend for frontend (BFF) start
        return bff.bff(req, res);
    }

};

/**
 * @name serverStart
 * @description Server start
 *              Logs uncaughtException and unhandledRejection
 *              Start http server and https server if enabled
 * @function
 * @returns{Promise.<void>}
 */
const serverStart = async () =>{
    
    const Log = await import('./db/Log.js');
    const ConfigServer = await import('./db/ConfigServer.js');
    const Installation = await import('./installation.js');
    const ORM = await  import('./db/ORM.js');

    const fs = await import('node:fs');
    const http = await import('node:http');
    const https = await import('node:https');

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

        if (configServer.SERVICE_IAM.filter(parameter=> 'SERVER_UPDATE_SECRETS_START' in parameter)[0].SERVER_UPDATE_SECRETS_START=='1')
            await Installation.updateConfigSecrets();

        const {socketIntervalCheck} = await import('./socket.js');
        socketIntervalCheck();
                                            
        const NETWORK_INTERFACE = configServer.SERVER.filter(parameter=> 'NETWORK_INTERFACE' in parameter)[0].NETWORK_INTERFACE;
        //START HTTP SERVER                                                     
        http.createServer((req,res)=>server(req,res))
            .listen(serverUtilNumberValue(configServer.SERVER.filter(parameter=> 'HTTP_PORT' in parameter)[0].HTTP_PORT)??80, NETWORK_INTERFACE, () => {
            Log.post({   app_id:0, 
                data:{  object:'LogServerInfo', 
                        log:'HTTP Server PORT: ' + serverUtilNumberValue(configServer.SERVER.filter(parameter=> 'HTTP_PORT' in parameter)[0].HTTP_PORT)??80
                    }
                });
        });
        http.createServer((req,res)=>server(req,res)).listen(serverUtilNumberValue(configServer.SERVER.filter(parameter=> 'HTTP_PORT_ADMIN' in parameter)[0].HTTP_PORT_ADMIN)??5000, NETWORK_INTERFACE, () => {
            Log.post({   app_id:0, 
                data:{  object:'LogServerInfo', 
                        log:'HTTP Server Admin  PORT: ' + serverUtilNumberValue(configServer.SERVER.filter(parameter=> 'HTTP_PORT_ADMIN' in parameter)[0].HTTP_PORT_ADMIN)??5000
                    }
                });
        });
        if (configServer.SERVER.filter(parameter=> 'HTTPS_ENABLE' in parameter)[0].HTTPS_ENABLE=='1'){
            //START HTTPS SERVER
            //SSL files for HTTPS
            const HTTPS_KEY = await fs.promises.readFile(serverProcess.cwd() + '/data' + configServer.SERVER.filter(parameter=> 'HTTPS_KEY' in parameter)[0].HTTPS_KEY, 'utf8');
            const HTTPS_CERT = await fs.promises.readFile(serverProcess.cwd() + '/data' + configServer.SERVER.filter(parameter=> 'HTTPS_CERT' in parameter)[0].HTTPS_CERT, 'utf8');
            const options = {
                key: HTTPS_KEY.toString(),
                cert: HTTPS_CERT.toString()
            };
            https.createServer(options, (req,res)=> server(req,res)).listen(serverUtilNumberValue(configServer.SERVER.filter(parameter=> 'HTTPS_PORT' in parameter)[0].HTTPS_PORT)??443,NETWORK_INTERFACE, () => {
                Log.post({   app_id:0, 
                    data:{  object:'LogServerInfo', 
                            log:'HTTPS Server PORT: ' + serverUtilNumberValue(configServer.SERVER.filter(parameter=> 'HTTPS_PORT' in parameter)[0].HTTPS_PORT)??443
                        }
                    });
            });
            https.createServer(options,  (req,res)=> server(req,res)).listen(serverUtilNumberValue(configServer.SERVER.filter(parameter=> 'HTTPS_PORT_ADMIN' in parameter)[0].HTTPS_PORT_ADMIN)??6000,NETWORK_INTERFACE, () => {
                Log.post({   app_id:0, 
                    data:{  object:'LogServerInfo', 
                            log:'HTTPS Server admin PORT: ' + serverUtilNumberValue(configServer.SERVER.filter(parameter=> 'HTTPS_PORT_ADMIN' in parameter)[0].HTTPS_PORT_ADMIN)??6000
                        }
                    });
            });
        }
    } catch (/**@type{server_server_error}*/error) {
        Log.post({   app_id:0, 
            data:{  object:'LogServerError', 
                    log:'serverStart: ' + error.stack
                }
            });
    }
    
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
     *          url:string|null,
     *          protocol:'https'|'http'|null,
     *          host:string|null,
     *          port:number|null,
     *          admin:Boolean,
     *          path:string,
     *          body:{}|null,
     *          method:string,
     *          client_ip:string,
     *          authorization:string,
     *          user_agent:string,
     *          accept_language:string,
     *          endpoint:server_bff_endpoint_type}} parameters
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
            const response = await parameters.request_function ({   protocol:parameters.protocol,
                                                                    url:parameters.url,
                                                                    host:parameters.host,
                                                                    port:parameters.port,
                                                                    path:parameters.path,
                                                                    body:parameters.body,
                                                                    method:parameters.method,
                                                                    client_ip:parameters.client_ip,
                                                                    authorization:parameters.authorization,
                                                                    user_agent:parameters.user_agent,
                                                                    accept_language:parameters.accept_language,
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
 * @param {{protocol:'https'|'http'|null,
 *          url:string|null,
 *          host:string|null,
 *          port:number|null,
 *          path:string|null,
 *          body:{}|null,
 *          method:string,
 *          client_ip:string,
 *          authorization:string,
 *          user_agent:string,
 *          accept_language:string,
 *          timeout:number}} parameters
 * @returns {Promise.<*>}
 */                    
const serverRequest = async parameters =>{
    const zlib = await import('node:zlib');
    const MESSAGE_TIMEOUT = '🗺⛔?';
    
    /**@type {'http'|'https'} */
    const protocol = parameters.protocol ?? parameters.url?.toLowerCase().startsWith('http')?
                        'http':
                            'https';
    /**@type {import('node:http')|import('node:https')} */
    const request_protocol = await import(`node:${protocol}`);
    return new Promise ((resolve, reject)=>{
        const headers = {
                'User-Agent': parameters.user_agent,
                'Accept-Language': parameters.accept_language,
                'Authorization': parameters.authorization,
                'x-forwarded-for': parameters.client_ip,
                ...(parameters.method!='GET' && {'Content-Type':  'application/json'}),
                ...(parameters.method!='GET' && {'Content-Length':  Buffer.byteLength(JSON.stringify(parameters.body))})
        };
        /**@type{import('node:https').RequestOptions}*/    
        const options = {
            method: parameters.method,
            timeout: parameters.timeout,
            headers : headers,
            ...(parameters.url ==null && {host:  parameters.host}),
            ...(parameters.url ==null && {port:  parameters.port}),
            ...(parameters.url ==null && {path:  parameters.path}),
            ...(protocol=='https' && {rejectUnauthorized: false})
        };
        /**
         * @param {import('node:http').IncomingMessage} res
         * @returns {void}
         */
        const respond = res =>{
            let responseBody = '';
            res.setEncoding('utf8');
            if (res.headers['content-encoding'] == 'gzip'){
                const gunzip = zlib.createGunzip();
                res.pipe(gunzip);
                gunzip.on('data', (/**@type{*}*/chunk) =>responseBody += chunk);
                gunzip.on('end', () => resolve (responseBody));
            }
            else{
                res.on('data', (/**@type{*}*/chunk) =>{
                    responseBody += chunk;
                });
                res.on('end', ()=>{
                    if (res.statusCode == 200)
                        resolve (responseBody);
                    else
                        reject(res.statusMessage);
                });
            }
        };
        const request = parameters.url?
                            request_protocol.request(parameters.url, options, respond):
                                request_protocol.request(options, respond);
        if (parameters.method !='GET')
            request.write(JSON.stringify(parameters.body));
        request.on('error', error => {
            reject(error);
        });
        request.on('timeout', () => {
            reject(MESSAGE_TIMEOUT);
        });
        request.end();
    });
};
export {serverResponse, 
        serverUtilNumberValue, serverUtilResponseTime, serverUtilAppFilename,serverUtilAppLine , 
        serverStart,
        serverProcess,
        serverCircuitBreakerMicroService,
        serverCircuitBreakerBFE,
        serverRequest};