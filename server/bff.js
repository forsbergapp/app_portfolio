/** @module server/bff */

/**
 * @import {server_iam_authenticate_request, 
 *          server_db_document_ConfigServer,
 *          server_bff_RestApi_parameters,
 *          server_server_req, 
 *          server_server_res, 
 *          server_server_error, 
 *          server_server_response,
 *          server_apps_info_parameters,
 *          server_bff_parameters} from './types.js'
 */

const {serverResponse, serverUtilResponseTime, serverUtilNumberValue} = await import('./server.js');
const ConfigServer = await import('./db/ConfigServer.js');
const IamUser = await import('./db/IamUser.js');
const Log = await import('./db/Log.js');
const {iamAuthenticateRequest} = await import('./iam.js');
const app_common= await import('../apps/common/src/common.js');
const fs = await import('node:fs');

/**
 * @name bffConnect
 * @description Initial request from app, connects to socket, sends SSE message with common library and parameters
 * @function 
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          ip:string,
 *          idToken:string,
 *          user_agent:string,
 *          accept_language:string,
 *          response:server_server_res,
 *          locale:string}} parameters
 * @returns {Promise.<void>}
 */
const bffConnect = async parameters =>{
    const AppParameter = await import('./db/AppParameter.js');
    const ConfigServer = await import('./db/ConfigServer.js');
    const socket = await import('./socket.js');
    const common = await import('../apps/common/src/common.js');
    /**@type{server_db_document_ConfigServer} */
    const configServer = ConfigServer.get({app_id:parameters.app_id}).result;

    const common_app_id = serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID);
    const admin_app_id = serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_ADMIN_APP_ID' in parameter)[0].APP_ADMIN_APP_ID);
    const count_user = IamUser.get(parameters.app_id, null).result.length;
    const admin_only = (await common.commonAppStart(parameters.app_id)==true?false:true) && count_user==0;
    const start_app_id = admin_app_id == parameters.app_id?
                                            admin_app_id:
                                                serverUtilNumberValue(configServer.SERVICE_APP
                                                    .filter(parameter=>'APP_START_APP_ID' in parameter)[0].APP_START_APP_ID)??0;
    //geodata for APP
    const result_geodata = await common.commonGeodata({   app_id:parameters.app_id, 
                                                        endpoint:'SERVER', 
                                                        ip:parameters.ip, 
                                                        user_agent:parameters.user_agent ??'', 
                                                        accept_language:parameters.locale??''});
    /**@type{server_apps_info_parameters} */
    const server_apps_info_parameters = {   
        app_id:                         start_app_id,
        app_idtoken:                    parameters.idToken,
        client_latitude:                result_geodata?.latitude,
        client_longitude:               result_geodata?.longitude,
        client_place:                   result_geodata?.place ?? '',
        client_timezone:                result_geodata?.timezone,
        app_common_app_id:              common_app_id,
        app_admin_app_id:               admin_app_id,
        app_start_app_id:               start_app_id,
        app_toolbar_button_start:       serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_TOOLBAR_BUTTON_START' in parameter)[0].APP_TOOLBAR_BUTTON_START)??1,
        app_toolbar_button_framework:   serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_TOOLBAR_BUTTON_FRAMEWORK' in parameter)[0].APP_TOOLBAR_BUTTON_FRAMEWORK)??1,
        app_framework:                  serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_FRAMEWORK' in parameter)[0].APP_FRAMEWORK)??1,
        app_framework_messages:         serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_FRAMEWORK_MESSAGES' in parameter)[0].APP_FRAMEWORK_MESSAGES)??1,
        rest_resource_bff:              configServer.SERVER.filter(parameter=>'REST_RESOURCE_BFF' in parameter)[0].REST_RESOURCE_BFF,
        rest_api_version:               configServer.SERVER.filter(parameter=>'REST_API_VERSION' in parameter)[0].REST_API_VERSION,
        first_time:                     count_user==0?1:0,
        admin_only:                     admin_only?1:0
    };
    //connect socket
    const connectUserData = await socket.socketPost({  app_id:start_app_id,
                            idToken:parameters.idToken,
                            authorization:'',
                            user_agent:parameters.user_agent,
                            accept_language:parameters.accept_language,
                            ip:parameters.ip,
                            response:parameters.response
                            });
    
    //send SSE INIT
    await socket.socketAppServerFunctionSend( start_app_id, 
        parameters.idToken, 
        'INIT', 
        JSON.stringify({
            APP:{id:start_app_id},
            APP_PARAMETER:{ 
                AppParametersCommon:AppParameter.get({app_id:parameters.app_id,
                                                        resource_id:common_app_id}).result[0]??{},
                Info:server_apps_info_parameters
            }
        })
    );
    //send SSE CONNECTINFO
    socket.socketClientSend(parameters.response, 
                            Buffer.from(JSON.stringify({ 
                                latitude: connectUserData.latitude,
                                longitude: connectUserData.longitude,
                                place: connectUserData.place,
                                timezone: connectUserData.timezone})).toString('base64'), 'CONNECTINFO');
};
/**
 * @name bffInit
 * @description Backend for frontend (BFF) init
 *              Logs if the request is from SSE
 *              Logs when the response is closed
 *              Authenticates the request
 *              Sets header values on both on the response and on the request
 *              Checks robots.txt and favicon.ico
 *              Redirects from http to https if https is enabled 
 *              Returns a reason if response should be closed
 * @function
 * @param {server_server_req} req
 * @param {server_server_res} res
 * @returns Promise.<{  reason:'ROBOT'|'FAVICON'|'REQUEST'|null}>
 */
