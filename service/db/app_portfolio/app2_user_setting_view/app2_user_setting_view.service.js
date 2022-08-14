const {execute_db_sql} = require ("../../common/database");
module.exports = {
	insertUserSettingView: (app_id, data, callBack) => {
		let sql;
		let parameters;
		if (process.env.SERVICE_DB_USE == 1) {
			sql = `INSERT INTO ${process.env.SERVICE_DB_DB1_NAME}.app2_user_setting_view(
								user_account_id,
								app2_user_setting_id,
								client_ip,
								client_user_agent,
								client_longitude,
								client_latitude,
								date_created)
					VALUES(?,?,?,?,?,?, SYSDATE()) `;
			parameters = [	data.user_account_id,
							data.app2_user_setting_id,
							data.client_ip,
							data.client_user_agent,
							data.client_longitude,
							data.client_latitude];
		}else if (process.env.SERVICE_DB_USE==2){
			sql = `INSERT INTO ${process.env.SERVICE_DB_DB2_NAME}.app2_user_setting_view(
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
							SYSDATE) `;
			parameters = {
							user_account_id: data.user_account_id,
							app2_user_setting_id: data.app2_user_setting_id,
							client_ip: data.client_ip,
							client_user_agent: data.client_user_agent,
							client_longitude: data.client_longitude,
							client_latitude: data.client_latitude
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