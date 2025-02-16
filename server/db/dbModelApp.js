/** @module server/db/dbModelApp */

/**
 * @import {server_server_response,
 *          server_db_sql_result_app_get,
 *          server_db_common_result_delete,
 *          server_db_common_result_insert} from '../types.js'
 */
/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**
 * @name get
 * @description Get user account app
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number|null}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_sql_result_app_get[] }>}
 */
const get = async parameters =>
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
       dbCommonExecute(parameters.app_id, 
                       dbSql.APP_SELECT,
                       {
                           id: parameters.app_id
                       }));

/**
 * @name post
 * @description Create record, only allowed as admin
 * @function
 * @param {{app_id:Number,
 *          data:{data_app_id:number}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async parameters => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(parameters.app_id, 
                        dbSql.APP_INSERT, 
                        {
                            id: parameters.data.data_app_id
                        }));
/**
 * @name deleteRecord
 * @description Delete record, ony allowed as admin
 * @function
  * @param {{app_id:number,
 *          resource_id:number|null}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_delete }>}
 */
const deleteRecord = parameters => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(parameters.app_id, 
                        dbSql.APP_DELETE,
                        {
                            id: serverUtilNumberValue(parameters.resource_id)
                        }));

export {get, post,deleteRecord};