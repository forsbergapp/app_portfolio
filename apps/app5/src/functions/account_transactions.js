/**
 * @module apps/app5/src/functions/account_transactions
 */
/**
 * @import {server_server_response, server_db_table_AppDataEntity} from '../../../../server/types.js'
 * @import {bank_transaction} from './types.js'
 */
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
 *          locale:string}} parameters
 * @returns {Promise.<server_server_response & {result?:bank_transaction}>}
 */
const getTransacions = async parameters =>{
    const {ORM} = await import('../../../../server/server.js');
    
    /**@type{server_db_table_AppDataEntity} */
    const Entity            = ORM.db.AppDataEntity.get({  app_id:parameters.app_id, 
                                            resource_id:null, 
                                            data:{data_app_id:parameters.data.data_app_id}}).result[0];
    return ORM.db.AppDataResourceDetailData.get({app_id:parameters.app_id, 
                                                                    resource_id:null, 
                                                                    data:{  iam_user_id:parameters.data.iam_user_id,
                                                                            data_app_id:parameters.data.data_app_id,
                                                                            resource_name:'ACCOUNT',
                                                                            resource_name_master_attribute:'CUSTOMER',
                                                                            resource_name_data_master_attribute:null,
                                                                            app_data_resource_detail_id:null,
                                                                            app_data_entity_id:Entity.id
                                                                    }});
}; 
export default getTransacions;