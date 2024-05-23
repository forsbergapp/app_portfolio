/** @module server/db/components */

/**@type{import('../sql/app_category.service.js')} */
const service = await import(`file://${process.cwd()}/server/db/sql/app_category.service.js`);

/**@type{import('../../server.service.js')} */
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {*} query
 * @returns {Promise.<import('../../../types.js').db_result_app_category_getAppCategoryAdmin[]>}
 */
const getAppCategoryAdmin = (app_id, query) => service.getAppCategoryAdmin(app_id, getNumberValue(query.get('id')), query.get('lang_code'))
                                                .catch((/**@type{import('../../../types.js').error}*/error)=>{throw error;});
export{getAppCategoryAdmin};
