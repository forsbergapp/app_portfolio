/**
 * @module apps/app5/src/functions/account_create
 */

/**@type{import('../../../../server/security.service')} */
const {createSecret, createUUID} = await import(`file://${process.cwd()}/server/security.service.js`);

const createBankAccountSecret = ()=>createSecret();
const createBankAccountNumber = ()=>Date.now().toString().padStart(16,'0');
const createBankAccountVPA = ()=>createUUID();

/**
 * 
 * @param {number} app_id 
 * @param {*} data 
 * @param {string} user_agent
 * @param {string} ip
 * @param {string} locale
 * @param {import('../../../../server/types.js').server_server_res} res
 * @returns {Promise.<import('../../../../server/types.js').server_db_sql_result_app_data_resource_detail_post>}
 */
const createBankAccount = async (app_id, data, user_agent, ip, locale, res) =>{
    /**@type{import('../../../../server/db/sql/app_data_resource_detail.service.js')} */
    const {post} = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_detail.service.js`);
    data.json_data = {
            bank_account_number :createBankAccountNumber(),
            bank_account_secret :createBankAccountSecret(),
            bank_account_vpa    :createBankAccountVPA()
    };
    return await post(app_id, data);
};

export default createBankAccount;
export {
        createBankAccountSecret,
        createBankAccountNumber,
        createBankAccountVPA};