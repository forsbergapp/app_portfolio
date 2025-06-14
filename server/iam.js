/** @module server/iam */

/**
 * @import {server_server_response,
 *          server_db_document_ConfigServer,
 *          server_db_config_server_service_iam,
 *          server_db_config_server_server,
 *          server_db_table_AppSecret,
 *          server_db_table_IamAppIdToken,
 *          server_db_table_IamAppAccess,
 *          server_db_table_IamMicroserviceToken,
 *          server_db_table_ServiceRegistry,
 *          server_db_table_IamUser,
 *          server_db_table_IamUserApp,
 *          server_db_table_IamUserEvent,
 *          server_db_table_IamControlObserve,server_db_table_IamControlUserAgent,
 *          server_db_table_IamControlIp,
 *          server_iam_access_token_claim,server_iam_access_token_claim_scope_type,
 *          server_iam_microservice_token_claim,
 *          server_bff_endpoint_type,
 *          server_db_iam_app_id_token_insert, 
 *          server_db_common_result_delete,
 *          token_type,
 *          server_db_iam_app_access_type,
 *          server_server_res} from './types.js'
 */

const {serverResponse, serverUtilNumberValue} = await import('./server.js');
const {commonAppHost}= await import('../apps/common/src/common.js');
const ConfigServer = await import('./db/ConfigServer.js');
const AppSecret = await import('./db/AppSecret.js');
const IamControlIp = await import('./db/IamControlIp.js');
const IamControlUserAgent = await import('./db/IamControlUserAgent.js');
const IamControlObserve = await import('./db/IamControlObserve.js');
const IamUser = await import('./db/IamUser.js');
const IamAppAccess = await import('./db/IamAppAccess.js');
const IamAppIdToken = await import('./db/IamAppIdToken.js');
const Security = await import('./security.js');

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
    /**@type{server_db_document_ConfigServer} */
    const configServer = ConfigServer.get({app_id:0}).result;
    return app_id==(serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=> 'APP_ADMIN_APP_ID' in parameter)[0].APP_ADMIN_APP_ID))?
                            app_id:
                                serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=> 'APP_START_APP_ID' in parameter)[0].APP_START_APP_ID)??0;
};
/**
 * @name iamUtilTokenGet
 * @description IAM util decode token using secret and returns claim
 * @function
 * @param {number} app_id
 * @param {string} token
 * @param {token_type} token_type 
 * @returns {server_iam_access_token_claim & {exp:number, iat:number}|server_iam_microservice_token_claim & {exp:number, iat:number}}
 */
