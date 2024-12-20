/**
 * @module apps/app6/src/functions/payment_request_create
 */
/**
 * @param {number} app_id
 * @param {{reference:string,
 *          data_app_id: number,
 *          payerid:string,
 *          amount:number,
 *          currency_code:string,
 *          message:string}} data
 * @param {string} user_agent
 * @param {string} ip
 * @param {string} locale
 * @param {import('../../../../server/types.js').server_server_res} res
 * @returns {Promise.<{ token:string,
 *                      exp:number,
 *                      iat:number,
 *                      tokentimestamp:number,
 *                      payment_request_id:string,
 *                      payment_request_message:string,
 *                      status:string,
 *                      merchant_name:string
 *                      amount:number,
 *                      currency_symbol:string,
 *                      countdown:string}[]>}
 */
const payment_request_create = async (app_id, data, user_agent, ip, locale, res) =>{
    /**@type{import('../../../../server/server.js')} */
    const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

    /**@type{import('../../../../server/db/file.js')} */
    const {fileDBGet} = await import(`file://${process.cwd()}/server/db/file.js`);

    /**@type{import('../../../../server/db/dbModelAppDataResourceMaster.js')} */
    const dbModelAppDataResourceMaster = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceMaster.js`);

    /**@type{import('../../../../apps/common/src/common.js')} */
    const {commonBFE} = await import(`file://${process.cwd()}/apps/common/src/common.js`);

    /**@type{import('../../../../server/security.js')} */
    const {securityPrivateDecrypt, securityPublicEncrypt} = await import(`file://${process.cwd()}/server/security.js`); 
    /**@ts-ignore */
    const url = fileDBGet(app_id, 'APP_SECRET',null, app_id, null)[0].merchant_api_url_payment_request_create;
    const currency = await dbModelAppDataResourceMaster.get(app_id, null, 
                            new URLSearchParams(`data_app_id=${data.data_app_id}&resource_name=CURRENCY`),
                            true).then(result=>JSON.parse(result[0].json_data));
    //validate
	if (data.currency_code==currency.currency_code && data.payerid !='' && data.payerid !=null){
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
        const body = {	api_secret:     fileDBGet(app_id, 'APP_SECRET',null, app_id, null)[0].merchant_api_secret,
                        reference:      data.reference.substring(0,30),
                        payeeid:        fileDBGet(app_id, 'APP_SECRET',null, app_id, null)[0].merchant_vpa, 
                        payerid:        data.payerid,
                        currency_code:  currency.currency_code,
                        amount:         serverUtilNumberValue(data.amount) ?? 0, 
                        message:        data.message,
                        origin:         res.req.protocol + '://' + res.req.hostname
        };
        //use merchant_id to lookup api key authorized request and public and private keys to read and send encrypted messages
        //use general id and message keys so no info about what type of message is sent, only the receinving function should know
        const body_encrypted = {id:     fileDBGet(app_id, 'APP_SECRET',null, app_id, null)[0].merchant_id,
                                message:securityPublicEncrypt(
                                                                fileDBGet(app_id, 'APP_SECRET',null, app_id, null)[0].merchant_public_key, 
                                                                JSON.stringify(body))};
        
        const result_commonBFE = await commonBFE({host:url, method:'POST', body:body_encrypted, user_agent:user_agent, ip:ip, authorization:null, locale:locale}).then(result=>JSON.parse(result));
        if (result_commonBFE.error){
            res.statusCode = result_commonBFE.error.http;
            throw '⛔';
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
                                                    fileDBGet(app_id, 'APP_SECRET',null, app_id, null)[0].merchant_private_key, 
                                                    result_commonBFE.rows[0].message));

            return [{   token:                  body_decrypted.token,
                        exp:                    body_decrypted.exp,
                        iat:                    body_decrypted.iat,
                        tokentimestamp:         body_decrypted.tokentimestamp,
                        payment_request_id:     body_decrypted.payment_request_id,
                        payment_request_message:'Check your bank app to authorize this payment',
                        status:                 body_decrypted.status,
                        merchant_name:          fileDBGet(app_id, 'APP_SECRET',null, app_id, null)[0].merchant_name,
                        amount:			        body_decrypted.amount,
                        currency_symbol:        currency.currency_symbol,
                        countdown:              ''
                    }];
        }
    }
	else{
        res.statusCode=400;
        throw '⛔';
    }
};
export default payment_request_create;