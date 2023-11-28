/** @module server/dbapi/object/app_role */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const service = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_role.service.js`);
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 */
const getAppRoleAdmin = (app_id, query) => service.getAppRoleAdmin(app_id, getNumberValue(query.get('id')))
                                                .catch((/**@type{Types.error}*/error)=>{throw error;});

export{getAppRoleAdmin};