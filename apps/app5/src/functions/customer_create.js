/**
 * @module apps/app5/src/functions/customer_create
 */

/**
 * @param {number} app_id
 * @param {*} data
 * @param {string} user_agent
 * @param {string} ip
 * @param {string} locale
 * @param {import('../../../../server/types.js').server_server_res} res
 * @returns {Promise.<import('../../../../server/types.js').server_db_sql_result_app_data_resource_master_post>}
 */
const customer_create = async (app_id, data, user_agent, ip, locale, res) =>{
    /**@type{import('../../../../server/db/dbModelAppDataEntityResource.js')} */
    const dbModelAppDataEntityResource = await import(`file://${process.cwd()}/server/db/dbModelAppDataEntityResource.js`);
    /**@type{import('../../../../server/db/dbModelAppDataResourceMaster.js')} */
    const dbModelAppDataResourceMaster = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceMaster.js`);
    /**@type{import('./account_create.js')} */
    const {default:createBankAccount} = await import('./account_create.js');

    const resource_customer = await dbModelAppDataEntityResource.get(app_id, null, 
        new URLSearchParams(`data_app_id=${data.data_app_id}&resource_name=CUSTOMER`)
    );
    
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
    const Customer = await dbModelAppDataResourceMaster.post(app_id, post_data);

    const resource_account = await dbModelAppDataEntityResource.get(app_id, null, new URLSearchParams(`data_app_id=${data.data_app_id}&resource_name=ACCOUNT`));
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
    await createBankAccount(app_id, post_data_account, user_agent, ip, locale, res);

    return Customer;
};
export default customer_create;