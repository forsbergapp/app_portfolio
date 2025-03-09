/** @module server/config */

/**
 * @import {server_server_response,server_db_common_result_update,
 *          server_DbObject, server_db_db_name_config, server_server_error, 
 *          server_db_document_ConfigServer,server_db_document_ConfigRestApi, server_db_document_ConfigIamPolicy,
 *          server_db_config_server_service_iam,
 *          server_db_table_IamUser, server_db_table_App, server_db_table_AppModule, server_db_table_AppParameter, server_db_table_AppSecret,server_db_table_AppData,
 *          server_db_table_AppDataEntityResource, server_db_table_AppDataEntity,server_db_table_AppDataResourceDetailData,
 *          server_db_table_AppDataResourceDetail,server_db_table_AppDataResourceMaster,
 *          server_db_table_AppTranslation} from '../types.js'
 * @import {server_db_document_config_microservice_services} from '../../microservice/types.js'
 */

/**@type{import('./ORM.js')} */
const ORM = await import(`file://${process.cwd()}/server/db/ORM.js`);

const APP_PORTFOLIO_TITLE = 'App Portfolio';

/**
 * @name get
 * @description Config get
 * @function
 * @param {{app_id:number,
 *          resource_id?:number|null,
 *          data:{  object:server_db_db_name_config,
 *                  config_group?:string|null,
 *                  parameter?:string|null}}} parameters
 * @returns {*}
 */
