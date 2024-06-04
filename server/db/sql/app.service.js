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
 * @param {number|null} id 
 * @param {string} lang_code 
 * @returns {Promise.<{rows:import('../../../types.js').db_result_app_getApp[]}>}
 */
const getApp = async (app_id, id,lang_code) => {
		const sql = `SELECT	id "id",
							(SELECT aot.json_data 
								FROM <DB_SCHEMA/>.language l,
								     <DB_SCHEMA/>.app_translation aot
								WHERE l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
														FROM <DB_SCHEMA/>.app_translation aot1,
															<DB_SCHEMA/>.language l1
													WHERE l1.id  = aot1.language_id
														AND aot1.app_id  = aot.app_id
														AND l1.lang_code IN (<LOCALE/>)
														AND l.lang_code IN ('en', <LOCALE/>)
													)
								  AND aot.app_id = a.id
								  AND aot.language_id = l.id
							) "app_translation",
						(SELECT act.text 
							FROM <DB_SCHEMA/>.language l,
							     <DB_SCHEMA/>.app_translation act
							WHERE l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
													FROM <DB_SCHEMA/>.app_translation act1,
														<DB_SCHEMA/>.language l1
												WHERE l1.id  = act1.language_id
													AND act1.app_category_id  = act.app_category_id
													AND l1.lang_code IN (<LOCALE/>)
													AND l.lang_code IN ('en', <LOCALE/>)
												)
							  AND act.app_category_id = a.app_category_id
							  AND act.language_id = l.id
						) "app_category"
				FROM <DB_SCHEMA/>.app a
				WHERE ( ((id = :id) OR :id IS NULL)
					OR 
					:id = :common_app_id)
				ORDER BY 1`;
		const parameters = {common_app_id: getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),
							id: id};
		return await db_execute(app_id, sql, parameters, null, lang_code, true);
	};
/**
 * 
 * @param {number} app_id 
 * @param {string|null} lang_code 
 * @returns {Promise.<{rows:import('../../../types.js').db_result_app_getAppsAdmin[]}>}
 */
const getAppsAdmin = async (app_id, lang_code) => {
		const sql = `SELECT	a.id "id",
							a.app_category_id "app_category_id",
							act.text "app_category_text"
					   FROM <DB_SCHEMA/>.app a
					   LEFT OUTER JOIN <DB_SCHEMA/>.app_translation act
							ON act.app_category_id = a.app_category_id
							AND act.language_id IN (SELECT id 
													FROM <DB_SCHEMA/>.language l
													WHERE l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
																			FROM <DB_SCHEMA/>.app_translation act1,
																				<DB_SCHEMA/>.language l1
																			WHERE l1.id  = act1.language_id
																			AND act1.app_category_id  = act.app_category_id
																			AND l1.lang_code IN (<LOCALE/>)
																		)
													)
					ORDER BY 1`;
		const parameters = {};
		return await db_execute(app_id, sql, parameters, null, lang_code, true);
	};
/**
 * 
 * @param {number} app_id 
 * @returns {Promise.<{rows:import('../../../types.js').db_result_app_getAppsAdminId[]}>}
 */
const getAppsAdminId = async (app_id) => {
	const sql = `SELECT a.id "id"
				   FROM <DB_SCHEMA/>.app a
				  ORDER BY 1`;
	const parameters = {};
	return await db_execute(app_id, sql, parameters, null,null, true);
};
/**
 * 
 * @param {number} app_id 
 * @param {number} id 
 * @param {import('../../../types.js').db_parameter_app_updateAppAdmin} data
 * @returns {Promise.<import('../../../types.js').db_result_app_updateAppAdmin[]>}
 */
const updateAppAdmin = async (app_id, id, data) => {
		const sql = `UPDATE <DB_SCHEMA/>.app
						SET app_category_id = :app_category_id
					WHERE id = :id`;
		const parameters = {app_category_id: data.app_category_id,
							id: id};
		return await db_execute(app_id, sql, parameters, null);
	};
export{getApp, getAppsAdmin, getAppsAdminId, updateAppAdmin};