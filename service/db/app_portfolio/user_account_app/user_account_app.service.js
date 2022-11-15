const {execute_db_sql, get_schema_name} = require ("../../common/common.service");
module.exports = {
	createUserAccountApp: (app_id, user_account_id, callBack) => {
		let sql;
		let parameters;
		sql = `INSERT INTO ${get_schema_name()}.user_account_app(
							app_id, user_account_id, date_created)
			   SELECT :app_id, :user_account_id, CURRENT_TIMESTAMP
				 FROM DUAL
				WHERE NOT EXISTS (SELECT NULL
									FROM ${get_schema_name()}.user_account_app uap
								   WHERE uap.app_id = :app_id
									 AND uap.user_account_id = :user_account_id)`;
		parameters = {
						app_id: app_id,
						user_account_id: user_account_id
					};
		execute_db_sql(app_id, sql, parameters, null, 
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
		sql = `SELECT uap.app_id "app_id",
					  a.app_name "app_name",
					  a.url "url",
					  a.logo "logo",
					  uap.date_created "date_created"
				 FROM ${get_schema_name()}.user_account_app uap,
					  ${get_schema_name()}.app a
				WHERE a.id = uap.app_id
				  AND uap.user_account_id = :user_account_id
				  AND a.enabled = 1`;
		parameters = {
						user_account_id: user_account_id
						};
		execute_db_sql(app_id, sql, parameters, null, 
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
		sql = `SELECT preference_locale "preference_locale",
					  setting_preference_timezone_id "setting_preference_timezone_id",
					  setting_preference_direction_id "setting_preference_direction_id",
					  setting_preference_arabic_script_id "setting_preference_arabic_script_id",
					  date_created "date_created"
				 FROM ${get_schema_name()}.user_account_app
				WHERE user_account_id = :user_account_id
				  AND app_id = :app_id`;
		parameters = {
						user_account_id: user_account_id,
						app_id: app_id
					 };
		execute_db_sql(app_id, sql, parameters, null, 
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
		if (data.setting_preference_direction_id=='')
			data.setting_preference_direction_id = null;
		if (data.setting_preference_arabic_script_id=='')
			data.setting_preference_arabic_script_id = null;
		sql = `UPDATE ${get_schema_name()}.user_account_app
				  SET preference_locale = :preference_locale,
				  	  setting_preference_timezone_id = :setting_preference_timezone_id,
					  setting_preference_direction_id = :setting_preference_direction_id,
					  setting_preference_arabic_script_id = :setting_preference_arabic_script_id,
					  date_created = CURRENT_TIMESTAMP
				WHERE user_account_id = :user_account_id
				  AND app_id = :app_id`;
		parameters = {
						preference_locale: data.preference_locale,
						setting_preference_timezone_id: data.setting_preference_timezone_id,
						setting_preference_direction_id: data.setting_preference_direction_id,
						setting_preference_arabic_script_id: data.setting_preference_arabic_script_id,
						user_account_id: user_account_id,
						app_id: app_id
						};
		execute_db_sql(app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	},
	deleteUserAccountApps: (app_id, user_account_id, data_app_id, callBack) => {
		let sql;
		let parameters;
		sql = `DELETE FROM ${get_schema_name()}.user_account_app
				WHERE user_account_id = :user_account_id
				  AND app_id = :app_id`;
		parameters = {
						user_account_id: user_account_id,
						app_id: data_app_id
						};
		execute_db_sql(app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	}
};