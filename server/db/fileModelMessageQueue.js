/** @module server/config */

/**
 * @import {server_server_response, server_db_common_result_insert, 
 *          server_db_table_message_queue_publish, server_db_table_message_queue_consume, server_db_table_message_queue_error, 
 *          server_db_db_name_message_queue} from '../types.js'
 */

/**@type{import('./file.js')} */
const {fileFsDBLogPost, fileFsDBLogGet} = await import(`file://${process.cwd()}/server/db/file.js`);
/**@type{import('../db/common.js')} */
const { dbCommonRecordError} = await import(`file://${process.cwd()}/server/db/common.js`);

/**
 * @name get
 * @description Get user 
 * @function
 * @param {server_db_db_name_message_queue} file
 * @returns {Promise.<server_server_response & {result?:server_db_table_message_queue_publish[]|server_db_table_message_queue_consume[]|server_db_table_message_queue_error[] }>}
 */
const get = async file =>{
    const result = await fileFsDBLogGet(null, file, null, null,'');
    if (result.rows.length>0)
        return {result:result.rows, type:'JSON'};
    else
        return dbCommonRecordError(null, 404);
};
/**
 * @name post
 * @description Add record
 * @function
 * @param {server_db_db_name_message_queue} file
 * @param {*} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async (file,data) => {return {result:await fileFsDBLogPost(null, file,data, ''), type:'JSON'};};

export {get, post};