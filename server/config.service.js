/** @module server/config */

/**@type{import('./db/file.service.js')} */
const {SLASH, file_get, file_update, file_get_cached, file_set_cache_all, file_create, create_config_and_logs_dir} = await import(`file://${process.cwd()}/server/db/file.service.js`);

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
 * @param {import('../types.js').config_user_parameter} parameter
 * @returns {string}
 */
 const ConfigGetUser = (parameter) => {
    return file_get_cached('IAM_USER')[parameter];
 };
/**
 * Config get apps
 * @param {number|null} app_id
 * @returns {import('../types.js').config_apps_record[]}
 */
 const ConfigGetApps = (app_id=null) => {
    //return apps array in the object without SECRETS, PARAMETERS and RENDER_CONFIG
    return Object.entries(file_get_cached('APPS'))[0][1]
                    .filter((/**@type{*}*/app)=>app.APP_ID == (app_id ?? app.APP_ID))
                    .reduce(( /**@type{import('../types.js').config_apps_record} */app, 
                                                            /**@type {import('../types.js').config_apps_record}*/current)=> 
                                                                app.concat({APP_ID:current.APP_ID,
                                                                            NAME:current.NAME,
                                                                            SUBDOMAIN:current.SUBDOMAIN,
                                                                            PATH:current.PATH,
                                                                            LOGO:current.LOGO,
                                                                            SHOWPARAM:current.SHOWPARAM,
                                                                            STATUS:current.STATUS}), []);
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
                (/**@type{import('../types.js').config_apps_record}*/app)=>{return app.SUBDOMAIN == 'www';})[0].APP_ID;
        }
        default:{
            try {
                return Object.entries(file_get_cached('APPS'))[0][1].filter(
                    (/**@type{import('../types.js').config_apps_record}*/app)=>{return host.toString().split('.')[0] == app.SUBDOMAIN;})[0].APP_ID;    
            } catch (error) {
                //request can be called from unkown hosts
                return null;
            }
        }
    }
 };
/**
 * Config get app
 * @param {number|null} app_id
 * @param {number|null} data_app_id
 * @param {import('../types.js').config_apps_keys} parameter
 * @returns {*|null}
 */
 const ConfigGetApp = (app_id, data_app_id, parameter) => {
    if (parameter == 'PARAMETERS')
        return Object.entries(file_get_cached('APPS'))[0][1].filter(
                (/**@type{import('../types.js').config_apps_record}*/app)=>{return app.APP_ID == data_app_id;})[0][parameter]
                .sort((/**@type{{}}*/a, /**@type{{}}*/b) => {
                    const x = Object.keys(a)[0].toLowerCase();
                    const y = Object.keys(b)[0].toLowerCase();
                    if (x < y) {
                        return -1;
                    }
                    if (x > y) {
                        return 1;
                    }
                    return 0;
                });
    else
        return Object.entries(file_get_cached('APPS'))[0][1].filter(
                (/**@type{import('../types.js').config_apps_record}*/app)=>{return app.APP_ID == data_app_id;})[0][parameter];
 };
/**
 * Config app secret reset db username and passwords for database in use
 * @param {number} app_id
 * @returns {Promise.<void>}
 */
  const ConfigAppSecretDBReset = async (app_id) => {
    /**@type{import('./server.service.js')} */
    const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);
    const file = await file_get('APPS', true);
    const db_use = getNumberValue(ConfigGet('SERVICE_DB', 'USE'));
    for (const app of file.file_content.APPS){
        app.SECRETS[`SERVICE_DB_DB${db_use}_APP_USER`] = '';
        app.SECRETS[`SERVICE_DB_DB${db_use}_APP_PASSWORD`] = '';
    }
    await file_update('APPS', file.transaction_id, file.file_content);
    await file_set_cache_all();
 };

 /**
 * Config app secret update
 * @param {number} app_id
 * @param {{app_id:             number,
   *          parameter_name:     string,
   *          parameter_value:    string}} data
   * @returns {Promise.<void>}
   */
    const ConfigAppSecretUpdate = async (app_id, data) => {
      const file = await file_get('APPS', true);
      file.file_content.APPS.filter((/**@type{*}*/row)=> row.APP_ID==data.app_id)[0].SECRETS[data.parameter_name] = data.parameter_value;
      await file_update('APPS', file.transaction_id, file.file_content);
      await file_set_cache_all();
   };
 /**
 * Config app parameter update
 * @param {number} app_id
 * @param {number} resource_id
 * @param {{parameter_name:     string,
 *          parameter_value:    string,
 *          parameter_comment:  string|null}} data
 * @returns {Promise.<void>}
 */
  const ConfigAppParameterUpdate = async (app_id, resource_id, data) => {
    const file = await file_get('APPS', true);
    
    for (const app of file.file_content.APPS){
        if (app.APP_ID == resource_id)
            for (const parameter of app.PARAMETERS){
                if (data.parameter_name in parameter){
                    parameter[data.parameter_name] = data.parameter_value;
                    if (parameter.COMMENT)
                        parameter.COMMENT = data.parameter_comment;
                    break;
                }           
            }
    }
    await file_update('APPS', file.transaction_id, file.file_content);
    await file_set_cache_all();
 };
