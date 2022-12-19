const {execute_db_sql, get_schema_name} = require (global.SERVER_ROOT + "/service/db/common/common.service");
module.exports = {
	insertUserSettingView: (app_id, data, callBack) => {
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
		execute_db_sql(app_id, sql, parameters, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	}
};