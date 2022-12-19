const {execute_db_sql, get_schema_name, get_locale} = require (global.SERVER_ROOT + "/service/db/common/common.service");
module.exports = {
	getMessage: (app_id, data_app_id, code, lang_code, callBack) => {
		let sql;
    	let parameters;
		sql = `SELECT m.code "code",
					  m.message_level_id "message_level_id",
					  m.message_type_id "message_type_id",
					  mt.language_id "language_id",
					  l.lang_code "lang_code",
					  mt.text "text",
					  am.app_id "app_id"
				 FROM ${get_schema_name()}.message m,
					  ${get_schema_name()}.message_translation mt,
					  ${get_schema_name()}.app_message am,
					  ${get_schema_name()}.language l
				WHERE mt.language_id = l.id
				  AND mt.message_code = m.code
				  AND am.message_code = m.code
				  AND am.app_id = :app_id
				  AND m.code = :code
				  AND l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
									   FROM ${get_schema_name()}.message_translation mt1,
											${get_schema_name()}.language l1
									  WHERE mt1.message_code = mt.message_code
										AND l1.id = mt1.language_id
										AND l1.lang_code IN (:lang_code1, :lang_code2, :lang_code3)
									)`;
		parameters = {
						app_id: data_app_id,
						code: code,
						lang_code1: get_locale(lang_code, 1),
                  		lang_code2: get_locale(lang_code, 2),
                  		lang_code3: get_locale(lang_code, 3)
					};
		execute_db_sql(app_id, sql, parameters, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result[0]);
		});
	},
	getMessage_admin: (app_id, data_app_id, code, lang_code, callBack) => {
		let sql;
    	let parameters;
		sql = `SELECT m.code "code",
					  m.message_level_id "message_level_id",
					  m.message_type_id "message_type_id",
					  mt.language_id "language_id",
					  l.lang_code "lang_code",
					  mt.text "text",
					  am.app_id "app_id"
				 FROM ${get_schema_name()}.message m,
					  ${get_schema_name()}.message_translation mt,
					  ${get_schema_name()}.app_message am,
					  ${get_schema_name()}.language l
				WHERE mt.language_id = l.id
				  AND mt.message_code = m.code
				  AND am.message_code = m.code
				  AND am.app_id = :app_id
				  AND m.code = :code
				  AND l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
									   FROM ${get_schema_name()}.message_translation mt1,
											${get_schema_name()}.language l1
									  WHERE mt1.message_code = mt.message_code
										AND l1.id = mt1.language_id
										AND l1.lang_code IN (:lang_code1, :lang_code2, :lang_code3)
									)`;
		parameters = {
						app_id: data_app_id,
						code: code,
						lang_code1: get_locale(lang_code, 1),
                  		lang_code2: get_locale(lang_code, 2),
                  		lang_code3: get_locale(lang_code, 3)
					};
		execute_db_sql(app_id, sql, parameters,
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result[0]);
		});
	}
};