/** @module server/db/components */

/**@type{import('../sql/app_data_stat.service.js')} */
const service = await import(`file://${process.cwd()}/server/db/sql/app_data_stat.service.js`);

/**@type{import('../../server.service.js')} */
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {*} query
 * @returns {Promise.<import('../../../types.js').db_result_app_data_stat_get[]>}
 */
const get = (app_id, query) => service.get( app_id, 
                                            getNumberValue(query.get('id')),
                                            getNumberValue(query.get('data_app_id')), 
                                            query.get('resource_name_entity'),
                                            query.get('lang_code'))
                                            .catch((/**@type{import('../../../types.js').error}*/error)=>{throw error;});

export{get};