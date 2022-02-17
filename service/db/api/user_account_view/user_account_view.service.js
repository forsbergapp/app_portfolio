const {oracle_options, get_pool} = require ("../../config/database");

module.exports = {
	insertUserAccountView: (app_id, data, callBack) => {
		if (process.env.SERVICE_DB_USE == 1) {
			get_pool(app_id).query(
			`INSERT INTO ${process.env.SERVICE_DB_DB1_NAME}.user_account_view(
							user_account_id, user_account_id_view, client_ip, client_user_agent, client_longitude, client_latitude, date_created)
				VALUES(?,?,?,?,?,?, SYSDATE()) `,
				[
				data.user_account_id,
				data.user_account_id_view,
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
		}else if (process.env.SERVICE_DB_USE==2){
			async function execute_sql(err, result){
				let pool2;
				try{
				pool2 = await get_pool(app_id).getConnection();
				const result = await pool2.execute(
					`INSERT INTO ${process.env.SERVICE_DB_DB2_NAME}.user_account_view(
									user_account_id, user_account_id_view, client_ip, client_user_agent, client_longitude, client_latitude, date_created)
						VALUES(:user_account_id,:user_account_id_view,:client_ip,:client_user_agent,:client_longitude,:client_latitude, SYSDATE) `,
					{
						user_account_id: data.user_account_id,
						user_account_id_view: data.user_account_id_view,
						client_ip: data.client_ip,
						client_user_agent: data.client_user_agent,
						client_longitude: data.client_longitude,
						client_latitude: data.client_latitude
					},
					oracle_options, (err,result) => {
						if (err) {
							return callBack(err);
						}
						else{
							return callBack(null, result);
						}
					});
				}catch (err) {
					return callBack(err.message);
				} finally {
					if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							console.error(err);
						}
					}
				}
			}
			execute_sql();
		}
	}
};