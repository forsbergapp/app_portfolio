/**
 * @module apps/app5/src/functions/customer_create
 */

/**
 * @import {server} from '../../../../server/types.js'
 * @import {customer} from './types.js'
 */
const {server} = await import('../../../../server/server.js');
const {default:createBankAccount} = await import('./account_create.js');
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
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_insert']}>}
 */
const customerCreate = async parameters =>{

    /**@type{server['ORM']['Object']['AppDataEntity']} */
    const Entity    = server.ORM.db.AppDataEntity.get({   app_id:parameters.app_id, 
                                            resource_id:null, 
                                            data:{data_app_id:parameters.data.data_app_id}}).result[0];
    /**@type{server['server']['response'] & {result?:server['ORM']['Object']['AppDataEntityResource']}} */
    const resource_customer = server.ORM.db.AppDataEntityResource.get({   app_id:parameters.app_id, 
                                                            resource_id:null, 
                                                            data:{  app_data_entity_id:Entity.Id,
                                                                    resource_name:'CUSTOMER'
                                                            }});
    if (resource_customer.result){
        /**@type{server['ORM']['Object']['AppDataResourceMaster'] & {Document:customer}} */
        const post_data = {
            Document                    :{
                                            CustomerType   :parameters.data.customer_type,
                                            Name            :parameters.data.name,
                                            Address         :parameters.data.address,
                                            City            :parameters.data.city,
                                            Country         :parameters.data.country
                                        },
            IamUserAppId                : parameters.data.iam_user_app_id,
            AppDataEntityResourceId     : resource_customer.result[0].Id,
            };
        //create CUSTOMER    
        const Customer = await server.ORM.db.AppDataResourceMaster.post({app_id:parameters.app_id, data:post_data});
        if (Customer.result){
            /**@type{server['server']['response'] & {result?:server['ORM']['Object']['AppDataEntityResource']}} */
            const resource_account = server.ORM.db.AppDataEntityResource.get({app_id:parameters.app_id, 
                                                                resource_id:null, 
                                                                data:{  app_data_entity_id:Entity.Id, 
                                                                        resource_name:'ACCOUNT'}});
            if (resource_account.result){
                const post_data_account = { app_data_resource_master_id                 : Customer.result.InsertId, //CUSTOMER
                                            app_data_entity_resource_id                 : resource_account.result[0].Id,
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