/**
 * @module apps/app5/src/functions/account_transactions
 */

/**
 * 
 * @param {number} app_id 
 * @param {*} data 
 * @param {string} user_agent
 * @param {string} ip
 * @param {string} locale
 * @param {import('../../../../types.js').res} res
 */
const getTransacions = async (app_id, data, user_agent, ip, locale, res) =>{

    /**@type{import('../../../../server/db/sql/app_data_resource_detail_data.service.js')} */
    const {get:DetailDataGet} = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_detail_data.service.js`);

    const transactions = await DetailDataGet(app_id, null, null, data.user_account_id, data.data_app_id, 
                                'RESOURCE_TYPE', 'ACCOUNT', 
                                'RESOURCE_TYPE', 'CUSTOMER', 
                                null, null, null, null, false);
    
    return transactions;
}; 
export default getTransacions;