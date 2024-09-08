/** @module server/db/sql/identity_provider */

/**@type{import('../../db/common.service.js')} */
const {db_execute} = await import(`file://${process.cwd()}/server/db/common.service.js`);

/**
 * 
 * @param {number} app_id 
 * @returns {Promise.<import('../../../types.js').server_db_sql_result_identity_provider_getIdentityProviders[]>}
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
		return await db_execute(app_id, sql, parameters, null, null);
	};
export{getIdentityProviders};