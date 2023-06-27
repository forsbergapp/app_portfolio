const {db_execute, db_schema} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);

const createUserAccountApp = (app_id, user_account_id, callBack) => {
		const sql = `INSERT INTO ${db_schema()}.user_account_app(
							app_id, user_account_id, date_created)
						SELECT :app_id, ua.id, CURRENT_TIMESTAMP
						  FROM ${db_schema()}.user_account ua
						 WHERE ua.id = :user_account_id
						   AND NOT EXISTS (SELECT NULL
											 FROM ${db_schema()}.user_account_app uap
										    WHERE uap.app_id = :app_id
											  AND uap.user_account_id = ua.id)`;
		const parameters = {
						app_id: app_id,
						user_account_id: user_account_id
					};
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	};
const getUserAccountApps = (app_id, user_account_id, callBack) => {
		const sql = `SELECT uap.app_id "app_id",
							a.app_name "app_name",
							a.url "url",
							a.logo "logo",
							uap.date_created "date_created"
					   FROM ${db_schema()}.user_account_app uap,
							${db_schema()}.app a
					  WHERE a.id = uap.app_id
						AND uap.user_account_id = :user_account_id
						AND a.enabled = 1`;
		const parameters = {
						user_account_id: user_account_id
						};
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	};
const getUserAccountApp = (app_id, user_account_id, callBack) => {
		const sql = `SELECT preference_locale "preference_locale",
							setting_preference_timezone_id "setting_preference_timezone_id",
							setting_preference_direction_id "setting_preference_direction_id",
							setting_preference_arabic_script_id "setting_preference_arabic_script_id",
							date_created "date_created"
					   FROM ${db_schema()}.user_account_app
					  WHERE user_account_id = :user_account_id
						AND app_id = :app_id`;
		const parameters = {
						user_account_id: user_account_id,
						app_id: app_id
						};
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	};
const updateUserAccountApp = (app_id, user_account_id, data, callBack) => {
		if (data.setting_preference_direction_id=='')
			data.setting_preference_direction_id = null;
		if (data.setting_preference_arabic_script_id=='')
			data.setting_preference_arabic_script_id = null;
		const sql = `UPDATE ${db_schema()}.user_account_app
						SET preference_locale = :preference_locale,
							setting_preference_timezone_id = :setting_preference_timezone_id,
							setting_preference_direction_id = :setting_preference_direction_id,
							setting_preference_arabic_script_id = :setting_preference_arabic_script_id,
							date_created = CURRENT_TIMESTAMP
					  WHERE user_account_id = :user_account_id
						AND app_id = :app_id`;
		const parameters = {
						preference_locale: data.preference_locale,
						setting_preference_timezone_id: data.setting_preference_timezone_id,
						setting_preference_direction_id: data.setting_preference_direction_id,
						setting_preference_arabic_script_id: data.setting_preference_arabic_script_id,
						user_account_id: user_account_id,
						app_id: app_id
						};
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	};
const deleteUserAccountApps = (app_id, user_account_id, data_app_id, callBack) => {
		const sql = `DELETE FROM ${db_schema()}.user_account_app
					WHERE user_account_id = :user_account_id
					AND app_id = :app_id`;
		const parameters = {
						user_account_id: user_account_id,
						app_id: data_app_id
						};
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	};
export{createUserAccountApp, getUserAccountApps, getUserAccountApp, updateUserAccountApp, deleteUserAccountApps};