/** @module server/config */

/**
 * @import {server_server_response,server_db_common_result_update,
 *          server_db_object, server_db_db_name_config, server_server_error, 
 *          server_db_document_config_server,server_db_document_config_rest_api, server_db_document_config_iam_policy,
 *          server_db_config_server_service_iam,
 *          server_db_table_iam_user, server_db_table_app, server_db_table_app_module, server_db_table_app_parameter, server_db_table_app_secret,server_db_table_app_setting,
 *          server_db_table_app_data_entity_resource, server_db_table_app_data_entity,server_db_table_app_data_resource_detail_data,
 *          server_db_table_app_data_resource_detail,server_db_table_app_data_resource_master,
 *          server_db_table_app_translation} from '../types.js'
 * @import {server_db_document_config_microservice_services} from '../../microservice/types.js'
 */

/**@type{import('./file.js')} */
const {fileFsRead, fileFsWrite, fileCache, fileDbInit, fileFsWriteAdmin, fileFSDirDataExists, fileFsAccessMkdir} = await import(`file://${process.cwd()}/server/db/file.js`);

const APP_PORTFOLIO_TITLE = 'App Portfolio';

/**
 * @name get
 * @description Config get
 * @function
 * @param {server_db_db_name_config} file
 * @param {string|null} [config_group]
 * @param {string|null} [parameter]
 * @returns {*}
 */
const get = (file, config_group, parameter) => {
    try {
        if (config_group && parameter){
            if (fileCache('CONFIG_SERVER')[config_group].length>0){
                //return parameter in array
                return fileCache(file)[config_group].filter((/**@type{*}*/row)=>parameter in row)[0][parameter];
            }
            else{
                //return key
                return fileCache(file)[config_group][parameter];
            }
        }
        else
            if (config_group)
                return fileCache(file)[config_group];
            else
                return fileCache(file);    
    } catch (error) {
        return null;
    }
    
};
/**
 * @name configDefault
 * @description Default config
 * @function
 * @returns {Promise<void>}
 */
