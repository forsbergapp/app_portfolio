/** @module server/db/IamUserAppDataPost */

/**
 * @import {server_server_response,
 *          server_db_table_IamUserAppDataPost,server_db_table_IamUser, server_db_table_IamUserApp, server_db_table_IamUserAppDataPostLike,
 *          server_db_common_result_insert,server_db_common_result_update, server_db_common_result_delete} from '../types.js'
 */
/**@type{import('./ORM.js')} */
const ORM = await import(`file://${process.cwd()}/server/db/ORM.js`);

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
 * @returns {server_server_response & {result?:server_db_table_IamUserAppDataPost[] }}
 */
const get = parameters =>{
    const result = ORM.getObject(parameters.app_id, 'IamUserAppDataPost',parameters.resource_id, null).rows
                    .filter((/**@type{server_db_table_IamUserAppDataPost}*/row)=>
                        IamUserApp.get({ app_id:parameters.app_id,
                                        resource_id:null, 
                                        data:{iam_user_id:parameters.data.iam_user_id, data_app_id:parameters.data.data_app_id}}).result
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
 * @name getViewProfileUserPosts
 * @description Get user profile post
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          data:{id_current_user?:string|null}}} parameters
 * @returns {Promise.<server_server_response & {result?:{id:server_db_table_IamUserAppDataPost['id'],
 *                                                       description:string,
 *                                                       iam_user_id:server_db_table_IamUserApp['iam_user_id'],
 *                                                       json_data:server_db_table_IamUserAppDataPost['json_data'],
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
    /**@type{server_server_response & {result?:server_db_table_IamUserAppDataPost[]}} */
    const result = get({app_id:parameters.app_id, resource_id:null, data:{data_app_id:parameters.app_id, iam_user_id:parameters.resource_id}});
    if (result.result)
        if (result.result.length>0)
            return result.result
                    .map((/**@type{server_db_table_IamUserAppDataPost}*/row)=>{
                        return {
                            id: row.id,
                            description:row.json_data?.description, 
                            iam_user_id:IamUserApp.get({app_id:parameters.app_id, 
                                                        resource_id:row.iam_user_app_id, 
                                                        data:{iam_user_id:parameters.resource_id, data_app_id:parameters.app_id}}).result[0]?.iam_user_id,
                            count_likes:IamUserAppDataPostLike.get({app_id:parameters.app_id, 
                                                                    resource_id:row.id, 
                                                                    data:{  iam_user_id:null, 
                                                                            data_app_id:parameters.app_id,
                                                                            iam_user_app_data_post_id:null}}).result.length,
                            count_views:IamUserAppDataPostView.get({app_id:parameters.app_id, 
                                                                    resource_id:row.id, 
                                                                    data:{iam_user_id:null, data_app_id:parameters.app_id}}).result.length,
                            liked: IamUserAppDataPostLike.get({ app_id:parameters.app_id, 
                                                                resource_id:row.id, 
                                                                data:{  iam_user_id:serverUtilNumberValue(parameters.data?.id_current_user), 
                                                                        data_app_id:parameters.app_id,
                                                                        iam_user_app_data_post_id:null}}).result.length,
                            };
                        });
        else
            return ORM.getError(parameters.app_id, 404);
    else
        return result;
};

/**
 * @name getViewProfileStatLike
 * @description Get profile stat like
 *              likes:  count users where current user has liked a post
 *              liked:  count users who have liked a post of current user
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
                    count_user_post_likes:IamUserAppDataPostLike.get({  app_id:parameters.app_id, 
                                                                        resource_id:null, 
                                                                        data:{  iam_user_id:parameters.resource_id, 
                                                                                data_app_id:parameters.app_id,
                                                                                iam_user_app_data_post_id:null}}).result
                                            .filter((/**@type{server_db_table_IamUserAppDataPostLike}*/row_like)=>
                                                row_like.iam_user_app_id == get({app_id:parameters.app_id, 
                                                    resource_id:row_like.iam_user_app_data_post_id, 
                                                    data:{  iam_user_id:null, 
                                                            data_app_id:parameters.app_id}}).result[0]?.iam_user_app_id
                                                
                                            ).length,
                    count_user_post_liked:IamUserAppDataPostLike.get({  app_id:parameters.app_id, 
                                                                        resource_id:null, 
                                                                        data:{  iam_user_id:null, 
                                                                                data_app_id:parameters.app_id,
                                                                                iam_user_app_data_post_id:null}}).result
                                            .filter((/**@type{server_db_table_IamUserAppDataPostLike}*/row_like)=>
                                                get({app_id:parameters.app_id, 
                                                    resource_id:null, 
                                                    data:{  iam_user_id:parameters.resource_id, 
                                                            data_app_id:parameters.app_id}}).result
                                                .filter((/**@type{server_db_table_IamUserAppDataPost}*/data_post)=>
                                                    row_like.iam_user_app_data_post_id==data_post.id
                                                ).length>0
                                            ).length
                    },
            type:'JSON'};
 };
 /**
 * @name getViewProfileStatPost
 * @description Get profile post stat
 *              liked:  return users sorted by most likes
 *              viewed: return users sorted by most viewed
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *         data:{statchoice?:string|null}
 *       }} parameters
 * @returns {Promise.<server_server_response & {result?:{top:'LIKED_POST'|'VIEWED_POST',
 *                                                      iam_user_id:server_db_table_IamUserApp['iam_user_id'],
 *                                                      avatar:server_db_table_IamUser['avatar'],
 *                                                      username:server_db_table_IamUser['username'],
 *                                                      count:number}[] }>}
 */
