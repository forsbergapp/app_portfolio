/** @module server/db/dbModelIdentityProvider */

/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**
 * Get identity providers
 * @function
 * @param {number} app_id 
 * @returns {Promise.<import('../types.js').server_db_sql_result_identity_provider_getIdentityProviders[]>}
 */
const get = app_id => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(app_id, 
                        dbSql.IDENTITY_PROVIDER_SELECT, 
                        {},
                        null, 
                        null));

export {get};