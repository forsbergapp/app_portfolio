/**
 * @module apps/common/src/functions/common_message
*/

/**
 * @import {server_server_response,
 *          server_db_table_IamUser,
 *          server_db_table_MessageQueuePublish,
 *          server_db_table_MessageQueueConsume,
 *          server_db_table_MessageQueuePublishMessage} from '../../../../server/types.js'
 */

/**
 * @name appFunction
 * @description Server function for messages
 *              COMMON_MESSAGE_CONTACT      sends PUBLISH message from contact form to admin
 *              COMMON_MESSAGE_COUNT        counts PUBLISH messages without CONSUME 
 *              COMMON_MESSAGE_GET          gets PUBLISH messages for given receiver_id
 *                                          admin can also read receiver_id = null
 *                                          checks in CONSUME exist for each message
 *              COMMON_MESSAGE_READ         reads a PUBLISH message and sends CONSUME message
 *              COMMON_MESSAGE_DELETE       deletes message including CONSUME and ERROR
 *              COMMON_MESSAGE_SEND         sends PUBLISH message to a receiver_id
 * @function
 * @param {{app_id:number,
 *          resource_id:string,
 *          data:Object.<string,*>,
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          idToken:string,
 *          authorization:string,
 *          locale:string}} parameters
 * @returns {Promise.<server_server_response & {result?:Object.<string,*>[]}>}
 */
