/** @module server/dbapi/sql/profile_search */

/**@type{import('../../dbapi/common/common.service.js')} */
const {db_execute} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {import('../../../types.js').db_parameter_profile_search_insertProfileSearch} data 
 * @returns {Promise.<import('../../../types.js').db_result_profile_search_insertProfileSearch[]>}
 */
const insertProfileSearch = async (app_id, data) => {
		const sql = `INSERT INTO <DB_SCHEMA/>.profile_search(
								user_account_id, search, client_ip, client_user_agent, client_longitude, client_latitude, date_created)
					VALUES(:user_account_id,:search,:client_ip,:client_user_agent,:client_longitude,:client_latitude, CURRENT_TIMESTAMP)`;
		const parameters = {
						user_account_id: data.user_account_id,
						search: data.search,
						client_ip: data.client_ip,
						client_user_agent: data.client_user_agent,
						client_longitude: data.client_longitude,
						client_latitude: data.client_latitude
						};
		return await db_execute(app_id, sql, parameters, null);
	};
export{insertProfileSearch};