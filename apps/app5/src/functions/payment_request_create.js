/**
 * @module apps/app5/src/functions/payment_request_create
 */

/**
 * @import {server_db_table_AppDataEntity, 
 *          server_db_table_AppDataResourceMaster,
 *          server_db_table_AppDataResourceDetail,
 *          server_db_table_IamAppAccess, 
 *          server_iam_access_token_claim,
 *          server_server_response} from '../../../../server/types.js'
 * @import {payment_request, bank_account, merchant} from './types.js'
 */
const {ORM} = await import('../../../../server/server.js');
/**
 * @param {{app_id:number,
 *          authorization:string,
 *          ip:string}} parameters
 * @returns {Promise.<server_iam_access_token_claim & {exp?:number, iat?:number}|null>}
 */
const getToken = async parameters => {
   const {iamUtilTokenGet} = await import('../../../../server/iam.js');
   const token_verify = iamUtilTokenGet(parameters.app_id, parameters.authorization, 'APP_ACCESS_EXTERNAL');
   if (token_verify.app_id         == parameters.app_id && 
       token_verify.ip             == parameters.ip && 
       token_verify.scope          == 'APP_EXTERNAL' &&
       //authenticated saved values in iam_app_access
       ORM.db.IamAppAccess.get(parameters.app_id, null).result
                       .filter((/**@type{server_db_table_IamAppAccess}*/row)=>
                                                               //Authenticate the token type
                                                               row.type                    == 'APP_ACCESS_EXTERNAL' &&
                                                               //Authenticate app id
                                                               row.app_id                  == token_verify.app_id &&
                                                               //Authenticate IP address, the server should use 'x-forwarded-for' to authenticate client ip
                                                               row.ip                      == token_verify.ip &&
                                                               //Authenticate token is valid
                                                               row.res                     == 1 &&
                                                               //Authenticate the token string
                                                               row.token                   == parameters.authorization.replace('Bearer ','')
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
*          locale:string}} parameters
* @returns {Promise.<server_server_response & {result?:{message:string}}>}
*/
const paymentRequestCreate = async parameters =>{
  
   const {iamUtilMessageNotAuthorized, iamAuthorizeToken} = await import('../../../../server/iam.js');
   const {securityUUIDCreate, securityPrivateDecrypt, securityPublicEncrypt} = await import('../../../../server/security.js');
   
   /**@type{server_db_table_AppDataEntity} */
   const Entity    = ORM.db.AppDataEntity.get({   app_id:parameters.app_id, 
                                           resource_id:null, 
                                           data:{data_app_id:parameters.app_id}}).result[0];

   const currency = ORM.db.AppDataResourceMaster.get({app_id:parameters.app_id, 
                                               resource_id:null, 
                                               data:{  iam_user_id:null,
                                                       data_app_id:parameters.app_id,
                                                       resource_name:'CURRENCY',
                                                       app_data_entity_id:Entity.id
                                               }}).result[0];
   /**@type{merchant} */
   const merchant = ORM.db.AppDataResourceMaster.get({app_id:parameters.app_id, 
                                               all_users:true,
                                               resource_id:null, 
                                               data:{  iam_user_id:null,
                                                       data_app_id:parameters.app_id,
                                                       resource_name:'MERCHANT',
                                                       app_data_entity_id:Entity.id
                                               }}).result
                       .filter((/**@type{server_db_table_AppDataResourceMaster}*/merchant)=>
                           ORM.UtilNumberValue(merchant.json_data?.merchant_id)==parameters.data.id
                       )
                       .map((/**@type{server_db_table_AppDataResourceMaster}*/result)=>{return {  
                                                                   merchant_id:                        result.json_data?.merchant_id,
                                                                   merchant_vpa:                       result.json_data?.merchant_vpa,
                                                                   merchant_url:                       result.json_data?.merchant_url,
                                                                   merchant_name:                      result.json_data?.merchant_name,
                                                                   merchant_public_key:                result.json_data?.merchant_public_key,
                                                                   merchant_private_key:               result.json_data?.merchant_private_key,
                                                                   merchant_api_secret:                result.json_data?.merchant_api_secret,
                                                                   id:                                 result.id,
                                                                   iam_user_app_id:                    result.iam_user_app_id};})[0];
                       
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
       const  body_decrypted = JSON.parse(securityPrivateDecrypt(merchant.merchant_private_key, parameters.data.message));

       /**@type{bank_account} */
       const merchant_bankaccount = ORM.db.AppDataResourceDetail.get({app_id:parameters.app_id, 
                                                               all_users:true,
                                                               resource_id:null, 
                                                               data:{  iam_user_id:null,
                                                                       data_app_id:parameters.app_id,
                                                                       app_data_resource_master_id:merchant.id,
                                                                       resource_name:'ACCOUNT',
                                                                       app_data_entity_id:Entity.id
                                                                   }
                                                               }).result
                                       .filter((/**@type{server_db_table_AppDataResourceDetail}*/account)=>
                                           account.json_data?.bank_account_vpa==merchant.merchant_vpa
                                       )[0];
       /**@type{bank_account} */                                                            
       const bankaccount_payer = ORM.db.AppDataResourceDetail.get({   app_id:parameters.app_id, 
                                                               all_users:true,
                                                               resource_id:null, 
                                                               data:{  iam_user_id:null,
                                                                       data_app_id:parameters.app_id,
                                                                       app_data_resource_master_id:null,
                                                                       resource_name:'ACCOUNT',
                                                                       app_data_entity_id:Entity.id
                                                                   }
                                                               }).result
                                   .filter((/**@type{server_db_table_AppDataResourceDetail}*/account)=>
                                       account.json_data?.bank_account_vpa==body_decrypted.payerid
                                   )[0];
       if (merchant.merchant_api_secret==body_decrypted.api_secret && 
           merchant.merchant_vpa == body_decrypted.payeeid && 
           merchant.merchant_url == body_decrypted.origin && 
           merchant_bankaccount && 
           bankaccount_payer && 
           currency){
           //validate data
           if (body_decrypted.currency_code==currency.currency_code){
               const payment_request_id = securityUUIDCreate();
               /**@type{payment_request} */
               const data_payment_request = {
                                               merchant_id:    parameters.data.id,
                                               payment_request_id:payment_request_id,
                                               reference:      body_decrypted.reference,
                                               payeeid:        body_decrypted.payeeid,
                                               payerid:        body_decrypted.payerid,
                                               currency_code:  body_decrypted.currency_code,
                                               amount:         ORM.UtilNumberValue(body_decrypted.amount),
                                               message:        body_decrypted.message,
                                               status:         'PENDING'
                                           };
               /**@type{server_db_table_AppDataResourceMaster} */
               const data_new_payment_request = {
                                               json_data                                   : data_payment_request,
                                               iam_user_app_id                             : merchant.iam_user_app_id,
                                               app_data_entity_resource_id                 : ORM.db.AppDataEntityResource.get({   app_id:parameters.app_id, 
                                                                                                                           resource_id:null, 
                                                                                                                           data:{  resource_name:'PAYMENT_REQUEST',
                                                                                                                                   app_data_entity_id:Entity.id
                                                                                                                           }}).result[0].id
                                   };
               await ORM.db.AppDataResourceMaster.post({app_id:parameters.app_id, data:data_new_payment_request});
               const jwt_data = iamAuthorizeToken(parameters.app_id, 'APP_ACCESS_EXTERNAL', {   
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
               /**@type{server_db_table_IamAppAccess} */
               const file_content = {	
                                       type:                   'APP_ACCESS_EXTERNAL',
                                       iam_user_app_id:        null,
                                       iam_user_id:            null,
                                       iam_user_username:      null,
                                       //save the payment request id
                                       app_custom_id:          payment_request_id,
                                       app_id:                 parameters.app_id,
                                       app_id_token:           null,
                                       res:		            1,
                                       token:                  jwt_data?jwt_data.token:null,
                                       ip:                     parameters.ip,
                                       ua:                     parameters.user_agent};
               await ORM.db.IamAppAccess.post(parameters.app_id, file_content);
   
               /**
               * @type {{ token:string,
               *          exp:number,
               *          iat:number,
               *          payment_request_id:string,
               *          status:string,
               *          merchant_name:string
               *          amount:number,
               *          currency_symbol:string}}
               */
               const data_return = {   token:                  jwt_data.token,
                                       /**@ts-ignore */
                                       exp:                    jwt_data.exp,
                                       /**@ts-ignore */
                                       iat:                    jwt_data.iat,
                                       payment_request_id:     payment_request_id,
                                       status:                 data_payment_request.status,
                                       merchant_name:          merchant.merchant_name,
                                       amount:			        body_decrypted.amount,
                                       currency_symbol:        currency.currency_symbol
                                   };
               const data_encrypted = securityPublicEncrypt(merchant.merchant_public_key, JSON.stringify(data_return));
               return {result:{message:data_encrypted}, type:'JSON'};
           }
           else
               return {http:400,
                       code:'PAYMENT_REQUEST_CREATE',
                       text:iamUtilMessageNotAuthorized(),
                       developerText:null,
                       moreInfo:null,
                       type:'JSON'
                   };
       }
       else
           return {http:404,
               code:'PAYMENT_REQUEST_CREATE',
               text:iamUtilMessageNotAuthorized(),
               developerText:null,
               moreInfo:null,
               type:'JSON'
           };
   }
   else
       return {http:404,
           code:'PAYMENT_REQUEST_CREATE',
           text:iamUtilMessageNotAuthorized(),
           developerText:null,
           moreInfo:null,
           type:'JSON'
       };

};
export {getToken};
export default paymentRequestCreate;
