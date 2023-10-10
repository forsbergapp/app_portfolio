// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

//use config variables for the frequent used configurations for faster performance
//to avoid readfile async and diskusage
//variables are updated when admin updates config
/**@type{Types.config_init} */
let CONFIG_INIT;
/**@type{object} */
let CONFIG;
/**@type{object} */
let CONFIG_USER;
/**@type{Array.<Types.config_apps>} */
let CONFIG_APPS;
/**@type{string} */
let SLASH;
if (process.platform == 'win32')
    SLASH = '\\';
else
    SLASH = '/';
//initial config with file paths and maintenance parameter
const SERVER_CONFIG_INIT_PATH = `${SLASH}config${SLASH}config_init.json`;

const app_portfolio_title = 'App Portfolio';

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
 * Create random string
 * @returns {string}
 */
const CreateRandomString =()=>{
    let randomstring = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    for (let i = 0; i < 256; i++) {
        randomstring += chars[Math.floor(Math.random() * chars.length)] + Math.floor(1 + Math.random() * 10);
    }
    return randomstring;
};

/**
 * ES6 object with properties using concise method syntax
 */
const COMMON = {
    app_filename(/**@type{string}*/module){
        const from_app_root = ('file:///' + process.cwd().replace(/\\/g, '/')).length;
        return module.substring(from_app_root);
    },
    app_function(/**@type{Types.stack}*/stack){
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
        /**@type{*}*/
        const e = new Error();
        const frame = e.stack.split('\n')[2];
        const lineNumber = frame.split(':').reverse()[1];
        return lineNumber;
    }
};
const config_files = () => {
    return [
            [0, SERVER_CONFIG_INIT_PATH],
            [1, CONFIG_INIT['FILE_CONFIG_SERVER']],
            [2, CONFIG_INIT['FILE_CONFIG_AUTH_BLOCKIP']],
            [3, CONFIG_INIT['FILE_CONFIG_AUTH_USERAGENT']],
            [4, CONFIG_INIT['FILE_CONFIG_AUTH_POLICY']],
            [5, CONFIG_INIT['PATH_LOG']],
            [6, CONFIG_INIT['FILE_CONFIG_AUTH_USER']],
            [7, CONFIG_INIT['FILE_CONFIG_APPS']]
           ];
};
/**
 * Config get init
 * @param {string} parameter
 * @returns {string}
 */
 const ConfigGetInit = (parameter) => {
    /**@ts-ignore */
    return CONFIG_INIT[parameter];
 };
/**
 * Config get user
 * @param {string} parameter
 * @returns {string}
 */
 const ConfigGetUser = (parameter) => {
    /**@ts-ignore */
    return CONFIG_USER[parameter];
 };
/**
 * Config get apps
 * @returns {object}
 */
 const ConfigGetApps = () => {
    //copy without deleting keys from original object
    /**@type Array.<Types.config_apps>*/
    const apps_no_secrets = JSON.parse(
                                /**@ts-ignore */
                                JSON.stringify(CONFIG_APPS['APPS']));
    apps_no_secrets.map((app)=>{
        delete app.CLIENT_ID;
        delete app.CLIENT_SECRET;
        delete app.DATA_SECRET;
        delete app.DATA_EXPIRE;
        delete app.ACCESS_SECRET;
        delete app.ACCESS_EXPIRE;
    });                    
    return apps_no_secrets;
 };
/**
 * Config get app
 * @param {string|number} config_group
 * @param {string} parameter
 * @returns {object|null}
 */
 const ConfigGetApp = (config_group, parameter) => {
    switch(parameter){
        //config_group = subdomain requested, return app id for given subdomain
        case 'SUBDOMAIN':{
            switch (config_group.toString().split('.')[0]){
                case 'localhost':
                case 'www':{
                    //localhost
                    /**@ts-ignore */
                    return CONFIG_APPS['APPS'].filter(
                        (/**@type{Types.config_apps}*/app)=>{return app.SUBDOMAIN == 'www';})[0].APP_ID;
                }
                default:{
                    /**@ts-ignore */
                    return CONFIG_APPS['APPS'].filter(
                        (/**@type{Types.config_apps}*/app)=>{return config_group.toString().split('.')[0] == app.SUBDOMAIN;})[0].APP_ID;
                }
            }
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
            /**@ts-ignore */
            return CONFIG_APPS['APPS'].filter(
                (/**@type{Types.config_apps}*/app)=>{return app.APP_ID == config_group;})[0][parameter];
        }
        default:{
            return null;
        }
    }
 };
/**
 * Config get
 * @param {string} config_group
 * @param {string} parameter
 * @returns {string|null}
 */
