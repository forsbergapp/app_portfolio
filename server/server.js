/** 
 * Server
 * Uses Express framework
 * Role based routes are defined in Express and are using IAM middleware for authentication and authorization.
 * If IAM authorizes the request then BFF calls either server functions or microservices
 * REST API is implemented following ISO20022 with additional resource authentication and authorization implemented
 * @module server/server 
 */

/**
 * @import {server_req_method, server_bff_endpoint_type, server_REST_API_parameters, server_server_response, server_server_response_type, server_server_error, server_server_req, server_server_res, server_server_req_id_number,server_server_express} from './types.js'
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
 *           host?:string|null,
 *           route:'APP'|'REST_API'|null,
 *           result_request:{   http?:number|null,
 *                              code?:number|string|null,
 *                              text?:string|null,
 *                              developerText?:string|null,
 *                              moreInfo?:string|null,
 *                              result?:*,
 *                              sendfile?:string|null,
 *                              type:server_server_response_type,
 *                              singleResource?:boolean},
 *          endpoint?:server_bff_endpoint_type,
 *          method?:server_req_method,
 *          decodedquery?:string|null,
 *          res:server_server_res}} parameters
 *  @returns {Promise.<void>}
 */
const serverResponse = async parameters =>{
    /**@type{import('./db/fileModelAppParameter.js')} */
    const fileModelAppParameter = await import(`file://${process.cwd()}/server/db/fileModelAppParameter.js`);
    /**@type{import('./db/fileModelConfig.js')} */
    const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);
    const common_app_id = serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID')) ?? 0;
    /**
     * Sets response type
     * @param {server_server_response_type} type
     */
    const setType = type => {
        
        const app_cache_control = fileModelAppParameter.get({app_id:parameters.app_id ?? common_app_id, resource_id:common_app_id}).result[0].common_app_cache_control.value;
        const app_cache_control_font = fileModelAppParameter.get({app_id:parameters.app_id ?? common_app_id, resource_id:common_app_id}).result[0].common_app_cache_control_font.value;
        switch (type){
            case 'JSON':{
                if (app_cache_control !='')
                    parameters.res.set('Cache-Control', app_cache_control);
                parameters.res.type('application/json; charset=utf-8');
                break;
            }
            case 'HTML':{
                if (app_cache_control !='')
                    parameters.res.set('Cache-Control', app_cache_control);
                parameters.res.type('text/html; charset=utf-8');
                break;
            }
            case 'CSS':{
                if (app_cache_control !='')
                    parameters.res.set('Cache-Control', app_cache_control);
                parameters.res.type('text/css; charset=utf-8');
                break;
            }
            case 'JS':{
                if (app_cache_control !='')
                    parameters.res.set('Cache-Control', app_cache_control);
                parameters.res.type('text/javascript; charset=utf-8');
                break;
            }
            case 'WEBP':{
                if (app_cache_control !='')
                    parameters.res.set('Cache-Control', app_cache_control);
                parameters.res.type('image/webp; charset=utf-8');
                break;
            }
            case 'PNG':{
                if (app_cache_control !='')
                    parameters.res.set('Cache-Control', app_cache_control);
                parameters.res.type('image/png; charset=utf-8');
                break;
            }
            case 'WOFF':{
                if (app_cache_control_font !='')
                    parameters.res.set('Cache-Control', app_cache_control_font);
                parameters.res.type('font/woff; charset=utf-8');
                break;
            }
            case 'TTF':{
                if (app_cache_control_font !='')
                    parameters.res.set('Cache-Control', app_cache_control_font);
                parameters.res.type('text/font/ttf; charset=utf-8');
                break;
            }
            default:{
                break;
            }
        }
    };
    if (parameters.result_request.http){
        /**@type{import('./db/fileModelLog.js')} */
        const fileModelLog = await import(`file://${process.cwd()}/server/db/fileModelLog.js`);

        /**@type{import('../apps/common/src/common.js')} */
        const app_common = await import(`file://${process.cwd()}/apps/common/src/common.js`);
        const app_id_host = app_common.commonAppHost((parameters.host??'').substring(0,(parameters.host??'').indexOf(':')==-1?
                                                (parameters.host??'').length:
                                                    (parameters.host??'').indexOf(':')));
        await fileModelLog.postServiceI(parameters.app_id ?? app_id_host ?? common_app_id, (parameters.result_request.http ?? '').toString(), parameters.result_request.code?.toString()??'', parameters.result_request.text??'');
        //ISO20022 error format
        const message = {error:{
                                http:parameters.result_request.http, 
                                code:parameters.result_request.code, 
                                //return SERVER ERROR if status code starts with 5 and not admin app or show full error
                                text:(common_app_id!=app_id_host && parameters.result_request.http?.toString().startsWith('5'))?'SERVER ERROR':parameters.result_request.text, 
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
        if (parameters.endpoint=='SOCKET'){
            //This endpoint only allowed for SSE so no more update of response
            null;
        }
        else{
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
                    /**@type{import('./db/fileModelLog.js')} */
                    const fileModelLog = await import(`file://${process.cwd()}/server/db/fileModelLog.js`);
                    /**@type{import('./iam.js')} */
                    const  {iamUtilMessageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);
                    await fs.promises.access(parameters.result_request.sendfile)
                    .then(()=>{
                        setType(parameters.result_request.type);
                        parameters.res.sendFile(parameters.result_request.sendfile);
                    })
                    .catch(error=>{
                        fileModelLog.postServiceI(parameters.app_id ?? common_app_id, '400', parameters.result_request.sendfile ?? '', error)
                        .then(result=>{if (result.http)
                            parameters.res.statusCode =400;
                            parameters.res.write(iamUtilMessageNotAuthorized(), 'utf8');
                            parameters.res.end();
                        });
                    });
                }
                else{
                    if(parameters.result_request.type){
                        setType(parameters.result_request.type);
                        if (parameters.result_request?.type=='JSON'){
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
                            if (parameters.result_request.singleResource || parameters.result_request.result.page_header)
                                parameters.res.write(JSON.stringify(parameters.result_request.result), 'utf8');
                            else{
                                const offset = parameters.decodedquery?serverUtilNumberValue(new URLSearchParams(parameters.decodedquery).get('offset')):null;
                                const limit = parameters.decodedquery?serverUtilNumberValue(new URLSearchParams(parameters.decodedquery).get('limit')):null;

                                const list_header = {	total_count:	parameters.result_request.result.length,
                                                        offset: 		offset ?? 0,
                                                        count:			limit ?? parameters.result_request.result.length
                                                    };
                                parameters.res.write(JSON.stringify({list_header:list_header, rows:parameters.result_request.result}), 'utf8');
                            }    
                        }
                        else
                            parameters.res.write(parameters.result_request.result, 'utf8');
                    }
                    else{
                        /**@type{import('./iam.js')} */
                        const  {iamUtilMessageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);
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
 *	            *	                                        all	                                                bffInit	        logs SSE and response when closed, 
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
    /**@type{import('./iam.js')} */
    const  {iamUtilMessageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);
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
    /**@type{import('./bffMiddleware.js')} */
    const { bffInit, bffStart, bffApp, bffAppId, bffAppIdSignup, bffAppAccess, bffAppExternal, bffAdmin, bffSocket, 
            bffIAMAdmin, bffIAMUser, bffIAMProvider} = await import(`file://${process.cwd()}/server/bffMiddleware.js`);
    //auth
    /**@type{import('./iamMiddleware.js')} */
    const iam = await import(`file://${process.cwd()}/server/iamMiddleware.js`);
    
    //ROUTES 
    //logs SSE and response when closed, authenticates request and will end request if not passing controls, 
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
            serverResponse({host:req.headers.host,
                            route:null,
                            result_request:{http:err?.name=='PayloadTooLargeError'?400:500, 
                                            code:null, 
                                            text:err?.name=='PayloadTooLargeError'?iamUtilMessageNotAuthorized():'SERVER ERROR',
                                            developerText:'',
                                            moreInfo:'',
                                            type:'HTML'},
                            res:res});
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
    /**@type{import('./iam.js')} */
    const  {iamUtilMessageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);

    /**@type{import('./iamMiddleware.js')} */
    const iamMiddleware = await import(`file://${process.cwd()}/server/iamMiddleware.js`);

    /**@type{import('./bffMiddleware.js')} */
    const { bffApp, bffAppId, bffAppIdSignup, bffAppAccess, bffAppExternal, bffAdmin, bffSocket, 
        bffIAMAdmin, bffIAMUser, bffIAMProvider} = await import(`file://${process.cwd()}/server/bffMiddleware.js`);

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
                    await iamMiddleware.iamAuthenticateIdToken(req, res, () =>
                        bffAppId(req, res)
                    );
                    break;
                }
                case req.path.startsWith('/bff/app_id_signup/v1') &&req.method=='POST':{
                    req.route.path = '/bff/app_id_signup/v1*';
                    await iamMiddleware.iamAuthenticateIdTokenRegistration(req, res, () =>
                            bffAppIdSignup(req, res)
                    );
                    break;
                }
                case req.path.startsWith('/bff/app_access/v1') :{
                    req.route.path = '/bff/app_access/v1*';
                    await iamMiddleware.iamAuthenticateAccessToken(req, res, () =>
                        bffAppAccess(req, res)
                    );
                    break;
                }
                case req.path.startsWith('/bff/app_external/v1/app-module-function') && req.method=='POST':{
                    req.route.path = '/bff/app_external/v1/app-module-function*';
                    iamMiddleware.iamAuthenticateExternal(req, res, () =>
                        bffAppExternal(req, res)
                    );
                    break;
                }
                case req.path.startsWith('/bff/admin/v1') :{
                    req.route.path = '/bff/admin/v1*';
                    await iamMiddleware.iamAuthenticateAccessTokenAdmin(req, res, () =>
                        bffAdmin(req, res)
                    );
                    break;
                }
                case req.path.startsWith('/bff/socket/v1') && req.method=='GET':{
                    req.route.path = '/bff/socket/v1*';
                    iamMiddleware.iamAuthenticateSocket(req, res, () =>
                        bffSocket(req, res)
                    );
                    break;
                }
                case req.path.startsWith('/bff/iam_admin/v1/server-iam-login') && req.method=='POST':{
                    req.route.path = '/bff/iam_admin/v1/server-iam-login';
                    await iamMiddleware.iamAuthenticateAdmin(req, res, () =>
                        bffIAMAdmin(req, res)
                    );
                    break;
                }
                case req.path.startsWith('/bff/iam_user/v1') && req.method=='POST':{
                    req.route.path = '/bff/iam_user/v1*';
                    await iamMiddleware.iamAuthenticateUser(req, res, () =>
                        bffIAMUser(req, res)
                    );
                    break;
                }
                case req.path.startsWith('/bff/iam_provider/v1') && req.method=='POST':{
                    req.route.path = '/bff/iam_provider/v1*';
                    await iamMiddleware.iamAuthenticateProvider(req, res, () =>
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
                    serverResponse({host:req.headers.host,
                                    route:null,
                                    result_request:{http:400, 
                                                    code:null, 
                                                    text:iamUtilMessageNotAuthorized(), 
                                                    developerText:'',
                                                    moreInfo:'',
                                                    type:'HTML'},
                                    res:res});
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
                serverResponse({host:req.headers.host,
                    route:null,
                    result_request:{http:400, 
                                    code:null, 
                                    text:iamUtilMessageNotAuthorized(), 
                                    developerText:'',
                                    moreInfo:'',
                                    type:'HTML'},
                    res:res});
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
                    res.end(iamUtilMessageNotAuthorized());
                });
                /**@ts-ignore */
                readStream.pipe(res);
            };
            res.redirect = (/**@type{string}*/url) =>{
                res.writeHead(301, {'Location':url});
                res.end();
            };
            /**@type{import('./bff.js')} */
            const bffService = await import('./bff.js');
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
 * @name serverREST_API
 * @namespace ROUTE_REST_API
 * @description Server REST API routes using openAPI where paths, methods, validation rules, operationId and function parameters are defined
 *              OperationId syntax: [path].[filename].[functioname] or [path]_[path].[filename].[functioname]
 *              Returns single resource result format or ISO20022 format with either list header format or page header metadata
 *              Returns HTML or {static:boolean, sendfile:string|null, sendcontent:string}
 *              /app-module-report-queue-result
 *              /bff/admin/v1/app-module-report
 *              /bff/app/v1/app-module-report
 *              /bff/app/v1/app-module-module
 * 
 *              Returns status 401 if not authorized
 *              Returns status 404 if route is not found
 * @function
 * @param {server_REST_API_parameters} routesparameters
 * @returns {Promise.<server_server_response>}
 */
const serverREST_API = async (routesparameters) =>{
    /**@type{import('../apps/common/src/common.js')} */
    const app_common = await import(`file://${process.cwd()}/apps/common/src/common.js`);
    /**@type{import('./iam.js')} */
    const iam = await import(`file://${process.cwd()}/server/iam.js`);
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
    const resource_id_get_string = path => path.endsWith('/${resource_id_string}')?
                                                (URI_path.substring(URI_path.lastIndexOf('/') + 1)==''?null:URI_path.substring(URI_path.lastIndexOf('/') + 1)):
                                                    null;
    /**
     * Validates if user has access to given resource
     * Validates using IAM token claims if path requires
     * @param {{config_path:string,
     *          resource_validate_key?: 'id'|'app_id'|null,
     *          resource_validate_value?: string|number|null,
     *          required?: boolean,
     *          resource_validate_app_data_app_id?: number|null,
     *          validate_app_function?:string|null,
     *          validate_app_function_role?:string|null}} params
     * @returns {boolean}
     */
    const validate = params =>{
        //set default values
        params.resource_validate_key = params.resource_validate_key ?? null;
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
                if (params.resource_validate_key){
                    if (iam.iamAuthenticateResource({  app_id:routesparameters.app_id, 
                                                            ip:routesparameters.ip, 
                                                            authorization:routesparameters.authorization, 
                                                            resource_id:params.resource_validate_value?
                                                                            //valid values: null, 'resource_id_string', 'resource_id_number' or a key in iam
                                                                            params.resource_validate_value=='resource_id_number'?
                                                                                resource_id_get_number(params.config_path):
                                                                                    params.resource_validate_value=='resource_id_string'?
                                                                                        resource_id_get_string(params.config_path):
                                                                                            (routesparameters.method=='GET'?app_query?.get(params.resource_validate_value.toString()):routesparameters.body[params.resource_validate_value]):
                                                                                                null, 
                                                            scope: 'USER',
                                                            claim_key:params.resource_validate_key}))
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
        
    const configPath = Object.entries(fileModelConfig.get('CONFIG_REST_API').paths)
                        .filter(path=>
                            path[0].replace('/${resource_id_number}', URI_path.substring(URI_path.lastIndexOf('/'))) == URI_path ||
                            path[0].replace('/${resource_id_string}', URI_path.substring(URI_path.lastIndexOf('/'))) == URI_path)[0];
    if (configPath){
        /**
         * Get server validation parameter for either keys starting with server
         * or resource_id_number or resource_id_string that all should use '$ref' and match components path
         * All paths should specify required key if this is used for the path
         * @example {
                        "$ref": "#/components/parameters/resource_id_number",
                        "required":false
                    }
         * @param{string} key
         * @returns {*}
         */
        const getParameterValidation = key => key.startsWith('server')?
                                        methodObj.parameters.filter((/**@type{*}*/parameter)=>parameter[key])[0]?.[key]:
                                            methodObj.parameters.filter((/**@type{*}*/parameter)=>
                                                    Object.keys(parameter)[0]=='$ref' && Object.values(parameter)[0]=='#/components/parameters/' + key)[0];
        

        const methodObj = configPath[1][routesparameters.method.toLowerCase()];
        if (methodObj){
            if (validate({  config_path:                        configPath[0],
                            resource_validate_key:              getParameterValidation('server_validation_resource_key'),
                            resource_validate_value:            getParameterValidation('server_validation_resource_value'),
                            required:                           (getParameterValidation('resource_id_string') ?? getParameterValidation('resource_id_number'))?.required ?? false,
                            resource_validate_app_data_app_id:  getParameterValidation('server_validation_resource_app_data_app_id')?routesparameters.body.data_app_id:null,
                            validate_app_function:              getParameterValidation('server_validation_app_function')?resource_id_get_string(configPath[0]):null,
                            validate_app_function_role:         getParameterValidation('server_validation_app_function')?getParameterValidation('server_validation_app_function_role'):null})){

                //add parameters using tree shaking pattern
                //so only defined parameters defined using openAPI pattern are sent to functions
                const parametersData = routesparameters.method=='GET'?
                                            {...methodObj.parameters
                                                            //include all parameters.in=query
                                                            .filter((/**@type{*}*/parameter)=>parameter.in =='query')
                                                            .reduce((/**@type{*}*/keys, /**@type{*}*/key)=>{return {...keys, ...{[key.name]:app_query?.get(Object.values(key)[0])}};},{}),
                                            //if SSE then add res
                                            ...(methodObj.responses?.[200]?.content?.['text/event-stream'] && {res:routesparameters.res})}:
                                            //all other methods use body to send data
                                            //if addtional properties allowed then add to defined parameters or only parameters matching defined parameters
                                            (methodObj.requestBody?.content && methodObj.requestBody?.content['application/json'].schema.additionalProperties)?
                                                {...routesparameters.body,...Object.entries(methodObj.requestBody.content['application/json'].schema.properties)
                                                                                .reduce((/**@type{*}*/keys, /**@type{*}*/key)=>{return {...keys, ...{[key[0]]:routesparameters.body[key[0]]}};},{})}:
                                                            (methodObj.requestBody?.content?Object.entries(methodObj.requestBody?.content['application/json'].schema.properties)
                                                            .reduce((/**@type{*}*/keys, /**@type{*}*/key)=>{return {...keys, ...{[key[0]]:routesparameters.body[key[0]]}};},{}):{});
                
                //read operationId what file to import and what function to execute
                //syntax: [path].[filename].[functioname] or [path]_[path].[filename].[functioname]
                const filePath = '/' + methodObj.operationId.split('.')[0].replaceAll('_','/') + '/' +
                                        methodObj.operationId.split('.')[1] + '.js';
                const functionRESTAPI = methodObj.operationId.split('.')[2];
                const moduleRESTAPI = await import(`file://${process.cwd()}${filePath}`);
                
                /**
                 *  Return single resource in result object or multiple resource in rows keys
                 *  Rules: 
                 *  server functions: return false
                 *  method not GET or microservice request: true
                 *  metho GET: if resource id (string or number)  is empty return false else true
                 * @returns {boolean}
                 */
                const singleResource = () => functionRESTAPI=='commonModuleRun'?
                                                false:
                                                    (routesparameters.method!='GET' ||functionRESTAPI=='microserviceRequest')?
                                                        true:
                                                            (getParameterValidation('resource_id_number')?resource_id_get_number(configPath[0]):resource_id_get_string(configPath[0]))!=null;
                //return result using ISO20022 format
                //send only parameters to the function if declared true
                const result = await  moduleRESTAPI[functionRESTAPI]({
                                app_id:         routesparameters.app_id,
                                ...(getParameterValidation('server_function_parameter_iam')                     && {iam:            app_query?.get('iam')}),
                                ...(getParameterValidation('server_function_parameter_authorization')           && {authorization:  routesparameters.authorization}),
                                ...(getParameterValidation('server_function_parameter_user_agent')              && {user_agent:     routesparameters.user_agent}),
                                ...(getParameterValidation('server_function_parameter_accept_language')         && {accept_language:routesparameters.accept_language}),
                                ...(getParameterValidation('server_function_parameter_host')                    && {host:           routesparameters.host}),
                                ...(getParameterValidation('server_function_parameter_locale')                  && {locale:         app_query?.get('locale') ??'en'}),
                                ...(getParameterValidation('server_function_parameter_ip')                      && {ip:             routesparameters.ip}),
                                ...(getParameterValidation('server_function_parameter_path')                    && {path:           routesparameters.route_path}),
                                ...(getParameterValidation('server_function_parameter_method')                  && {method:         routesparameters.method}),
                                ...(Object.keys(parametersData)?.length>0                                       && {data:           {...parametersData}}),
                                ...(getParameterValidation('server_function_parameter_endpoint')                && {endpoint:       routesparameters.endpoint}),
                                ...(getParameterValidation('server_function_parameter_resource_id')             && {resource_id:    (getParameterValidation('resource_id_number')?
                                                                                                                                    resource_id_get_number(configPath[0]):
                                                                                                                                    resource_id_get_string(configPath[0]))})});
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
export {serverResponse, serverUtilCompression,
        serverUtilNumberValue, serverUtilResponseTime, serverUtilAppFilename,serverUtilAppLine , 
        serverREST_API, serverStart };