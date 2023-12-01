/** @module server/dbapi/app_portfolio/app */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const {db_execute, db_schema, get_locale} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);
const {ConfigGet} = await import(`file://${process.cwd()}/server/config.service.js`);
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {number} id 
 * @param {string} lang_code 
 * @returns {Promise.<Types.db_result_app_getApp[]>}
 */
const getApp = async (app_id, id,lang_code) => {
		const sql = `SELECT	id "id",
						aot.text "app_description",
						act.text "app_category"
				FROM ${db_schema()}.app a
						LEFT OUTER JOIN ${db_schema()}.app_object_translation aot
							ON aot.app_object_app_id = a.id
							AND aot.app_object_object_name = 'APP_DESCRIPTION'
							AND aot.language_id IN (SELECT id 
													FROM ${db_schema()}.language l
													WHERE l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
																			FROM ${db_schema()}.app_object_translation aot1,
																				${db_schema()}.language l1
																		WHERE l1.id  = aot1.language_id
																			AND aot1.app_object_app_id  = aot.app_object_app_id
																			AND aot1.app_object_object_name = aot.app_object_object_name
																			AND l1.lang_code IN (:lang_code1, :lang_code2, :lang_code3)
																		)
												)
						LEFT OUTER JOIN ${db_schema()}.app_category_translation act
							ON act.app_category_id = a.app_category_id
							AND act.language_id IN (SELECT id 
													FROM ${db_schema()}.language l
													WHERE l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
																			FROM ${db_schema()}.app_category_translation act1,
																				${db_schema()}.language l1
																		WHERE l1.id  = act1.language_id
																			AND act1.app_category_id  = act.app_category_id
																			AND l1.lang_code IN (:lang_code1, :lang_code2, :lang_code3)
																		)
												)
				WHERE ( ((id = :id) OR :id IS NULL)
					OR 
					:id = :common_app_id)
				AND enabled = 1
				ORDER BY 1`;
		const parameters = {lang_code1: get_locale(lang_code, 1),
							lang_code2: get_locale(lang_code, 2),
							lang_code3: get_locale(lang_code, 3),
							common_app_id: getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),
							id: id};
		return await db_execute(app_id, sql, parameters, null);
	};
/**
 * 
 * @param {number} app_id 
 * @param {string} lang_code 
 * @returns {Promise.<Types.db_result_app_getAppsAdmin[]>}
 */
const getAppsAdmin = async (app_id, lang_code) => {
		const sql = `SELECT	a.id "id",
						a.enabled "enabled",
						a.app_category_id "app_category_id",
						act.text "app_category_text"
				FROM ${db_schema()}.app a
					LEFT OUTER JOIN ${db_schema()}.app_category_translation act
						ON act.app_category_id = a.app_category_id
						AND act.language_id IN (SELECT id 
												FROM ${db_schema()}.language l
												WHERE l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
																		FROM ${db_schema()}.app_category_translation act1,
																			${db_schema()}.language l1
																		WHERE l1.id  = act1.language_id
																		AND act1.app_category_id  = act.app_category_id
																		AND l1.lang_code IN (:lang_code1, :lang_code2, :lang_code3)
																	)
												)
				ORDER BY 1`;
		const parameters = {lang_code1: get_locale(lang_code, 1),
							lang_code2: get_locale(lang_code, 2),
							lang_code3: get_locale(lang_code, 3)
							};
		return await db_execute(app_id, sql, parameters, null);
	};
/**
 * 
 * @param {number} app_id 
 * @returns {Promise.<Types.db_result_app_getAppsAdminId[]>}
 */
const getAppsAdminId = async (app_id) => {
	const sql = `SELECT a.id "id"
				FROM ${db_schema()}.app a
			ORDER BY 1`;
	const parameters = {};
	return await db_execute(app_id, sql, parameters, null);
};
/**
 * 
 * @param {number} app_id 
 * @param {number} id 
 * @param {Types.db_parameter_app_updateAppAdmin} data
 * @returns {Promise.<Types.db_result_app_updateAppAdmin[]>}
 */
const updateAppAdmin = async (app_id, id, data) => {
		const sql = `UPDATE ${db_schema()}.app
						SET enabled = :enabled,
							app_category_id = :app_category_id
					WHERE id = :id`;
		const parameters = {enabled: data.enabled,
							app_category_id: data.app_category_id,
							id: id};
		return await db_execute(app_id, sql, parameters, null);
	};
export{getApp, getAppsAdmin, getAppsAdminId, updateAppAdmin};