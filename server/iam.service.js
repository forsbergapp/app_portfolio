/** @module server/iam/service */

/**
 * @import {server_iam_authenticate_request, server_iam_app_token, server_iam_user_login,
 *          server_iam_access_token_claim_type,server_iam_access_token_claim_scope_type,
 *          server_config_iam_blockip,server_config_iam_useragent,
 *          server_db_file_iam_user_update,server_db_file_iam_user_get,server_server_error, server_db_file_iam_user, server_db_file_iam_user_new, 
 *          server_server_res} from './types.js'
*/

/**@type{import('./server.js')} */
const {serverResponseErrorSend, serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
/**@type{import('./db/fileModelConfig.js')} */
const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);

/**@type{import('../apps/common/src/common.js')} */
const {commonAppHost}= await import(`file://${process.cwd()}/apps/common/src/common.js`);

/**@type{import('./db/fileModelAppSecret.js')} */
const fileModelAppSecret = await import(`file://${process.cwd()}/server/db/fileModelAppSecret.js`);

/**@type{import('./db/fileModelIamUser.js')} */
const fileModelIamUser = await import(`file://${process.cwd()}/server/db/fileModelIamUser.js`);

/**@type{import('./db/fileModelIamUserLogin.js')} */
const fileModelIamUserLogin = await import(`file://${process.cwd()}/server/db/fileModelIamUserLogin.js`);

/**@type{import('./db/fileModelIamAppToken.js')} */
const fileModelIamAppToken = await import(`file://${process.cwd()}/server/db/fileModelIamAppToken.js`);

const {default:jwt} = await import('jsonwebtoken');

/**
 * IAM util decode base64 in query
 * @function
 * @param {string} query 
 * @returns {URLSearchParams}
 */
 const iamUtilDecode = query =>{
    return new URLSearchParams(atob(query));
};
/**
 * IAM util token expired
 * @function
 * @param {number|null}  app_id
 * @param {'APP_ACCESS'|'APP_DATA'|'ADMIN'} token_type 
 * @param {string} token 
 * @returns {boolean}
 */
const iamUtilTokenExpired = (app_id, token_type, token) =>{
    switch (token_type){
        case 'APP_ACCESS':{
            //exp, iat, tokentimestamp on token
            try {
                /**@ts-ignore*/
                return ((jwt.verify(token, fileModelAppSecret.get(app_id, null).common_app_access_secret).exp ?? 0) * 1000) - Date.now()<0;    
            } catch (error) {
                return true;
            }
            
        }
        case 'ADMIN':{
            //exp, iat, tokentimestamp on token
            try {
                /**@ts-ignore*/
                return ((jwt.verify(token, fileModelConfig.get('SERVICE_IAM', 'ADMIN_TOKEN_SECRET')).exp ?? 0) * 1000) - Date.now()<0;    
            } catch (error) {
                return true;
            }
        }
        default:
            return false;
    }
};
/**
 * IAM util response not authorized
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
        return '⛔';
    }
    else
        return serverResponseErrorSend(res, status, null, '⛔', null, reason);
};

/**
 * Generate random verification code between 100000 and 999999
 * @returns {string}
 */
const iamUtilVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * IAM Middleware authenticates admin login
 * @function
 * @param {number} app_id
 * @param {string} iam
 * @param {string} authorization
 * @param {string} ip
 * @param {string} user_agent
 * @param {string} accept_language
 * @param {server_server_res} res 
 * @returns {Promise.<{
 *                  iam_user_id:number,
 *                  iam_user_name:string,
 *                  token_at:string,
 *                  exp:number,
 *                  iat:number,
 *                  tokentimestamp:number}>}
 */
const iamAuthenticateAdmin = async (app_id, iam, authorization, ip, user_agent, accept_language, res)=>{
    /**@type{import('./socket.js')} */
    const {socketConnectedUpdate} = await import(`file://${process.cwd()}/server/socket.js`);
    /**
     * @param {1|0} result
     * @param {number} id
     * @param {string} username
     * @returns {Promise.<{
     *                  iam_user_id:number,
     *                  iam_user_name:string,
     *                  token_at:string,
     *                  exp:number,
     *                  iat:number,
     *                  tokentimestamp:number}>}
     */
    const check_user = async (result, id, username) => {       
        const jwt_data = iamAuthorizeToken(app_id, 'ADMIN', {id:id, name:username, ip:ip, scope:'USER'});
        /**@type{server_iam_user_login} */
        const file_content = {	iam_user_id:id,
                                app_id:     app_id,
                                user:		username,
                                db:         serverUtilNumberValue(fileModelConfig.get('SERVICE_DB','USE')),
                                res:		result,
                                token:      jwt_data.token,
                                ip:         ip,
                                ua:         null,
                                long:       null,
                                lat:        null,
                                created:    new Date().toISOString()};
        await fileModelIamUserLogin.post(app_id, file_content);
        if (result == 1){
            return await socketConnectedUpdate(app_id, 
                {   iam:iam,
                    user_account_id:null,
                    admin:username,
                    token_access:null,
                    token_admin:jwt_data.token,
                    ip:ip,
                    headers_user_agent:user_agent,
                    headers_accept_language:accept_language,
                    res: res})
            .then(()=>{
                return  {   iam_user_id: id,
                            iam_user_name:username,
                            avatar: fileModelIamUser.get(app_id, id, res)[0].avatar,
                            token_at: jwt_data.token,
                            exp:jwt_data.exp,
                            iat:jwt_data.iat,
                            tokentimestamp:jwt_data.tokentimestamp
                        };
            })
            .catch((/**@type{server_server_error}*/error)=>{throw error;});
        }
        else
            throw iamUtilResponseNotAuthorized(res, 401, 'iamAuthenticateAdmin', true);
    };
    if(authorization){       
        const userpass =  Buffer.from((authorization || '').split(' ')[1] || '', 'base64').toString();
        const username = userpass.split(':')[0];
        const password = userpass.split(':')[1];
        if (fileModelIamUser.get(app_id, null, null).length==0)
            return iamUserCreate(app_id,{
                            username:username, 
                            password:password, 
                            type: 'ADMIN', 
                            bio:null, 
                            private:1, 
                            email:'admin@localhost', 
                            email_unverified:null, 
                            avatar:null}, res)
            .then(result=>check_user(1, result.id, username));
        else{
            /**@type{import('./security.js')} */
            const {securityPasswordCompare}= await import(`file://${process.cwd()}/server/security.js`);

            /**@type{server_db_file_iam_user}*/
            const user =  fileModelIamUser.get(app_id, null, null).filter((/**@type{server_db_file_iam_user}*/user)=>user.username == username)[0];

            if (user && user.username == username && user.type=='ADMIN' && await securityPasswordCompare(password, user.password) && app_id == serverUtilNumberValue(fileModelConfig.get('SERVER','APP_COMMON_APP_ID')))
                return check_user(1, user.id, username); 
            else
                return check_user(0, user.id, username);
        }
    }
    else{
        throw iamUtilResponseNotAuthorized(res, 401, 'iamAuthenticateAdmin', true);
    }
    
};

