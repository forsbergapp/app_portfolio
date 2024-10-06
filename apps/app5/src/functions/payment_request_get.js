/**
 * @module apps/app5/src/functions/payment_request_get
 */

/**
 * @param {number} app_id
 * @param {{data_app_id:number,
 *          user_account_id:number,
 *          payment_request_id: string}} data
 * @param {string} user_agent
 * @param {string} ip
 * @param {string} locale
 * @param {import('../../../../server/types.js').server_server_res} res
 * @returns {Promise.<{ payment_request_message:string,
 *                      token:                  string,
 *                      exp:                    number,
 *                      iat:                    number,
 *                      tokentimestamp:         number,
 *                      payment_request_id:     string,
 *                      status:                 string,
 *                      merchant_name:          string,
 *                      amount:			        number,
 *                      currency_symbol:        string,
 *                      countdown:              string}>}
 */
const payment_request_get = async (app_id, data, user_agent, ip, locale, res) =>{
    /**@type{import('../../../../server/db/sql/app_data_resource_master.service.js')} */
    const {get:MasterGet} = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_master.service.js`);
    
    /**@type{import('../../../../server/db/sql/app_data_resource_detail.service.js')} */
    const {get:DetailGet} = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_detail.service.js`);

    const payment_request = await MasterGet(app_id, null, null, data.data_app_id, 'PAYMENT_REQUEST', null, locale, true)
                                    /**@ts-ignore */
                                    .then(result=>result.filter(payment_request=>payment_request.payment_request_id==data.payment_request_id)[0]);
    if (payment_request){
        const account_payer = await DetailGet(app_id, null, null, data.user_account_id, data.data_app_id, 'ACCOUNT', null, locale, false)
                                        /**@ts-ignore */
                                        .then(result=>result.filter(result=>result.bank_account_vpa == payment_request.payerid)[0]);
        const merchant      = await MasterGet(app_id, null, null, app_id, 'MERCHANT', null, locale, false)
                                        /**@ts-ignore */    
                                        .then(result=>result.map(merchant=>JSON.parse(merchant.json_data)).filter(merchant=>merchant.merchant_id==payment_request.merchant_id)[0]);
        const currency      = await MasterGet(app_id, null, null, data.data_app_id, 'CURRENCY', null, locale, true).then(result=>JSON.parse(result[0].json_data));

        if (account_payer && merchant && currency){
            /**@ts-ignore */
            return  [{  payment_request_message:'Authorize this payment',
                        /**@ts-ignore */
                        token:                  payment_request.token,
                        /**@ts-ignore */
                        exp:                    payment_request.exp,
                        /**@ts-ignore */
                        iat:                    payment_request.iat,
                        /**@ts-ignore */
                        tokentimestamp:         payment_request.tokentimestamp,
                        /**@ts-ignore */
                        payment_request_id:     payment_request.payment_request_id,
                        /**@ts-ignore */
                        status:                 payment_request.status,
                        /**@ts-ignore */
                        merchant_name:          merchant.merchant_name,
                        /**@ts-ignore */
                        amount:			        payment_request.amount,
                        currency_symbol:        currency.currency_symbol,
                        countdown:              ''}];
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