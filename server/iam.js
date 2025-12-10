/** @module server/iam */

/**
 * @import {server} from './types.js'
 */

const {server} = await import('./server.js');

/**
 * @name iamRequestRateLimiterCount
 * @description Rate limiter 
 * @constant
 * @type{Object.<string,{count:number, firstRequestTime:number}>} 
 */
const iamRequestRateLimiterCount = {};

/**
 * @name iamUtilMessageNotAuthorized
 * @description Returns not authorized message
 * @function
 * @returns {string}
 */
const iamUtilMessageNotAuthorized = () => '⛔';

/**
 * @name iamUtilTokenAppId
 * @description Returns app id where token is created
 * @function
 * @param {number} app_id
 * @returns {number}
 */
const iamUtilTokenAppId = app_id => {
    /**@type{server['ORM']['Object']['OpenApi']['components']['parameters']['config']} */
    const openapiConfig = server.ORM.db.OpenApi.getViewConfig({app_id:0, data:{}}).result;
    return app_id==(server.ORM.UtilNumberValue(openapiConfig.APP_ADMIN_APP_ID.default))?
                            app_id:
                                server.ORM.UtilNumberValue(openapiConfig.APP_COMMON_APP_ID.default)??0;
};
/**
 * @name iamUtilTokenGet
 * @description IAM util decode token using secret and returns claim
 * @function
 * @param {number} app_id
 * @param {string} token
 * @param {server['ORM']['Type']['TokenType']} token_type 
 * @returns {server['iam']['iam_access_token_claim'] |server['iam']['iam_microservice_token_claim'] & {app_id_token?:number, exp:number, iat:number}}
 */
const iamUtilTokenGet = (app_id, token, token_type) =>{
    /**@type{server['ORM']['Object']['OpenApi']['components']['parameters']['config']} */
    const openapiConfig = server.ORM.db.OpenApi.getViewConfig({app_id:0, data:{}}).result;
    /**@type{*} */
    const verify = server.security.jwt.verify( token.replace('Bearer ','').replace('Basic ',''), 
                                        token_type=='MICROSERVICE'?
                                            openapiConfig.IAM_MICROSERVICE_TOKEN_SECRET.default:
                                                token_type=='ADMIN'?
                                                    openapiConfig.IAM_ADMIN_TOKEN_SECRET.default:
                                                                token_type == 'APP_ACCESS'?
                                                                    openapiConfig.IAM_USER_TOKEN_APP_ACCESS_SECRET.default:
                                                                        ['APP_ACCESS_EXTERNAL', 'APP_ACCESS_VERIFICATION'].includes(token_type)?
                                                                            openapiConfig.IAM_USER_TOKEN_APP_ACCESS_VERIFICATION_SECRET.default:
                                                                                token_type == 'APP_ID'?
                                                                                    openapiConfig.IAM_USER_TOKEN_APP_ID_SECRET.default:
                                                                                        '');
                                                    

    if (token_type=='MICROSERVICE')
        /**@type{server['iam']['iam_microservice_token_claim'] & {exp:number, iat:number}} */
        return {
            app_id:                 verify.app_id,
            service_registry_id:    verify.service_registry_id,
            service_registry_name:  verify.service_registry_name,
            ip:                     verify.ip,
            host:                   verify.host,
            scope:                  verify.scope,
            exp:                    verify.exp,
            iat:                    verify.iat};
    else
        /**@type{server['iam']['iam_access_token_claim'] & {exp:number, iat:number}} */
        return {
                app_id:                 verify.app_id,
                app_id_token:           verify.app_id_token,
                app_custom_id:          verify.app_custom_id,
                iam_user_app_id:        verify.iam_user_app_id,
                iam_user_id:            verify.iam_user_id,
                iam_user_username:      verify.iam_user_username,
                ip:                     verify.ip,
                scope:                  verify.scope,
                exp:                    verify.exp,
                iat:                    verify.iat};
};

/**
 * @name iamUtilTokenExpired
 * @description Checks expired APP_ID token in IamAppIdToken 
 *              or access tokens APP_ACCESS, APP_ACCESS_VERIFICATION, APP_ACCESS_EXTERNAL or ADMIN in IamAppAccess
 * @function
 * @param {number}  app_id
 * @param {server['ORM']['Type']['TokenType']} token_type 
 * @param {string} token 
 * @returns {boolean}
 */
const iamUtilTokenExpired = (app_id, token_type, token) =>{
    try {
        return iamUtilTokenGet(app_id, token, token_type) && 
                    (token_type=='APP_ID' && server.ORM.db.IamAppIdToken.get({app_id:app_id, resource_id:null, data:{data_app_id:null}}).result
                    .filter((/**@type{server['ORM']['Object']['IamAppIdToken']}*/row)=>row.Token==token)[0].Res!=1) ||
                    (token_type!='APP_ID' && server.ORM.db.IamAppAccess.get(app_id,null).result
                    .filter((/**@type{server['ORM']['Object']['IamAppAccess']}*/row)=>row.Token==token)[0].Res!=1);
    } catch (error) {
        return true;   
    }
};

/**
 * @name iamUtilTokenExpiredSet
 * @description IAM util token expired set
 * @function
 * @param {number} app_id
 * @param {string} authorization
 * @param {string} ip
 * @returns {Promise.<server['server']['response']>}
 */
const iamUtilTokenExpiredSet = async (app_id, authorization, ip) =>{
    const token = authorization?.split(' ')[1] ?? '';
    /**@type{server['ORM']['Object']['IamAppAccess']}*/
    const iam_app_access_row = server.ORM.db.IamAppAccess.get(app_id,null).result.filter((/**@type{server['ORM']['Object']['IamAppAccess']}*/row)=>row.Token==token &&row.Ip == ip)[0];
    if (iam_app_access_row){
        //set token expired
        return server.ORM.db.IamAppAccess.update(app_id, iam_app_access_row.Id??null, {res:2});
    }
    else
        return {http:401,
                code:'IAM',
                text:iamUtilMessageNotAuthorized(),
                developerText:null,
                moreInfo:null,
                type:'JSON'
            };
};

/**
 * @name iamUtilResponseNotAuthorized
 * @description IAM util response not authorized
 * @function
 * @param {server['server']['res']} res
 * @param {number} status
 * @param {string} reason
 * @param {boolean} bff
 * @returns {Promise.<string|void>}
 */
const iamUtilResponseNotAuthorized = async (res, status, reason, bff=false) => {
    if (bff){
        res.statusCode = status;
        res.statusMessage = reason;
        return iamUtilMessageNotAuthorized();
    }
    else{
        server.bff.bffResponse({
                    result_request:{http:status, 
                                    code:'IAM',
                                    text:iamUtilMessageNotAuthorized(), 
                                    developerText:reason,
                                    moreInfo:null, 
                                    type:'JSON'},
                                    route:null,
                                    res:res});
    }
};

/**
 * @name iamAuthenticateUser
 * @description IAM Authenticates login
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          idToken:string,
 *          authorization:string,
 *          ip:string,
 *          user_agent:string,
 *          accept_language:string}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:{
 *                                              iam_user_id:        number,
 *                                              iam_user_username:  string,
 *                                              bio?:               string | null,
 *                                              avatar?:            string | null,
 *                                              IamUserApp?: server['ORM']['Object']['IamUserApp'],
 *                                              token_at:           string,
 *                                              exp:                number,
 *                                              iat:                number} }>}
 */
