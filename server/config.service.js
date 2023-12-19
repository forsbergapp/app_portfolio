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
 * @returns {Types.config_apps[]}
 */
 const ConfigGetApps = () => {
    //return apps array in the object without secret keys
    const apps = Object.entries(file_get_cached('APPS'))[0][1].reduce(( /**@type{Types.config_apps} */app, 
                                                            /**@type {Types.config_apps}*/current)=> 
                                                                app.concat({APP_ID:current.APP_ID,
                                                                            NAME:current.NAME,
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
                    return Object.entries(file_get_cached('APPS'))[0][1].filter(
                        (/**@type{Types.config_apps}*/app)=>{return app.SUBDOMAIN == 'www';})[0].APP_ID;
                }
                default:{
                    try {
                        return Object.entries(file_get_cached('APPS'))[0][1].filter(
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
            return Object.entries(file_get_cached('APPS'))[0][1].filter(
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
    /**@type{Types.db_file_default_files[]} */
    const default_files = [
                            ['CONFIG',                      `${SLASH}server${SLASH}default_config.json`],
                            ['APPS',                        `${SLASH}server${SLASH}default_apps.json`],
                            ['IAM_BLOCKIP',                 `${SLASH}server${SLASH}default_iam_blockip.json`],
                            ['IAM_POLICY',                  `${SLASH}server${SLASH}default_iam_policy.json`],
                            ['IAM_USERAGENT',               `${SLASH}server${SLASH}default_iam_useragent.json`],
                            ['IAM_USER',                    `${SLASH}server${SLASH}default_iam_user.json`],
                            ['MICROSERVICE_CONFIG',         `${SLASH}microservice${SLASH}default_microservice_config.json`],
                            ['MICROSERVICE_SERVICES',       `${SLASH}microservice${SLASH}default_microservices.json`],
                        ]; 
    //ES2020 import() with ES6 promises
    const config_json = await Promise.all(default_files.map(file => {
        return [file[0], fs.promises.readFile(process.cwd() + file[1], 'utf8')];
    }));
    /*
    const config_obj2 = await Promise.all(default_files.map(file => {
        fs.promises.readFile(process.cwd() + file[1], 'utf8')
        .then((file_content)=> {return [file[0], JSON.parse(file_content)];});
    }));
    */
    const config_obj = [[config_json[0][0], JSON.parse(config_json[0][1])],
                        [config_json[1][0], JSON.parse(config_json[1][1])],
                        [config_json[2][0], JSON.parse(config_json[2][1])],
                        [config_json[3][0], JSON.parse(config_json[3][1])],
                        [config_json[4][0], JSON.parse(config_json[4][1])],
                        [config_json[5][0], JSON.parse(config_json[5][1])],
                        [config_json[6][0], JSON.parse(config_json[6][1])],
                        [config_json[7][0], JSON.parse(config_json[7][1])]
                    ];
    //set server parameters
    config_obj.filter(file=>('CONFIG' in Object.keys(file)))[0][1].SERVER.map((/**@type{Types.config_server_server}*/row)=>{
        for (const key of Object.keys(row)){
            if (key=='HTTPS_KEY')
                row.HTTPS_KEY = `${SLASH}config${SLASH}ssl${SLASH}${Object.values(row)[i]}`;
            if (key=='HTTPS_CERT')
                row.HTTPS_CERT = `${SLASH}config${SLASH}ssl${SLASH}${Object.values(row)[i]}`;
        } 
    });
    //generate hash
    config_obj.filter(file=>('CONFIG' in Object.keys(file)))[0][1].SERVICE_IAM.map((/**@type{Types.config_server_service_iam}*/row)=>{
        for (const key of Object.keys(row))
            if (key== 'ADMIN_TOKEN_SECRET'){
                row.ADMIN_TOKEN_SECRET = createHash('sha256').update(CreateRandomString()).digest('hex');
            }
    });
    //set log path
    config_obj.filter(file=>('CONFIG' in Object.keys(file)))[0][1].SERVICE_LOG.map((/**@type{Types.config_server_service_log}*/row)=>{
        for (const key of Object.keys(row))
            if (key== 'PATH_LOG'){
                row.PATH_LOG = `${SLASH}logs${SLASH}`;
            }
    });
    //set server metadata
    config_obj.filter(file=>('CONFIG' in Object.keys(file)))[0][1].CONFIGURATION    = app_portfolio_title;
    config_obj.filter(file=>('CONFIG' in Object.keys(file)))[0][1].CREATED          = `${new Date().toISOString()}`;
    config_obj.filter(file=>('CONFIG' in Object.keys(file)))[0][1].MODIFIED         = '';

    //generate hash for apps
    config_obj.filter(file=>('APPS' in Object.keys(file)))[0][1].APPS.map((/**@type{Types.config_apps}*/row)=>{
        row.CLIENT_ID = createHash('sha256').update(CreateRandomString()).digest('hex');
        row.CLIENT_SECRET = createHash('sha256').update(CreateRandomString()).digest('hex');
        row.DATA_SECRET = createHash('sha256').update(CreateRandomString()).digest('hex');
        row.ACCESS_SECRET = createHash('sha256').update(CreateRandomString()).digest('hex');
    });
    //set created for user
    config_obj.filter(file=>('IAM_USER' in Object.keys(file)))[0][1].created = new Date().toISOString();
    
    //set paths in microservice config
    /**@type{Types.microservice_config} */
    const microservice_config = config_obj.filter((file)=>('MICROSERVICE_CONFIG' in Object.keys(file)))[0][1];
    microservice_config?microservice_config.PATH_LOGS             = `${SLASH}microservice${SLASH}${microservice_config.PATH_LOGS}${SLASH}`:'';
    microservice_config?microservice_config.PATH_TEMP             = `${SLASH}microservice${SLASH}${microservice_config.PATH_TEMP}${SLASH}`:'';
    microservice_config?microservice_config.MESSAGE_QUEUE_ERROR   = `${microservice_config.PATH_LOGS}${microservice_config.MESSAGE_QUEUE_ERROR}`:'';
    microservice_config?microservice_config.MESSAGE_QUEUE_PUBLISH = `${microservice_config.PATH_LOGS}${microservice_config.MESSAGE_QUEUE_PUBLISH}`:'';
    microservice_config?microservice_config.MESSAGE_QUEUE_CONSUME = `${microservice_config.PATH_LOGS}${microservice_config.MESSAGE_QUEUE_CONSUME}`:'';
    //set paths in microservice services
    config_obj.filter(file=>('MICROSERVICE_SERVICES' in Object.keys(file)))[0][1].SERVICES.map((/**@type{Types.microservice_config_service_record}*/row)=>{
        row.HTTPS_KEY             = `${SLASH}microservice${SLASH}config${SLASH}${row.HTTPS_KEY}`;
        row.HTTPS_CERT            = `${SLASH}microservice${SLASH}config${SLASH}${row.HTTPS_CERT}`;
        row.PATH                  = `${SLASH}microservice${SLASH}${row.PATH}${SLASH}`;
    });
    for (const config_row of config_obj){
        await ConfigSave( config_row[0], config_row[1], true);
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
 * @async
 * @param {Types.db_file_db_name} file
 * @param {Types.db_file_config_files} file_content
 * @param {boolean} first_time
 */
const ConfigSave = async (file, file_content, first_time) => {
    if (first_time){
        await file_create(file, file_content);
    }
    else{
        const file_config = await file_get(file, true);
        if (file=='CONFIG'){
            if (file_content){
                file_content.CONFIGURATION = file_config.file_content.CONFIGURATION;
                file_content.COMMENT = file_config.file_content.COMMENT;
                file_content.CREATED = file_config.file_content.CREATED;
                file_content.MODIFIED = new Date().toISOString();
            }
        }
        await file_update(file, file_config.transaction_id, file_content);
    }
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
        ConfigGet, ConfigGetUser, ConfigGetApps, ConfigGetApp, InitConfig};