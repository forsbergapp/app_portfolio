/** @module server/db/components/app_role */

/**@type{import('../sql/app_role.service.js')} */
const service = await import(`file://${process.cwd()}/server/db/sql/app_role.service.js`);

/**@type{import('../../server.service.js')} */
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 */
const getAppRoleAdmin = (app_id, query) => service.getAppRoleAdmin(app_id, getNumberValue(query.get('id')))
                                                .catch((/**@type{import('../../types.js').server_server_error}*/error)=>{throw error;});

export{getAppRoleAdmin};