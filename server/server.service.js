//save config variables with json as module variable for faster performance
//to avoid readfile async and diskusage
//variables only available from ConfigGet function
//variables are updated when admin updates config
let CONFIG_INIT;
let CONFIG;
let CONFIG_BLOCKIP;
let CONFIG_USERAGENT;
let CONFIG_POLICY;
let CONFIG_USER;
let SLASH;
if (process.platform == 'win32')
    SLASH = '\\';
else
    SLASH = '/';
//initial config with file paths and maintenance parameter
let SERVER_CONFIG_INIT_PATH = `${SLASH}config${SLASH}config_init.json`;

const app_portfolio_title = 'App Portfolio';

//ES6 object with properties using concise method syntax
const COMMON = {
    app_filename(module){
        let from_app_root = ('file:///' + process.cwd().replace(/\\/g, '/')).length;
        return module.substring(from_app_root);
    },
    app_function(stack){
        let e = stack.split("at ");
        let functionName;
        //loop from last to first
        //ES6 rest parameter to avoid mutating array
        for (let line of [...e].reverse()) {
            //ES6 startsWith and includes
            if ((line.startsWith('file')==false && 
                line.includes('node_modules')==false &&
                line.includes('node:internal')==false &&
                line.startsWith('Query')==false)||
                line.startsWith('router')){
                    functionName = line.split(" ")[0];
                    break;
            }
        }
        return functionName;
    },
    app_line(){
        let e = new Error();
        let frame = e.stack.split("\n")[2];
        let lineNumber = frame.split(":").reverse()[1];
        return lineNumber;
    }
};
const config_files = () => {
    return [
            [0, SERVER_CONFIG_INIT_PATH],
            [1, JSON.parse(CONFIG_INIT)['FILE_CONFIG_SERVER']],
            [2, JSON.parse(CONFIG_INIT)['FILE_CONFIG_AUTH_BLOCKIP']],
            [3, JSON.parse(CONFIG_INIT)['FILE_CONFIG_AUTH_USERAGENT']],
            [4, JSON.parse(CONFIG_INIT)['FILE_CONFIG_AUTH_POLICY']],
            [5, JSON.parse(CONFIG_INIT)['PATH_LOG']],
            [6, JSON.parse(CONFIG_INIT)['FILE_CONFIG_AUTH_USER']]
           ];
}
const ConfigGet = (config_no, config_group = null, parameter = null) => {
    switch (parseInt(config_no)){
        case 0:{
            //CONFIG INIT
            return JSON.parse(CONFIG_INIT)[parameter];
        }
        case 1:{
            //SERVER
            let json = JSON.parse(CONFIG);
            if (config_group ==null && parameter==null)
                return json;
            else{
                for (let config_parameter_row of json[config_group]){
                    for (let i=0; i < Object.keys(config_parameter_row).length;i++){
                        if (Object.keys(config_parameter_row)[i]==parameter){
                            return Object.values(config_parameter_row)[i];
                        }
                    }
                }   
                return null;
            }
        }
        case 2:{
            //BLOCKIP json
            return JSON.parse(CONFIG_BLOCKIP);
        } 
        case 3:{
            //USERAGENT json
            return JSON.parse(CONFIG_USERAGENT);
        } 
        case 4:{
            //POLICY json
            return JSON.parse(CONFIG_POLICY);
        } 
        case 5:{
            //LOGS path
            return config_files()[5];
        } 
        case 6:{
            //ADMIN username and password
            return JSON.parse(CONFIG_USER);
        } 
    }
}
const ConfigExists = async () => {
    return await new Promise((resolve) => {
        //load  initial config_init.json file if exists
        //if exists return
        import('node:fs').then((fs) => {
            fs.readFile(process.cwd() + SERVER_CONFIG_INIT_PATH, (err, result) => {
                if (err)
                    resolve(false);
                else{
                    CONFIG_INIT = result.toString();
                    resolve(true);
                }
            });    
        })

    })
}
const DefaultConfig = async () => {
    return new Promise((resolve, reject) => {
        const create_config_dir = async () => {
            return new Promise((resolve, reject) => {
                //create /config directory first time if needed
                import('node:fs').then((fs) => {
                    fs.access(process.cwd() + '/config', (err) => {
                        if (err)
                            fs.mkdir(process.cwd() + '/config', (err) => {
                                if (err)
                                    reject(err);
                                else
                                    resolve();
                            });
                        else
                            resolve();
                    });
                })
            })
        }
        create_config_dir()
        .then(() => {
            let i = 0;
            //read all default files
            let default_files = [
                                    [1, `default_config.json`],
                                    [2, `default_auth_blockip.json`],
                                    [3, `default_auth_useragent.json`],
                                    [4, `default_auth_policy.json`],
                                    [6, `default_auth_user.json`]
                                ];
            let config_json = [];
            //ES2020 import() with ES6 promises, object destructuring
            import('node:fs').then(({promises: {readFile}}) => {
                Promise.all(default_files.map(file => {
                    return readFile(process.cwd() + '/server/' + file[1], 'utf8');
                })).then((config_json) => {
                    import('node:crypto').then(({ createHash }) => {
                        //update default file for config 1 server
                        config_json[0] = JSON.parse(config_json[0]);
                        //update path
                        config_json[0]['SERVER'].forEach((row,index)=>{
                            for (let i=0; i < Object.keys(row).length;i++){
                                if (Object.keys(row)[i]=='HTTPS_KEY'){
                                    config_json[0]['SERVER'][index][Object.keys(row)[i]] = `${SLASH}config${SLASH}ssl${SLASH}${Object.values(row)[i]}`;
                                }
                            } 
                        })
                        config_json[0]['SERVER'].forEach((row,index)=>{
                            for (let i=0; i < Object.keys(row).length;i++){
                                if (Object.keys(row)[i]=='HTTPS_CERT'){
                                    config_json[0]['SERVER'][index][Object.keys(row)[i]] = `${SLASH}config${SLASH}ssl${SLASH}${Object.values(row)[i]}`;
                                }
                            } 
                        })
                        //generate hash
                        config_json[0]['SERVICE_AUTH'].forEach((row,index)=>{
                            for (let i=0; i < Object.keys(row).length;i++){
                                if (Object.keys(row)[i]=='ADMIN_TOKEN_SECRET'){                            
                                    config_json[0]['SERVICE_AUTH'][index][Object.keys(row)[i]] = `${createHash('sha256').update(new Date().toISOString()).digest('hex')}`;
                                }
                            } 
                        })
                        config_json[0] = JSON.stringify(config_json[0]);
        
                        config_json[4] = JSON.parse(config_json[4]);
                        config_json[4]['created'] = new Date().toISOString();
                        config_json[4] = JSON.stringify(config_json[4], undefined, 2);
                        //default server metadata
                        let config_init = {
                                            "CONFIGURATION": app_portfolio_title,
                                            "CREATED": `${new Date().toISOString()}`,
                                            "MODIFIED": "",
                                            "MAINTENANCE": "0",
                                            "FILE_CONFIG_SERVER": `${SLASH}config${SLASH}config.json`,
                                            "FILE_CONFIG_AUTH_BLOCKIP":`${SLASH}config${SLASH}auth_blockip.json`,
                                            "FILE_CONFIG_AUTH_USERAGENT":`${SLASH}config${SLASH}auth_useragent.json`,
                                            "FILE_CONFIG_AUTH_POLICY":`${SLASH}config${SLASH}auth_policy.json`,
                                            "PATH_LOG":`${SLASH}logs${SLASH}`,
                                            "FILE_CONFIG_AUTH_USER":`${SLASH}config${SLASH}auth_user.json`
                                            };
                        config_init = JSON.stringify(config_init, undefined, 2);
                        //save initial config files with metadata including path to config files
                        import('node:fs').then((fs) => {
                            fs.writeFile(process.cwd() + SERVER_CONFIG_INIT_PATH, config_init,  'utf8', (err) => {
                                if (err)
                                    reject(err);
                                else{
                                    //save json in variable
                                    CONFIG_INIT = config_init;
                                    let config_created=0;
                                    for (let config_no=0;config_no<config_json.length;config_no++){
                                        let json_pretty = JSON.stringify(JSON.parse(config_json[config_no]), undefined, 2);
                                        //send fileno in file array
                                        ConfigSave(default_files[config_no][0], json_pretty, true, (err, result)=>{
                                            if (err)
                                                reject(err);
                                            else{
                                                if (config_created== config_json.length - 1)
                                                    resolve();
                                                else
                                                    config_created++;
                                            }
                                        })
                                    }
                                }
                            })
                        })
                    })
                })  
            })
        })
        .catch((err) => {
            reject(err);
         });  
    })
}
const InitConfig = async () => {
    return await new Promise((resolve, reject) => {
        const setVariables = async () => {
            return await new Promise((resolve, reject) => {
                let files = config_files();
                let i=0;                
                for (const file of files){
                    //skip log path
                    if (file[0]!=5){
                        import('node:fs').then((fs) => {
                            fs.readFile(process.cwd() + file[1], 'utf8', (err, fileBuffer) => {
                                if (err)
                                    reject(err);
                                else{
                                    switch (file[0]){
                                        case 0:{
                                            CONFIG_INIT = fileBuffer.toString();
                                        }
                                        case 1:{
                                            CONFIG = fileBuffer.toString();
                                            break;
                                        }
                                        case 2:{
                                            CONFIG_BLOCKIP = fileBuffer.toString();
                                            break;
                                        }
                                        case 3:{
                                            CONFIG_USERAGENT = fileBuffer.toString();
                                            break;
                                        }
                                        case 4:{
                                            CONFIG_POLICY = fileBuffer.toString();
                                            break;
                                        }
                                        case 6:{
                                            CONFIG_USER = fileBuffer.toString();
                                            break;
                                        }
                                    }
                                    //check if last, dont count skipped log path
                                    if (i == files.length -2)
                                        resolve();
                                    else
                                        i++;
                                }
                            })
                        })
                    }
                }
            })
        }
        ConfigExists().then((result) => {
            if (result==true)
                setVariables().then(() => {
                    resolve();
                })
            else{
                DefaultConfig().then(() => {
                    setVariables().then(() => {
                        resolve();
                    })
                })
            }
        })
    })
}

