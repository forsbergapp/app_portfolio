/** @module server/db/sql/user_account_logon */

/**@type{import('../../db/common.service.js')} */
const {db_execute} = await import(`file://${process.cwd()}/server/db/common.service.js`);
/**@type{import('../../server.service.js')} */
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {number|null} user_account_id 
 * @param {number|null} app_id_select 
 * @returns {Promise.<import('../../../types.js').db_result_user_account_logon_getUserAccountLogon[]>}
 */
const getUserAccountLogon = async (app_id, user_account_id, app_id_select) => {
	const sql = `SELECT user_account_id "user_account_id",
						app_id "app_id",
						json_data "json_data",
						date_created "date_created"
				   FROM <DB_SCHEMA/>.user_account_logon
				  WHERE user_account_id = :user_account_id
					AND ((app_id = :app_id_select) OR :app_id_select IS NULL)
				ORDER BY date_created DESC`;
	const parameters = {
					user_account_id: user_account_id,
					app_id_select: app_id_select
				};
	return await db_execute(app_id, sql, parameters, null, null, false);
};
/**
 * 
 * @param {number|null} app_id 
 * @param {number|null} user_account_id 
 * @returns {Promise.<import('../../../types.js').db_result_user_account_logon_Checklogin[]>}
 */
const checkLogin = async (app_id, user_account_id) => {
	const sql = `SELECT ual.json_data "json_data"
				   FROM <DB_SCHEMA/>.user_account_logon ual,
						<DB_SCHEMA/>.user_account ua
				  WHERE ua.id = :user_account_id
					AND ual.user_account_id = ua.id
					AND ual.app_id = :app_id
					AND ((ual.app_id = :admin_app_id
							AND 
							ua.app_role_id IN (:super_admin_app_role_id,:admin_app_role_id))
						OR
						ual.app_id <> :admin_app_id)`;
	const {ConfigGet} = await import(`file://${process.cwd()}/server/config.service.js`);
	const parameters = {
		user_account_id: user_account_id,
		app_id: app_id,
		admin_app_id: getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),
		super_admin_app_role_id: 0,
		admin_app_role_id: 1
	};
	return await db_execute(app_id, sql, parameters, null, null, false);
};
/**
 * 
 * @param {number} app_id 
 * @param {number|null} user_account_id
 * @param {import('../../../types.js').db_parameter_user_account_logon_insertUserAccountLogon} data 
 * @returns {Promise.<import('../../../types.js').db_result_user_account_logon_insertUserAccountLogon>}
 */
const insertUserAccountLogon = async (app_id, user_account_id, data) => {
	data.access_token = data.access_token ?? null;
	const sql = `INSERT INTO <DB_SCHEMA/>.user_account_logon(user_account_id, app_id, json_data, date_created)
					VALUES(:user_account_id, :app_id, :json_data, CURRENT_TIMESTAMP) `;
	//old: :result_insert,:access_token,:client_ip,:client_user_agent, :client_longitude, :client_latitude,
	const parameters = {
						user_account_id: user_account_id,
						app_id: app_id,
						json_data :JSON.stringify(data)
					};
	return await db_execute(app_id, sql, parameters, null);
};
export{getUserAccountLogon, checkLogin, insertUserAccountLogon};