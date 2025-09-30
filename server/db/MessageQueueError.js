/** @module server/db/MessageQueueError */

/**
 * @import {server} from '../types.js'
 */
const {server} = await import ('../server.js');

/**
 * @name get
 * @description Get 
 * @function
 * @param {{app_id:number,
 *          resource_id:number|null}} parameters
 * @returns {server['server']['response'] & {result?:server['ORM']['MessageQueueError'][] }}
 */
const get = parameters =>server.ORM.getObject(parameters.app_id, 'MessageQueueError',null, null);
    
/**
 * @name post
 * @description Add record
 * @function
 * @param {{app_id:number,
 *          data:*}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORMMetaData']['common_result_insert'] }>}
 */
const post = async parameters => {
    if (parameters.data.message_queue_publish_id && 
        'message' in parameters.data &&
        'result' in parameters.data){
        /**@type{server['ORM']['MessageQueueError']}*/
        const data_new = {
                            id:Date.now(),
                            message_queue_publish_id:parameters.data.message_queue_publish_id,
                            message:parameters.data.message, 
                            result:parameters.data.result,
                            created: new Date().toISOString()
                        };
        return server.ORM.Execute({app_id:parameters.app_id, 
                            dml:'POST', 
                            object:'MessageQueueError', 
                            post:{data:data_new}}).then((/**@type{server['ORMMetaData']['common_result_insert']}*/result)=>{
            if (result.affectedRows>0){
                result.insertId=data_new.id;
                return {result:result, type:'JSON'};
            }
            else
                return server.ORM.getError(parameters.app_id, 404);
        });
    }
    else
        return server.ORM.getError(null, 400);
};

export {get, post};