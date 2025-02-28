/**
 * @module apps/app5/src/functions/customer_create
 */

/**
 * @import {server_server_response, 
 *          server_db_table_AppDataEntity,
 *          server_db_table_AppDataResourceMaster,
 *          server_db_common_result_insert} from '../../../../server/types.js'
 */

/**
 * @name customerCreate
 * @description Customer create
 * @function
 * @param {{app_id:number,
 *          data:{  iam_user_app_id:number,
 *                  data_app_id:number,
 *                  customer_type:string,
 *                  name:string,
 *                  address:string,
 *                  city:string,
 *                  country:string},
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          idToken:string,
 *          authorization:string,
 *          locale:string}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert}>}
 */
const customerCreate = async parameters =>{
    /**@type{import('../../../../server/db/AppDataEntity.js')} */
    const AppDataEntity = await import(`file://${process.cwd()}/server/db/AppDataEntity.js`);
                                            
    /**@type{import('../../../../server/db/AppDataEntityResource.js')} */
    const AppDataEntityResource = await import(`file://${process.cwd()}/server/db/AppDataEntityResource.js`);
    /**@type{import('../../../../server/db/AppDataResourceMaster.js')} */
    const AppDataResourceMaster = await import(`file://${process.cwd()}/server/db/AppDataResourceMaster.js`);
    /**@type{import('./account_create.js')} */
    const {default:createBankAccount} = await import('./account_create.js');

    /**@type{server_db_table_AppDataEntity} */
    const Entity    = AppDataEntity.get({   app_id:parameters.app_id, 
                                            resource_id:null, 
                                            data:{data_app_id:parameters.data.data_app_id}}).result[0];

    const resource_customer = AppDataEntityResource.get({   app_id:parameters.app_id, 
                                                            resource_id:null, 
                                                            data:{  app_data_entity_id:Entity.id,
                                                                    resource_name:'CUSTOMER'
                                                            }});
    if (resource_customer.result){
        /**@type{server_db_table_AppDataResourceMaster} */
        const post_data = {
            json_data                                   : {
                                                            customer_type   :parameters.data.customer_type,
                                                            name            :parameters.data.name,
                                                            address         :parameters.data.address,
                                                            city            :parameters.data.city,
                                                            country         :parameters.data.country
                                                        },
            iam_user_app_id                             : parameters.data.iam_user_app_id,
            app_data_entity_resource_app_data_entity_id : Entity.id,
            app_data_entity_resource_id                 : resource_customer.result[0].id,
            };
        //create CUSTOMER    
        const Customer = await AppDataResourceMaster.post({app_id:parameters.app_id, data:post_data});
        if (Customer.result){
            const resource_account = AppDataEntityResource.get({app_id:parameters.app_id, 
                                                                resource_id:null, 
                                                                data:{  app_data_entity_id:Entity.id, 
                                                                        resource_name:'ACCOUNT'}});
            if (resource_account.result){
                const post_data_account = { app_data_entity_resource_app_data_entity_id : Entity.id,
                                            app_data_resource_master_id                 : Customer.result.insertId, //CUSTOMER
                                            app_data_entity_resource_id                 : resource_account.result[0].id,
                                            app_data_resource_master_attribute_id       : null
                                            };
                //create ACCOUNT and return CUSTOMER
                return createBankAccount({  app_id:parameters.app_id, 
                                            data:post_data_account, 
                                            user_agent:parameters.user_agent, 
                                            ip:parameters.ip,
                                            host:parameters.host,
                                            idToken:parameters.idToken,
                                            authorization:parameters.authorization,
                                            locale:parameters.locale})
                        .then(result=>result.http?result:Customer);
            }
            else
                return resource_account;
        }
        else
            return Customer;
    }       
    else
        return resource_customer;
};
export default customerCreate;