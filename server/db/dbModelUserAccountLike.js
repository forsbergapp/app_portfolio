/** @module server/db/dbModelUserAccountLike */

/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} data
 * @returns {Promise.<import('../types.js').server_db_sql_result_user_account_like_like>}
 */
const like = (app_id, resource_id, data) => 
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
 * 
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*} data
 * @returns {Promise.<import('../types.js').server_db_sql_result_user_account_like_unlike>}
 */
const unlike = (app_id, resource_id, data) => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(app_id, 
                        dbSql.USER_ACCOUNT_LIKE_DELETE, 
                        {
                            user_account_id: resource_id,
                            user_account_id_like: serverUtilNumberValue(data.user_account_id)
                            },
                        null, 
                        null));
                        
export {like, unlike};