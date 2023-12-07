/** @module server/dbapi/app_portfolio/app_object */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);
const {ConfigGet} = await import(`file://${process.cwd()}/server/config.service.js`);
const {db_execute, db_schema, get_locale} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {string} lang_code 
 * @param {string} object_name 
 * @param {string|null} object_item_name
 * @returns {Promise.<Types.db_result_app_object_getObjects[]>}
 */
const getObjects = async (app_id, lang_code, object_name, object_item_name) => {
	const sql = ` SELECT 	object_name "object_name", 
							app_id "app_id", 
							object_item_name "object_item_name", 
							lang_code "lang_code", 
							id "id",
							text "text"
					FROM (SELECT 	ao.object_name, 
									ao.app_id, 
									null object_item_name,
									l.lang_code, 
									null id, 
									aot.text
							FROM ${db_schema()}.app_object ao,
								${db_schema()}.app_object_translation aot,
								${db_schema()}.language l
							WHERE l.id = aot.language_id
							AND aot.app_object_app_id = ao.app_id
							AND aot.app_object_object_name = ao.object_name
							AND l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
												FROM ${db_schema()}.language l1,
														${db_schema()}.app_object_translation aot1
												WHERE aot1.language_id = l1.id
													AND aot1.app_object_app_id = ao.app_id
													AND aot1.app_object_object_name = ao.object_name
													AND l1.lang_code IN (:lang_code1, :lang_code2, :lang_code3)
												)
							AND ao.app_id IN(:app_id, :common_app_id)							
							AND ao.object_name = :object_name
						UNION ALL
						SELECT 		aoi.app_object_object_name object_name, 
									aoi.app_object_app_id app_id, 
									aoi.object_item_name, 
									l.lang_code, 
									s.id, 
									str.text
							FROM ${db_schema()}.app_object_item aoi,
								${db_schema()}.app_setting_type st,
								${db_schema()}.app_setting s,
								${db_schema()}.app_setting_translation str,
								${db_schema()}.language l
							WHERE aoi.app_setting_type_app_setting_type_name = st.app_setting_type_name
							AND aoi.app_setting_type_app_id = st.app_id
							AND s.app_setting_type_app_setting_type_name = st.app_setting_type_name
							AND s.app_setting_type_app_id = st.app_id
							AND l.id = str.language_id
							AND l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
												FROM ${db_schema()}.language l1,
														${db_schema()}.app_setting_translation str1
												WHERE str1.language_id = l1.id
													AND str1.app_setting_id = s.id
													AND l1.lang_code IN (:lang_code1, :lang_code2, :lang_code3)
												)
							AND aoi.app_setting_type_app_id IN(:app_id, :common_app_id)
							AND ((aoi.app_object_object_name IN ('APP','APP_LOV')
								AND :object_name = 'APP')
								OR :object_name <> 'APP')
							AND (aoi.object_item_name = :object_item_name OR :object_item_name IS NULL)
						UNION ALL
						SELECT 	aoi.app_object_object_name object_name, 
								aoi.app_object_app_id app_id, 
								aoi.object_item_name,
								l.lang_code, 
								null id, 
								aoit.text
							FROM ${db_schema()}.app_object_item aoi,
								${db_schema()}.app_object_item_translation aoit,
								${db_schema()}.language l
							WHERE l.id = aoit.language_id
							AND aoit.app_object_item_app_object_app_id = aoi.app_object_app_id
							AND aoit.app_object_item_app_object_object_name = aoi.app_object_object_name
							AND aoit.app_object_item_object_item_name = aoi.object_item_name
							AND l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
												FROM ${db_schema()}.language l1,
														${db_schema()}.app_object_item_translation aoit1
												WHERE aoit1.language_id = l1.id
													AND aoit1.app_object_item_app_object_app_id = aoi.app_object_app_id
													AND aoit1.app_object_item_app_object_object_name = aoi.app_object_object_name
													AND aoit1.app_object_item_object_item_name = aoi.object_item_name
													AND l1.lang_code IN (:lang_code1, :lang_code2, :lang_code3)
												)
							AND aoi.app_object_app_id IN(:app_id, :common_app_id)
							AND aoi.app_object_object_name = :object_name
							AND (aoi.object_item_name = :object_item_name OR :object_item_name IS NULL)) t
			ORDER BY 1, 2, 3, 4, 5, 6`;
	const parameters = {
					common_app_id: getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),
					app_id: app_id,
					lang_code1: get_locale(lang_code, 1),
					lang_code2: get_locale(lang_code, 2),
					lang_code3: get_locale(lang_code, 3),
					object_name : object_name,
					object_item_name: object_item_name
					};
	return await db_execute(app_id, sql, parameters, null);
};
export{getObjects};