const {db_execute, db_schema, get_locale} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);

const getParameterTypeAdmin = (app_id, id, lang_code, callBack) => {
		const sql = `SELECT pt.id "id",
					  pt.parameter_type_name "parameter_type_name",
					  ptt.text "parameter_type_text"
				 FROM ${db_schema()}.parameter_type pt
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
				WHERE id = COALESCE(:id, id)
				ORDER BY 1`;
		const parameters = {lang_code1: get_locale(lang_code, 1),
							lang_code2: get_locale(lang_code, 2),
							lang_code3: get_locale(lang_code, 3),
							id: id};
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	};
export{getParameterTypeAdmin};