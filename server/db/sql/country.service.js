/** @module server/db/sql */

/**@type{import('../../db/common.service.js')} */
const {db_execute} = await import(`file://${process.cwd()}/server/db/common.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {string} lang_code 
 * @returns {Promise.<import('../../../types.js').db_result_country_getCountries[]>}
 */
const getCountries = async (app_id, lang_code) => {
     const sql = `SELECT c.id "id",
                         c.country_code "country_code",
                         c.flag_emoji "flag_emoji",
                         ct.text "text",
                         cg.group_name "group_name"
                    FROM <DB_SCHEMA/>.country  c,
                         <DB_SCHEMA/>.country_group cg,
                         <DB_SCHEMA/>.app_translation ct
                    WHERE ct.country_id = c.id
                      AND cg.id = c.country_group_id
                      AND ct.language_id =  (SELECT id 
                                               FROM <DB_SCHEMA/>.language l
                                              WHERE l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
                                                                     FROM <DB_SCHEMA/>.app_translation ct1,
                                                                          <DB_SCHEMA/>.language l1
                                                                    WHERE ct1.country_id = ct.country_id
                                                                      AND l1.id = ct1.language_id
                                                                      AND l1.lang_code IN (<LOCALE/>)
                                                                 )
                                             )
                    ORDER BY 5, 4`;
     const parameters = {};
     return await db_execute(app_id, sql, parameters, null, lang_code);
};
export{getCountries};