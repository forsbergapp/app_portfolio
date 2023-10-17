/** @module server */

// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

//use config variables for the frequent used configurations for faster performance
//to avoid readfile async and diskusage
//variables are updated when admin updates config
/**@type{Types.config_init} */
let CONFIG_INIT;
/**@type{Types.config} */
let CONFIG;
/**@type{Types.config_user} */
let CONFIG_USER;
/**@type{Types.config_apps[]} */
let CONFIG_APPS;
/**@type{string} */
let SLASH;
if (process.platform == 'win32')
    SLASH = '\\';
else
    SLASH = '/';
//initial config with file paths and maintenance parameter
/**@type {string} */
const SERVER_CONFIG_INIT_PATH = `${SLASH}config${SLASH}config_init.json`;

const app_portfolio_title = 'App Portfolio';

/**
 * Get number value from request key
 * returns number or null for numbers
 * so undefined and '' are avoided sending arguement to service functions
 * @param {Types.req_id_number} param
 * @returns {number|null}
 */
 const getNumberValue = param => (param==null||param===undefined||param==='')?null:Number(param);

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
 * Config files
 * @returns {Types.config_files[]}
 */
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
 * @param {Types.config_init_parameter} parameter
 * @returns {string}
 */
 const ConfigGetInit = (parameter) => {
    return CONFIG_INIT[parameter];
 };
/**
 * Config get user
 * @param {Types.config_user_parameter} parameter
 * @returns {string}
 */
 const ConfigGetUser = (parameter) => {
    return CONFIG_USER[parameter];
 };
/**
 * Config get apps
 * @returns {Types.config_apps}
 */
 const ConfigGetApps = () => {
    //return apps array in the object without secret keys
    const apps = Object.entries(CONFIG_APPS)[0][1].reduce(( /**@type{Types.config_apps} */app, 
                                                            /**@type {Types.config_apps}*/current)=> 
                                                                app.concat({APP_ID:current.APP_ID,
                                                                            CLIENT_ID:current.CLIENT_ID,
                                                                            ENDPOINT:current.ENDPOINT,
                                                                            PATH:current.PATH,
                                                                            SHOWINFO:current.SHOWINFO,
                                                                            SHOWPARAM:current.SHOWPARAM,
                                                                            SUBDOMAIN:current.SUBDOMAIN}) , []);
    return apps;                                                            
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
                    return Object.entries(CONFIG_APPS)[0][1].filter(
                        (/**@type{Types.config_apps}*/app)=>{return app.SUBDOMAIN == 'www';})[0].APP_ID;
                }
                default:{
                    try {
                        return Object.entries(CONFIG_APPS)[0][1].filter(
                            (/**@type{Types.config_apps}*/app)=>{return config_group.toString().split('.')[0] == app.SUBDOMAIN;})[0].APP_ID;    
                    } catch (error) {
                        //request can be called from unkown hosts
                        return null;
                    }
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
            return Object.entries(CONFIG_APPS)[0][1].filter(
                (/**@type{Types.config_apps}*/app)=>{return app.APP_ID == config_group;})[0][parameter];
        }
        default:{
            return null;
        }
    }
 };
/**
 * Config get
 * @param {Types.config_group} config_group
 * @param {string} parameter
 * @returns {string|null}
 */
