/** @module server/db/IamUser */

/**
 * @import {server} from '../types.js'
 */
const {server} = await import ('../server.js');
/**
 * @name get
 * @description Get 
 * @function
 * @param {number} app_id
 * @param {number|null} resource_id
 * @returns {server['server']['response'] & {result?:server['ORM']['Object']['IamUser'][] }}
 */
const get = (app_id, resource_id) =>server.ORM.getObject(app_id, 'IamUser',resource_id, null);

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
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['View']['IamUsetGetProfile'][]}>}
 */
const getViewProfile = async parameters =>{
 
  const result_getProfileUser = get(parameters.app_id, parameters.resource_id).result
                                .filter((/**@type{server['ORM']['Object']['IamUser']}*/row)=>   
                                    row.Active==1 && 
                                    row.Private !=1 &&
                                    server.ORM.UtilSearchMatch(row.Username, parameters.data.search??'') &&
                                    server.ORM.UtilSearchMatch(row.Username, parameters.data.name??''))
                                .map((/**@type{server['ORM']['Object']['IamUser']}*/row)=>{
                                    // check if friends
                                    const friends =  server.ORM.db.IamUserFollow.get({app_id:parameters.app_id, 
                                                                    resource_id:null, 
                                                                    data:{  iam_user_id:server.ORM.UtilNumberValue(parameters.data?.id),
                                                                            iam_user_id_follow:row.Id??null}}).result[0] ??
                                                    server.ORM.db.IamUserFollow.get({app_id:parameters.app_id, 
                                                                    resource_id:null, 
                                                                    data:{  iam_user_id:row.Id??null,
                                                                            iam_user_id_follow:server.ORM.UtilNumberValue(parameters.data?.id)}}).result[0];
                                    return {Id:             row.Id,
                                            Active:         row.Active,
                                            Username:       row.Username, 
                                            Bio:            row.Bio,
                                            Private:        (row.Id ==parameters.resource_id ||row.Private==1 && friends)?null:row.Private,
                                            UserLevel:      row.UserLevel,
                                            Avatar:         row.Avatar,
                                            Friends:        friends?1:null,
                                            Created:        row.Created,
                                            CountFollowing:((row.Private==1 && friends==null) || parameters.data.search!=null)?
                                                                null:
                                                                    server.ORM.db.IamUserFollow.get({ app_id:parameters.app_id, 
                                                                                        resource_id:null, 
                                                                                        data:{  iam_user_id:row.Id??null,
                                                                                                iam_user_id_follow:null}}).result.length,
                                            CountFollowed: ((row.Private==1 && friends==null) || parameters.data.search!=null)?
                                                                null:
                                                                    server.ORM.db.IamUserFollow.get({ app_id:parameters.app_id, 
                                                                                        resource_id:null, 
                                                                                        data:{  iam_user_id:null,
                                                                                                iam_user_id_follow:row.Id??null}}).result.length,
                                            CountLikes:    ((row.Private==1 && friends==null) || parameters.data.search!=null)?
                                                                null:
                                                                    server.ORM.db.IamUserLike.get({   app_id:parameters.app_id, 
                                                                                resource_id:null, 
                                                                                data:{  iam_user_id:row.Id??null,
                                                                                        iam_user_id_like:null}}).result.length,
                                            CountLiked:    ((row.Private==1 && friends==null) || parameters.data.search!=null)?
                                                                null:
                                                                    server.ORM.db.IamUserLike.get({   app_id:parameters.app_id, 
                                                                                resource_id:null, 
                                                                                data:{  iam_user_id:null,
                                                                                        iam_user_id_like:row.Id??null}}).result.length,
                                            CountViews:    server.ORM.db.IamUserView.get({   app_id:parameters.app_id, 
                                                                                resource_id:null, 
                                                                                data:{  iam_user_id:null,
                                                                                        iam_user_id_view:row.Id??null}}).result.length,
                                            FollowedId:    (parameters.data?.id==null ||parameters.data?.id=='')?null:server.ORM.db.IamUserFollow.get({ app_id:parameters.app_id, 
                                                                                resource_id:null, 
                                                                                data:{  iam_user_id:server.ORM.UtilNumberValue(parameters.data?.id),
                                                                                        iam_user_id_follow:row.Id??null}}).result[0]?.Id??null,
                                            LikedId:       (parameters.data?.id==null ||parameters.data?.id=='')?null:server.ORM.db.IamUserLike.get({   app_id:parameters.app_id, 
                                                                                resource_id:null, 
                                                                                data:{  iam_user_id:server.ORM.UtilNumberValue(parameters.data?.id),
                                                                                        iam_user_id_like:row.Id??null}}).result[0]?.Id??null};
                                });
  if (parameters.data.search){
      return {result:result_getProfileUser, type:'JSON'};
  }
  else
      if (result_getProfileUser[0]){
          //always save stat who is viewing, same user, none or someone else
          /**@type{server['ORM']['Object']['IamUserView']} */
          const data_body = { IamUserId:       server.ORM.UtilNumberValue(parameters.data.id),    //who views
                              IamUserIdView:   server.ORM.UtilNumberValue(parameters.data.POST_ID) ?? result_getProfileUser[0].Id, //viewed account
                              ClientIp:        parameters.ip,
                              ClientUserAgent: parameters.user_agent};
          return await server.ORM.db.IamUserView.post(parameters.app_id, data_body)
                            .then(()=>{return {result:result_getProfileUser, type:'JSON'};});
      }
      else
          return result_getProfileUser.http?result_getProfileUser:server.ORM.getError(parameters.app_id, 404);
};

