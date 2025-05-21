/** @module server/db/ConfigServer */

/**
 * @import {server_server_response,server_db_common_result_update,
 *          server_DbObject, server_DbObject_record, server_server_error, 
 *          server_db_document_ConfigServer,server_db_document_ConfigRestApi,
 *          server_db_config_server_metadata,
 *          server_db_config_server_service_iam,
 *          server_db_table_IamUser, server_db_table_App, server_db_table_AppModule, server_db_table_AppParameter, server_db_table_AppSecret,server_db_table_AppData,
 *          server_db_table_AppDataEntityResource, server_db_table_AppDataEntity,server_db_table_AppDataResourceDetailData,
 *          server_db_table_AppDataResourceDetail,server_db_table_AppDataResourceMaster,
 *          server_db_table_AppTranslation} from '../types.js'
 * @import {server_db_document_config_microservice_services} from '../../serviceregistry/types.js'
 */

const ORM = await import('./ORM.js');

const APP_PORTFOLIO_TITLE = 'App Portfolio';

/**
 * @name get
 * @description Config get
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id?:number|null,
 *          data?:{ config_group?:string|null,
 *                  parameter?:string|null}}} parameters
 * @returns {server_server_response & {result?:* }}
 */
const get = parameters => {
    try {
        const ConfigServer = ORM.getObject(parameters.app_id,'ConfigServer');
        if (parameters.data?.config_group && parameters.data?.parameter){
            if (ConfigServer[parameters.data?.config_group].length>0){
                //return parameter in array
                return {result:ConfigServer[parameters.data?.config_group]
                        .filter((/**@type{*}*/row)=>parameters.data?.parameter && parameters.data?.parameter in row)[0][parameters.data?.parameter],
                        type:'JSON'};
            }
            else{
                //return key
                return {result:ConfigServer[parameters.data?.config_group][parameters.data?.parameter],
                        type:'JSON'};
            }
        }
        else
            if (parameters.data?.config_group){
                if (parameters.data?.config_group =='METADATA')
                    //return object
                    return {result:parameters.data?.parameter?
                        ConfigServer[parameters.data?.config_group][parameters.data?.parameter]:
                        ConfigServer[parameters.data?.config_group], type:'JSON'};
                else
                    //return array
                    return {result:parameters.data?.parameter?
                                    ConfigServer[parameters.data?.config_group]
                                    /**@ts-ignore */
                                    .filter((/**@type{*}*/row)=>row[parameters.data?.parameter])[0][parameters.data?.parameter]:
                                    ConfigServer[parameters.data?.config_group], type:'JSON'};
            }
            else
                return {result:ConfigServer, type:'JSON'};
    } catch (error) {
        return {result:null, type:'JSON'};
    }
};
/**
 * @name configDefault
 * @description Default config
 * @function
 * @returns {Promise<void>}
 */
