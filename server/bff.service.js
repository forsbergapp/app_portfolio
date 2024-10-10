/** @module server/bff/service */

/**@type{import('./server.service.js')} */
const {responsetime, response_send_error, getNumberValue, serverRoutes} = await import(`file://${process.cwd()}/server/server.service.js`);
/**@type{import('./config.service.js')} */
const {CheckFirstTime, ConfigGet, ConfigFileGet} = await import(`file://${process.cwd()}/server/config.service.js`);

/**@type{import('./log.service.js')} */
const {LogRequestI, LogServiceI, LogServiceE} = await import(`file://${process.cwd()}/server/log.service.js`);
/**@type{import('./iam.service.js')} */
const {AuthenticateRequest} = await import(`file://${process.cwd()}/server/iam.service.js`);
/**@type{import('./security.service.js')} */
const {createUUID, createRequestId, createCorrelationId}= await import(`file://${process.cwd()}/server/security.service.js`);

/**@type{import('../apps/common/src/common.service.js')} */
const {commonAppHost}= await import(`file://${process.cwd()}/apps/common/src/common.service.js`);


const fs = await import('node:fs');

/**
 * 
 * @param {number} app_id 
 * @param {import('./types.js').server_bff_parameters} bff_parameters
 * @param {string} service
 * @param {import('./types.js').server_server_error} error 
 */
const BFF_log_error = (app_id, bff_parameters, service, error) =>{
    LogServiceE(app_id, service, bff_parameters.query, error).then(() => {
        if (bff_parameters.res){
            const statusCode = bff_parameters.res.statusCode==200?503:bff_parameters.res.statusCode ?? 503;
            if (error.error && error.error.code=='MICROSERVICE')
                response_send_error( bff_parameters.res, 
                                error.error.http,
                                error.error.code, 
                                `MICROSERVICE ${bff_parameters.route_path.split('/')[1].toUpperCase()} ERROR`, 
                                error.error.developer_text, 
                                error.error.more_info);
            else
                response_send_error( bff_parameters.res, 
                                statusCode, 
                                null, 
                                error, 
                                null, 
                                null);
        }
    });
};

/**
 * Backend for frontend (BFF) init for all methods
 * 
 * Logs if the request is from EventSource
 * Logs when the response is closed
 * Authenticates the request
 * Sets header values on both on the response and on the request
 * Checks robots.txt and favicon.ico
 * Returns a reason if response should be closed
 * 
 * @param {import('./types.js').server_server_req} req
 * @param {import('./types.js').server_server_res} res
 * @returns Promise.<{  reason:'ROBOT'|'FAVICON'|'REQUEST'|null}>
 */
