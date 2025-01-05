/** @module server/db/dbModelUserAccountFollow */

/**
 * @import {server_db_sql_result_user_account_follow_unfollow,
 *          server_db_sql_result_user_account_follow_follow} from '../types.js'
 */

/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**
 * @name post
 * @description Follow
 * @function
 * @memberof REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          data:{user_account_id?:number|null}}} parameters
 * @returns {Promise.<server_db_sql_result_user_account_follow_follow>}
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
 * @memberof REST_API
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{user_account_id:number|null}}} parameters
 * @returns {Promise.<server_db_sql_result_user_account_follow_unfollow>}
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