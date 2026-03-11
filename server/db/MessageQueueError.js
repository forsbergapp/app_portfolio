/** @module server/db/MessageQueueError */

/**
 * @import types_server from '../types.d.ts'
 */
const {server} = await import ('../server.js');

/**
 * @name get
 * @description Get 
 * @function
 * @param {{app_id:number,
 *          resource_id:number|null}} parameters
 * @returns {types_server.server['response'] & {result?:types_server.ORM['Object']['MessageQueueError'][] }}
 */
const get = parameters =>server.ORM.getObject(parameters.app_id, 'MessageQueueError',null, null);
    
/**
 * @name post
 * @description Add record
 * @function
 * @param {{app_id:number,
 *          data:types_server.ORM['Object']['MessageQueueError']}} parameters
 * @returns {Promise.<types_server.server['response'] & {result?:types_server.ORM['MetaData']['common_result_insert'] }>}
 */
const post = async parameters => {
    if (parameters.data.MessageQueuePublishId && 
        'Message' in parameters.data &&
        'Result' in parameters.data){
        /**@type{types_server.ORM['Object']['MessageQueueError']}*/
        const data_new = {
                            Id:Date.now(),
                            MessageQueuePublishId:parameters.data.MessageQueuePublishId,
                            Message:parameters.data.Message, 
                            Result:parameters.data.Result,
                            Created: new Date().toISOString()
                        };
        return server.ORM.Execute({app_id:parameters.app_id, dml:'POST', object:'MessageQueueError', post:{data:data_new}});
    }
    else
        return server.getError({statusCode: 400});
};

export {get, post};