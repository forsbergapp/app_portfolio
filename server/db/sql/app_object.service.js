/** @module server/db/sql */

/**@type{import('../../server.service.js')} */
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);
/**@type{import('../../config.service.js')} */
const {ConfigGet} = await import(`file://${process.cwd()}/server/config.service.js`);
/**@type{import('../../db/common.service.js')} */
const {db_execute} = await import(`file://${process.cwd()}/server/db/common.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {string} lang_code 
 * @param {string} object_name 
 * @param {string|null} object_item_name
 * @returns {Promise.<import('../../../types.js').db_result_app_object_getObjects[]>}
 */
const getObjects = async (app_id, lang_code, object_name, object_item_name) => {
	const sql = ` SELECT 	object_name "object_name", 
							app_id "app_id", 
							object_item_name "object_item_name", 
							lang_code "lang_code", 
							id "id",
							text "text"
					FROM (SELECT 	aot.app_object_object_name	object_name, 
									aot.app_object_app_id		app_id, 
									null 						object_item_name,
									l.lang_code					lang_code, 
									null 						id, 
									aot.text					text
							FROM <DB_SCHEMA/>.app_translation aot,
								<DB_SCHEMA/>.language l
							WHERE l.id = aot.language_id
							AND l.lang_code IN ('en', <LOCALE/>)
							AND l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
												FROM <DB_SCHEMA/>.language l1,
														<DB_SCHEMA/>.app_translation aot1
												WHERE aot1.language_id = l1.id
													AND aot1.app_object_app_id = aot.app_object_app_id
													AND aot1.app_object_object_name = aot.app_object_object_name
													AND l1.lang_code IN (<LOCALE/>)
												)
							AND aot.app_object_app_id IN(:app_id, :common_app_id)							
							AND aot.app_object_object_name = :object_name
						UNION ALL
						SELECT 		aoi.app_object_object_name object_name, 
									aoi.app_object_app_id app_id, 
									aoi.object_item_name, 
									l.lang_code, 
									s.id, 
									str.text
							FROM <DB_SCHEMA/>.app_object_item aoi,
								<DB_SCHEMA/>.app_setting_type st,
								<DB_SCHEMA/>.app_setting s,
								<DB_SCHEMA/>.app_translation str,
								<DB_SCHEMA/>.language l
							WHERE aoi.app_setting_type_app_setting_type_name = st.app_setting_type_name
							AND aoi.app_setting_type_app_id = st.app_id
							AND s.app_setting_type_app_setting_type_name = st.app_setting_type_name
							AND s.app_setting_type_app_id = st.app_id
							AND l.id = str.language_id
							AND str.app_setting_id = s.id
							AND l.lang_code IN ('en', <LOCALE/>)
							AND l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
												FROM <DB_SCHEMA/>.language l1,
														<DB_SCHEMA/>.app_translation str1
												WHERE str1.language_id = l1.id
													AND str1.app_setting_id = s.id
													AND l1.lang_code IN (<LOCALE/>)
												)
							AND aoi.app_object_app_id IN(:app_id, :common_app_id)
							AND ((aoi.app_object_object_name IN ('APP','APP_LOV')
								AND :object_name = 'APP')
								OR aoi.app_object_object_name <> 'APP')
							AND (aoi.object_item_name = :object_item_name OR :object_item_name IS NULL)
						UNION ALL
						SELECT 	aoit.app_object_item_app_object_object_name object_name, 
								aoit.app_object_item_app_object_app_id 		app_id, 
								aoit.app_object_item_object_item_name 		object_item_name,
								l.lang_code, 
								null id, 
								aoit.text
							FROM <DB_SCHEMA/>.app_translation aoit,
								<DB_SCHEMA/>.language l
							WHERE l.id = aoit.language_id
							AND l.lang_code IN ('en', <LOCALE/>)
							AND l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
												FROM <DB_SCHEMA/>.language l1,
														<DB_SCHEMA/>.app_translation aoit1
												WHERE aoit1.language_id = l1.id
													AND aoit1.app_object_item_app_object_app_id = aoit.app_object_item_app_object_app_id
													AND aoit1.app_object_item_app_object_object_name = aoit.app_object_item_app_object_object_name
													AND aoit1.app_object_item_object_item_name = aoit.app_object_item_object_item_name
													AND l1.lang_code IN (<LOCALE/>)
												)
							AND aoit.app_object_item_app_object_app_id IN(:app_id, :common_app_id)
							AND aoit.app_object_item_app_object_object_name = :object_name
							AND (aoit.app_object_item_object_item_name = :object_item_name OR :object_item_name IS NULL)) t
			ORDER BY 1, 2, 3, 4, 5, 6`;
	const parameters = {
					common_app_id: getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),
					app_id: app_id,
					object_name : object_name,
					object_item_name: object_item_name
					};
	return await db_execute(app_id, sql, parameters, null, lang_code);
};
export{getObjects};