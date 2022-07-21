const {oracledb, get_pool} = require ("../../config/database");
const { createLogAppSE } = require("../../../../service/log/log.controller");
module.exports = {
	insertUserAccountLogon: (data, callBack) => {
		if (process.env.SERVICE_DB_USE == 1) {
			get_pool(data.app_id).query(
			`INSERT INTO ${process.env.SERVICE_DB_DB1_NAME}.user_account_logon(
							user_account_id, app_id, result, client_ip, client_user_agent, client_longitude, client_latitude, date_created)
				VALUES(?,?,?,?,?,?,?, SYSDATE()) `,
				[
				data.user_account_id,
				data.app_id,
				data.result,
				data.client_ip,
				data.client_user_agent,
				data.client_longitude,
				data.client_latitude
				],
				(error, results, fields) => {
					if (error){
						createLogAppSE(data.app_id, __appfilename, __appfunction, __appline, error);
						return callBack(error);
					}
					return callBack(null, results);
				}	
			);
		}else if (process.env.SERVICE_DB_USE==2){
			async function execute_sql(err, result){
				let pool2;
				try{
				pool2 = await oracledb.getConnection(get_pool(data.app_id));
				const result_sql = await pool2.execute(
					`INSERT INTO ${process.env.SERVICE_DB_DB2_NAME}.user_account_logon(
						user_account_id, app_id, result, client_ip,  client_user_agent,  client_longitude, client_latitude, date_created)
						VALUES(:user_account_id, :app_id, :result_insert,:client_ip,:client_user_agent, :client_longitude, :client_latitude, SYSDATE) `,
					{
						user_account_id: data.user_account_id,
						app_id: data.app_id,
						result_insert: data.result,
						client_ip: data.client_ip,
						client_user_agent: data.client_user_agent,
						client_longitude:  data.client_longitude,
						client_latitude:  data.client_latitude
					},
					(err,result2) => {
						if (err) {
							createLogAppSE(data.app_id, __appfilename, __appfunction, __appline, err);
							return callBack(err);
						}
						else{
							return callBack(null, result2);
						}
					});
				}catch (err) {
					createLogAppSE(data.app_id, __appfilename, __appfunction, __appline, err);
					return callBack(err.message);
				} finally {
					if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							createLogAppSE(data.app_id, __appfilename, __appfunction, __appline, err);
						}
					}
				}
			}
			execute_sql();
		}
	}
};