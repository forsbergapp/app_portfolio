/** @module server/db/App */

/**
 * @import {server_server_response,server_db_table_app_data_entity} from '../types.js'
 */

/**@type{import('./file.js')} */
const {fileDBGet} = await import(`file://${process.cwd()}/server/db/file.js`);
/**@type{import('../db/common.js')} */
const { dbCommonRecordError} = await import(`file://${process.cwd()}/server/db/common.js`);

/**
 * @name get
 * @description Get records for given appid
 * @function
 * @param {{app_id:number|null,
 *          resource_id:number|null,
 *          data:{data_app_id?:number|null}}} parameters
 * @returns {server_server_response & {result?:server_db_table_app_data_entity[] }}
 */
const get = parameters =>{ 
    const result = fileDBGet(parameters.app_id, 'APP_DATA_ENTITY',parameters.resource_id, parameters.data.data_app_id??null);
    if (result.rows.length>0 || parameters.resource_id==null)
        return {result:result.rows, type:'JSON'};
    else
        return dbCommonRecordError(parameters.app_id, 404);
};
        
export {get};