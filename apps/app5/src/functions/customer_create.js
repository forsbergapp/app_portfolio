/** @module apps/app5 */
/**
 * @param {number} app_id
 * @param {*} data
 * @param {string} user_agent
 * @param {string} ip
 * @param {string} locale
 * @returns {Promise.<import('../../../../types.js').db_result_app_data_resource_master_post>}
 */
const customer_create = async (app_id, data, user_agent, ip, locale) =>{
    /**@type{import('../../../../server/db/sql/app_data_entity_resource.service.js')} */
    const {get} = await import(`file://${process.cwd()}/server/db/sql/app_data_entity_resource.service.js`);
    /**@type{import('../../../../server/db/sql/app_data_resource_master.service.js')} */
    const {post:MasterPost} = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_master.service.js`);
    /**@type{import('./account_create.js')} */
    const {createRandomTransactions, default:createBankAccount} = await import('./account_create.js');

    const resource_customer = await get(app_id, null, app_id, 'CUSTOMER', null, null);
    
    const post_data = {
                        json_data                                   : {
                                                                        customer_type   :data.customer_type,
                                                                        name            :data.name,
                                                                        address         :data.address,
                                                                        city            :data.city,
                                                                        country         :data.country
                                                                    },
                        user_account_id                             : data.user_account_id,
                        user_account_app_id                         : data.data_app_id,
                        data_app_id                                 : data.data_app_id,
                        app_data_entity_resource_app_data_entity_id : resource_customer[0].app_data_entity_id,
                        app_data_entity_resource_id                 : resource_customer[0].id,
                        };
    //create CUSTOMER    
    const Customer = await MasterPost(app_id, post_data);

    const resource_account = await get(app_id, null, app_id, 'ACCOUNT', null, null);
    const post_data_account = {
                        user_account_id                             : data.user_account_id,
                        user_account_app_id                         : data.data_app_id,
                        data_app_id                                 : data.data_app_id,
                        app_data_entity_resource_app_data_entity_id : resource_account[0].app_data_entity_id,
                        app_data_entity_resource_id                 : resource_account[0].id,
                        app_data_resource_master_id                 : Customer.insertId, //CUSTOMER
                        app_data_resource_master_attribute_id       : null
    };
    //create ACCOUNT
    const BankAccount = await createBankAccount(app_id, post_data_account);

    //create ACCOUNT transactions (random demo transactions)
    const post_data_transaction = {
            user_account_id                         : data.user_account_id,
            user_account_app_id                     : data.data_app_id,
            data_app_id                             : data.data_app_id,
            app_data_resource_detail_id             : BankAccount.insertId,
            app_data_resource_master_attribute_id   : null
    };
    await createRandomTransactions(app_id, post_data_transaction);
    return Customer;
};
export default customer_create;