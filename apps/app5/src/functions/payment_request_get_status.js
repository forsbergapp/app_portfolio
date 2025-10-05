/**
 * @module apps/app5/src/functions/payment_request_get_status
 */

/**
 * 
 * @import {server} from '../../../../server/types.js'
 * @import {payment_request, bank_account} from './types.js'
 */

const {server} = await import('../../../../server/server.js');
const {getToken} = await import('./payment_request_create.js');
/**
 * @name paymentRequestGetStatus
 * @description Get payment request status
 * @function
 * @param {{app_id:number,
 *          data:{  id:number,
 *                  message:string},
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          idToken:string,
 *          authorization:string,
 *          locale:string}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:{message:string}}>}
 */
const paymentRequestGetStatus = async parameters =>{
     
    /**@type{server['ORM']['Object']['AppDataEntity'] & {Id:number}} */
    const Entity    = server.ORM.db.AppDataEntity.get({   app_id:parameters.app_id, 
                                            resource_id:null, 
                                            data:{data_app_id:parameters.app_id}}).result[0];


    const merchant = await server.ORM.db.AppDataResourceMaster.get({   app_id:parameters.app_id, 
                                                                all_users:true,
                                                                resource_id:null, 
                                                                data:{  iam_user_id:null,
                                                                        data_app_id:parameters.app_id,
                                                                        resource_name:'MERCHANT',
                                                                        app_data_entity_id:Entity.Id
                                                                }}).result
                            .filter((/**@type{server['ORM']['Object']['AppDataResourceMaster']}*/merchant)=>
                                server.ORM.UtilNumberValue(merchant.Document?.MerchantId)==parameters.data.id
                            )[0];
    if (merchant){
        /** 
         * @type {{  api_secret:             string,
         *           payment_request_id:     string,
         *           origin:                 string}}
         */
        const  body_decrypted = JSON.parse(server.security.securityPrivateDecrypt(merchant.merchant_private_key, parameters.data.message));
        if (merchant.Document.MerchantApiSecret==body_decrypted.api_secret && merchant.Document.MerchantUrl == body_decrypted.origin){
            /**@type{payment_request} */
            const payment_request = await server.ORM.db.AppDataResourceMaster.get({   app_id:parameters.app_id, 
                                                                        all_users:true,
                                                                        resource_id:null, 
                                                                        data:{  iam_user_id:null,
                                                                                data_app_id:parameters.app_id,
                                                                                resource_name:'PAYMENT_REQUEST',
                                                                                app_data_entity_id:Entity.Id
                                                                        }}).result
                                            .filter((/**@type{server['ORM']['Object']['AppDataResourceMaster']}*/payment_request)=>
                                                payment_request.Document?.PaymentRequestId==body_decrypted.payment_request_id
                                            )[0];
            try {
                const access_token = await getToken({app_id:parameters.app_id, authorization:parameters.authorization, ip:parameters.ip});
                //authenticate the app_custom_id is the payment request id
                if (access_token && access_token.app_custom_id == body_decrypted.payment_request_id){
                    /**
                     * @type {{ status:string}}
                     */
                    const data_return = {   status:                 payment_request.Status};
                    const data_encrypted = server.security.securityPublicEncrypt(merchant.merchant_public_key, JSON.stringify(data_return));

                    /**@type{bank_account & {app_data_resource_master_id:server['ORM']['Object']['AppDataResourceDetail']['AppDataResourceMasterId']}}*/
                    const account_payer =  server.ORM.db.AppDataResourceDetail.get({  app_id:parameters.app_id, 
                                                                        all_users:true,
                                                                        resource_id:null, 
                                                                        data:{  iam_user_id:null,
                                                                                data_app_id:parameters.app_id,
                                                                                resource_name:'ACCOUNT',
                                                                                app_data_resource_master_id:null,
                                                                                app_data_entity_id:Entity.Id
                                                                        }}).result
                                        .filter((/**@type{server['ORM']['Object']['AppDataResourceDetail']}*/result)=>
                                            result.Document?.BankAccountVpa == payment_request.PayerId
                                        )[0];
                    if (account_payer){
                        //if status is still pending then send server side event message to customer
                        if (payment_request.Status=='PENDING'){
                            /**@type{server['ORM']['Object']['AppDataResourceMaster']} */
                            const customer = server.ORM.db.AppDataResourceMaster.get({app_id:parameters.app_id, 
                                                                        all_users:true,
                                                                        resource_id:account_payer.app_data_resource_master_id, 
                                                                        data:{  iam_user_id:null,
                                                                                data_app_id:parameters.app_id,
                                                                                resource_name:'CUSTOMER',
                                                                                app_data_entity_id:Entity.Id
                                                                        }}).result[0];
                            //send payment request message
                            server.socket.socketClientPostMessage({   app_id:parameters.app_id,
                                                        resource_id:null,
                                                        data:{  data_app_id:null,
                                                                iam_user_id:server.ORM.db.IamUserApp.get({app_id:parameters.app_id, resource_id:customer.IamUserAppId, data:{iam_user_id:null, data_app_id:null}}).result[0].IamUserId,
                                                                idToken:null,
                                                                message:JSON.stringify({
                                                                                        type: 'PAYMENT_REQUEST', 
                                                                                        token:parameters.authorization.split('Bearer ')[1], 
                                                                                        exp:access_token.exp
                                                                                    }),
                                                                message_type:'APP_FUNCTION'
                                                            }
                                                    });
                        }
                        return {result:{message:data_encrypted}, type:'JSON'};
                    }
                    else
                        return {http:404,
                                code:'PAYMENT_REQUEST_GET_STATUS',
                                text:server.iam.iamUtilMessageNotAuthorized(),
                                developerText:null,
                                moreInfo:null,
                                type:'JSON'
                            };
                }
                else
                    //wrong payer id in the token
                    return {http:404,
                            code:'PAYMENT_REQUEST_GET_STATUS',
                            text:server.iam.iamUtilMessageNotAuthorized(),
                            developerText:null,
                            moreInfo:null,
                            type:'JSON'
                        };
                    
            } catch (error) {
                //token expired or other error
                return {http:404,
                    code:'PAYMENT_REQUEST_GET_STATUS',
                    text:server.iam.iamUtilMessageNotAuthorized(),
                    developerText:null,
                    moreInfo:null,
                    type:'JSON'
                };    
            }
        }
        else
            return {http:404,
                    code:'PAYMENT_REQUEST_GET_STATUS',
                    text:server.iam.iamUtilMessageNotAuthorized(),
                    developerText:null,
                    moreInfo:null,
                    type:'JSON'
                };
    }
    else
        return {http:404,
                code:'PAYMENT_REQUEST_GET_STATUS',
                text:server.iam.iamUtilMessageNotAuthorized(),
                developerText:null,
                moreInfo:null,
                type:'JSON'
            };
};
export default paymentRequestGetStatus;