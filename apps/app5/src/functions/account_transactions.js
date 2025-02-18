/**
 * @module apps/app5/src/functions/account_transactions
 */
/**
 * @import {server_server_response} from '../../../../server/types.js'
 * @import {bank_transaction} from './types.js'
 */
/**
 * @name getTransacions
 * @description Get bank account transactions
 * @function
 * @param {{app_id:number,
 *          data:*,
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          idToken:string,
 *          authorization:string,
 *          locale:string}} parameters
 * @returns {Promise.<server_server_response & {result?:bank_transaction}>}
 */
const getTransacions = async parameters =>{

    /**@type{import('../../../../server/db/dbModelAppDataResourceDetailData.js')} */
    const dbModelAppDataResourceDetailData = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceDetailData.js`);

    return dbModelAppDataResourceDetailData.get({app_id:parameters.app_id, 
                                                                    resource_id:null, 
                                                                    data:{user_account_id:parameters.data.user_account_id,
                                                                            data_app_id:parameters.data.data_app_id,
                                                                            resource_name_type:'RESOURCE_TYPE',
                                                                            resource_name:'ACCOUNT',
                                                                            resource_name_master_attribute_type:'RESOURCE_TYPE',
                                                                            resource_name_master_attribute:'CUSTOMER',
                                                                            user_null:'0'
                                                                    }});
}; 
export default getTransacions;