/** @module server/db/dbModelAppDataEntity */

/**
 * @import {server_server_response,server_db_common_result_update, server_db_sql_result_app_data_entity_get} from '../types.js'
 */

/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**
 * @name get
 * @description get record
 * @function
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{data_app_id?:string|number|null}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_sql_result_app_data_entity_get[] }>}
 */
const get = parameters => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(parameters.app_id, 
                        dbSql.APP_DATA_ENTITY_SELECT, 
                        {   resource_id: parameters.resource_id,
                            data_app_id : serverUtilNumberValue(parameters.data?.data_app_id)}));
/**
 * @name update
 * @description update record
 * @function
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{  json_data:*,
 *                  data_app_id?:number|null}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
 */
const update = parameters => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(parameters.app_id, 
                        dbSql.APP_DATA_ENTITY_UPDATE, 
                        {   resource_id: parameters.resource_id,
                            json_data:   JSON.stringify(parameters.data.json_data),
                            data_app_id : serverUtilNumberValue(parameters.data?.data_app_id)}));
export{get, update};