/** @module server/db/sql/user_account_follow */

/**@type{import('../../db/common.js')} */
const {dbCommonExecute} = await import(`file://${process.cwd()}/server/db/common.js`);

/**
 * 
 * @param {number} app_id 
 * @param {number} id 
 * @param {number|null} id_follow 
 * @returns {Promise.<import('../../types.js').server_db_sql_result_user_account_follow_follow>}
 */
const follow = async (app_id, id, id_follow) => {
		const sql = `INSERT INTO <DB_SCHEMA/>.user_account_follow(
							user_account_id, user_account_id_follow, date_created)
					VALUES(:user_account_id,:user_account_id_follow, CURRENT_TIMESTAMP)`;
		const parameters = {
						user_account_id: id,
						user_account_id_follow: id_follow
						};
		return await dbCommonExecute(app_id, sql, parameters, null);
	};
/**
 * 
 * @param {number} app_id 
 * @param {number} id 
 * @param {number|null} id_unfollow 
 * @returns {Promise.<import('../../types.js').server_db_sql_result_user_account_follow_unfollow>}
 */
const unfollow = async (app_id, id, id_unfollow) => {
		const sql = `DELETE FROM <DB_SCHEMA/>.user_account_follow
						WHERE user_account_id = :user_account_id
						  AND user_account_id_follow = :user_account_id_follow`;
		const parameters = {
						user_account_id: id,
						user_account_id_follow: id_unfollow
						};
		return await dbCommonExecute(app_id, sql, parameters, null);
	};
export{follow, unfollow};