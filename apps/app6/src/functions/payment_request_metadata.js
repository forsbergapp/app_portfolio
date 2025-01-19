/**
 * @module apps/app6/src/functions/payment_request_metadata
 */
/**
 * @import {server_server_response, server_db_sql_result_app_data_resource_master_get} from '../../../../server/types.js'
 * @typedef {server_server_response & {result?:server_db_sql_result_app_data_resource_master_get[]}} paymentRequestMetadata
 */
/**
 * @name payment_request_metadata
 * @description Get payment request metadata
 * @function
 * @param {{app_id:number,
 *          data:*,
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          idToken:string,
 *          locale:string}} parameters
 * @returns {Promise.<paymentRequestMetadata>}
 */
const paymentRequestMetadata = async parameters =>{
    /**@type{import('../../../../server/db/dbModelAppDataResourceMaster.js')} */
    const dbModelAppDataResourceMaster = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceMaster.js`);
    
    return await dbModelAppDataResourceMaster.get({ app_id:parameters.app_id, 
                                                    resource_id:null, 
                                                    data:{  data_app_id:parameters.data.data_app_id,
                                                            resource_name:'PAYMENT_REQUEST_METADATA',
                                                            user_null:'1'
                                                    }});
};
export default paymentRequestMetadata;