/** @module server/dbapi/object/app_category */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const service = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_category.service.js`);
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {*} query
 * @returns {Types.db_result_app_category_getAppCategoryAdmin[]}
 */
const getAppCategoryAdmin = (app_id, query) => service.getAppCategoryAdmin(app_id, getNumberValue(query.get('id')), query.get('lang_code'));
export{getAppCategoryAdmin};
