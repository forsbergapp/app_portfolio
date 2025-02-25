/** @module microservice/messagequeue */

/**
 * @import {server_server_error, 
 *          server_db_db_name_message_queue, server_db_table_message_queue_publish, server_db_table_message_queue_consume, server_db_table_message_queue_error} from '../server/types.js'
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
    /**@type{import('../microservice/mail/service.js')} */
    const {sendEmail} = await import(`file://${process.cwd()}/microservice/mail/service.js`);
    
    /**@type{import('../server/db/MessageQueue.js')} */
    const MessageQueue = await import(`file://${process.cwd()}/server/db/MessageQueue.js`);


    return new Promise((resolve, reject) =>{
        /**
         * 
         * @param {server_db_db_name_message_queue} file 
         * @param {server_db_table_message_queue_publish|server_db_table_message_queue_consume|server_db_table_message_queue_error} message 
         * @returns {Promise.<void>}
         */
        const write_file = async (file, message) =>{
            MessageQueue.post(file,message)
            .catch((/**@type{server_server_error}*/error)=>{throw error;});
        };
        try {
            switch (message_type) {
                case 'PUBLISH': {
                    //message PUBLISH message in message_queue_publish.json
                    const new_message_id = Date.now();
                    /**@type{server_db_table_message_queue_publish} */
                    const message_queue = {message_id: new_message_id, created: new Date().toISOString(), service: service, message:   message};
                    write_file('MessageQueuePublish', message_queue)
                    .then(()=>{
                        resolve (messageQueue(service, 'CONSUME', null, new_message_id));
                    })
                    .catch((/**@type{server_server_error}*/error)=>{
                        reject(error);
                    });
                    break;
                }
                case 'CONSUME': {
                    //message CONSUME
                    //direct microservice call
                    MessageQueue.get('MessageQueuePublish')
                    .then(message_queue=>{
                        /**@type{server_db_table_message_queue_consume} */
                        const message_consume = { message_id: message_id,
                                                service:    null,
                                                message:    null,
                                                start:      null,
                                                finished:   null,
                                                result:     null};
                        for (const row of message_queue.result){
                            if (row.message_id == message_id){
                                message_consume.service = row.service;
                                message_consume.message = row.message;
                                break;
                            }
                        }
                        switch (service){
                            case 'MAIL':{
                                message_consume.start = new Date().toISOString();
                                sendEmail(message_consume.message)
                                .then((/**@type{object}*/result_sendEmail)=>{
                                    message_consume.finished = new Date().toISOString();
                                    message_consume.result = result_sendEmail;
                                    //write to message_queue_consume.json
                                    write_file('MessageQueueConsume', message_consume)
                                    .then(()=>{
                                        resolve (null);
                                    })
                                    .catch((/**@type{server_server_error}*/error)=>{
                                        write_file('MessageQueueError', {message_id: message_id, message:   message_consume, result:error})
                                        .then(()=>{
                                            reject (error);
                                        })
                                        .catch(error=>{
                                            reject(error);
                                        });
                                    });
                                })
                                .catch((/**@type{server_server_error}*/error)=>{
                                    write_file('MessageQueueError', {message_id: message_id, message:   message_consume, result:error})
                                    .then(()=>{
                                        reject (error);
                                    })
                                    .catch((/**@type{server_server_error}*/error)=>{
                                        reject(error);
                                    });
                                });
                                break;
                            }
                        }
                    })
                    .catch((/**@type{server_server_error}*/error)=>{
                        write_file('MessageQueueError', {message_id: message_id, message:   message, result:error}).then(()=>{
                            reject(message);
                        });
                    });
                    break;
                }
                default: {
                    //unknown message, add record:
                    write_file('MessageQueueError', {message_id: message_id, message:   message, result:message_type + '?'}).then(()=>{
                        reject(message);
                    });
                }
            }
        } catch (/**@type{server_server_error}*/error){
            write_file('MessageQueueError', {message_id: message_id, message:   message, result:error}).then(()=>{
                reject(message);
            });
        }
    });
};
export {messageQueue};