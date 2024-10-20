/** @module server/config */

/**@type{import('./db/file.js')} */
const {SLASH, fileFsRead, fileFsWrite, fileCache, fileFsCacheSet, fileFsWriteAdmin, fileFsAccessMkdir} = await import(`file://${process.cwd()}/server/db/file.js`);
/**@type{import('./server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

const APP_PORTFOLIO_TITLE = 'App Portfolio';


/**
 * Config get
 * @param {import('./types.js').server_config_server_group} config_group
 * @param {string} parameter
 * @returns {string|null}
 */
const configGet = (config_group, parameter) => {
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
const configExists = async () => {
    try {
        await fileFsRead('APP');
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
const configDefault = async () => {
    const fs = await import('node:fs');
    /**@type{import('./security.js')} */
    const {securitySecretCreate}= await import(`file://${process.cwd()}/server/security.js`);
    await fileFsAccessMkdir()
    .catch((/**@type{import('./types.js').server_server_error}*/err) => {
        throw err;
    }); 
    const i = 0;
    //read all default files

    /**@type{[  [import('./types.js').server_db_file_db_name, import('./types.js').server_config_server],
                [import('./types.js').server_db_file_db_name, import('./types.js').server_config_iam_blockip],
                [import('./types.js').server_db_file_db_name, import('./types.js').server_config_iam_policy],
                [import('./types.js').server_db_file_db_name, import('./types.js').server_config_iam_useragent],
                [import('./types.js').server_db_file_db_name, import('../microservice/types.js').microservice_config],
                [import('./types.js').server_db_file_db_name, import('../microservice/types.js').microservice_config_service],
                [import('./types.js').server_db_file_db_name, import('./types.js').server_db_file_iam_user[]],
                [import('./types.js').server_db_file_db_name, import('./types.js').server_db_file_app[]],
                [import('./types.js').server_db_file_db_name, import('./types.js').server_db_file_app_module[]],
                [import('./types.js').server_db_file_db_name, import('./types.js').server_db_file_app_parameter[]],
                [import('./types.js').server_db_file_db_name, import('./types.js').server_db_file_app_secret[]]
            ]} 
    */
    const config_obj = [
                            ['CONFIG_SERVER',                   await fs.promises.readFile(process.cwd() + `${SLASH}server${SLASH}install${SLASH}default${SLASH}config_server.json`).then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['CONFIG_IAM_BLOCKIP',              await fs.promises.readFile(process.cwd() + `${SLASH}server${SLASH}install${SLASH}default${SLASH}config_iam_blockip.json`).then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['CONFIG_IAM_POLICY',               await fs.promises.readFile(process.cwd() + `${SLASH}server${SLASH}install${SLASH}default${SLASH}config_iam_policy.json`).then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['CONFIG_IAM_USERAGENT',            await fs.promises.readFile(process.cwd() + `${SLASH}server${SLASH}install${SLASH}default${SLASH}config_iam_useragent.json`).then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['CONFIG_MICROSERVICE',             await fs.promises.readFile(process.cwd() + `${SLASH}server${SLASH}install${SLASH}default${SLASH}config_microservice.json`).then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['CONFIG_MICROSERVICE_SERVICES',    await fs.promises.readFile(process.cwd() + `${SLASH}server${SLASH}install${SLASH}default${SLASH}config_microservice_services.json`).then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['IAM_USER',                        await fs.promises.readFile(process.cwd() + `${SLASH}server${SLASH}install${SLASH}default${SLASH}iam_user.json`).then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['APP',                             await fs.promises.readFile(process.cwd() + `${SLASH}server${SLASH}install${SLASH}default${SLASH}app.json`).then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['APP_MODULE',                      await fs.promises.readFile(process.cwd() + `${SLASH}server${SLASH}install${SLASH}default${SLASH}app_module.json`).then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['APP_PARAMETER',                   await fs.promises.readFile(process.cwd() + `${SLASH}server${SLASH}install${SLASH}default${SLASH}app_parameter.json`).then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['APP_SECRET',                      await fs.promises.readFile(process.cwd() + `${SLASH}server${SLASH}install${SLASH}default${SLASH}app_secret.json`).then(filebuffer=>JSON.parse(filebuffer.toString()))]
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
                row.ADMIN_TOKEN_SECRET = securitySecretCreate();
            }
            if (key== 'ADMIN_PASSWORD_ENCRYPTION_KEY'){
                row.ADMIN_PASSWORD_ENCRYPTION_KEY = securitySecretCreate(false, 32);
            }
            if (key== 'ADMIN_PASSWORD_INIT_VECTOR'){
                row.ADMIN_PASSWORD_INIT_VECTOR = securitySecretCreate(false, 16);
            }
        }
    });
    //set server metadata
    config_obj[0][1].METADATA.CONFIGURATION = APP_PORTFOLIO_TITLE;
    config_obj[0][1].METADATA.CREATED       = `${new Date().toISOString()}`;
    config_obj[0][1].METADATA.MODIFIED      = '';

    //generate hash for app secrets
    config_obj[10][1].map((/**@type{import('./types.js').server_db_file_app_secret}*/row)=>{
        row.COMMON_CLIENT_ID = securitySecretCreate();
        row.COMMON_CLIENT_SECRET = securitySecretCreate();
        row.COMMON_APP_ID_SECRET = securitySecretCreate();
        row.COMMON_APP_ACCESS_SECRET = securitySecretCreate();
    });        
    //set paths in microservice config
    /**@type{import('../microservice/types.js').microservice_config} */
    const microservice_config = config_obj[4][1];
    microservice_config?microservice_config.PATH_DATA             = `${SLASH}data${SLASH}microservice${SLASH}data${SLASH}`:'';
    //set paths in microservice services
    config_obj[5][1].SERVICES.map((/**@type{import('../microservice/types.js').microservice_config_service_record}*/row)=>{
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
const configInit = async () => {
    return await new Promise((resolve, reject) => {
        configExists().then((result) => {
            if (result==true)
                fileFsCacheSet().then(() => {
                    resolve(null);
                })
                .catch((/**@type{import('./types.js').server_server_error}*/error)=>{
                    reject (error);
                });
            else{
                configDefault().then(() => {
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
const configFileGet = async (file, query=null) => {
    const saved = query?serverUtilNumberValue(query.get('saved'))==1:false;
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
const configFileSave = async (resource_id, data) => {
    /**@type{import('./types.js').server_config_server|
             import('./types.js').server_db_file_app[]|
             import('./types.js').server_config_iam_blockip|
             import('./types.js').server_config_iam_policy|
             import('./types.js').server_config_iam_useragent|
             import('../microservice/types.js').microservice_config|
             import('../microservice/types.js').microservice_config_service|null} */
    const config = data.config;
    const maintenance = serverUtilNumberValue(data.maintenance);
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
export{ configFileGet, configFileSave, configGet, configInit};