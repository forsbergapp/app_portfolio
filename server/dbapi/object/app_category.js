/** @module server/dbapi/object/app_category */

/**@type{import('../../dbapi/app_portfolio/app_category.service.js')} */
const service = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_category.service.js`);

/**@type{import('../../server.service.js')} */
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {*} query
 * @returns {import('../../../types.js').db_result_app_category_getAppCategoryAdmin[]}
 */
const getAppCategoryAdmin = (app_id, query) => service.getAppCategoryAdmin(app_id, getNumberValue(query.get('id')), query.get('lang_code'))
                                                .catch((/**@type{import('../../../types.js').error}*/error)=>{throw error;});
export{getAppCategoryAdmin};
