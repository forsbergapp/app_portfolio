/**
 * @module apps/app6/src/functions/product_metadata
 */
/**
 * @import {server_server_response, server_db_sql_result_app_data_resource_master_get} from '../../../../server/types.js'
 */
/**
 * @name productMetadata
 * @description Get product metadata
 * @function
 * @param {{app_id:number,
 *          data:*,
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          idToken:string,
 *          authorization:string,
 *          locale:string}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_sql_result_app_data_resource_master_get[]}>}
 */
const productMetadata = async parameters =>{
    /**@type{import('../../../../server/db/dbModelAppDataResourceMaster.js')} */
    const dbModelAppDataResourceMaster = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceMaster.js`);
    
    return dbModelAppDataResourceMaster.get({ app_id:parameters.app_id, 
                                                    resource_id:parameters.data.resource_id, 
                                                    data:{  data_app_id:parameters.data.data_app_id,
                                                            resource_name:'PRODUCT_METADATA',
                                                            entity_id:parameters.data.entity_id,
                                                            user_null:'1'
                                                    }});
};
export default productMetadata;