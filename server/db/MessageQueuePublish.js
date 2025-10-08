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

    if (  parameters.data.Service == 'MESSAGE' && 
          'Sender' in parameters.data.Message && 
          'ReceiverId' in parameters.data.Message && 
          parameters.data.Message?.Host && 
          parameters.data.Message?.ClientIp && 
          parameters.data.Message?.Subject && 
          parameters.data.Message?.Message && 
          //no other keys
          Object.keys(parameters.data.Message).length==6){
        /**@type{server['ORM']['Object']['MessageQueuePublish']['Message']}*/    
        const message = {Sender:        parameters.data.Message.Sender,
                         ReceiverId:    parameters.data.Message.ReceiverId,
                         Host:          parameters.data.Message.Host,
                         ClientIp:      parameters.data.Message.ClientIp,
                         Subject:       parameters.data.Message.Subject,
                         Message:       parameters.data.Message.Message
        };
        /**@type{server['ORM']['Object']['MessageQueuePublish']}*/
        const data_new = {
            Id:     Date.now(),
            Service:parameters.data.Service,
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
        if( parameters.data.Service == 'BATCH' &&
            (parameters.data.Message?.Type=='MICROSERVICE_LOG' || parameters.data.Message?.Type=='MICROSERVICE_ERROR') &&
            //no other keys
            Object.keys(parameters.data.Message).length==2){
            /**@type{server['ORM']['Object']['MessageQueuePublish']['Message']}*/
            const message = {Type:parameters.data.Message.type,
                             Message:parameters.data.Message.message
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