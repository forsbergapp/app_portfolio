/**
 * @module apps/app6/src/functions/payment_request_create
 */

/**
 * @import {server} from '../../../../server/types.js'
 */
/**
 * @import {AppDataEntityDocument} from './types.js'
 */
const {server} = await import('../../../../server/server.js');
/**
 * @name paymentRequestCreate
 * @description Create payment request
 * @function
 * @param {{app_id:number,
 *          data:{  reference:string,
 *                  data_app_id: number,
 *                  payerid:string,
 *                  amount:number,
 *                  currency_code:string,
 *                  message:string},
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          idToken:string,
 *          authorization:string,
 *          locale:string}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:{token:string,
 *                                                      exp:number,
 *                                                      iat:number,
 *                                                      payment_request_id:string,
 *                                                      payment_request_message:string,
 *                                                      status:string,
 *                                                      merchant_name:string
 *                                                      amount:number,
 *                                                      currency_symbol:string,
 *                                                      countdown:string}[]}>}
 */
const paymentRequestCreate = async parameters =>{
   
   /**@type{server['ORM']['Object']['AppDataEntity'] & {Id:number, Document:AppDataEntityDocument}} */
   const Entity            = server.ORM.db.AppDataEntity.get({   app_id:parameters.app_id, 
                                                   resource_id:null, 
                                                   data:{data_app_id:parameters.data.data_app_id}}).result[0];

   /**@type{server['ORM']['Object']['AppDataResourceMaster']} */
   const currency = server.ORM.db.AppDataResourceMaster.get({   app_id:parameters.app_id, 
                                                               resource_id:null, 
                                                               data:{  iam_user_id:null,
                                                                       data_app_id:parameters.data.data_app_id,
                                                                       resource_name:'CURRENCY',
                                                                       app_data_entity_id:Entity.Id
                                                               }}).result[0];
   //validate
   if (parameters.data.currency_code==currency.Document?.CurrencyCode && parameters.data.payerid !='' && parameters.data.payerid !=null){
       /** 
        * @type {{ api_secret:     string,
        *          reference:      string,
        *          payeeid:        string,
        *          payerid:        string,
        *          currency_code:  string,
        *          amount:         number, 
        *          message:        string,
        *          origin:         string}}
        */
       const body = {   api_secret:     Entity.Document.MerchantApiSecret??'',
                        reference:      parameters.data.reference.substring(0,30),
                        payeeid:        Entity.Document.MerchantVpa??'', 
                        payerid:        parameters.data.payerid,
                        currency_code:  currency.Document.CurrencyCode,
                        amount:         server.ORM.UtilNumberValue(parameters.data.amount) ?? 0, 
                        message:        parameters.data.message,
                        origin:         parameters.host
       };
       //use merchant_id to lookup api key authorized request and public and private keys to read and send encrypted messages
       //use general id and message keys so no info about what type of message is sent, only the receinving function should know
       const body_encrypted = {id:     server.ORM.UtilNumberValue(Entity.Document.MerchantId),
                               message:server.security.securityPublicEncrypt(
                                                               Entity.Document.MerchantPublicKey??'', 
                                                               JSON.stringify(body))};
       const result_bffExternal = await server.bff.bffExternal({  app_id:parameters.app_id,
                                                   url:Entity.Document.MerchantApiUrlPaymentRequestCreate??'', 
                                                   method:'POST', 
                                                   //send body in base64 format
                                                   body:{data:Buffer.from(JSON.stringify(body_encrypted)).toString('base64')}, 
                                                   user_agent:parameters.user_agent, 
                                                   ip:parameters.ip, 
                                                   'app-id':+Entity.Document.MerchantApiUrlPaymentRequestAppId,
                                                   authorization:null, 
                                                   locale:parameters.locale});
       if (result_bffExternal.result.error) {
           //read external ISO20022 error format and return internal server format using camel case format
           return {http:           result_bffExternal.result.error.http,
                   code:           result_bffExternal.result.error.code,
                   text:           result_bffExternal.result.error.text,
                   developerText:  result_bffExternal.result.error.developer_text,
                   moreInfo:       result_bffExternal.result.error.more_info,
                   type:           'JSON'
           };
       }
       else{
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
           const body_decrypted = JSON.parse(server.security.securityPrivateDecrypt(
                                                   Entity.Document.MerchantPrivateKey??'', 
                                                   result_bffExternal.result.rows.message));

           return {result:[{token:                 body_decrypted.token,
                           exp:                    body_decrypted.exp,
                           iat:                    body_decrypted.iat,
                           payment_request_id:     body_decrypted.payment_request_id,
                           payment_request_message:'Check your bank app to authorize this payment',
                           status:                 body_decrypted.status,
                           merchant_name:          Entity.Document.MerchantName??'',
                           amount:			        body_decrypted.amount,
                           currency_symbol:        currency.Document.CurrencySymbol,
                           countdown:              ''
                       }], type:'JSON'};
       }
   }
   else
       return {http:400,
               code:'APP',
               text:server.iam.iamUtilMessageNotAuthorized(),
               developerText:'paymentRequestCreate',
               moreInfo:null,
               type:'JSON'
           };
};
export default paymentRequestCreate;