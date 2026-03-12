/**
 * @description account transactions
 * @module apps/app5/src/functions/account_transactions
 */
/**
 * @import types_server from '../../../../server/types.d.ts'
 * @import types_app from '../../types.d.ts'
 */
const {server} = await import('../../../../server/server.js');
/**
 * @name getTransacions
 * @description Get bank account transactions
 * @function
 * @param {{app_id:number,
 *          data:{iam_user_id:number,
 *                data_app_id:number},
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          idToken:string,
 *          authorization:string,
 *          accept_language:string}} parameters
 * @returns {Promise.<types_server.server['response'] & {result?:types_app.bank_transaction[]}>}
 */
const getTransacions = async parameters =>{
    
    /**@ts-ignore @type{types_server.ORM['Object']['AppDataEntity']} */
    const Entity            = server.ORM.db.AppDataEntity.get({  app_id:parameters.app_id, 
                                            resource_id:null, 
                                            data:{data_app_id:parameters.data.data_app_id}}).result[0];
    return server.ORM.db.AppDataResourceDetailData.get({app_id:parameters.app_id, 
                                                                    resource_id:null, 
                                                                    data:{  iam_user_id:parameters.data.iam_user_id,
                                                                            data_app_id:parameters.data.data_app_id,
                                                                            resource_name:'ACCOUNT',
                                                                            resource_name_master_attribute:'CUSTOMER',
                                                                            resource_name_data_master_attribute:null,
                                                                            app_data_resource_detail_id:null,
                                                                            app_data_entity_id:Entity.Id
                                                                    }});
}; 
export default getTransacions;