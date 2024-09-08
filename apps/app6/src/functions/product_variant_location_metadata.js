/**
 * @module apps/app6/src/functions/product_variant_location_metadata
 */
/**
 * @param {number} app_id
 * @param {*} data
 * @param {string} user_agent
 * @param {string} ip
 * @param {string} locale
 * @param {import('../../../../types.js').server_server_res} res
 * @returns {Promise.<import('../../../../types.js').server_db_sql_result_app_data_resource_master_get[]>}
 */
const product_metadata = async (app_id, data, user_agent, ip, locale, res) =>{
    /**@type{import('../../../../server/db/sql/app_data_resource_master.service.js')} */
    const {get} = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_master.service.js`);
    
    return await get(app_id, data.resource_id, null, data.data_app_id, 'PRODUCT_VARIANT_LOCATION_METADATA', data.entity_id, locale, true);
};
export default product_metadata;