const iamAuthenticateUser = async parameters =>{
    const admin_app_id = server.ORM.UtilNumberValue(server.ORM.db.OpenApi.getViewConfig({app_id:parameters.app_id, data:{parameter:'APP_ADMIN_APP_ID'}}).result);
    const userpass =  decodeURIComponent(Buffer.from((parameters.authorization || '').split(' ')[1] || '', 'base64').toString('utf-8'));
    const username = userpass.split(':')[0];
    const password = userpass.split(':')[1];

    /**
     * @param {1|0} result
     * @param {server['ORM']['Object']['IamUser'] & {Id:number, Type:string}} user
     * @param {server['ORM']['Object']['IamAppAccess']['Type']} token_type
     * @returns {Promise.<server['server']['response'] & {result?:{
     *                                              iam_user_id:number,
     *                                              iam_user_username?:string,
     *                                              bio?:string | null,
     *                                              avatar?:string |null,
     *                                              IamUserApp?: server['ORM']['Object']['IamUserApp'],
     *                                              token_at:string,
     *                                              exp:number,
     *                                              iat:number} }>}
     */
    const check_user = async (result, user, token_type) => {     
        if (result == 1){
            //user authorized access
            const recordIamUserApp = await iamUserLoginApp({  app_id:parameters.app_id, 
                                                    data:{  data_app_id:parameters.app_id,
                                                            iam_user_id:user.Id
                                                            }});
            if (recordIamUserApp.result){
                //authorize access token ADMIN or APP_ACCESS for active account or APP_ACCESS_VERFICATION
                const jwt_data = iamAuthorizeToken( parameters.app_id, 
                                                    user.Active==1?token_type:'APP_ACCESS_VERIFICATION', 
                                                    {   app_id:             parameters.app_id,
                                                        app_id_token:       iamUtilTokenAppId(parameters.app_id),
                                                        app_custom_id:      null,
                                                        iam_user_app_id:    recordIamUserApp.result[0].Id??null,
                                                        iam_user_id:        user.Id, 
                                                        iam_user_username:  user.Username,
                                                        ip:                 parameters.ip, 
                                                        scope:              'USER'});
                //Save access info in IAM_APP_ACCESS table
                /**@type{server['ORM']['Object']['IamAppAccess']} */
                const file_content = {	
                        AppId:                  parameters.app_id,
                        AppIdToken:             iamUtilTokenAppId(parameters.app_id),
                        Type:                   user.Active==1?token_type:'APP_ACCESS_VERIFICATION',
                        Res:		            result,
                        Ip:                     parameters.ip,
                        AppCustomId:            null,
                        IamUserAppId:           recordIamUserApp.result[0].Id??null,
                        IamUserId:              user.Id,
                        IamUserUsername:        user.Username,
                        Token:                  jwt_data?jwt_data.token:null,
                        Ua:                     parameters.user_agent};
                await server.ORM.db.IamAppAccess.post(parameters.app_id, file_content);
                //update info in connected list and then return login result
                return await server.socket.socketConnectedUpdate(parameters.app_id, 
                    {   idToken:                parameters.idToken,
                        iam_user_id:            user.Id,
                        iam_user_username:      user.Username,
                        iam_user_type:          user.Type,
                        token_access:           token_type=='ADMIN'?null:jwt_data?jwt_data.token:null,
                        token_admin:            token_type=='ADMIN'?jwt_data?jwt_data.token:null:null,
                        ip:                     parameters.ip,
                        headers_user_agent:     parameters.user_agent})
                .then((result_socket)=>{
                    return  result_socket.http?result_socket:{result:{  iam_user_id:    user.Id,
                                                                        iam_user_app_id: recordIamUserApp.result[0].Id,
                                                                        //return only if account is active:
                                                                        ...(user.Active==1 && {iam_user_username:  user.Username}),
                                                                        ...(user.Active==1 && {bio:  user.Bio}),
                                                                        ...(user.Active==1 && {avatar:  user.Avatar}),
                                                                        ...(user.Active==1 && {IamUserApp: recordIamUserApp.result[0]}),
                                                                        token_at:       jwt_data?jwt_data.token:null,
                                                                        exp:            jwt_data?jwt_data.exp:null,
                                                                        iat:            jwt_data?jwt_data.iat:null,
                                                                        active:         user.Active}, 
                                                                    type:'JSON'};
                });
            }
            else
                return recordIamUserApp;
        }
        else{
            //save log for all login attempts  
            /**@type{server['ORM']['Object']['IamAppAccess']} */
            const file_content = {	
                        AppId:              parameters.app_id,
                        AppIdToken:         null,
                        Type:               parameters.app_id==admin_app_id?
                                                    'ADMIN':
                                                        'APP_ACCESS',
                        AppCustomId:        null,
                        IamUserAppId:       null,
                        IamUserId:          user?.Id,
                        IamUserUsername:    user?.Username,
                        Res:		            result,
                        Token:                  null,
                        Ip:                     parameters.ip,
                        Ua:                     parameters.user_agent};
            await server.ORM.db.IamAppAccess.post(parameters.app_id, file_content);
            return {http:401,
                code:'IAM',
                text:iamUtilMessageNotAuthorized(),
                developerText:null,
                moreInfo:null,
                type:'JSON'
            };
        }
            
    };
    if(parameters.authorization){       
        //if admin app create user if first time
        if (parameters.app_id == admin_app_id && server.ORM.db.IamUser.get(parameters.app_id, null).result.length==0)
            return server.ORM.db.IamUser.post(parameters.app_id,{
                            Username:           username, 
                            Password:           password, 
                            PasswordReminder:   null, 
                            Type:               'ADMIN', 
                            Bio:                null, 
                            Private:            1, 
                            Active:             1, 
                            Avatar:             null})
                    .then((/**@type{server['server']['response']}*/result)=>result.http?result:check_user(1, {
                                                                    Id:         result.result.InsertId,
                                                                    Username:   username,
                                                                    Password:   password,
                                                                    PasswordReminder:null,
                                                                    Type:       'ADMIN',
                                                                    Private:    1,
                                                                    UserLevel: null,
                                                                    Bio:        null,
                                                                    Avatar:     null,
                                                                    Active:     1
                                                                    }, 'ADMIN'));
        else{

            /**@type{server['ORM']['Object']['IamUser'] & {Id:number, Type:string}}*/
            const user =  server.ORM.db.IamUser.get(parameters.app_id, null).result.filter((/**@type{server['ORM']['Object']['IamUser']}*/user)=>user.Username == username)[0];
            if (user && await server.security.securityPasswordCompare(parameters.app_id, password, user.Password)){
                if (parameters.app_id == admin_app_id){
                    //admin allowed to login to admin app only
                    return check_user(user.Type=='ADMIN'?1:0, user, 'ADMIN'); 
                }
                else{
                    //users allowed to login to apps except admin app
                    return check_user(user.Type=='USER'?1:0, user, 'APP_ACCESS'); 
                }
            }
            else{
                /**@ts-ignore */
                return check_user(0, user, null);
            }
        }
    }
    else
        return {http:401,
            code:'IAM',
            text:iamUtilMessageNotAuthorized(),
            developerText:null,
            moreInfo:null,
            type:'JSON'
        };
};

/**
 * @name iamAuthenticateUserSignup
 * @description IAM Authenticates user signup
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          idToken:string,
 *          ip:string,
 *          user_agent:string,
 *          accept_language:string,
 *          locale:string,
 *          data:{  username:string,
 *                  password:string,
 *                  password_reminder:string|null}}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:{
 *                                              otp_key:string,
 *                                              token_at:string|null,
 *                                              exp:number,
 *                                              iat:number,
 *                                              iam_user_app_id: number|null,
 *                                              iam_user_id:number} }>}
 */
const iamAuthenticateUserSignup = async parameters =>{

    const new_user = await server.ORM.db.IamUser.post(parameters.app_id, { Username:parameters.data.username,
                                                            Password:parameters.data.password,
                                                            PasswordReminder:parameters.data.password_reminder,
                                                            Bio:null,
                                                            Private:0,
                                                            Avatar:null,
                                                            Active:0,
                                                            Type:'USER'});
    if (new_user.result){
        const jwt_data = iamAuthorizeToken( parameters.app_id, 
                                            'APP_ACCESS_VERIFICATION', 
                                            {   app_id:                 parameters.app_id, 
                                                app_id_token:           iamUtilTokenAppId(parameters.app_id), 
                                                app_custom_id:          null,
                                                iam_user_app_id:        null,
                                                iam_user_id:            new_user.result.InsertId, 
                                                iam_user_username:      parameters.data.username, 
                                                ip:                     parameters.ip, 
                                                scope:                  'USER'});
        /**@type{server['ORM']['Object']['IamAppAccess']} */
        const data_body = { 
            AppId:                parameters.app_id,
            AppIdToken:           iamUtilTokenAppId(parameters.app_id),
            Type:                 'APP_ACCESS_VERIFICATION',
            Res:                  1,
            Ip:                   parameters.ip,
            AppCustomId:          null,
            IamUserAppId:         null,
            IamUserId:            new_user.result.InsertId,
            IamUserUsername:      parameters.data.username,
            Token:                  jwt_data.token,
            Ua:                     parameters.user_agent};
        await server.ORM.db.IamAppAccess.post(parameters.app_id, data_body);
        //updated info in connected list and then return signup result
        return await server.socket.socketConnectedUpdate(parameters.app_id, 
            {   idToken:                parameters.idToken,
                iam_user_id:            new_user.result.InsertId,
                iam_user_username:      parameters.data.username,
                iam_user_type:          'USER',
                token_access:           jwt_data?jwt_data.token:null,
                token_admin:            null,
                ip:                     parameters.ip,
                headers_user_agent:     parameters.user_agent})
        .then(result_socket=>result_socket.http?result_socket:
                                {result:{
                                                otp_key:        server.ORM.db.IamUser.get(parameters.app_id, new_user.result.InsertId).result[0]?.otp_key,
                                                token_at:       jwt_data.token,
                                                exp:            jwt_data.exp,
                                                iat:            jwt_data.iat,
                                                iam_user_app_id: null,
                                                iam_user_id:    new_user.result.InsertId},
                                        type:'JSON'});            
    }
    else
        return new_user;
};

