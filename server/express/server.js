/** @module server/express/server */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../types.js';

const {ConfigGet, ConfigGetSaved} = await import(`file://${process.cwd()}/server/server.service.js`);
/**
 * Calculate responsetime
 * @param {Types.res} res
 * @returns {number}
 */
 const responsetime = (res) => {
    const diff = process.hrtime(res.getHeader('X-Response-Time'));
    return diff[0] * 1e3 + diff[1] * 1e-6;
};    

/**
 * Returns parameters for log
 * @param {Types.req} req
 * @returns {Types.req_log_parameters|Types.req|null} 
 */
const req_log = (req) => {  switch (ConfigGet('SERVICE_LOG', 'REQUEST_LEVEL')){
                                //INFO
                                case '1':{
                                    return {host:           req.headers.host,
                                            ip:             req.ip,
                                            protocol:       req.protocol,
                                            httpVersion:    req.httpVersion,
                                            originalUrl:    req.originalUrl,
                                            method:         req.method,
                                            headers:        {   'X-Request-Id':       req.headers['X-Request-Id'],
                                                                'X-Correlation-Id':   req.headers['X-Correlation-Id'],
                                                                'user-agent':         req.headers['user-agent'], 
                                                                'accept-language':    req.headers['accept-language'], 
                                                                referer:              req.headers.referer},
                                            socket:         {   bytesRead:          req.socket.bytesRead,
                                                                bytesWritten:       req.socket.bytesWritten}};
                                }
                                //VERBOSE
                                case '2':{
                                    return req;
                                }
                                //NONE
                                case '0':
                                default:{
                                    return null;
                                }
                            }};

/**
 * server Express Log error
 * @param {Types.express} app
 */
 const serverExpressLogError = (app) =>{
    import(`file://${process.cwd()}/server/log/log.service.js`).then(({LogRequestE}) => {
        //ERROR LOGGING
        app.use((/**@type{Types.error}*/err,/**@type{Types.req}*/req,/**@type{Types.res}*/res, /**@type{function}*/next) => {
            LogRequestE(req_log(req), res.statusCode, res.statusMessage, responsetime(res), err).then(() => {
                next();
            });
        });    
    });
};
/**
 * server Express Routes
 * @param {Types.express} app
 */
 const serverExpressRoutes = async (app) => {
    //apps
    const { BFF_data, BFF_data_login, BFF_data_signup, BFF_access, BFF_admin, BFF_systemadmin, BFF_socket, BFF_auth} = await import(`file://${process.cwd()}/apps/apps.controller.js`);
    //auth
    const { checkAccessToken, checkDataToken, checkDataTokenRegistration, checkDataTokenLogin, checkAccessTokenAdmin} = await import(`file://${process.cwd()}/server/auth/auth.controller.js`);
    //auth admin
    const { checkSystemAdmin} = await import(`file://${process.cwd()}/server/auth/admin/admin.controller.js`);

    //server db api app_portfolio user account
    const {
        updatePassword,
        updateUserLocal,
        getUserByUserId,
        updateUserCommon,
        deleteUser,
        getProfileDetail,
        searchProfileUser} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account/user_account.controller.js`);
    //server db api app_portfolio user account app
    const { createUserAccountApp, getUserAccountApps, getUserAccountApp, updateUserAccountApp, deleteUserAccountApps} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_app/user_account_app.controller.js`);

    const { createUserSetting, 
            getProfileUserSettingDetail,
            updateUserSetting, 
            deleteUserSetting} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_app_setting/user_account_app_setting.controller.js`);
    const { likeUserSetting, unlikeUserSetting} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_app_setting_like/user_account_app_setting_like.controller.js`);

    //server db api db app_portfolio user account follow
    const { followUser, unfollowUser} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_follow/user_account_follow.controller.js`);
    //server db api app_portfolio user account like
    const { likeUser, unlikeUser} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_like/user_account_like.controller.js`);
    
    //ConfigGet function in service.js used to get parameter values
    const rest_resource_service_db_schema = ConfigGet('SERVICE_DB', 'REST_RESOURCE_SCHEMA');
    const rest_resouce_server = ConfigGet('SERVER', 'REST_RESOURCE_SERVER');
    
    app.route('/apps/bff/data').delete          (checkDataToken, BFF_data);
    app.route('/apps/bff/data').get             (checkDataToken, BFF_data);
    app.route('/apps/bff/data').patch           (checkDataToken, BFF_data);
    app.route('/apps/bff/data').post            (checkDataToken, BFF_data);
    app.route('/apps/bff/data').put             (checkDataToken, BFF_data);
    app.route('/apps/bff/data_login').put       (checkDataTokenLogin, BFF_data_login);
    app.route('/apps/bff/data_signup').post     (checkDataTokenRegistration, BFF_data_signup);
    app.route('/apps/bff/access').delete        (checkAccessToken, BFF_access);
    app.route('/apps/bff/access').get           (checkAccessToken, BFF_access);
    app.route('/apps/bff/access').patch         (checkAccessToken, BFF_access);
    app.route('/apps/bff/access').post          (checkAccessToken, BFF_access);
    app.route('/apps/bff/access').put           (checkAccessToken, BFF_access);
    app.route('/apps/bff/admin').delete         (checkAccessTokenAdmin, BFF_admin);
    app.route('/apps/bff/admin').get            (checkAccessTokenAdmin, BFF_admin);
    app.route('/apps/bff/admin').patch          (checkAccessTokenAdmin, BFF_admin);
    app.route('/apps/bff/admin').post           (checkAccessTokenAdmin, BFF_admin);
    app.route('/apps/bff/admin').put            (checkAccessTokenAdmin, BFF_admin);
    app.route('/apps/bff/systemadmin').delete   (checkSystemAdmin, BFF_systemadmin);
    app.route('/apps/bff/systemadmin').get      (checkSystemAdmin, BFF_systemadmin);
    app.route('/apps/bff/systemadmin').patch    (checkSystemAdmin, BFF_systemadmin);
    app.route('/apps/bff/systemadmin').post     (checkSystemAdmin, BFF_systemadmin);
    app.route('/apps/bff/systemadmin').put      (checkSystemAdmin, BFF_systemadmin);    
    app.route('/apps/bff/socket').get           (BFF_socket);
    app.route('/apps/bff/auth').post            (BFF_auth);

    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/password/:id`).put(checkAccessToken, updatePassword);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/:id`).put(checkAccessToken, updateUserLocal);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/:id`).get(checkAccessToken, getUserByUserId);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/common/:id`).put(checkAccessToken, updateUserCommon);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/:id`).delete(checkAccessToken, deleteUser);    
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/profile/detail/:id`).get(checkAccessToken, getProfileDetail);    
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/profile/username/searchA`).post(checkAccessToken, searchProfileUser);

    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app/`).post(checkAccessToken, createUserAccountApp);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app`).get(checkAccessToken, getUserAccountApp);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app/apps/:user_account_id`).get(checkAccessToken, getUserAccountApps);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app/:user_account_id`).patch(checkAccessToken, updateUserAccountApp);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app/:user_account_id/:app_id`).delete(checkAccessToken, deleteUserAccountApps);

    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app_setting/profile/detail/:id`).get(checkAccessToken, getProfileUserSettingDetail);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app_setting`).post(checkAccessToken, createUserSetting);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app_setting/:id`).put(checkAccessToken, updateUserSetting);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app_setting/:id`).delete(checkAccessToken, deleteUserSetting);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app_setting_like/:id`).post(checkAccessToken, likeUserSetting);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app_setting_like/:id`).delete(checkAccessToken, unlikeUserSetting);

    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_follow/:id`).post(checkAccessToken, followUser);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_follow/:id`).delete(checkAccessToken, unfollowUser);

    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_like/:id`).post(checkAccessToken, likeUser);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_like/:id`).delete(checkAccessToken, unlikeUser);    
};
/**
 * server Express
 * @async
 * @returns {Promise<Types.express>} app
 */
