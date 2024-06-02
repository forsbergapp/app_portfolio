/** @module apps/app5 */

/**
 * 
 * @param {number} app_id 
 * @param {*} data 
 */
const getTransacions = async (app_id, data) =>{

    /**@type{import('../../../../server/db/sql/app_data_resource_detail_data.service.js')} */
    const {get} = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_detail_data.service.js`);

    const transactions = await get(app_id, null, data.user_account_id, data.data_app_id, 'ACCOUNT', null, null, null, false);
    let transaction_fields = [];
    if (data.fields){
        const transaction_fields = transactions.rows.map((/**@type{*}*/row)=>{
            let transaction_new = {};
            for (const field of data.fields.split(',')){
                /**@ts-ignore */
                transaction_new[field] = row[field];
            }
            return transaction_new;
        })
        return {list_header: transactions.list_header,
                rows: transaction_fields};
    }
    else
        return transactions;
} 
export default getTransacions;