/** @module microservice/messagequeue */

/**@type{import('../server/db/file.service.js')} */
const {file_get_log, file_append_log} = await import(`file://${process.cwd()}/server/db/file.service.js`);

/**
 * 
 * @param {string} service 
 * @param {string} message_type 
 * @param {object|null} message
 * @param {string} message_id 
 * @returns 
 */
const MessageQueue = async (service, message_type, message, message_id) => {
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
            file_append_log(file==0?'MESSAGE_QUEUE_ERROR':file==1?'MESSAGE_QUEUE_PUBLISH':file==2?'MESSAGE_QUEUE_CONSUME':'MESSAGE_QUEUE_ERROR', 
                            file==0?{message_id: new Date().toISOString(), message:   message, result:result}:message??{})
            .catch((/**@type{import('../types.js').error}*/error)=>{throw error;});
        };
        try {
            switch (message_type) {
                case 'PUBLISH': {
                    //message PUBLISH message in message_queue_publish.json
                    const new_message_id = new Date().toISOString();
                    /**@type{import('../types.js').microservice_message_queue_publish} */
                    const message_queue = {message_id: new_message_id, service: service, message:   message};
                    write_file(1, message_queue, null)
                    .then(()=>{
                        resolve (MessageQueue(service, 'CONSUME', null, new_message_id));
                    })
                    .catch((/**@type{import('../types.js').error}*/error)=>{
                        reject(error);
                    });
                    break;
                }
                case 'CONSUME': {
                    //message CONSUME
                    //direct microservice call
                    file_get_log('MESSAGE_QUEUE_PUBLISH')
                    .then((/**@type{import('../types.js').microservice_message_queue_publish[]}*/message_queue)=>{
                        /**@type{import('../types.js').microservice_message_queue_consume} */
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
                                    .catch((/**@type{import('../types.js').error}*/error)=>{
                                        write_file(0, message_consume, error)
                                        .then(()=>{
                                            reject (error);
                                        })
                                        .catch(error=>{
                                            reject(error);
                                        });
                                    });
                                })
                                .catch((/**@type{import('../types.js').error}*/error)=>{
                                    write_file(0, message_consume, error)
                                    .then(()=>{
                                        reject (error);
                                    })
                                    .catch((/**@type{import('../types.js').error}*/error)=>{
                                        reject(error);
                                    });
                                });
                                break;
                            }
                        }
                    })
                    .catch((/**@type{import('../types.js').error}*/error)=>{
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
        } catch (/**@type{import('../types.js').error}*/error){
            write_file(0, message, error).then(()=>{
                reject(message);
            });
        }
    });
};
export {MessageQueue};