/**
 * @module apps/app6/src/functions/payment_request_get_status
 */

/**
 * @import {server_server_response} from '../../../../server/types.js'
 */

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
 *          locale:string}} parameters
 * @returns {Promise.<server_server_response & {result?:{ status:string}[]}>}
 */
const paymentRequestGetStatus = async parameters =>{
    /**@type{import('../../../../server/server.js')} */
    const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

    /**@type{import('../../../../server/db/dbModelAppDataEntity.js')} */
    const dbModelAppDataEntity = await import(`file://${process.cwd()}/server/db/dbModelAppDataEntity.js`);

    /**@type{import('../../../../apps/common/src/common.js')} */
    const {commonBFE} = await import(`file://${process.cwd()}/apps/common/src/common.js`);
    
    /**@type{import('../../../../server/security.js')} */
    const {securityPrivateDecrypt, securityPublicEncrypt} = await import(`file://${process.cwd()}/server/security.js`); 
    
    /**
     * @type{{  description:string, 
     *          name:string, 
     *          entity_type:string, 
     *          store_type:string,
     *          merchant_id:string|null,
     *          merchant_name:string|null,
     *          merchant_api_url_payment_request_create:string|null, 
     *          merchant_api_url_payment_request_get_status:string|null,
     *          merchant_api_secret:string|null, 
     *          merchant_public_key:string|null,
     *          merchant_private_key:string|null,
     *          merchant_vpa:string|null,
     *          iam_user_id_anonymous:number|null}}
     */
    const entity_data = JSON.parse((await dbModelAppDataEntity.get({app_id:parameters.app_id, resource_id:null, data:{data_app_id:parameters.app_id}})).result[0].json_data);
   
    /** 
     * @type {{ api_secret:             string,
     *          payment_request_id:     string,
     *          origin:                 string}}
     */
    const body = {	api_secret:     
                                        entity_data.merchant_api_secret??'',
                    payment_request_id: parameters.data.payment_request_id,
                    origin:             parameters.host
    };
    //use merchant_id to lookup api key authorized request and public and private keys to read and send encrypted messages
    //use general id and message keys so no info about what type of message is sent, only the receinving function should know
    const body_encrypted = {id:         serverUtilNumberValue(entity_data.merchant_id),
                            message:    securityPublicEncrypt(
                                            entity_data.merchant_public_key??'', 
                                            JSON.stringify(body))};
    
    const result_commonBFE = await commonBFE({  url:entity_data.merchant_api_url_payment_request_get_status??'', 
                                                method:'POST', 
                                                //send body in base64 format
                                                body:{data:Buffer.from(JSON.stringify(body_encrypted)).toString('base64')},
                                                user_agent:parameters.user_agent, 
                                                ip:parameters.ip, 
                                                authorization:parameters.authorization, 
                                                locale:parameters.locale});
    if (result_commonBFE.result.error)
        //read external ISO20022 error format and return internal server format using camel case format
        return {http:           result_commonBFE.result.error.http,
                code:           result_commonBFE.result.error.code,
                text:           result_commonBFE.result.error.text,
                developerText:  result_commonBFE.result.error.developer_text,
                moreInfo:       result_commonBFE.result.error.more_info,
                type:           'JSON'
    };
    else{
        /**
         * @type {{ status:string}}
         */
        const body_decrypted = JSON.parse(securityPrivateDecrypt(
                                                entity_data.merchant_private_key??'', 
                                                result_commonBFE.result.rows.message));

        return {result:[{status:body_decrypted.status}], type:'JSON'};
    }
};
export default paymentRequestGetStatus;