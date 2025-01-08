/** @module server/iam/service */

/**
 * @import {server_db_file_iam_app_token,server_db_file_iam_app_token_insert, 
 *          server_db_file_iam_user_login,server_db_file_iam_user_login_insert,
 *          server_iam_access_token_claim_type,server_iam_access_token_claim_scope_type,
 *          server_db_file_iam_control_ip,
 *          server_db_file_iam_user_update,server_db_file_iam_user_get,server_server_error, server_db_file_iam_user, server_db_file_iam_user_new, 
 *          server_db_sql_parameter_user_account_event_insertUserEvent,
 *          server_db_sql_result_user_account_userLogin,
 *          server_db_sql_parameter_user_account_userLogin,
 *          server_db_sql_result_user_account_providerSignIn,
 *          server_db_sql_parameter_user_account_create,
 *          server_db_sql_result_user_account_create,
 *          server_db_sql_result_user_account_activateUser,
 *          server_db_sql_result_user_account_event_getLastUserEvent,
 *          server_db_sql_parameter_user_account_updateUserLocal,
 *          server_db_sql_result_user_account_deleteUser,
 *          server_server_res} from './types.js'
 */

/**@type{import('./server.js')} */
const {serverResponseErrorSend, serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

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

/**@type{import('./db/fileModelIamUserLogin.js')} */
const fileModelIamUserLogin = await import(`file://${process.cwd()}/server/db/fileModelIamUserLogin.js`);

/**@type{import('./db/fileModelIamAppToken.js')} */
const fileModelIamAppToken = await import(`file://${process.cwd()}/server/db/fileModelIamAppToken.js`);

const {default:jwt} = await import('jsonwebtoken');

/**
 * @name iamRequestRateLimiterCount
 * @description Rate limiter 
 * @constant
 * @type{Object.<string,{count:number, firstRequestTime:number}>} 
 */
const iamRequestRateLimiterCount = {};

/**
 * @name iamUtilMesssageNotAuthorized
 * @description Returns not authorized message
 * @function
 * @returns {string}
 */
const iamUtilMesssageNotAuthorized = () => '⛔';
/**
 * @name iamUtilDecode
 * @description IAM util decode base64 in query
 * @function
 * @param {string} query 
 * @returns {URLSearchParams}
 */
 const iamUtilDecode = query =>{
    return new URLSearchParams(atob(query));
};
/**
 * @name iamUtilTokenExpired
 * @description IAM util token expired
 * @function
 * @param {number|null}  app_id
 * @param {'APP_ACCESS'|'APP_ID'|'ADMIN'} token_type 
 * @param {string} token 
 * @returns {boolean}
 */
const iamUtilTokenExpired = (app_id, token_type, token) =>{
    switch (token_type){
        case 'APP_ACCESS':{
            //exp, iat, tokentimestamp on token
            try {

                return ((jwt.verify(token, fileModelAppSecret.get({app_id:app_id, resource_id:app_id, res:null})[0]
                            /**@ts-ignore*/
                            .common_app_access_secret).exp ?? 0) * 1000) - Date.now()<0;    
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
 * @param {server_server_res} res
 * @returns {Promise.<void>}
 */
const iamUtilTokenExpiredSet = async (app_id, authorization, ip, res ) =>{
    const token = authorization?.split(' ')[1] ?? '';
    const iam_user_login_row = fileModelIamUserLogin.get(app_id,null).filter(row=>row.token==token &&row.ip == ip)[0];
    if (iam_user_login_row){
        //set token expired
        await fileModelIamUserLogin.update(app_id, iam_user_login_row.id, {res:2});
    }
    else
        throw iamUtilResponseNotAuthorized(res, 401, 'iamUtilTokenExpiredSet', true);
};

/**
 * @name iamUtilResponseNotAuthorized
 * @description IAM util response not authorized
 * @function
 * @param {server_server_res} res
 * @param {number} status
 * @param {string} reason
 * @param {boolean} bff
 * @returns {string|null|void}
 */
 const iamUtilResponseNotAuthorized = (res, status, reason, bff=false) => {
    if (bff){
        res.statusCode = status;
        res.statusMessage = reason;
        return iamUtilMesssageNotAuthorized();
    }
    else
        return serverResponseErrorSend(res, status, null, iamUtilMesssageNotAuthorized(), null, reason);
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
 * @name iamAuthenticateAdmin
 * @description IAM Authenticates admin login
 * @function
 * @memberof REST_API
 * @param {{app_id:number,
 *          iam:string,
 *          authorization:string,
 *          ip:string,
 *          user_agent:string,
 *          accept_language:string,
 *          res:server_server_res}} parameters
 * @returns {Promise.<{
 *                  iam_user_id:number,
 *                  iam_user_name:string,
 *                  token_at:string,
 *                  exp:number,
 *                  iat:number,
 *                  tokentimestamp:number}>}
 */
const iamAuthenticateAdmin = async parameters =>{
    /**@type{import('./socket.js')} */
    const {socketConnectedUpdate} = await import(`file://${process.cwd()}/server/socket.js`);
    /**
     * @param {1|0} result
     * @param {number} id
     * @param {string} username
     * @param {'ADMIN'|'USER'} type
     * @returns {Promise.<{
     *                  iam_user_id:number,
     *                  iam_user_name:string,
     *                  token_at:string,
     *                  exp:number,
     *                  iat:number,
     *                  tokentimestamp:number}>}
     */
    const check_user = async (result, id, username, type) => {       
        const jwt_data = iamAuthorizeToken(parameters.app_id, 'ADMIN', {id:id, name:username, ip:parameters.ip, scope:'USER'});
        /**@type{server_db_file_iam_user_login_insert} */
        const file_content = {	iam_user_id:id,
                                app_id:     parameters.app_id,
                                user:		username,
                                db:         serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB','USE')),
                                res:		result,
                                token:      jwt_data.token,
                                ip:         parameters.ip,
                                ua:         null,
                                long:       null,
                                lat:        null};
        await fileModelIamUserLogin.post(parameters.app_id, file_content);
        if (result == 1){
            return await socketConnectedUpdate(parameters.app_id, 
                {   iam:parameters.iam,
                    user_account_id:null,
                    iam_user_id:id,
                    iam_user_username:username,
                    iam_user_type:type,
                    token_access:null,
                    token_admin:jwt_data.token,
                    ip:parameters.ip,
                    headers_user_agent:parameters.user_agent,
                    headers_accept_language:parameters.accept_language,
                    res: parameters.res})
            .then(()=>{
                return  {   iam_user_id: id,
                            iam_user_name:username,
                            avatar: fileModelIamUser.get(parameters.app_id, id, parameters.res)[0].avatar,
                            token_at: jwt_data.token,
                            exp:jwt_data.exp,
                            iat:jwt_data.iat,
                            tokentimestamp:jwt_data.tokentimestamp
                        };
            })
            .catch((/**@type{server_server_error}*/error)=>{throw error;});
        }
        else
            throw iamUtilResponseNotAuthorized(parameters.res, 401, 'iamAuthenticateAdmin', true);
    };
    if(parameters.authorization){       
        const userpass =  Buffer.from((parameters.authorization || '').split(' ')[1] || '', 'base64').toString();
        const username = userpass.split(':')[0];
        const password = userpass.split(':')[1];
        const type = 'ADMIN';
        if (fileModelIamUser.get(parameters.app_id, null, null).length==0)
            return iamUserCreate(parameters.app_id,{
                            username:username, 
                            password:password, 
                            type: type, 
                            bio:null, 
                            private:1, 
                            email:'admin@localhost', 
                            email_unverified:null, 
                            avatar:null}, parameters.res)
            .then(result=>check_user(1, result.id, username, type));
        else{
            /**@type{import('./security.js')} */
            const {securityPasswordCompare}= await import(`file://${process.cwd()}/server/security.js`);

            /**@type{server_db_file_iam_user}*/
            const user =  fileModelIamUser.get(parameters.app_id, null, null).filter((/**@type{server_db_file_iam_user}*/user)=>user.username == username)[0];

            if (user && user.username == username && user.type=='ADMIN' && await securityPasswordCompare(password, user.password) && parameters.app_id == serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER','APP_COMMON_APP_ID')))
                return check_user(1, user.id, username, type); 
            else
                return check_user(0, user?.id, username, type);
        }
    }
    else{
        throw iamUtilResponseNotAuthorized(parameters.res, 401, 'iamAuthenticateAdmin', true);
    }
    
};

/**
 * @name iamAuthenticateUser
 * @description IAM Authenticates user login
 * @function
 * @memberof REST_API
 * @param {{app_id:number,
 *          iam:string,
 *          ip:string,
 *          user_agent:string,
 *          accept_language:string,
 *          data:{   username:string,
 *                   password:string,
 *                   client_latitude:string|null,
 *                   client_longitude:string|null},
 *          res:server_server_res}} parameters
 * @return {Promise.<{
 *                  accessToken:string|null,
 *                  exp:number,
 *                  iat:number,
 *                  tokentimestamp:number,
 *                  login:server_db_sql_result_user_account_userLogin[]}>}
 */
const iamAuthenticateUser = async parameters =>{
    
    /**@type{import('../apps/common/src/common.js')} */
    const {commonMailSend} = await import(`file://${process.cwd()}/apps/common/src/common.js`);

    /**@type{import('./security.js')} */
    const {securityPasswordCompare}= await import(`file://${process.cwd()}/server/security.js`);    
    /**@type{import('./socket.js')} */
    const {socketConnectedUpdate} = await import(`file://${process.cwd()}/server/socket.js`);
    
    /**@type{import('./db/dbModelUserAccount.js')} */
    const { updateUserVerificationCode, userGetUsername} = await import(`file://${process.cwd()}/server/db/dbModelUserAccount.js`);
    /**@type{import('./db/dbModelUserAccountApp.js')} */
    const dbModelUserAccountApp = await import(`file://${process.cwd()}/server/db/dbModelUserAccountApp.js`);

    return new Promise((resolve, reject)=>{           

       /**@type{server_db_sql_parameter_user_account_userLogin} */
       const data_login =    {   username: parameters.data.username};
       userGetUsername(parameters.app_id, data_login)
       .then(result_login=>{
           /**@type{server_db_file_iam_user_login_insert} */
           const data_body = { iam_user_id: result_login[0]?.id,
                               app_id:      parameters.app_id,
                               user:        parameters.data.username,
                               db:          serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB','USE')),
                               res:         0,
                               token:       null,
                               ip:          parameters.ip,
                               ua:          parameters.user_agent,
                               long:        parameters.data.client_longitude ?? null,
                               lat:         parameters.data.client_latitude ?? null
                           };
           if (result_login[0]) {
               securityPasswordCompare(parameters.data.password, result_login[0].password).then((result_password)=>{
                   data_body.res = result_password?1:0;
                   if (result_password) {
                       const jwt_data = iamAuthorizeToken(parameters.app_id, 'APP_ACCESS', {id:result_login[0].id, name:result_login[0].username, ip:parameters.ip, scope:'USER'});
                       data_body.token = jwt_data.token;
                       fileModelIamUserLogin.post(parameters.app_id, data_body)
                       .then(()=>{
                           dbModelUserAccountApp.post(parameters.app_id, result_login[0].id)
                           .then(()=>{
                               //if user not activated then send email with new verification code
                               const new_code = iamUtilVerificationCode();
                               if (result_login[0].active == 0){
                                   updateUserVerificationCode(parameters.app_id, result_login[0].id, new_code)
                                   .then(()=>{
                                       //send email UNVERIFIED
                                       commonMailSend(  parameters.app_id, 
                                                        fileModelAppSecret.get({app_id:parameters.app_id, resource_id:serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID'))??0, 
                                                                                res:parameters.res})[0].service_mail_type_unverified, 
                                                        parameters.ip, 
                                                        parameters.user_agent,
                                                        parameters.accept_language,
                                                        result_login[0].id,
                                                        new_code, 
                                                        result_login[0].email)
                                       .then(()=>{
                                           socketConnectedUpdate(parameters.app_id, 
                                               {   iam:parameters.iam,
                                                   user_account_id:result_login[0].id,
                                                   iam_user_id:null,
                                                   iam_user_username:null,
                                                   iam_user_type:null,
                                                   token_access:jwt_data.token,
                                                   token_admin:null,
                                                   ip:parameters.ip,
                                                   headers_user_agent:parameters.user_agent,
                                                   headers_accept_language:parameters.accept_language,
                                                   res: parameters.res})
                                           .then(()=>{
                                               resolve({
                                                   accessToken: jwt_data.token,
                                                   exp:jwt_data.exp,
                                                   iat:jwt_data.iat,
                                                   tokentimestamp:jwt_data.tokentimestamp,
                                                   login: Array(result_login[0])
                                               });
                                           })
                                           .catch((/**@type{server_server_error}*/error)=>reject(error));
                                       })
                                       .catch((/**@type{server_server_error}*/error)=>reject(error));
                                   });
                               }
                               else{
                                   socketConnectedUpdate(parameters.app_id, 
                                       {   iam:parameters.iam,
                                           user_account_id:result_login[0].id,
                                           iam_user_id:null,
                                           iam_user_username:null,
                                           iam_user_type:null,
                                           token_access:jwt_data.token,
                                           token_admin:null,
                                           ip:parameters.ip,
                                           headers_user_agent:parameters.user_agent,
                                           headers_accept_language:parameters.accept_language,
                                           res: parameters.res})
                                   .then(()=>{
                                       resolve({
                                           accessToken: jwt_data.token,
                                           exp:jwt_data.exp,
                                           iat:jwt_data.iat,
                                           tokentimestamp:jwt_data.tokentimestamp,
                                           login: Array(result_login[0])
                                       });
                                   })
                                   .catch((/**@type{server_server_error}*/error)=>reject(error));
                               }
                           })
                           .catch((/**@type{server_server_error}*/error)=>reject(error));
                       })
                       .catch((/**@type{server_server_error}*/error)=>reject(error));
                   } else {
                       //Username or password not found
                       fileModelIamUserLogin.post(parameters.app_id, data_body)
                       .then(()=>{
                            parameters.res.statusCode = 401;
                           reject(iamUtilMesssageNotAuthorized());
                       })
                       .catch((/**@type{server_server_error}*/error)=>reject(error));
                   }
               });
           } else{
               //User not found
               fileModelIamUserLogin.post(parameters.app_id, data_body)
               .then(()=>{
                    parameters.res.statusCode = 401;
                   reject(iamUtilMesssageNotAuthorized());
               })
               .catch((/**@type{server_server_error}*/error)=>reject(error));
           }
       })
       .catch((/**@type{server_server_error}*/error)=>reject(error));
   });
};

/**
 * @name iamAuthenticateUserProvider
 * @description IAM Authenticates user provider login
 * @function
 * @memberof REST_API
 * @param {{app_id:number,
 *          iam:string,
 *          resource_id:number,
 *          ip:string,
 *          user_agent:string,
 *          accept_language:string,
 *          locale:string,
 *          data:{   identity_provider_id:string|null,
 *                   avatar:string|null,
 *                   provider_id:string,
 *                   provider_first_name:string,
 *                   provider_last_name:string,
 *                   provider_image:string,
 *                   provider_image_url:string,
 *                   provider_email:string,
 *                   client_latitude:string|null,
 *                   client_longitude:string|null},
 *          res:server_server_res}} parameters
 * @return {Promise.<{
 *                  accessToken:string|null,
 *                  exp:number,
 *                  iat:number,
 *                  tokentimestamp:number,
 *                  items:server_db_sql_result_user_account_providerSignIn[],
 *                  userCreated:0|1}>}
 */
const iamAuthenticateUserProvider = async parameters =>{
    /**@type{import('./socket.js')} */
    const {socketConnectedUpdate} = await import(`file://${process.cwd()}/server/socket.js`);
    /**@type{import('./db/common.js')} */
    const { dbCommonCheckedError } = await import(`file://${process.cwd()}/server/db/common.js`);

    /**@type{import('./db/dbModelUserAccount.js')} */
    const { userGetProvider, userUpdateProvider,userPost} = await import(`file://${process.cwd()}/server/db/dbModelUserAccount.js`);
    /**@type{import('./db/dbModelUserAccountApp.js')} */
    const dbModelUserAccountApp = await import(`file://${process.cwd()}/server/db/dbModelUserAccountApp.js`);

    return new Promise((resolve, reject)=>{
        userGetProvider(parameters.app_id, serverUtilNumberValue(parameters.data.identity_provider_id), parameters.resource_id)
        .then(result_signin=>{
            /** @type{server_db_sql_parameter_user_account_create} */
            const data_user = {bio:                    null,
                               private:                null,
                               user_level:             null,
                               username:               null,
                               password:               null,
                               password_new:           null,
                               password_reminder:      null,
                               email_unverified:       null,
                               email:                  null,
                               avatar:                 null,
                               verification_code:      null,
                               active:                 1,
                               identity_provider_id:   serverUtilNumberValue(parameters.data.identity_provider_id),
                               provider_id:            parameters.data.provider_id,
                               provider_first_name:    parameters.data.provider_first_name,
                               provider_last_name:     parameters.data.provider_last_name,
                               provider_image:         parameters.data.provider_image,
                               provider_image_url:     parameters.data.provider_image_url,
                               provider_email:         parameters.data.provider_email,
                               admin:                  0};
           
            if (result_signin.length > 0) {        
                
                const jwt_data_exists = iamAuthorizeToken(parameters.app_id, 'APP_ACCESS', {id:result_signin[0].id, name:result_signin[0].username, ip:parameters.ip, scope:'USER'});
                /**@type{server_db_file_iam_user_login_insert} */
                const data_login = {
                    iam_user_id:    result_signin[0].id,
                    app_id:         parameters.app_id,
                    user:           result_signin[0].username,
                    db:             serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB','USE')),
                    res:            1,
                    token:          jwt_data_exists.token,
                    ip:             parameters.ip,
                    ua:             parameters.user_agent,
                    long:           parameters.data.client_longitude,
                    lat:            parameters.data.client_latitude
                };
                fileModelIamUserLogin.post(parameters.app_id, data_login)
                .then(()=>{
                    userUpdateProvider(parameters.app_id, result_signin[0].id, data_user)
                    .then(()=>{
                        dbModelUserAccountApp.post(parameters.app_id, result_signin[0].id)
                        .then(()=>{
                            socketConnectedUpdate(parameters.app_id, 
                                {   iam:parameters.iam,
                                    user_account_id:result_signin[0].id,
                                    iam_user_id:null,
                                    iam_user_username:null,
                                    iam_user_type:null,
                                    token_access:jwt_data_exists.token,
                                    token_admin:null,
                                    ip:parameters.ip,
                                    headers_user_agent:parameters.user_agent,
                                    headers_accept_language:parameters.accept_language,
                                    res: parameters.res})
                            .then(()=>{
                                resolve({
                                    accessToken: jwt_data_exists.token,
                                    exp:jwt_data_exists.exp,
                                    iat:jwt_data_exists.iat,
                                    tokentimestamp:jwt_data_exists.tokentimestamp,
                                    items: result_signin,
                                    userCreated: 0
                                });
                            })
                            .catch((/**@type{server_server_error}*/error)=>reject(error));
                        })
                        .catch((/**@type{server_server_error}*/error)=>reject(error));
                    })
                    .catch((/**@type{server_server_error}*/error)=>{
                        dbCommonCheckedError(parameters.app_id, parameters.locale, error, parameters.res).then((/**@type{string}*/message)=>reject(message));
                    });    
                })
                .catch((/**@type{server_server_error}*/error)=>reject(error));
            }
            else{
                //if provider user not found then create user and one user setting
                //avatar not used by providers, set default null
                data_user.avatar = parameters.data.avatar ?? null;
                data_user.provider_image = parameters.data.provider_image ?? null;
                //generate local username for provider 1
                data_user.username = `${data_user.provider_first_name}${Date.now()}`;
               
                userPost(parameters.app_id, data_user)
                .then(result_create=>{
                    const jwt_data_new = iamAuthorizeToken(parameters.app_id, 'APP_ACCESS', {id:result_create.insertId, name:data_user.username ?? '', ip:parameters.ip, scope:'USER'});
                    /**@type{server_db_file_iam_user_login_insert} */
                    const data_login = {
                        iam_user_id:result_create.insertId,
                        app_id:     parameters.app_id,
                        user:       data_user.username ?? '',
                        db:         serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB','USE')),
                        res:        1,
                        token:      jwt_data_new.token,
                        ip:         parameters.ip,
                        ua:         parameters.user_agent,
                        long:       parameters.data.client_longitude,
                        lat:        parameters.data.client_latitude
                    };
                    fileModelIamUserLogin.post(parameters.app_id, data_login)
                    .then(()=>{
                        dbModelUserAccountApp.post(parameters.app_id, result_create.insertId)
                        .then(()=>{
                            userGetProvider(parameters.app_id, serverUtilNumberValue(parameters.data.identity_provider_id), parameters.resource_id)
                            .then(result_signin2=>{
                                socketConnectedUpdate(parameters.app_id, 
                                   {   iam:parameters.iam,
                                       user_account_id:result_create.insertId,
                                       iam_user_id:null,
                                       iam_user_username:null,
                                       iam_user_type:null,
                                       token_access:jwt_data_new.token,
                                       token_admin:null,
                                       ip:parameters.ip,
                                       headers_user_agent:parameters.user_agent,
                                       headers_accept_language:parameters.accept_language,
                                       res: parameters.res})
                                .then(()=>{
                                    resolve({
                                       accessToken: jwt_data_new.token,
                                       exp:jwt_data_new.exp,
                                       iat:jwt_data_new.iat,
                                       tokentimestamp:jwt_data_new.tokentimestamp,
                                       items: result_signin2,
                                       userCreated: 1
                                    });
                                })
                                .catch((/**@type{server_server_error}*/error)=>reject(error));
                            })
                            .catch((/**@type{server_server_error}*/error)=>reject(error));
                        })
                        .catch((/**@type{server_server_error}*/error)=>reject(error));
                    })
                    .catch((/**@type{server_server_error}*/error)=>reject(error));
                })
                .catch((/**@type{server_server_error}*/error)=>reject(error));
            }
        })
        .catch((/**@type{server_server_error}*/error)=>reject(error));
    });
};
/**
 * @name iamAuthenticateUserSignup
 * @description IAM Authenticates user signup
 * @function
 * @memberof REST_API
 * @param {{app_id:number,
 *          ip:string,
 *          user_agent:string,
 *          accept_language:string,
 *          locale:string,
 *          data:server_db_sql_parameter_user_account_create,
 *          res:server_server_res}} parameters
 * @return {Promise.<{
*              accessToken:string|null,
*              exp:number,
*              iat:number,
*              tokentimestamp:number,
*              id:number,
*              data:server_db_sql_result_user_account_create}>}
*/
const iamAuthenticateUserSignup = async parameters =>{
    /**@type{import('../apps/common/src/common.js')} */
    const {commonMailSend} = await import(`file://${process.cwd()}/apps/common/src/common.js`);

    /**@type{import('./db/common.js')} */
    const { dbCommonCheckedError } = await import(`file://${process.cwd()}/server/db/common.js`);

    /**@type{import('./db/dbModelUserAccount.js')} */
    const { userPost} = await import(`file://${process.cwd()}/server/db/dbModelUserAccount.js`);

    return new Promise((resolve, reject)=>{
       /**@type{server_db_sql_parameter_user_account_create} */
       const data_body = { bio:                    parameters.data.bio,
                           private:                parameters.data.private,
                           user_level:             parameters.data.user_level,
                           username:               parameters.data.username,
                           password:               null,
                           password_new:           parameters.data.password,
                           password_reminder:      parameters.data.password_reminder,
                           email:                  parameters.data.email,
                           email_unverified:       null,
                           avatar:                 parameters.data.avatar,
                           verification_code:      parameters.data.provider_id?null:iamUtilVerificationCode(),
                           active:                 serverUtilNumberValue(parameters.data.active) ?? 0,
                           identity_provider_id:   serverUtilNumberValue(parameters.data.identity_provider_id),
                           provider_id:            parameters.data.provider_id ?? null,
                           provider_first_name:    parameters.data.provider_first_name,
                           provider_last_name:     parameters.data.provider_last_name,
                           provider_image:         parameters.data.provider_image,
                           provider_image_url:     parameters.data.provider_image_url,
                           provider_email:         parameters.data.provider_email,
                           admin:                  0
                       };
        userPost(parameters.app_id, data_body)
        .then(result_create=>{
            if (parameters.data.provider_id == null ) {
                //send email for local users only
                //send email SIGNUP
                commonMailSend( parameters.app_id, 
                                fileModelAppSecret.get({app_id:parameters.app_id, resource_id:serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID'))??0, 
                                                        res:parameters.res})[0].service_mail_type_signup, 
                                parameters.ip, 
                                parameters.user_agent,
                                parameters.accept_language,
                                result_create.insertId, 
                                data_body.verification_code, 
                                data_body.email ?? '')
                .then(()=>{
                    const jwt_data = iamAuthorizeToken(parameters.app_id, 'APP_ACCESS', {id:result_create.insertId, name:parameters.data.username??'', ip:parameters.ip, scope:'USER'});
                    resolve({
                       accessToken: jwt_data.token,
                       exp:jwt_data.exp,
                       iat:jwt_data.iat,
                       tokentimestamp:jwt_data.tokentimestamp,
                       id: result_create.insertId,
                       data: result_create
                    });
                })
                .catch((/**@type{server_server_error}*/error)=>reject(error));
            }
            else{
                const jwt_data = iamAuthorizeToken(parameters.app_id, 'APP_ACCESS', {id:result_create.insertId, name:parameters.data.username??'', ip:parameters.ip, scope:'USER'});
                resolve({
                   accessToken: jwt_data.token,
                   exp:jwt_data.exp,
                   iat:jwt_data.iat,
                   tokentimestamp:jwt_data.tokentimestamp,
                   id: result_create.insertId,
                   data: result_create
                });
            }
               
        })
        .catch((/**@type{server_server_error}*/error)=>{
            dbCommonCheckedError(parameters.app_id, parameters.locale, error, parameters.res).then((/**@type{string}*/message)=>reject(message));
        });
    });
};

/**
 * @name iamAuthenticateUserActivate
 * @description IAM Authenticates user activate
 * @function
 * @memberof REST_API
 * @param {{app_id:number,  
 *          resource_id:number,
 *          ip:string,
 *          authorization:string,
 *          user_agent:string,
 *          accept_language:string,
 *          host:string 
 *          locale:string,
 *          data:{  verification_type:string,   //1 LOGIN, 2 SIGNUP, 3 FORGOT/ PASSWORD RESET, 4 NEW EMAIL
 *                  verification_code:string,
 *                  user_language: string,
 *                  user_timezone: string,
 *                  user_number_system: string,
 *                  user_platform: string,
 *                  client_latitude:string,
 *                  client_longitude:string},
 *          res:server_server_res}} parameters
 * @return {Promise.<{
 *              count: number,
 *              auth: string|null,
 *              accessToken: string|null,
 *              exp:number|null,
 *              iat:number|null,
 *              tokentimestamp:number|null,
 *              items: server_db_sql_result_user_account_activateUser[]}>}
 */
const iamAuthenticateUserActivate = async parameters =>{
    /**@type{import('./db/common.js')} */
    const { dbCommonCheckedError } = await import(`file://${process.cwd()}/server/db/common.js`);

    /**@type{import('./db/dbModelUserAccount.js')} */
    const { userUpdateActivate} = await import(`file://${process.cwd()}/server/db/dbModelUserAccount.js`);
    /**@type{import('./db/dbModelUserAccountEvent.js')} */
    const dbModelUserAccountEvent = await import(`file://${process.cwd()}/server/db/dbModelUserAccountEvent.js`);
    /**@type{string|null} */
    let auth_password_new = null;
    if (serverUtilNumberValue(parameters.data.verification_type) == 3){
        //reset password
        auth_password_new = iamUtilVerificationCode();
    }
    const result_activate = await  userUpdateActivate(parameters.app_id, parameters.resource_id, serverUtilNumberValue(parameters.data.verification_type), parameters.data.verification_code, auth_password_new)
                                    .catch((/**@type{server_server_error}*/error)=>
                                        dbCommonCheckedError(parameters.app_id, parameters.locale, error, parameters.res).then((/**@type{string}*/message)=>{throw message;}));
    if (auth_password_new == null){
        if (result_activate.affectedRows==1 && (serverUtilNumberValue(parameters.data.verification_type)==1 ||
            serverUtilNumberValue(parameters.data.verification_type)==4))
            await iamUserLogout({app_id:parameters.app_id,
                            ip:parameters.ip,
                            authorization:parameters.authorization,
                            user_agent:parameters.user_agent,
                            accept_language:parameters.accept_language,
                            res:parameters.res});
        if (result_activate.affectedRows==1 && serverUtilNumberValue(parameters.data.verification_type)==4){
            //new email verified
            /**@type{server_db_sql_parameter_user_account_event_insertUserEvent}*/
            const eventData = {
                user_account_id: parameters.resource_id,
                event: 'EMAIL_VERIFIED_CHANGE_EMAIL',
                event_status: 'SUCCESSFUL',
                user_language: parameters.data.user_language,
                user_timezone: parameters.data.user_timezone,
                user_number_system: parameters.data.user_number_system,
                user_platform: parameters.data.user_platform,
                server_remote_addr : parameters.ip,
                server_user_agent : parameters.user_agent,
                server_http_host : parameters.host,
                server_http_accept_language : parameters.accept_language,
                client_latitude : parameters.data.client_latitude,
                client_longitude : parameters.data.client_longitude
            };
            const result_insert = await dbModelUserAccountEvent.post(parameters.app_id, eventData);
            return {
                    count: result_insert.affectedRows,
                    auth: null,
                    accessToken: null,
                    exp:null,
                    iat:null,
                    tokentimestamp:null,
                    items: Array(result_insert)
                };
        }
        else
            return {
                count: result_activate.affectedRows,
                auth: null,
                accessToken: null,
                exp:null,
                iat:null,
                tokentimestamp:null,
                items: Array(result_activate)
            };
    }
    else{
        if (result_activate.affectedRows==1){
            //verification type 3 FORGOT/ PASSWORD RESET
            const jwt_data = iamAuthorizeToken(parameters.app_id, 'APP_ACCESS', {id:parameters.resource_id, name:'', ip:parameters.ip, scope:'USER'});
            //email was verified and activated with id token, but now the password will be updated
            //return accessToken and authentication code
            /**@type{server_db_file_iam_user_login_insert} */
            const data_body = { 
                iam_user_id:parameters.resource_id,
                app_id:     parameters.app_id,
                user:       '',
                db:         serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB','USE')),
                res:        1,
                token:      jwt_data.token,
                ip:         parameters.ip,
                ua:         parameters.user_agent,
                long:       parameters.data.client_longitude ?? null,
                lat:        parameters.data.client_latitude ?? null};
            return fileModelIamUserLogin.post(parameters.app_id, data_body)
                    .then(()=>{
                        return {
                            count: result_activate.affectedRows,
                            auth: auth_password_new,
                            accessToken: jwt_data.token,
                            exp:jwt_data.exp,
                            iat:jwt_data.iat,
                            tokentimestamp:jwt_data.tokentimestamp,
                            items: Array(result_activate)
                        };
                    });
        }
        else
            return {
                count: result_activate.affectedRows,
                auth: null,
                accessToken: null,
                exp:null,
                iat:null,
                tokentimestamp:null,
                items: Array(result_activate)
            };
    }
};

/**
 * @name iamAuthenticateUserForgot
 * @description IAM Authenticates user password forgot
 * @function
 * @memberof REST_API
 * @param {{app_id:number, 
 *          ip:string, 
 *          user_agent:string, 
 *          accept_language:string, 
 *          host:string, 
 *          data:{  email:string,
 *                  user_language: string,
 *                  user_timezone: string,
 *                  user_number_system: string,
 *                  user_platform: string,
 *                  client_latitude:string,
 *                  client_longitude:string}}} parameters
 * @returns {Promise.<{sent: number,id?: number}>}
 */
const iamAuthenticateUserForgot = async parameters =>{

    /**@type{import('../apps/common/src/common.js')} */
    const {commonMailSend} = await import(`file://${process.cwd()}/apps/common/src/common.js`);

    /**@type{import('./db/dbModelUserAccountEvent.js')} */
    const dbModelUserAccountEvent = await import(`file://${process.cwd()}/server/db/dbModelUserAccountEvent.js`);

    /**@type{import('./db/dbModelUserAccount.js')} */
    const { userGetEmail, updateUserVerificationCode} = await import(`file://${process.cwd()}/server/db/dbModelUserAccount.js`);

    return new Promise((resolve, reject)=>{
        const email = parameters.data.email ?? '';
        if (email !='')
            userGetEmail(parameters.app_id, email)
            .then(result_emailuser=>{
                if (result_emailuser[0]){
                    dbModelUserAccountEvent.getLastUserEvent(parameters.app_id, serverUtilNumberValue(result_emailuser[0].id), 'PASSWORD_RESET')
                    .then(result_user_event=>{
                        if (result_user_event[0] &&
                            result_user_event[0].status_name == 'INPROGRESS' &&
                            (+ new Date(result_user_event[0].current_timestamp) - + new Date(result_user_event[0].date_created))/ (1000 * 60 * 60 * 24) < 1)
                            resolve({sent: 0});
                        else{
                            /**@type{server_db_sql_parameter_user_account_event_insertUserEvent}*/
                            const eventData = {
                                                user_account_id: result_emailuser[0].id,
                                                event: 'PASSWORD_RESET',
                                                event_status: 'INPROGRESS',
                                                user_language: parameters.data.user_language,
                                                user_timezone: parameters.data.user_timezone,
                                                user_number_system: parameters.data.user_number_system,
                                                user_platform: parameters.data.user_platform,
                                                server_remote_addr : parameters.ip,
                                                server_user_agent : parameters.user_agent,
                                                server_http_host : parameters.host,
                                                server_http_accept_language : parameters.accept_language,
                                                client_latitude : parameters.data.client_latitude,
                                                client_longitude : parameters.data.client_longitude
                                            };
                            dbModelUserAccountEvent.post(parameters.app_id, eventData)
                            .then(()=>{
                                const new_code = iamUtilVerificationCode();
                                updateUserVerificationCode(parameters.app_id, result_emailuser[0].id, new_code)
                                .then(()=>{
                                    //send email PASSWORD_RESET
                                    commonMailSend( parameters.app_id, 
                                                    fileModelAppSecret.get({app_id:parameters.app_id, resource_id:serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID'))??0, 
                                                                            res:null})[0].service_mail_type_password_reset, 
                                                    parameters.ip, 
                                                    parameters.user_agent,
                                                    parameters.accept_language,
                                                    result_emailuser[0].id, 
                                                    new_code, 
                                                    email)
                                    .then(()=>{
                                        resolve({
                                            sent: 1,
                                            id: result_emailuser[0].id
                                        });  
                                    })
                                    .catch((/**@type{server_server_error}*/error)=>reject(error));
                                })
                                .catch((/**@type{server_server_error}*/error)=>reject(error));
                            })
                            .catch(()=> {
                                resolve({sent: 0});
                            });
                        }
                    })
                    .catch((/**@type{server_server_error}*/error)=>reject(error));         
                }
                else
                    resolve({sent: 0});
            })
            .catch((/**@type{server_server_error}*/error)=>reject(error));
        else
            resolve({sent: 0});
    });
};

/**
 * @name iamAuthenticateUserUpdate
 * @description IAM Authenticates user update
 * @function
 * @memberof REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          ip:string,
 *          user_agent:string,
 *          host:string,
 *          accept_language:string,
 *          data :{ bio:string,
 *                  private:number,
 *                  avatar:string,
 *                  username:string,
 *                  password:string,
 *                  password_new:string,
 *                  password_reminder:string,
 *                  email:string,
 *                  new_email:string,
 *                  user_language:string,
 *                  user_timezone:string,
 *                  user_number_system:string,
 *                  user_platform:string,
 *                  client_latitude:string,
 *                  client_longitude:string,
 *                  verification_code:string},
 *          locale:string,
 *          res:server_server_res}} parameters
 * @returns {Promise.<{sent_change_email: number}>}
 */
const iamAuthenticateUserUpdate = async parameters => {

    /**@type{import('./security.js')} */
    const {securityPasswordCompare}= await import(`file://${process.cwd()}/server/security.js`);

    /**@type{import('../apps/common/src/common.js')} */
    const {commonMailSend} = await import(`file://${process.cwd()}/apps/common/src/common.js`);

    /**@type{import('./db/common.js')} */
    const { dbCommonCheckedError } = await import(`file://${process.cwd()}/server/db/common.js`);

    /**@type{import('./db/dbModelUserAccount.js')} */
    const { getUserByUserId, userUpdateLocal} = await import(`file://${process.cwd()}/server/db/dbModelUserAccount.js`);
    
    /**@type{import('./db/dbModelUserAccountEvent.js')} */
    const dbModelUserAccountEvent = await import(`file://${process.cwd()}/server/db/dbModelUserAccountEvent.js`);

    const result_user = await getUserByUserId({app_id:parameters.app_id, resource_id:parameters.resource_id, locale:parameters.locale, res:parameters.res});
    
    /**@type{server_db_sql_result_user_account_event_getLastUserEvent[]}*/
    const result_user_event = await dbModelUserAccountEvent.getLastUserEvent(parameters.app_id, parameters.resource_id, 'EMAIL_VERIFIED_CHANGE_EMAIL');

    return new Promise((resolve, reject)=>{
        if (result_user) {
            securityPasswordCompare(parameters.data.password, result_user.password ?? '').then((result_compare)=>{
                if (result_compare){
                    let send_email=false;
                    if (parameters.data.new_email && parameters.data.new_email!=''){
                        if ((result_user_event[0] && 
                            (+ new Date(result_user_event[0].current_timestamp) - + new Date(result_user_event[0].date_created))/ (1000 * 60 * 60 * 24) >= 1)||
                                result_user_event.length == 0)
                            send_email=true;
                    }
                    /**@type{server_db_sql_parameter_user_account_updateUserLocal} */
                    const data_update = {   bio:                parameters.data.bio,
                                            private:            parameters.data.private,
                                            username:           parameters.data.username,
                                            password:           parameters.data.password,
                                            password_new:       (parameters.data.password_new && parameters.data.password_new!='')==true?parameters.data.password_new:null,
                                            password_reminder:  (parameters.data.password_reminder && parameters.data.password_reminder!='')==true?parameters.data.password_reminder:null,
                                            email:              parameters.data.email,
                                            email_unverified:   (parameters.data.new_email && parameters.data.new_email!='')==true?parameters.data.new_email:null,
                                            avatar:             parameters.data.avatar,
                                            verification_code:  send_email==true?iamUtilVerificationCode():null,
                                            provider_id:        result_user.provider_id,
                                            admin:              0
                                        };
                    userUpdateLocal(parameters.app_id, data_update, parameters.resource_id)
                    .then(result_update=>{
                        if (result_update){
                            if (send_email){
                                //no change email in progress or older than at least 1 day
                                /**@type{server_db_sql_parameter_user_account_event_insertUserEvent}*/
                                const eventData = {
                                    user_account_id: parameters.resource_id,
                                    event: 'EMAIL_VERIFIED_CHANGE_EMAIL',
                                    event_status: 'INPROGRESS',
                                    user_language: parameters.data.user_language,
                                    user_timezone: parameters.data.user_timezone,
                                    user_number_system: parameters.data.user_number_system,
                                    user_platform: parameters.data.user_platform,
                                    server_remote_addr : parameters.ip,
                                    server_user_agent : parameters.user_agent,
                                    server_http_host : parameters.host,
                                    server_http_accept_language : parameters.accept_language,
                                    client_latitude : parameters.data.client_latitude,
                                    client_longitude : parameters.data.client_longitude
                                };
                                dbModelUserAccountEvent.post(parameters.app_id, eventData)
                                .then(()=>{
                                    //send email SERVICE_MAIL_TYPE_CHANGE_EMAIL
                                    commonMailSend( parameters.app_id, 
                                                    fileModelAppSecret.get({app_id:parameters.app_id, resource_id:serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID'))??0, 
                                                                            res:parameters.res})[0].service_mail_type_change_email, 
                                                    parameters.ip, 
                                                    parameters.user_agent,
                                                    parameters.accept_language,
                                                    parameters.resource_id,
                                                    parameters.data.verification_code,
                                                    parameters.data.new_email)
                                    .then(()=>{
                                        resolve({sent_change_email: 1});
                                    })
                                    .catch((/**@type{server_server_error}*/error)=>reject(error));
                                })
                                .catch((/**@type{server_server_error}*/error)=>reject(error));
                            }
                            else
                                resolve({sent_change_email: 0});
                        }
                        else{
                            import(`file://${process.cwd()}/server/db/common.js`)
                            .then((/**@type{import('./db/common.js')} */{dbCommonRecordNotFound}) => {
                                dbCommonRecordNotFound(parameters.app_id, parameters.locale, parameters.res).then((/**@type{string}*/message)=>reject(message));
                            });
                        }
                    })
                    .catch((/**@type{server_server_error}*/error)=>{
                        dbCommonCheckedError(parameters.app_id, parameters.locale, error, parameters.res).then((/**@type{string}*/message)=>reject(message));
                    });
                } 
                else {
                    parameters.res.statusCode=400;
                    parameters.res.statusMessage = 'invalid password attempt for user id:' + parameters.resource_id;
                    //invalid password
                    reject(iamUtilMesssageNotAuthorized());
                }
            });
        } 
        else {
            //user not found
            parameters.res.statusCode=404;
            reject(iamUtilMesssageNotAuthorized());
        }
    });
};
/**
 * @name iamAuthenticateUserUpdatePassword
 * @description IAM Authenticates user update password
 * @function
 * @memberof REST_API
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          ip:string,
 *          authorization:string,
 *          user_agent:string,
 *          host:string,
 *          accept_language:string,
 *          data:{  password_new:string,
 *                  auth:string,
 *                  user_language:string,
 *                  user_timezone:string,
 *                  user_number_system:string,
 *                  user_platform:string,
 *                  client_latitude:string,
 *                  client_longitude:string},
 *          locale:string,
 *          res:server_server_res}} parameters
 * @returns {Promise.<void>}
 */
const iamAuthenticateUserUpdatePassword = async parameters => {
    /**@type{import('./db/dbModelUserAccount.js')} */
    const { updatePassword} = await import(`file://${process.cwd()}/server/db/dbModelUserAccount.js`);
    
    await updatePassword(parameters);
    await iamUserLogout({app_id:parameters.app_id,
        authorization:parameters.authorization,
        ip:parameters.ip,
        user_agent:parameters.user_agent,
        accept_language:parameters.accept_language,
        res:parameters.res});
};
/**
 * @name iamAuthenticateUserDelete
 * @description IAM Authenticates user delete
 * @function 
 * @memberof REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          data:{password:string},
 *          locale:string,
 *          res:server_server_res}} parameters
 * @returns {Promise.<server_db_sql_result_user_account_deleteUser>}
 */
const iamAuthenticateUserDelete = async parameters => {

    /**@type{import('./security.js')} */
    const {securityPasswordCompare}= await import(`file://${process.cwd()}/server/security.js`);
    
    /**@type{import('./db/dbModelUserAccount.js')} */
    const { getUserByUserId, userDelete, userGetPassword} = await import(`file://${process.cwd()}/server/db/dbModelUserAccount.js`);

    return new Promise((resolve, reject)=>{
        getUserByUserId({app_id:parameters.app_id, resource_id:parameters.resource_id, locale:parameters.locale, res:parameters.res})
        .then(result_user=>{
            if (result_user) {
                if (result_user.provider_id !=null){
                    userDelete(parameters.app_id, parameters.resource_id)
                    .then(result_delete=>{
                        if (result_delete)
                            resolve(result_delete);
                        else{
                            import(`file://${process.cwd()}/server/db/common.js`)
                            .then((/**@type{import('./db/common.js')} */{dbCommonRecordNotFound}) => {
                                dbCommonRecordNotFound(parameters.app_id, parameters.locale, parameters.res).then((/**@type{string}*/message)=>reject(message));
                            });
                        }
                    })
                    .catch((/**@type{server_server_error}*/error)=>reject(error));
                }
                else{
                    userGetPassword(parameters.app_id, parameters.resource_id)
                    .then(result_password=>{
                        if (result_password[0]) {
                            securityPasswordCompare(parameters.data.password, result_password[0].password).then((result_password)=>{
                                if (result_password){
                                    userDelete(parameters.app_id, parameters.resource_id)
                                    .then(result_delete=>{
                                        if (result_delete)
                                            resolve(result_delete);
                                        else{
                                            import(`file://${process.cwd()}/server/db/common.js`)
                                            .then((/**@type{import('./db/common.js')} */{dbCommonRecordNotFound}) => {
                                                dbCommonRecordNotFound(parameters.app_id, parameters.locale, parameters.res).then((/**@type{string}*/message)=>reject(message));
                                            });
                                        }
                                    })
                                    .catch((/**@type{server_server_error}*/error)=>reject(error));
                                }
                                else{
                                    parameters.res.statusMessage = 'invalid password attempt for user id:' + parameters.resource_id;
                                    parameters.res.statusCode = 400;
                                    //invalid password
                                    reject(iamUtilMesssageNotAuthorized());
                                } 
                            });
                            
                        }
                        else{
                            //user not found
                            parameters.res.statusCode = 404;
                            reject(iamUtilMesssageNotAuthorized());
                        }
                    })
                    .catch((/**@type{server_server_error}*/error)=>reject(error));
                }
            }
            else{
                //user not found
                parameters.res.statusCode = 404;
                reject(iamUtilMesssageNotAuthorized());
            }
        })
        .catch((/**@type{server_server_error}*/error)=>reject(error));
    });
};

/**
 * @name iamAuthenticateSocket
 * @description Middleware authenticate socket used for EventSource
 * @function
 * @param {string} path
 * @param {string} host
 * @param {string} iam
 * @param {string} ip
 * @param {server_server_res} res
 * @param {function} next
 * @returns {void}
 */
const iamAuthenticateSocket = (iam, path, host, ip, res, next) =>{
    if (iam && iamUtilDecode(iam).get('authorization_bearer') && path.startsWith('/server-socket')){
        iamAuthenticateUserCommon(iam, 'APP_ID', iamUtilDecode(iam).get('authorization_bearer')??'', host, ip, res, next);
    }
    else
        iamUtilResponseNotAuthorized(res, 401, 'iamAuthenticateSocket');
};
/**
 * @name iamAuthenticateUserCommon
 * @description IAM Middleware authenticate IAM users
 * @function
 * @param {string} iam
 * @param {'AUTH_ADMIN'|'AUTH_USER'|'AUTH_PROVIDER'|'ADMIN'|'APP_ACCESS'|'APP_ID'|'APP_ID_REGISTRATION'} scope
 * @param {string} authorization
 * @param {string} host
 * @param {string} ip
 * @param {server_server_res} res
 * @param {function} next
 * @returns {Promise.<void>}
 */
 const iamAuthenticateUserCommon = async (iam, scope, authorization, host, ip, res, next) =>{
    const app_id_host = commonAppHost(host);
    //iam required for SOCKET update using iam.client_id that can be changed any moment and not validated here
    if (iam && scope && authorization && app_id_host !=null){
        const app_id_admin = serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER','APP_COMMON_APP_ID'));
        // APP_ID uses req.headers.authorization ID token except for SOCKET where ID token is in iam.authorization_bearer
        // other requests uses BASIC or BEARER access token in req.headers.authorization and ID token in iam.authorization_bearer
        const id_token = scope=='APP_ID'?authorization?.split(' ')[1] ?? '':iamUtilDecode(iam).get('authorization_bearer')?.split(' ')[1] ?? '';
        try {
            //authenticate id token
            /**@type{{app_id:number, ip:string, scope:string, exp:number, iat:number, tokentimestamp:number}|*} */
            const id_token_decoded = jwt.verify(id_token, fileModelAppSecret.get({app_id:app_id_host, resource_id:app_id_host, res:res})[0].common_app_id_secret);
            /**@type{server_db_file_iam_app_token}*/
            const log_id_token = fileModelIamAppToken.get(app_id_host).filter((/**@type{server_db_file_iam_app_token}*/row)=> 
                                                                                    row.app_id == app_id_host && row.ip == ip && row.token == id_token
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
                        case (scope=='AUTH_ADMIN') && app_id_host== app_id_admin && authorization.toUpperCase().startsWith('BASIC'):{
                            next();
                            break;
                        }
                        case (scope=='AUTH_USER' || scope=='AUTH_PROVIDER') && app_id_host!= app_id_admin && authorization.toUpperCase().startsWith('BASIC'):{
                            if (serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_IAM', 'ENABLE_USER_LOGIN'))==1){
                                next();
                            }
                            else
                                iamUtilResponseNotAuthorized(res, 403, 'iamAuthenticateUserCommon');
                            break;
                        }
                        case scope=='ADMIN' && app_id_host== app_id_admin && authorization.toUpperCase().startsWith('BEARER'):
                        case scope=='APP_ACCESS' && serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_IAM', 'ENABLE_USER_LOGIN'))==1 && authorization.toUpperCase().startsWith('BEARER'):{
                            //authenticate access token
                            const access_token = authorization?.split(' ')[1] ?? '';
                            /**@type{{app_id:number, id:number, name:string, ip:string, scope:string, exp:number, iat:number, tokentimestamp:number}|*} */
                            const access_token_decoded = jwt.verify(access_token, scope=='ADMIN'?
                                                                                    fileModelConfig.get('CONFIG_SERVER','SERVICE_IAM', 'ADMIN_TOKEN_SECRET') ?? '':
                                                                                    fileModelAppSecret.get({app_id:app_id_host, resource_id:app_id_host, res:res})[0].common_app_access_secret ?? '');
                            /**@type{server_db_file_iam_user_login[]}*/
                            if (access_token_decoded.app_id == app_id_host && 
                                access_token_decoded.scope == 'USER' && 
                                access_token_decoded.ip == ip &&
                                access_token_decoded.id == iamUtilDecode(iam).get('iam_user_id')){
                                /**@type{server_db_file_iam_user_login}*/
                                const iam_user_login = fileModelIamUserLogin.get(app_id_host, null)
                                                        .filter((/**@type{server_db_file_iam_user_login}*/row)=>
                                                                                                row.iam_user_id == access_token_decoded.id && 
                                                                                                row.app_id      == app_id_host &&
                                                                                                row.user        == access_token_decoded.name && 
                                                                                                row.res         == 1 &&
                                                                                                row.ip          == ip &&
                                                                                                row.token       == access_token
                                                                                            )[0];
                                if (iam_user_login)
                                    next();
                                else
                                    iamUtilResponseNotAuthorized(res, 401, 'iamAuthenticateUserCommon');
                            }
                            else
                                iamUtilResponseNotAuthorized(res, 401, 'iamAuthenticateUserCommon');
                            break;
                        }
                        case scope=='APP_ID_REGISTRATION' && serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_IAM', 'ENABLE_USER_REGISTRATION'))==1 && app_id_host!= app_id_admin && authorization.toUpperCase().startsWith('BEARER'):{
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
 * @description IAM external authenticate
 * @function
 * @param {'APP_EXTERNAL'} endpoint 
 * @param {string} host 
 * @param {string} user_agent 
 * @param {string} accept_language 
 * @param {string} ip 
 * @param {*} body
 * @param {server_server_res} res
 * @param {function} next
 * @returns {void}
 */
const iamAuthenticateExternal = (endpoint, host, user_agent, accept_language, ip, body, res, next) => {
    //add host, user_agent, accept_language and ip validation if needed
    if (endpoint =='APP_EXTERNAL' && ('id' in body) && ('message' in body))
        next();
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
     *  if ip is blocked return 403
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
                                                    {});
            //check if IP is blocked
            if (fileModelIamControlObserve.get( app_id, 
                                                null, 
                                                /**@ts-ignore */
                                                {}).filter(row=>row.ip==ip_v4 && row.app_id == data_app_id && row.status==1).length>0)
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
                            lat:null, 
                            lng:null, 
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
                                                                type:'HOST'}, 
                                                            /**@ts-ignore*/
                                                            {});
                    fail ++;
                    fail_block = true;
                }
                if (app_id == null){
                    await fileModelIamControlObserve.post(calling_app_id, 
                        {   ...record,
                            status:0, 
                            type:'SUBDOMAIN'}, 
                        /**@ts-ignore*/
                        {});
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
                            path.startsWith('/bff/app/v1/app-module') ||
                            path.startsWith('/bff/app_id/v1') ||
                            path.startsWith('/bff/app_id_signup/v1') ||
                            path.startsWith('/bff/app_access/v1') ||
                            path.startsWith('/bff/app_external/v1/app-module-function') ||
                            path.startsWith('/bff/admin/v1') ||
                            path.startsWith('/bff/socket/v1') ||
                            path.startsWith('/bff/iam_admin/v1') ||
                            path.startsWith('/bff/iam_user/v1') ||
                            path.startsWith('/bff/iam_provider/v1') ||
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
                            type:'ROUTE'}, 
                        /**@ts-ignore*/
                        {});
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
                                                                type:'HOST_IP'}, 
                                                            /**@ts-ignore*/
                                                            {});
                    fail ++;
                }
                //check if user-agent is blocked
                if(fileModelIamControlUserAgent.get(null, null, null).filter(row=>row.user_agent== user_agent).length>0){
                    //stop always
                    fail_block = true;
                    await fileModelIamControlObserve.post(calling_app_id, 
                        {   ...record,
                            status:1, 
                            type:'USER_AGENT'}, 
                        /**@ts-ignore*/
                        {});
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
                            type:'URI_DECODE'}, 
                        /**@ts-ignore*/
                        {});
                    fail ++;
                }
                //check method
                if (['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].filter(allowed=>allowed==method).length==0){
                    //stop always
                    fail_block = true;
                    await fileModelIamControlObserve.post(calling_app_id, 
                        {   ...record,
                            status:0, 
                            type:'METHOD'}, 
                        /**@ts-ignore*/
                        {});
                    fail ++;
                }
                if (fail>0){
                    if (fail_block ||
                        //check how many observation exists for given app_id or records with unknown app_id
                        fileModelIamControlObserve.get(calling_app_id, 
                                                        null, 
                                                        /**@ts-ignore */
                                                        {}).filter(row=>row.ip==ip_v4 && row.app_id == app_id).length>		
                        fileModelConfig.get('CONFIG_SERVER', 'SERVICE_IAM', 'AUTHENTICATE_REQUEST_OBSERVE_LIMIT')){
                        await fileModelIamControlObserve.post(calling_app_id,
                                                            {   ...record,
                                                                status:1, 
                                                                type:'BLOCK_IP'}, 
                                                            /**@ts-ignore*/
                                                            {});
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
        const CLIENT_ID = app_secret.common_client_id;
        const CLIENT_SECRET = app_secret.common_client_secret;
        const userpass = Buffer.from((authorization || '').split(' ')[1] || '', 'base64').toString();
        if (userpass == CLIENT_ID + ':' + CLIENT_SECRET)
            return true;
        else
            return false;
    }    
};
/**
 * @name iamAuthenticateResource
 * @description Authenticate resource
 * @function
 * @param { {app_id:number|null,
 *           ip:string,
 *           authorization:string,
 *           resource_id:string|number|null,
 *           scope: 'USER'|'APP',
 *           claim_key:string}} parameters
 * @returns {boolean}
 */
const iamAuthenticateResource = parameters =>  {
    //authenticate access token
    try {
        if (parameters.app_id == null)
            return false;
        else{
            /**@type{{app_id:number, id:number|null, name:string, ip:string, scope:string, exp:number, iat:number, tokentimestamp:number}|*} */
            const access_token_decoded = jwt.verify(parameters.authorization.split(' ')[1], fileModelAppSecret.get({app_id:parameters.app_id, resource_id:parameters.app_id, res:null})[0].common_app_access_secret);
            return  parameters.resource_id!=null && 
                    access_token_decoded[parameters.claim_key] == parameters.resource_id &&
                    access_token_decoded.app_id == parameters.app_id &&
                    access_token_decoded.scope == parameters.scope &&
                    access_token_decoded.ip == parameters.ip;
        }
    } catch (error) {
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
    const jwt_data = iamAuthorizeToken(app_id, 'APP_ID', { id: null, 
                                                        ip:ip ?? '', 
                                                        name:'', 
                                                        scope:scope});

    /**@type{server_db_file_iam_app_token_insert} */
    const file_content = {	app_id:     app_id,
                            res:		1,
                            token:   	jwt_data.token,
                            ip:         ip ?? '',
                            ua:         null,
                            long:       null,
                            lat:        null};
    return await fileModelIamAppToken.post(app_id, file_content).then(()=>jwt_data.token);
 };
/**
 * @name iamAuthorizeToken
 * @description Authorize token
 * @function
 * @param {number} app_id
 * @param {'APP_ID'|'APP_ACCESS'|'ADMIN'|'APP_CUSTOM'} endpoint
 * @param {{id:number|string|null, 
 *          name:string, 
 *          ip:string, 
 *          scope:server_iam_access_token_claim_scope_type}} claim
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
            secret = fileModelAppSecret.get({app_id:app_id, resource_id:app_id, res:null})[0].common_app_id_secret;
            expiresin = fileModelAppSecret.get({app_id:app_id, resource_id:app_id, res:null})[0].common_app_id_expire;
            break;
        }
        //USER Access token
        case 'APP_ACCESS':{
            secret = fileModelAppSecret.get({app_id:app_id, resource_id:app_id, res:null})[0].common_app_access_secret;
            expiresin = fileModelAppSecret.get({app_id:app_id, resource_id:app_id, res:null})[0].common_app_access_expire;
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
            secret = fileModelAppSecret.get({app_id:app_id, resource_id:app_id, res:null})[0].common_app_id_secret;
            expiresin = app_custom_expire ?? '';
            break;
        }
    }
    /**@type{server_iam_access_token_claim_type} */
    const access_token_claim = {app_id:         app_id,
                                id:             claim.id,
                                name:           claim.name,
                                ip:             claim.ip,
                                scope:          claim.scope,
                                tokentimestamp: Date.now()};
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
 * @name iamUserLoginGet
 * @description Get user login records
 * @function
 * @memberof REST_API
 * @param {{app_id:Number,
 *          data:{  data_user_account_id?:string|null,
 *                  data_app_id?:string|null}}} parameters
 * @returns {server_db_file_iam_user_login[]}
 */
const iamUserLoginGet = parameters => {const rows = fileModelIamUserLogin.get(parameters.app_id, null)
                                                                .filter((/**@type{server_db_file_iam_user_login}*/row)=>
                                                                    row.iam_user_id==serverUtilNumberValue(parameters.data.data_user_account_id) &&  
                                                                    row.app_id==(serverUtilNumberValue(parameters.data.data_app_id==''?null:parameters.data.data_app_id) ?? row.app_id));
                                                    
                                                    return rows.length>0?rows.sort(( /**@type{server_db_file_iam_user_login}*/a,
                                                        /**@type{server_db_file_iam_user_login}*/b)=> 
                                                            //sort descending on created
                                                            a.created.localeCompare(b.created)==1?-1:1):[];
                                                };
/**
 * @name iamUserCreate
 * @description User create
 * @function
 * @param {number} app_id
 * @param {server_db_file_iam_user_new} data
 * @param {server_server_res} res
 * @returns {Promise.<{id:number}>}
 */
const iamUserCreate = async (app_id, data, res) => {

    /**@type{import('./db/fileModelIamUser.js')} */
    const fileModelIamUser = await import(`file://${process.cwd()}/server/db/fileModelIamUser.js`);
    
    return fileModelIamUser.post(app_id, {
                                    username:data.username, 
                                    password:data.password, 
                                    type: data.type, 
                                    bio:data.bio, 
                                    private:data.private, 
                                    email:data.email, 
                                    email_unverified:data.email_unverified, 
                                    avatar:data.avatar,
                                    user_level:null, 
                                    verification_code: null, 
                                    status:null
                                }, res);
};
/**
 * @name iamUserGet
 * @description User get
 * @function
 * @memberof REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          res:server_server_res}} parameters
 * @returns {Promise.<server_db_file_iam_user_get>}
 */
const iamUserGet = async parameters =>{
    /**@type{import('./db/fileModelIamUser.js')} */
    const fileModelIamUser = await import(`file://${process.cwd()}/server/db/fileModelIamUser.js`);
    /**@type{server_db_file_iam_user_get}*/
    const user = fileModelIamUser.get(parameters.app_id, parameters.resource_id, parameters.res).map((/**@type{server_db_file_iam_user} */row)=>{return { id: row.id,
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
        modified: row.modified};})[0];
    if (user)
        //add last login time
        return {...user, ...{last_logintime:iamUserGetLastLogin(parameters.app_id, parameters.resource_id)}};
    else{
        parameters.res.statusCode = 404;
        throw iamUtilMesssageNotAuthorized();    
    }
};
/**
 * @name iamUserGetLastLogin
 * @description User get last login in current app
 * @function
 * @param {number} app_id
 * @param {number} id
 * @returns {string|null}
 */
const iamUserGetLastLogin = (app_id, id) =>fileModelIamUserLogin.get(app_id, null)
                                                .filter((/**@type{server_db_file_iam_user_login}*/row)=>
                                                    row.iam_user_id==id &&  row.app_id==app_id && row.res==1)
                                                .sort((/**@type{server_db_file_iam_user_login}*/a,
                                                        /**@type{server_db_file_iam_user_login}*/b)=>a.created < b.created?1:-1)[0]?.created;

/**
 * @name iamUserUpdate
 * @description User update
 * @function
 * @memberof REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          data:server_db_file_iam_user_update,
 *          res:server_server_res}} parameters
 * @returns {Promise.<void>}
 */
const iamUserUpdate = async parameters =>{
    
    /**@type{import('./db/fileModelIamUser.js')} */
    const fileModelIamUser = await import(`file://${process.cwd()}/server/db/fileModelIamUser.js`);
    
    fileModelIamUser.update(parameters.app_id, parameters.resource_id, {username:parameters.data.username, 
                                        //save encrypted password
                                        password:parameters.data.password, 
                                        password_new:parameters.data.password_new, 
                                        bio:parameters.data.bio, 
                                        private:parameters.data.private, 
                                        email:parameters.data.email, 
                                        email_unverified:parameters.data.email_unverified, 
                                        avatar:parameters.data.avatar}, parameters.res);

    
};

/**
 * @name iamUserLogout
 * @description User logout
 * @function
 * @memberof REST_API
 * @param {{app_id:number,
 *          authorization:string,
 *          ip:string,
 *          user_agent:string,
 *          accept_language:string,
 *          res:server_server_res}} parameters
 * @returns {Promise.<void>}
 */

const iamUserLogout = async parameters =>{
    /**@type{import('./socket.js')} */
    const {socketConnectedUpdate} = await import(`file://${process.cwd()}/server/socket.js`);

        //set token expired after user is logged out in app
    await iamUtilTokenExpiredSet(parameters.app_id, parameters.authorization, parameters.ip, parameters.res);
    
    //remove token from connected list
    socketConnectedUpdate(parameters.app_id, 
        {   iam:parameters.res.req.query.iam,
            user_account_id:null,
            iam_user_id:null,
            iam_user_username:null,
            iam_user_type:null,
            token_access:null,
            token_admin:null,
            ip:parameters.ip,
            headers_user_agent:parameters.user_agent,
            headers_accept_language:parameters.accept_language,
            res: parameters.res});
            
};

export{ iamUtilMesssageNotAuthorized,
        iamUtilDecode,
        iamUtilTokenExpired,
        iamUtilResponseNotAuthorized,
        iamAuthenticateAdmin,
        iamAuthenticateUser,
        iamAuthenticateUserProvider,
        iamAuthenticateUserSignup,
        iamAuthenticateUserActivate,
        iamAuthenticateUserForgot,
        iamAuthenticateUserUpdate,
        iamAuthenticateUserUpdatePassword,
        iamAuthenticateUserDelete,
        iamAuthenticateSocket,
        iamAuthenticateUserCommon,
        iamAuthenticateExternal,
        iamAuthenticateRequest,
        iamAuthenticateApp,
        iamAuthenticateResource,
        iamAuthorizeIdToken,
        iamAuthorizeToken,
        iamUserLoginGet,
        iamUserCreate,
        iamUserGet,
        iamUserGetLastLogin,
        iamUserUpdate,
        iamUserLogout}; 