const ConfigGetCallBack = (config_no, config_group, parameter, callBack) => {
        callBack(null, ConfigGet(config_no, config_group, parameter));
    }
const ConfigMaintenanceSet = (value, callBack) => {
    import('node:fs').then((fs) => {
        fs.readFile(process.cwd() + SERVER_CONFIG_INIT_PATH, 'utf8', (err, fileBuffer) => {
            if (err)
                callBack(err, null);
            else{
                let config_init_json = JSON.parse(fileBuffer.toString());
                config_init_json['MAINTENANCE'] = value;
                config_init_json['MODIFIED'] = new Date().toISOString();
                config_init_json = JSON.stringify(config_init_json, undefined, 2);
                //maintenance in this config file is only updated so no need for backup files
                fs.writeFile(process.cwd() + SERVER_CONFIG_INIT_PATH, config_init_json,  'utf8', (err) => {
                    if (err)
                        callBack(err, null);
                    else{
                        CONFIG_INIT = config_init_json;
                        callBack(null, null);
                    }
                })
            }
        })
    })
}
const ConfigMaintenanceGet = (callBack) => {
    import('node:fs').then((fs) => {
        fs.readFile(process.cwd() + SERVER_CONFIG_INIT_PATH, 'utf8', (err, fileBuffer) => {
            if (err)
                callBack(err, null);
            else
                callBack(null, JSON.parse(fileBuffer.toString())['MAINTENANCE']);
        })
    })
}
    
