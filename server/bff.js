/** @module server/bff */

/**
 * @import {server_iam_authenticate_request, 
 *          server_db_document_ConfigServer,
 *          server_db_config_server_service_iam,
 *          server_db_config_server_server,
 *          server_server_req, 
 *          server_server_res, 
 *          server_server_error, 
 *          server_bff_parameters} from './types.js'
 */

/**@type{import('./server.js')} */
const {serverResponse, serverUtilResponseTime, serverUtilCompression, serverUtilNumberValue, serverREST_API} = await import(`file://${process.cwd()}/server/server.js`);

/**@type{import('./db/Config.js')} */
const Config = await import(`file://${process.cwd()}/server/db/Config.js`);

/**@type{import('./db/IamUser.js')} */
const IamUser = await import(`file://${process.cwd()}/server/db/IamUser.js`);

/**@type{import('./db/Log.js')} */
const Log = await import(`file://${process.cwd()}/server/db/Log.js`);
/**@type{import('./iam.js')} */
const {iamAuthenticateRequest} = await import(`file://${process.cwd()}/server/iam.js`);
/**@type{import('./security.js')} */
const {securityUUIDCreate, securityRequestIdCreate, securityCorrelationIdCreate}= await import(`file://${process.cwd()}/server/security.js`);

/**@type{import('../apps/common/src/common.js')} */
const app_common= await import(`file://${process.cwd()}/apps/common/src/common.js`);


const fs = await import('node:fs');


