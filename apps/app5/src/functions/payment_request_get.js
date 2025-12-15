/**
 * @module apps/app5/src/functions/payment_request_get
 */

/**
 * @import {server} from '../../../../server/types.js'
 * @import {currency, payment_request, bank_account, merchant} from './types.js'
 */
const {server} = await import('../../../../server/server.js');
const {getToken} = await import('./payment_request_create.js');
/**
 * @name paymentRequestGet
 * @description Get payment request
 * @function
 * @param {{app_id:number,
 *          data:{  data_app_id:number,
 *                  iam_user_id:number,
 *                  token: string},
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          idToken:string,
 *          authorization:string,
 *          accept_language:string}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:{
 *                                              PaymentRequestMessage:  string,
 *                                              Token:                  string,
 *                                              Exp:                    number|null,
 *                                              Iat:                    number|null,
 *                                              PaymentRequestId:       string,
 *                                              Status:                 string,
 *                                              MerchantName:           string,
 *                                              Amount:			        number|null,
 *                                              CurrencySymbol:         string,
 *                                              Countdown:              string}[]}>}
 */
const paymentRequestGet = async parameters =>{

    /**@type{server['ORM']['Object']['AppDataEntity'] & {Id:number}} */
    const Entity    = server.ORM.db.AppDataEntity.get({   app_id:parameters.app_id, 
                                            resource_id:null, 
                                            data:{data_app_id:parameters.data.data_app_id}}).result[0];

    const token = await getToken({app_id:parameters.app_id, authorization:parameters.data.token, ip:parameters.ip});

    //get payment request using app_custom_id that should be the payment request id
    /**@type{server['ORM']['Object']['AppDataResourceMaster'] & {Document:payment_request}} */
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
    if (payment_request){
        /**@type{server['ORM']['Object']['AppDataResourceDetail'] & {Document:bank_account}} */
        const account_payer = server.ORM.db.AppDataResourceDetail.get({   app_id:parameters.app_id, 
                                                            all_users:true,
                                                            resource_id:null, 
                                                            data:{  iam_user_id:parameters.data.iam_user_id,
                                                                    data_app_id:parameters.app_id,
                                                                    resource_name:'ACCOUNT',
                                                                    app_data_resource_master_id:null,
                                                                    app_data_entity_id:Entity.Id
                                                            }}).result
                                .filter((/**@type{server['ORM']['Object']['AppDataResourceDetail']}*/result)=>
                                    result.Document?.BankAccountVpa == payment_request.Document.PayerId
                                )[0];
        /**@type{server['ORM']['Object']['AppDataResourceMaster'] & {Document:merchant}} */
        const merchant      = server.ORM.db.AppDataResourceMaster.get({   app_id:parameters.app_id, 
                                                            all_users:true,
                                                            resource_id:null, 
                                                            data:{  iam_user_id:null,
                                                                    data_app_id:parameters.app_id,
                                                                    resource_name:'MERCHANT',
                                                                    app_data_entity_id:Entity.Id
                                                            }}).result
                                .filter((/**@type{server['ORM']['Object']['AppDataResourceMaster']}*/merchant)=>
                                    merchant.Document?.MerchantId==payment_request.Document.MerchantId
                                )[0];
        /**@type{server['ORM']['Object']['AppDataResourceMaster'] & {Document:currency}} */
        const currency      = server.ORM.db.AppDataResourceMaster.get({   app_id:parameters.app_id, 
                                                            resource_id:null, 
                                                            data:{  iam_user_id:null,
                                                                    data_app_id:parameters.data.data_app_id,
                                                                    resource_name:'CURRENCY',
                                                                    app_data_entity_id:Entity.Id
                                                            }}).result[0];
        if (account_payer && merchant && currency){
            return  {result:[{   PaymentRequestMessage:'Authorize this payment',
                                Token:                  parameters.data.token,
                                Exp:                    token?.exp??null,
                                Iat:                    token?.iat??null,
                                PaymentRequestId:       payment_request.Document?.PaymentRequestId??'',
                                Status:                 payment_request.Document?.Status??'',
                                MerchantName:           merchant.Document?.MerchantName??'',
                                Amount:			        server.ORM.UtilNumberValue(payment_request.Document?.Amount),
                                CurrencySymbol:         currency.Document?.CurrencySymbol??'',
                                Countdown:              ''}],
                    type:'JSON'};
            }
        else
            return {http:404,
                    code:'PAYMENT_REQUEST_GET',
                    text:server.iam.iamUtilMessageNotAuthorized(),
                    developerText:null,
                    moreInfo:null,
                    type:'JSON'
                };
    }
    else
        return {http:404,
                code:'PAYMENT_REQUEST_GET',
                text:server.iam.iamUtilMessageNotAuthorized(),
                developerText:null,
                moreInfo:null,
                type:'JSON'
            };
};
export default paymentRequestGet;