/** @module server/db/sql/app_data_entity */


/**@type{import('../common.js')} */
const {dbCommonExecute} = await import(`file://${process.cwd()}/server/db/common.js`);

/**
 * 
 * @param {number} app_id 
 * @param {number|null} resource_id 
 * @param {number|null} data_app_id 
 * @param {string|null} locale
 * @returns {Promise.<import('../../types.js').server_db_sql_result_app_data_entity_get[]>}
 */
const get = async (app_id, resource_id, data_app_id, locale) => {
		const sql = `SELECT id "id",
							app_id "app_id",
							json_data "json_data"
					   FROM <DB_SCHEMA/>.app_data_entity
					  WHERE (id		= :resource_id OR :resource_id IS NULL)
					    AND (app_id = :data_app_id OR :data_app_id IS NULL)`;
		const parameters = {resource_id: resource_id,
							data_app_id : data_app_id};
		return await dbCommonExecute(app_id, sql, parameters, null, null);
	};
export{get};