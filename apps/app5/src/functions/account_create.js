/**
 * @module apps/app5/src/functions/account_create
 */

/**
 * @import {server} from '../../../../server/types.js'
 * @import {bank_account} from './types.js'
 */
const {server} = await import('../../../../server/server.js');

const createBankAccountSecret = ()=>server.security.securitySecretCreate();
const createBankAccountNumber = ()=>Date.now().toString().padStart(16,'0');
const createBankAccountVPA = ()=>server.security.securityUUIDCreate();

/**
 * @name createBankAccount
 * @description Creates bank account
 * @function
 * @param {{app_id:number,
 *          data:{      app_data_resource_master_id                 : number
 *                      app_data_entity_resource_id                 : number,
 *                      app_data_resource_master_attribute_id       : number|null},
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          idToken:string,
 *          authorization:string,
 *          accept_language:string}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_insert']}>}
 */
const createBankAccount = async parameters =>{
    return server.ORM.db.AppDataResourceDetail.post({app_id:parameters.app_id, data:{   AppDataResourceMasterId:parameters.data.app_data_resource_master_id,
                                                                                        AppDataEntityResourceId:parameters.data.app_data_entity_resource_id,
                                                                                        AppDataResourceMasterAttributeId:parameters.data.app_data_resource_master_attribute_id,
                                                                                        /**@type{bank_account} */
                                                                                        Document:{
                                                                                                BankAccountNumber :createBankAccountNumber(),
                                                                                                BankAccountSecret :createBankAccountSecret(),
                                                                                                BankAccountVpa    :createBankAccountVPA()
                                                                                        }},
                                                        });
};

export default createBankAccount;
export {
        createBankAccountSecret,
        createBankAccountNumber,
        createBankAccountVPA};