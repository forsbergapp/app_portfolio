/** @module server/db/sql/app_role */

/**@type{import('../../db/common.service.js')} */
const {db_execute} = await import(`file://${process.cwd()}/server/db/common.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {number|null} id 
 * @returns {Promise.<import('../../../types.js').server_db_sql_result_app_role_getAppRoleAdmin[]>}
 */
const getAppRoleAdmin = async (app_id, id) => {
        const sql = `SELECT ar.id "id",
							ar.role_name "role_name",
							ar.icon "icon"
					   FROM <DB_SCHEMA/>.app_role ar
					  WHERE ((ar.id = :id) OR :id IS NULL)
					 ORDER BY 1`;
        
		const parameters = {id: id};
		return await db_execute(app_id, sql, parameters, null, null);
	};
export{getAppRoleAdmin};