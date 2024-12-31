/**
 * @module apps/app5/src/functions/transaction_metadata
 */

/**
 * @name transaction_metadata
 * @description Get transaction metadata
 * @function
 * @param {number} app_id
 * @param {*} data
 * @param {string} user_agent
 * @param {string} ip
 * @param {string} locale
 * @param {import('../../../../server/types.js').server_server_res} res
 * @returns {Promise.<import('../../../../server/types.js').server_db_sql_result_app_data_resource_master_get[]>}
 */
const transaction_metadata = async (app_id, data, user_agent, ip, locale, res) =>{
    /**@type{import('../../../../server/db/dbModelAppDataResourceMaster.js')} */
    const dbModelAppDataResourceMaster = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceMaster.js`);
    
    return await dbModelAppDataResourceMaster.get({ app_id:app_id, 
                                                    resource_id:null, 
                                                    data:{  data_app_id:data.data_app_id, 
                                                            resource_name:'TRANSACTION_METADATA', 
                                                            user_null:'1'}});
};
export default transaction_metadata;