/**
 * @module apps/app5/src/functions/payment_request_create
 */

/**
 * @import {server_iam_access_token_claim, server_db_iam_app_access, server_server_response} from '../../../../server/types.js'
 * @import {payment_request, bank_account, merchant} from './types.js'
 */
/**
 * @param {{app_id:number,
 *          authorization:string,
 *          ip:string}} parameters
 * @returns Promise.<server_iam_access_token_claim & {exp:number, iat:number}>}
 */
const getToken = async parameters => {
    
    /**@type{import('../../../../server/db/fileModelIamAppAccess.js')} */
    const fileModelIamAppAccess = await import(`file://${process.cwd()}/server/db/fileModelIamAppAccess.js`);
    /**@type{import('../../../../server/db/fileModelConfig.js')} */
    const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);
    /**@type{import('../../../../server/server.js')} */
    const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
    /**@type{import('../../../../server/iam.js')} */
    const {iamUtilTokenGet} = await import(`file://${process.cwd()}/server/iam.js`);
    
    /**@type{server_iam_access_token_claim & {exp:number, iat:number}} */
    const token_verify = iamUtilTokenGet(parameters.app_id, parameters.authorization, 'APP_ACCESS_EXTERNAL');
    if (token_verify.app_id         == parameters.app_id && 
        token_verify.ip             == parameters.ip && 
        token_verify.db             == serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB','USE')) &&
        token_verify.scope          == 'APP_EXTERNAL' &&
        //authenticated saved values in iam_app_access
        fileModelIamAppAccess.get(parameters.app_id, null).result
                        .filter((/**@type{server_db_iam_app_access}*/row)=>
                                                                //Authenticate the token type
                                                                row.type                    == 'APP_ACCESS_EXTERNAL' &&
                                                                //Authenticate database
                                                                row.db                      == token_verify.db &&
                                                                //Authenticate app id corresponds to current subdomain
                                                                row.app_id                  == token_verify.app_id &&
                                                                //Authenticate IP address, the server should use 'X-Forwarded-For' to authenticate client ip
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
 *          data:*,
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          idToken:string,
 *          authorization:string,
 *          locale:string}} parameters
 * @returns {Promise.<server_server_response & {result?:{message:string}}>}
 */
