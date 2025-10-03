/** @module server/db/IamUserAppDataPost */

/**
 * @import {server} from '../types.js'
 */
const {server} = await import ('../server.js');
/**
 * @name get
 * @description Get record
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{  data_app_id:number|null,
 *                  iam_user_id:number|null}}} parameters
 * @returns {server['server']['response'] & {result?:server['ORM']['Object']['IamUserAppDataPost'][] }}
 */
const get = parameters =>{
    const result = (server.ORM.getObject(parameters.app_id, 'IamUserAppDataPost',parameters.resource_id, null).result??[])
                    .filter((/**@type{server['ORM']['Object']['IamUserAppDataPost']}*/row)=>
                        server.ORM.db.IamUserApp.get({ app_id:parameters.app_id,
                                        resource_id:null, 
                                        data:{iam_user_id:parameters.data.iam_user_id, data_app_id:parameters.data.data_app_id}}).result
                        .filter((/**@type{server['ORM']['Object']['IamUserApp']}*/rowIamUserApp)=>
                            row.IamUserAppId == rowIamUserApp.Id
                        )
                        .length>0
                    );
    if (result.length>0 || parameters.resource_id==null)
        return {result:result, type:'JSON'};
    else
        return server.ORM.getError(parameters.app_id, 404);
};

/**
 * @name getViewProfileUserPosts
 * @description Get user profile post
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          data:{id_current_user?:string|null}}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['View']['IamUserAppDataPostgetProfileUserPosts'][] }>}
 */
