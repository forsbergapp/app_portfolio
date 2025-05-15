/** @module microservice/messagequeue */

/**
 * @import {server_server_error, 
 *          server_db_db_name_message_queue, server_db_table_MessageQueuePublish, server_db_table_MessageQueueConsume, server_db_table_MessageQueueError} from '../server/types.js'
 */

/**
 * @name messageQueue
 * @description Message queue
 * @function
 * @param {string} service 
 * @param {string} message_type 
 * @param {object|null} message
 * @param {number} message_id 
 * @returns {Promise.<void|null>}
 */
const messageQueue = async (service, message_type, message, message_id) => {
   
    /**@type{import('../server/db/MessageQueue.js')} */
    const MessageQueue = await import(`file://${process.cwd()}/server/db/MessageQueue.js`);

    /**
     * 
     * @param {server_db_db_name_message_queue} file 
     * @param {server_db_table_MessageQueuePublish|server_db_table_MessageQueueConsume|server_db_table_MessageQueueError} message 
     * @returns {Promise.<void>}
     */
    const write_file = async (file, message) =>{
        MessageQueue.post(file,message)
        .catch((/**@type{server_server_error}*/error)=>{throw error;});
    };
    switch (message_type) {
        case 'PUBLISH': {
            //message PUBLISH message in message_queue_publish.json
            const new_message_id = Date.now();
            /**@type{server_db_table_MessageQueuePublish} */
            const message_queue = {id: new_message_id, created: new Date().toISOString(), service: service, message:   message};
            write_file('MessageQueuePublish', message_queue);
            break;
        }
        case 'CONSUME': {
            //message CONSUME
            //direct microservice call
            MessageQueue.get('MessageQueuePublish')
            .then(message_queue=>{
                /**@type{server_db_table_MessageQueueConsume} */
                const message_consume = {   message_queue_publish_id: message_id,
                                            message:    null,
                                            start:      null,
                                            finished:   null,
                                            result:     null};
                for (const row of message_queue.result){
                    if (row.id == message_id){
                        message_consume.message = row.message;
                        break;
                    }
                }
                message_consume.start = new Date().toISOString();
                //write to message_queue_consume.json
                write_file('MessageQueueConsume', message_consume)
                .catch((/**@type{server_server_error}*/error)=>{
                    write_file('MessageQueueError', {   message_queue_publish_id: message_id, 
                                                        message:   message, 
                                                        result:error, 
                                                        created:new Date().toISOString()}).then(()=>{
                        throw error;
                    });
                });
            });
            
            break;
        }
        default: {
            /**@type{import('../server/iam.js')} */
            const  {iamUtilMessageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);
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