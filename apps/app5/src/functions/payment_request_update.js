/**
 * @module apps/app5/src/functions/payment_request_update
 */

/**
 * @import {server_server_response, 
 *          server_db_table_AppDataResourceMaster, server_db_table_AppDataResourceDetail, 
 *          server_db_table_AppDataResourceDetailData, server_db_table_AppDataEntity} from '../../../../server/types.js'
 * @import {payment_request, bank_account, bank_transaction} from './types.js'
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
 *          locale:string}} parameters
 * @returns {Promise.<server_server_response & {result?:{status:string}[]}>}
 */
const paymentRequestUpdate = async parameters =>{

    /**@type{server_db_table_AppDataEntity} */
    const Entity    = server.ORM.db.AppDataEntity.get({   app_id:parameters.app_id, 
                                            resource_id:null, 
                                            data:{data_app_id:parameters.data.data_app_id}}).result[0];

    const customer = server.ORM.db.AppDataResourceMaster.get({app_id:parameters.app_id, 
                                                resource_id:null, 
                                                data:{  iam_user_id:parameters.data.iam_user_id,
                                                        data_app_id:parameters.data.data_app_id,
                                                        resource_name:'CUSTOMER',
                                                        app_data_entity_id:Entity.id
                                                }}).result[0];

    const token = await getToken({app_id:parameters.app_id, authorization:parameters.data.token, ip:parameters.ip});

    //get payment request using app_custom_id that should be the payment request id
    /**@type{payment_request & {id:server_db_table_AppDataResourceMaster['id']}}*/
    const payment_request = server.ORM.db.AppDataResourceMaster.get({ app_id:parameters.app_id, 
                                                        all_users:true,
                                                        resource_id:null, 
                                                        data:{  iam_user_id:null,
                                                                data_app_id:parameters.data.data_app_id,
                                                                resource_name:'PAYMENT_REQUEST',
                                                                app_data_entity_id:Entity.id
                                                        }}).result
                                    .filter((/**@type{server_db_table_AppDataResourceMaster}*/payment_request)=>
                                        payment_request.json_data?.payment_request_id==token?.app_custom_id
                                    )[0];

    if (customer && payment_request && payment_request.id!=null && (server.ORM.UtilNumberValue(parameters.data.status)==1 || server.ORM.UtilNumberValue(parameters.data.status)==0)){
        let status ='PENDING';
        if (server.ORM.UtilNumberValue(parameters.data.status)==1)
            try {
                const account_payer         =  server.ORM.db.AppDataResourceDetail.get({  app_id:parameters.app_id, 
                                                                            resource_id:null, 
                                                                            data:{  iam_user_id:parameters.data.iam_user_id,
                                                                                    data_app_id:parameters.app_id,
                                                                                    resource_name:'ACCOUNT',
                                                                                    app_data_resource_master_id:customer.id,
                                                                                    app_data_entity_id:Entity.id
                                                                            }}).result[0];
                /**@type{number} */
                const account_payer_saldo   =  server.ORM.db.AppDataResourceDetailData.get({  app_id:parameters.app_id, 
                                                                                resource_id:null, 
                                                                                data:{  app_data_resource_detail_id:account_payer.id,
                                                                                        iam_user_id:parameters.data.iam_user_id,
                                                                                        data_app_id:parameters.data.data_app_id,
                                                                                        resource_name:'ACCOUNT',
                                                                                        resource_name_master_attribute:'CUSTOMER',
                                                                                        resource_name_data_master_attribute:null,
                                                                                        app_data_entity_id:Entity.id
                                                                                }}).result.reduce(( /**@type{number}*/balance, 
                                                                                                    /**@type{server_db_table_AppDataResourceDetailData & {json_data:bank_transaction}}*/current_row)=>
                                                                                    balance += (current_row.json_data.amount_deposit ?? current_row.json_data.amount_withdrawal) ?? 0,0
                                                                                );
                if ((account_payer_saldo - (payment_request.amount??0)) <0)
                    status='NO FUNDS';
                else{
                    /**@type{server_db_table_AppDataResourceDetailData} */
                    const data_debit = {json_data                               : { timestamp:new Date().toISOString(),
                                                                                    logo:'',
                                                                                    origin:payment_request.reference,
                                                                                    amount_deposit:null,
                                                                                    amount_withdrawal:(payment_request.amount??0) *-1},
                                        app_data_resource_detail_id             : account_payer.id,
                                        app_data_resource_master_attribute_id   : null
                                        };
                    //create DEBIT transaction PAYERID resource TRANSACTION
                    await server.ORM.db.AppDataResourceDetailData.post({app_id:parameters.app_id, data:data_debit});
                    /**@type{bank_account & {id:server_db_table_AppDataResourceDetail['id']}} */
                    const account_payee         =  server.ORM.db.AppDataResourceDetail.get({  app_id:parameters.app_id, 
                                                                                all_users:true,
                                                                                resource_id:null, 
                                                                                data:{  iam_user_id:null,
                                                                                        data_app_id:parameters.data.data_app_id,
                                                                                        resource_name:'ACCOUNT',
                                                                                        app_data_resource_master_id:null,
                                                                                        app_data_entity_id:Entity.id
                                                                                }}).result
                                                            .filter((/**@type{server_db_table_AppDataResourceDetail}*/account)=>
                                                                account.json_data?.bank_account_vpa == payment_request.payeeid
                                                            )[0];
                    if (account_payee && account_payee.id!=null){
                        /**@type{server_db_table_AppDataResourceDetailData} */
                        const data_credit = {   json_data                               : { timestamp:new Date().toISOString(),
                                                                                            logo:'',
                                                                                            origin:payment_request.reference,
                                                                                            amount_deposit:payment_request.amount,
                                                                                            amount_withdrawal:null},
                                                app_data_resource_detail_id             : account_payee.id,
                                                app_data_resource_master_attribute_id   : null
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
        if (payment_request.json_data?.status)
            payment_request.json_data.status=status;
        const data_payment_request = {  json_data                                       : payment_request.json_data,
                                        data_app_id                                     : parameters.data.data_app_id
                                        };
        
        //update payment request
        await server.ORM.db.AppDataResourceMaster.update({app_id:parameters.app_id, 
                                            resource_id:payment_request.id, 
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