const iamUtilTokenGet = (app_id, token, token_type) =>{
    /**@type{server_db_document_ConfigServer} */
    const configServer = ConfigServer.get({app_id:app_id}).result;
    /**@type{*} */
    const verify = Security.jwt.verify(  token.replace('Bearer ','').replace('Basic ',''), 
                                token_type=='MICROSERVICE'?
                                configServer.SERVICE_IAM.filter(parameter=> 'MICROSERVICE_TOKEN_SECRET' in parameter)[0].MICROSERVICE_TOKEN_SECRET:
                                token_type=='ADMIN'?
                                configServer.SERVICE_IAM.filter(parameter=> 'ADMIN_TOKEN_SECRET' in parameter)[0].ADMIN_TOKEN_SECRET:
                                        AppSecret.get({app_id:app_id, resource_id:['APP_ACCESS_EXTERNAL', 'MICROSERVICE'].includes(token_type)?app_id:iamUtilTokenAppId(app_id)}).result[0][  token_type=='APP_ACCESS'?'common_app_access_secret':
                                                                                                                token_type=='APP_ACCESS_EXTERNAL'?'common_app_access_verification_secret':
                                                                                                                token_type=='APP_ACCESS_VERIFICATION'?'common_app_access_verification_secret':
                                                                                                                'common_app_id_secret']);
    if (token_type=='MICROSERVICE')
        /**@type{server_iam_microservice_token_claim & {exp:number, iat:number}} */
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
        /**@type{server_iam_access_token_claim & {exp:number, iat:number}} */
        return {
                app_id:                 verify.app_id,
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
 * @description IAM util token expired
 * @function
 * @param {number}  app_id
 * @param {token_type} token_type 
 * @param {string} token 
 * @returns {boolean}
 */
const iamUtilTokenExpired = (app_id, token_type, token) =>{
    try {
        return iamUtilTokenGet(app_id, token, token_type) && 
                    IamAppAccess.get(app_id,null).result
                    .filter((/**@type{server_db_table_IamAppAccess}*/row)=>row.token==token)[0].res!=1;
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
 * @returns {Promise.<server_server_response>}
 */
const iamUtilTokenExpiredSet = async (app_id, authorization, ip) =>{
    const token = authorization?.split(' ')[1] ?? '';
    /**@type{server_db_table_IamAppAccess}*/
    const iam_app_access_row = IamAppAccess.get(app_id,null).result.filter((/**@type{server_db_table_IamAppAccess}*/row)=>row.token==token &&row.ip == ip)[0];
    if (iam_app_access_row){
        //set token expired
        return IamAppAccess.update(app_id, iam_app_access_row.id??null, {res:2});
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
 * @param {server_server_res} res
 * @param {number} status
 * @param {string} reason
 * @param {boolean} bff
 * @returns {string|void}
 */
const iamUtilResponseNotAuthorized = (res, status, reason, bff=false) => {
    if (bff){
        res.statusCode = status;
        res.statusMessage = reason;
        return iamUtilMessageNotAuthorized();
    }
    else
        serverResponse({result_request:{http:status, code:'IAM',text:iamUtilMessageNotAuthorized(), developerText:reason,moreInfo:null, type:'JSON'},
                        route:null,
                        res:res});
};

/**
 * @name iamAuthenticateUser
 * @description IAM Authenticates admin login
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          idToken:string,
 *          authorization:string,
 *          ip:string,
 *          user_agent:string,
 *          accept_language:string}} parameters
 * @returns {Promise.<server_server_response & {result?:{
 *                                              iam_user_id:        number,
 *                                              iam_user_username:  string,
 *                                              bio?:               string | null,
 *                                              avatar?:            string | null,
 *                                              token_at:           string,
 *                                              exp:                number,
 *                                              iat:                number} }>}
 */
const iamAuthenticateUser = async parameters =>{
    const userpass =  decodeURIComponent(Buffer.from((parameters.authorization || '').split(' ')[1] || '', 'base64').toString('utf-8'));
    const username = userpass.split(':')[0];
    const password = userpass.split(':')[1];

    const {socketConnectedUpdate} = await import('./socket.js');
    /**
     * @param {1|0} result
     * @param {server_db_table_IamUser & {id:number, type:string}} user
     * @param {server_db_iam_app_access_type} token_type
     * @returns {Promise.<server_server_response & {result?:{
     *                                              iam_user_id:number,
     *                                              iam_user_username:string,
     *                                              token_at:string,
     *                                              exp:number,
     *                                              iat:number} }>}
     */
    const check_user = async (result, user, token_type) => {     
        if (result == 1){
            /**
             * @param {server_db_table_IamUserApp['id']} iam_user_app_id
             * @returns {Promise.<server_server_response>}
             */
            const return_result = async (iam_user_app_id) =>{
                //authorize access token ADMIN or APP_ACCESS for active account or APP_ACCESS_VERFICATION
                const jwt_data = iamAuthorizeToken( parameters.app_id, 
                                                    user.active==1?token_type:'APP_ACCESS_VERIFICATION', 
                                                    {   app_id:             iamUtilTokenAppId(parameters.app_id),
                                                        app_custom_id:      null,
                                                        iam_user_app_id:    iam_user_app_id??null,
                                                        iam_user_id:        user.id, 
                                                        iam_user_username:  user.username,
                                                        ip:                 parameters.ip, 
                                                        scope:              'USER'});
                //Save access info in IAM_APP_ACCESS table
                /**@type{server_db_table_IamAppAccess} */
                const file_content = {	
                        type:                   user.active==1?token_type:'APP_ACCESS_VERIFICATION',
                        app_custom_id:          null,
                        iam_user_app_id:        iam_user_app_id??null,
                        iam_user_id:            user.id,
                        iam_user_username:      user.username,
                        app_id:                 iamUtilTokenAppId(parameters.app_id),
                        res:		            result,
                        token:                  jwt_data?jwt_data.token:null,
                        ip:                     parameters.ip,
                        ua:                     null};
                await IamAppAccess.post(parameters.app_id, file_content);
                //update info in connected list and then return login result
                return await socketConnectedUpdate(parameters.app_id, 
                    {   idToken:                parameters.idToken,
                        iam_user_id:            user.id,
                        iam_user_username:      user.username,
                        iam_user_type:          user.type,
                        token_access:           token_type=='ADMIN'?null:jwt_data?jwt_data.token:null,
                        token_admin:            token_type=='ADMIN'?jwt_data?jwt_data.token:null:null,
                        ip:                     parameters.ip,
                        headers_user_agent:     parameters.user_agent,
                        headers_accept_language:parameters.accept_language})
                .then((result_socket)=>{
                    return  result_socket.http?result_socket:{result:{  iam_user_id:    user.id,
                                                                        iam_user_app_id: iam_user_app_id,
                                                                        //return only if account is active:
                                                                        ...(user.active==1 && {iam_user_username:  user.username}),
                                                                        ...(user.active==1 && {bio:  user.bio}),
                                                                        ...(user.active==1 && {avatar:  user.avatar}),
                                                                        token_at:       jwt_data?jwt_data.token:null,
                                                                        exp:            jwt_data?jwt_data.exp:null,
                                                                        iat:            jwt_data?jwt_data.iat:null,
                                                                        active:         user.active}, 
                                                                    type:'JSON'};
                });
            };
            //user authorized access
            //create IamUserApp record for current app if missing
            const IamUserApp = await import('./db/IamUserApp.js');
            
            const record = IamUserApp.get({ app_id:parameters.app_id, 
                                                        resource_id: null,
                                                        data:{iam_user_id:user.id, data_app_id:parameters.app_id}});
            if (record.result){
                const iam_user_app_id = record.result.length==0?
                                            (await IamUserApp.post(parameters.app_id, {app_id:parameters.app_id, iam_user_id:user.id, json_data:null})).result.insertId:
                                                record.result[0].id;
                return return_result(iam_user_app_id);
            }
            else
                return record;
        }
        else{
            //save log for all login attempts  
            /**@type{server_db_table_IamAppAccess} */
            const file_content = {	
                        type:                   parameters.app_id==serverUtilNumberValue(ConfigServer.get({app_id:parameters.app_id, data:{config_group:'SERVICE_APP',parameter:'APP_ADMIN_APP_ID'}}).result)?
                                                    'ADMIN':
                                                        'APP_ACCESS',
                        app_custom_id:          null,
                        iam_user_app_id:        null,
                        iam_user_id:            user?.id,
                        iam_user_username:      user?.username,
                        app_id:                 parameters.app_id,
                        res:		            result,
                        token:                  null,
                        ip:                     parameters.ip,
                        ua:                     null};
            await IamAppAccess.post(parameters.app_id, file_content);
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
        if (parameters.app_id == serverUtilNumberValue(ConfigServer.get({app_id:parameters.app_id, data:{config_group:'SERVICE_APP',parameter:'APP_ADMIN_APP_ID'}}).result) && IamUser.get(parameters.app_id, null).result.length==0)
            return IamUser.post(parameters.app_id,{
                            username:           username, 
                            password:           password, 
                            password_reminder:  null, 
                            type:               'ADMIN', 
                            bio:                null, 
                            private:            1, 
                            active:             1, 
                            avatar:             null})
                    .then(result=>result.http?result:check_user(1, {id:         result.result.insertId,
                                                                    username:   username,
                                                                    password:   password,
                                                                    password_reminder:null,
                                                                    type:       'ADMIN',
                                                                    private:    1,
                                                                    user_level: null,
                                                                    bio:        null,
                                                                    avatar:     null,
                                                                    active:     1
                                                                    }, 'ADMIN'));
        else{
            const {securityPasswordCompare}= await import('./security.js');

            /**@type{server_db_table_IamUser}*/
            const user =  IamUser.get(parameters.app_id, null).result.filter((/**@type{server_db_table_IamUser}*/user)=>user.username == username)[0];
            if (user && await securityPasswordCompare(parameters.app_id, password, user.password)){
                if (parameters.app_id == serverUtilNumberValue(ConfigServer.get({app_id:parameters.app_id, data:{config_group:'SERVICE_APP',parameter:'APP_ADMIN_APP_ID'}}).result)){
                    //admin allowed to login to admin app only
                    if (user.type=='ADMIN'){
                        /**@ts-ignore */
                        return check_user(1, user, 'ADMIN'); 
                    }
                    else{
                        /**@ts-ignore */
                        return check_user(0, user, 'ADMIN');
                    }
                }
                else{
                    //users allowed to login to apps except admin app
                    if (user.type=='USER'){
                        /**@ts-ignore */
                        return check_user(1, user, 'APP_ACCESS'); 
                    }
                    else{
                        /**@ts-ignore */
                        return check_user(0, user, 'APP_ACCESS');
                    }
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
 * @returns {Promise.<server_server_response & {result?:{
 *                                              otp_key:string,
 *                                              token_at:string|null,
 *                                              exp:number,
 *                                              iat:number,
 *                                              iam_user_app_id: number|null,
 *                                              iam_user_id:number} }>}
 */
const iamAuthenticateUserSignup = async parameters =>{
    const {socketConnectedUpdate} = await import('./socket.js');
    const IamUser = await import('./db/IamUser.js');
    const new_user = await IamUser.post(parameters.app_id, { username:parameters.data.username,
                                                            password:parameters.data.password,
                                                            password_reminder:parameters.data.password_reminder,
                                                            bio:null,
                                                            private:0,
                                                            avatar:null,
                                                            active:0,
                                                            type:'USER'});
    if (new_user.result){
        const jwt_data = iamAuthorizeToken( parameters.app_id, 
                                            'APP_ACCESS_VERIFICATION', 
                                            {   app_id:                 iamUtilTokenAppId(parameters.app_id), 
                                                app_custom_id:          null,
                                                iam_user_app_id:        null,
                                                iam_user_id:            new_user.result.insertId, 
                                                iam_user_username:      parameters.data.username, 
                                                ip:                     parameters.ip, 
                                                scope:                  'USER'});
        /**@type{server_db_table_IamAppAccess} */
        const data_body = { 
            type:                   'APP_ACCESS_VERIFICATION',
            app_custom_id:          null,
            iam_user_app_id:        null,
            iam_user_id:            new_user.result.insertId,
            iam_user_username:      parameters.data.username,
            app_id:                 iamUtilTokenAppId(parameters.app_id),
            res:                    1,
            token:                  jwt_data.token,
            ip:                     parameters.ip,
            ua:                     parameters.user_agent};
        await IamAppAccess.post(parameters.app_id, data_body);
        //updated info in connected list and then return signup result
        return await socketConnectedUpdate(parameters.app_id, 
            {   idToken:                parameters.idToken,
                iam_user_id:            new_user.result.insertId,
                iam_user_username:      parameters.data.username,
                iam_user_type:          'USER',
                token_access:           jwt_data?jwt_data.token:null,
                token_admin:            null,
                ip:                     parameters.ip,
                headers_user_agent:     parameters.user_agent,
                headers_accept_language:parameters.accept_language})
        .then(result_socket=>result_socket.http?result_socket:
                                {result:{
                                                otp_key:        IamUser.get(parameters.app_id, new_user.result.insertId).result[0]?.otp_key,
                                                token_at:       jwt_data.token,
                                                exp:            jwt_data.exp,
                                                iat:            jwt_data.iat,
                                                iam_user_app_id: null,
                                                iam_user_id:    new_user.result.insertId},
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
 * @returns {Promise.<server_server_response & { result?:{activated:number} }>}
 */
const iamAuthenticateUserActivate = async parameters =>{
    if (parameters.data.verification_type=='1' || parameters.data.verification_type=='2'){
        const Security= await import('./security.js');    
        const result_activate =  await Security.securityTOTPValidate(parameters.data.verification_code, IamUser.get(parameters.app_id, parameters.resource_id).result[0]?.otp_key);
        if (result_activate){
            //set user active = 1
            IamUser.updateAdmin({app_id:parameters.app_id, resource_id:parameters.resource_id, data:{active:1}});

            const IamUserEvent = await import('./db/IamUserEvent.js');
            /**@type{server_db_table_IamUserEvent}*/
            const eventData = {
                /**@ts-ignore */
                iam_user_id:    iamUtilTokenGet(parameters.app_id, parameters.authorization, 'APP_ACCESS_VERIFICATION').iam_user_id,
                event:          serverUtilNumberValue(parameters.data.verification_type)==1?
                                    'OTP_LOGIN':
                                        'OTP_SIGNUP'
            };
            eventData.event_status='SUCCESSFUL';
            return IamUserEvent.post(parameters.app_id, eventData)
                        .then(result=>result.http?result:
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
 * @returns {Promise.<server_server_response & {result?:{updated: number} }>}
 */
const iamAuthenticateUserUpdate = async parameters => {
    
    const result_totp =  await Security.securityTOTPValidate(parameters.data.totp, IamUser.get(parameters.app_id, parameters.resource_id).result[0]?.otp_key);
    if (result_totp){
        const IamUserEvent = await import('./db/IamUserEvent.js');

        /**@type{server_db_table_IamUser} */
        const data_update = {   type:               IamUser.get(parameters.app_id, parameters.resource_id).result[0].type,
                                bio:                parameters.data.bio,
                                private:            parameters.data.private,
                                username:           parameters.data.username,
                                password:           parameters.data.password,
                                password_new:       (parameters.data.password_new && parameters.data.password_new!='')==true?parameters.data.password_new:null,
                                password_reminder:  (parameters.data.password_reminder && parameters.data.password_reminder!='')==true?parameters.data.password_reminder:null,
                                avatar:             parameters.data.avatar
                            };
        /**@type{server_db_table_IamUserEvent}*/
        const eventData = {
            /**@ts-ignore */
            iam_user_id: parameters.resource_id,
            event: 'USER_UPDATE'
        };
        return IamUser.update(parameters.app_id, parameters.resource_id, data_update)
            .then(result_update=>{
            if (result_update.result){
                eventData.event_status='SUCCESSFUL';
                return  IamUserEvent.post(parameters.app_id, eventData)
                        .then(result=>result.http?
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
                eventData.event_status='FAIL';
                return IamUserEvent.post(parameters.app_id, eventData)
                        .then(result=>result.http?
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
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_delete }>}
 */
const iamAuthenticateUserDelete = async parameters => IamUser.deleteRecord(parameters.app_id, parameters.resource_id, {password:parameters.data.password});

/**
 * @name iamAuthenticateUserDbDelete
 * @description IAM Authenticates user delete of database user and logs out
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
* @returns {Promise.<server_server_response & {result?:server_db_common_result_delete }>}
*/
const iamAuthenticateUserAppDelete = async parameters => {
    const IamUser = await import('./db/IamUser.js');
    const IamUserApp = await import('./db/IamUserApp.js');
    const {securityPasswordCompare}= await import('./security.js');    
    if (parameters.resource_id!=null){
        const user = IamUser.get(parameters.app_id, parameters.data.iam_user_id);
        if (user.result)
            if (await securityPasswordCompare(parameters.app_id, parameters.data.password, user.result[0]?.password))
                return await iamUserLogout({app_id:parameters.app_id,
                                            idToken:parameters.idToken,
                                            ip:parameters.ip,
                                            authorization:parameters.authorization,
                                            user_agent:parameters.user_agent,
                                            accept_language:parameters.accept_language})
                            .then(result_logout=>result_logout.http?
                                                        result_logout:
                                                            IamUserApp.deleteRecord({   app_id:parameters.app_id, 
                                                                                        resource_id:parameters.resource_id}));
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
 *          endpoint: server_bff_endpoint_type,
 *          authorization: string,
 *          host: string,
 *          AppId:number,
 *          AppSignature:string,
 *          ip: string,
 *          res: server_server_res}} parameters
 * @returns {Promise.<{app_id:number|null}>}
 */
 const iamAuthenticateCommon = async parameters  =>{
    /**@type{server_db_document_ConfigServer} */
    const configServer = ConfigServer.get({app_id:0}).result;
    const apphost = commonAppHost(parameters.host, parameters.endpoint, parameters.AppId, parameters.AppSignature);
    const app_id_token = iamUtilTokenAppId(apphost.app_id??0);
    if (parameters.endpoint=='APP_EXTERNAL' ||
        parameters.endpoint=='APP_ACCESS_EXTERNAL' ||
        parameters.endpoint=='MICROSERVICE_AUTH')
        return {app_id:apphost.app_id};
    else
        if (parameters.endpoint=='MICROSERVICE'){
            const ServiceRegistry = await import('./db/ServiceRegistry.js');
            const IamMicroserviceToken = await import('./db/IamMicroserviceToken.js');
            //authenticate access token
            const microservice_token = parameters.authorization?.split(' ')[1] ?? '';
            /**@type{*} */
            const microservice_token_decoded = Security.jwt.verify(
                                                    microservice_token.replace('Bearer ','').replace('Basic ',''),
                                                    configServer.SERVICE_IAM.filter(parameter=> 'MICROSERVICE_TOKEN_SECRET' in parameter)[0].MICROSERVICE_TOKEN_SECRET);
            /**@type{server_db_table_ServiceRegistry}*/
            const service = ServiceRegistry.get({   app_id:apphost.app_id??0,
                                                    resource_id:null, 
                                                    data:{name:microservice_token_decoded.service_registry_name}}).result[0];
            /**@type{server_db_table_IamMicroserviceToken[]}*/
            if (microservice_token_decoded.app_id == apphost.app_id && 
                microservice_token_decoded.service_registry_id == service.id &&
                microservice_token_decoded.service_registry_name == service.name &&
                microservice_token_decoded.scope == 'MICROSERVICE' && 
                microservice_token_decoded.ip == parameters.ip &&
                //authenticate host with port, since microservice can use same host and different ports
                microservice_token_decoded.host == parameters.host){
                if (IamMicroserviceToken.get({app_id:apphost.app_id??0, resource_id:null}).result
                    .filter((/**@type{server_db_table_IamMicroserviceToken}*/row)=>
                                                            //Authenticate service registry same id and name as in record
                                                            row.service_registry_id     == service.id &&
                                                            row.service_registry_name   == service.name &&
                                                            //Authenticate app id
                                                            row.app_id                  == apphost.app_id &&
                                                            //Authenticate token is valid
                                                            row.res                     == 1 &&
                                                            //Authenticate IP address
                                                            row.ip                      == parameters.ip &&
                                                            //Authenticate host
                                                            row.host                    == parameters.host &&
                                                            //Authenticate the token string
                                                            row.token                   == microservice_token
                                                        )[0])
                    return {app_id:apphost.app_id};
                else
                    return {app_id:null};
            }
            else
                return {app_id:null};
        }
        else
            if (apphost.app_id !=null && parameters.endpoint && parameters.idToken)
                try {
                    //authenticate id token created by start app id
                    const id_token_decoded = iamUtilTokenGet(apphost.admin?apphost.app_id:app_id_token, parameters.idToken, 'APP_ID');
                    /**@type{server_db_table_IamAppIdToken}*/
                    const log_id_token = IamAppIdToken.get({
                                                                        app_id:apphost.admin?apphost.app_id:app_id_token, 
                                                                        resource_id:null,
                                                                        data:{data_app_id:app_id_token}})
                                                    .result.filter((/**@type{server_db_table_IamAppIdToken}*/row)=> 
                                                        row.app_id == (apphost.admin?apphost.app_id:app_id_token) && row.ip == parameters.ip && row.token == parameters.idToken)[0];
                    if ((id_token_decoded?.app_id == app_id_token && 
                        (id_token_decoded.scope == 'APP' ||id_token_decoded.scope == 'REPORT' ||id_token_decoded.scope == 'MAINTENANCE') && 
                        id_token_decoded.ip == parameters.ip &&
                        log_id_token)){
                        if (parameters.endpoint=='APP_ID')
                            return {app_id:apphost.app_id};
                        else{
                            //validate parameters.endpoint, app_id and authorization
                            switch (true){
                                case parameters.endpoint=='IAM' && parameters.authorization.toUpperCase().startsWith('BASIC'):{
                                    if (apphost.admin)
                                        return {app_id:apphost.app_id};
                                    else
                                        if (serverUtilNumberValue(configServer.SERVICE_IAM.filter(parameter=> 'USER_ENABLE_LOGIN' in parameter)[0].USER_ENABLE_LOGIN)==1)
                                            return {app_id:apphost.app_id};
                                        else
                                            return {app_id:null};
                                }
                                case parameters.endpoint=='ADMIN' && apphost.admin && parameters.authorization.toUpperCase().startsWith('BEARER'):
                                case parameters.endpoint=='APP_ACCESS_VERIFICATION' && parameters.authorization.toUpperCase().startsWith('BEARER'):
                                case parameters.endpoint=='APP_ACCESS' && serverUtilNumberValue(configServer.SERVICE_IAM.filter(parameter=> 'USER_ENABLE_LOGIN' in parameter)[0].USER_ENABLE_LOGIN)==1 && parameters.authorization.toUpperCase().startsWith('BEARER'):{
                                    //authenticate access token
                                    const access_token = parameters.authorization?.split(' ')[1] ?? '';
                                    const access_token_decoded = iamUtilTokenGet(apphost.admin?apphost.app_id:app_id_token, access_token, parameters.endpoint);
                                    
                                    /**@type{server_db_table_IamAppAccess[]}*/
                                    if (access_token_decoded.app_id == (apphost.admin?apphost.app_id:app_id_token) && 
                                        access_token_decoded.scope == 'USER' && 
                                        access_token_decoded.ip == parameters.ip ){
                                        if (IamAppAccess.get(apphost.app_id, null).result
                                            .filter((/**@type{server_db_table_IamAppAccess}*/row)=>
                                                                                    //Authenticate IAM user
                                                                                    row.iam_user_app_id         == access_token_decoded.iam_user_app_id && 
                                                                                    row.iam_user_id             == access_token_decoded.iam_user_id && 
                                                                                    row.iam_user_username       == access_token_decoded.iam_user_username && 
                                                                                    //Authenticate app id
                                                                                    row.app_id                  == (apphost.admin?apphost.app_id:app_id_token) &&
                                                                                    //Authenticate token is valid
                                                                                    row.res                     == 1 &&
                                                                                    //Authenticate IP address
                                                                                    row.ip                      == parameters.ip &&
                                                                                    //Authenticate the token string
                                                                                    row.token                   == access_token
                                                                                )[0])
                                            return {app_id:apphost.app_id};
                                        else
                                            return {app_id:null};
                                    }
                                    else
                                        return {app_id:null};
                                }
                                case parameters.endpoint=='IAM_SIGNUP' && serverUtilNumberValue(configServer.SERVICE_IAM.filter(parameter=> 'USER_ENABLE_REGISTRATION' in parameter)[0].USER_ENABLE_REGISTRATION)==1 && apphost.admin==false:{
                                    return {app_id:apphost.app_id};
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
 * @name iamAuthenticateRequest
 * @description IAM Authorize request
 *              Controls if AUTHENTICATE_REQUEST_ENABLE=1 else skips all checks
 *              if ip is blocked in IamControlObserve or ip range is blocked in IAM_CONTROL_IP 
 *                  return 401
 *              else
 *                  if request count > rate limit (anonymous, user or admin)
 *                      if fail count > AUTHENTICATE_REQUEST_OBSERVE_LIMIT
 *                          add IamControlObserve with status = 1 and type=BLOCK_IP
 *                      return status 429
 *                  else
 *                      if app_id is unknown
 *                      if user agent is blocked
 *                      if decodeURIComponent() has error 
 *                      if method is not 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'
 *                      if fail block or fail count > AUTHENTICATE_REQUEST_OBSERVE_LIMIT
 *                          add IamControlObserver with status = 1 and type=BLOCK_IP
 *                          return 401
 * @function
 * @param {{ip:string, 
 *          host:string,
 *          method:string,
 *          'user-agent':string,
 *          'accept-language': string,
 *          path: string}} parameters
 * @returns {Promise.<null|{statusCode:number,
 *                          statusMessage: string}>}
 */
 const iamAuthenticateRequest = async parameters => {
    const app_id = commonAppHost(parameters.host, null).app_id;
    //set calling app_id using app_id or common app_id if app_id is unknown
    const calling_app_id = app_id ?? serverUtilNumberValue(ConfigServer.get({app_id:app_id??0, data:{config_group:'SERVICE_APP', parameter:'APP_COMMON_APP_ID'}}).result) ?? 0;

    /**@type{server_db_document_ConfigServer} */
    const config_SERVER = ConfigServer.get({app_id:calling_app_id}).result;

    /**
     * IP to number
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
     * @param {number|null} data_app_id
     * @param {string} ip_v4
     * @returns {boolean}
     */
    const block_ip_control = (app_id, data_app_id, ip_v4) => {
        if (config_SERVER.SERVICE_IAM.filter(row=>'AUTHENTICATE_REQUEST_IP' in row)[0].AUTHENTICATE_REQUEST_IP == '1'){
            /**@type{server_db_table_IamControlIp[]} */
            const ranges = IamControlIp.get(
                                                    app_id, 
                                                    null, 
                                                    /**@ts-ignore */
                                                    {}).result;
            //check if IP is blocked
            if (IamControlObserve.get( app_id, 
                                                null).result.filter((/**@type{server_db_table_IamControlObserve}*/row)=>row.ip==ip_v4 && row.app_id == data_app_id && row.status==1).length>0)
                //IP is blocked in IamControlObserve
                return true;
            else
                if ((ip_v4.match(/\./g)||[]).length==3){
                    for (const element of ranges) {
                        if (IPtoNum(element.from) <= IPtoNum(ip_v4) &&
                            IPtoNum(element.to) >= IPtoNum(ip_v4)) {
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
    /**
     * Controls requests and rate limiter
     * Checks parameters 
     *  RATE_LIMIT_WINDOW_MS                            milliseconds
     *  RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_USER         all REST API paths starting with /bff/app_access
     *  RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_ADMIN        all REST API paths starting with /bff/admin
     *  RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_ANONYMOUS    all other paths
     * @param {number} app_id
     * @param {string} ip
     * @returns {boolean}
     */
    const rateLimiter = (app_id, ip) =>{	
        
        const RATE_LIMIT_WINDOW_MS =                            config_SERVER.SERVICE_IAM.filter(row=>'RATE_LIMIT_WINDOW_MS' in row)[0].RATE_LIMIT_WINDOW_MS;
        const RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_ANONYMOUS =    config_SERVER.SERVICE_IAM.filter(row=>'RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_ANONYMOUS' in row)[0].RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_ANONYMOUS;
        const RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_USER =         config_SERVER.SERVICE_IAM.filter(row=>'RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_USER' in row)[0].RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_USER; 
        const RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_ADMIN =        config_SERVER.SERVICE_IAM.filter(row=>'RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_ADMIN' in row)[0].RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_ADMIN;
  
        const currentTime = Date.now();
        if (!iamRequestRateLimiterCount[ip])
            iamRequestRateLimiterCount[ip] = {count:0, firstRequestTime:currentTime};
          
        const {count, firstRequestTime} = iamRequestRateLimiterCount[ip];
        const USER = parameters.path?.toLowerCase().startsWith('/bff/app_access')?1:null;                                                                              
        const ADMIN = parameters.path?.toLowerCase().startsWith('/bff/admin')?1:null;    
                                                                              
        if (currentTime - firstRequestTime > RATE_LIMIT_WINDOW_MS){
            iamRequestRateLimiterCount[ip] = {count:1, firstRequestTime:currentTime};
            return false;
        }
        else
            /**@ts-ignore */
            if (count < (   (USER && RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_USER) ||
                            (ADMIN && RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_ADMIN)||
                            (USER==null && ADMIN==null && RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_ANONYMOUS)
                        )){
                iamRequestRateLimiterCount[ip].count += 1;
                return false;
            }
            else
                return true;
    };

    if (config_SERVER.SERVICE_IAM.filter(row=>'AUTHENTICATE_REQUEST_ENABLE' in row)[0].AUTHENTICATE_REQUEST_ENABLE=='1'){
        let fail = 0;
        let fail_block = false;
        const ip_v4 = parameters.ip.replace('::ffff:','');
        
        //set record with app_id or empty app_id
        const record = {    iam_user_id:null,
                            app_id:app_id,
                            ip:ip_v4, 
                            user_agent:parameters['user-agent'], 
                            host:parameters.host, 
                            accept_language:parameters['accept-language'], 
                            method:parameters.method,
                            url:parameters.path};
        const result_range = block_ip_control(calling_app_id, app_id, ip_v4);
        if (result_range){
            return {statusCode: 401, 
                    statusMessage: ''};
        }
        else{
            if (rateLimiter(calling_app_id, ip_v4)){
                return {statusCode: 429, 
                        statusMessage: ''};
            }
            else{
                //check if host exists
                if (typeof parameters.host=='undefined'){
                    await IamControlObserve.post(calling_app_id, 
                                                            {   ...record,
                                                                status:1, 
                                                                type:'HOST'});
                    fail ++;
                    fail_block = true;
                }
                if (app_id == null){
                    await IamControlObserve.post(calling_app_id, 
                                                            {   ...record,
                                                                status:0, 
                                                                type:'APP_ID'});
                    fail ++;
                }
                //check if user-agent is blocked
                if(IamControlUserAgent.get(calling_app_id, null).result.filter((/**@type{server_db_table_IamControlUserAgent}*/row)=>row.user_agent== parameters['user-agent']).length>0){
                    //stop always
                    fail_block = true;
                    await IamControlObserve.post(calling_app_id, 
                        {   ...record,
                            status:1, 
                            type:'USER_AGENT'});
                    fail ++;
                }
                //check request
                let err = null;
                try {
                    decodeURIComponent(parameters.path);
                }
                catch(e) {
                    err = e;
                }
                if (err){
                    await IamControlObserve.post(calling_app_id, 
                        {   ...record,
                            status:0, 
                            type:'URI_DECODE'});
                    fail ++;
                }
                //check method
                if (['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].filter(allowed=>allowed==parameters.method).length==0){
                    //stop always
                    fail_block = true;
                    await IamControlObserve.post(calling_app_id, 
                        {   ...record,
                            status:0, 
                            type:'METHOD'});
                    fail ++;
                }
                if (fail>0){
                    if (fail_block ||
                        //check how many observation exists for given app_id or records with unknown app_id
                        IamControlObserve.get(calling_app_id, 
                                                        null).result
                        .filter((/**@type{server_db_table_IamControlObserve}*/row)=>
                                row.ip==ip_v4 && 
                                row.app_id == app_id).length>
                                                    config_SERVER.SERVICE_IAM
                                                    .filter(row=>'AUTHENTICATE_REQUEST_OBSERVE_LIMIT' in row)[0].AUTHENTICATE_REQUEST_OBSERVE_LIMIT){
                        await IamControlObserve.post(calling_app_id,
                                                            {   ...record,
                                                                status:1, 
                                                                type:'BLOCK_IP'});
                    }
                    return {statusCode: 401, statusMessage: ''};
                }
                else
                    return null;
            }
        }
    }
    else
        return null;
};

/**
 * @name iamAuthenticateApp
 * @description Authenticate app in microservice using encrypted message
 * @function
 * @function
 * @memberof ROUTE_REST_API
 * @param { {app_id:number,
 *           resource_id:string,
 *           ip:string,
 *           host:string,
 *           user_agent:string,
 *           data:{ id:*,
 *                  message:string}}} parameters
 * @returns {Promise.<server_server_response>}
 */
 const iamAuthenticateApp = async parameters =>{
    if (parameters.app_id == null)
        return {http:401,
            code:'IAM',
            text:iamUtilMessageNotAuthorized(),
            developerText:null,
            moreInfo:null,
            type:'JSON'
        };
    else{
        const ServiceRegistry = await import('./db/ServiceRegistry.js');
        /**@type{server_db_table_ServiceRegistry[]} */
        const service = ServiceRegistry.get({app_id:parameters.app_id, resource_id:null, data:{name:parameters.resource_id}}).result;
        const decrypted = (()=>{ try {
            const decrypted_message = JSON.parse(Security.securityPrivateDecrypt(service[0].private_key, parameters.data.message));
            //message should have a message key with app_id, client_id and client_secret
            //id key not used here but all endpoints using encrypted messages should use id and message keys
            return ('app_id' in decrypted_message &&
                    'client_id' in decrypted_message &&
                    'client_secret' in decrypted_message)?decrypted_message:null;
        } catch (error) {
            //code:ERR_OSSL_RSA_OAEP_DECODING_ERROR
            return null;
        }})();
        if (decrypted){
            const app_secret = AppSecret.get({app_id:parameters.app_id, resource_id:decrypted.app_id}).result
                            .filter((/**@type{server_db_table_AppSecret}*/app)=>
                                app.common_client_id == decrypted.client_id &&
                                app.common_client_secret == decrypted.client_secret)[0];
            if (app_secret)
                return {result:{}, 
                        type:'JSON'};
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
            return {http:401,
                code:'IAM',
                text:iamUtilMessageNotAuthorized(),
                developerText:null,
                moreInfo:null,
                type:'JSON'
            };        
    }    
};
/**
 * @name iamAuthenticateResource
 * @description Authenticate resource used as REST API parameter
 *              Authenticates using access token if provided or else the idToken
 * @function
 * @param { {app_id:number,
 *           ip:string,
 *           idToken:string,
 *           endpoint:server_bff_endpoint_type,
 *           authorization:string|null,
 *           claim_iam_user_app_id:number|null,
 *           claim_iam_user_id:number|null,
 *           claim_iam_module_app_id:number|null
 *           claim_iam_data_app_id:number|null,
 *           claim_iam_service:string|null}} parameters
 * @returns {boolean}
 */
const iamAuthenticateResource = parameters =>  {
    /**@type{server_db_document_ConfigServer} */
    const configServer = ConfigServer.get({app_id:parameters.app_id}).result;
    const app_id_token = iamUtilTokenAppId(parameters.app_id);
    const app_id_common = serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=> 'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID)??0;
    //authenticate access token
    try {
        if (parameters.app_id == null)
            return false;
        else{
            let authenticate_token;
            //no authentication of external token
            if (parameters.authorization && parameters.endpoint != 'APP_ACCESS_EXTERNAL'){
                //Access token, with user info
                const verify_decoded = iamUtilTokenGet( app_id_token, 
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

                    //authenticate iam user app id if used
                    authenticate_token.iam_user_app_id == (parameters.claim_iam_user_app_id ?? authenticate_token.iam_user_app_id) &&
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
 *           user_agent:string,
 *           data:{ id:*,
 *                  message:string}}} parameters
 * @returns {Promise.<server_server_response>}
 */
const iamAuthenticateMicroservice = async parameters =>{
    const ServiceRegistry = await import('./db/ServiceRegistry.js');
    /**@type{server_db_table_ServiceRegistry[]} */
    const service = ServiceRegistry.get({app_id:parameters.app_id, resource_id:null, data:{name:parameters.resource_id}}).result;
    const decrypted = (()=>{ try {
        //authenticate private key is correct, the content of the message not needed here
        return Security.securityPrivateDecrypt(service[0].private_key, parameters.data.message);
    } catch (error) {
        return null;
    }})();
    //service name and calling host without port should be registered in service registry and message should be decrypted
    if (decrypted && service.length==1 && service[0].server_host == parameters.host.split(':')[0]){
        const IamMicroserviceToken = await import('./db/IamMicroserviceToken.js');
        const token = Security.jwt.sign ({
                                    app_id: parameters.app_id, 
                                    service_registry_id:service[0].id,
                                    service_registry_name: service[0].name,
                                    ip:parameters.ip ?? '', 
                                    ua:parameters.user_agent,
                                    host:parameters.host,
                                    scope:'MICROSERVICE'}, 
                                    ConfigServer.get({  app_id:parameters.app_id, 
                                                        data:{
                                                            config_group:'SERVICE_IAM',
                                                            parameter:'MICROSERVICE_TOKEN_SECRET'
                                                        }
                                                    }).result, 
                                    {expiresIn: ConfigServer.get({  app_id:parameters.app_id, 
                                        data:{
                                            config_group:'SERVICE_IAM',
                                            parameter:'MICROSERVICE_TOKEN_EXPIRE_ACCESS'
                                        }
                                    }).result});
            const jwt_data = {token:token,
                    /**@ts-ignore */
                    exp:Security.jwt.decode(token, { complete: true }).payload.exp,
                    /**@ts-ignore */
                    iat:Security.jwt.decode(token, { complete: true }).payload.iat};
        
            return IamMicroserviceToken.post(
                    parameters.app_id, 
                    {	app_id:     parameters.app_id,
                        /**@ts-ignore */
                        service_registry_id:service[0].id,
                        service_registry_name: service[0].name,
                        res:		1,
                        token:   	jwt_data.token,
                        ip:         parameters.ip ?? '',
                        ua:         parameters.user_agent,
                        host:       parameters.host})
                    .then(result=>{ return result.http?result:{result:jwt_data, type:'JSON'};});
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
 * @param {server_iam_access_token_claim_scope_type} scope
 * @returns {Promise.<string>}
 */
 const iamAuthorizeIdToken = async (app_id, ip, scope)=>{
    const jwt_data = iamAuthorizeToken(app_id, 'APP_ID', {  app_custom_id:null,
                                                            app_id: iamUtilTokenAppId(app_id), 
                                                            iam_user_app_id:null,
                                                            iam_user_id:null,
                                                            iam_user_username:null,
                                                            ip:ip ?? '', 
                                                            scope:scope});

    /**@type{server_db_iam_app_id_token_insert} */
    const file_content = {	app_id:     app_id,
                            res:		1,
                            token:   	jwt_data.token,
                            ip:         ip ?? '',
                            ua:         null};
    return await IamAppIdToken.post(app_id, file_content).then(()=>jwt_data.token);
 };
/**
 * @name iamAuthorizeToken
 * @description Authorize token
 * @function
 * @param {number} app_id
 * @param {'APP_ID'|'APP_ACCESS'|'APP_ACCESS_VERIFICATION'|'ADMIN'|'APP_ACCESS_EXTERNAL'|'MICROSERVICE'} endpoint
 * @param {server_iam_access_token_claim} claim
 * @returns {{
 *              token:string, 
 *              exp:number,             //expires at
 *              iat:number,             //issued at
 * }}
 */
 const iamAuthorizeToken = (app_id, endpoint, claim)=>{
    const appid_token = ['APP_ACCESS_EXTERNAL', 'MICROSERVICE'].includes(endpoint)?app_id:iamUtilTokenAppId(app_id); 
    let secret = '';
    let expiresin = '';
    switch (endpoint){
        //APP ID Token
        case 'APP_ID':{
            secret = AppSecret.get({app_id:app_id, resource_id:appid_token}).result[0].common_app_id_secret;
            expiresin = AppSecret.get({app_id:app_id, resource_id:appid_token}).result[0].common_app_id_expire;
            break;
        }
        //USER Access token
        case 'APP_ACCESS':{
            secret = AppSecret.get({app_id:app_id, resource_id:appid_token}).result[0].common_app_access_secret;
            expiresin = AppSecret.get({app_id:app_id, resource_id:appid_token}).result[0].common_app_access_expire;
            break;
        }
        //USER Access token
        case 'APP_ACCESS_VERIFICATION':{
            secret = AppSecret.get({app_id:app_id, resource_id:appid_token}).result[0].common_app_access_verification_secret;
            expiresin = AppSecret.get({app_id:app_id, resource_id:appid_token}).result[0].common_app_access_verification_expire;
            break;
        }
        //Admin Access token
        case 'ADMIN':{
            secret = ConfigServer.get({app_id:app_id, data:{config_group:'SERVICE_IAM', parameter:'ADMIN_TOKEN_SECRET'}}).result ?? '';
            expiresin = ConfigServer.get({app_id:app_id, data:{config_group:'SERVICE_IAM', parameter:'ADMIN_TOKEN_EXPIRE_ACCESS'}}).result ?? '';
            break;
        }
        //APP Access external token
        //only allowed to use app_access_verification token expire used to set short expire time
        case 'APP_ACCESS_EXTERNAL':{
            secret = AppSecret.get({app_id:app_id, resource_id:appid_token}).result[0].common_app_access_verification_secret;
            expiresin = AppSecret.get({app_id:app_id, resource_id:appid_token}).result[0].common_app_access_verification_expire;
            break;
        }
    }
    /**@type{server_iam_access_token_claim} */
    const access_token_claim = {app_id:                 appid_token,
                                app_custom_id:          claim.app_custom_id,
                                iam_user_app_id:        claim.iam_user_app_id,
                                iam_user_id:            claim.iam_user_id,
                                iam_user_username:      claim.iam_user_username,
                                ip:                     claim.ip,
                                scope:                  claim.scope};
    const token = Security.jwt.sign (access_token_claim, secret, {expiresIn: expiresin});
    return {token:token,
            /**@ts-ignore */
            exp:Security.jwt.decode(token, { complete: true }).payload.exp,
            /**@ts-ignore */
            iat:Security.jwt.decode(token, { complete: true }).payload.iat};
};

/**
 * @name iamAppAccessGet
 * @description Get records
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:Number,
 *          data:{  iam_user_id?:string|null,
 *                  data_app_id?:string|null}}} parameters
 * @returns {server_server_response & {result?:server_db_table_IamAppAccess[] }}
 */
const iamAppAccessGet = parameters => {const rows = IamAppAccess.get(parameters.app_id, null).result
                                                                .filter((/**@type{server_db_table_IamAppAccess}*/row)=>
                                                                    row.iam_user_id==serverUtilNumberValue(parameters.data.iam_user_id) &&  
                                                                    row.app_id==(serverUtilNumberValue(parameters.data.data_app_id==''?null:parameters.data.data_app_id) ?? row.app_id));
                                                    
                                                    return {result:rows.length>0?
                                                                rows.sort(( /**@type{server_db_table_IamAppAccess}*/a,
                                                                            /**@type{server_db_table_IamAppAccess}*/b)=> 
                                                                            //sort descending on created
                                                                            /**@ts-ignore */
                                                                            a.created.localeCompare(b.created)==1?-1:1):
                                                                    [], 
                                                            type:'JSON'};
                                                };

/**
 * @name iamUserGet
 * @description User get
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_table_IamUser }>}
 */
const iamUserGet = async parameters =>{
    const IamUser = await import('./db/IamUser.js');
    
    const result = IamUser.get(parameters.app_id, parameters.resource_id);
    return result.http?
                result:
                    {result:result.result.map((/**@type{server_db_table_IamUser} */row)=>{
                        return {id: row.id,
                                username: row.username,
                                password: row.password,
                                type: row.type,
                                bio: row.bio,
                                private: row.private,
                                //remove OTP key, should only be displayed once at signup
                                otp_key: null,
                                avatar: row.avatar,
                                user_level: row.user_level,
                                status: row.status,
                                created: row.created,
                                modified: row.modified,
                                last_logintime:iamUserGetLastLogin(parameters.app_id, parameters.resource_id)};})[0],
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
 * @returns {Promise.<server_server_response & {result?:server_db_table_IamUser[]}>}
 */
const iamUserGetAdmin = async parameters => {
    const IamUser = await import('./db/IamUser.js');
    const {commonSearchMatch} = await import('../apps/common/src/common.js');
    const order_by_num = parameters.data.order_by =='asc'?1:-1;
    return {
            result:IamUser.get(parameters.app_id, parameters.resource_id).result
                    .filter((/**@type{server_db_table_IamUser}*/row)=>
                                parameters.data.search=='*'?row:
                                (commonSearchMatch(row.username??'', parameters.data?.search??'') ||
                                commonSearchMatch(row.bio??'', parameters.data?.search??'') ||
                                commonSearchMatch(row.otp_key??'', parameters.data?.search??'') ||
                                commonSearchMatch(row.id?.toString()??'', parameters.data?.search??''))
                            )
                    .sort((/**@type{server_db_table_IamUser}*/first, /**@type{server_db_table_IamUser}*/second)=>{
                        const default_sort = 'id';
                        /**@ts-ignore */
                        if (typeof first[parameters.data?.sort==null?'id':parameters.data?.sort] == 'number'){
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
const iamUserGetLastLogin = (app_id, id) =>IamAppAccess.get(app_id, null).result
                                                .filter((/**@type{server_db_table_IamAppAccess}*/row)=>
                                                    row.iam_user_id==id &&  row.app_id==app_id && row.res==1)
                                                .sort((/**@type{server_db_table_IamAppAccess}*/a,
                                                        /**@ts-ignore */
                                                        /**@type{server_db_table_IamAppAccess}*/b)=>a.created < b.created?1:-1)[0]?.created;

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
 *          accept_language:string}} parameters
 * @returns {Promise.<server_server_response>}
 */

const iamUserLogout = async parameters =>{
    const {socketConnectedUpdate, socketExpiredTokensUpdate} = await import('./socket.js');

    //set token expired after user is logged out in app
    const result = await iamUtilTokenExpiredSet(parameters.app_id, parameters.authorization, parameters.ip);
    if (result.result){
        socketExpiredTokensUpdate();
        socketConnectedUpdate(parameters.app_id, 
            {   idToken:parameters.idToken,
                iam_user_id:null,
                iam_user_username:null,
                iam_user_type:null,
                token_access:null,
                token_admin:null,
                ip:parameters.ip,
                headers_user_agent:parameters.user_agent,
                headers_accept_language:parameters.accept_language});
        return result;
    }
    else
        return result;

        
};

export{ iamUtilMessageNotAuthorized,
        iamUtilTokenAppId,
        iamUtilTokenGet,
        iamUtilTokenExpired,
        iamUtilResponseNotAuthorized,
        iamAuthenticateUser,
        iamAuthenticateUserSignup,
        iamAuthenticateUserActivate,
        iamAuthenticateUserUpdate,
        iamAuthenticateUserDelete,
        iamAuthenticateUserAppDelete,
        iamAuthenticateCommon,
        iamAuthenticateRequest,
        iamAuthenticateApp,
        iamAuthenticateResource,
        iamAuthenticateMicroservice,
        iamAuthorizeIdToken,
        iamAuthorizeToken,
        iamAppAccessGet,
        iamUserGet,
        iamUserGetAdmin,
        iamUserGetLastLogin,
        iamUserLogout}; 