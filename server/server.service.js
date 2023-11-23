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
/**@type{Types.config_apps[]} */
let CONFIG_APPS;
/**@type{Types.config_auth_blockip} */
let CONFIG_AUTH_BLOCKIP;
/**@type{Types.config_auth_policy} */
let CONFIG_AUTH_POLICY;
/**@type{Types.config_auth_user_agent} */
let CONFIG_AUTH_USERAGENT;
/**@type{Types.config_auth_user} */
let CONFIG_AUTH_USER;
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
            [1, CONFIG_INIT.FILE_CONFIG_SERVER],
            [2, CONFIG_INIT.FILE_CONFIG_APPS],
            [3, CONFIG_INIT.FILE_CONFIG_AUTH_BLOCKIP],
            [4, CONFIG_INIT.FILE_CONFIG_AUTH_POLICY],
            [5, CONFIG_INIT.FILE_CONFIG_AUTH_USERAGENT],
            [6, CONFIG_INIT.FILE_CONFIG_AUTH_USER]
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
    return CONFIG_AUTH_USER[parameter];
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
                            [2, 'default_apps.json'],
                            [3, 'default_auth_blockip.json'],
                            [4, 'default_auth_policy.json'],
                            [5, 'default_auth_useragent.json'],
                            [6, 'default_auth_user.json'],
                            [7, 'default_service_pdf_config.json']
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
    config_obj[0].SERVER.map(row=>{
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
    config_obj[0].SERVICE_AUTH.map(row=>{
        for (const key of Object.keys(row))
            if (key== 'ADMIN_TOKEN_SECRET'){
                row.ADMIN_TOKEN_SECRET = createHash('sha256').update(CreateRandomString()).digest('hex');
            }
    });
    //generate hash for apps
    config_obj[1].APPS.map(row=>{
        row.CLIENT_ID = createHash('sha256').update(CreateRandomString()).digest('hex');
        row.CLIENT_SECRET = createHash('sha256').update(CreateRandomString()).digest('hex');
        row.DATA_SECRET = createHash('sha256').update(CreateRandomString()).digest('hex');
        row.ACCESS_SECRET = createHash('sha256').update(CreateRandomString()).digest('hex');
    });
    //set created for user
    config_obj[5].created = new Date().toISOString();
    //default server metadata
    const config_init = {
        'CONFIGURATION': app_portfolio_title,
        'CREATED': `${new Date().toISOString()}`,
        'MODIFIED': '',
        'MAINTENANCE': '0',
        'FILE_CONFIG_SERVER': `${SLASH}config${SLASH}config.json`,
        'FILE_CONFIG_APPS':`${SLASH}config${SLASH}apps.json`,
        'FILE_CONFIG_AUTH_BLOCKIP':`${SLASH}config${SLASH}auth_blockip.json`,
        'FILE_CONFIG_AUTH_POLICY':`${SLASH}config${SLASH}auth_policy.json`,
        'FILE_CONFIG_AUTH_USERAGENT':`${SLASH}config${SLASH}auth_useragent.json`,
        'FILE_CONFIG_AUTH_USER':`${SLASH}config${SLASH}auth_user.json`,
        'PATH_LOG':`${SLASH}logs${SLASH}`
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
            const fs = await import('node:fs');
            const files = config_files();         
            for (const file of files){
                const fileBuffer = await fs.promises.readFile(process.cwd() + file[1], 'utf8');
                switch (file[0]){
                    case 0:{
                        CONFIG_INIT = JSON.parse(fileBuffer.toString());
                        break;
                    }
                    case 1:{
                        CONFIG = JSON.parse(fileBuffer.toString());
                        break;
                    }
                    case 2:{
                        CONFIG_APPS = JSON.parse(fileBuffer.toString());
                        break;
                    }
                    case 3:{
                        CONFIG_AUTH_BLOCKIP = JSON.parse(fileBuffer.toString());
                        break;
                    }
                    case 4:{
                        CONFIG_AUTH_POLICY = JSON.parse(fileBuffer.toString());
                        break;
                    }
                    case 5:{
                        CONFIG_AUTH_USERAGENT = JSON.parse(fileBuffer.toString());
                        break;
                    }
                    case 6:{
                        CONFIG_AUTH_USER = JSON.parse(fileBuffer.toString());
                        break;
                    }
                    default:{
                        break;
                    }
                }
            }
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
                config_init.MAINTENANCE = value;
                config_init.MODIFIED = new Date().toISOString();
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
                callBack(null, JSON.parse(fileBuffer.toString()).MAINTENANCE);
        });
    });
};
/**
 * Config get saved
 * 
 *   config_type_no
 *   0 = config_init     path + file
 *   1 = config          path + file
 *   2 = apps            path + file
 *   3 = auth blockip    path + file
 *   4 = auth policy     path + file 
 *   5 = auth useragent  path + file
 *   6 = auth user       path + file
 * @async
 * @param {Types.config_type_no|null} config_type_no
 * @returns {{}}
 */
