const {oracledb, get_pool} = require ("../../config/database");
const { createLogAppSE } = require("../../../../service/log/log.controller");
module.exports = {
	followUser: (app_id, id, id_follow, callBack) => {
		if (process.env.SERVICE_DB_USE == 1) {
			get_pool(app_id).query(
			`INSERT INTO ${process.env.SERVICE_DB_DB1_NAME}.user_account_follow(
							user_account_id, user_account_id_follow, date_created)
				VALUES(?,?, SYSDATE()) `,
				[
				id,
				id_follow
				],
				(error, results, fields) => {
					if (error){
						createLogAppSE(app_id, __appfilename, __appfunction, __appline, error);
						return callBack(error);
					}
					return callBack(null, results);
				}	
			);
		}else if (process.env.SERVICE_DB_USE==2){
			async function execute_sql(err, result){
				let pool2;
				try{
				pool2 = await oracledb.getConnection(get_pool(app_id));
				const result = await pool2.execute(
					`INSERT INTO ${process.env.SERVICE_DB_DB2_NAME}.user_account_follow(
									user_account_id, user_account_id_follow, date_created)
						VALUES(:user_account_id,:user_account_id_follow, SYSDATE)`,
					{
						user_account_id: id,
					 	user_account_id_follow: id_follow
					},
					(err,result) => {
						if (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
							return callBack(err);
						}
						else{
							return callBack(null, result);
						}
					});
				}catch (err) {
					createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
					return callBack(err.message);
				} finally {
					if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
						}
					}
				}
			}
			execute_sql();
		}
	},
	unfollowUser: (app_id, id, id_unfollow, callBack) => {
		if (process.env.SERVICE_DB_USE == 1) {
			get_pool(app_id).query(
			`DELETE FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account_follow
				WHERE  user_account_id = ?
				AND    user_account_id_follow = ? `,
				[
				id,
				id_unfollow
				],
				(error, results, fields) => {
					if (error){
						createLogAppSE(app_id, __appfilename, __appfunction, __appline, error);
						return callBack(error);
					}
					return callBack(null, results);
				}	
			);
		}else if (process.env.SERVICE_DB_USE==2){
			async function execute_sql(err, result){
				let pool2;
				try{
				pool2 = await oracledb.getConnection(get_pool(app_id));
				const result = await pool2.execute(
					`DELETE FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account_follow
						WHERE  user_account_id = :user_account_id
						AND    user_account_id_follow = :user_account_id_follow`,
					{
						user_account_id: id,
					 	user_account_id_follow: id_unfollow
					},
					(err,result) => {
						if (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
							return callBack(err);
						}
						else{
							return callBack(null, result);
						}
					});
				}catch (err) {
					createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
					return callBack(err.message);
				} finally {
					if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
						}
					}
				}
			}
			execute_sql();
		}
	},
};