/**
 * 
 * @param {number} app_id
 * @param {string} iam
 * @param {string} ip
 * @param {string} user_agent
 * @param {string} accept_language
 * @param {*} data
 * @param {import('./types.js').server_server_res} res
 * @return {Promise.<{
*                  accessToken:string|null,
*                  exp:number,
*                  iat:number,
*                  tokentimestamp:number,
*                  login:import('./types.js').server_db_sql_result_user_account_userLogin[]}>}
*/
const iamAuthenticateUser = async (app_id, iam, ip, user_agent, accept_language, data, res) =>{
    
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
    /**@type{import('./db/dbModelAppSetting.js')} */
    const { getDisplayData } = await import(`file://${process.cwd()}/server/db/dbModelAppSetting.js`);

    return new Promise((resolve, reject)=>{           
        /**
         * 
         * @param {number} app_id 
         */
        const login_error = async (app_id) =>{
            return getDisplayData(   app_id,
                new URLSearchParams(`data_app_id=${serverUtilNumberValue(fileModelConfig.get('SERVER', 'APP_COMMON_APP_ID'))}&setting_type=MESSAGE&value=${20300}`))
            .then(result_message=>result_message[0].display_data)
            .catch((/**@type{import('./types.js').server_server_error}*/error)=>{throw error;});
        };

       /**@type{import('./types.js').server_db_sql_parameter_user_account_userLogin} */
       const data_login =    {   username: data.username};
       userGetUsername(app_id, data_login)
       .then(result_login=>{
           /**@type{import('./types.js').server_iam_user_login} */
           const data_body = { iam_user_id: result_login[0].id,
                               app_id:      app_id,
                               user:        data.username,
                               db:          serverUtilNumberValue(fileModelConfig.get('SERVICE_DB','USE')),
                               res:         0,
                               token:       null,
                               ip:          ip,
                               ua:          user_agent,
                               long:        data.client_longitude ?? null,
                               lat:         data.client_latitude ?? null,
                               created:     new Date().toISOString()
                           };
           if (result_login[0]) {
               securityPasswordCompare(data.password, result_login[0].password).then((result_password)=>{
                   data_body.res = result_password?1:0;
                   if (result_password) {
                       const jwt_data = iamAuthorizeToken(app_id, 'APP_ACCESS', {id:result_login[0].id, name:result_login[0].username, ip:ip, scope:'USER'});
                       data_body.token = jwt_data.token;
                       fileModelIamUserLogin.post(app_id, data_body)
                       .then(()=>{
                           dbModelUserAccountApp.post(app_id, result_login[0].id)
                           .then(()=>{
                               //if user not activated then send email with new verification code
                               const new_code = iamUtilVerificationCode();
                               if (result_login[0].active == 0){
                                   updateUserVerificationCode(app_id, result_login[0].id, new_code)
                                   .then(()=>{
                                       //send email UNVERIFIED
                                       commonMailSend(  app_id, 
                                                        fileModelAppSecret.get(serverUtilNumberValue(fileModelConfig.get('SERVER', 'APP_COMMON_APP_ID'))??0, res)[0].service_mail_type_unverified, 
                                                        ip, 
                                                        user_agent,
                                                        accept_language,
                                                        result_login[0].id, 
                                                        new_code, 
                                                        result_login[0].email)
                                       .then(()=>{
                                           socketConnectedUpdate(app_id, 
                                               {   iam:iam,
                                                   user_account_id:result_login[0].id,
                                                   admin:null,
                                                   token_access:data_body.token,
                                                   token_admin:null,
                                                   ip:ip,
                                                   headers_user_agent:user_agent,
                                                   headers_accept_language:accept_language,
                                                   res: res})
                                           .then(()=>{
                                               resolve({
                                                   accessToken: data_body.token,
                                                   exp:jwt_data.exp,
                                                   iat:jwt_data.iat,
                                                   tokentimestamp:jwt_data.tokentimestamp,
                                                   login: Array(result_login[0])
                                               });
                                           })
                                           .catch((/**@type{import('./types.js').server_server_error}*/error)=>reject(error));
                                       })
                                       .catch((/**@type{import('./types.js').server_server_error}*/error)=>reject(error));
                                   });
                               }
                               else{
                                   socketConnectedUpdate(app_id, 
                                       {   iam:iam,
                                           user_account_id:result_login[0].id,
                                           admin:null,
                                           token_access:data_body.token,
                                           token_admin:null,
                                           ip:ip,
                                           headers_user_agent:user_agent,
                                           headers_accept_language:accept_language,
                                           res: res})
                                   .then(()=>{
                                       resolve({
                                           accessToken: data_body.token,
                                           exp:jwt_data.exp,
                                           iat:jwt_data.iat,
                                           tokentimestamp:jwt_data.tokentimestamp,
                                           login: Array(result_login[0])
                                       });
                                   })
                                   .catch((/**@type{import('./types.js').server_server_error}*/error)=>reject(error));
                               }
                           })
                           .catch((/**@type{import('./types.js').server_server_error}*/error)=>reject(error));
                       })
                       .catch((/**@type{import('./types.js').server_server_error}*/error)=>reject(error));
                   } else {
                       //Username or password not found
                       fileModelIamUserLogin.post(app_id, data_body)
                       .then(()=>{
                           res.statusCode = 400;
                           login_error(app_id)
                           .then((/**@type{string}*/text)=>reject(text));
                       })
                       .catch((/**@type{import('./types.js').server_server_error}*/error)=>reject(error));
                   }
               });
           } else{
               //User not found
               fileModelIamUserLogin.post(app_id, data_body)
               .then(()=>{
                   res.statusCode = 404;
                   login_error(app_id)
                   .then((/**@type{string}*/text)=>reject(text));
               })
               .catch((/**@type{import('./types.js').server_server_error}*/error)=>reject(error));
           }
       })
       .catch((/**@type{import('./types.js').server_server_error}*/error)=>reject(error));
   });
};

