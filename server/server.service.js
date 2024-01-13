/** @module server */

// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

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
    
    //ROUTES
    //apps
    const { BFF_init, BFF_start, BFF_app, BFF_app_data, BFF_app_signup, BFF_app_access, BFF_admin, BFF_superadmin, BFF_systemadmin, BFF_socket, BFF_iam} = await import(`file://${process.cwd()}/server/bff.js`);
    //auth
    const iam = await import(`file://${process.cwd()}/server/iam.js`);
    app.route('*').all                  (BFF_init);
    app.route('*').get                  (BFF_start);
    app.route('/bff/app_data').all      (iam.AuthenticateDataToken, BFF_app_data);
    app.route('/bff/app_signup').post   (iam.AuthenticateDataTokenRegistration, BFF_app_signup);
    app.route('/bff/app_access').all    (iam.AuthenticateAccessToken, BFF_app_access);
    app.route('/bff/admin').all         (iam.AuthenticateAccessTokenAdmin, BFF_admin);    
    app.route('/bff/superadmin').put    (iam.AuthenticateAccessTokenSuperAdmin, BFF_superadmin);
    app.route('/bff/systemadmin').all   (iam.AuthenticateAccessTokenSystemAdmin, BFF_systemadmin);
    app.route('/bff/socket').get        (iam.AuthenticateSocket, BFF_socket);
    app.route('/bff/iam').post          (iam.AuthenticateIAM, BFF_iam);
    app.route('*').get                  (BFF_app);
    
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
    //server db api object app_message
    const db_app_message = await import(`file://${process.cwd()}/server/dbapi/object/app_message.js`);
    //server db api object app_object
    const db_app_object = await import(`file://${process.cwd()}/server/dbapi/object/app_object.js`);
    //server db api object app_parameter
    const db_app_parameter = await import(`file://${process.cwd()}/server/dbapi/object/app_parameter.js`);
    //server db api object app_role
    const db_app_role = await import(`file://${process.cwd()}/server/dbapi/object/app_role.js`);
    //server db api object country
    const db_country = await import(`file://${process.cwd()}/server/dbapi/object/country.js`);
    //server db api object locale
    const db_locale = await import(`file://${process.cwd()}/server/dbapi/object/locale.js`);
    
    //server db api object parameter_type
    const db_parameter_type = await import(`file://${process.cwd()}/server/dbapi/object/parameter_type.js`);
    //server db api object user account
    const db_user_account = await import(`file://${process.cwd()}/server/dbapi/object/user_account.js`);
    //server db api object user account app
    const db_user_account_app = await import(`file://${process.cwd()}/server/dbapi/object/user_account_app.js`);
    //server db api object user account app data post
    const db_user_account_app_data_post = await import(`file://${process.cwd()}/server/dbapi/object/user_account_app_data_post.js`);
    /**@type{*} */
    let query;
    if (routesparameters.endpoint =='APP' && routesparameters.service =='APP')
        query = routesparameters.url?new URLSearchParams(routesparameters.url.substring(routesparameters.url.indexOf('?'))):null;
    else
        query = routesparameters.parameters?new URLSearchParams(routesparameters.parameters.substring(routesparameters.parameters.indexOf('?'))):null;
    const routeFunction = routesparameters.parameters?routesparameters.parameters.substring(0, routesparameters.parameters.indexOf('?')).toUpperCase():'';
    return new Promise((resolve, reject)=>{
        try {
            switch (routesparameters.endpoint + '_' + routesparameters.service + '_' + routeFunction + '_' + routesparameters.method){
                case 'APP_APP__GET':{
                    resolve(app.getAppMain(routesparameters.ip, routesparameters.host, routesparameters.user_agent, routesparameters.accept_language, routesparameters.url, query, routesparameters.res));
                    break;
                }
                case 'APP_DATA_APP_/APPS_GET':{
                    resolve(app.getApps(routesparameters.app_id, query));
                    break;
                }
                case 'APP_SIGNUP_DB_API_/USER_ACCOUNT/SIGNUP_POST':{
                    resolve(db_user_account.signup(routesparameters.app_id, routesparameters.ip, routesparameters.user_agent, routesparameters.accept_language, query, routesparameters.body, routesparameters.res));
                    break;
                }
                case 'APP_DATA_SOCKET_/SOCKET/CONNECTION_PATCH':{
                    resolve(socket.ConnectedUpdate(query));
                    break;
                }
                case 'APP_DATA_SOCKET_/SOCKET/CONNECTION/CHECK_GET':{
                    resolve(socket.ConnectedCheck(query));
                    break;
                }
                case 'APP_DATA_DB_API_/APPS_GET':{
                    resolve(db_app.getApp(routesparameters.app_id, query));
                    break;
                }
                case 'APP_DATA_DB_API_/APP_OBJECT_GET':
                case 'APP_DATA_DB_API_/APP_OBJECT/ADMIN_GET':{
                    resolve(db_app_object.getObjects(routesparameters.app_id, query));
                    break;
                }
                case 'APP_DATA_DB_API_/COUNTRY_GET':{
                    resolve(db_country.getCountries(routesparameters.app_id, query));
                    break;
                }
                case 'APP_DATA_DB_API_/LOCALE_GET':
                case 'APP_DATA_DB_API_/LOCALE/ADMIN_GET':{
                    resolve(db_locale.getLocales(routesparameters.app_id, query));
                    break;
                }
                case 'APP_DATA_DB_API_/MESSAGE_GET':{
                    resolve(db_app_message.getMessage(routesparameters.app_id, query));
                    break;
                }
                case 'APP_DATA_DB_API_/USER_ACCOUNT/ACTIVATE_PUT':{
                    resolve(db_user_account.activate(routesparameters.app_id, routesparameters.ip, routesparameters.user_agent, routesparameters.accept_language, routesparameters.host, query, routesparameters.body, routesparameters.res));
                    break;
                }
                case 'APP_DATA_DB_API_/USER_ACCOUNT/FORGOT_PUT':{
                    resolve(db_user_account.forgot(routesparameters.app_id, routesparameters.ip, routesparameters.user_agent, routesparameters.accept_language, routesparameters.host, routesparameters.body));
                    break;
                }
                case 'APP_DATA_DB_API_/USER_ACCOUNT/PROFILE/TOP_GET':{
                    resolve(db_user_account.getProfileTop(routesparameters.app_id, query, routesparameters.res));
                    break;
                }
                case 'APP_DATA_DB_API_/USER_ACCOUNT/PROFILE/ID_POST':
                case 'APP_DATA_DB_API_/USER_ACCOUNT/PROFILE/USERNAME_POST':{
                    resolve(db_user_account.getProfile(routesparameters.app_id, routesparameters.ip, routesparameters.user_agent, query, routesparameters.body, routesparameters.res));
                    break;
                }
                case 'APP_DATA_DB_API_/USER_ACCOUNT/PROFILE/USERNAME/SEARCHD_POST':{
                    resolve(db_user_account.searchProfile(routesparameters.app_id, routesparameters.ip, routesparameters.user_agent, query, routesparameters.body));
                    break;
                }
                case 'APP_DATA_DB_API_/USER_ACCOUNT_APP_DATA_POST/ALL_GET':{
                    resolve(db_user_account_app_data_post.getUserPostsByUserId(routesparameters.app_id, query));
                    break;
                }
                case 'APP_DATA_DB_API_/USER_ACCOUNT_APP_DATA_POST/PROFILE_GET':{
                    resolve(db_user_account_app_data_post.getProfileUserPost(routesparameters.app_id, query, routesparameters.res));
                    break;
                }
                case 'APP_DATA_DB_API_/USER_ACCOUNT_APP_DATA_POST/PROFILE/ALL_GET':{
                    resolve(db_user_account_app_data_post.getProfileUserPosts(routesparameters.app_id, query, routesparameters.res));
                    break;
                }
                case 'APP_DATA_DB_API_/USER_ACCOUNT_APP_DATA_POST/PROFILE/TOP_GET':{
                    resolve(db_user_account_app_data_post.getProfileTopPost(routesparameters.app_id, query, routesparameters.res));
                    break;
                }
                case 'APP_ACCESS_DB_API_/USER_ACCOUNT/PASSWORD_PUT':{
                    resolve(db_user_account.updatePassword(routesparameters.app_id, query, routesparameters.body, routesparameters.res));
                    break;
                }
                case 'APP_ACCESS_DB_API_/USER_ACCOUNT_PUT':{
                    resolve(db_user_account.updateUserLocal(routesparameters.app_id, routesparameters.ip, routesparameters.user_agent, routesparameters.host, routesparameters.accept_language, query, routesparameters.body, routesparameters.res));
                    break;
                }
                case 'APP_ACCESS_DB_API_/USER_ACCOUNT_GET':{
                    resolve(db_user_account.getUserByUserId(routesparameters.app_id, query, routesparameters.res));
                    break;
                }
                case 'APP_ACCESS_DB_API_/USER_ACCOUNT/COMMON_PUT':{
                    resolve(db_user_account.updateUserCommon(routesparameters.app_id, query, routesparameters.body, routesparameters.res));
                    break;
                }
                case 'APP_ACCESS_DB_API_/USER_ACCOUNT/COMMON_DELETE':{
                    resolve(db_user_account.deleteUser(routesparameters.app_id, query, routesparameters.body, routesparameters.res));
                    break;
                }
                case 'APP_ACCESS_DB_API_/USER_ACCOUNT/PROFILE/DETAIL_GET':{
                    resolve(db_user_account.getProfileDetail(routesparameters.app_id, query, routesparameters.res));
                    break;
                }
                case 'APP_ACCESS_DB_API_/USER_ACCOUNT/PROFILE/USERNAME/SEARCHA_POST':{
                    resolve(db_user_account.searchProfile(routesparameters.app_id, routesparameters.ip, routesparameters.user_agent, query, routesparameters.body));
                    break;
                }
                case 'APP_ACCESS_DB_API_/USER_ACCOUNT_FOLLOW_POST':{
                    resolve(db_user_account.follow(routesparameters.app_id, query, routesparameters.body));
                    break;
                }
                case 'APP_ACCESS_DB_API_/USER_ACCOUNT_FOLLOW_DELETE':{
                    resolve(db_user_account.unfollow(routesparameters.app_id, query, routesparameters.body));
                    break;
                }
                case 'APP_ACCESS_DB_API_/USER_ACCOUNT_LIKE_POST':{
                    resolve(db_user_account.like(routesparameters.app_id, query, routesparameters.body));
                    break;
                }
                case 'APP_ACCESS_DB_API_/USER_ACCOUNT_LIKE_DELETE':{
                    resolve(db_user_account.unlike(routesparameters.app_id, query, routesparameters.body));
                    break;
                }
                case 'APP_ACCESS_DB_API_/USER_ACCOUNT_APP_GET':{
                    resolve(db_user_account_app.getUserAccountApp(routesparameters.app_id, query));
                    break;
                }
                case 'APP_ACCESS_DB_API_/USER_ACCOUNT_APP/APPS_GET':{
                    resolve(db_user_account_app.getUserAccountApps(routesparameters.app_id, query));
                    break;
                }
                case 'APP_ACCESS_DB_API_/USER_ACCOUNT_APP_PATCH':{
                    resolve(db_user_account_app.updateUserAccountApp(routesparameters.app_id, query, routesparameters.body));
                    break;
                }
                case 'APP_ACCESS_DB_API_/USER_ACCOUNT_APP_DELETE':{
                    resolve(db_user_account_app.deleteUserAccountApp(routesparameters.app_id, query));
                    break;
                }
                case 'APP_ACCESS_DB_API_/USER_ACCOUNT_APP_DATA_POST/PROFILE/DETAIL_GET':{
                    resolve(db_user_account_app_data_post.getProfileUserPostDetail(routesparameters.app_id, query, routesparameters.res));
                    break;
                }
                case 'APP_ACCESS_DB_API_/USER_ACCOUNT_APP_DATA_POST_POST':{
                    resolve(db_user_account_app_data_post.createUserPost(routesparameters.app_id, query, routesparameters.body));
                    break;
                }
                case 'APP_ACCESS_DB_API_/USER_ACCOUNT_APP_DATA_POST_PUT':{
                    resolve(db_user_account_app_data_post.updateUserPost(routesparameters.app_id, query, routesparameters.body, routesparameters.res));
                    break;
                }
                case 'APP_ACCESS_DB_API_/USER_ACCOUNT_APP_DATA_POST_DELETE':{
                    resolve(db_user_account_app_data_post.deleteUserPost(routesparameters.app_id, query, routesparameters.res));
                    break;
                }
                case 'APP_ACCESS_DB_API_/USER_ACCOUNT_APP_DATA_POST_LIKE_POST':{
                    resolve(db_user_account_app_data_post.like(routesparameters.app_id, query, routesparameters.body));
                    break;
                }
                case 'APP_ACCESS_DB_API_/USER_ACCOUNT_APP_DATA_POST_LIKE_DELETE':{
                    resolve(db_user_account_app_data_post.unlike(routesparameters.app_id, query, routesparameters.body));
                    break;
                }
                case 'ADMIN_SOCKET_/SOCKET/MESSAGE/ADMIN_POST':{
                    resolve(socket.SocketSendAdmin(routesparameters.body));
                    break;
                }
                case 'ADMIN_SOCKET_/SOCKET/CONNECTION/ADMIN_GET':{
                    resolve(socket.ConnectedListAdmin(routesparameters.app_id, query, routesparameters.res));
                    break;
                }
                case 'ADMIN_SOCKET_/SOCKET/CONNECTION/ADMIN/COUNT_GET':{
                    resolve(socket.ConnectedCount(query));
                    break;
                }
                case 'ADMIN_SERVER_/CONFIG/ADMIN_GET':{
                    resolve(config.ConfigGet(query));
                    break;
                }
                case 'ADMIN_DB_API_/ADMIN/DEMO_POST':{
                    resolve(db_database.DemoInstall(routesparameters.app_id, query, routesparameters.body));
                    break;
                }
                case 'ADMIN_DB_API_/ADMIN/DEMO_DELETE':{
                    resolve(db_database.DemoUninstall(routesparameters.app_id, query));
                    break;
                }
                case 'ADMIN_APP_/APPS/ADMIN_GET':{
                    resolve(app.getAppsAdmin(routesparameters.app_id, query));
                    break;
                }
                case 'ADMIN_DB_API_/APPS/ADMIN_PUT':{
                    resolve(db_app.updateAdmin(routesparameters.app_id, query, routesparameters.body));
                    break;
                }
                case 'ADMIN_DB_API_/APP_CATEGORY/ADMIN_GET':{
                    resolve(db_app_category.getAppCategoryAdmin(routesparameters.app_id, query));
                    break;
                }
                case 'ADMIN_DB_API_/APP_LOG/ADMIN_GET':{
                    resolve(db_app_log.getLogsAdmin(routesparameters.app_id, query, routesparameters.res));
                    break;
                }
                case 'ADMIN_DB_API_/APP_LOG/ADMIN/STAT/UNIQUEVISITOR_GET':{
                    resolve(db_app_log.getStatUniqueVisitorAdmin(routesparameters.app_id, query, routesparameters.res));
                    break;
                }
                case 'ADMIN_DB_API_/APP_PARAMETER/ADMIN/ALL_GET':{
                    resolve(db_app_parameter.getParametersAllAdmin(routesparameters.app_id, query));
                    break;
                }
                case 'ADMIN_DB_API_/APP_PARAMETER/ADMIN_PUT':{
                    resolve(db_app_parameter.setParameter_admin(routesparameters.app_id, routesparameters.body));
                    break;
                }
                case 'ADMIN_DB_API_/APP_ROLE/ADMIN_GET':{
                    resolve(db_app_role.getAppRoleAdmin(routesparameters.app_id, query));
                    break;
                }
                case 'ADMIN_DB_API_/PARAMETER_TYPE/ADMIN_GET':{
                    resolve(db_parameter_type.getParameterTypeAdmin(routesparameters.app_id, query));
                    break;
                }
                case 'ADMIN_DB_API_/USER_ACCOUNT/ADMIN/COUNT_GET':{
                    resolve(db_user_account.getStatCountAdmin(routesparameters.app_id));
                    break;
                }
                case 'ADMIN_DB_API_/USER_ACCOUNT_APP_GET':{
                    resolve(db_user_account_app.getUserAccountApp(routesparameters.app_id, query));
                    break;
                }
                case 'ADMIN_DB_API_/USER_ACCOUNT_APP_PATCH':{
                    resolve(db_user_account_app.update(routesparameters.app_id, query, routesparameters.body));
                    break;
                }
                case 'ADMIN_DB_API_/USER_ACCOUNT/ADMIN_GET':{
                    resolve(db_user_account.getUsersAdmin(routesparameters.app_id, query));
                    break;
                }
                case 'ADMIN_DB_API_/USER_ACCOUNT_LOGON/ADMIN_GET':{
                    resolve(db_user_account.getLogonAdmin(routesparameters.app_id, query));
                    break;
                }
                case 'SUPERADMIN_DB_API_/USER_ACCOUNT/ADMIN_PUT':{
                    resolve(db_user_account.updateAdmin(routesparameters.app_id, query, routesparameters.body, routesparameters.res));
                    break;
                }
                case 'SYSTEMADMIN_SOCKET_/SOCKET/MESSAGE/SYSTEMADMIN_POST':{
                    resolve(socket.SocketSendSystemAdmin(routesparameters.body));
                    break;
                }
                case 'SYSTEMADMIN_SOCKET_/SOCKET/CONNECTION/SYSTEMADMIN_GET':{
                    resolve(socket.ConnectedListSystemadmin(routesparameters.app_id, query));
                    break;
                }
                case 'SYSTEMADMIN_SOCKET_/SOCKET/CONNECTION/SYSTEMADMIN_PATCH':{
                    resolve(socket.ConnectedUpdate(query));
                    break;
                }
                case 'SYSTEMADMIN_SERVER_/CONFIG/SYSTEMADMIN_PUT':{
                    resolve(config.ConfigSave(routesparameters.body));
                    break;
                }
                case 'SYSTEMADMIN_SERVER_/CONFIG/SYSTEMADMIN_GET':{
                    resolve(config.ConfigGet(query));
                    break;
                }
                case 'SYSTEMADMIN_SERVER_/CONFIG/SYSTEMADMIN/APPS_GET':{
                    resolve(config.ConfigGetApps());
                    break;
                }
                case 'SYSTEMADMIN_SERVER_/CONFIG/SYSTEMADMIN/SAVED_GET':{
                    resolve(config.ConfigGetSaved(query));
                    break;
                }
                case 'SYSTEMADMIN_SERVER_/CONFIG/SYSTEMADMIN/MAINTENANCE_GET':{
                    resolve(config.ConfigMaintenanceGet());
                    break;
                }
                case 'SYSTEMADMIN_SERVER_/CONFIG/SYSTEMADMIN/MAINTENANCE_PATCH':{
                    resolve(config.ConfigMaintenanceSet(routesparameters.body));
                    break;
                }
                case 'SYSTEMADMIN_SERVER_/INFO_GET':{
                    resolve(info.Info());
                    break;
                }
                case 'SYSTEMADMIN_DB_API_/SYSTEMADMIN/DBINFO_GET':{
                    resolve(db_database.Info(routesparameters.app_id));
                    break;
                }
                case 'SYSTEMADMIN_DB_API_/SYSTEMADMIN/DBINFOSPACE_GET':{
                    resolve(db_database.InfoSpace(routesparameters.app_id));
                    break;
                }
                case 'SYSTEMADMIN_DB_API_/SYSTEMADMIN/DBINFOSPACESUM_GET':{
                    resolve(db_database.InfoSpaceSum(routesparameters.app_id));
                    break;
                }
                case 'SYSTEMADMIN_DB_API_/SYSTEMADMIN/INSTALL_POST':{
                    resolve(db_database.Install(routesparameters.app_id, query));
                    break;
                }
                case 'SYSTEMADMIN_DB_API_/SYSTEMADMIN/INSTALL_GET':{
                    resolve(db_database.InstalledCheck(routesparameters.app_id));
                    break;
                }
                case 'SYSTEMADMIN_DB_API_/SYSTEMADMIN/INSTALL_DELETE':{
                    resolve(db_database.Uninstall(routesparameters.app_id, query));
                    break;
                }
                case 'SYSTEMADMIN_LOG_/LOG/PARAMETERS_GET':{
                    resolve(log.getLogParameters());
                    break;
                }
                case 'SYSTEMADMIN_LOG_/LOG/LOGS_GET':{
                    resolve(log.getLogs(routesparameters.app_id, query));
                    break;
                }
                case 'SYSTEMADMIN_LOG_/LOG/STATUSCODE_GET':{
                    resolve(log.getStatusCodes());
                    break;
                }
                case 'SYSTEMADMIN_LOG_/LOG/LOGS_STAT_GET':{
                    resolve(log.getLogStats(query));
                    break;
                }
                case 'SYSTEMADMIN_LOG_/LOG/FILES_GET':{
                    resolve(log.getFiles());
                    break;
                }
                case 'SOCKET_SOCKET_/SOCKET/CONNECTION/CONNECT_GET':{
                    resolve(socket.SocketConnect(routesparameters.app_id, routesparameters.ip, routesparameters.user_agent, query, routesparameters.res));
                    break;
                }
                case 'IAM_IAM_/SYSTEMADMIN_POST':{
                    resolve(iam.AuthenticateSystemadmin(routesparameters.app_id, routesparameters.ip, routesparameters.authorization, routesparameters.res));
                    break;
                }
                case 'IAM_IAM_/USER_POST':{
                    resolve(db_user_account.login(routesparameters.app_id, routesparameters.ip, routesparameters.user_agent, routesparameters.accept_language, query, routesparameters.body, routesparameters.res));
                    break;
                }
                case 'IAM_IAM_/PROVIDER_POST':{
                    resolve(db_user_account.login_provider(routesparameters.app_id, routesparameters.ip, routesparameters.user_agent, query, routesparameters.body, routesparameters.res));
                    break;
                }
                default:{
                    routesparameters.res.statusMessage = 'invalid route :' + routesparameters.endpoint + '_' + routesparameters.service + '_' + routeFunction + '_' + routesparameters.method;
                    routesparameters.res.statusCode =400;
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

export {COMMON, getNumberValue, responsetime, serverRoutes, serverStart };