const {db_execute, db_schema} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);

const likeUser = (app_id, id, id_like, callBack) => {
	const sql = `INSERT INTO ${db_schema()}.user_account_like(
						user_account_id, user_account_id_like, date_created)
				VALUES(:user_account_id,:user_account_id_like, CURRENT_TIMESTAMP) `;
	const parameters = {
					user_account_id: id,
					user_account_id_like: id_like
					};
	db_execute(app_id, sql, parameters, null, (err, result)=>{
		if (err)
			return callBack(err, null);
		else
			return callBack(null, result);
	});
};
const unlikeUser = (app_id, id, id_unlike, callBack) => {
	const sql = `DELETE FROM ${db_schema()}.user_account_like
					WHERE user_account_id = :user_account_id
					  AND user_account_id_like = :user_account_id_like `;
	const parameters = {
					user_account_id: id,
					user_account_id_like: id_unlike
					};
	db_execute(app_id, sql, parameters, null, (err, result)=>{
		if (err)
			return callBack(err, null);
		else
			return callBack(null, result);
	});
	};
export{likeUser, unlikeUser};