const {execute_db_sql, get_schema_name, get_locale} = require (global.SERVER_ROOT + "/service/db/common/common.service");
module.exports = {
	getAppRoleAdmin:(app_id, id, lang_code, callBack) => {
		let sql;
		let parameters;
        sql = `SELECT ar.id "id",
                      ar.role_name "role_name",
                      ar.icon "icon"
                 FROM ${get_schema_name()}.app_role ar
                WHERE ar.id = COALESCE(:id, ar.id)
                ORDER BY 1`;
        /* SQL when app_role_translation implemented:
		sql = `SELECT ar.id "id",
					  ar.role_name "role_name",
					  art.text "app_role_text",
                      ar.icon "icon",
				 FROM ${get_schema_name()}.app_role ar
				 LEFT OUTER JOIN ${get_schema_name()}.app_role_translation art
					ON art.app_role_id = ac.id
					AND art.language_id IN (SELECT id 
											  FROM ${get_schema_name()}.language l
											 WHERE l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
																	FROM ${get_schema_name()}.app_role_translation art1,
																		 ${get_schema_name()}.language l1
																   WHERE l1.id  = art1.language_id
																	 AND art1.app_role_id  = ar.id
																	 AND l1.lang_code IN (:lang_code1, :lang_code2, :lang_code3)
																 )
											)
				WHERE ar.id = COALESCE(:id, ar.id)
				ORDER BY 1`;
        */
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