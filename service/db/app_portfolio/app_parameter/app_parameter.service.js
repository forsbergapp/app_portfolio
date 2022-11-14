const {execute_db_sql} = require ("../../common/common.service");

module.exports = {
	//returns parameters for app_id=0 and given app_id
	//and only public and private shared
	getParameters: (app_id, data_app_id, callBack) => {
		let sql;
		let parameters;
		if (process.env.SERVICE_DB_USE==1){
			sql = `SELECT	app_id,
							parameter_type_id,
							parameter_name,
							parameter_value,
							parameter_comment
					FROM ${process.env.SERVICE_DB_DB1_NAME}.app_parameter
					WHERE (app_id = ?
						OR 
						app_id = 0)
					AND parameter_type_id IN (0,1)
					ORDER BY 1 `;
			parameters = [data_app_id];
		}
		else if (process.env.SERVICE_DB_USE==2){
			sql = `SELECT	app_id "app_id",
							parameter_type_id "parameter_type_id",
							parameter_name "parameter_name",
							parameter_value "parameter_value",
							parameter_comment "parameter_comment"
					FROM ${process.env.SERVICE_DB_DB2_NAME}.app_parameter
					WHERE (app_id = :app_id
							OR 
							app_id = 0)
						AND parameter_type_id IN (0,1)
					ORDER BY 1`;
			parameters = {app_id: data_app_id};
			
		}
		execute_db_sql(app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	},
	//returns parameters for app_id=0 and given app_id
	//and parameter type 0,1,2, only to be called from server
	//because 2 contains passwords or other sensitive data
	getParameters_server: (app_id, data_app_id, callBack) => {
		let sql;
		let parameters;
		if (process.env.SERVICE_DB_USE==1){
			sql = `SELECT	app_id,
							parameter_type_id,
							parameter_name,
							parameter_value,
							parameter_comment
					FROM ${process.env.SERVICE_DB_DB1_NAME}.app_parameter
					WHERE (app_id = ?
						OR 
						app_id = 0)
					AND parameter_type_id IN (0,1,2)
					ORDER BY 1, 3`;
			parameters = [data_app_id];
		}
		else if (process.env.SERVICE_DB_USE==2){
			sql = `SELECT	app_id "app_id",
							parameter_type_id "parameter_type_id",
							parameter_name "parameter_name",
							parameter_value "parameter_value",
							parameter_comment "parameter_comment"
					FROM ${process.env.SERVICE_DB_DB2_NAME}.app_parameter
					WHERE (app_id = :app_id
							OR 
							app_id = 0)
						AND parameter_type_id IN (0,1,2)
					ORDER BY 1, 3`;
			parameters = {app_id: data_app_id};
		}
		execute_db_sql(app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	},
	getParameters_admin: (app_id, data_app_id, callBack) => {
		let sql;
		let parameters;
		if (process.env.SERVICE_DB_USE==1){
			sql = `SELECT	ap.app_id,
							ap.parameter_type_id,
							pt.parameter_type_name,
							ap.parameter_name,
							ap.parameter_value,
							ap.parameter_comment
					FROM ${process.env.SERVICE_DB_DB1_NAME}.app_parameter ap,
						${process.env.SERVICE_DB_DB1_NAME}.parameter_type pt
					WHERE ap.app_id = ?
					AND pt.id = ap.parameter_type_id
					ORDER BY 1, 4`;
			parameters = [data_app_id];
		}
		else if (process.env.SERVICE_DB_USE==2){
			sql = `SELECT	ap.app_id "app_id",
							ap.parameter_type_id "parameter_type_id",
							pt.parameter_type_name "parameter_type_name",
							ap.parameter_name "parameter_name",
							ap.parameter_value "parameter_value",
							ap.parameter_comment "parameter_comment"
					FROM ${process.env.SERVICE_DB_DB2_NAME}.app_parameter ap,
							${process.env.SERVICE_DB_DB2_NAME}.parameter_type pt
					WHERE ap.app_id = :app_id
						AND pt.id = ap.parameter_type_id
					ORDER BY 1, 4`;
			parameters = {app_id: data_app_id};
		}
		execute_db_sql(app_id, sql, parameters, true, 
					   __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result); 
		});
	},
	getParameter_admin: (app_id, data_app_id, parameter_name, callBack) =>{
		let sql;
		let parameters;
		if (process.env.SERVICE_DB_USE==1){
			sql = `SELECT parameter_value
					 FROM ${process.env.SERVICE_DB_DB1_NAME}.app_parameter
				    WHERE app_id = ?
  					  AND parameter_name = ?
					  AND parameter_type_id IN (0,1,2)
				 ORDER BY 1 `;
			parameters = [data_app_id,
						  parameter_name];
		}
		else if (process.env.SERVICE_DB_USE==2){
			sql = `SELECT parameter_value "parameter_value"
					 FROM ${process.env.SERVICE_DB_DB2_NAME}.app_parameter
				    WHERE app_id = :app_id
 					  AND parameter_name = :parameter_name
					  AND parameter_type_id IN (0,1,2)
				 ORDER BY 1`;
		    parameters = {app_id: data_app_id,
					      parameter_name:parameter_name};
		}
		execute_db_sql(app_id, sql, parameters, true, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result[0].parameter_value);
		});
	},
	getParameter: (app_id, data_app_id, parameter_name, callBack) =>{
		let sql;
		let parameters;
		if (process.env.SERVICE_DB_USE==1){
			sql = `SELECT parameter_value
					 FROM ${process.env.SERVICE_DB_DB1_NAME}.app_parameter
				    WHERE app_id = ?
  					  AND parameter_name = ?
					  AND parameter_type_id IN (0,1,2)
				 ORDER BY 1 `;
			parameters = [data_app_id,
						  parameter_name];
		}
		else if (process.env.SERVICE_DB_USE==2){
			sql = `SELECT parameter_value "parameter_value"
					 FROM ${process.env.SERVICE_DB_DB2_NAME}.app_parameter
				    WHERE app_id = :app_id
 					  AND parameter_name = :parameter_name
					  AND parameter_type_id IN (0,1,2)
				 ORDER BY 1`;
		    parameters = {app_id: data_app_id,
					      parameter_name:parameter_name};
		}
		execute_db_sql(app_id, sql, parameters, null, 
					   __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result[0].parameter_value);
		});
	},
	setParameter_admin: (app_id, body, callBack) =>{
		let sql;
		let parameters;
		if (process.env.SERVICE_DB_USE==1){
			sql = `UPDATE ${process.env.SERVICE_DB_DB1_NAME}.app_parameter
					  SET parameter_type_id = ?,
						  parameter_value = ?,
						  parameter_comment = ?
					WHERE app_id = ?
					  AND parameter_name = ?`;
			parameters = [body.parameter_type_id,
						  body.parameter_value, 
						  body.parameter_comment,
						  body.app_id,
						  body.parameter_name];
		}
		else if (process.env.SERVICE_DB_USE==2){
			sql = `UPDATE ${process.env.SERVICE_DB_DB2_NAME}.app_parameter
					  SET parameter_type_id = :parameter_type_id,
						  parameter_value = :parameter_value,
						  parameter_comment = :parameter_comment
					WHERE app_id = :app_id
					  AND parameter_name = :parameter_name`;
			parameters = {parameter_type_id: body.parameter_type_id,
						  parameter_value: body.parameter_value, 
						  parameter_comment: body.parameter_comment,
						  app_id: body.app_id,
						  parameter_name: body.parameter_name};
		}
		execute_db_sql(app_id, sql, parameters, true, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	},
	setParameterValue_admin: (app_id, body, callBack) =>{
		let sql;
		let parameters;
		if (process.env.SERVICE_DB_USE==1){
			sql = `UPDATE ${process.env.SERVICE_DB_DB1_NAME}.app_parameter
					  SET parameter_value = ?
					WHERE app_id = ?
					  AND parameter_name = ?`;
			parameters = [body.parameter_value, 
						  body.app_id,
						  body.parameter_name];
		}
		else if (process.env.SERVICE_DB_USE==2){
			sql = `UPDATE ${process.env.SERVICE_DB_DB2_NAME}.app_parameter
					  SET parameter_value = :parameter_value
					WHERE app_id = :app_id
  					  AND parameter_name = :parameter_name`;
			parameters = {parameter_value: body.parameter_value, 
						  app_id: body.app_id,
						  parameter_name: body.parameter_name};
		}
		execute_db_sql(app_id, sql, parameters, true, 
					   __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	},
	getAppDBParametersAdmin: (app_id, callBack) => {
		let sql;
		let parameters;
		let db_user = `SERVICE_DB_APP_USER`;
		let db_password = `SERVICE_DB_APP_PASSWORD`;
		if (process.env.SERVICE_DB_USE==1){
			sql = `SELECT	a.id,
							(SELECT ap.parameter_value
							   FROM ${process.env.SERVICE_DB_DB1_NAME}.app_parameter ap
							  WHERE ap.parameter_name = ?
								AND ap.app_id = a.id) db_user,
							(SELECT ap.parameter_value
							   FROM ${process.env.SERVICE_DB_DB1_NAME}.app_parameter ap
							  WHERE ap.parameter_name = ?
								AND ap.app_id = a.id) db_password
					FROM ${process.env.SERVICE_DB_DB1_NAME}.app a
					ORDER BY 1`;
			parameters = [db_user,
						  db_password];
		}
		else if (process.env.SERVICE_DB_USE==2){
			sql = `SELECT	a.id "id",
							(SELECT ap.parameter_value
							   FROM ${process.env.SERVICE_DB_DB2_NAME}.app_parameter ap
							  WHERE ap.parameter_name = :db_user
								AND ap.app_id = a.id) "db_user",
							(SELECT ap.parameter_value
						  	   FROM ${process.env.SERVICE_DB_DB2_NAME}.app_parameter ap
							  WHERE ap.parameter_name = :db_password
								AND ap.app_id = a.id) "db_password"
					FROM ${process.env.SERVICE_DB_DB2_NAME}.app a
					ORDER BY 1, 3`;
			parameters = {db_user: db_user,
						  db_password: db_password};
		}
		execute_db_sql(app_id, sql, parameters, true, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
		
	},
	getAppStartParameters: (app_id, callBack) => {
		let sql;
		let parameters;
		let service_auth = 'SERVICE_AUTH';
		let app_rest_client_id = 'APP_REST_CLIENT_ID';
		let app_rest_client_secret ='APP_REST_CLIENT_SECRET';
		let rest_app_parameter ='REST_APP_PARAMETER';
		if (process.env.SERVICE_DB_USE==1){
			sql = `SELECT	(SELECT a.app_name
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
							FROM DUAL`;
			parameters = [	app_id,
							app_id,
							app_id,
							service_auth,
							process.env.COMMON_APP_ID,
							app_rest_client_id,
							process.env.COMMON_APP_ID,
							app_rest_client_secret,
							process.env.COMMON_APP_ID,
							rest_app_parameter,
							process.env.COMMON_APP_ID];
		}
		else if (process.env.SERVICE_DB_USE==2){
			sql = `SELECT (SELECT a.app_name
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
				FROM DUAL`;
			parameters = {  app_id: app_id,
							app_main_id: process.env.COMMON_APP_ID,
							service_auth: service_auth,
							app_rest_client_id: app_rest_client_id,
							app_rest_client_secret: app_rest_client_secret,
							rest_app_parameter: rest_app_parameter}
		}
		execute_db_sql(app_id, sql, parameters, null,
					   __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	},
	getAppStartParametersAdmin: (app_id, callBack) => {
		let sql;
		let parameters;
		let service_auth = 'SERVICE_AUTH';
		let app_rest_client_id = 'APP_REST_CLIENT_ID';
		let app_rest_client_secret ='APP_REST_CLIENT_SECRET';
		let rest_app_parameter ='REST_APP_PARAMETER';
		if (process.env.SERVICE_DB_USE==1){
			sql = `SELECT	'ADMIN' app_name,
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
							FROM DUAL`;
			parameters = [	app_id,
							app_id,
							service_auth,
							process.env.COMMON_APP_ID,
							app_rest_client_id,
							process.env.COMMON_APP_ID,
							app_rest_client_secret,
							process.env.COMMON_APP_ID,
							rest_app_parameter,
							process.env.COMMON_APP_ID];
		}
		else if (process.env.SERVICE_DB_USE==2){
			sql = `SELECT   'ADMIN' "app_name",
							(SELECT a.url
							   FROM ${process.env.SERVICE_DB_DB2_NAME}.app a
							  WHERE a.id = :app_id) "app_url",
							(SELECT a.logo
							   FROM ${process.env.SERVICE_DB_DB2_NAME}.app a
							  WHERE a.id = :app_id) "app_logo",
							(SELECT ap.parameter_value
							   FROM ${process.env.SERVICE_DB_DB2_NAME}.app_parameter ap
							  WHERE ap.parameter_name = :service_auth
								AND ap.app_id = :app_common_id) "service_auth",
							(SELECT ap.parameter_value
							   FROM ${process.env.SERVICE_DB_DB2_NAME}.app_parameter ap
							  WHERE ap.parameter_name = :app_rest_client_id
								AND ap.app_id = :app_common_id) "app_rest_client_id",
							(SELECT ap.parameter_value
							   FROM ${process.env.SERVICE_DB_DB2_NAME}.app_parameter ap
							  WHERE ap.parameter_name = :app_rest_client_secret
								AND ap.app_id = :app_common_id) "app_rest_client_secret",
							(SELECT ap.parameter_value
							   FROM ${process.env.SERVICE_DB_DB2_NAME}.app_parameter ap
							  WHERE ap.parameter_name = :rest_app_parameter
								AND ap.app_id = :app_common_id) "rest_app_parameter"
				FROM DUAL`;
			parameters = {  app_id: app_id,
							app_common_id: process.env.COMMON_APP_ID,
							service_auth: service_auth,
							app_rest_client_id: app_rest_client_id,
							app_rest_client_secret: app_rest_client_secret,
							rest_app_parameter: rest_app_parameter}
		}
		execute_db_sql(app_id, sql, parameters, true, 
					   __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	}
};