const configDefault = async () => {
    const fs = await import('node:fs');
    /**@type{import('../security.js')} */
    const {securitySecretCreate}= await import(`file://${process.cwd()}/server/security.js`);
    
    //read all default files
    /**
     * @type{[  [server_db_object, server_db_document_config_server],
     *           [server_db_object, server_db_document_config_rest_api],
     *           [server_db_object, server_db_document_config_iam_policy],
     *           [server_db_object, server_db_document_config_microservice_services],
     *           [server_db_object, server_db_table_iam_user[]],
     *           [server_db_object, server_db_table_app[]],
     *           [server_db_object, server_db_table_app_data_entity_resource[]],
     *           [server_db_object, server_db_table_app_data_entity[]],
     *           [server_db_object, server_db_table_app_data_resource_detail_data[]],
     *           [server_db_object, server_db_table_app_data_resource_detail[]],
     *           [server_db_object, server_db_table_app_data_resource_master[]],
     *           [server_db_object, server_db_table_app_module[]],
     *           [server_db_object, server_db_table_app_parameter[]],
     *           [server_db_object, server_db_table_app_secret[]],
     *           [server_db_object, server_db_table_app_setting[]],
     *           [server_db_object, server_db_table_app_translation[]],
     *           [server_db_object, server_db_object[]]
     *       ]}
     */
    const config_obj = [
                            ['CONFIG_SERVER',                   await fs.promises.readFile(process.cwd() + '/server/install/default/config_server.json')
                                                                        .then(filebuffer=>{
                                                                            const config_server = JSON.parse(filebuffer.toString());
                                                                            //generate secrets
                                                                            config_server.SERVICE_IAM.map((/**@type{server_db_config_server_service_iam}*/row)=>{
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
                                                                            config_server.METADATA.CONFIGURATION = APP_PORTFOLIO_TITLE;
                                                                            config_server.METADATA.CREATED       = `${new Date().toISOString()}`;
                                                                            config_server.METADATA.MODIFIED      = '';
                                                                            return config_server;
                                                                        })],
                            ['CONFIG_REST_API',                 await fs.promises.readFile(process.cwd() + '/server/install/default/config_rest_api.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['CONFIG_IAM_POLICY',               await fs.promises.readFile(process.cwd() + '/server/install/default/config_iam_policy.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['CONFIG_MICROSERVICE_SERVICES',    await fs.promises.readFile(process.cwd() + '/server/install/default/config_microservice_services.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['IAM_USER',                        await fs.promises.readFile(process.cwd() + '/server/install/default/iam_user.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['APP',                             await fs.promises.readFile(process.cwd() + '/server/install/default/app.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['APP_DATA_ENTITY_RESOURCE',        await fs.promises.readFile(process.cwd() + '/server/install/default/app_data_entity_resource.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['APP_DATA_ENTITY',                 await fs.promises.readFile(process.cwd() + '/server/install/default/app_data_entity.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['APP_DATA_RESOURCE_DETAIL_DATA',   await fs.promises.readFile(process.cwd() + '/server/install/default/app_data_resource_detail_data.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['APP_DATA_RESOURCE_DETAIL',        await fs.promises.readFile(process.cwd() + '/server/install/default/app_data_resource_detail.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['APP_DATA_RESOURCE_MASTER',        await fs.promises.readFile(process.cwd() + '/server/install/default/app_data_resource_master.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['APP_MODULE',                      await fs.promises.readFile(process.cwd() + '/server/install/default/app_module.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['APP_PARAMETER',                   await fs.promises.readFile(process.cwd() + '/server/install/default/app_parameter.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['APP_SECRET',                      await fs.promises.readFile(process.cwd() + '/server/install/default/app_secret.json')
                                                                        .then(filebuffer=>
                                                                        //generate secrets
                                                                        JSON.parse(filebuffer.toString()).map((/**@type{server_db_table_app_secret}*/row)=>{
                                                                            row.common_client_id = securitySecretCreate();
                                                                            row.common_client_secret = securitySecretCreate();
                                                                            row.common_app_id_secret = securitySecretCreate();
                                                                            row.common_app_access_secret = securitySecretCreate();
                                                                            row.common_app_access_verification_secret = securitySecretCreate();
                                                                        }))],
                            ['APP_SETTING',                     await fs.promises.readFile(process.cwd() + '/server/install/default/app_setting.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['APP_TRANSLATION',                 await fs.promises.readFile(process.cwd() + '/server/install/default/app_translation.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['DB_OBJECTS',                      await fs.promises.readFile(process.cwd() + '/server/install/default/db_objects.json')
                                                                        .then(filebuffer=>
                                                                            JSON.parse(filebuffer.toString())
                                                                        )]
                        ]; 
    //create directories
    await fileFsAccessMkdir(['/data',
                             '/data' + config_obj[0][1].SERVER.filter(key=>'PATH_DATA_JOBS' in key)[0].PATH_DATA_JOBS,
                             '/data' + config_obj[0][1].SERVICE_MICROSERVICE.filter(key=>'PATH' in key)[0].PATH,
                             '/data' + config_obj[0][1].SERVICE_MICROSERVICE.filter(key=>'PATH_DATA' in key)[0].PATH_DATA,
                             '/data' + config_obj[0][1].SERVICE_MICROSERVICE.filter(key=>'PATH_SSL' in key)[0].PATH_SSL,
                             '/data/db',
                             '/data/db/backup',
                             '/data/ssl'])
    .catch((/**@type{server_server_error}*/err) => {
        throw err;
    }); 
    //load default db
    await fileDbInit(config_obj[16][1]);
    for (const config_row of config_obj){
        await fileFsWriteAdmin(config_row[0], config_row[1]);
    }
};
/**
 * @name configInit
 * @description Init config
 * @function
 * @returns {Promise<null>}
 */
const configInit = async () => {
    return await new Promise((resolve, reject) => {
        fileFSDirDataExists().then((result) => {
            if (result==true)
                fileDbInit().then(() => {
                    resolve(null);
                })
                .catch((/**@type{server_server_error}*/error)=>{
                    reject (error);
                });
            else{
                configDefault().then(() => {
                    fileDbInit().then(() => {
                        resolve(null);
                    })
                    .catch((/**@type{server_server_error}*/error)=>{
                        reject (error);
                    });
                });
            }
        });
    });
};
/**
 * @name getFile
 * @description Config get saved
 * @function
 * @memberof ROUTE_REST_API
 * @param {{resource_id:server_db_db_name_config,
 *          data:{  config_group?:string|null,
 *                  parameter?:string|null,
 *                  saved?:string|null}|null}} parameters
 * @returns {Promise.<server_server_response & {result?:* }>}
 */
const getFile = async parameters => {
    const config_group = parameters.data?.config_group?parameters.data.config_group:null;
    const parameter = parameters.data?.parameter?parameters.data.parameter:null;
    /**@type{import('../server.js')} */
    const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
    const config = serverUtilNumberValue(parameters.data?.saved)?await fileFsRead(parameters.resource_id).then((/**@type{*}*/config)=>config.file_content):fileCache(parameters.resource_id);
    if (config_group)
        if (config_group =='METADATA')
            return {result:parameter?config[config_group][parameter]:config[config_group], type:'JSON'};
        else
            return {result:parameter?config[config_group].filter((/**@type{*}*/row)=>row[parameter])[0][parameter]:config[config_group], type:'JSON'};
    else{
        //no filters, return whole config
        return {result:config, type:'JSON'};
    }
};
/**
 * @name update
 * @description Config save
 * @function
 * @memberof ROUTE_REST_API
 * @param {{resource_id:server_db_db_name_config,
 *          data:{  config: server_db_document_config_server|
 *                          server_db_table_app[]|
 *                          server_db_document_config_iam_policy|
 *                          server_db_document_config_microservice_services|null,
 *                  maintenance:string,
 *                  comment:string,
 *                  configuration:string}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
 */
const update = async parameters => {
    /**@type{import('../server.js')} */
    const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
    const maintenance = serverUtilNumberValue(parameters.data.maintenance);
    const comment = parameters.data.comment;
    const configuration = parameters.data.configuration;

    const file_config = await fileFsRead(parameters.resource_id, true);
    if (parameters.data.config){
        //file updated
        if (parameters.resource_id=='CONFIG_SERVER'){
            const metadata = file_config.file_content.METADATA;
            file_config.file_content = parameters.data.config;
            file_config.file_content.METADATA = metadata;
        }
        else
            file_config.file_content = parameters.data.config;
    }
    if (parameters.resource_id=='CONFIG_SERVER'){
        file_config.file_content.METADATA.MAINTENANCE = maintenance ?? file_config.file_content.METADATA.MAINTENANCE;
        file_config.file_content.METADATA.CONFIGURATION = configuration ?? file_config.file_content.METADATA.CONFIGURATION;
        file_config.file_content.METADATA.COMMENT = comment ?? file_config.file_content.METADATA.COMMENT;
        file_config.file_content.METADATA.MODIFIED = new Date().toISOString();
    }
    await fileFsWrite(parameters.resource_id, file_config.transaction_id, file_config.file_content);
    return {result:{affectedRows:1}, type:'JSON'};
};
export{ getFile, update, get, configInit};