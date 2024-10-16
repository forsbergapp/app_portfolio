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
    const {getNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
    
    /**@type{import('../../../../server/config.js')} */
    const {ConfigGetApp} = await import(`file://${process.cwd()}/server/config.js`);

    /**@type{import('../../../../server/db/sql/app_data_entity.service.js')} */
    const {get:EntityGet} = await import(`file://${process.cwd()}/server/db/sql/app_data_entity.service.js`);

    /**@type{import('../../../../server/db/sql/app_data_entity_resource.service.js')} */
    const {get:EntityResourceGet} = await import(`file://${process.cwd()}/server/db/sql/app_data_entity_resource.service.js`);

    /**@type{import('../../../../server/db/sql/app_data_resource_master.service.js')} */
    const {get:MasterGet, post:MasterPost} = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_master.service.js`);

    /**@type{import('../../../../server/db/sql/app_data_resource_detail.service.js')} */
    const {get:DetailGet } = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_detail.service.js`);

    /**@type{import('../../../../server/iam.service.js')} */
    const {AuthorizeToken} = await import(`file://${process.cwd()}/server/iam.service.js`);

    /**@type{import('../../../../server/security.service')} */
    const {createUUID, PrivateDecrypt, PublicEncrypt} = await import(`file://${process.cwd()}/server/security.js`);

    const currency = await MasterGet(app_id, null, null, app_id, 'CURRENCY', null, locale, true).then(result=>JSON.parse(result[0].json_data));

    const merchant = await MasterGet(app_id, null, null, app_id, 'MERCHANT', null, locale, false)
                            .then(result=>result.map(merchant=>JSON.parse(merchant.json_data)).filter(merchant=>merchant.merchant_id==data.id)[0]);
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
        const  body_decrypted = JSON.parse(PrivateDecrypt(merchant.merchant_private_key, data.message));
    
        const merchant_bankaccount = await DetailGet(app_id, null, merchant.id, merchant.user_account_app_user_acccount_id, app_id, 'ACCOUNT', null, locale, false)
                                                .then(result=>result.map(account=>JSON.parse(account.json_data)).filter(account=>account.bank_account_vpa==merchant.merchant_vpa)[0]);
        const bankaccount_payer = await DetailGet(app_id, null, null, null, app_id, 'ACCOUNT', null, locale, false)
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
                const jwt_data = AuthorizeToken(app_id, 'APP_CUSTOM', { id:             body_decrypted.payerid,
                                                                        name:           '',
                                                                        ip:             ip,
                                                                        scope:          'APP_CUSTOM'}, ConfigGetApp(app_id, app_id, 'SECRETS').PAYMENT_REQUEST_EXPIRE);
    
                const payment_request_id = createUUID();
                const data_payment_request = {
                                                merchant_id:    data.id,
                                                payment_request_id:payment_request_id,
                                                reference:      body_decrypted.reference,
                                                payeeid:        body_decrypted.payeeid,
                                                payerid:        body_decrypted.payerid,
                                                currency_code:  body_decrypted.currency_code,
                                                amount:         getNumberValue(body_decrypted.amount),
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
                                                app_data_entity_resource_app_data_entity_id : await EntityGet(app_id, null, app_id, locale).then(result=>result[0].id),
                                                app_data_entity_resource_id                 : await EntityResourceGet(app_id, null, app_id, 'PAYMENT_REQUEST', null, locale).then(result=>result[0].id)
                                                };
                await MasterPost(app_id, data_new_payment_request);
    
    
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
                const data_encrypted = PublicEncrypt(merchant.merchant_public_key, JSON.stringify(data_return));
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