/** @module server */

/**
 * Sends ISO 20022 error format
 * @param {import('../types.js').res} res 
 * @param {number} http 
 * @param {string|null} code 
 * @param {string|number|object|null} text 
 * @param {string|null} developer_text 
 * @param {string|null} more_info 
 */
 const send_iso_error = (res, http, code, text, developer_text, more_info) => {
    //ISO20022 error format
    const message = {"error":{
                        "http":http, 
                        "code":code, 
                        "text":text, 
                        "developer_text":developer_text, 
                        "more_info":more_info}};
    //remove statusMessage or [ERR_INVALID_CHAR] might occur and is moved to inside message
    res.statusMessage = '';
    res.status(http).send(message);
}
/**
 * Get number value from request key
 * returns number or null for numbers
 * so undefined and '' are avoided sending argument to service functions
 * @param {import('../types.js').req_id_number} param
 * @returns {number|null}
 */
 const getNumberValue = param => (param==null||param===undefined||param==='')?null:Number(param);


/**
 * Calculate responsetime
 * @param {import('../types.js').res} res
 * @returns {number}
 */
const responsetime = (res) => {
    const diff = process.hrtime(res.getHeader('X-Response-Time'));
    return diff[0] * 1e3 + diff[1] * 1e-6;
};    

/**
 * ES6 object with properties using concise method syntax
 */
const COMMON = {
    app_filename(/**@type{string}*/module){
        const from_app_root = ('file:///' + process.cwd().replace(/\\/g, '/')).length;
        return module.substring(from_app_root);
    },
    app_function(/**@type{import('../types.js').error_stack}*/stack){
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
        return functionName;
    },
    app_line(){
        /**@type {import('../types.js').error} */
        const e = new Error() || '';
        const frame = e.stack.split('\n')[2];
        const lineNumber = frame.split(':').reverse()[1];
        return lineNumber;
    }
};