const BFF_init = async (req, res) =>{
    if (req.headers.accept == 'text/event-stream'){
        //Eventsource, log since response is open and log again when closing
        LogRequestI(req, res.statusCode, typeof res.statusMessage == 'string'?res.statusMessage:JSON.stringify(res.statusMessage)??'', responsetime(res));
    }
    res.on('close',()=>{	
        //eventsource response time will be time connected until disconnected
        LogRequestI(req, res.statusCode, typeof res.statusMessage == 'string'?res.statusMessage:JSON.stringify(res.statusMessage)??'', responsetime(res)).then(() => {
            // do not return any StatusMessage to client, this is only used for logging purpose
            res.statusMessage = '';
            res.end();
        });
    });
    //access control that stops request if not passing controls
    /**@type{import('./types.js').server_iam_authenticate_request}*/
    const result = await AuthenticateRequest(req.ip, req.headers.host, req.method, req.headers['user-agent'], req.headers['accept-language'], req.path)
                        .catch((/**@type{import('./types.js').server_server_error}*/error)=>{return { statusCode: 500, statusMessage: error};});
    if (result != null){
        res.statusCode = result.statusCode;
        res.statusMessage = 'access control: ' + result.statusMessage;
        res.write('⛔');
        return {reason:'REQUEST'};
    }
    else{
        //set headers
        res.setHeader('X-Response-Time', process.hrtime());
        req.headers['X-Request-Id'] =  createUUID().replaceAll('-','');
        if (req.headers.authorization)
            req.headers['X-Correlation-Id'] = createRequestId();
        else
            req.headers['X-Correlation-Id'] = createCorrelationId(req.hostname +  req.ip + req.method);
        res.setHeader('Access-Control-Max-Age','5');
        res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, Content-Type, Accept');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        if (ConfigGet('SERVICE_IAM', 'ENABLE_CONTENT_SECURITY_POLICY') == '1'){
            /**@type{import('./types.js').server_config_iam_policy}*/
            const iam_policy = await ConfigFileGet('CONFIG_IAM_POLICY', false);
            res.setHeader('content-security-policy', iam_policy['content-security-policy']);
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
            res.type('text/plain');
            res.write('User-agent: *\nDisallow: /');
            return {reason:'ROBOT'};
        }
        else{
            //browser favorite icon to ignore
            if (req.originalUrl=='/favicon.ico'){
                res.write('');
                return {reason:'FAVICON'};
            }
            else{
                return {reason:null};
            }
        }
    }
};
/**
 * Backend for frontend (BFF) start for get method
 * 
 * If first time, when no admin exists, then redirect everything to admin
 * Checks if SSL verification using Letsencrypt is enabled when validating domain
 * and sends requested verifcation file
 * Redirects naked domain to www except for localhost
 * Redirects from http to https if https is enabled
 * 
 * @param {import('./types.js').server_server_req} req
 * @param {import('./types.js').server_server_res} res
 * @returns Promise.<{reason:'REDIRECT'|'SEND'|null,redirect:string}>
 */
