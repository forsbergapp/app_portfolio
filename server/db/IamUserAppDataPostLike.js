/** @module server/db/IamUserAppDataPostLike */

/**
 * @import {server_server_response,
 *          server_db_table_IamUserAppDataPostLike,server_db_table_IamUserApp,
 *          server_db_common_result_delete,
 *          server_db_common_result_insert} from '../types.js'
 */
const ORM = await import('./ORM.js');
const IamUserApp = await import('./IamUserApp.js');
/**
 * @name get
 * @description Get record
 * @function
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{  iam_user_id:number|null,
 *                  data_app_id:number|null,
 *                  iam_user_app_data_post_id:number|null}}} parameters
 * @returns {server_server_response & {result?:server_db_table_IamUserAppDataPostLike[] }}
 */
const get = parameters =>{
    const IamUserApp_records =  IamUserApp.get({ app_id:parameters.app_id,
                                                resource_id:null, 
                                                data:{iam_user_id:parameters.data.iam_user_id, data_app_id:parameters.data.data_app_id}}).result;
    const result = ORM.getObject(parameters.app_id, 'IamUserAppDataPostLike',parameters.resource_id, null).rows
                        .filter((/**@type{server_db_table_IamUserAppDataPostLike}*/row)=>
                            row.iam_user_app_data_post_id == (parameters.data.iam_user_app_data_post_id ?? row.iam_user_app_data_post_id) &&
                            IamUserApp_records
                            .filter((/**@type{server_db_table_IamUserApp}*/rowIamUserApp)=>
                                row.iam_user_app_id == rowIamUserApp.id
                            )
                            .length>0
                        );
    if (result.length>0 || parameters.resource_id==null)
        return {result:result, type:'JSON'};
    else
        return ORM.getError(parameters.app_id, 404);
};

/**
 * @name post
 * @description Create record
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          data: { iam_user_app_data_post_id:server_db_table_IamUserAppDataPostLike['iam_user_app_data_post_id'],
 *                  iam_user_id:server_db_table_IamUserApp['iam_user_id'],
 *                  data_app_id:server_db_table_IamUserApp['app_id'],}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async parameters =>{
    //check required attributes
    if (parameters.data.iam_user_id==null || parameters.data.data_app_id==null || parameters.data.iam_user_app_data_post_id==null){
        return ORM.getError(parameters.app_id, 400);
    }
    else{
        /**@type{server_db_table_IamUserApp} */
        const result = IamUserApp.get({app_id:parameters.app_id, resource_id:null, data:{   iam_user_id:parameters.data.iam_user_id, 
                                                                                            data_app_id:parameters.data.data_app_id}}).result[0];
        /**@type{server_db_table_IamUserAppDataPostLike} */
        const data_new =     {
                                id:Date.now(),
                                /**@ts-ignore */
                                iam_user_app_id:result.id, 
                                iam_user_app_data_post_id:parameters.data.iam_user_app_data_post_id,
                                created:new Date().toISOString()
                        };
        return ORM.Execute({app_id:parameters.app_id, dml:'POST', object:'IamUserAppDataPostLike', post:{data:data_new}}).then((result)=>{
            if (result.affectedRows>0){
                result.insertId=data_new.id;
                return {result:result, type:'JSON'};
            }
            else
                return ORM.getError(parameters.app_id, 404);
        });
    }
};

/**
 * @name deleteRecord
 * @description Delete record
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          data: { iam_user_app_data_post_id:server_db_table_IamUserAppDataPostLike['iam_user_app_data_post_id'],
 *                  iam_user_id:server_db_table_IamUserApp['iam_user_id'],
 *                  data_app_id:server_db_table_IamUserApp['iam_user_id'],}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_delete }>}
 */
const deleteRecord = async parameters =>{
    const result = get({app_id:parameters.app_id, resource_id:null, data:{  iam_user_id:parameters.data.iam_user_id, 
                                                                            data_app_id:parameters.data.data_app_id,
                                                                            iam_user_app_data_post_id:parameters.data.iam_user_app_data_post_id}}).result[0];
    return ORM.Execute({  app_id:parameters.app_id, 
                                dml:'DELETE', 
                                object:'IamUserAppDataPostLike', 
                                delete:{resource_id:parameters.resource_id ?? result.id, data_app_id:null}}).then((result)=>{
        if (result.affectedRows>0)
            return {result:result, type:'JSON'};
        else
            return ORM.getError(parameters.app_id, 404);
    });
};

export {get, post, deleteRecord};