/**
 * @name iamAuthenticateUserActivate
 * @description IAM Authenticates user activate
 *              Activates user after user logged in and after signup and verification code is accepted
 *              Authenticates verification code after forgot request and activates account then user gets a new token to change the password
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,  
 *          resource_id:number,
 *          idToken:string,
 *          ip:string,
 *          authorization:string,
 *          user_agent:string,
 *          accept_language:string,
 *          locale:string,
 *          data:{  verification_type:'1'|'2',   //1 LOGIN, 2 SIGNUP
 *                  verification_code:string}}} parameters
 * @returns {Promise.<server['server']['response'] & { result?:{activated:number} }>}
 */
const iamAuthenticateUserActivate = async parameters =>{
    if (server.ORM.UtilNumberValue(parameters.data.verification_type)==1 || server.ORM.UtilNumberValue(parameters.data.verification_type)==2){
        const result_activate =  await server.security.securityTOTPValidate(parameters.data.verification_code, server.ORM.db.IamUser.get(parameters.app_id, parameters.resource_id).result[0]?.OtpKey);
        if (result_activate){
            //set user active = 1
            server.ORM.db.IamUser.updateAdmin({app_id:parameters.app_id, resource_id:parameters.resource_id, data:{active:1}});

            /**@type{server['ORM']['Object']['IamUserEvent']}*/
            const eventData = {
                /**@ts-ignore */
                IamUserId:      iamUtilTokenGet(parameters.app_id, parameters.authorization, 'APP_ACCESS_VERIFICATION').iam_user_id,
                Event:          server.ORM.UtilNumberValue(parameters.data.verification_type)==1?
                                    'OTP_LOGIN':
                                        'OTP_SIGNUP',
                EventStatus:    'SUCCESSFUL'
            };
            return server.ORM.db.IamUserEvent.post(parameters.app_id, eventData)
                        .then((/**@type{server['server']['response']}*/result)=>result.http?result:
                                iamUserLogout(  {app_id:parameters.app_id,
                                                idToken:parameters.idToken,
                                                ip:parameters.ip,
                                                authorization:parameters.authorization,
                                                user_agent:parameters.user_agent,
                                                accept_language:parameters.accept_language})
                                    .then(result=>result.http?result:
                                                    {result:{activated:1}, type:'JSON'}
                                        )
                            );
        }
        else
            return {http:401,
                code:'IAM',
                text:iamUtilMessageNotAuthorized(),
                developerText:null,
                moreInfo:null,
                type:'JSON'
            };
    }
    else
        return {http:400,
            code:'IAM',
            text:iamUtilMessageNotAuthorized(),
            developerText:null,
            moreInfo:null,
            type:'JSON'
        };
};


/**
 * @name iamAuthenticateUserUpdate
 * @description IAM Authenticates user update
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          ip:string,
 *          idToken:string,
 *          authorization:string,
 *          user_agent:string,
 *          accept_language:string,
 *          data :{ username:string,
 *                  password:string,
 *                  password_new:string,
 *                  password_reminder:string,
 *                  bio:string,
 *                  private:number,
 *                  avatar:string,
 *                  totp:string},
 *          locale:string}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:{updated: number} }>}
 */
const iamAuthenticateUserUpdate = async parameters => {
    const result_totp =  await server.security.securityTOTPValidate(parameters.data.totp, 
                                                                    server.ORM.db.IamUser.get(parameters.app_id, parameters.resource_id).result[0]?.OtpKey);
    if (result_totp){

        /**@type{server['ORM']['Object']['IamUser']} */
        const data_update = {   Type:               server.ORM.db.IamUser.get(parameters.app_id, parameters.resource_id).result[0].Type,
                                Bio:                parameters.data.bio,
                                Private:            parameters.data.private,
                                Username:           parameters.data.username,
                                Password:           parameters.data.password,
                                PasswordNew:       (parameters.data.password_new && parameters.data.password_new!='')==true?parameters.data.password_new:null,
                                PasswordReminder:  (parameters.data.password_reminder && parameters.data.password_reminder!='')==true?parameters.data.password_reminder:null,
                                Avatar:             parameters.data.avatar
                            };
        /**@type{server['ORM']['Object']['IamUserEvent']}*/
        const eventData = {
            IamUserId: parameters.resource_id,
            Event: 'USER_UPDATE'
        };
        return server.ORM.db.IamUser.update(parameters.app_id, parameters.resource_id, data_update)
            .then((/**@type{server['server']['response']}}*/result_update)=>{
            if (result_update.result){
                eventData.EventStatus='SUCCESSFUL';
                return  server.ORM.db.IamUserEvent.post(parameters.app_id, eventData)
                        .then((/**@type{server['server']['response']}}*/result)=>result.http?
                                        result:
                                        iamUserLogout({app_id:parameters.app_id,
                                            idToken:parameters.idToken,
                                            authorization:parameters.authorization,
                                            ip:parameters.ip,
                                            user_agent:parameters.user_agent,
                                            accept_language:parameters.accept_language})
                                        .then(result_logout=>result_logout.http?
                                                                result_logout:
                                                                    {result:{updated:1}, type:'JSON'})
                            );
            }
            else{
                eventData.EventStatus='FAIL';
                return server.ORM.db.IamUserEvent.post(parameters.app_id, eventData)
                        .then((/**@type{server['server']['response']}}*/result)=>result.http?
                                        result:
                                            result_update.http?
                                                result_update:
                                                    {   http:404,
                                                        code:'IAM',
                                                        text:'?!',
                                                        developerText:null,
                                                        moreInfo:null,
                                                        type:'JSON'
                                                    }
                        );
            }
        });
    }
    else
        return {   http:401,
            code:'IAM',
            text:iamUtilMessageNotAuthorized(),
            developerText:null,
            moreInfo:null,
            type:'JSON'
        };
};
/**
 * @name iamAuthenticateUserDelete
 * @description IAM Authenticates user delete of IAM user
  * @function 
 * @param {{app_id:number,
 *          resource_id:number,
 *          ip:string,
 *          idToken:string,
 *          authorization:string,
 *          user_agent:string,
 *          accept_language:string,
 *          data:{password:string},
 *          locale:string}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_delete'] }>}
 */
const iamAuthenticateUserDelete = async parameters => server.ORM.db.IamUser.deleteRecord(parameters.app_id, parameters.resource_id, {password:parameters.data.password});

/**
 * @name iamAuthenticateUserAppDelete
 * @description IAM Authenticates delete of user app
 * @function 
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          ip:string,
 *          idToken:string,
 *          authorization:string,
 *          user_agent:string,
 *          accept_language:string,
 *          data:{   data_app_id:number,
 *                   iam_user_id:number,
 *                   password:string},
 *          locale:string}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_delete'] }>}
 */
const iamAuthenticateUserAppDelete = async parameters => {
    if (parameters.resource_id!=null){
        const user = server.ORM.db.IamUser.get(parameters.app_id, parameters.data.iam_user_id);
        if (user.result)
            if (await server.security.securityPasswordCompare(parameters.app_id, parameters.data.password, user.result[0]?.Password))
                return server.ORM.db.IamUserApp.deleteRecord({app_id:parameters.app_id, 
                                                resource_id:parameters.resource_id});
            else
                return {http:401,
                        code:'IAM',
                        text:iamUtilMessageNotAuthorized(),
                        developerText:null,
                        moreInfo:null,
                        type:'JSON'
                    };
        else
            return user;
    }
    return {http:400,
            code:'IAM',
            text:iamUtilMessageNotAuthorized(),
            developerText:null,
            moreInfo:null,
            type:'JSON'
        };
};

