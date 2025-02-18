/** @module server/db/dbModelAppDataResourceDetailData */

/**
 * @import {server_server_response,
 *          server_db_common_result_insert,server_db_common_result_update,server_db_common_result_delete,
 *          server_db_app_setting, server_db_sql_result_app_data_resource_detail_data_get} from '../types.js'
 */

/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**
 * @name get
 * @description Get detail data resource
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{user_null?:string|null,
 *                app_data_detail_id?:number|null,
 *                user_account_id?:number|null,
 *                data_app_id?:number|null,
 *                resource_name_type?:string|null,
 *                resource_name?:string|null,
 *                resource_name_master_attribute_type?:string|null,
 *                resource_name_master_attribute?:string|null,
 *                resource_name_data_master_attribute_type?:string|null,
 *                resource_name_data_master_attribute?:string|null,
 *                entity_id?:number|null
 *                }}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_sql_result_app_data_resource_detail_data_get[] }>}
 */
const get = async parameters =>{
  /**@type{import('./fileModelAppSetting.js')} */
  const fileModelAppSetting = await import(`file://${process.cwd()}/server/db/fileModelAppSetting.js`);
  /**@type{server_db_app_setting[]}*/
  const app_setting = fileModelAppSetting.getServer({ app_id:parameters.app_id, resource_id:null, data:{value:parameters.data?.resource_name??''}}).result;
  /**@type{server_db_app_setting[]}*/
  const app_setting_master = fileModelAppSetting.getServer({  app_id:parameters.app_id, 
                                                        resource_id:null, 
                                                        data:{name:parameters.data?.resource_name_master_attribute_type??'', 
                                                              value:parameters.data?.resource_name_master_attribute??''}}).result;
  /**@type{server_db_app_setting[]}*/
  const app_setting_master_attribute = fileModelAppSetting.getServer({  app_id:parameters.app_id, 
                                                        resource_id:null, 
                                                        data:{name:parameters.data?.resource_name_data_master_attribute_type??'', 
                                                              value:parameters.data?.resource_name_data_master_attribute??''}}).result;
  return import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
    dbCommonExecute(parameters.app_id, 
                    dbSql.APP_DATA_RESOURCE_DETAIL_DATA_SELECT, 
                    {resource_id                               : parameters.resource_id ?? null,
                      resource_app_data_detail_id               : serverUtilNumberValue(parameters.data.app_data_detail_id),
                      user_account_id                           : serverUtilNumberValue(parameters.data.user_account_id),
                      user_account_app_id                       : serverUtilNumberValue(parameters.data.user_account_id)?serverUtilNumberValue(parameters.data.data_app_id):null,
                      data_app_id                               : serverUtilNumberValue(parameters.data.data_app_id),
                      entity_id                                 : serverUtilNumberValue(parameters.data.entity_id) ?? null,
                      user_null                                 : serverUtilNumberValue(parameters.data.user_null)?1:0
                      })
                    .then(result=>result.http?result:
                      {result:result.result
                        .filter((/**@type{server_db_sql_result_app_data_resource_detail_data_get}*/row)=>
                          row.app_setting_id == app_setting.filter(row_app_setting=> 
                                                  row_app_setting.app_id == row.app_data_detail_app_data_entity_resource_app_data_entity_app_id )[0]?.id &&
                          row.app_data_resource_master_app_setting_id == (app_setting_master.filter(row_app_setting=> 
                                                    row_app_setting.app_id == row.app_data_resource_master_attribute_app_data_entity_resource_app_data_entity_app_id )[0]?.id ??null) &&
                          row.as_attribute_master_app_setting_id == (app_setting_master_attribute.filter(row_app_setting=> 
                                                                      row_app_setting.app_id == row.app_data_resource_master_attribute_app_data_entity_resource_app_data_entity_app_id )[0]?.id ??null)
                        )
                        .map((/**@type{server_db_sql_result_app_data_resource_detail_data_get}*/row)=>{
                            //update entity resource app setting
                            /**@ts-ignore */
                            row.app_setting_name =                                app_setting.filter(row_app_setting=>row_app_setting.id == row.app_setting_id)[0].name;
                            row.app_setting_value =                               app_setting.filter(row_app_setting=>row_app_setting.id == row.app_setting_id)[0].value;
                            row.app_setting_display_data =                        app_setting.filter(row_app_setting=>row_app_setting.id == row.app_setting_id)[0].display_data;
                            //update master entity resource app setting 
                            if (row.app_data_resource_master_app_setting_id){
                              /**@ts-ignore */
                              row.app_data_resource_master_app_setting_name =     app_setting_master.filter(row_app_setting=>row_app_setting.id == row.app_data_resource_master_app_setting_id)[0].name;
                              row.app_data_resource_master_app_setting_value =    app_setting_master.filter(row_app_setting=>row_app_setting.id == row.app_data_resource_master_app_setting_id)[0].value;
                              row.app_setting_attribute_display_data =            app_setting_master.filter(row_app_setting=>row_app_setting.id == row.app_data_resource_master_app_setting_id)[0].display_data;
                            }
                            //update optional attribute master entity resource app setting 
                            if  (row.as_attribute_master_app_setting_id){
                              /**@ts-ignore */
                              row.as_attribute_master_app_setting_name =          app_setting_master_attribute.filter(row_app_setting=>row_app_setting.id == row.as_attribute_master_app_setting_id)[0].name;
                              row.as_attribute_master_app_setting_value =         app_setting_master_attribute.filter(row_app_setting=>row_app_setting.id == row.as_attribute_master_app_setting_id)[0].value;
                              row.as_attribute_master_app_setting_display_data =  app_setting_master_attribute.filter(row_app_setting=>row_app_setting.id == row.as_attribute_master_app_setting_id)[0].display_data;
                            }
                            return row;
                        }),
                      type:'JSON'}));
};
/**
 * @name post
 * @description Create detail data resource
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          data:{json_data:{},
 *                user_account_id:number|null,
 *                data_app_id:number|null,
 *                app_data_resource_detail_id:number|null,
 *                app_data_resource_master_attribute_id:number|null
 *                }}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = parameters => 
  import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
    dbCommonExecute(parameters.app_id, 
                    dbSql.APP_DATA_RESOURCE_DETAIL_DATA_INSERT, 
                    {json_data                               : JSON.stringify(parameters.data.json_data),
                      user_account_id                         : parameters.data.user_account_id ?? null,
                      user_account_app_id                     : parameters.data.user_account_id?parameters.data.data_app_id:null,
                      data_app_id                             : parameters.data.data_app_id ?? null,
                      app_data_resource_detail_id             : parameters.data.app_data_resource_detail_id ?? null,
                      app_data_resource_master_attribute_id   : parameters.data.app_data_resource_master_attribute_id ?? null
                      }));

/**
 * @name update
 * @description Update detail data resource
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number
 *          data:{json_data:{},
 *                user_account_id:number|null,
 *                data_app_id:number|null,
 *                app_data_resource_detail_id:number|null,
 *                app_data_resource_master_attribute_id:number|null
 *                }}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
 */
