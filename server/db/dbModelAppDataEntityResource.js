/** @module server/db/dbModelAppDataEntityResource */


/**
 * @import {server_server_response,server_db_sql_result_app_data_entity_resource_get} from '../types.js'
 */

/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**
 * @name get
 * @description Get Entity resource
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{  entity_id?:string|null,
 *                  data_app_id?:string|number|null,
 *                  resource_name?:string|null}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_sql_result_app_data_entity_resource_get[] }>}
 */
const get = async parameters =>{
    /**@type{import('./fileModelAppSetting.js')} */
    const fileModelAppSetting = await import(`file://${process.cwd()}/server/db/fileModelAppSetting.js`);

    return import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(parameters.app_id, 
                dbSql.APP_DATA_ENTITY_RESOURCE_SELECT, 
                {   resource_id: parameters.resource_id,
                    data_app_id: serverUtilNumberValue(parameters.data?.data_app_id),
                    entity_id: serverUtilNumberValue(parameters.data?.entity_id)
                    })
                .then(result=>result.http?result:
                    {result:result.result
                        .map((/**@type{server_db_sql_result_app_data_entity_resource_get}*/row)=>{
                            const app_setting = fileModelAppSetting.getServer({   app_id:parameters.app_id, 
                                                                            resource_id:row.app_setting_id,
                                                                            data:{data_app_id:row.app_data_entity_app_id}}).result[0];
                            row.app_setting_name = app_setting?.name;
                            row.app_setting_value = app_setting?.value;
                            row.app_setting_display_data = app_setting?.display_data;
                            return row;
                        })
                        .filter((/**@type{server_db_sql_result_app_data_entity_resource_get}*/row)=>
                            row.app_setting_value == (parameters.data?.resource_name ?? row.app_setting_value)
                        ),
                    type:'JSON'}));
};
    
export {get};