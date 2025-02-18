/** @module server/db/dbModelUserAccountAppDataPostView */

/**
 * @import {server_server_response,
 *          server_db_common_result_insert,
 *          server_db_sql_parameter_user_account_app_data_post_view_insertUserPostView} from '../types.js'
 */

/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**
 * @name post
 * @description Create view record
 * @function
 * @param {number} app_id 
 * @param {server_db_sql_parameter_user_account_app_data_post_view_insertUserPostView} data 
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async (app_id, data) =>
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(app_id, 
                        dbSql.USER_ACCOUNT_APP_DATA_POST_VIEW_INSERT, 
                        {
                            client_ip: data.client_ip,
                            client_user_agent: data.client_user_agent,
                            user_account_id: data.user_account_id,
                            user_account_app_data_post_id: data.user_account_app_data_post_id,
                            app_id: data.data_app_id
                        }));

export {post};