const {execute_db_sql} = require ("../../common/database");
module.exports = {
	likeUser: (app_id, id, id_like, callBack) => {
		let sql;
		let parameters;
		if (process.env.SERVICE_DB_USE == 1) {
			sql = `INSERT INTO ${process.env.SERVICE_DB_DB1_NAME}.user_account_like(
								user_account_id, user_account_id_like, date_created)
					VALUES(?,?, SYSDATE()) `;
			parameters = [
						  id,
						  id_like
						 ];
		}else if (process.env.SERVICE_DB_USE==2){
			sql = `INSERT INTO ${process.env.SERVICE_DB_DB2_NAME}.user_account_like(
								user_account_id, user_account_id_like, date_created)
					VALUES(:user_account_id,:user_account_id_like, SYSDATE) `;
			parameters = {
							user_account_id: id,
							user_account_id_like: id_like
						 };
		}
		execute_db_sql(app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	},
	unlikeUser: (app_id, id, id_unlike, callBack) => {
		let sql;
		let parameters;
		if (process.env.SERVICE_DB_USE == 1) {
			sql = `DELETE FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account_like
					WHERE  user_account_id = ?
					AND    user_account_id_like = ? `;
			parameters = [
							id,
							id_unlike
						];
		}else if (process.env.SERVICE_DB_USE==2){
			sql = `DELETE FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account_like
					WHERE  user_account_id = :user_account_id
					AND    user_account_id_like = :user_account_id_like `;
			parameters = {
							user_account_id: id,
							user_account_id_like: id_unlike
						 };
		}
		execute_db_sql(app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	},
};