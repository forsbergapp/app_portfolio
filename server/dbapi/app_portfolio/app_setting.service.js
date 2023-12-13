/** @module server/dbapi/app_portfolio/setting */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const {db_execute, db_schema, get_locale} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {string} lang_code 
 * @param {string|null} app_setting_type_name 
 * @returns {Promise.<Types.db_result_app_setting_getSettings[]>}
 */
const getSettings = async (app_id, lang_code, app_setting_type_name) => {
     if (app_setting_type_name=='')
          app_setting_type_name = null;
     const sql = `SELECT s.id "id",
                         s.app_setting_type_app_id "app_id",
                         s.app_setting_type_app_setting_type_name "app_setting_type_name",
                         s.value "value",
                         s.data2 "data2",
                         s.data3 "data3",
                         s.data4 "data4",
                         s.data5 "data5",
                         (SELECT str.text
                            FROM ${db_schema()}.language l,
                                 ${db_schema()}.app_translation str
                           WHERE l.id = str.language_id
                             AND str.app_setting_id = s.id
                             AND l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
                                                  FROM ${db_schema()}.app_translation str1,
                                                       ${db_schema()}.language l1
                                                  WHERE l1.id  = str1.language_id
                                                  AND str1.app_setting_id = str.app_setting_id
                                                  AND l1.lang_code IN (:lang_code1, :lang_code2, :lang_code3)
                                                  )
                         ) "text"
                    FROM ${db_schema()}.app_setting s
                    WHERE s.app_setting_type_app_setting_type_name LIKE COALESCE(:app_setting_type_name, s.app_setting_type_app_setting_type_name)
                    AND (((s.app_setting_type_app_id = :app_id) OR :app_id IS NULL)
                         OR
                         s.app_setting_type_app_id = :common_app_id)
                      AND s.display_data IS NULL
                  UNION ALL
                  SELECT s.id "id",
                         s.app_setting_type_app_id "app_id",
                         s.app_setting_type_app_setting_type_name "app_setting_type_name",
                         s.value "value",
                         s.data2 "data2",
                         s.data3 "data3",
                         s.data4 "data4",
                         s.data5 "data5",
                         s.display_data "text"
                    FROM ${db_schema()}.app_setting s
                   WHERE s.app_setting_type_app_setting_type_name LIKE COALESCE(:app_setting_type_name, s.app_setting_type_app_setting_type_name)
                     AND (((s.app_setting_type_app_id = :app_id) OR :app_id IS NULL)
                         OR
                         s.app_setting_type_app_id = :common_app_id)
                     AND s.display_data IS NOT NULL
                ORDER BY 1, 2, 3`;
	const {ConfigGet} = await import(`file://${process.cwd()}/server/config.service.js`);
     const parameters = {
                         lang_code1: get_locale(lang_code, 1),
                         lang_code2: get_locale(lang_code, 2),
                         lang_code3: get_locale(lang_code, 3),
                         app_id : app_id,
                         common_app_id: getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),
                         app_setting_type_name: app_setting_type_name
                         };
     return await db_execute(app_id, sql, parameters, null);
};
export{getSettings};