/**
 * @name getViewProfileStat
 * @description Get profile stat
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          data:{statchoice?:string|null}}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['View']['IamUserGetProfileStat'][] }>}
 */
const getViewProfileStat = async parameters =>{
    
    return {result:get(parameters.app_id, null).result
                            .filter((/**@type{server['ORM']['Object']['IamUser']}*/row)=>
                                    row.Active==1 && row.Private !=1 &&
                                    //user should have a record in current app
                                    server.ORM.db.IamUserApp.get({  app_id:parameters.app_id, 
                                                                resource_id:null,
                                                                data: {
                                                                    iam_user_id: row.Id??null,
                                                                    data_app_id: parameters.app_id}
                                                                }).result[0]
                            )              
                            .map((/**@type{server['ORM']['Object']['IamUser']}*/row)=>{
                                return {
                                    Top:    server.ORM.UtilNumberValue(parameters.data?.statchoice)==1?'VISITED':
                                            server.ORM.UtilNumberValue(parameters.data?.statchoice)==2?'FOLLOWING':
                                            server.ORM.UtilNumberValue(parameters.data?.statchoice)==3?'LIKE_USER':null,
                                    Id:     row.Id,
                                    Avatar: row.Avatar,
                                    Username:row.Username,
                                    Count:  server.ORM.UtilNumberValue(parameters.data?.statchoice)==1?
                                                server.ORM.db.IamUserView.get({   app_id:parameters.app_id, 
                                                                    resource_id:null, 
                                                                    data:{  iam_user_id:null,
                                                                            iam_user_id_view:row.Id??null}}).result.length:
                                            server.ORM.UtilNumberValue(parameters.data?.statchoice)==2?
                                                server.ORM.db.IamUserFollow.get({   app_id:parameters.app_id, 
                                                                    resource_id:null, 
                                                                    data:{  iam_user_id:null,
                                                                            iam_user_id_follow:row.Id??null}}).result.length:
                                            server.ORM.UtilNumberValue(parameters.data?.statchoice)==3?
                                                server.ORM.db.IamUserLike.get({   app_id:parameters.app_id, 
                                                                    resource_id:null, 
                                                                    data:{  iam_user_id:null,
                                                                            iam_user_id_like:row.Id??null}}).result.length:
                                            null
                                };
                            })
                            .sort(( /**@type{server['ORM']['View']['IamUserGetProfileStat']}*/a,
                                    /**@type{server['ORM']['View']['IamUserGetProfileStat']}*/b)=>a.Count>b.Count?-1:1),
            type:'JSON'};
};
    
/**
 * @name getViewProfileDetail
 * @description Get user profile detail
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          data:{detailchoice?:string|null}}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['View']['IamUserGetProfileDetail'][] }>}
 */
