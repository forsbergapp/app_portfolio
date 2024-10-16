/** @module server/config */

/**@type{import('./db/file.service.js')} */
const {SLASH, fileFsRead, fileFsWrite, fileCache, fileFsCacheSet, fileFsWriteAdmin, fileFsAccessMkdir} = await import(`file://${process.cwd()}/server/db/file.service.js`);
/**@type{import('./server.service.js')} */
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

const app_portfolio_title = 'App Portfolio';


/**
 * Config get apps
 * @param {number|null} app_id
 * @param {*} query
 * @returns {import('./types.js').server_config_apps_record[]|*}
 */
 const ConfigGetApps = (app_id, query) => {
    const key = query.get('key');
    const result = fileCache('CONFIG_APPS').APPS.filter((/**@type{*}*/app)=>app.APP_ID == (app_id ?? app.APP_ID))
                        .reduce((   /**@type{import('./types.js').server_config_apps_record} */app, 
                                    /**@type {*}*/current)=> 
                                    key?app.concat({APP_ID:current.APP_ID, [key]:current[key]}):app.concat(current), []);
    return result;
 };
 
/**
 * Config get app
 * @param {number|null} app_id
 * @param {number|null} data_app_id
 * @param {import('./types.js').server_config_apps_keys} parameter
 * @returns {*|null}
 */
 const ConfigGetApp = (app_id, data_app_id, parameter) => {
    if (parameter == 'PARAMETERS')
        return Object.entries(fileCache('CONFIG_APPS'))[0][1].filter(
                (/**@type{import('./types.js').server_config_apps_record}*/app)=>{return app.APP_ID == data_app_id;})[0][parameter]
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
        return Object.entries(fileCache('CONFIG_APPS'))[0][1].filter(
                (/**@type{import('./types.js').server_config_apps_record}*/app)=>{return app.APP_ID == data_app_id;})[0][parameter];
 };
/**
 * Config app secret reset db username and passwords for database in use
 * @returns {Promise.<void>}
 */
  const ConfigAppSecretDBReset = async () => {
    /**@type{import('./server.service.js')} */
    const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);
    const file = await fileFsRead('CONFIG_APPS', true);
    /**@type{import('./types.js').server_config_apps_record[]}*/
    const APPS = file.file_content.APPS;
    const db_use = getNumberValue(ConfigGet('SERVICE_DB', 'USE'));
    for (const app of APPS){
        /**@ts-ignore */
        if (app.SECRETS[`SERVICE_DB_DB${db_use}_APP_USER`]){
            /**@ts-ignore */
            app.SECRETS[`SERVICE_DB_DB${db_use}_APP_USER`] = '';
        }
        /**@ts-ignore */
        if (app.SECRETS[`SERVICE_DB_DB${db_use}_APP_PASSWORD`]){
            /**@ts-ignore */
            app.SECRETS[`SERVICE_DB_DB${db_use}_APP_PASSWORD`] = '';
        }   
    }
    await fileFsWrite('CONFIG_APPS', file.transaction_id, file.file_content);
    await fileFsCacheSet();
 };

 /**
 * Config app secret update
 * @param {number|null} app_id
 * @param {{app_id:             number|null,
 *          parameter_name:     string,
 *          parameter_value:    string}} data
 * @returns {Promise.<void>}
 */
const ConfigAppSecretUpdate = async (app_id, data) => {
    const file = await fileFsRead('CONFIG_APPS', true);
    file.file_content.APPS.filter((/**@type{*}*/row)=> row.APP_ID==data.app_id)[0].SECRETS[data.parameter_name] = data.parameter_value;
    await fileFsWrite('CONFIG_APPS', file.transaction_id, file.file_content);
    await fileFsCacheSet();
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
    const file = await fileFsRead('CONFIG_APPS', true);
    
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
    await fileFsWrite('CONFIG_APPS', file.transaction_id, file.file_content);
    await fileFsCacheSet();
 };
/**
 * Config get
 * @param {import('./types.js').server_config_server_group} config_group
 * @param {string} parameter
 * @returns {string|null}
 */
const ConfigGet = (config_group, parameter) => {
    if (config_group=='METADATA')
        return parameter?fileCache('CONFIG_SERVER')[config_group][parameter]:fileCache('CONFIG_SERVER')[config_group];
    else{
        for (const config_parameter_row of fileCache('CONFIG_SERVER')[config_group]){
            for (const key of Object.keys(config_parameter_row)){
                if (key==parameter){
                    return config_parameter_row[key];
                }
            }
        }                
        return null;
    }
};
/**
 * Config exists
 * Checks if all config files exist
 * @returns {Promise<boolean>}
 */
