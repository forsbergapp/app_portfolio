/**
 * @module apps/app5/src/functions/account_get
 */
/**
 * @import {server_server_response, server_db_table_AppDataEntity, server_db_table_AppDataResourceDetail} from '../../../../server/types.js'
 */
/**
 * @name accountGet
 * @description Get bank account
 * @function
 * @param {{app_id:number,
 *          data:{  resource_id:number|null,
 *                  iam_user_id:number, 
 *                  data_app_id:number},
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          idToken:string,
 *          authorization:string,
 *          locale:string}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_table_AppDataResourceDetail[]}>}
 */
const accountGet = async parameters =>{
    /**@type{import('../../../../server/db/AppDataEntity.js')} */
    const AppDataEntity = await import(`file://${process.cwd()}/server/db/AppDataEntity.js`);
    /**@type{server_db_table_AppDataEntity} */
    const Entity            = AppDataEntity.get({  app_id:parameters.app_id, 
                                            resource_id:null, 
                                            data:{data_app_id:parameters.data.data_app_id}}).result[0];

    /**@type{import('../../../../server/db/AppDataResourceDetail.js')} */
    const AppDataResourceDetail = await import(`file://${process.cwd()}/server/db/AppDataResourceDetail.js`);
    
    return AppDataResourceDetail.get({ app_id:parameters.app_id, 
                                                            resource_id:parameters.data.resource_id, 
                                                            data:{  iam_user_id:parameters.data.iam_user_id,
                                                                    data_app_id:parameters.data.data_app_id,
                                                                    resource_name:'ACCOUNT',
                                                                    app_data_resource_master_id:null,
                                                                    app_data_entity_id:Entity.id}});
};
export default accountGet;