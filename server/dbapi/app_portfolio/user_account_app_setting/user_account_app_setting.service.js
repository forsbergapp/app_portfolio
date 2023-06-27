const {db_execute, db_schema, db_limit_rows} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);

const createUserSetting = (app_id, initial, data, callBack) => {
		let sql;
		let parameters;
		//insert user settings if first time and no user settings exists already
		sql = `INSERT INTO ${db_schema()}.user_account_app_setting(
				description, 
				settings_json,
				date_created,
				date_modified,
				user_account_app_user_account_id,
				user_account_app_app_id
				)
				SELECT  :description,
					    :settings_json,
						CURRENT_TIMESTAMP,
						CURRENT_TIMESTAMP,
						:user_account_id,
						:app_id
				FROM ${db_schema()}.user_account ua
				WHERE ua.id = :user_account_id
				AND NOT EXISTS (SELECT null
									FROM ${db_schema()}.user_account_app_setting aus2
									WHERE aus2.user_account_app_user_account_id = ua.id
									AND aus2.user_account_app_app_id = :app_id
									AND :initial_setting = 1)`;
		import(`file://${process.cwd()}/server/server.service.js`).then(({ConfigGet}) => {
			if (ConfigGet(1, 'SERVICE_DB', 'USE')=='3')
				sql = sql + ' RETURNING id';
			parameters = {
							description: data.description,
							settings_json: JSON.stringify(data.settings_json),
							user_account_id: data.user_account_id,
							app_id: app_id,
							initial_setting: initial
						};
			db_execute(app_id, sql, parameters, null, (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					switch (ConfigGet(1, 'SERVICE_DB', 'USE')){
						case '1':
						case '2':
						case '3':{
							return callBack(null, result);
							break;
						}
						case '4':{
							if (initial==1){
								//user logged in and if user setting is created or not
								//not used here
								return callBack(null, result);
							}									
							else{
								//Fetch id from rowid returned from Oracle
								//sample output:
								//{"lastRowid":"AAAWwdAAAAAAAdHAAC","rowsAffected":1}
								//remove "" before and after
								const lastRowid = JSON.stringify(result.lastRowid).replace(/"/g,'');
								sql = `SELECT id "insertId"
										FROM ${db_schema()}.user_account_app_setting
										WHERE rowid = :lastRowid`;
								parameters = {
												lastRowid: lastRowid
											};
								db_execute(app_id, sql, parameters, null, (err, result_id2)=>{
									if (err)
										return callBack(err, null);
									else
										return callBack(null, result_id2[0]);
								});
							}
							break;
						}
					}
			});
		});
	};
const getUserSetting = (app_id, id, callBack) => {
		const sql = `SELECT	id "id",
							description "description",
							settings_json "settings_json",
							date_created "date_created",
							date_modified "date_modified",
							user_account_app_user_account_id "user_account_app_user_account_id",
							user_account_app_app_id "user_account_app_app_id"
					   FROM ${db_schema()}.user_account_app_setting 
					  WHERE id = :id `;
		const parameters = {id: id};
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	};
const getUserSettingsByUserId = (app_id, id, callBack) => {
		const sql = `SELECT	id "id",
						description "description",
						settings_json "settings_json",
						date_created "date_created",
						date_modified "date_modified",
						user_account_app_user_account_id "user_account_app_user_account_id",
						user_account_app_app_id "app_id"
				 FROM ${db_schema()}.user_account_app_setting
				WHERE user_account_app_user_account_id = :user_account_id 
				  AND user_account_app_app_id = :app_id`;
		const parameters = {
						user_account_id: id,
						app_id: app_id
					};
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	};
const getProfileUserSetting = (app_id, id, callBack) => {
		const sql = `SELECT (SELECT COUNT(DISTINCT us.user_account_app_user_account_id)
						 FROM ${db_schema()}.user_account_app_setting_like u_like,
						   	  ${db_schema()}.user_account_app_setting us
						WHERE u_like.user_account_app_user_account_id = u.id
						  AND u_like.user_account_app_app_id = :app_id
						  AND us.id = u_like.user_account_app_setting_id
						  AND us.user_account_app_app_id = u_like.user_account_app_app_id)		"count_user_setting_likes",
					  (SELECT COUNT(DISTINCT u_like.user_account_app_user_account_id)
					     FROM ${db_schema()}.user_account_app_setting_like u_like,
							  ${db_schema()}.user_account_app_setting us
						WHERE us.user_account_app_user_account_id = u.id
						  AND us.user_account_app_app_id = :app_id
						  AND u_like.user_account_app_setting_id = us.id
						  AND u_like.user_account_app_app_id = us.user_account_app_app_id)		"count_user_setting_liked"
				 FROM ${db_schema()}.user_account u
				WHERE u.id = :id`;
		const parameters ={
						id: id,
						app_id: app_id
					}; 
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result[0]);
		});
    };
