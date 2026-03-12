/**
 * @description  customer create
 * @module apps/app5/src/functions/customer_create
 */

/**
 * @import types_server from '../../../../server/types.d.ts'
 * @import types_app from '../../types.d.ts'
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
 *          accept_language:string}} parameters
 * @returns {Promise.<types_server.server['response'] & {result?:types_server.ORM['MetaData']['common_result_insert']}>}
 */
const customerCreate = async parameters =>{

    /**@ts-ignore @type{types_server.ORM['Object']['AppDataEntity']} */
    const Entity    = server.ORM.db.AppDataEntity.get({   app_id:parameters.app_id, 
                                            resource_id:null, 
                                            data:{data_app_id:parameters.data.data_app_id}}).result[0];
    /**@type{types_server.ORM['Object']['AppDataEntityResource']} */
    const resource_customer = (server.ORM.db.AppDataEntityResource.get({   app_id:parameters.app_id, 
                                                            resource_id:null, 
                                                            data:{  app_data_entity_id:Entity.Id,
                                                                    resource_name:'CUSTOMER'
                                                            }}).result??[])[0];
    if (resource_customer){
        /**@ts-ignore @type{types_server.ORM['Object']['AppDataResourceMaster'] & {Document:types_app.customer}} */
        const post_data = {
            Document                    :{
                                            CustomerType   :parameters.data.customer_type,
                                            Name            :parameters.data.name,
                                            Address         :parameters.data.address,
                                            City            :parameters.data.city,
                                            Country         :parameters.data.country
                                        },
            IamUserAppId                : parameters.data.iam_user_app_id,
            AppDataEntityResourceId     : resource_customer.Id,
            };
        //create CUSTOMER    
        const Customer = await server.ORM.db.AppDataResourceMaster.post({app_id:parameters.app_id, data:post_data});
        if (Customer.result){
            /**@type{types_server.ORM['Object']['AppDataEntityResource']} */
            const resource_account = (server.ORM.db.AppDataEntityResource.get({app_id:parameters.app_id, 
                                                                resource_id:null, 
                                                                data:{  app_data_entity_id:Entity.Id, 
                                                                        resource_name:'ACCOUNT'}}).result??[])[0];
            if (resource_account){
                const post_data_account = { app_data_resource_master_id                 : Customer.result.InsertId??0, //CUSTOMER
                                            app_data_entity_resource_id                 : resource_account.Id,
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
                                            accept_language:parameters.accept_language})
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