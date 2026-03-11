/** @module serviceregistry/microservice/messagequeue */

/**
 * @import types_server from '../server/types.d.ts'
 */
const {server} = await import('../server/server.js');
/**
 * @name messageQueue
 * @description Message queue for micoservice logs and errors
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          message_queue_type: 'CONSUME'|'PUBLISH',
 *          data: { service: types_server.ORM['Object']['MessageQueuePublish']['Service'],
 *                  message_id?:types_server.ORM['Object']['MessageQueueConsume']['MessageQueuePublishId'],
 *                  type?:types_server.ORM['Object']['MessageQueuePublish']['Message']['Type']
 *                  message?:types_server.ORM['Object']['MessageQueuePublish']['Message']['Message']},
 *          authorization:string,
 *          endpoint:types_server.bff['parameters']['endpoint']}} parameters
 * @returns {Promise.<types_server.server['response']>}
 */
const messageQueue = async parameters => {
    switch (parameters.message_queue_type) {
        case 'PUBLISH': {
            /**@ts-ignore @type{types_server.ORM['Object']['MessageQueuePublish']} */
            const message_queue = { Service: parameters.data.service, 
                                    Message:   {Type:parameters.data.type,
                                                Message:parameters.data.message??''}
                                    };
            return await server.ORM.db.MessageQueuePublish.post({app_id:parameters.app_id, data:message_queue});
        }
        case 'CONSUME': {
            //message CONSUME
            /**@ts-ignore @type{types_server.ORM['Object']['MessageQueueConsume']} */
            const message_consume = {   MessageQueuePublishId: parameters.data.message_id??0,
                                        Message:    null,
                                        Start:      null,
                                        Finished:   null,
                                        Result:     null};
            for (const row of server.ORM.db.MessageQueuePublish.get({app_id:parameters.app_id, resource_id:parameters.data.message_id??null}).result){
                if (row.Id == parameters.data.message_id){
                    message_consume.Message = row.Message;
                    break;
                }
            }
            message_consume.Start = new Date().toISOString();
            //write to message_queue_consume.json
            return server.ORM.db.MessageQueueConsume.post({app_id:parameters.app_id, data:message_consume})
                .catch((/**@type{types_server.server['error']}*/error)=>{
                    return server.ORM.db.MessageQueueError.post({app_id:parameters.app_id, 
                                            /**@ts-ignore */
                                            data:{  MessageQueuePublishId: parameters.data.message_id??0, 
                                                    Message:   error, 
                                                    Result:error}}).then(()=>{
                        throw error;
                    });
                });
        }
        default: {
            throw server.getError({statusCode:400})
        }
    }
};
export {messageQueue};