const update = parameters => 
  import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
    dbCommonExecute(parameters.app_id, 
                    dbSql.APP_DATA_RESOURCE_DETAIL_DATA_UPDATE, 
                    {resource_id:                             parameters.resource_id,
                      json_data                               :JSON.stringify(parameters.data.json_data),
                      user_account_id                         :parameters.data.user_account_id ?? null,
                      user_account_app_id                     :parameters.data.user_account_id?parameters.data.data_app_id:null,
                      data_app_id                             :parameters.data.data_app_id ?? null,
                      app_data_resource_detail_id             :parameters.data.app_data_resource_detail_id ?? null,
                      app_data_resource_master_attribute_id   :parameters.data.app_data_resource_master_attribute_id ?? null
                      }));

/**
 * @name deleteRecord
 * @description Delete detail data resource
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number
 *          data:{user_account_id:number|null,
 *                data_app_id:number|null
 *                }}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_delete }>}
 */
const deleteRecord = parameters => 
  import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
    dbCommonExecute(parameters.app_id, 
                    dbSql.APP_DATA_RESOURCE_DETAIL_DATA_DELETE, 
                    { resource_id         : parameters.resource_id,
                      user_account_id     : parameters.data.user_account_id ?? null,
                      user_account_app_id : parameters.data.user_account_id?parameters.data.data_app_id:null,
                      data_app_id         : parameters.data.data_app_id ?? null}));

export{ get,  post, update, deleteRecord};