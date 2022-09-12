const {execute_db_sql} = require ("../../../common/database");
module.exports = {
	getLocales: (app_id, lang_code, callBack) => {
    let sql;
    let parameters;
    let default_language_id = 147;
    if (process.env.SERVICE_DB_USE == 1) {
      sql = `SELECT   CONCAT(l2.lang_code, CASE 
                                          WHEN c.country_code IS NOT NULL THEN 
                                            CONCAT('-', c.country_code) 
                                          ELSE 
                                            '' 
                                          END) locale, 
                      CONCAT(UPPER(SUBSTR(CONCAT(lt.text, 
                            CASE 
                            WHEN ct.text IS NOT NULL THEN 
                              CONCAT(' (', CONCAT(ct.text,')')) 
                            ELSE 
                              '' 
                            END),1,1)),SUBSTR(CONCAT(lt.text, 
                                                      CASE 
                                                      WHEN ct.text IS NOT NULL THEN 
                                                        CONCAT(' (', CONCAT(ct.text,')')) 
                                                      ELSE 
                                                        '' 
                                                      END),2)) text
              FROM ${process.env.SERVICE_DB_DB1_NAME}.language_translation lt,
                   ${process.env.SERVICE_DB_DB1_NAME}.language l2,
                   ${process.env.SERVICE_DB_DB1_NAME}.country c,
                   ${process.env.SERVICE_DB_DB1_NAME}.country_translation ct
             WHERE l2.id = lt.language_id
               AND ct.country_id = c.id
               AND EXISTS( SELECT NULL
                             FROM ${process.env.SERVICE_DB_DB1_NAME}.locale loc
                            WHERE loc.country_id = c.id
                              AND loc.language_id = lt.language_id)
               AND lt.language_translation_id = (SELECT COALESCE(MIN(l3.id),?)
                                                   FROM ${process.env.SERVICE_DB_DB1_NAME}.language l3
                                                  WHERE l3.lang_code = (
                                                        SELECT MAX(l4.lang_code )
                                                          FROM ${process.env.SERVICE_DB_DB1_NAME}.language_translation lt4,
                                                               ${process.env.SERVICE_DB_DB1_NAME}.language l4
                                                         WHERE l4.id  = lt4.language_translation_id
                                                           AND lt4.language_id = l2.id
                                                           AND l4.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
                                                                        )
                                                )
               AND ct.language_id = (SELECT COALESCE(MIN(l3.id),?)
                                       FROM ${process.env.SERVICE_DB_DB1_NAME}.language l3
                                      WHERE l3.lang_code = (
                                            SELECT MAX(l1.lang_code )
                                              FROM ${process.env.SERVICE_DB_DB1_NAME}.country_translation ct1,
                                                  ${process.env.SERVICE_DB_DB1_NAME}.language l1
                                            WHERE l1.id  = ct1.language_id
                                              AND ct1.country_id = c.id
                                              AND l1.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
                                                            )
                                    )
            UNION ALL
            SELECT l2.lang_code locale,
                   CONCAT(UPPER(SUBSTR(lt.text,1,1)), SUBSTR(lt.text,2)) text
              FROM ${process.env.SERVICE_DB_DB1_NAME}.language_translation lt,
                   ${process.env.SERVICE_DB_DB1_NAME}.language l2
             WHERE INSTR(l2.lang_code,'-') = 0
               AND l2.id = lt.language_id
               AND lt.language_translation_id = (SELECT COALESCE(MIN(l3.id),?)
                                                   FROM ${process.env.SERVICE_DB_DB1_NAME}.language l3
                                                  WHERE l3.lang_code = (
                                                        SELECT MAX(l4.lang_code )
                                                          FROM ${process.env.SERVICE_DB_DB1_NAME}.language_translation lt4,
                                                               ${process.env.SERVICE_DB_DB1_NAME}.language l4
                                                         WHERE l4.id  = lt4.language_translation_id
                                                           AND lt4.language_id = l2.id
                                                           AND l4.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
                                                                        )
                                                )
               AND  EXISTS(SELECT NULL
                             FROM ${process.env.SERVICE_DB_DB1_NAME}.locale loc
                            WHERE loc.language_id = lt.language_id)
            ORDER BY 2 `;
      parameters = [default_language_id,
                    lang_code,
                    lang_code,
                    lang_code,
                    default_language_id,
                    lang_code,
                    lang_code,
                    lang_code,
                    default_language_id,
                    lang_code,
                    lang_code,
                    lang_code];
    }else if (process.env.SERVICE_DB_USE==2){
      sql = `SELECT CONCAT(l2.lang_code, CASE 
                                          WHEN c.country_code IS NOT NULL THEN 
                                            CONCAT('-', c.country_code) 
                                          ELSE 
                                            '' 
                                          END) "locale", 
                          CONCAT(UPPER(SUBSTR(CONCAT(lt.text, 
                          CASE 
                          WHEN ct.text IS NOT NULL THEN 
                          CONCAT(' (', CONCAT(ct.text,')')) 
                          ELSE 
                          '' 
                          END),1,1)),SUBSTR(CONCAT(lt.text, 
                                              CASE 
                                              WHEN ct.text IS NOT NULL THEN 
                                                CONCAT(' (', CONCAT(ct.text,')')) 
                                              ELSE 
                                                '' 
                                              END),2)) "text"
             FROM ${process.env.SERVICE_DB_DB2_NAME}.language_translation lt,
                  ${process.env.SERVICE_DB_DB2_NAME}.language l2,
                  ${process.env.SERVICE_DB_DB2_NAME}.country c,
                  ${process.env.SERVICE_DB_DB2_NAME}.country_translation ct
            WHERE l2.id = lt.language_id
              AND ct.country_id = c.id
              AND EXISTS( SELECT NULL
                            FROM ${process.env.SERVICE_DB_DB2_NAME}.locale loc
                           WHERE loc.country_id = c.id
                             AND loc.language_id = lt.language_id)
              AND lt.language_translation_id = (SELECT NVL(MIN(l3.id),:default_language_id)
                                                  FROM ${process.env.SERVICE_DB_DB2_NAME}.language l3
                                                  WHERE l3.lang_code = (
                                                        SELECT MAX(l4.lang_code )
                                                          FROM ${process.env.SERVICE_DB_DB2_NAME}.language_translation lt4,
                                                               ${process.env.SERVICE_DB_DB2_NAME}.language l4
                                                         WHERE l4.id  = lt4.language_translation_id
                                                           AND lt4.language_id = l2.id
                                                           AND l4.lang_code IN (:lang_code, SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
                                                                        )
                                                )
              AND ct.language_id = (SELECT NVL(MIN(l3.id),:default_language_id)
                                      FROM ${process.env.SERVICE_DB_DB2_NAME}.language l3
                                      WHERE l3.lang_code = (
                                            SELECT MAX(l1.lang_code )
                                              FROM ${process.env.SERVICE_DB_DB2_NAME}.country_translation ct1,
                                                   ${process.env.SERVICE_DB_DB2_NAME}.language l1
                                             WHERE l1.id  = ct1.language_id
                                               AND ct1.country_id = c.id
                                               AND l1.lang_code IN (:lang_code, SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
                                                            )
                                    )
            UNION ALL
            SELECT l2.lang_code "locale",
                   CONCAT(UPPER(SUBSTR(lt.text,1,1)), SUBSTR(lt.text,2)) "text"
              FROM ${process.env.SERVICE_DB_DB2_NAME}.language_translation lt,
                   ${process.env.SERVICE_DB_DB2_NAME}.language l2
             WHERE INSTR(l2.lang_code,'-') = 0
               AND l2.id = lt.language_id
               AND lt.language_translation_id = (SELECT NVL(MIN(l3.id),:default_language_id)
                                                   FROM ${process.env.SERVICE_DB_DB2_NAME}.language l3
                                                  WHERE l3.lang_code = (
                                                        SELECT MAX(l4.lang_code )
                                                          FROM ${process.env.SERVICE_DB_DB2_NAME}.language_translation lt4,
                                                               ${process.env.SERVICE_DB_DB2_NAME}.language l4
                                                         WHERE l4.id  = lt4.language_translation_id
                                                           AND lt4.language_id = l2.id
                                                           AND l4.lang_code IN (:lang_code, SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
                                                                        )
                                                )
               AND  EXISTS(SELECT NULL
                             FROM ${process.env.SERVICE_DB_DB2_NAME}.locale loc
                            WHERE loc.language_id = lt.language_id)
            ORDER BY 2`;
      parameters = {
                    lang_code: lang_code,
                    default_language_id: default_language_id
                   };
		}
    execute_db_sql(app_id, app_id, sql, parameters, null, 
                   __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	}
};