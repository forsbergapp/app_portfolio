/** @module server/db/IamUserAppDataPost */

/**
 * @import {server_server_response,
 *          server_db_table_iam_user_app_data_post,server_db_table_iam_user_app,server_db_table_iam_user_app_data_post_like,
 *          server_db_common_result_insert,server_db_common_result_update, server_db_common_result_delete} from '../types.js'
 */
/**@type{import('./file.js')} */
const {fileDBGet, fileDBPost,fileDBUpdate, fileDBDelete} = await import(`file://${process.cwd()}/server/db/file.js`);
/**@type{import('../db/common.js')} */
const { dbCommonRecordError} = await import(`file://${process.cwd()}/server/db/common.js`);
/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
/**@type{import('./IamUserApp.js')} */
const IamUserApp = await import(`file://${process.cwd()}/server/db/IamUserApp.js`);
/**
 * @name get
 * @description Get record
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{  data_app_id:number|null,
 *                  iam_user_id:number|null}}} parameters
 * @returns {server_server_response & {result?:server_db_table_iam_user_app_data_post[] }}
 */
const get = parameters =>{
    const result = fileDBGet(parameters.app_id, 'IAM_USER_APP_DATA_POST',parameters.resource_id, parameters.data.data_app_id??null).rows
                    .filter((/**@type{server_db_table_iam_user_app_data_post}*/row)=>
                        IamUserApp.get({ app_id:parameters.app_id,
                                        resource_id:row.iam_user_app_id, 
                                        data:{iam_user_id:parameters.data.iam_user_id, data_app_id:parameters.data.data_app_id}}).result.length>0
                    );
    if (result.length>0 || parameters.resource_id==null)
        return {result:result, type:'JSON'};
    else
        return dbCommonRecordError(parameters.app_id, 404);
};

/**
 * @name getViewProfileUserPosts
 * @description Get user profile post
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          data:{id_current_user?:string|null}}} parameters
 * @returns {Promise.<server_server_response & {result?:{id:server_db_table_iam_user_app_data_post['id'],
 *                                                       description:string,
 *                                                       iam_user_id:server_db_table_iam_user_app['iam_user_id'],
 *                                                       json_data:server_db_table_iam_user_app_data_post['json_data'],
 *                                                       count_likes:number,
 *                                                       count_views:number,
 *                                                       liked:number}[] }>}
 */
const getViewProfileUserPosts = async parameters =>{
    /**@type{import('./IamUserApp.js')} */
    const IamUserApp = await import(`file://${process.cwd()}/server/db/IamUserApp.js`);
    /**@type{import('./IamUserAppDataPostLike.js')} */
    const IamUserAppDataPostLike = await import(`file://${process.cwd()}/server/db/IamUserAppDataPostLike.js`);
    /**@type{import('./IamUserAppDataPostView.js')} */
    const IamUserAppDataPostView = await import(`file://${process.cwd()}/server/db/IamUserAppDataPostView.js`);
    /**@type{server_server_response & {result?:server_db_table_iam_user_app_data_post[]}} */
    const result = get({app_id:parameters.app_id, resource_id:null, data:{data_app_id:parameters.app_id, iam_user_id:parameters.resource_id}});
    if (result.result)
        if (result.result.length>0)
            return result.result
                    .map((/**@type{server_db_table_iam_user_app_data_post}*/row)=>{
                        return {
                            id: row.id,
                            description:row.json_data?JSON.parse(row.json_data).description:null, 
                            iam_user_id:IamUserApp.get({app_id:parameters.app_id, 
                                                        resource_id:row.iam_user_app_id, 
                                                        data:{iam_user_id:parameters.resource_id, data_app_id:parameters.app_id}}).result[0]?.iam_user_id,
                            count_likes:IamUserAppDataPostLike.get({app_id:parameters.app_id, 
                                                        resource_id:row.id, 
                                                        data:{iam_user_id:null, data_app_id:parameters.app_id}}).result.length,
                            count_views:IamUserAppDataPostView.get({app_id:parameters.app_id, 
                                                        resource_id:row.id, 
                                                        data:{iam_user_id:null, data_app_id:parameters.app_id}}).result.length,
                            liked: IamUserAppDataPostLike.get({app_id:parameters.app_id, 
                                                        resource_id:row.id, 
                                                        data:{iam_user_id:serverUtilNumberValue(parameters.data?.id_current_user), data_app_id:parameters.app_id}}).result.length,
                            };
                        });
        else
            return dbCommonRecordError(parameters.app_id, 404);
    else
        return result;
};

