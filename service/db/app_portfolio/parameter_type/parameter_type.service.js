const {execute_db_sql, get_schema_name, get_locale} = require ("../../common/common.service");
module.exports = {
	getParameterTypeAdmin: (app_id, id, lang_code, callBack) => {
		let sql;
    	let parameters;
		sql = `SELECT pt.id "id",
					  pt.parameter_type_name "parameter_type_name",
					  ptt.text "parameter_type_text"
				 FROM ${get_schema_name()}.parameter_type pt
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
				WHERE id = COALESCE(:id, id)
				ORDER BY 1`;
		parameters = {lang_code1: get_locale(lang_code, 1),
					  lang_code2: get_locale(lang_code, 2),
					  lang_code3: get_locale(lang_code, 3),
					  id: id};
		execute_db_sql(app_id, sql, parameters, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	}
};