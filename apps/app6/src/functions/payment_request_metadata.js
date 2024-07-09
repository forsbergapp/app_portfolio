/** @module apps/app6 */
/**
 * @param {number} app_id
 * @param {*} data
 * @param {string} ip
 * @param {string} locale
 * @returns {Promise.<import('../../../../types.js').db_result_app_data_resource_master_get[]>}
 */
const product_metadata = async (app_id, data, ip, locale) =>{
    /**@type{import('../../../../server/db/sql/app_data_resource_master.service.js')} */
    const {get} = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_master.service.js`);
    
    return await get(app_id, null, null, data.data_app_id, 'PAYMENT_REQUEST_METADATA', null, locale, true);
};
export default product_metadata;