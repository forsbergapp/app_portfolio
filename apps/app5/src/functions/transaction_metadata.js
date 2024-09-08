/**
 * @module apps/app5/src/functions/transaction_metadata
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
const transaction_metadata = async (app_id, data, user_agent, ip, locale, res) =>{
    /**@type{import('../../../../server/db/sql/app_data_resource_master.service.js')} */
    const {get} = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_master.service.js`);
    
    return await get(app_id, null, null, data.data_app_id, 'TRANSACTION_METADATA', null, locale, true);
};
export default transaction_metadata;