const ConfigGetSaved = (config_type_no) => {
    switch (config_type_no){
        case 0:{
            return CONFIG_INIT;
        }
        case 1:{
            return CONFIG;
        }
        case 2:{
            return CONFIG_APPS;
        }
        case 3:{
            return CONFIG_AUTH_BLOCKIP;
        }
        case 4:{
            return CONFIG_AUTH_POLICY;
        }
        case 5:{
            return CONFIG_AUTH_USERAGENT;
        }
        case 6:{
            return CONFIG_AUTH_USER;
        }
        default:{
            return {};
        }
    }
};
/**
 * Config save
 * @async
 * @param {number|null} config_no
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
                        //config init and policy configuration are only used by admin and at start
                        switch (config_no){
                            case 1:{
                                CONFIG = JSON.parse(config_json);
                                break;
                            }
                            case 2:{
                                CONFIG_APPS = JSON.parse(config_json);
                                break;
                            }
                            case 3:{
                                CONFIG_AUTH_BLOCKIP = JSON.parse(config_json);
                                break;
                            }
                            case 4:{
                                CONFIG_AUTH_POLICY = JSON.parse(config_json);
                                break;
                            }
                            case 5:{
                                CONFIG_AUTH_USERAGENT = JSON.parse(config_json);
                                break;
                            }
                            case 6:{
                                CONFIG_AUTH_USER = JSON.parse(config_json);
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
                    config_json.configuration = app_portfolio_title;
                    config_json.comment = '';
                    config_json.created = new Date().toISOString();
                    config_json.modified = '';
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
                        config_json.configuration = app_portfolio_title;
                        config_json.comment = '';
                        config_json.created = JSON.parse(old_config).created;
                        config_json.modified = new Date().toISOString();
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
    if (CONFIG_AUTH_USER.username=='')
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
    CONFIG_AUTH_USER.username = admin_name;
    CONFIG_AUTH_USER.password = hashSync(admin_password, genSaltSync(10));
    CONFIG_AUTH_USER.modified = new Date().toISOString();
    import('node:fs').then((fs) => {
        fs.writeFile(process.cwd() + config_files()[6][1], JSON.stringify(CONFIG_AUTH_USER, undefined, 2),  'utf8', (err) => {
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
    
    const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);
    
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
                    ConfigSave(getNumberValue(data.config_no), data.config_json, false, (err, result)=>{
                        if (err)
                            reject(err);
                        else
                            resolve(result);
                    });
                    break;
                }
                case 'SYSTEMADMIN_SERVER_/CONFIG/SYSTEMADMIN_GET':{
                    resolve({data:getNumberValue(ConfigGet(query.get('config_group'), query.get('parameter')))});
                    break;
                }
                case 'SYSTEMADMIN_SERVER_/CONFIG/SYSTEMADMIN/APPS_GET':{
                    resolve(ConfigGetApps());
                    break;
                }
                case 'SYSTEMADMIN_SERVER_/CONFIG/SYSTEMADMIN/SAVED_GET':{
                    resolve({data: ConfigGetSaved(getNumberValue(query.get('config_type_no')))});
                    break;
                }
                case 'SYSTEMADMIN_SERVER_/CONFIG/SYSTEMADMIN/MAINTENANCE_GET':{
                    ConfigMaintenanceGet((err, result)=>{
                        if (err)
                            reject(err);
                        else
                            resolve({value: result});
                    });
                    break;
                }
                case 'SYSTEMADMIN_SERVER_/CONFIG/SYSTEMADMIN/MAINTENANCE_PATCH':{
                    ConfigMaintenanceSet(data.value, (err, result)=>{
                        if (err)
                            reject(err);
                        else
                            resolve(result);
                    });
                    break;
                }
                case 'SYSTEMADMIN_SERVER_/CONFIG/INFO_GET':{
                    ConfigInfo((err, result)=>{
                        if (err)
                            reject(err);
                        else
                            resolve({data: result.info});
                    });
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
                    resolve({data:getNumberValue(ConfigGet(query.get('config_group'), query.get('parameter')))});
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

export {COMMON, getNumberValue, CreateRandomString,
        ConfigMaintenanceSet, ConfigMaintenanceGet, ConfigGetSaved, ConfigSave, CheckFirstTime,
        CreateSystemAdmin, ConfigInfo, Info, 
        ConfigGet, ConfigGetInit, ConfigGetUser, ConfigGetApps, ConfigGetApp, InitConfig, serverRoutes, serverStart };