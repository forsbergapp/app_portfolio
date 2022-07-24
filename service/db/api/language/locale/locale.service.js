const {execute_db_sql} = require ("../../../config/database");
module.exports = {
	getLocales: (app_id, lang_code, callBack) => {
    let sql;
    let parameters;
    if (process.env.SERVICE_DB_USE == 1) {
      sql = `SELECT   CONCAT(l.lang_code, CASE 
                                          WHEN c.country_code IS NOT NULL THEN 
                                            CONCAT('-', c.country_code) 
                                          ELSE 
                                            '' 
                                          END) locale, 
                                          CONCAT(UPPER(SUBSTR(CONCAT(language_translation.text, 
                                            CASE 
                                            WHEN ct.text IS NOT NULL THEN 
                                              CONCAT(' (', CONCAT(ct.text,')')) 
                                            ELSE 
                                              '' 
                                            END),1,1)),SUBSTR(CONCAT(language_translation.text, 
                                                                      CASE 
                                                                      WHEN ct.text IS NOT NULL THEN 
                                                                        CONCAT(' (', CONCAT(ct.text,')')) 
                                                                      ELSE 
                                                                        '' 
                                                                      END),2)) text
                                  FROM  ${process.env.SERVICE_DB_DB1_NAME}.language l,
                                  ${process.env.SERVICE_DB_DB1_NAME}.language_translation,
                                  ${process.env.SERVICE_DB_DB1_NAME}.locale loc
                                  LEFT OUTER JOIN ${process.env.SERVICE_DB_DB1_NAME}.country c
                                  ON c.id= loc.country_id
                                  LEFT OUTER JOIN ${process.env.SERVICE_DB_DB1_NAME}.country_translation ct
                                  ON ct.country_id = loc.country_id
                                  WHERE l.id = loc.language_id
                                  AND language_translation.language_id = l.id
                                  AND language_translation.language_translation_id IN 
                                  (SELECT id 
                                  FROM ${process.env.SERVICE_DB_DB1_NAME}.language l2
                                  WHERE (l2.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
                                  OR (l2.lang_code = 'en'
                                  AND NOT EXISTS(SELECT NULL
                                          FROM  ${process.env.SERVICE_DB_DB1_NAME}.language_translation lt1,
                                                ${process.env.SERVICE_DB_DB1_NAME}.language l1
                                          WHERE l1.id  = lt1.language_translation_id
                                          AND lt1.language_id = l.id
                                          AND l1.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
                                      )
                                  )
                                  )
                                  )
                                  AND ct.language_id IN 
                                  (SELECT id 
                                  FROM language l2
                                  WHERE (l2.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
                                  OR (l2.lang_code = 'en'
                                  AND NOT EXISTS(SELECT NULL
                                          FROM  ${process.env.SERVICE_DB_DB1_NAME}.country_translation ct1,
                                                ${process.env.SERVICE_DB_DB1_NAME}.language l1
                                          WHERE l1.id = ct1.language_id
                                          AND  ct1.country_id = c.id
                                          AND l1.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
                                      )
                                  )
                                  )
                                  )
                                  UNION
                                  SELECT  l.lang_code locale,
                                  CONCAT(UPPER(SUBSTR(lt.text,1,1)), SUBSTR(lt.text,2)) text
                                  FROM  ${process.env.SERVICE_DB_DB1_NAME}.language l,
                                  ${process.env.SERVICE_DB_DB1_NAME}.language_translation lt
                                  WHERE lt.language_id = l.id
                                  AND INSTR(l.lang_code,'-') = 0
                                  AND lt.language_translation_id IN 
                                  (SELECT id 
                                  FROM ${process.env.SERVICE_DB_DB1_NAME}.language l2
                                  WHERE (l2.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
                                  OR (l2.lang_code = 'en'
                                  AND NOT EXISTS(SELECT NULL
                                                  FROM  ${process.env.SERVICE_DB_DB1_NAME}.language_translation lt1,
                                                        ${process.env.SERVICE_DB_DB1_NAME}.language l1
                                                  WHERE l1.id  = lt1.language_translation_id
                                                  AND lt1.language_id = l.id
                                                  AND l1.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
                                              )
                                          )
                                        )
                                  )
                                  ORDER BY 2 `;
      parameters = [lang_code,
                    lang_code,
                    lang_code,
                    lang_code,
                    lang_code,
                    lang_code,
                    lang_code,
                    lang_code,
                    lang_code,
                    lang_code,
                    lang_code,
                    lang_code,
                    lang_code,
                    lang_code,
                    lang_code,
                    lang_code,
                    lang_code,
                    lang_code];
    }else if (process.env.SERVICE_DB_USE==2){
      sql = `SELECT CONCAT(l.lang_code, CASE 
                                        WHEN c.country_code IS NOT NULL THEN 
                                          CONCAT('-', c.country_code) 
                                        ELSE 
                                          '' 
                                        END) "locale", 
                                CONCAT(UPPER(SUBSTR(CONCAT(language_translation.text, 
                                                CASE 
                                                WHEN ct.text IS NOT NULL THEN 
                                                  CONCAT(' (', CONCAT(ct.text,')')) 
                                                ELSE 
                                                  '' 
                                                END),1,1)),SUBSTR(CONCAT(language_translation.text, 
                                                                          CASE 
                                                                          WHEN ct.text IS NOT NULL THEN 
                                                                            CONCAT(' (', CONCAT(ct.text,')')) 
                                                                          ELSE 
                                                                            '' 
                                                                          END),2)) "text"
                                FROM  ${process.env.SERVICE_DB_DB2_NAME}.language l,
                                ${process.env.SERVICE_DB_DB2_NAME}.language_translation,
                                ${process.env.SERVICE_DB_DB2_NAME}.locale loc
                                LEFT OUTER JOIN ${process.env.SERVICE_DB_DB2_NAME}.country c
                                ON c.id= loc.country_id
                                LEFT OUTER JOIN ${process.env.SERVICE_DB_DB2_NAME}.country_translation ct
                                ON ct.country_id = loc.country_id
                                WHERE l.id = loc.language_id
                                AND language_translation.language_id = l.id
                                AND language_translation.language_translation_id IN 
                                (SELECT id 
                                FROM ${process.env.SERVICE_DB_DB2_NAME}.language l2
                                WHERE (l2.lang_code IN (:lang_code, 
                                          SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), 
                                          SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
                                OR (l2.lang_code = 'en'
                                AND NOT EXISTS(SELECT NULL
                                            FROM  ${process.env.SERVICE_DB_DB2_NAME}.language_translation lt1,
                                                  ${process.env.SERVICE_DB_DB2_NAME}.language l1
                                            WHERE l1.id  = lt1.language_translation_id
                                            AND lt1.language_id = l.id
                                            AND l1.lang_code IN (:lang_code, SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
                                        )
                                )
                                )
                                )
                                AND ct.language_id IN 
                                (SELECT id 
                                FROM ${process.env.SERVICE_DB_DB2_NAME}.language l2
                                WHERE (l2.lang_code IN (:lang_code, 
                                          SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), 
                                          SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
                                OR (l2.lang_code = 'en'
                                AND NOT EXISTS(SELECT NULL
                                        FROM  ${process.env.SERVICE_DB_DB2_NAME}.country_translation ct1,
                                              ${process.env.SERVICE_DB_DB2_NAME}.language l1
                                        WHERE l1.id = ct1.language_id
                                        AND  ct1.country_id = c.id
                                        AND l1.lang_code IN (:lang_code, SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
                                    )
                                )
                                )
                                )
                                UNION
                                SELECT l.lang_code locale,
                                CONCAT(UPPER(SUBSTR(lt.text,1,1)), SUBSTR(lt.text,2)) text
                                FROM  ${process.env.SERVICE_DB_DB2_NAME}.language l,
                                ${process.env.SERVICE_DB_DB2_NAME}.language_translation lt
                                WHERE lt.language_id = l.id
                                AND INSTR(l.lang_code,'-') = 0
                                AND lt.language_translation_id IN 
                                (SELECT id 
                                FROM ${process.env.SERVICE_DB_DB2_NAME}.language l2
                                WHERE (l2.lang_code IN (:lang_code, 
                                                  SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), 
                                                  SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
                                OR (l2.lang_code = 'en'
                                  AND NOT EXISTS(SELECT NULL
                                                  FROM  ${process.env.SERVICE_DB_DB2_NAME}.language_translation lt1,
                                                        ${process.env.SERVICE_DB_DB2_NAME}.language l1
                                                  WHERE l1.id  = lt1.language_translation_id
                                                  AND lt1.language_id = l.id
                                                  AND l1.lang_code IN (:lang_code, SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
                                              )
                                          )
                                        )
                                )
                                ORDER BY 2`;
      parameters = {
                    lang_code: lang_code
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