const getProfileUserSettings = (app_id, id, id_current_user, callBack) => {
		if (id_current_user=='')
			id_current_user = null;
		const sql = `SELECT us.id "id",
					  us.description "description",
					  us.user_account_app_user_account_id "user_account_app_user_account_id",
					  (SELECT COUNT(u_like.id)
						 FROM ${db_schema()}.user_account_app_setting_like u_like
						WHERE u_like.user_account_app_setting_id = us.id
						 AND  u_like.user_account_app_app_id = us.user_account_app_app_id)					"count_likes",
					  (SELECT COUNT(u_view.user_account_app_setting_id)
						 FROM ${db_schema()}.user_account_app_setting_view u_view
						WHERE u_view.user_account_app_setting_id = us.id
						 AND  u_view.user_account_app_app_id = us.user_account_app_app_id)					"count_views",
					  (SELECT COUNT(u_liked_current_user.id)
						 FROM ${db_schema()}.user_account_app_setting_like u_liked_current_user
						WHERE u_liked_current_user.user_account_app_user_account_id = :Xuser_Xaccount_id_current
						  AND u_liked_current_user.user_account_app_setting_id = us.id
						  AND u_liked_current_user.user_account_app_app_id = us.user_account_app_app_id) 	"liked"
				 FROM ${db_schema()}.user_account_app_setting us
				WHERE us.user_account_app_user_account_id = :user_account_id
				  AND us.user_account_app_app_id = :app_id `;
		const parameters = {
						Xuser_Xaccount_id_current: id_current_user,
						user_account_id: id,
						app_id: app_id
						};
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	};
const getProfileUserSettingDetail = (app_id, id, detailchoice, callBack) => {
		let sql;
		sql = `SELECT detail "detail", 
					  id "id", 
					  identity_provider_id "identity_provider_id", 
					  provider_id "provider_id", 
					  avatar "avatar",
					  provider_image "provider_image",
					  provider_image_url "provider_image_url",
					  username "username",
					  provider_first_name "provider_first_name"
				FROM (SELECT 'LIKE_SETTING' detail,
							 u.id,
							 u.identity_provider_id,
							 u.provider_id,
							 u.avatar,
							 u.provider_image,
							 u.provider_image_url,
							 u.username,
							 u.provider_first_name
						FROM ${db_schema()}.user_account u
					   WHERE u.id IN (SELECT us.user_account_app_user_account_id
										FROM ${db_schema()}.user_account_app_setting_like u_like,
											 ${db_schema()}.user_account_app_setting us
									   WHERE u_like.user_account_app_user_account_id = :user_account_id
									     AND u_like.user_account_app_app_id = :app_id
										 AND us.user_account_app_app_id = u_like.user_account_app_app_id
										 AND us.id = u_like.user_account_app_setting_id)
						 AND    u.active = 1
						 AND    6 = :detailchoice
						UNION ALL
						SELECT 'LIKED_SETTING' detail,
								u.id,
								u.identity_provider_id,
								u.provider_id,
								u.avatar,
								u.provider_image,
								u.provider_image_url,
								u.username,
								u.provider_first_name
						  FROM  ${db_schema()}.user_account u
						 WHERE  u.id IN (SELECT u_like.user_account_app_user_account_id
										   FROM ${db_schema()}.user_account_app_setting us,
												${db_schema()}.user_account_app_setting_like u_like
										  WHERE us.user_account_app_user_account_id = :user_account_id
											AND us.user_account_app_app_id = :app_id
											AND us.id = u_like.user_account_app_setting_id
											AND u_like.user_account_app_app_id = us.user_account_app_app_id)
						   AND  u.active = 1
						   AND  7 = :detailchoice) t
					ORDER BY 1, COALESCE(username, provider_first_name) `;
		sql = db_limit_rows(sql,1);
		const parameters = {
						user_account_id: id,
						app_id: app_id,
						detailchoice: detailchoice
					};
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
    };
