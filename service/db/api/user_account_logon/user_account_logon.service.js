const {execute_db_sql} = require ("../../config/database");
module.exports = {
	insertUserAccountLogon: (data, callBack) => {
		let sql;
		let parameters;
		if (process.env.SERVICE_DB_USE == 1) {
			sql = `INSERT INTO ${process.env.SERVICE_DB_DB1_NAME}.user_account_logon(
								user_account_id, app_id, result, client_ip, client_user_agent, client_longitude, client_latitude, date_created)
					VALUES(?,?,?,?,?,?,?, SYSDATE()) `;
			parameters = [
							data.user_account_id,
							data.app_id,
							data.result,
							data.client_ip,
							data.client_user_agent,
							data.client_longitude,
							data.client_latitude
						 ];
		}else if (process.env.SERVICE_DB_USE==2){
			sql = `INSERT INTO ${process.env.SERVICE_DB_DB2_NAME}.user_account_logon(
					user_account_id, app_id, result, client_ip,  client_user_agent,  client_longitude, client_latitude, date_created)
					VALUES(:user_account_id, :app_id, :result_insert,:client_ip,:client_user_agent, :client_longitude, :client_latitude, SYSDATE) `;
			parameters = {
							user_account_id: data.user_account_id,
							app_id: data.app_id,
							result_insert: data.result,
							client_ip: data.client_ip,
							client_user_agent: data.client_user_agent,
							client_longitude:  data.client_longitude,
							client_latitude:  data.client_latitude
						};
		}
		execute_db_sql(data.app_id, data.app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	}
};