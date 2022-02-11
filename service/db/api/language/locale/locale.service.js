const {pool, oracledb, oracle_options}  = require ("../../../config/database");

module.exports = {
	getLocales: (lang_code, callBack) => {
    if (process.env.SERVICE_DB_USE == 1) {
      pool.query(
        `SELECT DISTINCT  
                  CONCAT(l.lang_code, CASE 
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
            FROM language l,
                  language_translation,
                  locale loc
                  LEFT OUTER JOIN country c
                  ON c.id= loc.country_id
                  LEFT OUTER JOIN country_translation ct
                  ON ct.country_id = loc.country_id
            WHERE l.id = loc.language_id
              AND language_translation.language_id = l.id
              AND language_translation.language_translation_id IN 
              (SELECT id 
                FROM language l2
                WHERE (l2.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
                  OR (l2.lang_code = 'en'
                      AND NOT EXISTS(SELECT NULL
                                      FROM language_translation lt1,
                                           language l1
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
                                      FROM country_translation ct1,
                                           language l1
                                      WHERE l1.id = ct1.language_id
                                      AND  ct1.country_id = c.id
                                      AND l1.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
                                  )
                        )
                      )
              )
            ORDER BY 2 `,
        [lang_code,
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
         lang_code],
        (error, results, fields) => {
          if (error){
            return callBack(error);
          }
          return callBack(null, results);
        }
      );
    }else if (process.env.SERVICE_DB_USE==2){
			async function execute_sql(err, result){
				try{
				const pool2 = await oracledb.getConnection();
				const result = await pool2.execute(
					`SELECT CONCAT(l.lang_code, CASE 
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
            FROM language l,
                  language_translation,
                  locale loc
                  LEFT OUTER JOIN country c
                  ON c.id= loc.country_id
                  LEFT OUTER JOIN country_translation ct
                  ON ct.country_id = loc.country_id
            WHERE l.id = loc.language_id
              AND language_translation.language_id = l.id
              AND language_translation.language_translation_id IN 
                  (SELECT id 
                    FROM language l2
                    WHERE (l2.lang_code IN (:lang_code, 
                                        SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), 
                                        SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
                      OR (l2.lang_code = 'en'
                          AND NOT EXISTS(SELECT NULL
                                          FROM language_translation lt1,
                                            language l1
                                          WHERE l1.id  = lt1.language_translation_id
                                          AND lt1.language_id = l.id
                                          AND l1.lang_code IN (:lang_code, SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
                                      )
                          )
                        )
                )
              AND ct.language_id IN 
              (SELECT id 
                FROM language l2
                WHERE (l2.lang_code IN (:lang_code, 
                                        SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), 
                                        SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
                  OR (l2.lang_code = 'en'
                      AND NOT EXISTS(SELECT NULL
                                      FROM country_translation ct1,
                                            language l1
                                      WHERE l1.id = ct1.language_id
                                      AND  ct1.country_id = c.id
                                      AND l1.lang_code IN (:lang_code, SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
                                  )
                        )
                      )
              )
          ORDER BY 2`,
					{
						lang_code: lang_code
					},
					oracle_options, (err,result) => {
						if (err) {
							return callBack(err);
						}
						else{
                return callBack(null, result.rows);
						}
					});
          await pool2.close();
				}catch (err) {
					return callBack(err.message);
				} finally {
					null;
				}
			}
			execute_sql();
		}
	}
};