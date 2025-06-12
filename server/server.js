/** 
 * @module server/server 
 */

/**
 * @import {server_req_method, server_REST_API_parameters, server_server_response, server_server_response_type, 
 *          server_server_error, server_server_req, server_server_res,
 *          server_db_document_ConfigServer,server_db_table_IamUser,
 *          server_server_req_id_number} from './types.js'
 */

const zlib = await import('node:zlib');

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
        parameters.res.write(JSON.stringify(message), 'utf8');
        parameters.res.end();
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
                            parameters.res.write(iamUtilMessageNotAuthorized(), 'utf8');
                            parameters.res.end();
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
                                parameters.res.write(JSON.stringify((typeof parameters.result_request.result!='string' && parameters.result_request.result?.length>0)?
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
                                parameters.res.write(JSON.stringify(result), 'utf8');    
                            }    
                        }
                        else
                            parameters.res.write(parameters.result_request.result, 'utf8');
                    }
                    else{
                        const  {iamUtilMessageNotAuthorized} = await import('./iam.js');
                        parameters.res.statusCode =500;
                        parameters.res.write(iamUtilMessageNotAuthorized(), 'utf8');
                    }
                    parameters.res.end();
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
  * @name serverUtilCompression
  * @description Compression of response for supported requests
  * @function
  * @param {server_server_req} req
  * @param {server_server_res} res
  */
 const serverUtilCompression = (req,res) =>{
    
    /**
     * Execute a listener when a response is about to write headers.
     * @param {server_server_res} res
     * @param {function} listener
     */
    const onHeaders = (res, listener) => {
        /**
         * Create a replacement writeHead method.
         *
         * @param {function} prevWriteHead
         * @param {function} listener
         */
        function createWriteHead (prevWriteHead, listener) {
            let fired = false;
        
            // return function with core name and argument list
            /**
             * @param {number} statusCode
             */
            return function writeHead (statusCode) {
                // set headers from arguments
                /**@ts-ignore */
                const args = setWriteHeadHeaders.apply(res, arguments);
            
                // fire listener
                if (!fired) {
                    fired = true;
                    listener.call(res);
            
                    // pass-along an updated status code
                    if (typeof args[0] === 'number' && statusCode !== args[0]) {
                        args[0] = statusCode;
                        args.length = 1;
                    }
                }
                
                return prevWriteHead.apply(res, args);
            };
        }
        /**
         * Set headers contained in array on the response object.
         * @param {server_server_res} res
         * @param {[]} headers
         * @returns {void}
         */
        const setHeadersFromArray = (res, headers) => {
            for (let i = 0; i < headers.length; i++) {
                res.setHeader(headers[i][0], headers[i][1]);
            }
        };
        
        /**
         * Set headers contained in object on the response object.
         * @param {server_server_res} res
         * @param {*} headers
         * @returns {void}
         */
        const setHeadersFromObject = (res, headers) =>{
            const keys = Object.keys(headers);
            for (let i = 0; i < keys.length; i++) {
                const k = keys[i];
                if (k)
                     res.setHeader(k, headers[k]);
            }
        };
        
        /**
         * Set headers and other properties on the response object.
         * @param {number} statusCode
         * @returns {*}
         */
        function setWriteHeadHeaders (statusCode) {
            const length = arguments.length;
            const headerIndex = length > 1 && typeof arguments[1] === 'string'?2:1;
        
            /**@type{[]|{}} */
            const headers = length >= headerIndex + 1?arguments[headerIndex]:undefined;
        
            res.statusCode = statusCode;
        
            if (headers?.constructor== Array) {
                // handle array case
                setHeadersFromArray(res, headers);
            } else if (headers) {
                // handle object case
                setHeadersFromObject(res, headers);
            }
            // copy leading arguments
            const args = new Array(Math.min(length, headerIndex));
            for (let i = 0; i < args.length; i++) {
                args[i] = arguments[i];
            }
            return args;
        }
        if (!res)
            throw 'argument res is required';
        if (typeof listener !== 'function')
            throw 'argument listener must be a function';
        res.writeHead = createWriteHead(res.writeHead, listener);
    };

    let ended = false;
    /**@type{[]|null} */
    let listeners = [];
    /**@type{*} */
    let stream;

    const _end = res.end;
    const _on = res.on;
    const _write = res.write;

    // flush
    res.flush = function flush () {
        if (stream)
            stream.flush();
    };

    // proxy
    /**
     * @param {string} chunk
     * @param {string} encoding
     * @returns {*}
     */
    res.write = function write (chunk, encoding) {
        if (ended)
            return false;
        else{
            if (!res._header) {
                //updates res._header
                res._implicitHeader();
            }
            return stream
                ? stream.write(toBuffer(chunk, encoding))
                : _write.call(this, chunk, encoding);
        }
    };
    /**
     * @param {*} chunk
     * @param {string} encoding 
     * @returns {*}
     */
    res.end = function end (chunk, encoding) {
        if (ended)
            return false;
        else{
            if (!res._header) {
                //updates res._header
                res._implicitHeader();
            }
            if (stream) {
                ended = true;
                return chunk
                    ? stream.end(toBuffer(chunk, encoding))
                    : stream.end();
            }
            else{
                // mark ended
                return _end.call(this, chunk, encoding);
            }
        }
    };
    /**
     * @param {*} type
     * @param {*} event
     * @returns {*}
     */
    res.on = function on (type, event) {
        if (!listeners || type !== 'drain')
            return _on.call(this, type, event);
        else
            if (stream)
                return stream.on(type, event);
            else{
                // buffer listeners for future stream
                /**@ts-ignore */
                listeners.push([type, event]);
                return this;
            }
    };


    onHeaders(res, function onResponseHeaders () {
        //compress for:
        //not broadcast messages using socket
        //text responses
        if (!res.getHeader('Content-Type')?.startsWith('text/event-stream') &&
            (res.getHeader('Content-Type')?.startsWith('text') ||
            res.getHeader('Content-Type')?.startsWith('application/json'))){
            const method = 'gzip';

            // compression stream
            stream = method === 'gzip'
                ? zlib.createGzip()
                : zlib.createDeflate();
    
            // add buffered listeners to stream
            addListeners(stream, stream.on, listeners);
    
            // header fields
            res.setHeader('Content-Encoding', 'gzip');
            res.removeHeader('Content-Length');
    
            // compression
            stream.on('data', function onStreamData (/**@type {string}*/chunk) {
                if (_write.call(res, chunk) === false) {
                    stream.pause();
                }
            });
    
            stream.on('end', function onStreamEnd () {
                _end.call(res);
            });
    
            _on.call(res, 'drain', function onResponseDrain () {
                stream.resume();
            });    
        }
        else{
            addListeners(res, _on, listeners);
            listeners = null;
        }
    });

    /**
     * Add bufferred listeners to stream
     * @param {*} stream
     * @param {function} on
     * @param {*} listeners 
     */

    function addListeners (stream, on, listeners) {
        for (let i = 0; i < listeners.length; i++) {
            on.apply(stream, listeners[i]);
        }
    }

    /**
     * Coerce arguments to Buffer
     * @param {*} chunk
     * @param {*} encoding 
     */
    function toBuffer (chunk, encoding) {
        return !Buffer.isBuffer(chunk)
            ? Buffer.from(chunk, encoding)
            : chunk;
    }
};

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
 * @function
 * @returns {Promise<*>}
 */
