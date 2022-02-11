const {pool, oracledb, oracle_options} = require ("../../config/database");

module.exports = {
	insertUserSettingView: (data, callBack) => {
		if (process.env.SERVICE_DB_USE == 1) {
			pool.query(
			`INSERT INTO app_timetables_user_setting_view(
							user_account_id,
							user_setting_id,
							client_ip,
							client_user_agent,
							client_longitude,
							client_latitude,
							date_created)
				VALUES(?,?,?,?,?,?, SYSDATE()) `,
				[data.user_account_id,
				data.user_setting_id,
				data.client_ip,
				data.client_user_agent,
				data.client_longitude,
				data.client_latitude],
				(error, results, fields) => {
					if (error){
						return callBack(error);
					}
					return callBack(null, results);
				}	
			);
		}else if (process.env.SERVICE_DB_USE==2){
			async function execute_sql(err, result){
				try{
				const pool2 = await oracledb.getConnection();
				const result_sql = await pool2.execute(
					`INSERT INTO app_timetables_user_setting_view(
									user_account_id,
									user_setting_id,
									client_ip,
									client_user_agent,
									client_longitude, 
									client_latitude, 
									date_created)
						VALUES( :user_account_id,
								:user_setting_id,
								:client_ip,
								:client_user_agent,
								:client_longitude,
								:client_latitude,
								SYSDATE) `,
					{
						user_account_id: data.user_account_id,
						user_setting_id: data.user_setting_id,
						client_ip: data.client_ip,
						client_user_agent: data.client_user_agent,
						client_longitude: data.client_longitude,
						client_latitude: data.client_latitude
					},
					oracle_options, (err_ins,result_ins) => {
						if (err_ins) {
							return callBack(err_ins);
						}
						else{
							return callBack(null, result_ins);
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