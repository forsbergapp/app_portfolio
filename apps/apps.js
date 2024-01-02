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

/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 */
const getAppsAdmin = async (app_id, query) => service.getAppsAdmin(app_id, query.get('lang_code'));

/**
 * 
 * @param {string} url 
 * @param {Types.res} res 
 * @returns 
 */
const getAppCommon = (url, res) => service.getAppCommon(url,res);
/**
 * 
 * @param {string} ip 
 * @param {string} host
 * @param {string} user_agent 
 * @param {string} accept_language 
 * @param {string} url
 * @param {*} query 
 * @param {Types.res} res 
 * @returns 
 */
 const getAppMain = async (ip, host, user_agent, accept_language, url, query, res) => service.getAppMain(ip, host, user_agent, accept_language, url, query?query.get('reportid'):null, query?getNumberValue(query.get('messagequeue')):null, url.startsWith('/info/')?url.substring(6):null, res);

export{getApps, getAppsAdmin, getAppCommon, getAppMain};