/** @module server/db/components */

/**@type{import('../sql/user_account.service.js')} */
const service = await import(`file://${process.cwd()}/server/db/sql/user_account.service.js`);

/**@type{import('../../config.service.js')} */
const { ConfigGet, ConfigGetApp } = await import(`file://${process.cwd()}/server/config.service.js`);
/**@type{import('../../server.service.js')} */
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);
/**@type{import('../../iam.service.js')} */
const { iam_decode, AuthorizeToken } = await import(`file://${process.cwd()}/server/iam.service.js`);
/**@type{import('../../socket.service.js')} */
const {ConnectedUpdate} = await import(`file://${process.cwd()}/server/socket.service.js`);

/**@type{import('../../db/common.service.js')} */
const { checked_error } = await import(`file://${process.cwd()}/server/db/common.service.js`);

/**@type{import('../sql/app_setting.service.js')} */
const { getSettingDisplayData } = await import(`file://${process.cwd()}/server/db/sql/app_setting.service.js`);
/**@type{import('../sql/user_account_app.service.js')} */
const { createUserAccountApp} = await import(`file://${process.cwd()}/server/db/sql/user_account_app.service.js`);
/**@type{import('../sql/user_account_logon.service.js')} */
const { insertUserAccountLogon, getUserAccountLogon } = await import(`file://${process.cwd()}/server/db/sql/user_account_logon.service.js`);
/**@type{import('../sql/user_account_event.service.js')} */
const { getLastUserEvent, insertUserEvent } = await import(`file://${process.cwd()}/server/db/sql/user_account_event.service.js`);
/**@type{import('../sql/user_account_follow.service.js')} */
const user_account_follow_service = await import(`file://${process.cwd()}/server/db/sql/user_account_follow.service.js`);
/**@type{import('../sql/user_account_like.service.js')} */
const user_account_like_service = await import(`file://${process.cwd()}/server/db/sql/user_account_like.service.js`);
/**@type{import('../../security.service.js')} */
const {PasswordCompare}= await import(`file://${process.cwd()}/server/security.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {string} emailtype 
 * @param {string} ip
 * @param {string} user_agent
 * @param {string} accept_language
 * @param {number} userid 
 * @param {string|null} verification_code 
 * @param {string} email 
 */
 const sendUserEmail = async (app_id, emailtype, ip, user_agent, accept_language, userid, verification_code, email) => {
    /**@type{import('../../../apps/apps.service.js')} */
    const { createMail} = await import(`file://${process.cwd()}/apps/apps.service.js`);
    /**@type{import('../../bff.service.js')} */
    const {BFF_server} = await import(`file://${process.cwd()}/server/bff.service.js`);
    
    /**@type{import('../../../types.js').email_return_data}*/
    const email_rendered = await createMail( app_id, 
                                    {
                                        emailtype:        emailtype,
                                        host:             ConfigGet('SERVER', 'HOST'),
                                        app_user_id:      userid,
                                        verificationCode: verification_code,
                                        to:               email,
                                    })
                                    .catch((/**@type{import('../../../types.js').error}*/error)=>{throw error;});
        
    /**@type{import('../../../types.js').bff_parameters}*/
    const parameters = {endpoint:'SERVER_MAIL',
                        host:null,
                        url:'/mail/sendemail',
                        route_path:'/mail/sendemail',
                        method:'POST', 
                        query:'',
                        body:email_rendered,
                        authorization:null,
                        ip:ip, 
                        user_agent:user_agent, 
                        accept_language:accept_language,
                        /**@ts-ignore */
                        res:null};
    return await BFF_server(app_id, parameters);
};
/**
 * 
 * @param {number} app_id 
 */
const login_error = async (app_id) =>{
    return getSettingDisplayData
        (   app_id,
            getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
            'MESSAGE',
            '20300')
    .then((/**@type{import('../../../types.js').db_result_app_setting_getSettingDisplayData[]}*/result_message)=>result_message[0].display_data)
    .catch((/**@type{import('../../../types.js').error}*/error)=>{throw error;});
}
/**
 * 
 * @param {number} app_id
 * @param {string} iam
 * @param {string} ip
 * @param {string} user_agent
 * @param {string} accept_language
 * @param {*} data
 * @param {import('../../../types.js').res} res
 * @return {Promise.<{
 *                  accessToken:string|null,
 *                  exp:number,
 *                  iat:number,
 *                  tokentimestamp:number,
 *                  login:import('../../../types.js').db_result_user_account_userLogin[]}>}
 */
