/**
 * @module apps/app5/src/functions/payment_request_create
 */

/**
 * @param {number} app_id
 * @param {{id:string,
 *          message:string}} data
 * @param {string} user_agent
 * @param {string} ip
 * @param {string} locale
 * @param {import('../../../../server/types.js').server_server_res} res
 * @returns {Promise.<{message:string}[]>}
 */
const payment_request_create = async (app_id, data, user_agent, ip, locale, res) =>{
   
    /**@type{import('../../../../server/server.js')} */
    const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
    
    /**@type{import('../../../../server/db/file.js')} */
    const {fileDBGet} = await import(`file://${process.cwd()}/server/db/file.js`);

    /**@type{import('../../../../server/db/dbModelAppDataEntity.js')} */
    const dbModelAppDataEntity = await import(`file://${process.cwd()}/server/db/dbModelAppDataEntity.js`);

    /**@type{import('../../../../server/db/dbModelAppDataEntityResource.js')} */
    const dbModelAppDataEntityResource = await import(`file://${process.cwd()}/server/db/dbModelAppDataEntityResource.js`);

    /**@type{import('../../../../server/db/dbModelAppDataResourceMaster.js')} */
    const dbModelAppDataResourceMaster = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceMaster.js`);

    /**@type{import('../../../../server/db/dbModelAppDataResourceDetail.js')} */
    const dbModelAppDataResourceDetail = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceDetail.js`);

    /**@type{import('../../../../server/iam.service.js')} */
    const {iamAuthorizeToken} = await import(`file://${process.cwd()}/server/iam.service.js`);

    /**@type{import('../../../../server/security.js')} */
    const {securityUUIDCreate, securityPrivateDecrypt, securityPublicEncrypt} = await import(`file://${process.cwd()}/server/security.js`);

    const currency = await dbModelAppDataResourceMaster.get(app_id, null, 
                            new URLSearchParams(`data_app_id=${app_id}&resource_name=CURRENCY`),
                            true)
                            .then(result=>JSON.parse(result[0].json_data));
    
    const merchant = await dbModelAppDataResourceMaster.get(app_id, null, 
                            new URLSearchParams(`data_app_id=${app_id}&resource_name=MERCHANT`),
                            false)
                            .then(result=>result.map(result=>{return {  /**@ts-ignore */
                                                                        merchant_id:                        result.merchant_id,
                                                                        /**@ts-ignore */
                                                                        merchant_private:                   result.merchant_private,
                                                                        /**@ts-ignore */
                                                                        merchant_vpa:                       result.merchant_vpa,
                                                                        /**@ts-ignore */
                                                                        merchant_url:                       result.merchant_url,
                                                                        /**@ts-ignore */
                                                                        merchant_name:                      result.merchant_name,
                                                                        /**@ts-ignore */
                                                                        merchant_public_key:                result.merchant_public_key,
                                                                        /**@ts-ignore */
                                                                        merchant_private_key:               result.merchant_private_key,
                                                                        /**@ts-ignore */
                                                                        merchant_api_secret:               result.merchant_api_secret,
                                                                        id:                                 result.id,
                                                                        user_account_app_user_account_id:   result.user_account_app_user_account_id,
                                                                        user_account_app_app_id:            result.user_account_app_app_id};})
                            /**@ts-ignore */
                            .filter(merchant=>merchant.merchant_id==data.id)[0]);
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
        const  body_decrypted = JSON.parse(securityPrivateDecrypt(merchant.merchant_private_key, data.message));
    
        const merchant_bankaccount = await dbModelAppDataResourceDetail.get(app_id, null, 
                                            new URLSearchParams(`master_id=${merchant.id}&user_account_id=${merchant.user_account_app_user_account_id}&data_app_id=${app_id}&resource_name=ACCOUNT`),
                                            false)
                                            .then(result=>result.map(account=>JSON.parse(account.json_data)).filter(account=>account.bank_account_vpa==merchant.merchant_vpa)[0]);
        const bankaccount_payer = await dbModelAppDataResourceDetail.get(app_id, null, 
                                            new URLSearchParams(`data_app_id=${app_id}&resource_name=ACCOUNT`),
                                            false)
                                            .then(result=>result.map(account=>JSON.parse(account.json_data)).filter(account=>account.bank_account_vpa==body_decrypted.payerid)[0]);
        if (merchant.merchant_api_secret==body_decrypted.api_secret && 
            merchant.merchant_vpa == body_decrypted.payeeid && 
            merchant.merchant_url == body_decrypted.origin && 
            merchant_bankaccount && 
            bankaccount_payer && 
            currency){
            //validate data
            if (body_decrypted.currency_code==currency.currency_code){
                // payment request uses ID Token and SECRET.APP_ID_SECRET  parameter since no user is logged in
                // use SECRET.PAYMENT_REQUEST_EXPIRE to set expire value
                const jwt_data = iamAuthorizeToken(app_id, 'APP_CUSTOM', { id:             body_decrypted.payerid,
                                                                        name:           '',
                                                                        ip:             ip,
                                                                        /**@ts-ignore */
                                                                        scope:          'APP_CUSTOM'}, fileDBGet(app_id, 'APP_SECRET',null, app_id, null)[0].app_payment_request_expire);
    
                const payment_request_id = securityUUIDCreate();
                const data_payment_request = {
                                                merchant_id:    data.id,
                                                payment_request_id:payment_request_id,
                                                reference:      body_decrypted.reference,
                                                payeeid:        body_decrypted.payeeid,
                                                payerid:        body_decrypted.payerid,
                                                currency_code:  body_decrypted.currency_code,
                                                amount:         serverUtilNumberValue(body_decrypted.amount),
                                                message:        body_decrypted.message,
                                                timestamp:      jwt_data.tokentimestamp,
                                                exp:            jwt_data.exp,
                                                iat:            jwt_data.iat,
                                                token:          jwt_data.token,
                                                status:         'PENDING'
                                            };
    
                const data_new_payment_request = {
                                                json_data                                   : data_payment_request,
                                                user_account_id                             : merchant.user_account_app_user_account_id,
                                                user_account_app_id                         : merchant.user_account_app_app_id,
                                                data_app_id                                 : app_id,
                                                app_data_entity_resource_app_data_entity_id : await dbModelAppDataEntity.get(app_id, null, new URLSearchParams(`data_app_id=${app_id}`)).then(result=>result[0].id),
                                                app_data_entity_resource_id                 : await dbModelAppDataEntityResource.get(app_id, null, new URLSearchParams(`data_app_id=${app_id}&resource_name=PAYMENT_REQUEST`)).then(result=>result[0].id)
                                                };
                await dbModelAppDataResourceMaster.post(app_id, data_new_payment_request);
    
    
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
                return [{message:data_encrypted}];
            }
            else{
                res.statusCode = 400;
                throw '⛔';
            }
        }
        else{
            res.statusCode = 404;
            throw '⛔';
        }
    }
    else{
        res.statusCode = 404;
        throw '⛔';
    }

};
export default payment_request_create;