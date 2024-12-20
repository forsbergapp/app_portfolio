/** @module server/db/dbModelIdentityProvider */

/**
 * @import {server_db_sql_result_identity_provider_getIdentityProviders} from '../types.js'
 */

/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**
 * Get identity providers
 * @function
 * @param {number} app_id 
 * @returns {Promise.<server_db_sql_result_identity_provider_getIdentityProviders[]>}
 */
const get = app_id => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(app_id, 
                        dbSql.IDENTITY_PROVIDER_SELECT, 
                        {},
                        null, 
                        null));

export {get};