/** @module server/db/dbModelAppDataResourceMaster */

/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**
 * Get master resource
 * @function
 * @param {number} app_id 
 * @param {number|null} resource_id
 * @param {*} query
 * @param {boolean|null} user_null
 * @returns {Promise.<import('../types.js').server_db_sql_result_app_data_resource_master_get[]>}
 */
const get = (app_id, resource_id, query, user_null=false) => 
  import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
    dbCommonExecute(app_id, 
                    dbSql.APP_DATA_RESOURCE_MASTER_SELECT, 
                    {resource_id     : resource_id ?? null,
                      user_account_id     : serverUtilNumberValue(query.get('user_account_id')),
                      user_account_app_id : serverUtilNumberValue(query.get('user_account_id'))?serverUtilNumberValue(query.get('data_app_id')):null,
                      data_app_id         : serverUtilNumberValue(query.get('data_app_id')),
                      entity_id           : serverUtilNumberValue(query.get('entity_id')),
                      resource_name       : query.get('resource_name'),
                      user_null           : user_null?1:0
                      }, 
                    null, 
                    null));

/**
 * Create master resource
 * @function
 * @param {number} app_id 
 * @param {*} data
 * @returns {Promise.<import('../types.js').server_db_sql_result_app_data_resource_master_post>}
 */
 const post = (app_id, data) => 
  import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
    dbCommonExecute(app_id, 
                    dbSql.APP_DATA_RESOURCE_MASTER_INSERT, 
                    {json_data                                   : JSON.stringify(data.json_data),
                      user_account_id                             : data.user_account_id ?? null,
                      user_account_app_id                         : data.user_account_id?data.user_account_app_id:null,
                      data_app_id                                 : data.data_app_id ?? null,
                      app_data_entity_resource_app_data_entity_id : data.app_data_entity_resource_app_data_entity_id ?? null,
                      app_data_entity_resource_id                 : data.app_data_entity_resource_id ?? null
                      }, 
                    null, 
                    null));
/**
 * Update master resource
 * @function
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} data
 * @returns {Promise.<import('../types.js').server_db_sql_result_app_data_resource_master_update>}
 */
 const update = (app_id, resource_id, data) => 
  import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
    dbCommonExecute(app_id, 
                    dbSql.APP_DATA_RESOURCE_MASTER_UPDATE, 
                    {resource_id                                     : resource_id,
                      json_data                                       : JSON.stringify(data.json_data),
                      user_account_id                                 : data.user_account_id ?? null,
                      user_account_app_id                             : data.user_account_id?data.data_app_id:null,
                      data_app_id                                     : data.data_app_id ?? null,
                      app_data_entity_resource_app_data_entity_id     : data.app_data_entity_resource_app_data_entity_id ?? null,
                      app_data_entity_resource_id                     : data.app_data_entity_resource_id ?? null
                      }, 
                    null, 
                    null));
 /**
 * Delete master resource
 * @function
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*}      data
 * @returns {Promise.<import('../types.js').server_db_sql_result_app_data_resource_master_delete>}
 */
  const deleteRecord = (app_id, resource_id, data) => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
      dbCommonExecute(app_id, 
                      dbSql.APP_DATA_RESOURCE_MASTER_DELETE, 
                      {resource_id        : resource_id,
                        user_account_id    : data.user_account_id ?? null,
                        user_account_app_id: data.user_account_id?data.data_app_id:null,
                        data_app_id        : data.data_app_id ?? null}, 
                      null, 
                      null));
 
export {get, post, update, deleteRecord};