/**
 * @name iamAuthenticateCommon
 * @description IAM Middleware authenticate IAM users
 * @function
 * @param {{idToken: string,
 *          endpoint: server['bff']['parameters']['endpoint'],
 *          authorization: string,
 *          host: string,
 *          security:{
 *                      IamEncryption:  server['ORM']['Object']['IamEncryption']|null,
 *                      idToken:        string|null,
 *                      AppId:          number, 
 *                      AppSignature:   string|null
 *                  }|null,
 *          ip: string,
 *          res: server['server']['res']}} parameters
 * @returns {Promise.<{app_id:number|null}>}
 */
 const iamAuthenticateCommon = async parameters  =>{
    /**@type{server['ORM']['Object']['OpenApi']['components']['parameters']['config']} */
    const openapiConfig = server.ORM.db.OpenApi.getViewConfig({app_id:0, data:{}}).result;
    const appIam = await server.app_common.commonAppIam(parameters.host, parameters.endpoint, parameters.security);
    
    if (parameters.endpoint=='APP_EXTERNAL' ||
        parameters.endpoint=='APP_ACCESS_EXTERNAL' ||
        parameters.endpoint=='MICROSERVICE_AUTH')
        return {app_id:appIam.app_id};
    else
        if (parameters.endpoint=='MICROSERVICE'){
            //authenticate access token
            const microservice_token = parameters.authorization?.split(' ')[1] ?? '';
            /**@type{*} */
            const microservice_token_decoded = server.security.jwt.verify(
                                                    microservice_token.replace('Bearer ','').replace('Basic ',''),
                                                    openapiConfig.IAM_MICROSERVICE_TOKEN_SECRET.default);
            /**@type{server['ORM']['Object']['ServiceRegistry']}*/
            const service = server.ORM.db.ServiceRegistry.get({   app_id:appIam.app_id??0,
                                                    resource_id:null, 
                                                    data:{name:microservice_token_decoded.service_registry_name}}).result[0];
            /**@type{server['ORM']['Object']['IamMicroserviceToken'][]}*/
            if (microservice_token_decoded.app_id == appIam.app_id && 
                microservice_token_decoded.service_registry_id == service.Id &&
                microservice_token_decoded.service_registry_name == service.Name &&
                microservice_token_decoded.scope == 'MICROSERVICE' && 
                microservice_token_decoded.ip == parameters.ip &&
                //authenticate host with port, since microservice can use same host and different ports
                microservice_token_decoded.host == parameters.host){
                if (server.ORM.db.IamMicroserviceToken.get({app_id:appIam.app_id??0, resource_id:null}).result
                    .filter((/**@type{server['ORM']['Object']['IamMicroserviceToken']}*/row)=>
                                                            //Authenticate service registry same id and name as in record
                                                            row.ServiceRegistryId     == service.Id &&
                                                            row.ServiceRegistryName   == service.Name &&
                                                            //Authenticate app id
                                                            row.AppId                  == appIam.app_id &&
                                                            //Authenticate token is valid
                                                            row.Res                     == 1 &&
                                                            //Authenticate IP address
                                                            row.Ip                      == parameters.ip &&
                                                            //Authenticate host
                                                            row.Host                    == parameters.host &&
                                                            //Authenticate the token string
                                                            row.Token                   == microservice_token
                                                        )[0])
                    return {app_id:appIam.app_id};
                else
                    return {app_id:null};
            }
            else
                return {app_id:null};
        }
        else
            if (appIam.app_id !=null && parameters.endpoint && parameters.idToken)
                try {
                    const id_token_decoded = iamUtilTokenGet(appIam.app_id, parameters.idToken, 'APP_ID');
                    /**@type{server['ORM']['Object']['IamAppIdToken']}*/
                    const log_id_token = server.ORM.db.IamAppIdToken.get({
                                                            app_id:appIam.app_id, 
                                                            resource_id:null,
                                                            data:{data_app_id:null}})
                                            .result.filter((/**@type{server['ORM']['Object']['IamAppIdToken']}*/row)=> 
                                                row.Ip == parameters.ip && row.Token == parameters.idToken)[0];
                    if (((  appIam.app_id_token     == id_token_decoded.app_id_token && 
                            id_token_decoded.scope  == 'APP' ||id_token_decoded.scope == 'REPORT' ||id_token_decoded.scope == 'MAINTENANCE') && 
                            id_token_decoded.ip     == parameters.ip &&
                            log_id_token)){
                        if (parameters.endpoint=='APP_ID')
                            return {app_id:appIam.app_id};
                        else{
                            //validate parameters.endpoint, app_id and authorization
                            switch (true){
                                case parameters.endpoint=='IAM' && parameters.authorization.toUpperCase().startsWith('BASIC'):{
                                    if (appIam.admin)
                                        return {app_id:appIam.app_id};
                                    else
                                        if (server.ORM.UtilNumberValue(openapiConfig.IAM_USER_ENABLE_LOGIN.default)==1)
                                            return {app_id:appIam.app_id};
                                        else
                                            return {app_id:null};
                                }
                                case parameters.endpoint=='ADMIN' && appIam.admin && parameters.authorization.toUpperCase().startsWith('BEARER'):
                                case parameters.endpoint=='APP_ACCESS_VERIFICATION' && parameters.authorization.toUpperCase().startsWith('BEARER'):
                                case parameters.endpoint=='APP_ACCESS' && server.ORM.UtilNumberValue(openapiConfig.IAM_USER_ENABLE_LOGIN.default)==1 && parameters.authorization.toUpperCase().startsWith('BEARER'):{
                                    //authenticate access token
                                    const access_token = parameters.authorization?.split(' ')[1] ?? '';
                                    const access_token_decoded = iamUtilTokenGet(appIam.app_id, access_token, parameters.endpoint);
                                    /**@ts-ignore */
                                    const iamuserApp = access_token_decoded.iam_user_id?
                                                            (server.ORM.db.IamUserApp.get({app_id:appIam.app_id, 
                                                                            resource_id: null, 
                                                                            /**@ts-ignore */
                                                                            data:{  iam_user_id:access_token_decoded.iam_user_id, 
                                                                                    data_app_id:null}})
                                                                .result??[]).map((/**@type{server['ORM']['Object']['IamUserApp']}*/record)=>record.Id):
                                                            [];
                                    
                                    if (access_token_decoded.app_id_token == appIam.app_id_token && 
                                        access_token_decoded.scope == 'USER' && 
                                        access_token_decoded.ip == parameters.ip ){
                                        if (server.ORM.db.IamAppAccess.get(appIam.app_id, null).result
                                            .filter((/**@type{server['ORM']['Object']['IamAppAccess']}*/row)=>
                                                                                    //Authenticate IAM user
                                                                                    //iam_user_app_id is also saved in token but used as info
                                                                                    iamuserApp.includes(access_token_decoded.iam_user_app_id) &&
                                                                                    row.IamUserId             == access_token_decoded.iam_user_id && 
                                                                                    row.IamUserUsername       == access_token_decoded.iam_user_username && 
                                                                                    //Authenticate app id
                                                                                    appIam.apps.includes(row.AppId) &&
                                                                                    //Authenticate token is valid
                                                                                    row.Res                     == 1 &&
                                                                                    //Authenticate IP address
                                                                                    row.Ip                      == parameters.ip &&
                                                                                    //Authenticate the token string
                                                                                    row.Token                   == access_token
                                                                                )[0])
                                            return {app_id:appIam.app_id};
                                        else
                                            return {app_id:null};
                                    }
                                    else
                                        return {app_id:null};
                                }
                                case parameters.endpoint=='IAM_SIGNUP' && server.ORM.UtilNumberValue(openapiConfig.IAM_USER_ENABLE_REGISTRATION.default)==1 && appIam.admin==false:{
                                    return {app_id:appIam.app_id};
                                }
                                default:
                                    return {app_id:null};
                            }
                        }
                    }
                    else
                        return {app_id:null};
                } catch (error) {
                    return {app_id:null};
                }
            else
                return {app_id:null};
};