const configDefault = async () => {
    const {securitySecretCreate}= await import('../security.js');
    const {serverProcess} = await import('../server.js');
    const fs = await import('node:fs');
    //read all default files
    /**
     * @type{[  [server_DbObject, server_db_document_ConfigServer],
     *           [server_DbObject, server_db_document_ConfigRestApi],
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
     *           [server_DbObject, server_DbObject_record[]]
     *       ]}
     */
    const config_obj = [
                            ['ConfigServer',                    await fs.promises.readFile(serverProcess.cwd() + '/server/install/default/ConfigServer.json')
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
                            ['ConfigRestApi',                   await fs.promises.readFile(serverProcess.cwd() + '/server/install/default/ConfigRestApi.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['ConfigMicroserviceServices',      await fs.promises.readFile(serverProcess.cwd() + '/server/install/default/ConfigMicroserviceServices.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['IamUser',                         await fs.promises.readFile(serverProcess.cwd() + '/server/install/default/IamUser.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['App',                             await fs.promises.readFile(serverProcess.cwd() + '/server/install/default/App.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['AppDataEntityResource',           await fs.promises.readFile(serverProcess.cwd() + '/server/install/default/AppDataEntityResource.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['AppDataEntity',                   await fs.promises.readFile(serverProcess.cwd() + '/server/install/default/AppDataEntity.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['AppDataResourceDetailData',       await fs.promises.readFile(serverProcess.cwd() + '/server/install/default/AppDataResourceDetailData.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['AppDataResourceDetail',           await fs.promises.readFile(serverProcess.cwd() + '/server/install/default/AppDataResourceDetail.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['AppDataResourceMaster',           await fs.promises.readFile(serverProcess.cwd() + '/server/install/default/AppDataResourceMaster.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['AppModule',                       await fs.promises.readFile(serverProcess.cwd() + '/server/install/default/AppModule.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['AppParameter',                    await fs.promises.readFile(serverProcess.cwd() + '/server/install/default/AppParameter.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['AppSecret',                       await fs.promises.readFile(serverProcess.cwd() + '/server/install/default/AppSecret.json')
                                                                        .then(filebuffer=>
                                                                        //generate secrets
                                                                        JSON.parse(filebuffer.toString())
                                                                            .filter((/**@type{server_db_table_AppSecret}*/row)=>row.app_id!=0)
                                                                            .map((/**@type{server_db_table_AppSecret}*/row)=>{
                                                                            row.common_client_id = securitySecretCreate();
                                                                            row.common_client_secret = securitySecretCreate();
                                                                            row.common_app_id_secret = securitySecretCreate();
                                                                            row.common_app_access_secret = securitySecretCreate();
                                                                            row.common_app_access_verification_secret = securitySecretCreate();
                                                                            return row;
                                                                        }))],
                            ['AppData',                         await fs.promises.readFile(serverProcess.cwd() + '/server/install/default/AppData.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['AppTranslation',                  await fs.promises.readFile(serverProcess.cwd() + '/server/install/default/AppTranslation.json').then(filebuffer=>JSON.parse(filebuffer.toString()))],
                            ['DbObjects',                       await fs.promises.readFile(serverProcess.cwd() + '/server/install/default/DbObjects.json')
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
                            '/data/db/journal'
                            ])
    .catch((/**@type{server_server_error}*/err) => {
        throw err;
    }); 
    //load default db
    await ORM.Init(config_obj[15][1]);
    for (const config_row of config_obj){
        await ORM.postFsAdmin(config_row[0], config_row[1]);
    }
};
/**
 * @name update
 * @description Config save
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          data:{  config: server_db_document_ConfigServer|null,
 *                  maintenance:string,
 *                  comment:string,
 *                  configuration:string}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
 */
const update = async parameters => {
    const {serverUtilNumberValue} = await import('../server.js');
    //can only use config or a config key
    if (parameters.data.config && 
        (parameters.data.maintenance ||parameters.data.comment||parameters.data.configuration))
        return ORM.getError(parameters.app_id, 400);
    else{
        /**@type{server_db_document_ConfigServer} */
        const old_config = get({app_id:parameters.app_id}).result;
        /**@type{server_db_config_server_metadata} */
        const metadata = {
                            MAINTENANCE:serverUtilNumberValue(parameters.data.maintenance ?? old_config.METADATA.MAINTENANCE) ?? old_config.METADATA.MAINTENANCE,
                            CONFIGURATION:parameters.data.configuration ?? old_config.METADATA.CONFIGURATION,
                            COMMENT:parameters.data.comment ?? old_config.METADATA.COMMENT,
                            MODIFIED:new Date().toISOString(),
                            CREATED:old_config.METADATA.CREATED
         };
        const new_config ={
            ...(parameters.data.config ?? old_config),
            ...{METADATA:metadata}
        };
        return {result:await ORM.Execute({app_id:parameters.app_id, 
                                        object:'ConfigServer',
                                        dml:'UPDATE',                  
                                        update:{resource_id:null, 
                                                data_app_id:null, 
                                                data:new_config}}),
                type:'JSON'};    
    }
    
};
export{ get, update, configDefault};