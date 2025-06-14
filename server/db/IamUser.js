/** @module server/db/IamUser */

/**
 * @import {server_server_response,server_db_common_result_insert,server_db_common_result_update,server_db_common_result_delete,
 *          server_db_table_IamUser, server_db_table_IamUserLike, server_db_table_IamUserFollow, server_db_iam_user_admin} from '../types.js'
 */
const ORM = await import('./ORM.js');
const {serverUtilNumberValue} = await import('../server.js');
/**
 * @name get
 * @description Get 
 * @function
 * @param {number} app_id
 * @param {number|null} resource_id
 * @returns {server_server_response & {result?:server_db_table_IamUser[] }}
 */
const get = (app_id, resource_id) =>{
    const result = ORM.getObject(app_id, 'IamUser',resource_id, null);
    if (result.rows.length>0 || resource_id==null)
        return {result:result.rows, type:'JSON'};
    else
        return ORM.getError(app_id, 404);
};

/**
 * @name getViewProfile
 * @description Get user profile
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:Number,
*          resource_id:number|null,
*          ip:string,
*          user_agent:string,
*          data:{  name?:string|null,
*                  id?:string|null,
*                  search?:string|null,
*                  POST_ID?:string |null}}} parameters
* @returns {Promise.<server_server_response & {result?:server_db_table_IamUser & { count_following:number,
*                                                                                   count_followed: number,
*                                                                                   count_likes:    number,
*                                                                                   count_liked:    number,
*                                                                                   count_views:    number,
*                                                                                   followed_id:    number,
*                                                                                   liked_id:       number}[]}>}
*/
const getViewProfile = async parameters =>{
  const IamUserFollow = await import('./IamUserFollow.js');
  const IamUserLike = await import('./IamUserLike.js');
  const IamUserView = await import('./IamUserView.js');
  const {commonSearchMatch} = await import('../../apps/common/src/common.js');
  
  const result_getProfileUser = get(parameters.app_id, parameters.resource_id).result
                                .filter((/**@type{server_db_table_IamUser}*/row)=>   
                                    row.active==1 && 
                                    row.private !=1 &&
                                    commonSearchMatch(row.username, parameters.data.search??'') &&
                                    commonSearchMatch(row.username, parameters.data.name??''))
                                .map((/**@type{server_db_table_IamUser}*/row)=>{
                                    // check if friends
                                    const friends =  IamUserFollow.get({app_id:parameters.app_id, 
                                                                    resource_id:null, 
                                                                    data:{  iam_user_id:serverUtilNumberValue(parameters.data?.id),
                                                                            iam_user_id_follow:row.id??null}}).result[0] ??
                                                    IamUserFollow.get({app_id:parameters.app_id, 
                                                                    resource_id:null, 
                                                                    data:{  iam_user_id:row.id??null,
                                                                            iam_user_id_follow:serverUtilNumberValue(parameters.data?.id)}}).result[0];
                                    return {id:             row.id,
                                            active:         row.active,
                                            username:       row.username, 
                                            bio:            row.bio,
                                            private:        (row.id ==parameters.resource_id ||row.private==1 && friends)?null:row.private,
                                            user_level:     row.user_level,
                                            avatar:         row.avatar,
                                            friends:        friends?1:null,
                                            created:        row.created,
                                            count_following:((row.private==1 && friends==null) || parameters.data.search!=null)?
                                                                null:
                                                                    IamUserFollow.get({ app_id:parameters.app_id, 
                                                                                        resource_id:null, 
                                                                                        data:{  iam_user_id:row.id??null,
                                                                                                iam_user_id_follow:null}}).result.length,
                                            count_followed: ((row.private==1 && friends==null) || parameters.data.search!=null)?
                                                                null:
                                                                    IamUserFollow.get({ app_id:parameters.app_id, 
                                                                                        resource_id:null, 
                                                                                        data:{  iam_user_id:null,
                                                                                                iam_user_id_follow:row.id??null}}).result.length,
                                            count_likes:    ((row.private==1 && friends==null) || parameters.data.search!=null)?
                                                                null:
                                                                    IamUserLike.get({   app_id:parameters.app_id, 
                                                                                resource_id:null, 
                                                                                data:{  iam_user_id:row.id??null,
                                                                                        iam_user_id_like:null}}).result.length,
                                            count_liked:    ((row.private==1 && friends==null) || parameters.data.search!=null)?
                                                                null:
                                                                    IamUserLike.get({   app_id:parameters.app_id, 
                                                                                resource_id:null, 
                                                                                data:{  iam_user_id:null,
                                                                                        iam_user_id_like:row.id??null}}).result.length,
                                            count_views:    IamUserView.get({   app_id:parameters.app_id, 
                                                                                resource_id:null, 
                                                                                data:{  iam_user_id:null,
                                                                                        iam_user_id_view:row.id??null}}).result.length,
                                            followed_id:    (parameters.data?.id==null ||parameters.data?.id=='')?null:IamUserFollow.get({ app_id:parameters.app_id, 
                                                                                resource_id:null, 
                                                                                data:{  iam_user_id:serverUtilNumberValue(parameters.data?.id),
                                                                                        iam_user_id_follow:row.id??null}}).result[0]?.id??null,
                                            liked_id:       (parameters.data?.id==null ||parameters.data?.id=='')?null:IamUserLike.get({   app_id:parameters.app_id, 
                                                                                resource_id:null, 
                                                                                data:{  iam_user_id:serverUtilNumberValue(parameters.data?.id),
                                                                                        iam_user_id_like:row.id??null}}).result[0]?.id??null};
                                });
  if (parameters.data.search){
      return {result:result_getProfileUser, type:'JSON'};
  }
  else
      if (result_getProfileUser[0]){
          //always save stat who is viewing, same user, none or someone else
          const data_body = { iam_user_id:        serverUtilNumberValue(parameters.data.id),    //who views
                              iam_user_id_view:   serverUtilNumberValue(parameters.data.POST_ID) ?? result_getProfileUser[0].id, //viewed account
                              client_ip:              parameters.ip,
                              client_user_agent:      parameters.user_agent};
          return await IamUserView.post(parameters.app_id, 
                                        /**@ts-ignore */
                                        data_body)
                            .then(()=>{return {result:result_getProfileUser, type:'JSON'};});
      }
      else
          return result_getProfileUser.http?result_getProfileUser:ORM.getError(parameters.app_id, 404);
};

