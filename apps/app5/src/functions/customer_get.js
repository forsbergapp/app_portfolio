/**
 * @module apps/app5/src/functions/customer_get
 */
/**
 * @import {server} from '../../../../server/types.js'
 */
const {server} = await import('../../../../server/server.js');
/**
 * @name customerGet
 * @description Customer get
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
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['Object']['AppDataResourceMaster'][]}>}
 */
const customerGet = async parameters =>{
    
    /**@type{server['ORM']['Object']['AppDataEntity']} */
    const Entity    = server.ORM.db.AppDataEntity.get({   app_id:parameters.app_id, 
                                            resource_id:null, 
                                            data:{data_app_id:parameters.data.data_app_id}}).result[0];
    return server.ORM.db.AppDataResourceMaster.get({  app_id:parameters.app_id, 
                                        resource_id:parameters.data.resource_id, 
                                        data:{  iam_user_id:parameters.data.iam_user_id,
                                                data_app_id:parameters.data.data_app_id,
                                                resource_name:'CUSTOMER',
                                                app_data_entity_id:Entity.Id
                                        }});
};
export default customerGet;