/**
 * @name bffInit
 * @description Backend for frontend (BFF) init for all methods
 *              Logs if the request is from SSE
 *              Logs when the response is closed
 *              Authenticates the request
 *              Sets header values on both on the response and on the request
 *              Checks robots.txt and favicon.ico
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
    const config_SERVER = Config.get({app_id:0, data:{object:'ConfigServer'}});
    /**@type{server_db_config_server_server[]} */
    const config_SERVER_SERVER = config_SERVER.SERVER;
    /**@type{server_db_config_server_service_iam[]} */
    const config_SERVICE_IAM = config_SERVER.SERVICE_IAM;
    const HTTPS_PORT = serverUtilNumberValue(config_SERVER_SERVER.filter(row=>'HTTPS_PORT' in row)[0].HTTPS_PORT);
    //redirect naked domain to www except for localhost
    if (req.headers.host.startsWith(config_SERVER_SERVER.filter(row=>'HOST' in row)[0].HOST ?? '') && req.headers.host.indexOf('localhost')==-1)
        if (config_SERVER_SERVER.filter(row=>'HTTPS_ENABLE' in row)[0].HTTPS_ENABLE=='1')
            return {reason:'REDIRECT', redirect:`https://www.${req.headers.host.split(':')[0] + (HTTPS_PORT==443?'':':' + HTTPS_PORT)}${req.originalUrl}`};
        else
            return {reason:'REDIRECT', redirect:`http://www.${req.headers.host}${req.originalUrl}`};
    else{
        //redirect from http to https if https is enabled
        if (req.protocol=='http' && config_SERVER_SERVER.filter(row=>'HTTPS_ENABLE' in row)[0].HTTPS_ENABLE=='1')
            return {reason:'REDIRECT', redirect:`https://${req.headers.host.split(':')[0] + (HTTPS_PORT==443?'':':' + HTTPS_PORT)}${req.originalUrl}`};
        else{
            //access control that stops request if not passing controls
            /**@type{server_iam_authenticate_request}*/
            const result = await iamAuthenticateRequest({ip:req.ip, 
                                                        host:req.headers.host.split(':')[0] ?? '', 
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
                res.setHeader('x-response-time', process.hrtime());
                req.headers['x-request-id'] =  securityUUIDCreate().replaceAll('-','');
                if (req.headers.authorization)
                    req.headers['x-correlation-id'] = securityRequestIdCreate();
                else
                    req.headers['x-correlation-id'] = securityCorrelationIdCreate(req.hostname +  req.ip + req.method);
                res.setHeader('Access-Control-Max-Age','5');
                res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, Content-Type, Accept');
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
                
                if (config_SERVICE_IAM.filter(row=>'ENABLE_CONTENT_SECURITY_POLICY' in row)[0].ENABLE_CONTENT_SECURITY_POLICY == '1'){
                    res.setHeader('content-security-policy', Config.get({app_id:0, data:{object:'ConfigIamPolicy',config_group:'content-security-policy'}}));
                }
                res.setHeader('cross-origin-opener-policy','same-origin');
                res.setHeader('cross-origin-resource-policy',	'same-origin');
                res.setHeader('referrer-policy', 'strict-origin-when-cross-origin');
                res.setHeader('x-content-type-options', 'nosniff');
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
    }
};
/**
 * @name bffStart
 * @description Backend for frontend (BFF) start for get method
 *              If first time, when no admin exists, then redirect everything to admin
 *              Checks if SSL verification using Letsencrypt is enabled when validating domain
 *              and sends requested verifcation file
 *              Redirects naked domain to www except for localhost
 *              Redirects from http to https if https is enabled
 * @functions
 * @param {server_server_req} req
 * @param {server_server_res} res
 * @returns Promise.<{reason:'REDIRECT'|'SEND'|null,redirect:string}>
 */
const bffStart = async (req, res) =>{
    /**@type{server_db_document_ConfigServer} */
    const config_SERVER = Config.get({app_id:0, data:{object:'ConfigServer'}});
    /**@type{server_db_config_server_server[]} */
    const config_SERVER_SERVER = config_SERVER.SERVER;
    
    //if first time, when no user exists, then redirect everything to admin
    if (IamUser.get(app_common.commonAppHost(req.headers.host.split(':')[0] ?? '')??0, null).result.length==0 && req.headers.host.startsWith('admin') == false && req.headers.referer==undefined)
        return {reason:'REDIRECT', redirect:`http://admin.${config_SERVER_SERVER.filter(row=>'HOST' in row)[0].HOST}`};
    else{
        //check if SSL verification using letsencrypt is enabled when validating domains
        if (config_SERVER_SERVER.filter(row=>'HTTPS_SSL_VERIFICATION' in row)[0].HTTPS_SSL_VERIFICATION=='1'){
            if (req.originalUrl.startsWith(config_SERVER_SERVER.filter(row=>'HTTPS_SSL_VERIFICATION_PATH' in row)[0].HTTPS_SSL_VERIFICATION_PATH ?? '')){
                res.type('text/plain');
                res.write(await fs.promises.readFile(`${process.cwd()}${req.originalUrl}`, 'utf8'));
                return {reason:'SEND', redirect:null};
            }
            else
                return {reason:null, redirect:null};
        }
        else
            return {reason:null, redirect:null};
    }
};
/**
 * @name bff
 * @description Backend for frontend (BFF) called from client
 *              Calls app including assets and info pages or REST API
 *              APP can request server shared modules or reports using REST API
 * @function
 * @param {server_bff_parameters} bff_parameters
 * @returns {Promise<*>}
 */
 const bff = async (bff_parameters) =>{
    const service = (bff_parameters.route_path?bff_parameters.route_path.split('/')[1]:'').toUpperCase();
    const app_id = app_common.commonAppHost((bff_parameters.host??'').substring(0,(bff_parameters.host??'').indexOf(':')==-1?
                                                (bff_parameters.host??'').length:
                                                    (bff_parameters.host??'').indexOf(':')));
    
    if (app_id !=null){
        serverUtilCompression(bff_parameters.res.req,bff_parameters.res);
        if (bff_parameters.endpoint == 'APP' && bff_parameters.method.toUpperCase() == 'GET' && !bff_parameters.url?.startsWith('/bff')){
            //App route for app asset, common asset, app info page and app
            serverResponse({app_id:app_id,
                            result_request:await app_common.commonApp({  app_id:app_id,
                                                        ip:bff_parameters.ip, 
                                                        host:bff_parameters.host ?? '', 
                                                        user_agent:bff_parameters.user_agent, 
                                                        accept_language:bff_parameters.accept_language, 
                                                        url:bff_parameters.url ?? '', 
                                                        query:null}),
                            host:bff_parameters.host,
                            route : 'APP',
                            res:bff_parameters.res})
            .catch((error)=>
                Log.post({  app_id:app_id, 
                    data:{  object:'LogServiceError', 
                            service:{   service:service,
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
        else{
            //REST API route
            //REST API requests from client are encoded using base64
            const decodedquery = bff_parameters.query?decodeURIComponent(Buffer.from(bff_parameters.query, 'base64').toString('utf-8')):'';   
            const decodedbody = bff_parameters.body?.data?JSON.parse(decodeURIComponent(Buffer.from(bff_parameters.body.data, 'base64').toString('utf-8'))):'';   
            
            serverResponse({app_id:app_id,
                            result_request:await serverREST_API({   app_id:app_id, 
                                                                    endpoint:bff_parameters.endpoint,
                                                                    method:bff_parameters.method.toUpperCase(), 
                                                                    ip:bff_parameters.ip, 
                                                                    host:bff_parameters.host ?? '', 
                                                                    url:bff_parameters.url ?? '',
                                                                    route_path:bff_parameters.route_path,
                                                                    user_agent:bff_parameters.user_agent, 
                                                                    accept_language:bff_parameters.accept_language, 
                                                                    idToken:bff_parameters.idToken, 
                                                                    authorization:bff_parameters.authorization ?? '', 
                                                                    parameters:decodedquery, 
                                                                    body:decodedbody,
                                                                    res:bff_parameters.res})
                                                    .then((/**@type{*}*/result_service) => {
                                                        const log_result = serverUtilNumberValue(Config.get({app_id:app_id, data:{object:'ConfigServer',config_group:'SERVICE_LOG', parameter:'REQUEST_LEVEL'}}))==2?result_service:'✅';
                                                        return Log.post({  app_id:app_id, 
                                                            data:{  object:'LogServiceInfo', 
                                                                    service:{   service:service,
                                                                                parameters:bff_parameters.query
                                                                            },
                                                                    log:log_result
                                                                }
                                                            }).then(result_log=>result_log.http?result_log:result_service);
                                                    })
                                                    .catch((/**@type{server_server_error}*/error) => {
                                                        return Log.post({  app_id:app_id, 
                                                            data:{  object:'LogServiceError', 
                                                                    service:{   service:service,
                                                                                parameters:bff_parameters.query
                                                                            },
                                                                    log:error
                                                                }
                                                            }).then(() => {
                                                            return {http:500, code:null, text:error, developerText:'bff', moreInfo:null, type:'JSON'};
                                                        });
                                                    }), 
                            host:bff_parameters.host,
                            route:'REST_API',
                            method:bff_parameters.method, 
                            decodedquery:decodedquery, 
                            res:bff_parameters.res});
        }
    }
    else{
        //unknown appid, domain or subdomain, redirect to hostname
        bff_parameters.res?bff_parameters.res.redirect(`${bff_parameters.res.req.protocol}://${Config.get({app_id:0, data:{object:'ConfigServer',config_group:'SERVER', parameter:'HOST'}})}`):null;
    }
};
/**
 * @name bffServer
 * @description BFF called from server
 * @function
 * @param {number|null} app_id
 * @param {server_bff_parameters} bff_parameters
 * @returns {Promise<(*)>}
 */
 const bffServer = async (app_id, bff_parameters) => {
    /**@type{import('./iam.js')} */
    const  {iamUtilMessageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);
    return new Promise((resolve, reject) => {
        const service = (bff_parameters.route_path?bff_parameters.route_path.split('/')[1]:'').toUpperCase();
        if (app_id !=null && bff_parameters.endpoint){
            serverREST_API({  app_id:app_id, 
                            endpoint:bff_parameters.endpoint,
                            method:bff_parameters.method.toUpperCase(), 
                            ip:bff_parameters.ip, 
                            host:bff_parameters.host ?? '', 
                            url:bff_parameters.url ?? '',
                            route_path:bff_parameters.route_path,
                            user_agent:bff_parameters.user_agent, 
                            accept_language:bff_parameters.accept_language, 
                            idToken:bff_parameters.idToken, 
                            authorization:bff_parameters.authorization ?? '', 
                            parameters:bff_parameters.query, 
                            body:bff_parameters.body,
                            res:bff_parameters.res})
            .then(result=>resolve(result))
            .catch((/**@type{server_server_error}*/error)=>{
                Log.post({  app_id:app_id, 
                    data:{  object:'LogServiceError', 
                            service:{   service:service,
                                        parameters:bff_parameters.query
                                    },
                            log:error
                        }
                    }).then(() => {
                        reject(error);
                });
            });
        }
        else{
            //required parameters not provided
            reject({
                message: iamUtilMessageNotAuthorized()
            });
        }
    });
};
export{bffInit, bffStart, bff, bffServer};