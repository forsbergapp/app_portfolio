/** @module server/db/dbModelUserAccountApp */

/**
 * @import {server_db_sql_result_user_account_app_deleteUserAccountApp,
 *          server_db_sql_result_user_account_app_getUserAccountApps,
 *          server_config_apps_with_db_columns,
 *          server_db_sql_result_user_account_app_getUserAccountApp,
 *          server_db_sql_result_user_account_app_updateUserAccountApp,
 *          server_db_sql_parameter_user_account_app_updateUserAccountApp,
 *          server_db_sql_result_user_account_app_createUserAccountApp} from '../types.js'
 */
/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**
 * @name post
 * @description Create user account app record
 * @function
 * @param {number} app_id 
 * @param {number} user_account_id 
 * @returns {Promise.<server_db_sql_result_user_account_app_createUserAccountApp>}
 */
const post = async (app_id, user_account_id) => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(app_id, 
                        dbSql.USER_ACCOUNT_APP_INSERT, 
                        {
                            app_id: app_id,
                            user_account_id: user_account_id
                        }, 
                        null, 
                        null));
/**
 * @name update
 * @description Update user account app
 * @function
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{  preference_locale:string,
 *                  app_setting_preference_timezone_id:number,
 *                  app_setting_preference_direction_id:number|null,
 *                  app_setting_preference_arabic_script_id:number|null}}} parameters
 * @returns {Promise.<server_db_sql_result_user_account_app_updateUserAccountApp>}
 */
const update = parameters =>
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(parameters.app_id, 
                        dbSql.USER_ACCOUNT_APP_UPDATE, 
                        {
                            preference_locale: parameters.data.preference_locale,
                            app_setting_preference_timezone_id: serverUtilNumberValue(parameters.data?.app_setting_preference_timezone_id),
                            app_setting_preference_direction_id: serverUtilNumberValue(parameters.data?.app_setting_preference_direction_id),
                            app_setting_preference_arabic_script_id: serverUtilNumberValue(parameters.data?.app_setting_preference_arabic_script_id),
                            user_account_id: parameters.resource_id,
                            app_id: parameters.app_id
                            }, 
                        null, 
                        null));
/**
 * @name get
 * @description Get user account app
 * @function
 * @param {{app_id:number,
 *          resource_id:number|null}} parameters
 * @returns {Promise.<server_db_sql_result_user_account_app_getUserAccountApp[]>}
 */
const get = parameters => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(parameters.app_id, 
                        dbSql.USER_ACCOUNT_APP_SELECT_USER_APP,
                        {
                            user_account_id: parameters.resource_id,
                            app_id: parameters.app_id
                        },
                        null, 
                        null));

/**
 * @name getApps
 * @description Get user account app apps
 * @function
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          locale:string}} parameters
 * @returns {Promise.<server_config_apps_with_db_columns[]>}
 */
const getApps = async parameters => {

    /**@type{import('../../apps/common/src/common.js')} */
    const {commonAppsGet} = await import(`file://${process.cwd()}/apps/common/src/common.js`);
    
    /**@type{server_db_sql_result_user_account_app_getUserAccountApps[]} */
    const apps_db = await import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(parameters.app_id, 
                        dbSql.USER_ACCOUNT_APP_SELECT_USER_APPS,
                        {
                            user_account_id: parameters.resource_id
                            },
                        null, 
                        null));


    return (await commonAppsGet({app_id:parameters.app_id, resource_id:parameters.app_id, locale:parameters.locale})).filter(app=>app.app_id == apps_db.filter(app_db=>app_db.app_id==app.app_id)[0].app_id);
};

/**
 * @name deleteRecord
 * @description Delete record
 * @function
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{delete_app_id:number}}} parameters
 * @returns {Promise.<server_db_sql_result_user_account_app_deleteUserAccountApp>}
 */
const deleteRecord = parameters => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(parameters.app_id, 
                        dbSql.USER_ACCOUNT_APP_DELETE,
                        {
                            user_account_id: parameters.resource_id,
                            app_id: serverUtilNumberValue(parameters.data?.delete_app_id)
                        },
                        null, 
                        null));

export {post,update, get, getApps, deleteRecord};