const getViewProfileDetail = async parameters =>{
   return {result:( //following
                    server.ORM.UtilNumberValue(parameters.data?.detailchoice)==1?
                        server.ORM.db.IamUserFollow.get({ app_id:parameters.app_id, 
                                            resource_id:null, 
                                            data:{  iam_user_id:parameters.resource_id,
                                                    iam_user_id_follow:null}}).result
                            .map((/**@type{server['ORM']['Object']['IamUserFollow']}*/row)=>{return {iam_user_id:row.IamUserIdFollow};}):
                    //followed
                    server.ORM.UtilNumberValue(parameters.data?.detailchoice)==2?
                        server.ORM.db.IamUserFollow.get({ app_id:parameters.app_id, 
                                            resource_id:null, 
                                            data:{  iam_user_id:null,
                                                    iam_user_id_follow:parameters.resource_id}}).result:
                    //like user
                    server.ORM.UtilNumberValue(parameters.data?.detailchoice)==3?
                        server.ORM.db.IamUserLike.get({   app_id:parameters.app_id, 
                                            resource_id:null, 
                                            data:{  iam_user_id:parameters.resource_id,
                                                    iam_user_id_like:null}}).result
                            .map((/**@type{server['ORM']['Object']['IamUserLike']}*/row)=>{return {iam_user_id:row.IamUserIdLike};}):
                    //liked user
                    server.ORM.UtilNumberValue(parameters.data?.detailchoice)==4?
                        server.ORM.db.IamUserLike.get({   app_id:parameters.app_id, 
                                            resource_id:null, 
                                            data:{  iam_user_id:null,
                                                    iam_user_id_like:parameters.resource_id}}).result:
                    [])
                    .filter((/**@type{server['ORM']['View']['IamUserGetProfileDetail']}*/row)=>{
                        /**@type{server['ORM']['Object']['IamUser']}*/
                        const user = get(parameters.app_id,row.IamUserId).result[0];
                        return user?.Active == 1 && user?.Private != 1;
                    })              
                    .map((/**@type{server['ORM']['View']['IamUserGetProfileDetail']}*/row)=>{
                        return {
                            Detail: server.ORM.UtilNumberValue(parameters.data?.detailchoice)==1?'FOLLOWING':
                                    server.ORM.UtilNumberValue(parameters.data?.detailchoice)==2?'FOLLOWED':
                                    server.ORM.UtilNumberValue(parameters.data?.detailchoice)==3?'LIKE_USER':
                                    server.ORM.UtilNumberValue(parameters.data?.detailchoice)==4?'LIKED_USER':null,
                            IamUserId:  row.IamUserId,
                            Avatar: get(parameters.app_id,row.IamUserId).result[0]?.Avatar,
                            Username:get(parameters.app_id,row.IamUserId).result[0]?.Username
                        };
                    })
                    .sort(( /**@type{server['ORM']['View']['IamUserGetProfileDetail']}*/a,
                            /**@type{server['ORM']['View']['IamUserGetProfileDetail']}*/b)=>a.Username<b.Username?-1:1),
           type:'JSON'};
};

/**
 * @name getStatCountAdmin
 * @description Get user stat
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number}}parameters
 * @returns {server['server']['response'] & {result?:server['ORM']['View']['IamUserGetStatCountAdmin'][]}}
 */
const getViewStatCountAdmin = parameters => {return {result: [{CountUsers:get(parameters.app_id,null).result?.length}],
                                                    type:'JSON'};};

/**
 * @name validationData
 * @description Validates user data
 * @function
 * @param {server['ORM']['Object']['IamUser']} data
 */
const validationData = data =>{
    return (data.Type !=null &&
            //check not allowed attributes when creating or updating a user
            ('Id' in data||'UserLevel' in data ||'Status' in data||'Created' in data||'Modified' in data)==false &&
            //must be valid username
            data.Username!=null &&
            data.Username.indexOf(' ')==-1 &&
            data.Username.indexOf('?')==-1 &&
            data.Username.indexOf('/')==-1 &&
            data.Username.indexOf('+')==-1 &&
            data.Username.indexOf('"')==-1 &&
            data.Username.indexOf('\'\'')==-1 &&
            //username 5 - 100 characters '👤 5-100!'
            data.Username.length >= 5 &&
            data.Username.length <= 100 &&
            //bio max 100 characters if used
            (data.Bio == null || (data.Bio != null && data.Bio.length <= 100))&&
            //reminder max 100 characters if used
            (data.PasswordReminder==null || (data.PasswordReminder != null && data.PasswordReminder.length <= 100))&&
            //password 10 - 100 characters, '🔑 10-100!'
            ((data.Password != null && data.Password.length >= 10 && data.Password.length <= 100)) &&
            //new password 10 - 100 characters, '🔑 10-100!'
            (data.PasswordNew==null || (data.PasswordNew != null && data.PasswordNew.length >= 10 && data.PasswordNew.length <= 100)));
}; 
/**
 * @name post
 * @description Add record
 * @function
 * @param {number} app_id 
 * @param {server['ORM']['Object']['IamUser']} data
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_insert'] }>}
 */