const bffInit = async (req, res) =>{
    if (req.headers.accept == 'text/event-stream'){
        //SSE, log since response is open and log again when closing
        Log.post({  app_id:0, 
            data:{  object:'LogRequestInfo', 
                    request:{   req:req,
                                responsetime:serverUtilResponseTime(res),
                                statusCode:res.statusCode,
                                statusMessage:typeof res.statusMessage == 'string'?res.statusMessage:JSON.stringify(res.statusMessage)??''
                            },
                    log:''
                }
            });
    }
    else{
        //set default no cache response header and close connection request header
        res.setHeader('Cache-Control', 'no-store');
        req.headers.connection = 'close';
    }
        
    res.on('close',()=>{	
        //SSE response time will be time connected until disconnected
        Log.post({  app_id:0, 
            data:{  object:'LogRequestInfo', 
                    request:{   req:req,
                                responsetime:serverUtilResponseTime(res),
                                statusCode:res.statusCode,
                                statusMessage:typeof res.statusMessage == 'string'?res.statusMessage:JSON.stringify(res.statusMessage)??''
                            },
                    log:''
                }
            }).then(() => {
            // do not return any StatusMessage to client, this is only used for logging purpose
            res.statusMessage = '';
            res.end();
        });
    });
    /**@type{server_db_document_ConfigServer} */
    const config_SERVER = ConfigServer.get({app_id:0}).result;
    const HTTPS_PORT = serverUtilNumberValue(config_SERVER.SERVER.filter(row=>'HTTPS_PORT' in row)[0].HTTPS_PORT);
    //redirect from http to https if https is enabled
    if (req.protocol=='http' && config_SERVER.SERVER.filter(row=>'HTTPS_ENABLE' in row)[0].HTTPS_ENABLE=='1')
        return {reason:'REDIRECT', redirect:`https://${req.headers.host.split(':')[0] + (HTTPS_PORT==443?'':':' + HTTPS_PORT)}${req.originalUrl}`};
    else{
        //access control that stops request if not passing controls
        /**@type{server_iam_authenticate_request}*/
        const result = await iamAuthenticateRequest({ip:req.ip, 
                                                    host:req.headers.host ?? '', 
                                                    method: req.method, 
                                                    'user-agent': req.headers['user-agent'], 
                                                    'accept-language':req.headers['accept-language'], 
                                                    path:req.path})
                            .catch((/**@type{server_server_error}*/error)=>{return { statusCode: 500, statusMessage: error};});
        if (result != null){
            res.statusCode = result.statusCode;
            res.statusMessage = ' ';
            res.writeHead(res.statusCode, {
                'Content-Type': 'text/plain;charset=utf-8',
                'Content-length':0
            });
            return {reason:'REQUEST'};
        }
        else{

            //check robots.txt
            if (req.originalUrl=='/robots.txt'){
                res.statusMessage = ' ';
                res.type('text/plain');
                res.write('User-agent: *\nDisallow: /');
                return {reason:'ROBOT'};
            }
            else{
                //browser favorite icon to ignore
                if (req.originalUrl=='/favicon.ico'){
                    res.statusMessage = ' ';
                    res.write('');
                    return {reason:'FAVICON'};
                }
                else{
                    return {reason:null};
                }
            }
        }
    }
};
/**
 * @name bffStart
 * @description Backend for frontend (BFF) start 
 *              If first time, when no admin exists, then redirect everything to admin
 *              Checks if SSL verification using Letsencrypt is enabled when validating domain
 *              and sends requested verifcation file
 * @functions
 * @param {server_server_req} req
 * @param {server_server_res} res
 * @returns {Promise.<server_server_response>}
 */
