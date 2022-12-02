const {execute_db_sql, get_schema_name, get_locale} = require ("../../common/common.service");
module.exports = {
	getAppCategoryAdmin:(app_id, id, lang_code, callBack) => {
		let sql;
		let parameters;
		sql = `SELECT ac.id "id",
					  ac.category_name "category_name",
					  act.text "app_category_text"
				 FROM ${get_schema_name()}.app_category ac
				 LEFT OUTER JOIN ${get_schema_name()}.app_category_translation act
					ON act.app_category_id = ac.id
					AND act.language_id IN (SELECT id 
											  FROM ${get_schema_name()}.language l
											 WHERE l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
																	FROM ${get_schema_name()}.app_category_translation act1,
																		 ${get_schema_name()}.language l1
																   WHERE l1.id  = act1.language_id
																	 AND act1.app_category_id  = ac.id
																	 AND l1.lang_code IN (:lang_code1, :lang_code2, :lang_code3)
																 )
											)
				WHERE ac.id = COALESCE(:id, ac.id)
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