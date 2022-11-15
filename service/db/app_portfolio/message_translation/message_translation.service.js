const {execute_db_sql, get_schema_name} = require ("../../common/common.service");
module.exports = {
	getMessage: (app_id, data_app_id, code, lang_code, callBack) => {
		let sql;
    	let parameters;
		if (process.env.SERVICE_DB_USE==1){
			sql = `SELECT m.code,
						  m.message_level_id,
						  m.message_type_id,
						  mt.language_id,
						  l.lang_code,
						  mt.text,
						  am.app_id
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
										    AND l1.lang_code IN (:lang_code, SUBSTRING_INDEX(:lang_code,'-',2), SUBSTRING_INDEX(:lang_code,'-',1))
									    )`;
		}
		else if (process.env.SERVICE_DB_USE==2){
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
											AND l1.lang_code IN (:lang_code, SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
										  )`;
		}
		parameters = {
						app_id: data_app_id,
						code: code,
						lang_code: lang_code
					};
		execute_db_sql(app_id, sql, parameters, null, 
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
		if (process.env.SERVICE_DB_USE==1){
			sql = `SELECT m.code,
						  m.message_level_id,
						  m.message_type_id,
						  mt.language_id,
						  l.lang_code,
						  mt.text,
						  am.app_id
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
											 AND l1.lang_code IN (:lang_code, SUBSTRING_INDEX(:lang_code,'-',2), SUBSTRING_INDEX(:lang_code,'-',1))
										)`;
		}
		else if (process.env.SERVICE_DB_USE==2){
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
											AND l1.lang_code IN (:lang_code, SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
										)`;
		}
		parameters = {
						app_id: data_app_id,
						code: code,
						lang_code: lang_code
					};
		execute_db_sql(app_id, sql, parameters, true, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result[0]);
		});
	}
};