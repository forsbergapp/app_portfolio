const {pool, oracledb, oracle_options} = require ("../../config/database");

module.exports = {
	followUser: (id, id_follow, callBack) => {
		if (process.env.SERVICE_DB_USE == 1) {
			pool.query(
			`INSERT INTO user_account_follow(
							user_account_id, user_account_id_follow, date_created)
				VALUES(?,?, SYSDATE()) `,
				[
				id,
				id_follow
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
				try{
				const pool2 = await oracledb.getConnection();
				const result = await pool2.execute(
					`INSERT INTO user_account_follow(
									user_account_id, user_account_id_follow, date_created)
						VALUES(:user_account_id,:user_account_id_follow, SYSDATE)`,
					{
						user_account_id: id,
					 	user_account_id_follow: id_follow
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
	unfollowUser: (id, id_unfollow, callBack) => {
		if (process.env.SERVICE_DB_USE == 1) {
			pool.query(
			`DELETE FROM user_account_follow
				WHERE  user_account_id = ?
				AND    user_account_id_follow = ? `,
				[
				id,
				id_unfollow
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
				try{
				const pool2 = await oracledb.getConnection();
				const result = await pool2.execute(
					`DELETE FROM user_account_follow
						WHERE  user_account_id = :user_account_id
						AND    user_account_id_follow = :user_account_id_follow`,
					{
						user_account_id: id,
					 	user_account_id_follow: id_unfollow
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