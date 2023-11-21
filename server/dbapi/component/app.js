/** @module server/dbapi/component/app */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const service = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app.service.js`);
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);
/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @returns {Types.db_result_app_getApp[]}
 */
const getApp = (app_id, query) => service.getApp(app_id, getNumberValue(query.get('id')), query.get('lang_code'));
/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @returns {Types.db_result_app_getAppAdmin[]}
 */
const getAppsAdmin = (app_id, query) => service.getAppsAdmin(app_id, query.get('lang_code'));
/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @param {*} data 
 * @returns Promise.<{Types.db_result_app_getAppAdmin[]}>
 */
const updateAdmin = (app_id, query, data) =>{
    /**@type{Types.db_parameter_app_updateAppAdmin} */
    const body = {	app_name:		data.app_name,
                    url: 			data.url,
                    logo: 			data.logo,
                    enabled: 		getNumberValue(data.enabled) ?? 0,
                    app_category_id:getNumberValue(data.app_category_id)};
    return service.updateAppAdmin(app_id, getNumberValue(query.get('PUT_ID')), body);
};
export {getApp, getAppsAdmin, updateAdmin};