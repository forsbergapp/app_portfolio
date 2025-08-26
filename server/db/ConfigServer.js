/** @module server/db/ConfigServer */

/**
 * @import {server_server_response,server_db_common_result_update,
 *          server_db_document_ConfigServer,
 *          server_db_config_server_metadata} from '../types.js'
 */
const {ORM} = await import ('../server.js');
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
 * @name update
 * @description Config save
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          data:{  config: server_db_document_ConfigServer|null,
 *                  maintenance?:string,
 *                  comment?:string,
 *                  configuration?:string}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
 */
const update = async parameters => {
    //can only use config or a config key
    if (parameters.data.config && 
        (parameters.data.maintenance ||parameters.data.comment||parameters.data.configuration))
        return ORM.getError(parameters.app_id, 400);
    else{
        /**@type{server_db_document_ConfigServer} */
        const old_config = get({app_id:parameters.app_id}).result;
        /**@type{server_db_config_server_metadata} */
        const metadata = {
                            MAINTENANCE:ORM.UtilNumberValue(parameters.data.maintenance ?? old_config.METADATA.MAINTENANCE) ?? old_config.METADATA.MAINTENANCE,
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
export{ get, update};