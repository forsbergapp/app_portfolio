/** @module server/dbapi/component/app_object */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const service = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/setting.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @returns 
 */
const getSettings = (app_id, query) => service.getSettings(app_id, query.get('lang_code'), query.get('setting_type') ?? query.get('setting_type')==''?null:query.get('setting_type'));

export{getSettings};