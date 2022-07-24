const {execute_db_sql} = require ("../../config/database");
module.exports = {
	likeUserSetting: (app_id, id, id_like, callBack) => {
		let sql;
		let parameters;
		if (process.env.SERVICE_DB_USE == 1) {
			sql = `INSERT INTO ${process.env.SERVICE_DB_DB1_NAME}.app1_user_setting_like(
								user_account_id, app1_user_setting_id, date_created)
					VALUES(?,?, SYSDATE()) `;
			parameters = [id,
						  id_like
						 ];
		}else if (process.env.SERVICE_DB_USE==2){
			sql = `INSERT INTO ${process.env.SERVICE_DB_DB2_NAME}.app1_user_setting_like(
								user_account_id, app1_user_setting_id, date_created)
					VALUES(:user_account_id,:app1_user_setting_id, SYSDATE) `;
			parameters = {
							user_account_id: id,
							app1_user_setting_id: id_like
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
	unlikeUserSetting: (app_id, id, id_unlike, callBack) => {
		let sql;
		let parameters;
		if (process.env.SERVICE_DB_USE == 1) {
			sql = `DELETE FROM ${process.env.SERVICE_DB_DB1_NAME}.app1_user_setting_like
					WHERE user_account_id = ?
					AND app1_user_setting_id = ? `;
			parameters = [
							id,
							id_unlike
							];
		}else if (process.env.SERVICE_DB_USE==2){
			sql = `DELETE FROM ${process.env.SERVICE_DB_DB2_NAME}.app1_user_setting_like
					WHERE user_account_id = :user_account_id
					AND app1_user_setting_id = :app1_user_setting_id `;
			parameters = {
							user_account_id: id,
							app1_user_setting_id: id_unlike
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