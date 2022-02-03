const {pool, oracledb, oracle_options} = require ("../../config/database");

module.exports = {
	insertUserAccountLogon: (data, callBack) => {
		if (process.env.SERVER_DB_USE == 1) {
			pool.query(
			`INSERT INTO user_account_logon(
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
						return callBack(error);
					}
					return callBack(null, results);
				}	
			);
		}else if (process.env.SERVER_DB_USE==2){
			async function execute_sql(err, result){
				try{
				const pool2 = await oracledb.getConnection();
				const result_sql = await pool2.execute(
					`INSERT INTO user_account_logon(
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
					oracle_options, (err,result2) => {
						if (err) {
							console.log('insertUserAccountLogon:' + err);
							return callBack(err);
						}
						else{
							return callBack(null, result2);
						}
					});
					await pool2.close();
				}catch (err) {
					return callBack(err.message);
				} finally {
					null;
				}
			}
			execute_sql();
		}
	}
};