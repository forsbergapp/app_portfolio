/** @module server/bff/service */

/**
 * @import {server_iam_authenticate_request, server_server_req, server_server_res, server_server_error, server_bff_parameters} from './types.js'
 */

/**@type{import('./server.js')} */
const {serverUtilResponseTime, serverResponseErrorSend, serverUtilCompression, serverUtilNumberValue, serverREST_API} = await import(`file://${process.cwd()}/server/server.js`);

/**@type{import('./db/fileModelConfig.js')} */
const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);

/**@type{import('./db/fileModelIamUser.js')} */
const fileModelIamUser = await import(`file://${process.cwd()}/server/db/fileModelIamUser.js`);

/**@type{import('./db/fileModelLog.js')} */
const fileModelLog = await import(`file://${process.cwd()}/server/db/fileModelLog.js`);
/**@type{import('./iam.js')} */
const {iamAuthenticateRequest} = await import(`file://${process.cwd()}/server/iam.js`);
/**@type{import('./security.js')} */
const {securityUUIDCreate, securityRequestIdCreate, securityCorrelationIdCreate}= await import(`file://${process.cwd()}/server/security.js`);

/**@type{import('../apps/common/src/common.js')} */
const app_common= await import(`file://${process.cwd()}/apps/common/src/common.js`);
const {default:serverError} = await import('../apps/common/src/component/common_server_error.js');

const fs = await import('node:fs');

/**
 * @name bffSendFile
 * @description Bff send file if found or return error
 * @function
 * @param {number} app_id
 * @param {server_bff_parameters} bff_parameters
 * @param {string} service
 * @param {string} filePath
 * @returns {Promise.<void>}
 */
const bffSendFile = async (app_id, bff_parameters, service, filePath) => {
    await fs.promises.access(filePath)
          .then(()=>{
            bff_parameters.res?bff_parameters.res.sendFile(filePath):null;
            bff_parameters.res?bff_parameters.res.status(200):null;
        })
          .catch((error)=>{
            bffErrorLog(app_id, bff_parameters, service, error);
        });
};
/**
 * @name bffErrorLog
 * @description Logs error and returns error
 * @function
 * @param {number} app_id 
 * @param {server_bff_parameters} bff_parameters
 * @param {string} service
 * @param {server_server_error} error 
 * @returns {*}
 */
const bffErrorLog = (app_id, bff_parameters, service, error) =>{
    fileModelLog.postServiceE(app_id, service, bff_parameters.query, error).then(() => {
        if (bff_parameters.res){
            const statusCode = bff_parameters.res.statusCode==200?503:bff_parameters.res.statusCode ?? 503;
            if (error.error && error.error.code=='MICROSERVICE')
                serverResponseErrorSend( bff_parameters.res, 
                                error.error.http,
                                error.error.code, 
                                `MICROSERVICE ${bff_parameters.route_path.split('/')[1].toUpperCase()} ERROR`, 
                                error.error.developer_text, 
                                error.error.more_info);
            else
                serverResponseErrorSend( bff_parameters.res, 
                                statusCode, 
                                null, 
                                error, 
                                null, 
                                null);
        }
    });
};

