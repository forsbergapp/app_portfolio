/** @module server/db/components */

/**@type{import('../sql/app_data_entity.service.js')} */
const service = await import(`file://${process.cwd()}/server/db/sql/app_data_entity.service.js`);

/**@type{import('../sql/app_data_entity_resource.service.js')} */
const app_data_entity_resource = await import(`file://${process.cwd()}/server/db/sql/app_data_entity_resource.service.js`);


/**@type{import('../../server.service.js')} */
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {number|null} resource_id
 * @param {*} query
 * @returns {Promise.<import('../../../types.js').db_result_app_data_entity_get[]>}
 */
const getEntity = (app_id, resource_id, query) => service.get(  app_id, 
                                                                resource_id, 
                                                                getNumberValue(query.get('data_app_id')), 
                                                                query.get('lang_code'))
                                                    .catch((/**@type{import('../../../types.js').error}*/error)=>{throw error;});

/**
 * 
 * @param {number} app_id 
 * @param {number|null} resource_id
 * @param {*} query
 * @returns {Promise.<import('../../../types.js').db_result_app_data_entity_resource_get[]>}
 */
const getEntityResource = (app_id, resource_id, query) => app_data_entity_resource.get( app_id, 
                                                                                        resource_id, 
                                                                                        getNumberValue(query.get('data_app_id')), 
                                                                                        query.get('resource_name'), 
                                                                                        getNumberValue(query.get('entity_id')), 
                                                                                        query.get('lang_code'))
                                                            .catch((/**@type{import('../../../types.js').error}*/error)=>{throw error;});

export{getEntity, getEntityResource};
