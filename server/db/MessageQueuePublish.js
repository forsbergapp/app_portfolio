/** @module server/db/MessageQueuePublish */

/**
 * @import {server} from '../types.js'
 */
const {server} = await import ('../server.js');
/**
 * @name get
 * @description Get 
 * @function
 * @param {{app_id:number,
 *          resource_id:number|null}} parameters
 * @returns {server['server']['response'] & {result?:server['ORM']['Object']['MessageQueuePublish'][]}}
 */
const get = parameters =>server.ORM.getObject(parameters.app_id, 'MessageQueuePublish',null, null);
    
/**
 * @name post
 * @description Add record
 * @function
 * @param {{app_id:number,
 *          data:*}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_insert'] }>}
 */
const post = async parameters => {

    if (  parameters.data.service == 'MESSAGE' && 
          'sender' in parameters.data.message && 
          'receiver_id' in parameters.data.message && 
          parameters.data.message?.host && 
          parameters.data.message?.client_ip && 
          parameters.data.message?.subject && 
          parameters.data.message?.message && 
          //no other keys
          Object.keys(parameters.data.message).length==6){
        /**@type{server['ORM']['Object']['MessageQueuePublish']['Message']}*/    
        const message = {Sender:        parameters.data.message.sender,
                         ReceiverId:   parameters.data.message.receiver_id,
                         Host:          parameters.data.message.host,
                         ClientIp:     parameters.data.message.client_ip,
                         Subject:       parameters.data.message.subject,
                         Message:       parameters.data.message.message
        };
        /**@type{server['ORM']['Object']['MessageQueuePublish']}*/
        const data_new = {
            Id:     Date.now(),
            Service:parameters.data.service,
            Message:message, 
            Created:new Date().toISOString()
        };
        return {
            result:await server.ORM.Execute({ app_id:parameters.app_id, 
            dml:'POST',
            object:'MessageQueuePublish', 
            post:{data:data_new}}), type:'JSON'};
    }
    else
        if( parameters.data.service == 'BATCH' &&
            (parameters.data.message?.type=='MICROSERVICE_LOG' || parameters.data.message?.type=='MICROSERVICE_ERROR') &&
            //no other keys
            Object.keys(parameters.data.message).length==2){
            /**@type{server['ORM']['Object']['MessageQueuePublish']['Message']}*/
            const message = {Type:parameters.data.message.type,
                             Message:parameters.data.message.message
            };
            /**@type{server['ORM']['Object']['MessageQueuePublish']}*/
            const data_new = {
                Id:Date.now(),
                Service:parameters.data.service,
                Message:message, 
                Created: new Date().toISOString()
            };
            return {
                result:await server.ORM.Execute({ app_id:parameters.app_id, 
                dml:'POST',
                object:'MessageQueuePublish', 
                post:{data:data_new}}), type:'JSON'};
        }
        else
            return server.ORM.getError(null, 400);
            
    
};
/**
 * @name deleteRecord
 * @description Delete record
 * @function
 * @param {{app_id:number,
*          resource_id:number}} parameters
* @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_delete'] }>}
*/
const deleteRecord = async parameters =>{
   return server.ORM.Execute({app_id:parameters.app_id, dml:'DELETE', object:'MessageQueuePublish', delete:{resource_id:parameters.resource_id, data_app_id:null}}).then((result)=>{
       if (result.AffectedRows>0)
           return {result:result, type:'JSON'};
       else
           return server.ORM.getError(parameters.app_id, 404);
   });
};
export {get, post, deleteRecord};