/**
 * @name iamAuthenticateRequestRateLimiter
 * @description Controls requests and rate limiter
 *              Checks parameters 
 *                  RATE_LIMIT_WINDOW_MS                            milliseconds
 *                  RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_USER         all REST API paths starting with /bff/app_access
 *                  RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_ADMIN        all REST API paths starting with /bff/admin
 *                  RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_ANONYMOUS    all other paths
 * @param {{app_id:number,
 *          ip:string,
 *          openApi:server['ORM']['Object']['OpenApi'],
 *          path: string}} parameters
 * @returns {boolean}
 */
const iamAuthenticateRequestRateLimiter = parameters =>{	
    const RATE_LIMIT_WINDOW_MS =                            parameters.openApi.components.parameters.config.IAM_RATE_LIMIT_WINDOW_MS.default;
    const RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_ANONYMOUS =    parameters.openApi.components.parameters.config.IAM_RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_ANONYMOUS.default;
    const RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_USER =         parameters.openApi.components.parameters.config.IAM_RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_USER.default; 
    const RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_ADMIN =        parameters.openApi.components.parameters.config.IAM_RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_ADMIN.default;

    const currentTime = Date.now();
    if (!iamRequestRateLimiterCount[parameters.ip])
        iamRequestRateLimiterCount[parameters.ip] = {count:0, firstRequestTime:currentTime};
        
    const {count, firstRequestTime} = iamRequestRateLimiterCount[parameters.ip];
    
    const USER = parameters.path?.toLowerCase().startsWith(parameters.openApi.components.parameters.config.SERVER_REST_RESOURCE_BFF.default + '/app_access')?1:null;                                                                              
    const ADMIN = parameters.path?.toLowerCase().startsWith(parameters.openApi.components.parameters.config.SERVER_REST_RESOURCE_BFF.default + '/admin')?1:null;    
                                                                            
    if (currentTime - firstRequestTime > RATE_LIMIT_WINDOW_MS){
        iamRequestRateLimiterCount[parameters.ip] = {count:1, firstRequestTime:currentTime};
        return true;
    }
    else
        /**@ts-ignore */
        if (count < (   (USER && RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_USER) ||
                        (ADMIN && RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_ADMIN)||
                        (USER==null && ADMIN==null && RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_ANONYMOUS)
                    )){
            iamRequestRateLimiterCount[parameters.ip].count += 1;
            return true;
        }
        else
            return false;
};
/**
 * @name iamObserveLimitReached
 * @description check if observe limit reached
 * @function
 * @param {number} app_id
 * @param {server['ORM']['Object']['OpenApi']} openApi
 * @param {string} ip 
 * @returns {boolean}
 */
const iamObserveLimitReached = (app_id, openApi, ip) =>{
    return server.ORM.db.IamControlObserve.get(app_id, 
                                                null).result
                .filter((/**@type{server['ORM']['Object']['IamControlObserve']}*/row)=>
                        row.Ip==ip && 
                        row.AppId == app_id).length>
                                            openApi.components.parameters.config.IAM_AUTHENTICATE_REQUEST_OBSERVE_LIMIT.default
}
/**
 * @name iamAuthenticateRequest
 * @description IAM Authorize request
 *              Controls if AUTHENTICATE_REQUEST_ENABLE=1 else skips all checks
 *              if ip is blocked in IamControlObserve or ip range is blocked in IAM_CONTROL_IP 
 *                  return 401
 *              else
 *                 if requested path is not APP/ADMIN path or public path according to OpenApi
 *                 if host is not valid
 *                 if user agent is blocked
 *                 if decodeURIComponent() has error 
 *                 if fail block or fail count > AUTHENTICATE_REQUEST_OBSERVE_LIMIT
 *                     add IamControlObserver with status = 1 and type=BLOCK_IP
 *                     return 401
 * @function
 * @param {{ip:string, 
 *          common_app_id:number,
 *          OpenApiPathsMatchPublic:[string, *],
 *          openApi:server['ORM']['Object']['OpenApi'],
 *          req:server['server']['req'],
 *          res:server['server']['res']}} parameters
 * @returns {Promise.<boolean>}
 */
 const iamAuthenticateRequest = async parameters => {
   
    const BLOCKED_PATHS = ['/favicon.ico'];

    let statusCode;
    let statusMessage;
    
    /**
     * @description IP to number
     * @function
     * @param {string} ip
     * @returns {number}
     */
    const IPtoNum = (ip) => {
        return Number(
            ip.split('.')
            .map(d => ('000'+d).substr(-3) )
            .join('')
        );
    };
    /**
     * Controls if ip is blocked
     * @function
     * @param {number} app_id
     * @param {string} ip_v4
     * @returns {boolean}
     */
    const block_ip_control = (app_id, ip_v4) => {
        if (parameters.openApi.components.parameters.config.IAM_AUTHENTICATE_REQUEST_IP.default == '1'){
            /**@type{server['ORM']['Object']['IamControlIp'][]} */
            const ranges = server.ORM.db.IamControlIp.get(
                                                    app_id, 
                                                    null, 
                                                    /**@ts-ignore */
                                                    {}).result;
            //check if IP is blocked
            if (server.ORM.db.IamControlObserve.get( app_id, 
                                                null).result
                    .filter((/**@type{server['ORM']['Object']['IamControlObserve']}*/row)=>
                        row.Ip==ip_v4 && row.AppId == app_id && row.Status==1)
                    .length>0)
                //IP is blocked in IamControlObserve
                return true;
            else
                if ((ip_v4.match(/\./g)||[]).length==3){
                    for (const element of ranges) {
                        if (IPtoNum(element.From) <= IPtoNum(ip_v4) &&
                            IPtoNum(element.To) >= IPtoNum(ip_v4)) {
                                //IP is range blocked in IAM_CONTROL_IP
                                return true;
                        }
                    }
                    return false;
                }
                else
                    return false;
        }
        else
            return false;
    };

    if (BLOCKED_PATHS.includes(parameters.req.originalUrl)){
        //Browser path to block without any more action
        statusCode = 401;
        statusMessage=' ';    
    }
    else{
        let fail = 0;
        let fail_block = false;
        const ip_v4 = parameters.ip.replace('::ffff:','');

        if (iamObserveLimitReached(parameters.common_app_id,parameters.openApi, ip_v4)){
            //use 401 to avoid more explanation
            statusCode = 401, 
            statusMessage= '';
        }
        else{
            /**@type{server['ORM']['Object']['IamControlObserve']} */
            const record = {    IamUserId:null,
                                AppId:parameters.common_app_id,
                                Ip:ip_v4, 
                                UserAgent:parameters.req.headers['user-agent'], 
                                Host:parameters.req.headers.host, 
                                AcceptLanguage:parameters.req.headers['accept-language'], 
                                Method:parameters.req.method,
                                Url:parameters.req.path};
            const result_range = block_ip_control(parameters.common_app_id, ip_v4);
            if (result_range){
                statusCode = 401, 
                statusMessage= '';
            }
            else{
                //match APP/ADMIN path or public path are requested according to OpenApi
                if (!(parameters.openApi.servers.filter(row=>['APP', 'ADMIN'].includes(row['x-type'].default) && row.variables.basePath.default == parameters.req.url)[0] &&
                    parameters.req.method.toUpperCase() == 'GET') &&
                    (!parameters.OpenApiPathsMatchPublic ||
                        (parameters.OpenApiPathsMatchPublic[1][parameters.req.method.toLowerCase()] && 
                        parameters.OpenApiPathsMatchPublic[1][parameters.req.method.toLowerCase()].security
                        .filter((/**@type{Object.<string,string>}*/parameter)=>
                                parameter['$ref']=='#/components/securitySchemes/AuthorizationAccess' && 
                                parameter.default=='public').length==0))){
                                    parameters.res.statusCode = 401;
                                    parameters.res.statusMessage ='';
                    await server.ORM.db.IamControlObserve.post(parameters.common_app_id, 
                                                {   ...record,
                                                    Status:0, 
                                                    Type:'INVALID_PATH'});
                    fail ++;
                }
                //check if host exists
                if (typeof parameters.req.headers.host=='undefined'){
                    await server.ORM.db.IamControlObserve.post(parameters.common_app_id, 
                                                            {   ...record,
                                                                Status:1, 
                                                                Type:'HOST'});
                    fail ++;
                    fail_block = true;
                }
                //check if user-agent is blocked
                if(server.ORM.db.IamControlUserAgent.get(parameters.common_app_id, null).result.filter((/**@type{server['ORM']['Object']['IamControlUserAgent']}*/row)=>row.UserAgent== parameters.req.headers['user-agent']).length>0){
                    //stop always
                    fail_block = true;
                    await server.ORM.db.IamControlObserve.post(parameters.common_app_id, 
                        {   ...record,
                            Status:1, 
                            Type:'USER_AGENT'});
                    fail ++;
                }
                //check request
                let err = null;
                try {
                    decodeURIComponent(parameters.req.path);
                }
                catch(e) {
                    err = e;
                }
                if (err){
                    await server.ORM.db.IamControlObserve.post(parameters.common_app_id, 
                        {   ...record,
                            Status:0, 
                            Type:'URI_DECODE'});
                    fail ++;
                }
                if (fail>0){
                    if (fail_block || iamObserveLimitReached(parameters.common_app_id, parameters.openApi, ip_v4)){
                        await server.ORM.db.IamControlObserve.post(parameters.common_app_id,
                                                            {   ...record,
                                                                Status:1, 
                                                                Type:'BLOCK_IP'});
                    }
                    statusCode = 401;
                    statusMessage= '';
                }   
            }
        }
    }
    parameters.res.statusCode = statusCode?statusCode:parameters.res.statusCode;
    parameters.res.statusMessage = statusMessage?statusMessage:parameters.res.statusMessage;
    if (statusCode !=null)
        return false;
    else
        return true;
};

