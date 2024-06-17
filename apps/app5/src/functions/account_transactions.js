/** @module apps/app5 */

/**
 * 
 * @param {number} app_id 
 * @param {*} data 
 * @param {string} locale
 */
const getTransacions = async (app_id, data, locale) =>{

    /**@type{import('../../../../server/db/sql/app_data_resource_detail_data.service.js')} */
    const {get} = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_detail_data.service.js`);

    return await get(app_id, null, data.user_account_id, data.data_app_id, 'ACCOUNT', null, null, null, false);
}; 
export default getTransacions;