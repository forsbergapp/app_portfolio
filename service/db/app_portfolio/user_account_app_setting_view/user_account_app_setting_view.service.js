const { ConfigGet } = await import(`file://${process.cwd()}/server/server.service.js`);
const {execute_db_sql, get_schema_name} = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db/common/common.service.js`);

const insertUserSettingView = (app_id, data, callBack) => {
		let sql;
		let parameters;
		sql = `INSERT INTO ${get_schema_name()}.user_account_app_setting_view(
							client_ip,
							client_user_agent,
							client_longitude, 
							client_latitude, 
							date_created,
							user_account_app_user_account_id,
							user_account_app_setting_id,
							user_account_app_app_id)
				VALUES( :client_ip,
						:client_user_agent,
						:client_longitude,
						:client_latitude,
						CURRENT_TIMESTAMP,
						:user_account_id,
						:user_setting_id,
						:app_id) `;
		parameters = {
						client_ip: data.client_ip,
						client_user_agent: data.client_user_agent,
						client_longitude: data.client_longitude,
						client_latitude: data.client_latitude,
						user_account_id: data.user_account_id,
						user_setting_id: data.user_setting_id,
						app_id: app_id
					};
		let stack = new Error().stack;
		import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
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