/**
 * @name getProfileStat
 * @description Get profile stat
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          data:{statchoice?:string|null}}} parameters
 * @returns {Promise.<server_server_response & {result?:{   top:'VISITED|FOLLOWING|LIKE_USER', 
 *                                                          id:server_db_table_IamUser['id'], 
 *                                                          avatar:server_db_table_IamUser['avatar'],
 *                                                          username:server_db_table_IamUser['username'],
 *                                                          count:number}[] }>}
 */
const getViewProfileStat = async parameters =>{
    const IamUserApp = await import('./IamUserApp.js');
    const IamUserFollow = await import('./IamUserFollow.js');
    const IamUserLike = await import('./IamUserLike.js');
    const IamUserView = await import('./IamUserView.js');
    
    return {result:get(parameters.app_id, null).result
                            .filter((/**@type{server_db_table_IamUser}*/row)=>
                                    row.active==1 && row.private !=1 &&
                                    //user should have a record in current app
                                    IamUserApp.get({  app_id:parameters.app_id, 
                                                                resource_id:null,
                                                                data: {
                                                                    iam_user_id: row.id??null,
                                                                    data_app_id: parameters.app_id}
                                                                }).result[0]
                            )              
                            .map((/**@type{server_db_table_IamUser}*/row)=>{
                                return {
                                    top:    serverUtilNumberValue(parameters.data?.statchoice)==1?'VISITED':
                                            serverUtilNumberValue(parameters.data?.statchoice)==2?'FOLLOWING':
                                            serverUtilNumberValue(parameters.data?.statchoice)==3?'LIKE_USER':null,
                                    id:     row.id,
                                    avatar: row.avatar,
                                    username:row.username,
                                    count:  serverUtilNumberValue(parameters.data?.statchoice)==1?
                                                IamUserView.get({   app_id:parameters.app_id, 
                                                                    resource_id:null, 
                                                                    data:{  iam_user_id:null,
                                                                            iam_user_id_view:row.id??null}}).result.length:
                                            serverUtilNumberValue(parameters.data?.statchoice)==2?
                                                IamUserFollow.get({   app_id:parameters.app_id, 
                                                                    resource_id:null, 
                                                                    data:{  iam_user_id:null,
                                                                            iam_user_id_follow:row.id??null}}).result.length:
                                            serverUtilNumberValue(parameters.data?.statchoice)==3?
                                                IamUserLike.get({   app_id:parameters.app_id, 
                                                                    resource_id:null, 
                                                                    data:{  iam_user_id:null,
                                                                            iam_user_id_like:row.id??null}}).result.length:
                                            null
                                };
                            })
                            .sort(( /**@type{server_db_table_IamUser & {count:number}}*/a,
                                    /**@type{server_db_table_IamUser & {count:number}}*/b)=>a.count>b.count?-1:1),
            type:'JSON'};
};
    
