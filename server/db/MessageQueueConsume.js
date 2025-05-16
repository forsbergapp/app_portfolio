/** @module server/db/MessageQueueConsume */

/**
 * @import {server_server_response, server_db_common_result_insert, 
 *          server_db_table_MessageQueueConsume} from '../types.js'
 */

const ORM = await import('./ORM.js');

/**
 * @name get
 * @description Get user 
 * @function
 * @param {{app_id:number,
 *          resource_id:number}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_table_MessageQueueConsume[]}>}
 */
const get = async parameters =>{
    const result = await ORM.Execute({app_id:0, dml:'GET', object:'MessageQueueConsume', get:{resource_id:parameters.resource_id, partition:null}});
    if (result.rows.length>0)
        return {result:result.rows, type:'JSON'};
    else
        return ORM.getError(null, 404);
};
/**
 * @name post
 * @description Add record
 * @function
 * @param {{app_id:number,
 *          data:*}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async parameters => {
    if (parameters.data.message_queue_publish_id)
        return {
            result:await ORM.Execute({ app_id:parameters.app_id, 
            dml:'POST',
            object:'MessageQueueConsume', 
            post:{data:{...{id:Date.now()}, 
                        ...parameters.data, 
                        ...{created:new Date().toISOString()}
                        }
                }
            }), type:'JSON'};
    else
        return ORM.getError(null, 400);
};

export {get, post};