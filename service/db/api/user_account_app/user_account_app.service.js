const {oracledb, get_pool} = require ("../../config/database");
const { createLogAppSE } = require("../../../../service/log/log.service");
module.exports = {
	createUserAccountApp: (app_id, user_account_id, callBack) => {
		if (process.env.SERVICE_DB_USE == 1) {
			get_pool(app_id).query(
			`INSERT INTO ${process.env.SERVICE_DB_DB1_NAME}.user_account_app(
							app_id, user_account_id, date_created)
				SELECT ?,?, SYSDATE()
				  FROM DUAL
				  WHERE NOT EXISTS (SELECT NULL
									  FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account_app uap
									 WHERE uap.app_id = ?
									   AND uap.user_account_id = ?)`,
				[
				app_id,
				user_account_id,
				app_id,
				user_account_id
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
					`INSERT INTO ${process.env.SERVICE_DB_DB2_NAME}.user_account_app(
									app_id, user_account_id, date_created)
						SELECT :app_id, :user_account_id, SYSDATE
						  FROM DUAL
						 WHERE NOT EXISTS (SELECT NULL
										     FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account_app uap
										    WHERE uap.app_id = :app_id
										 	  AND uap.user_account_id = :user_account_id)`,
					{
						app_id: app_id,
						user_account_id: user_account_id
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
	getUserAccountApps: (app_id, user_account_id, callBack) => {
		if (process.env.SERVICE_DB_USE == 1) {
			get_pool(app_id).query(
				`SELECT uap.app_id,
				        a.app_name,
						a.url,
						a.logo,
						uap.date_created
				   FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account_app uap,
				        ${process.env.SERVICE_DB_DB1_NAME}.app a
				  WHERE a.id = uap.app_id
				    AND uap.user_account_id = ?
					AND a.enabled = 1`,
				[
				user_account_id
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
					`SELECT uap.app_id "app_id",
							a.app_name "app_name",
							a.url "url",
							a.logo "logo",
							uap.date_created "date_created"
					   FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account_app uap,
					        ${process.env.SERVICE_DB_DB2_NAME}.app a
					  WHERE a.id = uap.app_id
					    AND uap.user_account_id = :user_account_id
						AND a.enabled = 1`,
					{
						user_account_id: user_account_id
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
	}
};