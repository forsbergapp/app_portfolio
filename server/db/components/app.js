/** @module server/db/components/app */

/**@type{import('../sql/app.service.js')} */
const service = await import(`file://${process.cwd()}/server/db/sql/app.service.js`);

/**@type{import('../../server.service.js')} */
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {*} query
 */
const getAppsAdmin = (app_id, query) => service.getAppsAdmin(app_id, query.get('lang_code'))
                                            .catch((/**@type{import('../../types.js').server_server_error}*/error)=>{throw error;});
/**
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} data 
 */
const updateAdmin = (app_id, resource_id, data) =>{
    /**@type{import('../../types.js').server_db_sql_parameter_app_updateAppAdmin} */
    const body = {	app_category_id:getNumberValue(data.app_category_id)};
    return service.updateAppAdmin(app_id, resource_id, body)
            .catch((/**@type{import('../../types.js').server_server_error}*/error)=>{throw error;});
};
export {getAppsAdmin, updateAdmin};