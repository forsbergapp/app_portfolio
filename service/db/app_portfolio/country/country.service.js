const {execute_db_sql} = require ("../../common/database");
module.exports = {
        getCountries: (app_id, lang_code, callBack) => {
                let sql;
                let parameters;
                if (process.env.SERVICE_DB_USE == 1) {
                        sql = `SELECT c.id,
                                      c.country_code,
                                      c.flag_emoji,
                                      ct.text,
                                      cg.group_name
                                 FROM ${process.env.SERVICE_DB_DB1_NAME}.country c,
                                      ${process.env.SERVICE_DB_DB1_NAME}.country_group cg,
                                      ${process.env.SERVICE_DB_DB1_NAME}.country_translation ct
                                WHERE ct.country_id = c.id
                                  AND cg.id = c.country_group_id
                                  AND ct.language_id IN (SELECT id 
                                                           FROM ${process.env.SERVICE_DB_DB1_NAME}.language l
                                                          WHERE l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
                                                                                 FROM ${process.env.SERVICE_DB_DB1_NAME}.country_translation ct1,
                                                                                      ${process.env.SERVICE_DB_DB1_NAME}.language l1
                                                                                WHERE ct1.country_id = ct.country_id
                                                                                  AND l1.id = ct1.language_id
                                                                                  AND l1.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
                                                                              )
                                                         )
                                ORDER BY 5, 4`;
                        parameters = [  lang_code,
                                        lang_code,
                                        lang_code];
                } else if (process.env.SERVICE_DB_USE == 2) {
                        sql = `SELECT c.id "id",
                                      c.country_code "country_code",
                                      c.flag_emoji "flag_emoji",
                                      ct.text "text",
                                      cg.group_name "group_name"
                                 FROM ${process.env.SERVICE_DB_DB2_NAME}.country  c,
                                      ${process.env.SERVICE_DB_DB2_NAME}.country_group cg,
                                      ${process.env.SERVICE_DB_DB2_NAME}.country_translation ct
                                WHERE ct.country_id = c.id
                                  AND cg.id = c.country_group_id
                                  AND ct.language_id IN (SELECT id 
                                                           FROM ${process.env.SERVICE_DB_DB2_NAME}.language l
                                                          WHERE l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
                                                                                 FROM ${process.env.SERVICE_DB_DB2_NAME}.country_translation ct1,
                                                                                      ${process.env.SERVICE_DB_DB2_NAME}.language l1
                                                                                WHERE ct1.country_id = ct.country_id
                                                                                  AND l1.id = ct1.language_id
                                                                                  AND l1.lang_code IN (:lang_code, SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
                                                                              )
                                                        )
                                ORDER BY 5, 4`;
                        parameters = {
                                        lang_code: lang_code
                                     };
                }
                execute_db_sql(app_id, sql, parameters, null, 
                               __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
        }
};