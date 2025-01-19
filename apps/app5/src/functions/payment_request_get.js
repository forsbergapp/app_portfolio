/**
 * @module apps/app5/src/functions/payment_request_get
 */

/**
 * @import {server_server_response} from '../../../../server/types.js'
 * @import {payment_request, bank_account, merchant} from './types.js'
 * @typedef {server_server_response & {result?:{payment_request_message:string,
 *                                              token:                  string,
 *                                              exp:                    number,
 *                                              iat:                    number,
 *                                              tokentimestamp:         number,
 *                                              payment_request_id:     string,
 *                                              status:                 string,
 *                                              merchant_name:          string,
 *                                              amount:			        number,
 *                                              currency_symbol:        string,
 *                                              countdown:              string}[]}} paymentRequestGet
 */

/**
 * @name paymentRequestGet
 * @description Get payment request
 * @function
 * @param {{app_id:number,
 *          data:{  data_app_id:number,
 *                  user_account_id:number,
 *                  payment_request_id: string},
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          idToken:string,
 *          locale:string}} parameters
 * @returns {Promise.<paymentRequestGet>}
 */
const paymentRequestGet = async parameters =>{
    /**@type{import('../../../../server/db/dbModelAppDataResourceMaster.js')} */
    const dbModelAppDataResourceMaster = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceMaster.js`);

    /**@type{import('../../../../server/db/dbModelAppDataResourceDetail.js')} */
    const dbModelAppDataResourceDetail = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceDetail.js`);

    /**@type{import('../../../../server/iam.js')} */
    const  {iamUtilMessageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);

    const payment_request = await dbModelAppDataResourceMaster.get({app_id:parameters.app_id, 
                                                                    resource_id:null, 
                                                                    data:{  data_app_id:parameters.data.data_app_id,
                                                                            resource_name:'PAYMENT_REQUEST',
                                                                            user_null:'0'
                                                                    }})
                                    .then(result=>result.result.filter((/**@type{payment_request}*/payment_request)=>payment_request.payment_request_id==parameters.data.payment_request_id)[0]);
    if (payment_request){
        const account_payer = await dbModelAppDataResourceDetail.get({  app_id:parameters.app_id, 
                                                                        resource_id:null, 
                                                                        data:{  user_account_id:parameters.data.user_account_id,
                                                                                data_app_id:parameters.app_id,
                                                                                resource_name:'ACCOUNT',
                                                                                user_null:'0'
                                                                        }})
                                        .then(result=>result.result.filter((/**@type{bank_account}*/result)=>result.bank_account_vpa == payment_request.payerid)[0]);
        const merchant      = await dbModelAppDataResourceMaster.get({app_id:parameters.app_id, 
                                                                        resource_id:null, 
                                                                        data:{  data_app_id:parameters.app_id,
                                                                                resource_name:'MERCHANT',
                                                                                user_null:'0'
                                                                        }})
                                        .then(result=>result.result.map((/**@type{merchant}*/merchant)=>JSON.parse(merchant.json_data)).filter((/**@type{merchant}*/merchant)=>merchant.merchant_id==payment_request.merchant_id)[0]);
        const currency      = await dbModelAppDataResourceMaster.get({  app_id:parameters.app_id, 
                                                                        resource_id:null, 
                                                                        data:{data_app_id:parameters.data.data_app_id,
                                                                            resource_name:'CURRENCY',
                                                                            user_null:'1'
                                                                        }})
                                        .then(result=>JSON.parse(result.result[0].json_data));
        if (account_payer && merchant && currency){
            return  {result:[{   payment_request_message:'Authorize this payment',
                                token:                  payment_request.token,
                                exp:                    payment_request.exp,
                                iat:                    payment_request.iat,
                                tokentimestamp:         payment_request.tokentimestamp,
                                payment_request_id:     payment_request.payment_request_id,
                                status:                 payment_request.status,
                                merchant_name:          merchant.merchant_name,
                                amount:			        payment_request.amount,
                                currency_symbol:        currency.currency_symbol,
                                countdown:              ''}],
                    type:'JSON'};
            }
        else
            return {http:404,
                    code:'PAYMENT_REQUEST_GET',
                    text:iamUtilMessageNotAuthorized(),
                    developerText:null,
                    moreInfo:null,
                    type:'JSON'
                };
    }
    else
        return {http:404,
                code:'PAYMENT_REQUEST_GET',
                text:iamUtilMessageNotAuthorized(),
                developerText:null,
                moreInfo:null,
                type:'JSON'
            };
};
export default paymentRequestGet;