/** @module apps/app6 */
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
 *                      merchant_name:string
 *                      amount:number,
 *                      currency_symbol:string,
 *                      countdown:string}[]>}
 */
const payment_request_create = async (app_id, data, ip, locale) =>{
    
    /**@type{import('../../../../server/security.service')} */
    const {createUUID} = await import(`file://${process.cwd()}/server/security.service.js`);

    /**@type{import('../../../../server/config.service.js')} */
    const {ConfigGetApp} = await import(`file://${process.cwd()}/server/config.service.js`);

    /**@type{import('../../../../server/db/sql/app_data_resource_master.service.js')} */
    const {get:MasterGet} = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_master.service.js`);

    /**@type{import('../../../../server/iam.service.js')} */
    const {AuthorizeToken} = await import(`file://${process.cwd()}/server/iam.service.js`);

    // payment request uses ID Token and SECRET.APP_ID_SECRET  parameter since no user is logged in
    // use SECRET.PAYMENT_REQUEST_EXPIRE to set expire value
    const jwt_data = AuthorizeToken(data.data_app_id, 'APP_CUSTOM', {   id:             data.payeeid,
                                                                        name:           '',
                                                                        ip:             ip,
                                                                        scope:          'APP_CUSTOM'}, ConfigGetApp(app_id, app_id, 'SECRETS').PAYMENT_REQUEST_EXPIRE);
    
    return [{  token:                   jwt_data.token,
              /**@ts-ignore */
              exp:                      jwt_data.exp,
              /**@ts-ignore */
              iat:                      jwt_data.iat,
              /**@ts-ignore */
              tokentimestamp:           jwt_data.tokentimestamp,
              payment_request_id:       createUUID(),
              payment_request_message:	'Check your bank app to authorize this payment',
              merchant_name:            ConfigGetApp(app_id, app_id, 'SECRETS').MERCHANT_NAME,
              amount:					data.amount,
              currency_symbol:          await MasterGet(app_id, null, null, data.data_app_id, 'CURRENCY', null, locale, true).then(result=>JSON.parse(result[0].json_data).currency_symbol),
              countdown:                ''
          }];
};
export default payment_request_create;