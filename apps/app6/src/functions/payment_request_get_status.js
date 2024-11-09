/**
 * @module apps/app6/src/functions/payment_request_get_status
 */

/**
 * @param {number} app_id
 * @param {{payment_request_id: string,
*          data_app_id: number}} data
* @param {string} user_agent
* @param {string} ip
* @param {string} locale
* @param {import('../../../../server/types.js').server_server_res} res
* @returns {Promise.<{ status:string}[]>}
*/
const payment_request_get_status = async (app_id, data, user_agent, ip, locale, res) =>{

    /**@type{import('../../../../apps/common/src/common.js')} */
    const {commonRegistryAppSecret} = await import(`file://${process.cwd()}/apps/common/src/common.js`);

    /**@type{import('../../../../apps/common/src/common.js')} */
    const {commonBFE} = await import(`file://${process.cwd()}/apps/common/src/common.js`);

    /**@type{import('../../../../server/security.js')} */
    const {securityPrivateDecrypt, securityPublicEncrypt} = await import(`file://${process.cwd()}/server/security.js`); 
    /**@ts-ignore */
    const url = commonRegistryAppSecret(app_id).merchant_api_url_payment_request_get_status;
   
    /** 
     * @type {{ api_secret:             string,
     *          payment_request_id:     string,
     *          origin:                 string}}
     */
    const body = {	api_secret:     /**@ts-ignore */
                                    commonRegistryAppSecret(app_id).merchant_api_secret,
                    payment_request_id: data.payment_request_id,
                    origin:         res.req.protocol + '://' + res.req.hostname
    };
    //use merchant_id to lookup api key authorized request and public and private keys to read and send encrypted messages
    //use general id and message keys so no info about what type of message is sent, only the receinving function should know
    const body_encrypted = {id:     /**@ts-ignore */
                                    commonRegistryAppSecret(app_id).MERCHANT_ID,
                            message:securityPublicEncrypt(
                                        /**@ts-ignore */
                                        commonRegistryAppSecret(app_id).merchant_public_key, 
                                        JSON.stringify(body))};
    
    const result_commonBFE = await commonBFE({host:url, method:'POST', body:body_encrypted, user_agent:user_agent, ip:ip, authorization:null, locale:locale}).then(result=>JSON.parse(result));
    if (result_commonBFE.error){
        res.statusCode = result_commonBFE.error.http;
        throw '⛔';
    }
    else{
        /**
         * @type {{ status:string}}
         */
        const body_decrypted = JSON.parse(securityPrivateDecrypt(
                                                /**@ts-ignore */
                                                commonRegistryAppSecret(app_id).merchant_private_key, 
                                                result_commonBFE.rows[0].message));

        return [{   
                    status:                 body_decrypted.status
                }];
    }
};
export default payment_request_get_status;