/** @module server/dbapi/app_portfolio/user_account_app_setting_view */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const {db_execute, db_schema} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {Types.db_parameter_user_account_app_setting_view_insertUserSettingView} data 
 * @returns {Promise.<Types.db_result_user_account_app_setting_view_insertUserSettingView>}
 */
const insertUserSettingView = async (app_id, data) => {
		const sql = `INSERT INTO ${db_schema()}.user_account_app_setting_view(
							client_ip,
							client_user_agent,
							client_longitude, 
							client_latitude, 
							date_created,
							user_account_app_user_account_id,
							user_account_app_setting_id,
							user_account_app_app_id)
					VALUES( :client_ip,
							:client_user_agent,
							:client_longitude,
							:client_latitude,
							CURRENT_TIMESTAMP,
							:user_account_id,
							:user_setting_id,
							:app_id) `;
		const parameters = {
						client_ip: data.client_ip,
						client_user_agent: data.client_user_agent,
						client_longitude: data.client_longitude,
						client_latitude: data.client_latitude,
						user_account_id: data.user_account_id,
						user_setting_id: data.user_setting_id,
						app_id: app_id
					};
		return await db_execute(app_id, sql, parameters, null);
	};
export{insertUserSettingView};