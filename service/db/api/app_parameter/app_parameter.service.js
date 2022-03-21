const {oracledb, get_pool, get_pool_admin} = require ("../../config/database");
const { createLogAppSE } = require("../../../../service/log/log.service");
module.exports = {
	//returns parameters for app_id=0 and given app_id
	//and only public and private shared
	getParameters: (app_id, callBack) => {
		if (process.env.SERVICE_DB_USE==1){
			get_pool(app_id).query(
				`SELECT
						app_id,
						parameter_type_id,
						parameter_name,
						parameter_value,
						parameter_comment
				FROM ${process.env.SERVICE_DB_DB1_NAME}.app_parameter
                WHERE (app_id = ?
					   OR 
					   app_id = 0)
				  AND parameter_type_id IN (0,1)
				ORDER BY 1 `,
				[app_id],
				(error, results, fields) => {
					if (error){
						createLogAppSE(app_id, __appfilename, __appfunction, __appline, error);
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
				pool2 = await oracledb.getConnection(get_pool(app_id));
				const result = await pool2.execute(
					`SELECT
                            app_id "app_id",
                            parameter_type_id "parameter_type_id",
                            parameter_name "parameter_name",
                            parameter_value "parameter_value",
							parameter_comment "parameter_comment"
                       FROM ${process.env.SERVICE_DB_DB2_NAME}.app_parameter
                      WHERE (app_id = :app_id
					         OR 
							 app_id = 0)
					    AND parameter_type_id IN (0,1)
					ORDER BY 1`,
					{app_id: app_id},
					(err,result) => {
						if (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
							return callBack(err);
						}
						else{
							return callBack(null, result.rows);
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
	//returns parameters for app_id=0 and given app_id
	//and parameter type 0,1,2, only to be called from server
	//because 2 contains passwords or other sensitive data
	getParameters_server: (app_id, callBack) => {
		if (process.env.SERVICE_DB_USE==1){
			get_pool(app_id).query(
				`SELECT
						app_id,
						parameter_type_id,
						parameter_name,
						parameter_value,
						parameter_comment
				FROM ${process.env.SERVICE_DB_DB1_NAME}.app_parameter
                WHERE (app_id = ?
					   OR 
					   app_id = 0)
				  AND parameter_type_id IN (0,1,2)
				ORDER BY 1 `,
				[app_id],
				(error, results, fields) => {
					if (error){
						createLogAppSE(app_id, __appfilename, __appfunction, __appline, error);
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
				pool2 = await oracledb.getConnection(get_pool(app_id));
				const result = await pool2.execute(
					`SELECT
                            app_id "app_id",
                            parameter_type_id "parameter_type_id",
                            parameter_name "parameter_name",
                            parameter_value "parameter_value",
							parameter_comment "parameter_comment"
                       FROM ${process.env.SERVICE_DB_DB2_NAME}.app_parameter
                      WHERE (app_id = :app_id
					         OR 
							 app_id = 0)
					    AND parameter_type_id IN (0,1,2)
					ORDER BY 1`,
					{app_id: app_id},
					(err,result) => {
						if (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
							return callBack(err);
						}
						else{
							return callBack(null, result.rows);
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
	getParameter: (app_id, parameter_name, callBack) =>{
		if (process.env.SERVICE_DB_USE==1){
			get_pool_admin().query(
				`SELECT parameter_value
				   FROM ${process.env.SERVICE_DB_DB1_NAME}.app_parameter
                  WHERE app_id = ?
				    AND parameter_name = ?
				    AND parameter_type_id IN (0,1,2)
				ORDER BY 1 `,
				[app_id,
				 parameter_name],
				(error, results, fields) => {
					if (error){
						createLogAppSE(app_id, __appfilename, __appfunction, __appline, error);
						return callBack(error);
					}
					return callBack(null, results[0].parameter_value);
				}
			);
		}
		else if (process.env.SERVICE_DB_USE==2){
			async function execute_sql(err, result){
				let pool2;
				try{
				pool2 = await oracledb.getConnection(get_pool_admin());
				const result = await pool2.execute(
					`SELECT parameter_value "parameter_value"
                       FROM ${process.env.SERVICE_DB_DB2_NAME}.app_parameter
                      WHERE app_id = :app_id
					    AND parameter_name = :parameter_name
					    AND parameter_type_id IN (0,1,2)
					ORDER BY 1`,
					{app_id: app_id,
					 parameter_name:parameter_name},
					(err,result) => {
						if (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
							return callBack(err);
						}
						else{
							return callBack(null, result.rows[0].parameter_value);
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
	setParameter: (app_id, body, callBack) =>{
		if (process.env.SERVICE_DB_USE==1){
			get_pool_admin().query(
				`UPDATE ${process.env.SERVICE_DB_DB1_NAME}.app_parameter
					SET parameter_value = ?
                  WHERE app_id = ?
				    AND parameter_name = ?`,
				[body.parameter_value, 
				 app_id,
				 body.parameter_name],
				(error, results, fields) => {
					if (error){
						createLogAppSE(app_id, __appfilename, __appfunction, __appline, error);
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
					`UPDATE ${process.env.SERVICE_DB_DB2_NAME}.app_parameter
						SET parameter_value = :parameter_value
                      WHERE app_id = :app_id
					    AND parameter_name = :parameter_name`,
					{parameter_value: body.parameter_value,
					 app_id: app_id,
					 parameter_name: body.parameter_name},
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