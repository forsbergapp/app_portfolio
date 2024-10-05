/** @module server/db/sql/locale */

/**@type{import('../../db/common.service.js')} */
const {db_execute} = await import(`file://${process.cwd()}/server/db/common.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {string} lang_code 
 * @returns {Promise.<import('../../types.js').server_db_sql_result_locale_getLocales[]>}
 */
const getLocales = async (app_id, lang_code) => {
    const sql = `SELECT CONCAT(l2.lang_code, CASE 
                                        WHEN c.country_code IS NOT NULL THEN 
                                          CONCAT('-', c.country_code) 
                                        ELSE 
                                          '' 
                                        END) "locale",
                  (SELECT CONCAT(UPPER(SUBSTR(CONCAT(lt.text, 
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
                                                END),2))
                    FROM <DB_SCHEMA/>.language l3,
                         <DB_SCHEMA/>.app_translation ct
                    WHERE ct.country_id = c.id
                      AND ct.language_id = l3.id
                      AND l3.lang_code = (
                                          SELECT COALESCE(MAX(l1.lang_code), :lang_code_default)
                                            FROM <DB_SCHEMA/>.app_translation ct1,
                                                  <DB_SCHEMA/>.language l1
                                            WHERE l1.id  = ct1.language_id
                                              AND ct1.country_id = c.id
                                              AND l1.lang_code IN (<LOCALE/>)
                                        )
                  )  "text"
             FROM <DB_SCHEMA/>.app_translation lt,
                  <DB_SCHEMA/>.language l2,
                  <DB_SCHEMA/>.country c
            WHERE l2.id = lt.language_id
              AND EXISTS( SELECT NULL
                            FROM <DB_SCHEMA/>.locale loc
                           WHERE loc.country_id = c.id
                             AND loc.language_id = l2.id)
              AND lt.language_id_translation = (SELECT l3.id
                                                  FROM <DB_SCHEMA/>.language l3
                                                 WHERE l3.lang_code = (
                                                      SELECT COALESCE(MAX(l4.lang_code),:lang_code_default)
                                                        FROM <DB_SCHEMA/>.app_translation lt4,
                                                             <DB_SCHEMA/>.language l4
                                                       WHERE l4.id  = lt4.language_id_translation
                                                         AND lt4.language_id = l2.id
                                                         AND l4.lang_code IN (<LOCALE/>)
                                                                      )
                                               )
          UNION ALL
          SELECT l2.lang_code "locale",
                 CONCAT(UPPER(SUBSTR(lt.text,1,1)), SUBSTR(lt.text,2)) "text"
            FROM <DB_SCHEMA/>.app_translation lt,
                 <DB_SCHEMA/>.language l2
           WHERE l2.lang_code NOT LIKE '%-%'
             AND l2.id = lt.language_id
             AND lt.language_id_translation = (SELECT l3.id
                                                 FROM <DB_SCHEMA/>.language l3
                                                WHERE l3.lang_code = (
                                                      SELECT COALESCE(MAX(l4.lang_code),:lang_code_default)
                                                        FROM <DB_SCHEMA/>.app_translation lt4,
                                                             <DB_SCHEMA/>.language l4
                                                       WHERE l4.id  = lt4.language_id_translation
                                                         AND lt4.language_id = l2.id
                                                         AND l4.lang_code IN (<LOCALE/>)
                                                                      )
                                              )
              AND  EXISTS(SELECT NULL
                            FROM <DB_SCHEMA/>.locale loc
                           WHERE loc.language_id = l2.id)
          ORDER BY 2`;
    const parameters = {lang_code_default: 'en'};
    return await db_execute(app_id, sql, parameters, null, lang_code);
};
export{getLocales};