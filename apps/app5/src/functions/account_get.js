/**
 * @module apps/app5/src/functions/account_get
 */
/**
 * @name account_get
 * @description Get bank account
 * @function
 * @param {number} app_id
 * @param {*} data
 * @param {string} user_agent
 * @param {string} ip
 * @param {string} locale
 * @param {import('../../../../server/types.js').server_server_res} res
 * @returns {Promise.<import('../../../../server/types.js').server_db_sql_result_app_data_resource_detail_get[]>}
 */
const account_get = async (app_id, data, user_agent, ip, locale, res) =>{
    /**@type{import('../../../../server/db/dbModelAppDataResourceDetail.js')} */
    const dbModelAppDataResourceDetail = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceDetail.js`);
    
    return await dbModelAppDataResourceDetail.get(app_id, data.resource_id, 
                    new URLSearchParams(`user_account_id=${data.user_account_id}&data_app_id=${data.data_app_id}&resource_name=ACCOUNT&entity_id=${data.entity_id}`), 
                    false);
};
export default account_get;