const ConfigGetSaved = (config_type_no, callBack) => {
    /*
    config_type_no
    0 = config_init     path + file
    1 = config          path + file
    2 = auth blockip    path + file
    3 = auth useragent  path + file
    4 = auth policy     path + file
    5 = log path        path
    6 = auth user       path + file
    */
    
    let config_file = config_files().filter((file) => {
        return (parseInt(file[0]) == config_type_no);
    })[0][1];
    import('node:fs').then((fs) => {
        fs.readFile(process.cwd() + config_file, 'utf8', (err, fileBuffer) => {
            if (err)
                callBack(err, null);
            else
                callBack(null, JSON.parse(fileBuffer.toString()));
        })
    })
}
const ConfigSave = async (config_no, config_json, first_time, callBack) => {
    try {
        const write_config = async (config_no, config_file, config_json) => {
            return new Promise((resolve, reject) => {
                import('node:fs').then((fs) => {
                    //write new config
                    fs.writeFile(process.cwd() + config_file, config_json,  'utf8', (err) => {
                        if (err)
                            reject(err);
                        else{
                            //update module variables for faster access
                            switch (config_no){
                                case 1:{
                                    CONFIG = config_json;
                                    break;
                                }
                                case 2:{
                                    CONFIG_BLOCKIP = config_json;
                                    break;
                                }
                                case 3:{
                                    CONFIG_USERAGENT = config_json;
                                    break;
                                }
                                case 4:{
                                    CONFIG_POLICY = config_json;
                                    break;
                                }
                                case 5:{
                                    CONFIG_USER = config_json;
                                    break;
                                }
                            }
                            resolve();
                        }
                    });
                })
            })
        }
        let config_file;
        if (config_no){
            config_file = config_files().filter((file) => {
                return (parseInt(file[0]) == parseInt(config_no));
            })[0][1];
            if (first_time){
                if (config_no == 1){
                    //add metadata to server config
                    config_json = JSON.parse(config_json);
                    config_json['configuration'] = app_portfolio_title;
                    config_json['comment'] = '';
                    config_json['created'] = new Date().toISOString();
                    config_json['modified'] = '';
                    config_json = JSON.stringify(config_json, undefined, 2);
                }                
                write_config(config_no, config_file, config_json).then(() => {
                    callBack(null, null);
                });
            }
            else{
                if (config_no == 0){
                    //config_init.json file displayed info, do not update
                    callBack(null, null);
                }
                else{
                    import('node:fs').then((fs) => {
                        //get old config file
                        fs.readFile(process.cwd() + config_file,  'utf8', (err, result_read) => {
                            if (err)
                                callBack(err, null);
                            else{
                                let old_config = result_read.toString();
                                //write backup of old file
                                fs.writeFile(process.cwd() + `${config_file}.${new Date().toISOString().replace(new RegExp(':', 'g'),'.')}`, old_config,  'utf8', (err) => {
                                    if (err)
                                        callBack(err, null);
                                    else{
                                        if (config_no == 1){
                                            //add metadata to server config
                                            config_json = JSON.parse(config_json);
                                            config_json['configuration'] = app_portfolio_title;
                                            config_json['comment'] = '';
                                            config_json['created'] = JSON.parse(old_config)['created'];
                                            config_json['modified'] = new Date().toISOString();
                                            config_json = JSON.stringify(config_json, undefined, 2);
                                        }  
                                        write_config(config_no, config_file, config_json).then(() => {
                                            callBack(null, null);
                                        });
                                    }
                                });
                            }
                        });
                    })
                }
            }
        }
    } catch (error) {
        let stack = new Error().stack;
        import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogAppS}) => {
            createLogAppS(ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), err).then(() => {
                callBack(err, null);
            })
        });
    }
}
const CheckFirstTime = () => {
    if (JSON.parse(CONFIG_USER)['username']=='')
        return true;
    else
        return false;
}
const CreateSystemAdmin = (admin_name, admin_password, callBack) => {
    let json = JSON.parse(CONFIG_USER);
    json['username'] = admin_name;
    json['password'] = admin_password;
    json['modified'] = new Date().toISOString();
    json = JSON.stringify(json, undefined, 2);
    import('node:fs').then((fs) => {
        fs.writeFile(process.cwd() + config_files()[6][1], json,  'utf8', (err) => {
            if (err)
                callBack(err, null);
            else{
                CONFIG_USER = json;
                callBack(null, null);
            }
        })
    })
}
const ConfigInfo = (callBack) => {
    callBack(null, null);
}
const Info = async (callBack) => {
    let os = await import('os');
    let os_json = {
                    "hostname": os.hostname(),
                    "platform": os.platform(),
                    "type": os.type(),
                    "release": os.release(),
                    "cpus": os.cpus(),
                    "arch": os.arch(),
                    "freemem": os.freemem(),
                    "totalmem": os.totalmem(),
                    "homedir": os.homedir(),
                    "tmpdir": os.tmpdir(),
                    "uptime": os.uptime(),
                    "userinfo": os.userInfo(),
                    "version": os.version()
                    };
    let process_json = { 
                            "memoryusage_rss" : process.memoryUsage()['rss'],
                            "memoryusage_heaptotal" : process.memoryUsage()['heapTotal'],
                            "memoryusage_heapused" : process.memoryUsage()['heapUsed'],
                            "memoryusage_external" : process.memoryUsage()['external'],
                            "memoryusage_arraybuffers" : process.memoryUsage()['arrayBuffers'],
                            "uptime" : process.uptime(),
                            "version" : process.version,
                            "path" : process.cwd(),
                            "start_arg_0" : process.argv[0],
                            "start_arg_1" : process.argv[1]
                        }
    callBack(null, {
                    os: os_json,
                    process: process_json
                    });
}
const serverRouterLog = ((req,res,next)=>{
    let stack = new Error().stack;
    import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogAppRI}) => {
        createLogAppRI(req.query.app_id, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), req.body,
                    req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, res.statusCode, 
                    req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(() => {
            next();
        })
    })
})
const serverExpressLogError = (app) =>{
    import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogServerE}) => {
        //ERROR LOGGING
        app.use((err,req,res,next) => {
            createLogServerE(req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, res.statusCode, 
                            req.headers['user-agent'], req.headers['accept-language'], req.headers['referer'], err).then(() => {
                next();
            });
        })    
    })
}
const serverExpressRoutes = async (app) => {
    //ConfigGet function in service.js used to get parameter values
    const rest_resource_service = ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE');
    const rest_resource_service_db_schema = ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA');
    //server (ConfigGet function from controller to mount on router)
    const { ConfigMaintenanceGet, ConfigMaintenanceSet, ConfigGet:ConfigGetController, ConfigGetSaved, ConfigSave, ConfigInfo, Info} = await import(`file://${process.cwd()}/server/server.controller.js`);
    //auth
    const { dataToken, checkAccessToken, checkDataToken, checkDataTokenRegistration, checkDataTokenLogin,
            checkAccessTokenAdmin, checkAccessTokenSuperAdmin} = await import(`file://${process.cwd()}/server/auth/auth.controller.js`);
    //auth admin
    const { authSystemAdmin, checkSystemAdmin} = await import(`file://${process.cwd()}/server/auth/admin/admin.controller.js`);
    //broadcast
    const { BroadcastConnect, BroadcastSendSystemAdmin, BroadcastSendAdmin, ConnectedList, ConnectedListSystemAdmin, ConnectedCount, ConnectedUpdate, ConnectedCheck} = await import(`file://${process.cwd()}/server/broadcast/broadcast.controller.js`);
    //log
    const {getLogParameters, getLogs, getFiles, getPM2Logs} = await import(`file://${process.cwd()}/server/log/log.controller.js`);
    
    //apps
    const { BFF, BFF_report} = await import(`file://${process.cwd()}/apps/apps.controller.js`);
    //service db admin
    const { DBInfo, DBInfoSpace, DBInfoSpaceSum, DBStart, DBStop, demo_add, demo_delete, demo_get, install_db, install_db_check, install_db_delete } = await import(`file://${process.cwd()}${rest_resource_service}/db/admin/admin.controller.js`);
    //service db app_portfolio app
    const { getApp, getAppsAdmin, updateAppAdmin } = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/app/app.controller.js`);
    //service db app_portfolio app category
    const {getAppCategoryAdmin} = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/app_category/app_category.controller.js`);
    //service db app_portfolio app log
    const { getLogsAdmin, getStatUniqueVisitorAdmin} = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/app_log/app_log.controller.js`);
    //service db app_portfolio app object
    const { getObjects } = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/app_object/app_object.controller.js`);
    //service db app_portfolio app parameter
    const { getParameters, getParametersAdmin, getParametersAllAdmin, setParameter_admin, setParameterValue_admin } = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/app_parameter/app_parameter.controller.js`);
    //service db app_portfolio app role
    const { getAppRoleAdmin} = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/app_role/app_role.controller.js`);
    //service db app_portfolio country
    const { getCountries } = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/country/country.controller.js`);
    //service db app_portfolio identity provider
    const { getIdentityProviders} = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/identity_provider/identity_provider.controller.js`);
    //service db app_portfolio locale
    const { getLocales } = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/language/locale/locale.controller.js`);
    //service db app_portfolio message translation
    const { getMessage } = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/message_translation/message_translation.controller.js`);
    //service db app_portfolio parameter type
    const { getParameterTypeAdmin} = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/parameter_type/parameter_type.controller.js`);
    //service db app_portfolio setting
    const { getSettings } = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/setting/setting.controller.js`);
    //service db app_portfolio user account
    const {
        getUsersAdmin,
        getStatCountAdmin,
        updateUserSuperAdmin,
        userLogin,
        userSignup,
        activateUser,
        passwordResetUser,
        updatePassword,
        updateUserLocal,
        providerSignIn,
        getUserByUserId,
        updateUserCommon,
        deleteUser,
        getProfileDetail,
        getProfileTop,
        getProfileUser,
        searchProfileUser} = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/user_account/user_account.controller.js`);
    //service db app_portfolio user account app
    const { createUserAccountApp, getUserAccountApps, getUserAccountApp, updateUserAccountApp, deleteUserAccountApps} = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/user_account_app/user_account_app.controller.js`);

    const { createUserSetting, 
            getUserSettingsByUserId, 
            getProfileUserSetting,
            getProfileUserSettings,
            getProfileUserSettingDetail,
            getProfileTopSetting,
            getUserSetting,
            updateUserSetting, 
            deleteUserSetting} = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/user_account_app_setting/user_account_app_setting.controller.js`);
    const { likeUserSetting, unlikeUserSetting} = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/user_account_app_setting_like/user_account_app_setting_like.controller.js`);
    const { insertUserSettingView} = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/user_account_app_setting_view/user_account_app_setting_view.controller.js`);

    //service db app_portfolio user account follow
    const { followUser, unfollowUser} = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/user_account_follow/user_account_follow.controller.js`);
    //service db app_portfolio user account like
    const { likeUser, unlikeUser} = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/user_account_like/user_account_like.controller.js`);
    //service db app_portfolio user account logon
    const { getUserAccountLogonAdmin} = await import(`file://${process.cwd()}${rest_resource_service}/db${rest_resource_service_db_schema}/user_account_logon/user_account_logon.controller.js`);
    //service geolocation
    const { getPlace, getIp, getTimezone, getTimezoneAdmin, getTimezoneSystemAdmin} = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/geolocation/geolocation.controller.js`);
    //service mail
    const { getLogo } = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/mail/mail.controller.js`);
    //service report
    const { getReport } = await import(`file://${process.cwd()}${rest_resource_service}/report/report.controller.js`);
    //service worldcities
    const { getCities} = await import(`file://${process.cwd()}${rest_resource_service}/worldcities/worldcities.controller.js`);
    
    //router
    const {Router} = await import('express');
    const router = [Router()];
    let i = 0;
    //endpoints
    //server
    router[i].use(serverRouterLog);
    router[i].put("/config/systemadmin", checkSystemAdmin, ConfigSave);
    router[i].get("/config/systemadmin", checkSystemAdmin, ConfigGetController);
    router[i].get("/config/systemadmin/saved", checkSystemAdmin, ConfigGetSaved);
    router[i].get("/config/systemadmin/maintenance", checkSystemAdmin, ConfigMaintenanceGet);
    router[i].patch("/config/systemadmin/maintenance", checkSystemAdmin, ConfigMaintenanceSet);
    router[i].get("/config/info", checkSystemAdmin, ConfigInfo);
    router[i].get("/info", checkSystemAdmin, Info);
    router[i].get("/config/admin", checkAccessTokenAdmin, ConfigGetController);
    app.use(ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVER'), router[i]);
    i++;
    //auth
    router.push(Router());
    router[i].use(serverRouterLog);
    router[i].post("/", dataToken);
    app.use(`${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVER')}/auth`, router[i]);
    i++;
    //auth admin
    router.push(Router());
    router[i].use(serverRouterLog);
    router[i].post("/", authSystemAdmin);
    app.use(`${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVER')}/auth/admin`, router[i]);
    i++;
    //broadcast
    router.push(Router());
    router[i].use(serverRouterLog);
    //message:
    router[i].post("/message/SystemAdmin",checkSystemAdmin, BroadcastSendSystemAdmin);
    router[i].post("/message/Admin",checkAccessTokenAdmin, BroadcastSendAdmin);
    //connection:
    router[i].get("/connection/SystemAdmin", checkSystemAdmin, ConnectedListSystemAdmin);
    router[i].patch("/connection/SystemAdmin", checkSystemAdmin, ConnectedUpdate);
    router[i].get("/connection/Admin", checkAccessTokenAdmin, ConnectedList);
    router[i].get("/connection/Admin/count", checkAccessTokenAdmin, ConnectedCount);
    router[i].get("/connection/:clientId",BroadcastConnect);
    router[i].patch("/connection", checkDataToken, ConnectedUpdate);
    router[i].get("/connection/check/:user_account_id", checkDataToken, ConnectedCheck);
    app.use(`${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVER')}/broadcast`, router[i]);
    i++;
    //log
    router.push(Router());
    router[i].use(serverRouterLog);
    router[i].get("/parameters", checkSystemAdmin, getLogParameters);
    router[i].get("/logs", checkSystemAdmin, getLogs);
    router[i].get("/files", checkSystemAdmin, getFiles);
    router[i].get("/pm2logs", checkSystemAdmin, getPM2Logs);
    app.use(`${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVER')}/log`, router[i]);
    i++;
    //apps bff
    router.push(Router());
    router[i].use(serverRouterLog);
    router[i].delete("/",  checkDataToken, BFF);
    router[i].get("/",  checkDataToken, BFF);
    router[i].patch("/",  checkDataToken, BFF);
    router[i].post("/",  checkDataToken, BFF);
    router[i].put("/",  checkDataToken, BFF);
    router[i].delete("/access",  checkAccessToken, BFF);
    router[i].get("/access",  checkAccessToken, BFF);
    router[i].patch("/access",  checkAccessToken, BFF);
    router[i].post("/access",  checkAccessToken, BFF);
    router[i].put("/access",  checkAccessToken, BFF);
    router[i].delete("/admin",  checkAccessTokenAdmin, BFF);
    router[i].get("/admin",  checkAccessTokenAdmin, BFF);
    router[i].patch("/admin",  checkAccessTokenAdmin, BFF);
    router[i].post("/admin",  checkAccessTokenAdmin, BFF);
    router[i].put("/admin",  checkAccessTokenAdmin, BFF);
    router[i].delete("/systemadmin",  checkSystemAdmin, BFF);
    router[i].get("/systemadmin",  checkSystemAdmin, BFF);
    router[i].patch("/systemadmin",  checkSystemAdmin, BFF);
    router[i].post("/systemadmin",  checkSystemAdmin, BFF);
    router[i].put("/systemadmin",  checkSystemAdmin, BFF);
    
    router[i].get("/reports", BFF_report);
    app.use('/apps/bff', router[i]);
    i++;
    //service db admin
    router.push(Router());
    router[i].use(serverRouterLog);
    router[i].get("/DBInfo",  checkSystemAdmin, DBInfo);
    router[i].get("/DBInfoSpace",  checkSystemAdmin, DBInfoSpace);
    router[i].get("/DBInfoSpaceSum",  checkSystemAdmin, DBInfoSpaceSum);
    router[i].get("/DBStart",  checkSystemAdmin, DBStart);
    router[i].get("/DBStop",  checkSystemAdmin, DBStop);
    router[i].post("/demo",  checkSystemAdmin, demo_add);
    router[i].get("/demo",  checkSystemAdmin, demo_get);
    router[i].delete("/demo",  checkSystemAdmin, demo_delete);
    router[i].post("/install",  checkSystemAdmin, install_db);
    router[i].get("/install",  checkSystemAdmin, install_db_check);
    router[i].delete("/install",  checkSystemAdmin, install_db_delete);
    app.use(`${rest_resource_service}/db/admin`, router[i]);
    i++;
    //service db app_portfolio app
    router.push(Router());
    router[i].use(serverRouterLog);
    router[i].get("/",  checkDataToken, getApp);
    router[i].get("/admin",  checkAccessTokenAdmin, getAppsAdmin);
    router[i].put("/admin/:id",  checkAccessTokenAdmin, updateAppAdmin);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/apps`, router[i]);
    i++;
    //service db app_portfolio app category
    router.push(Router());
    router[i].use(serverRouterLog);
    router[i].get("/admin",  checkAccessTokenAdmin, getAppCategoryAdmin);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/app_category`, router[i]);
    i++;
    //service db app_portfolio app log
    router.push(Router());
    router[i].use(serverRouterLog);
    router[i].get("/admin",  checkAccessTokenAdmin, getLogsAdmin);
    router[i].get("/admin/stat/uniquevisitor", checkAccessTokenAdmin, getStatUniqueVisitorAdmin);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/app_log`, router[i]);
    i++;
    //service db app_portfolio app object
    router.push(Router());
    router[i].use(serverRouterLog);
    router[i].get("/:lang_code",  checkDataToken, getObjects);
    router[i].get("/admin/:lang_code",  checkDataToken, getObjects);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/app_object`, router[i]);
    i++;
    //service db app_portfolio app parameter
    router.push(Router());
    router[i].use(serverRouterLog);
    router[i].get("/admin/all/:app_id", checkAccessTokenAdmin, getParametersAllAdmin);
    router[i].put("/admin", checkAccessTokenAdmin, setParameter_admin);
    router[i].patch("/admin/value", checkAccessTokenAdmin, setParameterValue_admin);
    router[i].get("/admin/:app_id", checkDataToken, getParametersAdmin);
    router[i].get("/:app_id", checkDataToken, getParameters);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/app_parameter`, router[i]);
    i++;
    //service db app_portfolio app role
    router.push(Router());
    router[i].use(serverRouterLog);
    router[i].get("/admin",  checkAccessTokenAdmin, getAppRoleAdmin);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/app_role`, router[i]);
    i++;
    //service db app_portfolio country
    router.push(Router());
    router[i].use(serverRouterLog);
    router[i].get("/:lang_code",  checkDataToken, getCountries);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/country`, router[i]);
    i++;
    //service db app_portfolio identity provider
    router.push(Router());
    router[i].use(serverRouterLog);
    router[i].get("/", checkDataToken, getIdentityProviders);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/identityprovider`, router[i]);
    i++;
    //service db app_portfolio language locale
    router.push(Router());
    router[i].use(serverRouterLog);
    router[i].get("/:lang_code", checkDataToken, getLocales);
    router[i].get("/admin/:lang_code", checkDataToken, getLocales);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/language/locale`, router[i]);
    i++;
    //service db app_portfolio message translation
    router.push(Router());
    router[i].use(serverRouterLog);
    router[i].get("/:code",  checkDataToken, getMessage);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/message_translation`, router[i]);
    i++;
    //service db app_portfolio parameter type
    router.push(Router());
    router[i].use(serverRouterLog);
    router[i].get("/admin", checkAccessTokenAdmin, getParameterTypeAdmin);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/parameter_type`, router[i]);
    i++;
    //service db app_portfolio setting
    router.push(Router());
    router[i].use(serverRouterLog);
    router[i].get("/",  checkDataToken, getSettings);
    router[i].get("/admin",  checkDataToken, getSettings);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/settings`, router[i]);
    i++;
    //service db app_portfolio user account
    router.push(Router());
    router[i].use(serverRouterLog);
        //admin, count user stat
    router[i].get("/admin/count", checkAccessTokenAdmin, getStatCountAdmin);
        //admin, all users with option to search
    router[i].get("/admin", checkAccessTokenAdmin, getUsersAdmin);
        //admin update user, only for superadmin
    router[i].put("/admin/:id", checkAccessTokenSuperAdmin, updateUserSuperAdmin);
    router[i].put("/login", checkDataTokenLogin, userLogin);
    router[i].post("/signup", checkDataTokenRegistration, userSignup);
        //local user
    router[i].put("/activate/:id", checkDataToken, activateUser);
    router[i].put("/forgot", checkDataToken, passwordResetUser);
    router[i].put("/password/:id", checkAccessToken, updatePassword);
    router[i].put("/:id", checkAccessToken, updateUserLocal);
        //provider user
    router[i].put("/provider/:id", checkDataTokenLogin, providerSignIn);
        //common user
    router[i].get("/:id", checkAccessToken, getUserByUserId);
    router[i].put("/common/:id", checkAccessToken, updateUserCommon);
    router[i].delete("/:id", checkAccessToken, deleteUser);
        //profile
    router[i].get("/profile/detail/:id", checkAccessToken, getProfileDetail);
    router[i].get("/profile/top/:statchoice", checkDataToken, getProfileTop);
    router[i].post("/profile/id/:id", checkDataToken, getProfileUser);
    router[i].post("/profile/username", checkDataToken, getProfileUser);
    router[i].post("/profile/username/searchD", checkDataToken, searchProfileUser);
    router[i].post("/profile/username/searchA", checkAccessToken, searchProfileUser);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/user_account`, router[i]);
    i++;
    //service db app_portfolio user account app
    router.push(Router());
    router[i].use(serverRouterLog);
    router[i].post("/", checkAccessToken, createUserAccountApp);
    router[i].get("/:user_account_id", checkAccessToken, getUserAccountApp);
    router[i].get("/apps/:user_account_id", checkAccessToken, getUserAccountApps);
    router[i].patch("/:user_account_id", checkAccessToken, updateUserAccountApp);
    router[i].delete("/:user_account_id/:app_id", checkAccessToken, deleteUserAccountApps);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/user_account_app`, router[i]);
    i++;
    //service db app_portfolio user account app setting
    router.push(Router());
    router[i].get("/:id", checkDataToken, getUserSetting);
    router[i].get("/user_account_id/:id", checkDataToken, getUserSettingsByUserId);
    router[i].get("/profile/:id", checkDataToken, getProfileUserSetting);
    router[i].get("/profile/all/:id", checkDataToken, getProfileUserSettings);
    router[i].get("/profile/detail/:id", checkAccessToken, getProfileUserSettingDetail);
    router[i].get("/profile/top/:statchoice", checkDataToken, getProfileTopSetting);
    router[i].post("/", checkAccessToken, createUserSetting);
    router[i].put("/:id", checkAccessToken, updateUserSetting);
    router[i].delete("/:id", checkAccessToken, deleteUserSetting);  
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/user_account_app_setting`, router[i]);
    i++;
    //service db app_portfolio user account app setting like
    router.push(Router());
    router[i].use(serverRouterLog);
    router[i].post("/:id", checkAccessToken, likeUserSetting);
    router[i].delete("/:id", checkAccessToken, unlikeUserSetting);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/user_account_app_setting_like`, router[i]);
    i++;
    //service db app_portfolio user account app setting view
    router.push(Router());
    router[i].use(serverRouterLog);
    router[i].post("/", checkDataToken, insertUserSettingView);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/user_account_app_setting_view`, router[i]);
    i++;
    //service db app_portfolio user account follow
    router.push(Router());
    router[i].use(serverRouterLog);
    router[i].post("/:id", checkAccessToken, followUser);
    router[i].delete("/:id", checkAccessToken, unfollowUser);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/user_account_follow`, router[i]);
    i++;
    //service db app_portfolio user account like
    router.push(Router());
    router[i].use(serverRouterLog);
    router[i].post("/:id", checkAccessToken, likeUser);
    router[i].delete("/:id", checkAccessToken, unlikeUser);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/user_account_like`, router[i]);
    i++;
    //service db app_portfolio user account logon
    router.push(Router());
    router[i].use(serverRouterLog);
    router[i].get("/admin/:user_account_id/:app_id",  checkAccessTokenAdmin, getUserAccountLogonAdmin);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/user_account_logon`, router[i]);
    i++;
    //service geolocation
    router.push(Router());
    router[i].use(serverRouterLog);
    router[i].get("/place", checkDataToken, getPlace);
    router[i].get("/place/admin", checkAccessTokenAdmin, getPlace);
    router[i].get("/place/systemadmin", checkSystemAdmin, getPlace);
    router[i].get("/ip", checkDataToken, getIp);
    router[i].get("/ip/admin", checkAccessTokenAdmin, getIp);
    router[i].get("/ip/systemadmin", checkSystemAdmin, getIp);
    router[i].get("/timezone", checkDataToken, getTimezone);
    router[i].get("/timezone/admin", checkAccessTokenAdmin, getTimezoneAdmin);
    router[i].get("/timezone/systemadmin", checkSystemAdmin, getTimezoneSystemAdmin);    
    app.use(`${rest_resource_service}/geolocation`, router[i]);
    i++;
    //service mail
    router.push(Router());
    router[i].use(serverRouterLog);
    router[i].get("/logo", getLogo);
    app.use(`${rest_resource_service}/mail`, router[i]);
    i++;
    //service report
    router.push(Router());
    router[i].use(serverRouterLog);
    router[i].get("/", getReport);
    app.use(`${rest_resource_service}/reports`, router[i]);
    i++;
    //service worldcities
    router.push(Router());
    router[i].use(serverRouterLog);
    router[i].get("/:country", checkDataToken, getCities);
    app.use(`${rest_resource_service}/worldcities`, router[i]);
}
const serverExpress = async () => {
    const {default: express} = await import('express');
    const {CheckFirstTime, ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);
    const {policy_directives} = await import(`file://${process.cwd()}/server/auth/auth.controller.js`);
    const {default: compression} = await import('compression');
    const {default: helmet} = await import('helmet');
    const { check_request, access_control} = await import(`file://${process.cwd()}/server/auth/auth.controller.js`);
    const {createLogServerI, createLogServerE} = await import(`file://${process.cwd()}/server/log/log.service.js`);    
    return new Promise((resolve, reject) =>{
        const app = express();
        //
        //MIDDLEWARES
        //
        //use compression for better performance
        const shouldCompress = (req, res) => {
            //exclude broadcast messages
            //check endpoint for broadcast
            if (req.baseUrl == `${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVER')}/broadcast`)
                return false;
            else
                return true;
            }
        app.set('trust proxy', true);
        app.use(compression({ filter: shouldCompress }));
        //configuration of Content Security Policies    
        policy_directives((err, result_directives)=>{
            if (err)
                createLogServerI('Content Security Policies error :' + err).then(() => {
                    reject(err);
                })
            else{
                app.use(
                    helmet({
                      crossOriginEmbedderPolicy: false,
                      contentSecurityPolicy: {
                        directives: result_directives
                      }
                    })
                );
                // Helmet referrer policy
                app.use(helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' }));
                //define what headers are allowed
                app.use((req, res, next) => {
                  res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept, Service-Worker-Allowed');
                  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
                  next();
                });
                // set JSON maximum size
                app.use(express.json({ limit: ConfigGet(1, 'SERVER', 'JSON_LIMIT') }));
                //access control with log of stopped requests
                //logs only if error
                app.use((req,res,next) => {                
                    access_control(req, res, (err, result)=>{
                      if(err){
                        null;
                      }
                      else{
                        if (result)
                          res.end;
                        else
                          next();
                      }
                    });
                })
                //check request
                //logs only if error
                app.use((req, res, next) => {
                    check_request(req, (err, result) =>{
                      if (err){
                        res.statusCode = 400;
                        createLogServerE(req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, res.statusCode, 
                                        req.headers['user-agent'], req.headers['accept-language'], req.headers['referer'], err).then(() => {
                            res.send('⛔');
                            res.end;
                        });
                      }
                      else{
                        next();
                      }
                    })
                });
                //convert query id parameters from string to integer
                //and logs after response is finished
                app.use((req, res, next) => { 
                  //req.params can be modified in controller
                  if (req.query.app_id)
                    req.query.app_id = parseInt(req.query.app_id);
                  if (req.query.id)
                    req.query.id = parseInt(req.query.id);
                  if (req.query.user_account_logon_user_account_id)
                    req.query.user_account_logon_user_account_id = parseInt(req.query.user_account_logon_user_account_id);
                  if (req.query.user_account_id)
                    req.query.user_account_id = parseInt(req.query.user_account_id);
                  if (req.query.app_user_id)
                    req.query.app_user_id = parseInt(req.query.app_user_id);
                  if (req.query.client_id)
                    req.query.client_id = parseInt(req.query.client_id);
                  res.on('finish',()=>{
                    //logs the result after REST API has modified req and res
                    createLogServerI(null,
                        req,
                        req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, 
                        res.statusCode, res.statusMessage, 
                        req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(() => {
                        res.end;
                    });
                  })
                  next();
                });
                //check if SSL verification using letsencrypt should be enabled when validating domains
                if (ConfigGet(1, 'SERVER', 'HTTPS_SSL_VERIFICATION')=='1'){
                  let ssl_verification_path = ConfigGet(1, 'SERVER', 'HTTPS_SSL_VERIFICATION_PATH');
                  app.use(ssl_verification_path,express.static(process.cwd() + ssl_verification_path));
                  app.use(express.static(process.cwd(), { dotfiles: 'allow' }));
                };
                //
                //ROUTES
                //
                //get before apps code
                //info for search bots
                app.get('/robots.txt',  (req, res) => {
                  res.type('text/plain');
                  res.send('User-agent: *\nDisallow: /');
                });
                //browser favorite icon to ignore
                app.get('/favicon.ico', (req, res) => {
                  res.send('');
                });
                //change all requests from http to https and naked domains with prefix https://www. except localhost
                app.get('*', (req,res, next) => {
                  //if first time, when no system admin exists, then redirect everything to admin
                  if (CheckFirstTime() && req.originalUrl !='/admin' && req.headers.referer==undefined)
                    return res.redirect('http://' + req.headers.host + '/admin');
                  else{
                    //redirect naked domain to www except for localhost
                    if (((req.headers.host.split('.').length - 1) == 1) &&
                      req.headers.host.indexOf('localhost')==-1)
                      if (req.protocol=='http' && ConfigGet(1, 'SERVER', 'HTTPS_ENABLE')=='1')
                        return res.redirect('https://' + 'www.' + req.headers.host + req.originalUrl);
                      else
                        return res.redirect('http://' + 'www.' + req.headers.host + req.originalUrl);
                    else{
                      //redirect from http to https if https enabled
                      if (req.protocol=='http' && ConfigGet(1, 'SERVER', 'HTTPS_ENABLE')=='1')
                        return res.redirect('https://' + req.headers.host + req.originalUrl);
                      else{
                        return next();
                      }
                    }
                  }
                })
                serverExpressRoutes(app).then(() =>{
                    resolve(app);
                })
            }
        })
    })
}
const serverStart = async () =>{
    const {DBStart} = await import(`file://${process.cwd()}/service/db/admin/admin.service.js`);
    const {BroadcastCheckMaintenance} = await import(`file://${process.cwd()}/server/broadcast/broadcast.service.js`);
    const fs = await import('node:fs');
    const https = await import('node:https');
    process.env.TZ = 'UTC';
    InitConfig().then(() => {
        import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogServerI})=>{
            DBStart().then((result) => {
                //Get express app with all configurations
                serverExpress().then((app)=>{
                    import(`file://${process.cwd()}/apps/apps.service.js`).then(({AppsStart})=>{
                        AppsStart(app).then(() => {
                            serverExpressLogError(app);
                            BroadcastCheckMaintenance();
                            //START HTTP SERVER
                            app.listen(ConfigGet(1, 'SERVER', 'PORT'), () => {
                                createLogServerI('HTTP Server up and running on PORT: ' + ConfigGet(1, 'SERVER', 'PORT')).then(() => {
                                    null;
                                });
                            });
                            if (ConfigGet(1, 'SERVER', 'HTTPS_ENABLE')=='1'){
                                //START HTTPS SERVER
                                //SSL files for HTTPS
                                let options;
                                fs.readFile(process.cwd() + ConfigGet(1, 'SERVER', 'HTTPS_KEY'), 'utf8', (error, fileBuffer) => {
                                    let env_key = fileBuffer.toString();
                                    fs.readFile(process.cwd() + ConfigGet(1, 'SERVER', 'HTTPS_CERT'), 'utf8', (error, fileBuffer) => {
                                        let env_cert = fileBuffer.toString();
                                        options = {
                                            key: env_key,
                                            cert: env_cert
                                        };
                                        https.createServer(options, app).listen(ConfigGet(1, 'SERVER', 'HTTPS_PORT'), () => {
                                            createLogServerI('HTTPS Server up and running on PORT: ' + ConfigGet(1, 'SERVER', 'HTTPS_PORT')).then(() => {
                                                null;
                                            });
                                        })
                                    });
                                });
                            }
                        })
                    })
                })
            })
        })
    })
}

export {COMMON, ConfigGetCallBack, ConfigMaintenanceSet, ConfigMaintenanceGet, ConfigGetSaved, ConfigSave, CheckFirstTime,
        CreateSystemAdmin, ConfigInfo, Info, 
        ConfigGet, InitConfig, serverStart};