const server = async () => {
    const Log = await import('./db/Log.js');
    const ConfigServer = await import('./db/ConfigServer.js');
    const {iamUtilMessageNotAuthorized} = await import('./iam.js');

    /**
     * @param {server_server_req} req
     * @param {server_server_res} res
     * @returns {Promise.<*>}
     */
    const app = async (req, res)=>{    
        /**@type{server_db_document_ConfigServer['SERVER']} */
        const CONFIG_SERVER = ConfigServer.get({app_id:0,data:{ config_group:'SERVER'}}).result;
        
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
        await read_body();
        // check JSON maximum size, parameter uses megabytes (MB)
        if (req.body && JSON.stringify(req.body).length/1024/1024 > 
                (serverUtilNumberValue((CONFIG_SERVER.filter(parameter=>parameter.JSON_LIMIT)[0].JSON_LIMIT ?? '0').replace('MB',''))??0)){
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
            res.send =          (/**@type{*}*/result) =>{
                                    //Content-Type should be set beforem sets default to text/html
                                    if (res.getHeader('Content-Type')==undefined)
                                        res.type('text/html; charset=utf-8');
                                    res.write(result);
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
                                    /**@ts-ignore */
                                    readStream.pipe(res);
                                };
            res.redirect =      (/**@type{string}*/url) =>{
                                    res.writeHead(301, {'Location':url});
                                    res.end();
                                };
            //Backend for frontend (BFF) start
            const bff =             await import('./bff.js');
            const resultbffInit =   await bff.bffInit(req, res);
            if (resultbffInit.reason == null){
                return bff.bffStart(req, res)
                        .then(result=>{
                            result?
                                serverResponse({
                                    result_request:result,
                                    host:req.headers.host,
                                    route:null,
                                    res:res}):
                                bff.bff({
                                    //request
                                    host: req.headers.host ?? '', 
                                    url:req.originalUrl,
                                    method: req.method,
                                    query: req.query?.parameters ?? '',
                                    body: req.body,
                                    security_app: { AppId: req.headers['content-type'] =='text/event-stream'?
                                                        0:
                                                            req.headers['app-id']??null,
                                                    AppSignature: req.headers['app-signature']??null,
                                                    AppIdToken: req.headers['app-id-token']??null
                                    },
                                    authorization:  req.headers.authorization, 
                                    //metadata
                                    ip: req.headers['x-forwarded-for'] || req.ip, 
                                    user_agent: req.headers['user-agent'], 
                                    accept_language: req.headers['accept-language'], 
                                    //response
                                    res: res
                                });
                        });
            }
            else
                if (resultbffInit.redirect)
                    res.redirect(resultbffInit.redirect);
                else
                    res.end();
        }
    };
    return app;
};
/**
 * @name serverREST_API
 * @namespace ROUTE_REST_API
 * @description Server REST API routes using openAPI where paths, methods, validation rules, operationId and function parameters are defined
 *              OperationId syntax: [path].[filename].[functioname] or [path]_[path].[filename].[functioname]
 *              Returns single resource result format or ISO20022 format with either list header format or page header metadata
 * @function
 * @param {server_REST_API_parameters} routesparameters
 * @returns {Promise.<server_server_response>}
 */
