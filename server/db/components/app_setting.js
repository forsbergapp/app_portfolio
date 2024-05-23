/** @module server/db/components/app_object */


/**@type{import('../sql/app_setting.service.js')} */
const service = await import(`file://${process.cwd()}/server/db/sql/app_setting.service.js`);

/**@type{import('../../server.service.js')} */
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @returns 
 */
const getSettings = (app_id, query) => service.getSettings(app_id, query.get('lang_code'), query.get('setting_type') ?? query.get('setting_type')==''?null:query.get('setting_type'))
                                        .catch((/**@type{import('../../../types.js').error}*/error)=>{throw error;});

/**
 * Get setting display data
 * @param {number} app_id 
 * @param {*} query 
 * @returns 
 */
const getSettingDisplayData = (app_id, query) => service.getSettingDisplayData(app_id, getNumberValue(query.get('data_app_id')), query.get('setting_type'), query.get('value'))
                                        .catch((/**@type{import('../../../types.js').error}*/error)=>{throw error;});
                                        
export{getSettings, getSettingDisplayData};