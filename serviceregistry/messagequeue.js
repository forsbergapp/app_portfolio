/** @module serviceregistry/microservice/messagequeue */

/**
 * @import {server} from '../server/types.js'
 */
const {server} = await import('../server/server.js');
/**
 * @name messageQueue
 * @description Message queue for micoservice logs and errors
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          message_queue_type: 'CONSUME'|'PUBLISH',
 *          data: { service: string,
 *                  message_id?:server['ORM']['Object']['MessageQueueConsume']['message_queue_publish_id'],
 *                  type?:server['ORM']['Object']['MessageQueuePublish']['message']['type']
 *                  message?:server['ORM']['Object']['MessageQueuePublish']['message']['message']},
 *          authorization:string,
 *          endpoint:server['bff']['parameters']['endpoint']}} parameters
 * @returns {Promise.<server['server']['response']>}
 */
const messageQueue = async parameters => {
    switch (parameters.message_queue_type) {
        case 'PUBLISH': {
            /**@type{server['ORM']['Object']['MessageQueuePublish']} */
            const message_queue = { Service: parameters.data.service, 
                                    Message:   {Type:parameters.data.type,
                                                Message:parameters.data.message}
                                    };
            return await server.ORM.db.MessageQueuePublish.post({app_id:parameters.app_id, data:message_queue});
        }
        case 'CONSUME': {
            //message CONSUME
            return await server.ORM.db.MessageQueuePublish.get({app_id:parameters.app_id, resource_id:parameters.data.message_id})
            .then(message_queue=>{
                /**@type{server['ORM']['Object']['MessageQueueConsume']} */
                const message_consume = {   MessageQueuePublishId: parameters.data.message_id,
                                            Message:    null,
                                            Start:      null,
                                            Finished:   null,
                                            Result:     null};
                for (const row of message_queue.result){
                    if (row.Id == parameters.data.message_id){
                        message_consume.Message = row.Message;
                        break;
                    }
                }
                message_consume.Start = new Date().toISOString();
                //write to message_queue_consume.json
                return server.ORM.db.MessageQueueConsume.post({app_id:parameters.app_id, data:message_consume})
                    .catch((/**@type{server['server']['error']}*/error)=>{
                        server.ORM.db.MessageQueueError.post({app_id:parameters.app_id, 
                                                data:{  message_queue_publish_id: parameters.data.message_id, 
                                                        message:   error, 
                                                        result:error}}).then(()=>{
                            throw error;
                        });
                    });
            });
        }
        default: {
            throw {http:400,
                code:'IAM',
                text:server.iam.iamUtilMessageNotAuthorized(),
                developerText:null,
                moreInfo:null,
                type:'JSON'
            };
        }
    }
};
export {messageQueue};