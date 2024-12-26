/** @module server/db/dbModelUserAccountLike */

/**
 * @import {server_db_sql_result_user_account_like_unlike,
 *          server_db_sql_result_user_account_like_like} from '../types.js'
 */

/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**
 * @name post
 * @description Like
 * @function
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} data
 * @returns {Promise.<server_db_sql_result_user_account_like_like>}
 */
const post = (app_id, resource_id, data) => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(app_id, 
                        dbSql.USER_ACCOUNT_LIKE_INSERT, 
                        {
                            user_account_id: resource_id,
                            user_account_id_like: serverUtilNumberValue(data.user_account_id)
                            },
                        null, 
                        null));
/**
 * @name deleteRecord
 * @description Unlike
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*} data
 * @returns {Promise.<server_db_sql_result_user_account_like_unlike>}
 */
const deleteRecord = (app_id, resource_id, data) => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(app_id, 
                        dbSql.USER_ACCOUNT_LIKE_DELETE, 
                        {
                            user_account_id: resource_id,
                            user_account_id_like: serverUtilNumberValue(data.user_account_id)
                            },
                        null, 
                        null));
                        
export {post, deleteRecord};