const getViewProfileStatPost = async parameters =>{
    /**@type{import('./IamUserAppDataPostLike.js')} */
    const IamUserAppDataPostLike = await import(`file://${process.cwd()}/server/db/IamUserAppDataPostLike.js`);
    /**@type{import('./IamUserAppDataPostView.js')} */
    const IamUserAppDataPostView = await import(`file://${process.cwd()}/server/db/IamUserAppDataPostView.js`);
    if (parameters.data.statchoice==null)
        return ORM.getError(parameters.app_id, 400);
    else{
        /**@type{import('./IamUser.js')} */
        const IamUser = await import(`file://${process.cwd()}/server/db/IamUser.js`);
        return {result:IamUser.get(parameters.app_id, null).result
                        .map((/**@type{server_db_table_IamUser}*/row)=>{
                            return {
                                top:serverUtilNumberValue(parameters.data.statchoice)==1?
                                        'LIKED_POST':
                                            'VIEWED_POST',
                                iam_user_id:row.id,
                                avatar:row.avatar,
                                username:row.username,
                                count:serverUtilNumberValue(parameters.data.statchoice)==1?
                                        IamUserAppDataPostLike.get({app_id:parameters.app_id, 
                                                                    resource_id:null,
                                                                    data:{  iam_user_id:row.id??null, 
                                                                            data_app_id:parameters.app_id,
                                                                            iam_user_app_data_post_id:null}}).result.length:
                                            IamUserAppDataPostView.get({app_id:parameters.app_id, 
                                                                        resource_id:null,
                                                                        data:{  iam_user_id:row.id??null, 
                                                                                data_app_id:parameters.app_id}}).result.length
                            };
                        })
                        .sort(( /**@type{server_db_table_IamUser & {count:number}}*/a,
                            /**@type{server_db_table_IamUser & {count:number}}*/b)=>a.count > b.count),
                type:'JSON'};
    }
};

/**
 * @name getViewProfileUserPostDetail
 * @description Get profile user detail post
 *              like:   returns users sorted by most likes on posts
 *              liked:  returns users sorted by most liked on posts
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{detailchoice?:string|null}}} parameters
 * @returns {Promise.<server_server_response & {result?:{detail:'LIKE_POST'|'LIKED_POST',
 *                                                      iam_user_id:server_db_table_IamUserApp['iam_user_id'],
 *                                                      avatar:server_db_table_IamUser['avatar'],
 *                                                      username:server_db_table_IamUser['username']}[] }>}
 */
