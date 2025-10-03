/** @module server/db/MessageQueueConsume */

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
 * @returns {server['server']['response'] & {result?:server['ORM']['Object']['MessageQueueConsume'][]}}
 */
const get = parameters =>server.ORM.getObject(parameters.app_id, 'MessageQueueConsume',null, null);

/**
 * @name post
 * @description Add record
 * @function
 * @param {{app_id:number,
 *          data:*}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_insert'] }>}
 */
const post = async parameters => {
    if (parameters.data.message_queue_publish_id &&
        'message' in parameters.data &&
        'start' in parameters.data &&
        'finished' in parameters.data &&
        'result' in parameters.data){
        /**@type{server['ORM']['Object']['MessageQueueConsume']}*/
        const data_new = {
                            Id:Date.now(),
                            MessageQueuePublishId:parameters.data.message_queue_publish_id,
                            Message:parameters.data.message, 
                            Start:parameters.data.start,
                            Finished:parameters.data.finished,
                            Result:parameters.data.result,
                            Created: new Date().toISOString()
                        };
        return server.ORM.Execute({app_id:parameters.app_id, 
                            dml:'POST', 
                            object:'MessageQueueConsume', 
                            post:{data:data_new}}).then((/**@type{server['ORM']['MetaData']['common_result_insert']}*/result)=>{
            if (result.AffectedRows>0){
                result.InsertId=data_new.Id;
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