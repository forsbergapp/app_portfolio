/** @module server/db/dbModelUserAccountLike */

/**
 * @import {server_server_response,
 *          server_db_common_result_insert,
 *          server_db_common_result_delete} from '../types.js'
 */

/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**
 * @name post
 * @description Like
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{user_account_id:number|null}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = parameters => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(parameters.app_id, 
                        dbSql.USER_ACCOUNT_LIKE_INSERT, 
                        {
                            user_account_id: parameters.resource_id,
                            user_account_id_like: serverUtilNumberValue(parameters.data?.user_account_id)
                        }));
/**
 * @name deleteRecord
 * @description Unlike
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{user_account_id:number|null}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_delete }>}
 */
const deleteRecord = parameters => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(parameters.app_id, 
                        dbSql.USER_ACCOUNT_LIKE_DELETE, 
                        {
                            user_account_id: parameters.resource_id,
                            user_account_id_like: serverUtilNumberValue(parameters.data?.user_account_id)
                        }));
                        
export {post, deleteRecord};