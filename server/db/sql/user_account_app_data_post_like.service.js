/** @module server/db/sql/user_account_app_data_post_like */

/**@type{import('../../db/common.service.js')} */
const {db_execute} = await import(`file://${process.cwd()}/server/db/common.service.js`);

/**
 * 
 * @param {number} app_id
 * @param {number} id
 * @param {number|null} id_like
 * @returns {Promise.<import('../../../types.js').server_db_sql_result_user_account_app_data_post_like_like>}
 */
const like = async (app_id, id, id_like) => {
	const sql = `INSERT INTO <DB_SCHEMA/>.user_account_app_data_post_like(
					user_account_app_user_account_id, user_account_app_data_post_id, user_account_app_app_id, date_created)
				VALUES(:user_account_id,:user_account_app_data_post_id, :app_id, CURRENT_TIMESTAMP) `;
	const parameters = {
					user_account_id: id,
					user_account_app_data_post_id: id_like,
					app_id: app_id
				};
	return await db_execute(app_id, sql, parameters, null);
};
/**
 * 
 * @param {number} app_id 
 * @param {number} id 
 * @param {number|null} id_unlike 
 * @returns {Promise.<import('../../../types.js').server_db_sql_result_user_account_app_data_post_like_unlike>}
 */
const unlike = async (app_id, id, id_unlike) => {
	const sql = `DELETE FROM <DB_SCHEMA/>.user_account_app_data_post_like
					WHERE user_account_app_user_account_id = :user_account_id
						AND user_account_app_data_post_id = :user_account_app_data_post_id 
						AND user_account_app_app_id = :app_id`;
	const parameters = {
					user_account_id: id,
					user_account_app_data_post_id: id_unlike,
					app_id: app_id
					};
	return await db_execute(app_id, sql, parameters, null);
};
export{like, unlike};