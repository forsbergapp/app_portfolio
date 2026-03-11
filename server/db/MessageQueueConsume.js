/** @module server/db/MessageQueueConsume */

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
 * @returns {types_server.server['response'] & {result:types_server.ORM['Object']['MessageQueueConsume'][]}}
 */
const get = parameters =>server.ORM.getObject(parameters.app_id, 'MessageQueueConsume',null, null);

/**
 * @name post
 * @description Add record
 * @function
 * @param {{app_id:number,
 *          data:types_server.ORM['Object']['MessageQueueConsume']}} parameters
 * @returns {Promise.<types_server.server['response'] & {result?:types_server.ORM['MetaData']['common_result_insert'] }>}
 */
const post = async parameters => {
    if (parameters.data.MessageQueuePublishId &&
        'Message' in parameters.data &&
        'Start' in parameters.data &&
        'Finished' in parameters.data &&
        'Result' in parameters.data){
        /**@type{types_server.ORM['Object']['MessageQueueConsume']}*/
        const data_new = {
                            Id:Date.now(),
                            MessageQueuePublishId:parameters.data.MessageQueuePublishId,
                            Message:parameters.data.Message, 
                            Start:parameters.data.Start,
                            Finished:parameters.data.Finished,
                            Result:parameters.data.Result,
                            Created: new Date().toISOString(),
                            Modified:null
                        };
        return server.ORM.Execute({app_id:parameters.app_id, dml:'POST', object:'MessageQueueConsume', post:{data:data_new}});
    }
    else
        return server.getError({statusCode: 400});
};

export {get, post};