const login = (app_id, iam, ip, user_agent, accept_language, data, res) =>{
    return new Promise((resolve, reject)=>{        
        
        /**@type{import('../../../types.js').db_parameter_user_account_userLogin} */
        const data_login =    {   username: data.username};
        service.userLogin(app_id, data_login)
        .then((/**@type{import('../../../types.js').db_result_user_account_userLogin[]}*/result_login)=>{
            const user_account_id = result_login[0]?getNumberValue(result_login[0].id):null;
            /**@type{import('../../../types.js').db_parameter_user_account_logon_insertUserAccountLogon} */
            const data_body = { result:             0,
                                client_ip:          ip,
                                client_user_agent:  user_agent,
                                client_longitude:   data.client_longitude ?? null,
                                client_latitude:    data.client_latitude ?? null,
                                access_token:       null};
            if (result_login[0]) {
                PasswordCompare(data.password, result_login[0].password).then((result_password)=>{
                    data_body.result = Number(result_password);
                    if (result_password) {
                        if ((app_id == getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')) && (result_login[0].app_role_id == 0 || result_login[0].app_role_id == 1))||
                                app_id != getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID'))){
                            const jwt_data = AuthorizeToken(app_id, {id:result_login[0].id, name:result_login[0].username, ip:ip, scope:'USER', endpoint:'APP_ACCESS'});
                            data_body.access_token = jwt_data.token;
                            insertUserAccountLogon(app_id, user_account_id, data_body)
                            .then(()=>{
                                createUserAccountApp(app_id, result_login[0].id)
                                .then(()=>{
                                    //if user not activated then send email with new verification code
                                    const new_code = service.verification_code();
                                    if (result_login[0].active == 0){
                                        service.updateUserVerificationCode(app_id, result_login[0].id, new_code)
                                        .then(()=>{
                                            //send email UNVERIFIED
                                            sendUserEmail(  app_id, 
                                                            ConfigGetApp(app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),'SECRETS').SERVICE_MAIL_TYPE_UNVERIFIED, 
                                                            ip, 
                                                            user_agent,
                                                            accept_language,
                                                            result_login[0].id, 
                                                            new_code, 
                                                            result_login[0].email)
                                            .then(()=>{
                                                ConnectedUpdate(app_id, getNumberValue(iam_decode(iam).get('client_id')), result_login[0].id, '', iam_decode(iam).get('authorization_bearer'), data_body.access_token, null, ip, user_agent, accept_language, res)
                                                .then(()=>{
                                                    resolve({
                                                        accessToken: data_body.access_token,
                                                        exp:jwt_data.exp,
                                                        iat:jwt_data.iat,
                                                        tokentimestamp:jwt_data.tokentimestamp,
                                                        login: Array(result_login[0])
                                                    });
                                                })
                                                .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
                                            })
                                            .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
                                        });
                                    }
                                    else{
                                        ConnectedUpdate(app_id, getNumberValue(iam_decode(iam).get('client_id')), result_login[0].id, '', iam_decode(iam).get('authorization_bearer'), data_body.access_token, null, ip, user_agent, accept_language, res)
                                        .then(()=>{
                                            resolve({
                                                accessToken: data_body.access_token,
                                                exp:jwt_data.exp,
                                                iat:jwt_data.iat,
                                                tokentimestamp:jwt_data.tokentimestamp,
                                                login: Array(result_login[0])
                                            });
                                        })
                                        .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
                                    }
                                })
                                .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
                            })
                            .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
                        }
                        else{
                            //Unauthorized, only admin allowed to log in to admin
                            insertUserAccountLogon(app_id, user_account_id, data_body)
                            .then(()=>{
                                res.statusCode = 401;
                                login_error(app_id)
                                .then((/**@type{string}*/text)=>reject(text));
                            });
                        }
                    } else {
                        //Username or password not found
                        insertUserAccountLogon(app_id, user_account_id, data_body)
                        .then(()=>{
                            res.statusCode = 400;
                            login_error(app_id)
                            .then((/**@type{string}*/text)=>reject(text));
                        })
                        .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
                    }
                });
            } else{
                //User not found
                insertUserAccountLogon(app_id, null, data_body)
                .then(()=>{
                    res.statusCode = 404;
                    login_error(app_id)
                    .then((/**@type{string}*/text)=>reject(text));
                })
                .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
            }
        })
        .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
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
 * @param {import('../../../types.js').res} res
 * @return {Promise.<{
 *                  accessToken:string|null,
 *                  exp:number,
 *                  iat:number,
 *                  tokentimestamp:number,
 *                  items:import('../../../types.js').db_result_user_account_providerSignIn[],
 *                  userCreated:0|1}>}
 */
const login_provider = (app_id, iam, resource_id, ip, user_agent, accept_language, query, data, res) =>{
    return new Promise((resolve, reject)=>{
        service.providerSignIn(app_id, getNumberValue(data.identity_provider_id), resource_id)
        .then((/**@type{import('../../../types.js').db_result_user_account_providerSignIn[]}*/result_signin)=>{
            /** @type{import('../../../types.js').db_parameter_user_account_create} */
            const data_user = { bio:                    null,
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
                                identity_provider_id:   getNumberValue(data.identity_provider_id),
                                provider_id:            data.provider_id,
                                provider_first_name:    data.provider_first_name,
                                provider_last_name:     data.provider_last_name,
                                provider_image:         data.provider_image,
                                provider_image_url:     data.provider_image_url,
                                provider_email:         data.provider_email,
                                admin:                  0};
            const user_account_id = result_signin[0]?result_signin[0].id:null;
            /**@type{import('../../../types.js').db_parameter_user_account_logon_insertUserAccountLogon} */
            const data_login = {result:                 0,
                                client_ip:              ip,
                                client_user_agent:      user_agent,
                                client_longitude:       data.client_longitude,
                                client_latitude:        data.client_latitude,
                                access_token:           null};
            if ((app_id == getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')) && result_signin[0] && (result_signin[0].app_role_id == 0 || result_signin[0].app_role_id == 1))||
                    app_id != getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID'))){
                if (result_signin.length > 0) {        
                    const jwt_data_exists = AuthorizeToken(app_id, {id:result_signin[0].id, name:result_signin[0].username, ip:ip, scope:'USER', endpoint:'APP_ACCESS'});
                    data_login.access_token = jwt_data_exists.token;
                    data_login.result = 1;
                    insertUserAccountLogon(app_id, user_account_id, data_login)
                    .then(()=>{
                        service.updateSigninProvider(app_id, result_signin[0].id, data_user)
                        .then(()=>{
                            createUserAccountApp(app_id, result_signin[0].id)
                            .then(()=>{
                                ConnectedUpdate(app_id, getNumberValue(iam_decode(iam).get('client_id')), result_signin[0].id, '', iam_decode(iam).get('authorization_bearer'), data_login.access_token, null, ip, user_agent, accept_language, res)
                                .then(()=>{
                                    resolve({
                                        accessToken: data_login.access_token,
                                        exp:jwt_data_exists.exp,
                                        iat:jwt_data_exists.iat,
                                        tokentimestamp:jwt_data_exists.tokentimestamp,
                                        items: result_signin,
                                        userCreated: 0
                                    });
                                })
                                .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
                            })
                            .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
                        })
                        .catch((/**@type{import('../../../types.js').error}*/error)=>{
                            checked_error(app_id, query.get('lang_code'), error, res).then((/**@type{string}*/message)=>reject(message));
                        });    
                    })
                    .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
                }
                else{
                    //if provider user not found then create user and one user setting
                    //avatar not used by providers, set default null
                    data_user.avatar = data.avatar ?? null;
                    data_user.provider_image = data.provider_image ?? null;
                    //generate local username for provider 1
                    data_user.username = `${data_user.provider_first_name}${Date.now()}`;
                    
                    service.create(app_id, data_user)
                    .then((/**@type{import('../../../types.js').db_result_user_account_create} */result_create)=>{
                        const jwt_data_new = AuthorizeToken(app_id, {id:result_create.insertId, name:data_user.username ?? '', ip:ip, scope:'USER', endpoint:'APP_ACCESS'});
                        data_login.access_token = jwt_data_new.token;
                        data_login.result = 1;
    
                        insertUserAccountLogon(app_id, result_create.insertId, data_login)
                        .then(()=>{
                            createUserAccountApp(app_id, result_create.insertId)
                            .then(()=>{
                                service.providerSignIn(app_id, getNumberValue(data.identity_provider_id), resource_id)
                                .then((/**@type{import('../../../types.js').db_result_user_account_providerSignIn[]}*/result_signin2)=>{
                                    ConnectedUpdate(app_id, getNumberValue(iam_decode(iam).get('client_id')), result_create.insertId, '', iam_decode(iam).get('authorization_bearer'), data_login.access_token, null, ip, user_agent, accept_language, res)
                                    .then(()=>{
                                        resolve({
                                            accessToken: data_login.access_token,
                                            exp:jwt_data_new.exp,
                                            iat:jwt_data_new.iat,
                                            tokentimestamp:jwt_data_new.tokentimestamp,
                                            items: result_signin2,
                                            userCreated: 1
                                        });
                                    })
                                    .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
                                })
                                .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
                            })
                            .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
                        })
                        .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
                    })
                    .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
                }
            }
            else{
                //Unauthorized, only admin allowed to log in to admin
                //if data_login.user_account_id is empty then user has not logged in before
                insertUserAccountLogon(app_id, user_account_id, data_login)
                .then(()=>{
                    res.statusCode = 401;
                    login_error(app_id)
                    .then((/**@type{string}*/text)=>reject(text));
                });
            }
        })
        .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
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
 * @param {import('../../../types.js').res} res 
 * @return {Promise.<{
 *              accessToken:string|null,
 *              exp:number,
 *              iat:number,
 *              tokentimestamp:number,
 *              id:number,
 *              data:import('../../../types.js').db_result_user_account_create}>}
 */
const signup = (app_id, ip, user_agent, accept_language, query, data, res) =>{
    return new Promise((resolve, reject)=>{
        /**@type{import('../../../types.js').db_parameter_user_account_create} */
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
                            verification_code:      data.provider_id?null:service.verification_code(),
                            active:                 getNumberValue(data.active) ?? 0,
                            identity_provider_id:   getNumberValue(data.identity_provider_id),
                            provider_id:            data.provider_id ?? null,
                            provider_first_name:    data.provider_first_name,
                            provider_last_name:     data.provider_last_name,
                            provider_image:         data.provider_image,
                            provider_image_url:     data.provider_image_url,
                            provider_email:         data.provider_email,
                            admin:                  0
                        };
        service.create(app_id, data_body)
        .then((/**@type{import('../../../types.js').db_result_user_account_create}*/result_create)=>{
            if (data.provider_id == null ) {
                //send email for local users only
                //send email SIGNUP
                sendUserEmail(  app_id, 
                                ConfigGetApp(app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),'SECRETS').SERVICE_MAIL_TYPE_SIGNUP,
                                ip, 
                                user_agent,
                                accept_language,
                                result_create.insertId, 
                                data_body.verification_code, 
                                data_body.email ?? '')
                .then(()=>{
                    const jwt_data = AuthorizeToken(app_id, {id:result_create.insertId, name:data.username, ip:ip, scope:'USER', endpoint:'APP_ACCESS'});
                    resolve({
                        accessToken: jwt_data.token,
                        exp:jwt_data.exp,
                        iat:jwt_data.iat,
                        tokentimestamp:jwt_data.tokentimestamp,
                        id: result_create.insertId,
                        data: result_create
                    });
                })
                .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
            }
            else{
                const jwt_data = AuthorizeToken(app_id, {id:result_create.insertId, name:data.username, ip:ip, scope:'USER', endpoint:'APP_ACCESS'});
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
        .catch((/**@type{import('../../../types.js').error}*/error)=>{
            checked_error(app_id, query.get('lang_code'), error, res).then((/**@type{string}*/message)=>reject(message));
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
 * @param {import('../../../types.js').res} res
 * @return {Promise.<{
 *              count: number,
 *              auth: string|null,
 *              accessToken: string|null,
 *              exp:number|null,
 *              iat:number|null,
 *              tokentimestamp:number|null,
 *              items: import('../../../types.js').db_result_user_account_activateUser[]}>}
 */
const activate = (app_id, resource_id, ip, user_agent, accept_language, host, query, data, res) =>{
    return new Promise((resolve, reject)=>{
        /**@type{string|null} */
        let auth_password_new = null;
        if (getNumberValue(data.verification_type) == 3){
            //reset password
            auth_password_new = service.verification_code();
        }
        service.activateUser(app_id, resource_id, getNumberValue(data.verification_type), data.verification_code, auth_password_new)
        .then((/**@type{import('../../../types.js').db_result_user_account_activateUser}*/result_activate)=>{
            if (auth_password_new == null){
                if (result_activate.affectedRows==1 && getNumberValue(data.verification_type)==4){
                    //new email verified
                    /**@type{import('../../../types.js').db_parameter_user_account_event_insertUserEvent}*/
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
                    insertUserEvent(app_id, eventData)
                    .then((/**@type{import('../../../types.js').db_result_user_account_event_insertUserEvent}*/result_insert)=>{
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
                    .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
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
                const jwt_data = AuthorizeToken(app_id, {id:resource_id, name:'', ip:ip, scope:'USER', endpoint:'APP_ACCESS'});
                //return accessToken since PASSWORD_RESET is in progress
                //email was verified and activated with id token, but now the password will be updated
                //using accessToken and authentication code
                /**@type{import('../../../types.js').db_parameter_user_account_logon_insertUserAccountLogon} */
                const data_body = { 
                    result:             1,
                    client_ip:          ip,
                    client_user_agent:  user_agent,
                    client_longitude:   data.client_longitude ?? null,
                    client_latitude:    data.client_latitude ?? null,
                    access_token:       jwt_data.token};
                insertUserAccountLogon(app_id, resource_id, data_body)
                .then(()=>{
                    resolve({
                        count: result_activate.affectedRows,
                        auth: auth_password_new,
                        accessToken: data_body.access_token,
                        exp:jwt_data.exp,
                        iat:jwt_data.iat,
                        tokentimestamp:jwt_data.tokentimestamp,
                        items: Array(result_activate)
                    });
                })
                .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
            }
        })
        .catch((/**@type{import('../../../types.js').error}*/error)=>{
            checked_error(app_id, query.get('lang_code'), error, res).then((/**@type{string}*/message)=>reject(message));
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
 * @returns 
 */
const forgot = (app_id, ip, user_agent, accept_language, host, data) =>{
    return new Promise((resolve, reject)=>{
        const email = data.email ?? '';
        if (email !='')
            service.getEmailUser(app_id, email)
            .then((/**@type{import('../../../types.js').db_result_user_account_getEmailUser[]}*/result_emailuser)=>{
                if (result_emailuser[0]){
                    getLastUserEvent(app_id, getNumberValue(result_emailuser[0].id), 'PASSWORD_RESET')
                    .then((/**@type{import('../../../types.js').db_result_user_account_event_getLastUserEvent[]}*/result_user_event)=>{
                        if (result_user_event[0] &&
                            result_user_event[0].status_name == 'INPROGRESS' &&
                            (+ new Date(result_user_event[0].current_timestamp) - + new Date(result_user_event[0].date_created))/ (1000 * 60 * 60 * 24) < 1)
                            resolve({sent: 0});
                        else{
                            /**@type{import('../../../types.js').db_parameter_user_account_event_insertUserEvent}*/
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
                            insertUserEvent(app_id, eventData)
                            .then(()=>{
                                const new_code = service.verification_code();
                                service.updateUserVerificationCode(app_id, result_emailuser[0].id, new_code)
                                .then(()=>{
                                    //send email PASSWORD_RESET
                                    sendUserEmail(  app_id, 
                                                    ConfigGetApp(app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),'SECRETS').SERVICE_MAIL_TYPE_PASSWORD_RESET,
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
                                    .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
                                })
                                .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
                            })
                            .catch(()=> {
                                resolve({sent: 0});
                            });
                        }
                    })
                    .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));         
                }
                else
                    resolve({sent: 0});
            })
            .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
        else
            resolve({sent: 0});
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {number|null} resource_id_number
 * @param {string|null} resource_id_name
 * @param {string} ip 
 * @param {string} user_agent 
 * @param {*} query 
 * @param {*} data
 * @param {import('../../../types.js').res} res
 * @returns 
 */
const getProfile = (app_id, resource_id_number, resource_id_name, ip, user_agent, query, data, res) =>{
    return new Promise((resolve, reject)=>{
        /**
         * Clear private data if private
         * @param {import('../../../types.js').db_result_user_account_getProfileUser[]} result_getProfileUser 
         * @returns {import('../../../types.js').db_result_user_account_getProfileUser[]}
         */
        const clear_private = result_getProfileUser =>
            result_getProfileUser.map(row=>{
                if ((row.private==1 && row.friends==null) || query.get('search')!=null){
                    //private and not friends or anonymous visit, remove stats
                    row.count_following = null;
                    row.count_followed = null;
                    row.count_likes = null;
                    row.count_liked = null;
                }
                else
                    if (row.private==1 && row.friends==1){
                        //private and friends, remove private
                        row.private = null;
                    }
                return row;
            });
        //resource id can be number, string or empty if searching
        service.getProfileUser(app_id, resource_id_number, resource_id_name, query.get('search'), getNumberValue(query.get('id')))
        .then((/**@type{import('../../../types.js').db_result_user_account_getProfileUser[]}*/result_getProfileUser)=>{
            if (query.get('search')){
                //searching, return result
                import(`file://${process.cwd()}/server/db/sql/profile_search.service.js`)
                .then((/**@type{import('../sql/profile_search.service.js')} */{ insertProfileSearch }) => {
                    /**@type{import('../../../types.js').db_parameter_profile_search_insertProfileSearch} */
                    const data_insert = {   user_account_id:    data.user_account_id,
                                            search:             query.get('search') ?? resource_id_name,
                                            client_ip:          ip,
                                            client_user_agent:  user_agent,
                                            client_longitude:   query.get('client_longitude'),
                                            client_latitude:    query.get('client_latitude')};
                    insertProfileSearch(app_id, data_insert)
                    .then(()=>{
                        resolve(clear_private(result_getProfileUser));
                    })
                    .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
                });
            }
            else
                if (result_getProfileUser[0]){
                    //always save stat who is viewing, same user, none or someone else
                    import(`file://${process.cwd()}/server/db/sql/user_account_view.service.js`)
                    .then((/**@type{import('../sql/user_account_view.service.js')} */{ insertUserAccountView }) => {
                        const data_body = { user_account_id:        getNumberValue(query.get('id')),    //who views
                                            user_account_id_view:   getNumberValue(query.get('POST_ID')) ?? result_getProfileUser[0].id, //viewed account
                                            client_ip:              ip,
                                            client_user_agent:      user_agent,
                                            client_longitude:       query.get('client_longitude'),
                                            client_latitude:        query.get('client_latitude')};
                        insertUserAccountView(app_id, data_body)
                        .then(()=>{
                            resolve(clear_private(result_getProfileUser));
                        })
                        .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
                    });
                }
                else{
                    import(`file://${process.cwd()}/server/db/common.service.js`)
                    .then((/**@type{import('../../db/common.service.js')} */{record_not_found}) => {
                        record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                    });
                }
        })
        .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {*} query
 */
const getProfileStat = (app_id, query) => service.getProfileStat(app_id, getNumberValue(query.get('statchoice')))
                                                    .catch((/**@type{import('../../../types.js').error}*/error)=>{throw error});

/**
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} query 
 * @param {*} data
 * @param {import('../../../types.js').res} res
 */
const updateAdmin =(app_id, resource_id, query, data, res) =>{
    return new Promise((resolve, reject)=>{
        // get avatar and provider column used to validate
        service.getUserByUserId(app_id, resource_id)
        .then((/**@type{import('../../../types.js').db_result_user_account_getUserByUserId[]}*/result_user)=>{
            if (result_user[0]) {
                /**@type{import('../../../types.js').db_parameter_user_account_updateUserSuperAdmin} */
                const body = {  app_role_id:        getNumberValue(data.app_role_id),
                                active:             getNumberValue(data.active),
                                user_level:         getNumberValue(data.user_level),
                                private:            getNumberValue(data.private),
                                username:           data.username,
                                bio:                data.bio,
                                email:              data.email,
                                email_unverified:   data.email_unverified,
                                password:           null,
                                password_new:       data.password_new==''?null:data.password_new,
                                password_reminder:  data.password_reminder,
                                verification_code:  data.verification_code,
                                provider_id:        result_user[0].provider_id,
                                avatar:             result_user[0].avatar,
                                admin:              1};
                service.updateUserSuperAdmin(app_id, resource_id, body)
                .then((/**@type{import('../../../types.js').db_result_user_account_updateUserSuperAdmin}*/result_update)=>{
                    if (data.app_role_id!=0 && data.app_role_id!=1){
                        //delete admin app from user if user is not an admin anymore
                        import(`file://${process.cwd()}/server/db/sql/user_account_app.service.js`)
                        .then((/**@type{import('../sql/user_account_app.service.js')} */{ deleteUserAccountApp }) => {
                            deleteUserAccountApp(app_id, resource_id, app_id)
                            .then(()=>{
                                resolve(result_update);
                            });
                        });
                    }
                    else
                        resolve(result_update);
                })
                .catch((/**@type{import('../../../types.js').error}*/error)=>{
                    checked_error(app_id, query.get('lang_code'), error, res).then((/**@type{string}*/message)=>reject(message));
                });
            }
            else{
                import(`file://${process.cwd()}/server/db/common.service.js`)
                .then((/**@type{import('../../db/common.service.js')} */{record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
            }
        })
        .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 */
const getUsersAdmin = (app_id, query) => service.getUsersAdmin(app_id, query.get('search'), query.get('sort'), query.get('order_by'), getNumberValue(query.get('offset')), getNumberValue(query.get('limit')))
                                            .catch((/**@type{import('../../../types.js').error}*/error)=>{throw error;});

/**
 * 
 * @param {number} app_id 
 * @returns 
 */
const getStatCountAdmin = (app_id) => service.getStatCountAdmin(app_id).catch((/**@type{import('../../../types.js').error}*/error)=>{throw error;});

/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 */
const getLogonAdmin =(app_id, query) => getUserAccountLogon(    app_id, 
                                                                getNumberValue(query.get('data_user_account_id')), 
                                                                getNumberValue(query.get('data_app_id')=='\'\''?'':query.get('data_app_id')))
                                            .catch((/**@type{import('../../../types.js').error}*/error)=>{throw error});
    
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
 * @param {import('../../../types.js').res} res
 */
 const updatePassword = (app_id, resource_id, ip, user_agent, host, accept_language, query, data, res) => {
    return new Promise((resolve, reject)=>{
        /**@type{import('../../../types.js').db_parameter_user_account_updatePassword} */
        const data_update = {   password_new:   data.password_new,
                                auth:           data.auth};
        service.updatePassword(app_id, resource_id, data_update)
        .then((/**@type{import('../../../types.js').db_result_user_account_updatePassword}*/result_update)=>{
            if (result_update) {
                /**@type{import('../../../types.js').db_parameter_user_account_event_insertUserEvent}*/
                const eventData = {
                    user_account_id: resource_id,
                    event: 'PASSWORD_RESET',
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
                insertUserEvent(app_id, eventData)
                .then(()=>{
                    resolve(result_update);
                })
                .catch(()=> {
                    resolve({sent: 0});
                });
            }
            else{
                import(`file://${process.cwd()}/server/db/common.service.js`)
                .then((/**@type{import('../../db/common.service.js')} */{record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
            }
        })
        .catch((/**@type{import('../../../types.js').error}*/error)=>{
            checked_error(app_id, query.get('lang_code'), error, res).then((/**@type{string}*/message)=>reject(message));
        });
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
 * @param {import('../../../types.js').res} res 
 */
 const updateUserLocal = async (app_id, resource_id, ip, user_agent, host, accept_language, query, data, res) => {
    /**@type{import('../../../types.js').db_result_user_account_getUserByUserId[]}*/
    const result_user = await service.getUserByUserId(app_id, resource_id);
    /**@type{import('../../../types.js').db_result_user_account_event_getLastUserEvent[]}*/
    const result_user_event = await getLastUserEvent(app_id, resource_id, 'EMAIL_VERIFIED_CHANGE_EMAIL');
    return new Promise((resolve, reject)=>{
        if (result_user[0]) {
            PasswordCompare(data.password, result_user[0].password ?? '').then((result_compare)=>{
                if (result_compare){
                    let send_email=false;
                    if (data.new_email && data.new_email!=''){
                        if ((result_user_event[0] && 
                            (+ new Date(result_user_event[0].current_timestamp) - + new Date(result_user_event[0].date_created))/ (1000 * 60 * 60 * 24) >= 1)||
                                result_user_event.length == 0)
                            send_email=true;
                    }
                    /**@type{import('../../../types.js').db_parameter_user_account_updateUserLocal} */
                    const data_update = {   bio:                data.bio,
                                            private:            data.private,
                                            username:           data.username,
                                            password:           data.password,
                                            password_new:       (data.password_new && data.password_new!='')==true?data.password_new:null,
                                            password_reminder:  (data.password_reminder && data.password_reminder!='')==true?data.password_reminder:null,
                                            email:              data.email,
                                            email_unverified:   (data.new_email && data.new_email!='')==true?data.new_email:null,
                                            avatar:             data.avatar,
                                            verification_code:  send_email==true?service.verification_code():null,
                                            provider_id:        result_user[0].provider_id,
                                            admin:              0
                                        };
                    service.updateUserLocal(app_id, data_update, resource_id)
                    .then((/**@type{import('../../../types.js').db_result_user_account_updateUserLocal}*/result_update)=>{
                        if (result_update){
                            if (send_email){
                                //no change email in progress or older than at least 1 day
                                /**@type{import('../../../types.js').db_parameter_user_account_event_insertUserEvent}*/
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
                                insertUserEvent(app_id, eventData)
                                .then(()=>{
                                    //send email SERVICE_MAIL_TYPE_CHANGE_EMAIL
                                    sendUserEmail(  app_id, 
                                                    ConfigGetApp(app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),'SECRETS').SERVICE_MAIL_TYPE_CHANGE_EMAIL,
                                                    ip, 
                                                    user_agent,
                                                    accept_language,
                                                    resource_id,
                                                    data.verification_code, 
                                                    data.new_email)
                                    .then(()=>{
                                        resolve({sent_change_email: 1});
                                    })
                                    .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
                                })
                                .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
                            }
                            else
                                resolve({sent_change_email: 0});
                        }
                        else{
                            import(`file://${process.cwd()}/server/db/common.service.js`)
                            .then((/**@type{import('../../db/common.service.js')} */{record_not_found}) => {
                                record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                            });
                        }
                    })
                    .catch((/**@type{import('../../../types.js').error}*/error)=>{
                        checked_error(app_id, query.get('lang_code'), error, res).then((/**@type{string}*/message)=>reject(message));
                    });
                } 
                else {
                    res.statusCode=400;
                    res.statusMessage = 'invalid password attempt for user id:' + resource_id;
                    //invalid password
                    getSettingDisplayData(  app_id,
                                            getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                                            'MESSAGE',
                                            '20401')
                    .then((/**@type{import('../../../types.js').db_result_app_setting_getSettingDisplayData[]}*/result_message)=>{
                        reject(result_message[0].display_data);
                    })
                    .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
                }
            });
        } 
        else {
            //user not found
            res.statusCode=404;
            getSettingDisplayData(  app_id,
                                    getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                                    'MESSAGE',
                                    '20305')
            .then((/**@type{import('../../../types.js').db_result_app_setting_getSettingDisplayData[]}*/result_message)=>{
                reject(result_message[0].display_data);
            })
            .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
        }
    });
};
/**
 * 
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*} query
 * @param {*} data
 * @param {import('../../../types.js').res} res
 */
 const updateUserCommon = (app_id, resource_id, query, data, res) => {
    return new Promise((resolve, reject)=>{
        /**@type{import('../../../types.js').db_parameter_user_account_updateUserCommon} */
        const data_update = {   username:   data.username,
                                bio:        data.bio,
                                private:    data.private};
        service.updateUserCommon(app_id, data_update, resource_id)
        .then((/**@type{import('../../../types.js').db_result_user_account_updateUserCommon}*/result_update)=>{
            if (result_update)
                resolve(result_update);
            else{
                import(`file://${process.cwd()}/server/db/common.service.js`)
                .then((/**@type{import('../../db/common.service.js')} */{record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
            }
        })
        .catch((/**@type{import('../../../types.js').error}*/error)=>{
            checked_error(app_id, query.get('lang_code'), error, res).then((/**@type{string}*/message)=>reject(message));
        });
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} query 
 * @param {import('../../../types.js').res} res 
 */
const getUserByUserId = (app_id, resource_id, query, res) => {
    return new Promise((resolve, reject)=>{
        service.getUserByUserId(app_id, resource_id)
        .then((/**@type{import('../../../types.js').db_result_user_account_getUserByUserId[]}*/result)=>{
            if (result[0]){
                getUserAccountLogon(    app_id, 
                                        resource_id, 
                                        app_id)
                .then((/**@type{import('../../../types.js').db_result_user_account_logon_getUserAccountLogon[]}*/user_account_logons)=>{
                    const last_logontime = user_account_logons.filter(row=>JSON.parse(row.json_data).result==1)[0];
                    resolve({...result[0], ...{last_logontime:last_logontime?last_logontime.date_created:null}});
                })
                .catch((/**@type{import('../../../types.js').error}*/error)=>{throw error;});
            }
                
            else{
                import(`file://${process.cwd()}/server/db/common.service.js`)
                .then((/**@type{import('../../db/common.service.js')} */{record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
            }
        })
        .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
    });
};
/**
 * 
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*} query
 * @param {*} data
 * @param {import('../../../types.js').res} res 
 */
 const deleteUser = (app_id, resource_id, query, data, res) => {
    return new Promise((resolve, reject)=>{
        service.getUserByUserId(app_id, resource_id)
        .then((/**@type{import('../../../types.js').db_result_user_account_getUserByUserId[]}*/result_user)=>{
            if (result_user[0]) {
                if (result_user[0].provider_id !=null){
                    service.deleteUser(app_id, resource_id)
                    .then((/**@type{import('../../../types.js').db_result_user_account_deleteUser}*/result_delete)=>{
                        if (result_delete)
                            resolve(result_delete);
                        else{
                            import(`file://${process.cwd()}/server/db/common.service.js`)
                            .then((/**@type{import('../../db/common.service.js')} */{record_not_found}) => {
                                record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                            });
                        }
                    })
                    .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
                }
                else{
                    service.checkPassword(app_id, resource_id)
                    .then((/**@type{import('../../../types.js').db_result_user_account_checkPassword[]}*/result_password)=>{
                        if (result_password[0]) {
                            PasswordCompare(data.password, result_password[0].password).then((result_password)=>{
                                if (result_password){
                                    service.deleteUser(app_id, resource_id)
                                    .then((/**@type{import('../../../types.js').db_result_user_account_deleteUser}*/result_delete)=>{
                                        if (result_delete)
                                            resolve(result_delete);
                                        else{
                                            import(`file://${process.cwd()}/server/db/common.service.js`)
                                            .then((/**@type{import('../../db/common.service.js')} */{record_not_found}) => {
                                                record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                                            });
                                        }
                                    })
                                    .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
                                }
                                else{
                                    res.statusMessage = 'invalid password attempt for user id:' + resource_id;
                                    res.statusCode = 400;
                                    //invalid password
                                    getSettingDisplayData(  app_id,
                                                            getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                                                            'MESSAGE',
                                                            '20401')
                                    .then((/**@type{import('../../../types.js').db_result_app_setting_getSettingDisplayData[]}*/result_message)=>{
                                        reject(result_message[0].display_data);
                                    })
                                    .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
                                } 
                            });
                            
                        }
                        else{
                            //user not found
                            res.statusCode = 404;
                            getSettingDisplayData(  app_id,
                                                    getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                                                    'MESSAGE',
                                                    '20305')
                            .then((/**@type{import('../../../types.js').db_result_app_setting_getSettingDisplayData[]}*/result_message)=>{
                                reject(result_message[0].display_data);
                            })
                            .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
                        }
                    })
                    .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
                }
            }
            else{
                //user not found
                res.statusCode = 404;
                getSettingDisplayData(  app_id,
                                        getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                                        'MESSAGE',
                                        '20305')
                .then((/**@type{import('../../../types.js').db_result_app_setting_getSettingDisplayData[]}*/result_message)=>{
                    reject(result_message[0].display_data);
                });
            }
        })
        .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
    });
};
/**
 * 
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*} query
 * @param {import('../../../types.js').res} res 
 */
 const getProfileDetail = (app_id, resource_id, query, res) => {
    return new Promise((resolve, reject)=>{
        service.getProfileDetail(app_id, resource_id, getNumberValue(query.get('detailchoice')))
        .then((/**@type{import('../../../types.js').db_result_user_account_getProfileDetail[]}*/result)=>{
            if (result)
                resolve(result);
            else {
                import(`file://${process.cwd()}/server/db/common.service.js`)
                .then((/**@type{import('../../db/common.service.js')} */{record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
            }
        })
        .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
    });
    
};
/**
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*} data
 */
const follow = (app_id, resource_id, data) => user_account_follow_service.follow(app_id, resource_id, getNumberValue(data.user_account_id))
                                            .catch((/**@type{import('../../../types.js').error}*/error)=>{throw error;});
/**
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*} data
 */
const unfollow = (app_id, resource_id, data) => user_account_follow_service.unfollow(app_id, resource_id, getNumberValue(data.user_account_id))
                                            .catch((/**@type{import('../../../types.js').error}*/error)=>{throw error;});

/**
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} data
 */
const like = (app_id, resource_id, data) => user_account_like_service.like(app_id, resource_id, getNumberValue(data.user_account_id))
                                            .catch((/**@type{import('../../../types.js').error}*/error)=>{throw error;});

/**
 * 
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*} data
 */
const unlike = (app_id, resource_id, data) => user_account_like_service.unlike(app_id, resource_id, getNumberValue(data.user_account_id))
                                            .catch((/**@type{import('../../../types.js').error}*/error)=>{throw error;});

export {/*DATA_LOGIN*/
        login, login_provider, 
        /*DATA_SIGNUP*/
        signup, 
        /*DATA*/
        activate, forgot, getProfile, getProfileStat,
        /*ADMIN*/
        updateAdmin, getUsersAdmin, getStatCountAdmin, getLogonAdmin,
        /*ACCESS*/
        updatePassword, updateUserLocal, updateUserCommon, getUserByUserId, deleteUser, getProfileDetail,
        follow, unfollow,
        like, unlike};