const ConfigGet = (config_group, parameter) => {
    /**@ts-ignore */
    for (const config_parameter_row of CONFIG[config_group]){
        for (let i=0; i < Object.keys(config_parameter_row).length;i++){
            if (Object.keys(config_parameter_row)[i]==parameter){
                return Object.values(config_parameter_row)[i];
            }
        }
    }                
    return null;
};
/**
 * Config exists
 * @async
 * @returns {Promise<boolean>}
 */
const ConfigExists = async () => {
    return await new Promise((resolve) => {
        //load  initial config_init.json file if exists
        //if exists return
        import('node:fs').then((fs) => {
            fs.readFile(process.cwd() + SERVER_CONFIG_INIT_PATH, (err, result) => {
                if (err)
                    resolve(false);
                else{
                    CONFIG_INIT = JSON.parse(result.toString());
                    resolve(true);
                }
            });    
        });
    });
};
/**
 * Default config
 * @async
 * @throws {object}
 * @returns {Promise<null>}
 */
const DefaultConfig = async () => {
    return new Promise((resolve, reject) => {
        const create_config_and_logs_dir = async () => {
            const fs = await import('node:fs');
            const mkdir = async (/**@type{string} */dir) =>{
                await fs.promises.mkdir(process.cwd() + dir)
                .catch((error)=>{
                    throw error;
                });
            };
            for (const dir of ['/config', '/service/logs','/logs', '/service/pdf/config']){
                await fs.promises.access(process.cwd() + dir)
                .catch(()=>{
                    mkdir(dir);  
                });
            }
        };
        create_config_and_logs_dir()
        .then(() => {
            const i = 0;
            //read all default files
            /**@type{Array.<[number, string]>} */
            const default_files = [
                                    [1, 'default_config.json'],
                                    [2, 'default_auth_blockip.json'],
                                    [3, 'default_auth_useragent.json'],
                                    [4, 'default_auth_policy.json'],
                                    [6, 'default_auth_user.json'],
                                    [7, 'default_apps.json'],
                                    [8, 'default_service_pdf_config.json']
                                ];
            //ES2020 import() with ES6 promises, object destructuring
            import('node:fs').then(({promises: {readFile}}) => {
                
                Promise.all(default_files.map(file => {
                    return readFile(process.cwd() + '/server/' + file[1], 'utf8');
                })).then((/**@type{string[]}*/config_json) => {
                    import('node:crypto').then(({ createHash }) => {
                        const config_obj = [JSON.parse(config_json[0]),
                                            JSON.parse(config_json[1]),
                                            JSON.parse(config_json[2]),
                                            JSON.parse(config_json[3]),
                                            JSON.parse(config_json[4]),
                                            JSON.parse(config_json[5]),
                                            JSON.parse(config_json[6])];
                        //set server parameters
                        //update path
                        /**@ts-ignore */
                        config_obj[0]['SERVER'].map(row=>{
                            for (const key of Object.keys(row)){
                                if (key=='HTTPS_KEY'){
                                    row.HTTPS_KEY = `${SLASH}config${SLASH}ssl${SLASH}${Object.values(row)[i]}`;
                                }
                                if (key=='HTTPS_CERT'){
                                    row.HTTPS_CERT = `${SLASH}config${SLASH}ssl${SLASH}${Object.values(row)[i]}`;
                                }
                            } 
                        });
                        //generate hash
                        /**@ts-ignore */
                        config_obj[0]['SERVICE_AUTH'].map(row=>{
                            for (const key of Object.keys(row))
                                if (key== 'ADMIN_TOKEN_SECRET'){
                                    row.ADMIN_TOKEN_SECRET = createHash('sha256').update(CreateRandomString()).digest('hex');
                                }
                        });
                        //set created for user
                        config_obj[4]['created'] = new Date().toISOString();
                        //generate hash for apps
                        /**@ts-ignore */
                        config_obj[5]['APPS'].map(row=>{
                            row.CLIENT_ID = createHash('sha256').update(CreateRandomString()).digest('hex');
                            row.CLIENT_SECRET = createHash('sha256').update(CreateRandomString()).digest('hex');
                            row.DATA_SECRET = createHash('sha256').update(CreateRandomString()).digest('hex');
                            row.ACCESS_SECRET = createHash('sha256').update(CreateRandomString()).digest('hex');
                        });
                        //default server metadata
                        const config_init = {
                                            'CONFIGURATION': app_portfolio_title,
                                            'CREATED': `${new Date().toISOString()}`,
                                            'MODIFIED': '',
                                            'MAINTENANCE': '0',
                                            'FILE_CONFIG_SERVER': `${SLASH}config${SLASH}config.json`,
                                            'FILE_CONFIG_AUTH_BLOCKIP':`${SLASH}config${SLASH}auth_blockip.json`,
                                            'FILE_CONFIG_AUTH_USERAGENT':`${SLASH}config${SLASH}auth_useragent.json`,
                                            'FILE_CONFIG_AUTH_POLICY':`${SLASH}config${SLASH}auth_policy.json`,
                                            'PATH_LOG':`${SLASH}logs${SLASH}`,
                                            'FILE_CONFIG_AUTH_USER':`${SLASH}config${SLASH}auth_user.json`,
                                            'FILE_CONFIG_APPS':`${SLASH}config${SLASH}apps.json`
                                            };
                        //save initial config files with metadata including path to config files
                        import('node:fs').then((fs) => {
                            fs.writeFile(process.cwd() + SERVER_CONFIG_INIT_PATH, JSON.stringify(config_init, undefined, 2),  'utf8', (err) => {
                                if (err)
                                    reject(err);
                                else{
                                    //save in module variable
                                    CONFIG_INIT = config_init;
                                    let config_created=0;
                                    for (const config_row of Object.entries(config_obj)){
                                        if (parseInt(config_row[0]) == 6){
                                            //create default service pdf config not part of server parameter management
                                            fs.writeFile(process.cwd() + `${SLASH}service${SLASH}pdf${SLASH}config${SLASH}config.json`, JSON.stringify(config_row[1], undefined,2),  'utf8', (err) => {
                                                if (err)
                                                    reject(err);
                                                else
                                                    if (config_created== config_obj.length - 1)
                                                        resolve(null);
                                                    else
                                                        config_created++;
                                            });
                                        }
                                        else{
                                            //send fileno in file array
                                            /**@ts-ignore */
                                            ConfigSave(default_files[config_row[0]][0], config_row[1], true, (err)=>{
                                                if (err)
                                                    reject(err);
                                                else{
                                                    if (config_created== config_obj.length - 1)
                                                        resolve(null);
                                                    else
                                                        config_created++;
                                                }
                                            });
                                        }
                                    }
                                }
                            });
                        });
                    });
                });  
            });
        })
        .catch((err) => {
            reject(err);
         });  
    });
};
/**
 * Init config
 * @async
 * @throws {object}
 * @returns {Promise<null>}
 */
