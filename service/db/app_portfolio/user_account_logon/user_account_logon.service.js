const {ConfigGet} = require(global.SERVER_ROOT + '/server/server.service');
const {execute_db_sql, get_schema_name} = require (global.SERVER_ROOT + "/service/db/common/common.service");
module.exports = {
	getUserAccountLogonAdmin:(app_id, user_account_id, app_id_select, callBack)=>{
		let sql;
		let parameters;
		if(typeof app_id_select=='undefined' ||app_id_select == '\'\'')
			app_id_select = null;
		sql = `SELECT user_account_id "user_account_id",
		              app_id "app_id",
					  result "result",
					  access_token "access_token",
					  client_ip "client_ip",
					  client_user_agent "client_user_agent",
					  client_longitude "client_longitude",
					  client_latitude "client_latitude",
					  date_created "date_created"
				 FROM ${get_schema_name()}.user_account_logon
				WHERE user_account_id = :user_account_id
				  AND app_id = COALESCE(:app_id_select,app_id)
				ORDER BY 9 DESC`;
		parameters = {
						user_account_id: user_account_id,
						app_id_select: app_id_select
					};
		execute_db_sql(app_id, sql, parameters, 
						__appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	},
	checkLogin: (app_id, user_account_id, access_token, client_ip, callBack)=>{
		let sql;
		let parameters;
		sql = `SELECT 1
				 FROM ${get_schema_name()}.user_account_logon ual,
				 	  ${get_schema_name()}.user_account ua
				WHERE ua.id = :user_account_id
				  AND ual.user_account_id = ua.id
				  AND ual.app_id = :app_id
				  AND ual.access_token = :access_token
				  AND ual.client_ip = :client_ip
				  AND ((ual.app_id = :admin_app_id
				        AND 
					    ua.app_role_id IN (:super_admin_app_role_id,:admin_app_role_id))
					   OR
					   ual.app_id <> :admin_app_id)`;
		parameters = {
						user_account_id: user_account_id,
						app_id: app_id,
						access_token: access_token,
						client_ip: client_ip,
						admin_app_id: ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'),
						super_admin_app_role_id: 0,
						admin_app_role_id: 1
					};
		execute_db_sql(app_id, sql, parameters, 
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
						client_longitude:  data.client_longitude ?? null,
						client_latitude:  data.client_latitude ?? null
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