/** @module apps/app6 */
/**
 * @param {number} app_id
 * @param {{payment_request_id: string,
*          data_app_id: number}} data
* @param {string} user_agent
* @param {string} ip
* @param {string} locale
* @param {import('../../../../types.js').res} res
* @returns {Promise.<{ status:string}[]>}
*/
const payment_request_get_status = async (app_id, data, user_agent, ip, locale, res) =>{

   /**@type{import('../../../../server/config.service.js')} */
   const {ConfigGetApp} = await import(`file://${process.cwd()}/server/config.service.js`);

   /**@type{import('../../../../apps/apps.service.js')} */
   const {request_external} = await import(`file://${process.cwd()}/apps/apps.service.js`);

   /**@type{import('../../../../server/security.service')} */
   const {PrivateDecrypt, PublicEncrypt} = await import(`file://${process.cwd()}/server/security.service.js`); 
   
   const url = ConfigGetApp(app_id, app_id, 'SECRETS').MERCHANT_API_URL.filter((/**@type{*}*/url)=>url.key=='PAYMENT_REQUEST_GET_STATUS')[0].value;
   
    /** 
     * @type {{ api_secret:           string,
     *          payment_request_id:   string}}
     */
    const body = {	api_secret:     ConfigGetApp(app_id, app_id, 'SECRETS').MERCHANT_API_SECRET,
                    payment_request_id: data.payment_request_id
    };
    //use merchant_id to lookup api key authorized request and public and private keys to read and send encrypted messages
    //use general id and message keys so no info about what type of message is sent, only the receinving function should know
    const body_encrypted = {id:    ConfigGetApp(app_id, app_id, 'SECRETS').MERCHANT_ID,
                            message:PublicEncrypt(ConfigGetApp(app_id, app_id, 'SECRETS').MERCHANT_PUBLIC_KEY, JSON.stringify(body))};
    
    const result_request_external = await request_external(url, 'POST', body_encrypted, user_agent, ip, null, locale ).then(result=>JSON.parse(result));
    if (result_request_external.error){
        res.statusCode = result_request_external.error.http;
        throw '⛔';
    }
    else{
        /**
         * @type {{ status:string}}
         */
        const body_decrypted = JSON.parse(PrivateDecrypt(ConfigGetApp(app_id, app_id, 'SECRETS').MERCHANT_PRIVATE_KEY, result_request_external.rows[0].message));

        return [{   
                    status:                 body_decrypted.status
                }];
    }
};
export default payment_request_get_status;