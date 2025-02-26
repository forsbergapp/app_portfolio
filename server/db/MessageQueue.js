/** @module server/config */

/**
 * @import {server_server_response, server_db_common_result_insert, 
 *          server_db_table_MessageQueuePublish, server_db_table_MessageQueueConsume, server_db_table_MessageQueueError, 
 *          server_db_db_name_message_queue} from '../types.js'
 */

/**@type{import('./ORM.js')} */
const ORM = await import(`file://${process.cwd()}/server/db/ORM.js`);

/**
 * @name get
 * @description Get user 
 * @function
 * @param {server_db_db_name_message_queue} file
 * @returns {Promise.<server_server_response & {result?:server_db_table_MessageQueuePublish[]|server_db_table_MessageQueueConsume[]|server_db_table_MessageQueueError[] }>}
 */
const get = async file =>{
    const result = await ORM.getFsLog(null, file, null, null,'');
    if (result.rows.length>0)
        return {result:result.rows, type:'JSON'};
    else
        return ORM.getError(null, 404);
};
/**
 * @name post
 * @description Add record
 * @function
 * @param {server_db_db_name_message_queue} file
 * @param {*} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async (file,data) => {return {result:await ORM.postFsLog(null, file,data, ''), type:'JSON'};};

export {get, post};