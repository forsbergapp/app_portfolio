/** @module server/db/MessageQueuePublish */

/**
 * @import {server_server_response, server_db_common_result_insert, 
 *          server_db_table_MessageQueuePublish,
 *          server_db_table_MessageQueuePublishMessage,
 *          server_db_table_MessageQueuePublishMicroserviceLog
} from '../types.js'
 */

/**@type{import('./ORM.js')} */
const ORM = await import(`file://${process.cwd()}/server/db/ORM.js`);

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
    if (parameters.data.message_queue_publish_id &&
        //message
        ((  parameters.data.sender && 
            parameters.data.host && 
            parameters.data.client_ip && 
            parameters.data.subject && 
            parameters.data.message) ||
        //microservice log or microservice error
        (  (parameters.data.type=='MICROSERVICE_LOG' || parameters.data.type=='MICROSERVICE_ERROR') &&
            parameters.data.message))
    )
        return {
            result:await ORM.Execute({ app_id:parameters.app_id, 
            dml:'POST',
            object:'MessageQueuePublish', 
            post:{data:{...{id:Date.now()}, 
                        ...parameters.data, 
                        ...{created:new Date().toISOString()}
                        }
                }
            }), type:'JSON'};
    else
        return ORM.getError(null, 400);
};

export {get, post};