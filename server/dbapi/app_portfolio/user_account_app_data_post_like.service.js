/** @module server/dbapi/app_portfolio/user_account_app_data_post_like */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const {db_execute, db_schema} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);

/**
 * 
 * @param {number} app_id
 * @param {number} id
 * @param {number} id_like
 * @returns {Promise.<Types.db_result_user_account_app_data_post_like_like>}
 */
const like = async (app_id, id, id_like) => {
	const sql = `INSERT INTO ${db_schema()}.user_account_app_data_post_like(
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
 * @param {number} id_unlike 
 * @returns {Promise.<Types.db_result_user_account_app_data_post_like_unlike>}
 */
const unlike = async (app_id, id, id_unlike) => {
	const sql = `DELETE FROM ${db_schema()}.user_account_app_data_post_like
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