/** @module server/db/dbModelUserAccountLike */

/**
 * @import {server_db_sql_result_user_account_like_unlike,
 *          server_db_sql_result_user_account_like_like} from '../types.js'
 */

/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**
 * @name post
 * @description Like
 * @function
 * @memberof REST_API
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{user_account_id:number|null}}} parameters
 * @returns {Promise.<server_db_sql_result_user_account_like_like>}
 */
const post = parameters => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(parameters.app_id, 
                        dbSql.USER_ACCOUNT_LIKE_INSERT, 
                        {
                            user_account_id: parameters.resource_id,
                            user_account_id_like: serverUtilNumberValue(parameters.data?.user_account_id)
                            },
                        null, 
                        null));
/**
 * @name deleteRecord
 * @description Unlike
 * @function
 * @memberof REST_API
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{user_account_id:number|null}}} parameters
 * @returns {Promise.<server_db_sql_result_user_account_like_unlike>}
 */
const deleteRecord = parameters => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(parameters.app_id, 
                        dbSql.USER_ACCOUNT_LIKE_DELETE, 
                        {
                            user_account_id: parameters.resource_id,
                            user_account_id_like: serverUtilNumberValue(parameters.data?.user_account_id)
                            },
                        null, 
                        null));
                        
export {post, deleteRecord};