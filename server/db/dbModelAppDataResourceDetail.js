/** @module server/db/dbModelAppDataResourceDetail */


/**
 * @import {server_db_sql_result_app_data_resource_detail_delete, server_db_sql_result_app_data_resource_detail_update, 
 *          server_db_sql_result_app_data_resource_detail_post, server_db_sql_result_app_data_resource_detail_get} from '../types.js'
 */

/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**
 * Get detail resource
 * @function
 * @param {number} app_id 
 * @param {number|null} resource_id
 * @param {*} query
 * @param {boolean|null} user_null
 * @returns {Promise.<server_db_sql_result_app_data_resource_detail_get[]>}
 */
 const get = (app_id, resource_id, query, user_null=false) => 
  import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
    dbCommonExecute(app_id, 
                    dbSql.APP_DATA_RESOURCE_DETAIL_SELECT, 
                    {resource_id         : resource_id ?? null,
                      master_id           : serverUtilNumberValue(query.get('master_id')),
                      user_account_id     : serverUtilNumberValue(query.get('user_account_id')) ?? null,
                      user_account_app_id : serverUtilNumberValue(query.get('user_account_id'))?serverUtilNumberValue(query.get('data_app_id')):null,
                      data_app_id         : serverUtilNumberValue(query.get('data_app_id')),
                      resource_name       : query.get('resource_name'),
                      entity_id           : serverUtilNumberValue(query.get('entity_id')) ?? null,
                      user_null           : user_null?1:0
                      }, 
                    null, 
                    null));
/**
 * Create detail resource
 * @function
 * @param {number} app_id 
 * @param {*} data
 * @returns {Promise.<server_db_sql_result_app_data_resource_detail_post>}
 */
 const post = (app_id, data) => 
  import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
    dbCommonExecute(app_id, 
                    dbSql.APP_DATA_RESOURCE_DETAIL_INSERT, 
                    {json_data                                       : JSON.stringify(data.json_data),
                      app_data_resource_master_id                     : data.app_data_resource_master_id ?? null,
                      app_data_entity_resource_id                     : data.app_data_entity_resource_id ?? null,
                      user_account_id                                 : data.user_account_id ?? null,
                      user_account_app_id                             : data.user_account_id?data.data_app_id:null,
                      data_app_id                                     : data.data_app_id ?? null,
                      app_data_entity_resource_app_data_entity_id     : data.app_data_entity_resource_app_data_entity_id ?? null,
                      app_data_resource_master_attribute_id           : data.app_data_resource_master_attribute_id ?? null,
                      }, 
                    null, 
                    null));

/**
 * Update detail resource
 * @function
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} data
 * @returns {Promise.<server_db_sql_result_app_data_resource_detail_update>}
 */
 const update = (app_id, resource_id, data) => 
  import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
    dbCommonExecute(app_id, 
                    dbSql.APP_DATA_RESOURCE_DETAIL_UPDATE, 
                    {resource_id:                                resource_id,
                      json_data:                                  JSON.stringify(data.json_data),
                      app_data_resource_master_id                 :data.app_data_resource_master_id ?? null, 
                      app_data_entity_resource_id                 :data.app_data_entity_resource_id ?? null, 
                      user_account_id                             :data.user_account_id ?? null,
                      user_account_app_id                         :data.user_account_id?data.data_app_id:null,
                      data_app_id                                 :data.data_app_id ?? null, 
                      app_data_entity_resource_app_data_entity_id :data.app_data_entity_resource_app_data_entity_id ?? null,
                      app_data_resource_master_attribute_id       :data.app_data_resource_master_attribute_id ?? null
                      }, 
                    null, 
                    null));
/**
 * Delete resource detail
 * @function
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} data
 * @returns {Promise.<server_db_sql_result_app_data_resource_detail_delete>}
 */
 const deleteRecord = (app_id, resource_id, data) => 
  import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
    dbCommonExecute(app_id, 
                    dbSql.APP_DATA_RESOURCE_DETAIL_DELETE, 
                    {resource_id         :resource_id,
                      user_account_id     :data.user_account_id ?? null,
                      user_account_app_id :data.user_account_id?data.data_app_id:null,
                      data_app_id         :data.data_app_id ?? null}, 
                    null, 
                    null));
export{get, post, update, deleteRecord};