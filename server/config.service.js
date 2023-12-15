/** @module server/config */

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
/**@type{Types.config_iam_blockip} */
let CONFIG_IAM_BLOCKIP;
/**@type{Types.config_iam_policy} */
let CONFIG_IAM_POLICY;
/**@type{Types.config_iam_user_agent} */
let CONFIG_IAM_USERAGENT;
/**@type{Types.config_iam_user} */
let CONFIG_IAM_USER;
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
 * Config files
 * @returns {Types.config_files[]}
 */
 const config_files = () => {
    return [
            [0, SERVER_CONFIG_INIT_PATH],
            [1, CONFIG_INIT.FILE_CONFIG_SERVER],
            [2, CONFIG_INIT.FILE_CONFIG_APPS],
            [3, CONFIG_INIT.FILE_CONFIG_IAM_BLOCKIP],
            [4, CONFIG_INIT.FILE_CONFIG_IAM_POLICY],
            [5, CONFIG_INIT.FILE_CONFIG_IAM_USERAGENT],
            [6, CONFIG_INIT.FILE_CONFIG_IAM_USER],
            [7, CONFIG_INIT.FILE_CONFIG_MICROSERVICE],
            [8, CONFIG_INIT.FILE_CONFIG_MICROSERVICE_SERVICES]
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
    return CONFIG_IAM_USER[parameter];
 };
/**
 * Config get apps
 * @returns {Types.config_apps[]}
 */
 const ConfigGetApps = () => {
    //return apps array in the object without secret keys
    const apps = Object.entries(CONFIG_APPS)[0][1].reduce(( /**@type{Types.config_apps} */app, 
                                                            /**@type {Types.config_apps}*/current)=> 
                                                                app.concat({APP_ID:current.APP_ID,
                                                                            NAME:current.NAME,
                                                                            CLIENT_ID:current.CLIENT_ID,
                                                                            PATH:current.PATH,
                                                                            ENDPOINT:current.ENDPOINT,
                                                                            LOGO:current.LOGO,
                                                                            MANIFEST:current.MANIFEST,
                                                                            JS:current.JS,
                                                                            JS_REPORT:current.JS_REPORT,
                                                                            CSS:current.CSS,
                                                                            CSS_REPORT:current.CSS_REPORT,
                                                                            FAVICON_32x32:current.FAVICON_32x32,
                                                                            FAVICON_192x192:current.FAVICON_192x192,
                                                                            SHOWINFO:current.SHOWINFO,
                                                                            SHOWPARAM:current.SHOWPARAM,
                                                                            SUBDOMAIN:current.SUBDOMAIN}) , []);
    return apps;                                                            
 };
/**
 * Config get app
 * @param {string|number} config_group
 * @param {Types.config_apps_keys} parameter
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
        case 'NAME':
        case 'PATH':
        case 'ENDPOINT':
        case 'LOGO':
        case 'MANIFEST':
        case 'JS':
        case 'JS_SECURE':
        case 'JS_REPORT':
        case 'CSS':
        case 'CSS_REPORT':
        case 'FAVICON_32x32':
        case 'FAVICON_192x192':
        case 'SHOWINFO':
        case 'SHOWPARAM':
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
        for (const key of Object.keys(config_parameter_row)){
            if (key==parameter){
                /**@ts-ignore */
                return config_parameter_row[key];
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
        for (const dir of [ `${SLASH}config`, 
                            `${SLASH}logs`, 
                            `${SLASH}microservice${SLASH}config`, 
                            `${SLASH}microservice${SLASH}logs`, 
                            `${SLASH}microservice${SLASH}temp`]){
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
                            [1, `${SLASH}server${SLASH}default_config.json`],
                            [2, `${SLASH}server${SLASH}default_apps.json`],
                            [3, `${SLASH}server${SLASH}default_iam_blockip.json`],
                            [4, `${SLASH}server${SLASH}default_iam_policy.json`],
                            [5, `${SLASH}server${SLASH}default_iam_useragent.json`],
                            [6, `${SLASH}server${SLASH}default_iam_user.json`],
                            [7, `${SLASH}microservice${SLASH}default_microservice_config.json`],
                            [8, `${SLASH}microservice${SLASH}default_microservices.json`],
                        ]; 
    //ES2020 import() with ES6 promises
    const config_json = await Promise.all(default_files.map(file => {
        return fs.promises.readFile(process.cwd() + file[1], 'utf8');
    }));
    /**@type{Types.config[]} */
    const config_obj = [JSON.parse(config_json[0]),
                        JSON.parse(config_json[1]),
                        JSON.parse(config_json[2]),
                        JSON.parse(config_json[3]),
                        JSON.parse(config_json[4]),
                        JSON.parse(config_json[5]),
                        JSON.parse(config_json[6]),
                        JSON.parse(config_json[7])];
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
    config_obj[0].SERVICE_IAM.map(row=>{
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
    
    //set paths in microservice config
    config_obj[6].PATH_LOGS             = `${SLASH}microservice${SLASH}${config_obj[6].PATH_LOGS}${SLASH}`;
    config_obj[6].PATH_TEMP             = `${SLASH}microservice${SLASH}${config_obj[6].PATH_TEMP}${SLASH}`;
    config_obj[6].MESSAGE_QUEUE_ERROR   = `${config_obj[6].PATH_LOGS}${config_obj[6].MESSAGE_QUEUE_ERROR}`;
    config_obj[6].MESSAGE_QUEUE_PUBLISH = `${config_obj[6].PATH_LOGS}${config_obj[6].MESSAGE_QUEUE_PUBLISH}`;
    config_obj[6].MESSAGE_QUEUE_CONSUME = `${config_obj[6].PATH_LOGS}${config_obj[6].MESSAGE_QUEUE_CONSUME}`;
    //set paths in microservice services
    config_obj[7].SERVICES.map(row=>{
        row.HTTPS_KEY             = `${SLASH}microservice${SLASH}config${SLASH}${row.HTTPS_KEY}`;
        row.HTTPS_CERT            = `${SLASH}microservice${SLASH}config${SLASH}${row.HTTPS_CERT}`;
        row.PATH                  = `${SLASH}microservice${SLASH}${row.PATH}${SLASH}`;
    });
    
    
    //server metadata
    const config_init = {
        CONFIGURATION:                    app_portfolio_title,
        CREATED:                          `${new Date().toISOString()}`,
        MODIFIED:                         '',
        MAINTENANCE:                      '0',
        FILE_CONFIG_SERVER:               `${SLASH}config${SLASH}config.json`,
        FILE_CONFIG_APPS:                 `${SLASH}config${SLASH}apps.json`,
        FILE_CONFIG_IAM_BLOCKIP:          `${SLASH}config${SLASH}iam_blockip.json`,
        FILE_CONFIG_IAM_POLICY:           `${SLASH}config${SLASH}iam_policy.json`,
        FILE_CONFIG_IAM_USERAGENT:        `${SLASH}config${SLASH}iam_useragent.json`,
        FILE_CONFIG_IAM_USER:             `${SLASH}config${SLASH}iam_user.json`,
        FILE_CONFIG_MICROSERVICE:         `${SLASH}microservice${SLASH}config${SLASH}config.json`,
        FILE_CONFIG_MICROSERVICE_SERVICES:`${SLASH}microservice${SLASH}config${SLASH}services.json`,
        PATH_LOG:                         `${SLASH}logs${SLASH}`
        };
    //save initial config files with metadata including path to config files
    await fs.promises.writeFile(process.cwd() + SERVER_CONFIG_INIT_PATH, JSON.stringify(config_init, undefined, 2),  'utf8');

    //save in module variable
    CONFIG_INIT = config_init;
    let config_created=0;
    for (const config_row of config_obj){
        //send fileno in file array
        await ConfigSave( default_files[config_created][0], config_row, true);
        config_created++;
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
                        CONFIG_IAM_BLOCKIP = JSON.parse(fileBuffer.toString());
                        break;
                    }
                    case 4:{
                        CONFIG_IAM_POLICY = JSON.parse(fileBuffer.toString());
                        break;
                    }
                    case 5:{
                        CONFIG_IAM_USERAGENT = JSON.parse(fileBuffer.toString());
                        break;
                    }
                    case 6:{
                        CONFIG_IAM_USER = JSON.parse(fileBuffer.toString());
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
 * Config init read file
 * @returns {Promise<Types.config_init>}
 */
 const ConfigInitReadFile = async () => {
    const fs = await import('node:fs');
    const fileBuffer = await fs.promises.readFile(process.cwd() + SERVER_CONFIG_INIT_PATH, 'utf8'); 
    return JSON.parse(fileBuffer.toString());
};

/**
 * Config maintenance set
 * @param {string} value
 */
 const ConfigMaintenanceSet = async (value) => {
    const fs = await import('node:fs');
    const config_init = await ConfigInitReadFile();
    config_init.MAINTENANCE = value;
    config_init.MODIFIED = new Date().toISOString();
    //maintenance in this config file is only updated so no need for backup files
    await fs.promises.writeFile(process.cwd() + SERVER_CONFIG_INIT_PATH, JSON.stringify(config_init, undefined, 2),  'utf8');
    CONFIG_INIT = config_init;
    return null;
};

/**
 * Config maintenance get
 */
const ConfigMaintenanceGet = async () => {
    const fs = await import('node:fs');
    const fileBuffer = await fs.promises.readFile(process.cwd() + SERVER_CONFIG_INIT_PATH, 'utf8');
    return {value:JSON.parse(fileBuffer.toString()).MAINTENANCE};
};
/**
 * Config get saved
 * 
 *   config_type_no
 *   0 = config_init                path + file
 *   1 = config                     path + file
 *   2 = apps                       path + file
 *   3 = iam blockip                path + file
 *   4 = iam policy                 path + file 
 *   5 = iam useragent              path + file
 *   6 = iam user                   path + file
 *   7 = microservice config        path + file
 *   8 = microservice config batch  path + file
 *   9 = microservice config pdf    path + file
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
            return CONFIG_IAM_BLOCKIP;
        }
        case 4:{
            return CONFIG_IAM_POLICY;
        }
        case 5:{
            return CONFIG_IAM_USERAGENT;
        }
        case 6:{
            return CONFIG_IAM_USER;
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
 */
const ConfigSave = async (config_no, config_json, first_time) => {
    const fs = await import('node:fs');
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
                            CONFIG_IAM_BLOCKIP = JSON.parse(config_json);
                            break;
                        }
                        case 4:{
                            CONFIG_IAM_POLICY = JSON.parse(config_json);
                            break;
                        }
                        case 5:{
                            CONFIG_IAM_USERAGENT = JSON.parse(config_json);
                            break;
                        }
                        case 6:{
                            CONFIG_IAM_USER = JSON.parse(config_json);
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
                return null;
            });
        }
        else{
            if (config_no == 0){
                //config_init.json file displayed info, do not update
                return null;
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
                    return null;
                });
            }
        }
    }
};
/**
 * Check first time
 * @returns {boolean}
 */
const CheckFirstTime = () => {
    if (CONFIG_IAM_USER.username=='')
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
    const { default: {genSalt, hash} } = await import('bcrypt');
    CONFIG_IAM_USER.username = admin_name;
    CONFIG_IAM_USER.password = await hash(admin_password, await genSalt(10));
    CONFIG_IAM_USER.modified = new Date().toISOString();
    import('node:fs').then((fs) => {
        fs.writeFile(process.cwd() + config_files()[6][1], JSON.stringify(CONFIG_IAM_USER, undefined, 2),  'utf8', (err) => {
            if (err)
                callBack(err, null);
            else
                callBack(null, null);
        });
    });
};

export{ CreateRandomString,
        ConfigMaintenanceSet, ConfigMaintenanceGet, ConfigGetSaved, ConfigSave, CheckFirstTime,
        CreateSystemAdmin, 
        ConfigGet, ConfigGetInit, ConfigGetUser, ConfigGetApps, ConfigGetApp, InitConfig, ConfigInitReadFile};