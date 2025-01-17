/**
 * @module apps/app5/src/functions/payment_request_get_status
 */

/**
 * 
 * @import {server_server_response} from '../../../../server/types.js'
 * @typedef {server_server_response & {result?:{message:string}}} paymentRequestGetStatus
 * @import {payment_request, bank_account, merchant} from './types.js'
 */
/**
 * @name paymentRequestGetStatus
 * @description Get payment request status
 * @function
 * @param {{app_id:number,
 *          data:{  id:string,
 *                  message:string},
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          iam:string,
 *          locale:string}} parameters
 * @returns {Promise.<paymentRequestGetStatus>}
 */
const paymentRequestGetStatus = async parameters =>{
     
    const {default:jwt} = await import('jsonwebtoken');

    /**@type{import('../../../../server/db/fileModelAppSecret.js')} */
    const fileModelAppSecret = await import(`file://${process.cwd()}/server/db/fileModelAppSecret.js`);

    /**@type{import('../../../../server/db/dbModelAppDataResourceMaster.js')} */
    const dbModelAppDataResourceMaster = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceMaster.js`);

    /**@type{import('../../../../server/db/dbModelAppDataResourceDetail.js')} */
    const dbModelAppDataResourceDetail = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceDetail.js`);

    /**@type{import('../../../../server/security.js')} */
    const {securityPrivateDecrypt, securityPublicEncrypt} = await import(`file://${process.cwd()}/server/security.js`);

    /**@type{import('../../../../server/iam.js')} */
    const  {iamUtilMessageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);

    /**@type{import('../../../../server/socket.js')} */
    const {socketClientSend, socketConnectedGet} = await import(`file://${process.cwd()}/server/socket.js`);

    const merchant = await dbModelAppDataResourceMaster.get({   app_id:parameters.app_id, 
                                                                resource_id:null, 
                                                                data:{  data_app_id:parameters.app_id,
                                                                        resource_name:'MERCHANT',
                                                                        user_null:'0'
                                                                }})
                           .then(result=>result.result
                                                .map((/**@type{merchant}*/merchant)=>JSON.parse(merchant.json_data))
                                                .filter((/**@type{merchant}*/merchant)=>merchant.merchant_id==parameters.data.id)[0]);
    if (merchant){
        /** 
        * @type {{  api_secret:             string,
        *           payment_request_id:     string,
        *           origin:                 string}}
        */
        const  body_decrypted = JSON.parse(securityPrivateDecrypt(merchant.merchant_private_key, parameters.data.message));
        if (merchant.merchant_api_secret==body_decrypted.api_secret && merchant.merchant_url == body_decrypted.origin){
            const payment_requests = await dbModelAppDataResourceMaster.get({   app_id:parameters.app_id, 
                                                                                resource_id:null, 
                                                                                data:{  data_app_id:parameters.app_id,
                                                                                        resource_name:'PAYMENT_REQUEST',
                                                                                        user_null:'0'
                                                                                }})
                                            .then(result=>result.result.map((/**@type{payment_request}*/payment_request)=>JSON.parse(payment_request.json_data??'')));
            const payment_request = payment_requests.filter((/**@type{payment_request}*/payment_request)=>payment_request.payment_request_id==body_decrypted.payment_request_id)[0];
            /**@type{{id:number, name:string, ip:string, scope:string, exp:number, iat:number, tokentimestamp:number}|*} */
            const token_decoded = jwt.verify(payment_request.token, fileModelAppSecret.get({app_id:parameters.app_id, resource_id:parameters.app_id}).result[0].common_app_id_secret);
            
            if (payment_request && (((payment_request.exp ?? 0) * 1000) - Date.now())>0 &&
                token_decoded.id == payment_request.payerid && 
                token_decoded.scope == 'APP_CUSTOM' && 
                token_decoded.ip == parameters.ip){
                    /**
                     * @type {{ status:string}}
                     */
                    const data_return = {   status:                 payment_request.status
                    };
                    const data_encrypted = securityPublicEncrypt(merchant.merchant_public_key, JSON.stringify(data_return));

                    const account_payer =  await dbModelAppDataResourceDetail.get({ app_id:parameters.app_id, 
                                                                                    resource_id:null, 
                                                                                    data:{  data_app_id:parameters.app_id,
                                                                                            resource_name:'ACCOUNT',
                                                                                            user_null:'0'
                                                                                    }})
                                                    .then(result=>result.result.filter((/**@type{bank_account}*/result)=>result.bank_account_vpa == payment_request.payerid)[0]);
                    if (account_payer){
                        //if status is still pending then send server side event message to customer
                        if (payment_request.status=='PENDING'){
                            const customer = await dbModelAppDataResourceMaster.get({   app_id:parameters.app_id, 
                                                                                        resource_id:account_payer.app_data_resource_master_id, 
                                                                                        data:{  data_app_id:parameters.app_id,
                                                                                                resource_name:'CUSTOMER',
                                                                                                user_null:'0'
                                                                                        }})
                                                    .then(result=>result.result[0]);
                            //check SOCKET connected list
                            for (const user_connected of socketConnectedGet(customer.user_account_app_user_account_id ?? 0)){
                                const message = {
                                    type: 'PAYMENT_REQUEST', 
                                    payment_request_id:payment_request.payment_request_id, 
                                    exp:payment_request.exp
                                };
                                socketClientSend(user_connected.response, btoa(JSON.stringify(message)), 'APP_FUNCTION');    
                            }
                        }
                        return {result:{message:data_encrypted}, type:'JSON'};
                    }
                    else
                        return {http:404,
                                code:'PAYMENT_REQUEST_GET_STATUS',
                                text:iamUtilMessageNotAuthorized(),
                                developerText:null,
                                moreInfo:null,
                                type:'JSON'
                            };
            }
            else
                return {http:404,
                        code:'PAYMENT_REQUEST_GET_STATUS',
                        text:iamUtilMessageNotAuthorized(),
                        developerText:null,
                        moreInfo:null,
                        type:'JSON'
                    };
        }
        else
            return {http:404,
                    code:'PAYMENT_REQUEST_GET_STATUS',
                    text:iamUtilMessageNotAuthorized(),
                    developerText:null,
                    moreInfo:null,
                    type:'JSON'
                };
    }
    else
        return {http:404,
                code:'PAYMENT_REQUEST_GET_STATUS',
                text:iamUtilMessageNotAuthorized(),
                developerText:null,
                moreInfo:null,
                type:'JSON'
            };
};
export default paymentRequestGetStatus;