const InitConfig = async () => {
    return await new Promise((resolve, reject) => {
        const setVariables = async () => {
            return await new Promise((resolve, reject) => {
                const files = config_files();
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
                                            CONFIG_INIT = JSON.parse(fileBuffer.toString());
                                            break;
                                        }
                                        case 1:{
                                            CONFIG = JSON.parse(fileBuffer.toString());
                                            break;
                                        }
                                        case 6:{
                                            CONFIG_USER = JSON.parse(fileBuffer.toString());
                                            break;
                                        }
                                        case 7:{
                                            CONFIG_APPS = JSON.parse(fileBuffer.toString());
                                            break;
                                        }
                                        default:{
                                            break;
                                        }
                                    }
                                    //check if last, dont count skipped log path
                                    if (i == files.length -2)
                                        resolve(null);
                                    else
                                        i++;
                                }
                            });
                        });
                    }
                }
            });
        };
        ConfigExists().then((result) => {
            if (result==true)
                setVariables().then(() => {
                    resolve(null);
                })
                .catch(error=>{
                    reject (error);
                });
            else{
                DefaultConfig().then(() => {
                    setVariables().then(() => {
                        resolve(null);
                    })
                    .catch(error=>{
                        reject (error);
                    });
                });
            }
        });
    });
};

/**
 * Config callBack
 * @param {string} config_group
 * @param {string} parameter
 * @param {Types.callBack} callBack
 */
const ConfigGetCallBack = (config_group, parameter, callBack) => {
        callBack(null, ConfigGet(config_group, parameter));
    };
/**
 * Config maintenance set
 * @param {string} value
 * @param {Types.callBack} callBack
 */
const ConfigMaintenanceSet = (value, callBack) => {
    import('node:fs').then((fs) => {
        fs.readFile(process.cwd() + SERVER_CONFIG_INIT_PATH, 'utf8', (err, fileBuffer) => {
            if (err)
                callBack(err, null);
            else{
                const config_init = JSON.parse(fileBuffer.toString());
                config_init['MAINTENANCE'] = value;
                config_init['MODIFIED'] = new Date().toISOString();
                //maintenance in this config file is only updated so no need for backup files
                fs.writeFile(process.cwd() + SERVER_CONFIG_INIT_PATH, JSON.stringify(config_init, undefined, 2),  'utf8', (err) => {
                    if (err)
                        callBack(err, null);
                    else{
                        CONFIG_INIT = config_init;
                        callBack(null, null);
                    }
                });
            }
        });
    });
};
/**
 * Config maintenance get
 * @param {Types.callBack} callBack
 */
