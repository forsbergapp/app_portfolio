/** @module server/db/dbModelAppDataResourceDetailData */

/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

 /**
 * 
 * @param {number} app_id 
 * @param {number|null} resource_id
 * @param {*} query
 * @param {boolean|null} user_null
 * @returns {Promise.<import('../types.js').server_db_sql_result_app_data_resource_detail_data_get[]>}
 */
const DataGet = (app_id, resource_id, query, user_null=false) => 
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
 * 
 * @param {number} app_id 
 * @param {*}      data
 * @returns {Promise.<import('../types.js').server_db_sql_result_app_data_resource_detail_data_post>}
 */
const DataPost = (app_id, data) => 
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
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*}      data
 * @returns {Promise.<import('../types.js').server_db_sql_result_app_data_resource_detail_data_update>}
 */
 const DataUpdate = (app_id, resource_id, data) => 
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
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*}      data
 * @returns {Promise.<import('../types.js').server_db_sql_result_app_data_resource_detail_data_delete>}
 */
const DataDelete = (app_id, resource_id, data) => 
  import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
    dbCommonExecute(app_id, 
                    dbSql.APP_DATA_RESOURCE_DETAIL_DATA_DELETE, 
                    {resource_id         : resource_id,
                      user_account_id     : data.user_account_id ?? null,
                      user_account_app_id : data.user_account_id?data.data_app_id:null,
                      data_app_id         : data.data_app_id ?? null},
                    null, 
                    null));

export{ DataGet,    DataPost,   DataUpdate,     DataDelete};