/**
 * @name getViewProfileStatLike
 * @description Get profile stat like
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number}} parameters
 * @returns {Promise.<server_server_response & {result?:{count_user_post_likes:number, count_user_post_liked:number}}>}
 */
 const getViewProfileStatLike = async parameters =>{

    /**@type{import('./IamUserAppDataPostLike.js')} */
    const IamUserAppDataPostLike = await import(`file://${process.cwd()}/server/db/IamUserAppDataPostLike.js`);
    return {result:{
                    count_user_post_likes:get({ app_id:parameters.app_id, 
                                                resource_id:null, 
                                                data:{  iam_user_id:parameters.resource_id, 
                                                        data_app_id:parameters.app_id}}).result
                                            .filter((/**@type{server_db_table_iam_user_app_data_post}*/row)=>
                                                IamUserAppDataPostLike.get({app_id:parameters.app_id, 
                                                                            resource_id:null, 
                                                                            data:{  iam_user_id:parameters.resource_id, 
                                                                                    data_app_id:parameters.app_id}}).result
                                                .filter((/**@type{server_db_table_iam_user_app_data_post_like}*/row_like)=>
                                                    row.id == row_like.iam_user_app_data_post_id
                                                ).length>0
                                            ),
                    count_user_post_liked:IamUserAppDataPostLike.get({  app_id:parameters.app_id, 
                                                                        resource_id:null, 
                                                                        data:{  iam_user_id:parameters.resource_id, 
                                                                                data_app_id:parameters.app_id}}).result
                                            .filter((/**@type{server_db_table_iam_user_app_data_post_like}*/row)=>
                                                get({app_id:parameters.app_id, 
                                                    resource_id:null, 
                                                    data:{  iam_user_id:parameters.resource_id, 
                                                            data_app_id:parameters.app_id}}).result
                                                .filter((/**@type{server_db_table_iam_user_app_data_post}*/data_post)=>row.iam_user_app_data_post_id==data_post.id
                                                ).length>0
                                            )
                    },
            type:'JSON'};
 };
/**
 * @name post
 * @description Create record
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          data:{  initial:number,
 *                  description:string,
 *                  json_data:*,
 *                  data_app_id:number,
 *                  iam_user_id:number}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert}>}
 */
const post = async parameters => {
    //check required attributes
    if (parameters.data.iam_user_id==null && parameters.data.data_app_id==null){
        return dbCommonRecordError(parameters.app_id, 400);
    }
    else{
        /**@type{import('./IamUserApp.js')} */
        const IamUserApp = await import(`file://${process.cwd()}/server/db/IamUserApp.js`);

        /**@type{server_db_table_iam_user_app_data_post} */
        const data_new =     {
                                id:Date.now(),
                                iam_user_app_id:IamUserApp.get({app_id:parameters.app_id, 
                                                                resource_id:null, 
                                                                data:{  
                                                                        iam_user_id:parameters.data.iam_user_id,
                                                                        data_app_id:parameters.data.data_app_id
                                                                }}).result[0]?.id, 
                                json_data:parameters.data.json_data?JSON.stringify(parameters.data.json_data):null,
                                created:new Date().toISOString(),
                                modified:null
                        };
        return fileDBPost(parameters.app_id, 'IAM_USER_APP_DATA_POST', data_new).then((result)=>{
            if (result.affectedRows>0){
                result.insertId=data_new.id;
                return {result:result, type:'JSON'};
            }
            else
                return dbCommonRecordError(parameters.app_id, 404);
        });
    }
};
/**
 * @name update
 * @description Update record
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          data:{  json_data:string,
 *                  data_app_id:number|null,                    
 *                  iam_user_id:number|null}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
 */
const update = async parameters =>{
    /**@type{server_db_table_iam_user_app_data_post}*/
    const user_app_data_post = get({app_id:parameters.app_id, 
                                    resource_id:parameters.resource_id, 
                                    data:{data_app_id:parameters.data.data_app_id, iam_user_id:parameters.data.iam_user_id}}).result[0];
    if (user_app_data_post){
        /**@type{server_db_table_iam_user_app_data_post} */
        const data_update = {};
        //allowed parameters to update:
        if (parameters.data.json_data!=null)
            data_update.json_data = JSON.stringify(parameters.data.json_data);
        data_update.modified = new Date().toISOString();
        if (Object.entries(data_update).length>0)
            return fileDBUpdate(parameters.app_id, 'IAM_USER_APP_DATA_POST', parameters.resource_id ?? user_app_data_post.id, null, data_update).then((result)=>{
                if (result.affectedRows>0)
                    return {result:result, type:'JSON'};
                else
                    return dbCommonRecordError(parameters.app_id, 404);
            });
        else
            return dbCommonRecordError(parameters.app_id, 400);
    }
    else
        return dbCommonRecordError(parameters.app_id, 404);
};
/**
 * @name deleteRecord
 * @description Delete record
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          data:{  data_app_id:number|null,                    
 *                  iam_user_id:number|null}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_delete }>}
 */
const deleteRecord = async parameters =>{
    /**@type{server_db_table_iam_user_app_data_post}*/
    const user_app_data_post = get({app_id:parameters.app_id, 
                                    resource_id:parameters.resource_id, 
                                    data:{data_app_id:parameters.data.data_app_id, iam_user_id:parameters.data.iam_user_id}}).result[0];
    if (user_app_data_post){
        return fileDBDelete(parameters.app_id, 'IAM_USER_APP_DATA_POST', parameters.resource_id ?? user_app_data_post.id, null).then((result)=>{
            if (result.affectedRows>0)
                return {result:result, type:'JSON'};
            else
                return dbCommonRecordError(parameters.app_id, 404);
        });
    }
    else
        return dbCommonRecordError(parameters.app_id, 404);
};
export {get, getViewProfileUserPosts, getViewProfileStatLike, post, update, deleteRecord};