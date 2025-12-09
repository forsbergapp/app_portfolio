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
 * @returns {server['server']['response'] & {result?:server['ORM']['Object']['MessageQueueError'][] }}
 */
const get = parameters =>server.ORM.getObject(parameters.app_id, 'MessageQueueError',null, null);
    
/**
 * @name post
 * @description Add record
 * @function
 * @param {{app_id:number,
 *          data:server['ORM']['Object']['MessageQueueError']}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_insert'] }>}
 */
const post = async parameters => {
    if (parameters.data.MessageQueuePublishId && 
        'Message' in parameters.data &&
        'Result' in parameters.data){
        /**@type{server['ORM']['Object']['MessageQueueError']}*/
        const data_new = {
                            Id:Date.now(),
                            MessageQueuePublishId:parameters.data.MessageQueuePublishId,
                            Message:parameters.data.Message, 
                            Result:parameters.data.Result,
                            Created: new Date().toISOString()
                        };
        return server.ORM.Execute({app_id:parameters.app_id, 
                            dml:'POST', 
                            object:'MessageQueueError', 
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