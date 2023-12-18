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
 * server routes
 * @param {number} app_id
 * @param {string} service
 * @param {string} endpoint
 * @param {string} method
 * @param {string} ip
 * @param {string} user_agent
 * @param {string} accept_language
 * @param {string} authorization
 * @param {string} host
 * @param {string} parameters
 * @param {*} data
 * @param {Types.res} res
 * @async
 */
 const serverRoutes = async (app_id, service, endpoint, method, ip, user_agent, accept_language, authorization, host, parameters, data, res) =>{
    
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
    const query = new URLSearchParams(parameters.substring(parameters.indexOf('?')));
    const routeFunction = parameters.substring(0, parameters.indexOf('?')).toUpperCase();
    return new Promise((resolve, reject)=>{
        try {
            switch (endpoint + '_' + service + '_' + routeFunction + '_' + method){
                case 'IAM_IAM_/SYSTEMADMIN_POST':{
                    resolve(iam.AuthenticateSystemadmin(app_id, authorization, res));
                    break;
                }
                case 'IAM_IAM_/USER_POST':{
                    resolve(db_user_account.login(app_id, ip, user_agent, host, query, data, res));
                    break;
                }
                case 'IAM_IAM_/PROVIDER_POST':{
                    resolve(db_user_account.login_provider(app_id, ip, user_agent, query, data, res));
                    break;
                }
                case 'DATA_APP_/APPS_GET':{
                    resolve(app.getApps(app_id, query));
                    break;
                }
                case 'DATA_SIGNUP_DB_API_/USER_ACCOUNT/SIGNUP_POST':{
                    resolve(db_user_account.signup(app_id, host, query, data, res));
                    break;
                }
                case 'DATA_SOCKET_/SOCKET/CONNECTION_PATCH':{
                    resolve(socket.ConnectedUpdate(query));
                    break;
                }
                case 'DATA_SOCKET_/SOCKET/CONNECTION/CHECK_GET':{
                    resolve(socket.ConnectedCheck(query));
                    break;
                }
                case 'DATA_DB_API_/APPS_GET':{
                    resolve(db_app.getApp(app_id, query));
                    break;
                }
                case 'DATA_DB_API_/APP_OBJECT_GET':
                case 'DATA_DB_API_/APP_OBJECT/ADMIN_GET':{
                    resolve(db_app_object.getObjects(app_id, query));
                    break;
                }
                case 'DATA_DB_API_/COUNTRY_GET':{
                    resolve(db_country.getCountries(app_id, query));
                    break;
                }
                case 'DATA_DB_API_/LOCALE_GET':
                case 'DATA_DB_API_/LOCALE/ADMIN_GET':{
                    resolve(db_locale.getLocales(app_id, query));
                    break;
                }
                case 'DATA_DB_API_/MESSAGE_GET':{
                    resolve(db_app_message.getMessage(app_id, query));
                    break;
                }
                case 'DATA_DB_API_/USER_ACCOUNT/ACTIVATE_PUT':{
                    resolve(db_user_account.activate(app_id, ip, user_agent, accept_language, host, query, data, res));
                    break;
                }
                case 'DATA_DB_API_/USER_ACCOUNT/FORGOT_PUT':{
                    resolve(db_user_account.forgot(app_id, ip, user_agent, accept_language, host, data));
                    break;
                }
                case 'DATA_DB_API_/USER_ACCOUNT/PROFILE/TOP_GET':{
                    resolve(db_user_account.getProfileTop(app_id, query, res));
                    break;
                }
                case 'DATA_DB_API_/USER_ACCOUNT/PROFILE/ID_POST':
                case 'DATA_DB_API_/USER_ACCOUNT/PROFILE/USERNAME_POST':{
                    resolve(db_user_account.getProfile(app_id, ip, user_agent, query, data, res));
                    break;
                }
                case 'DATA_DB_API_/USER_ACCOUNT/PROFILE/USERNAME/SEARCHD_POST':{
                    resolve(db_user_account.searchProfile(app_id, ip, user_agent, query, data));
                    break;
                }
                case 'DATA_DB_API_/USER_ACCOUNT_APP_DATA_POST/ALL_GET':{
                    resolve(db_user_account_app_data_post.getUserPostsByUserId(app_id, query));
                    break;
                }
                case 'DATA_DB_API_/USER_ACCOUNT_APP_DATA_POST/PROFILE_GET':{
                    resolve(db_user_account_app_data_post.getProfileUserPost(app_id, query, res));
                    break;
                }
                case 'DATA_DB_API_/USER_ACCOUNT_APP_DATA_POST/PROFILE/ALL_GET':{
                    resolve(db_user_account_app_data_post.getProfileUserPosts(app_id, query, res));
                    break;
                }
                case 'DATA_DB_API_/USER_ACCOUNT_APP_DATA_POST/PROFILE/TOP_GET':{
                    resolve(db_user_account_app_data_post.getProfileTopPost(app_id, query, res));
                    break;
                }
                case 'ACCESS_DB_API_/USER_ACCOUNT/PASSWORD_PUT':{
                    resolve(db_user_account.updatePassword(app_id, query, data, res));
                    break;
                }
                case 'ACCESS_DB_API_/USER_ACCOUNT_PUT':{
                    resolve(db_user_account.updateUserLocal(app_id, ip, user_agent, host, accept_language, query, data, res));
                    break;
                }
                case 'ACCESS_DB_API_/USER_ACCOUNT_GET':{
                    resolve(db_user_account.getUserByUserId(app_id, query, res));
                    break;
                }
                case 'ACCESS_DB_API_/USER_ACCOUNT/COMMON_PUT':{
                    resolve(db_user_account.updateUserCommon(app_id, query, data, res));
                    break;
                }
                case 'ACCESS_DB_API_/USER_ACCOUNT/COMMON_DELETE':{
                    resolve(db_user_account.deleteUser(app_id, query, data, res));
                    break;
                }
                case 'ACCESS_DB_API_/USER_ACCOUNT/PROFILE/DETAIL_GET':{
                    resolve(db_user_account.getProfileDetail(app_id, query, res));
                    break;
                }
                case 'ACCESS_DB_API_/USER_ACCOUNT/PROFILE/USERNAME/SEARCHA_POST':{
                    resolve(db_user_account.searchProfile(app_id, ip, user_agent, query, data));
                    break;
                }
                case 'ACCESS_DB_API_/USER_ACCOUNT_FOLLOW_POST':{
                    resolve(db_user_account.follow(app_id, query, data));
                    break;
                }
                case 'ACCESS_DB_API_/USER_ACCOUNT_FOLLOW_DELETE':{
                    resolve(db_user_account.unfollow(app_id, query, data));
                    break;
                }
                case 'ACCESS_DB_API_/USER_ACCOUNT_LIKE_POST':{
                    resolve(db_user_account.like(app_id, query, data));
                    break;
                }
                case 'ACCESS_DB_API_/USER_ACCOUNT_LIKE_DELETE':{
                    resolve(db_user_account.unlike(app_id, query, data));
                    break;
                }
                case 'ACCESS_DB_API_/USER_ACCOUNT_APP_GET':{
                    resolve(db_user_account_app.getUserAccountApp(app_id, query));
                    break;
                }
                case 'ACCESS_DB_API_/USER_ACCOUNT_APP/APPS_GET':{
                    resolve(db_user_account_app.getUserAccountApps(app_id, query));
                    break;
                }
                case 'ACCESS_DB_API_/USER_ACCOUNT_APP_PATCH':{
                    resolve(db_user_account_app.updateUserAccountApp(app_id, query, data));
                    break;
                }
                case 'ACCESS_DB_API_/USER_ACCOUNT_APP_DELETE':{
                    resolve(db_user_account_app.deleteUserAccountApp(app_id, query));
                    break;
                }
                case 'ACCESS_DB_API_/USER_ACCOUNT_APP_DATA_POST/PROFILE/DETAIL_GET':{
                    resolve(db_user_account_app_data_post.getProfileUserPostDetail(app_id, query, res));
                    break;
                }
                case 'ACCESS_DB_API_/USER_ACCOUNT_APP_DATA_POST_POST':{
                    resolve(db_user_account_app_data_post.createUserPost(app_id, query, data));
                    break;
                }
                case 'ACCESS_DB_API_/USER_ACCOUNT_APP_DATA_POST_PUT':{
                    resolve(db_user_account_app_data_post.updateUserPost(app_id, query, data, res));
                    break;
                }
                case 'ACCESS_DB_API_/USER_ACCOUNT_APP_DATA_POST_DELETE':{
                    resolve(db_user_account_app_data_post.deleteUserPost(app_id, query, res));
                    break;
                }
                case 'ACCESS_DB_API_/USER_ACCOUNT_APP_DATA_POST_LIKE_POST':{
                    resolve(db_user_account_app_data_post.like(app_id, query, data));
                    break;
                }
                case 'ACCESS_DB_API_/USER_ACCOUNT_APP_DATA_POST_LIKE_DELETE':{
                    resolve(db_user_account_app_data_post.unlike(app_id, query, data));
                    break;
                }
                case 'SYSTEMADMIN_SOCKET_/SOCKET/MESSAGE/SYSTEMADMIN_POST':{
                    resolve(socket.SocketSendSystemAdmin(data));
                    break;
                }
                case 'SYSTEMADMIN_SOCKET_/SOCKET/CONNECTION/SYSTEMADMIN_GET':{
                    resolve(socket.ConnectedListSystemadmin(app_id, query));
                    break;
                }
                case 'SYSTEMADMIN_SOCKET_/SOCKET/CONNECTION/SYSTEMADMIN_PATCH':{
                    resolve(socket.ConnectedUpdate(query));
                    break;
                }
                case 'SYSTEMADMIN_SERVER_/CONFIG/SYSTEMADMIN_PUT':{
                    resolve(config.ConfigSave(data));
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
                    resolve(config.ConfigMaintenanceSet(data));
                    break;
                }
                case 'SYSTEMADMIN_SERVER_/INFO_GET':{
                    resolve(info.Info());
                    break;
                }
                case 'SYSTEMADMIN_DB_API_/SYSTEMADMIN/DBINFO_GET':{
                    resolve(db_database.Info(app_id));
                    break;
                }
                case 'SYSTEMADMIN_DB_API_/SYSTEMADMIN/DBINFOSPACE_GET':{
                    resolve(db_database.InfoSpace(app_id));
                    break;
                }
                case 'SYSTEMADMIN_DB_API_/SYSTEMADMIN/DBINFOSPACESUM_GET':{
                    resolve(db_database.InfoSpaceSum(app_id));
                    break;
                }
                case 'SYSTEMADMIN_DB_API_/SYSTEMADMIN/INSTALL_POST':{
                    resolve(db_database.Install(app_id, query));
                    break;
                }
                case 'SYSTEMADMIN_DB_API_/SYSTEMADMIN/INSTALL_GET':{
                    resolve(db_database.InstalledCheck(app_id));
                    break;
                }
                case 'SYSTEMADMIN_DB_API_/SYSTEMADMIN/INSTALL_DELETE':{
                    resolve(db_database.Uninstall(app_id, query));
                    break;
                }
                case 'SYSTEMADMIN_LOG_/LOG/PARAMETERS_GET':{
                    resolve(log.getLogParameters());
                    break;
                }
                case 'SYSTEMADMIN_LOG_/LOG/LOGS_GET':{
                    resolve(log.getLogs(app_id, query));
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
                case 'SUPERADMIN_DB_API_/USER_ACCOUNT/ADMIN_PUT':{
                    resolve(db_user_account.updateAdmin(app_id, query, data, res));
                    break;
                }
                case 'ADMIN_SOCKET_/SOCKET/MESSAGE/ADMIN_POST':{
                    resolve(socket.SocketSendAdmin(data));
                    break;
                }
                case 'ADMIN_SOCKET_/SOCKET/CONNECTION/ADMIN_GET':{
                    resolve(socket.ConnectedListAdmin(app_id, query, res));
                    break;
                }
                case 'ADMIN_SOCKET_/SOCKET/CONNECTION/ADMIN/COUNT_GET':{
                    resolve(socket.ConnectedCount(query));
                    break;
                }
                case 'ADMIN_SERVER_/CONFIG/ADMIN_GET':{
                    resolve(config.ConfigGet(query.get('config_group'), query.get('parameter')));
                    break;
                }
                case 'ADMIN_DB_API_/ADMIN/DEMO_POST':{
                    resolve(db_database.DemoInstall(app_id, query, data));
                    break;
                }
                case 'ADMIN_DB_API_/ADMIN/DEMO_DELETE':{
                    resolve(db_database.DemoUninstall(app_id, query));
                    break;
                }
                case 'ADMIN_APP_/APPS/ADMIN_GET':{
                    resolve(app.getAppsAdmin(app_id, query));
                    break;
                }
                case 'ADMIN_DB_API_/APPS/ADMIN_PUT':{
                    resolve(db_app.updateAdmin(app_id, query, data));
                    break;
                }
                case 'ADMIN_DB_API_/APP_CATEGORY/ADMIN_GET':{
                    resolve(db_app_category.getAppCategoryAdmin(app_id, query));
                    break;
                }
                case 'ADMIN_DB_API_/APP_LOG/ADMIN_GET':{
                    resolve(db_app_log.getLogsAdmin(app_id, query, res));
                    break;
                }
                case 'ADMIN_DB_API_/APP_LOG/ADMIN/STAT/UNIQUEVISITOR_GET':{
                    resolve(db_app_log.getStatUniqueVisitorAdmin(app_id, query, res));
                    break;
                }
                case 'ADMIN_DB_API_/APP_PARAMETER/ADMIN/ALL_GET':{
                    resolve(db_app_parameter.getParametersAllAdmin(app_id, query));
                    break;
                }
                case 'ADMIN_DB_API_/APP_PARAMETER/ADMIN_PUT':{
                    resolve(db_app_parameter.setParameter_admin(app_id, data));
                    break;
                }
                case 'ADMIN_DB_API_/APP_ROLE/ADMIN_GET':{
                    resolve(db_app_role.getAppRoleAdmin(app_id, query));
                    break;
                }
                case 'ADMIN_DB_API_/PARAMETER_TYPE/ADMIN_GET':{
                    resolve(db_parameter_type.getParameterTypeAdmin(app_id, query));
                    break;
                }
                case 'ADMIN_DB_API_/USER_ACCOUNT/ADMIN/COUNT_GET':{
                    resolve(db_user_account.getStatCountAdmin(app_id));
                    break;
                }
                case 'ADMIN_DB_API_/USER_ACCOUNT_APP_GET':{
                    resolve(db_user_account_app.getUserAccountApp(app_id, query));
                    break;
                }
                case 'ADMIN_DB_API_/USER_ACCOUNT_APP_PATCH':{
                    resolve(db_user_account_app.update(app_id, query, data));
                    break;
                }
                case 'ADMIN_DB_API_/USER_ACCOUNT/ADMIN_GET':{
                    resolve(db_user_account.getUsersAdmin(app_id, query));
                    break;
                }
                case 'ADMIN_DB_API_/USER_ACCOUNT_LOGON/ADMIN_GET':{
                    resolve(db_user_account.getLogonAdmin(app_id, query));
                    break;
                }
                case 'SOCKET_SOCKET_/SOCKET/CONNECTION/CONNECT_GET':{
                    resolve(socket.SocketConnect(app_id, ip, user_agent, query, res));
                    break;
                }
                default:{
                    res.statusMessage = 'invalid route :' + endpoint + '_' + service + '_' + routeFunction + '_' + method;
                    res.statusCode =400;
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
    const {serverExpress, serverExpressLogError} = await import(`file://${process.cwd()}/server/express/server.js`);
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
        const {serverExpressApps} = await import(`file://${process.cwd()}/server/express/apps.js`);
        await serverExpressApps(app);
        serverExpressLogError(app);
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

export {COMMON, getNumberValue, serverRoutes, serverStart };