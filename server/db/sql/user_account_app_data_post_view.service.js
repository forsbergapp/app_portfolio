/** @module server/db/sql/user_account_app_data_post_view */

/**@type{import('../../db/common.service.js')} */
const {db_execute} = await import(`file://${process.cwd()}/server/db/common.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {import('../../types.js').server_db_sql_parameter_user_account_app_data_post_view_insertUserPostView} data 
 * @returns {Promise.<import('../../types.js').server_db_sql_result_user_account_app_data_post_view_insertUserPostView>}
 */
const insertUserPostView = async (app_id, data) => {
		const sql = `INSERT INTO <DB_SCHEMA/>.user_account_app_data_post_view(
							client_ip,
							client_user_agent,
							client_longitude, 
							client_latitude, 
							date_created,
							user_account_app_user_account_id,
							user_account_app_data_post_id,
							user_account_app_app_id)
					VALUES( :client_ip,
							:client_user_agent,
							:client_longitude,
							:client_latitude,
							CURRENT_TIMESTAMP,
							:user_account_id,
							:user_account_app_data_post_id,
							:app_id) `;
		const parameters = {
						client_ip: data.client_ip,
						client_user_agent: data.client_user_agent,
						client_longitude: data.client_longitude,
						client_latitude: data.client_latitude,
						user_account_id: data.user_account_id,
						user_account_app_data_post_id: data.user_account_app_data_post_id,
						app_id: app_id
					};
		return await db_execute(app_id, sql, parameters, null);
	};
export{insertUserPostView};