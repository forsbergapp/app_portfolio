/**
 * @module apps/app5/src/functions/account_metadata
 */
/**
 * @import {server_server_response, server_db_table_AppDataEntity, server_db_table_AppDataResourceMaster} from '../../../../server/types.js'
 */
/**
 * @name accountMetadata
 * @description Gets account metadata
 * @function
 * @param {{app_id:number,
 *          data:{ resource_id:number|null,
 *                 data_app_id:number},
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          idToken:string,
 *          authorization:string,
 *          locale:string}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_table_AppDataResourceMaster[]}>}
 */
const accountMetadata = async parameters =>{
        /**@type{import('../../../../server/db/AppDataEntity.js')} */
        const AppDataEntity = await import(`file://${process.cwd()}/server/db/AppDataEntity.js`);
        /**@type{server_db_table_AppDataEntity} */
        const Entity            = AppDataEntity.get({  app_id:parameters.app_id, 
                                                resource_id:null, 
                                                data:{data_app_id:parameters.data.data_app_id}}).result[0];
        /**@type{import('../../../../server/db/AppDataResourceMaster.js')} */
        const AppDataResourceMaster = await import(`file://${process.cwd()}/server/db/AppDataResourceMaster.js`);
        
        return AppDataResourceMaster.get({      app_id:parameters.app_id, 
                                                resource_id:parameters.data.resource_id, 
                                                data:{  iam_user_id:null,
                                                        data_app_id:null,
                                                        resource_name:'ACCOUNT',
                                                        app_data_entity_id:Entity.id
                                                }});
        };
export default accountMetadata;