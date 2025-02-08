/** @module server/db/dbModelAppDataEntity */

/**
 * @import {server_server_response,server_db_sql_result_app_data_entity_get} from '../types.js'
 */

/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**
 * @name get
 * @description Get Entity
 * @function
 * @memberof ROUTE_REST_API
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
                            data_app_id : serverUtilNumberValue(parameters.data?.data_app_id)}, 
                        null));
export{get};
