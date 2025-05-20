/** @module server/db/MessageQueueError */

/**
 * @import {server_server_response, server_db_common_result_insert, 
 *          server_db_table_MessageQueueError} from '../types.js'
 */


const ORM = await import('./ORM.js');

/**
 * @name get
 * @description Get user 
 * @function
 * @param {{app_id:number,
 *          resource_id:number|null}} parameters
 * @returns {server_server_response & {result?:server_db_table_MessageQueueError[] }}
 */
const get = parameters =>{
    const result = ORM.getObject(parameters.app_id, 'MessageQueueError',null, null);
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
    if (parameters.data.message_queue_publish_id && 
        parameters.data.message &&
        parameters.data.result){
        /**@type{server_db_table_MessageQueueError}*/
        const data_new = {
                            id:Date.now(),
                            message_queue_publish_id:parameters.data.message_queue_publish_id,
                            message:parameters.data.message, 
                            result:parameters.data.result,
                            created: new Date().toISOString()
                        };
        return ORM.Execute({app_id:parameters.app_id, 
                            dml:'POST', 
                            object:'MessageQueueError', 
                            post:{data:data_new}}).then((result)=>{
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