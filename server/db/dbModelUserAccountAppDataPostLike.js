/** @module server/db/dbModelUserAccountAppDataPostLike */

/**
 * @import {server_server_response,
 *          server_db_common_result_delete,
 *          server_db_common_result_insert} from '../types.js'
 * @typedef {server_server_response & {result?:server_db_common_result_insert }} post
 * @typedef {server_server_response & {result?:server_db_common_result_delete }} deleteRecord
 */

/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**
 * @name post
 * @description Like
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:Number,
 *          resource_id:number,
 *          data:{user_account_app_data_post_id:number|null}}} parameters
 * @returns {Promise.<post>}
 */
const post = parameters => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(parameters.app_id, 
                        dbSql.USER_ACCOUNT_APP_DATA_POST_LIKE_INSERT, 
                        {
                            user_account_id: parameters.resource_id,
                            user_account_app_data_post_id: serverUtilNumberValue(parameters.data.user_account_app_data_post_id),
                            app_id: parameters.app_id
                        },
                        null, 
                        null));
/**
 * @name deleteRecord
 * @description Unlike
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:Number,
 *          resource_id:number,
 *          data:{user_account_app_data_post_id:number|null}}} parameters
 * @returns {Promise.<deleteRecord>}
 */
const deleteRecord = parameters => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(parameters.app_id, 
                        dbSql.USER_ACCOUNT_APP_DATA_POST_LIKE_DELETE, 
                        {
                            user_account_id: parameters.resource_id,
                            user_account_app_data_post_id: serverUtilNumberValue(parameters.data.user_account_app_data_post_id),
                            app_id: parameters.app_id
                        },
                        null, 
                        null));

export{post, deleteRecord};