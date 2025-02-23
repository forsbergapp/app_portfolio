/** @module server/db/Database */

/**
 * @import {server_server_response, server_db_object_record} from '../types.js'
 */

/**@type{import('./file.js')} */
const {fileDbInfo} = await import(`file://${process.cwd()}/server/db/file.js`);
/**@type{import('../db/common.js')} */
const { dbCommonRecordError} = await import(`file://${process.cwd()}/server/db/common.js`);

/**
 * @name getViewDbInfo
 * @description Database info
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number}}parameters
 * @returns {Promise.<server_server_response & {result?:{   database_name:string, 
 *                                                          version:number,
 *                                                          hostname:string,
 *                                                          connections:Number,
 *                                                          started:number}[]}>}
 */
const getViewDbInfo = async parameters =>{
    /**@type{import('./Config.js')} */
    const Config = await import(`file://${process.cwd()}/server/db/Config.js`);
    /**@type{import('../socket.js')} */
    const {socketConnectedCount} = await import(`file://${process.cwd()}/server/socket.js`);
    return {result: [{
                        database_name: Config.get('CONFIG_SERVER','METADATA').CONFIGURATION,
                        version: 1,
                        hostname:Config.get('CONFIG_SERVER','SERVER','HOST')??'',
                        connections: socketConnectedCount({data:{logged_in:'1'}}).result.count_connected??0,
                        started: process.uptime()
                    }],
            type:'JSON'};
};
        
/**
 * @name getViewDbObjects
 * @description Database info
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number}}parameters
 * @returns {server_server_response & {result?:{name:server_db_object_record['name'],
 *                                              type:server_db_object_record['type'],
 *                                              pk:server_db_object_record['pk'],
 *                                              uk:server_db_object_record['uk'],
 *                                              lock:server_db_object_record['lock'],
 *                                              transaction_id:server_db_object_record['transaction_id'],
 *                                              rows:number|null,
 *                                              size:number|null}[]}}
 */
const getViewDbObjects = parameters =>{
    

    const result = fileDbInfo().map(row=>{
        return {
            name: row.name,
            type: row.type,
            pk: row.pk,
            uk: row.uk,
            lock: row.lock,
            transaction_id: row.transaction_id,
            rows: ('cache_content' in row && row.type=='TABLE')?
                    row.cache_content?
                        row.cache_content.length??0:
                            0:
                                null,
            size: ('cache_content' in row)?
                    row.cache_content?
                        JSON.stringify(row.cache_content)?.length??0:
                            0:
                                null
        };
    });
    if (result.length>0)
        return {result:result, type:'JSON'};
    else
        return dbCommonRecordError(parameters.app_id, 404);
};
export {getViewDbInfo, getViewDbObjects};