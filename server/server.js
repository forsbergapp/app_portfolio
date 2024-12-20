/** 
 * Server
 * Uses Express framework
 * Role based routes are defined in Express and are using IAM middleware for authentication and authorization.
 * If IAM authorizes the request then BFF calls either server functions or microservices
 * REST API is implemented following ISO20022 with additional resource authentication and authorization implemented
 * @module server/server 
 */

/**
 * @import {server_server_error_stack, server_server_error, server_server_req, server_server_res, server_server_req_id_number,
 *          server_server_express} from './types.js'
 */
const zlib = await import('node:zlib');
/**
 * Sends ISO 20022 error format
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
 * Get number value from request key
 * returns number or null for numbers
 * so undefined and '' are avoided sending argument to service functions
 * @function
 * @param {server_server_req_id_number} param
 * @returns {number|null}
 */
 const serverUtilNumberValue = param => (param==null||param===undefined||param==='undefined'||param==='')?null:Number(param);

 /**
  * Compression of response for supported requests
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
 * Calculate responsetime
 * @function
 * @param {server_server_res} res
 * @returns {number}
 */
const serverUtilResponseTime = (res) => {
    const diff = process.hrtime(res.getHeader('X-Response-Time'));
    return diff[0] * 1e3 + diff[1] * 1e-6;
};    

/**
 * Returns filename/module used
 * @function
 * @param {string} module
 * @returns {string}
 */