const post = async (app_id, data) => {
    if (validationData(data)){
        /**@type{server['ORM']['Object']['IamUser']} */
        const data_new =     {
                                Id:                 Date.now(),
                                Username:           data.Username, 
                                //save encrypted password
                                Password:           await server.security.securityPasswordCreate(app_id, data.Password), 
                                PasswordReminder:   data.PasswordReminder ?? null,
                                Type:               data.Type, 
                                Bio:                data.Bio ?? null, 
                                Private:            data.Private, 
                                OtpKey:             server.security.securityOTPKeyCreate(),
                                Avatar:             data.Avatar,
                                UserLevel:          data.UserLevel, 
                                Status:             data.Status, 
                                Active:             data.Active,
                                Created:            new Date().toISOString(), 
                                Modified:           new Date().toISOString()
                        };
        return server.ORM.Execute({app_id:app_id, dml:'POST', object:'IamUser', post:{data:data_new}}).then((/**@type{server['ORM']['MetaData']['common_result_insert']}*/result)=>{
            if (result.AffectedRows>0){
                result.InsertId=data_new.Id;
                return {result:result, type:'JSON'};
            }
            else
                return server.ORM.getError(app_id, 404);
        });
    }
    else
        return server.ORM.getError(app_id, 400);
};
/**
 * @name postAdmin
 * @description Add record admin
 * @function
 * @param {number} app_id 
 * @param {server['ORM']['Object']['IamUser']} data
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_insert'] }>}
 */
const postAdmin = async (app_id, data) => {
    /**@type{server['ORM']['Object']['IamUser']} */
    const data_new =     {
                            Id:Date.now(),
                            Username:data.Username, 
                            //save encrypted password
                            Password:await server.security.securityPasswordCreate(app_id, data.Password), 
                            PasswordReminder:data.PasswordReminder,
                            Type: data.Type, 
                            Bio:data.Bio, 
                            Private:data.Private, 
                            OtpKey: server.security.securityOTPKeyCreate(),
                            Avatar:data.Avatar,
                            UserLevel:data.UserLevel, 
                            Status:data.Status, 
                            Active:data.Active,
                            Created:new Date().toISOString(), 
                            Modified:new Date().toISOString()
                    };
    return server.ORM.Execute({app_id:app_id, dml:'POST', object:'IamUser', post:{data:data_new}}).then((/**@type{server['ORM']['MetaData']['common_result_insert']}*/result)=>{
        if (result.AffectedRows>0){
            result.InsertId=data_new.Id;
            return {result:result, type:'JSON'};
        }
        else
            return server.ORM.getError(app_id, 404);
    });
};

/**
 * @name update
 * @description Update
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @param {server['ORM']['Object']['IamUser']} data
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_update'] }>}
 */
const update = async (app_id, resource_id, data) => {
    /**@type{server['ORM']['Object']['IamUser']}*/
    const user = get(app_id, resource_id).result[0];
    if (user){
        if (validationData(data) && user.Username == data.Username && data.Password && await server.security.securityPasswordCompare(app_id, data.Password, user.Password)){
            /**@type{server['ORM']['Object']['IamUser']} */
            const data_update = {};
            //allowed parameters to update:
            if (data.Username!=null && data.Username != '')
                data_update.Username = data.Username;
            if (data.Password!=null && data.Password != '')
                data_update.Password = await server.security.securityPasswordCreate(app_id, data.PasswordNew ?? data.Password);
            if (data.PasswordReminder!=null)
                data_update.PasswordReminder = data.PasswordReminder;
            if (data.Bio!=null)
                data_update.Bio = data.Bio;
            if (data.Private!=null)
                data_update.Private = server.ORM.UtilNumberValue(data.Private);
            if (data.Avatar!=null)
                data_update.Avatar = data.Avatar;
            data_update.Modified = new Date().toISOString();

            if (Object.entries(data_update).length>0)
                return server.ORM.Execute({app_id:app_id, dml:'UPDATE', object:'IamUser', update:{resource_id:resource_id, data_app_id:null, data:data_update}}).then((/**@type{server['ORM']['MetaData']['common_result_update']}*/result)=>{
                    if (result.AffectedRows>0)
                        return {result:result, type:'JSON'};
                    else
                        return server.ORM.getError(app_id, 404);
                });
            else
                return server.ORM.getError(app_id, 400);
        }
        else
            return server.ORM.getError(app_id, 400);
    }
    else
        return server.ORM.getError(app_id, 404);
};
/**
 * @name updateAdmin
 * @description UpdateAdmin
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          data :{
 *              Username?: server['ORM']['Object']['IamUser']['Username'],
 *              Password?: server['ORM']['Object']['IamUser']['Password'],
 *              PasswordNew?: server['ORM']['Object']['IamUser']['PasswordNew'],
 *              PasswordReminder?: server['ORM']['Object']['IamUser']['PasswordReminder'],
 *              Bio?: server['ORM']['Object']['IamUser']['Bio'],
 *              Private?: server['ORM']['Object']['IamUser']['Private'],
 *              Avatar?: server['ORM']['Object']['IamUser']['Avatar'],
 *              OtpKey?: server['ORM']['Object']['IamUser']['OtpKey'],
 *              Type?: server['ORM']['Object']['IamUser']['Type'],
 *              UserLevel?: server['ORM']['Object']['IamUser']['UserLevel'],
 *              Status?: server['ORM']['Object']['IamUser']['Status'],
 *              Active?: server['ORM']['Object']['IamUser']['Active']}}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_update'] }>}
 */
