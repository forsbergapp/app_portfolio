/**
 * @module apps/app6/src/functions/payment_request_get_status
 */

/**
 * @name payment_request_get_status
 * @description Get payment request status
 * @function
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

    /**@type{import('../../../../server/db/file.js')} */
    const {fileDBGet} = await import(`file://${process.cwd()}/server/db/file.js`);

    /**@type{import('../../../../apps/common/src/common.js')} */
    const {commonBFE} = await import(`file://${process.cwd()}/apps/common/src/common.js`);
    
    /**@type{import('../../../../server/iam.js')} */
    const  {iamUtilMesssageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);

    /**@type{import('../../../../server/security.js')} */
    const {securityPrivateDecrypt, securityPublicEncrypt} = await import(`file://${process.cwd()}/server/security.js`); 
    /**@ts-ignore */
    const url = fileDBGet(app_id, 'APP_SECRET',null, app_id, null)[0].merchant_api_url_payment_request_get_status;
   
    /** 
     * @type {{ api_secret:             string,
     *          payment_request_id:     string,
     *          origin:                 string}}
     */
    const body = {	api_secret:     /**@ts-ignore */
                                    fileDBGet(app_id, 'APP_SECRET',null, app_id, null)[0].merchant_api_secret,
                    payment_request_id: data.payment_request_id,
                    origin:         res.req.protocol + '://' + res.req.hostname
    };
    //use merchant_id to lookup api key authorized request and public and private keys to read and send encrypted messages
    //use general id and message keys so no info about what type of message is sent, only the receinving function should know
    const body_encrypted = {id:     /**@ts-ignore */
                                    fileDBGet(app_id, 'APP_SECRET',null, app_id, null)[0].merchant_id,
                            message:securityPublicEncrypt(
                                        /**@ts-ignore */
                                        fileDBGet(app_id, 'APP_SECRET',null, app_id, null)[0].merchant_public_key, 
                                        JSON.stringify(body))};
    
    const result_commonBFE = await commonBFE({url:url, method:'POST', body:body_encrypted, user_agent:user_agent, ip:ip, authorization:null, locale:locale}).then(result=>JSON.parse(result));
    if (result_commonBFE.error){
        res.statusCode = result_commonBFE.error.http;
        throw iamUtilMesssageNotAuthorized();
    }
    else{
        /**
         * @type {{ status:string}}
         */
        const body_decrypted = JSON.parse(securityPrivateDecrypt(
                                                /**@ts-ignore */
                                                fileDBGet(app_id, 'APP_SECRET',null, app_id, null)[0].merchant_private_key, 
                                                result_commonBFE.rows[0].message));

        return [{   
                    status:                 body_decrypted.status
                }];
    }
};
export default payment_request_get_status;