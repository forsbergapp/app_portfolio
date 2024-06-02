/** @module apps/app5 */
const {createSecret, createUUID} = await import(`file://${process.cwd()}/server/security.service.js`);

const createBankAccountSecret = ()=>createSecret();
const createBankAccountNumber = ()=>Date.now().toString().padStart(16,'0');
const createBankAccountVPA = ()=>createUUID();

/**
 * 
 * @param {number} app_id 
 * @param {*} data 
 * @returns {Promise.<void>}
 */
const createRandomTransactions = async (app_id, data)=>{
    /**@type{import('../../../../server/db/sql/app_data_resource_detail_data.service.js')} */
    const {post} = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_detail_data.service.js`);
    
    //demo transactions
    //create 100 random generated transactions
    for (const dummy of Array(100)){
        const amount = Number((10000 + Math.random() * 10000).toFixed(2));
        const deposit = (0 + Math.random() * 1)>1/8;
        //delay 10 ms
        await new Promise ((resolve)=>{setTimeout(()=> resolve(null),10)});
        data.json_data = {timestamp:new Date().toISOString(),logo:'',origin:'ORIGIN ' + Math.random().toString(36).substring(2),amount_deposit:deposit?amount:null,amount_withdrawal:deposit?null:amount*-1};
        await post(app_id, data);
    }
}
/**
 * 
 * @param {number} app_id 
 * @param {*} data 
 * @returns {Promise.<import('../../../../types.js').db_result_app_data_resource_detail_post[]>}
 */
const createBankAccount = async (app_id, data) =>{
    /**@type{import('../../../../server/db/sql/app_data_resource_detail.service.js')} */
    const {post} = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_detail.service.js`);
    data.json_data = {
            bank_account_number :createBankAccountNumber(),
            bank_account_secret :createBankAccountSecret(),
            bank_account_vpa    :createBankAccountVPA()
    }
    return await post(app_id, data);
};

export default createBankAccount;
export {
        createBankAccountSecret,
        createBankAccountNumber,
        createBankAccountVPA,
        createRandomTransactions};