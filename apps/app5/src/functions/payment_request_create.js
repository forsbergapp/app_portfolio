/**
 * @module apps/app5/src/functions/payment_request_create
 */

/**
 * @import {server} from '../../../../server/types.js'
 * @import {payment_request, bank_account, merchant} from './types.js'
 */
const {server} = await import('../../../../server/server.js');
/**
 * @param {{app_id:number,
 *          authorization:string,
 *          ip:string}} parameters
 * @returns {Promise.<server['iam']['iam_access_token_claim'] & {exp?:number, iat?:number}|null>}
 */
const getToken = async parameters => {
   const token_verify = server.iam.iamUtilTokenGet(parameters.app_id, parameters.authorization, 'APP_ACCESS_EXTERNAL');
   if (token_verify.app_id         == parameters.app_id && 
       token_verify.ip             == parameters.ip && 
       token_verify.scope          == 'APP_EXTERNAL' &&
       //authenticated saved values in iam_app_access
       server.ORM.db.IamAppAccess.get(parameters.app_id, null).result
                       .filter((/**@type{server['ORM']['Object']['IamAppAccess']}*/row)=>
                                                               //Authenticate the token type
                                                               row.Type                    == 'APP_ACCESS_EXTERNAL' &&
                                                               //Authenticate app id
                                                               row.AppId                  == token_verify.app_id &&
                                                               //Authenticate IP address, the server should use 'x-forwarded-for' to authenticate client ip
                                                               row.Ip                      == token_verify.ip &&
                                                               //Authenticate token is valid
                                                               row.Res                     == 1 &&
                                                               //Authenticate the token string
                                                               row.Token                   == parameters.authorization.replace('Bearer ','')
                                                           )[0])
       return token_verify;
   else
       return null;
};
/**
* @name paymentRequestCreate
* @description Create payment request
* @function
* @param {{app_id:number,
*          data:{id:number,
*                message:string},
*          user_agent:string,
*          ip:string,
*          host:string,
*          idToken:string,
*          authorization:string,
*          accept_language:string}} parameters
* @returns {Promise.<server['server']['response'] & {result?:{message:string}}>}
*/
const paymentRequestCreate = async parameters =>{
   
   /**@type{server['ORM']['Object']['AppDataEntity'] & {Id:number}} */
   const Entity    = server.ORM.db.AppDataEntity.get({   app_id:parameters.app_id, 
                                           resource_id:null, 
                                           data:{data_app_id:parameters.app_id}}).result[0];
    /**@type{server['ORM']['Object']['AppDataResourceMaster'] & {Document:currency}} */
   const currency = server.ORM.db.AppDataResourceMaster.get({app_id:parameters.app_id, 
                                               resource_id:null, 
                                               data:{  iam_user_id:null,
                                                       data_app_id:parameters.app_id,
                                                       resource_name:'CURRENCY',
                                                       app_data_entity_id:Entity.Id
                                               }}).result[0];
   /**@type{server['ORM']['Object']['AppDataResourceMaster'] & {Id:number, Document:merchant}} */
   const merchant = server.ORM.db.AppDataResourceMaster.get({app_id:parameters.app_id, 
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
       * @type {{ api_secret:      string,
       *          reference:       string,
       *          payeeid:         string,
       *          payerid:         string,
       *          currency_code:   string,
       *          amount:          number, 
       *          message:         string,
       *          origin:          string}}
       */
       const  body_decrypted = JSON.parse(server.security.securityPrivateDecrypt(merchant.Document.MerchantPrivateKey, parameters.data.message));

       /**@type{bank_account} */
       const merchant_bankaccount = server.ORM.db.AppDataResourceDetail.get({app_id:parameters.app_id, 
                                                               all_users:true,
                                                               resource_id:null, 
                                                               data:{  iam_user_id:null,
                                                                       data_app_id:parameters.app_id,
                                                                       app_data_resource_master_id:merchant.Id,
                                                                       resource_name:'ACCOUNT',
                                                                       app_data_entity_id:Entity.Id
                                                                   }
                                                               }).result
                                       .filter((/**@type{server['ORM']['Object']['AppDataResourceDetail']}*/account)=>
                                           account.Document?.BankAccountVpa==merchant.Document.MerchantVpa
                                       )[0];
       /**@type{server['ORM']['Object']['AppDataResourceDetail'] & {Document:bank_account}} */
       const bankaccount_payer = server.ORM.db.AppDataResourceDetail.get({   app_id:parameters.app_id, 
                                                               all_users:true,
                                                               resource_id:null, 
                                                               data:{  iam_user_id:null,
                                                                       data_app_id:parameters.app_id,
                                                                       app_data_resource_master_id:null,
                                                                       resource_name:'ACCOUNT',
                                                                       app_data_entity_id:Entity.Id
                                                                   }
                                                               }).result
                                   .filter((/**@type{server['ORM']['Object']['AppDataResourceDetail']}*/account)=>
                                       account.Document?.BankAccountVpa==body_decrypted.payerid
                                   )[0];
       if (merchant.Document.MerchantApiSecret==body_decrypted.api_secret && 
           merchant.Document.MerchantVpa == body_decrypted.payeeid && 
           merchant.Document.MerchantUrl == body_decrypted.origin && 
           merchant_bankaccount && 
           bankaccount_payer && 
           currency){
           //validate data
           if (body_decrypted.currency_code==currency.Document.CurrencyCode){
               const payment_request_id = server.security.securityUUIDCreate();
               /**@type{payment_request} */
               const data_payment_request = {
                                               MerchantId:      parameters.data.id,
                                               PaymentRequestId:payment_request_id,
                                               Reference:       body_decrypted.reference,
                                               PayeeId:         body_decrypted.payeeid,
                                               PayerId:         body_decrypted.payerid,
                                               CurrencyCode:    body_decrypted.currency_code,
                                               Amount:          server.ORM.UtilNumberValue(body_decrypted.amount),
                                               Message:         body_decrypted.message,
                                               Status:          'PENDING'
                                           };
               /**@ts-ignore @type{server['ORM']['Object']['AppDataResourceMaster']} */
               const data_new_payment_request = {
                                               Document                                : data_payment_request,
                                               IamUserAppId                            : merchant.IamUserAppId,
                                               AppDataEntityResourceId                 : server.ORM.db.AppDataEntityResource.get({   
                                                                                                                            app_id:parameters.app_id, 
                                                                                                                            resource_id:null, 
                                                                                                                            data:{ resource_name:'PAYMENT_REQUEST',
                                                                                                                                   app_data_entity_id:Entity.Id
                                                                                                                            }}).result[0].Id
                                   };
               await server.ORM.db.AppDataResourceMaster.post({app_id:parameters.app_id, data:data_new_payment_request});
               const jwt_data = server.iam.iamAuthorizeToken(parameters.app_id, 'APP_ACCESS_EXTERNAL', {   
                                                                                               app_id:             parameters.app_id,
                                                                                               app_id_token:       null,
                                                                                               iam_user_app_id:    null,
                                                                                               iam_user_id:        null,
                                                                                               iam_user_username:  null,
                                                                                               //save the payment request id
                                                                                               app_custom_id:      payment_request_id,
                                                                                               //authorize to client IP, the server should use 'x-forwarded-for'
                                                                                               ip:                 parameters.ip,
                                                                                               scope:              'APP_EXTERNAL'});
               //Save access info in IAM_APP_ACCESS table
               /**@ts-ignore @type{server['ORM']['Object']['IamAppAccess']} */
               const file_content = {	
                                       Type:                'APP_ACCESS_EXTERNAL',
                                       IamUserAppId:        null,
                                       IamUserId:           null,
                                       IamUserUsername:     null,
                                       //save the payment request id
                                       AppCustomId:         payment_request_id,
                                       AppId:               parameters.app_id,
                                       AppIdToken:          null,
                                       Res:		            1,
                                       Token:               jwt_data?jwt_data.token:null,
                                       Ip:                  parameters.ip,
                                       Ua:                  parameters.user_agent};
               await server.ORM.db.IamAppAccess.post(parameters.app_id, file_content);
   
               /**
               * @type {{ Token:string,
               *          Exp:number,
               *          Iat:number,
               *          PaymentRequestId:string,
               *          Status:string,
               *          MerchantName:string
               *          Amount:number,
               *          CurrencySymbol:string}}
               */
               const data_return = {   Token:               jwt_data.token,
                                       /**@ts-ignore */
                                       Exp:                 jwt_data.exp,
                                       /**@ts-ignore */
                                       Iat:                 jwt_data.iat,
                                       PaymentRequestId:    payment_request_id,
                                       Status:              data_payment_request.Status,
                                       MerchantName:        merchant.Document.MerchantName,
                                       Amount:			    body_decrypted.amount,
                                       CurrencySymbol:      currency.Document.CurrencySymbol
                                   };
               const data_encrypted = server.security.securityPublicEncrypt(merchant.Document.MerchantPublicKey, JSON.stringify(data_return));
               return {result:{message:data_encrypted}, type:'JSON'};
           }
           else
               return {http:400,
                       code:'PAYMENT_REQUEST_CREATE',
                       text:server.iam.iamUtilMessageNotAuthorized(),
                       developerText:null,
                       moreInfo:null,
                       type:'JSON'
                   };
       }
       else
           return {http:404,
               code:'PAYMENT_REQUEST_CREATE',
               text:server.iam.iamUtilMessageNotAuthorized(),
               developerText:null,
               moreInfo:null,
               type:'JSON'
           };
   }
   else
       return {http:404,
           code:'PAYMENT_REQUEST_CREATE',
           text:server.iam.iamUtilMessageNotAuthorized(),
           developerText:null,
           moreInfo:null,
           type:'JSON'
       };

};
export {getToken};
export default paymentRequestCreate;
