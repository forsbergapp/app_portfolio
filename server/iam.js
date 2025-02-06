/** @module server/iam */

/**
 * @import {server_server_response,
 *          server_db_file_iam_app_id_token,server_db_file_iam_app_id_token_insert, 
 *          server_db_file_iam_user_app_access,server_db_file_iam_user_app_access_insert,
 *          server_iam_access_token_claim,server_iam_access_token_claim_scope_type,
 *          server_db_file_iam_control_observe,server_db_file_iam_control_user_agent,
 *          server_db_file_iam_control_ip,
 *          server_bff_endpoint_type,
 *          server_db_common_result_delete,
 *          server_db_file_iam_user,
 *          server_db_sql_parameter_user_account_event_insertUserEvent,
 *          token_type,
 *          server_server_res} from './types.js'
 */

/**@type{import('./server.js')} */
const {serverResponse, serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**@type{import('../apps/common/src/common.js')} */
const {commonAppHost}= await import(`file://${process.cwd()}/apps/common/src/common.js`);

/**@type{import('./db/fileModelConfig.js')} */
const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);

/**@type{import('./db/fileModelAppSecret.js')} */
const fileModelAppSecret = await import(`file://${process.cwd()}/server/db/fileModelAppSecret.js`);

/**@type{import('./db/fileModelIamControlIp.js')} */
const fileModelIamControlIp = await import(`file://${process.cwd()}/server/db/fileModelIamControlIp.js`);

/**@type{import('./db/fileModelIamControlUserAgent.js')} */
const fileModelIamControlUserAgent = await import(`file://${process.cwd()}/server/db/fileModelIamControlUserAgent.js`);

/**@type{import('./db/fileModelIamControlObserve.js')} */
const fileModelIamControlObserve = await import(`file://${process.cwd()}/server/db/fileModelIamControlObserve.js`);

/**@type{import('./db/fileModelIamUser.js')} */
const fileModelIamUser = await import(`file://${process.cwd()}/server/db/fileModelIamUser.js`);

/**@type{import('./db/fileModelIamUserAppAccess.js')} */
const fileModelIamUserAppAccess = await import(`file://${process.cwd()}/server/db/fileModelIamUserAppAccess.js`);

/**@type{import('./db/fileModelIamAppIdToken.js')} */
const fileModelIamAppToken = await import(`file://${process.cwd()}/server/db/fileModelIamAppIdToken.js`);

const {default:jwt} = await import('jsonwebtoken');

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
 * @name iamUtilDecode
 * @description IAM util decode idtoken or access token and returns the payload key
 * @function
 * @param {string} token
 * @returns {server_iam_access_token_claim} 
*/
 const iamUtilDecode = token => {
    
    const decoded =  jwt.decode(token.replace('Bearer ','').replace('Basic ',''), { complete: true })?.payload;
    if (decoded){
        /**@ts-ignore*/
        return decoded;
    }
    else
        throw  {http:401,
                code:'IAM',
                text:iamUtilMessageNotAuthorized(),
                developerText:iamUtilDecode,
                moreInfo:null,
                type:'JSON'
            };
};
/**
 * @name iamUtilDecodeVerify
 * @descriotion IAM util decode token using secret and returns claim
 * @function
 * @param {number} app_id
 * @param {string} token
 * @param {token_type} token_type 
 * @returns {server_iam_access_token_claim}
 */
const iamUtilDecodeVerify = (app_id, token, token_type) =>{
    /**@type{*} */
    const verify = jwt.verify(token, token_type=='ADMIN'?
                                        fileModelConfig.get('CONFIG_SERVER','SERVICE_IAM', 'ADMIN_TOKEN_SECRET'):
                                            fileModelAppSecret.get({app_id:app_id, resource_id:app_id}).result[0][  token_type=='APP_ACCESS'?'common_app_access_secret':
                                                                                                                    token_type=='APP_ACCESS_VERIFICATION'?'common_app_access_verification_secret':
                                                                                                                    'common_app_id_secret']);
    /**@type{server_iam_access_token_claim} */
    return {app_id:                 verify.app_id,
            iam_user_id:            verify.iam_user_id,
            iam_user_username:      verify.iam_user_username,
            user_account_id:        verify.user_account_id,
            db:                     verify.db,
            ip:                     verify.ip,
            scope:                  verify.scope,
            tokentimestamp:         verify.tokentimestamp};
};

/**
 * @name iamUtilTokenExpired
 * @description IAM util token expired
 * @function
 * @param {number|null}  app_id
 * @param {token_type} token_type 
 * @param {string} token 
 * @returns {boolean}
 */
const iamUtilTokenExpired = (app_id, token_type, token) =>{
    switch (token_type){
        case 'APP_ACCESS':{
            //exp, iat, tokentimestamp on token
            try {

                return ((jwt.verify(token, fileModelAppSecret.get({app_id:app_id, resource_id:app_id}).result[0]
                            /**@ts-ignore*/
                            .common_app_access_secret).exp ?? 0) * 1000) - Date.now()<0;    
            } catch (error) {
                return true;
            }
        }
        case 'APP_ACCESS_VERIFICATION':{
            //exp, iat, tokentimestamp on token
            try {

                return ((jwt.verify(token, fileModelAppSecret.get({app_id:app_id, resource_id:app_id}).result[0]
                            /**@ts-ignore*/
                            .common_app_access_verification_secret).exp ?? 0) * 1000) - Date.now()<0;    
            } catch (error) {
                return true;
            }
        }
        case 'ADMIN':{
            //exp, iat, tokentimestamp on token
            try {
                return ((jwt.verify(token, fileModelConfig.get('CONFIG_SERVER','SERVICE_IAM', 'ADMIN_TOKEN_SECRET'))
                                /**@ts-ignore*/
                                .exp ?? 0) * 1000) - Date.now()<0;    
            } catch (error) {
                return true;
            }
        }
        default:
            return false;
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
    /**@type{server_db_file_iam_user_app_access}*/
    const iam_user_app_access_row = fileModelIamUserAppAccess.get(app_id,null).result.filter((/**@type{server_db_file_iam_user_app_access}*/row)=>row.token==token &&row.ip == ip)[0];
    if (iam_user_app_access_row){
        //set token expired
        return fileModelIamUserAppAccess.update(app_id, iam_user_app_access_row.id, {res:2});
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
 * @name iamUtilVerificationCode
 * @description Generate random verification code between 100000 and 999999
 * @function
 * @returns {string}
 */
const iamUtilVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
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
 *                                              iam_user_username:      string,
 *                                              user_account_id:    number,
 *                                              bio?:               string | null,
 *                                              email?:             string,
 *                                              avatar?:            string | null,
 *                                              token_at:           string,
 *                                              exp:                number,
 *                                              iat:                number,
 *                                              tokentimestamp:     number} }>}
 */
