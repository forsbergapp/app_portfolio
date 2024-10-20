/** @module server/db/components/app_setting */


/**@type{import('../sql/app_setting.service.js')} */
const service = await import(`file://${process.cwd()}/server/db/sql/app_setting.service.js`);

/**@type{import('../../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 */
const getSettings = (app_id, query) => service.getSettings(app_id, query.get('lang_code'), query.get('setting_type') ?? (query.get('setting_type')==''?null:query.get('setting_type')))
                                        .catch((/**@type{import('../../types.js').server_server_error}*/error)=>{throw error;});

/**
 * Get setting display data
 * @param {number} app_id 
 * @param {*} query 
 */
const getSettingDisplayData = (app_id, query) => service.getSettingDisplayData(app_id, serverUtilNumberValue(query.get('data_app_id')), query.get('setting_type'), query.get('value'))
                                        .catch((/**@type{import('../../types.js').server_server_error}*/error)=>{throw error;});
                                        
export{getSettings, getSettingDisplayData};