/**
 * @name getProfileDetail
 * @description Get user profile detail
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          data:{detailchoice?:string|null}}} parameters
 * @returns {Promise.<server_server_response & {result?:{detail:'FOLLOWING'|'FOLLOWED'|'LIKE_USER'|'LIKED_USER',
 *                                                       iam_user_id:server_db_table_IamUserFollow['iam_user_id'],
 *                                                       avatar:server_db_table_IamUser['avatar'],
 *                                                       username:server_db_table_IamUser['username']
 *                                                      }[] }>}
 */
const getViewProfileDetail = async parameters =>{
   const IamUserFollow = await import('./IamUserFollow.js');
   const IamUserLike = await import('./IamUserLike.js');

   return {result:( //following
                    serverUtilNumberValue(parameters.data?.detailchoice)==1?
                        IamUserFollow.get({ app_id:parameters.app_id, 
                                            resource_id:null, 
                                            data:{  iam_user_id:parameters.resource_id,
                                                    iam_user_id_follow:null}}).result
                            .map((/**@type{server_db_table_IamUserFollow}*/row)=>{return {iam_user_id:row.iam_user_id_follow};}):
                    //followed
                    serverUtilNumberValue(parameters.data?.detailchoice)==2?
                        IamUserFollow.get({ app_id:parameters.app_id, 
                                            resource_id:null, 
                                            data:{  iam_user_id:null,
                                                    iam_user_id_follow:parameters.resource_id}}).result:
                    //like user
                    serverUtilNumberValue(parameters.data?.detailchoice)==3?
                        IamUserLike.get({   app_id:parameters.app_id, 
                                            resource_id:null, 
                                            data:{  iam_user_id:parameters.resource_id,
                                                    iam_user_id_like:null}}).result
                            .map((/**@type{server_db_table_IamUserLike}*/row)=>{return {iam_user_id:row.iam_user_id_like};}):
                    //liked user
                    serverUtilNumberValue(parameters.data?.detailchoice)==4?
                        IamUserLike.get({   app_id:parameters.app_id, 
                                            resource_id:null, 
                                            data:{  iam_user_id:null,
                                                    iam_user_id_like:parameters.resource_id}}).result:
                    [])
                    .filter((/**@type{server_db_table_IamUserFollow}*/row)=>{
                        /**@type{server_db_table_IamUser}*/
                        const user = get(parameters.app_id,row.iam_user_id).result[0];
                        return user?.active == 1 && user?.private != 1;
                    })              
                    .map((/**@type{server_db_table_IamUserFollow}*/row)=>{
                        return {
                            detail: serverUtilNumberValue(parameters.data?.detailchoice)==1?'FOLLOWING':
                                    serverUtilNumberValue(parameters.data?.detailchoice)==2?'FOLLOWED':
                                    serverUtilNumberValue(parameters.data?.detailchoice)==3?'LIKE_USER':
                                    serverUtilNumberValue(parameters.data?.detailchoice)==4?'LIKED_USER':null,
                            iam_user_id:  row.iam_user_id,
                            avatar: get(parameters.app_id,row.iam_user_id).result[0]?.avatar,
                            username:get(parameters.app_id,row.iam_user_id).result[0]?.username
                        };
                    })
                    .sort(( /**@type{server_db_table_IamUser}*/a,
                            /**@type{server_db_table_IamUser}*/b)=>a.username<b.username?-1:1),
           type:'JSON'};
};

/**
 * @name getStatCountAdmin
 * @description Get user stat
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number}}parameters
 * @returns {server_server_response & {result?:{count_users:number}[]}}
 */
const getViewStatCountAdmin = parameters => {return {result: [{count_users:get(parameters.app_id,null).result?.length}],
                                                    type:'JSON'};};

/**
 * @name validationData
 * @description Validates user data
 * @function
 * @param {server_db_table_IamUser} data
 */
