/** @module server/dbapi/object/app */

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
const getApp = (app_id, query) => service.getApp(app_id, getNumberValue(query.get('id')), query.get('lang_code'))
                                    .catch((/**@type{Types.error}*/error)=>{throw error;});
/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @returns {Types.db_result_app_getAppsAdmin[]}
 */
const getAppsAdmin = (app_id, query) => service.getAppsAdmin(app_id, query.get('lang_code'))
                                            .catch((/**@type{Types.error}*/error)=>{throw error;});
/**
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} data 
 * @returns Promise.<{Types.db_result_app_getAppAdmin[]}>
 */
const updateAdmin = (app_id, resource_id, data) =>{
    /**@type{Types.db_parameter_app_updateAppAdmin} */
    const body = {	app_category_id:getNumberValue(data.app_category_id)};
    return service.updateAppAdmin(app_id, resource_id, body)
            .catch((/**@type{Types.error}*/error)=>{throw error;});
};
export {getApp, getAppsAdmin, updateAdmin};