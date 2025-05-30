/** @module serviceregistry/microservice/messagequeue */

/**
 * @import {server_server_error, 
 *          server_db_table_MessageQueuePublish, 
 *          server_db_table_MessageQueueConsume,
 *          server_db_table_MessageQueuePublishMicroserviceLog} from '../server/types.js'
 */

/**
 * @name messageQueue
 * @description Message queue for micoservice logs and errors
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          message_queue_type: 'CONSUME'|'PUBLISH',
 *          data: { service: string,
 *                  message_id?:server_db_table_MessageQueueConsume['message_queue_publish_id'],
 *                  type?:server_db_table_MessageQueuePublishMicroserviceLog['type']
 *                  message?:server_db_table_MessageQueuePublishMicroserviceLog['message']},
 *          authorization:string,
 *          endpoint:server_bff_endpoint_type}} parameters
 * @returns {Promise.<server_server_response>}
 */
const messageQueue = async parameters => {
    const MessageQueuePublish = await import('../server/db/MessageQueuePublish.js');
    const MessageQueueConsume = await import('../server/db/MessageQueueConsume.js');
    const MessageQueueError = await import('../server/db/MessageQueueError.js');
    switch (parameters.message_queue_type) {
        case 'PUBLISH': {
            /**@type{server_db_table_MessageQueuePublish} */
            const message_queue = { service: parameters.data.service, 
                                    message:   {type:parameters.data.type,
                                                message:parameters.data.message}
                                    };
            return await MessageQueuePublish.post({app_id:parameters.app_id, data:message_queue});
        }
        case 'CONSUME': {
            //message CONSUME
            //direct microservice call
            return await MessageQueuePublish.get({app_id:parameters.app_id, resource_id:parameters.data.message_id})
            .then(message_queue=>{
                /**@type{server_db_table_MessageQueueConsume} */
                const message_consume = {   message_queue_publish_id: parameters.data.message_id,
                                            message:    null,
                                            start:      null,
                                            finished:   null,
                                            result:     null};
                for (const row of message_queue.result){
                    if (row.id == parameters.data.message_id){
                        message_consume.message = row.message;
                        break;
                    }
                }
                message_consume.start = new Date().toISOString();
                //write to message_queue_consume.json
                return MessageQueueConsume.post({app_id:parameters.app_id, data:message_consume})
                .catch((/**@type{server_server_error}*/error)=>{
                    MessageQueueError.post({app_id:parameters.app_id, 
                                            data:{  message_queue_publish_id: parameters.data.message_id, 
                                                    message:   error, 
                                                    result:error}}).then(()=>{
                        throw error;
                    });
                });
            });
        }
        default: {
            const  {iamUtilMessageNotAuthorized} = await import('../server/iam.js');
            throw {http:400,
                code:'IAM',
                text:iamUtilMessageNotAuthorized(),
                developerText:null,
                moreInfo:null,
                type:'JSON'
            };
        }
    }
};
export {messageQueue};