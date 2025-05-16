/** @module serviceregistry/microservice/messagequeue */

/**
 * @import {server_server_error, 
 *          server_db_table_MessageQueuePublish, 
 *          server_db_table_MessageQueueConsume,
 *          server_db_table_MessageQueuePublishMessage,
 *          server_db_table_MessageQueuePublishMicroserviceLog} from '../server/types.js'
 */

/**
 * @name messageQueue
 * @description Message queue
 * @function
 * @param {{app_id:Number,
 *          service:String,
 *          message_type:String,
 *          message:server_db_table_MessageQueuePublishMessage|server_db_table_MessageQueuePublishMicroserviceLog,
 *          message_id?:number}} parameters
 * @returns {Promise.<void|null>}
 */
const messageQueue = async parameters => {
   
    const MessageQueuePublish = await import('../server/db/MessageQueuePublish.js');
    const MessageQueueConsume = await import('../server/db/MessageQueueConsume.js');
    const MessageQueueError = await import('../server/db/MessageQueueError.js');
    switch (parameters.message_type) {
        case 'PUBLISH': {
            //message PUBLISH message in message_queue_publish.json
            const new_message_id = Date.now();
            /**@type{server_db_table_MessageQueuePublish} */
            const message_queue = { id: new_message_id, 
                                    created: new Date().toISOString(), 
                                    service: parameters.service, 
                                    message:   parameters.message};
            MessageQueuePublish.post({app_id:parameters.app_id, data:message_queue});
            break;
        }
        case 'CONSUME': {
            //message CONSUME
            //direct microservice call
            MessageQueuePublish.get({app_id:parameters.app_id, resource_id:parameters.message_id})
            .then(message_queue=>{
                /**@type{server_db_table_MessageQueueConsume} */
                const message_consume = {   message_queue_publish_id: parameters.message_id,
                                            message:    null,
                                            start:      null,
                                            finished:   null,
                                            result:     null};
                for (const row of message_queue.result){
                    if (row.id == parameters.message_id){
                        message_consume.message = row.message;
                        break;
                    }
                }
                message_consume.start = new Date().toISOString();
                //write to message_queue_consume.json
                MessageQueueConsume.post({app_id:parameters.app_id, data:message_consume})
                .catch((/**@type{server_server_error}*/error)=>{
                    MessageQueueError.post({app_id:parameters.app_id, 
                                            data:{  message_queue_publish_id: parameters.message_id, 
                                                    message:   parameters.message, 
                                                    result:error, 
                                                    created:new Date().toISOString()}}).then(()=>{
                        throw error;
                    });
                });
            });
            
            break;
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