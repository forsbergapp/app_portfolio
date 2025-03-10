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
 * @param {server_db_db_name_message_queue} table
 * @returns {Promise.<server_server_response & {result?:server_db_table_MessageQueuePublish[]|server_db_table_MessageQueueConsume[]|server_db_table_MessageQueueError[] }>}
 */
const get = async table =>{
    const result = await ORM.getFsLog(null, table, null, null,'');
    if (result.rows.length>0)
        return {result:result.rows, type:'JSON'};
    else
        return ORM.getError(null, 404);
};
/**
 * @name post
 * @description Add record
 * @function
 * @param {server_db_db_name_message_queue} table
 * @param {*} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async (table,data) => {return {result:await ORM.Execute({ app_id:0, 
    dml:'POST',object:table, 
    post:{data:{...{id:Date.now()}, 
                ...data, 
                ...{created:new Date().toISOString()}
                }
        }
    }), type:'JSON'};
};

export {get, post};