/** @module server/db/sql/app_category */


/**@type{import('../common.service.js')} */
const {db_execute, get_locale} = await import(`file://${process.cwd()}/server/db/common.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {number|null} id 
 * @param {string} lang_code 
 * @returns {Promise.<import('../../../types.js').db_result_app_category_getAppCategoryAdmin[]>}
 */
const getAppCategoryAdmin = async (app_id, id, lang_code) => {
		const sql = `SELECT ac.id "id",
					  ac.category_name "category_name",
					  act.text "app_category_text"
				 FROM <DB_SCHEMA/>.app_category ac
				 LEFT OUTER JOIN <DB_SCHEMA/>.app_translation act
					ON act.app_category_id = ac.id
					AND act.language_id IN (SELECT id 
											  FROM <DB_SCHEMA/>.language l
											 WHERE l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
																	FROM <DB_SCHEMA/>.app_translation act1,
																		 <DB_SCHEMA/>.language l1
																   WHERE l1.id  = act1.language_id
																	 AND act1.app_category_id  = ac.id
																	 AND l1.lang_code IN (:lang_code1, :lang_code2, :lang_code3)
																 )
											)
				WHERE ((ac.id = :id) OR :id IS NULL)
				ORDER BY 1`;
		const parameters = {lang_code1: get_locale(lang_code, 1),
							lang_code2: get_locale(lang_code, 2),
							lang_code3: get_locale(lang_code, 3),
							id: id};
		return await db_execute(app_id, sql, parameters, null);
	};
export{getAppCategoryAdmin};