const paymentRequestCreate = async parameters =>{
   
    /**@type{import('../../../../server/server.js')} */
    const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
    
    /**@type{import('../../../../server/db/fileModelConfig.js')} */
    const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);

    /**@type{import('../../../../server/db/fileModelIamAppAccess.js')} */
    const fileModelIamAppAccess = await import(`file://${process.cwd()}/server/db/fileModelIamAppAccess.js`);

    /**@type{import('../../../../server/db/dbModelAppDataEntity.js')} */
    const dbModelAppDataEntity = await import(`file://${process.cwd()}/server/db/dbModelAppDataEntity.js`);

    /**@type{import('../../../../server/db/dbModelAppDataEntityResource.js')} */
    const dbModelAppDataEntityResource = await import(`file://${process.cwd()}/server/db/dbModelAppDataEntityResource.js`);

    /**@type{import('../../../../server/db/dbModelAppDataResourceMaster.js')} */
    const dbModelAppDataResourceMaster = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceMaster.js`);

    /**@type{import('../../../../server/db/dbModelAppDataResourceDetail.js')} */
    const dbModelAppDataResourceDetail = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceDetail.js`);

    /**@type{import('../../../../server/iam.js')} */
    const {iamUtilMessageNotAuthorized, iamAuthorizeToken} = await import(`file://${process.cwd()}/server/iam.js`);

    /**@type{import('../../../../server/security.js')} */
    const {securityUUIDCreate, securityPrivateDecrypt, securityPublicEncrypt} = await import(`file://${process.cwd()}/server/security.js`);

    const currency = await dbModelAppDataResourceMaster.get({   app_id:parameters.app_id, 
                                                                resource_id:null, 
                                                                data:{  data_app_id:parameters.app_id,
                                                                        resource_name:'CURRENCY',
                                                                        user_null:'1'
                                                                }})
                            .then(result=>JSON.parse(result.result[0].json_data));
    
    const merchant = await dbModelAppDataResourceMaster.get({   app_id:parameters.app_id, 
                                                                resource_id:null, 
                                                                data:{  data_app_id:parameters.app_id,
                                                                        resource_name:'MERCHANT',
                                                                        user_null:'0'
                                                                }})
                            .then(result=>result.result.map((/**@type{merchant}*/result)=>{return {  
                                                                        merchant_id:                        result.merchant_id,
                                                                        merchant_vpa:                       result.merchant_vpa,
                                                                        merchant_url:                       result.merchant_url,
                                                                        merchant_name:                      result.merchant_name,
                                                                        merchant_public_key:                result.merchant_public_key,
                                                                        merchant_private_key:               result.merchant_private_key,
                                                                        merchant_api_secret:                result.merchant_api_secret,
                                                                        id:                                 result.id,
                                                                        user_account_app_user_account_id:   result.user_account_app_user_account_id,
                                                                        user_account_app_app_id:            result.user_account_app_app_id};})
                            .filter((/**@type{merchant}*/merchant)=>merchant.merchant_id==parameters.data.id)[0]);
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
    
        const merchant_bankaccount = await dbModelAppDataResourceDetail.get({   app_id:parameters.app_id, 
                                                                                resource_id:null, 
                                                                                data:{  master_id:merchant.id,
                                                                                        user_account_id:merchant.user_account_app_user_account_id,
                                                                                        data_app_id:parameters.app_id,
                                                                                        resource_name:'ACCOUNT',
                                                                                        user_null:'0'
                                                                                    }
                                                                                })
                                            .then(result=>result.result
                                                                    .map((/**@type{bank_account}*/account)=>JSON.parse(account.json_data))
                                                                    .filter((/**@type{bank_account}*/account)=>account.bank_account_vpa==merchant.merchant_vpa)[0]);
        const bankaccount_payer = await dbModelAppDataResourceDetail.get({  app_id:parameters.app_id, 
                                                                            resource_id:null, 
                                                                            data:{  data_app_id:parameters.app_id,
                                                                                    resource_name:'ACCOUNT',
                                                                                    user_null:'0'
                                                                                }
                                                                            })
                                            .then(result=>result.result
                                                                    .map((/**@type{bank_account}*/account)=>JSON.parse(account.json_data))
                                                                    .filter((/**@type{bank_account}*/account)=>account.bank_account_vpa==body_decrypted.payerid)[0]);
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
                                                amount:         serverUtilNumberValue(body_decrypted.amount),
                                                message:        body_decrypted.message,
                                                status:         'PENDING'
                                            };
                
                const data_new_payment_request = {
                                                json_data                                   : data_payment_request,
                                                user_account_id                             : merchant.user_account_app_user_account_id,
                                                user_account_app_id                         : merchant.user_account_app_app_id,
                                                data_app_id                                 : parameters.app_id,
                                                app_data_entity_resource_app_data_entity_id : await dbModelAppDataEntity.get({  app_id:parameters.app_id, 
                                                                                                                                resource_id:null, 
                                                                                                                                data:{data_app_id:parameters.app_id}}).then(result=>result.result[0].id),
                                                app_data_entity_resource_id                 : await dbModelAppDataEntityResource.get({  app_id:parameters.app_id, 
                                                                                                                                        resource_id:null, 
                                                                                                                                        data:{  data_app_id:parameters.app_id,
                                                                                                                                                resource_name:'PAYMENT_REQUEST'
                                                                                                                                        }}).then(result=>result.result[0].id)
                                                };
                await dbModelAppDataResourceMaster.post({app_id:parameters.app_id, data:data_new_payment_request});
                const jwt_data = iamAuthorizeToken(parameters.app_id, 'APP_ACCESS_EXTERNAL', {   
                                                                                                app_id:             parameters.app_id,
                                                                                                iam_user_id:        null,
                                                                                                iam_user_username:  null,
                                                                                                user_account_id:    null,
                                                                                                //save the payment request id
                                                                                                app_custom_id:      payment_request_id,
                                                                                                db:                 serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB','USE')),
                                                                                                //authorize to client IP, the server should use 'X-Forwarded-For'
                                                                                                ip:                 parameters.ip,
                                                                                                scope:              'APP_EXTERNAL'});
                //Save access info in IAM_APP_ACCESS table
                /**@type{server_db_iam_app_access} */
                const file_content = {	
                                        type:                   'APP_ACCESS_EXTERNAL',
                                        /**@ts-ignore */ 
                                        iam_user_id:            null,
                                        iam_user_username:      null,
                                        user_account_id:        null,
                                        //save the payment request id
                                        app_custom_id:          payment_request_id,
                                        app_id:                 parameters.app_id,
                                        db:                     serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB','USE')),
                                        res:		            1,
                                        token:                  jwt_data?jwt_data.token:null,
                                        ip:                     parameters.ip,
                                        ua:                     parameters.user_agent};
                await fileModelIamAppAccess.post(parameters.app_id, file_content);
    
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
                const data_return = {   token:                  jwt_data.token,
                                        /**@ts-ignore */
                                        exp:                    jwt_data.exp,
                                        /**@ts-ignore */
                                        iat:                    jwt_data.iat,
                                        /**@ts-ignore */
                                        tokentimestamp:         jwt_data.tokentimestamp,
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