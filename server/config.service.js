/** @module server/config */

// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

const {file_get, file_update, file_get_cached, file_set_cache_all, file_create, create_config_and_logs_dir} = await import(`file://${process.cwd()}/server/db/file.service.js`);

/**@type{string} */
let SLASH;
if (process.platform == 'win32')
    SLASH = '\\';
else
    SLASH = '/';

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
 * Config get user
 * @param {Types.config_user_parameter} parameter
 * @returns {string}
 */
 const ConfigGetUser = (parameter) => {
    return file_get_cached('IAM_USER')[parameter];
 };
/**
 * Config get apps
 * @returns {Types.config_apps_record[]}
 */
 const ConfigGetApps = () => {
    //return apps array in the object without secret keys
    const apps = Object.entries(file_get_cached('APPS'))[0][1].reduce(( /**@type{Types.config_apps_record} */app, 
                                                            /**@type {Types.config_apps_record}*/current)=> 
                                                                app.concat({APP_ID:current.APP_ID,
                                                                            NAME:current.NAME,
                                                                            SUBDOMAIN:current.SUBDOMAIN,
                                                                            PATH:current.PATH,
                                                                            LOGO:current.LOGO,
                                                                            JS:current.JS,
                                                                            JS_SECURE:current.JS_SECURE,
                                                                            JS_REPORT:current.JS_REPORT,
                                                                            CSS:current.CSS,
                                                                            CSS_REPORT:current.CSS_REPORT,
                                                                            FAVICON_32x32:current.FAVICON_32x32,
                                                                            FAVICON_192x192:current.FAVICON_192x192,
                                                                            SHOWINFO:current.SHOWINFO,
                                                                            SHOWPARAM:current.SHOWPARAM}) , []);
    return apps;                                                            
 };
 /**
  * 
  * @param {string} host 
  * @returns 
  */
 const ConfigGetAppHost = (host) =>{
    switch (host.toString().split('.')[0]){
        case 'localhost':
        case 'www':{
            //localhost
            return Object.entries(file_get_cached('APPS'))[0][1].filter(
                (/**@type{Types.config_apps_record}*/app)=>{return app.SUBDOMAIN == 'www';})[0].APP_ID;
        }
        default:{
            try {
                return Object.entries(file_get_cached('APPS'))[0][1].filter(
                    (/**@type{Types.config_apps_record}*/app)=>{return host.toString().split('.')[0] == app.SUBDOMAIN;})[0].APP_ID;    
            } catch (error) {
                //request can be called from unkown hosts
                return null;
            }
        }
    }
 };
