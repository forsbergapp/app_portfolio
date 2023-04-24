const { ConfigGet } = await import(`file://${process.cwd()}/server/server.service.js`);
const {execute_db_sql, get_schema_name} = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db/common/common.service.js`);

const likeUserSetting = (app_id, id, id_like, callBack) => {
		let sql;
		let parameters;
		sql = `INSERT INTO ${get_schema_name()}.user_account_app_setting_like(
					user_account_app_user_account_id, user_account_app_setting_id, user_account_app_app_id, date_created)
				VALUES(:user_account_id,:user_setting_id, :app_id, CURRENT_TIMESTAMP) `;
		parameters = {
						user_account_id: id,
						user_setting_id: id_like,
						app_id: app_id
					};
		let stack = new Error().stack;
		import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/common/common.service.js`).then(({COMMON}) => {
			execute_db_sql(app_id, sql, parameters, 
						COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result);
			});
		})
	}
const unlikeUserSetting = (app_id, id, id_unlike, callBack) => {
		let sql;
		let parameters;
		sql = `DELETE FROM ${get_schema_name()}.user_account_app_setting_like
				WHERE user_account_app_user_account_id = :user_account_id
				AND user_account_app_setting_id = :user_setting_id 
				AND user_account_app_app_id = :app_id`;
		parameters = {
						user_account_id: id,
						user_setting_id: id_unlike,
						app_id: app_id
						};
		let stack = new Error().stack;
		import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/common/common.service.js`).then(({COMMON}) => {						
			execute_db_sql(app_id, sql, parameters, 
						COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result);
			});
		})
	}
export{likeUserSetting, unlikeUserSetting};