/** @module server/db/dbModelUserAccountApp */

/**
 * @import {server_server_response,
 *          server_db_sql_result_user_account_app_getUserAccountApps,
 *          server_config_apps_with_db_columns,
 *          server_db_sql_result_user_account_app_getUserAccountApp,
 *          server_db_common_result_delete,
 *          server_db_common_result_update,
 *          server_db_common_result_insert} from '../types.js'
 */
/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**
 * @name get
 * @description Get user account app
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{data_app_id:number}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_sql_result_user_account_app_getUserAccountApp[] }>}
 */
const get = async parameters =>
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
       dbCommonExecute(parameters.app_id, 
                       dbSql.USER_ACCOUNT_APP_SELECT_USER_APP,
                       {
                           user_account_id: parameters.resource_id,
                           app_id: parameters.data.data_app_id
                       }));

/**
 * @name getApps
 * @description Get user account app apps
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          locale:string}} parameters
 * @returns {Promise.<server_server_response & {result?:server_config_apps_with_db_columns[] }>}
 */
const getApps = async parameters => {

   /**@type{import('../../apps/common/src/common.js')} */
   const {commonAppsGet} = await import(`file://${process.cwd()}/apps/common/src/common.js`);
   
   /**@type{server_server_response & {result?:server_db_sql_result_user_account_app_getUserAccountApps[] }} */
   const apps_db = await import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
       dbCommonExecute(parameters.app_id, 
                       dbSql.USER_ACCOUNT_APP_SELECT_USER_APPS,
                       {
                           user_account_id: parameters.resource_id
                        }));

    if (apps_db.result)
        return {result:(await commonAppsGet({app_id:parameters.app_id, resource_id:parameters.app_id, locale:parameters.locale})).result
                    .filter((/**@type{server_config_apps_with_db_columns}*/app)=>app.app_id == apps_db.result
                                                    .filter((/**@type{server_db_sql_result_user_account_app_getUserAccountApps}*/app_db)=>app_db.app_id==app.app_id)[0].app_id), 
                type:'JSON'};
    else
        return apps_db;
};

/**
 * @name post
 * @description Create user account app record
 * @function
 * @param {number} app_id  
 * @param {{data_app_id:number,
 *          user_account_id:number}} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async (app_id, data) => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(app_id, 
                        dbSql.USER_ACCOUNT_APP_INSERT, 
                        {
                            app_id:             data.data_app_id,
                            user_account_id:    data.user_account_id
                        }));
/**
 * @name update
 * @description Update user account app
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{  data_app_id:number,
 *                  json_data:string}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
 */
const update = parameters =>
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(parameters.app_id, 
                        dbSql.USER_ACCOUNT_APP_UPDATE, 
                        {
                            json_data:JSON.stringify(parameters.data.json_data),
                            user_account_id: parameters.resource_id,
                            app_id: parameters.data.data_app_id
                        }));

/**
 * @name deleteRecord
 * @description Delete record
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{data_app_id:number}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_delete }>}
 */
const deleteRecord = parameters => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(parameters.app_id, 
                        dbSql.USER_ACCOUNT_APP_DELETE,
                        {
                            user_account_id: parameters.resource_id,
                            app_id: serverUtilNumberValue(parameters.data?.data_app_id)
                        }));

export {get, getApps, post,update, deleteRecord};