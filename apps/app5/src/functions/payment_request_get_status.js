/**
 * @module apps/app5/src/functions/payment_request_get_status
 */

/**
 * 
 * @import {server_server_response, 
 *          server_db_table_AppDataEntity, server_db_table_AppDataResourceMaster, server_db_table_AppDataResourceDetail} from '../../../../server/types.js'
 * @import {payment_request, bank_account, merchant} from './types.js'
 */
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
 * @returns {Promise.<server_server_response & {result?:{message:string}}>}
 */
const paymentRequestGetStatus = async parameters =>{
     
    const {getToken} = await import('./payment_request_create.js');
    const {ORM, serverUtilNumberValue} = await import('../../../../server/server.js');
    const {securityPrivateDecrypt, securityPublicEncrypt} = await import('../../../../server/security.js');
    const  {iamUtilMessageNotAuthorized} = await import('../../../../server/iam.js');
    const {socketClientPostMessage} = await import('../../../../server/socket.js');

    /**@type{server_db_table_AppDataEntity} */
    const Entity    = ORM.db.AppDataEntity.get({   app_id:parameters.app_id, 
                                            resource_id:null, 
                                            data:{data_app_id:parameters.app_id}}).result[0];


    const merchant = await ORM.db.AppDataResourceMaster.get({   app_id:parameters.app_id, 
                                                                all_users:true,
                                                                resource_id:null, 
                                                                data:{  iam_user_id:null,
                                                                        data_app_id:parameters.app_id,
                                                                        resource_name:'MERCHANT',
                                                                        app_data_entity_id:Entity.id
                                                                }}).result
                            .filter((/**@type{server_db_table_AppDataResourceMaster}*/merchant)=>
                                serverUtilNumberValue(merchant.json_data?.merchant_id)==parameters.data.id
                            )[0];
    if (merchant){
        /** 
         * @type {{  api_secret:             string,
         *           payment_request_id:     string,
         *           origin:                 string}}
         */
        const  body_decrypted = JSON.parse(securityPrivateDecrypt(merchant.merchant_private_key, parameters.data.message));
        if (merchant.json_data.merchant_api_secret==body_decrypted.api_secret && merchant.json_data.merchant_url == body_decrypted.origin){
            /**@type{payment_request} */
            const payment_request = await ORM.db.AppDataResourceMaster.get({   app_id:parameters.app_id, 
                                                                        all_users:true,
                                                                        resource_id:null, 
                                                                        data:{  iam_user_id:null,
                                                                                data_app_id:parameters.app_id,
                                                                                resource_name:'PAYMENT_REQUEST',
                                                                                app_data_entity_id:Entity.id
                                                                        }}).result
                                            .filter((/**@type{server_db_table_AppDataResourceMaster}*/payment_request)=>
                                                payment_request.json_data?.payment_request_id==body_decrypted.payment_request_id
                                            )[0];
            try {
                const access_token = await getToken({app_id:parameters.app_id, authorization:parameters.authorization, ip:parameters.ip});
                //authenticate the app_custom_id is the payment request id
                if (access_token && access_token.app_custom_id == body_decrypted.payment_request_id){
                    /**
                     * @type {{ status:string}}
                     */
                    const data_return = {   status:                 payment_request.status};
                    const data_encrypted = securityPublicEncrypt(merchant.merchant_public_key, JSON.stringify(data_return));

                    /**@type{bank_account & {app_data_resource_master_id:server_db_table_AppDataResourceDetail['app_data_resource_master_id']}}*/
                    const account_payer =  ORM.db.AppDataResourceDetail.get({  app_id:parameters.app_id, 
                                                                        all_users:true,
                                                                        resource_id:null, 
                                                                        data:{  iam_user_id:null,
                                                                                data_app_id:parameters.app_id,
                                                                                resource_name:'ACCOUNT',
                                                                                app_data_resource_master_id:null,
                                                                                app_data_entity_id:Entity.id
                                                                        }}).result
                                        .filter((/**@type{server_db_table_AppDataResourceDetail}*/result)=>
                                            result.json_data?.bank_account_vpa == payment_request.payerid
                                        )[0];
                    if (account_payer){
                        //if status is still pending then send server side event message to customer
                        if (payment_request.status=='PENDING'){
                            /**@type{server_db_table_AppDataResourceMaster} */
                            const customer = ORM.db.AppDataResourceMaster.get({app_id:parameters.app_id, 
                                                                        all_users:true,
                                                                        resource_id:account_payer.app_data_resource_master_id, 
                                                                        data:{  iam_user_id:null,
                                                                                data_app_id:parameters.app_id,
                                                                                resource_name:'CUSTOMER',
                                                                                app_data_entity_id:Entity.id
                                                                        }}).result[0];
                            //send payment request message
                            socketClientPostMessage({   app_id:parameters.app_id,
                                                        resource_id:null,
                                                        data:{  data_app_id:null,
                                                                iam_user_id:ORM.db.IamUserApp.get({app_id:parameters.app_id, resource_id:customer.iam_user_app_id, data:{iam_user_id:null, data_app_id:null}}).result[0].iam_user_id,
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
                                text:iamUtilMessageNotAuthorized(),
                                developerText:null,
                                moreInfo:null,
                                type:'JSON'
                            };
                }
                else
                    //wrong payer id in the token
                    return {http:404,
                            code:'PAYMENT_REQUEST_GET_STATUS',
                            text:iamUtilMessageNotAuthorized(),
                            developerText:null,
                            moreInfo:null,
                            type:'JSON'
                        };
                    
            } catch (error) {
                //token expired or other error
                return {http:404,
                    code:'PAYMENT_REQUEST_GET_STATUS',
                    text:iamUtilMessageNotAuthorized(),
                    developerText:null,
                    moreInfo:null,
                    type:'JSON'
                };    
            }
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