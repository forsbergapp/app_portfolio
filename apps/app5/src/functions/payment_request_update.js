/**
 * @module apps/app5/src/functions/payment_request_update
 */

/**
 * @import {server_server_response} from '../../../../server/types.js'
 * @typedef {server_server_response & {result?:{status:string}[]}} paymentRequestUpdate
 */
/**
 * @name paymentRequestUpdate
 * @description Update payment request
 * @function
 * @param {{app_id:number,
 *          data:{  data_app_id:number,
 *                  user_account_id:number,
 *                  payment_request_id:string,
 *                  status:1|0},
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          iam:string,
 *          locale:string}} parameters
 * @returns {Promise.<paymentRequestUpdate>}
 */
const paymentRequestUpdate = async parameters =>{

    /**@type{import('../../../../server/server.js')} */
    const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

    /**@type{import('../../../../server/db/dbModelAppDataResourceMaster.js')} */
    const dbModelAppDataResourceMaster = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceMaster.js`);

    /**@type{import('../../../../server/db/dbModelAppDataResourceDetail.js')} */
    const dbModelAppDataResourceDetail = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceDetail.js`);

    /**@type{import('../../../../server/db/dbModelAppDataResourceDetailData.js')} */
    const dbModelAppDataResourceDetailData = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceDetailData.js`);

    /**@type{import('../../../../server/iam.js')} */
    const  {iamUtilMessageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);

    const customer = await dbModelAppDataResourceMaster.get({app_id:parameters.app_id, 
                                                                resource_id:null, 
                                                                data:{  user_account_id:parameters.data.user_account_id,
                                                                        data_app_id:parameters.data.data_app_id,
                                                                        resource_name:'CUSTOMER',
                                                                        user_null:'0'
                                                                }})
                            .then(result=>result.result[0]);
    const payment_request = await dbModelAppDataResourceMaster.get({app_id:parameters.app_id, 
                                                                    resource_id:null, 
                                                                    data:{  data_app_id:parameters.data.data_app_id,
                                                                            resource_name:'PAYMENT_REQUEST',
                                                                            user_null:'0'
                                                                    }})
                                    .then(result=>result.result
                                            .filter(payment_request=>payment_request.payment_request_id==parameters.data.payment_request_id)[0]);

    if (customer && payment_request && (serverUtilNumberValue(parameters.data.status)==1 || serverUtilNumberValue(parameters.data.status)==0)){
        let status ='PENDING';
        if (serverUtilNumberValue(parameters.data.status)==1)
            /**@ts-ignore */
            if ((((payment_request.exp ?? 0) * 1000) - Date.now())<0)
                status = 'EXPIRED';
            else
                try {
                    const account_payer         =  await dbModelAppDataResourceDetail.get({app_id:parameters.app_id, 
                                                                                            resource_id:null, 
                                                                                            data:{  master_id:customer.id,
                                                                                                    user_account_id:parameters.data.user_account_id,
                                                                                                    data_app_id:parameters.app_id,
                                                                                                    resource_name:'ACCOUNT',
                                                                                                    user_null:'0'
                                                                                            }})
                                                            .then(result=>result.result[0]);
                    const account_payer_saldo   =  await dbModelAppDataResourceDetailData.get({ app_id:parameters.app_id, 
                                                                                                resource_id:null, 
                                                                                                data:{  app_data_detail_id:account_payer.id,
                                                                                                        user_account_id:parameters.data.user_account_id,
                                                                                                        data_app_id:parameters.data.data_app_id,
                                                                                                        resource_name_type:'RESOURCE_TYPE',
                                                                                                        resource_name:'ACCOUNT',
                                                                                                        resource_name_master_attribute_type:'RESOURCE_TYPE',
                                                                                                        resource_name_master_attribute:'CUSTOMER',
                                                                                                        user_null:'0'
                                                                                                }})
                                                            .then(result=>result.result.reduce((/**@type{number}*/balance, current_row)=>balance += 
                                                                                                        (current_row.amount_deposit ?? current_row.amount_withdrawal) ?? 0,0));
                    if ((account_payer_saldo - payment_request.amount) <0)
                        status='NO FUNDS';
                    else{
                        const data_debit = {json_data                               : { timestamp:new Date().toISOString(),
                                                                                        logo:'',
                                                                                        origin:payment_request.reference,
                                                                                        amount_deposit:null,
                                                                                        amount_withdrawal:payment_request.amount *-1},
                                            user_account_id                         : parameters.data.user_account_id,
                                            data_app_id                             : parameters.data.data_app_id,
                                            app_data_resource_detail_id             : account_payer.id,
                                            app_data_resource_master_attribute_id   : null
                                            };
                        //create DEBIT transaction PAYERID resource TRANSACTION
                        await dbModelAppDataResourceDetailData.post({app_id:parameters.app_id, data:data_debit});

                        const account_payee         =  await dbModelAppDataResourceDetail.get({ app_id:parameters.app_id, 
                                                                                                resource_id:null, 
                                                                                                data:{  data_app_id:parameters.data.data_app_id,
                                                                                                        resource_name:'ACCOUNT',
                                                                                                        user_null:'0'
                                                                                                }})
                                                                .then(result=>result.result.filter(account=>account.bank_account_vpa == payment_request.payeeid)[0]);
                        const data_credit = {   json_data                               : { timestamp:new Date().toISOString(),
                                                                                            logo:'',
                                                                                            origin:payment_request.reference,
                                                                                            amount_deposit:payment_request.amount,
                                                                                            amount_withdrawal:null},
                                                                                        
                                                user_account_id                         : account_payee.user_account_app_user_account_id,
                                                data_app_id                             : parameters.data.data_app_id,
                                                app_data_resource_detail_id             : account_payee.id,
                                                app_data_resource_master_attribute_id   : null
                                                };
                        //create CREDIT transaction PAYEEID resource TRANSACTION
                        await dbModelAppDataResourceDetailData.post({app_id:parameters.app_id, data:data_credit});
                        status = 'PAID';
                    }
                } catch (error) {
                    status = 'FAILED';
                }
        else
            status='CANCELLED';

        const data_payment_request = {  json_data                                       : JSON.parse(payment_request.json_data),
                                        user_account_id                                 : payment_request.user_account_app_user_account_id,
                                        data_app_id                                     : parameters.data.data_app_id,
                                        app_data_entity_resource_app_data_entity_id     : payment_request.app_data_entity_resource_app_data_entity_id,
                                        app_data_entity_resource_id                     : payment_request.app_data_entity_resource_id
                                        };
        //update status in json_data column
        data_payment_request.json_data.status = status;
        //update payment request
        await dbModelAppDataResourceMaster.update({app_id:parameters.app_id, resource_id:payment_request.id, data:data_payment_request});
        return {result:{status:status}, type:'JSON'};
   }
   else
        return {http:404,
            code:'PAYMENT_REQUEST_UPDATE',
            text:iamUtilMessageNotAuthorized(),
            developerText:null,
            moreInfo:null,
            type:'JSON'
        };
};
export default paymentRequestUpdate;