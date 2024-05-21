/** @module server/dbapi/object/app */

/**@type{import('../../dbapi/app_portfolio/app.service.js')} */
const service = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app.service.js`);

/**@type{import('../../server.service.js')} */
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @returns {import('../../../types.js').db_result_app_getAppsAdmin[]}
 */
const getAppsAdmin = (app_id, query) => service.getAppsAdmin(app_id, query.get('lang_code'))
                                            .catch((/**@type{import('../../../types.js').error}*/error)=>{throw error;});
/**
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} data 
 * @returns Promise.<{import('../../../types.js').db_result_app_getAppAdmin[]}>
 */
const updateAdmin = (app_id, resource_id, data) =>{
    /**@type{import('../../../types.js').db_parameter_app_updateAppAdmin} */
    const body = {	app_category_id:getNumberValue(data.app_category_id)};
    return service.updateAppAdmin(app_id, resource_id, body)
            .catch((/**@type{import('../../../types.js').error}*/error)=>{throw error;});
};
export {getAppsAdmin, updateAdmin};