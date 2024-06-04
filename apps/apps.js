/** @module apps */

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

/**
 * 
 * @param {string} ip 
 * @param {string} host
 * @param {string} user_agent 
 * @param {string} accept_language 
 * @param {string} url
 * @param {*} query 
 * @param {import('../types.js').res} res 
 */
 const getAppMain = async (ip, host, user_agent, accept_language, url, query, res) => service.getAppMain(   ip, 
                                                                                                            host, 
                                                                                                            user_agent, 
                                                                                                            accept_language, 
                                                                                                            url, 
                                                                                                            query?query.get('reportid'):null,
                                                                                                            res);

/**
 * 
 * @param {number} app_id 
 * @param {string} resource_id
 * @param {*} data
 * @param {string} locale
 * @param {import('../types.js').res} res 
 */
 const getFunction = async (app_id, resource_id, data, locale, res) => service.getFunction(app_id, resource_id, data, locale, res);

export{getApps, getAppsAdmin, getAppMain, getFunction};