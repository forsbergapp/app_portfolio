const {db_execute, db_schema, get_locale} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);

const getLocales = (app_id, lang_code, callBack) => {
    const sql = `SELECT CONCAT(l2.lang_code, CASE 
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
             FROM ${db_schema()}.language_translation lt,
                  ${db_schema()}.language l2,
                  ${db_schema()}.country c,
                  ${db_schema()}.country_translation ct
            WHERE l2.id = lt.language_id
              AND ct.country_id = c.id
              AND EXISTS( SELECT NULL
                            FROM ${db_schema()}.locale loc
                           WHERE loc.country_id = c.id
                             AND loc.language_id = lt.language_id)
              AND lt.language_translation_id = (SELECT l3.id
                                                  FROM ${db_schema()}.language l3
                                                 WHERE l3.lang_code = (
                                                      SELECT COALESCE(MAX(l4.lang_code),:lang_code_default)
                                                        FROM ${db_schema()}.language_translation lt4,
                                                             ${db_schema()}.language l4
                                                       WHERE l4.id  = lt4.language_translation_id
                                                         AND lt4.language_id = l2.id
                                                         AND l4.lang_code IN (:lang_code1, :lang_code2, :lang_code3)
                                                                      )
                                               )
              AND ct.language_id = (SELECT l3.id
                                      FROM ${db_schema()}.language l3
                                     WHERE l3.lang_code = (
                                          SELECT COALESCE(MAX(l1.lang_code), :lang_code_default)
                                            FROM ${db_schema()}.country_translation ct1,
                                                 ${db_schema()}.language l1
                                           WHERE l1.id  = ct1.language_id
                                             AND ct1.country_id = c.id
                                             AND l1.lang_code IN (:lang_code1, :lang_code2, :lang_code3)
                                                          )
                                   )
          UNION ALL
          SELECT l2.lang_code "locale",
                 CONCAT(UPPER(SUBSTR(lt.text,1,1)), SUBSTR(lt.text,2)) "text"
            FROM ${db_schema()}.language_translation lt,
                 ${db_schema()}.language l2
           WHERE l2.lang_code NOT LIKE '%-%'
             AND l2.id = lt.language_id
             AND lt.language_translation_id = (SELECT l3.id
                                                 FROM ${db_schema()}.language l3
                                                WHERE l3.lang_code = (
                                                      SELECT COALESCE(MAX(l4.lang_code),:lang_code_default)
                                                        FROM ${db_schema()}.language_translation lt4,
                                                             ${db_schema()}.language l4
                                                       WHERE l4.id  = lt4.language_translation_id
                                                         AND lt4.language_id = l2.id
                                                         AND l4.lang_code IN (:lang_code1, :lang_code2, :lang_code3)
                                                                      )
                                              )
              AND  EXISTS(SELECT NULL
                            FROM ${db_schema()}.locale loc
                           WHERE loc.language_id = lt.language_id)
          ORDER BY 2`;
    const parameters = {lang_code_default: 'en',
                  lang_code1: get_locale(lang_code, 1),
                  lang_code2: get_locale(lang_code, 2),
                  lang_code3: get_locale(lang_code, 3)
                };
    db_execute(app_id, sql, parameters, null, (err, result)=>{
      if (err)
        return callBack(err, null);
      else
        return callBack(null, result);
    });
};
export{getLocales};