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
 * @returns {server['server']['response'] & {result?:server['ORM']['MessageQueuePublish'][]}}
 */
const get = parameters =>server.ORM.getObject(parameters.app_id, 'MessageQueuePublish',null, null);
    
/**
 * @name post
 * @description Add record
 * @function
 * @param {{app_id:number,
 *          data:*}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORMMetaData']['common_result_insert'] }>}
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
        /**@type{server['ORM']['MessageQueuePublish']['message']}*/    
        const message = {sender:        parameters.data.message.sender,
                         receiver_id:   parameters.data.message.receiver_id,
                         host:          parameters.data.message.host,
                         client_ip:     parameters.data.message.client_ip,
                         subject:       parameters.data.message.subject,
                         message:       parameters.data.message.message
        };
        /**@type{server['ORM']['MessageQueuePublish']}*/
        const data_new = {
            id:     Date.now(),
            service:parameters.data.service,
            message:message, 
            created:new Date().toISOString()
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
            /**@type{server['ORM']['MessageQueuePublish']['message']}*/
            const message = {type:parameters.data.message.type,
                             message:parameters.data.message.message
            };
            /**@type{server['ORM']['MessageQueuePublish']}*/
            const data_new = {
                id:Date.now(),
                service:parameters.data.service,
                message:message, 
                created: new Date().toISOString()
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
* @returns {Promise.<server['server']['response'] & {result?:server['ORMMetaData']['common_result_delete'] }>}
*/
const deleteRecord = async parameters =>{
   return server.ORM.Execute({app_id:parameters.app_id, dml:'DELETE', object:'MessageQueuePublish', delete:{resource_id:parameters.resource_id, data_app_id:null}}).then((result)=>{
       if (result.affectedRows>0)
           return {result:result, type:'JSON'};
       else
           return server.ORM.getError(parameters.app_id, 404);
   });
};
export {get, post, deleteRecord};