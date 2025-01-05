/** @module server/db/dbModelAppDataEntityResource */


/**
 * @import {server_db_sql_result_app_data_entity_resource_get} from '../types.js'
 */

/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**
 * @name get
 * @description Get Entity resource
 * @function
 * @memberof REST_API
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{  entity_id?:string|null,
 *                  data_app_id?:string|number|null,
 *                  resource_name?:string|null}}} parameters
 * @returns {Promise.<server_db_sql_result_app_data_entity_resource_get[]>}
 */
const get = parameters => import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
    dbCommonExecute(parameters.app_id, 
                    dbSql.APP_DATA_ENTITY_RESOURCE_SELECT, 
                    {   resource_id: parameters.resource_id,
                        data_app_id: serverUtilNumberValue(parameters.data?.data_app_id),
                        entity_id: serverUtilNumberValue(parameters.data?.entity_id),
                        resource_name: parameters.data?.resource_name
                        }, 
                    null, 
                    null));
export {get};