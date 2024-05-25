/** @module server/db/sql/setting */

/**@type{import('../../db/common.service.js')} */
const {db_execute} = await import(`file://${process.cwd()}/server/db/common.service.js`);

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {string} lang_code 
 * @param {string|null} app_setting_type_name 
 * @returns {Promise.<import('../../../types.js').db_result_app_setting_getSettings[]>}
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
                            FROM <DB_SCHEMA/>.language l,
                                 <DB_SCHEMA/>.app_translation str
                           WHERE l.id = str.language_id
                             AND str.app_setting_id = s.id
                             AND l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
                                                  FROM <DB_SCHEMA/>.app_translation str1,
                                                       <DB_SCHEMA/>.language l1
                                                  WHERE l1.id  = str1.language_id
                                                  AND str1.app_setting_id = str.app_setting_id
                                                  AND l1.lang_code IN (<LOCALE/>)
                                                  )
                         ) "text"
                    FROM <DB_SCHEMA/>.app_setting s
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
                    FROM <DB_SCHEMA/>.app_setting s
                   WHERE s.app_setting_type_app_setting_type_name LIKE COALESCE(:app_setting_type_name, s.app_setting_type_app_setting_type_name)
                     AND (((s.app_setting_type_app_id = :app_id) OR :app_id IS NULL)
                         OR
                         s.app_setting_type_app_id = :common_app_id)
                     AND s.display_data IS NOT NULL
                ORDER BY 1, 2, 3`;
	const {ConfigGet} = await import(`file://${process.cwd()}/server/config.service.js`);
     const parameters = {
                         app_id : app_id,
                         common_app_id: getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),
                         app_setting_type_name: app_setting_type_name
                         };
     return await db_execute(app_id, sql, parameters, null, lang_code, true);
};
/**
 * Get setting display data
 * @param {number} app_id 
 * @param {number|null} data_app_id 
 * @param {string} app_setting_type_name 
 * @param {*} value 
 * @returns {Promise.<import('../../../types.js').db_result_app_setting_getSettingDisplayData[]>}
 */
const getSettingDisplayData = async (app_id, data_app_id, app_setting_type_name, value) => {
     const sql = `SELECT s.id                                         "id", 
                         s.app_setting_type_app_setting_type_name     "app_setting_type_name",
                         s.value                                      "value", 
                         null                                         "name", 
                         s.display_data                               "display_data", 
                         data2                                        "data2", 
                         data3                                        "data3", 
                         data4                                        "data4",
                         data5                                        "data5"
                    FROM <DB_SCHEMA/>.app_setting s
                   WHERE (s.app_setting_type_app_setting_type_name = :app_setting_type_name OR :app_setting_type_name IS NULL)
                     AND s.app_setting_type_app_id = :app_id
                     AND (s.value = :value OR :value IS NULL)
                     AND s.display_data IS NOT NULL
                     ORDER BY 1`;
     const parameters = {
                         app_setting_type_name: app_setting_type_name,
                         app_id : data_app_id,
                         value:value ==''?null:value
                         };
     return await db_execute(app_id, sql, parameters, null, null, (app_setting_type_name && value)?false:true);
};
export{getSettings, getSettingDisplayData};