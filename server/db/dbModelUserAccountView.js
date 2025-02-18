/** @module server/db/dbModelUserAccountView */


/**
 * @import {server_server_response,
 *          server_db_common_result_insert,
 *          server_db_sql_parameter_user_account_view_insertUserAccountView} from '../types.js'
 */

/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**
 * @name post
 * @description Create view record
 * @function
 * @param {number} app_id 
 * @param {server_db_sql_parameter_user_account_view_insertUserAccountView} data 
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async (app_id, data) => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(app_id, 
                        dbSql.USER_ACCOUNT_VIEW_INSERT, 
                        {
							user_account_id: data.user_account_id,
							user_account_id_view: data.user_account_id_view,
							client_ip: data.client_ip,
							client_user_agent: data.client_user_agent
						}));

export {post};