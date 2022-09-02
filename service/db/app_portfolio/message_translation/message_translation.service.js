const {execute_db_sql} = require ("../../common/database");
module.exports = {
	getMessage: (code, data_app_id, app_id, lang_code, callBack) => {
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
					 FROM ${process.env.SERVICE_DB_DB1_NAME}.message m,
						  ${process.env.SERVICE_DB_DB1_NAME}.message_translation mt,
						  ${process.env.SERVICE_DB_DB1_NAME}.app_message am,
						  ${process.env.SERVICE_DB_DB1_NAME}.language l
					WHERE mt.language_id = l.id
					  AND mt.message_code = m.code
					  AND am.message_code = m.code
					  AND am.app_id = ?
					  AND m.code = ?
					  AND l.lang_code = (SELECT COALESCE(MIN(l1.lang_code),'en')
										   FROM ${process.env.SERVICE_DB_DB1_NAME}.message_translation mt1,
											    ${process.env.SERVICE_DB_DB1_NAME}.language l1
										  WHERE mt1.message_code = mt.message_code
 										    AND l1.id = mt1.language_id
										    AND l1.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
									    )`;
			parameters = [	data_app_id,
							code,
							lang_code,
							lang_code,
							lang_code
							];
		}
		else if (process.env.SERVICE_DB_USE==2){
			sql = `SELECT m.code "code",
						  m.message_level_id "message_level_id",
						  m.message_type_id "message_type_id",
						  mt.language_id "language_id",
						  l.lang_code "lang_code",
						  mt.text "text",
						  am.app_id "app_id"
					 FROM ${process.env.SERVICE_DB_DB2_NAME}.message m,
						  ${process.env.SERVICE_DB_DB2_NAME}.message_translation mt,
						  ${process.env.SERVICE_DB_DB2_NAME}.app_message am,
						  ${process.env.SERVICE_DB_DB2_NAME}.language l
					WHERE mt.language_id = l.id
					  AND mt.message_code = m.code
					  AND am.message_code = m.code
					  AND am.app_id = :app_id
					  AND m.code = :code
					  AND l.lang_code = (SELECT NVL(MIN(l1.lang_code),'en')
										   FROM ${process.env.SERVICE_DB_DB2_NAME}.message_translation mt1,
												${process.env.SERVICE_DB_DB2_NAME}.language l1
										  WHERE mt1.message_code = mt.message_code
											AND l1.id = mt1.language_id
											AND l1.lang_code IN (:lang_code, SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
										  )`;
			parameters = {
							app_id: data_app_id,
							code: code,
							lang_code: lang_code
						 };
		}
		execute_db_sql(data_app_id, app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result[0]);
		});
	},
	getMessage_admin: (code, app_id, lang_code, callBack) => {
		let sql;
    	let parameters;
		if (process.env.SERVICE_DB_USE==1){
			sql = `SELECT m.code "code",
						  m.message_level_id "message_level_id",
						  m.message_type_id "message_type_id",
						  mt.language_id "language_id",
						  l.lang_code "lang_code",
						  mt.text "text",
						  am.app_id "app_id"
				     FROM ${process.env.SERVICE_DB_DB2_NAME}.message m,
						  ${process.env.SERVICE_DB_DB2_NAME}.message_translation mt,
						  ${process.env.SERVICE_DB_DB2_NAME}.app_message am,
						  ${process.env.SERVICE_DB_DB2_NAME}.language l
				    WHERE mt.language_id = l.id
  					  AND mt.message_code = m.code
					  AND am.message_code = m.code
					  AND am.app_id = :app_id
					  AND m.code = :code
					  AND l.lang_code = (SELECT NVL(MIN(l1.lang_code),'en')
										   FROM ${process.env.SERVICE_DB_DB2_NAME}.message_translation mt1,
  											    ${process.env.SERVICE_DB_DB2_NAME}.language l1
										  WHERE mt1.message_code = mt.message_code
										    AND l1.id = mt1.language_id
										    AND l1.lang_code IN (:lang_code, SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
										)`;
			parameters = [	app_id,
							code,
							lang_code,
							lang_code,
							lang_code,
							lang_code,
							lang_code,
							lang_code
							];
		}
		else if (process.env.SERVICE_DB_USE==2){
			sql = `SELECT m.code "code",
					      m.message_level_id "message_level_id",
						  m.message_type_id "message_type_id",
						  mt.language_id "language_id",
						  l.lang_code "lang_code",
						  mt.text "text",
						  am.app_id "app_id"
					 FROM ${process.env.SERVICE_DB_DB2_NAME}.message m,
						  ${process.env.SERVICE_DB_DB2_NAME}.message_translation mt,
						  ${process.env.SERVICE_DB_DB2_NAME}.app_message am,
						  ${process.env.SERVICE_DB_DB2_NAME}.language l
					WHERE mt.language_id = l.id
					  AND mt.message_code = m.code
					  AND am.message_code = m.code
					  AND am.app_id = :app_id
					  AND m.code = :code
					  AND l.lang_code = (SELECT NVL(MIN(l1.lang_code),'en')
										   FROM ${process.env.SERVICE_DB_DB2_NAME}.message_translation mt1,
												${process.env.SERVICE_DB_DB2_NAME}.language l1
										  WHERE mt1.message_code = mt.message_code
											AND l1.id = mt1.language_id
											AND l1.lang_code IN (:lang_code, SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
										)`;
			parameters = {
							app_id: app_id,
							code: code,
							lang_code: lang_code
						 };
		}
		execute_db_sql(app_id, null, sql, parameters, true, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result[0]);
		});
	}
};