const ConfigMaintenanceGet = (callBack) => {
    import('node:fs').then((fs) => {
        fs.readFile(process.cwd() + SERVER_CONFIG_INIT_PATH, 'utf8', (err, fileBuffer) => {
            if (err)
                callBack(err, null);
            else
                callBack(null, JSON.parse(fileBuffer.toString())['MAINTENANCE']);
        });
    });
};
/**
 * Config get saved
 * @async
 * @param {string} config_type_no
 */
const ConfigGetSaved = async (config_type_no) => {
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
    
    const config_file = config_files().filter((file) => {
        return (file[0] == parseInt(config_type_no));
    })[0][1];
    const fs = await import('node:fs');
    const fileBuffer = await fs.promises.readFile(process.cwd() + config_file, 'utf8');
    return JSON.parse(fileBuffer.toString());
};
/**
 * Config save
 * @async
 * @param {number} config_no
 * @param {string} config_json
 * @param {boolean} first_time
 * @param {Types.callBack} callBack
 */
const ConfigSave = async (config_no, config_json, first_time, callBack) => {
    try {
        const write_config = async (/**@type{number}*/config_no, /**@type{string}*/config_file, /**@type{string}*/config_json) => {
            return new Promise((resolve, reject) => {
                import('node:fs').then((fs) => {
                    //write new config
                    fs.writeFile(process.cwd() + config_file, config_json,  'utf8', (err) => {
                        if (err)
                            reject(err);
                        else{
                            //update some frequent configurations in module variables for faster access
                            //for security reason  blockip and useragent configuration are not saved in variables
                            //config init and policy configuration are only used by admin and at start
                            switch (config_no){
                                case 1:{
                                    CONFIG = JSON.parse(config_json);
                                    break;
                                }
                                case 5:{
                                    CONFIG_USER = JSON.parse(config_json);
                                    break;
                                }
                                case 6:{
                                    CONFIG_APPS = JSON.parse(config_json);
                                    break;
                                }
                                default:{
                                    break;
                                }
                            }
                            resolve(null);
                        }
                    });
                });
            });
        };
        if (config_no){
            /**@type{*} */
            const config_file = config_files().filter((file) => {
                return (file[0] == config_no);
            })[0][1];
            if (first_time){
                if (config_no == 1){
                    //add metadata to server config
                    /**@ts-ignore */
                    config_json['configuration'] = app_portfolio_title;
                    /**@ts-ignore */
                    config_json['comment'] = '';
                    /**@ts-ignore */
                    config_json['created'] = new Date().toISOString();
                    /**@ts-ignore */
                    config_json['modified'] = '';
                }
                write_config(config_no, config_file, JSON.stringify(config_json, undefined, 2)).then(() => {
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
                                const old_config = result_read.toString();
                                //write backup of old file
                                fs.writeFile(process.cwd() + `${config_file}.${new Date().toISOString().replace(new RegExp(':', 'g'),'.')}`, old_config,  'utf8', (err) => {
                                    if (err)
                                        callBack(err, null);
                                    else{
                                        if (config_no == 1){
                                            //add metadata to server config
                                            /**@ts-ignore */
                                            config_json['configuration'] = app_portfolio_title;
                                            /**@ts-ignore */
                                            config_json['comment'] = '';
                                            /**@ts-ignore */
                                            config_json['created'] = JSON.parse(old_config)['created'];
                                            /**@ts-ignore */
                                            config_json['modified'] = new Date().toISOString();
                                        }  
                                        write_config(config_no, config_file, JSON.stringify(config_json, undefined, 2)).then(() => {
                                            callBack(null, null);
                                        });
                                    }
                                });
                            }
                        });
                    });
                }
            }
        }
    } catch (/**@type{*}*/ error) {
        callBack(error, null);
    }
};
/**
 * Check first time
 * @returns {boolean}
 */
const CheckFirstTime = () => {
    /**@ts-ignore */
    if (CONFIG_USER['username']=='')
        return true;
    else
        return false;
};
/**
 * Create system admin
 * @async
 * @param {string} admin_name
 * @param {string} admin_password
 * @param {Types.callBack} callBack
 */
const CreateSystemAdmin = async (admin_name, admin_password, callBack) => {
    const {genSaltSync, hashSync} = await import('bcryptjs');
    /**@ts-ignore */
    CONFIG_USER['username'] = admin_name;
    /**@ts-ignore */
    CONFIG_USER['password'] = hashSync(admin_password, genSaltSync(10));
    /**@ts-ignore */
    CONFIG_USER['modified'] = new Date().toISOString();
    import('node:fs').then((fs) => {
        fs.writeFile(process.cwd() + config_files()[6][1], JSON.stringify(CONFIG_USER, undefined, 2),  'utf8', (err) => {
            if (err)
                callBack(err, null);
            else
                callBack(null, null);
        });
    });
};
/**
 * Config info
 * @param {Types.callBack} callBack
 */
