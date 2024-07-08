/** @module apps/app5 */
/**
 * @param {number} app_id
 * @param {{reference:string,
 *          data_app_id: number,
 *          payeeid:string,
 *          amount:number,
 *          currency_code:string,
 *          message:string}} data
 * @param {string} ip
 * @param {string} locale
 * @returns {Promise.<{ token:string,
 *                      exp:number,
 *                      iat:number,
 *                      tokentimestamp:number,
 *                      payment_request_id:string,
 *                      payment_request_message:string,
 *                      amount:number,
 *                      currency_code:string,
 *                      currency_symbol:string,
 *                      merchant_name:string}>}
 */
const payment_request_create = async (app_id, data, ip, locale) =>{
    const {default:jwt} = await import('jsonwebtoken');
    
    /**@type{import('../../../../server/security.service')} */
    const {createUUID} = await import(`file://${process.cwd()}/server/security.service.js`);

    /**@type{import('../../../../server/config.service.js')} */
    const {ConfigGetApp} = await import(`file://${process.cwd()}/server/config.service.js`);

    const access_token_claim = {app_id:         data.data_app_id,
                                payeeid:        data.payeeid,
                                ip:             ip,
                                scope:          'USER',
                                tokentimestamp: Date.now()};

    // payment request uses ID Token and SECRET.APP_ID_SECRET  parameter since no user is logged in
    // use SECRET.PAYMENT_REQUEST_EXPIRE to set expire value
    const token = jwt.sign (access_token_claim, ConfigGetApp(app_id, app_id, 'SECRETS').APP_ID_SECRET, {expiresIn: ConfigGetApp(app_id, app_id, 'SECRETS').PAYMENT_REQUEST_EXPIRE});
    
    return {  token:                      token,
              /**@ts-ignore */
              exp:                        jwt.decode(token, { complete: true }).payload.exp,
              /**@ts-ignore */
              iat:                        jwt.decode(token, { complete: true }).payload.iat,
              /**@ts-ignore */
              tokentimestamp:             jwt.decode(token, { complete: true }).payload.tokentimestamp,
              payment_request_id:			    createUUID(),
              payment_request_message:	  'Check your bank app to authorize this payment',
              amount:						          data.amount,
              currency_code:              'APPEUR',
              currency_symbol:            '€',
              merchant_name:              'SHOP App'
          };
};
export default payment_request_create;