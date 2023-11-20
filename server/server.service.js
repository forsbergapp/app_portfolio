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
 * 
 * @param {number} app_id 
 * @param {string} emailtype 
 * @param {string} host 
 * @param {number} userid 
 * @param {string|null} verification_code 
 * @param {string} email 
 * @param {Types.callBack} callBack 
 */
 const sendUserEmail = async (app_id, emailtype, host, userid, verification_code, email, callBack) => {
    const { createMail} = await import(`file://${process.cwd()}/apps/apps.service.js`);
    const { MessageQueue } = await import(`file://${process.cwd()}/service/service.service.js`);
    
    createMail(app_id, 
        {
            'emailtype':        emailtype,
            'host':             host,
            'app_user_id':      userid,
            'verificationCode': verification_code,
            'to':               email,
        }).then((/**@type{Types.email_return_data}*/email)=>{
            MessageQueue('MAIL', 'PUBLISH', email, null)
            .then(()=>{
                callBack(null, null);
            })
            .catch((/**@type{Types.error}*/error)=>{
                callBack(error, null);
            });
        })
        .catch((/**@type{Types.error}*/error)=>{
            callBack(error, null);
        });
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
    //server db api admin
    const { DBInfo, DBInfoSpace, DBInfoSpaceSum, demo_add, demo_delete, install_db, install_db_check, install_db_delete } = await import(`file://${process.cwd()}/server/dbapi/admin/admin.service.js`);
    //server db api app_portfolio app
    const { getAppsAdmin, updateAppAdmin } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app/app.service.js`);
    //server db api app_portfolio app category
    const {getAppCategoryAdmin} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_category/app_category.service.js`);
    //server db api app_portfolio app log
    const { getLogsAdmin, getStatUniqueVisitorAdmin} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_log/app_log.service.js`);
    //server db api app_portfolio app parameter
    const { getParametersAllAdmin, setParameter_admin } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_parameter/app_parameter.service.js`);
    //server db api app_portfolio app role
    const { getAppRoleAdmin} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_role/app_role.service.js`);
    //server db api app_portfolio parameter type
    const { getParameterTypeAdmin} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/parameter_type/parameter_type.service.js`);
    const {getUserByUserId, getUsersAdmin, getStatCountAdmin, updateUserSuperAdmin} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account/user_account.service.js`);
    //server db api app_portfolio user account logon
    const { getUserAccountLogonAdmin} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_logon/user_account_logon.service.js`);
    
    //server db api app_portfolio app
    const { getApp } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app/app.service.js`);
    //server db api app_portfolio app object
    const { getObjects } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_object/app_object.service.js`);
    //server db api app_portfolio country
    const { getCountries } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/country/country.service.js`);
    //server db api app_portfolio locale
    const { getLocales } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/language/locale/locale.service.js`);
    //server db api app_portfolio message translation
    const { getMessage } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/message_translation/message_translation.service.js`);
    //server db api app_portfolio setting
    const { getSettings } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/setting/setting.service.js`);

    //server db api app_portfolio user account data token
    const {
        verification_code,
        updateUserVerificationCode,
        updateSigninProvider,
        create,
        userLogin,
        activateUser,
        getEmailUser,
        providerSignIn,
        getProfileTop,
        getProfileUser,
        searchProfileUser} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account/user_account.service.js`);
    //server db api app_portfolio user account app
    const { createUserAccountApp, getUserAccountApp} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_app/user_account_app.service.js`);
    //server db api app_portfolio user account app setting
    const { getUserSettingsByUserId, getProfileUserSetting, getProfileUserSettings, getProfileTopSetting} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_app_setting/user_account_app_setting.service.js`);

    const { checked_error } = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);

    //server log
    const {getLogParameters, getLogs, getStatusCodes, getLogsStats, getFiles} = await import(`file://${process.cwd()}/server/log/log.service.js`);
    
    const {default:{sign}} = await import('jsonwebtoken');
    const { default: {compareSync} } = await import('bcryptjs');
    const {CheckFirstTime, ConfigGet, ConfigGetUser, CreateSystemAdmin} = await import(`file://${process.cwd()}/server/server.service.js`);
    const { accessToken } = await import(`file://${process.cwd()}/server/auth/auth.service.js`);
    
    const { insertUserAccountLogon } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_logon/user_account_logon.service.js`);
    const { getParameter } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_parameter/app_parameter.service.js`);
    const { getLastUserEvent, insertUserEvent } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_event/user_account_event.service.js`);
    const { insertUserSettingView} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_app_setting_view/user_account_app_setting_view.service.js`);

    /**@type{*} */
    const query = new URLSearchParams(parameters.substring(parameters.indexOf('?')));
    const routeFunction = parameters.substring(0, parameters.indexOf('?')).toUpperCase();
    return new Promise((resolve, reject)=>{
        try {
            //check what BFF endpoint is used that has already used middleware if declared in routes
            switch(endpoint){
                case 'DATA_LOGIN':{
                    switch (service){
                        case 'DB_API':{
                            switch (routeFunction + '_' + method){
                                case '/USER_ACCOUNT/LOGIN_PUT':{
                                    /**@type{Types.db_parameter_user_account_userLogin} */
                                    const data_login =    {   username: data.username};
                                    userLogin(app_id, data_login)
                                    .then((/**@type{Types.db_result_user_account_userLogin[]}*/result_login)=>{
                                        if (result_login[0]) {
                                            const data_body = { user_account_id:    getNumberValue(result_login[0].id),
                                                                app_id:             getNumberValue(data.app_id),
                                                                result:             Number(compareSync(data.password, result_login[0].password)),
                                                                client_ip:          ip,
                                                                client_user_agent:  user_agent,
                                                                client_longitude:   data.client_longitude ?? null,
                                                                client_latitude:    data.client_latitude ?? null,
                                                                access_token:       null};
                                            if (compareSync(data.password, result_login[0].password)) {
                                                if ((app_id == getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')) && (result_login[0].app_role_id == 0 || result_login[0].app_role_id == 1))||
                                                        app_id != ConfigGet('SERVER', 'APP_COMMON_APP_ID')){
                                                    createUserAccountApp(app_id, result_login[0].id)
                                                    .then(()=>{
                                                        //if user not activated then send email with new verification code
                                                        const new_code = verification_code();
                                                        if (result_login[0].active == 0){
                                                            updateUserVerificationCode(app_id, result_login[0].id, new_code)
                                                            .then(()=>{
                                                                getParameter(app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),'SERVICE_MAIL_TYPE_UNVERIFIED')
                                                                    .then((/**@type{Types.db_result_app_parameter_getParameter[]}*/parameter)=>{
                                                                        //send email UNVERIFIED
                                                                        sendUserEmail(  app_id, 
                                                                                        parameter[0].parameter_value, 
                                                                                        host, 
                                                                                        result_login[0].id, 
                                                                                        new_code, 
                                                                                        result_login[0].email, 
                                                                                        (/**@type{Types.error}*/err)=>{
                                                                            if (err)
                                                                                reject(err);
                                                                            else{
                                                                                data_body.access_token = accessToken(app_id);
                                                                                insertUserAccountLogon(app_id, data_body)
                                                                                .then(()=>{
                                                                                    resolve({
                                                                                        accessToken: data_body.access_token,
                                                                                        items: Array(result_login[0])
                                                                                    });
                                                                                });
                                                                            }
                                                                        });
                                                                    });
                                                            });
                                                        }
                                                        else{
                                                            data_body.access_token = accessToken(app_id);
                                                            insertUserAccountLogon(app_id, data_body)
                                                            .then(()=>{
                                                                resolve({
                                                                    accessToken: data_body.access_token,
                                                                    items: Array(result_login[0])
                                                                });
                                                            });
                                                        }
                                                    });
                                                }
                                                else{
                                                    res.statusMessage = 'unauthorized admin login attempt for user id:' + getNumberValue(result_login[0].id) + ', username:' + data_login.username;
                                                    res.statusCode = 401;
                                                    //unauthorized, only admin allowed to log in to admin
                                                    reject('⛔');
                                                }
                                                
                                            } else {
                                                insertUserAccountLogon(app_id, data_body)
                                                .then(()=>{
                                                    res.statusMessage = 'invalid password attempt for user id:' + getNumberValue(result_login[0].id) + ', username:' + data_login.username;
                                                    res.statusCode = 400;
                                                    //Username or password not found
                                                    getMessage( app_id,
                                                                getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                                                                '20300',
                                                                query.get('lang_code'))
                                                    .then((/**@type{Types.db_result_message_translation_getMessage[]}*/result_message)=>{
                                                        reject(result_message[0].text);
                                                    });
                                                });
                                            }
                                        } else{
                                            if (app_id == getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')))
                                                res.statusMessage = 'admin user not found:' + data_login.username;
                                            else
                                                res.statusMessage = 'user not found:' + data_login.username;
                                            res.statusCode = 404;
                                            //User not found
                                            getMessage( app_id,
                                                        getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                                                        '20305',
                                                        query.get('lang_code'))
                                            .then((/**@type{Types.db_result_message_translation_getMessage[]}*/result_message)=>{
                                                reject(result_message[0].text);
                                            });
                                        }
                                    });
                                    break;
                                }
                                case '/USER_ACCOUNT/PROVIDER_PUT':{
                                    providerSignIn(app_id, getNumberValue(data.identity_provider_id), getNumberValue(query.get('PUT_ID')))
                                    .then((/**@type{Types.db_result_user_account_providerSignIn[]}*/result_signin)=>{
                                        /** @type{Types.db_parameter_user_account_create} */
                                        const data_user = { bio:                    null,
                                                            private:                null,
                                                            user_level:             null,
                                                            username:               null,
                                                            password:               null,
                                                            password_new:           null,
                                                            password_reminder:      null,
                                                            email_unverified:       null,
                                                            email:                  null,
                                                            avatar:                 null,
                                                            verification_code:      null,
                                                            active:                 1,
                                                            identity_provider_id:   getNumberValue(data.identity_provider_id),
                                                            provider_id:            data.provider_id,
                                                            provider_first_name:    data.provider_first_name,
                                                            provider_last_name:     data.provider_last_name,
                                                            provider_image:         data.provider_image,
                                                            provider_image_url:     data.provider_image_url,
                                                            provider_email:         data.provider_email,
                                                            admin:                  0};
                                        const data_login = {user_account_id:        data.user_account_id,
                                                            app_id:                 data.app_id,
                                                            result:                 1,
                                                            client_ip:              ip,
                                                            client_user_agent:      user_agent,
                                                            client_longitude:       data.client_longitude,
                                                            client_latitude:        data.client_latitude,
                                                            access_token:           null};
                                        if (result_signin.length > 0) {
                                            updateSigninProvider(app_id, result_signin[0].id, data_user)
                                            .then(()=>{
                                                data_login.user_account_id = result_signin[0].id;
                                                createUserAccountApp(app_id, result_signin[0].id)
                                                .then(()=>{
                                                    data_login.access_token = accessToken(app_id);
                                                    insertUserAccountLogon(app_id, data_login)
                                                    .then(()=>{
                                                        resolve({
                                                            count: result_signin.length,
                                                            accessToken: data_login.access_token,
                                                            items: result_signin,
                                                            userCreated: 0
                                                        });
                                                    });
                                                });
                                            })
                                            .catch((/**@type{Types.error}*/error)=>{
                                                checked_error(app_id, query.get('lang_code'), error).then((/**@type{string}*/message)=>reject(message));
                                            });            
                                        } else {
                                            //if provider user not found then create user and one user setting
                                            //avatar not used by providers, set default null
                                            data_user.avatar = data.avatar ?? null;
                                            data_user.provider_image = data.provider_image ?? null;
                                            create(app_id, data_user)
                                            .then((/**@type{Types.db_result_user_account_create} */result_create)=>{
                                                data_login.user_account_id = result_create.insertId;
                                                    createUserAccountApp(app_id, result_create.insertId)
                                                    .then(()=>{
                                                        providerSignIn(app_id, getNumberValue(data.identity_provider_id), getNumberValue(query.get('PUT_ID')))
                                                        .then((/**@type{Types.db_result_user_account_providerSignIn[]}*/result_signin2)=>{
                                                            data_login.access_token = accessToken(app_id);
                                                            insertUserAccountLogon(app_id, data_login)
                                                            .then(()=>{
                                                                resolve({
                                                                    count: result_signin2.length,
                                                                    accessToken: data_login.access_token,
                                                                    items: result_signin2,
                                                                    userCreated: 1
                                                                });
                                                            });
                                                        });
                                                    });
                                            });
                                        }
                                    });
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    break;
                }
                case 'DATA_SIGNUP':{
                    switch (service){
                        case 'DB_API':{
                            switch (routeFunction + '_' + method){
                                case '/USER_ACCOUNT/SIGNUP_POST':{
                                    /**@type{Types.db_parameter_user_account_create} */
                                    const data_body = { bio:                    data.bio,
                                                        private:                data.private,
                                                        user_level:             data.user_level,
                                                        username:               data.username,
                                                        password:               null,
                                                        password_new:           data.password,
                                                        password_reminder:      data.password_reminder,
                                                        email:                  data.email,
                                                        email_unverified:       null,
                                                        avatar:                 data.avatar,
                                                        verification_code:      data.provider_id?null:verification_code(),
                                                        active:                 getNumberValue(data.active) ?? 0,
                                                        identity_provider_id:   getNumberValue(data.identity_provider_id),
                                                        provider_id:            data.provider_id ?? null,
                                                        provider_first_name:    data.provider_first_name,
                                                        provider_last_name:     data.provider_last_name,
                                                        provider_image:         data.provider_image,
                                                        provider_image_url:     data.provider_image_url,
                                                        provider_email:         data.provider_email,
                                                        admin:                  0
                                                    };
                                    create(app_id, data_body)
                                    .then((/**@type{Types.db_result_user_account_create}*/result_create)=>{
                                        if (data.provider_id == null ) {
                                            //send email for local users only
                                            getParameter(app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),'SERVICE_MAIL_TYPE_SIGNUP')
                                            .then((/**@type{Types.db_result_app_parameter_getParameter[]}*/parameter)=>{
                                                //send email SIGNUP
                                                sendUserEmail(  app_id, 
                                                                parameter[0].parameter_value, 
                                                                host, 
                                                                result_create.insertId, 
                                                                data_body.verification_code, 
                                                                data_body.email ?? '', 
                                                                (/**@type{Types.error}*/err)=>{
                                                    if (err)
                                                        reject(err);
                                                    else
                                                        resolve({
                                                            accessToken: accessToken(app_id),
                                                            id: result_create.insertId,
                                                            data: result_create
                                                        });
                                                });  
                                            });
                                        }
                                        else
                                            resolve({
                                                accessToken: accessToken(app_id),
                                                id: result_create.insertId,
                                                data: result_create
                                            });
                                    })
                                    .catch((/**@type{Types.error}*/error)=>{
                                        checked_error(app_id, query.get('lang_code'), error).then((/**@type{string}*/message)=>reject(message));
                                    });
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    break;
                }
                case 'DATA':{
                    switch (service){
                        case 'BROADCAST':{
                            switch (routeFunction + '_' + method){
                                case '/BROADCAST/CONNECTION_PATCH':{
                                    ConnectedUpdate(getNumberValue(query.get('client_id')), getNumberValue(query.get('user_account_logon_user_account_id')), 
                                                    getNumberValue(query.get('system_admin')), getNumberValue(query.get('identity_provider_id')), query.get('latitude'), query.get('longitude'),
                                                            (/**@type{Types.error}*/err, /**@type{void}*/result) =>{
                                        resolve(err ?? result);
                                    });
                                    break;
                                }
                                case '/BROADCAST/CONNECTION/CHECK_GET':{
                                    ConnectedCheck(getNumberValue(query.get('user_account_id')), (/**@type{Types.error}*/err, /**@type{boolean}*/result_connected)=>{
                                        resolve({online: result_connected});
                                    });
                                    break;
                                }
                            }
                            break;
                        }
                        case 'DB_API':{
                            switch (routeFunction + '_' + method){
                                case '/APPS_GET':{
                                    getApp(app_id, getNumberValue(query.get('id')), query.get('lang_code'))
                                    .then((/**@type{Types.db_result_app_getApp[]}*/result)=> {
                                        resolve({data: result});
                                    });
                                    break;
                                }
                                case '/APP_OBJECT_GET':
                                case '/APP_OBJECT/ADMIN_GET':{
                                    getObjects(app_id, query.get('data_lang_code'), query.get('object') ?? null, query.get('object_name') ?? null)
                                    .then((/**@type{Types.db_result_app_object_getObjects[]}*/result)=> {
                                        resolve({data: result});
                                    });
                                    break;
                                }
                                case '/COUNTRY_GET':{
                                    getCountries(app_id, query.get('lang_code') ?? 'en')
                                    .then((/**@type{Types.db_result_country_getCountries[]}*/result)=> {
                                        resolve({countries: result});
                                    });
                                    break;
                                }
                                case '/LANGUAGE/LOCALE_GET':
                                case '/LANGUAGE/LOCALE/ADMIN_GET':{
                                    getLocales(app_id, query.get('lang_code') ?? 'en')
                                    .then((/**@type{Types.db_result_locale_getLocales[]}*/result)=> {
                                        resolve({locales: result});
                                    });
                                    break;
                                }
                                case '/MESSAGE_TRANSLATION_GET':{
                                    getMessage(app_id, getNumberValue(query.get('data_app_id')), query.get('code'), query.get('lang_code'))
                                    .then((/**@type{Types.db_result_message_translation_getMessage[]}*/result)=>{
                                        resolve(result[0]);
                                    });
                                    break;
                                }
                                case '/SETTINGS_GET':{
                                    getSettings(app_id, query.get('lang_code'), query.get('setting_type') ?? query.get('setting_type')==''?null:query.get('setting_type'))
                                    .then((/**@type{Types.db_result_setting_getSettings[]}*/result)=>{
                                        resolve({settings: result});
                                    });
                                    break;
                                }
                                case '/USER_ACCOUNT/ACTIVATE_PUT':{
                                    /**@type{string|null} */
                                    let auth_password_new = null;
                                    if (getNumberValue(data.verification_type) == 3){
                                        //reset password
                                        auth_password_new = verification_code();
                                    }
                                    activateUser(app_id, getNumberValue(query.get('PUT_ID')), getNumberValue(data.verification_type), data.verification_code, auth_password_new)
                                    .then((/**@type{Types.db_result_user_account_activateUser}*/result_activate)=>{
                                        if (auth_password_new == null){
                                            if (result_activate.affectedRows==1 && getNumberValue(data.verification_type)==4){
                                                //new email verified
                                                /**@type{Types.db_parameter_user_account_event_insertUserEvent}*/
                                                const eventData = {
                                                    user_account_id: getNumberValue(query.get('PUT_ID')) ?? 0,
                                                    event: 'EMAIL_VERIFIED_CHANGE_EMAIL',
                                                    event_status: 'SUCCESSFUL',
                                                    user_language: data.user_language,
                                                    user_timezone: data.user_timezone,
                                                    user_number_system: data.user_number_system,
                                                    user_platform: data.user_platform,
                                                    server_remote_addr : ip,
                                                    server_user_agent : user_agent,
                                                    server_http_host : host,
                                                    server_http_accept_language : accept_language,
                                                    client_latitude : data.client_latitude,
                                                    client_longitude : data.client_longitude
                                                };
                                                insertUserEvent(app_id, eventData)
                                                .then((/**@type{Types.db_result_user_account_event_insertUserEvent}*/result_insert)=>{
                                                    resolve({
                                                        count: result_insert.affectedRows,
                                                        items: Array(result_insert)
                                                    });
                                                });
                                            }
                                            else
                                                resolve({
                                                    count: result_activate.affectedRows,
                                                    items: Array(result_activate)
                                                });
                                        }
                                        else{
                                            //return accessToken since PASSWORD_RESET is in progress
                                            //email was verified and activated with data token, but now the password will be updated
                                            //using accessToken and authentication code
                                            resolve({
                                                count: result_activate.affectedRows,
                                                auth: auth_password_new,
                                                accessToken: accessToken(app_id),
                                                items: Array(result_activate)
                                            });
                                        }
                                    })
                                    .catch((/**@type{Types.error}*/error)=>{
                                        checked_error(app_id, query.get('lang_code'), error).then((/**@type{string}*/message)=>reject(message));
                                    });    
                                    break;
                                }
                                case '/USER_ACCOUNT/FORGOT_PUT':{
                                    const email = data.email ?? '';
                                    if (email !='')
                                        getEmailUser(app_id, email)
                                        .then((/**@type{Types.db_result_user_account_getEmailUser[]}*/result_emailuser)=>{
                                            if (result_emailuser[0]){
                                                getLastUserEvent(app_id, getNumberValue(result_emailuser[0].id), 'PASSWORD_RESET')
                                                .then((/**@type{Types.db_result_user_account_event_getLastUserEvent[]}*/result_user_event)=>{
                                                    if (result_user_event[0] &&
                                                        result_user_event[0].status_name == 'INPROGRESS' &&
                                                        (+ new Date(result_user_event[0].current_timestamp) - + new Date(result_user_event[0].date_created))/ (1000 * 60 * 60 * 24) < 1)
                                                        resolve({sent: 0});
                                                    else{
                                                        /**@type{Types.db_parameter_user_account_event_insertUserEvent}*/
                                                        const eventData = {
                                                                            user_account_id: result_emailuser[0].id,
                                                                            event: 'PASSWORD_RESET',
                                                                            event_status: 'INPROGRESS',
                                                                            user_language: data.user_language,
                                                                            user_timezone: data.user_timezone,
                                                                            user_number_system: data.user_number_system,
                                                                            user_platform: data.user_platform,
                                                                            server_remote_addr : ip,
                                                                            server_user_agent : user_agent,
                                                                            server_http_host : host,
                                                                            server_http_accept_language : accept_language,
                                                                            client_latitude : data.client_latitude,
                                                                            client_longitude : data.client_longitude
                                                                        };
                                                        insertUserEvent(app_id, eventData)
                                                        .then(()=>{
                                                            const new_code = verification_code();
                                                            updateUserVerificationCode(app_id, result_emailuser[0].id, new_code)
                                                            .then(()=>{
                                                                getParameter(app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),'SERVICE_MAIL_TYPE_PASSWORD_RESET')
                                                                .then((/**@type{Types.db_result_app_parameter_getParameter[]}*/parameter)=>{
                                                                    //send email PASSWORD_RESET
                                                                    sendUserEmail(  app_id, 
                                                                                    parameter[0].parameter_value, 
                                                                                    host, 
                                                                                    result_emailuser[0].id, 
                                                                                    new_code, 
                                                                                    email, 
                                                                                    (/**@type{Types.error}*/err)=>{
                                                                        if (err)
                                                                            reject(err);
                                                                        else
                                                                            resolve({
                                                                                sent: 1,
                                                                                id: result_emailuser[0].id
                                                                            });  
                                                                    });
                                                                });
                                                            });
                                                        })
                                                        .catch(()=> {
                                                            resolve({sent: 0});
                                                        });
                                                    }
                                                });            
                                            }
                                            else
                                                resolve({sent: 0});
                                        });
                                    else
                                        resolve({sent: 0});
                                    break;
                                }
                                case '/USER_ACCOUNT/PROFILE/TOP_GET':{
                                    getProfileTop(app_id, getNumberValue(query.get('statchoice')))
                                    .then((/**@type{Types.db_result_user_account_getProfileTop[]}*/result)=>{
                                        if (result)
                                            resolve({
                                                count: result.length,
                                                items: result
                                            });
                                        else {
                                            import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found_promise}) => {
                                                record_not_found_promise(app_id, query.get('lang_code')).then((/**@type{string}*/message)=>reject(message));
                                            });
                                        }
                                    });
                                    break;
                                }
                                case '/USER_ACCOUNT/PROFILE/ID_POST':
                                case '/USER_ACCOUNT/PROFILE/USERNAME_POST':{
                                    getProfileUser(app_id, getNumberValue(query.get('POST_ID')), getNumberValue(query.get('POST_ID'))==null?query.get('search'):null, getNumberValue(query.get('id')))
                                    .then((/**@type{Types.db_result_user_account_getProfileUser[]}*/result_getProfileUser)=>{
                                        if (result_getProfileUser[0]){
                                            if (result_getProfileUser[0].id == getNumberValue(query.get('id'))) {
                                                //send without {} so the variablename is not sent
                                                resolve(result_getProfileUser[0]);
                                            }
                                            else{
                                                import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_view/user_account_view.service.js`).then(({ insertUserAccountView }) => {
                                                    const data_body = { user_account_id:        getNumberValue(query.get('POST_ID')),
                                                                                                //set user id when username is searched
                                                                        user_account_id_view:   getNumberValue(query.get('POST_ID')) ?? result_getProfileUser[0].id,
                                                                        client_ip:              ip,
                                                                        client_user_agent:      user_agent,
                                                                        client_longitude:       data.client_longitude,
                                                                        client_latitude:        data.client_latitude};
                                                    insertUserAccountView(app_id, data_body)
                                                    .then(()=>{
                                                        //send without {} so the variablename is not sent
                                                        resolve(result_getProfileUser[0]);
                                                    });
                                                });
                                            }
                                        }
                                        else{
                                            import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found_promise}) => {
                                                record_not_found_promise(app_id, query.get('lang_code')).then((/**@type{string}*/message)=>reject(message));
                                            });
                                        }
                                    });
                                    break;
                                }
                                case '/USER_ACCOUNT/PROFILE/USERNAME/SEARCHD_POST':{
                                    searchProfileUser(app_id, query.get('search'))
                                    .then((/**@type{Types.db_result_user_account_searchProfileUser[]}*/result_search)=>{
                                        import(`file://${process.cwd()}/server/dbapi/app_portfolio/profile_search/profile_search.service.js`).then(({ insertProfileSearch }) => {
                                            /**@type{Types.db_parameter_profile_search_insertProfileSearch} */
                                            const data_insert = {   user_account_id:    data.user_account_id,
                                                                    search:             query.get('search'),
                                                                    client_ip:          ip,
                                                                    client_user_agent:  user_agent,
                                                                    client_longitude:   data.client_longitude,
                                                                    client_latitude:    data.client_latitude};
                                            insertProfileSearch(app_id, data_insert)
                                            .then(()=>{
                                                if (result_search.length>0)
                                                    resolve({
                                                        count: result_search.length,
                                                        items: result_search
                                                    });
                                                else {
                                                    //return silent message if not found, no popup message
                                                    resolve({
                                                        count: 0,
                                                        items: null
                                                    });
                                                }
                                            });
                                        });
                                    });
                                    break;
                                }
                                case '/USER_ACCOUNT_APP_SETTING_GET':{
                                    //not used anymore, timetable.js calls directly
                                    ///user_account_app_setting/:id`).get(checkDataToken, getUserSetting);
                                    break;
                                }
                                case '/USER_ACCOUNT_APP_SETTING/ALL_GET':{
                                    getUserSettingsByUserId(app_id, getNumberValue(query.get('user_account_id')))
                                    .then((/**@type{Types.db_result_user_account_app_setting_getUserSettingsByUserId[]}*/result)=>{
                                        if (result)
                                            resolve({
                                                count: result.length,
                                                items: result
                                            });
                                        else
                                            import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found_promise}) => {
                                                record_not_found_promise(app_id, query.get('lang_code')).then((/**@type{string}*/message)=>reject(message));
                                            });
                                    });
                                    break;
                                }
                                case '/USER_ACCOUNT_APP_SETTING/PROFILE_GET':{
                                    getProfileUserSetting(app_id, getNumberValue(query.get('id')))
                                    .then((/**@type{Types.db_result_user_account_app_setting_getProfileUserSetting[]}*/result)=>{
                                        if (result[0])
                                            resolve({items: result[0]});
                                        else
                                            import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found_promise}) => {
                                                record_not_found_promise(app_id, query.get('lang_code')).then((/**@type{string}*/message)=>reject(message));
                                            });
                                    });
                                    break;
                                }
                                case '/USER_ACCOUNT_APP_SETTING/PROFILE/ALL_GET':{
                                    getProfileUserSettings(app_id, getNumberValue(query.get('id')), getNumberValue(query.get('id_current_user')))
                                    .then((/**@type{Types.db_result_user_account_app_setting_getProfileUserSettings[]}*/result)=>{
                                        if (result)
                                            resolve({
                                                count: result.length,
                                                items: result
                                            });
                                        else
                                            import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found_promise}) => {
                                                record_not_found_promise(app_id, query.get('lang_code')).then((/**@type{string}*/message)=>reject(message));
                                            });
                                    });
                                    break;
                                }
                                case '/USER_ACCOUNT_APP_SETTING/PROFILE/TOP_GET':{
                                    getProfileTopSetting(app_id, getNumberValue(query.get('statchoice')))
                                    .then((/**@type{Types.db_result_user_account_app_setting_getProfileTopSetting[]}*/result)=>{
                                        if (result)
                                            resolve({
                                                count: result.length,
                                                items: result
                                            }); 
                                        else
                                            import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found_promise}) => {
                                                record_not_found_promise(app_id, query.get('lang_code')).then((/**@type{string}*/message)=>reject(message));
                                            });
                                    });
                                    break;
                                }
                                case '/USER_ACCOUNT_APP_SETTING_VIEW_POST':{
                                    /**@type{Types.db_parameter_user_account_app_setting_view_insertUserSettingView} */
                                    const data_insert = {   client_ip:          ip,
                                                            client_user_agent:  user_agent,
                                                            client_longitude:   data.client_longitude,
                                                            client_latitude:    data.client_latitude,
                                                            user_account_id:    getNumberValue(data.user_account_id),
                                                            user_setting_id:    getNumberValue(data.user_setting_id) ?? 0};
                                    insertUserSettingView(app_id, data_insert)
                                    .then((/**@type{Types.db_result_user_account_app_setting_view_insertUserSettingView}*/result)=>{
                                        resolve({
                                            count: result.affectedRows,
                                            items: Array(result)
                                        });
                                    });
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    break;
                }
                case 'ACCESS':{
                    break;
                }
                case 'SYSTEMADMIN':{
                    switch (service){
                        case 'BROADCAST':{
                            switch (routeFunction + '_' + method){
                                case '/BROADCAST/MESSAGE/SYSTEMADMIN_POST':{
                                    BroadcastSendSystemAdmin(getNumberValue(data.app_id), getNumberValue(data.client_id), getNumberValue(data.client_id_current),
                                        data.broadcast_type, data.broadcast_message, (/**@type{Types.error}*/err, /**@type{object}*/result) =>{
                                        resolve(result);
                                    });
                                    break;
                                }
                                case '/BROADCAST/CONNECTION/SYSTEMADMIN_GET':{
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
                                case '/BROADCAST/CONNECTION/SYSTEMADMIN_PATCH':{
                                    ConnectedUpdate(getNumberValue(query.get('client_id')), getNumberValue(query.get('user_account_logon_user_account_id')), getNumberValue(query.get('system_admin')), 
                                                    getNumberValue(query.get('identity_provider_id')), query.get('latitude'), query.get('longitude'),
                                                    (/**@type{Types.error}*/err, /**@type{void}*/result) =>{
                                        resolve(err ?? result);
                                    });
                                    break;
                                }
                            }
                            break;
                        }
                        case 'SERVER':{
                            switch (routeFunction + '_' + method){
                                case '/CONFIG/SYSTEMADMIN_PUT':{
                                    ConfigSave(getNumberValue(data.config_no), data.config_json, false, (err, result)=>{
                                        if (err)
                                            reject(err);
                                        else
                                            resolve(result);
                                    });
                                    break;
                                }
                                case '/CONFIG/SYSTEMADMIN_GET':{
                                    resolve({data:getNumberValue(ConfigGet(query.get('config_group'), query.get('parameter')))});
                                    break;
                                }
                                case '/CONFIG/SYSTEMADMIN/APPS_GET':{
                                    resolve({ data: ConfigGetApps()});
                                    break;
                                }
                                case '/CONFIG/SYSTEMADMIN/SAVED_GET':{
                                    resolve({data: ConfigGetSaved(getNumberValue(query.get('config_type_no')))});
                                    break;
                                }
                                case '/CONFIG/SYSTEMADMIN/MAINTENANCE_GET':{
                                    ConfigMaintenanceGet((err, result)=>{
                                        if (err)
                                            reject(err);
                                        else
                                            resolve({value: result});
                                    });
                                    break;
                                }
                                case '/CONFIG/SYSTEMADMIN/MAINTENANCE_PATCH':{
                                    ConfigMaintenanceSet(data.value, (err, result)=>{
                                        if (err)
                                            reject(err);
                                        else
                                            resolve(result);
                                    });
                                    break;
                                }
                                case '/CONFIG/INFO_GET':{
                                    ConfigInfo((err, result)=>{
                                        if (err)
                                            reject(err);
                                        else
                                            resolve({data: result.info});
                                    });
                                    break;
                                }
                                case '/INFO_GET':{
                                    Info((err, result)=>{
                                        if (err)
                                            reject(err);
                                        else
                                            resolve(result);
                                    });
                                    break;
                                }
                            }
                            break;
                        }
                        case 'DB_API':{
                            switch (routeFunction + '_' + method){
                                case '/SYSTEMADMIN/DBINFO_GET':{
                                    DBInfo(app_id).then((/**@type{Types.db_result_admin_DBInfo[]}*/result) =>{
                                        resolve({
                                            data: result[0]
                                        });
                                    });
                                    break;
                                }
                                case '/SYSTEMADMIN/DBINFOSPACE_GET':{
                                    DBInfoSpace(app_id).then((/**@type{Types.db_result_admin_DBInfoSpace[]}*/result) =>{
                                        resolve({
                                            data: result
                                        });
                                    });
                                    break;
                                }
                                case '/SYSTEMADMIN/DBINFOSPACESUM_GET':{
                                    DBInfoSpaceSum(app_id).then((/**@type{Types.db_result_admin_DBInfoSpaceSum[]}*/result) =>{
                                        resolve({
                                            data: result[0]
                                        });
                                    });                                    
                                    break;
                                }
                                case '/SYSTEMADMIN/INSTALL_POST':{
                                    install_db(app_id,getNumberValue(query.get('optional')), (/**@type{Types.error}*/err, /**@type{Types.admin_db_install_result}*/result) =>{
                                        if (err)
                                            reject(err);
                                        else
                                            resolve(result);
                                    });
                                    break;
                                }
                                case '/SYSTEMADMIN/INSTALL_GET':{
                                    install_db_check(app_id, (/**@type{Types.error}*/err, /**@type{Types.admin_db_install_db_check}*/result) =>{
                                        if (err)
                                            reject(err);
                                        else
                                            resolve(result);
                                    });
                                    break;
                                }
                                case '/SYSTEMADMIN/INSTALL_DELETE':{
                                    install_db_delete(app_id, (/**@type{Types.error}*/err, /**@type{Types.admin_db_install_delete_result}*/result) =>{
                                        if (err)
                                            reject(err);
                                        else
                                            resolve(result);
                                    });
                                    break;
                                }
                            }
                            break;
                        }
                        case 'LOG':{
                            switch (routeFunction + '_' + method){
                                case '/LOG/PARAMETERS_GET':{
                                    getLogParameters(app_id, (/**@type{Types.error}*/err, /**@type{Types.admin_log_parameters}*/result) =>{
                                        if (err)
                                            reject(err);
                                        else
                                            resolve(result);
                                    });
                                    break;
                                }
                                case '/LOG/LOGS_GET':{
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
                                case '/LOG/STATUSCODE_GET':{
                                    getStatusCodes().then((/**@type{object}*/status_codes)=>{
                                        resolve({
                                            status_codes: status_codes
                                        });
                                    });
                                    break;
                                }
                                case '/LOG/LOGS_STAT_GET':{
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
                                case '/LOG/FILES_GET':{
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
                            }
                            break;
                        }
                    }
                    break;
                }
                case 'ADMIN':{
                    switch (service){
                        case 'BROADCAST':{
                            switch (routeFunction + '_' + method){
                                case '/BROADCAST/MESSAGE/ADMIN_POST':{
                                    BroadcastSendAdmin(getNumberValue(data.app_id), getNumberValue(data.client_id), getNumberValue(data.client_id_current),
                                                                data.broadcast_type, data.broadcast_message, (/**@type{Types.error}*/err, /**@type{object}*/result) =>{
                                        resolve(result);
                                    });
                                    break;
                                }
                                case '/BROADCAST/CONNECTION/ADMIN_GET':{
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
                                case '/BROADCAST/CONNECTION/ADMIN/COUNT_GET':{
                                    ConnectedCount( getNumberValue(query.get('identity_provider_id')), getNumberValue(query.get('count_logged_in')), 
                                                    (/**@type{Types.error}*/err, /**@type{number}*/count_connected) => {
                                        resolve({data: count_connected});
                                    });
                                    break;
                                }
                            }
                            break;
                        }
                        case 'SERVER':{
                            switch (routeFunction + '_' + method){
                                case '/CONFIG/ADMIN_GET':{
                                    resolve({data:getNumberValue(ConfigGet(query.get('config_group'), query.get('parameter')))});
                                    break;
                                }
                            }
                            break;
                        }
                        case 'DB_API':{
                            switch (routeFunction + '_' + method){
                                case '/ADMIN/DEMO_POST':{
                                    demo_add(app_id, data.demo_password, query.get('lang_code'), (/**@type{Types.error}*/err, /**@type{Types.admin_db_install_result}*/result) =>{
                                        if (err) {
                                            reject(err);
                                        }
                                        else
                                            resolve(result);
                                    });
                                    break;
                                }
                                case '/ADMIN/DEMO_DELETE':{
                                    demo_delete(app_id, (/**@type{Types.error}*/err, /**@type{number}*/result_demo_users_length) =>{
                                        if (err) {
                                            reject(err);
                                        }
                                        else
                                            resolve({
                                                count_deleted: result_demo_users_length
                                            });
                                    });
                                    break;
                                }
                                case '/APPS/ADMIN_GET':{
                                    getAppsAdmin(app_id, query.get('lang_code'))
                                    .then((/**@type{Types.db_result_app_getAppAdmin[]}*/result) =>{
                                        resolve({
                                            data: result
                                        });
                                    });
                                    break;
                                }
                                case '/APPS/ADMIN_PUT':{
                                    /**@type{Types.db_parameter_app_updateAppAdmin} */
                                    const body = {	app_name:		data.app_name,
                                                    url: 			data.url,
                                                    logo: 			data.logo,
                                                    enabled: 		getNumberValue(data.enabled) ?? 0,
                                                    app_category_id:getNumberValue(data.app_category_id)};
                                    updateAppAdmin(app_id, getNumberValue(query.get('PUT_ID')), body)
                                    .then((/**@type{Types.db_result_app_updateAppAdmin}*/result)=> {
                                        resolve({
                                            data: result
                                        });
                                    });
                                    break;
                                }
                                case '/APP_CATEGORY/ADMIN_GET':{
                                    getAppCategoryAdmin(app_id, getNumberValue(query.get('id')), query.get('lang_code'))
                                    .then((/**@type{Types.db_result_app_category_getAppCategoryAdmin[]}*/result) =>{
                                        resolve({
                                            data: result
                                        });
                                    });
                                    break;
                                }
                                case '/APP_LOG/ADMIN_GET':{
                                    getLogsAdmin(   app_id, getNumberValue(query.get('select_app_id')), getNumberValue(query.get('year')), getNumberValue(query.get('month')), 
                                                    getNumberValue(query.get('sort')), query.get('order_by'), getNumberValue(query.get('offset')), getNumberValue(query.get('limit')))
                                    .then((/**@type{Types.db_result_app_log_getLogsAdmin[]}*/result) =>{
                                        if (result.length>0)
                                            resolve(result);
                                        else{
                                            import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found_promise}) => {
                                                record_not_found_promise(app_id, query.get('lang_code')).then((/**@type{string}*/message)=>reject(message));
                                            });
                                        }
                                    });
                                    break;
                                }
                                case '/APP_LOG/ADMIN/STAT/UNIQUEVISITOR_GET':{
                                    getStatUniqueVisitorAdmin(app_id, getNumberValue(query.get('select_app_id')), getNumberValue(query.get('year')), getNumberValue(query.get('month')))
                                    .then((/**@type{Types.db_result_app_log_getStatUniqueVisitorAdmin[]}*/result) =>{
                                        if (result.length>0)
                                            resolve(result);
                                        else{
                                            import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found_promise}) => {
                                                record_not_found_promise(app_id, query.get('lang_code')).then((/**@type{string}*/message)=>reject(message));
                                            });
                                        }
                                    });
                                    break;
                                }
                                case '/APP_PARAMETER/ADMIN/ALL_GET':{
                                    getParametersAllAdmin(app_id, getNumberValue(query.get('data_app_id')), query.get('lang_code'))
                                    .then((/**@type{Types.db_result_app_parameter_getParametersAllAdmin[]}*/result)=> {
                                        resolve({
                                            data: result
                                        });
                                    });
                                    break;
                                }
                                case '/APP_PARAMETER/ADMIN_PUT':{
                                    /**@type{Types.db_parameter_app_parameter_setParameter_admin} */
                                    const body = {	app_id: 			app_id,
                                                    parameter_type_id: 	data.parameter_type_id,
                                                    parameter_name: 	data.parameter_name,
                                                    parameter_value: 	data.parameter_value, 
                                                    parameter_comment: 	data.parameter_comment
                                    };
                                    setParameter_admin(app_id, body)
                                    .then((/**@type{Types.db_result_app_parameter_setParameter_admin}*/result)=> {
                                        resolve({
                                            data: result
                                        });
                                    });
                                    break;
                                }
                                case '/APP_ROLE/ADMIN_GET':{
                                    getAppRoleAdmin(app_id, getNumberValue(query.get('id')))
                                    .then((/**@type{Types.db_result_app_role_getAppRoleAdmin[]}*/result)=> {
                                        resolve({
                                            data: result
                                        });
                                    });
                                    break;
                                }
                                case '/PARAMETER_TYPE/ADMIN_GET':{
                                    getParameterTypeAdmin(app_id, getNumberValue(query.get('id')), query.get('lang_code'))
                                    .then((/**@type{Types.db_result_parameter_type_getParameterTypeAdmin[]}*/result)=>{
                                        resolve({
                                            data: result
                                        });
                                    });
                                    break;
                                }
                                case '/USER_ACCOUNT/ADMIN_PUT':{
                                    // get avatar and provider column used to validate
                                    getUserByUserId(app_id, getNumberValue(query.get('PUT_ID')))
                                    .then((/**@type{Types.db_result_user_account_getUserByUserId[]}*/result_user)=>{
                                        if (result_user[0]) {
                                            /**@type{Types.db_parameter_user_account_updateUserSuperAdmin} */
                                            const body = {  app_role_id:        getNumberValue(data.app_role_id),
                                                            active:             getNumberValue(data.active),
                                                            user_level:         getNumberValue(data.user_level),
                                                            private:            getNumberValue(data.private),
                                                            username:           data.username,
                                                            bio:                data.bio,
                                                            email:              data.email,
                                                            email_unverified:   data.email_unverified,
                                                            password:           null,
                                                            password_new:       data.password_new==''?null:data.password_new,
                                                            password_reminder:  data.password_reminder,
                                                            verification_code:  data.verification_code,
                                                            provider_id:        result_user[0].provider_id,
                                                            avatar:             result_user[0].avatar,
                                                            admin:              1};
                                            updateUserSuperAdmin(app_id, getNumberValue(query.get('PUT_ID')), body)
                                            .then((/**@type{Types.db_result_user_account_updateUserSuperAdmin}*/result_update)=>{
                                                if (data.app_role_id!=0 && data.app_role_id!=1){
                                                    //delete admin app from user if user is not an admin anymore
                                                    import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_app/user_account_app.service.js`).then(({ deleteUserAccountApps }) => {
                                                        deleteUserAccountApps(app_id, getNumberValue(query.get('PUT_ID')), app_id)
                                                        .then(()=>{
                                                            resolve({
                                                                data: result_update
                                                            });
                                                        });
                                                    });
                                                }
                                                else
                                                    resolve({
                                                        data: result_update
                                                    });
                                            })
                                            .catch((/**@type{Types.error}*/error)=>{
                                                checked_error(app_id, query.get('lang_code'), error).then((/**@type{string}*/message)=>reject(message));
                                            });
                                        }
                                        else{
                                            import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found_promise}) => {
                                                record_not_found_promise(app_id, query.get('lang_code')).then((/**@type{string}*/message)=>reject(message));
                                            });
                                        }
                                    });
                                    break;
                                }
                                case '/USER_ACCOUNT/ADMIN/COUNT_GET':{
                                    getStatCountAdmin(app_id)
                                    .then((/**@type{Types.db_result_user_account_getStatCountAdmin[]}*/result)=>{
                                        resolve({
                                            data: result
                                        });
                                    });
                                    break;
                                }
                                //  app.route(`${rest_resouce_server}/dbapi${rest_resource_service_db_schema}/user_account_app/:user_account_id`).get(checkAccessToken, getUserAccountApp);
                                case '/USER_ACCOUNT_APP_GET':{
                                    getUserAccountApp(app_id, getNumberValue(query.get('user_account_id')))
                                    .then((/**@type{Types.db_result_user_account_app_getUserAccountApp[]}*/result)=>{
                                        resolve({
                                            items: result
                                        });
                                    });
                                    break;
                                }
                                case '/USER_ACCOUNT/ADMIN_GET':{
                                    getUsersAdmin(app_id, query.get('search'), getNumberValue(query.get('sort')), query.get('order_by'), getNumberValue(query.get('offset')), getNumberValue(query.get('limit')))
                                    .then((/**@type{Types.db_result_user_account_getUsersAdmin[]}*/result)=>{
                                        resolve({
                                            data: result
                                        });
                                    });
                                    break;
                                }
                                case '/USER_ACCOUNT_LOGON/ADMIN_GET':{
                                    getUserAccountLogonAdmin(app_id, getNumberValue(query.get('data_user_account_id')), getNumberValue(query.get('data_app_id')=='\'\''?'':query.get('data_app_id')))
                                    .then((/**@type{Types.db_result_user_account_logon_getUserAccountLogonAdmin[]}*/result)=>{
                                        resolve({
                                            data: result
                                        });
                                    });
                                }
                            }
                        }
                    }
                    break;
                }
                case 'AUTH':{
                    switch (routeFunction + '_' + method){
                        case '/AUTH/ADMIN_POST':{
                            const check_user = async (/**@type{string}*/username, /**@type{string}*/password) => {
                                const { default: {compareSync} } = await import('bcryptjs');
                                const config_username = ConfigGetUser('username');
                                const config_password = ConfigGetUser('password');
                                if (username == config_username && compareSync(password, config_password)) {
                                    const jsontoken_at = sign ({tokentimstamp: Date.now()}, ConfigGet('SERVICE_AUTH', 'ADMIN_TOKEN_SECRET'), {
                                                        expiresIn: ConfigGet('SERVICE_AUTH', 'ADMIN_TOKEN_EXPIRE_ACCESS')
                                                        });
                                    resolve({ 
                                        token_at: jsontoken_at
                                    });
                                }
                                else{
                                    res.statusMessage = 'unauthorized system admin login attempt for username:' + username;
                                    res.statusCode =401;
                                    reject('⛔');
                                }            
                            };
                            if(authorization){       
                                const userpass =  Buffer.from((authorization || '').split(' ')[1] || '', 'base64').toString();
                                const username = userpass.split(':')[0];
                                const password = userpass.split(':')[1];
                                if (CheckFirstTime())
                                    CreateSystemAdmin(username, password, () =>{
                                        check_user(username, password);
                                    });
                                else
                                    check_user(username, password);
                            }
                            else{
                                res.statusCode =401;
                                reject('⛔');
                            }
                        }
                    }
                    break;
                }
                case 'SOCKET':{
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
    const {DBStart} = await import(`file://${process.cwd()}/server/dbapi/admin/admin.service.js`);
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
        await DBStart();
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