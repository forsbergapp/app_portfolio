/**
 * @module apps/app5/src/functions/payment_request_update
 */

/**
 * @import {server} from '../../../../server/types.js'
 * @import {customer, payment_request, bank_account, bank_transaction} from './types.js'
 */

const {server} = await import('../../../../server/server.js');
const {getToken} = await import('./payment_request_create.js');
/**
 * @name paymentRequestUpdate
 * @description Update payment request
 * @function
 * @param {{app_id:number,
 *          data:{  data_app_id:number,
 *                  iam_user_id:number,
 *                  token:string,
 *                  status:1|0},
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          idToken:string,
 *          authorization:string,
 *          accept_language:string}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:{status:string}[]}>}
 */
const paymentRequestUpdate = async parameters =>{

    /**@type{server['ORM']['Object']['AppDataEntity'] & {Id:number}} */
    const Entity    = server.ORM.db.AppDataEntity.get({   app_id:parameters.app_id, 
                                            resource_id:null, 
                                            data:{data_app_id:parameters.data.data_app_id}}).result[0];

    /**@type{server['ORM']['Object']['AppDataResourceMaster'] & {Id:number, Document:customer}} */
    const customer = server.ORM.db.AppDataResourceMaster.get({app_id:parameters.app_id, 
                                                resource_id:null, 
                                                data:{  iam_user_id:parameters.data.iam_user_id,
                                                        data_app_id:parameters.data.data_app_id,
                                                        resource_name:'CUSTOMER',
                                                        app_data_entity_id:Entity.Id
                                                }}).result[0];

    const token = await getToken({app_id:parameters.app_id, authorization:parameters.data.token, ip:parameters.ip});

    //get payment request using app_custom_id that should be the payment request id
    /**@type{server['ORM']['Object']['AppDataResourceMaster'] & {Id:number, Document:payment_request}}}*/
    const payment_request = server.ORM.db.AppDataResourceMaster.get({ app_id:parameters.app_id, 
                                                        all_users:true,
                                                        resource_id:null, 
                                                        data:{  iam_user_id:null,
                                                                data_app_id:parameters.data.data_app_id,
                                                                resource_name:'PAYMENT_REQUEST',
                                                                app_data_entity_id:Entity.Id
                                                        }}).result
                                    .filter((/**@type{server['ORM']['Object']['AppDataResourceMaster']}*/payment_request)=>
                                        payment_request.Document?.PaymentRequestId==token?.app_custom_id
                                    )[0];

    if (customer && payment_request && payment_request.Id!=null && (server.ORM.UtilNumberValue(parameters.data.status)==1 || server.ORM.UtilNumberValue(parameters.data.status)==0)){
        let status ='PENDING';
        if (server.ORM.UtilNumberValue(parameters.data.status)==1)
            try {
                /**@type{server['ORM']['Object']['AppDataResourceDetail'] & {Id:number, Document:bank_account}}}*/
                const account_payer         =  server.ORM.db.AppDataResourceDetail.get({  app_id:parameters.app_id, 
                                                                            resource_id:null, 
                                                                            data:{  iam_user_id:parameters.data.iam_user_id,
                                                                                    data_app_id:parameters.app_id,
                                                                                    resource_name:'ACCOUNT',
                                                                                    app_data_resource_master_id:customer.Id,
                                                                                    app_data_entity_id:Entity.Id
                                                                            }}).result[0];
                /**@type{number} */
                const account_payer_saldo   =  server.ORM.db.AppDataResourceDetailData.get({  app_id:parameters.app_id, 
                                                                                resource_id:null, 
                                                                                data:{  app_data_resource_detail_id:account_payer.Id,
                                                                                        iam_user_id:parameters.data.iam_user_id,
                                                                                        data_app_id:parameters.data.data_app_id,
                                                                                        resource_name:'ACCOUNT',
                                                                                        resource_name_master_attribute:'CUSTOMER',
                                                                                        resource_name_data_master_attribute:null,
                                                                                        app_data_entity_id:Entity.Id
                                                                                }}).result.reduce(( /**@type{number}*/balance, 
                                                                                                    /**@type{server['ORM']['Object']['AppDataResourceDetailData'] & {Document:bank_transaction}}*/current_row)=>
                                                                                    balance += (current_row.Document.AmountDeposit ?? current_row.Document.AmountWithdrawal) ?? 0,0
                                                                                );
                if ((account_payer_saldo - (payment_request.Document.Amount??0)) <0)
                    status='NO FUNDS';
                else{
                    /**@type{server['ORM']['Object']['AppDataResourceDetailData'] & {Document:bank_transaction}} */
                    const data_debit = {Document                               : {  Timestamp:new Date().toISOString(),
                                                                                    Logo:'',
                                                                                    Origin:payment_request.Document.Reference,
                                                                                    AmountDeposit:null,
                                                                                    AmountWithdrawal:(payment_request.Document.Amount??0) *-1},
                                        AppDataResourceDetailId             : account_payer.Id,
                                        AppDataResourceMasterAttributeId   : null
                                        };
                    //create DEBIT transaction PAYERID resource TRANSACTION
                    await server.ORM.db.AppDataResourceDetailData.post({app_id:parameters.app_id, data:data_debit});
                    /**@type{server['ORM']['Object']['AppDataResourceDetailData'] & {Document:bank_account}} */
                    const account_payee         =  server.ORM.db.AppDataResourceDetail.get({  app_id:parameters.app_id, 
                                                                                all_users:true,
                                                                                resource_id:null, 
                                                                                data:{  iam_user_id:null,
                                                                                        data_app_id:parameters.data.data_app_id,
                                                                                        resource_name:'ACCOUNT',
                                                                                        app_data_resource_master_id:null,
                                                                                        app_data_entity_id:Entity.Id
                                                                                }}).result
                                                            .filter((/**@type{server['ORM']['Object']['AppDataResourceDetail'] & {Document:bank_account}}*/account)=>
                                                                account.Document?.BankAccountVpa == payment_request.Document.PayeeId
                                                            )[0];
                    if (account_payee && account_payee.Id!=null){
                        /**@type{server['ORM']['Object']['AppDataResourceDetailData'] & {Document:bank_transaction}} */
                        const data_credit = {   Document                               : { Timestamp:new Date().toISOString(),
                                                                                           Logo:'',
                                                                                           Origin:payment_request.Document.Reference,
                                                                                           AmountDeposit:payment_request.Document.Amount,
                                                                                           AmountWithdrawal:null},
                                                AppDataResourceDetailId             : account_payee.Id,
                                                AppDataResourceMasterAttributeId   : null
                                                };
                        //create CREDIT transaction PAYEEID resource TRANSACTION
                        await server.ORM.db.AppDataResourceDetailData.post({app_id:parameters.app_id, data:data_credit});
                        status = 'PAID';
                    }
                    else
                        status = 'FAILED';
                }
            } catch (error) {
                status = 'FAILED';
            }
        else
            status='CANCELLED';
        //update status
        if (payment_request.Document?.Status)
            payment_request.Document.Status=status;
        const data_payment_request = {  Document     : payment_request.Document,
                                        data_app_id  : parameters.data.data_app_id
                                        };
        
        //update payment request
        await server.ORM.db.AppDataResourceMaster.update({app_id:parameters.app_id, 
                                            resource_id:payment_request.Id, 
                                            data:data_payment_request});
        return {result:[{status:status}], type:'JSON'};
   }
   else
        return {http:404,
            code:'PAYMENT_REQUEST_UPDATE',
            text:server.iam.iamUtilMessageNotAuthorized(),
            developerText:null,
            moreInfo:null,
            type:'JSON'
        };
};
export default paymentRequestUpdate;