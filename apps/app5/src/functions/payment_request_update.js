/**
 * @module apps/app5/src/functions/payment_request_update
 */

/**
 * @param {number} app_id
 * @param {{data_app_id:number,
 *          user_account_id:number,
 *          payment_request_id:string,
 *          status:1|0}} data
 * @param {string} user_agent
 * @param {string} ip
 * @param {string} locale
 * @param {import('../../../../server/types.js').server_server_res} res
 * @returns {Promise.<{status:string}[]>}
 */
const payment_request_update = async (app_id, data, user_agent, ip, locale, res) =>{

    /**@type{import('../../../../server/server.js')} */
    const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

    /**@type{import('../../../../server/db/sql/app_data_resource_master.service.js')} */
    const {get:MasterGet, update:MasterUpdate} = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_master.service.js`);

    /**@type{import('../../../../server/db/sql/app_data_resource_detail.service.js')} */
    const {get:DetailGet} = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_detail.service.js`);

    /**@type{import('../../../../server/db/sql/app_data_resource_detail_data.service.js')} */
    const {get:DetailDataGet, post:DetailDataPost} = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_detail_data.service.js`);

    const customer = await MasterGet(app_id, null, data.user_account_id, data.data_app_id, 'CUSTOMER', null, locale, false)
                            .then(result=>result[0]);
    const payment_request = await MasterGet(app_id, null, null, data.data_app_id, 'PAYMENT_REQUEST', null, locale, true)
                            .then(result=>result
                                            /**@ts-ignore */
                                            .filter(payment_request=>payment_request.payment_request_id==data.payment_request_id)[0]);

    if (customer && payment_request && (serverUtilNumberValue(data.status)==1 || serverUtilNumberValue(data.status)==0)){
        let status ='PENDING';
        if (serverUtilNumberValue(data.status)==1)
            /**@ts-ignore */
            if ((((payment_request.exp ?? 0) * 1000) - Date.now())<0)
                status = 'EXPIRED';
            else
                try {
                    const account_payer         =  await DetailGet(app_id, null, customer.id, data.user_account_id, data.data_app_id, 
                                                                    'ACCOUNT', null, locale, false).then(result=>result[0]);
                    const account_payer_saldo   =  await DetailDataGet(app_id, null, account_payer.id, data.user_account_id, data.data_app_id, 
                                                                        'RESOURCE_TYPE', 'ACCOUNT', 'RESOURCE_TYPE', 'CUSTOMER', null, null, null, locale, false)
                                                                        .then(result=>result.reduce((balance, current_row)=>balance += 
                                                                                                        /**@ts-ignore */
                                                                                                        (current_row.amount_deposit ?? current_row.amount_withdrawal) ?? 0,0));
                    /**@ts-ignore */                                                
                    if ((account_payer_saldo - payment_request.amount) <0)
                        status='NO FUNDS';
                    else{
                        const data_debit = {json_data                               : { timestamp:new Date().toISOString(),
                                                                                        logo:'',
                                                                                        /**@ts-ignore */
                                                                                        origin:payment_request.reference,
                                                                                        amount_deposit:null,
                                                                                        /**@ts-ignore */
                                                                                        amount_withdrawal:payment_request.amount *-1},
                                            user_account_id                         : data.user_account_id,
                                            data_app_id                             : data.data_app_id,
                                            app_data_resource_detail_id             : account_payer.id,
                                            app_data_resource_master_attribute_id   : null
                                            };
                        //create DEBIT transaction PAYERID resource TRANSACTION
                        await DetailDataPost(app_id, data_debit);

                        const account_payee         =  await DetailGet(app_id, null, null, null, data.data_app_id, 
                                                                        'ACCOUNT', null, locale, false)
                                                                /**@ts-ignore */
                                                                .then(result=>result.filter(account=>account.bank_account_vpa == payment_request.payeeid)[0]);
                        const data_credit = {   json_data                               : { timestamp:new Date().toISOString(),
                                                                                            logo:'',
                                                                                            /**@ts-ignore */
                                                                                            origin:payment_request.reference,
                                                                                            /**@ts-ignore */
                                                                                            amount_deposit:payment_request.amount,
                                                                                            amount_withdrawal:null},
                                                                                        
                                                user_account_id                         : account_payee.user_account_app_user_account_id,
                                                data_app_id                             : data.data_app_id,
                                                app_data_resource_detail_id             : account_payee.id,
                                                app_data_resource_master_attribute_id   : null
                                                };
                        //create CREDIT transaction PAYEEID resource TRANSACTION
                        await DetailDataPost(app_id, data_credit);
                        status = 'PAID';
                    }
                } catch (error) {
                    status = 'FAILED';
                }
        else
            status='CANCELLED';

        const data_payment_request = {  json_data                                       : JSON.parse(payment_request.json_data),
                                        user_account_id                                 : null,
                                        data_app_id                                     : data.data_app_id,
                                        app_data_entity_resource_app_data_entity_id     : payment_request.app_data_entity_resource_app_data_entity_id,
                                        app_data_entity_resource_id                     : payment_request.app_data_entity_resource_id
                                        };
        //update status in json_data column
        data_payment_request.json_data.status = status;
        //update payment request
        await MasterUpdate(app_id, payment_request.id, data_payment_request);
        return [{status:status}];
   }
   else{
       res.statusCode = 404;
       throw '⛔';
   }
};
export default payment_request_update;