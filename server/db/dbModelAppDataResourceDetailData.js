/** @module server/db/dbModelAppDataResourceDetailData */

/**
 * @import {server_db_sql_result_app_data_resource_detail_data_delete, server_db_sql_result_app_data_resource_detail_data_update, 
 *          server_db_sql_result_app_data_resource_detail_data_post, server_db_sql_result_app_data_resource_detail_data_get} from '../types.js'
 */

/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

 /**
 * Get detail data resource
 * @function
 * @param {number} app_id 
 * @param {number|null} resource_id
 * @param {*} query
 * @param {boolean|null} user_null
 * @returns {Promise.<server_db_sql_result_app_data_resource_detail_data_get[]>}
 */
const get = (app_id, resource_id, query, user_null=false) => 
  import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
    dbCommonExecute(app_id, 
                    dbSql.APP_DATA_RESOURCE_DETAIL_DATA_SELECT, 
                    {resource_id                               : resource_id ?? null,
                      resource_app_data_detail_id               : serverUtilNumberValue(query.get('app_data_detail_id')),
                      user_account_id                           : serverUtilNumberValue(query.get('user_account_id')) ?? null,
                      user_account_app_id                       : serverUtilNumberValue(query.get('user_account_id'))?serverUtilNumberValue(query.get('data_app_id')):null,
                      data_app_id                               : serverUtilNumberValue(query.get('data_app_id')),
                      resource_name_type                        : query.get('resource_name_type'),
                      resource_name_value                       : query.get('resource_name'),
                      resource_name_master_attribute_type       : query.get('resource_name_master_attribute_type'),
                      resource_name_master_attribute_value      : query.get('resource_name_master_attribute'),
                      resource_name_data_master_attribute_type  : query.get('resource_name_data_master_attribute_type'),
                      resource_name_data_master_attribute_value : query.get('resource_name_data_master_attribute'),
                      entity_id                                 : serverUtilNumberValue(query.get('entity_id')) ?? null,
                      user_null                                 : user_null?1:0
                      }, 
                    null, 
                    null));
/**
 * Create detail data resource
 * @function
 * @param {number} app_id 
 * @param {*}      data
 * @returns {Promise.<server_db_sql_result_app_data_resource_detail_data_post>}
 */
const post = (app_id, data) => 
  import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
    dbCommonExecute(app_id, 
                    dbSql.APP_DATA_RESOURCE_DETAIL_DATA_INSERT, 
                    {json_data                               : JSON.stringify(data.json_data),
                      user_account_id                         : data.user_account_id ?? null,
                      user_account_app_id                     : data.user_account_id?data.data_app_id:null,
                      data_app_id                             : data.data_app_id ?? null,
                      app_data_resource_detail_id             : data.app_data_resource_detail_id ?? null,
                      app_data_resource_master_attribute_id   : data.app_data_resource_master_attribute_id ?? null
                      }, 
                    null, 
                    null));

/**
 * Update detail data resource
 * @function
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*}      data
 * @returns {Promise.<server_db_sql_result_app_data_resource_detail_data_update>}
 */
 const update = (app_id, resource_id, data) => 
  import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
    dbCommonExecute(app_id, 
                    dbSql.APP_DATA_RESOURCE_DETAIL_DATA_UPDATE, 
                    {resource_id:                             resource_id,
                      json_data                               :JSON.stringify(data.json_data),
                      user_account_id                         :data.user_account_id ?? null,
                      user_account_app_id                     :data.user_account_id?data.data_app_id:null,
                      data_app_id                             :data.data_app_id ?? null,
                      app_data_resource_detail_id             :data.app_data_resource_detail_id ?? null,
                      app_data_resource_master_attribute_id   :data.app_data_resource_master_attribute_id ?? null
                      }, 
                    null, 
                    null));

/**
 * Delete detail data resource
 * @function
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*}      data
 * @returns {Promise.<server_db_sql_result_app_data_resource_detail_data_delete>}
 */
const deleteRecord = (app_id, resource_id, data) => 
  import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
    dbCommonExecute(app_id, 
                    dbSql.APP_DATA_RESOURCE_DETAIL_DATA_DELETE, 
                    {resource_id         : resource_id,
                      user_account_id     : data.user_account_id ?? null,
                      user_account_app_id : data.user_account_id?data.data_app_id:null,
                      data_app_id         : data.data_app_id ?? null},
                    null, 
                    null));

export{ get,  post, update, deleteRecord};