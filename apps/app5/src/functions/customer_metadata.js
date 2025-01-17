/**
 * @module apps/app5/src/functions/customer_metadata
 */
/**
 * @import {server_server_response, server_db_sql_result_app_data_resource_master_get} from '../../../../server/types.js'
 * @typedef {server_server_response & {result?:server_db_sql_result_app_data_resource_master_get[]}} customerGet
 * 
 */
/**
 * @name customerMetadata
 * @description Get customer metadata
 * @function
 * @param {{app_id:number,
 *          data:*,
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          iam:string,
 *          locale:string}} parameters
 * @returns {Promise.<customerMetadata>}
 */
const customerMetadata = async parameters =>{
    /**@type{import('../../../../server/db/dbModelAppDataResourceMaster.js')} */
    const dbModelAppDataResourceMaster = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceMaster.js`);
    
    return await dbModelAppDataResourceMaster.get({ app_id:parameters.app_id, 
                                                    resource_id:parameters.data.resource_id, 
                                                    data:{  user_account_id:parameters.data.user_account_id,
                                                            data_app_id:parameters.data.data_app_id,
                                                            resource_name:'CUSTOMER',
                                                            entity_id:parameters.data.entity_id,
                                                            user_null:'1'
                                                    }});
};
export default customerMetadata;