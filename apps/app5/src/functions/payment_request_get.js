/** @module apps/app5 */
/**
 * @param {number} app_id
 * @param {{id:string,
*          message:string}} data
* @param {string} user_agent
* @param {string} ip
* @param {string} locale
* @param {import('../../../../types.js').res} res
* @returns {Promise.<{message:string}[]>}
*/
const payment_request_get = async (app_id, data, user_agent, ip, locale, res) =>{
     
   /**@type{import('../../../../server/db/sql/app_data_resource_master.service.js')} */
   const {get:MasterGet} = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_master.service.js`);

   /**@type{import('../../../../server/security.service')} */
   const {PrivateDecrypt, PublicEncrypt} = await import(`file://${process.cwd()}/server/security.service.js`);

   const merchant = await MasterGet(app_id, null, null, app_id, 'MERCHANT', null, locale, false)
                           .then(result=>result.map(merchant=>JSON.parse(merchant.json_data)).filter(merchant=>merchant.merchant_id==data.id)[0]);
   if (merchant){
        /** 
        * @type {{ api_secret:           string,
        *          payment_request_id:   string}}
        */
        const  body_decrypted = JSON.parse(PrivateDecrypt(merchant.merchant_private_key, data.message));
        if (merchant.merchant_api_secret==body_decrypted.api_secret){
            const payment_request = await MasterGet(app_id, null, null, app_id, 'PAYMENT_REQUEST', null, locale, true)
                                            .then(result=>result.map(payment_request=>JSON.parse(payment_request.json_data)).filter(payment_request=>payment_request.payment_request_id==body_decrypted.payment_request_id)[0]);
            
            if (payment_request){
                    /**
                     * @type {{ status:string}}
                     */
                    const data_return = {   status:                 payment_request.status
                    };
                    const data_encrypted = PublicEncrypt(merchant.merchant_public_key, JSON.stringify(data_return));
                    return [{message:data_encrypted}];
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
   }
   else{
       res.statusCode = 404;
       throw '⛔';
   }
};
export default payment_request_get;