const ConfigExists = async () => {
    try {
        await fileFsRead('CONFIG_APPS');
        await fileFsRead('CONFIG_SERVER');
        await fileFsRead('CONFIG_IAM_BLOCKIP');
        await fileFsRead('CONFIG_IAM_POLICY');
        await fileFsRead('CONFIG_IAM_USERAGENT');
        await fileFsRead('CONFIG_MICROSERVICE');
        await fileFsRead('CONFIG_MICROSERVICE_SERVICES');
        await fileFsRead('IAM_USER');
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
    /**@type{import('./security.service.js')} */
    const {createSecret}= await import(`file://${process.cwd()}/server/security.service.js`);
    await fileFsAccessMkdir()
    .catch((/**@type{import('./types.js').server_server_error}*/err) => {
        throw err;
    }); 
    const i = 0;
    //read all default files

    /**@type{[  [import('./types.js').server_db_file_db_name, import('./types.js').server_config_server],
                [import('./types.js').server_db_file_db_name, import('./types.js').server_config_apps],
                [import('./types.js').server_db_file_db_name, import('./types.js').server_config_iam_blockip],
                [import('./types.js').server_db_file_db_name, import('./types.js').server_config_iam_policy],
                [import('./types.js').server_db_file_db_name, import('./types.js').server_config_iam_useragent],
                [import('./types.js').server_db_file_db_name, import('../microservice/types.js').microservice_config],
                [import('./types.js').server_db_file_db_name, import('../microservice/types.js').microservice_config_service],
                [import('./types.js').server_db_file_db_name, import('./types.js').server_iam_user]
            ]} 
    */
    const config_obj = [
                            ['CONFIG_SERVER',                   await fs.promises.readFile(process.cwd() + `${SLASH}server${SLASH}install${SLASH}default${SLASH}config_server.json`).then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['CONFIG_APPS',                     await fs.promises.readFile(process.cwd() + `${SLASH}server${SLASH}install${SLASH}default${SLASH}config_apps.json`).then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['CONFIG_IAM_BLOCKIP',              await fs.promises.readFile(process.cwd() + `${SLASH}server${SLASH}install${SLASH}default${SLASH}config_iam_blockip.json`).then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['CONFIG_IAM_POLICY',               await fs.promises.readFile(process.cwd() + `${SLASH}server${SLASH}install${SLASH}default${SLASH}config_iam_policy.json`).then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['CONFIG_IAM_USERAGENT',            await fs.promises.readFile(process.cwd() + `${SLASH}server${SLASH}install${SLASH}default${SLASH}config_iam_useragent.json`).then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['CONFIG_MICROSERVICE',             await fs.promises.readFile(process.cwd() + `${SLASH}server${SLASH}install${SLASH}default${SLASH}config_microservice.json`).then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['CONFIG_MICROSERVICE_SERVICES',    await fs.promises.readFile(process.cwd() + `${SLASH}server${SLASH}install${SLASH}default${SLASH}config_microservice_services.json`).then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['IAM_USER',                        await fs.promises.readFile(process.cwd() + `${SLASH}server${SLASH}install${SLASH}default${SLASH}iam_user.json`).then(filebuffer=>JSON.parse(filebuffer.toString()))]
                        ]; 
    //set server parameters
    config_obj[0][1].SERVER.map((/**@type{import('./types.js').server_config_server_server}*/row)=>{
        for (const key of Object.keys(row)){
            if (key=='HTTPS_KEY')
                row.HTTPS_KEY = `${SLASH}data${SLASH}ssl${SLASH}${Object.values(row)[i]}`;
            if (key=='HTTPS_CERT')
                row.HTTPS_CERT = `${SLASH}data${SLASH}ssl${SLASH}${Object.values(row)[i]}`;
        } 
    });
    //generate hash
    config_obj[0][1].SERVICE_IAM.map((/**@type{import('./types.js').server_config_server_service_iam}*/row)=>{
        for (const key of Object.keys(row)){
            if (key== 'ADMIN_TOKEN_SECRET'){
                row.ADMIN_TOKEN_SECRET = createSecret();
            }
            if (key== 'ADMIN_PASSWORD_ENCRYPTION_KEY'){
                row.ADMIN_PASSWORD_ENCRYPTION_KEY = createSecret(false, 32);
            }
            if (key== 'ADMIN_PASSWORD_INIT_VECTOR'){
                row.ADMIN_PASSWORD_INIT_VECTOR = createSecret(false, 16);
            }
        }
    });
    //set server metadata
    config_obj[0][1].METADATA.CONFIGURATION = app_portfolio_title;
    config_obj[0][1].METADATA.CREATED       = `${new Date().toISOString()}`;
    config_obj[0][1].METADATA.MODIFIED      = '';

    //generate hash for apps
    config_obj[1][1].APPS.map((/**@type{import('./types.js').server_config_apps_record}*/row)=>{
        row.SECRETS.CLIENT_ID = createSecret();
        row.SECRETS.CLIENT_SECRET = createSecret();
        row.SECRETS.APP_ID_SECRET = createSecret();
        row.SECRETS.APP_ACCESS_SECRET = createSecret();
    });
    //set created for user
    config_obj[7][1].USER[0].created = new Date().toISOString();
    
    //set paths in microservice config
    /**@type{import('../microservice/types.js').microservice_config} */
    const microservice_config = config_obj[5][1];
    microservice_config?microservice_config.PATH_DATA             = `${SLASH}data${SLASH}microservice${SLASH}data${SLASH}`:'';
    //set paths in microservice services
    config_obj[6][1].SERVICES.map((/**@type{import('../microservice/types.js').microservice_config_service_record}*/row)=>{
        row.HTTPS_KEY             = `${SLASH}data${SLASH}microservice${SLASH}ssl${SLASH}${row.HTTPS_KEY}`;
        row.HTTPS_CERT            = `${SLASH}data${SLASH}microservice${SLASH}ssl${SLASH}${row.HTTPS_CERT}`;
        row.PATH                  = `${SLASH}microservice${SLASH}${row.PATH}${SLASH}`;
    });
    for (const config_row of config_obj){
        await fileFsWriteAdmin(config_row[0], config_row[1]);
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
                fileFsCacheSet().then(() => {
                    resolve(null);
                })
                .catch((/**@type{import('./types.js').server_server_error}*/error)=>{
                    reject (error);
                });
            else{
                DefaultConfig().then(() => {
                    fileFsCacheSet().then(() => {
                        resolve(null);
                    })
                    .catch((/**@type{import('./types.js').server_server_error}*/error)=>{
                        reject (error);
                    });
                });
            }
        });
    });
};
/**
 * Config get saved
 * @param {import('./types.js').server_db_file_db_name} file
 * @param {*} query
 * @returns {Promise.<*>}
 */
const ConfigFileGet = async (file, query=null) => {
    const saved = query?getNumberValue(query.get('saved'))==1:false;
    const config_group = query?query.get('config_group'):null;
    const parameter = query?query.get('parameter'):null;
    const config = saved?await fileFsRead(file).then((/**@type{*}*/config)=>config.file_content):fileCache(file);
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
};
/**
 * Config save
 * @param {import('./types.js').server_db_file_db_name} resource_id
 * @param { *} data
 */
const ConfigFileSave = async (resource_id, data) => {
    /**@type{import('./types.js').server_config_server|
             import('./types.js').server_config_apps|
             import('./types.js').server_config_iam_blockip|
             import('./types.js').server_config_iam_policy|
             import('./types.js').server_config_iam_useragent|
             import('../microservice/types.js').microservice_config|
             import('../microservice/types.js').microservice_config_service|null} */
    const config = data.config;
    const maintenance = getNumberValue(data.maintenance);
    const comment = data.comment;
    const configuration = data.configuration;


    const file_config = await fileFsRead(resource_id, true);
    if (config){
        //file updated
        if (resource_id=='CONFIG_SERVER'){
            const metadata = file_config.file_content.METADATA;
            file_config.file_content = config;
            file_config.file_content.METADATA = metadata;
        }
        else
            file_config.file_content = config;
    }
    if (resource_id=='CONFIG_SERVER'){
        file_config.file_content.METADATA.MAINTENANCE = maintenance ?? file_config.file_content.METADATA.MAINTENANCE;
        file_config.file_content.METADATA.CONFIGURATION = configuration ?? file_config.file_content.METADATA.CONFIGURATION;
        file_config.file_content.METADATA.COMMENT = comment ?? file_config.file_content.METADATA.COMMENT;
        file_config.file_content.METADATA.MODIFIED = new Date().toISOString();
    }
    await fileFsWrite(resource_id, file_config.transaction_id, file_config.file_content);
};
/**
 * Check first time
 * @returns {boolean}
 */
const CheckFirstTime = () => {
    if (fileCache('IAM_USER').USER[0].username=='')
        return true;
    else
        return false;
};
/**
 * Create admin
 * @async
 * @param {string} admin_name
 * @param {string} admin_password
 * @returns {Promise.<void>}
 */
const CreateAdmin = async (admin_name, admin_password) => {
    /**@type{import('./security.service.js')} */
    const {PasswordCreate}= await import(`file://${process.cwd()}/server/security.service.js`);
    
    /**@type{import('./types.js').server_db_file_result_fileFsRead} */
    const file = await fileFsRead('IAM_USER', true);
    /**@type{import('./types.js').server_iam_user['USER']} */
    const user = file.file_content.USER;
    user[0].username = admin_name;
    user[0].password = await PasswordCreate(admin_password);
    user[0].modified = new Date().toISOString();
    file.file_content.USER = user;
    await fileFsWrite('IAM_USER', file.transaction_id, file.file_content)
    .catch((/**@type{import('./types.js').server_server_error}*/error)=>{throw error;});
};

export{ ConfigFileGet, ConfigFileSave, CheckFirstTime,
        CreateAdmin, 
        ConfigGet, ConfigGetApps, ConfigGetApp, ConfigAppSecretDBReset, ConfigAppSecretUpdate, ConfigAppParameterUpdate, InitConfig};