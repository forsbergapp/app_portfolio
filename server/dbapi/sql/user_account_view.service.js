/** @module server/dbapi/sql/user_account_view */

/**@type{import('../../dbapi/common/common.service.js')} */
const {db_execute} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {import('../../../types.js').db_parameter_user_account_view_insertUserAccountView} data 
 * @returns {Promise.<import('../../../types.js').db_result_user_account_view_insertUserAccountView>}
 */
const insertUserAccountView = async (app_id, data) => {
		const sql = `INSERT INTO <DB_SCHEMA/>.user_account_view(
							user_account_id, user_account_id_view, client_ip, client_user_agent, client_longitude, client_latitude, date_created)
					VALUES(:user_account_id,:user_account_id_view,:client_ip,:client_user_agent,:client_longitude,:client_latitude, CURRENT_TIMESTAMP) `;
		const parameters = {
							user_account_id: data.user_account_id,
							user_account_id_view: data.user_account_id_view,
							client_ip: data.client_ip,
							client_user_agent: data.client_user_agent,
							client_longitude: data.client_longitude,
							client_latitude: data.client_latitude
						};
		return await db_execute(app_id, sql, parameters, null);
	};
export{insertUserAccountView};