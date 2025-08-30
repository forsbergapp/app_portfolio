/**
 * @module apps/common/src/functions/common_app_data_metadata
 */
/**
 * @import {server_server_response, 
 *          server_db_table_AppDataEntity, 
 *          server_db_table_AppDataResourceMaster} from '../../../../server/types.js'
 * 
 */
const {server} = await import('../../../../server/server.js');
/**
 * @name appDataMetadata
 * @description Get customer metadata
 * @function
 * @param {{app_id:number,
*          data:{resource_id:number|null, 
*                resource_name:string,
*                data_app_id:number},
*          user_agent:string,
*          ip:string,
*          host:string,
*          idToken:string,
*          authorization:string,
*          locale:string}} parameters
* @returns {Promise.<server_server_response & {result?:server_db_table_AppDataResourceMaster[]}>}
*/
const appDataMetadata = async parameters =>{

   /**@type{server_db_table_AppDataEntity} */
   const Entity    = server.ORM.db.AppDataEntity.get({   app_id:parameters.app_id, 
                                           resource_id:null, 
                                           data:{data_app_id:parameters.data.data_app_id}}).result[0];
  
   return server.ORM.db.AppDataResourceMaster.get({  app_id:parameters.app_id, 
                                       resource_id:parameters.data.resource_id, 
                                       data:{  iam_user_id:null,
                                               data_app_id:null,
                                               resource_name:parameters.data.resource_name,
                                               app_data_entity_id:Entity.id
                                   }});
};
export default appDataMetadata;