const getProfileTopSetting = (app_id, statchoice, callBack) => {
		let sql;
		sql = `SELECT top "top", 
					  id "id", 
					  identity_provider_id "identity_provider_id", 
					  provider_id "provider_id", 
					  avatar "avatar",
					  provider_image "provider_image",
					  provider_image_url "provider_image_url",
					  username "username",
					  provider_first_name "provider_first_name",
					  count "count"
				FROM (	SELECT 'LIKE_SETTING' top,
								u.id,
								u.identity_provider_id,
								u.provider_id,
								u.avatar,
								u.provider_image,
								u.provider_image_url,
								u.username,
								u.provider_first_name,
								(SELECT COUNT(us.user_account_app_user_account_id)
								   FROM ${db_schema()}.user_account_app_setting_like u_like,
										${db_schema()}.user_account_app_setting us
								  WHERE us.user_account_app_user_account_id = u.id
									AND us.user_account_app_app_id = :app_id
									AND u_like.user_account_app_setting_id = us.id
									AND u_like.user_account_app_app_id = us.user_account_app_app_id) count
						  FROM  ${db_schema()}.user_account u
						 WHERE  u.active = 1
						   AND  u.private <> 1
						   AND  4 = :statchoice
						UNION ALL
						SELECT 'VISITED_SETTING' top,
								u.id,
								u.identity_provider_id,
								u.provider_id,
								u.avatar,
								u.provider_image,
								u.provider_image_url,
								u.username,
								u.provider_first_name,
								(SELECT COUNT(us.user_account_app_user_account_id)
								   FROM ${db_schema()}.user_account_app_setting_view u_view,
										${db_schema()}.user_account_app_setting us
								  WHERE us.user_account_app_user_account_id = u.id
									AND us.user_account_app_app_id = :app_id
									AND u_view.user_account_app_setting_id = us.id
									AND u_view.user_account_app_app_id = us.user_account_app_app_id) count
						  FROM  ${db_schema()}.user_account u
						 WHERE  u.active = 1
						   AND  u.private <> 1
						   AND  5 = :statchoice) t
				ORDER BY 1,10 DESC, COALESCE(username, provider_first_name) `;
		sql = db_limit_rows(sql,2);
		const parameters = {
						app_id: app_id,
						statchoice: statchoice,
					};
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
    };
const updateUserSetting = (app_id, data, id, callBack) => {
		const sql = `UPDATE ${db_schema()}.user_account_app_setting
						SET description = :description,
							settings_json = :settings_json,
							user_account_app_user_account_id = :user_account_id,
							user_account_app_app_id = :app_id,
							date_modified = CURRENT_TIMESTAMP
					  WHERE id = :id `;
		const parameters = {
						description: data.description,
						settings_json: JSON.stringify(data.settings_json),
						user_account_id: data.user_account_id,
						app_id: app_id,
						id: id
					};
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	};
const deleteUserSetting = (app_id, id, callBack) => {
		const sql = `DELETE FROM ${db_schema()}.user_account_app_setting
					WHERE id = :id `;
		const parameters = {
						id: id
						};
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	};
export{	createUserSetting, getUserSetting, getUserSettingsByUserId, getProfileUserSetting, getProfileUserSettings, 
		getProfileUserSettingDetail, getProfileTopSetting, updateUserSetting, deleteUserSetting};