/**
 * @module apps/app5/src/functions/account_create
 */

/**@type{import('../../../../server/security.js')} */
const {securitySecretCreate, securityUUIDCreate} = await import(`file://${process.cwd()}/server/security.js`);

const createBankAccountSecret = ()=>securitySecretCreate();
const createBankAccountNumber = ()=>Date.now().toString().padStart(16,'0');
const createBankAccountVPA = ()=>securityUUIDCreate();

/**
 * @name createBankAccount
 * @description Creates bank account
 * @function
 * @param {number} app_id 
 * @param {*} data 
 * @param {string} user_agent
 * @param {string} ip
 * @param {string} locale
 * @param {import('../../../../server/types.js').server_server_res} res
 * @returns {Promise.<import('../../../../server/types.js').server_db_sql_result_app_data_resource_detail_post>}
 */
const createBankAccount = async (app_id, data, user_agent, ip, locale, res) =>{
    /**@type{import('../../../../server/db/dbModelAppDataResourceDetail.js')} */
    const {post} = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceDetail.js`);
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