/** @module server/dbapi/app_portfolio/user_account_app_setting_like */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const {db_execute, db_schema} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);

/**
 * 
 * @param {number} app_id
 * @param {number} id
 * @param {number} id_like
 * @returns {Promise.<Types.db_result_user_account_app_setting_like_likeUserSetting>}
 */
const likeUserSetting = async (app_id, id, id_like) => {
	const sql = `INSERT INTO ${db_schema()}.user_account_app_setting_like(
					user_account_app_user_account_id, user_account_app_setting_id, user_account_app_app_id, date_created)
				VALUES(:user_account_id,:user_setting_id, :app_id, CURRENT_TIMESTAMP) `;
	const parameters = {
					user_account_id: id,
					user_setting_id: id_like,
					app_id: app_id
				};
	return await db_execute(app_id, sql, parameters, null);
};
/**
 * 
 * @param {number} app_id 
 * @param {number} id 
 * @param {number} id_unlike 
 * @returns {Promise.<Types.db_result_user_account_app_setting_like_unlikeUserSetting>}
 */
const unlikeUserSetting = async (app_id, id, id_unlike) => {
	const sql = `DELETE FROM ${db_schema()}.user_account_app_setting_like
					WHERE user_account_app_user_account_id = :user_account_id
						AND user_account_app_setting_id = :user_setting_id 
						AND user_account_app_app_id = :app_id`;
	const parameters = {
					user_account_id: id,
					user_setting_id: id_unlike,
					app_id: app_id
					};
	return await db_execute(app_id, sql, parameters, null);
};
export{likeUserSetting, unlikeUserSetting};