/**
 * Config get app
 * @param {number} app_id
 * @param {Types.config_apps_keys} parameter
 * @returns {object|null}
 */
 const ConfigGetApp = (app_id, parameter) => {
    switch(parameter){
        case 'NAME':
        case 'SUBDOMAIN':
        case 'PATH':
        case 'LOGO':
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
        case 'APP_DATA_SECRET':
        case 'APP_DATA_EXPIRE':
        case 'APP_ACCESS_SECRET':
        case 'APP_ACCESS_EXPIRE':
        case 'CONFIG':
        case 'RENDER_FILES':{
            return Object.entries(file_get_cached('APPS'))[0][1].filter(
                (/**@type{Types.config_apps_record}*/app)=>{return app.APP_ID == app_id;})[0][parameter];
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
    for (const config_parameter_row of file_get_cached('CONFIG')[config_group]){
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
 * @returns {Promise<boolean>}
 */
const ConfigExists = async () => {
    try {
        await file_get('CONFIG');    
        return true;
    } catch (error) {
        return false;
    }
};
/**
 * Default config
 * @throws {object}
 * @returns {Promise<null>}
 */
const DefaultConfig = async () => {
    const fs = await import('node:fs');
    const { createHash } = await import('node:crypto');
    await create_config_and_logs_dir()
    .catch((/**@type{Types.error}*/err) => {
        throw err;
    }); 
    const i = 0;
    //read all default files

    /**@type{[  [Types.db_file_db_name, Types.config_server],
                [Types.db_file_db_name, Types.config_apps],
                [Types.db_file_db_name, Types.config_iam_blockip],
                [Types.db_file_db_name, Types.config_iam_policy],
                [Types.db_file_db_name, Types.config_iam_useragent],
                [Types.db_file_db_name, Types.config_iam_user],
                [Types.db_file_db_name, Types.microservice_config],
                [Types.db_file_db_name, Types.microservice_config_service]]} 
    */
    const config_obj = [
                            ['CONFIG',                      await fs.promises.readFile(process.cwd() + `${SLASH}server${SLASH}default_config.json`).then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['APPS',                        await fs.promises.readFile(process.cwd() + `${SLASH}server${SLASH}default_apps.json`).then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['IAM_BLOCKIP',                 await fs.promises.readFile(process.cwd() + `${SLASH}server${SLASH}default_iam_blockip.json`).then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['IAM_POLICY',                  await fs.promises.readFile(process.cwd() + `${SLASH}server${SLASH}default_iam_policy.json`).then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['IAM_USERAGENT',               await fs.promises.readFile(process.cwd() + `${SLASH}server${SLASH}default_iam_useragent.json`).then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['IAM_USER',                    await fs.promises.readFile(process.cwd() + `${SLASH}server${SLASH}default_iam_user.json`).then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['MICROSERVICE_CONFIG',         await fs.promises.readFile(process.cwd() + `${SLASH}microservice${SLASH}default_microservice_config.json`).then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['MICROSERVICE_SERVICES',       await fs.promises.readFile(process.cwd() + `${SLASH}microservice${SLASH}default_microservices.json`).then(filebuffer=>JSON.parse(filebuffer.toString()))]
                        ]; 
    //set server parameters
    config_obj[0][1].SERVER.map((/**@type{Types.config_server_server}*/row)=>{
        for (const key of Object.keys(row)){
            if (key=='HTTPS_KEY')
                row.HTTPS_KEY = `${SLASH}config${SLASH}ssl${SLASH}${Object.values(row)[i]}`;
            if (key=='HTTPS_CERT')
                row.HTTPS_CERT = `${SLASH}config${SLASH}ssl${SLASH}${Object.values(row)[i]}`;
        } 
    });
    //generate hash
    config_obj[0][1].SERVICE_IAM.map((/**@type{Types.config_server_service_iam}*/row)=>{
        for (const key of Object.keys(row))
            if (key== 'ADMIN_TOKEN_SECRET'){
                row.ADMIN_TOKEN_SECRET = createHash('sha256').update(CreateRandomString()).digest('hex');
            }
    });
    //set log path
    config_obj[0][1].SERVICE_LOG.map((/**@type{Types.config_server_service_log}*/row)=>{
        for (const key of Object.keys(row))
            if (key== 'PATH_LOG'){
                row.PATH_LOG = `${SLASH}logs${SLASH}`;
            }
    });
    //set server metadata
    config_obj[0][1].CONFIGURATION    = app_portfolio_title;
    config_obj[0][1].CREATED          = `${new Date().toISOString()}`;
    config_obj[0][1].MODIFIED         = '';

    //generate hash for apps
    config_obj[1][1].APPS.map((/**@type{Types.config_apps_record}*/row)=>{
        row.CLIENT_ID = createHash('sha256').update(CreateRandomString()).digest('hex');
        row.CLIENT_SECRET = createHash('sha256').update(CreateRandomString()).digest('hex');
        row.DATA_SECRET = createHash('sha256').update(CreateRandomString()).digest('hex');
        row.ACCESS_SECRET = createHash('sha256').update(CreateRandomString()).digest('hex');
    });
    //set created for user
    config_obj[5][1].created = new Date().toISOString();
    
    //set paths in microservice config
    /**@type{Types.microservice_config} */
    const microservice_config = config_obj[6][1];
    microservice_config?microservice_config.PATH_LOGS             = `${SLASH}microservice${SLASH}${microservice_config.PATH_LOGS}${SLASH}`:'';
    microservice_config?microservice_config.PATH_TEMP             = `${SLASH}microservice${SLASH}${microservice_config.PATH_TEMP}${SLASH}`:'';
    microservice_config?microservice_config.MESSAGE_QUEUE_ERROR   = `${microservice_config.PATH_LOGS}${microservice_config.MESSAGE_QUEUE_ERROR}`:'';
    microservice_config?microservice_config.MESSAGE_QUEUE_PUBLISH = `${microservice_config.PATH_LOGS}${microservice_config.MESSAGE_QUEUE_PUBLISH}`:'';
    microservice_config?microservice_config.MESSAGE_QUEUE_CONSUME = `${microservice_config.PATH_LOGS}${microservice_config.MESSAGE_QUEUE_CONSUME}`:'';
    //set paths in microservice services
    config_obj[7][1].SERVICES.map((/**@type{Types.microservice_config_service_record}*/row)=>{
        row.HTTPS_KEY             = `${SLASH}microservice${SLASH}config${SLASH}${row.HTTPS_KEY}`;
        row.HTTPS_CERT            = `${SLASH}microservice${SLASH}config${SLASH}${row.HTTPS_CERT}`;
        row.PATH                  = `${SLASH}microservice${SLASH}${row.PATH}${SLASH}`;
    });
    for (const config_row of config_obj){
        await file_create(config_row[0], config_row[1]);
    }
    return null;
};
/**
 * Init config
 * @throws {object}
 * @returns {Promise<null>}
 */
const InitConfig = async () => {
    return await new Promise((resolve, reject) => {
        ConfigExists().then((result) => {
            if (result==true)
                file_set_cache_all().then(() => {
                    resolve(null);
                })
                .catch((/**@type{Types.error}*/error)=>{
                    reject (error);
                });
            else{
                DefaultConfig().then(() => {
                    file_set_cache_all().then(() => {
                        resolve(null);
                    })
                    .catch((/**@type{Types.error}*/error)=>{
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
 */
 const ConfigMaintenanceSet = async (value) => {
    const file = await file_get('CONFIG', true);
    file.file_content.MAINTENANCE = value;
    file.file_content.MODIFIED = new Date().toISOString();
    await file_update('CONFIG', file.transaction_id, file.file_content);
    return null;
};

/**
 * Config maintenance get
 */
const ConfigMaintenanceGet = async () => {
    const file = await file_get('CONFIG');
    return {value:file.file_content.MAINTENANCE};
};
/**
 * Config get saved
 * @param {Types.db_file_db_name} file
 * @returns {object}
 */
const ConfigGetSaved = file => file_get_cached(file);

/**
 * Config save
 * only one row should have second column not null
 * @param {[  ['CONFIG', Types.config_server],
 *            ['APPS', Types.config_apps],
 *            ['IAM_BLOCKIP', Types.config_iam_blockip],
 *            ['IAM_POLICY', Types.config_iam_policy],
 *            ['IAM_USERAGENT', Types.config_iam_useragent],
 *            ['IAM_USER', Types.config_iam_user],
 *            ['MICROSERVICE_CONFIG', Types.microservice_config],
 *            ['MICROSERVICE_SERVICES', Types.microservice_config_service]]} file_content
 */
const ConfigSave = async (file_content) => {
    const file_config = await file_get(file_content.filter(file=>(file[1]))[0][0], true);
    if (file_content[0][1]){
        file_content[0][1].MAINTENANCE = file_config.file_content.MAINTENANCE;
        file_content[0][1].CONFIGURATION = file_config.file_content.CONFIGURATION;
        file_content[0][1].COMMENT = file_config.file_content.COMMENT;
        file_content[0][1].CREATED = file_config.file_content.CREATED;
        file_content[0][1].MODIFIED = new Date().toISOString();
    }
    await file_update(file_content.filter(file=>(file[1]))[0][0], file_config.transaction_id, file_content.filter(file=>(file[1]))[0][1]);
};
/**
 * Check first time
 * @returns {boolean}
 */
const CheckFirstTime = () => {
    if (file_get_cached('IAM_USER').username=='')
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
    const file = await file_get('IAM_USER', true);
    file.file_content.username = admin_name;
    file.file_content.password = await hash(admin_password, await genSalt(10));
    file.file_content.modified = new Date().toISOString();
    await file_update('IAM_USER', file.transaction_id, file.file_content)
    .then(()=> {
        callBack(null, null);
    })
    .catch((/**@type{Types.error}*/error)=> {
        callBack(error, null);
    });
};

export{ CreateRandomString,
        ConfigMaintenanceSet, ConfigMaintenanceGet, ConfigGetSaved, ConfigSave, CheckFirstTime,
        CreateSystemAdmin, 
        ConfigGet, ConfigGetUser, ConfigGetApps, ConfigGetAppHost, ConfigGetApp, InitConfig};