const {execute_db_sql} = require ("../../common/database");
module.exports = {
	createUserAccountApp: (app_id, user_account_id, callBack) => {
		let sql;
		let parameters;
		if (process.env.SERVICE_DB_USE == 1) {
			sql = `INSERT INTO ${process.env.SERVICE_DB_DB1_NAME}.user_account_app(
								app_id, user_account_id, date_created)
					SELECT ?,?, SYSDATE()
					FROM DUAL
					WHERE NOT EXISTS (SELECT NULL
										FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account_app uap
										WHERE uap.app_id = ?
										AND uap.user_account_id = ?)`;
			parameters = [
							app_id,
							user_account_id,
							app_id,
							user_account_id
						 ];
		}else if (process.env.SERVICE_DB_USE==2){
			sql = `INSERT INTO ${process.env.SERVICE_DB_DB2_NAME}.user_account_app(
								app_id, user_account_id, date_created)
					SELECT :app_id, :user_account_id, SYSDATE
					FROM DUAL
					WHERE NOT EXISTS (SELECT NULL
										FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account_app uap
										WHERE uap.app_id = :app_id
										AND uap.user_account_id = :user_account_id)`;
			parameters = {
							app_id: app_id,
							user_account_id: user_account_id
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
	getUserAccountApps: (app_id, user_account_id, callBack) => {
		let sql;
		let parameters;
		if (process.env.SERVICE_DB_USE == 1) {
			sql = `SELECT 	uap.app_id,
							a.app_name,
							a.url,
							a.logo,
							uap.date_created
					FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account_app uap,
							${process.env.SERVICE_DB_DB1_NAME}.app a
					WHERE a.id = uap.app_id
						AND uap.user_account_id = ?
						AND a.enabled = 1`;
			parameters = [
							user_account_id
						 ];
		}else if (process.env.SERVICE_DB_USE==2){
			sql = `SELECT 	uap.app_id "app_id",
							a.app_name "app_name",
							a.url "url",
							a.logo "logo",
							uap.date_created "date_created"
					FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account_app uap,
							${process.env.SERVICE_DB_DB2_NAME}.app a
					WHERE a.id = uap.app_id
						AND uap.user_account_id = :user_account_id
						AND a.enabled = 1`;
			parameters = {
							user_account_id: user_account_id
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
	getUserAccountApp: (app_id, user_account_id, callBack) => {
		let sql;
		let parameters;
		if (process.env.SERVICE_DB_USE == 1) {
			sql = `SELECT preference_locale,
						  regional_setting_preference_timezone_id,
						  regional_setting_preference_direction_id,
						  regional_setting_preference_arabic_script_id,
						  date_created
					 FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account_app
					WHERE user_account_id = ?
					  AND app_id = ?`;
			parameters = [
							user_account_id,
							app_id
						 ];
		}else if (process.env.SERVICE_DB_USE==2){
			sql = `SELECT preference_locale "preference_locale",
						  regional_setting_preference_timezone_id "regional_setting_preference_timezone_id",
  						  regional_setting_preference_direction_id "regional_setting_preference_direction_id",
						  regional_setting_preference_arabic_script_id "regional_setting_preference_arabic_script_id",
						  date_created "date_created"
					 FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account_app
					WHERE user_account_id = :user_account_id
					  AND app_id = :app_id`;
			parameters = {
							user_account_id: user_account_id,
							app_id: app_id
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
	updateUserAccountApp: (app_id, user_account_id, data, callBack) => {
		let sql;
		let parameters;
		if (data.regional_setting_preference_direction_id=='')
			data.regional_setting_preference_direction_id = null;
		if (data.regional_setting_preference_arabic_script_id=='')
			data.regional_setting_preference_arabic_script_id = null;
		if (process.env.SERVICE_DB_USE == 1) {
			sql = `UPDATE ${process.env.SERVICE_DB_DB1_NAME}.user_account_app
					  SET preference_locale = ?,
					  	  regional_setting_preference_timezone_id = ?,
						  regional_setting_preference_direction_id = ?,
						  regional_setting_preference_arabic_script_id = ?,
						  date_created = SYSDATE()
					WHERE user_account_id = ?
					  AND app_id = ?`;
			parameters = [
							data.preference_locale,
							data.regional_setting_preference_timezone_id,
							data.regional_setting_preference_direction_id,
							data.regional_setting_preference_arabic_script_id,
							user_account_id,
							app_id
						 ];
		}else if (process.env.SERVICE_DB_USE==2){
			sql = `UPDATE ${process.env.SERVICE_DB_DB2_NAME}.user_account_app
					  SET preference_locale = :preference_locale,
						  regional_setting_preference_timezone_id = :regional_setting_preference_timezone_id,
						  regional_setting_preference_direction_id = :regional_setting_preference_direction_id,
						  regional_setting_preference_arabic_script_id = :regional_setting_preference_arabic_script_id,
						  date_created = SYSDATE
					WHERE user_account_id = :user_account_id
						AND app_id = :app_id`;
			parameters = {
							preference_locale: data.preference_locale,
							preference_timezone: data.regional_setting_preference_timezone_id,
							preference_direction: data.regional_setting_preference_direction_id,
							preference_arabic_script: data.regional_setting_preference_arabic_script_id,
							user_account_id: user_account_id,
							app_id: app_id
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
	deleteUserAccountApps: (app_id_app, user_account_id, app_id, callBack) => {
		let sql;
		let parameters;
		if (process.env.SERVICE_DB_USE == 1) {
			sql = `DELETE FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account_app
					WHERE user_account_id = ?
					AND app_id = ?`;
			parametes = [
						user_account_id,
						app_id
						];
		}else if (process.env.SERVICE_DB_USE==2){
			sql = `DELETE FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account_app
					WHERE user_account_id = :user_account_id
					AND app_id = :app_id`;
			parameters = {
							user_account_id: user_account_id,
							app_id: app_id
						 };
		}
		execute_db_sql(app_id, app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	}
};