const validationData = data =>{
    return (data.type !=null &&
            //check not allowed attributes when creating or updating a user
            ('id' in data||'user_level' in data ||'status' in data||'created' in data||'modified' in data)==false &&
            //must be valid username
            data.username!=null &&
            data.username.indexOf(' ')==-1 &&
            data.username.indexOf('?')==-1 &&
            data.username.indexOf('/')==-1 &&
            data.username.indexOf('+')==-1 &&
            data.username.indexOf('"')==-1 &&
            data.username.indexOf('\'\'')==-1 &&
            //username 5 - 100 characters '👤 5-100!'
            data.username.length >= 5 &&
            data.username.length <= 100 &&
            //bio max 100 characters if used
            (data.bio == null || (data.bio != null && data.bio.length <= 100))&&
            //reminder max 100 characters if used
            (data.password_reminder==null || (data.password_reminder != null && data.password_reminder.length <= 100))&&
            //password 10 - 100 characters, '🔑 10-100!'
            ((data.password != null && data.password.length >= 10 && data.password.length <= 100)) &&
            //new password 10 - 100 characters, '🔑 10-100!'
            (data.password_new==null || (data.password_new != null && data.password_new.length >= 10 && data.password_new.length <= 100)));
}; 
/**
 * @name post
 * @description Add record
 * @function
 * @param {number} app_id 
 * @param {server_db_table_IamUser} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async (app_id, data) => {
    if (validationData(data)){
        const Security= await import('../security.js');
        /**@type{server_db_iam_user_admin} */
        const data_new =     {
                                id:                 Date.now(),
                                username:           data.username, 
                                //save encrypted password
                                password:           await Security.securityPasswordCreate(app_id, data.password), 
                                password_reminder:  data.password_reminder ?? null,
                                type:               data.type, 
                                bio:                data.bio ?? null, 
                                private:            data.private, 
                                otp_key:            Security.securityOTPKeyCreate(),
                                avatar:             data.avatar,
                                user_level:         data.user_level, 
                                status:             data.status, 
                                active:             data.active,
                                created:            new Date().toISOString(), 
                                modified:           new Date().toISOString()
                        };
        return ORM.Execute({app_id:app_id, dml:'POST', object:'IamUser', post:{data:data_new}}).then((result)=>{
            if (result.affectedRows>0){
                result.insertId=data_new.id;
                return {result:result, type:'JSON'};
            }
            else
                return ORM.getError(app_id, 404);
        });
    }
    else
        return ORM.getError(app_id, 400);
};
/**
 * @name postAdmin
 * @description Add record admin
 * @function
 * @param {number} app_id 
 * @param {server_db_table_IamUser} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const postAdmin = async (app_id, data) => {
    const {securityPasswordCreate}= await import('../security.js');
    const Security= await import('../security.js');
    /**@type{server_db_iam_user_admin} */
    const data_new =     {
                            id:Date.now(),
                            username:data.username, 
                            //save encrypted password
                            password:await securityPasswordCreate(app_id, data.password), 
                            password_reminder:data.password_reminder,
                            type: data.type, 
                            bio:data.bio, 
                            private:data.private, 
                            otp_key: Security.securityOTPKeyCreate(),
                            avatar:data.avatar,
                            user_level:data.user_level, 
                            status:data.status, 
                            active:data.active,
                            created:new Date().toISOString(), 
                            modified:new Date().toISOString()
                    };
    return ORM.Execute({app_id:app_id, dml:'POST', object:'IamUser', post:{data:data_new}}).then((result)=>{
        if (result.affectedRows>0){
            result.insertId=data_new.id;
            return {result:result, type:'JSON'};
        }
        else
            return ORM.getError(app_id, 404);
    });
};

/**
 * @name update
 * @description Update
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @param {server_db_table_IamUser} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
 */
const update = async (app_id, resource_id, data) => {
    const {securityPasswordCompare, securityPasswordCreate}= await import('../security.js');    
    /**@type{server_db_table_IamUser}*/
    const user = get(app_id, resource_id).result[0];
    if (user){
        if (validationData(data) && user.username == data.username && data.password && await securityPasswordCompare(app_id, data.password, user.password)){
            /**@type{server_db_table_IamUser} */
            const data_update = {};
            //allowed parameters to update:
            if (data.username!=null && data.username != '')
                data_update.username = data.username;
            if (data.password!=null && data.password != '')
                data_update.password = await securityPasswordCreate(app_id, data.password_new ?? data.password);
            if (data.password_reminder!=null)
                data_update.password_reminder = data.password_reminder;
            if (data.bio!=null)
                data_update.bio = data.bio;
            if (data.private!=null)
                data_update.private = serverUtilNumberValue(data.private);
            if (data.avatar!=null)
                data_update.avatar = data.avatar;
            data_update.modified = new Date().toISOString();

            if (Object.entries(data_update).length>0)
                return ORM.Execute({app_id:app_id, dml:'UPDATE', object:'IamUser', update:{resource_id:resource_id, data_app_id:null, data:data_update}}).then((result)=>{
                    if (result.affectedRows>0)
                        return {result:result, type:'JSON'};
                    else
                        return ORM.getError(app_id, 404);
                });
            else
                return ORM.getError(app_id, 400);
        }
        else
            return ORM.getError(app_id, 400);
    }
    else
        return ORM.getError(app_id, 404);
};
/**
 * @name updateAdmin
 * @description UpdateAdmin
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          data :server_db_iam_user_admin}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
 */