const bffStart = async (req, res) =>{
    /**@type{server_db_document_ConfigServer} */
    const configServer = ConfigServer.get({app_id:0}).result;
    const {serverProcess} = await import('./server.js');
    const {commonAppIam} = await import('../apps/common/src/common.js');
    //if first time, when no user exists, show maintenance in main server
    if (IamUser.get(0, null).result.length==0 && commonAppIam(req.headers.host).admin == false){
        const {default:ComponentCreate} = await import('../apps/common/src/component/common_maintenance.js');
        return {result:await ComponentCreate({  data:   null,
                                                methods:null
                                            }), type:'HTML'};
    }   
    else{
        //check if SSL verification using letsencrypt is enabled when validating domains
        if (configServer.SERVER.filter(row=>'HTTPS_SSL_VERIFICATION' in row)[0].HTTPS_SSL_VERIFICATION=='1'){
            if (req.originalUrl.startsWith(configServer.SERVER.filter(row=>'HTTPS_SSL_VERIFICATION_PATH' in row)[0].HTTPS_SSL_VERIFICATION_PATH ?? '')){
                res.type('text/plain');
                res.write(await fs.promises.readFile(`${serverProcess.cwd()}${req.originalUrl}`, 'utf8'));
                return {result:null, type:'HTML'};
            }
            else
                return {result:null, type:'HTML'};
        }
        else
            return {result:null, type:'HTML'};
    }
};
/**
 * @name bff
 * @namespace ROUTE_APP
 * @description Backend for frontend (BFF) called from client
 * @function
 * @param {server_server_req} req
 * @param {server_server_res} res
 * @returns {Promise<*>}
 */
 const bff = async (req, res) =>{
    const resultbffInit =   await bffInit(req, res);
    if (resultbffInit.reason == null){
        /**@type{server_server_response} */
        const result = await bffStart(req, res);
        if (result.result)
            return serverResponse({
                                    result_request:result,
                                    host:req.headers.host,
                                    route:null,
                                    res:res});
         else{
            /**@type{server_bff_parameters} */
            const bff_parameters = {
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
                                                    AppIdToken: req.headers['app-id-token']?.replace('Bearer ','')??null
                                    },
                                    authorization:  req.headers.authorization, 
                                    //metadata
                                    ip: req.headers['x-forwarded-for'] || req.ip, 
                                    user_agent: req.headers['user-agent'], 
                                    accept_language: req.headers['accept-language'], 
                                    //response
                                    res: res
                                };
            /**@type{server_db_document_ConfigServer} */
            const configServer = ConfigServer.get({app_id:0}).result;
            
            //all rest api starts with REST_RESOURCE_BFF parameter value (add '/')
            const endpoint_role =  bff_parameters.url.startsWith(configServer.SERVER.filter(parameter=>parameter.REST_RESOURCE_BFF)[0].REST_RESOURCE_BFF + '/')?
                                    (bff_parameters.url.split('/')[2]?.toUpperCase()):
                                        'APP';

            if (endpoint_role == 'APP' && 
                bff_parameters.method.toUpperCase() == 'GET' && 
                !bff_parameters.url?.startsWith(configServer.SERVER.filter(row=>'REST_RESOURCE_BFF' in row)[0].REST_RESOURCE_BFF + '/')){
                //use common app id for APP since no app id decided
                const common_app_id = serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID)??0;
                switch (true){
                    //font css that can contain font source links
                    case (bff_parameters.url.startsWith('/common/css/font/font')):{
                        const {commonResourceFile} = await import('../apps/common/src/common.js');
                        return serverResponse({app_id:common_app_id,
                                        result_request: await commonResourceFile({   app_id:common_app_id, 
                                                        resource_id:bff_parameters.url, 
                                                        content_type:'text/css',
                                                        data_app_id: common_app_id}),
                                        host:bff_parameters.host,
                                        route : 'APP',
                                        res:bff_parameters.res});
                    }
                    //font src used in a font css
                    case (bff_parameters.url.startsWith('/common/modules/fontawesome/webfonts/')):
                    case (bff_parameters.url.startsWith('/common/css/font/')):{
                        const {commonResourceFile} = await import('../apps/common/src/common.js');
                        return serverResponse({app_id:common_app_id,
                                        result_request: await commonResourceFile({   app_id:common_app_id, 
                                                                resource_id:bff_parameters.url, 
                                                                content_type:'',
                                                                data_app_id: common_app_id}),
                                                                host:bff_parameters.host,
                                                                route : 'APP',
                                                                res:bff_parameters.res});
                    }
                    case bff_parameters.url == '/':{
                        //App route for app asset, common asset, app info page and app
                        return serverResponse({app_id:common_app_id,
                                        result_request:await app_common.commonApp({  app_id:app_common.commonAppIam(bff_parameters.host??'', 
                                                                                            endpoint_role, 
                                                                                            bff_parameters.security_app.AppId, 
                                                                                            bff_parameters.security_app.AppSignature).app_id??0,
                                                                    ip:bff_parameters.ip, 
                                                                    host:bff_parameters.host ?? '', 
                                                                    user_agent:bff_parameters.user_agent, 
                                                                    accept_language:bff_parameters.accept_language})
                                                                .then(result=>result?.http == 301?bff_parameters.res.redirect('/'):result),
                                        host:bff_parameters.host,
                                        route : 'APP',
                                        res:bff_parameters.res})
                        .catch((error)=>
                                        /**@ts-ignore */
                            Log.post({  app_id:common_app_id, 
                                data:{  object:'LogServiceError', 
                                        service:{   service:endpoint_role,
                                                    parameters:bff_parameters.query
                                                },
                                        log:error
                                    }
                                }).then(() =>
                                import('../apps/common/src/component/common_server_error.js')
                                    .then(({default:serverError})=>{
                                        return {result:serverError({data:null, methods:null}), type:'HTML'};
                                    })));
                    } 
                    default:{
                        //unknown path, redirect to hostname
                        bff_parameters.res?
                        bff_parameters.res.redirect(`http://${configServer.SERVER.filter(row=>'HOST' in row)[0].HOST}:${configServer.SERVER.filter(row=>'HTTP_PORT' in row)[0].HTTP_PORT}`):
                            null;
                    }
                }
            }
            else{

                //REST API route
                //REST API requests from client are encoded using base64
                const decodedquery = bff_parameters.query?decodeURIComponent(Buffer.from(bff_parameters.query, 'base64').toString('utf-8')):'';   
                const decodedbody = bff_parameters.body?.data?JSON.parse(decodeURIComponent(Buffer.from(bff_parameters.body.data, 'base64').toString('utf-8'))):'';   
                
                return await bffRestApi({  /**@ts-ignore */
                                        endpoint:endpoint_role,
                                        method:bff_parameters.method.toUpperCase(), 
                                        ip:bff_parameters.ip, 
                                        host:bff_parameters.host ?? '', 
                                        url:bff_parameters.url ?? '',
                                        user_agent:bff_parameters.user_agent, 
                                        accept_language:bff_parameters.accept_language, 
                                        idToken:bff_parameters.security_app.AppIdToken, 
                                        AppId:bff_parameters.security_app.AppId, 
                                        AppSignature: bff_parameters.security_app.AppSignature,
                                        authorization:bff_parameters.authorization ?? '', 
                                        parameters:decodedquery, 
                                        body:decodedbody,
                                        res:bff_parameters.res})
                        .then((/**@type{*}*/result_service) => {
                            const log_result = serverUtilNumberValue(configServer.SERVICE_LOG.filter(row=>'REQUEST_LEVEL' in row)[0].REQUEST_LEVEL)==2?result_service:'✅';
                                                /**@ts-ignore */
                            return Log.post({  app_id:result_service.app_id, 
                                data:{  object:'LogServiceInfo', 
                                        service:{   service:endpoint_role,
                                                    parameters:bff_parameters.query
                                                },
                                        log:log_result
                                    }
                                    /**@ts-ignore */
                                }).then(result_log=>result_log.http?
                                                        result_log:
                                                        serverResponse({app_id:result_service.app_id,
                                                                        result_request:result_service, 
                                                                        host:bff_parameters.host,
                                                                        route:'REST_API',
                                                                        method:bff_parameters.method, 
                                                                        decodedquery:decodedquery, 
                                                                        res:bff_parameters.res})
                                                            );
                        })
                        .catch((/**@type{server_server_error}*/error) => {
                            //log with app id 0 if app id still not authenticated
                            return Log.post({  app_id:0, 
                                data:{  object:'LogServiceError', 
                                        service:{   service:endpoint_role,
                                                    parameters:bff_parameters.query
                                                },
                                        log:error
                                    }
                                }).then(() => 
                                    serverResponse({result_request:{http:500, code:null,text:error, developerText:'bff',moreInfo:null, type:'JSON'},
                                                    route:null,
                                                    res:bff_parameters.res}));
                                                
                                            
                        });

            }
         }
    }
    else
        if (resultbffInit.redirect)
            res.redirect(resultbffInit.redirect);
        else
            res.end();
};

