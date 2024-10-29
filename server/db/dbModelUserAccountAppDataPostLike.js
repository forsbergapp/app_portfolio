/** @module server/db/dbModelUserAccountAppDataPostLike */

/**
 * @import {server_db_sql_result_user_account_app_data_post_like_unlike,
 *          server_db_sql_result_user_account_app_data_post_like_like} from '../types.js'
 */

/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**
 * Like
 * @function
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} data
 * @returns {Promise.<server_db_sql_result_user_account_app_data_post_like_like>}
 */
const post = (app_id, resource_id, data) => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(app_id, 
                        dbSql.USER_ACCOUNT_APP_DATA_POST_LIKE_INSERT, 
                        {
                            user_account_id: resource_id,
                            user_account_app_data_post_id: serverUtilNumberValue(data.user_account_app_data_post_id),
                            app_id: app_id
                        },
                        null, 
                        null));
/**
 * Unlike
 * @function
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} data
 * @returns {Promise.<server_db_sql_result_user_account_app_data_post_like_unlike>}
 */
const deleteRecord = (app_id, resource_id, data) => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(app_id, 
                        dbSql.USER_ACCOUNT_APP_DATA_POST_LIKE_DELETE, 
                        {
                            user_account_id: resource_id,
                            user_account_app_data_post_id: serverUtilNumberValue(data.user_account_app_data_post_id),
                            app_id: app_id
                        },
                        null, 
                        null));

export{post, deleteRecord};