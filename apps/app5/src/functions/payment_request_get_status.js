/**
 * @module apps/app5/src/functions/payment_request_get_status
 */

/**
 * @param {number} app_id
 * @param {{id:string,
*          message:string}} data
* @param {string} user_agent
* @param {string} ip
* @param {string} locale
* @param {import('../../../../types.js').server_server_res} res
* @returns {Promise.<{message:string}[]>}
*/
const payment_request_get_status = async (app_id, data, user_agent, ip, locale, res) =>{
     
    const {default:jwt} = await import('jsonwebtoken');

    /**@type{import('../../../../server/config.service.js')} */
    const {ConfigGetApp} = await import(`file://${process.cwd()}/server/config.service.js`);

    /**@type{import('../../../../server/db/sql/app_data_resource_master.service.js')} */
    const {get:MasterGet} = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_master.service.js`);

    /**@type{import('../../../../server/db/sql/app_data_resource_detail.service.js')} */
    const {get:DetailGet} = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_detail.service.js`);

    /**@type{import('../../../../server/security.service')} */
    const {PrivateDecrypt, PublicEncrypt} = await import(`file://${process.cwd()}/server/security.service.js`);
    
    /**@type{import('../../../../server/socket.service')} */
    const {ClientSend, ConnectedGet} = await import(`file://${process.cwd()}/server/socket.service.js`);

    const merchant = await MasterGet(app_id, null, null, app_id, 'MERCHANT', null, locale, false)
                           .then(result=>result.map(merchant=>JSON.parse(merchant.json_data)).filter(merchant=>merchant.merchant_id==data.id)[0]);
    if (merchant){
        /** 
        * @type {{  api_secret:             string,
        *           payment_request_id:     string,
        *           origin:                 string}}
        */
        const  body_decrypted = JSON.parse(PrivateDecrypt(merchant.merchant_private_key, data.message));
        if (merchant.merchant_api_secret==body_decrypted.api_secret && merchant.merchant_url == body_decrypted.origin){
            const payment_request = await MasterGet(app_id, null, null, app_id, 'PAYMENT_REQUEST', null, locale, true)
                                            .then(result=>result.map(payment_request=>JSON.parse(payment_request.json_data)).filter(payment_request=>payment_request.payment_request_id==body_decrypted.payment_request_id)[0]);
            
            /**@type{{id:number, name:string, ip:string, scope:string, exp:number, iat:number, tokentimestamp:number}|*} */
            const token_decoded = jwt.verify(payment_request.token, ConfigGetApp(app_id, app_id, 'SECRETS').APP_ID_SECRET);
            
            if (token_decoded.id == payment_request.payerid && 
                token_decoded.scope == 'APP_CUSTOM' && 
                token_decoded.ip == ip &&
                payment_request && (((payment_request.exp ?? 0) * 1000) - Date.now())>0){
                    /**
                     * @type {{ status:string}}
                     */
                    const data_return = {   status:                 payment_request.status
                    };
                    const data_encrypted = PublicEncrypt(merchant.merchant_public_key, JSON.stringify(data_return));

                    const account_payer =  await DetailGet(app_id, null, null, null, app_id, 'ACCOUNT', null, locale, false)
                                                    /**@ts-ignore */
                                                    .then(result=>result.filter(result=>result.bank_account_vpa == payment_request.payerid)[0]);
                    if (account_payer){
                        //if status is still pending then send server side event message to customer
                        if (payment_request.status=='PENDING'){
                            const customer = await MasterGet(app_id, account_payer.app_data_resource_master_id, null, app_id, 'CUSTOMER', null, locale, false).then(result=>result[0]);
                            //check SOCKET connected list
                            for (const user_connected of ConnectedGet(customer.user_account_app_user_account_id ?? 0)){
                                const message = {
                                    type: 'PAYMENT_REQUEST', 
                                    payment_request_id:payment_request.payment_request_id, 
                                    exp:payment_request.exp
                                };
                                ClientSend(user_connected.response, btoa(JSON.stringify(message)), 'APP_FUNCTION');    
                            }
                        }
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
    }
    else{
       res.statusCode = 404;
       throw '⛔';
    }
};
export default payment_request_get_status;