/**
 * @name bffRestApi
 * @namespace ROUTE_REST_API
 * @description Routes using openAPI where paths, methods, validation rules, operationId and function parameters are defined
 *              OperationId syntax: [path].[filename].[functioname] or [path]_[path].[filename].[functioname]
 *              Returns single resource result format or ISO20022 format with either list header or page header metadata
 * @function
 * @param {server_bff_RestApi_parameters} routesparameters
 * @returns {Promise.<server_server_response>}
 */
const bffRestApi = async (routesparameters) =>{        
    const iam = await import('./iam.js');
    const ConfigRestApi = await import('./db/ConfigRestApi.js');
    const URI_query = routesparameters.parameters;
    const URI_path = routesparameters.url.indexOf('?')>-1?routesparameters.url.substring(0, routesparameters.url.indexOf('?')):routesparameters.url;
    const app_query = URI_query?new URLSearchParams(URI_query):null;
    /**@type{server_db_document_ConfigServer} */
    const configServer = ConfigServer.get({app_id:0}).result;

    
    /**
     * Authenticates if user has access to given resource
     * Authenticates IAM parameters using IAM token claims if path requires
     * @param {{app_id_authenticated:number,
     *          IAM_iam_user_app_id:number|null,
     *          IAM_iam_user_id:number|null,
     *          IAM_module_app_id:number|null,
     *          IAM_data_app_id:number|null,
     *          IAM_service:string|null}} params
     * @returns {boolean}
     */
    const AuthenticateIAM = params =>{
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
                parameter.in=='path'
            )[0]==null?null:
            {[paths[0].substring(paths[0].indexOf('${')+'${'.length).replace('}','')]:
                (components.parameters[paths[0].substring(paths[0].indexOf('${')+'${'.length).replace('}','')]?.schema.type == 'number'?
                        serverUtilNumberValue(URI_path.substring(URI_path.lastIndexOf('/')+1)):
                            URI_path.substring(URI_path.lastIndexOf('/')+1))
            }:
                //no resource id string in defined path
                null;

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
                                                        data:       routesparameters.body[key[0]],
                                                        //IAM parameters are required by default
                                                        required:   key[1]?.required ?? (key[0].startsWith('IAM')?true:false),
                                                        type:       'BODY',
                                                    }
                                        }
                                    };
                };
                //add parameters using tree shaking pattern
                //so only defined parameters defined using openAPI pattern are sent to functions
                const parametersIn = 
                                        {...routesparameters.method=='GET'?
                                            //QUERY
                                            {...methodObj.parameters
                                                            //include all parameters.in=query
                                                            .filter((/**@type{*}*/parameter)=>
                                                                parameter.in == 'query'|| 
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
                                                                                            required:   (key?.required ?? (key['$ref'].split('#/components/parameters/')[1].startsWith('IAM')?true:false)),
                                                                                            type:       'QUERY',
                                                                                        }
                                                                                    }
                                                                            };
                                                                else
                                                                    return {...keys, ...{   
                                                                                        [key.name]:{
                                                                                            data:       app_query?.get(key.name),
                                                                                            //IAM parameters are required by default
                                                                                            required:   (key?.required ?? (key.name.startsWith('IAM')?true:false)),
                                                                                            type:       'QUERY',
                                                                                        }
                                                                                    }
                                                                        };
                                                            },{})
                                            }:
                                            //BODY:
                                            //all other methods use body to send data
                                            //if additional properties allowed then add to defined parameters or only parameters matching defined parameters
                                            (methodObj.requestBody?.content && methodObj.requestBody?.content['application/json']?.schema?.additionalProperties)?
                                                {...routesparameters.body,...Object.entries(methodObj.requestBody?.content['application/json']?.schema?.properties)
                                                                                .reduce((/**@type{*}*/keys, /**@type{*}*/key)=>addBodyKey(keys,key),{})}:
                                                            Object.entries(methodObj.requestBody?.content['application/json']?.schema?.properties??[])
                                                            .reduce((/**@type{*}*/keys, /**@type{*}*/key)=>addBodyKey(keys,key),{})??{},
                                        ...methodObj.parameters
                                        //PATH
                                        //include parameters.in=path, one resource id in path supported
                                        //all path parameters should be defined in #/components/parameters
                                        .filter((/**@type{*}*/parameter)=>
                                            parameter.in=='path' && '$ref' in parameter) 
                                        .reduce((/**@type{*}*/keys, /**@type{*}*/key)=>{
                                                return {...keys, ...{   
                                                                    [key['$ref'].split('#/components/parameters/')[1]]:
                                                                    {
                                                                        data:       resourceId(configPath.paths, configPath.components)?.[key['$ref'].split('#/components/parameters/')[1]],
                                                                        //IAM parameters are required by default
                                                                        required:   (key?.required ?? (key['$ref'].split('#/components/parameters/')[1].startsWith('IAM')?true:false)),
                                                                        type:       'PATH',
                                                                    }
                                                                }
                                                        };
                                        },{})
                                        };
                if (AuthenticateIAM({   app_id_authenticated:   authenticate.app_id,
                                        IAM_iam_user_app_id:    parametersIn.IAM_iam_user_app_id?.data,
                                        IAM_iam_user_id:        parametersIn.IAM_iam_user_id?.data,
                                        IAM_module_app_id:      parametersIn.IAM_module_app_id?.data,
                                        IAM_data_app_id:        parametersIn.IAM_data_app_id?.data,
                                        IAM_service:            parametersIn.IAM_service?.data
                                    }) &&
                                //there is no missing required parameter in the request
                                //no authentication of value in a required query or body parameter
                                //a required path parameter means a value must be provided
                                Object.keys(parametersIn).filter(parameter=> 
                                            ((typeof parametersIn[parameter] == 'object') &&
                                            parametersIn[parameter]?.required && 
                                            (parametersIn[parameter].type == 'PATH'?
                                                parametersIn[parameter].data == null:
                                                routesparameters.method=='GET'?
                                                ((app_query?.has(parameter)??false)==false):
                                                    (parameter in routesparameters.body)==false)
                                            )).length==0){ 
                    //remove path parameter not used for data parameter
                    for (const key of Object.entries(parametersIn))
                        if (key[1]?.type == 'PATH')
                            delete parametersIn[key[0]];
                    //replace metadata with value
                    Object.keys(parametersIn).forEach(key=>
                        parametersIn[key]= (typeof parametersIn[key] == 'object' && parametersIn[key]!=null)?
                                                parametersIn[key].data:
                                                    parametersIn[key]
                    );
                    //rename IAM parameter names with common names as admin parameter names
                    //admin sends parameters without IAM_ to access "anything"
                    if ('IAM_module_app_id' in parametersIn ||routesparameters.endpoint=='APP_ACCESS_EXTERNAL'){
                        //APP_ACCESS_EXTERNAL can only run function using same appid used by host and access data for same app id
                        parametersIn.module_app_id = routesparameters.endpoint=='APP_ACCESS_EXTERNAL'?
                                                        authenticate.app_id:
                                                        parametersIn.IAM_module_app_id!=null?
                                                            serverUtilNumberValue(parametersIn.IAM_module_app_id):
                                                                null;
                    }
                    if ('IAM_data_app_id' in parametersIn ||routesparameters.endpoint=='APP_ACCESS_EXTERNAL'){
                        //APP_ACCESS_EXTERNAL can only run function using same appid used by host and access data for same app id
                        parametersIn.data_app_id = routesparameters.endpoint=='APP_ACCESS_EXTERNAL'?
                                                        authenticate.app_id:
                                                        parametersIn.IAM_data_app_id!=null?
                                                            serverUtilNumberValue(parametersIn.IAM_data_app_id):
                                                                null;
                    }
                    if ('IAM_iam_user_app_id' in parametersIn){
                        parametersIn.iam_user_app_id = parametersIn.IAM_iam_user_app_id!=null?
                                                            serverUtilNumberValue(parametersIn.IAM_iam_user_app_id):
                                                                null;
                    }
                    if ('IAM_iam_user_id' in parametersIn){
                        parametersIn.iam_user_id = parametersIn.IAM_iam_user_id!=null?
                                                        serverUtilNumberValue(parametersIn.IAM_iam_user_id):
                                                            null;
                    }
                    if ('IAM_service' in parametersIn){
                        parametersIn.service = parametersIn.IAM_service;
                    }
                    for (const key of Object.keys(parametersIn))
                        if (key.startsWith('IAM_'))
                            delete parametersIn[key];
                    
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
                                    ...(getParameter('server_response')             && {response:           routesparameters.res}),
                                    ...(getParameter('server_host')                 && {host:               routesparameters.host}),
                                    ...(getParameter('locale')                      && {locale:             app_query?.get('locale') ??app_common.commonClientLocale(routesparameters.accept_language)}),
                                    ...(getParameter('server_ip')                   && {ip:                 routesparameters.ip}),
                                    ...(getParameter('server_microservice')         && {microservice:       getParameter('server_microservice').default}),
                                    ...(getParameter('server_microservice_service') && {service:            getParameter('server_microservice_service').default}),
                                    ...(getParameter('server_message_queue_type')   && {message_queue_type: getParameter('server_message_queue_type').default}),
                                    ...(getParameter('server_method')               && {method:             routesparameters.method}),
                                    ...(Object.keys(parametersIn)?.length>0       && {data:               {...parametersIn}}),
                                    ...(getParameter('server_endpoint')             && {endpoint:           routesparameters.endpoint}),
                                    ...(resourceId( configPath.paths, 
                                                    configPath.components)          && {resource_id:        Object.values(
                                                                                                                resourceId( configPath.paths, 
                                                                                                                            configPath.components)??{}
                                                                                                            )[0]})
                                    });
                    return { ...result,
                                ...{singleResource:singleResource()
                                    }
                            };
                }
                else
                    return 	{http:401,
                            code:'SERVER',
                            text:iam.iamUtilMessageNotAuthorized(),
                            developerText:'bffRestApi',
                            moreInfo:null,
                            type:'JSON'};
            }
            else{
                //unknown appid
                return 	{http:401,
                    code:'SERVER',
                    text:iam.iamUtilMessageNotAuthorized(),
                    developerText:'bffRestApi',
                    moreInfo:null,
                    type:'JSON'};
            }

            
        }
        else                
            return 	{http:404,
                    code:'SERVER',
                    text:iam.iamUtilMessageNotAuthorized(),
                    developerText:'bffRestApi',
                    moreInfo:null,
                    type:'JSON'};
    }
    else
        return 	{http:404,
                code:'SERVER',
                text:iam.iamUtilMessageNotAuthorized(),
                developerText:'bffRestApi',
                moreInfo:null,
                type:'JSON'};
};

export{bffConnect, bff};