const ConfigGet = (config_group, parameter) => {
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
    const fs = await import('node:fs');
    const { createHash } = await import('node:crypto');
    const create_config_and_logs_dir = async () => {
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
    await create_config_and_logs_dir()
    .catch((err) => {
        throw err;
    }); 
    const i = 0;
    //read all default files
    /**@type{Types.config_files[]} */
    const default_files = [
                            [1, 'default_config.json'],
                            [2, 'default_auth_blockip.json'],
                            [3, 'default_auth_useragent.json'],
                            [4, 'default_auth_policy.json'],
                            [6, 'default_auth_user.json'],
                            [7, 'default_apps.json'],
                            [8, 'default_service_pdf_config.json']
                        ]; 
    //ES2020 import() with ES6 promises
    const config_json = await Promise.all(default_files.map(file => {
        return fs.promises.readFile(process.cwd() + '/server/' + file[1], 'utf8');
    }));
    /**@type{Types.config[]} */
    const config_obj = [JSON.parse(config_json[0]),
                        JSON.parse(config_json[1]),
                        JSON.parse(config_json[2]),
                        JSON.parse(config_json[3]),
                        JSON.parse(config_json[4]),
                        JSON.parse(config_json[5]),
                        JSON.parse(config_json[6])];
    //set server parameters
    //update path
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
    config_obj[0]['SERVICE_AUTH'].map(row=>{
        for (const key of Object.keys(row))
            if (key== 'ADMIN_TOKEN_SECRET'){
                row.ADMIN_TOKEN_SECRET = createHash('sha256').update(CreateRandomString()).digest('hex');
            }
    });
    //set created for user
    config_obj[4]['created'] = new Date().toISOString();
    //generate hash for apps
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
    await fs.promises.writeFile(process.cwd() + SERVER_CONFIG_INIT_PATH, JSON.stringify(config_init, undefined, 2),  'utf8');

    //save in module variable
    CONFIG_INIT = config_init;
    let config_created=0;
    for (const config_row of config_obj){
        if (config_created == 6){
            //create default service pdf config not part of server parameter management
            await fs.promises.writeFile(process.cwd() + `${SLASH}service${SLASH}pdf${SLASH}config${SLASH}config.json`, JSON.stringify(config_row, undefined,2),  'utf8');
        }
        else{
            //send fileno in file array
            await ConfigSave( default_files[config_created][0], config_row, true, (err)=>{
                if (err)
                    throw err;
                else
                    config_created++;
            });
        }
    }
    return null;
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
 * @param {Types.config_group} config_group
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
                /**@type{Types.config_init} */
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
 * 
 *   config_type_no
 *   0 = config_init     path + file
 *   1 = config          path + file
 *   2 = auth blockip    path + file
 *   3 = auth useragent  path + file
 *   4 = auth policy     path + file
 *   5 = log path        path
 *   6 = auth user       path + file
 *   7 = apps            path + file
 * @async
 * @param {Types.config_type_no} config_type_no
 * @returns {Promise<Types.config>}
 */
const ConfigGetSaved = async (config_type_no) => {
    const config_file = config_files().filter((file) => {
        return (file[0] == config_type_no);
    })[0][1];
    const fs = await import('node:fs');
    const fileBuffer = await fs.promises.readFile(process.cwd() + config_file, 'utf8');
    return JSON.parse(fileBuffer.toString());
};
/**
 * Config save
 * @async
 * @param {number} config_no
 * @param {Types.config} config_json
 * @param {boolean} first_time
 * @param {Types.callBack} callBack
 */
const ConfigSave = async (config_no, config_json, first_time, callBack) => {
    const fs = await import('node:fs');
    try {
        const write_config = async (/**@type{number}*/config_no, /**@type{string}*/config_file, /**@type{string}*/config_json) => {
            return new Promise((resolve, reject) => {
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
        };
        if (config_no){
            const config_file = config_files().filter((file) => {
                return (file[0] == config_no);
            })[0][1];
            if (first_time){
                if (config_no == 1){
                    //add metadata to server config
                    config_json['configuration'] = app_portfolio_title;
                    config_json['comment'] = '';
                    config_json['created'] = new Date().toISOString();
                    config_json['modified'] = '';
                }
                await write_config(config_no, config_file, JSON.stringify(config_json, undefined, 2)).then(() => {
                    callBack(null, null);
                });
            }
            else{
                if (config_no == 0){
                    //config_init.json file displayed info, do not update
                    callBack(null, null);
                }
                else{
                    //get old config file
                    const result_read = await fs.promises.readFile(process.cwd() + config_file,  'utf8');
                    const old_config = result_read.toString();
                    //write backup of old file
                    await fs.promises.writeFile(process.cwd() + `${config_file}.${new Date().toISOString().replace(new RegExp(':', 'g'),'.')}`, old_config,  'utf8');
                    if (config_no == 1){
                        //add metadata to server config
                        config_json['configuration'] = app_portfolio_title;
                        config_json['comment'] = '';
                        config_json['created'] = JSON.parse(old_config)['created'];
                        config_json['modified'] = new Date().toISOString();
                    }  
                    await write_config(config_no, config_file, JSON.stringify(config_json, undefined, 2)).then(() => {
                        callBack(null, null);
                    });
                }
            }
        }
    } catch ( error) {
        callBack(error, null);
    }
};
/**
 * Check first time
 * @returns {boolean}
 */
const CheckFirstTime = () => {
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
    const { default: {genSaltSync, hashSync} } = await import('bcryptjs');
    CONFIG_USER['username'] = admin_name;
    CONFIG_USER['password'] = hashSync(admin_password, genSaltSync(10));
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
 * server start
 * @async
 */
const serverStart = async () =>{
    const {DBStart} = await import(`file://${process.cwd()}/server/dbapi/admin/admin.service.js`);
    const {BroadcastCheckMaintenance} = await import(`file://${process.cwd()}/server/broadcast/broadcast.service.js`);
    const {serverExpress, serverExpressLogError} = await import(`file://${process.cwd()}/server/express/server.js`);
    const {LogServerI, LogServerE} = await import(`file://${process.cwd()}/server/log/log.service.js`);
    const fs = await import('node:fs');
    const https = await import('node:https');
    process.env.TZ = 'UTC';
    InitConfig().then(() => {
        //Get express app with all configurations
        serverExpress().then((/**@type{Types.express}*/app)=>{
            import(`file://${process.cwd()}/server/express/apps.js`).then(({serverExpressApps})=>{
                serverExpressApps(app).then(() => {
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
                                /**@ts-ignore*/
                                https.createServer(options,  app).listen(ConfigGet('SERVER', 'HTTPS_PORT'), () => {
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
};

export {COMMON, getNumberValue, CreateRandomString,
        ConfigGetCallBack, ConfigMaintenanceSet, ConfigMaintenanceGet, ConfigGetSaved, ConfigSave, CheckFirstTime,
        CreateSystemAdmin, ConfigInfo, Info, 
        ConfigGet, ConfigGetInit, ConfigGetUser, ConfigGetApps, ConfigGetApp, InitConfig, serverStart };