/**
 * @name iamAuthenticateResource
 * @description Authenticate resource used as REST API parameter
 *              Authenticates using access token if provided or else the idToken
 * @function
 * @param { {app_id:number,
 *           ip:string,
 *           idToken:string,
 *           endpoint:server['bff']['parameters']['endpoint'],
 *           authorization:string|null,
 *           claim_iam_user_app_id:number|null,
 *           claim_iam_user_id:number|null,
 *           claim_iam_module_app_id:number|null
 *           claim_iam_data_app_id:number|null,
 *           claim_iam_service:string|null}} parameters
 * @returns {boolean}
 */
const iamAuthenticateResource = parameters =>  {
    const app_id_common = server.ORM.UtilNumberValue(server.ORM.db.OpenApi.getViewConfig({app_id:0, data:{parameter:'APP_COMMON_APP_ID'}}).result)??0;
    
    const iamuserApp = (parameters.claim_iam_user_id !=null||parameters.claim_iam_user_app_id!=null)?
                            (server.ORM.db.IamUserApp.get({app_id:parameters.app_id, 
                                            resource_id: parameters.claim_iam_user_app_id, 
                                            data:{  iam_user_id:parameters.claim_iam_user_id, 
                                                    data_app_id:null}}).result??[]).map((/**@type{server['ORM']['Object']['IamUserApp']}*/record)=>record.Id):
                                [];

    //authenticate access token
    try {
        if (parameters.app_id == null)
            return false;
        else{
            let authenticate_token;
            //no authentication of external token
            if (parameters.authorization && parameters.endpoint != 'APP_ACCESS_EXTERNAL'){
                //Access token, with user info
                const verify_decoded = iamUtilTokenGet( parameters.app_id, 
                                                        parameters.authorization, 
                                                        parameters.endpoint=='ADMIN'?
                                                            'ADMIN':
                                                            parameters.endpoint=='MICROSERVICE'?
                                                                'MICROSERVICE':
                                                                    parameters.endpoint=='APP_ACCESS'?
                                                                        'APP_ACCESS':
                                                                            'APP_ACCESS_VERIFICATION');
                if (parameters.endpoint=='MICROSERVICE')
                    authenticate_token = {
                        app_id:                 verify_decoded.app_id,
                        /**@ts-ignore */
                        service_registry_id:    verify_decoded.service_registry_id,
                        /**@ts-ignore */
                        service_registry_name:  verify_decoded.service_registry_name,
                        ip:                     verify_decoded.ip,
                        /**@ts-ignore */
                        host:                   verify_decoded.host};
                else
                    authenticate_token = {
                        app_id:         verify_decoded.app_id,
                        /**@ts-ignore */
                        iam_user_app_id:verify_decoded.iam_user_app_id,
                        /**@ts-ignore */
                        iam_user_id:    verify_decoded.iam_user_id,
                        ip:             verify_decoded.ip};
            }
            else{
                //Id token, without user info
                const verify_decoded = iamUtilTokenGet(parameters.app_id, parameters.idToken, 'APP_ID');
                authenticate_token = {
                                    app_id:         verify_decoded.app_id,
                                    iam_user_app_id:null,
                                    iam_user_id:    null,
                                    ip:             verify_decoded.ip};
            }
            
            //function should authenticate at least one of iam user id or data app_id
            return  (parameters.claim_iam_user_app_id !=null || 
                     parameters.claim_iam_user_id !=null || 
                     parameters.claim_iam_module_app_id !=null ||
                     parameters.claim_iam_data_app_id !=null ||
                     parameters.claim_iam_service !=null) &&

                    //authenticate iam user app id if used, iam_user_app_id in token is used as info
                    parameters.claim_iam_user_app_id?iamuserApp.includes(parameters.claim_iam_user_app_id):true &&
                    //authenticate iam user id if used
                    authenticate_token.iam_user_id == (parameters.claim_iam_user_id ?? authenticate_token.iam_user_id) &&
                    
                    //authenticate iam module app id if used, users can only have access to current app id or common app id for data app id claim
                    ([app_id_common, parameters.app_id, null].includes(parameters.claim_iam_module_app_id)) &&
                    //authenticate iam data app id if used, users can only have access to current app id or common app id for data app id claim
                    ([app_id_common, parameters.app_id, null].includes(parameters.claim_iam_data_app_id)) &&
                    //authenticate IP address
                    authenticate_token.ip == parameters.ip &&
                    //authenticate iam service if microservice and if used (only name is authenticated, not service_registry_id)
                    authenticate_token.service_registry_name == (parameters.claim_iam_service ?? authenticate_token.service_registry_name) &&
                    //authenticate host if microservice
                    authenticate_token.host == (parameters.claim_iam_service?authenticate_token.host:authenticate_token.host);
        }
    } catch (error) {
        //Expired or token error
        return false;
    }
};
/**
 * @name iamAuthenticateMicroservice
 * @description Authenticate microservice using encrypted message
 * @function
 * @memberof ROUTE_REST_API
 * @param { {app_id:number,
 *           resource_id:string,
 *           ip:string,
 *           host:string,
 *           user_agent:string}} parameters
 * @returns {Promise.<server['server']['response']>}
 */
