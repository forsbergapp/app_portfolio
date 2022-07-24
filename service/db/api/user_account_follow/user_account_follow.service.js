const {execute_db_sql} = require ("../../config/database");
module.exports = {
	followUser: (app_id, id, id_follow, callBack) => {
		let sql;
		let parameters;
		if (process.env.SERVICE_DB_USE == 1) {
			sql = `INSERT INTO ${process.env.SERVICE_DB_DB1_NAME}.user_account_follow(
								user_account_id, user_account_id_follow, date_created)
					VALUES(?,?, SYSDATE()) `;
			parameters = [
						  id,
						  id_follow
						 ];
		}else if (process.env.SERVICE_DB_USE==2){
			sql = `INSERT INTO ${process.env.SERVICE_DB_DB2_NAME}.user_account_follow(
								user_account_id, user_account_id_follow, date_created)
					VALUES(:user_account_id,:user_account_id_follow, SYSDATE)`;
			parameters = {
							user_account_id: id,
							user_account_id_follow: id_follow
						 };
		}
		execute_db_sql(app_id, app_id, sql, parameters, null, 
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
		if (process.env.SERVICE_DB_USE == 1) {
			sql = `DELETE FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account_follow
					WHERE  user_account_id = ?
					AND    user_account_id_follow = ? `;
			parameters = [
							id,
							id_unfollow
						 ];
		}else if (process.env.SERVICE_DB_USE==2){
			sql = `DELETE FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account_follow
					WHERE  user_account_id = :user_account_id
					AND    user_account_id_follow = :user_account_id_follow`;
			parameters = {
							user_account_id: id,
							user_account_id_follow: id_unfollow
						 };
		}
		execute_db_sql(app_id, app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	},
};