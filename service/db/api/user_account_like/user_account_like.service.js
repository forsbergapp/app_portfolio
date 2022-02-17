const {oracle_options, get_pool} = require ("../../config/database");

module.exports = {
	likeUser: (app_id, id, id_like, callBack) => {
		if (process.env.SERVICE_DB_USE == 1) {
			get_pool(app_id).query(
			`INSERT INTO ${process.env.SERVICE_DB_DB1_NAME}.user_account_like(
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
				let pool2;
				try{
				pool2 = await get_pool(app_id).getConnection();
				const result = await pool2.execute(
					`INSERT INTO ${process.env.SERVICE_DB_DB2_NAME}.user_account_like(
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
	},
	unlikeUser: (app_id, id, id_unlike, callBack) => {
		if (process.env.SERVICE_DB_USE == 1) {
			get_pool(app_id).query(
			`DELETE FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account_like
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
				let pool2;
				try{
				pool2 = await get_pool(app_id).getConnection();
				const result = await pool2.execute(
					`DELETE FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account_like
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
	},
};