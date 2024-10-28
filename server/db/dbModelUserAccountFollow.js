/** @module server/db/dbModelUserAccountFollow */

/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*} data
 * @returns {Promise.<import('../types.js').server_db_sql_result_user_account_follow_follow>}
 */
const follow = (app_id, resource_id, data) => 
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
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*} data
 * @returns {Promise.<import('../types.js').server_db_sql_result_user_account_follow_unfollow>}
 */
const unfollow = (app_id, resource_id, data) => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(app_id, 
                        dbSql.USER_ACCOUNT_FOLLOW_DELETE, 
                        {
                            user_account_id: resource_id,
                            user_account_id_follow: serverUtilNumberValue(data.user_account_id)
                            },
                        null, 
                        null));
export {follow, unfollow};