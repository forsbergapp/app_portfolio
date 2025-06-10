/** @module server/bff */

/**
 * @import {server_iam_authenticate_request, 
 *          server_db_document_ConfigServer,
 *          server_bff_endpoint_type,
 *          server_server_req, 
 *          server_server_res, 
 *          server_server_error, 
 *          server_bff_parameters} from './types.js'
 */

const {serverResponse, serverUtilResponseTime, serverUtilCompression, serverUtilNumberValue, serverREST_API} = await import('./server.js');
const ConfigServer = await import('./db/ConfigServer.js');
const IamUser = await import('./db/IamUser.js');
const Log = await import('./db/Log.js');
const {iamAuthenticateRequest} = await import('./iam.js');
const {securityUUIDCreate, securityRequestIdCreate, securityCorrelationIdCreate}= await import('./security.js');
const app_common= await import('../apps/common/src/common.js');
const {serverProcess} = await import('./server.js');
const fs = await import('node:fs');


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
            
            if (config_SERVER.SERVICE_IAM.filter(row=>'ENABLE_CONTENT_SECURITY_POLICY' in row)[0].ENABLE_CONTENT_SECURITY_POLICY == '1'){
                res.setHeader('content-security-policy', config_SERVER.SERVICE_IAM.filter(row=>'CONTENT_SECURITY_POLICY' in row)[0].CONTENT_SECURITY_POLICY);
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
 * @returns Promise.<{*}>
 */
const bffStart = async (req, res) =>{
    /**@type{server_db_document_ConfigServer} */
    const configServer = ConfigServer.get({app_id:0}).result;
    const {serverProcess} = await import('./server.js');
    const {commonAppHost} = await import('../apps/common/src/common.js');
    //if first time, when no user exists, show maintenance in main server
    if (IamUser.get(0, null).result.length==0 && commonAppHost(req.headers.host).admin == false){
        const {commonComponentCreate} = await import('../apps/common/src/common.js');
        return commonComponentCreate({app_id:0, componentParameters:{ip:req.ip},type:'MAINTENANCE'});
    }   
    else{
        //check if SSL verification using letsencrypt is enabled when validating domains
        if (configServer.SERVER.filter(row=>'HTTPS_SSL_VERIFICATION' in row)[0].HTTPS_SSL_VERIFICATION=='1'){
            if (req.originalUrl.startsWith(configServer.SERVER.filter(row=>'HTTPS_SSL_VERIFICATION_PATH' in row)[0].HTTPS_SSL_VERIFICATION_PATH ?? '')){
                res.type('text/plain');
                res.write(await fs.promises.readFile(`${serverProcess.cwd()}${req.originalUrl}`, 'utf8'));
                return null;
            }
            else
                return null;
        }
        else
            return null;
    }
};
/**
 * @name bff
 * @namespace ROUTE_APP
 * @description Backend for frontend (BFF) called from client
 *              Calls app including assets and info pages or REST API
 *              APP can request server shared modules or reports using REST API
 * @function
 * @param {server_bff_parameters} bff_parameters
 * @returns {Promise<*>}
 */
 const bff = async (bff_parameters) =>{
    
    /**@type{server_db_document_ConfigServer} */
    const configServer = ConfigServer.get({app_id:0}).result;
    
    //all rest api starts with REST_RESOURCE_BFF parameter value (add '/')
    const endpoint_role = bff_parameters.url.startsWith(configServer.SERVER.filter(parameter=>parameter.REST_RESOURCE_BFF)[0].REST_RESOURCE_BFF + '/')?
                            (bff_parameters.url.split('/')[2]?.toUpperCase()):
                                'APP';

    serverUtilCompression(bff_parameters.res.req,bff_parameters.res);
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
                                result_request:await app_common.commonApp({  app_id:common_app_id,
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
        
        return await serverREST_API({  /**@ts-ignore */
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
                        }).then(() => {
                                        return {http:500, code:null, text:error, developerText:'bff', moreInfo:null, type:'JSON'};
                                    });
                });

    }
};

export{bffInit, bffStart, bff};