/**
 * @module apps/app5/src/functions/payment_request_get_status
 */

/**
 * @name payment_request_get_status
 * @description Get payment request status
 * @function
 * @param {number} app_id
 * @param {{id:string,
 *          message:string}} data
 * @param {string} user_agent
 * @param {string} ip
 * @param {string} locale
 * @param {import('../../../../server/types.js').server_server_res} res
 * @returns {Promise.<{message:string}[]>}
 */
const payment_request_get_status = async (app_id, data, user_agent, ip, locale, res) =>{
     
    const {default:jwt} = await import('jsonwebtoken');

    /**@type{import('../../../../server/db/file.js')} */
    const {fileDBGet} = await import(`file://${process.cwd()}/server/db/file.js`);

    /**@type{import('../../../../server/db/dbModelAppDataResourceMaster.js')} */
    const dbModelAppDataResourceMaster = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceMaster.js`);

    /**@type{import('../../../../server/db/dbModelAppDataResourceDetail.js')} */
    const dbModelAppDataResourceDetail = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceDetail.js`);

    /**@type{import('../../../../server/security.js')} */
    const {securityPrivateDecrypt, securityPublicEncrypt} = await import(`file://${process.cwd()}/server/security.js`);

    /**@type{import('../../../../server/iam.js')} */
    const  {iamUtilMesssageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);

    /**@type{import('../../../../server/socket.js')} */
    const {socketClientSend, socketConnectedGet} = await import(`file://${process.cwd()}/server/socket.js`);

    const merchant = await dbModelAppDataResourceMaster.get({   app_id:app_id, 
                                                                resource_id:null, 
                                                                data:{  data_app_id:app_id,
                                                                        resource_name:'MERCHANT',
                                                                        user_null:'0'
                                                                }})
                           .then(result=>result.map(merchant=>JSON.parse(merchant.json_data)).filter(merchant=>merchant.merchant_id==data.id)[0]);
    if (merchant){
        /** 
        * @type {{  api_secret:             string,
        *           payment_request_id:     string,
        *           origin:                 string}}
        */
        const  body_decrypted = JSON.parse(securityPrivateDecrypt(merchant.merchant_private_key, data.message));
        if (merchant.merchant_api_secret==body_decrypted.api_secret && merchant.merchant_url == body_decrypted.origin){
            const payment_requests = await dbModelAppDataResourceMaster.get({   app_id:app_id, 
                                                                                resource_id:null, 
                                                                                data:{  data_app_id:app_id,
                                                                                        resource_name:'PAYMENT_REQUEST',
                                                                                        user_null:'0'
                                                                                }})
                                            .then(result=>result.map(payment_request=>JSON.parse(payment_request.json_data)));
            const payment_request = payment_requests.filter(payment_request=>payment_request.payment_request_id==body_decrypted.payment_request_id)[0];
            /**@type{{id:number, name:string, ip:string, scope:string, exp:number, iat:number, tokentimestamp:number}|*} */
            const token_decoded = jwt.verify(payment_request.token, fileDBGet(app_id, 'APP_SECRET',null, app_id)[0].common_app_id_secret);
            
            if (payment_request && (((payment_request.exp ?? 0) * 1000) - Date.now())>0 &&
                token_decoded.id == payment_request.payerid && 
                token_decoded.scope == 'APP_CUSTOM' && 
                token_decoded.ip == ip){
                    /**
                     * @type {{ status:string}}
                     */
                    const data_return = {   status:                 payment_request.status
                    };
                    const data_encrypted = securityPublicEncrypt(merchant.merchant_public_key, JSON.stringify(data_return));

                    const account_payer =  await dbModelAppDataResourceDetail.get({ app_id:app_id, 
                                                                                    resource_id:null, 
                                                                                    data:{  data_app_id:app_id,
                                                                                            resource_name:'ACCOUNT',
                                                                                            user_null:'0'
                                                                                    }})
                                                    /**@ts-ignore */
                                                    .then(result=>result.filter(result=>result.bank_account_vpa == payment_request.payerid)[0]);
                    if (account_payer){
                        //if status is still pending then send server side event message to customer
                        if (payment_request.status=='PENDING'){
                            const customer = await dbModelAppDataResourceMaster.get({   app_id:app_id, 
                                                                                        resource_id:account_payer.app_data_resource_master_id, 
                                                                                        data:{  data_app_id:app_id,
                                                                                                resource_name:'CUSTOMER',
                                                                                                user_null:'0'
                                                                                        }})
                                                    .then(result=>result[0]);
                            //check SOCKET connected list
                            for (const user_connected of socketConnectedGet(customer.user_account_app_user_account_id ?? 0)){
                                const message = {
                                    type: 'PAYMENT_REQUEST', 
                                    payment_request_id:payment_request.payment_request_id, 
                                    exp:payment_request.exp
                                };
                                socketClientSend(user_connected.response, btoa(JSON.stringify(message)), 'APP_FUNCTION');    
                            }
                        }
                        return [{message:data_encrypted}];
                    }
                    else{
                        res.statusCode = 404;
                        throw iamUtilMesssageNotAuthorized();
                    }
            }
            else{
                    res.statusCode = 404;
                    throw iamUtilMesssageNotAuthorized();
            }
        }
        else{
            res.statusCode = 404;
            throw iamUtilMesssageNotAuthorized();
        }
    }
    else{
       res.statusCode = 404;
       throw iamUtilMesssageNotAuthorized();
    }
};
export default payment_request_get_status;