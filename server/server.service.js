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
let CONFIG_APPS;
let SLASH;
if (process.platform == 'win32')
    SLASH = '\\';
else
    SLASH = '/';
//initial config with file paths and maintenance parameter
let SERVER_CONFIG_INIT_PATH = `${SLASH}config${SLASH}config_init.json`;

const app_portfolio_title = 'App Portfolio';

const CreateRandomString =()=>{
    let randomstring = "";
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    for (let i = 0; i < 256; i++) {
        randomstring += chars[Math.floor(Math.random() * chars.length)] + Math.floor(1 + Math.random() * 10);
    }
    return randomstring;
}

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
            [6, JSON.parse(CONFIG_INIT)['FILE_CONFIG_AUTH_USER']],
            [7, JSON.parse(CONFIG_INIT)['FILE_CONFIG_APPS']]
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
            let config = JSON.parse(CONFIG);
            if (config_group ==null && parameter==null)
                return config;
            else{
                for (let config_parameter_row of config[config_group]){
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
            return JSON.parse(CONFIG_POLICY)['content-security-policy'];
        } 
        case 5:{
            //LOGS path
            return config_files()[5];
        } 
        case 6:{
            //ADMIN username and password
            return JSON.parse(CONFIG_USER);
        } 
        case 7:{
            //APPS 
            switch(parameter){
                //config_group = subdomain requested, return app id for given subdomain
                case 'SUBDOMAIN':{
                    switch (config_group.split('.')[0]){
                        case 'localhost':
                        case 'www':{
                            //localhost
                            return JSON.parse(CONFIG_APPS)['APPS'].filter((app)=>{return app.SUBDOMAIN == 'www'})[0].APP_ID;
                        }
                        default:{
                            return JSON.parse(CONFIG_APPS)['APPS'].filter((app)=>{return config_group.split('.')[0] == app.SUBDOMAIN})[0].APP_ID;
                        }
                    }
                    break;
                }
                //config_group = app id, return parameter value for given app id
                case 'SHOWINFO':
                case 'SHOWPARAM':
                case 'ENDPOINT':
                case 'PATH':
                case 'CLIENT_ID':
                case 'CLIENT_SECRET':
                case 'DATA_SECRET':
                case 'DATA_EXPIRE':
                case 'ACCESS_SECRET':
                case 'ACCESS_EXPIRE':{
                    return JSON.parse(CONFIG_APPS)['APPS'].filter((app)=>{return app.APP_ID == config_group})[0][parameter];
                    break;
                }
                //config_group = app id or null, return all apps or given app id without secret
                case 'APPS':{
                    let apps_no_secrets = JSON.parse(CONFIG_APPS)['APPS'];
                    apps_no_secrets = apps_no_secrets.filter((app)=>{ 
                                                            return app.APP_ID == config_group || config_group == null}
                                                            )
                    
                    apps_no_secrets.map((app)=>{
                        delete app.CLIENT_ID;
                        delete app.CLIENT_SECRET;
                        delete app.DATA_SECRET;
                        delete app.DATA_EXPIRE;
                        delete app.ACCESS_SECRET;
                        delete app.ACCESS_EXPIRE;
                    })                    
                    return apps_no_secrets;
                }
            }
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
        const create_config_and_logs_dir = async () => {
            const fs = await import('node:fs');
            const mkdir = async (dir) =>{
                let result_mkdir = await fs.promises.mkdir(process.cwd() + dir)
                .catch((error)=>{
                    throw error;
                })
            }
            for (let dir of ['/config', '/service/logs','/logs', '/service/pdf/config']){
                let check_dir = await fs.promises.access(process.cwd() + dir)
                .catch(()=>{
                    mkdir(dir);  
                });
            }
        }
        create_config_and_logs_dir()
        .then(() => {
            let i = 0;
            //read all default files
            let default_files = [
                                    [1, `default_config.json`],
                                    [2, `default_auth_blockip.json`],
                                    [3, `default_auth_useragent.json`],
                                    [4, `default_auth_policy.json`],
                                    [6, `default_auth_user.json`],
                                    [7, `default_apps.json`],
                                    [8, `default_service_pdf_config.json`]
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
                        config_json[0]['SERVER'].map(row=>{
                            for (let key of Object.keys(row)){
                                if (key=='HTTPS_KEY'){
                                    row.HTTPS_KEY = `${SLASH}config${SLASH}ssl${SLASH}${Object.values(row)[i]}`;
                                }
                                if (key=='HTTPS_CERT'){
                                    row.HTTPS_CERT = `${SLASH}config${SLASH}ssl${SLASH}${Object.values(row)[i]}`;
                                }
                            } 
                        })
                        //generate hash
                        config_json[0]['SERVICE_AUTH'].map(row=>{
                            for (let key of Object.keys(row))
                                if (key== 'ADMIN_TOKEN_SECRET'){
                                    row.ADMIN_TOKEN_SECRET = createHash('sha256').update(CreateRandomString()).digest('hex');
                                }
                        })
                        config_json[0] = JSON.stringify(config_json[0]);
        
                        config_json[4] = JSON.parse(config_json[4]);
                        config_json[4]['created'] = new Date().toISOString();
                        config_json[4] = JSON.stringify(config_json[4], undefined, 2);
                        
                        //generate hash for apps
                        config_json[5] = JSON.parse(config_json[5]);
                        config_json[5]['APPS'].map(row=>{
                            row.CLIENT_ID = createHash('sha256').update(CreateRandomString()).digest('hex');
                            row.CLIENT_SECRET = createHash('sha256').update(CreateRandomString()).digest('hex');
                            row.DATA_SECRET = createHash('sha256').update(CreateRandomString()).digest('hex');
                            row.ACCESS_SECRET = createHash('sha256').update(CreateRandomString()).digest('hex');
                        })
                        config_json[5] = JSON.stringify(config_json[5], undefined, 2);
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
                                            "FILE_CONFIG_AUTH_USER":`${SLASH}config${SLASH}auth_user.json`,
                                            "FILE_CONFIG_APPS":`${SLASH}config${SLASH}apps.json`
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
                                    for (let config_no=0;config_no<config_json.length;config_no++){;
                                        if (config_no == 6){
                                            //create default service pdf config not part of server parameter management
                                            fs.writeFile(process.cwd() + `${SLASH}service${SLASH}pdf${SLASH}config${SLASH}config.json`, JSON.stringify(JSON.parse(config_json[config_no]), undefined,2),  'utf8', (err) => {
                                                if (err)
                                                    reject(err);
                                                else
                                                    if (config_created== config_json.length - 1)
                                                        resolve();
                                                    else
                                                        config_created++;
                                            })
                                        }
                                        else{
                                            //send fileno in file array
                                            ConfigSave(default_files[config_no][0], JSON.parse(config_json[config_no]), true, (err, result)=>{
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
                                        case 7:{
                                            CONFIG_APPS = fileBuffer.toString();
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
    7 = apps            path + file
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
                                case 6:{
                                    CONFIG_APPS = config_json;
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
                    config_json['configuration'] = app_portfolio_title;
                    config_json['comment'] = '';
                    config_json['created'] = new Date().toISOString();
                    config_json['modified'] = '';
                }
                config_json = JSON.stringify(config_json, undefined, 2);
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
const CreateSystemAdmin = async (admin_name, admin_password, callBack) => {
    const { default: {genSaltSync, hashSync} } = await import("bcryptjs");
    let json = JSON.parse(CONFIG_USER);
    json['username'] = admin_name;
    json['password'] = hashSync(admin_password, genSaltSync(10));
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
    next();
    /*
    import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogAppRI}) => {
        createLogAppRI(req.query.app_id, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), req.body,
                    req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, res.statusCode, 
                    req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(() => {
            next();
        })
    })
    */
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
    //server (ConfigGet function from controller to mount on router)
    const { ConfigMaintenanceGet, ConfigMaintenanceSet, ConfigGet:ConfigGetController, ConfigGetSaved, ConfigSave, ConfigInfo, Info} = await import(`file://${process.cwd()}/server/server.controller.js`);
    //apps
    const { BFF, BFF_noauth, BFF_auth} = await import(`file://${process.cwd()}/apps/apps.controller.js`);
    //auth
    const { checkAccessToken, checkDataToken, checkDataTokenRegistration, checkDataTokenLogin,
            checkAccessTokenAdmin, checkAccessTokenSuperAdmin, checkClientAccess} = await import(`file://${process.cwd()}/server/auth/auth.controller.js`);
    //auth admin
    const { authSystemAdmin, checkSystemAdmin} = await import(`file://${process.cwd()}/server/auth/admin/admin.controller.js`);
    //broadcast
    const { BroadcastConnect, BroadcastSendSystemAdmin, BroadcastSendAdmin, ConnectedList, ConnectedListSystemAdmin, ConnectedCount, ConnectedUpdate, ConnectedCheck} = await import(`file://${process.cwd()}/server/broadcast/broadcast.controller.js`);
    //log
    const {getLogParameters, getLogs, getFiles, getPM2Logs} = await import(`file://${process.cwd()}/server/log/log.controller.js`);    
    //server db api admin
    const { DBInfo, DBInfoSpace, DBInfoSpaceSum, demo_add, demo_delete, demo_get, install_db, install_db_check, install_db_delete } = await import(`file://${process.cwd()}/server/dbapi/admin/admin.controller.js`);
    //server db api app_portfolio app
    const { getApp, getAppsAdmin, updateAppAdmin } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app/app.controller.js`);
    //server db api app_portfolio app category
    const {getAppCategoryAdmin} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_category/app_category.controller.js`);
    //server db api app_portfolio app log
    const { getLogsAdmin, getStatUniqueVisitorAdmin} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_log/app_log.controller.js`);
    //server db api app_portfolio app object
    const { getObjects } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_object/app_object.controller.js`);
    //server db api app_portfolio app parameter
    const { getParameters, getParametersAdmin, getParametersAllAdmin, setParameter_admin, setParameterValue_admin } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_parameter/app_parameter.controller.js`);
    //server db api app_portfolio app role
    const { getAppRoleAdmin} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_role/app_role.controller.js`);
    //server db api app_portfolio country
    const { getCountries } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/country/country.controller.js`);
    //server db api app_portfolio identity provider
    const { getIdentityProviders} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/identity_provider/identity_provider.controller.js`);
    //server db api app_portfolio locale
    const { getLocales } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/language/locale/locale.controller.js`);
    //server db api app_portfolio message translation
    const { getMessage } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/message_translation/message_translation.controller.js`);
    //server db api app_portfolio parameter type
    const { getParameterTypeAdmin} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/parameter_type/parameter_type.controller.js`);
    //server db api app_portfolio setting
    const { getSettings } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/setting/setting.controller.js`);
    //server db api app_portfolio user account
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
        searchProfileUser} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account/user_account.controller.js`);
    //server db api app_portfolio user account app
    const { createUserAccountApp, getUserAccountApps, getUserAccountApp, updateUserAccountApp, deleteUserAccountApps} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_app/user_account_app.controller.js`);

    const { createUserSetting, 
            getUserSettingsByUserId, 
            getProfileUserSetting,
            getProfileUserSettings,
            getProfileUserSettingDetail,
            getProfileTopSetting,
            getUserSetting,
            updateUserSetting, 
            deleteUserSetting} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_app_setting/user_account_app_setting.controller.js`);
    const { likeUserSetting, unlikeUserSetting} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_app_setting_like/user_account_app_setting_like.controller.js`);
    const { insertUserSettingView} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_app_setting_view/user_account_app_setting_view.controller.js`);

    //server db api db app_portfolio user account follow
    const { followUser, unfollowUser} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_follow/user_account_follow.controller.js`);
    //server db api app_portfolio user account like
    const { likeUser, unlikeUser} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_like/user_account_like.controller.js`);
    //server db api app_portfolio user account logon
    const { getUserAccountLogonAdmin} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_logon/user_account_logon.controller.js`);
    
    //ConfigGet function in service.js used to get parameter values
    const rest_resource_service = ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE');
    const rest_resource_service_db_schema = ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA');
    const rest_resouce_server = ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVER');
    
    app.route('/apps/bff').delete               (serverRouterLog, checkDataToken, BFF);
    app.route('/apps/bff').get                  (serverRouterLog, checkDataToken, BFF);
    app.route('/apps/bff').patch                (serverRouterLog, checkDataToken, BFF);
    app.route('/apps/bff').post                 (serverRouterLog, checkDataToken, BFF);
    app.route('/apps/bff').put                  (serverRouterLog, checkDataToken, BFF);
    app.route('/apps/bff/access').delete        (serverRouterLog, checkAccessToken, BFF);
    app.route('/apps/bff/access').get           (serverRouterLog, checkAccessToken, BFF);
    app.route('/apps/bff/access').patch         (serverRouterLog, checkAccessToken, BFF);
    app.route('/apps/bff/access').post          (serverRouterLog, checkAccessToken, BFF);
    app.route('/apps/bff/access').put           (serverRouterLog, checkAccessToken, BFF);
    app.route('/apps/bff/admin').delete         (serverRouterLog, checkAccessTokenAdmin, BFF);
    app.route('/apps/bff/admin').get            (serverRouterLog, checkAccessTokenAdmin, BFF);
    app.route('/apps/bff/admin').patch          (serverRouterLog, checkAccessTokenAdmin, BFF);
    app.route('/apps/bff/admin').post           (serverRouterLog, checkAccessTokenAdmin, BFF);
    app.route('/apps/bff/admin').put            (serverRouterLog, checkAccessTokenAdmin, BFF);
    app.route('/apps/bff/systemadmin').delete   (serverRouterLog, checkSystemAdmin, BFF);
    app.route('/apps/bff/systemadmin').get      (serverRouterLog, checkSystemAdmin, BFF);
    app.route('/apps/bff/systemadmin').patch    (serverRouterLog, checkSystemAdmin, BFF);
    app.route('/apps/bff/systemadmin').post     (serverRouterLog, checkSystemAdmin, BFF);
    app.route('/apps/bff/systemadmin').put      (serverRouterLog, checkSystemAdmin, BFF);    
    app.route('/apps/bff/noauth').get           (serverRouterLog, BFF_noauth);
    app.route('/apps/bff/auth').post            (serverRouterLog, BFF_auth);

    app.route(`${rest_resouce_server}/auth/admin`).post                                  (serverRouterLog, authSystemAdmin);

    app.route(`${rest_resouce_server}/config/systemadmin`).put                           (serverRouterLog, checkSystemAdmin, ConfigSave);
    app.route(`${rest_resouce_server}/config/systemadmin`).get                           (serverRouterLog, checkSystemAdmin, ConfigGetController);
    app.route(`${rest_resouce_server}/config/systemadmin/saved`).get                     (serverRouterLog, checkSystemAdmin, ConfigGetSaved);
    app.route(`${rest_resouce_server}/config/systemadmin/maintenance`).get               (serverRouterLog, checkSystemAdmin, ConfigMaintenanceGet);
    app.route(`${rest_resouce_server}/config/systemadmin/maintenance`).patch             (serverRouterLog, checkSystemAdmin, ConfigMaintenanceSet);
    app.route(`${rest_resouce_server}/config/info`).get                                  (serverRouterLog, checkSystemAdmin, ConfigInfo);
    app.route(`${rest_resouce_server}/info`).get                                         (serverRouterLog, checkSystemAdmin, Info);
    app.route(`${rest_resouce_server}/config/admin`).get                                 (serverRouterLog, checkAccessTokenAdmin, ConfigGetController);

    app.route(`${rest_resouce_server}/broadcast/message/SystemAdmin`).post               (serverRouterLog, checkSystemAdmin, BroadcastSendSystemAdmin);
    app.route(`${rest_resouce_server}/broadcast/message/Admin`).post                     (serverRouterLog, checkAccessTokenAdmin, BroadcastSendAdmin);
    app.route(`${rest_resouce_server}/broadcast/connection/SystemAdmin`).get             (serverRouterLog, checkSystemAdmin, ConnectedListSystemAdmin);
    app.route(`${rest_resouce_server}/broadcast/connection/SystemAdmin`).patch           (serverRouterLog, checkSystemAdmin, ConnectedUpdate);
    app.route(`${rest_resouce_server}/broadcast/connection/Admin`).get                   (serverRouterLog, checkAccessTokenAdmin, ConnectedList);
    app.route(`${rest_resouce_server}/broadcast/connection/Admin/count`).get             (serverRouterLog, checkAccessTokenAdmin, ConnectedCount);
    app.route(`${rest_resouce_server}/broadcast/connection/connect`).get                 (serverRouterLog, BroadcastConnect);
    app.route(`${rest_resouce_server}/broadcast/connection`).patch                       (serverRouterLog, checkDataToken, ConnectedUpdate);
    app.route(`${rest_resouce_server}/broadcast/connection/check/:user_account_id`).get  (serverRouterLog, checkDataToken, ConnectedCheck);

    app.route(`${rest_resouce_server}/dbapi/admin/DBInfo`).get(serverRouterLog, checkSystemAdmin, DBInfo);
    app.route(`${rest_resouce_server}/dbapi/admin/DBInfoSpace`).get(serverRouterLog, checkSystemAdmin, DBInfoSpace);
    app.route(`${rest_resouce_server}/dbapi/admin/DBInfoSpaceSum`).get(serverRouterLog, checkSystemAdmin, DBInfoSpaceSum);
    app.route(`${rest_resouce_server}/dbapi/admin/demo`).post(serverRouterLog, checkSystemAdmin, demo_add);
    app.route(`${rest_resouce_server}/dbapi/admin/demo`).get(serverRouterLog, checkSystemAdmin, demo_get);
    app.route(`${rest_resouce_server}/dbapi/admin/demo`).delete(serverRouterLog, checkSystemAdmin, demo_delete);
    app.route(`${rest_resouce_server}/dbapi/admin/install`).post(serverRouterLog, checkSystemAdmin, install_db);
    app.route(`${rest_resouce_server}/dbapi/admin/install`).get(serverRouterLog, checkSystemAdmin, install_db_check);
    app.route(`${rest_resouce_server}/dbapi/admin/install`).delete(serverRouterLog, checkSystemAdmin, install_db_delete);

    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/apps`).get(serverRouterLog, checkDataToken, getApp);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/apps/admin`).get(serverRouterLog, checkAccessTokenAdmin, getAppsAdmin);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/apps/admin/:id`).put(serverRouterLog, checkAccessTokenAdmin, updateAppAdmin);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/app_category/admin`).get(serverRouterLog, checkAccessTokenAdmin, getAppCategoryAdmin);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/app_log/admin`).get(serverRouterLog, checkAccessTokenAdmin, getLogsAdmin);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/app_log/admin/stat/uniquevisitor`).get(serverRouterLog, checkAccessTokenAdmin, getStatUniqueVisitorAdmin);    
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/app_object/:lang_code`).get(serverRouterLog, checkDataToken, getObjects);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/app_object/admin/:lang_code`).get(serverRouterLog, checkDataToken, getObjects);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/app_parameter/admin/all/:app_id`).get(serverRouterLog, checkAccessTokenAdmin, getParametersAllAdmin);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/app_parameter/admin`).put(serverRouterLog, checkAccessTokenAdmin, setParameter_admin);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/app_parameter/admin/value`).patch(serverRouterLog, checkAccessTokenAdmin, setParameterValue_admin);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/app_parameter/admin/:app_id`).get(serverRouterLog, checkDataToken, getParametersAdmin);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/app_parameter/:app_id`).get(serverRouterLog, checkDataToken, getParameters);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/app_role/admin`).get(serverRouterLog, checkAccessTokenAdmin, getAppRoleAdmin);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/country/:lang_code`).get(serverRouterLog,  checkDataToken, getCountries);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/identityprovider`).get(serverRouterLog,  checkDataToken, getIdentityProviders);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/language/locale/:lang_code`).get(serverRouterLog,  checkDataToken, getLocales);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/language/locale/admin/:lang_code`).get(serverRouterLog,  checkDataToken, getLocales);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/message_translation/:code`).get(serverRouterLog,  checkDataToken, getMessage);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/parameter_type/admin`).get(serverRouterLog, checkAccessTokenAdmin, getParameterTypeAdmin);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/settings`).get(serverRouterLog, checkDataToken, getSettings);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/settings/admin`).get(serverRouterLog, checkDataToken, getSettings);

    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/admin/count`).get(serverRouterLog, checkAccessTokenAdmin, getStatCountAdmin);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/admin`).get(serverRouterLog, checkAccessTokenAdmin, getUsersAdmin);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/admin/:id`).put(serverRouterLog, checkAccessTokenSuperAdmin, updateUserSuperAdmin);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/login`).put(serverRouterLog, checkDataTokenLogin, userLogin);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/signup`).post(serverRouterLog, checkDataTokenRegistration, userSignup);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/activate/:id`).put(serverRouterLog, checkDataToken, activateUser);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/forgot`).put(serverRouterLog, checkDataToken, passwordResetUser);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/password/:id`).put(serverRouterLog, checkAccessToken, updatePassword);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/:id`).put(serverRouterLog, checkAccessToken, updateUserLocal);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/provider/:id`).put(serverRouterLog, checkDataTokenLogin, providerSignIn);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/:id`).get(serverRouterLog, checkAccessToken, getUserByUserId);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/common/:id`).put(serverRouterLog, checkAccessToken, updateUserCommon);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/:id`).delete(serverRouterLog, checkAccessToken, deleteUser);    
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/profile/detail:id`).get(serverRouterLog, checkAccessToken, getProfileDetail);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/profile/top/:statchoice`).get(serverRouterLog, checkDataToken, getProfileTop);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/profile/id/:id`).post(serverRouterLog, checkDataToken, getProfileUser);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/profile/username`).post(serverRouterLog, checkDataToken, getProfileUser);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/profile/username/searchD`).post(serverRouterLog, checkDataToken, searchProfileUser);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/profile/username/searchA`).post(serverRouterLog, checkAccessToken, searchProfileUser);

    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app/`).post(serverRouterLog, checkAccessToken, createUserAccountApp);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app/:user_account_id`).get(serverRouterLog, checkAccessToken, getUserAccountApp);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app/apps/:user_account_id`).get(serverRouterLog, checkAccessToken, getUserAccountApps);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app/:user_account_id`).patch(serverRouterLog, checkAccessToken, updateUserAccountApp);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app/:user_account_id/:app_id`).delete(serverRouterLog, checkAccessToken, deleteUserAccountApps);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app_setting/:id`).get(serverRouterLog, checkDataToken, getUserSetting);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app_setting/user_account_id/:id`).get(serverRouterLog, checkDataToken, getUserSettingsByUserId);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app_setting/profile/:id`).get(serverRouterLog, checkDataToken, getProfileUserSetting);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app_setting/profile/all/:id`).get(serverRouterLog, checkDataToken, getProfileUserSettings);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app_setting/profile/detail/:id`).get(serverRouterLog, checkDataToken, getProfileUserSettingDetail);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app_setting/profile/top//:statchoice`).get(serverRouterLog, checkDataToken, getProfileTopSetting);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app_setting`).post(serverRouterLog, checkAccessToken, createUserSetting);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app_setting/:id`).put(serverRouterLog, checkAccessToken, updateUserSetting);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app_setting/:id`).delete(serverRouterLog, checkAccessToken, deleteUserSetting);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app_setting_like/:id`).post(serverRouterLog, checkAccessToken, likeUserSetting);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app_setting_like/:id`).delete(serverRouterLog, checkAccessToken, unlikeUserSetting);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app_setting_view`).post(serverRouterLog, checkDataToken, insertUserSettingView);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_follow/:id`).post(serverRouterLog, checkAccessToken, followUser);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_follow/:id`).delete(serverRouterLog, checkAccessToken, unfollowUser);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_like/:id`).post(serverRouterLog, checkAccessToken, likeUser);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_like/:id`).delete(serverRouterLog, checkAccessToken, unlikeUser);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_logon/admin/:user_account_id/:app_id`).get(serverRouterLog, checkAccessTokenAdmin, getUserAccountLogonAdmin);

    app.route(`${rest_resouce_server}/log/parameters`).get                               (serverRouterLog, checkSystemAdmin, getLogParameters);
    app.route(`${rest_resouce_server}/log/logs`).get                                     (serverRouterLog, checkSystemAdmin, getLogs);
    app.route(`${rest_resouce_server}/log/files`).get                                    (serverRouterLog, checkSystemAdmin, getFiles);
    app.route(`${rest_resouce_server}/log/pm2logs`).get                                  (serverRouterLog, checkSystemAdmin, getPM2Logs);

    //microservices
    //service geolocation
    const { getPlace, getIp, getTimezone, getTimezoneAdmin, getTimezoneSystemAdmin} = await import(`file://${process.cwd()}/service/geolocation/geolocation.controller.js`);
    //service worldcities
    const { getCities} = await import(`file://${process.cwd()}/service/worldcities/worldcities.controller.js`);
    
    app.route(`${rest_resource_service}/geolocation/place`).get(serverRouterLog, checkDataToken, getPlace);
    app.route(`${rest_resource_service}/geolocation/place/admin`).get(serverRouterLog, checkAccessTokenAdmin, getPlace);
    app.route(`${rest_resource_service}/geolocation/place/systemadmin`).get(serverRouterLog, checkSystemAdmin, getPlace);
    app.route(`${rest_resource_service}/geolocation/ip`).get(serverRouterLog, checkDataToken, getIp);
    app.route(`${rest_resource_service}/geolocation/ip/admin`).get(serverRouterLog, checkAccessTokenAdmin, getIp);
    app.route(`${rest_resource_service}/geolocation/ip/systemadmin`).get(serverRouterLog, checkSystemAdmin, getIp);
    app.route(`${rest_resource_service}/geolocation/timezone`).get(serverRouterLog, checkDataToken, getTimezone);
    app.route(`${rest_resource_service}/geolocation/timezone/admin`).get(serverRouterLog, checkAccessTokenAdmin, getTimezoneAdmin);
    app.route(`${rest_resource_service}/geolocation/timezone/systemadmin`).get(serverRouterLog, checkSystemAdmin, getTimezoneSystemAdmin);
    app.route(`${rest_resource_service}/worldcities/:country`).get(serverRouterLog, checkDataToken, getCities);
}
const serverExpress = async () => {
    const {default: express} = await import('express');
    const {CheckFirstTime, ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);
    const {default: compression} = await import('compression');
    const { check_request, access_control} = await import(`file://${process.cwd()}/server/auth/auth.controller.js`);
    const {createLogServerI, createLogServerE} = await import(`file://${process.cwd()}/server/log/log.service.js`);
    const ContentSecurityPolicy = ConfigGet(4);
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
        app.use((req, res, next) => {
            res.setHeader('Access-Control-Max-Age','5');
            res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, Content-Type, Accept');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
            if (ConfigGet(1, 'SERVICE_AUTH', 'ENABLE_CONTENT_SECURITY_POLICY') == '1')
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
            if (CheckFirstTime() && req.headers.host.startsWith('admin') == false && req.headers.referer==undefined)
            return res.redirect(`http://admin.${req.headers.host.lastIndexOf('.')==-1?req.headers.host:req.headers.host.lastIndexOf('.')}`);
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
    })
}
const serverStart = async () =>{
    const {DBStart} = await import(`file://${process.cwd()}/server/dbapi/admin/admin.service.js`);
    const {BroadcastCheckMaintenance} = await import(`file://${process.cwd()}/server/broadcast/broadcast.service.js`);
    const fs = await import('node:fs');
    const https = await import('node:https');
    process.env.TZ = 'UTC';
    InitConfig().then(() => {
        import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogServerI})=>{
            
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
                                            DBStart();
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
}

export {COMMON, ConfigGetCallBack, ConfigMaintenanceSet, ConfigMaintenanceGet, ConfigGetSaved, ConfigSave, CheckFirstTime,
        CreateSystemAdmin, ConfigInfo, Info, 
        ConfigGet, InitConfig, serverStart, CreateRandomString};