const {db_execute, db_schema} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);

const followUser = (app_id, id, id_follow, callBack) => {
		let sql;
		let parameters;
		sql = `INSERT INTO ${db_schema()}.user_account_follow(
							user_account_id, user_account_id_follow, date_created)
				VALUES(:user_account_id,:user_account_id_follow, CURRENT_TIMESTAMP)`;
		parameters = {
						user_account_id: id,
						user_account_id_follow: id_follow
						};
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	}
const unfollowUser = (app_id, id, id_unfollow, callBack) => {
		let sql;
		let parameters;
		sql = `DELETE FROM ${db_schema()}.user_account_follow
				WHERE user_account_id = :user_account_id
				  AND user_account_id_follow = :user_account_id_follow`;
		parameters = {
						user_account_id: id,
						user_account_id_follow: id_unfollow
						};
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	}
export{followUser, unfollowUser};