/** @module apps/app5 */
/**
 * @param {number} app_id
 * @param {{data_app_id:number,
 *          user_account_id:number,
 *          payment_request_id: string}} data
 * @param {string} user_agent
 * @param {string} ip
 * @param {string} locale
 * @param {import('../../../../types.js').res} res
 * @returns {Promise.<import('../../../../types.js').db_result_app_data_resource_master_get[]>}
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
        const account_payer =  await DetailGet(app_id, null, null, data.user_account_id, data.data_app_id, 'ACCOUNT', null, locale, false)
                                        /**@ts-ignore */
                                        .then(result=>result.filter(result=>result.bank_account_vpa == payment_request.payerid)[0]);
        if (account_payer)
            return  [payment_request];
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