/**
 * @module apps/app6/src/functions/product_variant_location_metadata
 */
/**
 * @param {number} app_id
 * @param {*} data
 * @param {string} user_agent
 * @param {string} ip
 * @param {string} locale
 * @param {import('../../../../server/types.js').server_server_res} res
 * @returns {Promise.<import('../../../../server/types.js').server_db_sql_result_app_data_resource_master_get[]>}
 */
const product_metadata = async (app_id, data, user_agent, ip, locale, res) =>{
    /**@type{import('../../../../server/db/dbModelAppDataResourceMaster.js')} */
    const dbModelAppDataResourceMaster = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceMaster.js`);
    
    return await dbModelAppDataResourceMaster.get(app_id, data.resource_id, 
                    new URLSearchParams(`data_app_id=${data.data_app_id}&resource_name=PRODUCT_VARIANT_LOCATION_METADATA&entity_id=${data.entity_id}`),
                    true);
};
export default product_metadata;