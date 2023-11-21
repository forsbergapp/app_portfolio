/** @module server/dbapi/component/parameter_type */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const service = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/parameter_type.service.js`);
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @returns 
 */
const getParameterTypeAdmin = (app_id, query) => service.getParameterTypeAdmin(app_id, getNumberValue(query.get('id')), query.get('lang_code'));
    
export{getParameterTypeAdmin};