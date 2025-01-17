/**
 * @module apps/app5/src/functions/transaction_metadata
 */

/**
 * @import {server_server_response, server_db_sql_result_app_data_resource_master_get} from '../../../../server/types.js'
 * @typedef {server_server_response & {result?:server_db_sql_result_app_data_resource_master_get[]}} transactionMetadata
 */

/**
 * @name transactionMetadata
 * @description Get transaction metadata
 * @function
 * @param {{app_id:number,
 *          data:*,
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          iam:string,
 *          locale:string}} parameters
 * @returns {Promise.<transactionMetadata>}
 */
const transactionMetadata = async parameters =>{
    /**@type{import('../../../../server/db/dbModelAppDataResourceMaster.js')} */
    const dbModelAppDataResourceMaster = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceMaster.js`);
    
    return dbModelAppDataResourceMaster.get({ app_id:parameters.app_id, 
                                                    resource_id:null, 
                                                    data:{  data_app_id:parameters.data.data_app_id, 
                                                            resource_name:'TRANSACTION_METADATA', 
                                                            user_null:'1'}
                                            });
};
export default transactionMetadata;