const iamAuthenticateMicroservice = async parameters =>{
    /**@type{server['ORM']['Object']['OpenApi']['components']['parameters']['config']} */
    const openapiConfig = server.ORM.db.OpenApi.getViewConfig({app_id:0, data:{}}).result;
    /**@type{server['ORM']['Object']['ServiceRegistry'][]} */
    const service = server.ORM.db.ServiceRegistry.get({app_id:parameters.app_id, resource_id:null, data:{name:parameters.resource_id}}).result;
    
    if (service.length==1 && service[0].ServerHost == parameters.host.split(':')[0]){
        const token = server.security.jwt.sign ({
                                    app_id: parameters.app_id, 
                                    service_registry_id:service[0].Id,
                                    service_registry_name: service[0].Name,
                                    ip:parameters.ip ?? '', 
                                    ua:parameters.user_agent,
                                    host:parameters.host,
                                    scope:'MICROSERVICE'}, 
                                    openapiConfig.IAM_MICROSERVICE_TOKEN_SECRET.default, 
                                    {expiresIn: openapiConfig.IAM_MICROSERVICE_TOKEN_EXPIRE_ACCESS.default});
        const jwt_data = {token:token,
                /**@ts-ignore */
                exp:server.security.jwt.decode(token, { complete: true }).payload.exp,
                /**@ts-ignore */
                iat:server.security.jwt.decode(token, { complete: true }).payload.iat};
    
        return server.ORM.db.IamMicroserviceToken.post(
                parameters.app_id, 
                {	AppId:     parameters.app_id,
                    /**@ts-ignore */
                    ServiceRegistryId:service[0].Id,
                    ServiceRegistryName: service[0].Name,
                    Res:		1,
                    Token:   	jwt_data.token,
                    Ip:         parameters.ip ?? '',
                    Ua:         parameters.user_agent,
                    Host:       parameters.host})
                .then((/**@type{server['server']['response']}}*/result)=>{ 
                    return result.http?result:{result:jwt_data, type:'JSON'};
                });
    }
    else
        return {http:401,
            code:'IAM',
            text:iamUtilMessageNotAuthorized(),
            developerText:null,
            moreInfo:null,
            type:'JSON'
        };    
};
/**
 * @name iamAuthorizeIdToken
 * @description Authorize id token
 * @function
 * @param {number} app_id
 * @param {string|null} ip
 * @param {server['iam']['iam_access_token_claim']['scope']} scope
 * @returns {Promise.<{id:Number, token:string}>}
 */
 const iamAuthorizeIdToken = async (app_id, ip, scope)=>{
    const jwt_data = iamAuthorizeToken(app_id, 'APP_ID', {  app_custom_id:null,
                                                            app_id: app_id, 
                                                            app_id_token:iamUtilTokenAppId(app_id), 
                                                            iam_user_app_id:null,
                                                            iam_user_id:null,
                                                            iam_user_username:null,
                                                            ip:ip ?? '', 
                                                            scope:scope});

    /**@type{server['ORM']['Object']['IamAppIdToken']} */
    const file_content = {	AppId:     app_id,
                            AppIdToken: iamUtilTokenAppId(app_id), 
                            Res:		1,
                            Token:   	jwt_data.token,
                            Ip:         ip ?? '',
                            Ua:         null};
    return await server.ORM.db.IamAppIdToken.post(app_id, file_content)
                .then((/**@type{server['server']['response']}}*/result)=>{
                    return {   id:result.result.InsertId,
                                token:jwt_data.token};
                    });
 };
/**
 * @name iamAuthorizeToken
 * @description Authorize token
 * @function
 * @param {number} app_id
 * @param {'APP_ID'|'APP_ACCESS'|'APP_ACCESS_VERIFICATION'|'ADMIN'|'APP_ACCESS_EXTERNAL'|'MICROSERVICE'} endpoint
 * @param {server['iam']['iam_access_token_claim']} claim
 * @returns {{
 *              token:string, 
 *              exp:number,             //expires at
 *              iat:number,             //issued at
 * }}
 */
 const iamAuthorizeToken = (app_id, endpoint, claim)=>{
    /**@type{server['ORM']['Object']['OpenApi']['components']['parameters']['config']} */
    const openapiConfig = server.ORM.db.OpenApi.getViewConfig({app_id:0, data:{}}).result;
    let secret = '';
    let expiresin = '';
    switch (endpoint){
        case 'APP_ACCESS_VERIFICATION':
        case 'APP_ACCESS':
        case 'APP_ID':{
            secret = openapiConfig[`IAM_USER_TOKEN_${endpoint}_SECRET`].default;
            expiresin = openapiConfig[`IAM_USER_TOKEN_${endpoint}_EXPIRE`].default;
            break;
        }
        //Admin Access token
        case 'ADMIN':{
            secret = openapiConfig.IAM_ADMIN_TOKEN_SECRET.default ?? '';
            expiresin = openapiConfig.IAM_ADMIN_TOKEN_EXPIRE_ACCESS.default ?? '';
            break;
        }
        //APP Access external token
        //only allowed to use app_access_verification token expire used to set short expire time
        case 'APP_ACCESS_EXTERNAL':{
            secret = openapiConfig.IAM_USER_TOKEN_APP_ACCESS_VERIFICATION_SECRET.default;
            expiresin = openapiConfig.IAM_USER_TOKEN_APP_ACCESS_VERIFICATION_EXPIRE.default;
            break;
        }
    }
    /**@type{server['iam']['iam_access_token_claim']} */
    const access_token_claim = {app_id:                 app_id,
                                app_id_token:           ['APP_ACCESS_EXTERNAL', 'MICROSERVICE'].includes(endpoint)?
                                                            app_id:
                                                                claim.app_id_token,
                                app_custom_id:          claim.app_custom_id,
                                iam_user_app_id:        claim.iam_user_app_id,
                                iam_user_id:            claim.iam_user_id,
                                iam_user_username:      claim.iam_user_username,
                                ip:                     claim.ip,
                                scope:                  claim.scope};
    const token = server.security.jwt.sign (access_token_claim, secret, {expiresIn: expiresin});
    return {token:token,
            /**@ts-ignore */
            exp:server.security.jwt.decode(token, { complete: true }).payload.exp,
            /**@ts-ignore */
            iat:server.security.jwt.decode(token, { complete: true }).payload.iat};
};

/**
 * @name iamAppAccessGet
 * @description Get records
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:Number,
 *          data:{  iam_user_id?:string|null,
 *                  data_app_id?:string|null}}} parameters
 * @returns {server['server']['response'] & {result?:server['ORM']['Object']['IamAppAccess'][] }}
 */
const iamAppAccessGet = parameters => {const rows = server.ORM.db.IamAppAccess.get(parameters.app_id, null).result
                                                                .filter((/**@type{server['ORM']['Object']['IamAppAccess']}*/row)=>
                                                                    row.IamUserId==server.ORM.UtilNumberValue(parameters.data.iam_user_id) &&  
                                                                    row.AppId==(server.ORM.UtilNumberValue(parameters.data.data_app_id) ?? row.AppId));
                                                    
                                                    return {result:rows.length>0?
                                                                rows.sort(( /**@type{server['ORM']['Object']['IamAppAccess'] & {Created:string}}*/a,
                                                                            /**@type{server['ORM']['Object']['IamAppAccess'] & {Created:string}}*/b)=> 
                                                                            //sort descending on created
                                                                            
                                                                            a.Created.localeCompare(b.Created)==1?-1:1):
                                                                    [], 
                                                            type:'JSON'};
                                                };
/**
 * @name iamAdminServerConfigGet
 * @description Admin config get
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:'servers'|'config',
 *          data:{pathType?:server['ORM']['Object']['OpenApi']['servers'][0]['x-type']['default'],
 *                parameter?:string}}} parameters
 * @returns {server['server']['response'] & {result?:server["ORM"]["Object"]["OpenApi"]["servers"]|
 *                                                   server['ORM']['Object']['OpenApi']['components']['parameters']['config']|
 *                                                   [*]}}
 */
const iamAdminServerConfigGet = parameters =>{
    if (parameters.resource_id == 'servers')
        return server.ORM.db.OpenApi.getViewServers({   app_id:parameters.app_id, 
                                                        data:{pathType:parameters.data.pathType}});
    else
        if (parameters.resource_id == 'config')
            return server.ORM.db.OpenApi.getViewConfig({app_id:parameters.app_id, 
                                                        data:{parameter:parameters.data.parameter}})
        else
            return {http:400,
                    code:'IAM',
                    text:iamUtilMessageNotAuthorized(),
                    developerText:null,
                    moreInfo:null,
                    type:'JSON'
                };
}
/**
 * @name iamAdminServerConfigUpdate
 * @description Admin config update
 *              pathType = NOHANGING_HTTPS must use port 443
 *              pathType != NOHANGING_HTTPS must NOT use port 443
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:'servers'|'config',
 *          data:{pathType:server['ORM']['Object']['OpenApi']['servers'][0]['x-type']['default'],
 *                host: string,
 *                port: number,
 *                basePath:string,
 *                config_key:keyof server['ORM']['Object']['OpenApi']['servers'][0]['variables']['config'],
 *                config_value:*}}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:{updated: number}}>}
 */