const serverREST_API = async (routesparameters) =>{        
    const iam = await import('./iam.js');
    const ConfigRestApi = await import('./db/ConfigRestApi.js');
    const ConfigServer = await import('./db/ConfigServer.js');
    const URI_query = routesparameters.parameters;
    const URI_path = routesparameters.url.indexOf('?')>-1?routesparameters.url.substring(0, routesparameters.url.indexOf('?')):routesparameters.url;
    const app_query = URI_query?new URLSearchParams(URI_query):null;
    /**@type{server_db_document_ConfigServer} */
    const configServer = ConfigServer.get({app_id:0}).result;

    
    /**
     * Authenticates if user has access to given resource
     * Authenticates using IAM token claims if path requires
     * @param {{app_id_authenticated:number,
     *          IAM_iam_user_app_id:number|null,
     *          IAM_iam_user_id:number|null,
     *          IAM_module_app_id:number|null,
     *          IAM_data_app_id:number|null,
     *          IAM_service:string|null
     *          resource_id_required?: boolean}} params
     * @returns {boolean}
     */
    const Authenticate = params =>{
        if (
            //match required resource id
            ((params.resource_id_required ?? false) && URI_path.substring(URI_path.lastIndexOf('/') + 1) == '')==false){
            //Authencate IAM keys in the tokens if one of them used
            if (params.IAM_iam_user_app_id || 
                params.IAM_iam_user_id || 
                params.IAM_module_app_id || 
                params.IAM_data_app_id ||
                params.IAM_service){
                if (iam.iamAuthenticateResource({   app_id:                     params.app_id_authenticated, 
                                                    ip:                         routesparameters.ip, 
                                                    idToken:                    routesparameters.idToken,
                                                    endpoint:                   routesparameters.endpoint,
                                                    authorization:              routesparameters.authorization, 
                                                    claim_iam_user_app_id:      serverUtilNumberValue(params.IAM_iam_user_app_id),
                                                    claim_iam_user_id:          serverUtilNumberValue(params.IAM_iam_user_id),
                                                    claim_iam_module_app_id:    serverUtilNumberValue(params.IAM_module_app_id),
                                                    claim_iam_data_app_id:      serverUtilNumberValue(params.IAM_data_app_id),
                                                    claim_iam_service:          params.IAM_service}))
                    return true;
                else
                    return false;
            }
            else
                return true;
            }
        else
            return false;
    };

    /**
     * @description returns resource id name and value if used using ConfigRestApi and URI path
     * @param {*} paths
     * @param {*} components
     * @returns {Object.<string, string|number|null>|null}
     */
    const resourceId =(paths, components) =>
        paths[0].indexOf('${')>-1?
            paths[1][Object.keys(paths[1])[0]].parameters
            .filter((/**@type{*}*/parameter)=>
                (parameter.in=='path' || components.parameters[parameter['$ref']?.split('#/components/parameters/')[1]]?.in == 'path')
            )[0]==null?null:
            {[paths[0].substring(paths[0].indexOf('${')+'${'.length).replace('}','')]:
                (components.parameters[paths[0].substring(paths[0].indexOf('${')+'${'.length).replace('}','')]?.schema.type == 'number'?
                        serverUtilNumberValue(URI_path.substring(URI_path.lastIndexOf('/')+1)):
                            URI_path.substring(URI_path.lastIndexOf('/')+1))
            }:
                //no resource id string in defined path
                null;

    /**
     * @description returns if resource id is required, all path parameters should be defined in #/components/parameters
     */
    const resourceIdRequired = () =>
        configPath.paths[1][Object.keys(configPath.paths[1])[0]].parameters
        .filter((/**@type{*}*/parameter)=>
            (parameter.in=='path' || configPath.components.parameters[parameter['$ref']?.split('#/components/parameters/')[1]]?.in == 'path') &&
                (parameter['$ref']?.split('#/components/parameters/')[1].startsWith('IAM')?true:(parameter.required ?? false))
        )[0]?true:false;
        
    //get paths and components keys in ConfigRestApi
    const configPath = (() => { 
        const { paths, components } = ConfigRestApi.get({app_id:serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>parameter.APP_COMMON_APP_ID)[0].APP_COMMON_APP_ID) ?? 0}).result; 
            return {paths:Object.entries(paths).filter(path=>   
                //match with resource id string             
                (path[0].indexOf('${')>-1 && path[0].substring(0,path[0].lastIndexOf('${')) == URI_path.substring(0,URI_path.lastIndexOf('/')+1)) ||
                //match without resource id string
                path[0].indexOf('${')==-1 && path[0] == URI_path
                )[0],
                components};    
        
    })();

    if (configPath.paths){
        /**
         * @description get parameter in path
         * @param{string} key
         * @returns {*}
         */
        const getParameter = key => methodObj.parameters.filter((/**@type{*}*/parameter)=>
                                                                        Object.keys(parameter)[0]=='$ref' && Object.values(parameter)[0]=='#/components/parameters/' + key)[0];

        const methodObj = configPath.paths[1][routesparameters.method.toLowerCase()];
        if (methodObj){   
               
            const idToken = //All external roles and microservice do not use AppId Token
                            (routesparameters.endpoint.indexOf('EXTERNAL')>-1 ||
                            routesparameters.endpoint.indexOf('MICROSERVICE')>-1)?
                                    '':
                                    routesparameters.idToken?.replace('Bearer ',''); 

            const authenticate = await iam.iamAuthenticateCommon({
                idToken: idToken, 
                endpoint:routesparameters.endpoint,
                authorization: routesparameters.authorization??'', 
                host: routesparameters.host??'', 
                AppId:routesparameters.AppId, 
                AppSignature: routesparameters.AppSignature,
                ip: routesparameters.ip,
                res:routesparameters.res
                });

            if (authenticate.app_id !=null){
                /**
                 * @param {{}} keys
                 * @param {[string,*]} key
                 */
                const addBodyKey = (keys, key )=>{
                    return {...keys, ...{   [key[0]]:{  
                                                        data:       key[0]=='server_response'?
                                                                        routesparameters.res:
                                                                            routesparameters.body[key[0]],
                                                        //IAM parameters are required by default
                                                        required:   key[1]?.required ?? (key[0].startsWith('IAM')?true:false)
                                                    }
                                        }
                                    };
                };
                //add parameters using tree shaking pattern
                //so only defined parameters defined using openAPI pattern are sent to functions
                const parametersData = 
                                        routesparameters.method=='GET'?
                                            {...methodObj.parameters
                                                            //include all parameters.in=query
                                                            .filter((/**@type{*}*/parameter)=>
                                                                parameter.in =='query'|| 
                                                                //component parameter that has in=query
                                                                (   '$ref' in parameter && 
                                                                    'required' in parameter && 
                                                                    configPath.components.parameters[parameter['$ref'].split('#/components/parameters/')[1]].in == 'query')
                                                            )
                                                            .reduce((/**@type{*}*/keys, /**@type{*}*/key)=>{
                                                                if ('$ref' in key )
                                                                    return {...keys, ...{   
                                                                                        [key['$ref'].split('#/components/parameters/')[1]]:
                                                                                        {
                                                                                            data:       app_query?.get(key['$ref'].split('#/components/parameters/')[1]),
                                                                                            //IAM parameters are required by default
                                                                                            required:   (key?.required ?? (key['$ref'].split('#/components/parameters/')[1].startsWith('IAM')?true:false))
                                                                                        }
                                                                                    }
                                                                            };
                                                                else
                                                                    return {...keys, ...{   
                                                                                        [key.name]:{
                                                                                            data:       app_query?.get(key.name),
                                                                                            //IAM parameters are required by default
                                                                                            required:   (key?.required ?? (key.name.startsWith('IAM')?true:false))
                                                                                        }
                                                                                    }
                                                                        };
                                                            },{})
                                            }:
                                            //all other methods use body to send data
                                            //if additional properties allowed then add to defined parameters or only parameters matching defined parameters
                                            (methodObj.requestBody?.content && methodObj.requestBody?.content['application/json']?.schema?.additionalProperties)?
                                                {...routesparameters.body,...Object.entries(methodObj.requestBody?.content['application/json']?.schema?.properties)
                                                                                .reduce((/**@type{*}*/keys, /**@type{*}*/key)=>addBodyKey(keys,key),{})}:
                                                            ((methodObj?.requestBody?.content && Object.keys(methodObj?.requestBody?.content).length>0)?Object.entries(methodObj.requestBody?.content['application/json']?.schema?.properties)
                                                            .reduce((/**@type{*}*/keys, /**@type{*}*/key)=>addBodyKey(keys,key),{}):{});
                if (Authenticate({ app_id_authenticated:  authenticate.app_id,
                                    IAM_iam_user_app_id:    parametersData.IAM_iam_user_app_id?.data,
                                    IAM_iam_user_id:        parametersData.IAM_iam_user_id?.data,
                                    IAM_module_app_id:      parametersData.IAM_module_app_id?.data,
                                    IAM_data_app_id:        parametersData.IAM_data_app_id?.data,
                                    IAM_service:            parametersData.IAM_service?.data,
                                    resource_id_required:   resourceIdRequired(),
                                }) &&
                                //there is no missing required parameter in the request
                                Object.keys(parametersData).filter(parameter=> 
                                    parameter=='server_response'?
                                        false:
                                            ((typeof parametersData[parameter] == 'object') &&
                                            parametersData[parameter]?.required && 
                                            (routesparameters.method=='GET'?
                                                ((app_query?.has(parameter)??false)==false):
                                                    (parameter in routesparameters.body)==false)
                                            )).length==0){ 
                    Object.keys(parametersData).forEach(key=>
                        parametersData[key]= (typeof parametersData[key] == 'object' && parametersData[key]!=null)?
                                                parametersData[key].data:
                                                    parametersData[key]
                    );
                    if ('IAM_module_app_id' in parametersData ||routesparameters.endpoint=='APP_ACCESS_EXTERNAL'){
                        //APP_ACCESS_EXTERNAL can only run function using same appid used by host and access data for same app id
                        parametersData.module_app_id = routesparameters.endpoint=='APP_ACCESS_EXTERNAL'?
                                                        authenticate.app_id:
                                                        parametersData.IAM_module_app_id!=null?
                                                            serverUtilNumberValue(parametersData.IAM_module_app_id):
                                                                null;
                        delete parametersData.IAM_module_app_id;
                    }
                    if ('IAM_data_app_id' in parametersData ||routesparameters.endpoint=='APP_ACCESS_EXTERNAL'){
                        //APP_ACCESS_EXTERNAL can only run function using same appid used by host and access data for same app id
                        parametersData.data_app_id = routesparameters.endpoint=='APP_ACCESS_EXTERNAL'?
                                                        authenticate.app_id:
                                                        parametersData.IAM_data_app_id!=null?
                                                            serverUtilNumberValue(parametersData.IAM_data_app_id):
                                                                null;
                        delete parametersData.IAM_data_app_id;
                    }
                    if ('IAM_iam_user_app_id' in parametersData){
                        parametersData.iam_user_app_id = parametersData.IAM_iam_user_app_id!=null?
                                                            serverUtilNumberValue(parametersData.IAM_iam_user_app_id):
                                                                null;
                        delete parametersData.IAM_iam_user_app_id;
                    }
                    if ('IAM_iam_user_id' in parametersData){
                        parametersData.iam_user_id = parametersData.IAM_iam_user_id!=null?
                                                        serverUtilNumberValue(parametersData.IAM_iam_user_id):
                                                            null;
                        delete parametersData.IAM_iam_user_id;
                    }
                    if ('IAM_service' in parametersData){
                        parametersData.service = parametersData.IAM_service;
                        delete parametersData.IAM_service;
                    }
                    
                    //read operationId what file to import and what function to execute
                    //syntax: [path].[filename].[functioname] or [path]_[path].[filename].[functioname]
                    const filePath = '/' + methodObj.operationId.split('.')[0].replaceAll('_','/') + '/' +
                                            methodObj.operationId.split('.')[1] + '.js';
                    const functionRESTAPI = methodObj.operationId.split('.')[2];
                    const moduleRESTAPI = await import('../' + filePath);
    
                    /**
                     *  Return single resource in result object or multiple resource in rows keys
                     *  Rules: 
                     *  server functions: return false
                     *  method not GET or microservice request: true
                     *  method GET: if resource id (string or number) is empty return false else true
                     * @returns {boolean}
                     */
                    const singleResource = () => functionRESTAPI=='commonModuleRun'?
                                                    false:
                                                        (routesparameters.method!='GET' ||functionRESTAPI=='microserviceRequest')?
                                                            true: (Object.keys(resourceId(configPath.paths, configPath.components)??{}).length==1 && Object.values(resourceId(configPath.paths, configPath.components)??{})[0]!=null);
                    //return result using ISO20022 format
                    //send only parameters to the function if declared true
                    const result = await  moduleRESTAPI[functionRESTAPI]({
                                    ...(getParameter('server_app_id')               && {app_id:             authenticate.app_id}),
                                    ...(getParameter('server_idtoken')              && {idToken:            routesparameters.idToken}),
                                    ...(getParameter('server_authorization')        && {authorization:      routesparameters.authorization}),
                                    ...(getParameter('server_user_agent')           && {user_agent:         routesparameters.user_agent}),
                                    ...(getParameter('server_accept_language')      && {accept_language:    routesparameters.accept_language}),
                                    ...(getParameter('server_host')                 && {host:               routesparameters.host}),
                                    ...(getParameter('locale')                      && {locale:             parametersData.locale ??'en'}),
                                    ...(getParameter('server_ip')                   && {ip:                 routesparameters.ip}),
                                    ...(getParameter('server_microservice')         && {microservice:       getParameter('server_microservice').default}),
                                    ...(getParameter('server_microservice_service') && {service:            getParameter('server_microservice_service').default}),
                                    ...(getParameter('server_message_queue_type')   && {message_queue_type: getParameter('server_message_queue_type').default}),
                                    ...(getParameter('server_method')               && {method:             routesparameters.method}),
                                    ...(Object.keys(parametersData)?.length>0       && {data:               {...parametersData}}),
                                    ...(getParameter('server_endpoint')             && {endpoint:           routesparameters.endpoint}),
                                    ...(resourceId( configPath.paths, 
                                                    configPath.components)          && {resource_id:        Object.values(resourceId(configPath.paths, 
                                                                                                                                    configPath.components)??{})[0]})});
                    return { ...result,
                                ...{singleResource:singleResource()
                                    }
                            };
                }
                else
                    return 	{http:401,
                            code:'SERVER',
                            text:iam.iamUtilMessageNotAuthorized(),
                            developerText:'serverREST_API',
                            moreInfo:null,
                            type:'JSON'};
            }
            else{
                //unknown appid
                return 	{http:401,
                    code:'SERVER',
                    text:iam.iamUtilMessageNotAuthorized(),
                    developerText:'serverREST_API',
                    moreInfo:null,
                    type:'JSON'};
            }

            
        }
        else                
            return 	{http:404,
                    code:'SERVER',
                    text:iam.iamUtilMessageNotAuthorized(),
                    developerText:'serverREST_API',
                    moreInfo:null,
                    type:'JSON'};
    }
    else
        return 	{http:404,
                code:'SERVER',
                text:iam.iamUtilMessageNotAuthorized(),
                developerText:'serverREST_API',
                moreInfo:null,
                type:'JSON'};
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
        console.log(reason.stack ?? reason.message ?? reason);
        Log.post({   app_id:0, 
            data:{  object:'LogServerError', 
                    log:'Process unhandledRejection: ' + reason.stack ?? reason.message ?? reason
                }
            });
    });
    try {
        const result_data = await ORM.getFsDataExists();
        if (result_data==false){
            await Installation.postConfigDefault();
            await ORM.Init();
        }
        else{
            await ORM.Init();
            await Installation.updateConfigSecrets();
        }
        /**@type{server_db_document_ConfigServer['SERVER']} */
        const configServer = ConfigServer.get({app_id:0,data:{ config_group:'SERVER'}}).result;
        const {socketIntervalCheck} = await import('./socket.js');
        socketIntervalCheck();
                                            
        const NETWORK_INTERFACE = configServer.filter(parameter=> 'NETWORK_INTERFACE' in parameter)[0].NETWORK_INTERFACE;
        //START HTTP SERVER                                                     
        http.createServer(await server()).listen(serverUtilNumberValue(configServer.filter(parameter=> 'HTTP_PORT' in parameter)[0].HTTP_PORT)??80, NETWORK_INTERFACE, () => {
            Log.post({   app_id:0, 
                data:{  object:'LogServerInfo', 
                        log:'HTTP Server PORT: ' + serverUtilNumberValue(configServer.filter(parameter=> 'HTTP_PORT' in parameter)[0].HTTP_PORT)??80
                    }
                });
        });
        http.createServer(await server()).listen(serverUtilNumberValue(configServer.filter(parameter=> 'HTTP_PORT_ADMIN' in parameter)[0].HTTP_PORT_ADMIN)??5000, NETWORK_INTERFACE, () => {
            Log.post({   app_id:0, 
                data:{  object:'LogServerInfo', 
                        log:'HTTP Server Admin  PORT: ' + serverUtilNumberValue(configServer.filter(parameter=> 'HTTP_PORT_ADMIN' in parameter)[0].HTTP_PORT_ADMIN)??5000
                    }
                });
        });
        if (configServer.filter(parameter=> 'HTTPS_ENABLE' in parameter)[0].HTTPS_ENABLE=='1'){
            //START HTTPS SERVER
            //SSL files for HTTPS
            const HTTPS_KEY = await fs.promises.readFile(serverProcess.cwd() + '/data' + configServer.filter(parameter=> 'HTTPS_KEY' in parameter)[0].HTTPS_KEY, 'utf8');
            const HTTPS_CERT = await fs.promises.readFile(serverProcess.cwd() + '/data' + configServer.filter(parameter=> 'HTTPS_CERT' in parameter)[0].HTTPS_CERT, 'utf8');
            const options = {
                key: HTTPS_KEY.toString(),
                cert: HTTPS_CERT.toString()
            };
            https.createServer(options,  await server()).listen(serverUtilNumberValue(configServer.filter(parameter=> 'HTTPS_PORT' in parameter)[0].HTTPS_PORT)??443,NETWORK_INTERFACE, () => {
                Log.post({   app_id:0, 
                    data:{  object:'LogServerInfo', 
                            log:'HTTPS Server PORT: ' + serverUtilNumberValue(configServer.filter(parameter=> 'HTTPS_PORT' in parameter)[0].HTTPS_PORT)??443
                        }
                    });
            });
            https.createServer(options,  await server()).listen(serverUtilNumberValue(configServer.filter(parameter=> 'HTTPS_PORT_ADMIN' in parameter)[0].HTTPS_PORT_ADMIN)??6000,NETWORK_INTERFACE, () => {
                Log.post({   app_id:0, 
                    data:{  object:'LogServerInfo', 
                            log:'HTTPS Server admin PORT: ' + serverUtilNumberValue(configServer.filter(parameter=> 'HTTPS_PORT_ADMIN' in parameter)[0].HTTPS_PORT_ADMIN)??6000
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
export {serverResponse, serverUtilCompression,
        serverUtilNumberValue, serverUtilResponseTime, serverUtilAppFilename,serverUtilAppLine , 
        serverREST_API, serverStart,
        serverProcess};