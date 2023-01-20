const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);
const {execute_db_sql, get_schema_name, get_locale} = await import(`file://${process.cwd()}/service/db/common/common.service.js`);

function getParameters_server(app_id, data_app_id, callBack){
		//returns parameters for app_id=0 and given app_id
		//and parameter type 0,1,2, only to be called from server
		//because 2 contains passwords or other sensitive data

		let sql;
		let parameters;
		sql = `SELECT	app_id "app_id",
						parameter_type_id "parameter_type_id",
						parameter_name "parameter_name",
						parameter_value "parameter_value",
						parameter_comment "parameter_comment"
				FROM ${get_schema_name()}.app_parameter
				WHERE (app_id = :app_id
						OR 
						app_id = 0)
					AND parameter_type_id IN ('0','1','2')
				ORDER BY 1, 3`;
		parameters = {app_id: data_app_id};
		let stack = new Error().stack;
		import(`file://${process.cwd()}/service/common/common.service.js`).then(function({COMMON}){
			execute_db_sql(app_id, sql, parameters, 
						COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result);
			});
		})
	}
function getParametersAllAdmin(app_id, data_app_id, lang_code, callBack){
		let sql;
		let parameters;
		sql = `SELECT ap.app_id "app_id",
					  ap.parameter_type_id "parameter_type_id",
					  pt.parameter_type_name "parameter_type_name",
					  ptt.text "parameter_type_text",
					  ap.parameter_name "parameter_name",
					  ap.parameter_value "parameter_value",
					  ap.parameter_comment "parameter_comment"
				 FROM ${get_schema_name()}.app_parameter ap,
					  ${get_schema_name()}.parameter_type pt
				 LEFT OUTER JOIN ${get_schema_name()}.parameter_type_translation ptt
				   ON ptt.parameter_type_id = pt.id
				  AND ptt.language_id IN (SELECT id 
											FROM ${get_schema_name()}.language l
										   WHERE l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
																  FROM ${get_schema_name()}.parameter_type_translation ptt1,
																	   ${get_schema_name()}.language l1
																 WHERE l1.id  = ptt1.language_id
																   AND ptt1.parameter_type_id  = pt.id
																   AND l1.lang_code IN (:lang_code1, :lang_code2, :lang_code3)
																)
										  )
				WHERE ap.app_id = :app_id
				  AND pt.id = ap.parameter_type_id
				ORDER BY 1, 5`;
		parameters = {lang_code1: get_locale(lang_code, 1),
					  lang_code2: get_locale(lang_code, 2),
					  lang_code3: get_locale(lang_code, 3),
					  app_id: data_app_id};
		let stack = new Error().stack;
import(`file://${process.cwd()}/service/common/common.service.js`).then(function({COMMON}){
			execute_db_sql(app_id, sql, parameters, 
						COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result); 
			});
		})
	}
function getParameter(app_id, data_app_id, parameter_name, callBack){
		let sql;
		let parameters;
		sql = `SELECT parameter_value "parameter_value"
				 FROM ${get_schema_name()}.app_parameter
				WHERE app_id = :app_id
				  AND parameter_name = :parameter_name
				  AND parameter_type_id IN ('0','1','2')
				ORDER BY 1`;
		parameters = {app_id: data_app_id,
					  parameter_name:parameter_name};
		let stack = new Error().stack;
		import(`file://${process.cwd()}/service/common/common.service.js`).then(function({COMMON}){
			execute_db_sql(app_id, sql, parameters, 
						COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result[0].parameter_value);
			});
		})
	}
function setParameter_admin(app_id, body, callBack){
		let sql;
		let parameters;
		sql = `UPDATE ${get_schema_name()}.app_parameter
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
		let stack = new Error().stack;
		import(`file://${process.cwd()}/service/common/common.service.js`).then(function({COMMON}){
			execute_db_sql(app_id, sql, parameters,
						COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result);
			});
		})
	}
function setParameterValue_admin(app_id, body, callBack){
		let sql;
		let parameters;
		sql = `UPDATE ${get_schema_name()}.app_parameter
				  SET parameter_value = :parameter_value
				WHERE app_id = :app_id
				  AND parameter_name = :parameter_name`;
		parameters = {parameter_value: body.parameter_value, 
					  app_id: body.app_id,
					  parameter_name: body.parameter_name};
		let stack = new Error().stack;
		import(`file://${process.cwd()}/service/common/common.service.js`).then(function({COMMON}){
			execute_db_sql(app_id, sql, parameters, 
						COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result);
			});
		})
	}