const updateAdmin = async parameters => {
    const {securityPasswordCreate}= await import('../security.js');    
    /**@type{server_db_table_IamUser}*/
    const user = get(parameters.app_id, parameters.resource_id).result[0];
    if (user){
            /**@type{server_db_table_IamUser} */
            const data_update = {};
            //allowed parameters to update:
            if (parameters.data?.username!=null && parameters.data?.username!='')
                data_update.username = parameters.data.username;
            if (parameters.data?.password!=null && parameters.data?.password!='')
                data_update.password = await securityPasswordCreate(parameters.app_id, parameters.data?.password_new ?? parameters.data.password);
            if (parameters.data?.password_reminder!=null)
                data_update.password_reminder = parameters.data.password_reminder;
            if (parameters.data?.bio!=null)
                data_update.bio = parameters.data.bio;
            if (parameters.data?.private!=null)
                data_update.private = serverUtilNumberValue(parameters.data.private) ?? 0;
            if (parameters.data?.otp_key!=null)
                data_update.otp_key = parameters.data.otp_key;
            if (parameters.data?.avatar!=null)
                data_update.avatar = parameters.data.avatar;
            //admin columns
            if (parameters.data?.type!=null)
                data_update.type = parameters.data.type;
            if (parameters.data?.user_level!=null)
                data_update.user_level = serverUtilNumberValue(parameters.data.user_level);
            if (parameters.data?.status!=null)
                data_update.status = parameters.data.status;
            if (parameters.data?.active!=null)
                data_update.active = serverUtilNumberValue(parameters.data.active) ?? 0;
            data_update.modified = new Date().toISOString();

            if (Object.entries(data_update).length>0)
                return ORM.Execute({  app_id:parameters.app_id, 
                                            dml:'UPDATE', 
                                            object:'IamUser', 
                                            update:{resource_id:parameters.resource_id, data_app_id:null, data:data_update}}).then((result)=>{
                    if (result.affectedRows>0)
                        return {result:result, type:'JSON'};
                    else
                        return ORM.getError(parameters.app_id, 404);
                });
            else
                return ORM.getError(parameters.app_id, 400);
    }
    else
        return ORM.getError(parameters.app_id, 404);
};

/**
 * @name deleteRecord
 * @description Delete
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @param {{password:string}} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_delete }>}
 */
const deleteRecord = async (app_id, resource_id, data) => {
    const {securityPasswordCompare}= await import('../security.js');    
    /**@type{server_db_table_IamUser}*/
    const user = get(app_id, resource_id).result[0];
    if (user){
        if (data.password && await securityPasswordCompare(app_id, data.password, user.password))
            return ORM.Execute({app_id:app_id, 
                                dml:'DELETE', 
                                object:'IamUser', 
                                delete:{resource_id:resource_id, data_app_id:null}}).then((result)=>{
                if (result.affectedRows>0)
                    return {result:result, type:'JSON'};
                else
                    return ORM.getError(app_id, 404);
            });
        else
            return ORM.getError(app_id, 400);
    }
    else
        return user;
};
/**
 * @name deleteRecordAdmin
 * @description Delete record admin
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_delete }>}
 */
const deleteRecordAdmin = async (app_id, resource_id) => {
    /**@type{server_db_table_IamUser}*/
    const user = get(app_id, resource_id).result[0];
    if (user){
        return ORM.Execute({app_id:app_id, dml:'DELETE', object:'IamUser', delete:{resource_id:resource_id, data_app_id:null}})
                .then(result=>{
                    if (result.affectedRows>0)
                        return {result:result, type:'JSON'};
                    else
                        return ORM.getError(app_id, 404);
                    });
    }
    else
        return user;
};

export {get, getViewProfile, getViewProfileStat, getViewProfileDetail, getViewStatCountAdmin, post, postAdmin, update, updateAdmin, deleteRecord, deleteRecordAdmin};