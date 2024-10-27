/**
 * @module apps/app5/src/functions/customer_metadata
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
const customer_metadata = async (app_id, data, user_agent, ip, locale, res) =>{
    /**@type{import('../../../../server/db/dbModelAppDataResource.js')} */
    const {MasterGet} = await import(`file://${process.cwd()}/server/db/dbModelAppDataResource.js`);
    
    return await MasterGet(app_id, data.resource_id, 
        new URLSearchParams(`user_account_id=${data.user_account_id}&data_app_id=${data.data_app_id}&resource_name=CUSTOMER&entity_id=${data.entity_id}`),
        true);
};
export default customer_metadata;