/**
 * @name bffInit
 * @description Backend for frontend (BFF) init for all methods
 *              Logs if the request is from EventSource
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
        //Eventsource, log since response is open and log again when closing
        fileModelLog.postRequestI(req, res.statusCode, typeof res.statusMessage == 'string'?res.statusMessage:JSON.stringify(res.statusMessage)??'', serverUtilResponseTime(res));
    }
    res.on('close',()=>{	
        //eventsource response time will be time connected until disconnected
        fileModelLog.postRequestI(req, res.statusCode, typeof res.statusMessage == 'string'?res.statusMessage:JSON.stringify(res.statusMessage)??'', serverUtilResponseTime(res)).then(() => {
            // do not return any StatusMessage to client, this is only used for logging purpose
            res.statusMessage = '';
            res.end();
        });
    });
    //redirect naked domain to www except for localhost
    if (req.headers.host.startsWith(fileModelConfig.get('CONFIG_SERVER','SERVER','HOST') ?? '') && req.headers.host.indexOf('localhost')==-1)
        if (fileModelConfig.get('CONFIG_SERVER','SERVER', 'HTTPS_ENABLE')=='1')
            return {reason:'REDIRECT', redirect:`https://www.${req.headers.host}${req.originalUrl}`};
        else
            return {reason:'REDIRECT', redirect:`http://www.${req.headers.host}${req.originalUrl}`};
    else{
        //redirect from http to https if https is enabled
        if (req.protocol=='http' && fileModelConfig.get('CONFIG_SERVER','SERVER', 'HTTPS_ENABLE')=='1')
            return {reason:'REDIRECT', redirect:`https://${req.headers.host}${req.originalUrl}`};
        else{
            //access control that stops request if not passing controls
            /**@type{server_iam_authenticate_request}*/
            const result = await iamAuthenticateRequest(req.ip, req.headers.host, req.method, req.headers['user-agent'], req.headers['accept-language'], req.path)
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
                res.setHeader('X-Response-Time', process.hrtime());
                req.headers['X-Request-Id'] =  securityUUIDCreate().replaceAll('-','');
                if (req.headers.authorization)
                    req.headers['X-Correlation-Id'] = securityRequestIdCreate();
                else
                    req.headers['X-Correlation-Id'] = securityCorrelationIdCreate(req.hostname +  req.ip + req.method);
                res.setHeader('Access-Control-Max-Age','5');
                res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, Content-Type, Accept');
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
                if (fileModelConfig.get('CONFIG_SERVER','SERVICE_IAM', 'ENABLE_CONTENT_SECURITY_POLICY') == '1'){
                    res.setHeader('content-security-policy', fileModelConfig.get('CONFIG_IAM_POLICY','content-security-policy'));
                }
                res.setHeader('cross-origin-opener-policy','same-origin');
                res.setHeader('cross-origin-resource-policy',	'same-origin');
                res.setHeader('referrer-policy', 'strict-origin-when-cross-origin');
                res.setHeader('strict-transport-security', `max-age=${180 * 24 * 60 * 60}; includeSubDomains`);
                res.setHeader('x-content-type-options', 'nosniff');
                res.setHeader('x-dns-prefetch-control', 'off');
                res.setHeader('x-download-options', 'noopen');
                res.setHeader('x-frame-options', 'SAMEORIGIN');
                res.setHeader('x-permitted-cross-domain-policies', 'none');
                res.setHeader('x-xss-protection', '0');
                res.removeHeader('X-Powered-By');
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
    //if first time, when no user exists, then redirect everything to admin
    if (fileModelIamUser.get(app_common.commonAppHost(req.headers.host ?? '')??0, null, null).length==0 && req.headers.host.startsWith('admin') == false && req.headers.referer==undefined)
        return {reason:'REDIRECT', redirect:`http://admin.${fileModelConfig.get('CONFIG_SERVER','SERVER','HOST')}`};
    else{
        //check if SSL verification using letsencrypt is enabled when validating domains
        if (fileModelConfig.get('CONFIG_SERVER','SERVER', 'HTTPS_SSL_VERIFICATION')=='1'){
            if (req.originalUrl.startsWith(fileModelConfig.get('CONFIG_SERVER','SERVER', 'HTTPS_SSL_VERIFICATION_PATH') ?? '')){
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
 * @returns {*}
 */
 const bff = (bff_parameters) =>{
    const service = (bff_parameters.route_path?bff_parameters.route_path.split('/')[1]:'').toUpperCase();
    const app_id = app_common.commonAppHost(bff_parameters.host ?? '');
    
    if (app_id !=null){
        serverUtilCompression(bff_parameters.res.req,bff_parameters.res);
        if (bff_parameters.endpoint == 'APP' && bff_parameters.method.toUpperCase() == 'GET' && !bff_parameters.url?.startsWith('/bff')){
            //App route for app asset, common asset, app info page and app
            app_common.commonApp({  
                                    ip:bff_parameters.ip, 
                                    host:bff_parameters.host ?? '', 
                                    user_agent:bff_parameters.user_agent, 
                                    accept_language:bff_parameters.accept_language, 
                                    url:bff_parameters.url ?? '', 
                                    query:null, 
                                    res:bff_parameters.res})
            .then(result=>{
                if (result!=null && result.STATIC){
                    if (result.SENDFILE){
                        bffSendFile(app_id, bff_parameters, service, result.SENDFILE);
                    }
                    else{
                        bff_parameters.res?bff_parameters.res.status(200):null;
                        bff_parameters.res?bff_parameters.res.send(result.SENDCONTENT):null;
                    }
                }
                else{
                    //result from APP can request to redirect
                    if (bff_parameters.res.statusCode==301)
                        bff_parameters.res.redirect('/');
                    else 
                        if (bff_parameters.res.statusCode==404){
                            if (fileModelConfig.get('CONFIG_SERVER','SERVER', 'HTTPS_ENABLE')=='1')
                                bff_parameters.res.redirect(`https://${fileModelConfig.get('CONFIG_SERVER','SERVER', 'HOST')}`);
                            else
                                bff_parameters.res.redirect(`http://${fileModelConfig.get('CONFIG_SERVER','SERVER', 'HOST')}`);
                        }
                        else{
                            //html or files are returned
                            bff_parameters.res.send(result);
                        }
                }
            })
            .catch(()=>serverError({data:null, methods:null}));
        }
        else{
            //REST API route
            //REST API requests from client are encoded
            const decodedquery = bff_parameters.query?Buffer.from(bff_parameters.query, 'base64').toString('utf-8').toString():'';   
            serverREST_API({  app_id:app_id, 
                            endpoint:bff_parameters.endpoint,
                            method:bff_parameters.method.toUpperCase(), 
                            ip:bff_parameters.ip, 
                            host:bff_parameters.host ?? '', 
                            url:bff_parameters.url ?? '',
                            route_path:bff_parameters.route_path,
                            user_agent:bff_parameters.user_agent, 
                            accept_language:bff_parameters.accept_language, 
                            authorization:bff_parameters.authorization ?? '', 
                            parameters:decodedquery, 
                            body:bff_parameters.body, 
                            res:bff_parameters.res})
            .then((/**@type{*}*/result_service) => {
                const log_result = serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_LOG', 'REQUEST_LEVEL'))==2?result_service:'✅';
                fileModelLog.postServiceI(app_id, service, bff_parameters.query, log_result).then(()=>{
                    if (bff_parameters.endpoint=='SOCKET'){
                        //This endpoint only allowed for EventSource so no more update of response
                        null;
                    }
                    else{
                        if (bff_parameters.res){
                            /**
                             * @param {number} status
                             * @param {*} result
                             */
                            const return_result =(status, result) =>{
                                bff_parameters.res.statusCode = status;
                                if (bff_parameters.endpoint=='APP' || (result && result.STATIC && result.SENDFILE)){
                                    //APP can request server shared modules or reports using REST API
                                    //APP_ID can return JSDoc files using result.STATIC and result.SENDFILE and REST API
                                    if (result!=null && result.STATIC){
                                        if (result.SENDFILE){
                                            bffSendFile(app_id, bff_parameters, service, result.SENDFILE);
                                        }
                                        else{
                                            bff_parameters.res?bff_parameters.res.status(200):null;
                                            bff_parameters.res?bff_parameters.res.send(result.SENDCONTENT):null;
                                        }
                                            
                                    }
                                    else
                                        bff_parameters.res.send(result);
                                }
                                else{
                                    if (result==null)
                                        bff_parameters.res.write('');
                                    else{
                                        //al REST API should return object or numerical value
                                        bff_parameters.res.setHeader('Content-Type',  'application/json; charset=utf-8');
                                        bff_parameters.res.write(JSON.stringify(result), 'utf8');
                                    } 
                                    bff_parameters.res.end();
                                }
                            };
                            if (bff_parameters.method.toUpperCase() == 'POST' && !bff_parameters.route_path.toLowerCase().startsWith('/app-module-function'))
                                return_result(201,result_service);
                            else{
                                bff_parameters.res.statusCode = 200;
                                if (decodedquery && new URLSearchParams(decodedquery).get('fields')){
                                    if (result_service.rows){
                                        //limit fields/keys in rows
                                        const limit_fields = result_service.rows.map((/**@type{*}*/row)=>{
                                            const row_new = {};
                                            /**@ts-ignore */
                                            for (const field of new URLSearchParams(decodedquery).get('fields').split(',')){
                                                /**@ts-ignore */
                                                row_new[field] = row[field];
                                            }
                                            return row_new;
                                        });
                                        result_service.rows = limit_fields;
                                        return_result(200, result_service);
                                        
                                    }
                                    else{
                                        //limit fields/keys in object
                                        const result_service_fields = {};
                                        /**@ts-ignore */
                                        for (const field of new URLSearchParams(decodedquery).get('fields').split(',')){
                                            /**@ts-ignore */
                                            result_service_fields[field] = result_service[field];
                                        }
                                        return_result(200, result_service_fields);
                                    }
                                }
                                else{
                                    return_result(200, result_service ?? '');
                                }
                            }
                        }
                        else{
                            //function called from server return result
                            return result_service;
                        }
                    }  
                });
            })
            .catch((/**@type{server_server_error}*/error) => {
                bffErrorLog(app_id, bff_parameters, service, error);
            });
        }
    }
    else{
        //unknown appid, domain or subdomain, redirect to hostname
        if (fileModelConfig.get('CONFIG_SERVER','SERVER', 'HTTPS_ENABLE')=='1')
            bff_parameters.res?bff_parameters.res.redirect(`https://${fileModelConfig.get('CONFIG_SERVER','SERVER', 'HOST')}`):null;
        else
            bff_parameters.res?bff_parameters.res.redirect(`http://${fileModelConfig.get('CONFIG_SERVER','SERVER', 'HOST')}`):null;
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
    const  {iamUtilMesssageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);
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
                            authorization:bff_parameters.authorization ?? '', 
                            parameters:bff_parameters.query, 
                            body:bff_parameters.body, 
                            res:bff_parameters.res})
            .then((/**@type{string}*/result)=>resolve(result))
            .catch((/**@type{server_server_error}*/error)=>{
                fileModelLog.postServiceE(app_id, service, bff_parameters.query, error).then(() => {
                    reject(error);
                });
            });
        }
        else{
            //required parameters not provided
            reject({
                message: iamUtilMesssageNotAuthorized()
            });
        }
    });
};
export{bffInit, bffStart, bff, bffServer};