const updateAdmin = async parameters => {
    /**@type{server['ORM']['Object']['IamUser']}*/
    const user = get(parameters.app_id, parameters.resource_id).result[0];
    if (user){
            /**@type{server['ORM']['Object']['IamUser']} */
            const data_update = {};
            //allowed parameters to update:
            if (parameters.data?.Username!=null && parameters.data?.Username!='')
                data_update.Username = parameters.data.Username;
            if (parameters.data?.Password!=null && parameters.data?.Password!='')
                data_update.Password = await server.security.securityPasswordCreate(parameters.app_id, parameters.data?.PasswordNew ?? parameters.data.Password);
            if (parameters.data?.PasswordReminder!=null)
                data_update.PasswordReminder = parameters.data.PasswordReminder;
            if (parameters.data?.Bio!=null)
                data_update.Bio = parameters.data.Bio;
            if (parameters.data?.Private!=null)
                data_update.Private = server.ORM.UtilNumberValue(parameters.data.Private) ?? 0;
            if (parameters.data?.Avatar!=null)
                data_update.Avatar = parameters.data.Avatar;
            if (parameters.data?.OtpKey!=null)
                data_update.OtpKey = parameters.data.OtpKey;
            //admin columns
            if (parameters.data?.Type!=null)
                data_update.Type = parameters.data.Type;
            if (parameters.data?.UserLevel!=null)
                data_update.UserLevel = server.ORM.UtilNumberValue(parameters.data.UserLevel);
            if (parameters.data?.Status!=null)
                data_update.Status = parameters.data.Status;
            if (parameters.data?.Active!=null)
                data_update.Active = server.ORM.UtilNumberValue(parameters.data.Active) ?? 0;
            data_update.Modified = new Date().toISOString();

            if (Object.entries(data_update).length>0)
                return server.ORM.Execute({  app_id:parameters.app_id, 
                                            dml:'UPDATE', 
                                            object:'IamUser', 
                                            update:{resource_id:parameters.resource_id, data_app_id:null, data:data_update}}).then((/**@type{server['ORM']['MetaData']['common_result_update']}*/result)=>{
                    if (result.AffectedRows>0)
                        return {result:result, type:'JSON'};
                    else
                        return server.ORM.getError(parameters.app_id, 404);
                });
            else
                return server.ORM.getError(parameters.app_id, 400);
    }
    else
        return server.ORM.getError(parameters.app_id, 404);
};

/**
 * @name deleteRecord
 * @description Delete
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @param {{password:string}} data
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_delete'] }>}
 */
const deleteRecord = async (app_id, resource_id, data) => {
    /**@type{server['ORM']['Object']['IamUser']}*/
    const user = get(app_id, resource_id).result[0];
    if (user){
        if (data.password && await server.security.securityPasswordCompare(app_id, data.password, user.Password))
            return server.ORM.Execute({app_id:app_id, 
                                dml:'DELETE', 
                                object:'IamUser', 
                                delete:{resource_id:resource_id, data_app_id:null}}).then((/**@type{server['ORM']['MetaData']['common_result_delete']}*/result)=>{
                if (result.AffectedRows>0)
                    return {result:result, type:'JSON'};
                else
                    return server.ORM.getError(app_id, 404);
            });
        else
            return server.ORM.getError(app_id, 400);
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
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_delete'] }>}
 */
const deleteRecordAdmin = async (app_id, resource_id) => {
    /**@type{server['ORM']['Object']['IamUser']}*/
    const user = get(app_id, resource_id).result[0];
    if (user){
        return server.ORM.Execute({app_id:app_id, dml:'DELETE', object:'IamUser', delete:{resource_id:resource_id, data_app_id:null}})
                .then((/**@type{server['ORM']['MetaData']['common_result_delete']}*/result)=>{
                    if (result.AffectedRows>0)
                        return {result:result, type:'JSON'};
                    else
                        return server.ORM.getError(app_id, 404);
                    });
    }
    else
        return user;
};

export {get, getViewProfile, getViewProfileStat, getViewProfileDetail, getViewStatCountAdmin, post, postAdmin, update, updateAdmin, deleteRecord, deleteRecordAdmin};