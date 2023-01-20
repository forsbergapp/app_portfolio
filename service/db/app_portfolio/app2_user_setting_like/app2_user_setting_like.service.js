const {execute_db_sql, get_schema_name} = await import(`file://${process.cwd()}/service/db/common/common.service.js`);

function likeUserSetting(app_id, id, id_like, callBack){
		let sql;
		let parameters;
		sql = `INSERT INTO ${get_schema_name()}.app2_user_setting_like(
							user_account_id, app2_user_setting_id, date_created)
				VALUES(:user_account_id,:app2_user_setting_id, CURRENT_TIMESTAMP) `;
		parameters = {
						user_account_id: id,
						app2_user_setting_id: id_like
					};
		let stack = new Error().stack;
		import(`file://${process.cwd()}/service/common/common.service.js`).then(function({COMMON}){
			execute_db_sql(app_id, sql, parameters, 
						COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result);
			});
		})
	}
function unlikeUserSetting(app_id, id, id_unlike, callBack){
		let sql;
		let parameters;
		sql = `DELETE FROM ${get_schema_name()}.app2_user_setting_like
				WHERE user_account_id = :user_account_id
				AND app2_user_setting_id = :app2_user_setting_id `;
		parameters = {
						user_account_id: id,
						app2_user_setting_id: id_unlike
						};
		let stack = new Error().stack;
		import(`file://${process.cwd()}/service/common/common.service.js`).then(function({COMMON}){						
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