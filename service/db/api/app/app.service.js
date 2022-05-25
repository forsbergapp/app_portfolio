const {oracledb, get_pool, get_pool_admin} = require ("../../config/database");
const { createLogAppSE } = require("../../../../service/log/log.service");
module.exports = {
	getApp:(id, callBack) => {
		if (typeof id=='undefined')
			id=null;
		if (process.env.SERVICE_DB_USE==1){
			get_pool(id).query(
				`SELECT
						id,
						app_name,
						url,
						logo
				FROM ${process.env.SERVICE_DB_DB1_NAME}.app
				WHERE (id = COALESCE(?, id)
				       OR 
					   ? = 0)
				AND  enabled = 1
				ORDER BY 1 `,
				[id,
				 id],
				(error, results, fields) => {
					if (error){
						createLogAppSE(id, __appfilename, __appfunction, __appline, error);
						return callBack(error);
					}
					return callBack(null, results);
				}
			);
		}
		else if (process.env.SERVICE_DB_USE==2){
			async function execute_sql(err, result){
				let pool2;
				try{
				pool2 = await oracledb.getConnection(get_pool(id));
				const result = await pool2.execute(
					`SELECT
							id "id",
							app_name "app_name",
							url "url",
							logo "logo"
					FROM ${process.env.SERVICE_DB_DB2_NAME}.app
					WHERE (id= NVL(:id, id)
						   OR 
						   :id = 0)
					AND enabled = 1
					ORDER BY 1`,
					{id: id}, 
					(err,result) => {
						if (err) {
							createLogAppSE(id, __appfilename, __appfunction, __appline, err);
							return callBack(err);
						}
						else{
							return callBack(null, result.rows);
						}
					});
				}catch (err) {
					createLogAppSE(id, __appfilename, __appfunction, __appline, err);
					return callBack(err.message);
				} finally {
					if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							createLogAppSE(id, __appfilename, __appfunction, __appline, err);
						}
					}
				}
			}
			execute_sql();
		}
	},
	getAppsAdmin:(id, callBack) => {
		if (process.env.SERVICE_DB_USE==1){
			get_pool_admin().query(
				`SELECT
						id,
						app_name,
						url,
						logo,
						enabled
				FROM ${process.env.SERVICE_DB_DB1_NAME}.app
				ORDER BY 1 `,
				[],
				(error, results, fields) => {
					if (error){
						createLogAppSE(id, __appfilename, __appfunction, __appline, error);
						return callBack(error);
					}
					return callBack(null, results);
				}
			);
		}
		else if (process.env.SERVICE_DB_USE==2){
			async function execute_sql(err, result){
				let pool2;
				try{
				pool2 = await oracledb.getConnection(get_pool_admin());
				const result = await pool2.execute(
					`SELECT
							id "id",
							app_name "app_name",
							url "url",
							logo "logo",
							enabled "enabled"
					FROM ${process.env.SERVICE_DB_DB2_NAME}.app
					ORDER BY 1`,
					{}, 
					(err,result) => {
						if (err) {
							createLogAppSE(id, __appfilename, __appfunction, __appline, err);
							return callBack(err);
						}
						else{
							return callBack(null, result.rows);
						}
					});
				}catch (err) {
					createLogAppSE(id, __appfilename, __appfunction, __appline, err);
					return callBack(err.message);
				} finally {
					if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							createLogAppSE(id, __appfilename, __appfunction, __appline, err);
						}
					}
				}
			}
			execute_sql();
		}
	},
	updateApp:(id, body, callBack) => {
		if (process.env.SERVICE_DB_USE==1){
			get_pool_admin().query(
				`UPDATE ${process.env.SERVICE_DB_DB1_NAME}.app
				 SET    app_name = ?,
						url = ?,
						logo = ?,
						enabled = ?
				WHERE id = ?`,
				[body.app_name,
				 body.url,
				 body.logo,
				 body.enabled,
				 id],
				(error, results, fields) => {
					if (error){
						createLogAppSE(id, __appfilename, __appfunction, __appline, error);
						return callBack(error);
					}
					return callBack(null, results);
				}
			);
		}
		else if (process.env.SERVICE_DB_USE==2){
			async function execute_sql(err, result){
				let pool2;
				try{
				pool2 = await oracledb.getConnection(get_pool_admin());
				const result = await pool2.execute(
					`UPDATE ${process.env.SERVICE_DB_DB2_NAME}.app
						SET app_name = :app_name,
							url = :url,
							logo = :logo,
							enabled = :enabled
					WHERE id = :id`,
					{app_name: body.app_name,
					 url: body.url,
					 logo: body.logo,
					 enabled: body.enabled,
					 id: id},
					(err,result) => {
						if (err) {
							createLogAppSE(id, __appfilename, __appfunction, __appline, err);
							return callBack(err);
						}
						else{
							return callBack(null, result.rows);
						}
					});
				}catch (err) {
					createLogAppSE(id, __appfilename, __appfunction, __appline, err);
					return callBack(err.message);
				} finally {
					if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							createLogAppSE(id, __appfilename, __appfunction, __appline, err);
						}
					}
				}
			}
			execute_sql();
		}
	}
};