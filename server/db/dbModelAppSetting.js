/** @module server/db/dbModelAppSetting */

/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**@type{import('../../server/config.js')} */
const {configGet} = await import(`file://${process.cwd()}/server/config.js`);

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @returns {Promise.<import('../types.js').server_db_sql_result_app_setting_getSettings[]>}
 */
const getSettings = (app_id, query) => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(app_id, 
                        dbSql.APP_SETTING_SELECT, 
                        {
                            app_id : app_id,
                            common_app_id: serverUtilNumberValue(configGet('SERVER', 'APP_COMMON_APP_ID')),
                            app_setting_type_name: query.get('setting_type') ?? (query.get('setting_type')==''?null:query.get('setting_type'))
                            },
                        null, 
                        null));
/**
 * Get setting display data
 * @param {number} app_id 
 * @param {*} query 
 * @returns {Promise.<import('../types.js').server_db_sql_result_app_setting_getSettingDisplayData[]>}
 */
const getSettingDisplayData = (app_id, query) => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(app_id, 
                        dbSql.APP_SETTING_SELECT_DISPLAYDATA, 
                        {
                            app_setting_type_name: query.get('setting_type'),
                            app_id : serverUtilNumberValue(query.get('data_app_id')),
                            value:query.get('value') ==''?null:query.get('value')
                            },
                        null, 
                        null));    
                                        
export{getSettings, getSettingDisplayData};