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
				ORDER BY 1, 3`,
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
					ORDER BY 1, 3`,
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
	getParameters_admin: (app_id, callBack) => {
		if (process.env.SERVICE_DB_USE==1){
			get_pool_admin().query(
				`SELECT
						ap.app_id,
						ap.parameter_type_id,
						pt.parameter_type_name,
						ap.parameter_name,
						ap.parameter_value,
						ap.parameter_comment
				FROM ${process.env.SERVICE_DB_DB1_NAME}.app_parameter ap,
					 ${process.env.SERVICE_DB_DB1_NAME}.parameter_type pt
                WHERE ap.app_id = ?
				  AND pt.id = ap.parameter_type_id
				ORDER BY 1, 4`,
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
				pool2 = await oracledb.getConnection(get_pool_admin());
				const result = await pool2.execute(
					`SELECT
                            ap.app_id "app_id",
                            ap.parameter_type_id "parameter_type_id",
							pt.parameter_type_name "parameter_type_name",
                            ap.parameter_name "parameter_name",
                            ap.parameter_value "parameter_value",
							ap.parameter_comment "parameter_comment"
                       FROM ${process.env.SERVICE_DB_DB2_NAME}.app_parameter ap,
					   	    ${process.env.SERVICE_DB_DB2_NAME}.parameter_type pt
                      WHERE ap.app_id = :app_id
					  	AND pt.id = ap.parameter_type_id
					ORDER BY 1, 4`,
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
	setParameter: (body, callBack) =>{
		if (process.env.SERVICE_DB_USE==1){
			get_pool_admin().query(
				`UPDATE ${process.env.SERVICE_DB_DB1_NAME}.app_parameter
					SET parameter_type_id = ?,
						parameter_value = ?,
						parameter_comment = ?
                  WHERE app_id = ?
				    AND parameter_name = ?`,
				[body.parameter_type_id,
				 body.parameter_value, 
				 body.parameter_comment,
				 body.app_id,
				 body.parameter_name],
				(error, results, fields) => {
					if (error){
						createLogAppSE(body.app_id, __appfilename, __appfunction, __appline, error);
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
						SET parameter_type_id = :parameter_type_id,
							parameter_value = :parameter_value,
							parameter_comment = :parameter_comment
                      WHERE app_id = :app_id
					    AND parameter_name = :parameter_name`,
					{parameter_type_id: body.parameter_type_id,
					 parameter_value: body.parameter_value, 
					 parameter_comment: body.parameter_comment,
					 app_id: body.app_id,
					 parameter_name: body.parameter_name},
					(err,result) => {
						if (err) {
							createLogAppSE(body.app_id, __appfilename, __appfunction, __appline, err);
							return callBack(err);
						}
						else{
							return callBack(null, result);
						}
					});
				}catch (err) {
					createLogAppSE(body.app_id, __appfilename, __appfunction, __appline, err);
					return callBack(err.message);
				} finally {
					if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							createLogAppSE(body.app_id, __appfilename, __appfunction, __appline, err);
						}
					}
				}
			}
			execute_sql();
		}
	},
	setParameterValue: (body, callBack) =>{
		if (process.env.SERVICE_DB_USE==1){
			get_pool_admin().query(
				`UPDATE ${process.env.SERVICE_DB_DB1_NAME}.app_parameter
					SET parameter_value = ?
                  WHERE app_id = ?
				    AND parameter_name = ?`,
				[body.parameter_value, 
				 body.app_id,
				 body.parameter_name],
				(error, results, fields) => {
					if (error){
						createLogAppSE(body.app_id, __appfilename, __appfunction, __appline, error);
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
					 app_id: body.app_id,
					 parameter_name: body.parameter_name},
					(err,result) => {
						if (err) {
							createLogAppSE(body.app_id, __appfilename, __appfunction, __appline, err);
							return callBack(err);
						}
						else{
							return callBack(null, result);
						}
					});
				}catch (err) {
					createLogAppSE(body.app_id, __appfilename, __appfunction, __appline, err);
					return callBack(err.message);
				} finally {
					if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							createLogAppSE(body.app_id, __appfilename, __appfunction, __appline, err);
						}
					}
				}
			}
			execute_sql();
		}
	},
	getAppDBParameters: (app_id, callBack) => {
		let db_user = `SERVICE_DB_DB${process.env.SERVICE_DB_USE}_APP_USER`;
		let db_password = `SERVICE_DB_DB${process.env.SERVICE_DB_USE}_APP_PASSWORD`;
		if (process.env.SERVICE_DB_USE==1){
			get_pool(process.env.MAIN_APP_ID).query(
				`SELECT
						a.id,
						(SELECT ap.parameter_value
						   FROM ${process.env.SERVICE_DB_DB1_NAME}.app_parameter ap
                		  WHERE ap.parameter_name = ?
						    AND ap.app_id = a.id) db_user,
						(SELECT ap.parameter_value
						   FROM ${process.env.SERVICE_DB_DB1_NAME}.app_parameter ap
						  WHERE ap.parameter_name = ?
				  		    AND ap.app_id = a.id) db_password
				  FROM ${process.env.SERVICE_DB_DB1_NAME}.app a
				ORDER BY 1`,
				[db_user,
				 db_password],
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
				pool2 = await oracledb.getConnection(get_pool(process.env.MAIN_APP_ID));
				const result = await pool2.execute(
					`SELECT
							a.id "id",
							(SELECT ap.parameter_value
							   FROM ${process.env.SERVICE_DB_DB2_NAME}.app_parameter ap
							  WHERE ap.parameter_name = :db_user
								AND ap.app_id = a.id) "db_user",
							(SELECT ap.parameter_value
						  	   FROM ${process.env.SERVICE_DB_DB2_NAME}.app_parameter ap
							  WHERE ap.parameter_name = :db_password
							    AND ap.app_id = a.id) "db_password"
					   FROM ${process.env.SERVICE_DB_DB2_NAME}.app a
					ORDER BY 1, 3`,
					{db_user: db_user,
					 db_password: db_password},
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
	getAppStartParameters: (app_id, callBack) => {
		let service_auth = 'SERVICE_AUTH';
		let app_rest_client_id = 'APP_REST_CLIENT_ID';
		let app_rest_client_secret ='APP_REST_CLIENT_SECRET';
		let rest_app_parameter ='REST_APP_PARAMETER';
		if (process.env.SERVICE_DB_USE==1){
			get_pool(app_id).query(
				`SELECT
						(SELECT a.app_name
						   FROM ${process.env.SERVICE_DB_DB1_NAME}.app a
						  WHERE a.id = ?) app_name,
						(SELECT a.url
						   FROM ${process.env.SERVICE_DB_DB1_NAME}.app a
						  WHERE a.id = ?) app_url,
						(SELECT a.logo
						   FROM ${process.env.SERVICE_DB_DB1_NAME}.app a
						  WHERE a.id = ?) app_logo,
						(SELECT ap.parameter_value
						   FROM ${process.env.SERVICE_DB_DB1_NAME}.app_parameter ap
                		  WHERE ap.parameter_name = ?
						    AND ap.app_id = ?) service_auth,
						(SELECT ap.parameter_value
						   FROM ${process.env.SERVICE_DB_DB1_NAME}.app_parameter ap
						  WHERE ap.parameter_name = ?
				  		    AND ap.app_id = ?) app_rest_client_id,
						(SELECT ap.parameter_value
						   FROM ${process.env.SERVICE_DB_DB1_NAME}.app_parameter ap
						  WHERE ap.parameter_name = ?
							AND ap.app_id = ?) app_rest_client_secret,
						(SELECT ap.parameter_value
							FROM ${process.env.SERVICE_DB_DB1_NAME}.app_parameter ap
							WHERE ap.parameter_name = ?
								AND ap.app_id = ?) rest_app_parameter
				  FROM DUAL`,
				[app_id,
				 app_id,
				 app_id,
				 service_auth,
				 process.env.MAIN_APP_ID,
				 app_rest_client_id,
				 process.env.MAIN_APP_ID,
				 app_rest_client_secret,
				 process.env.MAIN_APP_ID,
				 rest_app_parameter,
				 process.env.MAIN_APP_ID],
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
				pool2 = await oracledb.getConnection(get_pool(process.env.MAIN_APP_ID));
				const result = await pool2.execute(
					`SELECT
							(SELECT a.app_name
							   FROM ${process.env.SERVICE_DB_DB2_NAME}.app a
							  WHERE a.id = :app_id) "app_name",
							(SELECT a.url
						 	   FROM ${process.env.SERVICE_DB_DB2_NAME}.app a
							  WHERE a.id = :app_id) "app_url",
							(SELECT a.logo
							   FROM ${process.env.SERVICE_DB_DB2_NAME}.app a
							  WHERE a.id = :app_id) "app_logo",
							(SELECT ap.parameter_value
							   FROM ${process.env.SERVICE_DB_DB2_NAME}.app_parameter ap
							  WHERE ap.parameter_name = :service_auth
								AND ap.app_id = :app_main_id) "service_auth",
							(SELECT ap.parameter_value
							   FROM ${process.env.SERVICE_DB_DB2_NAME}.app_parameter ap
							  WHERE ap.parameter_name = :app_rest_client_id
								AND ap.app_id = :app_main_id) "app_rest_client_id",
							(SELECT ap.parameter_value
							   FROM ${process.env.SERVICE_DB_DB2_NAME}.app_parameter ap
							  WHERE ap.parameter_name = :app_rest_client_secret
								AND ap.app_id = :app_main_id) "app_rest_client_secret",
							(SELECT ap.parameter_value
								FROM ${process.env.SERVICE_DB_DB2_NAME}.app_parameter ap
								WHERE ap.parameter_name = :rest_app_parameter
									AND ap.app_id = :app_main_id) "rest_app_parameter"
					  FROM DUAL`,
					{app_id: app_id,
					 app_main_id: process.env.MAIN_APP_ID,
					 service_auth: service_auth,
					 app_rest_client_id: app_rest_client_id,
					 app_rest_client_secret: app_rest_client_secret,
					 rest_app_parameter: rest_app_parameter},
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
	}
};