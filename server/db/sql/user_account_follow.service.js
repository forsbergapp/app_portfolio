/** @module server/db/sql/user_account_follow */

/**@type{import('../../db/common.service.js')} */
const {db_execute} = await import(`file://${process.cwd()}/server/db/common.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {number} id 
 * @param {number} id_follow 
 * @returns {Promise.<import('../../../types.js').db_result_user_account_follow_follow>}
 */
const follow = async (app_id, id, id_follow) => {
		const sql = `INSERT INTO <DB_SCHEMA/>.user_account_follow(
							user_account_id, user_account_id_follow, date_created)
					VALUES(:user_account_id,:user_account_id_follow, CURRENT_TIMESTAMP)`;
		const parameters = {
						user_account_id: id,
						user_account_id_follow: id_follow
						};
		return await db_execute(app_id, sql, parameters, null);
	};
/**
 * 
 * @param {number} app_id 
 * @param {number} id 
 * @param {number} id_unfollow 
 * @returns {Promise.<import('../../../types.js').db_result_user_account_follow_unfollow>}
 */
const unfollow = async (app_id, id, id_unfollow) => {
		const sql = `DELETE FROM <DB_SCHEMA/>.user_account_follow
						WHERE user_account_id = :user_account_id
						  AND user_account_id_follow = :user_account_id_follow`;
		const parameters = {
						user_account_id: id,
						user_account_id_follow: id_unfollow
						};
		return await db_execute(app_id, sql, parameters, null);
	};
export{follow, unfollow};