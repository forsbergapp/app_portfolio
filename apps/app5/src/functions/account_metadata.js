/**
 * @module apps/app5/src/functions/account_metadata
 */
/**
 * @name account_metadata
 * @description Gets account metadata
 * @function
 * @param {number} app_id
 * @param {*} data
 * @param {string} user_agent
 * @param {string} ip
 * @param {string} locale
 * @param {import('../../../../server/types.js').server_server_res} res
 * @returns {Promise.<import('../../../../server/types.js').server_db_sql_result_app_data_resource_master_get[]>}
 */
const account_metadata = async (app_id, data, user_agent, ip, locale, res) =>{
    /**@type{import('../../../../server/db/dbModelAppDataResourceMaster.js')} */
    const dbModelAppDataResourceMaster = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceMaster.js`);
    
    return await dbModelAppDataResourceMaster.get({ app_id:app_id, 
                                                    resource_id:data.resource_id, 
                                                    data:{  user_account_id:data.user_account_id,
                                                            data_app_id:data.data_app_id,
                                                            resource_name:'ACCOUNT',
                                                            entity_id:data.entity_id, 
                                                            user_null:'1'
                                                    }});
};
export default account_metadata;