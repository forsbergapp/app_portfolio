/** @module server/db/dbModelAppDataEntity */

/**
 * @import {server_db_sql_result_app_data_entity_get} from '../types.js'
 */

/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**
 * Get Entity
 * @function
 * @param {number} app_id 
 * @param {number|null} resource_id
 * @param {*} query
 * @returns {Promise.<server_db_sql_result_app_data_entity_get[]>}
 */
const get = (app_id, resource_id, query) => import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
                                                    dbCommonExecute(app_id, 
                                                                    dbSql.APP_DATA_ENTITY_SELECT, 
                                                                    {   resource_id: resource_id,
                                                                        data_app_id : serverUtilNumberValue(query.get('data_app_id'))}, 
                                                                    null, 
                                                                    null));
export{get};