const ConfigInfo = (callBack) => {
    callBack(null, null);
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
                            'memoryusage_rss' : process.memoryUsage()['rss'],
                            'memoryusage_heaptotal' : process.memoryUsage()['heapTotal'],
                            'memoryusage_heapused' : process.memoryUsage()['heapUsed'],
                            'memoryusage_external' : process.memoryUsage()['external'],
                            'memoryusage_arraybuffers' : process.memoryUsage()['arrayBuffers'],
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
 * server Express Log error
 * @param {Types.express} app
 */
const serverExpressLogError = (app) =>{
    import(`file://${process.cwd()}/server/log/log.service.js`).then(({LogRequestE}) => {
        //ERROR LOGGING
        app.use((/**@type{string}*/err,/**@type{Types.req}*/req,/**@type{Types.res}*/res, /**@type{function}*/next) => {
            LogRequestE(req, res.statusCode, res.statusMessage, responsetime(res), err).then(() => {
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
    //server (ConfigGet function from controller to mount on router)
    const { ConfigMaintenanceGet, ConfigMaintenanceSet, ConfigGetApps, ConfigGet:ConfigGetController, ConfigGetSaved, ConfigSave, ConfigInfo, Info} = await import(`file://${process.cwd()}/server/server.controller.js`);
    //apps
    const { BFF, BFF_noauth, BFF_auth} = await import(`file://${process.cwd()}/apps/apps.controller.js`);
    //auth
    const { checkAccessToken, checkDataToken, checkDataTokenRegistration, checkDataTokenLogin,
            checkAccessTokenAdmin, checkAccessTokenSuperAdmin} = await import(`file://${process.cwd()}/server/auth/auth.controller.js`);
    //auth admin
    const { authSystemAdmin, checkSystemAdmin} = await import(`file://${process.cwd()}/server/auth/admin/admin.controller.js`);
    //broadcast
    const { BroadcastConnect, BroadcastSendSystemAdmin, BroadcastSendAdmin, ConnectedList, ConnectedListSystemAdmin, ConnectedCount, ConnectedUpdate, ConnectedCheck} = await import(`file://${process.cwd()}/server/broadcast/broadcast.controller.js`);
    //log
    const {getLogParameters, getLogs, getStatusCodes, getLogsStats, getFiles} = await import(`file://${process.cwd()}/server/log/log.controller.js`);    
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
    const { getParametersAllAdmin, setParameter_admin, setParameterValue_admin } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_parameter/app_parameter.controller.js`);
    //server db api app_portfolio app role
    const { getAppRoleAdmin} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_role/app_role.controller.js`);
    //server db api app_portfolio country
    const { getCountries } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/country/country.controller.js`);
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
    const rest_resource_service_db_schema = ConfigGet('SERVICE_DB', 'REST_RESOURCE_SCHEMA');
    const rest_resouce_server = ConfigGet('SERVER', 'REST_RESOURCE_SERVER');
    
    app.route('/apps/bff').delete               (checkDataToken, BFF);
    app.route('/apps/bff').get                  (checkDataToken, BFF);
    app.route('/apps/bff').patch                (checkDataToken, BFF);
    app.route('/apps/bff').post                 (checkDataToken, BFF);
    app.route('/apps/bff').put                  (checkDataToken, BFF);
    app.route('/apps/bff/access').delete        (checkAccessToken, BFF);
    app.route('/apps/bff/access').get           (checkAccessToken, BFF);
    app.route('/apps/bff/access').patch         (checkAccessToken, BFF);
    app.route('/apps/bff/access').post          (checkAccessToken, BFF);
    app.route('/apps/bff/access').put           (checkAccessToken, BFF);
    app.route('/apps/bff/admin').delete         (checkAccessTokenAdmin, BFF);
    app.route('/apps/bff/admin').get            (checkAccessTokenAdmin, BFF);
    app.route('/apps/bff/admin').patch          (checkAccessTokenAdmin, BFF);
    app.route('/apps/bff/admin').post           (checkAccessTokenAdmin, BFF);
    app.route('/apps/bff/admin').put            (checkAccessTokenAdmin, BFF);
    app.route('/apps/bff/systemadmin').delete   (checkSystemAdmin, BFF);
    app.route('/apps/bff/systemadmin').get      (checkSystemAdmin, BFF);
    app.route('/apps/bff/systemadmin').patch    (checkSystemAdmin, BFF);
    app.route('/apps/bff/systemadmin').post     (checkSystemAdmin, BFF);
    app.route('/apps/bff/systemadmin').put      (checkSystemAdmin, BFF);    
    app.route('/apps/bff/noauth').get           (BFF_noauth);
    app.route('/apps/bff/auth').post            (BFF_auth);

    app.route(`${rest_resouce_server}/auth/admin`).post                                  (authSystemAdmin);

    app.route(`${rest_resouce_server}/config/systemadmin`).put                           (checkSystemAdmin, ConfigSave);
    app.route(`${rest_resouce_server}/config/systemadmin`).get                           (checkSystemAdmin, ConfigGetController);
    app.route(`${rest_resouce_server}/config/systemadmin/apps`).get                      (checkSystemAdmin, ConfigGetApps);
    app.route(`${rest_resouce_server}/config/systemadmin/saved`).get                     (checkSystemAdmin, ConfigGetSaved);
    app.route(`${rest_resouce_server}/config/systemadmin/maintenance`).get               (checkSystemAdmin, ConfigMaintenanceGet);
    app.route(`${rest_resouce_server}/config/systemadmin/maintenance`).patch             (checkSystemAdmin, ConfigMaintenanceSet);
    app.route(`${rest_resouce_server}/config/info`).get                                  (checkSystemAdmin, ConfigInfo);
    app.route(`${rest_resouce_server}/info`).get                                         (checkSystemAdmin, Info);
    app.route(`${rest_resouce_server}/config/admin`).get                                 (checkAccessTokenAdmin, ConfigGetController);

    app.route(`${rest_resouce_server}/broadcast/message/SystemAdmin`).post               (checkSystemAdmin, BroadcastSendSystemAdmin);
    app.route(`${rest_resouce_server}/broadcast/message/Admin`).post                     (checkAccessTokenAdmin, BroadcastSendAdmin);
    app.route(`${rest_resouce_server}/broadcast/connection/SystemAdmin`).get             (checkSystemAdmin, ConnectedListSystemAdmin);
    app.route(`${rest_resouce_server}/broadcast/connection/SystemAdmin`).patch           (checkSystemAdmin, ConnectedUpdate);
    app.route(`${rest_resouce_server}/broadcast/connection/Admin`).get                   (checkAccessTokenAdmin, ConnectedList);
    app.route(`${rest_resouce_server}/broadcast/connection/Admin/count`).get             (checkAccessTokenAdmin, ConnectedCount);
    app.route(`${rest_resouce_server}/broadcast/connection/connect`).get                 (BroadcastConnect);
    app.route(`${rest_resouce_server}/broadcast/connection`).patch                       (checkDataToken, ConnectedUpdate);
    app.route(`${rest_resouce_server}/broadcast/connection/check/:user_account_id`).get  (checkDataToken, ConnectedCheck);

    app.route(`${rest_resouce_server}/dbapi/admin/DBInfo`).get(checkSystemAdmin, DBInfo);
    app.route(`${rest_resouce_server}/dbapi/admin/DBInfoSpace`).get(checkSystemAdmin, DBInfoSpace);
    app.route(`${rest_resouce_server}/dbapi/admin/DBInfoSpaceSum`).get(checkSystemAdmin, DBInfoSpaceSum);
    app.route(`${rest_resouce_server}/dbapi/admin/demo`).post(checkSystemAdmin, demo_add);
    app.route(`${rest_resouce_server}/dbapi/admin/demo`).get(checkSystemAdmin, demo_get);
    app.route(`${rest_resouce_server}/dbapi/admin/demo`).delete(checkSystemAdmin, demo_delete);
    app.route(`${rest_resouce_server}/dbapi/admin/install`).post(checkSystemAdmin, install_db);
    app.route(`${rest_resouce_server}/dbapi/admin/install`).get(checkSystemAdmin, install_db_check);
    app.route(`${rest_resouce_server}/dbapi/admin/install`).delete(checkSystemAdmin, install_db_delete);

    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/apps`).get(checkDataToken, getApp);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/apps/admin`).get(checkAccessTokenAdmin, getAppsAdmin);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/apps/admin/:id`).put(checkAccessTokenAdmin, updateAppAdmin);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/app_category/admin`).get(checkAccessTokenAdmin, getAppCategoryAdmin);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/app_log/admin`).get(checkAccessTokenAdmin, getLogsAdmin);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/app_log/admin/stat/uniquevisitor`).get(checkAccessTokenAdmin, getStatUniqueVisitorAdmin);    
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/app_object/:lang_code`).get(checkDataToken, getObjects);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/app_object/admin/:lang_code`).get(checkDataToken, getObjects);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/app_parameter/admin/all/:app_id`).get(checkAccessTokenAdmin, getParametersAllAdmin);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/app_parameter/admin`).put(checkAccessTokenAdmin, setParameter_admin);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/app_parameter/admin/value`).patch(checkAccessTokenAdmin, setParameterValue_admin);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/app_role/admin`).get(checkAccessTokenAdmin, getAppRoleAdmin);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/country/:lang_code`).get( checkDataToken, getCountries);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/language/locale/:lang_code`).get( checkDataToken, getLocales);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/language/locale/admin/:lang_code`).get( checkDataToken, getLocales);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/message_translation/:code`).get( checkDataToken, getMessage);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/parameter_type/admin`).get(checkAccessTokenAdmin, getParameterTypeAdmin);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/settings`).get(checkDataToken, getSettings);

    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/admin/count`).get(checkAccessTokenAdmin, getStatCountAdmin);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/admin`).get(checkAccessTokenAdmin, getUsersAdmin);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/admin/:id`).put(checkAccessTokenSuperAdmin, updateUserSuperAdmin);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/login`).put(checkDataTokenLogin, userLogin);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/signup`).post(checkDataTokenRegistration, userSignup);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/activate/:id`).put(checkDataToken, activateUser);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/forgot`).put(checkDataToken, passwordResetUser);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/password/:id`).put(checkAccessToken, updatePassword);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/:id`).put(checkAccessToken, updateUserLocal);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/provider/:id`).put(checkDataTokenLogin, providerSignIn);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/:id`).get(checkAccessToken, getUserByUserId);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/common/:id`).put(checkAccessToken, updateUserCommon);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/:id`).delete(checkAccessToken, deleteUser);    
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/profile/detail/:id`).get(checkAccessToken, getProfileDetail);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/profile/top/:statchoice`).get(checkDataToken, getProfileTop);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/profile/id/:id`).post(checkDataToken, getProfileUser);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/profile/username`).post(checkDataToken, getProfileUser);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/profile/username/searchD`).post(checkDataToken, searchProfileUser);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account/profile/username/searchA`).post(checkAccessToken, searchProfileUser);

    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app/`).post(checkAccessToken, createUserAccountApp);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app/:user_account_id`).get(checkAccessToken, getUserAccountApp);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app/apps/:user_account_id`).get(checkAccessToken, getUserAccountApps);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app/:user_account_id`).patch(checkAccessToken, updateUserAccountApp);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app/:user_account_id/:app_id`).delete(checkAccessToken, deleteUserAccountApps);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app_setting/:id`).get(checkDataToken, getUserSetting);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app_setting/user_account_id/:id`).get(checkDataToken, getUserSettingsByUserId);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app_setting/profile/:id`).get(checkDataToken, getProfileUserSetting);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app_setting/profile/all/:id`).get(checkDataToken, getProfileUserSettings);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app_setting/profile/detail/:id`).get(checkAccessToken, getProfileUserSettingDetail);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app_setting/profile/top/:statchoice`).get(checkDataToken, getProfileTopSetting);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app_setting`).post(checkAccessToken, createUserSetting);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app_setting/:id`).put(checkAccessToken, updateUserSetting);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app_setting/:id`).delete(checkAccessToken, deleteUserSetting);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app_setting_like/:id`).post(checkAccessToken, likeUserSetting);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app_setting_like/:id`).delete(checkAccessToken, unlikeUserSetting);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app_setting_view`).post(checkDataToken, insertUserSettingView);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_follow/:id`).post(checkAccessToken, followUser);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_follow/:id`).delete(checkAccessToken, unfollowUser);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_like/:id`).post(checkAccessToken, likeUser);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_like/:id`).delete(checkAccessToken, unlikeUser);
    app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_logon/admin/:user_account_id/:app_id`).get(checkAccessTokenAdmin, getUserAccountLogonAdmin);

    app.route(`${rest_resouce_server}/log/parameters`).get                               (checkSystemAdmin, getLogParameters);
    app.route(`${rest_resouce_server}/log/logs`).get                                     (checkSystemAdmin, getLogs);
    app.route(`${rest_resouce_server}/log/statuscode`).get                               (checkSystemAdmin, getStatusCodes);
    app.route(`${rest_resouce_server}/log/logs_stat`).get                                (checkSystemAdmin, getLogsStats);
    app.route(`${rest_resouce_server}/log/files`).get                                    (checkSystemAdmin, getFiles);
    
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
    /**@ts-ignore */
    const ContentSecurityPolicy = await ConfigGetSaved('4').then(parameter=>{return parameter['content-security-policy'];});
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
                                    res.statusMessage = 'check_request ⛔';
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
        //convert query id parameters from string to integer
        //and logs after response is finished
        app.use((/**@type{Types.req}*/req, /**@type{Types.res}*/ res, /**@type{function}*/ next) => {
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
            if (req.headers.accept == 'text/event-stream'){
                //Eventsource, log since response is open and log again when closing
                LogRequestI(req, res.statusCode, res.statusMessage, responsetime(res));
            }
            res.on('close',()=>{
                //eventsource response time will be time connected until disconnected
                LogRequestI(req, res.statusCode, res.statusMessage, responsetime(res)).then(() => {
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
            return res.redirect(`http://admin.${req.headers.host.lastIndexOf('.')==-1?req.headers.host:req.headers.host.lastIndexOf('.')}`);
            else{
            //redirect naked domain to www except for localhost
            if (((req.headers.host.split('.').length - 1) == 1) &&
                req.headers.host.indexOf('localhost')==-1)
                if (req.protocol=='http' && ConfigGet('SERVER', 'HTTPS_ENABLE')=='1')
                return res.redirect('https://' + 'www.' + req.headers.host + req.originalUrl);
                else
                return res.redirect('http://' + 'www.' + req.headers.host + req.originalUrl);
            else{
                //redirect from http to https if https enabled
                if (req.protocol=='http' && ConfigGet('SERVER', 'HTTPS_ENABLE')=='1')
                return res.redirect('https://' + req.headers.host + req.originalUrl);
                else{
                return next();
                }
            }
            }
        });
        serverExpressRoutes(app).then(() =>{
            resolve(app);
        });
    });
};
/**
 * server start
 * @async
 */
const serverStart = async () =>{
    const {DBStart} = await import(`file://${process.cwd()}/server/dbapi/admin/admin.service.js`);
    const {BroadcastCheckMaintenance} = await import(`file://${process.cwd()}/server/broadcast/broadcast.service.js`);
    const fs = await import('node:fs');
    const https = await import('node:https');
    process.env.TZ = 'UTC';
    InitConfig().then(() => {
        import(`file://${process.cwd()}/server/log/log.service.js`).then(({LogServerI, LogServerE})=>{
            //Get express app with all configurations
            serverExpress().then((app)=>{
                import(`file://${process.cwd()}/apps/apps.service.js`).then(({AppsStart})=>{
                    AppsStart(app).then(() => {
                        serverExpressLogError(app);
                        BroadcastCheckMaintenance();
                        //START HTTP SERVER
                        app.listen(ConfigGet('SERVER', 'PORT'), () => {
                            LogServerI('HTTP Server up and running on PORT: ' + ConfigGet('SERVER', 'PORT')).then(() => {
                                null;
                            });
                        });
                        if (ConfigGet('SERVER', 'HTTPS_ENABLE')=='1'){
                            //START HTTPS SERVER
                            //SSL files for HTTPS
                            let options;
                            fs.readFile(process.cwd() + ConfigGet('SERVER', 'HTTPS_KEY'), 'utf8', (error, fileBuffer) => {
                                const env_key = fileBuffer.toString();
                                fs.readFile(process.cwd() + ConfigGet('SERVER', 'HTTPS_CERT'), 'utf8', (error, fileBuffer) => {
                                    const env_cert = fileBuffer.toString();
                                    options = {
                                        key: env_key,
                                        cert: env_cert
                                    };
                                    /*Ignoring app typescript error:
                                    Argument of type 'express' is not assignable to parameter of type 'RequestListener<typeof IncomingMessage, typeof ServerResponse>'.
                                    Type 'express' provides no match for the signature '(req: IncomingMessage, res: ServerResponse<IncomingMessage> & { req: IncomingMessage; }): void'.
                                    */
                                    /**@ts-ignore */
                                    https.createServer(options, app).listen(ConfigGet('SERVER', 'HTTPS_PORT'), () => {
                                        LogServerI('HTTPS Server up and running on PORT: ' + ConfigGet('SERVER', 'HTTPS_PORT')).then(() => {
                                            DBStart();
                                        });
                                    });
                                    process.on('uncaughtException', (err) =>{
                                        console.log(err);
                                        LogServerE('Process uncaughtException: ' + err);
                                    });
                                });
                            });
                        }
                    });
                });
            });
        });
    });
};

export {COMMON, CreateRandomString,
        ConfigGetCallBack, ConfigMaintenanceSet, ConfigMaintenanceGet, ConfigGetSaved, ConfigSave, CheckFirstTime,
        CreateSystemAdmin, ConfigInfo, Info, 
        ConfigGet, ConfigGetInit, ConfigGetUser, ConfigGetApps, ConfigGetApp, InitConfig, serverStart };