const getViewProfileUserPosts = async parameters =>{
    /**@type{server['server']['response'] & {result?:server['ORM']['Object']['IamUserAppDataPost'][]}} */
    const result = get({app_id:parameters.app_id, resource_id:null, data:{data_app_id:parameters.app_id, iam_user_id:parameters.resource_id}});
    if (result.result)
        if (result.result.length>0)
            return {result:result.result
                    .map((/**@type{server['ORM']['Object']['IamUserAppDataPost']}*/row)=>{
                        return {
                            Id: row.Id,
                            Description:row.Document?.description, 
                            IamUserId:server.ORM.db.IamUserApp.get({app_id:parameters.app_id, 
                                                        resource_id:row.IamUserAppId, 
                                                        data:{  iam_user_id:    parameters.resource_id, 
                                                                data_app_id:    parameters.app_id}}).result[0]?.iam_user_id,
                            CountLikes:server.ORM.db.IamUserAppDataPostLike.get({app_id:parameters.app_id, 
                                                        resource_id:null, 
                                                        data:{  iam_user_id:                null, 
                                                                data_app_id:                parameters.app_id,
                                                                iam_user_app_data_post_id:  row.Id}}).result.length,
                            CountViews:server.ORM.db.IamUserAppDataPostView.get({app_id:parameters.app_id, 
                                                        resource_id:null, 
                                                        data:{  iam_user_id:    null, 
                                                                data_app_id:    parameters.app_id,
                                                                iam_user_app_data_post_id:  row.Id}}).result.length,
                            Liked: server.ORM.db.IamUserAppDataPostLike.get({ app_id:parameters.app_id, 
                                                        resource_id:null, 
                                                        data:{  iam_user_id:                server.ORM.UtilNumberValue(parameters.data?.id_current_user), 
                                                                data_app_id:                parameters.app_id,
                                                                iam_user_app_data_post_id:  row.Id}}).result.length
                            };
                        })
                        ,type:'JSON'};
        else
            return server.ORM.getError(parameters.app_id, 404);
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
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['View']['IamUserAppDataPostgetProfileStatLike']}>}
 */
 const getViewProfileStatLike = async parameters =>{

    const result_liked = get({  app_id:parameters.app_id, 
                                resource_id:null, 
                                data:{  iam_user_id:parameters.resource_id, 
                                        data_app_id:parameters.app_id}}).result;

    return {result:{
                    CountUserPostLikes:server.ORM.db.IamUserAppDataPostLike.get({  app_id:parameters.app_id, 
                                                                        resource_id:null, 
                                                                        data:{  iam_user_id:parameters.resource_id, 
                                                                                data_app_id:parameters.app_id,
                                                                                iam_user_app_data_post_id:null}}).result
                                            .filter((/**@type{server['ORM']['Object']['IamUserAppDataPostLike']}*/row_like)=>
                                                row_like.IamUserAppId == get({app_id:parameters.app_id, 
                                                    resource_id:row_like.IamUserAppDataPostId,
                                                    data:{  iam_user_id:null, 
                                                            data_app_id:parameters.app_id}}).result[0]?.iam_user_app_id
                                                
                                            ).length,
                    CountUserPostLiked:server.ORM.db.IamUserAppDataPostLike.get({  app_id:parameters.app_id, 
                                                                        resource_id:null, 
                                                                        data:{  iam_user_id:null, 
                                                                                data_app_id:parameters.app_id,
                                                                                iam_user_app_data_post_id:null}}).result
                                            .filter((/**@type{server['ORM']['Object']['IamUserAppDataPostLike']}*/row_like)=>
                                                result_liked
                                                .filter((/**@type{server['ORM']['Object']['IamUserAppDataPost']}*/data_post)=>
                                                    row_like.IamUserAppDataPostId==data_post.Id
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
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['View']['IamUserAppDataPostGetProfileStatPost'][] }>}
 */
const getViewProfileStatPost = async parameters =>{
    if (parameters.data.statchoice==null)
        return server.ORM.getError(parameters.app_id, 400);
    else{
        return {result:server.ORM.db.IamUser.get(parameters.app_id, null).result
                        .map((/**@type{server['ORM']['Object']['IamUser']}*/row)=>{
                            return {
                                Top:server.ORM.UtilNumberValue(parameters.data.statchoice)==4?
                                        'LIKED_POST':
                                            'VIEWED_POST',
                                Id:row.Id,
                                Avatar:row.Avatar,
                                Username:row.Username,
                                Count:server.ORM.UtilNumberValue(parameters.data.statchoice)==4?
                                        server.ORM.db.IamUserAppDataPostLike.get({app_id:parameters.app_id, 
                                                                    resource_id:null,
                                                                    data:{  iam_user_id:row.Id??null, 
                                                                            data_app_id:parameters.app_id,
                                                                            iam_user_app_data_post_id:null}}).result.length:
                                            server.ORM.db.IamUserAppDataPostView.get({app_id:parameters.app_id, 
                                                                        resource_id:null,
                                                                        data:{  iam_user_id:row.Id??null, 
                                                                                data_app_id:parameters.app_id,
                                                                                iam_user_app_data_post_id:null}}).result.length
                            };
                        })
                        .sort(( /**@type{server['ORM']['View']['IamUserAppDataPostGetProfileStatPost']}*/a,
                                /**@type{server['ORM']['View']['IamUserAppDataPostGetProfileStatPost']}*/b)=>a.Count>b.Count?-1:1),
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
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['View']['IamUserAppdataPostGetProfileUserPostDetail'][] }>}
 */
const getViewProfileUserPostDetail = async parameters =>{
    if (parameters.data.detailchoice==null)
        return server.ORM.getError(parameters.app_id, 400);
    else{
        const result_IamUserAppDataPost = server.ORM.UtilNumberValue(parameters.data.detailchoice)==6?
                                            null:
                                                get({   app_id:parameters.app_id, 
                                                        resource_id:null, 
                                                        data:{  iam_user_id:parameters.resource_id, 
                                                                data_app_id:parameters.app_id}}).result;
        //filter iam_user_app_data_post_id where iam_user_app_id = IamUserApp.id where iam_user_id = parameters.resource_id, 
        const result = server.ORM.UtilNumberValue(parameters.data.detailchoice)==6?
                            //LIKE
                            server.ORM.db.IamUserAppDataPostLike.get({app_id:parameters.app_id, 
                                resource_id:null, 
                                data:{  iam_user_id:parameters.resource_id, 
                                        data_app_id:parameters.app_id,
                                        iam_user_app_data_post_id:null}}).result:
                                //LIKED
                                server.ORM.db.IamUserAppDataPostLike.get({app_id:parameters.app_id, 
                                                            resource_id:null, 
                                                            data:{  iam_user_id:null, 
                                                                    data_app_id:parameters.app_id,
                                                                    iam_user_app_data_post_id:null}}).result
                                .filter ((/**@type{server['ORM']['Object']['IamUserAppDataPostLike']}*/row)=>
                                    result_IamUserAppDataPost
                                    .filter((/**@type{server['ORM']['Object']['IamUserAppDataPost']}*/data_post)=>
                                        data_post.Id == row.IamUserAppDataPostId
                                    ).length>0
                                );

        return { result: result
                        .map((/**@type{server['ORM']['Object']['IamUserAppDataPostLike']}*/row)=>{
                            const result_IamUserApp_id =    server.ORM.db.IamUserApp.get({app_id:parameters.app_id, 
                                                                            resource_id:server.ORM.UtilNumberValue(parameters.data.detailchoice)==6?
                                                                                            get({   app_id:parameters.app_id, 
                                                                                                    resource_id:row.IamUserAppDataPostId, 
                                                                                                    data:{  iam_user_id:null, 
                                                                                                            data_app_id:null}}).result[0].IamUserAppId:
                                                                                                row.IamUserAppId,
                                                                            data:{iam_user_id:null, data_app_id:null}}).result[0]?.IamUserId;
                            /**@type{server['ORM']['Object']['IamUser']} */
                            const result_IamUser = server.ORM.db.IamUser.get(parameters.app_id, 
                                                                result_IamUserApp_id).result[0];
                            return {
                                Detail:server.ORM.UtilNumberValue(parameters.data.detailchoice)==1?
                                        'LIKE_POST':
                                            'LIKED_POST',
                                IamUserId:result_IamUserApp_id,
                                Avatar:result_IamUser?.Avatar,
                                Username:result_IamUser?.Username
                            };
                        })
                        .sort(( /**@type{server['ORM']['View']['IamUserAppdataPostGetProfileUserPostDetail']}*/a,
                                /**@type{server['ORM']['View']['IamUserAppdataPostGetProfileUserPostDetail']}*/b)=>a.Username<b.Username?-1:1),
                type:'JSON'};
   }
};
/**
 * @name post
 * @description Create record
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          data:server['ORM']['Object']['IamUserAppDataPost']}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_insert']}>}
 */
const post = async parameters => {
    //check required attributes
    if (parameters.data.IamUserAppId==null){
        return server.ORM.getError(parameters.app_id, 400);
    }
    else{
        /**@type{server['ORM']['Object']['IamUserAppDataPost']} */
        const data_new =     {
                                Id:Date.now(),
                                IamUserAppId:parameters.data.IamUserAppId, 
                                Document:parameters.data.Document,
                                Created:new Date().toISOString(),
                                Modified:null
                        };
        return server.ORM.Execute({app_id:parameters.app_id, dml:'POST', object:'IamUserAppDataPost', post:{data:data_new}}).then((result)=>{
            if (result.AffectedRows>0){
                result.InsertId=data_new.Id;
                return {result:result, type:'JSON'};
            }
            else
                return server.ORM.getError(parameters.app_id, 404);
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
 *          data:server['ORM']['Object']['IamUserAppDataPost']}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_update'] }>}
 */
const update = async parameters =>{
    /**@type{server['ORM']['Object']['IamUserAppDataPost']} */
    const data_update = {};
    //allowed parameters to update:
    if (parameters.data.Document!=null)
        data_update.Document = parameters.data.Document;
    data_update.Modified = new Date().toISOString();
    if (Object.entries(data_update).length>0)
        return server.ORM.Execute({  app_id:parameters.app_id, 
                                    dml:'UPDATE', 
                                    object: 'IamUserAppDataPost', 
                                    update:{resource_id:parameters.resource_id, data_app_id:null, data:data_update}}).then((result)=>{
            if (result.AffectedRows>0)
                return {result:result, type:'JSON'};
            else
                return server.ORM.getError(parameters.app_id, 404);
        });
    else
        return server.ORM.getError(parameters.app_id, 400);
};
/**
 * @name deleteRecord
 * @description Delete record
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_delete'] }>}
 */
const deleteRecord = async parameters =>{
    return server.ORM.Execute({  app_id:parameters.app_id, 
                                dml:'DELETE', 
                                object:'IamUserAppDataPost', 
                                delete:{resource_id:parameters.resource_id, data_app_id:null}}).then((result)=>{
        if (result.AffectedRows>0)
            return {result:result, type:'JSON'};
        else
            return server.ORM.getError(parameters.app_id, 404);
    });
};
export {get, getViewProfileUserPosts, getViewProfileStatLike, getViewProfileStatPost, getViewProfileUserPostDetail, post, update, deleteRecord};