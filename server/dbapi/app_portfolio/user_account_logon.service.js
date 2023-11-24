/** @module server/dbapi/app_portfolio/user_account_logon */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const {db_execute, db_schema} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {number} user_account_id 
 * @param {number} app_id_select 
 * @returns {Promise.<Types.db_result_user_account_logon_getUserAccountLogonAdmin[]>}
 */
const getUserAccountLogonAdmin = async (app_id, user_account_id, app_id_select) => {
	const sql = `SELECT user_account_id "user_account_id",
					app_id "app_id",
					result "result",
					access_token "access_token",
					client_ip "client_ip",
					client_user_agent "client_user_agent",
					client_longitude "client_longitude",
					client_latitude "client_latitude",
					date_created "date_created"
				FROM ${db_schema()}.user_account_logon
			WHERE user_account_id = :user_account_id
				AND ((app_id = :app_id_select) OR :app_id_select IS NULL)
			ORDER BY 9 DESC`;
	const parameters = {
					user_account_id: user_account_id,
					app_id_select: app_id_select
				};
	return await db_execute(app_id, sql, parameters, null);
};
/**
 * 
 * @param {number} app_id 
 * @param {number} user_account_id 
 * @param {string} access_token 
 * @param {string} client_ip 
 * @returns {Promise.<Types.db_result_user_account_logon_Checklogin[]>}
 */
const checkLogin = async (app_id, user_account_id, access_token, client_ip) => {
	const sql = `SELECT 1 "login"
					FROM ${db_schema()}.user_account_logon ual,
						${db_schema()}.user_account ua
					WHERE ua.id = :user_account_id
					AND ual.user_account_id = ua.id
					AND ual.app_id = :app_id
					AND ual.access_token = :access_token
					AND ual.client_ip = :client_ip
					AND ((ual.app_id = :admin_app_id
							AND 
							ua.app_role_id IN (:super_admin_app_role_id,:admin_app_role_id))
						OR
						ual.app_id <> :admin_app_id)`;
	const {ConfigGet} = await import(`file://${process.cwd()}/server/config.service.js`);
	const parameters = {
		user_account_id: user_account_id,
		app_id: app_id,
		access_token: access_token,
		client_ip: client_ip,
		admin_app_id: getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),
		super_admin_app_role_id: 0,
		admin_app_role_id: 1
	};
	return await db_execute(app_id, sql, parameters, null);
};
/**
 * 
 * @param {number} app_id 
 * @param {Types.db_parameter_user_account_logon_insertUserAccountLogon} data 
 * @returns {Promise.<Types.db_result_user_account_logon_insertUserAccountLogon>}
 */
const insertUserAccountLogon = async (app_id, data) => {
	data.access_token = data.access_token ?? null;
	const sql = `INSERT INTO ${db_schema()}.user_account_logon(
				user_account_id, app_id, result, access_token, client_ip,  client_user_agent,  client_longitude, client_latitude, date_created)
				VALUES(:user_account_id, :app_id, :result_insert,:access_token,:client_ip,:client_user_agent, :client_longitude, :client_latitude, CURRENT_TIMESTAMP) `;
	const parameters = {
						user_account_id: data.user_account_id,
						app_id: data.app_id,
						result_insert: data.result,
						access_token: data.access_token,
						client_ip: data.client_ip,
						client_user_agent: data.client_user_agent,
						client_longitude:  data.client_longitude,
						client_latitude:  data.client_latitude
					};
	return await db_execute(app_id, sql, parameters, null);
};
export{getUserAccountLogonAdmin, checkLogin, insertUserAccountLogon};