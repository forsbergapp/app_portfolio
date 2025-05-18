/**
 * @module apps/common/src/functions/common_message
*/

/**
 * @import {server_server_response,server_db_table_MessageQueuePublishMessage} from '../../../../server/types.js'
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
 * @returns {Promise.<server_server_response & {result?:*[]}>}
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
switch (parameters.resource_id){
    case 'COMMON_MESSAGE_CONTACT':{
        if (parameters.data.message){
            /**@type{server_db_table_MessageQueuePublishMessage}*/
            const message = {
                    sender: 'CONTACT',
                    receiver_id:null,
                    host: parameters.host,
                    client_ip:parameters.ip,
                    subject:parameters.data.subject,
                    message: parameters.data.message
            };
            return MessageQueuePublish.post({app_id:parameters.app_id, data:message});
        }
        else
            return messageError();
    }
    case 'COMMON_MESSAGE_COUNT':{
        return messageError();
    }
    case 'COMMON_MESSAGE_GET':{
        return messageError();
    }
    case 'COMMON_MESSAGE_READ':{
        return messageError();
    }
    case 'COMMON_MESSAGE_DELETE':{
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