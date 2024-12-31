/**
 * @module apps/app5/src/functions/customer_get
 */

/**
 * @name customer_get
 * @description Customer get
 * @function
 * @param {number} app_id
 * @param {*} data
 * @param {string} user_agent
 * @param {string} ip
 * @param {string} locale
 * @param {import('../../../../server/types.js').server_server_res} res
 * @returns {Promise.<import('../../../../server/types.js').server_db_sql_result_app_data_resource_master_get[]>}
 */
const customer_get = async (app_id, data, user_agent, ip, locale, res) =>{
    /**@type{import('../../../../server/db/dbModelAppDataResourceMaster.js')} */
    const dbModelAppDataResourceMaster = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceMaster.js`);
    
    return await dbModelAppDataResourceMaster.get({ app_id:app_id, 
                                                    resource_id:data.resource_id, 
                                                    data:{  user_account_id:data.user_account_id,
                                                            data_app_id:data.data_app_id,
                                                            resource_name:'CUSTOMER',
                                                            entity_id:data.entity_id,
                                                            user_null:'0'
                                                    }});
};
export default customer_get;