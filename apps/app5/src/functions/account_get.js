/**
 * @module apps/app5/src/functions/account_get
 */
/**
 * @param {number} app_id
 * @param {*} data
 * @param {string} user_agent
 * @param {string} ip
 * @param {string} locale
 * @param {import('../../../../types.js').res} res
 * @returns {Promise.<import('../../../../types.js').db_result_app_data_resource_detail_get[]>}
 */
const account_get = async (app_id, data, user_agent, ip, locale, res) =>{
    /**@type{import('../../../../server/db/sql/app_data_resource_detail.service.js')} */
    const {get} = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_detail.service.js`);
    
    return await get(app_id, data.resource_id, null, data.user_account_id, data.data_app_id, 'ACCOUNT', data.entity_id, locale, false);
};
export default account_get;