const BFF_start = async (req, res) =>{
    const check_redirect = () =>{
        //redirect naked domain to www except for localhost
        if (req.headers.host.startsWith(ConfigGet('SERVER','HOST') ?? '') && req.headers.host.indexOf('localhost')==-1)
            if (ConfigGet('SERVER', 'HTTPS_ENABLE')=='1')
                return {reason:'REDIRECT', redirect:`https://www.${req.headers.host}${req.originalUrl}`};
            else
                return {reason:'REDIRECT', redirect:`http://www.${req.headers.host}${req.originalUrl}`};
        else{
            //redirect from http to https if https is enabled
            if (req.protocol=='http' && ConfigGet('SERVER', 'HTTPS_ENABLE')=='1')
                return {reason:'REDIRECT', redirect:`https://${req.headers.host}${req.originalUrl}`};
            else
                return {reason:null, redirect:null};
        }
    };
    //if first time, when no system admin exists, then redirect everything to admin
    if (CheckFirstTime() && req.headers.host.startsWith('admin') == false && req.headers.referer==undefined)
        return {reason:'REDIRECT', redirect:`http://admin.${ConfigGet('SERVER','HOST')}`};
    else{
        //check if SSL verification using letsencrypt is enabled when validating domains
        if (ConfigGet('SERVER', 'HTTPS_SSL_VERIFICATION')=='1'){
            if (req.originalUrl.startsWith(ConfigGet('SERVER', 'HTTPS_SSL_VERIFICATION_PATH') ?? '')){
                res.type('text/plain');
                res.write(await fs.promises.readFile(`${process.cwd()}${req.originalUrl}`, 'utf8'));
                return {reason:'SEND', redirect:null};
            }
            else
                return check_redirect();
        }
        else
            return check_redirect();
    }
};
/**
 * Backend for frontend (BFF) called from client
 * 
 * @param {import('./types.js').server_bff_parameters} bff_parameters
 */
 const BFF = (bff_parameters) =>{
    const service = (bff_parameters.route_path?bff_parameters.route_path.split('/')[1]:'').toUpperCase();
    const app_id = commonAppHost(bff_parameters.host ?? '');
    
    if (app_id !=null){
        let decodedquery = '';
        if ((bff_parameters.endpoint=='APP')){
            //App route for app asset, common asset, app info page, app report (using query) and app
            decodedquery = bff_parameters.route_path;
        }
        else{
            //REST API requests from client are encoded
            decodedquery = bff_parameters.query?Buffer.from(bff_parameters.query, 'base64').toString('utf-8').toString():'';
        }
        serverRoutes({  app_id:app_id, 
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
            if (bff_parameters.endpoint=='APP' && result_service!=null && result_service.STATIC){
                if (result_service.SENDFILE){
                    bff_parameters.res?bff_parameters.res.sendFile(result_service.SENDFILE):null;
                    bff_parameters.res?bff_parameters.res.status(200):null;
                }
                else
                    bff_parameters.res?bff_parameters.res.status(200).send(result_service.SENDCONTENT):null;
            }
            else{
                const log_result = getNumberValue(ConfigGet('SERVICE_LOG', 'REQUEST_LEVEL'))==2?result_service:'✅';
                LogServiceI(app_id, service, bff_parameters.query, log_result).then(()=>{
                    if (bff_parameters.endpoint=='SOCKET'){
                        //This endpoint only allowed for EventSource so no more update of response
                        null;
                    }
                    else{
                        if (bff_parameters.res){
                            //result from APP can request to redirect
                            if (bff_parameters.endpoint=='APP' && bff_parameters.res.statusCode==301)
                                bff_parameters.res.redirect('/');
                            else 
                                if (bff_parameters.endpoint=='APP' && bff_parameters.res.statusCode==404){
                                    if (ConfigGet('SERVER', 'HTTPS_ENABLE')=='1')
                                        bff_parameters.res.redirect(`https://${ConfigGet('SERVER', 'HOST')}`);
                                    else
                                        bff_parameters.res.redirect(`http://${ConfigGet('SERVER', 'HOST')}`);
                                }
                                else{
                                    if (bff_parameters.method.toUpperCase() == 'POST' && !bff_parameters.route_path.toLowerCase().startsWith('/app-function'))
                                        bff_parameters.res.status(201).send(result_service);
                                    else{
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
                                                bff_parameters.res.status(200).send(result_service);
                                            }
                                            else{
                                                //limit fields/keys in object
                                                const result_service_fields = {};
                                                /**@ts-ignore */
                                                for (const field of new URLSearchParams(decodedquery).get('fields').split(',')){
                                                    /**@ts-ignore */
                                                    result_service_fields[field] = result_service[field];
                                                }
                                                bff_parameters.res.status(200).send(result_service_fields);
                                            }
                                        }
                                        else
                                            bff_parameters.res.status(200).send(result_service);
                                    }
                                        
                                }
                        }
                        else{
                            //function called from server return result
                            return result_service;
                        }
                    }  
                });
            }
        })
        .catch((/**@type{import('./types.js').server_server_error}*/error) => {
            BFF_log_error(app_id, bff_parameters, service, error);
        });
    }
    else{
        //unknown appid, domain or subdomain, redirect to hostname
        if (ConfigGet('SERVER', 'HTTPS_ENABLE')=='1')
            bff_parameters.res?bff_parameters.res.redirect(`https://${ConfigGet('SERVER', 'HOST')}`):null;
        else
            bff_parameters.res?bff_parameters.res.redirect(`http://${ConfigGet('SERVER', 'HOST')}`):null;
    }
};
/**
 * BFF called from server
 * @param {number|null} app_id
 * @param {import('./types.js').server_bff_parameters} bff_parameters
 * @returns {Promise<(*)>}
 */
 const BFF_server = async (app_id, bff_parameters) => {
    return new Promise((resolve, reject) => {
        const service = (bff_parameters.route_path?bff_parameters.route_path.split('/')[1]:'').toUpperCase();
        if (app_id !=null && bff_parameters.endpoint){
            serverRoutes({  app_id:app_id, 
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
            .catch((/**@type{import('./types.js').server_server_error}*/error)=>{
                LogServiceE(app_id, service, bff_parameters.query, error).then(() => {
                    reject(error);
                });
            });
        }
        else{
            //required parameters not provided
            reject({
                message: '⛔'
            });
        }
    });
};
export{response_send_error, BFF_init, BFF_start, BFF, BFF_server};