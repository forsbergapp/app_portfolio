/**
 * @module apps/app6/src/functions/payment_request_create
 */

/**
 * @import {server_server_response, server_db_table_AppDataResourceMaster, server_db_table_AppDataEntity} from '../../../../server/types.js'
 */

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
 * @returns {Promise.<server_server_response & {result?:{token:string,
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
   const {serverUtilNumberValue} = await import('../../../../server/server.js');
   const {commonBFE} = await import('../../../../apps/common/src/common.js');
   const  {iamUtilMessageNotAuthorized} = await import('../../../../server/iam.js');
   const {securityPrivateDecrypt, securityPublicEncrypt} = await import('../../../../server/security.js'); 
   const AppDataEntity = await import('../../../../server/db/AppDataEntity.js');
   const AppDataResourceMaster = await import('../../../../server/db/AppDataResourceMaster.js');
   
   /**@type{server_db_table_AppDataEntity & 
    *       {json_data:{   description:string, 
    *                      name:string, 
    *                      entity_type:string, 
    *                      store_type:string,
    *                      merchant_id:string|null,
    *                      merchant_name:string|null,
    *                      merchant_api_url_payment_request_app_id:number, 
    *                      merchant_api_url_payment_request_create:string|null, 
    *                      merchant_api_url_payment_request_get_status:string|null,
    *                      merchant_api_secret:string|null, 
    *                      merchant_public_key:string|null,
    *                      merchant_private_key:string|null,
    *                      merchant_vpa:string|null,
    *                      iam_user_id_anonymous:number|null}}} */
   const Entity            = AppDataEntity.get({   app_id:parameters.app_id, 
                                                   resource_id:null, 
                                                   data:{data_app_id:parameters.data.data_app_id}}).result[0];

   /**@type{server_db_table_AppDataResourceMaster} */
   const currency = AppDataResourceMaster.get({   app_id:parameters.app_id, 
                                                               resource_id:null, 
                                                               data:{  iam_user_id:null,
                                                                       data_app_id:parameters.data.data_app_id,
                                                                       resource_name:'CURRENCY',
                                                                       app_data_entity_id:Entity.id
                                                               }}).result[0];
   //validate
   if (parameters.data.currency_code==currency.json_data?.currency_code && parameters.data.payerid !='' && parameters.data.payerid !=null){
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
       const body = {	api_secret:     Entity.json_data.merchant_api_secret??'',
                       reference:      parameters.data.reference.substring(0,30),
                       payeeid:        Entity.json_data.merchant_vpa??'', 
                       payerid:        parameters.data.payerid,
                       currency_code:  currency.json_data.currency_code,
                       amount:         serverUtilNumberValue(parameters.data.amount) ?? 0, 
                       message:        parameters.data.message,
                       origin:         parameters.host
       };
       //use merchant_id to lookup api key authorized request and public and private keys to read and send encrypted messages
       //use general id and message keys so no info about what type of message is sent, only the receinving function should know
       const body_encrypted = {id:     serverUtilNumberValue(Entity.json_data.merchant_id),
                               message:securityPublicEncrypt(
                                                               Entity.json_data.merchant_public_key??'', 
                                                               JSON.stringify(body))};
       const result_commonBFE = await commonBFE({  app_id:parameters.app_id,
                                                   url:Entity.json_data.merchant_api_url_payment_request_create??'', 
                                                   method:'POST', 
                                                   //send body in base64 format
                                                   body:{data:Buffer.from(JSON.stringify(body_encrypted)).toString('base64')}, 
                                                   user_agent:parameters.user_agent, 
                                                   ip:parameters.ip, 
                                                   appHeader:{
                                                       'app-id':Entity.json_data.merchant_api_url_payment_request_app_id,
                                                       'app-signature':'Shop'
                                                   },
                                                   authorization:null, 
                                                   locale:parameters.locale});
       if (result_commonBFE.result.error) {
           //read external ISO20022 error format and return internal server format using camel case format
           return {http:           result_commonBFE.result.error.http,
                   code:           result_commonBFE.result.error.code,
                   text:           result_commonBFE.result.error.text,
                   developerText:  result_commonBFE.result.error.developer_text,
                   moreInfo:       result_commonBFE.result.error.more_info,
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
           const body_decrypted = JSON.parse(securityPrivateDecrypt(
                                                   Entity.json_data.merchant_private_key??'', 
                                                   result_commonBFE.result.rows.message));

           return {result:[{token:                 body_decrypted.token,
                           exp:                    body_decrypted.exp,
                           iat:                    body_decrypted.iat,
                           payment_request_id:     body_decrypted.payment_request_id,
                           payment_request_message:'Check your bank app to authorize this payment',
                           status:                 body_decrypted.status,
                           merchant_name:          Entity.json_data.merchant_name??'',
                           amount:			        body_decrypted.amount,
                           currency_symbol:        currency.json_data.currency_symbol,
                           countdown:              ''
                       }], type:'JSON'};
       }
   }
   else
       return {http:400,
               code:'APP',
               text:iamUtilMessageNotAuthorized(),
               developerText:'commonBFE',
               moreInfo:null,
               type:'JSON'
           };
};
export default paymentRequestCreate;