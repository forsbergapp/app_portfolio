/** @module server/db/sql/identity_provider */

/**@type{import('../../db/common.js')} */
const {dbCommonExecute} = await import(`file://${process.cwd()}/server/db/common.js`);

/**
 * 
 * @param {number} app_id 
 * @returns {Promise.<import('../../types.js').server_db_sql_result_identity_provider_getIdentityProviders[]>}
 */
const getIdentityProviders = async app_id => {
		const sql = `SELECT id "id",
							provider_name "provider_name",
							api_src "api_src",
							api_src2 "api_src2",
							api_version "api_version",
							api_id "api_id"
					   FROM <DB_SCHEMA/>.identity_provider
					  WHERE enabled = 1
					 ORDER BY identity_provider_order ASC`;
		const parameters = {};
		return await dbCommonExecute(app_id, sql, parameters, null, null);
	};
export{getIdentityProviders};