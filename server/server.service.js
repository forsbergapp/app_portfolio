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
        import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/common/common.service.js`).then(({COMMON}) => {
            import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/log/log.service.js`).then(({createLogAppS}) => {
                createLogAppS(ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), err).then(() => {
                    callBack(err, null);
                })
            });
        })
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
    import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/common/common.service.js`).then(({COMMON}) => {
        import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/log/log.service.js`).then(({createLogAppRI}) => {
            createLogAppRI(req.query.app_id, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), req.body,
                        req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, res.statusCode, 
                        req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(() => {
                next();
            })
        })
    })
})
const serverExpressLogError = (app) =>{
    import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/log/log.service.js`).then(({createLogServerE}) => {
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
            checkAccessTokenAdmin, checkAccessTokenSuperAdmin} = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/auth/auth.controller.js`);
    //auth admin
    const { authAdmin, checkAdmin} = await import(`file://${process.cwd()}${rest_resource_service}/auth/admin/admin.controller.js`);
    //broadcast
    const { BroadcastConnect, BroadcastSendSystemAdmin, BroadcastSendAdmin, ConnectedList, ConnectedListSystemAdmin, ConnectedCount, ConnectedUpdate, ConnectedCheck} = await import(`file://${process.cwd()}${rest_resource_service}/broadcast/broadcast.controller.js`);
    //service db admin
    const { DBInfo, DBInfoSpace, DBInfoSpaceSum, DBStart, DBStop, demo_add, demo_delete, demo_get } = await import(`file://${process.cwd()}${rest_resource_service}/db/admin/admin.controller.js`);
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
    //service forms
    const { getFormAdminSecure } = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/forms/forms.controller.js`);
    //service geolocation
    const { getPlace, getPlaceAdmin, getPlaceSystemAdmin, getIp, getIpAdmin, getIpSystemAdmin, getTimezone, getTimezoneAdmin, getTimezoneSystemAdmin} = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/geolocation/geolocation.controller.js`);
    //service log
    const {getLogParameters, getLogs, getFiles, getPM2Logs} = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/log/log.controller.js`);
    //service mail
    const { getLogo } = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/mail/mail.controller.js`);
    //service report
    const { getReport } = await import(`file://${process.cwd()}${rest_resource_service}/report/report.controller.js`);
    //service worldcities
    const { getCities} = await import(`file://${process.cwd()}${rest_resource_service}/worldcities/worldcities.controller.js`);
    
    //router
    const {Router} = await import('express');
    const router = [Router()];
    
    //endpoints
    //server
    router[0].use(serverRouterLog);
    router[0].put("/config/systemadmin", checkAdmin, ConfigSave);
    router[0].get("/config/systemadmin", checkAdmin, ConfigGetController);
    router[0].get("/config/systemadmin/saved", checkAdmin, ConfigGetSaved);
    router[0].get("/config/systemadmin/maintenance", checkAdmin, ConfigMaintenanceGet);
    router[0].patch("/config/systemadmin/maintenance", checkAdmin, ConfigMaintenanceSet);
    router[0].get("/config/info", checkAdmin, ConfigInfo);
    router[0].get("/info", checkAdmin, Info);
    router[0].get("/config/admin", checkAccessTokenAdmin, ConfigGetController);
    app.use(ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVER'), router[0]);
    //auth
    router.push(Router());
    router[1].use(serverRouterLog);
    router[1].post("/", dataToken);
    app.use(`${rest_resource_service}/auth`, router[1]);
    //auth admin
    router.push(Router());
    router[2].use(serverRouterLog);
    router[2].post("/", authAdmin);
    app.use(`${rest_resource_service}/auth/admin`, router[2]);
    //broadcast
    router.push(Router());
    router[3].use(serverRouterLog);
    //message:
    router[3].post("/message/SystemAdmin",checkAdmin, BroadcastSendSystemAdmin);
    router[3].post("/message/Admin",checkAccessTokenAdmin, BroadcastSendAdmin);
    //connection:
    router[3].get("/connection/SystemAdmin", checkAdmin, ConnectedListSystemAdmin);
    router[3].patch("/connection/SystemAdmin", checkAdmin, ConnectedUpdate);
    router[3].get("/connection/Admin", checkAccessTokenAdmin, ConnectedList);
    router[3].get("/connection/Admin/count", checkAccessTokenAdmin, ConnectedCount);
    router[3].get("/connection/:clientId",BroadcastConnect);
    router[3].patch("/connection", checkDataToken, ConnectedUpdate);
    router[3].get("/connection/check/:user_account_id", checkDataToken, ConnectedCheck);
    app.use(`${rest_resource_service}/broadcast`, router[3]);
    //service db admin
    router.push(Router());
    router[4].use(serverRouterLog);
    router[4].get("/DBInfo",  checkAdmin, DBInfo);
    router[4].get("/DBInfoSpace",  checkAdmin, DBInfoSpace);
    router[4].get("/DBInfoSpaceSum",  checkAdmin, DBInfoSpaceSum);
    router[4].get("/DBStart",  checkAdmin, DBStart);
    router[4].get("/DBStop",  checkAdmin, DBStop);
    router[4].post("/demo",  checkAdmin, demo_add);
    router[4].get("/demo",  checkAdmin, demo_get);
    router[4].delete("/demo",  checkAdmin, demo_delete);
    app.use(`${rest_resource_service}/db/admin`, router[4]);
    //service db app_portfolio app
    router.push(Router());
    router[5].use(serverRouterLog);
    router[5].get("/",  checkDataToken, getApp);
    router[5].get("/admin",  checkAccessTokenAdmin, getAppsAdmin);
    router[5].put("/admin/:id",  checkAccessTokenAdmin, updateAppAdmin);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/app`, router[5]);
    //service db app_portfolio app category
    router.push(Router());
    router[6].use(serverRouterLog);
    router[6].get("/admin",  checkAccessTokenAdmin, getAppCategoryAdmin);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/app_category`, router[6]);
    //service db app_portfolio app log
    router.push(Router());
    router[7].use(serverRouterLog);
    router[7].get("/admin",  checkAccessTokenAdmin, getLogsAdmin);
    router[7].get("/admin/stat/uniquevisitor", checkAccessTokenAdmin, getStatUniqueVisitorAdmin);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/app_log`, router[7]);
    //service db app_portfolio app object
    router.push(Router());
    router[8].use(serverRouterLog);
    router[8].get("/:lang_code",  checkDataToken, getObjects);
    router[8].get("/admin/:lang_code",  checkDataToken, getObjects);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/app_object`, router[8]);
    //service db app_portfolio app parameter
    router.push(Router());
    router[9].use(serverRouterLog);
    router[9].get("/admin/all/:app_id", checkAccessTokenAdmin, getParametersAllAdmin);
    router[9].put("/admin", checkAccessTokenAdmin, setParameter_admin);
    router[9].patch("/admin/value", checkAccessTokenAdmin, setParameterValue_admin);
    router[9].get("/admin/:app_id", checkDataToken, getParametersAdmin);
    router[9].get("/:app_id", checkDataToken, getParameters);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/app_parameter`, router[9]);
    //service db app_portfolio app role
    router.push(Router());
    router[10].use(serverRouterLog);
    router[10].get("/admin",  checkAccessTokenAdmin, getAppRoleAdmin);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/app_role`, router[10]);
    //service db app_portfolio country
    router.push(Router());
    router[11].use(serverRouterLog);
    router[11].get("/:lang_code",  checkDataToken, getCountries);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/country`, router[11]);
    //service db app_portfolio identity provider
    router.push(Router());
    router[12].use(serverRouterLog);
    router[12].get("/", checkDataToken, getIdentityProviders);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/identity_provider`, router[12]);
    //service db app_portfolio language locale
    router.push(Router());
    router[13].use(serverRouterLog);
    router[13].get("/:lang_code", checkDataToken, getLocales);
    router[13].get("/admin/:lang_code", checkDataToken, getLocales);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/language/locale`, router[13]);
    //service db app_portfolio message translation
    router.push(Router());
    router[14].use(serverRouterLog);
    router[14].get("/:code",  checkDataToken, getMessage);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/message_translation`, router[14]);
    //service db app_portfolio parameter type
    router.push(Router());
    router[15].use(serverRouterLog);
    router[15].get("/admin", checkAccessTokenAdmin, getParameterTypeAdmin);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/parameter_type`, router[15]);
    //service db app_portfolio setting
    router.push(Router());
    router[16].use(serverRouterLog);
    router[16].get("/",  checkDataToken, getSettings);
    router[16].get("/admin",  checkDataToken, getSettings);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/setting`, router[16]);
    //service db app_portfolio user account
    router.push(Router());
    router[17].use(serverRouterLog);
        //admin, count user stat
    router[17].get("/admin/count", checkAccessTokenAdmin, getStatCountAdmin);
        //admin, all users with option to search
    router[17].get("/admin", checkAccessTokenAdmin, getUsersAdmin);
        //admin update user, only for superadmin
    router[17].put("/admin/:id", checkAccessTokenSuperAdmin, updateUserSuperAdmin);
    router[17].put("/login", checkDataTokenLogin, userLogin);
    router[17].post("/signup", checkDataTokenRegistration, userSignup);
        //local user
    router[17].put("/activate/:id", checkDataToken, activateUser);
    router[17].put("/password_reset/", checkDataToken, passwordResetUser);
    router[17].put("/password/:id", checkAccessToken, updatePassword);
    router[17].put("/:id", checkAccessToken, updateUserLocal);
        //provider user
    router[17].put("/provider/:id", checkDataTokenLogin, providerSignIn);
        //common user
    router[17].get("/:id", checkAccessToken, getUserByUserId);
    router[17].put("/common/:id", checkAccessToken, updateUserCommon);
    router[17].delete("/:id", checkAccessToken, deleteUser);
        //profile
    router[17].get("/profile/detail/:id", checkAccessToken, getProfileDetail);
    router[17].get("/profile/top/:statchoice", checkDataToken, getProfileTop);
    router[17].post("/profile/id/:id", checkDataToken, getProfileUser);
    router[17].post("/profile/username", checkDataToken, getProfileUser);
    router[17].post("/profile/username/searchD", checkDataToken, searchProfileUser);
    router[17].post("/profile/username/searchA", checkAccessToken, searchProfileUser);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/user_account`, router[17]);
    //service db app_portfolio user account app
    router.push(Router());
    router[18].use(serverRouterLog);
    router[18].post("/", checkAccessToken, createUserAccountApp);
    router[18].get("/:user_account_id", checkAccessToken, getUserAccountApp);
    router[18].get("/apps/:user_account_id", checkAccessToken, getUserAccountApps);
    router[18].patch("/:user_account_id", checkAccessToken, updateUserAccountApp);
    router[18].delete("/:user_account_id/:app_id", checkAccessToken, deleteUserAccountApps);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/user_account_app`, router[18]);
    //service db app_portfolio user account app setting
    router.push(Router());
    router[19].get("/:id", checkDataToken, getUserSetting);
    router[19].get("/user_account_id/:id", checkDataToken, getUserSettingsByUserId);
    router[19].get("/profile/:id", checkDataToken, getProfileUserSetting);
    router[19].get("/profile/all/:id", checkDataToken, getProfileUserSettings);
    router[19].get("/profile/detail/:id", checkAccessToken, getProfileUserSettingDetail);
    router[19].get("/profile/top/:statchoice", checkDataToken, getProfileTopSetting);
    router[19].post("/", checkAccessToken, createUserSetting);
    router[19].put("/:id", checkAccessToken, updateUserSetting);
    router[19].delete("/:id", checkAccessToken, deleteUserSetting);  
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/user_account_app_setting`, router[19]);
    //service db app_portfolio user account app setting like
    router.push(Router());
    router[20].use(serverRouterLog);
    router[20].post("/:id", checkAccessToken, likeUserSetting);
    router[20].delete("/:id", checkAccessToken, unlikeUserSetting);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/user_account_app_setting_like`, router[20]);
    //service db app_portfolio user account app setting view
    router.push(Router());
    router[21].use(serverRouterLog);
    router[21].post("/", checkDataToken, insertUserSettingView);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/user_account_app_setting_view`, router[21]);
    //service db app_portfolio user account follow
    router.push(Router());
    router[22].use(serverRouterLog);
    router[22].post("/:id", checkAccessToken, followUser);
    router[22].delete("/:id", checkAccessToken, unfollowUser);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/user_account_follow`, router[22]);
    //service db app_portfolio user account like
    router.push(Router());
    router[23].use(serverRouterLog);
    router[23].post("/:id", checkAccessToken, likeUser);
    router[23].delete("/:id", checkAccessToken, unlikeUser);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/user_account_like`, router[23]);
    //service db app_portfolio user account logon
    router.push(Router());
    router[24].use(serverRouterLog);
    router[24].get("/admin/:user_account_id/:app_id",  checkAccessTokenAdmin, getUserAccountLogonAdmin);
    app.use(`${rest_resource_service}/db${rest_resource_service_db_schema}/user_account_logon`, router[24]);
    //service forms
    router.push(Router());
    router[25].use(serverRouterLog);
    router[25].post("/admin/secure", checkAdmin, getFormAdminSecure);
    app.use(`${rest_resource_service}/forms`, router[25]);
    //service geolocation
    router.push(Router());
    router[26].use(serverRouterLog);
    router[26].get("/place", checkDataToken, getPlace);
    router[26].get("/place/admin", checkAccessTokenAdmin, getPlaceAdmin);
    router[26].get("/place/systemadmin", checkAdmin, getPlaceSystemAdmin);
    router[26].get("/ip", checkDataToken, getIp);
    router[26].get("/ip/admin", checkAccessTokenAdmin, getIpAdmin);
    router[26].get("/ip/systemadmin", checkAdmin, getIpSystemAdmin);
    router[26].get("/timezone", checkDataToken, getTimezone);
    router[26].get("/timezone/admin", checkAccessTokenAdmin, getTimezoneAdmin);
    router[26].get("/timezone/systemadmin", checkAdmin, getTimezoneSystemAdmin);    
    app.use(`${rest_resource_service}/geolocation`, router[26]);
    //service log
    router.push(Router());
    router[27].use(serverRouterLog);
    router[27].get("/parameters", checkAdmin, getLogParameters);
    router[27].get("/logs", checkAdmin, getLogs);
    router[27].get("/files", checkAdmin, getFiles);
    router[27].get("/pm2logs", checkAdmin, getPM2Logs);
    app.use(`${rest_resource_service}/log`, router[27]);
    //service mail
    router.push(Router());
    router[28].use(serverRouterLog);
    router[28].get("/logo", getLogo);
    app.use(`${rest_resource_service}/mail`, router[28]);
    //service report
    router.push(Router());
    router[29].use(serverRouterLog);
    router[29].get("/", getReport);
    app.use(`${rest_resource_service}/report`, router[29]);
    //service worldcities
    router.push(Router());
    router[30].use(serverRouterLog);
    router[30].get("/:country", checkDataToken, getCities);
    app.use(`${rest_resource_service}/worldcities`, router[30]);
}
const serverExpress = async () => {
    const {default: express} = await import('express');
    const {CheckFirstTime, ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);
    const {policy_directives} = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/auth/auth.controller.js`);
    const {default: compression} = await import('compression');
    const {default: helmet} = await import('helmet');
    const { check_request, access_control} = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/auth/auth.controller.js`);
    const {createLogServerI, createLogServerE} = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/log/log.service.js`);    
    return new Promise((resolve, reject) =>{
        const app = express();
        //
        //MIDDLEWARES
        //
        //use compression for better performance
        const shouldCompress = (req, res) => {
            //exclude broadcast messages
            if (req.baseUrl == '/service/broadcast')
                return false;
            else
                return true;
            }
        app.use(compression({ filter: shouldCompress }))
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
    const {BroadcastCheckMaintenance} = await import(`file://${process.cwd()}/service/broadcast/broadcast.service.js`);
    const fs = await import('node:fs');
    const https = await import('node:https');
    process.env.TZ = 'UTC';
    InitConfig().then(() => {
        import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/log/log.service.js`).then(({createLogServerI})=>{
            DBStart().then((result) => {
                //Get express app with all configurations
                serverExpress().then((app)=>{
                    import(`file://${process.cwd()}/apps/index.js`).then(({AppsStart})=>{
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

export {ConfigGetCallBack, ConfigMaintenanceSet, ConfigMaintenanceGet, ConfigGetSaved, ConfigSave, CheckFirstTime,
        CreateSystemAdmin, ConfigInfo, Info, 
        ConfigGet, InitConfig, serverStart};