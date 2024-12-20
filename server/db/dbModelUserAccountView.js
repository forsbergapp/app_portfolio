/** @module server/db/dbModelUserAccountView */


/**
 * @import {server_db_sql_result_user_account_view_insertUserAccountView,
 *          server_db_sql_parameter_user_account_view_insertUserAccountView} from '../types.js'
 */

/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**
 * Create view record
 * @function
 * @param {number} app_id 
 * @param {server_db_sql_parameter_user_account_view_insertUserAccountView} data 
 * @returns {Promise.<server_db_sql_result_user_account_view_insertUserAccountView>}
 */
const post = async (app_id, data) => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(app_id, 
                        dbSql.USER_ACCOUNT_VIEW_INSERT, 
                        {
							user_account_id: data.user_account_id,
							user_account_id_view: data.user_account_id_view,
							client_ip: data.client_ip,
							client_user_agent: data.client_user_agent,
							client_longitude: data.client_longitude,
							client_latitude: data.client_latitude
						},
                        null, 
                        null));

export {post};