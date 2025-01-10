/** @module server/db/dbModelAppDataResourceMaster */

/**
 * @import {server_db_sql_result_app_data_resource_master_delete,server_db_sql_result_app_data_resource_master_update, 
 *          server_db_sql_result_app_data_resource_master_post, server_db_sql_result_app_data_resource_master_get} from '../types.js'
 */

/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**
 * @name get
 * @description Get master resource
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{user_null?:string|null,
 *                user_account_id?:number|null,
 *                data_app_id?:number|null,
 *                resource_name?:string|null,
 *                entity_id?:number|null}}} parameters
 * @returns {Promise.<server_db_sql_result_app_data_resource_master_get[]>}
 */
const get = parameters => {
  return import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
    dbCommonExecute(parameters.app_id, 
                    dbSql.APP_DATA_RESOURCE_MASTER_SELECT, 
                    {resource_id     : parameters.resource_id ?? null,
                      user_account_id     : serverUtilNumberValue(parameters.data.user_account_id),
                      user_account_app_id : serverUtilNumberValue(parameters.data.user_account_id)?serverUtilNumberValue(parameters.data.data_app_id):null,
                      data_app_id         : serverUtilNumberValue(parameters.data.data_app_id),
                      entity_id           : serverUtilNumberValue(parameters.data.entity_id),
                      resource_name       : parameters.data.resource_name,
                      user_null           : serverUtilNumberValue(parameters.data.user_null)?1:0
                      }, 
                    null, 
                    null));
};
/**
 * @name post
 * @description Create master resource
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          data:{json_data:{},
 *                user_account_id:number|null,
 *                user_account_app_id:number|null,
 *                data_app_id:number|null,
 *                app_data_entity_resource_app_data_entity_id:number|null,
 *                app_data_entity_resource_id:number}}} parameters
 * @returns {Promise.<server_db_sql_result_app_data_resource_master_post>}
 */
 const post = parameters => 
  import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
    dbCommonExecute(parameters.app_id, 
                    dbSql.APP_DATA_RESOURCE_MASTER_INSERT, 
                    {json_data                                   : JSON.stringify(parameters.data.json_data),
                      user_account_id                             : parameters.data.user_account_id ?? null,
                      user_account_app_id                         : parameters.data.user_account_id?parameters.data.user_account_app_id:null,
                      data_app_id                                 : parameters.data.data_app_id ?? null,
                      app_data_entity_resource_app_data_entity_id : parameters.data.app_data_entity_resource_app_data_entity_id ?? null,
                      app_data_entity_resource_id                 : parameters.data.app_data_entity_resource_id ?? null
                      }, 
                    null, 
                    null));
/**
 * @name update
 * @description Update master resource
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *        resource_id:number|null,
 *          data:{json_data:{},
 *                user_account_id:number|null,
 *                data_app_id:number|null,
 *                app_data_entity_resource_app_data_entity_id:number|null,
 *                app_data_entity_resource_id:number}}} parameters
 * @returns {Promise.<server_db_sql_result_app_data_resource_master_update>}
 */
 const update = parameters => 
  import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
    dbCommonExecute(parameters.app_id, 
                    dbSql.APP_DATA_RESOURCE_MASTER_UPDATE, 
                    {resource_id                                     : parameters.resource_id,
                      json_data                                       : JSON.stringify(parameters.data.json_data),
                      user_account_id                                 : parameters.data.user_account_id ?? null,
                      user_account_app_id                             : parameters.data.user_account_id?parameters.data.data_app_id:null,
                      data_app_id                                     : parameters.data.data_app_id ?? null,
                      app_data_entity_resource_app_data_entity_id     : parameters.data.app_data_entity_resource_app_data_entity_id ?? null,
                      app_data_entity_resource_id                     : parameters.data.app_data_entity_resource_id ?? null
                      }, 
                    null, 
                    null));
 /**
  * @name deleteRecord
  * @description Delete master resource
  * @function
  * @memberof ROUTE_REST_API
  * @param {{app_id:number,
  *          resource_id:number|null,
  *          data:{user_account_id:number,
  *                data_app_id:number|null}}} parameters
  * @returns {Promise.<server_db_sql_result_app_data_resource_master_delete>}
  */
  const deleteRecord = parameters => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
      dbCommonExecute(parameters.app_id, 
                      dbSql.APP_DATA_RESOURCE_MASTER_DELETE, 
                      {resource_id        : parameters.resource_id,
                        user_account_id    : parameters.data.user_account_id ?? null,
                        user_account_app_id: parameters.data.user_account_id?parameters.data.data_app_id:null,
                        data_app_id        : parameters.data.data_app_id ?? null}, 
                      null, 
                      null));
 
export {get, post, update, deleteRecord};