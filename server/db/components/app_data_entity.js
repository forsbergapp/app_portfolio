/** @module server/db/components/app_data_entity */

/**@type{import('../sql/app_data_entity.service.js')} */
const service = await import(`file://${process.cwd()}/server/db/sql/app_data_entity.service.js`);

/**@type{import('../sql/app_data_entity_resource.service.js')} */
const app_data_entity_resource = await import(`file://${process.cwd()}/server/db/sql/app_data_entity_resource.service.js`);


/**@type{import('../../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**
 * 
 * @param {number} app_id 
 * @param {number|null} resource_id
 * @param {*} query
 */
const getEntity = (app_id, resource_id, query) => service.get(  app_id, 
                                                                resource_id, 
                                                                serverUtilNumberValue(query.get('data_app_id')), 
                                                                query.get('lang_code'))
                                                    .catch((/**@type{import('../../types.js').server_server_error}*/error)=>{throw error;});

/**
 * 
 * @param {number} app_id 
 * @param {number|null} resource_id
 * @param {*} query
 */
const getEntityResource = (app_id, resource_id, query) => app_data_entity_resource.get( app_id, 
                                                                                        resource_id, 
                                                                                        serverUtilNumberValue(query.get('data_app_id')), 
                                                                                        query.get('resource_name'), 
                                                                                        serverUtilNumberValue(query.get('entity_id')), 
                                                                                        query.get('lang_code'))
                                                            .catch((/**@type{import('../../types.js').server_server_error}*/error)=>{throw error;});

export{getEntity, getEntityResource};
