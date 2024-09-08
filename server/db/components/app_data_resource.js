/** @module server/db/components/app_data_resource */

/**@type{import('../sql/app_data_resource_master.service.js')} */
const app_data_resource_master = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_master.service.js`);
/**@type{import('../sql/app_data_resource_detail.service.js')} */
const app_data_resource_detail = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_detail.service.js`);
/**@type{import('../sql/app_data_resource_detail_data.service.js')} */
const app_data_resource_detail_data = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_detail_data.service.js`);

/**@type{import('../../server.service.js')} */
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {number|null} resource_id
 * @param {*} query
 * @param {boolean|null} user_null
 */
const MasterGet = (app_id, resource_id, query, user_null=false) => app_data_resource_master.get(app_id, 
                                                                  resource_id, 
                                                                  getNumberValue(query.get('user_account_id')),
                                                                  getNumberValue(query.get('data_app_id')), 
                                                                  query.get('resource_name'),
                                                                  getNumberValue(query.get('entity_id')),
                                                                  query.get('lang_code'),
                                                                  user_null)
                                                .catch((/**@type{import('../../../types.js').server_server_error}*/error)=>{throw error;});

/**
 * 
 * @param {number} app_id 
 * @param {*} data
 */
 const MasterPost = (app_id, data) => app_data_resource_master.post(app_id, data).catch((/**@type{import('../../../types.js').server_server_error}*/error)=>{throw error;});
/**
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} data
 */
 const MasterUpdate = (app_id, resource_id, data) => app_data_resource_master.update(app_id, resource_id, data).catch((/**@type{import('../../../types.js').server_server_error}*/error)=>{throw error;});

 /**
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*}      data
 */
  const MasterDelete = (app_id, resource_id, data) => app_data_resource_master.deleteRecord(app_id, resource_id, data).catch((/**@type{import('../../../types.js').server_server_error}*/error)=>{throw error;});
 
/**
 * 
 * @param {number} app_id 
 * @param {number|null} resource_id
 * @param {*} query
 * @param {boolean|null} user_null
 */
 const DetailGet = (app_id, resource_id, query, user_null=false) => app_data_resource_detail.get( app_id, 
                                                                                                  resource_id, 
                                                                                                  getNumberValue(query.get('master_id')), 
                                                                                                  getNumberValue(query.get('user_account_id')),
                                                                                                  getNumberValue(query.get('data_app_id')), 
                                                                                                  query.get('resource_name'),
                                                                                                  getNumberValue(query.get('entity_id')),
                                                                                                  query.get('lang_code'),
                                                                                                  user_null)
                                                                      .catch((/**@type{import('../../../types.js').server_server_error}*/error)=>{throw error;});

/**
 * 
 * @param {number} app_id 
 * @param {*} data
 */
 const DetailPost = (app_id, data) => app_data_resource_detail.post(app_id, data).catch((/**@type{import('../../../types.js').server_server_error}*/error)=>{throw error;});

/**
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} data
 */
 const DetailUpdate = (app_id, resource_id, data) => app_data_resource_detail.update(app_id, resource_id, data).catch((/**@type{import('../../../types.js').server_server_error}*/error)=>{throw error;});

/**
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} data
 */
 const DetailDelete = (app_id, resource_id, data) => app_data_resource_detail.deleteRecord(app_id, resource_id, data).catch((/**@type{import('../../../types.js').server_server_error}*/error)=>{throw error;});

 /**
 * 
 * @param {number} app_id 
 * @param {number|null} resource_id
 * @param {*} query
 * @param {boolean|null} user_null
 */
const DataGet = (app_id, resource_id, query, user_null=false) => app_data_resource_detail_data.get( app_id, 
                                                                                                    resource_id, 
                                                                                                    getNumberValue(query.get('app_data_detail_id')),
                                                                                                    getNumberValue(query.get('user_account_id')),
                                                                                                    getNumberValue(query.get('data_app_id')), 
                                                                                                    query.get('resource_name_type'),
                                                                                                    query.get('resource_name'),
                                                                                                    query.get('resource_name_master_attribute_type'),
                                                                                                    query.get('resource_name_master_attribute'),
                                                                                                    query.get('resource_name_data_master_attribute_type'),
                                                                                                    query.get('resource_name_data_master_attribute'),
                                                                                                    getNumberValue(query.get('entity_id')),
                                                                                                    query.get('lang_code'),
                                                                                                    user_null)
                                                                  .catch((/**@type{import('../../../types.js').server_server_error}*/error)=>{throw error;});

/**
 * 
 * @param {number} app_id 
 * @param {*}      data
 */
const DataPost = (app_id, data) => app_data_resource_detail_data.post(app_id, data).catch((/**@type{import('../../../types.js').server_server_error}*/error)=>{throw error;});

/**
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*}      data
 */
 const DataUpdate = (app_id, resource_id, data) => app_data_resource_detail_data.update(app_id, resource_id, data).catch((/**@type{import('../../../types.js').server_server_error}*/error)=>{throw error;});

/**
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*}      data
 */
const DataDelete = (app_id, resource_id, data) => app_data_resource_detail_data.deleteRecord(app_id, resource_id, data).catch((/**@type{import('../../../types.js').server_server_error}*/error)=>{throw error;});

export{ MasterGet,  MasterPost, MasterUpdate,   MasterDelete,
        DetailGet,  DetailPost, DetailUpdate,   DetailDelete,
        DataGet,    DataPost,   DataUpdate,     DataDelete};