/** @module microservice/messagequeue */

/**
 * @import {server_server_error} from '../server/types.js'
 */

/**@type{import('../server/db/file.js')} */
const {fileFsReadLog, fileFsAppend} = await import(`file://${process.cwd()}/server/db/file.js`);

/**
 * Message queue
 * @function
 * @param {string} service 
 * @param {string} message_type 
 * @param {object|null} message
 * @param {string} message_id 
 * @returns {Promise.<void|null>}
 */
const messageQueue = async (service, message_type, message, message_id) => {
    /**@type{import('../microservice/mail/service.js')} */
    const {sendEmail} = await import(`file://${process.cwd()}/microservice/mail/service.js`);
    return new Promise((resolve, reject) =>{
        /**
         * 
         * @param {number} file 
         * @param {object|null} message 
         * @param {*} result 
         * @returns {Promise.<void>}
         */
        const write_file = async (file, message, result) =>{
            fileFsAppend(file==0?'MICROSERVICE_MESSAGE_QUEUE_ERROR':file==1?'MICROSERVICE_MESSAGE_QUEUE_PUBLISH':file==2?'MICROSERVICE_MESSAGE_QUEUE_CONSUME':'MICROSERVICE_MESSAGE_QUEUE_ERROR', 
                            file==0?{message_id: new Date().toISOString(), message:   message, result:result}:message??{})
            .catch((/**@type{server_server_error}*/error)=>{throw error;});
        };
        try {
            switch (message_type) {
                case 'PUBLISH': {
                    //message PUBLISH message in message_queue_publish.json
                    const new_message_id = new Date().toISOString();
                    /**@type{import('./types.js').microservice_message_queue_publish} */
                    const message_queue = {message_id: new_message_id, service: service, message:   message};
                    write_file(1, message_queue, null)
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
                    fileFsReadLog('MICROSERVICE_MESSAGE_QUEUE_PUBLISH')
                    .then((/**@type{import('./types.js').microservice_message_queue_publish[]}*/message_queue)=>{
                        /**@type{import('./types.js').microservice_message_queue_consume} */
                        let message_consume = { message_id: null,
                                                service:    null,
                                                message:    null,
                                                start:      null,
                                                finished:   null,
                                                result:     null};
                        for (const row of message_queue){
                            if (row.message_id == message_id){
                                message_consume = { message_id: row.message_id,
                                                    service:    row.service,
                                                    message:    row.message,
                                                    start:      null,
                                                    finished:   null,
                                                    result:     null};
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
                                    write_file(2, message_consume, result_sendEmail)
                                    .then(()=>{
                                        resolve (null);
                                    })
                                    .catch((/**@type{server_server_error}*/error)=>{
                                        write_file(0, message_consume, error)
                                        .then(()=>{
                                            reject (error);
                                        })
                                        .catch(error=>{
                                            reject(error);
                                        });
                                    });
                                })
                                .catch((/**@type{server_server_error}*/error)=>{
                                    write_file(0, message_consume, error)
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
                        write_file(0, message, error).then(()=>{
                            reject(message);
                        });
                    });
                    break;
                }
                default: {
                    //unknown message, add record:
                    write_file(0, message, '?').then(()=>{
                        reject(message);
                    });
                }
            }
        } catch (/**@type{server_server_error}*/error){
            write_file(0, message, error).then(()=>{
                reject(message);
            });
        }
    });
};
export {messageQueue};