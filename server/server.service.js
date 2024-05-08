/** @module server */

// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

/**
 * Sends ISO 20022 error format
 * @param {Types.res} res 
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
 * so undefined and '' are avoided sending arguement to service functions
 * @param {Types.req_id_number} param
 * @returns {number|null}
 */
 const getNumberValue = param => (param==null||param===undefined||param==='')?null:Number(param);


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
 * ES6 object with properties using concise method syntax
 */
const COMMON = {
    app_filename(/**@type{string}*/module){
        const from_app_root = ('file:///' + process.cwd().replace(/\\/g, '/')).length;
        return module.substring(from_app_root);
    },
    app_function(/**@type{Types.error_stack}*/stack){
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
        /**@type {Types.error} */
        const e = new Error() || '';
        const frame = e.stack.split('\n')[2];
        const lineNumber = frame.split(':').reverse()[1];
        return lineNumber;
    }
};

/**
 * server Express
 * @async
 * @returns {Promise<Types.express>} app
 */
 const serverExpress = async () => {
    const {default:express} = await import('express');
    const {ConfigGet} = await import(`file://${process.cwd()}/server/config.service.js`);
    const {default:compression} = await import('compression');
    const {LogRequestE} = await import(`file://${process.cwd()}/server/log.service.js`);
    /**@type{Types.express} */
    const app = express();
    //
    //MIDDLEWARES
    //
    //use compression for better performance
    const shouldCompress = (/**@type{Types.req}*/req) => {
        //exclude broadcast messages using socket
        if (req.headers.accept == 'text/event-stream')
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
    // set JSON maximum size
    app.use(express.json({ limit: ConfigGet('SERVER', 'JSON_LIMIT') }));
    
    //ROUTES MIDDLEWARE
    //apps
    const { BFF_init, BFF_start, BFF_app, BFF_app_data, BFF_app_signup, BFF_app_access, BFF_admin, BFF_superadmin, BFF_systemadmin, BFF_socket, BFF_iam} = await import(`file://${process.cwd()}/server/bff.js`);
    //auth
    const iam = await import(`file://${process.cwd()}/server/iam.js`);
    
    //ROUTES 
    //logs EventSource and response when closed, authenticates request and will end request if not passing controls, 
    //sets headers, returns disallow for robots.txt and empty favicon.ico
    app.route('*').all                      (BFF_init);
    
    //redirects naked domain, http to https if enabled and to admin subdomain if first time, responds to SSL verification if enabled
    app.route('*').get                      (BFF_start);
    
    //REST API 
    //URI syntax implemented:
    //https://[subdomain].[domain]/[backend for frontend (bff)]/[role authorization]/version/[resource]/[optional resource id]?URI query
	//URI query: iam=[iam parameters base64 encoded]&parameters=[app parameters base64 encoded]
    app.route('/bff/app_data/v1*').all      (iam.AuthenticateDataToken, BFF_app_data);
    app.route('/bff/app_signup/v1*').post   (iam.AuthenticateDataTokenRegistration, BFF_app_signup);
    app.route('/bff/app_access/v1*').all    (iam.AuthenticateAccessToken, BFF_app_access);
    app.route('/bff/admin/v1*').all         (iam.AuthenticateAccessTokenAdmin, BFF_admin);    
    app.route('/bff/superadmin/v1*').put    (iam.AuthenticateAccessTokenSuperAdmin, BFF_superadmin);
    app.route('/bff/systemadmin/v1*').all   (iam.AuthenticateAccessTokenSystemAdmin, BFF_systemadmin);
    app.route('/bff/socket/v1*').get        (iam.AuthenticateSocket, BFF_socket);
    app.route('/bff/iam/v1*').post          (iam.AuthenticateIAM, BFF_iam);
    
    //app asset, common asset, info page, report and app
    app.route('*').get                      (BFF_app);
    
    //ERROR LOGGING
    app.use((/**@type{Types.error}*/err,/**@type{Types.req}*/req,/**@type{Types.res}*/res, /**@type{function}*/next) => {
        LogRequestE(req, res.statusCode, res.statusMessage, responsetime(res), err).then(() => {
            next();
        });
    });
    return app;
};
/**
 * server routes
 * @param {Types.routesparameters} routesparameters
 * @async
 */
 const serverRoutes = async (routesparameters) =>{
    
    //server iam object
    const iam = await import(`file://${process.cwd()}/server/iam.js`);

    //server app object
    const app = await import(`file://${process.cwd()}/apps/apps.js`);

    //server config object
    const config = await import(`file://${process.cwd()}/server/config.js`);

    //server info object
    const info = await import(`file://${process.cwd()}/server/info.js`);

    //server log object
    const log = await import(`file://${process.cwd()}/server/log.js`);

    //server socket object
    const socket = await import(`file://${process.cwd()}/server/socket.js`);

    //server db api object database
    const db_database = await import(`file://${process.cwd()}/server/dbapi/object/database.js`);
    //server db api object app
    const db_app = await import(`file://${process.cwd()}/server/dbapi/object/app.js`);
    //server db api object app_category
    const db_app_category = await import(`file://${process.cwd()}/server/dbapi/object/app_category.js`);
    //server db api  object app_log
    const db_app_log = await import(`file://${process.cwd()}/server/dbapi/object/app_log.js`);
    //server db api object app_object
    const db_app_object = await import(`file://${process.cwd()}/server/dbapi/object/app_object.js`);
    //server db api object app_role
    const db_app_role = await import(`file://${process.cwd()}/server/dbapi/object/app_role.js`);
    //server db api object app_setting
    const db_app_setting = await import(`file://${process.cwd()}/server/dbapi/object/app_setting.js`);
    //server db api object country
    const db_country = await import(`file://${process.cwd()}/server/dbapi/object/country.js`);
    //server db api object identity provider
    const db_identity_provider = await import(`file://${process.cwd()}/server/dbapi/object/identity_provider.js`);
    //server db api object locale
    const db_locale = await import(`file://${process.cwd()}/server/dbapi/object/locale.js`);
    
    //server db api object user account
    const db_user_account = await import(`file://${process.cwd()}/server/dbapi/object/user_account.js`);
    //server db api object user account app
    const db_user_account_app = await import(`file://${process.cwd()}/server/dbapi/object/user_account_app.js`);
    //server db api object user account app data post
    const db_user_account_app_data_post = await import(`file://${process.cwd()}/server/dbapi/object/user_account_app_data_post.js`);
    
    return new Promise((resolve, reject)=>{
        try {
            if (routesparameters.endpoint == 'APP' && routesparameters.service =='APP' && routesparameters.method == 'GET'){
                //App route for app asset, common asset, app info page, app report (using query) and app
                const URI_query = routesparameters.url.startsWith('/report')?routesparameters.url.substring(routesparameters.url.indexOf('?')):null;
                const app_query = URI_query?new URLSearchParams(URI_query):null;
                resolve(app.getAppMain(routesparameters.ip, routesparameters.host, routesparameters.user_agent, routesparameters.accept_language, routesparameters.url, app_query, routesparameters.res));
            }
            else{
                const resource_id_string = ':RESOURCE_ID';
                const URI_query = routesparameters.parameters;
                const URI_path = routesparameters.url.indexOf('?')>-1?routesparameters.url.substring(0, routesparameters.url.indexOf('?')):routesparameters.url;
                const app_query = URI_query?new URLSearchParams(URI_query):null;

                /**
                 * Returns resource id from URI path
                 * if resource id not requested for a route using resource id and last part of path is string then return null
                 * @returns {number|null}
                 */
                const resource_id_get = () => typeof URI_path.substring(URI_path.lastIndexOf('/') + 1) =='string'?
                                                null:
                                                    getNumberValue(URI_path.substring(URI_path.lastIndexOf('/') + 1));
                /**
                * 
                * @param {string} endpoint 
                * @param {string} service 
                * @param {string} uri_path_route
                * @param {string} method 
                * @returns {boolean}
                */
                const route = (endpoint, service, uri_path_route , method) =>
                                endpoint == routesparameters.endpoint && 
                                service == routesparameters.service && 
                                (uri_path_route.indexOf('/' + resource_id_string)>-1?uri_path_route. replace('/' + resource_id_string, URI_path.substring(URI_path.lastIndexOf('/'))):uri_path_route) == URI_path && 
                                method == routesparameters.method;
            
                
                //using switch (true) pattern
                switch (true){
                    case route('APP_DATA',      'APP',`/apps/${resource_id_string}`, 'GET'):{
                        resolve(app.getApps(routesparameters.app_id, resource_id_get(), app_query));
                        break;
                    }
                    case route('APP_SIGNUP',    'DB_API',   '/user_account/signup', 'POST'):{
                        resolve(db_user_account.signup(routesparameters.app_id, routesparameters.ip, routesparameters.user_agent, routesparameters.accept_language, app_query, routesparameters.body, routesparameters.res));
                        break;
                    }
                    case route('APP_DATA',      'SOCKET',   `/socket/connection/${resource_id_string}`, 'PATCH'):{
                        resolve(socket.ConnectedUpdate(resource_id_get(), app_query));
                        break;
                    }
                    case route('APP_DATA',      'SOCKET',   '/socket/connection/check', 'GET'):{
                        resolve(socket.ConnectedCheck(app_query));
                        break;
                    }
                    case route('APP_DATA',      'DB_API',   '/app_object', 'GET'):
                    case route('APP_DATA',      'DB_API',   '/app_object/admin', 'GET'):{
                        resolve(db_app_object.getObjects(routesparameters.app_id, app_query));
                        break;
                    }
                    case route('APP_DATA',      'DB_API',   '/country', 'GET'):{
                        resolve(db_country.getCountries(routesparameters.app_id, app_query));
                        break;
                    }
                    case route('APP_DATA',      'DB_API',   '/identity_provider', 'GET'):{
                        resolve(db_identity_provider.getIdentityProviders(routesparameters.app_id));
                        break;
                    }
                    case route('APP_DATA',      'DB_API',   '/locale', 'GET'):
                    case route('APP_DATA',      'DB_API',   '/locale/admin', 'GET'):{
                        resolve(db_locale.getLocales(routesparameters.app_id, app_query));
                        break;
                    }
                    case route('APP_DATA',      'DB_API',   '/app_settings', 'GET'):{
                        resolve(db_app_setting.getSettings(routesparameters.app_id, app_query));
                        break;
                    }
                    case route('APP_DATA',      'DB_API',   '/app_settings_display', 'GET'):{
                        resolve(db_app_setting.getSettingDisplayData(routesparameters.app_id, app_query));
                        break;
                    }
                    case route('APP_DATA',      'DB_API',   `/user_account/activate/${resource_id_string}`, 'PUT'):{
                        resolve(db_user_account.activate(routesparameters.app_id, resource_id_get(), routesparameters.ip, routesparameters.user_agent, routesparameters.accept_language, routesparameters.host, app_query, routesparameters.body, routesparameters.res));
                        break;
                    }
                    case route('APP_DATA',      'DB_API',   '/user_account/forgot', 'POST'):{
                        resolve(db_user_account.forgot(routesparameters.app_id, routesparameters.ip, routesparameters.user_agent, routesparameters.accept_language, routesparameters.host, routesparameters.body));
                        break;
                    }
                    case route('APP_DATA',      'DB_API',   '/user_account/profile/top', 'GET'):{
                        resolve(db_user_account.getProfileTop(routesparameters.app_id, app_query, routesparameters.res));
                        break;
                    }
                    case route('APP_DATA',      'DB_API',   `/user_account/profile/id/${resource_id_string}`, 'POST'):
                    case route('APP_DATA',      'DB_API',   '/user_account/profile/username', 'POST'):{
                        resolve(db_user_account.getProfile(routesparameters.app_id, resource_id_get(), routesparameters.ip, routesparameters.user_agent, app_query, routesparameters.body, routesparameters.res));
                        break;
                    }
                    case route('APP_DATA',      'DB_API',   '/user_account/profile/username/searchd', 'POST'):{
                        resolve(db_user_account.searchProfile(routesparameters.app_id, routesparameters.ip, routesparameters.user_agent, app_query, routesparameters.body));
                        break;
                    }
                    case route('APP_DATA',      'DB_API',   `/user_account_app_data_post/${resource_id_string}`, 'GET'):{
                        resolve(db_user_account_app_data_post.getUserPostsByUserId(routesparameters.app_id, resource_id_get(), app_query));
                        break;
                    }
                    case route('APP_DATA',      'DB_API',   `/user_account_app_data_post/profile/${resource_id_string}`, 'GET'):{
                        resolve(db_user_account_app_data_post.getProfileUserPost(routesparameters.app_id, resource_id_get(), app_query, routesparameters.res));
                        break;
                    }
                    case route('APP_DATA',      'DB_API',   `/user_account_app_data_post/profile/all/${resource_id_string}`, 'GET'):{
                        resolve(db_user_account_app_data_post.getProfileUserPosts(routesparameters.app_id, resource_id_get(), app_query, routesparameters.res));
                        break;
                    }
                    case route('APP_DATA',      'DB_API',   '/user_account_app_data_post/profile/top', 'GET'):{
                        resolve(db_user_account_app_data_post.getProfileTopPost(routesparameters.app_id, app_query, routesparameters.res));
                        break;
                    }
                    case route('APP_ACCESS',    'DB_API',   `/user_account/password/${resource_id_string}`, 'PATCH'):{
                        resolve(db_user_account.updatePassword(routesparameters.app_id, resource_id_get(), routesparameters.ip, routesparameters.user_agent, routesparameters.host, routesparameters.accept_language, app_query, routesparameters.body, routesparameters.res));
                        break;
                    }
                    case route('ADMIN',         'DB_API',   `/user_account/${resource_id_string}`, 'PATCH'):
                    case route('APP_ACCESS',    'DB_API',   `/user_account/${resource_id_string}`, 'PATCH'):{
                        resolve(db_user_account.updateUserLocal(routesparameters.app_id, resource_id_get(), routesparameters.ip, routesparameters.user_agent, routesparameters.host, routesparameters.accept_language, app_query, routesparameters.body, routesparameters.res));
                        break;
                    }
                    case route('ADMIN',         'DB_API',   `/user_account/${resource_id_string}`, 'GET'):
                    case route('APP_ACCESS',    'DB_API',   `/user_account/${resource_id_string}`, 'GET'):{
                        resolve(db_user_account.getUserByUserId(routesparameters.app_id, resource_id_get(), app_query, routesparameters.res));
                        break;
                    }
                    case route('APP_ACCESS',    'DB_API',   `/user_account/common/${resource_id_string}`, 'PATCH'):{
                        resolve(db_user_account.updateUserCommon(routesparameters.app_id, resource_id_get(), app_query, routesparameters.body, routesparameters.res));
                        break;
                    }
                    case route('APP_ACCESS',    'DB_API',   `/user_account/common/${resource_id_string}`, 'DELETE'):{
                        resolve(db_user_account.deleteUser(routesparameters.app_id, resource_id_get(), app_query, routesparameters.body, routesparameters.res));
                        break;
                    }
                    case route('ADMIN',         'DB_API',   `/user_account/profile/detail/${resource_id_string}`, 'GET'):
                    case route('APP_ACCESS',    'DB_API',   `/user_account/profile/detail/${resource_id_string}`, 'GET'):{
                        resolve(db_user_account.getProfileDetail(routesparameters.app_id, resource_id_get(), app_query, routesparameters.res));
                        break;
                    }
                    case route('APP_ACCESS',    'DB_API',   '/user_account/profile/username/searcha', 'POST'):{
                        resolve(db_user_account.searchProfile(routesparameters.app_id, routesparameters.ip, routesparameters.user_agent, app_query, routesparameters.body));
                        break;
                    }
                    case route('ADMIN',         'DB_API',   `/user_account_follow/${resource_id_string}`, 'POST'):
                    case route('APP_ACCESS',    'DB_API',   `/user_account_follow/${resource_id_string}`, 'POST'):{
                        resolve(db_user_account.follow(routesparameters.app_id, resource_id_get(), routesparameters.body));
                        break;
                    }
                    case route('ADMIN',         'DB_API',   `/user_account_follow/${resource_id_string}`, 'DELETE'):
                    case route('APP_ACCESS',    'DB_API',   `/user_account_follow/${resource_id_string}`, 'DELETE'):{
                        resolve(db_user_account.unfollow(routesparameters.app_id, resource_id_get(), routesparameters.body));
                        break;
                    }
                    case route('ADMIN',         'DB_API',   `/user_account_like/${resource_id_string}`, 'POST'):
                    case route('APP_ACCESS',    'DB_API',   `/user_account_like/${resource_id_string}`, 'POST'):{
                        resolve(db_user_account.like(routesparameters.app_id, resource_id_get(), routesparameters.body));
                        break;
                    }
                    case route('ADMIN',         'DB_API',   `/user_account_like/${resource_id_string}`, 'DELETE'):
                    case route('APP_ACCESS',    'DB_API',   `/user_account_like/${resource_id_string}`, 'DELETE'):{
                        resolve(db_user_account.unlike(routesparameters.app_id, resource_id_get(), routesparameters.body));
                        break;
                    }
                    case route('ADMIN',         'DB_API',   `/user_account_app/${resource_id_string}`, 'GET'):
                    case route('APP_ACCESS',    'DB_API',   `/user_account_app/${resource_id_string}`, 'GET'):{
                        resolve(db_user_account_app.getUserAccountApp(routesparameters.app_id, resource_id_get(), app_query));
                        break;
                    }
                    case route('APP_ACCESS',    'DB_API',   `/user_account_app/apps/${resource_id_string}`, 'GET'):{
                        resolve(db_user_account_app.getUserAccountApps(routesparameters.app_id, resource_id_get()));
                        break;
                    }
                    case route('ADMIN',         'DB_API',   `/user_account_app/${resource_id_string}`, 'PATCH'):
                    case route('APP_ACCESS',    'DB_API',   `/user_account_app/${resource_id_string}`, 'PATCH'):{
                        resolve(db_user_account_app.update(routesparameters.app_id, resource_id_get(), app_query, routesparameters.body));
                        break;
                    }
                    case route('APP_ACCESS',    'DB_API',   `/user_account_app/${resource_id_string}`, 'DELETE'):{
                        resolve(db_user_account_app.deleteUserAccountApp(routesparameters.app_id, resource_id_get(), app_query));
                        break;
                    }
                    case route('APP_ACCESS',    'DB_API',   `/user_account_app_data_post/profile/detail/${resource_id_string}`, 'GET'):{
                        resolve(db_user_account_app_data_post.getProfileUserPostDetail(routesparameters.app_id, resource_id_get(), app_query, routesparameters.res));
                        break;
                    }
                    case route('APP_ACCESS',    'DB_API',   '/user_account_app_data_post', 'POST'):{
                        resolve(db_user_account_app_data_post.createUserPost(routesparameters.app_id, app_query, routesparameters.body));
                        break;
                    }
                    case route('APP_ACCESS',    'DB_API',   `/user_account_app_data_post/${resource_id_string}`, 'PUT'):{
                        resolve(db_user_account_app_data_post.updateUserPost(routesparameters.app_id, resource_id_get(), app_query, routesparameters.body, routesparameters.res));
                        break;
                    }
                    case route('APP_ACCESS',    'DB_API',   `/user_account_app_data_post/${resource_id_string}`, 'DELETE'):{
                        resolve(db_user_account_app_data_post.deleteUserPost(routesparameters.app_id, resource_id_get(), app_query, routesparameters.res));
                        break;
                    }
                    case route('APP_ACCESS',    'DB_API',   `/user_account_app_data_post_like/${resource_id_string}`, 'POST'):{
                        resolve(db_user_account_app_data_post.like(routesparameters.app_id, resource_id_get(), routesparameters.body));
                        break;
                    }
                    case route('APP_ACCESS',    'DB_API',   `/user_account_app_data_post_like/${resource_id_string}`, 'DELETE'):{
                        resolve(db_user_account_app_data_post.unlike(routesparameters.app_id, resource_id_get(), routesparameters.body));
                        break;
                    }
                    case route('ADMIN',         'SOCKET',   '/socket/message/admin', 'POST'):{
                        resolve(socket.SocketSendAdmin(routesparameters.body));
                        break;
                    }
                    case route('ADMIN',         'SOCKET',   '/socket/connection/admin', 'GET'):{
                        resolve(socket.ConnectedListAdmin(routesparameters.app_id, app_query, routesparameters.res));
                        break;
                    }
                    case route('ADMIN',         'SOCKET',   '/socket/connection/admin/count', 'GET'):{
                        resolve(socket.ConnectedCount(app_query));
                        break;
                    }
                    case route('ADMIN',         'SERVER',   '/config/admin', 'GET'):{
                        resolve(config.ConfigGet(app_query));
                        break;
                    }
                    case route('ADMIN',         'CONFIG',   '/app', 'GET'):{
                        resolve(config.ConfigGetApp(routesparameters.app_id, app_query));
                        break;
                    }
                    case route('ADMIN',         'CONFIG',   `/app/parameter/${resource_id_string}`, 'PUT'):{
                        resolve(config.ConfigAppParameterUpdate(routesparameters.app_id, resource_id_get(), routesparameters.body));
                        break;
                    }
                    case route('ADMIN',         'DB_API',   '/admin/demo', 'POST'):{
                        resolve(db_database.DemoInstall(routesparameters.app_id, app_query, routesparameters.body));
                        break;
                    }
                    case route('ADMIN',         'DB_API',   '/admin/demo', 'DELETE'):{
                        resolve(db_database.DemoUninstall(routesparameters.app_id, app_query));
                        break;
                    }
                    case route('ADMIN',         'APP',      '/apps/admin', 'GET'):{
                        resolve(app.getAppsAdmin(routesparameters.app_id, app_query));
                        break;
                    }
                    case route('ADMIN',         'DB_API',   `/apps/admin/${resource_id_string}`, 'PUT'):{
                        resolve(db_app.updateAdmin(routesparameters.app_id, resource_id_get(), routesparameters.body));
                        break;
                    }
                    case route('ADMIN',         'DB_API',   '/app_category/admin', 'GET'):{
                        resolve(db_app_category.getAppCategoryAdmin(routesparameters.app_id, app_query));
                        break;
                    }
                    case route('ADMIN',         'DB_API',   '/app_log/admin', 'GET'):{
                        resolve(db_app_log.getLogsAdmin(routesparameters.app_id, app_query, routesparameters.res));
                        break;
                    }
                    case route('ADMIN',         'DB_API',   '/app_log/admin/stat/uniquevisitor', 'GET'):{
                        resolve(db_app_log.getStatUniqueVisitorAdmin(routesparameters.app_id, app_query, routesparameters.res));
                        break;
                    }
                    case route('ADMIN',         'DB_API',   '/app_role/admin', 'GET'):{
                        resolve(db_app_role.getAppRoleAdmin(routesparameters.app_id, app_query));
                        break;
                    }
                    case route('ADMIN',         'DB_API',   '/user_account/admin/count', 'GET'):{
                        resolve(db_user_account.getStatCountAdmin(routesparameters.app_id));
                        break;
                    }
                    
                    case route('ADMIN',         'DB_API',   '/user_account/admin', 'GET'):{
                        resolve(db_user_account.getUsersAdmin(routesparameters.app_id, app_query));
                        break;
                    }
                    case route('ADMIN',         'DB_API',   '/user_account_logon/admin', 'GET'):{
                        resolve(db_user_account.getLogonAdmin(routesparameters.app_id, app_query));
                        break;
                    }
                    case route('SUPERADMIN',    'DB_API',   `/user_account/admin/${resource_id_string}`, 'PATCH'):{
                        resolve(db_user_account.updateAdmin(routesparameters.app_id, resource_id_get(), app_query, routesparameters.body, routesparameters.res));
                        break;
                    }
                    case route('SYSTEMADMIN',   'SOCKET',   '/socket/message/systemadmin', 'POST'):{
                        resolve(socket.SocketSendSystemAdmin(routesparameters.body));
                        break;
                    }
                    case route('SYSTEMADMIN',   'SOCKET',   '/socket/connection/systemadmin', 'GET'):{
                        resolve(socket.ConnectedListSystemadmin(routesparameters.app_id, app_query));
                        break;
                    }
                    case route('SYSTEMADMIN',   'SOCKET',   `/socket/connection/systemadmin/${resource_id_string}`, 'PATCH'):{
                        resolve(socket.ConnectedUpdate(resource_id_get(), app_query));
                        break;
                    }
                    case route('SYSTEMADMIN',   'SERVER',   '/config/systemadmin', 'PUT'):{
                        resolve(config.ConfigSave(routesparameters.body));
                        break;
                    }
                    case route('SYSTEMADMIN',   'SERVER',   '/config/systemadmin', 'GET'):{
                        resolve(config.ConfigGet(app_query));
                        break;
                    }
                    case route('SYSTEMADMIN',   'SERVER',   '/config/systemadmin/apps', 'GET'):{
                        resolve(config.ConfigGetApps());
                        break;
                    }
                    case route('SYSTEMADMIN',   'SERVER',   '/config/systemadmin/saved', 'GET'):{
                        resolve(config.ConfigGetSaved(app_query));
                        break;
                    }
                    case route('SYSTEMADMIN',   'SERVER',   '/config/systemadmin/maintenance', 'GET'):{
                        resolve(config.ConfigMaintenanceGet());
                        break;
                    }
                    case route('SYSTEMADMIN',   'SERVER',   '/config/systemadmin/maintenance', 'PATCH'):{
                        resolve(config.ConfigMaintenanceSet(routesparameters.body));
                        break;
                    }
                    case route('SYSTEMADMIN',   'SERVER',   '/info', 'GET'):{
                        resolve(info.Info());
                        break;
                    }
                    case route('SYSTEMADMIN',   'DB_API',   '/systemadmin/dbinfo', 'GET'):{
                        resolve(db_database.Info(routesparameters.app_id));
                        break;
                    }
                    case route('SYSTEMADMIN',   'DB_API',   '/systemadmin/dbinfospace', 'GET'):{
                        resolve(db_database.InfoSpace(routesparameters.app_id));
                        break;
                    }
                    case route('SYSTEMADMIN',   'DB_API',   '/systemadmin/dbinfospacesum', 'GET'):{
                        resolve(db_database.InfoSpaceSum(routesparameters.app_id));
                        break;
                    }
                    case route('SYSTEMADMIN',   'DB_API',   '/systemadmin/install', 'POST'):{
                        resolve(db_database.Install(routesparameters.app_id, app_query));
                        break;
                    }
                    case route('SYSTEMADMIN',   'DB_API',   '/systemadmin/install', 'GET'):{
                        resolve(db_database.InstalledCheck(routesparameters.app_id));
                        break;
                    }
                    case route('SYSTEMADMIN',   'DB_API',   '/systemadmin/install', 'DELETE'):{
                        resolve(db_database.Uninstall(routesparameters.app_id, app_query));
                        break;
                    }
                    case route('SYSTEMADMIN',   'LOG',      '/log/parameters', 'GET'):{
                        resolve(log.getLogParameters());
                        break;
                    }
                    case route('SYSTEMADMIN',   'LOG',      '/log/logs', 'GET'):{
                        resolve(log.getLogs(routesparameters.app_id, app_query));
                        break;
                    }
                    case route('SYSTEMADMIN',   'LOG',      '/log/statuscode', 'GET'):{
                        resolve(log.getStatusCodes());
                        break;
                    }
                    case route('SYSTEMADMIN',   'LOG',      '/log/logs_stat', 'GET'):{
                        resolve(log.getLogStats(app_query));
                        break;
                    }
                    case route('SYSTEMADMIN',   'LOG',      '/log/files', 'GET'):{
                        resolve(log.getFiles());
                        break;
                    }
                    case route('SOCKET',        'SOCKET',   '/socket/connection/connect', 'GET'):{
                        //EventSource uses GET method, should otherwise be POST
                        resolve(socket.SocketConnect(routesparameters.app_id, routesparameters.ip, routesparameters.user_agent, app_query, routesparameters.res));
                        break;
                    }
                    case route('IAM',           'IAM',      '/systemadmin', 'POST'):{
                        resolve(iam.AuthenticateSystemadmin(routesparameters.app_id, routesparameters.ip, routesparameters.authorization, routesparameters.res));
                        break;
                    }
                    case route('IAM',           'IAM',      '/user', 'POST'):{
                        resolve(db_user_account.login(routesparameters.app_id, routesparameters.ip, routesparameters.user_agent, routesparameters.accept_language, app_query, routesparameters.body, routesparameters.res));
                        break;
                    }
                    case route('IAM',           'IAM',      `/provider/${resource_id_string}`, 'POST'):{
                        resolve(db_user_account.login_provider(routesparameters.app_id, resource_id_get(), routesparameters.ip, routesparameters.user_agent, app_query, routesparameters.body, routesparameters.res));
                        break;
                    }
                    default:{
                        routesparameters.res.statusMessage = 'invalid route :' + routesparameters.endpoint + '_' + routesparameters.service + '_' + URI_path + '_' + routesparameters.method;
                        routesparameters.res.statusCode =400;
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
    const database = await import(`file://${process.cwd()}/server/dbapi/object/database.js`);
    const {InitConfig, ConfigGet} = await import(`file://${process.cwd()}/server/config.service.js`);
    const {SocketCheckMaintenance} = await import(`file://${process.cwd()}/server/socket.service.js`);
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
        /**@type{Types.express}*/
        const app = await serverExpress();
        SocketCheckMaintenance();
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
    } catch (/**@type{Types.error}*/error) {
        LogServerE('serverStart: ' + error.stack);
    }
    
};

export {COMMON, send_iso_error, getNumberValue, responsetime, serverRoutes, serverStart };