const get = parameters => {
    try {
        if (parameters.data.config_group && parameters.data.parameter){
            if (ORM.getObject(parameters.app_id,'ConfigServer')[parameters.data.config_group].length>0){
                //return parameter in array
                return ORM.getObject(parameters.app_id,parameters.data.object)[parameters.data.config_group]
                        .filter((/**@type{*}*/row)=>parameters.data.parameter && parameters.data.parameter in row)[0][parameters.data.parameter];
            }
            else{
                //return key
                return ORM.getObject(parameters.app_id,parameters.data.object)[parameters.data.config_group][parameters.data.parameter];
            }
        }
        else
            if (parameters.data.config_group)
                return ORM.getObject(parameters.app_id,parameters.data.object)[parameters.data.config_group];
            else
                return ORM.getObject(parameters.app_id,parameters.data.object);    
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
     * @type{[  [server_DbObject, server_db_document_ConfigServer],
     *           [server_DbObject, server_db_document_ConfigRestApi],
     *           [server_DbObject, server_db_document_ConfigIamPolicy],
     *           [server_DbObject, server_db_document_config_microservice_services],
     *           [server_DbObject, server_db_table_IamUser[]],
     *           [server_DbObject, server_db_table_App[]],
     *           [server_DbObject, server_db_table_AppDataEntityResource[]],
     *           [server_DbObject, server_db_table_AppDataEntity[]],
     *           [server_DbObject, server_db_table_AppDataResourceDetailData[]],
     *           [server_DbObject, server_db_table_AppDataResourceDetail[]],
     *           [server_DbObject, server_db_table_AppDataResourceMaster[]],
     *           [server_DbObject, server_db_table_AppModule[]],
     *           [server_DbObject, server_db_table_AppParameter[]],
     *           [server_DbObject, server_db_table_AppSecret[]],
     *           [server_DbObject, server_db_table_AppData[]],
     *           [server_DbObject, server_db_table_AppTranslation[]],
     *           [server_DbObject, server_DbObject[]]
     *       ]}
     */
    const config_obj = [
                            ['ConfigServer',                    await fs.promises.readFile(process.cwd() + '/server/install/default/ConfigServer.json')
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
                            ['ConfigRestApi',                   await fs.promises.readFile(process.cwd() + '/server/install/default/ConfigRestApi.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['ConfigIamPolicy',                 await fs.promises.readFile(process.cwd() + '/server/install/default/ConfigIamPolicy.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['ConfigMicroserviceServices',      await fs.promises.readFile(process.cwd() + '/server/install/default/ConfigMicroserviceServices.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['IamUser',                         await fs.promises.readFile(process.cwd() + '/server/install/default/IamUser.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['App',                             await fs.promises.readFile(process.cwd() + '/server/install/default/App.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['AppDataEntityResource',           await fs.promises.readFile(process.cwd() + '/server/install/default/AppDataEntityResource.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['AppDataEntity',                   await fs.promises.readFile(process.cwd() + '/server/install/default/AppDataEntity.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['AppDataResourceDetailData',       await fs.promises.readFile(process.cwd() + '/server/install/default/AppDataResourceDetailData.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['AppDataResourceMaster',           await fs.promises.readFile(process.cwd() + '/server/install/default/AppDataResourceDetail.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['AppDataResourceMaster',           await fs.promises.readFile(process.cwd() + '/server/install/default/AppDataResourceMaster.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['AppModule',                       await fs.promises.readFile(process.cwd() + '/server/install/default/AppModule.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['AppParameter',                    await fs.promises.readFile(process.cwd() + '/server/install/default/AppParameter.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['AppSecret',                       await fs.promises.readFile(process.cwd() + '/server/install/default/AppSecret.json')
                                                                        .then(filebuffer=>
                                                                        //generate secrets
                                                                        JSON.parse(filebuffer.toString()).map((/**@type{server_db_table_AppSecret}*/row)=>{
                                                                            row.common_client_id = securitySecretCreate();
                                                                            row.common_client_secret = securitySecretCreate();
                                                                            row.common_app_id_secret = securitySecretCreate();
                                                                            row.common_app_access_secret = securitySecretCreate();
                                                                            row.common_app_access_verification_secret = securitySecretCreate();
                                                                            return row;
                                                                        }))],
                            ['AppData',                         await fs.promises.readFile(process.cwd() + '/server/install/default/AppData.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['AppTranslation',                  await fs.promises.readFile(process.cwd() + '/server/install/default/AppTranslation.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['DbObjects',                       await fs.promises.readFile(process.cwd() + '/server/install/default/DbObjects.json')
                                                                        .then(filebuffer=>
                                                                            JSON.parse(filebuffer.toString())
                                                                        )]
                        ]; 
    //create directories
    await ORM.postFsDir(['/data',
                            '/data' + config_obj[0][1].SERVER.filter(key=>'PATH_JOBS' in key)[0].PATH_JOBS,
                            '/data' + config_obj[0][1].SERVER.filter(key=>'PATH_SSL' in key)[0].PATH_SSL,
                            '/data' + config_obj[0][1].SERVICE_MICROSERVICE.filter(key=>'PATH' in key)[0].PATH,
                            '/data' + config_obj[0][1].SERVICE_MICROSERVICE.filter(key=>'PATH_DATA' in key)[0].PATH_DATA,
                            '/data' + config_obj[0][1].SERVICE_MICROSERVICE.filter(key=>'PATH_SSL' in key)[0].PATH_SSL,
                            '/data/db',
                            '/data/db/backup'
                            ])
    .catch((/**@type{server_server_error}*/err) => {
        throw err;
    }); 
    //load default db
    await ORM.Init(config_obj[16][1]);
    for (const config_row of config_obj){
        await ORM.postFsAdmin(config_row[0], config_row[1]);
    }
};
/**
 * @name getFile
 * @description Config get saved
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:server_db_db_name_config,
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
    const config = serverUtilNumberValue(parameters.data?.saved)?await ORM.getFsFile(parameters.resource_id).then((/**@type{*}*/config)=>config.file_content):ORM.getObject(parameters.app_id, parameters.resource_id);
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
 *          data:{  config: server_db_document_ConfigServer|
 *                          server_db_table_App[]|
 *                          server_db_document_ConfigIamPolicy|
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

    const file_config = await ORM.getFsFile(parameters.resource_id, true);
    if (parameters.data.config){
        //file updated
        if (parameters.resource_id=='ConfigServer'){
            const metadata = file_config.file_content.METADATA;
            file_config.file_content = parameters.data.config;
            file_config.file_content.METADATA = metadata;
        }
        else
            file_config.file_content = parameters.data.config;
    }
    if (parameters.resource_id=='ConfigServer'){
        file_config.file_content.METADATA.MAINTENANCE = maintenance ?? file_config.file_content.METADATA.MAINTENANCE;
        file_config.file_content.METADATA.CONFIGURATION = configuration ?? file_config.file_content.METADATA.CONFIGURATION;
        file_config.file_content.METADATA.COMMENT = comment ?? file_config.file_content.METADATA.COMMENT;
        file_config.file_content.METADATA.MODIFIED = new Date().toISOString();
    }
    await ORM.updateFsFile(parameters.resource_id, file_config.transaction_id, file_config.file_content);
    return {result:{affectedRows:1}, type:'JSON'};
};
export{ getFile, update, get, configDefault};