/**
 * @module apps/app6/src/functions/payment_request_get_status
 */

/**
 * @import {server} from '../../../../server/types.js'
 * @import {AppDataEntityDocument} from './types.js'
 */

const {server} = await import('../../../../server/server.js');
/**
 * @name paymentRequestGetStatus
 * @description Get payment request status
 * @function
 * @param {{app_id:number,
 *          data:{  payment_request_id: string,
 *                  data_app_id: number},
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          idToken:string,
 *          authorization:string,
 *          accept_language:string}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:{ status:string}[]}>}
 */
const paymentRequestGetStatus = async parameters =>{
   
   /**@type{server['ORM']['Object']['AppDataEntity'] & {Document:AppDataEntityDocument}} */
   const Entity            = server.ORM.db.AppDataEntity.get({ app_id:parameters.app_id, 
                                                        resource_id:null, 
                                                        data:{data_app_id:parameters.data.data_app_id}}).result[0];

   /** 
    * @type {{ api_secret:             string,
    *          payment_request_id:     string,
    *          origin:                 string}}
    */
   const body = {	api_secret:     
                                       Entity.Document.MerchantApiSecret??'',
                   payment_request_id: parameters.data.payment_request_id,
                   origin:             parameters.host
   };
   //use merchant_id to lookup api key authorized request and public and private keys to read and send encrypted messages
   //use general id and message keys so no info about what type of message is sent, only the receinving function should know
   const body_encrypted = {id:         server.ORM.UtilNumberValue(Entity.Document.MerchantId),
                           message:    server.security.securityPublicEncrypt(
                                           Entity.Document.MerchantPublicKey??'', 
                                           JSON.stringify(body))};
   
   const result_bffExternal = await server.bff.bffExternal({   app_id:parameters.app_id,
                                                url:Entity.Document.MerchantApiUrlPaymentRequestGetStatus??'', 
                                                method:'POST', 
                                                //send body in base64 format
                                                body:{data:Buffer.from(JSON.stringify(body_encrypted)).toString('base64')},
                                                user_agent:parameters.user_agent, 
                                                ip:parameters.ip, 
                                                'app-id':+Entity.Document.MerchantApiUrlPaymentRequestAppId,
                                                authorization:parameters.authorization, 
                                                accept_language:parameters.accept_language});
   if (result_bffExternal.result.error)
       //read external ISO20022 error format and return internal server format using camel case format
       return {http:           result_bffExternal.result.error.http,
               code:           result_bffExternal.result.error.code,
               text:           result_bffExternal.result.error.text,
               developerText:  result_bffExternal.result.error.developer_text,
               moreInfo:       result_bffExternal.result.error.more_info,
               type:           'JSON'
   };
   else{
       /**
        * @type {{ status:string}}
        */
       const body_decrypted = JSON.parse(server.security.securityPrivateDecrypt(
                                               Entity.Document.MerchantPrivateKey??'', 
                                               result_bffExternal.result.rows.message));

       return {result:[{status:body_decrypted.status}], type:'JSON'};
   }
};
export default paymentRequestGetStatus;