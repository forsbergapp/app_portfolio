/** @module server/dbapi/app_portfolio/app_role */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const {db_execute, db_schema} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {number} id 
 * @returns {Promise.<Types.db_result_app_role_getAppRoleAdmin[]>}
 */
const getAppRoleAdmin = async (app_id, id) => {
        const sql = `SELECT ar.id "id",
							ar.role_name "role_name",
							ar.icon "icon"
					   FROM ${db_schema()}.app_role ar
					  WHERE ((ar.id = :id) OR :id IS NULL)
					 ORDER BY 1`;
        
		const parameters = {id: id};
		return await db_execute(app_id, sql, parameters, null);
	};
export{getAppRoleAdmin};