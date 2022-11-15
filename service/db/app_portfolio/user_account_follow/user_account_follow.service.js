const {execute_db_sql, get_schema_name} = require ("../../common/common.service");
module.exports = {
	followUser: (app_id, id, id_follow, callBack) => {
		let sql;
		let parameters;
		sql = `INSERT INTO ${get_schema_name()}.user_account_follow(
							user_account_id, user_account_id_follow, date_created)
				VALUES(:user_account_id,:user_account_id_follow, CURRENT_TIMESTAMP)`;
		parameters = {
						user_account_id: id,
						user_account_id_follow: id_follow
						};
		execute_db_sql(app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	},
	unfollowUser: (app_id, id, id_unfollow, callBack) => {
		let sql;
		let parameters;
		sql = `DELETE FROM ${get_schema_name()}.user_account_follow
				WHERE user_account_id = :user_account_id
				  AND user_account_id_follow = :user_account_id_follow`;
		parameters = {
						user_account_id: id,
						user_account_id_follow: id_unfollow
						};
		execute_db_sql(app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	},
};