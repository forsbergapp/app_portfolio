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
 * @param {import('../../../../server/types.js').server_server_res} res
 */
const getTransacions = async (app_id, data, user_agent, ip, locale, res) =>{

    /**@type{import('../../../../server/db/dbModelAppDataResourceDetailData.js')} */
    const dbModelAppDataResourceDetailData = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceDetailData.js`);

    const transactions = await dbModelAppDataResourceDetailData.get(app_id, null, 
                                new URLSearchParams(`user_account_id=${data.user_account_id}&data_app_id=${data.data_app_id}&`+ 
                                                    'resource_name_type=RESOURCE_TYPE&resource_name=ACCOUNT&'+
                                                    'resource_name_master_attribute_type=RESOURCE_TYPE&resource_name_master_attribute=CUSTOMER'),
                                false);    
    return transactions;
}; 
export default getTransacions;