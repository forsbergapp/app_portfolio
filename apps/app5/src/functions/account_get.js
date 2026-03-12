/**
 * @description account get
 * @module apps/app5/src/functions/account_get
 */
/**
 * @import types_server from '../../../../server/types.d.ts'
 * @import types_app from '../../types.d.ts'
 */
const {server} = await import('../../../../server/server.js');
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
 *          accept_language:string}} parameters
 * @returns {Promise.<types_server.server['response'] & {result:(types_server.ORM['Object']['AppDataResourceDetail'] & {Document:types_app.bank_account})[]}>}
 */
const accountGet = async parameters =>{

    /**@ts-ignore @type{types_server.ORM['Object']['AppDataEntity']} */
    const Entity            = server.ORM.db.AppDataEntity.get({  app_id:parameters.app_id, 
                                            resource_id:null, 
                                            data:{data_app_id:parameters.data.data_app_id}}).result[0];
    /**@ts-ignore */
    return server.ORM.db.AppDataResourceDetail.get({ app_id:parameters.app_id, 
                                                            resource_id:parameters.data.resource_id, 
                                                            data:{  iam_user_id:parameters.data.iam_user_id,
                                                                    data_app_id:parameters.data.data_app_id,
                                                                    resource_name:'ACCOUNT',
                                                                    app_data_resource_master_id:null,
                                                                    app_data_entity_id:Entity.Id}});
};
export default accountGet;