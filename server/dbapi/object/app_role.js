/** @module server/dbapi/object/app_role */

/**@type{import('../../dbapi/sql/app_role.service.js')} */
const service = await import(`file://${process.cwd()}/server/dbapi/sql/app_role.service.js`);

/**@type{import('../../server.service.js')} */
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 */
const getAppRoleAdmin = (app_id, query) => service.getAppRoleAdmin(app_id, getNumberValue(query.get('id')))
                                                .catch((/**@type{import('../../../types.js').error}*/error)=>{throw error;});

export{getAppRoleAdmin};