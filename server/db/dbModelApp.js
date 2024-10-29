/** @module server/db/dbModelApp */

/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**@type{import('../../server/config.js')} */
const {configGet} = await import(`file://${process.cwd()}/server/config.js`);

/**
 * 
 * @param {number} app_id 
 * @param {number|null} id
 * @param {string}  locale
 * @returns {Promise.<import('../types.js').server_db_sql_result_app_getApp[]>}
 */
const get = async (app_id, id, locale) =>
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(app_id, 
                        dbSql.APP_SELECT, 
                        {   common_app_id: serverUtilNumberValue(configGet('SERVER', 'APP_COMMON_APP_ID')),
							id: id},
                        null, 
                        locale));
/**
 * 
 * @param {number} app_id 
 * @returns {Promise.<import('../types.js').server_db_sql_result_app_getAdminId[]>}
 */
const getAdminId = async (app_id) =>
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(app_id, 
                        dbSql.APP_SELECT_ID, 
                        {},
                        null, 
                        null));
export {get, getAdminId};