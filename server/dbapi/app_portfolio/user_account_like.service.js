/** @module server/dbapi/app_portfolio/user_account_like */

/**@type{import('../../dbapi/common/common.service.js')} */
const {db_execute, db_schema} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);
/**
 * 
 * @param {number} app_id 
 * @param {number} id 
 * @param {number} id_like 
 * @returns {Promise.<import('../../../types.js').db_result_user_account_like_like>}
 */
const like = async (app_id, id, id_like) => {
	const sql = `INSERT INTO ${db_schema()}.user_account_like(
						user_account_id, user_account_id_like, date_created)
				VALUES(:user_account_id,:user_account_id_like, CURRENT_TIMESTAMP) `;
	const parameters = {
					user_account_id: id,
					user_account_id_like: id_like
					};
	return await db_execute(app_id, sql, parameters, null);
};
/**
 * 
 * @param {number} app_id 
 * @param {number} id 
 * @param {number} id_unlike 
 * @returns {Promise.<import('../../../types.js').db_result_user_account_like_unlike>}
 */
const unlike = async (app_id, id, id_unlike) => {
	const sql = `DELETE FROM ${db_schema()}.user_account_like
					WHERE user_account_id = :user_account_id
					  AND user_account_id_like = :user_account_id_like `;
	const parameters = {
					user_account_id: id,
					user_account_id_like: id_unlike
					};
	return await db_execute(app_id, sql, parameters, null);
};
export{like, unlike};