const serverExpress = async () => {
    const {default:express} = await import('express');
    const {CheckFirstTime, ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);
    const {default:compression} = await import('compression');
    const { check_request, access_control} = await import(`file://${process.cwd()}/server/auth/auth.service.js`);
    const {LogRequestI} = await import(`file://${process.cwd()}/server/log/log.service.js`);    
    const ContentSecurityPolicy = ConfigGetSaved(4)['content-security-policy'];
    const {randomUUID, createHash} = await import('node:crypto');
    return new Promise((resolve) =>{
        /**@type{Types.express} */
        const app = express();
        //
        //MIDDLEWARES
        //
        //use compression for better performance
        const shouldCompress = (/**@type{Types.req}*/req) => {
            //exclude broadcast messages
            //check endpoint for broadcast
            if (req.baseUrl == `${ConfigGet('SERVER', 'REST_RESOURCE_SERVER')}/broadcast`)
                return false;
            else
                return true;
            };
        app.set('trust proxy', true);
        /* Ignore compression typescript error:
            Type '(req: Types.req) => boolean' is not assignable to type 'CompressionFilter'.
            Types of parameters 'req' and 'req' are incompatible.
            Type 'Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>' is not assignable to type 'req'.
            Types of property 'params' are incompatible.
            Type 'ParamsDictionary' is missing the following properties from type '{ sub: string; info: string; }': sub, info
        */
        /**@ts-ignore */
        app.use(compression({ filter: shouldCompress }));
        app.use((/**@type{Types.req}*/req, /**@type{Types.res}*/ res, /**@type{function}*/ next) => {
            res.setHeader('X-Response-Time', process.hrtime());
            req.headers['X-Request-Id'] =  randomUUID().replaceAll('-','');
            if (req.headers.authorization)
                req.headers['X-Correlation-Id'] = createHash('md5').update(req.headers.authorization).digest('hex');
            else
                req.headers['X-Correlation-Id'] = createHash('md5').update(req.hostname +  req.ip + req.method).digest('hex');
            res.setHeader('Access-Control-Max-Age','5');
            res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, Content-Type, Accept');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
            if (ConfigGet('SERVICE_AUTH', 'ENABLE_CONTENT_SECURITY_POLICY') == '1')
                res.setHeader('content-security-policy', ContentSecurityPolicy);
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
            next();
        });
        // set JSON maximum size
        app.use(express.json({ limit: ConfigGet('SERVER', 'JSON_LIMIT') }));
        
        app.use((/**@type{Types.req}*/req, /**@type{Types.res}*/ res, /**@type{function}*/ next) => {
            //access control that stops request if not passing controls
            if (ConfigGet('SERVICE_AUTH', 'ACCESS_CONTROL_ENABLE')=='1'){
                access_control(req.ip, req.headers.host, req.headers['user-agent'], req.headers['accept-language'], (/**@type{string}*/err, /**@type{Types.access_control}*/result)=>{
                    if (err){
                        //access control caused unknown error continue, will be logged when response closed
                        res.statusCode = 500;
                        res.statusMessage = err;
                        next();
                    }
                    else
                        if (result == null){
                            //access control ok
                            //check request characters in path
                            check_request(req.path, (/**@type{string}*/err) =>{
                                if (err){
                                    res.statusCode = 400;
                                    res.send('⛔');
                                    res.end();
                                }
                                else
                                    next();
                            });
                        }
                        else{
                            //update response, will be logged in request log
                            res.statusCode = result.statusCode;
                            res.statusMessage = 'access control: ' + result.statusMessage;
                            res.send('⛔');
                            res.end();
                        }
                });
            }
            else
                next();
        });
        
        //logs after response is finished
        app.use((/**@type{Types.req}*/req, /**@type{Types.res}*/ res, /**@type{function}*/ next) => {
            if (req.headers.accept == 'text/event-stream'){
                //Eventsource, log since response is open and log again when closing
                LogRequestI(req_log(req), res.statusCode, res.statusMessage, responsetime(res));
            }
            res.on('close',()=>{
                //eventsource response time will be time connected until disconnected
                LogRequestI(req_log(req), res.statusCode, res.statusMessage, responsetime(res)).then(() => {
                    res.end();
                });
            });
            next();
        });
        //check if SSL verification using letsencrypt should be enabled when validating domains
        if (ConfigGet('SERVER', 'HTTPS_SSL_VERIFICATION')=='1'){
            const ssl_verification_path = ConfigGet('SERVER', 'HTTPS_SSL_VERIFICATION_PATH');
            app.use(ssl_verification_path,express.static(process.cwd() + ssl_verification_path));
            app.use(express.static(process.cwd() + ssl_verification_path, { dotfiles: 'allow' }));
        }
        //
        //ROUTES
        //
        //get before apps code
        //info for search bots
        app.get('/robots.txt',  (/**@type{Types.req}*/req, /**@type{Types.res}*/ res) => {
            res.type('text/plain');
            res.send('User-agent: *\nDisallow: /');
        });
        //browser favorite icon to ignore
        app.get('/favicon.ico', (/**@type{Types.req}*/req, /**@type{Types.res}*/ res) => {
            res.send('');
        });
        //change all requests from http to https and naked domains with prefix https://www. except localhost
        app.get('*', (/**@type{Types.req}*/req, /**@type{Types.res}*/ res, /**@type{function}*/ next) => {
            //if first time, when no system admin exists, then redirect everything to admin
            if (CheckFirstTime() && req.headers.host.startsWith('admin') == false && req.headers.referer==undefined)
                res.redirect(`http://admin.${req.headers.host.lastIndexOf('.')==-1?req.headers.host:req.headers.host.lastIndexOf('.')}`);
            else{
            //redirect naked domain to www except for localhost
            if (((req.headers.host.split('.').length - 1) == 1) &&
                req.headers.host.indexOf('localhost')==-1)
                if (req.protocol=='http' && ConfigGet('SERVER', 'HTTPS_ENABLE')=='1')
                    res.redirect('https://' + 'www.' + req.headers.host + req.originalUrl);
                else
                    res.redirect('http://' + 'www.' + req.headers.host + req.originalUrl);
            else{
                //redirect from http to https if https enabled
                if (req.protocol=='http' && ConfigGet('SERVER', 'HTTPS_ENABLE')=='1')
                    res.redirect('https://' + req.headers.host + req.originalUrl);
                else{
                    next();
                }
            }
            }
        });
        serverExpressRoutes(app).then(() =>{
            resolve(app);
        });
    });
};
export {serverExpressLogError, serverExpressRoutes, serverExpress};