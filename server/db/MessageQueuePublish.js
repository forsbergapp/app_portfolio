/** @module server/db/MessageQueuePublish */

/**
 * @import {server_server_response, server_db_common_result_insert, 
 *          server_db_table_MessageQueuePublish,
 *          server_db_table_MessageQueuePublishMessage,
 *          server_db_table_MessageQueuePublishMicroserviceLog
} from '../types.js'
 */

const ORM = await import('./ORM.js');

/**
 * @name get
 * @description Get user 
 * @function
 * @param {{app_id:number,
 *          resource_id:number}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_table_MessageQueuePublish[]}>}
 */
const get = async parameters =>{
    const result = await ORM.Execute({app_id:0, dml:'GET', object:'MessageQueuePublish', get:{resource_id:parameters.resource_id, partition:null}});
    if (result.rows.length>0)
        return {result:result.rows, type:'JSON'};
    else
        return ORM.getError(null, 404);
};
/**
 * @name post
 * @description Add record
 * @function
 * @param {{app_id:number,
 *          data:*}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async parameters => {

    if (  parameters.data.service == 'MESSAGE' && 
          parameters.data.sender && 
          parameters.data.receiver_id && 
          parameters.data.host && 
          parameters.data.client_ip && 
          parameters.data.subject && 
          parameters.data.message && 
          //no other keys
          Object.keys(parameters.data).length==6){
        /**@type{server_db_table_MessageQueuePublishMessage}*/    
        const message = {sender:parameters.data.sender,
                         receiver_id:parameters.data.receiver_id,
                         host:parameters.data.host,
                         client_ip:parameters.data.client_ip,
                         subject:parameters.data.subject,
                         message:parameters.data.message
        };
        /**@type{server_db_table_MessageQueuePublish}*/
        const data_new = {
            id:Date.now(),
            service:parameters.data.service,
            message:message, 
            created: new Date().toISOString()
        };
        return {
            result:await ORM.Execute({ app_id:parameters.app_id, 
            dml:'POST',
            object:'MessageQueuePublish', 
            post:{data:data_new}}), type:'JSON'};
    }
    else
        if( (parameters.data.service == 'BATCH' || parameters.data.service == 'GEOLOCATION') &&
            (parameters.data.type=='MICROSERVICE_LOG' || parameters.data.type=='MICROSERVICE_ERROR') &&
            parameters.data.message &&
            //no other keys
            Object.keys(parameters.data).length==3){
            /**@type{server_db_table_MessageQueuePublishMicroserviceLog}*/
            const message = {type:parameters.data.type,
                             message:parameters.data.message
            };
            /**@type{server_db_table_MessageQueuePublish}*/
            const data_new = {
                id:Date.now(),
                service:parameters.data.service,
                message:message, 
                created: new Date().toISOString()
            };
            return {
                result:await ORM.Execute({ app_id:parameters.app_id, 
                dml:'POST',
                object:'MessageQueuePublish', 
                post:{data:data_new}}), type:'JSON'};
        }
        else
            return ORM.getError(null, 400);
            
    
};

export {get, post};