const {execute_db_sql, get_schema_name} = require ("../../common/common.service");
module.exports = {
	insertUserAccountView: (app_id, data, callBack) => {
		let sql;
		let parameters;
		sql = `INSERT INTO ${get_schema_name()}.user_account_view(
							user_account_id, user_account_id_view, client_ip, client_user_agent, client_longitude, client_latitude, date_created)
				VALUES(:user_account_id,:user_account_id_view,:client_ip,:client_user_agent,:client_longitude,:client_latitude, CURRENT_TIMESTAMP) `;
		parameters = {
						user_account_id: data.user_account_id,
						user_account_id_view: data.user_account_id_view,
						client_ip: data.client_ip,
						client_user_agent: data.client_user_agent,
						client_longitude: data.client_longitude,
						client_latitude: data.client_latitude
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