/**
 * server Express
 * @async
 * @returns {Promise<import('../types.js').express>} app
 */
 const serverExpress = async () => {
    /**@type{import('./config.service.js')} */
    const {ConfigGet} = await import(`file://${process.cwd()}/server/config.service.js`);
    /**@type{import('./log.service.js')} */
    const {LogRequestE} = await import(`file://${process.cwd()}/server/log.service.js`);

    const {default:express} = await import('express');
    const {default:compression} = await import('compression');
    
    /**@type{import('../types.js').express} */
    const app = express();
    //
    //MIDDLEWARES
    //
    //use compression for better performance
    const shouldCompress = (/**@type{import('../types.js').req}*/req) => {
        //exclude broadcast messages using socket
        if (req.headers.accept == 'text/event-stream')
            return false;
        else
            return true;
        };
    app.set('trust proxy', true);
    /**@ts-ignore */
    app.use(compression({ filter: shouldCompress }));
    // set JSON maximum size
    app.use(express.json({ limit: ConfigGet('SERVER', 'JSON_LIMIT') }));
    
    //ROUTES MIDDLEWARE
    //apps
    /**@type{import('./bff.js')} */
    const { BFF_init, BFF_start, BFF_app, BFF_app_data, BFF_app_signup, BFF_app_access, BFF_admin, BFF_superadmin, BFF_systemadmin, BFF_socket, BFF_iam} = await import(`file://${process.cwd()}/server/bff.js`);
    //auth
    /**@type{import('./iam.js')} */
    const iam = await import(`file://${process.cwd()}/server/iam.js`);
    
    //ROUTES 
    //logs EventSource and response when closed, authenticates request and will end request if not passing controls, 
    //sets headers, returns disallow for robots.txt and empty favicon.ico
    app.route('*').all                      (BFF_init);
    
    //redirects naked domain, http to https if enabled and to admin subdomain if first time, responds to SSL verification if enabled
    app.route('*').get                      (BFF_start);
    
    //REST API 
    //URI syntax implemented:
    //https://[subdomain].[domain]/[backend for frontend (bff)]/[role authorization]/version/[resource collection/service]/[resource]/[optional resource id]?URI query
	//URI query: iam=[iam parameters base64 encoded]&parameters=[app parameters base64 encoded]
    app.route('/bff/app_data/v1*').all      (iam.AuthenticateDataToken, BFF_app_data);
    app.route('/bff/app_signup/v1*').post   (iam.AuthenticateDataTokenRegistration, BFF_app_signup);
    app.route('/bff/app_access/v1*').all    (iam.AuthenticateAccessToken, BFF_app_access);
    app.route('/bff/admin/v1*').all         (iam.AuthenticateAccessTokenAdmin, BFF_admin);    
    app.route('/bff/superadmin/v1*').all    (iam.AuthenticateAccessTokenSuperAdmin, BFF_superadmin);
    app.route('/bff/systemadmin/v1*').all   (iam.AuthenticateAccessTokenSystemAdmin, BFF_systemadmin);
    app.route('/bff/socket/v1*').get        (iam.AuthenticateSocket, BFF_socket);
    app.route('/bff/iam/v1*').post          (iam.AuthenticateIAM, BFF_iam);
    
    //app asset, common asset, info page, report and app
    app.route('*').get                      (BFF_app);
    
    //ERROR LOGGING
    app.use((/**@type{import('../types.js').error}*/err,/**@type{import('../types.js').req}*/req,/**@type{import('../types.js').res}*/res, /**@type{function}*/next) => {
        LogRequestE(req, res.statusCode, res.statusMessage, responsetime(res), err).then(() => {
            next();
        });
    });
    return app;
};
/**
 * server routes
 * @param {import('../types.js').routesparameters} routesparameters
 * @async
 */
 const serverRoutes = async (routesparameters) =>{
    /**@type{import('../microservice/microservice.service.js')} */
    const {microservice_api_version, microserviceRequest}= await import(`file://${process.cwd()}/microservice/microservice.service.js`);

    //server app object
    /**@type{import('../apps/apps.js')} */
    const app = await import(`file://${process.cwd()}/apps/apps.js`);

    //server iam object
    /**@type{import('./iam.js')} */
    const iam = await import(`file://${process.cwd()}/server/iam.js`);

    //server iam service
    /**@type{import('./iam.service.js')} */
    const iam_service = await import(`file://${process.cwd()}/server/iam.service.js`);

    //server config object
    /**@type{import('./config.js')} */
    const config = await import(`file://${process.cwd()}/server/config.js`);
    //server config service
    /**@type{import('./config.service.js')} */
    const config_service = await import(`file://${process.cwd()}/server/config.service.js`);

    //server info object
    /**@type{import('./info.js')} */
    const info = await import(`file://${process.cwd()}/server/info.js`);
    
    //server log object
    /**@type{import('./log.js')} */
    const log = await import(`file://${process.cwd()}/server/log.js`);

    //server socket object
    /**@type{import('./socket.js')} */
    const socket = await import(`file://${process.cwd()}/server/socket.js`);

    //server db api object database
    /**@type{import('./dbapi/object/database.js')} */
    const db_database = await import(`file://${process.cwd()}/server/dbapi/object/database.js`);
    //server db api object app
    /**@type{import('./dbapi/object/app.js')} */
    const db_app = await import(`file://${process.cwd()}/server/dbapi/object/app.js`);
    //server db api object app_category
    /**@type{import('./dbapi/object/app_category.js')} */
    const db_app_category = await import(`file://${process.cwd()}/server/dbapi/object/app_category.js`);
    //server db api  object app_log
    /**@type{import('./dbapi/object/app_log.js')} */
    const db_app_log = await import(`file://${process.cwd()}/server/dbapi/object/app_log.js`);
    //server db api object app_object
    /**@type{import('./dbapi/object/app_object.js')} */
    const db_app_object = await import(`file://${process.cwd()}/server/dbapi/object/app_object.js`);
    //server db api object app_role
    /**@type{import('./dbapi/object/app_role.js')} */
    const db_app_role = await import(`file://${process.cwd()}/server/dbapi/object/app_role.js`);
    //server db api object app_setting
    /**@type{import('./dbapi/object/app_setting.js')} */
    const db_app_setting = await import(`file://${process.cwd()}/server/dbapi/object/app_setting.js`);
    //server db api object country
    /**@type{import('./dbapi/object/country.js')} */
    const db_country = await import(`file://${process.cwd()}/server/dbapi/object/country.js`);
    //server db api object identity provider
    /**@type{import('./dbapi/object/identity_provider.js')} */
    const db_identity_provider = await import(`file://${process.cwd()}/server/dbapi/object/identity_provider.js`);
    //server db api object locale
    /**@type{import('./dbapi/object/locale.js')} */
    const db_locale = await import(`file://${process.cwd()}/server/dbapi/object/locale.js`);
    
    //server db api object user account
    /**@type{import('./dbapi/object/user_account.js')} */
    const db_user_account = await import(`file://${process.cwd()}/server/dbapi/object/user_account.js`);
    //server db api object user account app
    /**@type{import('./dbapi/object/user_account_app.js')} */
    const db_user_account_app = await import(`file://${process.cwd()}/server/dbapi/object/user_account_app.js`);
    //server db api object user account app data post
    /**@type{import('./dbapi/object/user_account_app_data_post.js')} */
    const db_user_account_app_data_post = await import(`file://${process.cwd()}/server/dbapi/object/user_account_app_data_post.js`);
    
    return new Promise((resolve, reject)=>{
        try {
            if (routesparameters.endpoint == 'APP' && routesparameters.method == 'GET'){
                //App route for app asset, common asset, app info page, app report (using query) and app
                const URI_query = routesparameters.route_path.startsWith('/app-reports')?routesparameters.url.substring(routesparameters.url.indexOf('?')):null;
                const app_query = URI_query?new URLSearchParams(URI_query):null;
                resolve(app.getAppMain(routesparameters.ip, routesparameters.host, routesparameters.user_agent, routesparameters.accept_language, routesparameters.url, app_query, routesparameters.res));
            }
            else{
                const resource_id_string = ':RESOURCE_ID';
                const URI_query = routesparameters.parameters;
                const URI_path = routesparameters.url.indexOf('?')>-1?routesparameters.url.substring(0, routesparameters.url.indexOf('?')):routesparameters.url;
                const app_query = URI_query?new URLSearchParams(URI_query):null;
                let resource_id_not_authorized = false;
                /**
                 * Returns resource id from URI path
                 * if resource id not requested for a route using resource id and last part of path is string then return null
                 * @param {boolean} is_string
                 * @returns {number|string|null}
                 */
                const resource_id_get = (is_string=false) => is_string?
                                                                URI_path.substring(URI_path.lastIndexOf('/') + 1):
                                                                    getNumberValue(URI_path.substring(URI_path.lastIndexOf('/') + 1));
                
                
                /**
                 * 
                 * @param {string} url 
                 * @param {string} method 
                 * @param {'user_id'|'app_id'|null} resource_validate_type
                 * @param {string|number|null} resource_validate_value
                 * @returns 
                 */
                const route = (url, method, resource_validate_type = null, resource_validate_value= null) =>{
                    if ((url.endsWith('/' + resource_id_string)?url.replace('/' + resource_id_string, URI_path.substring(URI_path.lastIndexOf('/'))):url) == URI_path && 
                        method == routesparameters.method)
                        if (resource_validate_type)
                            if (iam_service.AuthenticateResource({iam:routesparameters.res.req.query.iam, resource_id:resource_validate_value, resource_type:resource_validate_type}))
                                return true
                            else{
                                resource_id_not_authorized = true;
                                return false
                            }
                        else
                            return true;
                    else
                        return false;
                }
                                
                /**
                 * @param {import('../types.js').req_id_number} app_id
                 * @param {string} microservice_path 
                 * @param {string} microservice_query 
                 */
                const call_microservice = async (app_id, microservice_path, microservice_query) => {
                    //use app id, CLIENT_ID and CLIENT_SECRET for microservice IAM
                    const authorization = `Basic ${Buffer.from(     config_service.ConfigGetApp(app_id, app_id, 'SECRETS').CLIENT_ID + ':' + 
                                                                    config_service.ConfigGetApp(app_id, app_id, 'SECRETS').CLIENT_SECRET,'utf-8').toString('base64')}`;
                    return microserviceRequest(app_id == getNumberValue(config_service.ConfigGet('SERVER', 'APP_COMMON_APP_ID')), //if appid = APP_COMMON_APP_ID then admin
                                                microservice_path, 
                                                Buffer.from(microservice_query + `&app_id=${app_id}`).toString('base64'), 
                                                routesparameters.method,
                                                routesparameters.ip, 
                                                authorization, 
                                                routesparameters.user_agent, 
                                                routesparameters.accept_language, 
                                                routesparameters.body?routesparameters.body:null)
                            .catch((/**@type{import('../types.js').error}*/error)=>{throw error});
                };

                //using switch (true) pattern
                switch (true){
                    //server routes
                    case route(`/bff/app_data/v1/app/apps/${resource_id_string}`, 'GET'):{
                        resolve(app.getApps(routesparameters.app_id, resource_id_get(), app_query));
                        break;
                    }
                    case route(`/bff/app_data/v1/server-socket/socket-status/${resource_id_string}`, 'GET', 'app_id', routesparameters.app_id):{
                        resolve(socket.CheckOnline(resource_id_get()));
                        break;
                    }
                    case route(`/bff/app_data/v1/server-db/app_object`, 'GET'):{
                        resolve(db_app_object.getObjects(routesparameters.app_id, app_query));
                        break;
                    }
                    case route(`/bff/app_data/v1/server-db/country`, 'GET'):{
                        resolve(db_country.getCountries(routesparameters.app_id, app_query));
                        break;
                    }
                    case route(`/bff/app_data/v1/server-db/identity_provider`, 'GET'):{
                        resolve(db_identity_provider.getIdentityProviders(routesparameters.app_id));
                        break;
                    }
                    case route(`/bff/app_data/v1/server-db/locale`, 'GET'):{
                        resolve(db_locale.getLocales(routesparameters.app_id, app_query));
                        break;
                    }
                    case route(`/bff/app_data/v1/server-db/app_settings`, 'GET'):{
                        resolve(db_app_setting.getSettings(routesparameters.app_id, app_query));
                        break;
                    }
                    case route(`/bff/app_data/v1/server-db/app_settings_display`, 'GET'):{
                        resolve(db_app_setting.getSettingDisplayData(routesparameters.app_id, app_query));
                        break;
                    }
                    case route(`/bff/app_data/v1/server-db/user_account-activate/${resource_id_string}`, 'PUT', 'user_id', resource_id_get()):{
                        resolve(db_user_account.activate(routesparameters.app_id, resource_id_get(), routesparameters.ip, routesparameters.user_agent, routesparameters.accept_language, routesparameters.host, app_query, routesparameters.body, routesparameters.res));
                        break;
                    }
                    case route(`/bff/app_data/v1/server-db/user_account-forgot`, 'POST'):{
                        resolve(db_user_account.forgot(routesparameters.app_id, routesparameters.ip, routesparameters.user_agent, routesparameters.accept_language, routesparameters.host, routesparameters.body));
                        break;
                    }
                    case route(`/bff/app_data/v1/server-db/user_account-profile-stat`, 'GET'):{
                        resolve(db_user_account.getProfileStat(routesparameters.app_id, app_query, routesparameters.res));
                        break;
                    }
                    case route(`/bff/app_data/v1/server-db/user_account-profile-name/${resource_id_string}`, 'GET'):{
                        resolve(db_user_account.getProfile(routesparameters.app_id, -1, resource_id_get(true), routesparameters.ip, routesparameters.user_agent, app_query, routesparameters.body, routesparameters.res));
                        break;
                    }
                    case route(`/bff/app_data/v1/server-db/user_account-profile/${resource_id_string}`, 'GET'):{
                        resolve(db_user_account.getProfile(routesparameters.app_id, resource_id_get(), null, routesparameters.ip, routesparameters.user_agent, app_query, routesparameters.body, routesparameters.res));
                        break;
                    }
                    case route(`/bff/app_data/v1/server-db/user_account_app_data_post/${resource_id_string}`, 'GET'):{
                        resolve(db_user_account_app_data_post.getUserPostsByUserId(routesparameters.app_id, resource_id_get(), app_query));
                        break;
                    }
                    case route(`/bff/app_data/v1/server-db/user_account_app_data_post-profile-stat-like/${resource_id_string}`, 'GET'):{
                        resolve(db_user_account_app_data_post.getProfileStatLike(routesparameters.app_id, resource_id_get(), app_query, routesparameters.res));
                        break;
                    }
                    case route(`/bff/app_data/v1/server-db/user_account_app_data_post-profile/${resource_id_string}`, 'GET'):{
                        resolve(db_user_account_app_data_post.getProfileUserPosts(routesparameters.app_id, resource_id_get(), app_query, routesparameters.res));
                        break;
                    }
                    case route(`/bff/app_data/v1/server-db/user_account_app_data_post-profile-stat`, 'GET'):{
                        resolve(db_user_account_app_data_post.getProfileStatPost(routesparameters.app_id, app_query, routesparameters.res));
                        break;
                    }
                    case route(`/bff/app_access/v1/server-db/user_account-password/${resource_id_string}`, 'PATCH', 'user_id', resource_id_get()):{
                        resolve(db_user_account.updatePassword(routesparameters.app_id, resource_id_get(), routesparameters.ip, routesparameters.user_agent, routesparameters.host, routesparameters.accept_language, app_query, routesparameters.body, routesparameters.res));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db/user_account/${resource_id_string}`, 'PATCH', 'user_id', resource_id_get()):
                    case route(`/bff/app_access/v1/server-db/user_account/${resource_id_string}`, 'PATCH', 'user_id', resource_id_get()):{
                        resolve(db_user_account.updateUserLocal(routesparameters.app_id, resource_id_get(), routesparameters.ip, routesparameters.user_agent, routesparameters.host, routesparameters.accept_language, app_query, routesparameters.body, routesparameters.res));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db/user_account/${resource_id_string}`, 'GET', 'user_id', resource_id_get()):
                    case route(`/bff/app_access/v1/server-db/user_account/${resource_id_string}`, 'GET', 'user_id', resource_id_get()):{
                        resolve(db_user_account.getUserByUserId(routesparameters.app_id, resource_id_get(), app_query, routesparameters.res));
                        break;
                    }
                    case route(`/bff/app_access/v1/server-db/user_account-common/${resource_id_string}`, 'PATCH', 'user_id', resource_id_get()):{
                        resolve(db_user_account.updateUserCommon(routesparameters.app_id, resource_id_get(), app_query, routesparameters.body, routesparameters.res));
                        break;
                    }
                    case route(`/bff/app_access/v1/server-db/user_account/${resource_id_string}`, 'DELETE', 'user_id', resource_id_get()):{
                        resolve(db_user_account.deleteUser(routesparameters.app_id, resource_id_get(), app_query, routesparameters.body, routesparameters.res));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db/user_account-profile-detail/${resource_id_string}`, 'GET'):
                    case route(`/bff/app_access/v1/server-db/user_account-profile-detail/${resource_id_string}`, 'GET'):{
                        resolve(db_user_account.getProfileDetail(routesparameters.app_id, resource_id_get(), app_query, routesparameters.res));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db/user_account_follow/${resource_id_string}`, 'POST', 'user_id', resource_id_get()):
                    case route(`/bff/app_access/v1/server-db/user_account_follow/${resource_id_string}`, 'POST', 'user_id', resource_id_get()):{
                        resolve(db_user_account.follow(routesparameters.app_id, resource_id_get(), routesparameters.body));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db/user_account_follow/${resource_id_string}`, 'DELETE', 'user_id', resource_id_get()):
                    case route(`/bff/app_access/v1/server-db/user_account_follow/${resource_id_string}`, 'DELETE', 'user_id', resource_id_get()):{
                        resolve(db_user_account.unfollow(routesparameters.app_id, resource_id_get(), routesparameters.body));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db/user_account_like/${resource_id_string}`, 'POST', 'user_id', resource_id_get()):
                    case route(`/bff/app_access/v1/server-db/user_account_like/${resource_id_string}`, 'POST', 'user_id', resource_id_get()):{
                        resolve(db_user_account.like(routesparameters.app_id, resource_id_get(), routesparameters.body));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db/user_account_like/${resource_id_string}`, 'DELETE', 'user_id', resource_id_get()):
                    case route(`/bff/app_access/v1/server-db/user_account_like/${resource_id_string}`, 'DELETE', 'user_id', resource_id_get()):{
                        resolve(db_user_account.unlike(routesparameters.app_id, resource_id_get(), routesparameters.body));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db/user_account_app/${resource_id_string}`, 'GET', 'user_id', resource_id_get()):
                    case route(`/bff/app_access/v1/server-db/user_account_app/${resource_id_string}`, 'GET', 'user_id', resource_id_get()):{
                        resolve(db_user_account_app.getUserAccountApp(routesparameters.app_id, resource_id_get()));
                        break;
                    }
                    case route(`/bff/app_access/v1/server-db/user_account_app-apps/${resource_id_string}`, 'GET', 'user_id', resource_id_get()):{
                        resolve(db_user_account_app.getUserAccountApps(routesparameters.app_id, resource_id_get()));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db/user_account_app/${resource_id_string}`, 'PATCH', 'user_id', resource_id_get()):
                    case route(`/bff/app_access/v1/server-db/user_account_app/${resource_id_string}`, 'PATCH', 'user_id', resource_id_get()):{
                        resolve(db_user_account_app.update(routesparameters.app_id, resource_id_get(), app_query, routesparameters.body));
                        break;
                    }
                    case route(`/bff/app_access/v1/server-db/user_account_app/${resource_id_string}`, 'DELETE', 'user_id', resource_id_get()):{
                        resolve(db_user_account_app.deleteUserAccountApp(routesparameters.app_id, resource_id_get(), app_query));
                        break;
                    }
                    case route(`/bff/app_access/v1/server-db/user_account_app_data_post-profile-detail/${resource_id_string}`, 'GET'):{
                        resolve(db_user_account_app_data_post.getProfileUserPostDetail(routesparameters.app_id, resource_id_get(), app_query, routesparameters.res));
                        break;
                    }
                    case route(`/bff/app_access/v1/server-db/user_account_app_data_post`, 'POST', 'user_id', routesparameters.body.user_account_id):{
                        resolve(db_user_account_app_data_post.createUserPost(routesparameters.app_id, app_query, routesparameters.body));
                        break;
                    }
                    case route(`/bff/app_access/v1/server-db/user_account_app_data_post/${resource_id_string}`, 'PUT', 'user_id', resource_id_get()):{
                        resolve(db_user_account_app_data_post.updateUserPost(routesparameters.app_id, resource_id_get(), app_query, routesparameters.body, routesparameters.res));
                        break;
                    }
                    case route(`/bff/app_access/v1/server-db/user_account_app_data_post/${resource_id_string}`, 'DELETE', 'user_id', resource_id_get()):{
                        resolve(db_user_account_app_data_post.deleteUserPost(routesparameters.app_id, resource_id_get(), app_query, routesparameters.res));
                        break;
                    }
                    case route(`/bff/app_access/v1/server-db/user_account_app_data_post_like/${resource_id_string}`, 'POST', 'user_id', resource_id_get()):{
                        resolve(db_user_account_app_data_post.like(routesparameters.app_id, resource_id_get(), routesparameters.body));
                        break;
                    }
                    case route(`/bff/app_access/v1/server-db/user_account_app_data_post_like/${resource_id_string}`, 'DELETE', 'user_id', resource_id_get()):{
                        resolve(db_user_account_app_data_post.unlike(routesparameters.app_id, resource_id_get(), routesparameters.body));
                        break;
                    }
                    case route(`/bff/admin/v1/server-socket/message`, 'POST'):{
                        resolve(socket.SocketSendAdmin(routesparameters.body));
                        break;
                    }
                    case route(`/bff/admin/v1/server-socket/socket-stat`, 'GET'):{
                        resolve(socket.ConnectedCount(app_query));
                        break;
                    }
                    case route(`/bff/admin/v1/server-socket/socket`, 'GET'):{
                        resolve(socket.ConnectedListAdmin(routesparameters.app_id, app_query, routesparameters.res));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db_admin/database-demo`, 'POST'):{
                        resolve(db_database.DemoInstall(routesparameters.app_id, app_query, routesparameters.body));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db_admin/database-demo`, 'DELETE'):{
                        resolve(db_database.DemoUninstall(routesparameters.app_id, app_query));
                        break;
                    }
                    case route(`/bff/admin/v1/app_admin/apps`, 'GET'):{
                        resolve(app.getAppsAdmin(routesparameters.app_id, app_query));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db_admin/apps/${resource_id_string}`, 'PUT'):{
                        resolve(db_app.updateAdmin(routesparameters.app_id, resource_id_get(), routesparameters.body));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db_admin/app_category`, 'GET'):{
                        resolve(db_app_category.getAppCategoryAdmin(routesparameters.app_id, app_query));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db_admin/app_log`, 'GET'):{
                        resolve(db_app_log.getLogsAdmin(routesparameters.app_id, app_query, routesparameters.res));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db_admin/app_log-stat`, 'GET'):{
                        resolve(db_app_log.getStatUniqueVisitorAdmin(routesparameters.app_id, app_query, routesparameters.res));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db_admin/app_role`, 'GET'):{
                        resolve(db_app_role.getAppRoleAdmin(routesparameters.app_id, app_query));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db_admin/user_account-stat`, 'GET'):{
                        resolve(db_user_account.getStatCountAdmin(routesparameters.app_id));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db_admin/user_account`, 'GET'):{
                        resolve(db_user_account.getUsersAdmin(routesparameters.app_id, app_query));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db_admin/user_account_logon`, 'GET'):{
                        resolve(db_user_account.getLogonAdmin(routesparameters.app_id, app_query));
                        break;
                    }
                    case route(`/bff/superadmin/v1/server-db_admin/user_account/${resource_id_string}`, 'PATCH'):{
                        resolve(db_user_account.updateAdmin(routesparameters.app_id, resource_id_get(), app_query, routesparameters.body, routesparameters.res));
                        break;
                    }
                    case route(`/bff/systemadmin/v1/server-socket/message`, 'POST'):{
                        resolve(socket.SocketSendSystemAdmin(routesparameters.body));
                        break;
                    }
                    case route(`/bff/systemadmin/v1/server-socket/socket`, 'GET'):{
                        resolve(socket.ConnectedListSystemadmin(routesparameters.app_id, app_query));
                        break;
                    }
                    case route(`/bff/admin/v1/server-config/config-apps/${resource_id_string}`, 'GET'):{
                        resolve(config.ConfigGetApp(routesparameters.app_id, resource_id_get(), app_query));
                        break;
                    }
                    case route(`/bff/admin/v1/server-config/config-apps-parameter/${resource_id_string}`, 'PATCH'):{
                        resolve(config.ConfigAppParameterUpdate(routesparameters.app_id, resource_id_get(), routesparameters.body));
                        break;
                    }
                    case route(`/bff/admin/v1/server-config/config/${resource_id_string}`, 'GET') && resource_id_get(true)=='APPS':{
                        resolve(config.ConfigGetApps(app_query));
                        break;
                    }
                    case route(`/bff/systemadmin/v1/server-config/config/${resource_id_string}`, 'GET'):{
                        resolve(config.ConfigFileGet(resource_id_get(true), app_query));
                        break;
                    }
                    case route(`/bff/systemadmin/v1/server-config/config/${resource_id_string}`, 'PUT'):{
                        resolve(config.ConfigFileSave(resource_id_get(true), routesparameters.body));
                        break;
                    }
                    case route(`/bff/systemadmin/v1/server/info`, 'GET'):{
                        resolve(info.Info());
                        break;
                    }
                    case route(`/bff/systemadmin/v1/server-db_admin/database-installation`, 'GET'):{
                        resolve(db_database.InstalledCheck(routesparameters.app_id));
                        break;
                    }
                    case route(`/bff/systemadmin/v1/server-db_admin/database-space`, 'GET'):{
                        resolve(db_database.InfoSpace(routesparameters.app_id));
                        break;
                    }
                    case route(`/bff/systemadmin/v1/server-db_admin/database-spacesum`, 'GET'):{
                        resolve(db_database.InfoSpaceSum(routesparameters.app_id));
                        break;
                    }
                    case route(`/bff/systemadmin/v1/server-db_admin/database`, 'GET'):{
                        resolve(db_database.Info(routesparameters.app_id));
                        break;
                    }
                    case route(`/bff/systemadmin/v1/server-db_admin/database`, 'POST'):{
                        resolve(db_database.Install(routesparameters.app_id, app_query));
                        break;
                    }
                    case route(`/bff/systemadmin/v1/server-db_admin/database`, 'DELETE'):{
                        resolve(db_database.Uninstall(routesparameters.app_id, app_query));
                        break;
                    }
                    case route(`/bff/systemadmin/v1/server-log/log`, 'GET'):{
                        resolve(log.getLogs(routesparameters.app_id, app_query));
                        break;
                    }
                    case route(`/bff/systemadmin/v1/server/info-statuscode`, 'GET'):{
                        resolve(log.getStatusCodes());
                        break;
                    }
                    case route(`/bff/systemadmin/v1/server-log/log-stat`, 'GET'):{
                        resolve(log.getLogStats(app_query));
                        break;
                    }
                    case route(`/bff/systemadmin/v1/server-log/log-files`, 'GET'):{
                        resolve(log.getFiles());
                        break;
                    }
                    case route(`/bff/socket/v1/server-socket/socket`, 'GET'):{
                        //EventSource uses GET method, should otherwise be POST
                        resolve(socket.SocketConnect(routesparameters.app_id, routesparameters.res.req.query.iam, routesparameters.ip, routesparameters.user_agent, routesparameters.accept_language, routesparameters.res));
                        break;
                    }
                    case route(`/bff/app_signup/v1/server-db/user_account-signup`, 'POST'):{
                        resolve(db_user_account.signup(routesparameters.app_id, routesparameters.ip, routesparameters.user_agent, routesparameters.accept_language, app_query, routesparameters.body, routesparameters.res));
                        break;
                    }
                    case route(`/bff/iam/v1/server-iam/systemadmin`, 'POST'):{
                        resolve(iam.AuthenticateSystemadmin(routesparameters.app_id, routesparameters.res.req.query.iam, routesparameters.authorization, routesparameters.ip, routesparameters.user_agent, routesparameters.accept_language, routesparameters.res));
                        break;
                    }
                    case route(`/bff/iam/v1/server-iam/user`, 'POST'):{
                        resolve(db_user_account.login(routesparameters.app_id, routesparameters.res.req.query.iam, routesparameters.ip, routesparameters.user_agent, routesparameters.accept_language, routesparameters.body, routesparameters.res));
                        break;
                    }
                    case route(`/bff/iam/v1/server-iam/provider/${resource_id_string}`, 'POST'):{
                        resolve(db_user_account.login_provider(routesparameters.app_id, routesparameters.res.req.query.iam, resource_id_get(), routesparameters.ip, routesparameters.user_agent, routesparameters.accept_language, app_query, routesparameters.body, routesparameters.res));
                        break;
                    }
                    case route(`/bff/app_data/v1/server-iam/user/logoff`, 'POST'):{
                        resolve(socket.ConnectedUpdate(routesparameters.app_id, routesparameters.res.req.query.iam, routesparameters.ip,routesparameters.user_agent, routesparameters.accept_language, routesparameters.res));
                        break;
                    }
                    //microservice routes
                    //changes URI to call microservices, syntax:
                    //[microservice protocol]://[microservice host]:[microservice port]/[service]/v[microservice API version configured for each service][resource]/[optional resource id]?[base64 encoded URI query];
                    case route(`/bff/app_data/v1/geolocation/ip`, 'GET') ||
                        (routesparameters.endpoint.startsWith('SERVER') && routesparameters.route_path=='/geolocation/ip'):{
                        if (config_service.ConfigGet('SERVICE_IAM', 'ENABLE_GEOLOCATION')=='1')
                            return resolve('');
                        else{
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
                            resolve(call_microservice(  routesparameters.app_id,
                                                `/geolocation/v${microservice_api_version('GEOLOCATION')}${routesparameters.route_path}`, 
                                                `${params.reduce((param_sum,param)=>param_sum += '&' + param)}`));
                        }
                    }
                    case route(`/bff/app_data/v1/geolocation/place`, 'GET'):{
                        resolve(call_microservice(  routesparameters.app_id,`/geolocation/v${microservice_api_version('GEOLOCATION')}${routesparameters.route_path}`, URI_query));
                        break;
                    }
                    case route(`/bff/app_data/v1/worldcities/city`, 'GET'):{
                        resolve(call_microservice(  routesparameters.app_id,
                                                    `/worldcities/v${microservice_api_version('WORLDCITIES')}${routesparameters.route_path}`, 
                                                    URI_query + `&limit=${config_service.ConfigGet('SERVICE_DB', 'LIMIT_LIST_SEARCH')}`));
                    }
                    case route(`/bff/app_data/v1/worldcities/city-random`, 'GET')||
                        (routesparameters.endpoint.startsWith('SERVER') && routesparameters.route_path=='/worldcities/city-random'):{
                        resolve(call_microservice(  routesparameters.app_id, `/worldcities/v${microservice_api_version('WORLDCITIES')}${routesparameters.route_path}`, URI_query));
                        break;
                    }
                    case route(`/bff/app_data/v1/worldcities/country/${resource_id_string}`, 'GET'):{
                        resolve(call_microservice(  routesparameters.app_id, `/worldcities/v${microservice_api_version('WORLDCITIES')}${routesparameters.route_path}`, URI_query));
                    }
                    case routesparameters.route_path=='/mail/sendemail' && routesparameters.endpoint.startsWith('SERVER'):{
                        //mail can only be sent from server
                        resolve(call_microservice(  routesparameters.app_id, `/mail/v${microservice_api_version('MAIL')}${routesparameters.route_path}`, URI_query));
                        break;
                    }
                    case route(`/bff/app_data/v1/pdf`, 'GET'):{
                        resolve(call_microservice(  routesparameters.app_id, `/pdf/v${microservice_api_version('PDF')}${routesparameters.route_path}`, URI_query));
                        break;
                    }
                    default:{
                        
                        if (resource_id_not_authorized){
                            routesparameters.res.statusMessage = `resource id not authorized`;
                            routesparameters.res.statusCode =401;
                        }
                        else{
                            routesparameters.res.statusMessage = `route not found: ${routesparameters.endpoint} ${routesparameters.service} ${URI_path} ${routesparameters.method}`;
                            routesparameters.res.statusCode =404;
                        }
                        reject('⛔');
                        break;
                    }
                }
            }
        } catch (error) {
            reject(error);
        }
    });
 };

/**
 * server start
 * @async
 */
const serverStart = async () =>{
    /**@type{import('./dbapi/object/database.js')} */
    const database = await import(`file://${process.cwd()}/server/dbapi/object/database.js`);
    /**@type{import('./config.service.js')} */
    const {InitConfig, ConfigGet} = await import(`file://${process.cwd()}/server/config.service.js`);
    /**@type{import('./socket.service.js')} */
    const {SocketCheckInterval} = await import(`file://${process.cwd()}/server/socket.service.js`);
    /**@type{import('./log.service.js')} */
    const {LogServerI, LogServerE} = await import(`file://${process.cwd()}/server/log.service.js`);

    const fs = await import('node:fs');
    const http = await import('node:http');
    const https = await import('node:https');

    process.env.TZ = 'UTC';
    process.on('uncaughtException', (err) =>{
        console.log(err);
        LogServerE('Process uncaughtException: ' + err.stack);
    });
    process.on('unhandledRejection', (reason) =>{
        console.log(reason);
        LogServerE('Process unhandledRejection: ' + reason);
    });
    try {
        await InitConfig();
        await database.Start();
        //Get express app with all configurations
        /**@type{import('../types.js').express}*/
        const app = await serverExpress();
        SocketCheckInterval();
        //START HTTP SERVER
        /**@ts-ignore*/
        http.createServer(app).listen(ConfigGet('SERVER', 'HTTP_PORT'), () => {
            LogServerI('HTTP Server up and running on PORT: ' + ConfigGet('SERVER', 'HTTP_PORT')).then(() => {
                null;
            });
        });
        if (ConfigGet('SERVER', 'HTTPS_ENABLE')=='1'){
            //START HTTPS SERVER
            //SSL files for HTTPS
            const HTTPS_KEY = await fs.promises.readFile(process.cwd() + ConfigGet('SERVER', 'HTTPS_KEY'), 'utf8');
            const HTTPS_CERT = await fs.promises.readFile(process.cwd() + ConfigGet('SERVER', 'HTTPS_CERT'), 'utf8');
            const options = {
                key: HTTPS_KEY.toString(),
                cert: HTTPS_CERT.toString()
            };
            /**@ts-ignore*/
            https.createServer(options,  app).listen(ConfigGet('SERVER', 'HTTPS_PORT'), () => {
                LogServerI('HTTPS Server up and running on PORT: ' + ConfigGet('SERVER', 'HTTPS_PORT')).then(() => {
                    null;
                });
            });            
        }
    } catch (/**@type{import('../types.js').error}*/error) {
        LogServerE('serverStart: ' + error.stack);
    }
    
};

export {COMMON, send_iso_error, getNumberValue, responsetime, serverRoutes, serverStart };