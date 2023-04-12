const {execute_db_sql, get_schema_name, get_locale} = await import(`file://${process.cwd()}/service/db/common/common.service.js`);

const getApp = (app_id, id,lang_code, callBack) => {
		let sql;
		let parameters;
		if (typeof id=='undefined')
			id=null;
		sql = `SELECT	id "id",
						app_name "app_name",
						url "url",
						logo "logo",
						aot.text "app_description",
						act.text "app_category"
				FROM ${get_schema_name()}.app a
						LEFT OUTER JOIN ${get_schema_name()}.app_object_translation aot
							ON aot.app_object_app_id = a.id
							AND aot.app_object_object_name = 'APP_DESCRIPTION'
							AND aot.language_id IN (SELECT id 
													FROM ${get_schema_name()}.language l
													WHERE l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
																			FROM ${get_schema_name()}.app_object_translation aot1,
																				${get_schema_name()}.language l1
																		WHERE l1.id  = aot1.language_id
																			AND aot1.app_object_app_id  = aot.app_object_app_id
																			AND aot1.app_object_object_name = aot.app_object_object_name
																			AND l1.lang_code IN (:lang_code1, :lang_code2, :lang_code3)
																		)
												)
						LEFT OUTER JOIN ${get_schema_name()}.app_category_translation act
							ON act.app_category_id = a.app_category_id
							AND act.language_id IN (SELECT id 
													FROM ${get_schema_name()}.language l
													WHERE l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
																			FROM ${get_schema_name()}.app_category_translation act1,
																				${get_schema_name()}.language l1
																		WHERE l1.id  = act1.language_id
																			AND act1.app_category_id  = act.app_category_id
																			AND l1.lang_code IN (:lang_code1, :lang_code2, :lang_code3)
																		)
												)
				WHERE (id= COALESCE(:id, id)
					OR 
					:id = 0)
				AND enabled = 1
				ORDER BY 1`;
		parameters = {	lang_code1: get_locale(lang_code, 1),
						lang_code2: get_locale(lang_code, 2),
						lang_code3: get_locale(lang_code, 3),
						id: id};
		let stack = new Error().stack;
		import(`file://${process.cwd()}/service/common/common.service.js`).then(({COMMON}) => {
			execute_db_sql(app_id, sql, parameters,
						COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result);
			});
		})
	}
const getAppsAdmin = (app_id, lang_code, callBack) => {
		let sql;
		let parameters;
		sql = `SELECT	a.id "id",
						a.app_name "app_name",
						a.url "url",
						a.logo "logo",
						a.enabled "enabled",
						a.app_category_id "app_category_id",
						act.text "app_category_text"
				FROM ${get_schema_name()}.app a
					LEFT OUTER JOIN ${get_schema_name()}.app_category_translation act
						ON act.app_category_id = a.app_category_id
						AND act.language_id IN (SELECT id 
												FROM ${get_schema_name()}.language l
												WHERE l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
																		FROM ${get_schema_name()}.app_category_translation act1,
																			${get_schema_name()}.language l1
																		WHERE l1.id  = act1.language_id
																		AND act1.app_category_id  = act.app_category_id
																		AND l1.lang_code IN (:lang_code1, :lang_code2, :lang_code3)
																	)
												)
				ORDER BY 1`;
		parameters = {lang_code1: get_locale(lang_code, 1),
					  lang_code2: get_locale(lang_code, 2),
					  lang_code3: get_locale(lang_code, 3)
					 };
		let stack = new Error().stack;
		import(`file://${process.cwd()}/service/common/common.service.js`).then(({COMMON}) => {
			execute_db_sql(app_id, sql, parameters,
						COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result);
			});
		})
	}
const updateAppAdmin = (app_id, id, body, callBack) => {
		let sql;
		let parameters;
		sql = `UPDATE ${get_schema_name()}.app
				  SET app_name = :app_name,
					  url = :url,
				 	  logo = :logo,
					  enabled = :enabled
				WHERE id = :id`;
		parameters = {	app_name: body.app_name,
						url: body.url,
						logo: body.logo,
						enabled: body.enabled,
						id: id};
		let stack = new Error().stack;
		import(`file://${process.cwd()}/service/common/common.service.js`).then(({COMMON}) => {
			execute_db_sql(app_id, sql, parameters,
						COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result);
			});
		})
	}
export{getApp, getAppsAdmin, updateAppAdmin}