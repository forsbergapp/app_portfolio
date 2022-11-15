const {execute_db_sql, get_schema_name} = require ("../../common/common.service");
module.exports = {
	checkLogin: (app_id, user_account_id, access_token, client_ip, callBack)=>{
		let sql;
		let parameters;
		sql = `SELECT 1
				 FROM ${get_schema_name()}.user_account_logon
				WHERE user_account_id = :user_account_id
				  AND app_id = :app_id
				  AND access_token = :access_token
				  AND client_ip = :client_ip`;
		parameters = {
						user_account_id: user_account_id,
						app_id: app_id,
						access_token: access_token,
						client_ip: client_ip
					};
		execute_db_sql(app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	},
	
	insertUserAccountLogon: (app_id, data, callBack) => {
		let sql;
		let parameters;
		data.access_token = data.access_token ?? null;
		sql = `INSERT INTO ${get_schema_name()}.user_account_logon(
				user_account_id, app_id, result, access_token, client_ip,  client_user_agent,  client_longitude, client_latitude, date_created)
				VALUES(:user_account_id, :app_id, :result_insert,:access_token,:client_ip,:client_user_agent, :client_longitude, :client_latitude, CURRENT_TIMESTAMP) `;
		parameters = {
						user_account_id: data.user_account_id,
						app_id: data.app_id,
						result_insert: data.result,
						access_token: data.access_token,
						client_ip: data.client_ip,
						client_user_agent: data.client_user_agent,
						client_longitude:  data.client_longitude,
						client_latitude:  data.client_latitude
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