function getAppDBParametersAdmin(app_id, callBack){
		let sql;
		let parameters;
		let db_user = 'SERVICE_DB_APP_USER';
		let db_password = 'SERVICE_DB_APP_PASSWORD';

		sql = `SELECT a.id "id",
					  (SELECT ap.parameter_value
					     FROM ${get_schema_name()}.app_parameter ap
						WHERE ap.parameter_name = :db_user
						  AND ap.app_id = a.id) "db_user",
					  (SELECT ap.parameter_value
					 	 FROM ${get_schema_name()}.app_parameter ap
						WHERE ap.parameter_name = :db_password
						  AND ap.app_id = a.id) "db_password"
				 FROM ${get_schema_name()}.app a
				ORDER BY 1, 3`;
		parameters = {db_user: db_user,
					  db_password: db_password};
		let stack = new Error().stack;
		import(`file://${process.cwd()}/service/common/common.service.js`).then(function({COMMON}){
			execute_db_sql(app_id, sql, parameters,
						COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result);
			});
		})
	}
function getAppStartParameters(app_id, callBack){
		let sql;
		let parameters;
		let service_auth = 'SERVICE_AUTH';
		let app_rest_client_id = 'APP_REST_CLIENT_ID';
		let app_rest_client_secret ='APP_REST_CLIENT_SECRET';
		let rest_app_parameter ='REST_APP_PARAMETER';
		sql = `SELECT a.app_name "app_name",
					  a.url "app_url",
					  a.logo "app_logo",
					  (SELECT ap.parameter_value
						 FROM ${get_schema_name()}.app_parameter ap
						WHERE ap.parameter_name = :service_auth
						  AND ap.app_id = :app_main_id) "service_auth",
					  (SELECT ap.parameter_value
						 FROM ${get_schema_name()}.app_parameter ap
						WHERE ap.parameter_name = :app_rest_client_id
						  AND ap.app_id = :app_main_id) "app_rest_client_id",
					  (SELECT ap.parameter_value
						 FROM ${get_schema_name()}.app_parameter ap
						WHERE ap.parameter_name = :app_rest_client_secret
						  AND ap.app_id = :app_main_id) "app_rest_client_secret",
					  (SELECT ap.parameter_value
						 FROM ${get_schema_name()}.app_parameter ap
						WHERE ap.parameter_name = :rest_app_parameter
						  AND ap.app_id = :app_main_id) "rest_app_parameter"
			   FROM ${get_schema_name()}.app a
			  WHERE a.id = :app_id`;
		parameters = {  app_id: app_id,
						app_main_id: ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'),
						service_auth: service_auth,
						app_rest_client_id: app_rest_client_id,
						app_rest_client_secret: app_rest_client_secret,
						rest_app_parameter: rest_app_parameter}
		let stack = new Error().stack;
		import(`file://${process.cwd()}/service/common/common.service.js`).then(function({COMMON}){
			execute_db_sql(app_id, sql, parameters,
						COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result);
			});
		})
	}
function getParameters(app_id, data_app_id, callBack){
		//returns parameters for app_id=0 and given app_id
		//and only public and private shared
		let sql;
		let parameters;
		sql = `SELECT	app_id "app_id",
						parameter_type_id "parameter_type_id",
						parameter_name "parameter_name",
						parameter_value "parameter_value",
						parameter_comment "parameter_comment"
				FROM ${get_schema_name()}.app_parameter
				WHERE (app_id = :app_id
						OR 
						app_id = 0)
					AND parameter_type_id IN ('0','1')
				ORDER BY 1`;
		parameters = {app_id: data_app_id};
		let stack = new Error().stack;
		import(`file://${process.cwd()}/service/common/common.service.js`).then(function({COMMON}){
			execute_db_sql(app_id, sql, parameters, 
						COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result);
			});
		})
	}
export{getParameters_server, getParametersAllAdmin, getParameter, setParameter_admin, setParameterValue_admin, 
	   getAppDBParametersAdmin, getAppStartParameters, getParameters};