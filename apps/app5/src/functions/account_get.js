/** @module apps/app5 */
/**
 * @param {number} app_id
 * @param {*} data
 * @param {string} locale
 * @returns {Promise.<import('../../../../types.js').db_result_app_data_resource_detail_get[]>}
 */
const account_get = async (app_id, data, locale) =>{
    /**@type{import('../../../../server/db/sql/app_data_resource_detail.service.js')} */
    const {get} = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_detail.service.js`);
    
    return await get(app_id, data.resource_id, null, data.user_account_id, data.data_app_id, 'ACCOUNT', data.entity_id, data.locale, false);
};
export default account_get;