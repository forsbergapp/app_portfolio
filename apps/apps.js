/** @module server/apps */

/**@type{import('./apps.service')} */
const service = await import(`file://${process.cwd()}/apps/apps.service.js`);
/**
 * 
 * @param {number} app_id
 * @param {number|null} resource_id
 * @param {*} query
 */
const getApps = async (app_id, resource_id, query) => service.getApps(app_id, resource_id, query.get('lang_code'));

/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 */
const getAppsAdmin = async (app_id, query) => service.getAppsAdmin(app_id, query.get('lang_code'));


export{getApps, getAppsAdmin};