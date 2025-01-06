/** 
 * Server
 * Uses Express framework
 * Role based routes are defined in Express and are using IAM middleware for authentication and authorization.
 * If IAM authorizes the request then BFF calls either server functions or microservices
 * REST API is implemented following ISO20022 with additional resource authentication and authorization implemented
 * @module server/server 
 */

/**
 * @import {server_db_file_config_rest_api_methods, server_db_file_config_rest_api,server_server_error_stack, server_server_error, server_server_req, server_server_res, server_server_req_id_number,
 *          server_server_express} from './types.js'
 */
const zlib = await import('node:zlib');
/**
 * @name serverResponseErrorSend
 * @description Sends ISO 20022 error format
 * @function
 * @param {server_server_res} res 
 * @param {number} http 
 * @param {string|null} code 
 * @param {string|number|object|null} text 
 * @param {string|null} developer_text 
 * @param {string|null} more_info 
 * @returns {void}
 */
 const serverResponseErrorSend = (res, http, code, text, developer_text, more_info) => {
    //ISO20022 error format
    const message = {error:{
                        http:http, 
                        code:code, 
                        //return SERVER ERROR if status code starts with 5
                        text:http?.toString().startsWith('5')?'SERVER ERROR':text, 
                        developer_text:developer_text, 
                        more_info:more_info}};
    //remove statusMessage or [ERR_INVALID_CHAR] might occur and is moved to inside message
    res.statusMessage = '';
    res.statusCode = http;
    res.setHeader('Content-Type',  'application/json; charset=utf-8');
    res.write(JSON.stringify(message), 'utf8');
    res.end();
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
  * @param {server_server_res['req']} req
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
        if (req.headers.accept != 'text/event-stream' &&
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
    const diff = process.hrtime(res.getHeader('X-Response-Time'));
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
    const from_app_root = ('file:///' + process.cwd().replace(/\\/g, '/')).length;
    return module.substring(from_app_root);
};
/**
 * @name serverUtilAppFunction
 * @description Returns function used
 * @function
 * @param{server_server_error_stack} stack
 * @returns {string}
 */
const serverUtilAppFunction = stack => {
    const e = stack.split('at ');
    let functionName;
    //loop from last to first
    //ES6 rest parameter to avoid mutating array
    for (const line of [...e].reverse()) {
        //ES6 startsWith and includes
        if ((line.startsWith('file')==false && 
            line.includes('node_modules')==false &&
            line.includes('node:internal')==false &&
            line.startsWith('Query')==false)||
            line.startsWith('router')){
                functionName = line.split(' ')[0];
                break;
        }
    }
    return functionName ?? '';
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
 * @name serverExpress
 * @description Gets Express app with following settings in this order
 *	            1.Middleware	JSON maximum size setting
 *	            2.Routes	
 *	            path	                                    method	middleware                                  controller      comment
 *              /bff/app/v1/app-module*'                    get                                                 bffApp          app modules type MODULE and REPORT
 *                                                                                                                              used for shared libraries and open report url
 *	            *	                                        all	                                                bffInit	        logs EventSource and response when closed, 
 *                                                                                                                              authenticates request and will end request if not passing controls,
 *                                                                                                                              sets headers, 
 *                                                                                                                              returns disallow for robots.txt and empty favicon.ico
 *	            *	                                        get	                                                bffStart	    redirects naked domain, http to https if enabled 
 *				            			                                                                                        and to admin subdomain if first time, 
 *							                                                                                                    responds to SSL verification if enabled
 *              /bff/app_id/v1*                           all     iam.iamAuthenticateIdToken                  bffAppId
 *              /bff/app_id_signup/v1*                         post    iam.iamAuthenticateIdTokenRegistration      bffAppIdSignup
 *              /bff/app_access/v1*                         all     iam.iamAuthenticateAccessToken              bffAppAccess
 *              /bff/app_external/v1/app-module-function*   post    iam.iamAuthenticateExternal                 bffAppExternal
 *              /bff/admin/v1*                              all     iam.iamAuthenticateAdminAccessToken         bffAdmin
 *              /bff/socket/v1*                             get     iam.iamAuthenticateSocket                   bffSocket
 *              /bff/iam_admin/v1*                          post    iam.iamAuthenticateAdmin                    bffIAMAdmin
 *              /bff/iam_user/v1*                           post    iam.iamAuthenticateUser                     bffIAMUser
 *              /bff/iam_provider/v1*                       post    iam.iamAuthenticateProvider                 bffIAMProvider
 *	            *	                                        get	                                                bffApp		    app asset
 *				        			                                                                                            common asset
 *						            	                                                                                        info page
 *							                                                                                                    app
 *              3.Middleware error logging

 * @function
 * @returns {Promise<server_server_express>} app
 */
 const serverExpress = async () => {
    /**@type{import('./db/fileModelLog.js')} */
    const fileModelLog = await import(`file://${process.cwd()}/server/db/fileModelLog.js`);
    /**@type{import('./db/fileModelConfig.js')} */
    const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);
    /**@type{import('./iam.service.js')} */
    const  {iamUtilMesssageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.service.js`);
    const {default:express} = await import('express');
    
    /**@type{server_server_express} */
    const app = express();
    //
    //MIDDLEWARES
    //
    
    app.set('trust proxy', true);
    

    // set JSON maximum size
    app.use(
        express.json({ limit: fileModelConfig.get('CONFIG_SERVER','SERVER', 'JSON_LIMIT') ?? ''})
    );
    
    //ROUTES MIDDLEWARE
    //apps
    /**@type{import('./bff.js')} */
    const { bffInit, bffStart, bffApp, bffAppId, bffAppIdSignup, bffAppAccess, bffAppExternal, bffAdmin, bffSocket, 
            bffIAMAdmin, bffIAMUser, bffIAMProvider} = await import(`file://${process.cwd()}/server/bff.js`);
    //auth
    /**@type{import('./iam.js')} */
    const iam = await import(`file://${process.cwd()}/server/iam.js`);
    
    //ROUTES 
    //logs EventSource and response when closed, authenticates request and will end request if not passing controls, 
    //sets headers, returns disallow for robots.txt and empty favicon.ico
    app.route('*').all                          (bffInit);
    
    //redirects naked domain, http to https if enabled and to admin subdomain if first time, responds to SSL verification if enabled
    app.route('*').get                          (bffStart);
    
    //REST API 
    //URI syntax implemented:
    //https://[subdomain].[domain]/[backend for frontend (bff)]/[role authorization]/version/[resource collection/service]/[resource]/[optional resource id]?URI query
	//URI query: iam=[iam parameters base64 encoded]&parameters=[app parameters base64 encoded]
    app.route('/bff/app/v1/app-module*').get                    (bffApp);
    app.route('/bff/app_id/v1*').all                          (iam.iamAuthenticateIdToken,                bffAppId);
    app.route('/bff/app_id_signup/v1*').post                       (iam.iamAuthenticateIdTokenRegistration,    bffAppIdSignup);
    app.route('/bff/app_access/v1*').all                        (iam.iamAuthenticateAccessToken,            bffAppAccess);
    app.route('/bff/app_external/v1/app-module-function*').post (iam.iamAuthenticateExternal,               bffAppExternal);
    app.route('/bff/admin/v1*').all                             (iam.iamAuthenticateAccessTokenAdmin,       bffAdmin);
    app.route('/bff/socket/v1*').get                            (iam.iamAuthenticateSocket,                 bffSocket);
    app.route('/bff/iam_admin/v1/server-iam-login').post        (iam.iamAuthenticateAdmin,                  bffIAMAdmin);
    app.route('/bff/iam_user/v1*').post                         (iam.iamAuthenticateUser,                   bffIAMUser);
    app.route('/bff/iam_provider/v1*').post                     (iam.iamAuthenticateProvider,               bffIAMProvider);
    
    //app asset, common asset, info page, report and app
    app.route('*').get                                          (bffApp);
    
    //ERROR LOGGING
    app.use((/**@type{server_server_error}*/err,/**@type{server_server_req}*/req,/**@type{server_server_res}*/res) => {
        fileModelLog.postRequestE(req, res.statusCode, res.statusMessage, serverUtilResponseTime(res), err).then(() => {
            serverResponseErrorSend( res, 
                err?.name=='PayloadTooLargeError'?400:500,
                null, 
                err?.name=='PayloadTooLargeError'?iamUtilMesssageNotAuthorized():'SERVER ERROR', 
                null, 
                null);
        });
    });
    return app;
};
/**
 * @name serverJs
 * @description Same as serverExpress but without Express
 * @function
 * @returns {Promise<*>}
 */
const serverJs = async () => {
    /**@type{import('./db/fileModelLog.js')} */
    const fileModelLog = await import(`file://${process.cwd()}/server/db/fileModelLog.js`);
    /**@type{import('./db/fileModelConfig.js')} */
    const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);
    /**@type{import('./iam.service.js')} */
    const  {iamUtilMesssageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.service.js`);

    /**@type{import('./iam.js')} */
    const iam = await import(`file://${process.cwd()}/server/iam.js`);

    /**@type{import('./bff.js')} */
    const { bffApp, bffAppId, bffAppIdSignup, bffAppAccess, bffAppExternal, bffAdmin, bffSocket, 
        bffIAMAdmin, bffIAMUser, bffIAMProvider} = await import(`file://${process.cwd()}/server/bff.js`);

    /**
     * @param {server_server_req} req
     * @param {server_server_res} res
     * @returns {Promise.<*>}
     */
    const app = async (req, res)=>{
        /**
         * Routes request emulating Express  route() function
         * @param {server_server_req} req
         * @param {server_server_res} res
         * @returns {Promise.<*>}
         */
        const bffRoute= async (req, res) =>{
            //REST API 
            //URI syntax implemented:
            //https://[subdomain].[domain]/[backend for frontend (bff)]/[role authorization]/version/[resource collection/service]/[resource]/[optional resource id]?URI query
            //URI query: iam=[iam parameters base64 encoded]&parameters=[app parameters base64 encoded]
            switch (true){
                case (req.path.startsWith('/bff/app/v1/app-module') && req.method == 'GET'):{
                    req.route.path = '/bff/app/v1/app-module*';
                    bffApp(req, res);
                    break;
                }
                case req.path.startsWith('/bff/app_id/v1'):{
                    req.route.path = '/bff/app_id/v1*';
                    await iam.iamAuthenticateIdToken(req, res, () =>
                        bffAppId(req, res)
                    );
                    break;
                }
                case req.path.startsWith('/bff/app_id_signup/v1') &&req.method=='POST':{
                    req.route.path = '/bff/app_id_signup/v1*';
                    await iam.iamAuthenticateIdTokenRegistration(req, res, () =>
                            bffAppIdSignup(req, res)
                    );
                    break;
                }
                case req.path.startsWith('/bff/app_access/v1') :{
                    req.route.path = '/bff/app_access/v1*';
                    await iam.iamAuthenticateAccessToken(req, res, () =>
                        bffAppAccess(req, res)
                    );
                    break;
                }
                case req.path.startsWith('/bff/app_external/v1/app-module-function') && req.method=='POST':{
                    req.route.path = '/bff/app_external/v1/app-module-function*';
                    iam.iamAuthenticateExternal(req, res, () =>
                        bffAppExternal(req, res)
                    );
                    break;
                }
                case req.path.startsWith('/bff/admin/v1') :{
                    req.route.path = '/bff/admin/v1*';
                    await iam.iamAuthenticateAccessTokenAdmin(req, res, () =>
                        bffAdmin(req, res)
                    );
                    break;
                }
                case req.path.startsWith('/bff/socket/v1') && req.method=='GET':{
                    req.route.path = '/bff/socket/v1*';
                    iam.iamAuthenticateSocket(req, res, () =>
                        bffSocket(req, res)
                    );
                    break;
                }
                case req.path.startsWith('/bff/iam_admin/v1/server-iam-login') && req.method=='POST':{
                    req.route.path = '/bff/iam_admin/v1/server-iam-login';
                    await iam.iamAuthenticateAdmin(req, res, () =>
                        bffIAMAdmin(req, res)
                    );
                    break;
                }
                case req.path.startsWith('/bff/iam_user/v1') && req.method=='POST':{
                    req.route.path = '/bff/iam_user/v1*';
                    await iam.iamAuthenticateUser(req, res, () =>
                        bffIAMUser(req, res)
                    );
                    break;
                }
                case req.path.startsWith('/bff/iam_provider/v1') && req.method=='POST':{
                    req.route.path = '/bff/iam_provider/v1*';
                    await iam.iamAuthenticateProvider(req, res, () =>
                        bffIAMProvider(req, res)
                    );
                    break;
                }
                case req.method=='GET':{
                    req.route.path = '*';
                    //app asset, common asset, info page, report and app
                    bffApp(req,res);
                    break;
                }
                default:{
                    serverResponseErrorSend( res, 
                        400,
                        null, 
                        iamUtilMesssageNotAuthorized(), 
                        null, 
                        null);
                }
            }
        };
        //set keys and functions as set in Express
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
                (serverUtilNumberValue((fileModelConfig.get('CONFIG_SERVER', 'SERVER','JSON_LIMIT') ?? '0').replace('MB',''))??0)){
            //log error
            fileModelLog.postRequestE(req, res.statusCode, res.statusMessage, serverUtilResponseTime(res), 'PayloadTooLargeError').then(() => {
                serverResponseErrorSend( res, 
                    400,
                    null, 
                    iamUtilMesssageNotAuthorized(), 
                    null, 
                    null);
            });
        }
        else{
            req.protocol = req.socket.encrypted?'https':'http';
            req.ip = req.socket.remoteAddress;
            req.hostname = req.headers.host;
            req.path = req.url;
            req.originalUrl = req.url;
            req.route = {path:''};

            /**@ts-ignore */
            req.query = req.path.indexOf('?')>-1?Array.from(new URLSearchParams(req.path
                        .substring(req.path.indexOf('?')+1)))
                        .reduce((query, param)=>{
                            const key = {[param[0]] : decodeURIComponent(param[1])};
                            return {...query, ...key};
                        }, {}):null;
            
            res.status = (/**@type{number}*/code) =>{
                res.statusCode = code;
            };
            res.type = (/**@type{string}*/type)=>{
                res.setHeader('Content-Type', type);
            };
            res.send = (/**@type{*}*/result) =>{
                //Content-Type should be set beforem sets default to text/html
                if (res.getHeader('Content-Type')==undefined)
                    res.type('text/html; charset=utf-8');
                res.write(result);
                res.end();
            };
            res.sendFile = async (/**@type{*}*/path) =>{
                const fs = await import('node:fs');
                const readStream = fs.createReadStream(path);
                readStream.on ('error', streamErr =>{
                    streamErr;
                    res.writeHead(500);
                    res.end(iamUtilMesssageNotAuthorized());
                });
                /**@ts-ignore */
                readStream.pipe(res);
            };
            res.redirect = (/**@type{string}*/url) =>{
                res.writeHead(301, {'Location':url});
                res.end();
            };
            /**@type{import('./bff.service.js')} */
            const bffService = await import('./bff.service.js');
            const resultbffInit = await bffService.bffInit(req, res);
            if (resultbffInit.reason == null){
                const resultbffStart = req.method=='GET'?await bffService.bffStart(req, res):{reason:null};
                switch (resultbffStart.reason){
                    case 'REDIRECT':{
                        res.redirect(resultbffStart.redirect);
                        break;
                    }
                    case 'SEND':{
                        res.end();
                        break;
                    }
                    default:{
                        return bffRoute(req, res);
                    }
                }
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
 * @name serverREST_APIOpenAPI
 * @namespace REST_API
 * @description Server REST API routes using openAPI
 *              Validates if user has access to given resource
 *              Validates using IAM token claims if path requires
 *              Validates calls to circuitbreaker controlled microservices using client_id and client_secret defined for given app
 *              Uses paths defined in app.route() in serverExpress() function
 *              Returns single resource result format or ISO20022 format with either list header format or page header metadata
 *              Returns HTML or {STATIC:boolean, SENDFILE:string|null, SENDCONTENT:string}
 *              /app-module-report-queue-result
 *              /bff/admin/v1/app-module-report
 *              /bff/app/v1/app-module-report
 *              /bff/app/v1/app-module-module
 * 
 *              Returns status 401 if user has not accessed to given resource
 *              Returns status 404 if route is not found
 * @function
 * @param {import('./types.js').server_server_routesparameters} routesparameters
 * @returns {Promise.<*>}
 */
const serverREST_APIOpenAPI = async (routesparameters) =>{
    /**@type{import('../apps/common/src/common.js')} */
    const app_common = await import(`file://${process.cwd()}/apps/common/src/common.js`);
    /**@type{import('./iam.service.js')} */
    const iam_service = await import(`file://${process.cwd()}/server/iam.service.js`);
    /**@type{import('./db/fileModelConfig.js')} */
    const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);
    const URI_query = routesparameters.parameters;
    const URI_path = routesparameters.url.indexOf('?')>-1?routesparameters.url.substring(0, routesparameters.url.indexOf('?')):routesparameters.url;
    const app_query = URI_query?new URLSearchParams(URI_query):null;

    const COMMON_APP_ID = serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID'));
    /**
     * Returns resource id number from URI path or null
     * @param {string} path
     * @returns {number|null}
     */
    const resource_id_get_number = path => path.endsWith('/${resource_id_number}')?serverUtilNumberValue(URI_path.substring(URI_path.lastIndexOf('/') + 1)):null;
    /**
     * Returns resource id string from URI path or null
     * @param {string} path
     * @returns {string|null}
     */
    const resource_id_get_string = path => path.endsWith('/${resource_id_string}')?URI_path.substring(URI_path.lastIndexOf('/') + 1):null;
    /**
     * Return message in ISO20022 format if result contains multi resources
     * @param {*} result 
     * @param {boolean} singleresource
     */
    const iso_return_message = (result, singleresource) =>{
        //if singles resource or pagination then return result
        if (singleresource || result.page_header)
            return result;
        else{
            const list_header = {	total_count:	result.length,
                                    offset: 		serverUtilNumberValue(app_query?.get('offset'))?serverUtilNumberValue(app_query?.get('offset')):0,
                                    count:			serverUtilNumberValue(app_query?.get('limit')) ?? result.length
                                };
            return {list_header:list_header, rows:result};
        }
    };
    /**
     * Validates if user has access to given resource
     * Validates using IAM token claims if path requires
     * @param {{resource_validate_type?: 'id'|'app_id'|null,
     *          resource_validate_value?: string|number|null,
     *          required?: boolean,
     *          resource_validate_app_data_app_id?: number|null,
     *          validate_app_function?:string|null,
     *          validate_app_function_role?:string|null}} params
     * @returns {boolean}
     */
    const validate = params =>{
        //set default values
        params.resource_validate_type = params.resource_validate_type ?? null;
        params.resource_validate_value = params.resource_validate_value ?? null;
        params.required = params.required ?? false;
        params.resource_validate_app_data_app_id = params.resource_validate_app_data_app_id ?? null;
        params.validate_app_function = params.validate_app_function ?? null;
        params.validate_app_function_role = params.validate_app_function_role ?? null;
        const APP_ID_VALIDATE = (params.resource_validate_app_data_app_id == COMMON_APP_ID)?COMMON_APP_ID:routesparameters.app_id;
        //match route path using resource id parameter
        if (
            //match required resource id
            (params.required && URI_path.substring(URI_path.lastIndexOf('/') + 1) == '')==false &&
            //match app data app id
            ((params.resource_validate_app_data_app_id !=null && params.resource_validate_app_data_app_id == APP_ID_VALIDATE) ||params.resource_validate_app_data_app_id==null) &&
            //match app function and app function role
            ((params.validate_app_function && APP_ID_VALIDATE !=null && app_common.commonRegistryAppModule(APP_ID_VALIDATE, {type:'FUNCTION', name:params.validate_app_function?.toUpperCase(), role:params.validate_app_function_role})) || 
                params.validate_app_function == null)){
                if (params.resource_validate_type){
                    if (iam_service.iamAuthenticateResource({  app_id:routesparameters.app_id, 
                                                            ip:routesparameters.ip, 
                                                            authorization:routesparameters.authorization, 
                                                            resource_id:params.resource_validate_value ?? null, 
                                                            scope: 'USER',
                                                            claim_key:params.resource_validate_type}))
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
        
    const routePath = Object.entries(fileModelConfig.get('CONFIG_REST_API').paths)
                        .filter(path=>
                            path[0].replace('/${resource_id_number}', URI_path.substring(URI_path.lastIndexOf('/'))) == URI_path ||
                            path[0].replace('/${resource_id_string}', URI_path.substring(URI_path.lastIndexOf('/'))) == URI_path)[0];
    if (routePath){
        /**
         * @param{string} key
         */
        const getParameter = key => methodObj.parameters.filter((/**@type{*}*/parameter)=>parameter[key])[0]?.[key];

        const methodObj = routePath[1][routesparameters.method.toLowerCase()];
        if (methodObj){
            if (validate({  resource_validate_type:             getParameter('server_validation_resource_key'),
                            resource_validate_value:            getParameter('server_validation_resource_value'),
                            required:                           (getParameter('resource_id_string') ?? getParameter('resource_id_number'))?.required ?? false,
                            resource_validate_app_data_app_id:  getParameter('server_validation_resource_app_data_app_id')?routesparameters.body.data_app_id:null,
                            validate_app_function:              getParameter('server_validation_app_function')?resource_id_get_string(routePath[0]):null,
                            validate_app_function_role:         getParameter('server_validation_app_function')?getParameter('server_validation_app_function_role'):null})){

                //add parameters if used for GET method
                const get_parameters = routesparameters.method=='GET'?
                                            methodObj.parameters
                                                            //exclude keys starting with 'server' and '$ref'
                                                            .filter((/**@type{*}*/key)=>  Object.keys(key)[0]!='description' && 
                                                                                            !Object.keys(key)[0].startsWith('server') && 
                                                                                            !Object.keys(key)[0].startsWith('$ref'))
                                                            .reduce((/**@type{*}*/keys, /**@type{*}*/key)=>{return {...keys, ...{[Object.keys(key)[0]]:app_query?.get(Object.keys(key)[0])}};},{}):
                                                null;
                //read operationId what file to import and what function to execute
                //syntax: [path].[filename].[functioname] or [path]_[path].[filename].[functioname]
                const filePath = '/' + methodObj.operationId.split('.')[0].replaceAll('_','/') + '/' +
                                        methodObj.operationId.split('.')[1] + '.js';
                const functionRESTAPI = methodObj.operationId.split('.')[2];
                const moduleRESTAPI = await import(`file://${process.cwd()}${filePath}`);
                

                //return result using ISO20022 format
                return iso_return_message(await moduleRESTAPI[functionRESTAPI]({
                                        app_id:         getParameter('server_validation_resource_app_data_app_id')?
                                                            (routesparameters.body.data_app_id == COMMON_APP_ID?COMMON_APP_ID ?? routesparameters.app_id:routesparameters.app_id):
                                                                routesparameters.app_id,
                                        iam:            getParameter('server_function_parameter_iam')?routesparameters.res.req.query.iam:null,
                                        authorization:  getParameter('server_function_parameter_authorization')?routesparameters.authorization:null,
                                        user_agent:     getParameter('server_function_parameter_user_agent')?routesparameters.user_agent:null,
                                        accept_language:getParameter('server_function_parameter_accept_language')?routesparameters.accept_language:null,
                                        host:           getParameter('server_function_parameter_accept_host')?routesparameters.host:null,
                                        locale:         getParameter('server_function_parameter_locale')?app_query?.get('lang_code') ??'en':null,
                                        ip:             getParameter('server_function_parameter_ip')?routesparameters.ip:null,
                                        path:           getParameter('server_function_parameter_path')?routesparameters.route_path:null,
                                        query:          getParameter('server_function_parameter_query')?URI_query:null,
                                        method:         getParameter('server_function_parameter_method')?routesparameters.method:null,
                                        data:           getParameter('server_function_parameter_body')?routesparameters.body:{...get_parameters},
                                        endpoint:       getParameter('server_function_parameter_endpoint')?routesparameters.endpoint:null,
                                        resource_id:    getParameter('server_function_parameter_resource_id')?
                                                                (getParameter('resource_id_number')?resource_id_get_number(routePath[0]):resource_id_get_string(routePath[0])):
                                                                    null,
                                        res:            getParameter('server_function_parameter_res')?routesparameters.res:null
                                    //return result in rows keys if resource id is empty or return result in the result object
                                    //exception commonModuleRun used by server functions returning different results should always be multiple
                                    }),functionRESTAPI=='commonModuleRun'?false:(getParameter('resource_id_number')?resource_id_get_number(routePath[0]):resource_id_get_string(routePath[0]))!=null);
            }
            else{
                routesparameters.res.statusMessage = 'resource id not authorized';
                routesparameters.res.statusCode =401;
                throw iam_service.iamUtilMesssageNotAuthorized();
            }
        }
        else{
            routesparameters.res.statusMessage = `route not found: ${routesparameters.endpoint} ${URI_path} ${routesparameters.method}`;
            routesparameters.res.statusCode =404;
            throw iam_service.iamUtilMesssageNotAuthorized();
        }
    }
};
/**
 * @name serverREST_API
 * @namespace REST_API
 * @description Server REST API routes
 *              Validates if user has access to given resource
 *              Validates using IAM token claims if path requires
 *              Validates calls to circuitbreaker controlled microservices using client_id and client_secret defined for given app
 *              Uses paths defined in app.route() in serverExpress() function
 *              Returns single resource result format or ISO20022 format with either list header format or page header metadata
 *              Returns HTML or {STATIC:boolean, SENDFILE:string|null, SENDCONTENT:string}
 *              /app-module-report-queue-result
 *              /bff/admin/v1/app-module-report
 *              /bff/app/v1/app-module-report
 *              /bff/app/v1/app-module-module
 * 
 *              Returns status 401 if user has not accessed to given resource
 *              Returns status 404 if route is not found
 * @function
 * @param {import('./types.js').server_server_routesparameters} routesparameters
 * @returns {Promise.<*>}
 */
 const serverREST_API = async (routesparameters) =>{
    /**@type{import('../microservice/microservice.js')} */
    const microservice = await import(`file://${process.cwd()}/microservice/microservice.js`);

    /**@type{import('../apps/common/src/common.js')} */
    const app_common = await import(`file://${process.cwd()}/apps/common/src/common.js`);

    /**@type{import('./iam.service.js')} */
    const iam_service = await import(`file://${process.cwd()}/server/iam.service.js`);

    /**@type{import('./info.js')} */
    const info = await import(`file://${process.cwd()}/server/info.js`);
    
    /**@type{import('./socket.js')} */
    const socket = await import(`file://${process.cwd()}/server/socket.js`);

    /**@type{import('./db/dbModelDatabase.js')} */
    const dbModelDatabase = await import(`file://${process.cwd()}/server/db/dbModelDatabase.js`);

    /**@type{import('./db/dbModelAppDataEntity.js')} */
    const dbModelAppDataEntity = await import(`file://${process.cwd()}/server/db/dbModelAppDataEntity.js`);

    /**@type{import('./db/dbModelAppDataEntityResource.js')} */
    const dbModelAppDataEntityResource = await import(`file://${process.cwd()}/server/db/dbModelAppDataEntityResource.js`);

    /**@type{import('./db/dbModelAppDataResourceMaster.js')} */
    const dbModelAppDataResourceMaster = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceMaster.js`);

    /**@type{import('./db/dbModelAppDataResourceDetail.js')} */
    const dbModelAppDataResourceDetail = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceDetail.js`);

    /**@type{import('./db/dbModelAppDataResourceDetailData.js')} */
    const dbModelAppDataResourceDetailData = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceDetailData.js`);

    /**@type{import('./db/dbModelAppDataStat.js')} */
    const dbModelAppDataStat = await import(`file://${process.cwd()}/server/db/dbModelAppDataStat.js`);

    /**@type{import('./db/dbModelAppSetting.js')} */
    const dbModelAppSetting = await import(`file://${process.cwd()}/server/db/dbModelAppSetting.js`);

    /**@type{import('./db/dbModelIdentityProvider.js')} */
    const dbModelIdentityProvider = await import(`file://${process.cwd()}/server/db/dbModelIdentityProvider.js`);
   
    /**@type{import('./db/dbModelUserAccount.js')} */
    const dbModelUserAccount = await import(`file://${process.cwd()}/server/db/dbModelUserAccount.js`);

    /**@type{import('./db/dbModelUserAccountFollow.js')} */
    const dbModelUserAccountFollow = await import(`file://${process.cwd()}/server/db/dbModelUserAccountFollow.js`);

    /**@type{import('./db/dbModelUserAccountLike.js')} */
    const dbModelUserAccountLike = await import(`file://${process.cwd()}/server/db/dbModelUserAccountLike.js`);

    /**@type{import('./db/dbModelUserAccountApp.js')} */
    const dbModelUserAccountApp = await import(`file://${process.cwd()}/server/db/dbModelUserAccountApp.js`);

    /**@type{import('./db/dbModelUserAccountAppDataPost.js')} */
    const dbModelUserAccountAppDataPost = await import(`file://${process.cwd()}/server/db/dbModelUserAccountAppDataPost.js`);
    
    /**@type{import('./db/dbModelUserAccountAppDataPostLike.js')} */
    const dbModelUserAccountAppDataPostLike = await import(`file://${process.cwd()}/server/db/dbModelUserAccountAppDataPostLike.js`);

    /**@type{import('./db/fileModelApp.js')} */
    const fileModelApp = await import(`file://${process.cwd()}/server/db/fileModelApp.js`);

    /**@type{import('./db/fileModelAppModule.js')} */
    const fileModelAppModule = await import(`file://${process.cwd()}/server/db/fileModelAppModule.js`);

    /**@type{import('./db/fileModelAppModuleQueue.js')} */
    const fileModelAppModuleQueue = await import(`file://${process.cwd()}/server/db/fileModelAppModuleQueue.js`);

    /**@type{import('./db/fileModelAppParameter.js')} */
    const fileModelAppParameter = await import(`file://${process.cwd()}/server/db/fileModelAppParameter.js`);

    /**@type{import('./db/fileModelAppSecret.js')} */
    const fileModelAppSecret = await import(`file://${process.cwd()}/server/db/fileModelAppSecret.js`);

    /**@type{import('./db/fileModelLog.js')} */
    const fileModelLog = await import(`file://${process.cwd()}/server/db/fileModelLog.js`);

    /**@type{import('./db/fileModelConfig.js')} */
    const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);

    return new Promise((resolve, reject)=>{
        try {
            const resource_id_string = ':RESOURCE_ID';
            const URI_query = routesparameters.parameters;
            const URI_path = routesparameters.url.indexOf('?')>-1?routesparameters.url.substring(0, routesparameters.url.indexOf('?')):routesparameters.url;
            const app_query = URI_query?new URLSearchParams(URI_query):null;

            const COMMON_APP_ID = serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID'));
            let resource_id_iamUtilResponseNotAuthorized = false;
            /**
             * Returns resource id number from URI path
             * @returns {number|null}
             */
            const resource_id_get_number = () => serverUtilNumberValue(URI_path.substring(URI_path.lastIndexOf('/') + 1));
            /**
             * Returns resource id string from URI path
             * @returns {string|null}
             */
            const resource_id_get_string = () => URI_path.substring(URI_path.lastIndexOf('/') + 1);
            /**
             * Return message in ISO20022 format if result contains multi resources
             * @param {*} result 
             * @param {boolean} singleresource
             */
            const iso_return_message = (result, singleresource) =>{
                //if singles resource or pagination then return result
                if (singleresource || result.page_header)
                    return result;
                else{
                    const list_header = {	total_count:	result.length,
                                            offset: 		serverUtilNumberValue(app_query?.get('offset'))?serverUtilNumberValue(app_query?.get('offset')):0,
                                            count:			serverUtilNumberValue(app_query?.get('limit')) ?? result.length
                                        };
                    return {list_header:list_header, rows:result};
                }
            };
            /**
             * Validates if user has access to given resource
             * Validates using IAM token claims if path requires
             * @param {{url:string,
             *          method:string,
             *          resource_validate_type?: 'id'|'app_id'|null,
             *          resource_validate_value?: string|number|null,
             *          required?: boolean,
             *          resource_validate_app_data_app_id?: number|null,
             *          validate_app_function?:string|null,
             *          validate_app_function_role?:string|null}} params
             * @returns {boolean}
             */
            const route = params =>{
                //set default values
                params.resource_validate_type = params.resource_validate_type ?? null;
                params.resource_validate_value = params.resource_validate_value ?? null;
                params.required = params.required ?? false;
                params.resource_validate_app_data_app_id = params.resource_validate_app_data_app_id ?? null;
                params.validate_app_function = params.validate_app_function ?? null;
                params.validate_app_function_role = params.validate_app_function_role ?? null;
                const APP_ID_VALIDATE = (params.resource_validate_app_data_app_id == COMMON_APP_ID)?COMMON_APP_ID:routesparameters.app_id;
                //match route path using resource id parameter
                if ((params.url.endsWith('/' + resource_id_string)?params.url.replace('/' + resource_id_string, URI_path.substring(URI_path.lastIndexOf('/'))):params.url) == URI_path && 
                    //match method
                    params.method == routesparameters.method && 
                    //match required resource id
                    (params.required && URI_path.substring(URI_path.lastIndexOf('/') + 1) == '')==false &&
                    //match app data app id
                    ((params.resource_validate_app_data_app_id !=null && params.resource_validate_app_data_app_id == APP_ID_VALIDATE) ||params.resource_validate_app_data_app_id==null) &&
                    //match app function and app function role
                    ((params.validate_app_function && APP_ID_VALIDATE !=null && app_common.commonRegistryAppModule(APP_ID_VALIDATE, {type:'FUNCTION', name:params.validate_app_function?.toUpperCase(), role:params.validate_app_function_role})) || 
                        params.validate_app_function == null)){
                    if (params.resource_validate_type){
                        if (iam_service.iamAuthenticateResource({  app_id:routesparameters.app_id, 
                                                                ip:routesparameters.ip, 
                                                                authorization:routesparameters.authorization, 
                                                                resource_id:params.resource_validate_value ?? null, 
                                                                scope: 'USER',
                                                                claim_key:params.resource_validate_type}))
                            return true;
                        else{
                            resource_id_iamUtilResponseNotAuthorized = true;
                            return false;
                        }
                    }
                    else
                        return true;
                    }
                else
                    return false;
            };
                                        
            //using switch (true) pattern
            switch (true){
                //server routes
                //app data open routes to apps that got id token at start
                case route({url:`/bff/app_id/v1/app-common/${resource_id_string}`, method:'GET'}):{
                    resolve(app_common.commonAppsGet({app_id:routesparameters.app_id, 
                                                      resource_id:resource_id_get_number(), 
                                                      locale:app_query?.get('lang_code') ??'en'})
                                .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                    break;
                }
                case route({url:`/bff/app_id/v1/server-socket/socket-status/${resource_id_string}`, method:'GET', required:true}):{
                    resolve(iso_return_message(socket.CheckOnline({resource_id:resource_id_get_number()}), true));
                    break;
                }
                case route({url:'/bff/app_id/v1/server-db/identity_provider', method:'GET'}):{
                    resolve(dbModelIdentityProvider.get({app_id:routesparameters.app_id})
                                .then(result=>iso_return_message(result, false)));
                    break;
                }
                //app settings all values with or without translations including all common app id settings if requested setting is empty
                case route({url:'/bff/app_id/v1/server-db/app_settings', method:'GET'}):{
                    resolve(dbModelAppSetting.get({ app_id:routesparameters.app_id, 
                                                    data:{setting_type:app_query?.get('setting_type')??''}, 
                                                    locale:app_query?.get('lang_code')??'en'})
                                .then(result=>iso_return_message(result, false)));
                    break;
                }
                //app settings without translations and only value if specified
                case route({url:'/bff/app_id/v1/server-db/app_settings_display', method:'GET'}):{
                    resolve(dbModelAppSetting.getDisplayData({app_id:routesparameters.app_id, 
                                                                data:{setting_type:app_query?.get('setting_type'),
                                                                      data_app_id:app_query?.get('data_app_id'),
                                                                      value:app_query?.get('value')
                                                                    }
                                                            })
                                .then(result=>iso_return_message(result, false)));
                    break;
                }
                case route({url:`/bff/app_id/v1/server-db/user_account-activate/${resource_id_string}`, method:'PUT', 
                            resource_validate_type:'id', resource_validate_value:resource_id_get_number(), required:true}):{
                    resolve(iam_service.iamAuthenticateUserActivate({   app_id:routesparameters.app_id, 
                                                                        /**@ts-ignore */
                                                                        resource_id:resource_id_get_number(),
                                                                        ip:routesparameters.ip, 
                                                                        user_agent:routesparameters.user_agent, 
                                                                        accept_language:routesparameters.accept_language, 
                                                                        host:routesparameters.host, 
                                                                        locale:app_query?.get('lang_code')??'en',
                                                                        data:routesparameters.body, 
                                                                        res:routesparameters.res}));
                    break;
                }
                case route({url:'/bff/app_id/v1/server-db/user_account-forgot', method:'POST'}):{
                    resolve(iam_service.iamAuthenticateUserForgot({ app_id:routesparameters.app_id, 
                                                                    ip:routesparameters.ip, 
                                                                    user_agent:routesparameters.user_agent, 
                                                                    accept_language:routesparameters.accept_language, 
                                                                    host:routesparameters.host, 
                                                                    data:routesparameters.body}));
                    break;
                }
                case route({url:'/bff/app_id/v1/server-db/user_account-profile-stat', method:'GET'}):{
                    resolve(dbModelUserAccount.getProfileStat({ app_id:routesparameters.app_id, 
                                                                data:{statchoice:app_query?.get('statchoice')}})
                                .then(result=>iso_return_message(result, false)));
                    break;
                }
                case route({url:`/bff/app_id/v1/server-db/user_account-profile-name/${resource_id_string}`, method:'GET'}):{
                    resolve(dbModelUserAccount.getProfile({ app_id:routesparameters.app_id, 
                                                            resource_id:resource_id_get_string(),
                                                            ip:routesparameters.ip, 
                                                            user_agent:routesparameters.user_agent, 
                                                            data: { resource_id_type:'string',
                                                                    id:app_query?.get('id'),
                                                                    search:app_query?.get('search'),
                                                                    client_latitude:app_query?.get('client_latitude'),
                                                                    client_longitude:app_query?.get('client_longitude'),
                                                                    POST_ID:app_query?.get('POST_ID')
                                                            },
                                                            locale:app_query?.get('lang_code') ??'en', 
                                                            res:routesparameters.res})
                                .then(result=>iso_return_message(result, resource_id_get_string()!=null)));
                    break;
                }
                case route({url:`/bff/app_id/v1/server-db/user_account-profile/${resource_id_string}`, method:'GET'}):{
                    resolve(dbModelUserAccount.getProfile({ app_id:routesparameters.app_id, 
                                                            resource_id:resource_id_get_number(), 
                                                            ip:routesparameters.ip, 
                                                            user_agent:routesparameters.user_agent, 
                                                            data: { resource_id_type:'number',
                                                                    id:app_query?.get('id'),
                                                                    search:app_query?.get('search'),
                                                                    client_latitude:app_query?.get('client_latitude'),
                                                                    client_longitude:app_query?.get('client_longitude'),
                                                                    POST_ID:app_query?.get('POST_ID')
                                                            },
                                                            locale:app_query?.get('lang_code') ??'en', 
                                                            res:routesparameters.res})
                                .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                    break;
                }
                case route({url:`/bff/app_id/v1/server-db/user_account_app_data_post/${resource_id_string}`, method:'GET', required:true}):{
                    resolve(dbModelUserAccountAppDataPost.getUserPostsByUserId({app_id:routesparameters.app_id, 
                                                                                resource_id:resource_id_get_number(), 
                                                                                locale:app_query?.get('lang_code') ??'en', 
                                                                                res:routesparameters.res})
                                .then(result=>iso_return_message(result, true)));
                    break;
                }
                case route({url:`/bff/app_id/v1/server-db/user_account_app_data_post-profile-stat-like/${resource_id_string}`, method:'GET', required: true}):{
                    resolve(dbModelUserAccountAppDataPost.getProfileStatLike({  app_id:routesparameters.app_id, 
                                                                                resource_id:resource_id_get_number(), 
                                                                                locale:app_query?.get('lang_code') ??'en', 
                                                                                res:routesparameters.res})
                                .then(result=>iso_return_message(result, true)));
                    break;
                }
                case route({url:`/bff/app_id/v1/server-db/user_account_app_data_post-profile/${resource_id_string}`, method:'GET',required:true}):{
                    resolve(dbModelUserAccountAppDataPost.getProfileUserPosts({app_id:routesparameters.app_id, 
                                                                                resource_id:resource_id_get_number(), 
                                                                                data:{id_current_user:app_query?.get('id_current_user')},
                                                                                locale:app_query?.get('lang_code') ??'en', 
                                                                                res:routesparameters.res})
                                .then(result=>iso_return_message(result, true)));
                    break;
                }
                case route({url:'/bff/app_id/v1/server-db/user_account_app_data_post-profile-stat', method:'GET'}):{
                    resolve(dbModelUserAccountAppDataPost.getProfileStatPost({  app_id:routesparameters.app_id, 
                                                                                data:{statchoice:app_query?.get('statchoice')},
                                                                                locale:   app_query?.get('lang_code') ??'en', 
                                                                                res:   routesparameters.res})
                                .then(result=>iso_return_message(result, false)));
                    break;
                }
                //server module metadata 
                case route({url:`/bff/admin/v1/app-module-metadata/${resource_id_string}`, method:'GET'}):{
                    resolve(app_common.commonModuleMetaDataGet({app_id: routesparameters.app_id, 
                                                                /**@ts-ignore */
                                                                data:{type:app_query?.get('type')},
                                                                /**@ts-ignore */
                                                                resource_id:resource_id_get_number(),
                                                                res:routesparameters.res})
                            .then((result=>iso_return_message(result, resource_id_get_number()!=null)))); 
                    break;
                }
                //server module of type REPORT for APP
                case route({url:`/bff/admin/v1/app-module-report/${resource_id_string}`, method:'GET', required:true}):
                case route({url:`/bff/app/v1/app-module-report/${resource_id_string}`, method:'GET', required:true}):{
                    resolve(app_common.commonModuleGet({
                                                        app_id: routesparameters.app_id, 
                                                        resource_id:resource_id_get_string() ?? '', //module id
                                                        /**@ts-ignore */
                                                        data:{  type:app_query?.get('type'),
                                                                reportid:app_query?.get('reportid')??''
                                                            }, 
                                                        user_agent:routesparameters.user_agent,
                                                        ip:routesparameters.ip,
                                                        locale:app_query?.get('lang_code') ??'en',
                                                        endpoint:routesparameters.endpoint,
                                                        res:routesparameters.res})
                            .then((result=>iso_return_message(result, true)))); 
                    break;
                }
                case route({url:`/bff/admin/v1/app-module-report-queue/${resource_id_string}`, method:'GET'}):{
                    resolve(iso_return_message(fileModelAppModuleQueue.get({app_id:routesparameters.app_id, 
                                                                            resource_id:resource_id_get_number(), 
                                                                            res:routesparameters.res}),
                                                resource_id_get_number()!=null));
                    break;
                }
                case route({url:`/bff/admin/v1/app-module-report-queue-result/${resource_id_string}`, method:'GET'}):{
                    resolve(fileModelAppModuleQueue.getResult({app_id: routesparameters.app_id, 
                                                                resource_id:resource_id_get_number()})
                            .then((result=>iso_return_message(result, resource_id_get_number()!=null)))); 
                    break;
                }
                case route({url:`/bff/admin/v1/app-module-report-queue/${resource_id_string}`, method:'POST', required:true}):{
                    resolve(app_common.commonAppReportQueue({
                        app_id: routesparameters.app_id, 
                        resource_id:resource_id_get_string() ?? '', //module id
                        iam:routesparameters.res.req.query.iam,
                        data:routesparameters.body, 
                        user_agent:routesparameters.user_agent,
                        ip:routesparameters.ip,
                        locale:app_query?.get('lang_code') ??'en',
                        endpoint:routesparameters.endpoint,
                        res:routesparameters.res}));
                    break;
                }
                //server module of type MODULE for APP
                case route({url:`/bff/app/v1/app-module-module/${resource_id_string}`, method:'GET'}):{
                    resolve(app_common.commonModuleGet({
                                                        app_id: routesparameters.app_id, 
                                                        resource_id:resource_id_get_string() ?? '', //module id
                                                        /**@ts-ignore */
                                                        data:{type:app_query?.get('type')}, 
                                                        user_agent:routesparameters.user_agent,
                                                        ip:routesparameters.ip,
                                                        locale:app_query?.get('lang_code') ??'en',
                                                        endpoint:routesparameters.endpoint,
                                                        res:routesparameters.res})
                            .then((result=>iso_return_message(result, resource_id_get_number()!=null)))); 
                    break;
                }                
                //server module of type FUNCTION  for app_data, app_external or app_access
                case route({url:`/bff/app_id/v1/app-module-function/${resource_id_string}`, method:'POST', 
                            resource_validate_app_data_app_id: routesparameters.body.data_app_id, required:true, validate_app_function:resource_id_get_string(), validate_app_function_role:'APP_ID'}):
                case route({url:`/bff/app_external/v1/app-module-function/${resource_id_string}`, method:'POST', 
                            validate_app_function:resource_id_get_string(), validate_app_function_role:'APP_EXTERNAL'}):
                case route({url:`/bff/app_access/v1/app-module-function/${resource_id_string}`, method:'POST', 
                    resource_validate_app_data_app_id: routesparameters.body.data_app_id, resource_validate_type:'id', resource_validate_value:routesparameters.body.user_account_id, required:true, validate_app_function:resource_id_get_string(), validate_app_function_role:'APP_ACCESS'}):{
                    //call COMMON_APP_ID function if requested or call the function registered on the app
                    resolve(app_common.commonModuleRun({
                                            app_id:(routesparameters.body.data_app_id == COMMON_APP_ID)?COMMON_APP_ID ?? routesparameters.app_id:routesparameters.app_id, 
                                            resource_id:resource_id_get_string() ?? '', 
                                            data:routesparameters.body, 
                                            user_agent:routesparameters.user_agent,
                                            ip:routesparameters.ip,
                                            locale:app_query?.get('lang_code') ??'en',
                                            endpoint:routesparameters.endpoint,
                                            res:routesparameters.res}).then(result=>iso_return_message(result, false)));
                    break;
                }
                //app access routes, for users with an access token
                case route({url:`/bff/app_access/v1/server-db/user_account-password/${resource_id_string}`, method:'PATCH', 
                            resource_validate_type:'id', resource_validate_value:resource_id_get_number(), required:true}):{
                    resolve(dbModelUserAccount.updatePassword({app_id:routesparameters.app_id, 
                                                                resource_id:resource_id_get_number(), 
                                                                ip:routesparameters.ip, 
                                                                user_agent:routesparameters.user_agent, 
                                                                host:routesparameters.host, 
                                                                accept_language:routesparameters.accept_language, 
                                                                data:routesparameters.body, 
                                                                locale:app_query?.get('lang_code') ??'en',
                                                                res:routesparameters.res}));
                    break;
                }
                //admin can update any user and uses same function as users
                //user can only update their own records
                case route({url:`/bff/admin/v1/server-db/user_account/${resource_id_string}`, method:'PATCH', 
                            resource_validate_type:'id', resource_validate_value:resource_id_get_number(), required:true}):
                case route({url:`/bff/app_access/v1/server-db/user_account/${resource_id_string}`, method:'PATCH', 
                            resource_validate_type:'id', resource_validate_value:resource_id_get_number(), required:true}):{
                    resolve(iam_service.iamAuthenticateUserUpdate({app_id:routesparameters.app_id, 
                                                                    /**@ts-ignore */
                                                                    resource_id:resource_id_get_number(), 
                                                                    ip:routesparameters.ip, 
                                                                    user_agent:routesparameters.user_agent, 
                                                                    host:routesparameters.host, 
                                                                    accept_language:routesparameters.accept_language, 
                                                                    data:routesparameters.body, 
                                                                    locale:app_query?.get('lang_code') ??'en',
                                                                    res:routesparameters.res}));
                    break;
                }
                case route({url:`/bff/app_access/v1/server-db/user_account/${resource_id_string}`, method:'GET', 
                            resource_validate_type:'id', resource_validate_value:resource_id_get_number(), required:true}):{
                    resolve(dbModelUserAccount.getUserByUserId({app_id:routesparameters.app_id, 
                                                                /**@ts-ignore */
                                                                resource_id:resource_id_get_number(), 
                                                                locale:app_query?.get('lang_code') ??'en',
                                                                res:routesparameters.res})
                                .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                    break;
                }
                case route({url:`/bff/app_access/v1/server-db/user_account-common/${resource_id_string}`, method:'PATCH', 
                            resource_validate_type:'id', resource_validate_value:resource_id_get_number(), required:true}):{
                    resolve(dbModelUserAccount.updateUserCommon({app_id:routesparameters.app_id, 
                                                                /**@ts-ignore */
                                                                resource_id:resource_id_get_number(), 
                                                                data:routesparameters.body, 
                                                                locale:app_query?.get('lang_code') ??'en',
                                                                res:routesparameters.res}));
                    break;
                }
                case route({url:`/bff/app_access/v1/server-db/user_account/${resource_id_string}`, method:'DELETE', 
                            resource_validate_type:'id', resource_validate_value:resource_id_get_number(), required:true}):{
                    resolve(iam_service.iamAuthenticateUserDelete({app_id:routesparameters.app_id, 
                                                                    /**@ts-ignore */
                                                                    resource_id:resource_id_get_number(), 
                                                                    data:routesparameters.body, 
                                                                    locale:app_query?.get('lang_code') ??'en',
                                                                    res:routesparameters.res}));
                    break;
                }
                case route({url:`/bff/app_access/v1/server-db/user_account-profile-detail/${resource_id_string}`, method:'GET', required:true}):{
                    resolve(dbModelUserAccount.getProfileDetail({   app_id:routesparameters.app_id, 
                                                                    /**@ts-ignore */
                                                                    resource_id:resource_id_get_number(), 
                                                                    data:{detailchoice:app_query?.get('detailchoice')},
                                                                    res:routesparameters.res})
                                .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                    break;
                }
                case route({url:`/bff/app_access/v1/server-db/user_account_follow/${resource_id_string}`, method:'POST', 
                            resource_validate_type:'id', resource_validate_value:resource_id_get_number(), required:true}):{
                    resolve(dbModelUserAccountFollow.post({ app_id:routesparameters.app_id, 
                                                            /**@ts-ignore */
                                                            resource_id:resource_id_get_number(), 
                                                            data:routesparameters.body}));
                    break;
                }
                case route({url:`/bff/app_access/v1/server-db/user_account_follow/${resource_id_string}`, method:'DELETE', 
                            resource_validate_type:'id', resource_validate_value:resource_id_get_number(), required:true}):{
                    resolve(dbModelUserAccountFollow.deleteRecord({app_id:routesparameters.app_id, 
                                                                    /**@ts-ignore */
                                                                    resource_id:resource_id_get_number(), 
                                                                    data:routesparameters.body}));
                    break;
                }
                case route({url:`/bff/app_access/v1/server-db/user_account_like/${resource_id_string}`, method:'POST', 
                            resource_validate_type:'id', resource_validate_value:resource_id_get_number(), required:true}):{
                    resolve(dbModelUserAccountLike.post({   app_id:routesparameters.app_id, 
                                                            /**@ts-ignore */
                                                            resource_id:resource_id_get_number(), 
                                                            data:routesparameters.body}));
                    break;
                }
                case route({url:`/bff/app_access/v1/server-db/user_account_like/${resource_id_string}`, method:'DELETE', 
                            resource_validate_type:'id', resource_validate_value:resource_id_get_number(), required:true}):{
                    resolve(dbModelUserAccountLike.deleteRecord({   app_id:routesparameters.app_id, 
                                                                    /**@ts-ignore */
                                                                    resource_id:resource_id_get_number(), 
                                                                    data:routesparameters.body}));
                    break;
                }
                case route({url:`/bff/app_access/v1/server-db/user_account_app/${resource_id_string}`, method:'GET', 
                            resource_validate_type:'id', resource_validate_value:resource_id_get_number(), required:true}):{
                    resolve(dbModelUserAccountApp.get({ app_id:routesparameters.app_id, 
                                                        /**@ts-ignore */
                                                        resource_id:resource_id_get_number()})
                                .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                    break;
                }
                case route({url:`/bff/app_access/v1/server-db/user_account_app-apps/${resource_id_string}`, method:'GET', required:true}):{
                    resolve(dbModelUserAccountApp.getApps({ app_id:routesparameters.app_id, 
                                                            /**@ts-ignore */
                                                            resource_id:resource_id_get_number(),
                                                            locale:app_query?.get('lang_code') ??'en'})
                                .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                    break;
                }
                case route({url:`/bff/app_access/v1/server-db/user_account_app/${resource_id_string}`, method:'PATCH', 
                            resource_validate_type:'id', resource_validate_value:resource_id_get_number(), required:true}):{
                    resolve(dbModelUserAccountApp.update({  app_id:routesparameters.app_id, 
                                                            /**@ts-ignore */
                                                            resource_id:resource_id_get_number(), 
                                                            data:routesparameters.body}));
                    break;
                }
                case route({url:`/bff/app_access/v1/server-db/user_account_app/${resource_id_string}`, method:'DELETE', 
                            resource_validate_type:'id', resource_validate_value:resource_id_get_number(), required:true}):{
                    resolve(dbModelUserAccountApp.deleteRecord({app_id:routesparameters.app_id, 
                                                                /**@ts-ignore */
                                                                resource_id:resource_id_get_number(), 
                                                                data:routesparameters.body}));
                    break;
                }
                case route({url:`/bff/app_access/v1/server-db/user_account_app_data_post-profile-detail/${resource_id_string}`, method:'GET', required:true}):{
                    resolve(dbModelUserAccountAppDataPost.getProfileUserPostDetail({app_id:routesparameters.app_id, 
                                                                                    /**@ts-ignore */
                                                                                    resource_id:resource_id_get_number(), 
                                                                                    data:{detailchoice:app_query?.get('detailchoice')},
                                                                                    locale:app_query?.get('lang_code') ??'en', 
                                                                                    res:routesparameters.res})
                                .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                    break;
                }
                case route({url:'/bff/app_access/v1/server-db/user_account_app_data_post', method:'POST', 
                            resource_validate_type:'id', resource_validate_value:routesparameters.body.user_account_id}):{
                    resolve(dbModelUserAccountAppDataPost.createUserPost({  app_id:routesparameters.app_id, 
                                                                            locale:app_query?.get('lang_code') ??'en', 
                                                                            data:routesparameters.body}));
                    break;
                }
                case route({url:`/bff/app_access/v1/server-db/user_account_app_data_post/${resource_id_string}`, method:'PUT', 
                            resource_validate_type:'id', resource_validate_value:routesparameters.body.user_account_id, required:true}):{
                    resolve(dbModelUserAccountAppDataPost.updateUserPost({  app_id:routesparameters.app_id, 
                                                                            /**@ts-ignore */
                                                                            resource_id:resource_id_get_number(), 
                                                                            data:routesparameters.body, 
                                                                            locale:app_query?.get('lang_code') ??'en', 
                                                                            res:routesparameters.res}));
                    break;
                }
                case route({url:`/bff/app_access/v1/server-db/user_account_app_data_post/${resource_id_string}`, method:'DELETE', 
                            resource_validate_type:'id', resource_validate_value:routesparameters.body.user_account_id, required:true}):{
                    resolve(dbModelUserAccountAppDataPost.deleteUserPost({  app_id:routesparameters.app_id, 
                                                                            /**@ts-ignore */
                                                                            resource_id:resource_id_get_number(), 
                                                                            data:routesparameters.body, 
                                                                            locale:app_query?.get('lang_code') ??'en', 
                                                                            res:routesparameters.res}));
                    break;
                }
                case route({url:`/bff/app_access/v1/server-db/user_account_app_data_post_like/${resource_id_string}`, method:'POST', 
                            resource_validate_type:'id', resource_validate_value:resource_id_get_number(), required:true}):{
                    resolve(dbModelUserAccountAppDataPostLike.post({app_id:routesparameters.app_id, 
                                                                    /**@ts-ignore */
                                                                    resource_id:resource_id_get_number(), 
                                                                    data:routesparameters.body}));
                    break;
                }
                case route({url:`/bff/app_access/v1/server-db/user_account_app_data_post_like/${resource_id_string}`, method:'DELETE', 
                            resource_validate_type:'id', resource_validate_value:resource_id_get_number(), required:true}):{
                    resolve(dbModelUserAccountAppDataPostLike.deleteRecord({app_id:routesparameters.app_id, 
                                                                            /**@ts-ignore */
                                                                            resource_id:resource_id_get_number(), 
                                                                            data:routesparameters.body}));
                    break;
                }
                //admin routes and available only in admin app with admin token
                case route({url:`/bff/admin/v1/server-db/app_data_entity/${resource_id_string}`, method:'GET'}):{
                    resolve(dbModelAppDataEntity.get({  app_id:routesparameters.app_id, 
                                                        resource_id:resource_id_get_number(), 
                                                        data:{data_app_id:app_query?.get('data_app_id')}
                                                        })
                                .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                    break;
                }
                case route({url:`/bff/admin/v1/server-db/app_data_entity_resource/${resource_id_string}`, method:'GET'}):{
                    resolve(dbModelAppDataEntityResource.get({  app_id:routesparameters.app_id, 
                                                                resource_id:resource_id_get_number(),   
                                                                data:{entity_id:app_query?.get('entity_id'),
                                                                      data_app_id:app_query?.get('data_app_id'),
                                                                      resource_name:app_query?.get('resource_name')}
                                                                })
                                .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                    break;
                }
                case route({url:`/bff/admin/v1/server-db/app_data_resource_master/${resource_id_string}`, method:'GET'}):{
                    resolve(dbModelAppDataResourceMaster.get({  app_id:routesparameters.app_id, 
                                                                resource_id:resource_id_get_number(), 
                                                                data:{
                                                                    user_null:app_query?.get('user_null'),
                                                                    user_account_id:app_query?.get('user_account_id'),
                                                                    data_app_id:app_query?.get('data_app_id'),
                                                                    resource_name:app_query?.get('resource_name'),
                                                                    entity_id:app_query?.get('entity_id')
                                                                }})
                                .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                    break;
                }
                case route({url:'/bff/admin/v1/server-db/app_data_resource_master', method:'POST'}):{
                    resolve(dbModelAppDataResourceMaster.post({app_id:routesparameters.app_id, 
                                                                data:routesparameters.body}));
                    break;
                }
                case route({url:`/bff/admin/v1/server-db/app_data_resource_master/${resource_id_string}`, method:'PUT'}):{
                    resolve(dbModelAppDataResourceMaster.update({   app_id:routesparameters.app_id, 
                                                                    resource_id:resource_id_get_number(), 
                                                                    data:routesparameters.body}));
                    break;
                }
                case route({url:`/bff/admin/v1/server-db/app_data_resource_master/${resource_id_string}`, method:'DELETE', required:true}):{
                    resolve(dbModelAppDataResourceMaster.deleteRecord({app_id:routesparameters.app_id, 
                                                                        resource_id:resource_id_get_number(),
                                                                        data:routesparameters.body}));
                    break;
                }
                case route({url:`/bff/admin/v1/server-db/app_data_resource_detail/${resource_id_string}`, method:'GET'}):{
                    resolve(dbModelAppDataResourceDetail.get({  app_id:routesparameters.app_id, 
                                                                resource_id:resource_id_get_number(),
                                                                data:{  user_null:app_query?.get('user_null'),
                                                                        master_id:app_query?.get('master_id'),
                                                                        user_account_id:app_query?.get('user_account_id'),
                                                                        data_app_id:app_query?.get('data_app_id'),
                                                                        resource_name:app_query?.get('resource_name'),
                                                                        entity_id:app_query?.get('entity_id')}}
                                                            )
                                .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                    break;
                }
                case route({url:'/bff/admin/v1/server-db/app_data_resource_detail', method:'POST'}):{
                    resolve(dbModelAppDataResourceDetail.post({app_id:routesparameters.app_id, data:routesparameters.body}));
                    break;
                }
                case route({url:`/bff/admin/v1/server-db/app_data_resource_detail/${resource_id_string}`, method:'PUT', required:true}):{
                    resolve(dbModelAppDataResourceDetail.update({   app_id:routesparameters.app_id, 
                                                                    resource_id:resource_id_get_number(), 
                                                                    data:routesparameters.body}));
                    break;
                }
                case route({url:`/bff/admin/v1/server-db/app_data_resource_detail/${resource_id_string}`, method:'DELETE', required:true}):{
                    resolve(dbModelAppDataResourceDetail.deleteRecord({app_id:routesparameters.app_id, 
                                                                        resource_id:resource_id_get_number(),
                                                                        data:routesparameters.body}));
                    break;
                }
                case route({url:`/bff/admin/v1/server-db/app_data_resource_detail_data/${resource_id_string}`, method:'GET'}):{
                    resolve(dbModelAppDataResourceDetailData.get({  app_id:routesparameters.app_id, 
                                                                    resource_id:resource_id_get_number(), 
                                                                    data:{  user_null:app_query?.get('user_null'),
                                                                            app_data_detail_id:app_query?.get('app_data_detail_id'),
                                                                            user_account_id:app_query?.get('user_account_id'),
                                                                            data_app_id:app_query?.get('data_app_id'),
                                                                            resource_name_type:app_query?.get('resource_name_type'),
                                                                            resource_name:app_query?.get('resource_name'),
                                                                            resource_name_master_attribute_type:app_query?.get('resource_name_master_attribute_type'),
                                                                            resource_name_master_attribute:app_query?.get('resource_name_master_attribute'),
                                                                            resource_name_data_master_attribute_type:app_query?.get('resource_name_data_master_attribute_type'),
                                                                            resource_name_data_master_attribute:app_query?.get('resource_name_data_master_attribute'),
                                                                            entity_id:app_query?.get('entity_id')}})
                            .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                    break;
                }
                case route({url:'/bff/admin/v1/server-db/app_data_resource_detail_data', method:'POST'}):{
                        resolve(dbModelAppDataResourceDetailData.post({app_id:routesparameters.app_id, data:routesparameters.body}));
                        break;
                }
                case route({url:`/bff/admin/v1/server-db/app_data_resource_detail_data/${resource_id_string}`, method:'PUT', required:true}):{
                    resolve(dbModelAppDataResourceDetailData.update({   app_id:routesparameters.app_id, 
                                                                        /**@ts-ignore */
                                                                        resource_id:resource_id_get_number(), 
                                                                        data:routesparameters.body}));
                    break;
                }
                case route({url:`/bff/admin/v1/server-db/app_data_resource_detail_data/${resource_id_string}`, method:'DELETE', required:true}):{
                    resolve(dbModelAppDataResourceDetailData.deleteRecord({ app_id:routesparameters.app_id, 
                                                                            /**@ts-ignore */
                                                                            resource_id:resource_id_get_number(),
                                                                            data:routesparameters.body}));
                    break;
                }
                case route({url:'/bff/admin/v1/server-db/app_data_stat', method:'GET'}):{
                    resolve(dbModelAppDataStat.get({app_id:routesparameters.app_id, 
                                                    data:{  id:app_query?.get('id'),
                                                            data_app_id:app_query?.get('data_app_id'),
                                                            resource_name_entity:app_query?.get('resource_name_entity')}})
                            .then(result=>iso_return_message(result, false)));
                    break;
                }
                case route({url:'/bff/admin/v1/server-db_admin/app_data_stat-log', method:'GET'}):{
                    resolve(dbModelAppDataStat.getLog({app_id:routesparameters.app_id, 
                                                        data:{  sort:app_query?.get('sort'),
                                                                order_by:app_query?.get('order_by'),
                                                                select_app_id:app_query?.get('select_app_id'),
                                                                year:app_query?.get('year'),
                                                                month:app_query?.get('month'),
                                                                day:app_query?.get('day'),
                                                                offset:app_query?.get('offset'),
                                                                limit:app_query?.get('limit'),
                                                                data_app_id:app_query?.get('data_app_id'),
                                                                resource_name_entity:app_query?.get('resource_name_entity')}})
                                .then(result=>iso_return_message(result, false)));
                    break;
                }
                case route({url:'/bff/admin/v1/server-db_admin/app_data_stat-log-stat', method:'GET'}):{
                    resolve(dbModelAppDataStat.getStatUniqueVisitor({app_id:routesparameters.app_id, 
                                                                    data:{  select_app_id:app_query?.get('select_app_id'),
                                                                            year:app_query?.get('year'),
                                                                            month:app_query?.get('month')}})
                                .then(result=>iso_return_message(result, false)));
                    break;
                }
                case route({url:'/bff/admin/v1/server-socket/message', method:'POST'}):{
                    resolve(socket.socketAdminSend({app_id:routesparameters.app_id, data:routesparameters.body}));
                    break;
                }
                case route({url:'/bff/admin/v1/server-socket/socket-stat', method:'GET'}):{
                    resolve(iso_return_message(socket.socketConnectedCount({data:{  identity_provider_id:app_query?.get('identity_provider_id'),
                                                                                    logged_in:app_query?.get('logged_in')
                                                                                }
                                                                            }), true));
                    break;
                }
                case route({url:'/bff/admin/v1/server-socket/socket', method:'GET'}):{
                    resolve(socket.socketConnectedList({app_id:routesparameters.app_id, 
                                                        data:{select_app_id:app_query?.get('select_app_id'),
                                                              limit:app_query?.get('limit'),
                                                              offset:app_query?.get('offset'),
                                                              year:app_query?.get('year'),
                                                              month:app_query?.get('month'),
                                                              day:app_query?.get('day'),
                                                              order_by:app_query?.get('order_by'),
                                                              sort:app_query?.get('sort')}
                                                    })
                            .then(result=>iso_return_message(result, false)));
                    break;
                }
                case route({url:'/bff/admin/v1/app-common', method:'GET'}):{
                    //return all apps
                    resolve(iso_return_message(fileModelApp.get({app_id:routesparameters.app_id, resource_id:null, res:routesparameters.res}), false));
                    break;
                }
                case route({url:`/bff/admin/v1/app-common-app/${resource_id_string}`, method:'PUT', required:true}):{
                    resolve(fileModelApp.update({app_id:routesparameters.app_id, 
                                                /**@ts-ignore */
                                                resource_id:resource_id_get_number(), 
                                                data:routesparameters.body,
                                                res:routesparameters.res}));
                    break;
                }
                case route({url:`/bff/admin/v1/app-common-app-module/${resource_id_string}`, method:'GET'}):{
                    resolve(iso_return_message(fileModelAppModule.get(
                                                    {app_id:routesparameters.app_id, 
                                                    data:{data_app_id:app_query?.get('data_app_id')},
                                                    resource_id:resource_id_get_number(),
                                                    res:routesparameters.res}),
                                                    resource_id_get_number()!=null));
                    break;
                }
                case route({url:`/bff/admin/v1/app-common-app-module/${resource_id_string}`, method:'PUT', required:true}):{
                    resolve(fileModelAppModule.update(  {app_id:routesparameters.app_id, 
                                                        /**@ts-ignore */
                                                        resource_id:resource_id_get_number(), 
                                                        data:routesparameters.body,
                                                        res:routesparameters.res}));
                    break;
                }
                case route({url:`/bff/admin/v1/app-common-app-parameter/${resource_id_string}`, method:'GET', required:true}):{
                    resolve(iso_return_message(fileModelAppParameter.get(
                                                        /**@ts-ignore */
                                                        {app_id:resource_id_get_number(), 
                                                        res:routesparameters.res}),
                                                        resource_id_get_number()!=null));
                    break;
                }
                case route({url:`/bff/admin/v1/app-common-app-parameter/${resource_id_string}`, method:'PATCH', required:true}):{
                    resolve(fileModelAppParameter.update({app_id:routesparameters.app_id, 
                                                            /**@ts-ignore */
                                                            resource_id:resource_id_get_number(), 
                                                            data:routesparameters.body,
                                                            res:routesparameters.res}));
                    break;
                }
                case route({url:`/bff/admin/v1/app-common-app-secret/${resource_id_string}`, method:'GET', required:true}):{
                    resolve(iso_return_message(fileModelAppSecret.get(
                                                            /**@ts-ignore */
                                                            {app_id:resource_id_get_number(),
                                                            res:routesparameters.res}),
                                                            resource_id_get_number()!=null));
                    break;
                }
                case route({url:`/bff/admin/v1/app-common-app-secret/${resource_id_string}`, method:'PATCH', required:true}):{
                    resolve(fileModelAppSecret.update({ app_id:routesparameters.app_id, 
                                                        /**@ts-ignore */
                                                        resource_id:resource_id_get_number(), 
                                                        data:routesparameters.body,
                                                        res:routesparameters.res}));
                    break;
                }
                case route({url:'/bff/admin/v1/server-db_admin/user_account-stat', method:'GET'}):{
                    resolve(dbModelUserAccount.getStatCountAdmin({app_id:routesparameters.app_id})
                                .then(result=>iso_return_message(result, false)));
                    break;
                }
                case route({url:'/bff/admin/v1/server-db_admin/user_account', method:'GET'}):{
                    resolve(dbModelUserAccount.getUsersAdmin({app_id:routesparameters.app_id, 
                                                            data:{  sort:app_query?.get('sort'),
                                                                    order_by:app_query?.get('order_by'),
                                                                    search:app_query?.get('search'),
                                                                    offset:app_query?.get('offset'),
                                                                    limit:app_query?.get('limit')}})
                                .then(result=>iso_return_message(result, false)));
                    break;
                }
                case route({url:`/bff/admin/v1/server-db_admin/user_account/${resource_id_string}`, method:'PATCH', required:true}):{
                    resolve(dbModelUserAccount.updateAdmin({app_id:routesparameters.app_id, 
                                                            /**@ts-ignore */
                                                            resource_id:resource_id_get_number(), 
                                                            data:routesparameters.body, 
                                                            locale:app_query?.get('lang_code') ??'en', 
                                                            res:routesparameters.res}));
                    break;
                }
                case route({url:`/bff/admin/v1/server-config/config/${resource_id_string}`, method:'GET', required:true}):{
                    resolve(fileModelConfig.getFile(
                                                    /**@ts-ignore */
                                                    {resource_id:resource_id_get_string(), 
                                                    data:{config_group:app_query?.get('config_group'),
                                                          parameter:app_query?.get('parameter'),
                                                          saved:app_query?.get('saved')}})
                                .then(result=>iso_return_message(result, resource_id_get_string()!=null)));
                    break;
                }
                case route({url:`/bff/admin/v1/server-config/config/${resource_id_string}`, method:'PUT', required:true}):{
                    resolve(fileModelConfig.update(
                                                    /**@ts-ignore */
                                                    {resource_id:resource_id_get_string(), 
                                                    data:routesparameters.body}));
                    break;
                }
                case route({url:'/bff/admin/v1/server/info', method:'GET'}):{
                    resolve(info.info()
                                .then(result=>iso_return_message(result, true)));
                    break;
                }
                case route({url:'/bff/admin/v1/server-db_admin/database-demo', method:'POST'}):{
                    resolve(dbModelDatabase.dbDemoInstall({ app_id:routesparameters.app_id, 
                                                            iam:routesparameters.res.req.query.iam,
                                                            data:routesparameters.body
                                                        }));
                    break;
                }
                case route({url:'/bff/admin/v1/server-db_admin/database-demo', method:'DELETE'}):{
                    resolve(dbModelDatabase.dbDemoUninstall({app_id:routesparameters.app_id, 
                                                            iam:routesparameters.res.req.query.iam}));
                    break;
                }
                case route({url:'/bff/admin/v1/server-db_admin/database-installation', method:'GET'}):{
                    resolve(dbModelDatabase.dbInstalledCheck({app_id:routesparameters.app_id})
                                .then(result=>iso_return_message(result, true)));
                    break;
                }
                case route({url:'/bff/admin/v1/server-db_admin/database-space', method:'GET'}):{
                    resolve(dbModelDatabase.dbInfoSpace({app_id:routesparameters.app_id})
                                .then(result=>iso_return_message(result, false)));
                    break;
                }
                case route({url:'/bff/admin/v1/server-db_admin/database-spacesum', method:'GET'}):{
                    resolve(dbModelDatabase.dbInfoSpaceSum({app_id:routesparameters.app_id})
                                .then(result=>iso_return_message(result, true)));
                    break;
                }
                case route({url:'/bff/admin/v1/server-db_admin/database', method:'GET'}):{
                    resolve(dbModelDatabase.dbInfo({app_id:routesparameters.app_id})
                                .then(result=>iso_return_message(result, true)));
                    break;
                }
                case route({url:'/bff/admin/v1/server-db_admin/database', method:'POST'}):{
                    resolve(dbModelDatabase.dbInstall({ app_id:routesparameters.app_id, 
                                                        iam:routesparameters.res.req.query.iam}));
                    break;
                }
                case route({url:'/bff/admin/v1/server-db_admin/database', method:'DELETE'}):{
                    resolve(dbModelDatabase.dbUninstall({   app_id:routesparameters.app_id, 
                                                            iam:routesparameters.res.req.query.iam}));
                    break;
                }
                case route({url:'/bff/admin/v1/server-log/log', method:'GET'}):{
                    resolve(fileModelLog.get({  app_id:routesparameters.app_id, 
                                                data:{  select_app_id: app_query?.get('select_app_id'),
                                                        logscope: app_query?.get('logscope'),
                                                        loglevel: app_query?.get('loglevel'),
                                                        search: app_query?.get('search'),
                                                        sort: app_query?.get('sort'),
                                                        order_by: app_query?.get('order_by'),
                                                        year: app_query?.get('year'),
                                                        month: app_query?.get('month'),
                                                        day: app_query?.get('day'),
                                                        limit: app_query?.get('limit'),
                                                        offset: app_query?.get('offset')}})
                                .then(result=>iso_return_message(result, false)));
                    break;
                }
                case route({url:'/bff/admin/v1/server/info-statuscode', method:'GET'}):{
                    resolve(fileModelLog.getStatusCodes()
                                .then(result=>iso_return_message(result, true)));
                    break;
                }
                case route({url:'/bff/admin/v1/server-log/log-stat', method:'GET'}):{
                    resolve(fileModelLog.getStat({app_id:routesparameters.app_id, 
                                                    data:{  select_app_id:app_query?.get('select_app_id'),
                                                            statGroup:app_query?.get('statGroup'),
                                                            unique:app_query?.get('unique'),
                                                            statValue:app_query?.get('statValue'),
                                                            year:app_query?.get('year'),
                                                            month:app_query?.get('month')}})
                                .then(result=>iso_return_message(result, false)));
                    break;
                }
                case route({url:'/bff/admin/v1/server-log/log-files', method:'GET'}):{
                    resolve(fileModelLog.getFiles()
                                .then(result=>iso_return_message(result, false)));
                    break;
                }
                case route({url:`/bff/admin/v1/server-iam/user/${resource_id_string}`, method:'GET'}):{
                    resolve(iam_service.iamUserGet({app_id:routesparameters.app_id,
                                                    /**@ts-ignore */
                                                    resource_id:resource_id_get_number(), 
                                                    res:routesparameters.res})
                            .then((result=>iso_return_message(result, resource_id_get_number()!=null)))); 
                    break;
                }
                case route({url:`/bff/admin/v1/server-iam/user/${resource_id_string}`, method:'PATCH'}):{
                    resolve(iam_service.iamUserUpdate(
                                                    {app_id:routesparameters.app_id,
                                                    /**@ts-ignore */
                                                    resource_id:resource_id_get_number(),
                                                    data:routesparameters.body,
                                                    res:routesparameters.res}));
                    break;
                }
                case route({url:'/bff/admin/v1/server-iam/iam_user_login', method:'GET'}):{
                    resolve(iso_return_message(iam_service.iamUserLoginGet({app_id:routesparameters.app_id, 
                                                                            data:{  data_user_account_id:app_query?.get('data_user_account_id'),
                                                                                    data_app_id:app_query?.get('data_app_id')}}), true));
                    break;
                }
                //socket using EventSource route
                case route({url:'/bff/socket/v1/server-socket/socket', method:'GET'}):{
                    //EventSource uses GET method, should otherwise be POST
                    resolve(socket.socketConnect(   {
                                                    app_id:routesparameters.app_id,
                                                    iam:routesparameters.res.req.query.iam,
                                                    user_agent:routesparameters.user_agent,
                                                    accept_language:routesparameters.accept_language,
                                                    ip:routesparameters.ip,
                                                    res:routesparameters.res
                                                    }));
                    break;
                }
                // app_signup route
                case route({url:'/bff/app_id_signup/v1/server-db/user_account-signup', method:'POST'}):{
                    resolve(iam_service.iamAuthenticateUserSignup({ app_id:routesparameters.app_id, 
                                                                    ip:routesparameters.ip, 
                                                                    user_agent:routesparameters.user_agent, 
                                                                    accept_language:routesparameters.accept_language, 
                                                                    locale:app_query?.get('lang_code') ??'en', 
                                                                    data:routesparameters.body, 
                                                                    res:routesparameters.res}));
                    break;
                }
                //iam routes, for login and logout
                case route({url:'/bff/iam_admin/v1/server-iam-login', method:'POST'}):{
                    resolve(iam_service.iamAuthenticateAdmin({  app_id:routesparameters.app_id, 
                                                                iam:routesparameters.res.req.query.iam, 
                                                                authorization:routesparameters.authorization, 
                                                                ip:routesparameters.ip, 
                                                                user_agent:routesparameters.user_agent, 
                                                                accept_language:routesparameters.accept_language, 
                                                                res:routesparameters.res}));
                    break;
                }
                case route({url:'/bff/iam_user/v1/server-iam-login', method:'POST'}):{
                    resolve(iam_service.iamAuthenticateUser({   app_id:routesparameters.app_id, 
                                                                iam:routesparameters.res.req.query.iam, 
                                                                ip:routesparameters.ip, 
                                                                user_agent:routesparameters.user_agent, 
                                                                accept_language:routesparameters.accept_language, 
                                                                data:routesparameters.body, 
                                                                res:routesparameters.res}));
                    break;
                }
                case route({url:`/bff/iam_provider/v1/server-iam-login/${resource_id_string}`, method:'POST', required:true}):{
                    resolve(iam_service.iamAuthenticateUserProvider( {  app_id:routesparameters.app_id, 
                                                                        iam:routesparameters.res.req.query.iam, 
                                                                        /**@ts-ignore */
                                                                        resource_id:resource_id_get_number(), 
                                                                        ip:routesparameters.ip, 
                                                                        user_agent:routesparameters.user_agent, 
                                                                        accept_language:routesparameters.accept_language, 
                                                                        locale:app_query?.get('lang_code') ??'en', 
                                                                        data:routesparameters.body, 
                                                                        res:routesparameters.res}));
                    break;
                }
                case route({url:'/bff/app_access/v1/server-iam-logout', method:'DELETE'}):
                case route({url:'/bff/admin/v1/server-iam-logout', method:'DELETE'}):{
                    resolve(iam_service.iamUserLogout({ app_id:routesparameters.app_id, 
                                                        authorization:routesparameters.authorization, 
                                                        ip:routesparameters.ip, 
                                                        user_agent:routesparameters.user_agent, 
                                                        accept_language:routesparameters.accept_language, 
                                                        res:routesparameters.res}));
                    break;
                }
                //microservice routes
                case route({url:'/bff/app_id/v1/geolocation/ip', method:'GET'}):
                case route({url:'/bff/app_id/v1/geolocation/place', method:'GET'}):
                case route({url:'/bff/admin/v1/mail/sendemail', method:'POST'}):{
                        resolve(microservice.microserviceRequest({  app_id:routesparameters.app_id,
                                                                    path:routesparameters.route_path, 
                                                                    method:routesparameters.method,
                                                                    query:URI_query,
                                                                    data:routesparameters.body,
                                                                    ip:routesparameters.ip,
                                                                    user_agent:routesparameters.user_agent,
                                                                    accept_language:routesparameters.accept_language,
                                                                    endpoint:routesparameters.endpoint
                                                                })
                                .then(result=>iso_return_message(result, true)));
                    break;
                }
                default:{
                    if (resource_id_iamUtilResponseNotAuthorized){
                        routesparameters.res.statusMessage = 'resource id not authorized';
                        routesparameters.res.statusCode =401;
                    }
                    else{
                        routesparameters.res.statusMessage = `route not found: ${routesparameters.endpoint} ${URI_path} ${routesparameters.method}`;
                        routesparameters.res.statusCode =404;
                    }
                    reject(iam_service.iamUtilMesssageNotAuthorized());
                    break;
                }
            }
        } catch (error) {
            reject(error);
        }
    });
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
    /**@type{import('./db/dbModelDatabase.js')} */
    const dbModelDatabase = await import(`file://${process.cwd()}/server/db/dbModelDatabase.js`);
    /**@type{import('./socket.js')} */
    const {socketIntervalCheck} = await import(`file://${process.cwd()}/server/socket.js`);
    /**@type{import('./db/fileModelLog.js')} */
    const fileModelLog = await import(`file://${process.cwd()}/server/db/fileModelLog.js`);
    /**@type{import('./db/fileModelConfig.js')} */
    const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);

    const fs = await import('node:fs');
    const http = await import('node:http');
    const https = await import('node:https');

    process.env.TZ = 'UTC';
    process.on('uncaughtException', (err) =>{
        console.log(err);
        fileModelLog.postServerE('Process uncaughtException: ' + err.stack);
    });
    process.on('unhandledRejection', (reason) =>{
        console.log(reason);
        fileModelLog.postServerE('Process unhandledRejection: ' + reason);
    });
    try {
        await fileModelConfig.configInit();
        await dbModelDatabase.dbStart();
        /**
         * Use framework JS or Express
         * This is switchable in runtime at any time
         * @param {server_server_req} req
         * @param {server_server_res} res
         */
        const app = async (req, res) => {
            const framework = serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'FRAMEWORK')) ==1?await serverJs():await serverExpress();
            framework(req, res);
        };
        socketIntervalCheck();
        //START HTTP SERVER
        /**@ts-ignore*/
        http.createServer(app).listen(fileModelConfig.get('CONFIG_SERVER','SERVER', 'HTTP_PORT'), () => {
            fileModelLog.postServerI('HTTP Server up and running on PORT: ' + fileModelConfig.get('CONFIG_SERVER','SERVER', 'HTTP_PORT')).then(() => {
                null;
            });
        });
        if (fileModelConfig.get('CONFIG_SERVER','SERVER', 'HTTPS_ENABLE')=='1'){
            //START HTTPS SERVER
            //SSL files for HTTPS
            const HTTPS_KEY = await fs.promises.readFile(process.cwd() + fileModelConfig.get('CONFIG_SERVER','SERVER', 'HTTPS_KEY'), 'utf8');
            const HTTPS_CERT = await fs.promises.readFile(process.cwd() + fileModelConfig.get('CONFIG_SERVER','SERVER', 'HTTPS_CERT'), 'utf8');
            const options = {
                key: HTTPS_KEY.toString(),
                cert: HTTPS_CERT.toString()
            };
            /**@ts-ignore*/
            https.createServer(options,  app).listen(fileModelConfig.get('CONFIG_SERVER','SERVER', 'HTTPS_PORT'), () => {
                fileModelLog.postServerI('HTTPS Server up and running on PORT: ' + fileModelConfig.get('CONFIG_SERVER','SERVER', 'HTTPS_PORT')).then(() => {
                    null;
                });
            });            
        }
    } catch (/**@type{server_server_error}*/error) {
        fileModelLog.postServerE('serverStart: ' + error.stack);
    }
    
};
export {serverResponseErrorSend, serverUtilCompression,
        serverUtilNumberValue, serverUtilResponseTime, serverUtilAppFilename,serverUtilAppFunction,serverUtilAppLine , 
        serverREST_API, serverREST_APIOpenAPI, serverStart };