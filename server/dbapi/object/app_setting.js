/** @module server/dbapi/object/app_object */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const service = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_setting.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @returns 
 */
const getSettings = (app_id, query) => service.getSettings(app_id, query.get('lang_code'), query.get('setting_type') ?? query.get('setting_type')==''?null:query.get('setting_type'))
                                        .catch((/**@type{Types.error}*/error)=>{throw error;});

export{getSettings};