const serverUtilAppFilename = module =>{
    const from_app_root = ('file:///' + process.cwd().replace(/\\/g, '/')).length;
    return module.substring(from_app_root);
};
/**
 * Returns function used
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
 * Returns function row number from Error stack
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
 * 
 *  Gets Express app with following settings in this order
 *
 *	1.Middleware	JSON maximum size setting
 *	
 *  2.Routes	
 *	path	                                    method	middleware                                  controller      comment
 *  /bff/app/v1/app-module*'                    get                                                 bffApp          app modules type MODULE and REPORT
 *                                                                                                                  used for shared libraries and open report url
 *	*	                                        all	                                                bffInit	        logs EventSource and response when closed, 
 *                                                                                                                  authenticates request and will end request if not passing controls,
 *                                                                                                                  sets headers, 
 *                                                                                                                  returns disallow for robots.txt and empty favicon.ico
 *	*	                                        get	                                                bffStart	    redirects naked domain, http to https if enabled 
 *							                                                                                        and to admin subdomain if first time, 
 *							                                                                                        responds to SSL verification if enabled
 *  /bff/app_data/v1*                           all     iam.iamAuthenticateIdToken                  bffAppData
 *  /bff/app_signup/v1*                         post    iam.iamAuthenticateIdTokenRegistration      bffAppSignup
 *  /bff/app_access/v1*                         all     iam.iamAuthenticateAccessToken              bffAppAccess
 *  /bff/app_external/v1/app-module-function*   post    iam.iamAuthenticateExternal                 bffAppExternal
 *  /bff/admin/v1*                              all     iam.iamAuthenticateAdminAccessToken         bffAdmin
 *  /bff/socket/v1*                             get     iam.iamAuthenticateSocket                   bffSocket
 *  /bff/iam_admin/v1*                          post    iam.iamAuthenticateAdmin                    bffIAMAdmin
 *  /bff/iam_user/v1*                           post    iam.iamAuthenticateUser                     bffIAMUser
 *  /bff/iam_provider/v1*                       post    iam.iamAuthenticateProvider                 bffIAMProvider
 *	*	                                        get	                                                bffApp		    app asset
 *							                                                                                        common asset
 *							                                                                                        info page
 *							                                                                                        app
 *	
 * 3.Middleware error logging
 * 
 * @function
 * @returns {Promise<server_server_express>} app
 */
 const serverExpress = async () => {
    /**@type{import('./db/fileModelLog.js')} */
    const fileModelLog = await import(`file://${process.cwd()}/server/db/fileModelLog.js`);
    /**@type{import('./db/fileModelConfig.js')} */
    const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);

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
    const { bffInit, bffStart, bffApp, bffAppData, bffAppSignup, bffAppAccess, bffAppExternal, bffAdmin, bffSocket, 
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
    app.route('/bff/app_data/v1*').all                          (iam.iamAuthenticateIdToken,                bffAppData);
    app.route('/bff/app_signup/v1*').post                       (iam.iamAuthenticateIdTokenRegistration,    bffAppSignup);
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
                err?.name=='PayloadTooLargeError'?'⛔':'SERVER ERROR', 
                null, 
                null);
        });
    });
    return app;
};
/**
 * Server REST API routes
 * Validates if user has access to given resource
 * Validates using IAM token claims if path requires
 * Validates calls to circuitbreaker controlled microservices using client_id and client_secret defined for given app
 * Uses paths defined in app.route() in serverExpress() function
 * Returns single resource result format or ISO20022 format with either list header format or page header metadata
 * Returns HTML or  {STATIC:boolean, SENDFILE:string|null, SENDCONTENT:string}
 *  /app-module-report-queue-result
 *  /bff/admin/v1/app-module-report
 *  /bff/app/v1/app-module-report
 *  /bff/app/v1/app-module-module
 * 
 * Returns status 401 if user has not accessed to given resource
 * Returns status 404 if route is not found
 * @function
 * @param {import('./types.js').server_server_routesparameters} routesparameters
 * @returns {Promise.<*>}
 */
 const serverREST_API = async (routesparameters) =>{
    /**@type{import('../microservice/microservice.js')} */
    const {microserviceRequest}= await import(`file://${process.cwd()}/microservice/microservice.js`);
    /**@type{import('../microservice/registry.js')} */
    const {registryMicroserviceApiVersion}= await import(`file://${process.cwd()}/microservice/registry.js`);

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
             *          block_user_app_data_search?:boolean,
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
                params.block_user_app_data_search = params.block_user_app_data_search ?? false;
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
                    //match block app data search
                    ((params.block_user_app_data_search && serverUtilNumberValue(app_query?.get('user_account_id'))==null && serverUtilNumberValue(app_query?.get('app_id'))==null) ||params.block_user_app_data_search==false) && 
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
                            
            /**
             * Calls microservice using client_id and client_secret defined for given app
             * @param {number} app_id
             * @param {string} microservice_path 
             * @param {string} microservice_query 
             */
            const call_microservice = async (app_id, microservice_path, microservice_query) => {
                //use app id, CLIENT_ID and CLIENT_SECRET for microservice IAM
                const authorization = `Basic ${Buffer.from(     fileModelAppSecret.get(app_id, null)[0].common_client_id + ':' + 
                                                                fileModelAppSecret.get(app_id, null)[0].common_client_secret,'utf-8').toString('base64')}`;
                return microserviceRequest(app_id == serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID')), //if appid = APP_COMMON_APP_ID then admin
                                            microservice_path, 
                                            Buffer.from(microservice_query + `&app_id=${app_id}`).toString('base64'), 
                                            routesparameters.method,
                                            routesparameters.ip, 
                                            authorization, 
                                            routesparameters.user_agent, 
                                            routesparameters.accept_language, 
                                            routesparameters.body?routesparameters.body:null,
                                            routesparameters.endpoint == 'SERVER_APP')
                        .then(result=>JSON.parse(result))
                        .catch((/**@type{server_server_error}*/error)=>{throw error;});
            };

            
            //using switch (true) pattern
            switch (true){
                //server routes
                //app data open routes to apps that got id token at start
                case route({url:`/bff/app_data/v1/app-common/${resource_id_string}`, method:'GET'}):{
                    resolve(app_common.commonAppsGet(routesparameters.app_id, resource_id_get_number(), app_query?.get('lang_code') ??'')
                                .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                    break;
                }
                case route({url:`/bff/app_data/v1/server-socket/socket-status/${resource_id_string}`, method:'GET'}):{
                    resolve(iso_return_message(socket.CheckOnline(
                                                /**@ts-ignore */
                                                resource_id_get_number()), 
                                                true));
                    break;
                }
                case route({url:'/bff/app_data/v1/server-db/identity_provider', method:'GET'}):{
                    resolve(dbModelIdentityProvider.get(routesparameters.app_id)
                                .then(result=>iso_return_message(result, false)));
                    break;
                }
                //app settings all values with or without translations including all common app id settings if requested setting is empty
                case route({url:'/bff/app_data/v1/server-db/app_settings', method:'GET'}):{
                    resolve(dbModelAppSetting.get(routesparameters.app_id, app_query)
                                .then(result=>iso_return_message(result, false)));
                    break;
                }
                //app settings without translations and only value if specified
                case route({url:'/bff/app_data/v1/server-db/app_settings_display', method:'GET'}):{
                    resolve(dbModelAppSetting.getDisplayData(routesparameters.app_id, app_query)
                                .then(result=>iso_return_message(result, (app_query?.get('setting_type')!='' && app_query?.get('setting_type')!=null && app_query?.get('value')!='' && app_query?.get('value')!=null)) ));
                    break;
                }
                case route({url:`/bff/app_data/v1/server-db/user_account-activate/${resource_id_string}`, method:'PUT', 
                            resource_validate_type:'id', resource_validate_value:resource_id_get_number(), required:true}):{
                    resolve(iam_service.iamAuthenticateUserActivate(routesparameters.app_id, 
                            /**@ts-ignore */
                            resource_id_get_number(), 
                            routesparameters.ip, routesparameters.user_agent, routesparameters.accept_language, routesparameters.host, app_query, routesparameters.body, routesparameters.res));
                    break;
                }
                case route({url:'/bff/app_data/v1/server-db/user_account-forgot', method:'POST'}):{
                    resolve(iam_service.iamAuthenticateUserForgot(routesparameters.app_id, routesparameters.ip, routesparameters.user_agent, routesparameters.accept_language, routesparameters.host, routesparameters.body));
                    break;
                }
                case route({url:'/bff/app_data/v1/server-db/user_account-profile-stat', method:'GET'}):{
                    resolve(dbModelUserAccount.getProfileStat(routesparameters.app_id, app_query)
                                .then(result=>iso_return_message(result, false)));
                    break;
                }
                case route({url:`/bff/app_data/v1/server-db/user_account-profile-name/${resource_id_string}`, method:'GET'}):{
                    resolve(dbModelUserAccount.getProfile(routesparameters.app_id, null, resource_id_get_string(), routesparameters.ip, routesparameters.user_agent, app_query, routesparameters.body, routesparameters.res)
                                .then(result=>iso_return_message(result, resource_id_get_string()!=null)));
                    break;
                }
                case route({url:`/bff/app_data/v1/server-db/user_account-profile/${resource_id_string}`, method:'GET'}):{
                    resolve(dbModelUserAccount.getProfile(routesparameters.app_id, resource_id_get_number(), null, routesparameters.ip, routesparameters.user_agent, app_query, routesparameters.body, routesparameters.res)
                                .then(result=>iso_return_message(result, (app_query?.get('search')=='' ||app_query?.get('search') == null))));
                    break;
                }
                case route({url:`/bff/app_data/v1/server-db/user_account_app_data_post/${resource_id_string}`, method:'GET', required:true}):{
                    resolve(dbModelUserAccountAppDataPost.getUserPostsByUserId(routesparameters.app_id, 
                                                                                /**@ts-ignore */
                                                                                resource_id_get_number(), 
                                                                                app_query, routesparameters.res)
                                .then(result=>iso_return_message(result, true)));
                    break;
                }
                case route({url:`/bff/app_data/v1/server-db/user_account_app_data_post-profile-stat-like/${resource_id_string}`, method:'GET', required: true}):{
                    resolve(dbModelUserAccountAppDataPost.getProfileStatLike(routesparameters.app_id, 
                                                                                /**@ts-ignore */
                                                                                resource_id_get_number(), 
                                                                                app_query, routesparameters.res)
                                .then(result=>iso_return_message(result, true)));
                    break;
                }
                case route({url:`/bff/app_data/v1/server-db/user_account_app_data_post-profile/${resource_id_string}`, method:'GET',required:true}):{
                    resolve(dbModelUserAccountAppDataPost.getProfileUserPosts(routesparameters.app_id, 
                                                                                /**@ts-ignore */
                                                                                resource_id_get_number(), 
                                                                                app_query, routesparameters.res)
                                .then(result=>iso_return_message(result, true)));
                    break;
                }
                case route({url:'/bff/app_data/v1/server-db/user_account_app_data_post-profile-stat', method:'GET'}):{
                    resolve(dbModelUserAccountAppDataPost.getProfileStatPost(routesparameters.app_id, app_query, routesparameters.res)
                                .then(result=>iso_return_message(result, false)));
                    break;
                }
                //server module metadata 
                case route({url:`/bff/admin/v1/app-module-metadata/${resource_id_string}`, method:'GET'}):{
                    resolve(app_common.commonModuleMetaDataGet({app_id: routesparameters.app_id, 
                                                                /**@ts-ignore */
                                                                type:app_query?.get('type'),
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
                                                        type:'REPORT',
                                                        resource_id:resource_id_get_string() ?? '', //module id
                                                        data:new URLSearchParams(routesparameters.url.substring(routesparameters.url.indexOf('?')+1)), 
                                                        user_agent:routesparameters.user_agent,
                                                        ip:routesparameters.ip,
                                                        locale:app_query?.get('lang_code') ??'',
                                                        endpoint:routesparameters.endpoint,
                                                        res:routesparameters.res})
                            .then((result=>iso_return_message(result, true)))); 
                    break;
                }
                case route({url:`/bff/admin/v1/app-module-report-queue/${resource_id_string}`, method:'GET'}):{
                    resolve(iso_return_message(fileModelAppModuleQueue.get(routesparameters.app_id, 
                                                        /**@ts-ignore */
                                                        resource_id_get_number(), 
                                                        routesparameters.res),
                                                resource_id_get_number()!=null));
                    break;
                }
                case route({url:`/bff/admin/v1/app-module-report-queue-result/${resource_id_string}`, method:'GET'}):{
                    resolve(fileModelAppModuleQueue.getResult(  routesparameters.app_id, 
                                                                /**@ts-ignore */
                                                                resource_id_get_number(), 
                                                                routesparameters.res)
                            .then((result=>iso_return_message(result, resource_id_get_number()!=null)))); 
                    break;
                }
                case route({url:`/bff/admin/v1/app-module-report-queue/${resource_id_string}`, method:'POST', required:true}):{
                    resolve(app_common.commonAppReportQueue({
                        app_id: routesparameters.app_id, 
                        type:'REPORT',
                        resource_id:resource_id_get_string() ?? '', //module id
                        iam:routesparameters.res.req.query.iam,
                        data:new URLSearchParams(routesparameters.url.substring(routesparameters.url.indexOf('?')+1)), 
                        user_agent:routesparameters.user_agent,
                        ip:routesparameters.ip,
                        locale:app_query?.get('lang_code') ??'',
                        endpoint:routesparameters.endpoint,
                        res:routesparameters.res}));
                    break;
                }
                //server module of type MODULE for APP
                case route({url:`/bff/app/v1/app-module-module/${resource_id_string}`, method:'GET'}):{
                    resolve(app_common.commonModuleGet({
                                                        app_id: routesparameters.app_id, 
                                                        type:'MODULE',
                                                        resource_id:resource_id_get_string() ?? '', //module id
                                                        data:null, 
                                                        user_agent:routesparameters.user_agent,
                                                        ip:routesparameters.ip,
                                                        locale:app_query?.get('lang_code') ??'',
                                                        endpoint:routesparameters.endpoint,
                                                        res:routesparameters.res})
                            .then((result=>iso_return_message(result, resource_id_get_number()!=null)))); 
                    break;
                }                
                //server module of type FUNCTION  for app_data, app_external or app_access
                case route({url:`/bff/app_data/v1/app-module-function/${resource_id_string}`, method:'POST', 
                            resource_validate_app_data_app_id: routesparameters.body.data_app_id, required:true, validate_app_function:resource_id_get_string(), validate_app_function_role:'APP_DATA'}):
                case route({url:`/bff/app_external/v1/app-module-function/${resource_id_string}`, method:'POST', 
                            validate_app_function:resource_id_get_string(), validate_app_function_role:'APP_EXTERNAL'}):
                case route({url:`/bff/app_access/v1/app-module-function/${resource_id_string}`, method:'POST', 
                    resource_validate_app_data_app_id: routesparameters.body.data_app_id, resource_validate_type:'id', resource_validate_value:routesparameters.body.user_account_id, required:true, validate_app_function:resource_id_get_string(), validate_app_function_role:'APP_ACCESS'}):{
                    //call COMMON_APP_ID function if requested or call the function registered on the app
                    resolve(app_common.commonModuleRun({
                                            app_id:(routesparameters.body.data_app_id == COMMON_APP_ID)?COMMON_APP_ID ?? routesparameters.app_id:routesparameters.app_id, 
                                            type:'FUNCTION',
                                            resource_id:resource_id_get_string() ?? '', 
                                            data:routesparameters.body, 
                                            user_agent:routesparameters.user_agent,
                                            ip:routesparameters.ip,
                                            locale:app_query?.get('lang_code') ??'',
                                            endpoint:routesparameters.endpoint,
                                            res:routesparameters.res}).then(result=>iso_return_message(result, false)));
                    break;
                }
                //app access routes, for users with an access token
                case route({url:`/bff/app_access/v1/server-db/user_account-password/${resource_id_string}`, method:'PATCH', 
                            resource_validate_type:'id', resource_validate_value:resource_id_get_number(), required:true}):{
                    resolve(dbModelUserAccount.updatePassword(routesparameters.app_id, 
                                                            /**@ts-ignore */
                                                            resource_id_get_number(), 
                                                            routesparameters.ip, routesparameters.user_agent, routesparameters.host, routesparameters.accept_language, app_query, routesparameters.body, routesparameters.res));
                    break;
                }
                //admin can update any user and uses same function as users
                //user can only update their own records
                case route({url:`/bff/admin/v1/server-db/user_account/${resource_id_string}`, method:'PATCH', 
                            resource_validate_type:'id', resource_validate_value:resource_id_get_number(), required:true}):
                case route({url:`/bff/app_access/v1/server-db/user_account/${resource_id_string}`, method:'PATCH', 
                            resource_validate_type:'id', resource_validate_value:resource_id_get_number(), required:true}):{
                    resolve(iam_service.iamAuthenticateUserUpdate(routesparameters.app_id, 
                                                            /**@ts-ignore */ 
                                                            resource_id_get_number(), 
                                                            routesparameters.ip, routesparameters.user_agent, routesparameters.host, routesparameters.accept_language, app_query, routesparameters.body, routesparameters.res));
                    break;
                }
                case route({url:`/bff/app_access/v1/server-db/user_account/${resource_id_string}`, method:'GET', 
                            resource_validate_type:'id', resource_validate_value:resource_id_get_number(), required:true}):{
                    resolve(dbModelUserAccount.getUserByUserId(routesparameters.app_id, 
                                                            /**@ts-ignore */
                                                            resource_id_get_number(), 
                                                            app_query, routesparameters.res)
                                .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                    break;
                }
                case route({url:`/bff/app_access/v1/server-db/user_account-common/${resource_id_string}`, method:'PATCH', 
                            resource_validate_type:'id', resource_validate_value:resource_id_get_number(), required:true}):{
                    resolve(dbModelUserAccount.updateUserCommon(routesparameters.app_id, 
                                                                /**@ts-ignore */
                                                                resource_id_get_number(), 
                                                                app_query, routesparameters.body, routesparameters.res));
                    break;
                }
                case route({url:`/bff/app_access/v1/server-db/user_account/${resource_id_string}`, method:'DELETE', 
                            resource_validate_type:'id', resource_validate_value:resource_id_get_number(), required:true}):{
                    resolve(iam_service.iamAuthenticateUserDelete(routesparameters.app_id, 
                                                        /**@ts-ignore */
                                                        resource_id_get_number(), 
                                                        app_query, routesparameters.body, routesparameters.res));
                    break;
                }
                case route({url:`/bff/app_access/v1/server-db/user_account-profile-detail/${resource_id_string}`, method:'GET', required:true}):{
                    resolve(dbModelUserAccount.getProfileDetail(routesparameters.app_id, 
                                                                /**@ts-ignore */
                                                                resource_id_get_number(), 
                                                                app_query, routesparameters.res)
                                .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                    break;
                }
                case route({url:`/bff/app_access/v1/server-db/user_account_follow/${resource_id_string}`, method:'POST', 
                            resource_validate_type:'id', resource_validate_value:resource_id_get_number(), required:true}):{
                    resolve(dbModelUserAccountFollow.post(routesparameters.app_id, 
                                                    /**@ts-ignore */
                                                    resource_id_get_number(), 
                                                    routesparameters.body));
                    break;
                }
                case route({url:`/bff/app_access/v1/server-db/user_account_follow/${resource_id_string}`, method:'DELETE', 
                            resource_validate_type:'id', resource_validate_value:resource_id_get_number(), required:true}):{
                    resolve(dbModelUserAccountFollow.deleteRecord(routesparameters.app_id, 
                                                        /**@ts-ignore */
                                                        resource_id_get_number(), 
                                                        routesparameters.body));
                    break;
                }
                case route({url:`/bff/app_access/v1/server-db/user_account_like/${resource_id_string}`, method:'POST', 
                            resource_validate_type:'id', resource_validate_value:resource_id_get_number(), required:true}):{
                    resolve(dbModelUserAccountLike.post(routesparameters.app_id, 
                                                    /**@ts-ignore */
                                                    resource_id_get_number(), 
                                                    routesparameters.body));
                    break;
                }
                case route({url:`/bff/app_access/v1/server-db/user_account_like/${resource_id_string}`, method:'DELETE', 
                            resource_validate_type:'id', resource_validate_value:resource_id_get_number(), required:true}):{
                    resolve(dbModelUserAccountLike.deleteRecord(routesparameters.app_id, 
                                                    /**@ts-ignore */
                                                    resource_id_get_number(), 
                                                    routesparameters.body));
                    break;
                }
                case route({url:`/bff/app_access/v1/server-db/user_account_app/${resource_id_string}`, method:'GET', 
                            resource_validate_type:'id', resource_validate_value:resource_id_get_number(), required:true}):{
                    resolve(dbModelUserAccountApp.get(routesparameters.app_id, 
                                                                    /**@ts-ignore */
                                                                    resource_id_get_number())
                                .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                    break;
                }
                case route({url:`/bff/app_access/v1/server-db/user_account_app-apps/${resource_id_string}`, method:'GET', required:true}):{
                    resolve(dbModelUserAccountApp.getApps(routesparameters.app_id, 
                                                                    /**@ts-ignore */
                                                                    resource_id_get_number(),
                                                                    app_query?.get('lang_code') ??'')
                                .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                    break;
                }
                case route({url:`/bff/app_access/v1/server-db/user_account_app/${resource_id_string}`, method:'PATCH', 
                            resource_validate_type:'id', resource_validate_value:resource_id_get_number(), required:true}):{
                    resolve(dbModelUserAccountApp.update(routesparameters.app_id, 
                                                                        /**@ts-ignore */
                                                                        resource_id_get_number(), routesparameters.body));
                    break;
                }
                case route({url:`/bff/app_access/v1/server-db/user_account_app/${resource_id_string}`, method:'DELETE', 
                            resource_validate_type:'id', resource_validate_value:resource_id_get_number(), required:true}):{
                    resolve(dbModelUserAccountApp.deleteRecord(routesparameters.app_id, 
                                                                        /**@ts-ignore */
                                                                        resource_id_get_number(), 
                                                                        app_query));
                    break;
                }
                case route({url:`/bff/app_access/v1/server-db/user_account_app_data_post-profile-detail/${resource_id_string}`, method:'GET', required:true}):{
                    resolve(dbModelUserAccountAppDataPost.getProfileUserPostDetail(routesparameters.app_id, 
                                                                                    /**@ts-ignore */
                                                                                    resource_id_get_number(), 
                                                                                    app_query, routesparameters.res)
                                .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                    break;
                }
                case route({url:'/bff/app_access/v1/server-db/user_account_app_data_post', method:'POST', 
                            resource_validate_type:'id', resource_validate_value:routesparameters.body.user_account_id}):{
                    resolve(dbModelUserAccountAppDataPost.createUserPost(routesparameters.app_id, app_query, routesparameters.body));
                    break;
                }
                case route({url:`/bff/app_access/v1/server-db/user_account_app_data_post/${resource_id_string}`, method:'PUT', 
                            resource_validate_type:'id', resource_validate_value:routesparameters.body.user_account_id, required:true}):{
                    resolve(dbModelUserAccountAppDataPost.updateUserPost(routesparameters.app_id, resource_id_get_number(), app_query, routesparameters.body, routesparameters.res));
                    break;
                }
                case route({url:`/bff/app_access/v1/server-db/user_account_app_data_post/${resource_id_string}`, method:'DELETE', 
                            resource_validate_type:'id', resource_validate_value:routesparameters.body.user_account_id, required:true}):{
                    resolve(dbModelUserAccountAppDataPost.deleteUserPost(routesparameters.app_id, 
                                                                            /**@ts-ignore */
                                                                            resource_id_get_number(), 
                                                                            app_query, routesparameters.body, routesparameters.res));
                    break;
                }
                case route({url:`/bff/app_access/v1/server-db/user_account_app_data_post_like/${resource_id_string}`, method:'POST', 
                            resource_validate_type:'id', resource_validate_value:resource_id_get_number(), required:true}):{
                    resolve(dbModelUserAccountAppDataPostLike.post(routesparameters.app_id, 
                                                                /**@ts-ignore */
                                                                resource_id_get_number(), 
                                                                routesparameters.body));
                    break;
                }
                case route({url:`/bff/app_access/v1/server-db/user_account_app_data_post_like/${resource_id_string}`, method:'DELETE', 
                            resource_validate_type:'id', resource_validate_value:resource_id_get_number(), required:true}):{
                    resolve(dbModelUserAccountAppDataPostLike.deleteRecord(routesparameters.app_id, 
                                                                    /**@ts-ignore */
                                                                    resource_id_get_number(), 
                                                                    routesparameters.body));
                    break;
                }
                //admin routes and available only in admin app with admin token
                case route({url:`/bff/admin/v1/server-db/app_data_entity/${resource_id_string}`, method:'GET'}):{
                    resolve(dbModelAppDataEntity.get(routesparameters.app_id, resource_id_get_number(), app_query)
                                .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                    break;
                }
                case route({url:`/bff/admin/v1/server-db/app_data_entity_resource/${resource_id_string}`, method:'GET'}):{
                    resolve(dbModelAppDataEntityResource.get(routesparameters.app_id, resource_id_get_number(), app_query)
                                .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                    break;
                }
                case route({url:`/bff/admin/v1/server-db/app_data_resource_master/${resource_id_string}`, method:'GET'}):{
                    resolve(dbModelAppDataResourceMaster.get(routesparameters.app_id, resource_id_get_number(), app_query)
                                .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                    break;
                }
                case route({url:'/bff/admin/v1/server-db/app_data_resource_master', method:'POST'}):{
                    resolve(dbModelAppDataResourceMaster.post(routesparameters.app_id, routesparameters.body));
                    break;
                }
                case route({url:`/bff/admin/v1/server-db/app_data_resource_master/${resource_id_string}`, method:'PUT'}):{
                    resolve(dbModelAppDataResourceMaster.update(routesparameters.app_id, 
                                                        /**@ts-ignore */
                                                        resource_id_get_number(), 
                                                        routesparameters.body));
                    break;
                }
                case route({url:`/bff/admin/v1/server-db/app_data_resource_master/${resource_id_string}`, method:'DELETE', required:true}):{
                    resolve(dbModelAppDataResourceMaster.deleteRecord(routesparameters.app_id, 
                                                        /**@ts-ignore */
                                                        resource_id_get_number(),
                                                        routesparameters.body));
                    break;
                }
                case route({url:`/bff/admin/v1/server-db/app_data_resource_detail/${resource_id_string}`, method:'GET'}):{
                    resolve(dbModelAppDataResourceDetail.get(routesparameters.app_id, resource_id_get_number(), app_query)
                                .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                    break;
                }
                case route({url:'/bff/admin/v1/server-db/app_data_resource_detail', method:'POST'}):{
                    resolve(dbModelAppDataResourceDetail.post(routesparameters.app_id, routesparameters.body));
                    break;
                }
                case route({url:`/bff/admin/v1/server-db/app_data_resource_detail/${resource_id_string}`, method:'PUT', required:true}):{
                    resolve(dbModelAppDataResourceDetail.update(routesparameters.app_id, 
                                                        /**@ts-ignore */
                                                        resource_id_get_number(), 
                                                        routesparameters.body));
                    break;
                }
                case route({url:`/bff/admin/v1/server-db/app_data_resource_detail/${resource_id_string}`, method:'DELETE', required:true}):{
                    resolve(dbModelAppDataResourceDetail.deleteRecord(routesparameters.app_id, 
                                                        /**@ts-ignore */
                                                        resource_id_get_number(),
                                                        routesparameters.body));
                    break;
                }
                case route({url:`/bff/admin/v1/server-db/app_data_resource_detail_data/${resource_id_string}`, method:'GET'}):{
                    resolve(dbModelAppDataResourceDetailData.get(routesparameters.app_id, resource_id_get_number(), app_query)
                            .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                    break;
                }
                case route({url:'/bff/admin/v1/server-db/app_data_resource_detail_data', method:'POST'}):{
                        resolve(dbModelAppDataResourceDetailData.post(routesparameters.app_id, routesparameters.body));
                        break;
                }
                case route({url:`/bff/admin/v1/server-db/app_data_resource_detail_data/${resource_id_string}`, method:'PUT', required:true}):{
                    resolve(dbModelAppDataResourceDetailData.update(routesparameters.app_id, 
                                                        /**@ts-ignore */
                                                        resource_id_get_number(), 
                                                        routesparameters.body));
                    break;
                }
                case route({url:`/bff/admin/v1/server-db/app_data_resource_detail_data/${resource_id_string}`, method:'DELETE', required:true}):{
                    resolve(dbModelAppDataResourceDetailData.deleteRecord(routesparameters.app_id, 
                                                        /**@ts-ignore */
                                                        resource_id_get_number(),
                                                        routesparameters.body));
                    break;
                }
                case route({url:'/bff/admin/v1/server-db/app_data_stat', method:'GET'}):{
                    resolve(dbModelAppDataStat.get(routesparameters.app_id, app_query)
                            .then(result=>iso_return_message(result, false)));
                    break;
                }
                case route({url:'/bff/admin/v1/server-db_admin/app_data_stat-log', method:'GET'}):{
                    resolve(dbModelAppDataStat.getLog(routesparameters.app_id, app_query)
                                .then(result=>iso_return_message(result, false)));
                    break;
                }
                case route({url:'/bff/admin/v1/server-db_admin/app_data_stat-log-stat', method:'GET'}):{
                    resolve(dbModelAppDataStat.getStatUniqueVisitor(routesparameters.app_id, app_query)
                                .then(result=>iso_return_message(result, false)));
                    break;
                }
                case route({url:'/bff/admin/v1/server-socket/message', method:'POST'}):{
                    resolve(socket.socketAdminSend(routesparameters.app_id, routesparameters.body));
                    break;
                }
                case route({url:'/bff/admin/v1/server-socket/socket-stat', method:'GET'}):{
                    resolve(iso_return_message(socket.socketConnectedCount(app_query), true));
                    break;
                }
                case route({url:'/bff/admin/v1/server-socket/socket', method:'GET'}):{
                    resolve(socket.socketConnectedList(routesparameters.app_id, app_query)
                            .then(result=>iso_return_message(result, false)));
                    break;
                }
                case route({url:'/bff/admin/v1/server-db_admin/database-demo', method:'POST'}):{
                    resolve(dbModelDatabase.dbDemoInstall(routesparameters.app_id, app_query, routesparameters.body));
                    break;
                }
                case route({url:'/bff/admin/v1/server-db_admin/database-demo', method:'DELETE'}):{
                    resolve(dbModelDatabase.dbDemoUninstall(routesparameters.app_id, app_query));
                    break;
                }
                case route({url:'/bff/admin/v1/app-common', method:'GET'}):{
                    //return all apps
                    resolve(iso_return_message(fileModelApp.get(routesparameters.app_id, null, routesparameters.res), false));
                    break;
                }
                case route({url:`/bff/admin/v1/app-common-app/${resource_id_string}`, method:'PUT', required:true}):{
                    resolve(fileModelApp.update(routesparameters.app_id, 
                                                /**@ts-ignore */
                                                resource_id_get_number(), 
                                                routesparameters.body,
                                                routesparameters.res));
                    break;
                }
                case route({url:`/bff/admin/v1/app-common-app-module/${resource_id_string}`, method:'GET', required:true}):{
                    resolve(iso_return_message(fileModelAppModule.get(
                                                    routesparameters.app_id, 
                                                    null,
                                                    resource_id_get_number(),
                                                    routesparameters.res),
                                                    resource_id_get_number()!=null));
                    break;
                }
                case route({url:`/bff/admin/v1/app-common-app-module/${resource_id_string}`, method:'PUT', required:true}):{
                    resolve(fileModelAppModule.update(  routesparameters.app_id, 
                                                        /**@ts-ignore */
                                                        resource_id_get_number(), 
                                                        routesparameters.body,
                                                        routesparameters.res));
                    break;
                }
                case route({url:`/bff/admin/v1/app-common-app-parameter/${resource_id_string}`, method:'GET', required:true}):{
                    resolve(iso_return_message(fileModelAppParameter.get(
                                                        /**@ts-ignore */
                                                        resource_id_get_number(), 
                                                        routesparameters.res),
                                                        resource_id_get_number()!=null));
                    break;
                }
                case route({url:`/bff/admin/v1/app-common-app-parameter/${resource_id_string}`, method:'PATCH', required:true}):{
                    resolve(fileModelAppParameter.update(   routesparameters.app_id, 
                                                            /**@ts-ignore */
                                                            resource_id_get_number(), 
                                                            routesparameters.body,
                                                            routesparameters.res));
                    break;
                }
                case route({url:`/bff/admin/v1/app-common-app-secret/${resource_id_string}`, method:'GET', required:true}):{
                    resolve(iso_return_message(fileModelAppSecret.get(
                                                            /**@ts-ignore */
                                                            resource_id_get_number(),
                                                            routesparameters.res),
                                                            resource_id_get_number()!=null));
                    break;
                }
                case route({url:`/bff/admin/v1/app-common-app-secret/${resource_id_string}`, method:'PATCH', required:true}):{
                    resolve(fileModelAppSecret.update(      routesparameters.app_id, 
                                                            /**@ts-ignore */
                                                            resource_id_get_number(), 
                                                            routesparameters.body,
                                                            routesparameters.res));
                    break;
                }
                case route({url:'/bff/admin/v1/server-db_admin/user_account-stat', method:'GET'}):{
                    resolve(dbModelUserAccount.getStatCountAdmin(routesparameters.app_id)
                                .then(result=>iso_return_message(result, false)));
                    break;
                }
                case route({url:'/bff/admin/v1/server-db_admin/user_account', method:'GET'}):{
                    resolve(dbModelUserAccount.getUsersAdmin(routesparameters.app_id, app_query)
                                .then(result=>iso_return_message(result, false)));
                    break;
                }
                case route({url:`/bff/admin/v1/server-db_admin/user_account/${resource_id_string}`, method:'PATCH', required:true}):{
                    resolve(dbModelUserAccount.updateAdmin(routesparameters.app_id, 
                                                        /**@ts-ignore */
                                                        resource_id_get_number(), 
                                                        app_query, routesparameters.body, routesparameters.res));
                    break;
                }
                case route({url:`/bff/admin/v1/server-config/config/${resource_id_string}`, method:'GET', required:true}):{
                    resolve(fileModelConfig.getFile(
                                                    /**@ts-ignore */
                                                    resource_id_get_string(), 
                                                    app_query)
                                .then(result=>iso_return_message(result, resource_id_get_string()!=null)));
                    break;
                }
                case route({url:`/bff/admin/v1/server-config/config/${resource_id_string}`, method:'PUT', required:true}):{
                    resolve(fileModelConfig.update(
                                                    /**@ts-ignore */
                                                    resource_id_get_string(), 
                                                    routesparameters.body));
                    break;
                }
                case route({url:'/bff/admin/v1/server/info', method:'GET'}):{
                    resolve(info.info()
                                .then(result=>iso_return_message(result, true)));
                    break;
                }
                case route({url:'/bff/admin/v1/server-db_admin/database-installation', method:'GET'}):{
                    resolve(dbModelDatabase.dbInstalledCheck(routesparameters.app_id)
                                .then(result=>iso_return_message(result, true)));
                    break;
                }
                case route({url:'/bff/admin/v1/server-db_admin/database-space', method:'GET'}):{
                    resolve(dbModelDatabase.dbInfoSpace(routesparameters.app_id)
                                .then(result=>iso_return_message(result, false)));
                    break;
                }
                case route({url:'/bff/admin/v1/server-db_admin/database-spacesum', method:'GET'}):{
                    resolve(dbModelDatabase.dbInfoSpaceSum(routesparameters.app_id)
                                .then(result=>iso_return_message(result, true)));
                    break;
                }
                case route({url:'/bff/admin/v1/server-db_admin/database', method:'GET'}):{
                    resolve(dbModelDatabase.dbInfo(routesparameters.app_id)
                                .then(result=>iso_return_message(result, true)));
                    break;
                }
                case route({url:'/bff/admin/v1/server-db_admin/database', method:'POST'}):{
                    resolve(dbModelDatabase.dbInstall(routesparameters.app_id, app_query));
                    break;
                }
                case route({url:'/bff/admin/v1/server-db_admin/database', method:'DELETE'}):{
                    resolve(dbModelDatabase.dbUninstall(routesparameters.app_id, app_query));
                    break;
                }
                case route({url:'/bff/admin/v1/server-log/log', method:'GET'}):{
                    resolve(fileModelLog.get(routesparameters.app_id, app_query)
                                .then(result=>iso_return_message(result, false)));
                    break;
                }
                case route({url:'/bff/admin/v1/server/info-statuscode', method:'GET'}):{
                    resolve(fileModelLog.getStatusCodes()
                                .then(result=>iso_return_message(result, true)));
                    break;
                }
                case route({url:'/bff/admin/v1/server-log/log-stat', method:'GET'}):{
                    resolve(fileModelLog.getStat(routesparameters.app_id, app_query)
                                .then(result=>iso_return_message(result, false)));
                    break;
                }
                case route({url:'/bff/admin/v1/server-log/log-files', method:'GET'}):{
                    resolve(fileModelLog.getFiles()
                                .then(result=>iso_return_message(result, false)));
                    break;
                }
                case route({url:`/bff/admin/v1/server-iam/user/${resource_id_string}`, method:'GET'}):{
                    resolve(iam_service.iamUserGet(routesparameters.app_id,
                                                    /**@ts-ignore */
                                                    resource_id_get_number(), 
                                                    routesparameters.res)
                            .then((result=>iso_return_message(result, resource_id_get_number()!=null)))); 
                    break;
                }
                case route({url:`/bff/admin/v1/server-iam/user/${resource_id_string}`, method:'PATCH'}):{
                    resolve(iam_service.iamUserUpdate(
                        routesparameters.app_id,
                        /**@ts-ignore */
                        resource_id_get_number(),
                        routesparameters.body,
                        routesparameters.res));
                    break;
                }
                case route({url:'/bff/admin/v1/server-iam/iam_user_login', method:'GET'}):{
                    resolve(iso_return_message(iam_service.iamUserLoginGet(routesparameters.app_id, app_query), true));
                    break;
                }
                //socket using EventSource route
                case route({url:'/bff/socket/v1/server-socket/socket', method:'GET'}):{
                    //EventSource uses GET method, should otherwise be POST
                    resolve(socket.socketConnect(routesparameters.app_id, 
                            {
                            iam:routesparameters.res.req.query.iam,
                            headers_user_agent:routesparameters.user_agent,
                            headers_accept_language:routesparameters.accept_language,
                            ip:routesparameters.ip,
                            response:routesparameters.res
                            }));
                    break;
                }
                // app_signup route
                case route({url:'/bff/app_signup/v1/server-db/user_account-signup', method:'POST'}):{
                    resolve(iam_service.iamAuthenticateUserSignup(routesparameters.app_id, routesparameters.ip, routesparameters.user_agent, routesparameters.accept_language, app_query, routesparameters.body, routesparameters.res));
                    break;
                }
                //iam routes, for login and logout
                case route({url:'/bff/iam_admin/v1/server-iam-login', method:'POST'}):{
                    resolve(iam_service.iamAuthenticateAdmin(routesparameters.app_id, routesparameters.res.req.query.iam, routesparameters.authorization, routesparameters.ip, routesparameters.user_agent, routesparameters.accept_language, routesparameters.res));
                    break;
                }
                case route({url:'/bff/iam_user/v1/server-iam-login', method:'POST'}):{
                    resolve(iam_service.iamAuthenticateUser(routesparameters.app_id, routesparameters.res.req.query.iam, routesparameters.ip, routesparameters.user_agent, routesparameters.accept_language, routesparameters.body, routesparameters.res));
                    break;
                }
                case route({url:`/bff/iam_provider/v1/server-iam-login/${resource_id_string}`, method:'POST', required:true}):{
                    resolve(iam_service.iamAuthenticateUserProvider( routesparameters.app_id, routesparameters.res.req.query.iam, 
                                                            /**@ts-ignore */
                                                            resource_id_get_number(), 
                                                            routesparameters.ip, routesparameters.user_agent, routesparameters.accept_language, app_query, routesparameters.body, routesparameters.res));
                    break;
                }
                case route({url:'/bff/app_access/v1/server-iam-logout', method:'DELETE'}):
                case route({url:'/bff/admin/v1/server-iam-logout', method:'DELETE'}):{
                    resolve(iam_service.iamUserLogout(routesparameters.app_id, routesparameters.authorization, routesparameters.ip, routesparameters.user_agent, routesparameters.accept_language, routesparameters.res));
                    break;
                }
                //microservice routes
                //changes URI to call microservices, syntax:
                //[microservice protocol]://[microservice host]:[microservice port]/[service]/v[microservice API version configured for each service][resource]/[optional resource id]?[base64 encoded URI query];
                case route({url:'/bff/app_data/v1/geolocation/ip', method:'GET'}) ||
                    (routesparameters.endpoint.startsWith('SERVER') && routesparameters.route_path=='/geolocation/ip'):{
                    if (serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_IAM', 'ENABLE_GEOLOCATION'))==1){
                        const params = URI_query.split('&');                        
                        //set ip from client in case ip query parameter is missing
                        //if ip parameter does not exist
                        if (params.filter(parm=>parm.includes('ip=')).length==0 )
                            params.push(`ip=${routesparameters.ip}`);
                        else{
                            //if empty ip parameter
                            if (params.filter(parm=>parm == 'ip=').length==1)
                                params.map(parm=>parm = parm.replace('ip=', `ip=${routesparameters.ip}`));
                        }
                        console.log('route: geolocation/ip');
                        resolve(call_microservice(  routesparameters.app_id,
                                            `/geolocation/v${registryMicroserviceApiVersion('GEOLOCATION')}${routesparameters.route_path}`, 
                                            `${params.reduce((param_sum,param)=>param_sum += '&' + param)}`)
                                .then(result=>iso_return_message(result, true)));
                    }   
                    else
                        return resolve('');
                    break;
                }
                case route({url:'/bff/app_data/v1/geolocation/place', method:'GET'}):{
                    resolve(call_microservice(  routesparameters.app_id,`/geolocation/v${registryMicroserviceApiVersion('GEOLOCATION')}${routesparameters.route_path}`, URI_query)        
                            .then(result=>iso_return_message(result, true)));
                    break;
                }
                case route({url:'/bff/app_data/v1/worldcities/city', method:'GET'}):{
                    resolve(call_microservice(  routesparameters.app_id,
                                                `/worldcities/v${registryMicroserviceApiVersion('WORLDCITIES')}${routesparameters.route_path}`, 
                                                URI_query + `&limit=${serverUtilNumberValue(fileModelAppParameter.get(COMMON_APP_ID??0, routesparameters.res)[0].common_app_limit_records.value)}`)
                            .then(result=>iso_return_message(result, false)));
                    break;
                }
                case route({url:'/bff/app_data/v1/worldcities/city-random', method:'GET'})||
                    (routesparameters.endpoint.startsWith('SERVER') && routesparameters.route_path=='/worldcities/city-random'):{
                    resolve(call_microservice(  routesparameters.app_id, `/worldcities/v${registryMicroserviceApiVersion('WORLDCITIES')}${routesparameters.route_path}`, URI_query)
                            .then(result=>iso_return_message(result, true)));
                    break;
                }
                case route({url:`/bff/app_data/v1/worldcities/country/${resource_id_string}`, method:'GET', required:true}):{
                    resolve(call_microservice(  routesparameters.app_id, `/worldcities/v${registryMicroserviceApiVersion('WORLDCITIES')}${routesparameters.route_path}`, URI_query)
                            .then(result=>iso_return_message(result, false)));
                    break;
                }
                case routesparameters.route_path=='/mail/sendemail' && routesparameters.endpoint.startsWith('SERVER'):{
                    //mail can only be sent from server
                    resolve(call_microservice(  routesparameters.app_id, `/mail/v${registryMicroserviceApiVersion('MAIL')}${routesparameters.route_path}`, URI_query));
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
                    reject('⛔');
                    break;
                }
            }
        } catch (error) {
            reject(error);
        }
    });
 };

/**
 * Server start
 * Logs uncaughtException and unhandledRejection
 * Start http server and https server if enabled
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
        //Get express app with all configurations
        /**@type{server_server_express}*/
        const app = await serverExpress();
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
        serverREST_API, serverStart };