const iamAdminServerConfigUpdate = async parameters =>{
    if (parameters.resource_id == 'servers' && 
        ((parameters.data.pathType == 'NOHANGING_HTTPS' && parameters.data.port == 443)||
        (parameters.data.pathType != 'NOHANGING_HTTPS' && parameters.data.port != 443))){
        //servers cant use port 443 reserved for dummy server
        return await server.ORM.db.OpenApi.updateServersVariables({ app_id:parameters.app_id, 
                                                                    data:{  pathType:parameters.data.pathType, 
                                                                            host:parameters.data.host,
                                                                            port:parameters.data.port,
                                                                            basePath:parameters.data.basePath}})
                .then(()=>{
                    server.updateServer();
                    return {result:{updated:1},
                            type:'JSON'};
                });
    }
    else
        if (parameters.resource_id == 'config'){
            //only #/parameters/config allowed to be updated
            return await server.ORM.db.OpenApi.updateConfig({   app_id:parameters.app_id, 
                                                                data:{  config_key:parameters.data.config_key, 
                                                                        config_value:parameters.data.config_value}})
                    .then(()=>{
                            return {result:{updated:1},
                                    type:'JSON'};
                        });
        }
        else
            return {http:400,
                    code:'IAM',
                    text:iamUtilMessageNotAuthorized(),
                    developerText:null,
                    moreInfo:null,
                    type:'JSON'
                };
        
}
/**
 * @name iamUserGet
 * @description User get
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['iam']['iam_user']}>}
 */
const iamUserGet = async parameters =>{
    
    const result = server.ORM.db.IamUser.get(parameters.app_id, parameters.resource_id);
    return result.http?
                result:
                    {result:result.result.map((/**@type{server['ORM']['Object']['IamUser']} */row)=>{
                        return {Id: row.Id,
                                Username: row.Username,
                                Password: row.Password,
                                PasswordReminder: row.PasswordReminder,
                                Type: row.Type,
                                Bio: row.Bio,
                                Private: row.Private,
                                Avatar: row.Avatar,
                                UserLevel: row.UserLevel,
                                Status: row.Status,
                                Created: row.Created,
                                Modified: row.Modified,
                                LastLoginTime:iamUserGetLastLogin(parameters.app_id, parameters.resource_id)};})[0],
                    type:'JSON'};
};
/**
 * @name iamUserGetAdmin
 * @description Get users by admin
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          data:{  sort?:string|null,
 *                  order_by?:string|null,
 *                  search?:string|null,
 *                  offset?:string|null}}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['Object']['IamUser'][]}>}
 */
const iamUserGetAdmin = async parameters => {

    const order_by_num = parameters.data.order_by =='asc'?1:-1;
    return {
            result:server.ORM.db.IamUser.get(parameters.app_id, parameters.resource_id).result
                    .filter((/**@type{server['ORM']['Object']['IamUser']}*/row)=>
                                parameters.data.search=='*'?row:
                                (server.ORM.UtilSearchMatch(row.Username??'', parameters.data?.search??'') ||
                                server.ORM.UtilSearchMatch(row.Bio??'', parameters.data?.search??'') ||
                                server.ORM.UtilSearchMatch(row.OtpKey??'', parameters.data?.search??'') ||
                                server.ORM.UtilSearchMatch(row.Id?.toString()??'', parameters.data?.search??''))
                            )
                    .sort((/**@type{server['ORM']['Object']['IamUser']}*/first, /**@type{server['ORM']['Object']['IamUser']}*/second)=>{
                        const default_sort = 'Id';
                        /**@ts-ignore */
                        if (typeof first[parameters.data?.sort==null?'Id':parameters.data?.sort] == 'number'){
                            //number sort
                            /**@ts-ignore */
                            const first_sort_num = first[parameters.data.sort==null?default_sort:parameters.data.sort];
                            /**@ts-ignore */
                            const second_sort_num = second[parameters.data.sort==null?default_sort:parameters.data.sort];
                            if ((first_sort_num??0) < (second_sort_num??0) )
                                return -1 * order_by_num;
                            else if ((first_sort_num??0) > (second_sort_num??0))
                                return 1 * order_by_num;
                            else
                                return 0;
                        }
                        else{
                            //string sort with lowercase and localcompare
                            /**@ts-ignore */
                            const first_sort = (first[parameters.data.sort==null?default_sort:parameters.data.sort] ?? '').toString().toLowerCase();
                            /**@ts-ignore */
                            const second_sort = (second[parameters.data.sort==null?default_sort:parameters.data.sort] ?? '').toString().toLowerCase();
                            //using localeCompare as collation method
                            if (first_sort.localeCompare(second_sort)<0 )
                                return -1 * order_by_num;
                            else if (first_sort.localeCompare(second_sort)>0 )
                                return 1 * order_by_num;
                            else
                                return 0;
                        }
                    }),
        type:'JSON'};
};
/**
 * @name iamUserGetLastLogin
 * @description User get last login in current app
 * @function
 * @param {number} app_id
 * @param {number} id
 * @returns {string|null}
 */
const iamUserGetLastLogin = (app_id, id) =>server.ORM.db.IamAppAccess.get(app_id, null).result
                                                .filter((/**@type{server['ORM']['Object']['IamAppAccess']}*/row)=>
                                                    row.IamUserId==id &&  row.AppId==app_id && row.Res==1)
                                                .sort((/**@type{server['ORM']['Object']['IamAppAccess']}*/a,
                                                        /**@ts-ignore */
                                                        /**@type{server['ORM']['IamAppAccess']}*/b)=>a.created < b.created?1:-1)[0]?.created;

/**
 * @name iamUserLogout
 * @description User logout that sets the token as expired and removes the token from the connected list
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          idToken:string,
 *          authorization:string,
 *          ip:string,
 *          user_agent:string,
 *          accept_language:string|null}} parameters
 * @returns {Promise.<server['server']['response']>}
 */

const iamUserLogout = async parameters =>{

    //set token expired after user is logged out in app
    const result = await iamUtilTokenExpiredSet(parameters.app_id, parameters.authorization, parameters.ip);
    if (result.result){
        server.socket.socketExpiredTokenSendSSE();
        server.socket.socketConnectedUpdate(parameters.app_id, 
            {   idToken:parameters.idToken,
                iam_user_id:null,
                iam_user_username:null,
                iam_user_type:null,
                token_access:null,
                token_admin:null,
                ip:parameters.ip,
                headers_user_agent:parameters.user_agent});
        return result;
    }
    else
        return result;        
};
/**
 * @name iamUserLoginApp
 * @description
 * @function
 * @param {{app_id:number,
 *          data:{data_app_id: server['ORM']['Object']['IamUserApp']['AppId'], 
 *                iam_user_id: server['ORM']['Object']['IamUserApp']['IamUserId']}}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['Object']['IamUserApp']}>}
 */
const iamUserLoginApp = async parameters => {
    /**
     * @param{number|null} id 
     */
    const iamuserapp = id => server.ORM.db.IamUserApp.get({app_id:parameters.app_id, 
                                                resource_id: id, 
                                                data:{  iam_user_id:parameters.data.iam_user_id, 
                                                        data_app_id:parameters.data.data_app_id}});
    const record = iamuserapp(null)
    if (record.result){
        return record.result.length==0?
                    iamuserapp((await server.ORM.db.IamUserApp.post(parameters.app_id, {  
                                                                            AppId:parameters.app_id, 
                                                                            IamUserId:parameters.data.iam_user_id, 
                                                                            Document:{
                                                                                PreferenceLocale: null, 
                                                                                PreferenceTimezone: null, 
                                                                                PreferenceDirection: null, 
                                                                                PreferenceArabicScript: null,
                                                                                Custom: null}
                                                                            })).result.InsertId):
                        record;
    }
    else
        return record;
};
export{ iamUtilMessageNotAuthorized,
        iamUtilTokenAppId,
        iamUtilTokenGet,
        iamUtilTokenExpired,
        iamUtilTokenExpiredSet,
        iamUtilResponseNotAuthorized,
        iamAuthenticateUser,
        iamAuthenticateUserSignup,
        iamAuthenticateUserActivate,
        iamAuthenticateUserUpdate,
        iamAuthenticateUserDelete,
        iamAuthenticateUserAppDelete,
        iamAuthenticateCommon,
        iamAuthenticateRequestRateLimiter,
        iamObserveLimitReached,
        iamAuthenticateRequest,
        iamAuthenticateResource,
        iamAuthenticateMicroservice,
        iamAuthorizeIdToken,
        iamAuthorizeToken,
        iamAppAccessGet,
        iamAdminServerConfigGet,
        iamAdminServerConfigUpdate,
        iamUserGet,
        iamUserGetAdmin,
        iamUserGetLastLogin,
        iamUserLogout,
        iamUserLoginApp}; 
        