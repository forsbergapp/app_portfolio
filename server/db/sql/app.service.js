/** @module server/db/sql/app */

/**@type{import('../../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
/**@type{import('../../config.js')} */
const {configGet} = await import(`file://${process.cwd()}/server/config.js`);
/**@type{import('../../db/common.service.js')} */
const {dbCommonExecute} = await import(`file://${process.cwd()}/server/db/common.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {number|null} id 
 * @param {string} lang_code 
 * @returns {Promise.<import('../../types.js').server_db_sql_result_app_getApp[]>}
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
							) "app_translation"
				FROM <DB_SCHEMA/>.app a
				WHERE ( ((id = :id) OR :id IS NULL)
					OR 
					:id = :common_app_id)
				ORDER BY 1`;
		const parameters = {common_app_id: serverUtilNumberValue(configGet('SERVER', 'APP_COMMON_APP_ID')),
							id: id};
		return await dbCommonExecute(app_id, sql, parameters, null, lang_code);
	};

/**
 * 
 * @param {number} app_id 
 * @returns {Promise.<import('../../types.js').server_db_sql_result_app_getAppsAdminId[]>}
 */
const getAppsAdminId = async (app_id) => {
	const sql = `SELECT a.id "id"
				   FROM <DB_SCHEMA/>.app a
				  ORDER BY 1`;
	const parameters = {};
	return await dbCommonExecute(app_id, sql, parameters, null,null);
};

export{getApp, getAppsAdminId};