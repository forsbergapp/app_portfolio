const {execute_db_sql, get_schema_name} = await import(`file://${process.cwd()}/service/db/common/common.service.js`);

const insertUserSettingView = (app_id, data, callBack) => {
		let sql;
		let parameters;
		sql = `INSERT INTO ${get_schema_name()}.app2_user_setting_view(
							user_account_id,
							app2_user_setting_id,
							client_ip,
							client_user_agent,
							client_longitude, 
							client_latitude, 
							date_created)
				VALUES( :user_account_id,
						:app2_user_setting_id,
						:client_ip,
						:client_user_agent,
						:client_longitude,
						:client_latitude,
						CURRENT_TIMESTAMP) `;
		parameters = {
						user_account_id: data.user_account_id,
						app2_user_setting_id: data.app2_user_setting_id,
						client_ip: data.client_ip,
						client_user_agent: data.client_user_agent,
						client_longitude: data.client_longitude,
						client_latitude: data.client_latitude
						};
		let stack = new Error().stack;
		import(`file://${process.cwd()}/service/common/common.service.js`).then(({COMMON}) => {
			execute_db_sql(app_id, sql, parameters, 
						COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result);
			});
		})
	}
export{insertUserSettingView};