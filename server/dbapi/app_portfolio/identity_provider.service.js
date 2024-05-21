/** @module server/dbapi/app_portfolio/identity_provider */

/**@type{import('../../dbapi/common/common.service.js')} */
const {db_execute, db_schema} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);

/**
 * 
 * @param {number} app_id 
 * @returns {Promise.<import('../../../types.js').db_result_identity_provider_getIdentityProviders[]>}
 */
const getIdentityProviders = async app_id => {
		const sql = `SELECT id "id",
							provider_name "provider_name",
							api_src "api_src",
							api_src2 "api_src2",
							api_version "api_version",
							api_id "api_id"
					   FROM ${db_schema()}.identity_provider
					  WHERE enabled = 1
					 ORDER BY identity_provider_order ASC`;
		const parameters = {};
		return await db_execute(app_id, sql, parameters, null);
	};
export{getIdentityProviders};