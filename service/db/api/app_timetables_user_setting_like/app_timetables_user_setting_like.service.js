const {pool, oracledb, oracle_options} = require ("../../config/database");

module.exports = {
	likeUserSetting: (id, id_like, callBack) => {
		if (process.env.SERVER_DB_USE == 1) {
			pool.query(
			`INSERT INTO app_timetables_user_setting_like(
							user_account_id, user_setting_id, date_created)
				VALUES(?,?, SYSDATE()) `,
				[
				id,
				id_like
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
				const result = await pool2.execute(
					`INSERT INTO app_timetables_user_setting_like(
									user_account_id, user_setting_id, date_created)
						VALUES(:user_account_id,:user_setting_id, SYSDATE) `,
					{
						user_account_id: id,
						user_setting_id: id_like
					},
					oracle_options, (err,result) => {
						if (err) {
							return callBack(err);
						}
						else{
							return callBack(null, result);
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
	},
	unlikeUserSetting: (id, id_unlike, callBack) => {
		if (process.env.SERVER_DB_USE == 1) {
			pool.query(
			`DELETE FROM app_timetables_user_setting_like
				WHERE  user_account_id = ?
				AND    user_setting_id = ? `,
				[
				id,
				id_unlike
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
				const result = await pool2.execute(
					`DELETE FROM app_timetables_user_setting_like
						WHERE  user_account_id = :user_account_id
						AND    user_setting_id = :user_setting_id `,
					{
						user_account_id: id,
						user_setting_id: id_unlike
					},
					oracle_options, (err,result) => {
						if (err) {
							return callBack(err);
						}
						else{
							return callBack(null, result);
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
	},
};