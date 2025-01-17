/** @module server/db/dbModelUserAccountFollow */

/**
 * @import {server_server_response,
 *          server_db_common_result_delete,
 *          server_db_common_result_insert} from '../types.js'
 * @typedef {server_server_response & {result?:server_db_common_result_insert }} post
 * @typedef {server_server_response & {result?:server_db_common_result_delete }} deleteRecord
 */

/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**
 * @name post
 * @description Follow
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          data:{user_account_id?:number|null}}} parameters
 * @returns {Promise.<post>}
 */
const post = parameters => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(parameters.app_id, 
                        dbSql.USER_ACCOUNT_FOLLOW_INSERT, 
                        {
                            user_account_id: parameters.resource_id,
                            user_account_id_follow: serverUtilNumberValue(parameters.data?.user_account_id)
                            },
                        null, 
                        null));
/**
 * @name deleteRecord
 * @description Unfollow
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{user_account_id:number|null}}} parameters
 * @returns {Promise.<deleteRecord>}
 */
const deleteRecord = parameters => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(parameters.app_id, 
                        dbSql.USER_ACCOUNT_FOLLOW_DELETE, 
                        {
                            user_account_id: parameters.resource_id,
                            user_account_id_follow: serverUtilNumberValue(parameters.data?.user_account_id)
                            },
                        null, 
                        null));
export {post, deleteRecord};