const iamAuthenticateUser = async parameters =>{
    const userpass =  Buffer.from((parameters.authorization || '').split(' ')[1] || '', 'base64').toString();
    const username = userpass.split(':')[0];
    const password = userpass.split(':')[1];

    /**@type{import('./socket.js')} */
    const {socketConnectedUpdate} = await import(`file://${process.cwd()}/server/socket.js`);
    /**
     * @param {1|0} result
     * @param {server_db_file_iam_user} user
     * @param {token_type} token_type
     * @returns {Promise.<server_server_response & {result?:{
     *                                              iam_user_id:number,
     *                                              iam_user_username:string,
     *                                              token_at:string,
     *                                              exp:number,
     *                                              iat:number,
     *                                              tokentimestamp:number} }>}
     */
    const check_user = async (result, user, token_type) => {     
        if (result == 1){
            /**
             * @param {number|null} user_account_id
             * @returns {Promise.<server_server_response>}
             */
            const return_result = async user_account_id =>{
                //authorize access token ADMIN or APP_ACCESS for active account or APP_ACCESS_VERFICATION
                const jwt_data = iamAuthorizeToken( parameters.app_id, 
                                                    user.active==1?token_type:'APP_ACCESS_VERIFICATION', 
                                                    {   app_id:             parameters.app_id,
                                                        /**@ts-ignore */ 
                                                        iam_user_id:        user.id, 
                                                        iam_user_username:  user.username,
                                                        user_account_id:    user_account_id, 
                                                        ip:                 parameters.ip, 
                                                        scope:              'USER'});
                //Save access info in IAM_USER_APP_ACCESS table
                /**@type{server_db_file_iam_user_app_access_insert} */
                const file_content = {	
                        /**@ts-ignore */ 
                        iam_user_id:            user.id,
                        iam_user_username:      user.username,
                        user_account_id:        user_account_id,
                        app_id:                 parameters.app_id,
                        db:                     serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB','USE')),
                        res:		            result,
                        token:                  jwt_data?jwt_data.token:null,
                        ip:                     parameters.ip,
                        ua:                     null};
                await fileModelIamUserAppAccess.post(parameters.app_id, file_content);
                //save verification code if user account is not active
                const verification = user.active==1?
                                    null:
                                        await fileModelIamUser.update(
                                            parameters.app_id, 
                                            /**@ts-ignore */
                                            user.id, {  username:user.username, 
                                                        password:password,
                                                        active:0,
                                                        verification_code:iamUtilVerificationCode()});
                if (verification?.result.http){
                    //return error
                    return verification.result;
                }
                else{
                    //updated info in connected list and then return login result
                    return await socketConnectedUpdate(parameters.app_id, 
                        {   idToken:                parameters.idToken,
                            user_account_id:        user_account_id,
                            /**@ts-ignore */ 
                            iam_user_id:            user.id,
                            iam_user_username:      user.username,
                            /**@ts-ignore */
                            iam_user_type:          user.type,
                            token_access:           token_type=='ADMIN'?null:jwt_data?jwt_data.token:null,
                            token_admin:            token_type=='ADMIN'?jwt_data?jwt_data.token:null:null,
                            ip:                     parameters.ip,
                            headers_user_agent:     parameters.user_agent,
                            headers_accept_language:parameters.accept_language})
                    .then((result_socket)=>{
                        return  result_socket.http?result_socket:{result:{  iam_user_id:    user.id,
                                                                            user_account_id:user_account_id,
                                                                            //return only if account is active:
                                                                            ...(user.active==1 && {iam_user_username:  user.username}),
                                                                            ...(user.active==1 && {bio:  user.bio}),
                                                                            ...(user.active==1 && {email:  user.email}),
                                                                            ...(user.active==1 && {avatar:  user.avatar}),
                                                                            token_at:       jwt_data?jwt_data.token:null,
                                                                            exp:            jwt_data?jwt_data.exp:null,
                                                                            iat:            jwt_data?jwt_data.iat:null,
                                                                            tokentimestamp: jwt_data?jwt_data.tokentimestamp:null,
                                                                            active:         user.active}, 
                                                                        type:'JSON'};
                    });
                }
            };
            //user authorized access
            //return result without database user acount for admin
            if (parameters.app_id==serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER','APP_ADMIN_APP_ID')))
                return return_result(null);
            else{
                //create database user if missing
                /**@type{import('./db/dbModelUserAccount.js')} */
                const dbModelUserAccount = await import(`file://${process.cwd()}/server/db/dbModelUserAccount.js`);
                const dbUser = await dbModelUserAccount.getIamUser({app_id:parameters.app_id, 
                                                                    /**@ts-ignore */
                                                                    iam_user_id: user.id});
                if (dbUser.result){
                    const user_account_id = dbUser.result.length>0?
                                                dbUser.result[0].id:
                                                    await dbModelUserAccount.userPost(parameters.app_id, 
                                                                                        /**@ts-ignore */
                                                                                        {iam_user_id:user.id})
                                                            .then(result=>result.http?
                                                                            result:result.result.insertId);
                    if (user_account_id.result?.http)
                        return dbUser;
                    else{
                        //create user_account app record for current app if missing
                        /**@type{import('./db/dbModelUserAccountApp.js')} */
                        const dbModelUserAccountApp = await import(`file://${process.cwd()}/server/db/dbModelUserAccountApp.js`);
                        
                        const dbUserAccountApp = await dbModelUserAccountApp.get({app_id:parameters.app_id, 
                                                                            /**@ts-ignore */
                                                                            resource_id: user_account_id});
                        if (dbUserAccountApp.result){
                            if (dbUserAccountApp.result.length==0)
                                await dbModelUserAccountApp.post(parameters.app_id, user_account_id);
                            //return result with database user account for users
                            return return_result(user_account_id);
                        }
                        else
                            return dbUserAccountApp;
                    }
                }
                else
                    return dbUser;
            }
        }
        else{
            //save log for all login attempts  
            /**@type{server_db_file_iam_user_app_access_insert} */
            const file_content = {	
                        /**@ts-ignore */ 
                        iam_user_id:            user.id,
                        iam_user_username:      user.username,
                        user_account_id:        null,
                        app_id:                 parameters.app_id,
                        db:                     serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB','USE')),
                        res:		            result,
                        token:                  null,
                        ip:                     parameters.ip,
                        ua:                     null};
            await fileModelIamUserAppAccess.post(parameters.app_id, file_content);
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
        if (parameters.app_id == serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER','APP_ADMIN_APP_ID')) && fileModelIamUser.get(parameters.app_id, null).result.length==0)
            return iamUserPost(parameters.app_id,{
                            username:           username, 
                            password:           password, 
                            password_reminder:  null, 
                            type:               'ADMIN', 
                            bio:                null, 
                            private:            1, 
                            user_level:         null,
                            email:              'admin@localhost', 
                            email_unverified:   null,
                            active:             1, 
                            avatar:             null})
                    .then(result=>result.http?result:check_user(1, {id:         result.result.insertId,
                                                                    username:   username,
                                                                    password:   password,
                                                                    type:       'ADMIN',
                                                                    private:    1,
                                                                    user_level: null,
                                                                    bio:        null,
                                                                    email:      'admin@localhost', 
                                                                    avatar:     null,
                                                                    active:     1
                                                                    }, 'ADMIN'));
        else{
            /**@type{import('./security.js')} */
            const {securityPasswordCompare}= await import(`file://${process.cwd()}/server/security.js`);

            /**@type{server_db_file_iam_user}*/
            const user =  fileModelIamUser.get(parameters.app_id, null).result.filter((/**@type{server_db_file_iam_user}*/user)=>user.username == username)[0];
            if (user && await securityPasswordCompare(password, user.password)){
                if (parameters.app_id == serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER','APP_ADMIN_APP_ID'))){
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
 *                  password_reminder:string|null
 *                  email:string}}} parameters
 * @returns {Promise.<server_server_response & {result?:{
 *                                              token_at:string|null,
 *                                              exp:number,
 *                                              iat:number,
 *                                              tokentimestamp:number,
 *                                              iam_user_id:number,
 *                                              user_account_id: number} }>}
 */
const iamAuthenticateUserSignup = async parameters =>{
    /**@type{import('./socket.js')} */
    const {socketConnectedUpdate} = await import(`file://${process.cwd()}/server/socket.js`);
    const new_user = await iamUserPost(parameters.app_id, { username:parameters.data.username,
                                                            password:parameters.data.password,
                                                            password_reminder:parameters.data.password_reminder,
                                                            email:parameters.data.email,
                                                            bio:null,
                                                            private:0,
                                                            avatar:null,
                                                            active:0,
                                                            //signup process needs verification
                                                            verification_code:iamUtilVerificationCode(),
                                                            type:'USER'});
    if (new_user.result){
        const jwt_data = iamAuthorizeToken( parameters.app_id, 
                                            'APP_ACCESS_VERIFICATION', 
                                            {   app_id:                 parameters.app_id, 
                                                iam_user_id:            new_user.result.id, 
                                                iam_user_username:      parameters.data.username, 
                                                user_account_id:        new_user.result.user_account_id, 
                                                db:                     serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB','USE')),
                                                ip:                     parameters.ip, 
                                                scope:                  'USER'});
        /**@type{server_db_file_iam_user_app_access_insert} */
        const data_body = { 
            iam_user_id:            new_user.result.id,
            iam_user_username:      parameters.data.username,
            user_account_id:        new_user.result.user_account_id,
            app_id:                 parameters.app_id,
            db:                     serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB','USE')),
            res:                    1,
            token:                  jwt_data.token,
            ip:                     parameters.ip,
            ua:                     parameters.user_agent};
        await fileModelIamUserAppAccess.post(parameters.app_id, data_body);
        //updated info in connected list and then return signup result
        return await socketConnectedUpdate(parameters.app_id, 
            {   idToken:                parameters.idToken,
                user_account_id:        null,
                /**@ts-ignore */ 
                iam_user_id:            new_user.result.id,
                iam_user_username:      parameters.data.username,
                /**@ts-ignore */
                iam_user_type:          'USER',
                token_access:           jwt_data?jwt_data.token:null,
                token_admin:            null,
                ip:                     parameters.ip,
                headers_user_agent:     parameters.user_agent,
                headers_accept_language:parameters.accept_language})
        .then(result_socket=>result_socket.result?
                                {result:{
                                                token_at:       jwt_data.token,
                                                exp:            jwt_data.exp,
                                                iat:            jwt_data.iat,
                                                tokentimestamp: jwt_data.tokentimestamp,
                                                iam_user_id:    new_user.result.id,
                                                user_account_id:new_user.result.user_account_id},
                                        type:'JSON'}:result_socket);
            
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
 *          data:{  verification_type:string,   //1 LOGIN, 2 SIGNUP, 3 FORGOT/ PASSWORD RESET
 *                  verification_code:string}}} parameters
 * @returns {Promise.<server_server_response & { result?:{
 *                                              token_at: string|null,
 *                                              exp:number|null,
 *                                              iat:number|null,
 *                                              tokentimestamp:number|null,
 *                                              activated:number,
 *                                              iam_user_id:number|null,
 *                                              iam_user_username:string|null,
 *                                              user_account_id:number|null} }>}
 */
const iamAuthenticateUserActivate = async parameters =>{
        
    const result_activate =  await fileModelIamUser.updateVerificationCodeAuthenticate(
                                    parameters.app_id, 
                                    parameters.resource_id, 
                                    { verification_code:parameters.data.verification_code});
    if (result_activate.result){
        if (result_activate.result.affectedRows==1 && (serverUtilNumberValue(parameters.data.verification_type)==1||serverUtilNumberValue(parameters.data.verification_type)==2))
            return await iamUserLogout({app_id:parameters.app_id,
                                idToken:parameters.idToken,
                                ip:parameters.ip,
                                authorization:parameters.authorization,
                                user_agent:parameters.user_agent,
                                accept_language:parameters.accept_language})
                .then(result=>result.http?result:{result:{
                                                        token_at: null,
                                                        exp:null,
                                                        iat:null,
                                                        tokentimestamp:null,
                                                        activated:1,
                                                        iam_user_id:null,
                                                        iam_user_username:null,
                                                        user_account_id:null
                                                    }, type:'JSON'});
        else{
            if (result_activate.result.affectedRows==1){
                //verification type 3 FORGOT/ PASSWORD RESET
                const jwt_data = iamAuthorizeToken(parameters.app_id, 'APP_ACCESS_VERIFICATION', 
                                                    {   app_id:                 parameters.app_id, 
                                                        iam_user_id:            parameters.resource_id, 
                                                        iam_user_username:      null, 
                                                        user_account_id:        parameters.resource_id, 
                                                        db:                     serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB','USE')),
                                                        ip:                     parameters.ip, 
                                                        scope:                  'USER'});
                //email was verified and activated with id token, but now the password will be updated
                //return accessToken and authentication code
                /**@type{server_db_file_iam_user_app_access_insert} */
                const data_body = { 
                    iam_user_id:            parameters.resource_id,
                    iam_user_username:      null,
                    user_account_id:        parameters.resource_id,
                    app_id:                 parameters.app_id,
                    db:                     serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB','USE')),
                    res:                    1,
                    token:                  jwt_data.token,
                    ip:                     parameters.ip,
                    ua:                     parameters.user_agent};
                return fileModelIamUserAppAccess.post(parameters.app_id, data_body)
                        .then(()=>{
                            return {result:{
                                        token_at:               jwt_data.token,
                                        exp:                    jwt_data.exp,
                                        iat:                    jwt_data.iat,
                                        tokentimestamp:         jwt_data.tokentimestamp,
                                        activated:              1,
                                        iam_user_id:            parameters.resource_id,
                                        iam_user_username:      null,
                                        user_account_id:        parameters.resource_id}, 
                                    type:'JSON'};
                        });
            }
            else
                return {result:{
                                token_at: null,
                                exp:null,
                                iat:null,
                                tokentimestamp:null,
                                activated:0,
                                iam_user_id:null,
                                iam_user_username:null,
                                user_account_id:null}, 
                        type:'JSON'};
        }
    }
    else
        return result_activate;
};

/**
 * @name iamAuthenticateUserForgot
 * @description IAM Authenticates user password forgot, returns APP_ACCESS_VERIFICATION token
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number, 
 *          idToken:string,
 *          ip:string, 
 *          user_agent:string, 
 *          accept_language:string, 
 *          data:{  email:string}}} parameters
 * @returns {Promise.<server_server_response & {result?:{   sent: number,
 *                                                          token_at?: string,
 *                                                          exp?:number,
 *                                                          iat?:number,
 *                                                          tokentimestamp?:number,
 *                                                          iam_user_id?: number,
 *                                                          user_account_id?: number} }>}
 */
const iamAuthenticateUserForgot = async parameters =>{

    /**@type{import('./db/dbModelUserAccountEvent.js')} */
    const dbModelUserAccountEvent = await import(`file://${process.cwd()}/server/db/dbModelUserAccountEvent.js`);
    /**@type{import('./socket.js')} */
    const {socketConnectedUpdate} = await import(`file://${process.cwd()}/server/socket.js`);

    if (parameters.data.email != '' && parameters.data.email != null){
        const user = fileModelIamUser.get(parameters.app_id, null).result.filter((/**@type{server_db_file_iam_user}*/row)=>row.email==parameters.data.email)[0];
        if (user){
            const result_user_event = await dbModelUserAccountEvent.getLastUserEvent(parameters.app_id, serverUtilNumberValue(user.id), 'PASSWORD_RESET');
            if (result_user_event.result)
                if (result_user_event.result[0] &&
                    result_user_event.result[0].status_name == 'INPROGRESS' &&
                    (+ new Date(result_user_event.result[0].current_timestamp) - + new Date(result_user_event.result[0].date_created))/ (1000 * 60 * 60 * 24) < 1)
                    return {result:{sent: 0}, type:'JSON'};
                else{
                    /**@type{server_db_sql_parameter_user_account_event_insertUserEvent}*/
                    const eventData = {
                                        user_account_id: user.id,
                                        event: 'PASSWORD_RESET',
                                        event_status: 'INPROGRESS'
                                    };
                    const result_dbModelUserAccountEvent = await dbModelUserAccountEvent.post(parameters.app_id, eventData);
                    if (result_dbModelUserAccountEvent.result){
                        const jwt_data = iamAuthorizeToken( parameters.app_id, 
                                                            'APP_ACCESS_VERIFICATION', 
                                                            {   app_id:                 parameters.app_id, 
                                                                iam_user_id:            user.id, 
                                                                iam_user_username:      user.username, 
                                                                user_account_id:        user.id, 
                                                                db:                     serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB','USE')),
                                                                ip:                     parameters.ip, 
                                                                scope:                  'USER'});
                        /**@type{server_db_file_iam_user_app_access_insert} */
                        const data_body = { 
                            iam_user_id:            user?.id,
                            iam_user_username:      user.username,
                            user_account_id:        user?.id,
                            app_id:                 parameters.app_id,
                            db:                     serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB','USE')),
                            res:                    1,
                            token:                  null,
                            ip:                     parameters.ip,
                            ua:                     parameters.user_agent
                        };
                        data_body.token = jwt_data.token;
                        await fileModelIamUserAppAccess.post(parameters.app_id, data_body);
                        return await fileModelIamUser.updateVerificationCodeAdd(
                                        parameters.app_id, 
                                        /**@ts-ignore */
                                        user.id, {   verification_code:iamUtilVerificationCode()})
                                    .then((result_updateUserVerificationCode)=>
                                        result_updateUserVerificationCode.result?
                                            socketConnectedUpdate(parameters.app_id, 
                                                {   idToken:                parameters.idToken,
                                                    user_account_id:        user.id,
                                                    iam_user_id:            user.id,
                                                    iam_user_username:      user.username, 
                                                    iam_user_type:          'USER',
                                                    token_access:           jwt_data.token,
                                                    token_admin:            null,
                                                    ip:                     parameters.ip,
                                                    headers_user_agent:     parameters.user_agent,
                                                    headers_accept_language:parameters.accept_language})
                                            .then((result_socket)=>
                                                result_socket.http?
                                                    result_socket:
                                                        {result:{
                                                                sent:                   1,
                                                                token_at:               jwt_data.token,
                                                                exp:                    jwt_data.exp,
                                                                iat:                    jwt_data.iat,
                                                                tokentimestamp:         jwt_data.tokentimestamp,
                                                                iam_userid:             user.id,
                                                                user_account_id:        user.id
                                                            }, 
                                                            type:'JSON'}
                                            ):
                                            result_updateUserVerificationCode
                                    );
                    }
                    else
                        return {result:{sent: 0}, type:'JSON'};
                }
            else
                return result_user_event;
        }
        else
            return user.http?user:{result:{sent: 0}, type:'JSON'};                   
    }
    else
        return {result:{sent: 0}, type:'JSON'};

};

/**
 * @name iamAuthenticateUserUpdate
 * @description IAM Authenticates user update
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          ip:string,
 *          user_agent:string,
 *          accept_language:string,
 *          data :{ username:string,
 *                  password:string,
 *                  password_new:string,
 *                  password_reminder:string,
 *                  bio:string,
 *                  private:number,
 *                  avatar:string,
 *                  email:string,
 *                  new_email:string,
 *                  verification_code:string},
 *          locale:string}} parameters
 * @returns {Promise.<server_server_response & {result?:{updated: number} }>}
 */
const iamAuthenticateUserUpdate = async parameters => {
    /**@type{server_db_file_iam_user} */
    const data_update = {   bio:                parameters.data.bio,
                            private:            parameters.data.private,
                            username:           parameters.data.username,
                            password:           parameters.data.password,
                            password_new:       (parameters.data.password_new && parameters.data.password_new!='')==true?parameters.data.password_new:null,
                            password_reminder:  (parameters.data.password_reminder && parameters.data.password_reminder!='')==true?parameters.data.password_reminder:null,
                            email:              parameters.data.email,
                            email_unverified:   (parameters.data.new_email && parameters.data.new_email!='')==true?parameters.data.new_email:null,
                            avatar:             parameters.data.avatar
                        };
    return fileModelIamUser.update(parameters.app_id, parameters.resource_id, data_update)
            .then(result_update=>{
            if (result_update.result)
                return {result:{updated: 1}, type:'JSON'};
            else
                return result_update;
            });
};
/**
 * @name iamAuthenticateUserUpdatePassword
 * @description Updates users password and logs out the user
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          ip:string,
 *          idToken:string,
 *          authorization:string,
 *          user_agent:string,
 *          accept_language:string,
 *          data:{  password_new:string},
 *          locale:string}} parameters
 * @returns {Promise.<server_server_response>}
 */
const iamAuthenticateUserUpdatePassword = async parameters => {
    const error = iamUserValidation_password(parameters.data);
    if (error==null){
        const result_update = await  iamUserPasswordSet(parameters.data.password_new)
                                    .then(password=>
                                                    fileModelIamUser.updatePassword(
                                                        parameters.app_id, 
                                                        parameters.resource_id,
                                                        {
                                                            password_new: password
                                                        }));
        if (result_update.result) {
            /**@type{server_db_sql_parameter_user_account_event_insertUserEvent}*/
            const eventData = {
                /**@ts-ignore */
                user_account_id: parameters.resource_id,
                event: 'PASSWORD_RESET',
                event_status: 'SUCCESSFUL'
            };
            /**@type{import('./db/dbModelUserAccountEvent.js')} */
            const dbModelUserAccountEvent = await import(`file://${process.cwd()}/server/db/dbModelUserAccountEvent.js`);
            return  dbModelUserAccountEvent.post(parameters.app_id, eventData)
                    .then(result=>result.http?
                                    result:
                                        iamUserLogout({app_id:parameters.app_id,
                                            idToken:parameters.idToken,
                                            authorization:parameters.authorization,
                                            ip:parameters.ip,
                                            user_agent:parameters.user_agent,
                                            accept_language:parameters.accept_language})
                    );
        }
        else
            return result_update.http?result_update:{   http:404,
                                                        code:'IAM',
                                                        text:'?!',
                                                        developerText:'iamAuthenticateUserUpdatePassword',
                                                        moreInfo:null,
                                                        type:'JSON'
                                                    };
    }
    else
        return error;
    
};
/**
 * @name iamAuthenticateUserDelete
 * @description IAM Authenticates user delete
 * @function 
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          data:{password:string},
 *          locale:string}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_delete }>}
 */
const iamAuthenticateUserDelete = async parameters => fileModelIamUser.deleteRecord(parameters.app_id, parameters.resource_id, {password:parameters.data.password});
    

/**
 * @name iamAuthenticateUserCommon
 * @description IAM Middleware authenticate IAM users
 * @function
 * @param {string} idToken
 * @param {server_bff_endpoint_type} scope
 * @param {string} authorization
 * @param {string} host
 * @param {string} ip
 * @param {server_server_res} res
 * @param {function} next
 * @returns {Promise.<void>}
 */
 const iamAuthenticateUserCommon = async (idToken, scope, authorization, host, ip, res, next) =>{
    const app_id_host = commonAppHost(host);
    if (idToken && scope && app_id_host !=null){
        const app_id_admin = serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER','APP_ADMIN_APP_ID'));
        try {
            //authenticate id token
            const id_token_decoded = iamUtilDecodeVerify(app_id_host, idToken, 'APP_ID');
            /**@type{server_db_file_iam_app_id_token}*/
            const log_id_token = fileModelIamAppToken.get(app_id_host).result.filter((/**@type{server_db_file_iam_app_id_token}*/row)=> 
                                                                                    row.app_id == app_id_host && row.ip == ip && row.token == idToken
                                                                                    )[0];
            if (id_token_decoded.app_id == app_id_host && 
                (id_token_decoded.scope == 'APP' ||id_token_decoded.scope == 'REPORT' ||id_token_decoded.scope == 'MAINTENANCE') && 
                id_token_decoded.ip == ip &&
                log_id_token){
                if (scope=='APP_ID')
                    next();
                else{
                    //validate scope, app_id and authorization
                    switch (true){
                        case scope=='IAM' && authorization.toUpperCase().startsWith('BASIC'):{
                            if (app_id_host=== app_id_admin)
                                next();
                            else
                                if (serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_IAM', 'ENABLE_USER_LOGIN'))==1)
                                    next();
                                else
                                    iamUtilResponseNotAuthorized(res, 401, 'iamAuthenticateUserCommon');
                            break;
                        }
                        case scope=='ADMIN' && app_id_host== app_id_admin && authorization.toUpperCase().startsWith('BEARER'):
                        case scope=='APP_ACCESS_VERIFICATION' && authorization.toUpperCase().startsWith('BEARER'):
                        case scope=='APP_ACCESS' && serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_IAM', 'ENABLE_USER_LOGIN'))==1 && authorization.toUpperCase().startsWith('BEARER'):{
                            //authenticate access token
                            const access_token = authorization?.split(' ')[1] ?? '';
                            const access_token_decoded = iamUtilDecodeVerify(app_id_host, access_token, scope);
                            
                            /**@type{server_db_file_iam_user_app_access[]}*/
                            if (access_token_decoded.app_id == app_id_host && 
                                access_token_decoded.scope == 'USER' && 
                                access_token_decoded.ip == ip){
                                /**@type{server_db_file_iam_user_app_access}*/
                                const iam_user_app_access = fileModelIamUserAppAccess.get(app_id_host, null).result
                                                        .filter((/**@type{server_db_file_iam_user_app_access}*/row)=>
                                                                                                //Authenticate IAM user
                                                                                                row.iam_user_id           == access_token_decoded.iam_user_id && 
                                                                                                row.iam_user_username       == access_token_decoded.iam_user_username && 
                                                                                                // Authenticate DB user, admin does not use this
                                                                                                (row.user_account_id        == access_token_decoded.user_account_id ||scope=='ADMIN') && 
                                                                                                (row.db                     == access_token_decoded.db ||scope=='ADMIN') && 
                                                                                                //Authenticate app id corresponds to current subdomain
                                                                                                row.app_id                  == app_id_host &&
                                                                                                //Authenticate token is valid
                                                                                                row.res                     == 1 &&
                                                                                                //Authenticate IP address
                                                                                                row.ip                      == ip &&
                                                                                                //Authenticate the token string
                                                                                                row.token                   == access_token
                                                                                            )[0];
                                if (iam_user_app_access)
                                    next();
                                else
                                    iamUtilResponseNotAuthorized(res, 401, 'iamAuthenticateUserCommon');
                            }
                            else
                                iamUtilResponseNotAuthorized(res, 401, 'iamAuthenticateUserCommon');
                            break;
                        }
                        case scope=='APP_ID_SIGNUP' && serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_IAM', 'ENABLE_USER_REGISTRATION'))==1 && app_id_host!= app_id_admin:{
                            next();
                            break;
                        }
                        default:{
                            iamUtilResponseNotAuthorized(res, 401, 'iamAuthenticateUserCommon');
                            break;
                        }
                    }
                }
            }
            else
                iamUtilResponseNotAuthorized(res, 401, 'iamAuthenticateUserCommon');
        } catch (error) {
            iamUtilResponseNotAuthorized(res, 401, 'iamAuthenticateUserCommon');
        }
    }
    else
        iamUtilResponseNotAuthorized(res, 401, 'iamAuthenticateUserCommon');
};

/**
 * @name iamAuthenticateExternal
 * @description IAM external authenticate, only keys id of type number and message of type string allowed as parameters
 * @function
 * @param {'APP_EXTERNAL'} endpoint 
 * @param {{}} body
 * @param {server_server_res} res
 * @param {function} next
 * @returns {void}
 */
const iamAuthenticateExternal = (endpoint, body, res, next) => {

    if (endpoint =='APP_EXTERNAL' && 
        ('id' in body) && typeof body.id =='number' && 
        ('message' in body) && typeof body.message =='string' && 
        Object.keys(body).length==2){
        next();
    }
    else
        iamUtilResponseNotAuthorized(res, 401, 'iamAuthenticateExternal');
};
/**
 * @name iamAuthenticateRequest
 * @description IAM Authorize request
 *              Controls if AUTHENTICATE_REQUEST_ENABLE=1 else skips all checks
 *              if ip is blocked in IAM_CONTROL_OBSERVE or ip range is blocked in IAM_CONTROL_IP 
 *                  return 401
 *              else
 *                  if request count > rate limit (anonymous, user or admin)
 *                      if fail count > AUTHENTICATE_REQUEST_OBSERVE_LIMIT
 *                          add IAM_CONTROL_OBSERVE with status = 1 and type=BLOCK_IP
 *                      return status 429
 *                  else
 *                      if subdomain is known
 *                      if requested route is valid
 *                      if host does not exist
 *                      if request not accessed from domain or from os hostname
 *                      if user agent is blocked
 *                      if decodeURIComponent() has error 
 *                      if method is not 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'
 *                      if fail block or fail count > AUTHENTICATE_REQUEST_OBSERVE_LIMIT
 *                          add IAM_CONTROL_OBSERVE with status = 1 and type=BLOCK_IP
 *                          return 401
 * @function
 * @param {string} ip
 * @param {string} host
 * @param {string} method
 * @param {string} user_agent
 * @param {string} accept_language
 * @param {string} path
 * @returns {Promise.<null|{statusCode:number,
 *                          statusMessage: string}>}
 */
 const iamAuthenticateRequest = async (ip, host, method, user_agent, accept_language, path) => {
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
        if (fileModelConfig.get('CONFIG_SERVER','SERVICE_IAM', 'AUTHENTICATE_REQUEST_IP') == '1'){
            /**@type{server_db_file_iam_control_ip[]} */
            const ranges = fileModelIamControlIp.get(
                                                    app_id, 
                                                    null, 
                                                    /**@ts-ignore */
                                                    {}).result;
            //check if IP is blocked
            if (fileModelIamControlObserve.get( app_id, 
                                                null).result.filter((/**@type{server_db_file_iam_control_observe}*/row)=>row.ip==ip_v4 && row.app_id == data_app_id && row.status==1).length>0)
                //IP is blocked in IAM_CONTROL_OBSERVE
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
     * @param {string} ip
     * @returns {boolean}
     */
    const rateLimiter = ip =>{		
        const RATE_LIMIT_WINDOW_MS = fileModelConfig.get('CONFIG_SERVER', 'SERVICE_IAM', 'RATE_LIMIT_WINDOW_MS');
        const RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_ANONYMOUS = fileModelConfig.get('CONFIG_SERVER', 'SERVICE_IAM', 'RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_ANONYMOUS');
        const RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_USER = fileModelConfig.get('CONFIG_SERVER', 'SERVICE_IAM', 'RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_USER');
        const RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_ADMIN = fileModelConfig.get('CONFIG_SERVER', 'SERVICE_IAM', 'RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_ADMIN');
  
        const currentTime = Date.now();
        if (!iamRequestRateLimiterCount[ip])
            iamRequestRateLimiterCount[ip] = {count:0, firstRequestTime:currentTime};
          
        const {count, firstRequestTime} = iamRequestRateLimiterCount[ip];
        const USER = path?.toLowerCase().startsWith('/bff/app_access')?1:null;                                                                              
        const ADMIN = path?.toLowerCase().startsWith('/bff/admin')?1:null;    
                                                                              
        if (currentTime - firstRequestTime > RATE_LIMIT_WINDOW_MS){
            iamRequestRateLimiterCount[ip] = {count:1, firstRequestTime:currentTime};
            return false;
        }
        else
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
  
    if (fileModelConfig.get('CONFIG_SERVER','SERVICE_IAM', 'AUTHENTICATE_REQUEST_ENABLE')=='1'){
        let fail = 0;
        let fail_block = false;
        const ip_v4 = ip.replace('::ffff:','');
        const app_id = commonAppHost(host ?? '');
        const common_app_id = serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID')) ?? 0;
        //set calling app_id using app_id or common app_id if app_id is unknown
        const calling_app_id = app_id ?? common_app_id;
        //set record with app_id or empty app_id
        const record = {    app_id:app_id,
                            ip:ip_v4, 
                            user_agent:user_agent, 
                            host:host, 
                            accept_language:accept_language, 
                            method:method,
                            url:path};
        const result_range = block_ip_control(calling_app_id, app_id, ip_v4);
        if (result_range){
            return {statusCode: 401, 
                    statusMessage: ''};
        }
        else{
            if (rateLimiter(ip_v4)){
                return {statusCode: 429, 
                        statusMessage: ''};
            }
            else{
                //check if host exists
                if (typeof host=='undefined'){
                    await fileModelIamControlObserve.post(calling_app_id, 
                                                            {   ...record,
                                                                status:1, 
                                                                type:'HOST'});
                    fail ++;
                    fail_block = true;
                }
                if (app_id == null){
                    await fileModelIamControlObserve.post(calling_app_id, 
                                                            {   ...record,
                                                                status:0, 
                                                                type:'SUBDOMAIN'});
                    fail ++;
                }
                /**
                 * @param {string} path
                 */
                const invalid_path = path =>{
                            //browser and search engine paths
                    return  (path =='/favicon.ico' ||
                            path == '/robots.txt' ||
                            //REST API paths
                            path.startsWith('/bff/app/v1') ||
                            path.startsWith('/bff/app_id/v1') ||
                            path.startsWith('/bff/app_id_signup/v1') ||
                            path.startsWith('/bff/app_access/v1') ||
                            path.startsWith('/bff/app_access_verification/v1') ||
                            path.startsWith('/bff/app_external/v1') ||
                            path.startsWith('/bff/admin/v1') ||
                            path.startsWith('/bff/iam/v1') ||
                            //APP paths
                            path == '/' ||
                            path.startsWith('/js/') ||
                            path.startsWith('/css/') ||
                            path.startsWith('/images/') ||
                            path.startsWith('/common/') ||
                            path.startsWith('/component/') ||
                            path.startsWith('/info/') ||
                            path.startsWith('/maintenance/') ||
                            path == '/apps/common_types.js' ||
                            path == '/sw.js' ||
                            //account names should start with /profile/ and not contain any more '/'
                            (path.startsWith('/profile/') && path.split('/').length==3)||
                            //SSL verification path
                            (   path.startsWith(fileModelConfig.get('CONFIG_SERVER','SERVER', 'HTTPS_SSL_VERIFICATION_PATH')) &&
                                serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'HTTPS_SSL_VERIFICATION'))==1
                            )
                        )==false;
                };
                if (invalid_path(path)){
                    //stop if trying to access any SSL path not enabled
                    if (path.startsWith(fileModelConfig.get('CONFIG_SERVER','SERVER', 'HTTPS_SSL_VERIFICATION_PATH')))
                        fail_block = true;
                    await fileModelIamControlObserve.post(calling_app_id, 
                        {   ...record,
                            status:fail_block==true?1:0, 
                            type:'ROUTE'});
                    fail ++;
                }
                //check if not accessed from domain or from os hostname
                const {hostname} = await import('node:os');
                if (host.toUpperCase()==hostname().toUpperCase() ||host.toUpperCase().indexOf(fileModelConfig.get('CONFIG_SERVER','SERVER', 'HOST').toUpperCase())<0){
                    //stop always
                    fail_block = true;
                    await fileModelIamControlObserve.post(calling_app_id, 
                                                            {   ...record,
                                                                status:1,
                                                                type:'HOST_IP'});
                    fail ++;
                }
                //check if user-agent is blocked
                if(fileModelIamControlUserAgent.get(null, null).result.filter((/**@type{server_db_file_iam_control_user_agent}*/row)=>row.user_agent== user_agent).length>0){
                    //stop always
                    fail_block = true;
                    await fileModelIamControlObserve.post(calling_app_id, 
                        {   ...record,
                            status:1, 
                            type:'USER_AGENT'});
                    fail ++;
                }
                //check request
                let err = null;
                try {
                    decodeURIComponent(path);
                }
                catch(e) {
                    err = e;
                }
                if (err){
                    await fileModelIamControlObserve.post(calling_app_id, 
                        {   ...record,
                            status:0, 
                            type:'URI_DECODE'});
                    fail ++;
                }
                //check method
                if (['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].filter(allowed=>allowed==method).length==0){
                    //stop always
                    fail_block = true;
                    await fileModelIamControlObserve.post(calling_app_id, 
                        {   ...record,
                            status:0, 
                            type:'METHOD'});
                    fail ++;
                }
                if (fail>0){
                    if (fail_block ||
                        //check how many observation exists for given app_id or records with unknown app_id
                        fileModelIamControlObserve.get(calling_app_id, 
                                                        null).result.filter((/**@type{server_db_file_iam_control_observe}*/row)=>row.ip==ip_v4 && row.app_id == app_id).length>
                        fileModelConfig.get('CONFIG_SERVER', 'SERVICE_IAM', 'AUTHENTICATE_REQUEST_OBSERVE_LIMIT')){
                        await fileModelIamControlObserve.post(calling_app_id,
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
 * @description Authenticate app in microservice
 *              file must be read from file, not file cache as main server
 *              since microservices run in separate processes and servers
 * @function
 * @param {number|null} app_id 
 * @param {string} authorization 
 * @returns {Promise.<boolean>}
 */
 const iamAuthenticateApp = async (app_id, authorization) =>{
    if (app_id == null)
        return false;
    else{
        const app_secret = await fileModelAppSecret.getFile(app_id);
        const CLIENT_ID = app_secret.result.common_client_id;
        const CLIENT_SECRET = app_secret.result.common_client_secret;
        const userpass = Buffer.from((authorization || '').split(' ')[1] || '', 'base64').toString();
        if (userpass == CLIENT_ID + ':' + CLIENT_SECRET)
            return true;
        else
            return false;
    }    
};
/**
 * @name iamAuthenticateResource
 * @description Authenticate resource using IAM_iam_user_id, IAM_user_account_id or IAM_data_app_id key used as REST API parameter
 *              Authenticates using access token if provided or else the idToken
 * @function
 * @param { {app_id:number|null,
 *           ip:string,
 *           idToken:string,
 *           authorization:string|null,
 *           claim_iam_user_id:number|null,
 *           claim_iam_user_account_id:number|null,
 *           claim_iam_data_app_id:number|null}} parameters
 * @returns {boolean}
 */
const iamAuthenticateResource = parameters =>  {
    //authenticate access token
    try {
        if (parameters.app_id == null)
            return false;
        else{
            let authenticate_token;
            if (parameters.authorization){
                //Access token, with user info
                /**@type{*}*/
                const verify_decoded = jwt.verify(parameters.authorization.split(' ')[1], fileModelAppSecret.get({app_id:parameters.app_id, resource_id:parameters.app_id}).result[0].common_app_access_secret);
                /**@type{{app_id:number, iam_user_id:number|null, user_account_id:number|null, ip:string}} */
                authenticate_token = {
                                    app_id:         verify_decoded.app_id,
                                    iam_user_id:    verify_decoded.iam_user_id,
                                    user_account_id:verify_decoded.user_account_id,
                                    ip:             verify_decoded.ip};
            }
            else{
                //Id token, without user info
                /**@type{*}*/
                const verify_decoded = jwt.verify(parameters.idToken, fileModelAppSecret.get({app_id:parameters.app_id, resource_id:parameters.app_id}).result[0].common_app_id_secret);
                /**@type{{app_id:number, ip:string}} */
                authenticate_token = {
                                    app_id:         verify_decoded.app_id,
                                    iam_user_id:    null,
                                    user_account_id:null,
                                    ip:             verify_decoded.ip};
            }

            //function should authenticate at least one of iam user id, user_account id or data app_id
            return  (parameters.claim_iam_user_id !=null || 
                    parameters.claim_iam_user_account_id !=null ||
                    parameters.claim_iam_data_app_id !=null) &&

                    //authenticate iam user id if used
                    authenticate_token.iam_user_id == (parameters.claim_iam_user_id ?? authenticate_token.iam_user_id) &&
                    //authenticate db user account id if used
                    authenticate_token.user_account_id == (parameters.claim_iam_user_account_id ?? authenticate_token.user_account_id) &&

                    //authenticate iam data app id if used, users can only have access to current app id or common app id for data app id claim
                    (parameters.claim_iam_data_app_id == serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID')) ||
                     authenticate_token.app_id == (parameters.claim_iam_data_app_id ?? authenticate_token.app_id)) &&
                    //authenticate app id dervied from subdomain, user must be using current app id only
                    authenticate_token.app_id == parameters.app_id &&
                    //authenticate IP address
                    authenticate_token.ip == parameters.ip;
        }
    } catch (error) {
        //Expired or token error
        return false;
    }
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
    const jwt_data = iamAuthorizeToken(app_id, 'APP_ID', {  app_id: app_id, 
                                                            iam_user_id:null,
                                                            iam_user_username:null,
                                                            user_account_id:null,
                                                            db:null,
                                                            ip:ip ?? '', 
                                                            scope:scope});

    /**@type{server_db_file_iam_app_id_token_insert} */
    const file_content = {	app_id:     app_id,
                            res:		1,
                            token:   	jwt_data.token,
                            ip:         ip ?? '',
                            ua:         null};
    return await fileModelIamAppToken.post(app_id, file_content).then(()=>jwt_data.token);
 };
/**
 * @name iamAuthorizeToken
 * @description Authorize token
 * @function
 * @param {number} app_id
 * @param {'APP_ID'|'APP_ACCESS'|'APP_ACCESS_VERIFICATION'|'ADMIN'|'APP_CUSTOM'} endpoint
 * @param {server_iam_access_token_claim} claim
 * @param {string|null} app_custom_expire
 * @returns {{
 *              token:string, 
 *              exp:number,             //expires at
 *              iat:number,             //issued at
 *              tokentimestamp:number}}
 */
 const iamAuthorizeToken = (app_id, endpoint, claim, app_custom_expire=null)=>{

    let secret = '';
    let expiresin = '';
    switch (endpoint){
        //APP ID Token
        case 'APP_ID':{
            secret = fileModelAppSecret.get({app_id:app_id, resource_id:app_id}).result[0].common_app_id_secret;
            expiresin = fileModelAppSecret.get({app_id:app_id, resource_id:app_id}).result[0].common_app_id_expire;
            break;
        }
        //USER Access token
        case 'APP_ACCESS':{
            secret = fileModelAppSecret.get({app_id:app_id, resource_id:app_id}).result[0].common_app_access_secret;
            expiresin = fileModelAppSecret.get({app_id:app_id, resource_id:app_id}).result[0].common_app_access_expire;
            break;
        }
        //USER Access token
        case 'APP_ACCESS_VERIFICATION':{
            secret = fileModelAppSecret.get({app_id:app_id, resource_id:app_id}).result[0].common_app_access_verification_secret;
            expiresin = fileModelAppSecret.get({app_id:app_id, resource_id:app_id}).result[0].common_app_access_verification_expire;
            break;
        }
        //Admin Access token
        case 'ADMIN':{
            secret = fileModelConfig.get('CONFIG_SERVER','SERVICE_IAM', 'ADMIN_TOKEN_SECRET') ?? '';
            expiresin = fileModelConfig.get('CONFIG_SERVER','SERVICE_IAM', 'ADMIN_TOKEN_EXPIRE_ACCESS') ?? '';
            break;
        }
        //APP custom token
        case 'APP_CUSTOM':{
            secret = fileModelAppSecret.get({app_id:app_id, resource_id:app_id}).result[0].common_app_id_secret;
            expiresin = app_custom_expire ?? '';
            break;
        }
    }
    /**@type{server_iam_access_token_claim} */
    const access_token_claim = {app_custom_id:          claim.app_custom_id,
                                app_id:                 app_id,
                                iam_user_id:            claim.iam_user_id,
                                iam_user_username:      claim.iam_user_username,
                                user_account_id:        claim.user_account_id,
                                db:                     claim.db,
                                ip:                     claim.ip,
                                scope:                  claim.scope,
                                tokentimestamp:         Date.now()}; //this key is provided here, not from calling function
    const token = jwt.sign (access_token_claim, secret, {expiresIn: expiresin});
    return {token:token,
            /**@ts-ignore */
            exp:jwt.decode(token, { complete: true }).payload.exp,
            /**@ts-ignore */
            iat:jwt.decode(token, { complete: true }).payload.iat,
            /**@ts-ignore */
            tokentimestamp:jwt.decode(token, { complete: true }).payload.tokentimestamp};
};

/**
 * @name iamUserAppAccessGet
 * @description Get user login records
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:Number,
 *          data:{  data_user_account_id?:string|null,
 *                  data_app_id?:string|null}}} parameters
 * @returns {server_server_response & {result?:server_db_file_iam_user_app_access[] }}
 */
const iamUserAppAccessGet = parameters => {const rows = fileModelIamUserAppAccess.get(parameters.app_id, null).result
                                                                .filter((/**@type{server_db_file_iam_user_app_access}*/row)=>
                                                                    row.iam_user_id==serverUtilNumberValue(parameters.data.data_user_account_id) &&  
                                                                    row.app_id==(serverUtilNumberValue(parameters.data.data_app_id==''?null:parameters.data.data_app_id) ?? row.app_id));
                                                    
                                                    return {result:rows.length>0?
                                                                rows.sort(( /**@type{server_db_file_iam_user_app_access}*/a,
                                                                            /**@type{server_db_file_iam_user_app_access}*/b)=> 
                                                                            //sort descending on created
                                                                            a.created.localeCompare(b.created)==1?-1:1):
                                                                    [], 
                                                            type:'JSON'};
                                                };

/**
 * @name iamUserValidation
 * @description Data validation
 * @function
 * @param {	server_db_file_iam_user} data 
 * @returns {server_server_response|null}
 */
const iamUserValidation = data => {
    data.username = data.username ?? null;
    data.bio = data.bio ?? null;
    data.password_reminder = data.password_reminder ?? null;
    data.verification_code = data.verification_code ?? null;
    
    if (data.username != null && (data.username.length < 5 || data.username.length > 100)){
        //'username 5 - 100 characters'
        return {http:400,
            code:'IAM',
            text:'👤 5-100!',
            developerText:null,
            moreInfo:null,
            type:'JSON'};
    }
    else 
        if (data.username != null &&
            (data.username.indexOf(' ') > -1 || 
            data.username.indexOf('?') > -1 ||
            data.username.indexOf('/') > -1 ||
            data.username.indexOf('+') > -1 ||
            data.username.indexOf('"') > -1 ||
            data.username.indexOf('\'\'') > -1)){
            //'not valid username'
            return {http:400,
                code:'IAM',
                text:'ABC!',
                developerText:null,
                moreInfo:null,
                type:'JSON'};
        }
        else
            if (data.bio != null && data.bio.length > 100){
                //'bio max 100 characters'
                return {http:400,
                    code:'IAM',
                    text:'ABC!',
                    developerText:null,
                    moreInfo:null,
                    type:'JSON'};
            }
            else 
                if (data.password_reminder != null && data.password_reminder.length > 100){
                    //'reminder max 100 characters'
                    return {http:400,
                        code:'IAM',
                        text:'ABC!',
                        developerText:null,
                        moreInfo:null,
                        type:'JSON'};
                }
                else{
                    if (data.username == null || data.password==null){
                        //'Username and password are required'
                        return {http:400,
                            code:'IAM',
                            text:'👤🔑!',
                            developerText:null,
                            moreInfo:null,
                            type:'JSON'};
                    }
                    else
                        if (data.password_new != null)
                            return iamUserValidation_password({password_new: data.password_new??data.password});
                        else
                            return null;
                }
};
/**
 * @name iamUserValidation_password
 * @description Checks password between 10 and 100 characters
 * @function
 * @param {{password_new:string|null}} data 
 * @returns {server_server_response|null}
 */
const iamUserValidation_password = data => {
    if (data.password_new == null || data.password_new.length < 10 || data.password_new.length > 100){
        return {http:400,
                code:'IAM',
                text:'🔑 10-100!',
                developerText:null,
                moreInfo:null,
                type:'JSON'};
    }
    else
        return null;
};

/**
 * @name iamUserPasswordSet
 * @description Sets password using defined encryption
 * @function
 * @param {string} password 
 * @returns {Promise.<string>}
 */
const iamUserPasswordSet = async (password) =>{
	/**@type{import('./security.js')} */
	const {securityPasswordCreate}= await import(`file://${process.cwd()}/server/security.js`);
	return await securityPasswordCreate(password);
};
/**
 * @name iamUserPost
 * @description Creates new IAM user and if not admin also creates a user in user_account table in current database
 * @function
 * @param {number} app_id
 * @param {server_db_file_iam_user} data
 * @returns {Promise.<server_server_response & {result?: {id:number, user_account_id:number|null} }>}
 */
const iamUserPost = async (app_id, data) => {

    /**@type{import('./db/fileModelIamUser.js')} */
    const fileModelIamUser = await import(`file://${process.cwd()}/server/db/fileModelIamUser.js`);
    const error = iamUserValidation(data);
    if (error==null){
        const iamUser = await fileModelIamUser.post(app_id, {
                                                    username:           data.username, 
                                                    password:           data.password, 
                                                    password_reminder:  data.password_reminder,
                                                    type:               data.type, 
                                                    bio:                data.bio, 
                                                    private:            data.private, 
                                                    email:              data.email, 
                                                    email_unverified:   data.email_unverified, 
                                                    avatar:             data.avatar,
                                                    user_level:         null, 
                                                    verification_code:  null, 
                                                    status:             null,
                                                    active:             data.active
                                                });
        if (iamUser.result)
            return {result:{id:iamUser.result.insertId,
                            user_account_id:null}, 
                    type:'JSON'};
        else
            return iamUser;
    }
    else{
        return error;
    }
};
/**
 * @name iamUserGet
 * @description User get
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_file_iam_user }>}
 */
const iamUserGet = async parameters =>{
    /**@type{import('./db/fileModelIamUser.js')} */
    const fileModelIamUser = await import(`file://${process.cwd()}/server/db/fileModelIamUser.js`);
    
    const result = fileModelIamUser.get(parameters.app_id, parameters.resource_id);
    return result.http?
                result:
                    {result:result.result.map((/**@type{server_db_file_iam_user} */row)=>{
                        return {id: row.id,
                                username: row.username,
                                password: row.password,
                                type: row.type,
                                bio: row.bio,
                                private: row.private,
                                email: row.email,
                                email_unverified: row.email_unverified,
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
*          data:{  sort?:string|null,
*                  order_by?:string|null,
*                  search?:string|null,
*                  offset?:string|null,
*                  limit?:string|null}}} parameters
* @returns {Promise.<server_server_response & {result?:{page_header :{total_count:number, offset:number, count:number},
*                                                        rows:server_db_file_iam_user[]
*                                                       }}>}
*/
const iamUserGetAdmin = async parameters => {
    /**@type{import('./db/fileModelIamUser.js')} */
    const fileModelIamUser = await import(`file://${process.cwd()}/server/db/fileModelIamUser.js`);
    const order_by_num = parameters.data.order_by =='asc'?1:-1;
    const users = fileModelIamUser.get(parameters.app_id, null).result
                    .filter((/**@type{server_db_file_iam_user}*/row)=>row.username.indexOf(parameters.data?.search??'')>-1 ||
                                /**@ts-ignore */
                                row.bio?.indexOf(parameters.data?.search??'')>-1 ||
                                /**@ts-ignore */
                                row.email?.indexOf(parameters.data?.search??'')>-1 ||
                                /**@ts-ignore */
                                row.email_unverified?.indexOf(parameters.data?.search??'')>-1 ||
                                /**@ts-ignore */
                                row.id.toString().indexOf(parameters.data?.search??'')>-1 ||
                                parameters.data.search=='*'
                                )
                    .sort((/**@type{server_db_file_iam_user}*/first, /**@type{server_db_file_iam_user}*/second)=>{
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
                    });
        //return with page navigation info            
        return {result:{ page_header:  {
                                            total_count:	users.length,
                                            offset: 		serverUtilNumberValue(parameters.data.offset)??0,
                                            count:			users
                                                                .filter((/**@type{*}*/row, /**@type{number}*/index)=>(serverUtilNumberValue(parameters.data?.offset)??0)>0?
                                                                                                                        (index+1)>=(serverUtilNumberValue(parameters.data?.offset)??0):
                                                                                                                            true)
                                                                .filter((/**@type{*}*/row, /**@type{number}*/index)=>(serverUtilNumberValue(parameters.data.limit)??0)>0?
                                                                                                                        (index+1)<=(serverUtilNumberValue(parameters.data?.limit)??0)
                                                                                                                            :true).length
                                            },
                            rows:           users
                                                .filter((/**@type{*}*/row, /**@type{number}*/index)=>(serverUtilNumberValue(parameters.data?.offset)??0)>0?
                                                                                                        (index+1)>=(serverUtilNumberValue(parameters.data?.offset)??0):
                                                                                                            true)
                                                .filter((/**@type{*}*/row, /**@type{number}*/index)=>(serverUtilNumberValue(parameters.data.limit)??0)>0?
                                                                                                        (index+1)<=(serverUtilNumberValue(parameters.data?.limit)??0)
                                                                                                            :true)},
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
const iamUserGetLastLogin = (app_id, id) =>fileModelIamUserAppAccess.get(app_id, null).result
                                                .filter((/**@type{server_db_file_iam_user_app_access}*/row)=>
                                                    row.iam_user_id==id &&  row.app_id==app_id && row.res==1)
                                                .sort((/**@type{server_db_file_iam_user_app_access}*/a,
                                                        /**@type{server_db_file_iam_user_app_access}*/b)=>a.created < b.created?1:-1)[0]?.created;

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
    /**@type{import('./socket.js')} */
    const {socketConnectedUpdate} = await import(`file://${process.cwd()}/server/socket.js`);

    //set token expired after user is logged out in app
    return await iamUtilTokenExpiredSet(parameters.app_id, parameters.authorization, parameters.ip)
    .then(result=>{
        return result.http?result:
        //remove token from connected list
        socketConnectedUpdate(parameters.app_id, 
            {   idToken:parameters.idToken,
                user_account_id:null,
                iam_user_id:null,
                iam_user_username:null,
                iam_user_type:null,
                token_access:null,
                token_admin:null,
                ip:parameters.ip,
                headers_user_agent:parameters.user_agent,
                headers_accept_language:parameters.accept_language});
    });       
};

export{ iamUtilMessageNotAuthorized,
        iamUtilDecode,
        iamUtilTokenExpired,
        iamUtilResponseNotAuthorized,
        iamAuthenticateUser,
        iamAuthenticateUserSignup,
        iamAuthenticateUserActivate,
        iamAuthenticateUserForgot,
        iamAuthenticateUserUpdate,
        iamAuthenticateUserUpdatePassword,
        iamAuthenticateUserDelete,
        iamAuthenticateUserCommon,
        iamAuthenticateExternal,
        iamAuthenticateRequest,
        iamAuthenticateApp,
        iamAuthenticateResource,
        iamAuthorizeIdToken,
        iamAuthorizeToken,
        iamUserAppAccessGet,
        iamUserPost,
        iamUserGet,
        iamUserGetAdmin,
        iamUserGetLastLogin,
        iamUserLogout}; 