/**
 * Config get
 * @param {import('../types.js').config_group} config_group
 * @param {string} parameter
 * @returns {string|null}
 */
const ConfigGet = (config_group, parameter) => {
    if (config_group=='METADATA')
        return parameter?file_get_cached('SERVER')[config_group][parameter]:file_get_cached('SERVER')[config_group];
    else{
        for (const config_parameter_row of file_get_cached('SERVER')[config_group]){
            for (const key of Object.keys(config_parameter_row)){
                if (key==parameter){
                    /**@ts-ignore */
                    return config_parameter_row[key];
                }
            }
        }                
        return null;
    }
};
/**
 * Config exists
 * @returns {Promise<boolean>}
 */
const ConfigExists = async () => {
    try {
        await file_get('SERVER');    
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
    .catch((/**@type{import('../types.js').error}*/err) => {
        throw err;
    }); 
    const i = 0;
    //read all default files

    /**@type{[  [import('../types.js').db_file_db_name, import('../types.js').config_server],
                [import('../types.js').db_file_db_name, import('../types.js').config_apps],
                [import('../types.js').db_file_db_name, import('../types.js').config_iam_blockip],
                [import('../types.js').db_file_db_name, import('../types.js').config_iam_policy],
                [import('../types.js').db_file_db_name, import('../types.js').config_iam_useragent],
                [import('../types.js').db_file_db_name, import('../types.js').config_iam_user],
                [import('../types.js').db_file_db_name, import('../types.js').microservice_config],
                [import('../types.js').db_file_db_name, import('../types.js').microservice_config_service]]} 
    */
    const config_obj = [
                            ['SERVER',                      await fs.promises.readFile(process.cwd() + `${SLASH}server${SLASH}default_config_server.json`).then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['APPS',                        await fs.promises.readFile(process.cwd() + `${SLASH}server${SLASH}default_config_apps.json`).then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['IAM_BLOCKIP',                 await fs.promises.readFile(process.cwd() + `${SLASH}server${SLASH}default_config_iam_blockip.json`).then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['IAM_POLICY',                  await fs.promises.readFile(process.cwd() + `${SLASH}server${SLASH}default_config_iam_policy.json`).then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['IAM_USERAGENT',               await fs.promises.readFile(process.cwd() + `${SLASH}server${SLASH}default_config_iam_useragent.json`).then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['IAM_USER',                    await fs.promises.readFile(process.cwd() + `${SLASH}server${SLASH}default_config_iam_user.json`).then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['MICROSERVICE_CONFIG',         await fs.promises.readFile(process.cwd() + `${SLASH}microservice${SLASH}default_microservice_config.json`).then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['MICROSERVICE_SERVICES',       await fs.promises.readFile(process.cwd() + `${SLASH}microservice${SLASH}default_microservices.json`).then(filebuffer=>JSON.parse(filebuffer.toString()))]
                        ]; 
    //set server parameters
    config_obj[0][1].SERVER.map((/**@type{import('../types.js').config_server_server}*/row)=>{
        for (const key of Object.keys(row)){
            if (key=='HTTPS_KEY')
                row.HTTPS_KEY = `${SLASH}config${SLASH}ssl${SLASH}${Object.values(row)[i]}`;
            if (key=='HTTPS_CERT')
                row.HTTPS_CERT = `${SLASH}config${SLASH}ssl${SLASH}${Object.values(row)[i]}`;
        } 
    });
    //generate hash
    config_obj[0][1].SERVICE_IAM.map((/**@type{import('../types.js').config_server_service_iam}*/row)=>{
        for (const key of Object.keys(row))
            if (key== 'ADMIN_TOKEN_SECRET'){
                row.ADMIN_TOKEN_SECRET = createHash('sha256').update(CreateRandomString()).digest('hex');
            }
    });
    //set server metadata
    config_obj[0][1].METADATA.CONFIGURATION = app_portfolio_title;
    config_obj[0][1].METADATA.CREATED       = `${new Date().toISOString()}`;
    config_obj[0][1].METADATA.MODIFIED      = '';

    //generate hash for apps
    config_obj[1][1].APPS.map((/**@type{import('../types.js').config_apps_record}*/row)=>{
        row.SECRETS.CLIENT_ID = createHash('sha256').update(CreateRandomString()).digest('hex');
        row.SECRETS.CLIENT_SECRET = createHash('sha256').update(CreateRandomString()).digest('hex');
        row.SECRETS.APP_ID_SECRET = createHash('sha256').update(CreateRandomString()).digest('hex');
        row.SECRETS.APP_ACCESS_SECRET = createHash('sha256').update(CreateRandomString()).digest('hex');
    });
    //set created for user
    config_obj[5][1].created = new Date().toISOString();
    
    //set paths in microservice config
    /**@type{import('../types.js').microservice_config} */
    const microservice_config = config_obj[6][1];
    microservice_config?microservice_config.PATH_DATA             = `${SLASH}microservice${SLASH}${microservice_config.PATH_DATA}${SLASH}`:'';
    microservice_config?microservice_config.PATH_TEMP             = `${SLASH}microservice${SLASH}${microservice_config.PATH_TEMP}${SLASH}`:'';
    //set paths in microservice services
    config_obj[7][1].SERVICES.map((/**@type{import('../types.js').microservice_config_service_record}*/row)=>{
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
                .catch((/**@type{import('../types.js').error}*/error)=>{
                    reject (error);
                });
            else{
                DefaultConfig().then(() => {
                    file_set_cache_all().then(() => {
                        resolve(null);
                    })
                    .catch((/**@type{import('../types.js').error}*/error)=>{
                        reject (error);
                    });
                });
            }
        });
    });
};
/**
 * Config get saved
 * @param {import('../types.js').db_file_db_name} file
 * @param {boolean} saved
 * @param {import('../types.js').config_group|null} config_group
 * @param {string|null} parameter
 * @returns {Promise.<object>}
 */
const ConfigFileGet = async (file, saved=false, config_group=null, parameter=null) => {
    const config = saved?await file_get(file).then((/**@type{*}*/config)=>config.file_content):file_get_cached(file);
    return await new Promise((resolve) => {
        if (config_group)
            if (config_group =='METADATA')
                resolve(parameter?config[config_group][parameter]:config[config_group]);
            else
                resolve(parameter?config[config_group].filter((/**@type{*}*/row)=>row[parameter])[0][parameter]:config[config_group]);
        else{
            //no filters, return whole config
            resolve(config);
        }
    });
}
/**
 * Config save
 * @param {import('../types.js').db_file_db_name} resource_id
 * @param { import('../types.js').config_server|
 *          import('../types.js').config_apps|
 *          import('../types.js').config_iam_blockip|
 *          import('../types.js').config_iam_policy|
 *          import('../types.js').config_iam_useragent|
 *          import('../types.js').microservice_config|
 *          import('../types.js').microservice_config_service|null} config
 * @param {number|null} maintenance
 * @param {string|null} configuration
 * @param {string|null} comment
 */
const ConfigFileSave = async (resource_id, config, maintenance, configuration, comment) => {

    const file_config = await file_get(resource_id, true);
    if (config){
        //file updated
        if (resource_id=='SERVER'){
            const metadata = file_config.file_content.METADATA;
            file_config.file_content = config;
            file_config.file_content.METADATA = metadata;
        }
        else
            file_config.file_content = config;
    }
    if (resource_id=='SERVER'){
        file_config.file_content.METADATA.MAINTENANCE = maintenance ?? file_config.file_content.METADATA.MAINTENANCE;
        file_config.file_content.METADATA.CONFIGURATION = configuration ?? file_config.file_content.METADATA.CONFIGURATION;
        file_config.file_content.METADATA.COMMENT = comment ?? file_config.file_content.METADATA.COMMENT;
        file_config.file_content.METADATA.CREATED = file_config.file_content.METADATA.CREATED;
        file_config.file_content.METADATA.MODIFIED = new Date().toISOString();
    }
    await file_update(resource_id, file_config.transaction_id, file_config.file_content);
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
 * @returns {Promise.<void>}
 */
const CreateSystemAdmin = async (admin_name, admin_password) => {
    const { default: {genSalt, hash} } = await import('bcrypt');
    const file = await file_get('IAM_USER', true);
    file.file_content.username = admin_name;
    file.file_content.password = await hash(admin_password, await genSalt(10));
    file.file_content.modified = new Date().toISOString();
    await file_update('IAM_USER', file.transaction_id, file.file_content)
    .catch((/**@type{import('../types.js').error}*/error)=>{throw error;});
};

export{ CreateRandomString,
        ConfigFileGet, ConfigFileSave, CheckFirstTime,
        CreateSystemAdmin, 
        ConfigGet, ConfigGetUser, ConfigGetApps, ConfigGetAppHost, ConfigGetApp, ConfigAppSecretDBReset, ConfigAppSecretUpdate, ConfigAppParameterUpdate, InitConfig};