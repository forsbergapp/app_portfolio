/** @module server/db/dbModelAppSetting */

/**
 * @import {server_db_sql_result_app_setting_getDisplayData, server_db_sql_result_app_setting_getSettings} from '../types.js'
 */

/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**@type{import('./fileModelConfig.js')} */
const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**
 * Get setting with translation text
 * @function
 * @param {number} app_id 
 * @param {*} query 
 * @returns {Promise.<server_db_sql_result_app_setting_getSettings[]>}
 */
const get = (app_id, query) => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(app_id, 
                        dbSql.APP_SETTING_SELECT, 
                        {
                            app_id : app_id,
                            common_app_id: serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID')),
                            app_setting_type_name: query.get('setting_type') ?? (query.get('setting_type')==''?null:query.get('setting_type'))
                            },
                        null, 
                        query.get('lang_code')));
/**
 * Get setting display data without translation
 * @function
 * @param {number} app_id 
 * @param {*} query 
 * @returns {Promise.<server_db_sql_result_app_setting_getDisplayData[]>}
 */
const getDisplayData = (app_id, query) => 
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
                                        
export{get, getDisplayData};