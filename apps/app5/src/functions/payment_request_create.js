/** @module apps/app6 */
/**
 * @param {number} app_id
 * @param {{id:string,
 *          message:string}} data
 * @param {string} user_agent
 * @param {string} ip
 * @param {string} locale
 * @returns {Promise.<{message:string}[]>}
 */
const payment_request_create = async (app_id, data, user_agent, ip, locale) =>{
   
    /**@type{import('../../../../server/config.service.js')} */
    const {ConfigGetApp} = await import(`file://${process.cwd()}/server/config.service.js`);

    /**@type{import('../../../../server/db/sql/app_data_resource_master.service.js')} */
    const {get:MasterGet} = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_master.service.js`);

    /**@type{import('../../../../server/iam.service.js')} */
    const {AuthorizeToken} = await import(`file://${process.cwd()}/server/iam.service.js`);


    /**@type{import('../../../../server/security.service')} */
    const {createUUID, PrivateDecrypt, PublicEncrypt} = await import(`file://${process.cwd()}/server/security.service.js`);

    const currency = await MasterGet(app_id, null, null, app_id, 'CURRENCY', null, locale, true).then(result=>JSON.parse(result[0].json_data));

    const merchant = await MasterGet(app_id, null, null, app_id, 'MERCHANT', null, locale, false).then(merchant=>JSON.parse(merchant[0].json_data).merchant_id== data.id?JSON.parse(merchant[0].json_data):null);
    /** 
     * @type {{ api_secret:   string,
     *          reference:      string,
     *          signature:      string,
     *          payeeid:        string,
     *          payerid:        string,
     *          currency_code:  string,
     *          amount:         number, 
     *          message:        string}}
     */
    const  body_decrypted = JSON.parse(PrivateDecrypt(merchant.merchant_private_key, data.message));

    //find resource MERCHANT for given MERCHANT_ID
    //validate
    if (body_decrypted.currency_code==currency.currency_code && body_decrypted.payerid !='' && body_decrypted.payerid !=null){
        //validate data.api_secret, data.payerid, data.payeeid       
        
        // payment request uses ID Token and SECRET.APP_ID_SECRET  parameter since no user is logged in
        // use SECRET.PAYMENT_REQUEST_EXPIRE to set expire value
        const jwt_data = AuthorizeToken(app_id, 'APP_CUSTOM', { id:             body_decrypted.payerid,
                                                                name:           '',
                                                                ip:             ip,
                                                                scope:          'APP_CUSTOM'}, ConfigGetApp(app_id, app_id, 'SECRETS').PAYMENT_REQUEST_EXPIRE);
        /**
         * @type {{ token:string,
         *          exp:number,
         *          iat:number,
         *          tokentimestamp:number,
         *          payment_request_id:string,
         *          payment_request_status:string,
         *          merchant_name:string
         *          amount:number,
         *          currency_symbol:string}}
         */
        const data = {  token:                  jwt_data.token,
                        /**@ts-ignore */
                        exp:                    jwt_data.exp,
                        /**@ts-ignore */
                        iat:                    jwt_data.iat,
                        /**@ts-ignore */
                        tokentimestamp:         jwt_data.tokentimestamp,
                        payment_request_id:     createUUID(),
                        payment_request_status: 'PENDING',
                        merchant_name:          merchant.merchant_name,
                        amount:			        body_decrypted.amount,
                        currency_symbol:        currency.currency_symbol
                    };
        const data_encrypted = PublicEncrypt(merchant.merchant_public_key, JSON.stringify(data));
        return [{message:data_encrypted}];
    }
    else		
        throw '!';

};
export default payment_request_create;