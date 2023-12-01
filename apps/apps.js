/** @module apps */
// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

const service = await import(`file://${process.cwd()}/apps/apps.service.js`);
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);
/**
 * 
 * @param {number} app_id
 * @param {*} query
 */
const getApps = async (app_id, query) => service.getApps(app_id, getNumberValue(query.get('id')), query.get('lang_code'));

export{getApps};