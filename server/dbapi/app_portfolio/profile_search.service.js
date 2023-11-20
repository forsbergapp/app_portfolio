/** @module server/dbapi/app_portfolio/profile_search */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const {db_execute, db_schema} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {Types.db_parameter_profile_search_insertProfileSearch} data 
 * @returns {Promise.<Types.db_result_profile_search_insertProfileSearch[]>}
 */
const insertProfileSearch = async (app_id, data) => {
		const sql = `INSERT INTO ${db_schema()}.profile_search(
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