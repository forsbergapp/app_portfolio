const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);
const {db_execute, db_schema, get_locale} = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db/common/common.service.js`);

const getParameters_server = (app_id, data_app_id, callBack) => {
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
				FROM ${db_schema()}.app_parameter
				WHERE (app_id = :app_id
						OR 
						app_id = 0)
					AND parameter_type_id IN ('0','1','2')
				ORDER BY 1, 3`;
		parameters = {app_id: data_app_id};
		let stack = new Error().stack;
		import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
			db_execute(app_id, sql, parameters, null, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result);
			});
		})
	}
const getParametersAllAdmin = (app_id, data_app_id, lang_code, callBack) => {
		let sql;
		let parameters;
		sql = `SELECT ap.app_id "app_id",
					  ap.parameter_type_id "parameter_type_id",
					  pt.parameter_type_name "parameter_type_name",
					  ptt.text "parameter_type_text",
					  ap.parameter_name "parameter_name",
					  ap.parameter_value "parameter_value",
					  ap.parameter_comment "parameter_comment"
				 FROM ${db_schema()}.app_parameter ap,
					  ${db_schema()}.parameter_type pt
				 LEFT OUTER JOIN ${db_schema()}.parameter_type_translation ptt
				   ON ptt.parameter_type_id = pt.id
				  AND ptt.language_id IN (SELECT id 
											FROM ${db_schema()}.language l
										   WHERE l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
																  FROM ${db_schema()}.parameter_type_translation ptt1,
																	   ${db_schema()}.language l1
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
import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
			db_execute(app_id, sql, parameters, null, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result); 
			});
		})
	}
const getParameter = (app_id, data_app_id, parameter_name, callBack) => {
		let sql;
		let parameters;
		sql = `SELECT parameter_value "parameter_value"
				 FROM ${db_schema()}.app_parameter
				WHERE app_id = :app_id
				  AND parameter_name = :parameter_name
				  AND parameter_type_id IN ('0','1','2')
				ORDER BY 1`;
		parameters = {app_id: data_app_id,
					  parameter_name:parameter_name};
		let stack = new Error().stack;
		import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
			db_execute(app_id, sql, parameters, null, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result[0].parameter_value);
			});
		})
	}
const setParameter_admin = (app_id, body, callBack) => {
		let sql;
		let parameters;
		sql = `UPDATE ${db_schema()}.app_parameter
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
		import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
			db_execute(app_id, sql, parameters, null, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result);
			});
		})
	}
const setParameterValue_admin = (app_id, body, callBack) => {
		let sql;
		let parameters;
		sql = `UPDATE ${db_schema()}.app_parameter
				  SET parameter_value = :parameter_value
				WHERE app_id = :app_id
				  AND parameter_name = :parameter_name`;
		parameters = {parameter_value: body.parameter_value, 
					  app_id: body.app_id,
					  parameter_name: body.parameter_name};
		let stack = new Error().stack;
		import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
			db_execute(app_id, sql, parameters, null, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result);
			});
		})
	}
const getAppDBParametersAdmin = (app_id, callBack) => {
		let sql;
		let parameters;
		let db_user = 'SERVICE_DB_APP_USER';
		let db_password = 'SERVICE_DB_APP_PASSWORD';

		sql = `SELECT a.id "id",
					  (SELECT ap.parameter_value
					     FROM ${db_schema()}.app_parameter ap
						WHERE ap.parameter_name = :db_user
						  AND ap.app_id = a.id) "db_user",
					  (SELECT ap.parameter_value
					 	 FROM ${db_schema()}.app_parameter ap
						WHERE ap.parameter_name = :db_password
						  AND ap.app_id = a.id) "db_password"
				 FROM ${db_schema()}.app a
				ORDER BY 1, 3`;
		parameters = {db_user: db_user,
					  db_password: db_password};
		let stack = new Error().stack;
		import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
			db_execute(app_id, sql, parameters, null, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result);
			});
		})
	}
const getAppStartParameters = (app_id, callBack) => {
		let sql;
		let parameters;
		sql = `SELECT a.app_name "app_name"
			   FROM ${db_schema()}.app a
			  WHERE a.id = :app_id`;
		parameters = {  app_id: app_id,
						app_main_id: ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID')}
		let stack = new Error().stack;
		import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
			db_execute(app_id, sql, parameters, null, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result);
			});
		})
	}
const getParameters = (app_id, data_app_id, callBack) => {
		//returns parameters for app_id=0 and given app_id
		//and only public and private shared
		let sql;
		let parameters;
		sql = `SELECT	app_id "app_id",
						parameter_type_id "parameter_type_id",
						parameter_name "parameter_name",
						parameter_value "parameter_value",
						parameter_comment "parameter_comment"
				FROM ${db_schema()}.app_parameter
				WHERE (app_id = :app_id
						OR 
						app_id = 0)
					AND parameter_type_id IN ('0','1')
				ORDER BY 1`;
		parameters = {app_id: data_app_id};
		let stack = new Error().stack;
		import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
			db_execute(app_id, sql, parameters, null, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result);
			});
		})
	}
export{getParameters_server, getParametersAllAdmin, getParameter, setParameter_admin, setParameterValue_admin, 
	   getAppDBParametersAdmin, getAppStartParameters, getParameters};