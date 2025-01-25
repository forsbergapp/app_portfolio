/** @module server/db/dbModelAppSetting */

/**
 * @import {server_server_response, server_db_sql_result_app_setting_getDisplayData, server_db_sql_result_app_setting_getSettings} from '../types.js'
 */

/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**@type{import('./fileModelConfig.js')} */
const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**
 * @name get
 * @description Get setting with translation text
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          data:{setting_type:string|null},
 *          locale:string}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_sql_result_app_setting_getSettings[] }>}
 */
const get = parameters => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(parameters.app_id, 
                        dbSql.APP_SETTING_SELECT, 
                        {
                            app_id : parameters.app_id,
                            common_app_id: serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID')),
                            app_setting_type_name: parameters.data.setting_type==''?null:parameters.data.setting_type
                            },
                        null, 
                        parameters.locale));
/**
 * @name getDisplayData
 * @description Get setting display data without translation
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          data:{  setting_type?:string|null,
 *                  data_app_id?:string|number|null,
 *                  value?:string|null}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_sql_result_app_setting_getDisplayData[] }>}
 */
const getDisplayData = parameters => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(parameters.app_id, 
                        dbSql.APP_SETTING_SELECT_DISPLAYDATA, 
                        {
                            app_setting_type_name: parameters.data?.setting_type,
                            app_id : serverUtilNumberValue(parameters.data.data_app_id),
                            value:parameters.data.value ==''?null:parameters.data.value
                            },
                        null, 
                        null));    
                                        
export{get, getDisplayData};