/**
 * 
 * @param {number} app_id 
 * @param {string} iam
 * @param {number} resource_id
 * @param {string} ip 
 * @param {string} user_agent 
 * @param {string} accept_language
 * @param {*} query 
 * @param {*} data 
 * @param {import('./types.js').server_server_res} res
 * @return {Promise.<{
*                  accessToken:string|null,
*                  exp:number,
*                  iat:number,
*                  tokentimestamp:number,
*                  items:import('./types.js').server_db_sql_result_user_account_providerSignIn[],
*                  userCreated:0|1}>}
*/
const iamAuthenticateUserProvider = async (app_id, iam, resource_id, ip, user_agent, accept_language, query, data, res) =>{
    /**@type{import('./socket.js')} */
    const {socketConnectedUpdate} = await import(`file://${process.cwd()}/server/socket.js`);
    /**@type{import('./db/common.js')} */
    const { dbCommonCheckedError } = await import(`file://${process.cwd()}/server/db/common.js`);

    /**@type{import('./db/dbModelUserAccount.js')} */
    const { userGetProvider, userUpdateProvider,userPost} = await import(`file://${process.cwd()}/server/db/dbModelUserAccount.js`);
    /**@type{import('./db/dbModelUserAccountApp.js')} */
    const dbModelUserAccountApp = await import(`file://${process.cwd()}/server/db/dbModelUserAccountApp.js`);

    return new Promise((resolve, reject)=>{
        userGetProvider(app_id, serverUtilNumberValue(data.identity_provider_id), resource_id)
        .then(result_signin=>{
            /** @type{import('./types.js').server_db_sql_parameter_user_account_create} */
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
                               identity_provider_id:   serverUtilNumberValue(data.identity_provider_id),
                               provider_id:            data.provider_id,
                               provider_first_name:    data.provider_first_name,
                               provider_last_name:     data.provider_last_name,
                               provider_image:         data.provider_image,
                               provider_image_url:     data.provider_image_url,
                               provider_email:         data.provider_email,
                               admin:                  0};
           
            if (result_signin.length > 0) {        
                
                const jwt_data_exists = iamAuthorizeToken(app_id, 'APP_ACCESS', {id:result_signin[0].id, name:result_signin[0].username, ip:ip, scope:'USER'});
                /**@type{import('./types.js').server_iam_user_login} */
                const data_login = {
                    iam_user_id:    result_signin[0].id,
                    app_id:         app_id,
                    user:           result_signin[0].username,
                    db:             serverUtilNumberValue(fileModelConfig.get('SERVICE_DB','USE')),
                    res:            1,
                    token:          jwt_data_exists.token,
                    ip:             ip,
                    ua:             user_agent,
                    long:           data.client_longitude,
                    lat:            data.client_latitude,
                    created:        new Date().toISOString()
                };
                fileModelIamUserLogin.post(app_id, data_login)
                .then(()=>{
                    userUpdateProvider(app_id, result_signin[0].id, data_user)
                    .then(()=>{
                        dbModelUserAccountApp.post(app_id, result_signin[0].id)
                        .then(()=>{
                            socketConnectedUpdate(app_id, 
                                {   iam:iam,
                                    user_account_id:result_signin[0].id,
                                    admin:null,
                                    token_access:data_login.token,
                                    token_admin:null,
                                    ip:ip,
                                    headers_user_agent:user_agent,
                                    headers_accept_language:accept_language,
                                    res: res})
                            .then(()=>{
                                resolve({
                                    accessToken: data_login.token,
                                    exp:jwt_data_exists.exp,
                                    iat:jwt_data_exists.iat,
                                    tokentimestamp:jwt_data_exists.tokentimestamp,
                                    items: result_signin,
                                    userCreated: 0
                                });
                            })
                            .catch((/**@type{import('./types.js').server_server_error}*/error)=>reject(error));
                        })
                        .catch((/**@type{import('./types.js').server_server_error}*/error)=>reject(error));
                    })
                    .catch((/**@type{import('./types.js').server_server_error}*/error)=>{
                        dbCommonCheckedError(app_id, query.get('lang_code'), error, res).then((/**@type{string}*/message)=>reject(message));
                    });    
                })
                .catch((/**@type{import('./types.js').server_server_error}*/error)=>reject(error));
            }
            else{
                //if provider user not found then create user and one user setting
                //avatar not used by providers, set default null
                data_user.avatar = data.avatar ?? null;
                data_user.provider_image = data.provider_image ?? null;
                //generate local username for provider 1
                data_user.username = `${data_user.provider_first_name}${Date.now()}`;
               
                userPost(app_id, data_user)
                .then(result_create=>{
                    const jwt_data_new = iamAuthorizeToken(app_id, 'APP_ACCESS', {id:result_create.insertId, name:data_user.username ?? '', ip:ip, scope:'USER'});
                    /**@type{import('./types.js').server_iam_user_login} */
                    const data_login = {
                        iam_user_id:result_create.insertId,
                        app_id:     app_id,
                        user:       data_user.username ?? '',
                        db:         serverUtilNumberValue(fileModelConfig.get('SERVICE_DB','USE')),
                        res:        1,
                        token:      jwt_data_new.token,
                        ip:         ip,
                        ua:         user_agent,
                        long:       data.client_longitude,
                        lat:        data.client_latitude,
                        created:    new Date().toISOString()
                    };
                    fileModelIamUserLogin.post(app_id, data_login)
                    .then(()=>{
                        dbModelUserAccountApp.post(app_id, result_create.insertId)
                        .then(()=>{
                            userGetProvider(app_id, serverUtilNumberValue(data.identity_provider_id), resource_id)
                            .then(result_signin2=>{
                                socketConnectedUpdate(app_id, 
                                   {   iam:iam,
                                       user_account_id:result_create.insertId,
                                       admin:null,
                                       token_access:data_login.token,
                                       token_admin:null,
                                       ip:ip,
                                       headers_user_agent:user_agent,
                                       headers_accept_language:accept_language,
                                       res: res})
                                .then(()=>{
                                    resolve({
                                       accessToken: data_login.token,
                                       exp:jwt_data_new.exp,
                                       iat:jwt_data_new.iat,
                                       tokentimestamp:jwt_data_new.tokentimestamp,
                                       items: result_signin2,
                                       userCreated: 1
                                    });
                                })
                                .catch((/**@type{import('./types.js').server_server_error}*/error)=>reject(error));
                            })
                            .catch((/**@type{import('./types.js').server_server_error}*/error)=>reject(error));
                        })
                        .catch((/**@type{import('./types.js').server_server_error}*/error)=>reject(error));
                    })
                    .catch((/**@type{import('./types.js').server_server_error}*/error)=>reject(error));
                })
                .catch((/**@type{import('./types.js').server_server_error}*/error)=>reject(error));
            }
        })
        .catch((/**@type{import('./types.js').server_server_error}*/error)=>reject(error));
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {string} ip 
 * @param {string} user_agent
 * @param {string} accept_language
 * @param {*} query 
 * @param {*} data 
 * @param {import('./types.js').server_server_res} res 
 * @return {Promise.<{
*              accessToken:string|null,
*              exp:number,
*              iat:number,
*              tokentimestamp:number,
*              id:number,
*              data:import('./types.js').server_db_sql_result_user_account_create}>}
*/
const iamAuthenticateUserSignup = async (app_id, ip, user_agent, accept_language, query, data, res) =>{
    /**@type{import('../apps/common/src/common.js')} */
    const {commonMailSend} = await import(`file://${process.cwd()}/apps/common/src/common.js`);

    /**@type{import('./db/common.js')} */
    const { dbCommonCheckedError } = await import(`file://${process.cwd()}/server/db/common.js`);

    /**@type{import('./db/dbModelUserAccount.js')} */
    const { userPost} = await import(`file://${process.cwd()}/server/db/dbModelUserAccount.js`);

    return new Promise((resolve, reject)=>{
       /**@type{import('./types.js').server_db_sql_parameter_user_account_create} */
       const data_body = { bio:                    data.bio,
                           private:                data.private,
                           user_level:             data.user_level,
                           username:               data.username,
                           password:               null,
                           password_new:           data.password,
                           password_reminder:      data.password_reminder,
                           email:                  data.email,
                           email_unverified:       null,
                           avatar:                 data.avatar,
                           verification_code:      data.provider_id?null:iamUtilVerificationCode(),
                           active:                 serverUtilNumberValue(data.active) ?? 0,
                           identity_provider_id:   serverUtilNumberValue(data.identity_provider_id),
                           provider_id:            data.provider_id ?? null,
                           provider_first_name:    data.provider_first_name,
                           provider_last_name:     data.provider_last_name,
                           provider_image:         data.provider_image,
                           provider_image_url:     data.provider_image_url,
                           provider_email:         data.provider_email,
                           admin:                  0
                       };
        userPost(app_id, data_body)
        .then(result_create=>{
            if (data.provider_id == null ) {
                //send email for local users only
                //send email SIGNUP
                commonMailSend( app_id, 
                                fileModelAppSecret.get(serverUtilNumberValue(fileModelConfig.get('SERVER', 'APP_COMMON_APP_ID'))??0, res)[0].service_mail_type_signup, 
                                ip, 
                                user_agent,
                                accept_language,
                                result_create.insertId, 
                                data_body.verification_code, 
                                data_body.email ?? '')
                .then(()=>{
                    const jwt_data = iamAuthorizeToken(app_id, 'APP_ACCESS', {id:result_create.insertId, name:data.username, ip:ip, scope:'USER'});
                    resolve({
                       accessToken: jwt_data.token,
                       exp:jwt_data.exp,
                       iat:jwt_data.iat,
                       tokentimestamp:jwt_data.tokentimestamp,
                       id: result_create.insertId,
                       data: result_create
                    });
                })
                .catch((/**@type{import('./types.js').server_server_error}*/error)=>reject(error));
            }
            else{
                const jwt_data = iamAuthorizeToken(app_id, 'APP_ACCESS', {id:result_create.insertId, name:data.username, ip:ip, scope:'USER'});
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
        .catch((/**@type{import('./types.js').server_server_error}*/error)=>{
            dbCommonCheckedError(app_id, query.get('lang_code'), error, res).then((/**@type{string}*/message)=>reject(message));
        });
    });
};

/**
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {string} ip 
 * @param {string} user_agent 
 * @param {string} accept_language 
 * @param {string} host 
 * @param {*} query 
 * @param {*} data 
 * @param {import('./types.js').server_server_res} res
 * @return {Promise.<{
*              count: number,
*              auth: string|null,
*              accessToken: string|null,
*              exp:number|null,
*              iat:number|null,
*              tokentimestamp:number|null,
*              items: import('./types.js').server_db_sql_result_user_account_activateUser[]}>}
*/
const iamAuthenticateUserActivate = async (app_id, resource_id, ip, user_agent, accept_language, host, query, data, res) =>{
    /**@type{import('./db/common.js')} */
    const { dbCommonCheckedError } = await import(`file://${process.cwd()}/server/db/common.js`);

    /**@type{import('./db/dbModelUserAccount.js')} */
    const { userUpdateActivate} = await import(`file://${process.cwd()}/server/db/dbModelUserAccount.js`);
    /**@type{import('./db/dbModelUserAccountEvent.js')} */
    const dbModelUserAccountEvent = await import(`file://${process.cwd()}/server/db/dbModelUserAccountEvent.js`);
    return new Promise((resolve, reject)=>{
        /**@type{string|null} */
        let auth_password_new = null;
        if (serverUtilNumberValue(data.verification_type) == 3){
            //reset password
            auth_password_new = iamUtilVerificationCode();
        }
        userUpdateActivate(app_id, resource_id, serverUtilNumberValue(data.verification_type), data.verification_code, auth_password_new)
        .then(result_activate=>{
            if (auth_password_new == null){
                if (result_activate.affectedRows==1 && serverUtilNumberValue(data.verification_type)==4){
                    //new email verified
                    /**@type{import('./types.js').server_db_sql_parameter_user_account_event_insertUserEvent}*/
                    const eventData = {
                        user_account_id: resource_id,
                        event: 'EMAIL_VERIFIED_CHANGE_EMAIL',
                        event_status: 'SUCCESSFUL',
                        user_language: data.user_language,
                        user_timezone: data.user_timezone,
                        user_number_system: data.user_number_system,
                        user_platform: data.user_platform,
                        server_remote_addr : ip,
                        server_user_agent : user_agent,
                        server_http_host : host,
                        server_http_accept_language : accept_language,
                        client_latitude : data.client_latitude,
                        client_longitude : data.client_longitude
                    };
                    dbModelUserAccountEvent.post(app_id, eventData)
                    .then(result_insert=>{
                        resolve({
                           count: result_insert.affectedRows,
                           auth: null,
                           accessToken: null,
                           exp:null,
                           iat:null,
                           tokentimestamp:null,
                           items: Array(result_insert)
                        });
                    })
                    .catch((/**@type{import('./types.js').server_server_error}*/error)=>reject(error));
                }
                else
                    resolve({
                       count: result_activate.affectedRows,
                       auth: null,
                       accessToken: null,
                       exp:null,
                       iat:null,
                       tokentimestamp:null,
                       items: Array(result_activate)
                    });
            }
            else{
                const jwt_data = iamAuthorizeToken(app_id, 'APP_ACCESS', {id:resource_id, name:'', ip:ip, scope:'USER'});
                //return accessToken since PASSWORD_RESET is in progress
                //email was verified and activated with id token, but now the password will be updated
                //using accessToken and authentication code
                /**@type{import('./types.js').server_iam_user_login} */
                const data_body = { 
                    iam_user_id:resource_id,
                    app_id:     app_id,
                    user:       '',
                    db:         serverUtilNumberValue(fileModelConfig.get('SERVICE_DB','USE')),
                    res:        1,
                    token:      jwt_data.token,
                    ip:         ip,
                    ua:         user_agent,
                    long:       data.client_longitude ?? null,
                    lat:        data.client_latitude ?? null,
                    created:    new Date().toISOString()};
                fileModelIamUserLogin.post(app_id, data_body)
                .then(()=>{
                    resolve({
                       count: result_activate.affectedRows,
                       auth: auth_password_new,
                       accessToken: data_body.token,
                       exp:jwt_data.exp,
                       iat:jwt_data.iat,
                       tokentimestamp:jwt_data.tokentimestamp,
                       items: Array(result_activate)
                    });
                })
                .catch((/**@type{import('./types.js').server_server_error}*/error)=>reject(error));
            }
        })
        .catch((/**@type{import('./types.js').server_server_error}*/error)=>{
            dbCommonCheckedError(app_id, query.get('lang_code'), error, res).then((/**@type{string}*/message)=>reject(message));
        });
    });
};

/**
 * 
 * @param {number} app_id 
 * @param {string} ip 
 * @param {string} user_agent 
 * @param {string} accept_language 
 * @param {*} host 
 * @param {*} data 
 * @returns {Promise.<{sent: number,id?: number}>}
 */
const iamAuthenticateUserForgot = async (app_id, ip, user_agent, accept_language, host, data) =>{

    /**@type{import('../apps/common/src/common.js')} */
    const {commonMailSend} = await import(`file://${process.cwd()}/apps/common/src/common.js`);

    /**@type{import('./db/dbModelUserAccountEvent.js')} */
    const dbModelUserAccountEvent = await import(`file://${process.cwd()}/server/db/dbModelUserAccountEvent.js`);

    /**@type{import('./db/dbModelUserAccount.js')} */
    const { userGetEmail, updateUserVerificationCode} = await import(`file://${process.cwd()}/server/db/dbModelUserAccount.js`);

    return new Promise((resolve, reject)=>{
        const email = data.email ?? '';
        if (email !='')
            userGetEmail(app_id, email)
            .then(result_emailuser=>{
                if (result_emailuser[0]){
                    dbModelUserAccountEvent.getLastUserEvent(app_id, serverUtilNumberValue(result_emailuser[0].id), 'PASSWORD_RESET')
                    .then(result_user_event=>{
                        if (result_user_event[0] &&
                            result_user_event[0].status_name == 'INPROGRESS' &&
                            (+ new Date(result_user_event[0].current_timestamp) - + new Date(result_user_event[0].date_created))/ (1000 * 60 * 60 * 24) < 1)
                            resolve({sent: 0});
                        else{
                            /**@type{import('./types.js').server_db_sql_parameter_user_account_event_insertUserEvent}*/
                            const eventData = {
                                                user_account_id: result_emailuser[0].id,
                                                event: 'PASSWORD_RESET',
                                                event_status: 'INPROGRESS',
                                                user_language: data.user_language,
                                                user_timezone: data.user_timezone,
                                                user_number_system: data.user_number_system,
                                                user_platform: data.user_platform,
                                                server_remote_addr : ip,
                                                server_user_agent : user_agent,
                                                server_http_host : host,
                                                server_http_accept_language : accept_language,
                                                client_latitude : data.client_latitude,
                                                client_longitude : data.client_longitude
                                            };
                            dbModelUserAccountEvent.post(app_id, eventData)
                            .then(()=>{
                                const new_code = iamUtilVerificationCode();
                                updateUserVerificationCode(app_id, result_emailuser[0].id, new_code)
                                .then(()=>{
                                    //send email PASSWORD_RESET
                                    commonMailSend( app_id, 
                                                    fileModelAppSecret.get(serverUtilNumberValue(fileModelConfig.get('SERVER', 'APP_COMMON_APP_ID'))??0, null)[0].service_mail_type_password_reset, 
                                                    ip, 
                                                    user_agent,
                                                    accept_language,
                                                    result_emailuser[0].id, 
                                                    new_code, 
                                                    email)
                                    .then(()=>{
                                        resolve({
                                            sent: 1,
                                            id: result_emailuser[0].id
                                        });  
                                    })
                                    .catch((/**@type{import('./types.js').server_server_error}*/error)=>reject(error));
                                })
                                .catch((/**@type{import('./types.js').server_server_error}*/error)=>reject(error));
                            })
                            .catch(()=> {
                                resolve({sent: 0});
                            });
                        }
                    })
                    .catch((/**@type{import('./types.js').server_server_error}*/error)=>reject(error));         
                }
                else
                    resolve({sent: 0});
            })
            .catch((/**@type{import('./types.js').server_server_error}*/error)=>reject(error));
        else
            resolve({sent: 0});
    });
};

/**
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {string} ip
 * @param {string} user_agent
 * @param {string} host
 * @param {string} accept_language
 * @param {*} query 
 * @param {*} data 
 * @param {import('./types.js').server_server_res} res 
 * @returns {Promise.<{sent_change_email: number}>}
 */
const iamAuthenticateUserUpdate = async (app_id, resource_id, ip, user_agent, host, accept_language, query, data, res) => {

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

    /**@type{import('./db/dbModelAppSetting.js')} */
    const { getDisplayData } = await import(`file://${process.cwd()}/server/db/dbModelAppSetting.js`);

    const result_user = await getUserByUserId(app_id, resource_id, query, res);
    
    /**@type{import('./types.js').server_db_sql_result_user_account_event_getLastUserEvent[]}*/
    const result_user_event = await dbModelUserAccountEvent.getLastUserEvent(app_id, resource_id, 'EMAIL_VERIFIED_CHANGE_EMAIL');

    return new Promise((resolve, reject)=>{
        if (result_user) {
            securityPasswordCompare(data.password, result_user.password ?? '').then((result_compare)=>{
                if (result_compare){
                    let send_email=false;
                    if (data.new_email && data.new_email!=''){
                        if ((result_user_event[0] && 
                            (+ new Date(result_user_event[0].current_timestamp) - + new Date(result_user_event[0].date_created))/ (1000 * 60 * 60 * 24) >= 1)||
                                result_user_event.length == 0)
                            send_email=true;
                    }
                    /**@type{import('./types.js').server_db_sql_parameter_user_account_updateUserLocal} */
                    const data_update = {   bio:                data.bio,
                                            private:            data.private,
                                            username:           data.username,
                                            password:           data.password,
                                            password_new:       (data.password_new && data.password_new!='')==true?data.password_new:null,
                                            password_reminder:  (data.password_reminder && data.password_reminder!='')==true?data.password_reminder:null,
                                            email:              data.email,
                                            email_unverified:   (data.new_email && data.new_email!='')==true?data.new_email:null,
                                            avatar:             data.avatar,
                                            verification_code:  send_email==true?iamUtilVerificationCode():null,
                                            provider_id:        result_user.provider_id,
                                            admin:              0
                                        };
                    userUpdateLocal(app_id, data_update, resource_id)
                    .then(result_update=>{
                        if (result_update){
                            if (send_email){
                                //no change email in progress or older than at least 1 day
                                /**@type{import('./types.js').server_db_sql_parameter_user_account_event_insertUserEvent}*/
                                const eventData = {
                                    user_account_id: resource_id,
                                    event: 'EMAIL_VERIFIED_CHANGE_EMAIL',
                                    event_status: 'INPROGRESS',
                                    user_language: data.user_language,
                                    user_timezone: data.user_timezone,
                                    user_number_system: data.user_number_system,
                                    user_platform: data.user_platform,
                                    server_remote_addr : ip,
                                    server_user_agent : user_agent,
                                    server_http_host : host,
                                    server_http_accept_language : accept_language,
                                    client_latitude : data.client_latitude,
                                    client_longitude : data.client_longitude
                                };
                                dbModelUserAccountEvent.post(app_id, eventData)
                                .then(()=>{
                                    //send email SERVICE_MAIL_TYPE_CHANGE_EMAIL
                                    commonMailSend( app_id, 
                                                    fileModelAppSecret.get(serverUtilNumberValue(fileModelConfig.get('SERVER', 'APP_COMMON_APP_ID'))??0, res)[0].service_mail_type_change_email, 
                                                    ip, 
                                                    user_agent,
                                                    accept_language,
                                                    resource_id,
                                                    data.verification_code, 
                                                    data.new_email)
                                    .then(()=>{
                                        resolve({sent_change_email: 1});
                                    })
                                    .catch((/**@type{import('./types.js').server_server_error}*/error)=>reject(error));
                                })
                                .catch((/**@type{import('./types.js').server_server_error}*/error)=>reject(error));
                            }
                            else
                                resolve({sent_change_email: 0});
                        }
                        else{
                            import(`file://${process.cwd()}/server/db/common.js`)
                            .then((/**@type{import('./db/common.js')} */{dbCommonRecordNotFound}) => {
                                dbCommonRecordNotFound(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                            });
                        }
                    })
                    .catch((/**@type{import('./types.js').server_server_error}*/error)=>{
                        dbCommonCheckedError(app_id, query.get('lang_code'), error, res).then((/**@type{string}*/message)=>reject(message));
                    });
                } 
                else {
                    res.statusCode=400;
                    res.statusMessage = 'invalid password attempt for user id:' + resource_id;
                    //invalid password
                    getDisplayData(  app_id,
                                            new URLSearchParams(`data_app_id=${serverUtilNumberValue(fileModelConfig.get('SERVER', 'APP_COMMON_APP_ID'))}&setting_type=MESSAGE&value=${20401}`))
                    .then(result_message=>{
                        reject(result_message[0].display_data);
                    })
                    .catch((/**@type{import('./types.js').server_server_error}*/error)=>reject(error));
                }
            });
        } 
        else {
            //user not found
            res.statusCode=404;
            getDisplayData(  app_id,
                                    new URLSearchParams(`data_app_id=${serverUtilNumberValue(fileModelConfig.get('SERVER', 'APP_COMMON_APP_ID'))}&setting_type=MESSAGE&value=${20305}`))
            .then(result_message=>{
                reject(result_message[0].display_data);
            })
            .catch((/**@type{import('./types.js').server_server_error}*/error)=>reject(error));
        }
    });
};

/**
 * 
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*} query
 * @param {*} data
 * @param {import('./types.js').server_server_res} res 
 * @returns {Promise.<import('./types.js').server_db_sql_result_user_account_deleteUser>}
 */
const iamAuthenticateUserDelete = async (app_id, resource_id, query, data, res) => {

    /**@type{import('./security.js')} */
    const {securityPasswordCompare}= await import(`file://${process.cwd()}/server/security.js`);
    
    /**@type{import('./db/dbModelAppSetting.js')} */
    const { getDisplayData } = await import(`file://${process.cwd()}/server/db/dbModelAppSetting.js`);

    /**@type{import('./db/dbModelUserAccount.js')} */
    const { getUserByUserId, userDelete, userGetPassword} = await import(`file://${process.cwd()}/server/db/dbModelUserAccount.js`);

    return new Promise((resolve, reject)=>{
        getUserByUserId(app_id, resource_id, query, res)
        .then(result_user=>{
            if (result_user) {
                if (result_user.provider_id !=null){
                    userDelete(app_id, resource_id)
                    .then(result_delete=>{
                        if (result_delete)
                            resolve(result_delete);
                        else{
                            import(`file://${process.cwd()}/server/db/common.js`)
                            .then((/**@type{import('./db/common.js')} */{dbCommonRecordNotFound}) => {
                                dbCommonRecordNotFound(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                            });
                        }
                    })
                    .catch((/**@type{import('./types.js').server_server_error}*/error)=>reject(error));
                }
                else{
                    userGetPassword(app_id, resource_id)
                    .then(result_password=>{
                        if (result_password[0]) {
                            securityPasswordCompare(data.password, result_password[0].password).then((result_password)=>{
                                if (result_password){
                                    userDelete(app_id, resource_id)
                                    .then(result_delete=>{
                                        if (result_delete)
                                            resolve(result_delete);
                                        else{
                                            import(`file://${process.cwd()}/server/db/common.js`)
                                            .then((/**@type{import('./db/common.js')} */{dbCommonRecordNotFound}) => {
                                                dbCommonRecordNotFound(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                                            });
                                        }
                                    })
                                    .catch((/**@type{import('./types.js').server_server_error}*/error)=>reject(error));
                                }
                                else{
                                    res.statusMessage = 'invalid password attempt for user id:' + resource_id;
                                    res.statusCode = 400;
                                    //invalid password
                                    getDisplayData(  app_id,
                                                            new URLSearchParams(`data_app_id=${serverUtilNumberValue(fileModelConfig.get('SERVER', 'APP_COMMON_APP_ID'))}&setting_type=MESSAGE&value=${20401}`))
                                    .then(result_message=>{
                                        reject(result_message[0].display_data);
                                    })
                                    .catch((/**@type{import('./types.js').server_server_error}*/error)=>reject(error));
                                } 
                            });
                            
                        }
                        else{
                            //user not found
                            res.statusCode = 404;
                            getDisplayData(  app_id,
                                                    new URLSearchParams(`data_app_id=${serverUtilNumberValue(fileModelConfig.get('SERVER', 'APP_COMMON_APP_ID'))}&setting_type=MESSAGE&value=${20305}`))
                            .then(result_message=>{
                                reject(result_message[0].display_data);
                            })
                            .catch((/**@type{import('./types.js').server_server_error}*/error)=>reject(error));
                        }
                    })
                    .catch((/**@type{import('./types.js').server_server_error}*/error)=>reject(error));
                }
            }
            else{
                //user not found
                res.statusCode = 404;
                getDisplayData(  app_id,
                                        new URLSearchParams(`data_app_id=${serverUtilNumberValue(fileModelConfig.get('SERVER', 'APP_COMMON_APP_ID'))}&setting_type=MESSAGE&value=${20305}`))
                .then(result_message=>{
                    reject(result_message[0].display_data);
                });
            }
        })
        .catch((/**@type{import('./types.js').server_server_error}*/error)=>reject(error));
    });
};

/**
 * Middleware authenticate socket used for EventSource
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
        iamAuthenticateUserCommon(iam, 'APP_DATA', iamUtilDecode(iam).get('authorization_bearer')??'', host, ip, res, next);
    }
    else
        iamUtilResponseNotAuthorized(res, 401, 'iamAuthenticateSocket');
};
/**
 * IAM Middleware authenticate IAM users
 * @function
 * @param {string} iam
 * @param {'AUTH_ADMIN'|'AUTH_USER'|'AUTH_PROVIDER'|'ADMIN'|'APP_ACCESS'|'APP_DATA'|'APP_DATA_REGISTRATION'} scope
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
        const app_id_admin = serverUtilNumberValue(fileModelConfig.get('SERVER','APP_COMMON_APP_ID'));
        // APP_DATA uses req.headers.authorization ID token except for SOCKET where ID token is in iam.authorization_bearer
        // other requests uses BASIC or BEARER access token in req.headers.authorization and ID token in iam.authorization_bearer
        const id_token = scope=='APP_DATA'?authorization?.split(' ')[1] ?? '':iamUtilDecode(iam).get('authorization_bearer')?.split(' ')[1] ?? '';
        try {
            //authenticate id token
            /**@type{{app_id:number, ip:string, scope:string, exp:number, iat:number, tokentimestamp:number}|*} */
            const id_token_decoded = jwt.verify(id_token, fileModelAppSecret.get(app_id_host, res)[0].common_app_id_secret);
            /**@type{server_iam_app_token}*/
            const log_id_token = await fileModelIamAppToken.get(app_id_host).then(result=>result.filter((/**@type{server_iam_app_token}*/row)=> 
                                                                                row.app_id == app_id_host && row.ip == ip && row.token == id_token
                                                                                )[0]);
            if (id_token_decoded.app_id == app_id_host && 
                (id_token_decoded.scope == 'APP' ||id_token_decoded.scope == 'REPORT' ||id_token_decoded.scope == 'MAINTENANCE') && 
                id_token_decoded.ip == ip &&
                log_id_token){
                if (scope=='APP_DATA')
                    next();
                else{
                    //validate scope, app_id and authorization
                    switch (true){
                        case (scope=='AUTH_ADMIN') && app_id_host== app_id_admin && authorization.toUpperCase().startsWith('BASIC'):{
                            next();
                            break;
                        }
                        case (scope=='AUTH_USER' || scope=='AUTH_PROVIDER') && app_id_host!= app_id_admin && authorization.toUpperCase().startsWith('BASIC'):{
                            if (serverUtilNumberValue(fileModelConfig.get('SERVICE_IAM', 'ENABLE_USER_LOGIN'))==1){
                                next();
                            }
                            else
                                iamUtilResponseNotAuthorized(res, 403, 'iamAuthenticateUserCommon, user login disabled');
                            break;
                        }
                        case scope=='ADMIN' && app_id_host== app_id_admin && authorization.toUpperCase().startsWith('BEARER'):{
                            //authenticate access token
                            const access_token = authorization?.split(' ')[1] ?? '';
                            /**@type{{app_id:number, id:number, name:string, ip:string, scope:string, exp:number, iat:number, tokentimestamp:number}|*} */
                            const access_token_decoded = jwt.verify(access_token, fileModelConfig.get('SERVICE_IAM', 'ADMIN_TOKEN_SECRET') ?? '');
                            /**@type{server_iam_user_login[]}*/
                            if (access_token_decoded.app_id == app_id_host && 
                                access_token_decoded.scope == 'USER' && 
                                access_token_decoded.ip == ip &&
                                access_token_decoded.id == iamUtilDecode(iam).get('iam_user_id'))
                                await fileModelIamUserLogin.get(app_id_host)
                                .then(result=>{
                                    /**@type{server_iam_user_login}*/
                                    const iam_admin_login = result.filter((/**@type{server_iam_user_login}*/row)=>
                                                                            row.iam_user_id == access_token_decoded.id && 
                                                                            row.app_id      == app_id_host &&
                                                                            row.user        == access_token_decoded.name && 
                                                                            row.res         == 1 &&
                                                                            row.ip          == ip &&
                                                                            row.token       == access_token
                                                                        )[0];
                                    if (iam_admin_login)
                                        next();
                                    else
                                    iamUtilResponseNotAuthorized(res, 401, 'iamAuthenticateUserCommon');
                                });
                            else
                                iamUtilResponseNotAuthorized(res, 401, 'iamAuthenticateUserCommon');
                            break;
                        }
                        case scope=='APP_DATA_REGISTRATION' && serverUtilNumberValue(fileModelConfig.get('SERVICE_IAM', 'ENABLE_USER_REGISTRATION'))==1 && app_id_host!= app_id_admin && authorization.toUpperCase().startsWith('BEARER'):{
                            next();
                            break;
                        }
                        case scope=='APP_ACCESS' && serverUtilNumberValue(fileModelConfig.get('SERVICE_IAM', 'ENABLE_USER_LOGIN'))==1 && authorization.toUpperCase().startsWith('BEARER'):{
                            //authenticate access token
                            const access_token = authorization?.split(' ')[1] ?? '';
                            /**@type{{app_id:number, id:number, name:string, ip:string, scope:string, exp:number, iat:number, tokentimestamp:number}|*} */
                            const access_token_decoded = jwt.verify(access_token, fileModelAppSecret.get(app_id_host, res)[0].common_app_access_secret ?? '');
                            const iam_user_id = serverUtilNumberValue(iamUtilDecode(iam).get('iam_user_id'));
                            if (access_token_decoded.app_id == app_id_host && 
                                access_token_decoded.scope == 'USER' && 
                                access_token_decoded.ip == ip &&
                                access_token_decoded.id == iam_user_id )
                                //check access token belongs to user_account.id, app_id and ip saved when logged in
                                //and if app_id=0 then check user is admin
                                await fileModelIamUserLogin.get(app_id_host)
                                .then(result=>{
                                    /**@type{server_iam_user_login}*/
                                    const iam_user_login = result.filter((/**@type{server_iam_user_login}*/row)=>
                                                                            row.iam_user_id == iam_user_id && 
                                                                            row.res         == 1 &&
                                                                            row.app_id      == app_id_host &&
                                                                            row.token       == access_token &&
                                                                            row.ip          == ip
                                                                        )[0];
                                    if (iam_user_login)
                                        next();
                                    else
                                        iamUtilResponseNotAuthorized(res, 401, 'iamAuthenticateUserCommon, no record APP_ACCESS');
                                });
                            else
                                iamUtilResponseNotAuthorized(res, 401, 'iamAuthenticateUserCommon, token claim error');
                            break;
                        }
                        default:{
                            iamUtilResponseNotAuthorized(res, 401, 'iamAuthenticateUserCommon, scope error or wrong app or wrong header authorization');
                            break;
                        }
                    }
                }
            }
            else
                iamUtilResponseNotAuthorized(res, 401, 'iamAuthenticateUserCommon, not IAM or no authorization');
        } catch (error) {
            iamUtilResponseNotAuthorized(res, 401, 'iamAuthenticateUserCommon, token error');
        }
    }
    else
        iamUtilResponseNotAuthorized(res, 401, 'iamAuthenticateUserCommon, not IAM or no authorization');
};

/**
 * IAM external authenticate
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
 * Authorize request
 * Controls if AUTHENTICATE_REQUEST_ENABLE=1 else skips all checks
 *  if ip is blocked return 403
 *  if AUTHENTICATE_REQUEST_HOST_EXIST=1 then check if host exists else return 406
 *  if AUTHENTICATE_REQUEST_ACCESS_FROM=1 then check if request accessed from domain and not from os hostname else return 406
 *  if user agent is in safe list then return ok else continue checks:
 *  if AUTHENTICATE_REQUEST_USER_AGENT_EXIST=1 then check if user agent exists else return 406
 *  if AUTHENTICATE_REQUEST_ACCEPT_LANGUAGE=1 then check if accept language exists else return 406
 *  if decodeURIComponent() no error then return null else return 400
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
 const iamAuthenticateRequest = (ip, host, method, user_agent, accept_language, path) => {
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
     * @param {string} ip_v4
     * @returns {Promise.<server_iam_authenticate_request|null>}
     */
    const block_ip_control = async (ip_v4) => {
        if (fileModelConfig.get('SERVICE_IAM', 'AUTHENTICATE_REQUEST_IP') == '1'){
            /**@type{server_config_iam_blockip} */
            const ranges = await fileModelConfig.getFile('CONFIG_IAM_BLOCKIP');
            //check if IP is blocked
            if ((ip_v4.match(/\./g)||[]).length==3){
                for (const element of ranges) {
                    if (IPtoNum(element[0]) <= IPtoNum(ip_v4) &&
                        IPtoNum(element[1]) >= IPtoNum(ip_v4)) {
                            //403 Forbidden
                            return {    statusCode: 403,
                                        statusMessage: `${IPtoNum(element[0])}-${IPtoNum(element[1])}`};
                    }
                }
            }
            return null;
        }
        else
            return null;
    };
    /**
     * Controls if user agent is safe
     * @function
     * @param {string} client_user_agent
     * @returns {Promise.<boolean>}
     */
    const safe_user_agents = async (client_user_agent) => {
        if (fileModelConfig.get('SERVICE_IAM', 'AUTHENTICATE_REQUEST_USER_AGENT') == '1'){
            /**@type{server_config_iam_useragent} */
            const {user_agents} = await fileModelConfig.getFile('CONFIG_IAM_USERAGENT');
            for (const user_agent of user_agents){
                if (user_agent.user_agent == client_user_agent)
                    return true;
            }
            return false;
        }
        else
            return false;
    };
    return new Promise((resolve)=>{
        if (fileModelConfig.get('SERVICE_IAM', 'AUTHENTICATE_REQUEST_ENABLE')=='1'){
            const ip_v4 = ip.replace('::ffff:','');
            block_ip_control(ip_v4).then((/**@type{server_iam_authenticate_request}*/result_range)=>{
                if (result_range){
                    resolve({   statusCode:result_range.statusCode,
                                statusMessage: `ip ${ip_v4} blocked, range: ${result_range.statusMessage}`});
                }
                else{
                    //check if host exists
                    if (fileModelConfig.get('SERVICE_IAM', 'AUTHENTICATE_REQUEST_HOST_EXIST')=='1' &&
                        typeof host=='undefined'){
                        //406 Not Acceptable
                        resolve({   statusCode: 406, 
                                    statusMessage: `ip ${ip_v4} blocked, no host`});
                    }
                    else{
                        //check if accessed from domain and not os hostname
                        import('node:os').then(({hostname}) =>{
                            if (fileModelConfig.get('SERVICE_IAM', 'AUTHENTICATE_REQUEST_ACCESS_FROM')=='1' &&
                                host==hostname()){
                                //406 Not Acceptable
                                resolve({   statusCode: 406, 
                                            statusMessage: `ip ${ip_v4} blocked, accessed from hostname ${host} not domain`});
                            }
                            else{
                                safe_user_agents(user_agent).then((/**@type{boolean}*/safe)=>{
                                    if (safe==true)
                                        resolve(null);
                                    else{
                                        //check if user-agent exists
                                        if(fileModelConfig.get('SERVICE_IAM', 'AUTHENTICATE_REQUEST_USER_AGENT_EXIST')=='1' &&
                                            typeof user_agent=='undefined'){
                                            //406 Not Acceptable
                                            resolve({   statusCode: 406, 
                                                        statusMessage: `ip ${ip_v4} blocked, no user-agent`});
                                        }
                                        else{
                                            //check if accept-language exists
                                            if (fileModelConfig.get('SERVICE_IAM', 'AUTHENTICATE_REQUEST_ACCEPT_LANGUAGE')=='1' &&
                                                typeof accept_language=='undefined'){
                                                //406 Not Acceptable
                                                resolve({   statusCode: 406, 
                                                            statusMessage: `ip ${ip_v4} blocked, no accept-language`});
                                            }
                                            else{
                                                //check request
                                                let err = null;
                                                try {
                                                    decodeURIComponent(path);
                                                }
                                                catch(e) {
                                                    err = e;
                                                }
                                                if (err){
                                                    resolve({   statusCode: 400, 
                                                                statusMessage: 'decodeURIComponent error'});
                                                }
                                                else{
                                                    //check method
                                                    if (['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].filter(allowed=>allowed==method).length==0)
                                                        resolve({   statusCode: 405, 
                                                                    statusMessage: 'method error'});
                                                    else    
                                                        resolve(null);
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
        else
            resolve(null);
    });
    
};

/**
 * Authenticate app in microservice
 * file must be read from file, not file cache as main server
 * since microservices run in separate processes and servers
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
 * Authenticate resource
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
            const access_token_decoded = jwt.verify(parameters.authorization.split(' ')[1], fileModelAppSecret.get(parameters.app_id, null)[0].common_app_access_secret);
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
 * Authorize id token
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

    /**@type{server_iam_app_token} */
    const file_content = {	app_id:     app_id,
                            res:		1,
                            token:   	jwt_data.token,
                            ip:         ip ?? '',
                            ua:         null,
                            long:       null,
                            lat:        null,
                            created:    new Date().toISOString()};
    return await fileModelIamAppToken.post(app_id, file_content).then(()=>jwt_data.token);
 };
/**
 * Authorize token
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
            secret = fileModelAppSecret.get(app_id, null)[0].common_app_id_secret;
            expiresin = fileModelAppSecret.get(app_id, null)[0].common_app_id_expire;
            break;
        }
        //USER Access token
        case 'APP_ACCESS':{
            secret = fileModelAppSecret.get(app_id, null)[0].common_app_access_secret;
            expiresin = fileModelAppSecret.get(app_id, null)[0].common_app_access_expire;
            break;
        }
        //Admin Access token
        case 'ADMIN':{
            secret = fileModelConfig.get('SERVICE_IAM', 'ADMIN_TOKEN_SECRET') ?? '';
            expiresin = fileModelConfig.get('SERVICE_IAM', 'ADMIN_TOKEN_EXPIRE_ACCESS') ?? '';
            break;
        }
        //APP custom token
        case 'APP_CUSTOM':{
            secret = fileModelAppSecret.get(app_id, null)[0].common_app_id_secret;
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
 * Get user login records
 * @function
 * @param {number} app_id
 * @param {*} query
 * @returns {Promise.<server_iam_user_login[]>}
 */
const iamUserLoginGet = async (app_id, query) => {const rows = await fileModelIamUserLogin.get(app_id)
                                                    .then(result=>result
                                                    .filter((/**@type{server_iam_user_login}*/row)=>
                                                        row.iam_user_id==serverUtilNumberValue(query.get('data_user_account_id')) &&  
                                                        row.app_id==(serverUtilNumberValue(query.get('data_app_id')==''?null:query.get('data_app_id')) ?? row.app_id)))
                                                    .catch(()=>
                                                        null
                                                    );
                                                return rows?rows.sort(( /**@type{server_iam_user_login}*/a,
                                                    /**@type{server_iam_user_login}*/b)=> 
                                                        //sort descending on created
                                                        a.created.localeCompare(b.created)==1?-1:1):[];
                                            };
/**
 * User create
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
 * User get
 * @function
 * @param {number} app_id
 * @param {number} id
 * @param {server_server_res} res
 * @returns {Promise.<server_db_file_iam_user_get>}
 */
const iamUserGet = async (app_id, id, res) =>{
    /**@type{import('./db/fileModelIamUser.js')} */
    const fileModelIamUser = await import(`file://${process.cwd()}/server/db/fileModelIamUser.js`);
    /**@type{server_db_file_iam_user_get}*/
    const user = fileModelIamUser.get(app_id, id, res).map((/**@type{server_db_file_iam_user} */row)=>{return { id: row.id,
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
        return {...user, ...{last_logintime:await iamUserGetLastLogin(app_id, id)}};
    else{
        res.statusCode = 404;
        throw '⛔';    
    }
};
/**
 * User get last login in current app
 * @function
 * @param {number} app_id
 * @param {number} id
 * @returns {Promise.<string|null>}
 */
const iamUserGetLastLogin = async (app_id, id) =>fileModelIamUserLogin.get(app_id)
                                                    .then(result=>result
                                                                    .filter((/**@type{server_iam_user_login}*/row)=>
                                                                        row.iam_user_id==id &&  row.app_id==app_id && row.res==1)
                                                                    .sort((/**@type{server_iam_user_login}*/a,
                                                                            /**@type{server_iam_user_login}*/b)=>a.created < b.created?1:-1)[0].created)
                                                    .catch(()=>null);

/**
 * User udpate
 * @function
 * @param {number} app_id
 * @param {number} id
 * @param {server_db_file_iam_user_update} data
 * @param {server_server_res} res
 * @returns {Promise.<void>}
 */

const iamUserUpdate = async (app_id, id, data, res) =>{
    
    /**@type{import('./db/fileModelIamUser.js')} */
    const fileModelIamUser = await import(`file://${process.cwd()}/server/db/fileModelIamUser.js`);
    
    fileModelIamUser.update(app_id, id, {username:data.username, 
                                        //save encrypted password
                                        password:data.password, 
                                        password_new:data.password_new, 
                                        bio:data.bio, 
                                        private:data.private, 
                                        email:data.email, 
                                        email_unverified:data.email_unverified, 
                                        avatar:data.avatar}, res);

    
};
export{ iamUtilDecode,
        iamUtilTokenExpired,
        iamUtilResponseNotAuthorized,
        iamAuthenticateAdmin,
        iamAuthenticateUser,
        iamAuthenticateUserProvider,
        iamAuthenticateUserSignup,
        iamAuthenticateUserActivate,
        iamAuthenticateUserForgot,
        iamAuthenticateUserUpdate,
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
        iamUserUpdate}; 