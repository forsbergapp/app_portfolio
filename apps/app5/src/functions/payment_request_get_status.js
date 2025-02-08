/**
 * @module apps/app5/src/functions/payment_request_get_status
 */

/**
 * 
 * @import {server_server_response} from '../../../../server/types.js'
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
 *          idToken:string,
 *          authorization:string,
 *          locale:string}} parameters
 * @returns {Promise.<server_server_response & {result?:{message:string}}>}
 */
const paymentRequestGetStatus = async parameters =>{
     
    /**@type{import('./payment_request_create.js')} */
    const {getToken} = await import('./payment_request_create.js');

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
            const payment_request = await dbModelAppDataResourceMaster.get({   app_id:parameters.app_id, 
                                                                                resource_id:null, 
                                                                                data:{  data_app_id:parameters.app_id,
                                                                                        resource_name:'PAYMENT_REQUEST',
                                                                                        user_null:'0'
                                                                                }})
                                            .then(result=>
                                                result.result
                                                .map((/**@type{payment_request}*/payment_request)=>JSON.parse(payment_request.json_data??''))
                                                .filter((/**@type{payment_request}*/payment_request)=>payment_request.payment_request_id==body_decrypted.payment_request_id)[0]);
            try {
                const access_token = await getToken({app_id:parameters.app_id, authorization:parameters.authorization, ip:parameters.ip});
                //authenticate the app_custom_id is the payment request id
                if (access_token && access_token.app_custom_id == body_decrypted.payment_request_id){
                    /**
                     * @type {{ status:string}}
                     */
                    const data_return = {   status:                 payment_request.status};
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
                                    token:parameters.authorization.split('Bearer ')[1], 
                                    exp:access_token.exp
                                };
                                socketClientSend(user_connected.response, Buffer.from(JSON.stringify(message)).toString('base64'), 'APP_FUNCTION');    
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