const {pool, oracledb, oracle_options} = require ("../../config/database");

module.exports = {
	likeUser: (id, id_like, callBack) => {
		if (process.env.SERVICE_DB_USE == 1) {
			pool.query(
			`INSERT INTO user_account_like(
							user_account_id, user_account_id_like, date_created)
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
		}else if (process.env.SERVICE_DB_USE==2){
			async function execute_sql(err, result){
				try{
				const pool2 = await oracledb.getConnection();
				const result = await pool2.execute(
					`INSERT INTO user_account_like(
									user_account_id, user_account_id_like, date_created)
						VALUES(:user_account_id,:user_account_id_like, SYSDATE) `,
					{
						user_account_id: id,
					 	user_account_id_like: id_like
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
	unlikeUser: (id, id_unlike, callBack) => {
		if (process.env.SERVICE_DB_USE == 1) {
			pool.query(
			`DELETE FROM user_account_like
				WHERE  user_account_id = ?
				AND    user_account_id_like = ? `,
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
		}else if (process.env.SERVICE_DB_USE==2){
			async function execute_sql(err, result){
				try{
				const pool2 = await oracledb.getConnection();
				const result = await pool2.execute(
					`DELETE FROM user_account_like
						WHERE  user_account_id = :user_account_id
						AND    user_account_id_like = :user_account_id_like `,
					{
						user_account_id: id,
					 	user_account_id_like: id_unlike
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