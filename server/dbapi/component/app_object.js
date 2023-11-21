/** @module server/dbapi/component/app_object */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const service = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_object.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @returns 
 */
const getObjects = (app_id, query) => service.getObjects(app_id, query.get('data_lang_code'), query.get('object') ?? null, query.get('object_name') ?? null);
export {getObjects};