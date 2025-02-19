/** @module server/db/App */

/**
 * @import {server_server_response,server_db_table_app_data_entity_resource} from '../types.js'
 */

/**@type{import('./file.js')} */
const {fileDBGet} = await import(`file://${process.cwd()}/server/db/file.js`);
/**@type{import('../db/common.js')} */
const { dbCommonRecordError} = await import(`file://${process.cwd()}/server/db/common.js`);

/**
 * @name get
 * @description Get records for given appid
 * @function
 * @param {{app_id:number|null,
 *          resource_id:number|null,
 *          data:{  entity_id?:string|null,
 *                  data_app_id?:string|number|null,
 *                  resource_name?:string|null}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_table_app_data_entity_resource & {app_setting_name:string, app_setting_value:string, app_setting_display_data:string}[] }>}
 */
const get = async parameters =>{ 
    /**@type{import('./AppSetting.js')} */
    const AppSetting = await import(`file://${process.cwd()}/server/db/AppSetting.js`);

    const result = fileDBGet(parameters.app_id, 'APP_DATA_ENTITY_RESOURCE',parameters.resource_id, null).rows
                    .filter((/**@type{server_db_table_app_data_entity_resource}*/row)=>
                                row.id                      == (parameters.resource_id ?? row.id) &&
                                row.app_data_entity_app_id  == (parameters.data.data_app_id ?? row.app_data_entity_app_id) &&
                                row.app_data_entity_id      == (parameters.data.entity_id ?? row.app_data_entity_id));
    if (result.length>0 || parameters.resource_id==null)
        /**@ts-ignore */
        return {result:result
                        .map((/**@type{server_db_table_app_data_entity_resource & {app_setting_name:string, app_setting_value:string, app_setting_display_data:string}}*/row)=>{
                            /**@ts-ignore */
                            const app_setting = AppSetting.getServer({ app_id:parameters.app_id, 
                                                                                resource_id:row.app_setting_id,
                                                                                data:{data_app_id:row.app_data_entity_app_id}}).result[0];
                            row.app_setting_name = app_setting?.name;
                            row.app_setting_value = app_setting?.value;
                            row.app_setting_display_data = app_setting?.display_data;
                            return row;
                        })
                        .filter((/**@type{server_db_table_app_data_entity_resource & {app_setting_name:string, app_setting_value:string, app_setting_display_data:string}}*/row)=>
                            row.app_setting_value == (parameters.data?.resource_name ?? row.app_setting_value)
                        ),
                type:'JSON'};
    else
        return dbCommonRecordError(parameters.app_id, 404);
};
        
export {get};