/** @module server/db/MessageQueueConsume */

/**
 * @import {server_server_response, server_db_common_result_insert, 
 *          server_db_table_MessageQueueConsume} from '../types.js'
 */
const {ORM} = await import ('../server.js');
/**
 * @name get
 * @description Get 
 * @function
 * @param {{app_id:number,
 *          resource_id:number|null}} parameters
 * @returns {server_server_response & {result?:server_db_table_MessageQueueConsume[]}}
 */
const get = parameters =>ORM.getObject(parameters.app_id, 'MessageQueueConsume',null, null);

/**
 * @name post
 * @description Add record
 * @function
 * @param {{app_id:number,
 *          data:*}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async parameters => {
    if (parameters.data.message_queue_publish_id &&
        'message' in parameters.data &&
        'start' in parameters.data &&
        'finished' in parameters.data &&
        'result' in parameters.data){
        /**@type{server_db_table_MessageQueueConsume}*/
        const data_new = {
                            id:Date.now(),
                            message_queue_publish_id:parameters.data.message_queue_publish_id,
                            message:parameters.data.message, 
                            start:parameters.data.start,
                            finished:parameters.data.finished,
                            result:parameters.data.result,
                            created: new Date().toISOString()
                        };
        return ORM.Execute({app_id:parameters.app_id, 
                            dml:'POST', 
                            object:'MessageQueueConsume', 
                            post:{data:data_new}}).then((/**@type{server_db_common_result_insert}*/result)=>{
            if (result.affectedRows>0){
                result.insertId=data_new.id;
                return {result:result, type:'JSON'};
            }
            else
                return ORM.getError(parameters.app_id, 404);
        });
    }
    else
        return ORM.getError(null, 400);
};

export {get, post};