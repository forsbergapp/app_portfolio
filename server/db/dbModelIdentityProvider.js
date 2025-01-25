/** @module server/db/dbModelIdentityProvider */

/**
 * @import {server_server_response,server_db_sql_result_identity_provider_getIdentityProviders} from '../types.js'
 */

/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**
 * @name get
 * @description Get identity providers
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id :number}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_sql_result_identity_provider_getIdentityProviders[] }>}
 */
const get = parameters => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(parameters.app_id, 
                        dbSql.IDENTITY_PROVIDER_SELECT, 
                        {},
                        null, 
                        null));

export {get};