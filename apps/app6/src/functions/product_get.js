/** @module apps/app5 */
/**
 * @param {number} app_id
 * @param {*} data
 * @param {string} locale
 * @returns {Promise.<import('../../../../types.js').db_result_app_data_resource_master_get[]>}
 */
const product_get = async (app_id, data, locale) =>{
    /**@type{import('../../../../server/db/sql/app_data_resource_master.service.js')} */
    const {get} = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_master.service.js`);
    
    return await get(app_id, data.resource_id, data.user_account_id, data.data_app_id, 'PRODUCT', data.entity_id, data.locale, data.user_null);
};
export default product_get;