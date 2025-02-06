/**
 * @module apps/app6/src/functions/payment_request_create
 */

/**
 * @import {server_server_response} from '../../../../server/types.js'
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
 *                                              exp:number,
 *                                              iat:number,
 *                                              tokentimestamp:number,
 *                                              payment_request_id:string,
 *                                              payment_request_message:string,
 *                                              status:string,
 *                                              merchant_name:string
 *                                              amount:number,
 *                                              currency_symbol:string,
 *                                              countdown:string}[]}>}
 */
const paymentRequestCreate = async parameters =>{
    /**@type{import('../../../../server/server.js')} */
    const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

    /**@type{import('../../../../server/db/fileModelAppSecret.js')} */
    const fileModelAppSecret = await import(`file://${process.cwd()}/server/db/fileModelAppSecret.js`);

    /**@type{import('../../../../server/db/dbModelAppDataResourceMaster.js')} */
    const dbModelAppDataResourceMaster = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceMaster.js`);

    /**@type{import('../../../../apps/common/src/common.js')} */
    const {commonBFE} = await import(`file://${process.cwd()}/apps/common/src/common.js`);

    /**@type{import('../../../../server/iam.js')} */
    const  {iamUtilMessageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);

    /**@type{import('../../../../server/security.js')} */
    const {securityPrivateDecrypt, securityPublicEncrypt} = await import(`file://${process.cwd()}/server/security.js`); 
    
    const url = fileModelAppSecret.get({app_id:parameters.app_id, resource_id:parameters.app_id}).result[0].merchant_api_url_payment_request_create;
    const currency = await dbModelAppDataResourceMaster.get({   app_id:parameters.app_id, 
                                                                resource_id:null, 
                                                                data:{  data_app_id:parameters.data.data_app_id,
                                                                        resource_name:'CURRENCY',
                                                                        user_null:'1'
                                                                }})
                            .then(result=>JSON.parse(result.result[0].json_data));
    //validate
	if (parameters.data.currency_code==currency.currency_code && parameters.data.payerid !='' && parameters.data.payerid !=null){
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
        const body = {	api_secret:     fileModelAppSecret.get({app_id:parameters.app_id, resource_id:parameters.app_id}).result[0].merchant_api_secret,
                        reference:      parameters.data.reference.substring(0,30),
                        payeeid:        fileModelAppSecret.get({app_id:parameters.app_id, resource_id:parameters.app_id}).result[0].merchant_vpa, 
                        payerid:        parameters.data.payerid,
                        currency_code:  currency.currency_code,
                        amount:         serverUtilNumberValue(parameters.data.amount) ?? 0, 
                        message:        parameters.data.message,
                        origin:         parameters.host
        };
        //use merchant_id to lookup api key authorized request and public and private keys to read and send encrypted messages
        //use general id and message keys so no info about what type of message is sent, only the receinving function should know
        const body_encrypted = {id:     serverUtilNumberValue(fileModelAppSecret.get({app_id:parameters.app_id, resource_id:parameters.app_id}).result[0].merchant_id),
                                message:securityPublicEncrypt(
                                                                fileModelAppSecret.get({app_id:parameters.app_id, resource_id:parameters.app_id}).result[0].merchant_public_key, 
                                                                JSON.stringify(body))};
        
        const result_commonBFE = await commonBFE({url:url, method:'POST', body:body_encrypted, user_agent:parameters.user_agent, ip:parameters.ip, authorization:null, locale:parameters.locale});
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
            *          tokentimestamp:number,
            *          payment_request_id:string,
            *          status:string,
            *          merchant_name:string
            *          amount:number,
            *          currency_symbol:string}}
            */
            const body_decrypted = JSON.parse(securityPrivateDecrypt(
                                                    fileModelAppSecret.get({app_id:parameters.app_id, resource_id:parameters.app_id}).result[0].merchant_private_key, 
                                                    result_commonBFE.result.rows.message));

            return {result:[{token:                  body_decrypted.token,
                            exp:                    body_decrypted.exp,
                            iat:                    body_decrypted.iat,
                            tokentimestamp:         body_decrypted.tokentimestamp,
                            payment_request_id:     body_decrypted.payment_request_id,
                            payment_request_message:'Check your bank app to authorize this payment',
                            status:                 body_decrypted.status,
                            merchant_name:          fileModelAppSecret.get({app_id:parameters.app_id, resource_id:parameters.app_id}).result[0].merchant_name,
                            amount:			        body_decrypted.amount,
                            currency_symbol:        currency.currency_symbol,
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