const appFunction = async parameters =>{
    const {iamUtilMessageNotAuthorized} = await import('../../../../server/iam.js');
    const MessageQueuePublish = await import('../../../../server/db/MessageQueuePublish.js');
    const MessageQueueConsume = await import('../../../../server/db/MessageQueueConsume.js');
    const MessageQueueError = await import('../../../../server/db/MessageQueueError.js');
    /**
     * @returns {server_server_response}
     */
    const messageError = () =>{
        return {http:400,
                code:'DOC',
                text:iamUtilMessageNotAuthorized(),
                developerText:null,
                moreInfo:null,
                type:'JSON'
            };
    };
    /**
     * @description get MessageQueuPublish record and authenticate message and user
     * @returns {server_server_response}
     */
    const messagePublishGet = () =>{
        const result = MessageQueuePublish.get({app_id:parameters.app_id, resource_id:null});
        if (result.http)
            return result;
        else{
            return {result:(result.result??[])
                            .filter((/**@type{server_db_table_MessageQueuePublish}*/message)=>
                            message.service=='MESSAGE' &&
                            (
                                //admin can read messages without receiver and its own messages
                                (IamUser.type == 'ADMIN' && 
                                (message.message.receiver_id == null ||message.message.receiver_id ==parameters.data.iam_user_id))||
                                //user can only read its own messages
                            message.message.receiver_id ==parameters.data.iam_user_id
                            )),
                            type:'JSON'};
        }
    };
    /**
     * @description posts MessageQueuPublish record and sends SSE to the reciever
     * @param {*} message
     * @returns {Promise.<server_server_response>}
     */
    const messagePublishPost = async message =>{
        const socket = await import('../../../../server/socket.js');
        const IamUser = await import('../../../../server/db/IamUser.js');
        /**@type{server_db_table_MessageQueuePublish} */
        const message_queue_message = {service:'MESSAGE', message:message};
        return {result:[await MessageQueuePublish.post({app_id:parameters.app_id, 
                                                        data:message_queue_message})
                        .then(result=>{
                            if(result.result?.affectedRows){
                                /**@type{server_db_table_IamUser[]} */
                                const users = IamUser.get(parameters.app_id, message.receiver_id).result;                               
                                for (const user of users.filter(user=>  user.type == (( message.receiver_id && 
                                                                                        users.length == 1)?users[0].type:'ADMIN') &&
                                                                        user.id == (message.receiver_id ?? user.id))){
                                    /**@ts-ignore */
                                    for (const connection of socket.socketConnectedGet(user.id))
                                        socket.socketClientSend(connection.response, '', 'MESSAGE');
                                }
                                return {sent:result.result.affectedRows};
                            }
                            else
                                return {sent:0};
                        })], type:'JSON'};
    };
    /**
     * @description get MessageQueuPublish stat
     * @param {server_db_table_MessageQueuePublish[]} messages
     * @returns {{unread:Number, read:number}}
     */
    const messagesStat = messages =>{
        return {unread:messages.filter((/**@type{server_db_table_MessageQueuePublish}*/message)=>
                    (MessageQueueConsume.get({app_id:parameters.app_id, resource_id:null}).result ??[])
                            .filter((/**@type{*}*/messageConsume)=>
                                message.id == messageConsume.message_queue_publish_id).length==0).length,
                read:messages.filter((/**@type{server_db_table_MessageQueuePublish}*/message)=>
                    (MessageQueueConsume.get({app_id:parameters.app_id, resource_id:null}).result ??[])
                            .filter((/**@type{*}*/messageConsume)=>
                                message.id == messageConsume.message_queue_publish_id).length>0).length,
                };
    };
    const IamUser = (await import('../../../../server/db/IamUser.js')).get(parameters.app_id, 
                                                                                   parameters.data.iam_user_id).result[0];
            
    switch (parameters.resource_id){
        case 'COMMON_MESSAGE_CONTACT':{
            if (parameters.data.message){
                /**@type{server_db_table_MessageQueuePublishMessage}*/
                const message = {
                        sender: null,
                        receiver_id:null,
                        host: parameters.host,
                        client_ip:parameters.ip,
                        subject:'CONTACT',
                        message: parameters.data.message
                };
                return messagePublishPost(message);
            }
            else
                return messageError();
        }
        case 'COMMON_MESSAGE_COUNT':{
            const result = messagePublishGet();
            if (result.http)
                return result;
            else  
                return {result: [messagesStat(result.result)],
                        type:'JSON'};
        }
        case 'COMMON_MESSAGE_GET':{
            const result = messagePublishGet();
            if (result.http)
                return result;
            else  
                return {result:[{messages:result.result 
                                            // add message read info
                                            .map((/**@type{server_db_table_MessageQueuePublish}*/message)=>{
                                                return (MessageQueueConsume.get({app_id:parameters.app_id, resource_id:null}).result ??[])
                                                        .filter((/**@type{*}*/messageConsume)=>message.id == messageConsume.message_queue_publish_id).length>0?
                                                            {...message,
                                                                    read:true
                                                            }:
                                                            {...message,
                                                                read:false
                                                            };
                                                
                                            }),
                                ...messagesStat(result.result)
                                }],
                        type:'JSON'};
        }
        case 'COMMON_MESSAGE_READ':{
            if (parameters.data.message_id){
                const result = messagePublishGet();
                if (result.http)
                    return result;
                else
                    //authenticate message id
                    if (result.result
                            .filter((/**@type{server_db_table_MessageQueuePublish}*/message)=>message.id == parameters.data.message_id).length==1){
                        /**@type{server_db_table_MessageQueueConsume}*/
                        const message_queue_message = {
                            message_queue_publish_id:parameters.data.message_id,
                            message:    parameters.data.message,
                            start:      new Date().toISOString(),
                            finished:   new Date().toISOString(),
                            result:     1};
                        //send MessageQueueConsume message
                        return {result:[await MessageQueueConsume.post({app_id:parameters.app_id, 
                                                                        data:message_queue_message})
                                        .then(result=>{
                                            if(result.result?.affectedRows)
                                                return {sent:result.result.affectedRows};
                                            else
                                                return {sent:0};
                                        })
                                        .catch(error=>MessageQueueError.post({  app_id:parameters.app_id,
                                                                                data:{message_queue_publish_id:parameters.data.message_queue_publish_id,
                                                                                message:error, 
                                                                                result:0}}).then(()=>{return {sent:0};}))
                                        ], type:'JSON'};
                    }
                    else
                        return messageError();
            }
            else
                return messageError();
        }
        case 'COMMON_MESSAGE_DELETE':{
            if (parameters.data.message_id)
                return MessageQueuePublish.deleteRecord({app_id:parameters.app_id, resource_id:parameters.data.message_id});
            else
                return messageError();
        }
        case 'COMMON_MESSAGE_SEND':{
            return messageError();
        }
        default:{
            return messageError();
        }
    }    
};
export default appFunction;