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
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*} data
 * @returns {Promise.<server_db_sql_result_user_account_follow_follow>}
 */
const post = (app_id, resource_id, data) => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(app_id, 
                        dbSql.USER_ACCOUNT_FOLLOW_INSERT, 
                        {
                            user_account_id: resource_id,
                            user_account_id_follow: serverUtilNumberValue(data.user_account_id)
                            },
                        null, 
                        null));
/**
 * @name deleteRecord
 * @description Unfollow
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*} data
 * @returns {Promise.<server_db_sql_result_user_account_follow_unfollow>}
 */
const deleteRecord = (app_id, resource_id, data) => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(app_id, 
                        dbSql.USER_ACCOUNT_FOLLOW_DELETE, 
                        {
                            user_account_id: resource_id,
                            user_account_id_follow: serverUtilNumberValue(data.user_account_id)
                            },
                        null, 
                        null));
export {post, deleteRecord};