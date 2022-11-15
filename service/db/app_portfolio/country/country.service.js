const {execute_db_sql, get_schema_name, get_locale} = require ("../../common/common.service");
module.exports = {
        getCountries: (app_id, lang_code, callBack) => {
               let sql;
               let parameters;
               sql = `SELECT c.id "id",
                              c.country_code "country_code",
                              c.flag_emoji "flag_emoji",
                              ct.text "text",
                              cg.group_name "group_name"
                         FROM ${get_schema_name()}.country  c,
                              ${get_schema_name()}.country_group cg,
                              ${get_schema_name()}.country_translation ct
                        WHERE ct.country_id = c.id
                          AND cg.id = c.country_group_id
                          AND ct.language_id IN (SELECT id 
                                                   FROM ${get_schema_name()}.language l
                                                  WHERE l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
                                                                         FROM ${get_schema_name()}.country_translation ct1,
                                                                              ${get_schema_name()}.language l1
                                                                        WHERE ct1.country_id = ct.country_id
                                                                          AND l1.id = ct1.language_id
                                                                          AND l1.lang_code IN (:lang_code1, :lang_code2, :lang_code3)
                                                                      )
                                                 )
                         ORDER BY 5, 4`;
                parameters = {
                              lang_code1: get_locale(lang_code, 1),
                              lang_code2: get_locale(lang_code, 2),
                              lang_code3: get_locale(lang_code, 3)
                             };
                execute_db_sql(app_id, sql, parameters, null, 
                               __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
        }
};