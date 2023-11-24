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
 * Info
 * @async
 * @param {Types.callBack} callBack
 */
const Info = async (callBack) => {
    const os = await import('node:os');
    const os_json = {
                    'hostname': os.hostname(),
                    'platform': os.platform(),
                    'type': os.type(),
                    'release': os.release(),
                    'cpus': os.cpus(),
                    'arch': os.arch(),
                    'freemem': os.freemem(),
                    'totalmem': os.totalmem(),
                    'homedir': os.homedir(),
                    'tmpdir': os.tmpdir(),
                    'uptime': os.uptime(),
                    'userinfo': os.userInfo(),
                    'version': os.version()
                    };
    const process_json = { 
                            'memoryusage_rss' : process.memoryUsage().rss,
                            'memoryusage_heaptotal' : process.memoryUsage().heapTotal,
                            'memoryusage_heapused' : process.memoryUsage().heapUsed,
                            'memoryusage_external' : process.memoryUsage().external,
                            'memoryusage_arraybuffers' : process.memoryUsage().arrayBuffers,
                            'uptime' : process.uptime(),
                            'version' : process.version,
                            'path' : process.cwd(),
                            'start_arg_0' : process.argv[0],
                            'start_arg_1' : process.argv[1]
                        };
    callBack(null, {
                    os: os_json,
                    process: process_json
                    });
};
/**
 * Get value from path with query string
 * @param {string} parameters
 * @param {string} param
 * @param {1|null} type     - 1 = number
 * @returns {string|number|null}
 */
 const get_query_value = (parameters, param, type=null) => {
    const query_parameters = parameters.split('?')[1].split('&');
    const value_row = query_parameters.filter(query=>query.toLowerCase().startsWith(param));
    if (value_row.length == 0)
        return null;
    else{
        if (type==1){
            //Number
            if (value_row[0].split('=')[1]=='')
                return null;
            else
                return Number(value_row[0].split('=')[1]);
        }
        else
            return value_row[0].split('=')[1];
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
    //broadcast
    const {BroadcastSendAdmin, ConnectedCount, ConnectedCheck, BroadcastSendSystemAdmin, ConnectedList, ConnectedUpdate, BroadcastConnect} = await import(`file://${process.cwd()}/server/broadcast/broadcast.service.js`);

    //server auth object
    const auth = await import(`file://${process.cwd()}/server/auth.js`);

    //server config object
    const config = await import(`file://${process.cwd()}/server/config.js`);

    //server db api object database
    const database = await import(`file://${process.cwd()}/server/dbapi/object/database.js`);
    //server db api object app
    const app = await import(`file://${process.cwd()}/server/dbapi/object/app.js`);
    //server db api object app_category
    const app_category = await import(`file://${process.cwd()}/server/dbapi/object/app_category.js`);
    //server db api  object app_log
    const app_log = await import(`file://${process.cwd()}/server/dbapi/object/app_log.js`);
    //server db api object app_object
    const app_object = await import(`file://${process.cwd()}/server/dbapi/object/app_object.js`);
    //server db api object app_parameter
    const app_parameter = await import(`file://${process.cwd()}/server/dbapi/object/app_parameter.js`);
    //server db api object app_role
    const app_role = await import(`file://${process.cwd()}/server/dbapi/object/app_role.js`);
    //server db api object country
    const country = await import(`file://${process.cwd()}/server/dbapi/object/country.js`);
    //server db api object locale
    const locale = await import(`file://${process.cwd()}/server/dbapi/object/locale.js`);
    //server db api object message
    const message = await import(`file://${process.cwd()}/server/dbapi/object/message.js`);
    //server db api object parameter_type
    const parameter_type = await import(`file://${process.cwd()}/server/dbapi/object/parameter_type.js`);
    //server db api object user account
    const user_account = await import(`file://${process.cwd()}/server/dbapi/object/user_account.js`);
    //server db api object user account app
    const user_account_app = await import(`file://${process.cwd()}/server/dbapi/object/user_account_app.js`);
    //server db api object user account app setting
    const user_account_app_setting = await import(`file://${process.cwd()}/server/dbapi/object/user_account_app_setting.js`);
    
    //server log
    const {getLogParameters, getLogs, getStatusCodes, getLogsStats, getFiles} = await import(`file://${process.cwd()}/server/log/log.service.js`);
    
    /**@type{*} */
    const query = new URLSearchParams(parameters.substring(parameters.indexOf('?')));
    const routeFunction = parameters.substring(0, parameters.indexOf('?')).toUpperCase();
    return new Promise((resolve, reject)=>{
        try {
            switch (endpoint + '_' + service + '_' + routeFunction + '_' + method){
                case 'DATA_LOGIN_DB_API_/USER_ACCOUNT/LOGIN_PUT':{
                    resolve(user_account.login(app_id, ip, user_agent, host, query, data, res));
                    break;
                }
                case 'DATA_LOGIN_DB_API_/USER_ACCOUNT/PROVIDER_PUT':{
                    resolve(user_account.login_provider(app_id, ip, user_agent, host, query, data));
                    break;
                }
                case 'DATA_SIGNUP_DB_API_/USER_ACCOUNT/SIGNUP_POST':{
                    resolve(user_account.signup(app_id, host, query, data));
                    break;
                }
                case 'DATA_BROADCAST_/BROADCAST/CONNECTION_PATCH':{
                    ConnectedUpdate(getNumberValue(query.get('client_id')), getNumberValue(query.get('user_account_logon_user_account_id')), 
                                    getNumberValue(query.get('system_admin')), getNumberValue(query.get('identity_provider_id')), query.get('latitude'), query.get('longitude'),
                                            (/**@type{Types.error}*/err, /**@type{void}*/result) =>{
                        resolve(err ?? result);
                    });
                    break;
                }
                case 'DATA_BROADCAST_/BROADCAST/CONNECTION/CHECK_GET':{
                    ConnectedCheck(getNumberValue(query.get('user_account_id')), (/**@type{Types.error}*/err, /**@type{boolean}*/result_connected)=>{
                        resolve({online: result_connected});
                    });
                    break;
                }
                case 'DATA_DB_API_/APPS_GET':{
                    resolve(app.getApp(app_id, query));
                    break;
                }
                case 'DATA_DB_API_/APP_OBJECT_GET':
                case 'DATA_DB_API_/APP_OBJECT/ADMIN_GET':{
                    resolve(app_object.getObjects(app_id, query));
                    break;
                }
                case 'DATA_DB_API_/COUNTRY_GET':{
                    resolve(country.getCountries(app_id, query));
                    break;
                }
                case 'DATA_DB_API_/LOCALE_GET':
                case 'DATA_DB_API_/LOCALE/ADMIN_GET':{
                    resolve(locale.getLocales(app_id, query));
                    break;
                }
                case 'DATA_DB_API_/MESSAGE_GET':{
                    resolve(message.getMessage(app_id, query));
                    break;
                }
                case 'DATA_DB_API_/USER_ACCOUNT/ACTIVATE_PUT':{
                    resolve(user_account.activate(app_id, ip, user_agent, accept_language, host, query, data));
                    break;
                }
                case 'DATA_DB_API_/USER_ACCOUNT/FORGOT_PUT':{
                    resolve(user_account.forgot(app_id, ip, user_agent, accept_language, host, data));
                    break;
                }
                case 'DATA_DB_API_/USER_ACCOUNT/PROFILE/TOP_GET':{
                    resolve(user_account.getProfileTop(app_id, query));
                    break;
                }
                case 'DATA_DB_API_/USER_ACCOUNT/PROFILE/ID_POST':
                case 'DATA_DB_API_/USER_ACCOUNT/PROFILE/USERNAME_POST':{
                    resolve(user_account.getProfile(app_id, ip, user_agent, query, data));
                    break;
                }
                case 'DATA_DB_API_/USER_ACCOUNT/PROFILE/USERNAME/SEARCHD_POST':{
                    resolve(user_account.searchProfile(app_id, ip, user_agent, query, data));
                    break;
                }
                case 'DATA_DB_API_/USER_ACCOUNT_APP_SETTING/ALL_GET':{
                    resolve(user_account_app_setting.getUserSettingByUserId(app_id, query));
                    break;
                }
                case 'DATA_DB_API_/USER_ACCOUNT_APP_SETTING/PROFILE_GET':{
                    resolve(user_account_app_setting.getProfileUserSetting(app_id, query));
                    break;
                }
                case 'DATA_DB_API_/USER_ACCOUNT_APP_SETTING/PROFILE/ALL_GET':{
                    resolve(user_account_app_setting.getProfileUserSettings(app_id, query));
                    break;
                }
                case 'DATA_DB_API_/USER_ACCOUNT_APP_SETTING/PROFILE/TOP_GET':{
                    resolve(user_account_app_setting.getProfileTopSetting(app_id, query));
                    break;
                }
                case 'DATA_DB_API_/USER_ACCOUNT_APP_SETTING_VIEW_POST':{
                    resolve(user_account_app_setting.insertUserSettingView(app_id, ip, user_agent, data));
                    break;
                }
                case 'SYSTEMADMIN_BROADCAST_/BROADCAST/MESSAGE/SYSTEMADMIN_POST':{
                    BroadcastSendSystemAdmin(getNumberValue(data.app_id), getNumberValue(data.client_id), getNumberValue(data.client_id_current),
                        data.broadcast_type, data.broadcast_message, (/**@type{Types.error}*/err, /**@type{object}*/result) =>{
                        resolve(result);
                    });
                    break;
                }
                case 'SYSTEMADMIN_BROADCAST_/BROADCAST/CONNECTION/SYSTEMADMIN_GET':{
                    ConnectedList(  app_id, getNumberValue(query.get('select_app_id')), getNumberValue(query.get('limit')), getNumberValue(query.get('year')), 
                                    getNumberValue(query.get('month')), query.get('order_by'), query.get('sort'),  1, 
                                    (/**@type{Types.error}*/err, /**@type{Types.broadcast_connect_list_no_res[]} */result) => {
                        if (err)
                            reject({data: err});
                        else{
                            if (result && result.length>0)
                                resolve(result);
                            else
                                reject('Record not found');
                        }
                    });
                    break;
                }
                case 'SYSTEMADMIN_BROADCAST_/BROADCAST/CONNECTION/SYSTEMADMIN_PATCH':{
                    ConnectedUpdate(getNumberValue(query.get('client_id')), getNumberValue(query.get('user_account_logon_user_account_id')), getNumberValue(query.get('system_admin')), 
                                    getNumberValue(query.get('identity_provider_id')), query.get('latitude'), query.get('longitude'),
                                    (/**@type{Types.error}*/err, /**@type{void}*/result) =>{
                        resolve(err ?? result);
                    });
                    break;
                }
                case 'SYSTEMADMIN_SERVER_/CONFIG/SYSTEMADMIN_PUT':{
                    resolve(config.ConfigSave(getNumberValue(data.config_no), data.config_json, false));
                    break;
                }
                case 'SYSTEMADMIN_SERVER_/CONFIG/SYSTEMADMIN_GET':{
                    resolve(config.ConfigGet(query.get('config_group'), query.get('parameter')));
                    break;
                }
                case 'SYSTEMADMIN_SERVER_/CONFIG/SYSTEMADMIN/APPS_GET':{
                    resolve(config.ConfigGetApps());
                    break;
                }
                case 'SYSTEMADMIN_SERVER_/CONFIG/SYSTEMADMIN/SAVED_GET':{
                    resolve(config.ConfigGetSaved(getNumberValue(query.get('config_type_no'))));
                    break;
                }
                case 'SYSTEMADMIN_SERVER_/CONFIG/SYSTEMADMIN/MAINTENANCE_GET':{
                    resolve(config.ConfigMaintenanceGet());
                    break;
                }
                case 'SYSTEMADMIN_SERVER_/CONFIG/SYSTEMADMIN/MAINTENANCE_PATCH':{
                    resolve(config.ConfigMaintenanceSet(data.value));
                    break;
                }
                case 'SYSTEMADMIN_SERVER_/INFO_GET':{
                    Info((err, result)=>{
                        if (err)
                            reject(err);
                        else
                            resolve(result);
                    });
                    break;
                }
                case 'SYSTEMADMIN_DB_API_/SYSTEMADMIN/DBINFO_GET':{
                    resolve(database.Info(app_id));
                    break;
                }
                case 'SYSTEMADMIN_DB_API_/SYSTEMADMIN/DBINFOSPACE_GET':{
                    resolve(database.InfoSpace(app_id));
                    break;
                }
                case 'SYSTEMADMIN_DB_API_/SYSTEMADMIN/DBINFOSPACESUM_GET':{
                    resolve(database.InfoSpaceSum(app_id));
                    break;
                }
                case 'SYSTEMADMIN_DB_API_/SYSTEMADMIN/INSTALL_POST':{
                    resolve(database.Install(app_id, query));
                    break;
                }
                case 'SYSTEMADMIN_DB_API_/SYSTEMADMIN/INSTALL_GET':{
                    resolve(database.InstalledCheck(app_id));
                    break;
                }
                case 'SYSTEMADMIN_DB_API_/SYSTEMADMIN/INSTALL_DELETE':{
                    resolve(database.Uninstall(app_id));
                    break;
                }
                case 'SYSTEMADMIN_LOG_/LOG/PARAMETERS_GET':{
                    getLogParameters(app_id, (/**@type{Types.error}*/err, /**@type{Types.admin_log_parameters}*/result) =>{
                        if (err)
                            reject(err);
                        else
                            resolve(result);
                    });
                    break;
                }
                case 'SYSTEMADMIN_LOG_/LOG/LOGS_GET':{
                    /**@type{Types.admin_log_data_parameters} */
                    const data = {	app_id:			app_id,
                                    select_app_id:	getNumberValue(query.get('select_app_id')),
                                    logscope:		query.get('logscope'),
                                    loglevel:		query.get('loglevel'),
                                    search:			query.get('search'),
                                    sort:			query.get('sort'),
                                    order_by:		query.get('order_by'),
                                    year: 			query.get('year').toString(),
                                    month:			query.get('month').toString(),
                                    day:			query.get('day'),
                                    };
                    getLogs(app_id, data, (/**@type{Types.error}*/err, /**@type{*}*/result) =>{
                        if (err)
                            reject(err);
                        else{
                            if (result.length>0)
                                resolve(result);
                            else{
                                reject('Record not found');
                            }
                        }
                    });
                    break;
                }
                case 'SYSTEMADMIN_LOG_/LOG/STATUSCODE_GET':{
                    getStatusCodes().then((/**@type{object}*/status_codes)=>{
                        resolve({
                            status_codes: status_codes
                        });
                    });
                    break;
                }
                case 'SYSTEMADMIN_LOG_/LOG/LOGS_STAT_GET':{
                    /**@type{Types.log_parameter_getLogStats} */
                    const data = {	app_id:			getNumberValue(query.get('select_app_id')),
                                    code:			getNumberValue(query.get('code')),
                                    year: 			getNumberValue(query.get('year')) ?? new Date().getFullYear(),
                                    month:			getNumberValue(query.get('month')) ?? new Date().getMonth() +1
                                    };
                    getLogsStats(app_id, data, (/**@type{Types.error}*/err, /**@type{Types.log_parameter_getLogStats[]}*/result) =>{
                    if (err)
                        reject(err);
                    else{
                        if (result.length>0)
                            resolve(result);
                        else{
                            reject('Record not found');
                        }
                    }
                    });
                    break;
                }
                case 'SYSTEMADMIN_LOG_/LOG/FILES_GET':{
                    getFiles(app_id, (/**@type{Types.error}*/err, /**@type{Types.admin_log_files[]}*/result) =>{
                        if (err)
                            reject(err);
                        else{
                            if (result.length>0)
                                resolve(result);
                            else{
                                reject('Record not found');
                            }
                        }
                    });
                    break;
                }
                case 'ADMIN_BROADCAST_/BROADCAST/MESSAGE/ADMIN_POST':{
                    BroadcastSendAdmin(getNumberValue(data.app_id), getNumberValue(data.client_id), getNumberValue(data.client_id_current),
                                                data.broadcast_type, data.broadcast_message, (/**@type{Types.error}*/err, /**@type{object}*/result) =>{
                        resolve(result);
                    });
                    break;
                }
                case 'ADMIN_BROADCAST_/BROADCAST/CONNECTION/ADMIN_GET':{
                    ConnectedList(  app_id, getNumberValue(query.get('select_app_id')), getNumberValue(query.get('limit')), getNumberValue(query.get('year')), 
                                    getNumberValue(query.get('month')), query.get('order_by'), query.get('sort'), 0, 
                                    (/**@type{Types.error}*/err, /**@type{Types.broadcast_connect_list_no_res[]} */result) => {
                        if (err) {
                            reject({data: err});
                        }
                        else{
                            if (result && result.length>0)
                                resolve(result);
                            else{
                                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found_promise}) => {
                                    record_not_found_promise(app_id, query.get('lang_code')).then((/**@type{string}*/message)=>reject(message));
                                });
                            }
                        }
                    });
                    break;
                }
                case 'ADMIN_BROADCAST_/BROADCAST/CONNECTION/ADMIN/COUNT_GET':{
                    ConnectedCount( getNumberValue(query.get('identity_provider_id')), getNumberValue(query.get('count_logged_in')), 
                                    (/**@type{Types.error}*/err, /**@type{number}*/count_connected) => {
                        resolve({count_connected});
                    });
                    break;
                }
                case 'ADMIN_SERVER_/CONFIG/ADMIN_GET':{
                    resolve(config.ConfigGet(query.get('config_group'), query.get('parameter')));
                    break;
                }
                case 'ADMIN_DB_API_/ADMIN/DEMO_POST':{
                    resolve(database.DemoInstall(app_id, data));
                    break;
                }
                case 'ADMIN_DB_API_/ADMIN/DEMO_DELETE':{
                    resolve(database.DemoUninstall(app_id));
                    break;
                }
                case 'ADMIN_DB_API_/APPS/ADMIN_GET':{
                    resolve(app.getAppsAdmin(app_id, query));
                    break;
                }
                case 'ADMIN_DB_API_/APPS/ADMIN_PUT':{
                    resolve(app.updateAdmin(app_id, query, data));
                    break;
                }
                case 'ADMIN_DB_API_/APP_CATEGORY/ADMIN_GET':{
                    resolve(app_category.getAppCategoryAdmin(app_id, query));
                    break;
                }
                case 'ADMIN_DB_API_/APP_LOG/ADMIN_GET':{
                    resolve(app_log.getLogsAdmin(app_id, query));
                    break;
                }
                case 'ADMIN_DB_API_/APP_LOG/ADMIN/STAT/UNIQUEVISITOR_GET':{
                    resolve(app_log.getStatUniqueVisitorAdmin(app_id, query));
                    break;
                }
                case 'ADMIN_DB_API_/APP_PARAMETER/ADMIN/ALL_GET':{
                    resolve(app_parameter.getParametersAllAdmin(app_id, query));
                    break;
                }
                case 'ADMIN_DB_API_/APP_PARAMETER/ADMIN_PUT':{
                    resolve(app_parameter.setParameter_admin(app_id, data));
                    break;
                }
                case 'ADMIN_DB_API_/APP_ROLE/ADMIN_GET':{
                    resolve(app_role.getAppRoleAdmin(app_id, query));
                    break;
                }
                case 'ADMIN_DB_API_/PARAMETER_TYPE/ADMIN_GET':{
                    resolve(parameter_type.getParameterTypeAdmin(app_id, query));
                    break;
                }
                case 'SUPERADMIN_DB_API_/USER_ACCOUNT/ADMIN_PUT':{
                    resolve(user_account.updateAdmin(app_id, query));
                    break;
                }
                case 'ADMIN_DB_API_/USER_ACCOUNT/ADMIN/COUNT_GET':{
                    resolve(user_account.getStatCountAdmin(app_id));
                    break;
                }
                case 'ADMIN_DB_API_/USER_ACCOUNT_APP_GET':{
                    resolve(user_account_app.getUserAccountApp(app_id, query));
                    break;
                }
                case 'ADMIN_DB_API_/USER_ACCOUNT_APP_PATCH':{
                    resolve(user_account_app.update(app_id, ip, user_agent, accept_language, host, query, data));
                    break;
                }
                case 'ADMIN_DB_API_/USER_ACCOUNT/ADMIN_GET':{
                    resolve(user_account.getUsersAdmin(app_id, query));
                    break;
                }
                case 'ADMIN_DB_API_/USER_ACCOUNT_LOGON/ADMIN_GET':{
                    resolve(user_account.getLogonAdmin(app_id, query));
                    break;
                }
                case 'AUTH_AUTH_/AUTH/SYSTEMADMIN_POST':{
                    resolve(auth.login_systemadmin(authorization, res));
                    break;
                }
                case 'SOCKET_BROADCAST_/BROADCAST/CONNECTION/CONNECT_GET':{
                    //this is used for EventSource that needs to leave connection open
                    BroadcastConnect(   app_id, 
                                        get_query_value(parameters, 'identity_provider_id',1),
                                        get_query_value(parameters, 'user_account_logon_user_account_id',1),
                                        get_query_value(parameters, 'system_admin',1),
                                        get_query_value(parameters, 'latitude'),
                                        get_query_value(parameters, 'longitude'),
                                        get_query_value(parameters, 'authorization'),
                                        user_agent,
                                        ip,
                                        res).then(()=> {
                        return resolve('');
                    });
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
    const {BroadcastCheckMaintenance} = await import(`file://${process.cwd()}/server/broadcast/broadcast.service.js`);
    const {serverExpress, serverExpressLogError} = await import(`file://${process.cwd()}/server/express/server.js`);
    const {LogServerI, LogServerE} = await import(`file://${process.cwd()}/server/log/log.service.js`);
    const fs = await import('node:fs');
    const http = await import('node:http');
    const https = await import('node:https');

    process.env.TZ = 'UTC';
    process.on('uncaughtException', (err) =>{
        console.log(err);
        LogServerE('Process uncaughtException: ' + err.stack);
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
        BroadcastCheckMaintenance();
        //START HTTP SERVER
        /**@ts-ignore*/
        http.createServer(app).listen(ConfigGet('SERVER', 'PORT'), () => {
            LogServerI('HTTP Server up and running on PORT: ' + ConfigGet('SERVER', 'PORT')).then(() => {
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

export {COMMON, getNumberValue, Info, serverRoutes, serverStart };