const getViewProfileUserPostDetail = async parameters =>{
   /**@type{import('./IamUserAppDataPostLike.js')} */
   const IamUserAppDataPostLike = await import(`file://${process.cwd()}/server/db/IamUserAppDataPostLike.js`);
   if (parameters.data.detailchoice==null)
       return ORM.getError(parameters.app_id, 400);
   else{
       /**@type{import('./IamUser.js')} */
       const IamUser = await import(`file://${process.cwd()}/server/db/IamUser.js`);
       return { result: IamUser.get(parameters.app_id, null).result
                        .filter((/**@type{server_db_table_IamUser}*/row_user)=>
                            serverUtilNumberValue(parameters.data.detailchoice)==1?
                                IamUserAppDataPostLike.get({app_id:parameters.app_id, 
                                                            resource_id:null, 
                                                            data:{  iam_user_id:parameters.resource_id, 
                                                                    data_app_id:parameters.app_id,
                                                                    iam_user_app_data_post_id:null}}).result
                                .filter((/**@type{server_db_table_IamUserAppDataPostLike}*/row_like)=>
                                    row_user.id == IamUserApp.get({ app_id:parameters.app_id, 
                                                                    resource_id:row_like.iam_user_app_id,
                                                                    data:{iam_user_id:null, data_app_id:null}}).result[0]?.iam_user_id &&
                                    row_like.iam_user_app_id == get({   app_id:parameters.app_id, 
                                                                        resource_id:row_like.iam_user_app_data_post_id, 
                                                                        data:{  iam_user_id:null, 
                                                                                data_app_id:parameters.app_id}}).result[0]?.iam_user_app_id
                                    
                                ):
                                IamUserAppDataPostLike.get({app_id:parameters.app_id, 
                                                            resource_id:null, 
                                                            data:{  iam_user_id:null, 
                                                                    data_app_id:parameters.app_id,
                                                                iam_user_app_data_post_id:null}}).result
                                .filter((/**@type{server_db_table_IamUserAppDataPostLike}*/row_iam_user_app_data_post_like)=>
                                    row_user.id == IamUserApp.get({ app_id:parameters.app_id, 
                                                                    resource_id:row_iam_user_app_data_post_like.iam_user_app_id,
                                                                    data:{iam_user_id:null, data_app_id:null}}).result[0]?.iam_user_id &&
                                    get({app_id:parameters.app_id, 
                                        resource_id:null, 
                                        data:{  iam_user_id:parameters.resource_id, 
                                                data_app_id:parameters.app_id}}).result
                                    .filter((/**@type{server_db_table_IamUserAppDataPost}*/data_post)=>
                                        row_iam_user_app_data_post_like.iam_user_app_data_post_id==data_post.id
                                    ).length>0
                                )
                        )
                        .map((/**@type{server_db_table_IamUser}*/row)=>{
                            return {
                                detail:serverUtilNumberValue(parameters.data.detailchoice)==1?
                                        'LIKE_POST':
                                            'LIKED_POST',
                                iam_user_id:row.id,
                                avatar:row.avatar,
                                username:row.username
                            };
                        })
                        .sort(( /**@type{server_db_table_IamUser}*/a,
                                /**@type{server_db_table_IamUser}*/b)=>a.username > b.username),
                type:'JSON'};
   }
};
/**
 * @name post
 * @description Create record
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          data:server_db_table_IamUserAppDataPost}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert}>}
 */
const post = async parameters => {
    //check required attributes
    if (parameters.data.iam_user_app_id==null){
        return ORM.getError(parameters.app_id, 400);
    }
    else{
        /**@type{server_db_table_IamUserAppDataPost} */
        const data_new =     {
                                id:Date.now(),
                                iam_user_app_id:parameters.data.iam_user_app_id, 
                                json_data:parameters.data.json_data,
                                created:new Date().toISOString(),
                                modified:null
                        };
        return ORM.Execute({app_id:parameters.app_id, dml:'POST', object:'IamUserAppDataPost', post:{data:data_new}}).then((result)=>{
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
 * @name update
 * @description Update record
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          data:server_db_table_IamUserAppDataPost}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
 */
const update = async parameters =>{
    /**@type{server_db_table_IamUserAppDataPost} */
    const data_update = {};
    //allowed parameters to update:
    if (parameters.data.json_data!=null)
        data_update.json_data = parameters.data.json_data;
    data_update.modified = new Date().toISOString();
    if (Object.entries(data_update).length>0)
        return ORM.Execute({  app_id:parameters.app_id, 
                                    dml:'UPDATE', 
                                    object: 'IamUserAppDataPost', 
                                    update:{resource_id:parameters.resource_id, data_app_id:null, data:data_update}}).then((result)=>{
            if (result.affectedRows>0)
                return {result:result, type:'JSON'};
            else
                return ORM.getError(parameters.app_id, 404);
        });
    else
        return ORM.getError(parameters.app_id, 400);
};
/**
 * @name deleteRecord
 * @description Delete record
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_delete }>}
 */
const deleteRecord = async parameters =>{
    return ORM.Execute({  app_id:parameters.app_id, 
                                dml:'DELETE', 
                                object:'IamUserAppDataPost', 
                                delete:{resource_id:parameters.resource_id, data_app_id:null}}).then((result)=>{
        if (result.affectedRows>0)
            return {result:result, type:'JSON'};
        else
            return ORM.getError(parameters.app_id, 404);
    });
};
export {get, getViewProfileUserPosts, getViewProfileStatLike, getViewProfileStatPost, getViewProfileUserPostDetail, post, update, deleteRecord};