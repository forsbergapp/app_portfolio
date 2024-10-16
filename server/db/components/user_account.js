/** @module server/db/components/user_account */

/**@type{import('../sql/user_account.service.js')} */
const service = await import(`file://${process.cwd()}/server/db/sql/user_account.service.js`);

/**@type{import('../../config.js')} */
const { configGet, configAppGet } = await import(`file://${process.cwd()}/server/config.js`);
/**@type{import('../file.service.js')} */
const { fileCache, fileFsReadLog, fileFsAppend } = await import(`file://${process.cwd()}/server/db/file.service.js`);


/**@type{import('../../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
/**@type{import('../../iam.service.js')} */
const { iamTokenAuthorize } = await import(`file://${process.cwd()}/server/iam.service.js`);
/**@type{import('../../socket.js')} */
const {socketConnectedUpdate} = await import(`file://${process.cwd()}/server/socket.js`);

/**@type{import('../../db/common.service.js')} */
const { dbCommonCheckedError } = await import(`file://${process.cwd()}/server/db/common.service.js`);

/**@type{import('../sql/app_setting.service.js')} */
const { getSettingDisplayData } = await import(`file://${process.cwd()}/server/db/sql/app_setting.service.js`);
/**@type{import('../sql/user_account_app.service.js')} */
const { createUserAccountApp} = await import(`file://${process.cwd()}/server/db/sql/user_account_app.service.js`);
/**@type{import('../sql/user_account_event.service.js')} */
const { getLastUserEvent, insertUserEvent } = await import(`file://${process.cwd()}/server/db/sql/user_account_event.service.js`);
/**@type{import('../sql/user_account_follow.service.js')} */
const user_account_follow_service = await import(`file://${process.cwd()}/server/db/sql/user_account_follow.service.js`);
/**@type{import('../sql/user_account_like.service.js')} */
const user_account_like_service = await import(`file://${process.cwd()}/server/db/sql/user_account_like.service.js`);
/**@type{import('../../security.js')} */
const {securityPasswordCompare}= await import(`file://${process.cwd()}/server/security.js`);

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
    /**@type{import('../../../apps/common/src/common.js')} */
    const { commonMailCreate} = await import(`file://${process.cwd()}/apps/common/src/common.js`);
    /**@type{import('../../bff.service.js')} */
    const {bffServer} = await import(`file://${process.cwd()}/server/bff.service.js`);
    
    const email_rendered = await commonMailCreate( app_id, 
                                    {
                                        emailtype:        emailtype,
                                        host:             configGet('SERVER', 'HOST'),
                                        app_user_id:      userid,
                                        verificationCode: verification_code,
                                        to:               email,
                                    })
                                    .catch((/**@type{import('../../types.js').server_server_error}*/error)=>{throw error;});
        
    /**@type{import('../../types.js').server_bff_parameters}*/
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
    return await bffServer(app_id, parameters);
};
/**
 * 
 * @param {number} app_id 
 */
const login_error = async (app_id) =>{
    return getSettingDisplayData(   app_id,
                                    serverUtilNumberValue(configGet('SERVER', 'APP_COMMON_APP_ID')), 
                                    'MESSAGE',
                                    '20300')
    .then(result_message=>result_message[0].display_data)
    .catch((/**@type{import('../../types.js').server_server_error}*/error)=>{throw error;});
};
/**
 * 
 * @param {number} app_id
 * @param {string} iam
 * @param {string} ip
 * @param {string} user_agent
 * @param {string} accept_language
 * @param {*} data
 * @param {import('../../types.js').server_server_res} res
 * @return {Promise.<{
 *                  accessToken:string|null,
 *                  exp:number,
 *                  iat:number,
 *                  tokentimestamp:number,
 *                  login:import('../../types.js').server_db_sql_result_user_account_userLogin[]}>}
 */
const login = (app_id, iam, ip, user_agent, accept_language, data, res) =>{
    return new Promise((resolve, reject)=>{        
        
        /**@type{import('../../types.js').server_db_sql_parameter_user_account_userLogin} */
        const data_login =    {   username: data.username};
        service.userLogin(app_id, data_login)
        .then(result_login=>{
            const user_account_id = result_login[0]?serverUtilNumberValue(result_login[0].id):null;
            /**@type{import('../../types.js').server_iam_user_login_record} */
            const data_body = { id:     user_account_id,
                                app_id: app_id,
                                user:   data.username,
                                db:     fileCache('CONFIG_SERVER').SERVICE_DB.filter((/**@type{*}*/row)=>'USE' in row)[0].USE,
                                res:    0,
                                token:  null,
                                ip:     ip,
                                ua:     user_agent,
                                long:   data.client_longitude ?? null,
                                lat:    data.client_latitude ?? null,
                                created: new Date().toISOString()
                            };
            if (result_login[0]) {
                securityPasswordCompare(data.password, result_login[0].password).then((result_password)=>{
                    data_body.res = result_password?1:0;
                    if (result_password) {
                        const jwt_data = iamTokenAuthorize(app_id, 'APP_ACCESS', {id:result_login[0].id, name:result_login[0].username, ip:ip, scope:'USER'});
                        data_body.token = jwt_data.token;
                        fileFsAppend('IAM_USER_LOGIN', data_body, '')
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
                                                        configAppGet(app_id, serverUtilNumberValue(configGet('SERVER', 'APP_COMMON_APP_ID')),'SECRETS').SERVICE_MAIL_TYPE_UNVERIFIED, 
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
                                            .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
                                        })
                                        .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
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
                                    .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
                                }
                            })
                            .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
                        })
                        .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
                    } else {
                        //Username or password not found
                        fileFsAppend('IAM_USER_LOGIN', data_body, '')
                        .then(()=>{
                            res.statusCode = 400;
                            login_error(app_id)
                            .then((/**@type{string}*/text)=>reject(text));
                        })
                        .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
                    }
                });
            } else{
                //User not found
                fileFsAppend('IAM_USER_LOGIN', data_body, '')
                .then(()=>{
                    res.statusCode = 404;
                    login_error(app_id)
                    .then((/**@type{string}*/text)=>reject(text));
                })
                .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
            }
        })
        .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
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
 * @param {import('../../types.js').server_server_res} res
 * @return {Promise.<{
 *                  accessToken:string|null,
 *                  exp:number,
 *                  iat:number,
 *                  tokentimestamp:number,
 *                  items:import('../../types.js').server_db_sql_result_user_account_providerSignIn[],
 *                  userCreated:0|1}>}
 */
const login_provider = (app_id, iam, resource_id, ip, user_agent, accept_language, query, data, res) =>{
    return new Promise((resolve, reject)=>{
        service.providerSignIn(app_id, serverUtilNumberValue(data.identity_provider_id), resource_id)
        .then(result_signin=>{
            /** @type{import('../../types.js').server_db_sql_parameter_user_account_create} */
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
                                identity_provider_id:   serverUtilNumberValue(data.identity_provider_id),
                                provider_id:            data.provider_id,
                                provider_first_name:    data.provider_first_name,
                                provider_last_name:     data.provider_last_name,
                                provider_image:         data.provider_image,
                                provider_image_url:     data.provider_image_url,
                                provider_email:         data.provider_email,
                                admin:                  0};
            /**@type{import('../../types.js').server_iam_user_login_record} */
            const data_login = {
                                id:     null,
                                app_id: app_id,
                                user:   result_signin[0].username,
                                db:     fileCache('CONFIG_SERVER').SERVICEDB.filter((/**@type{*}*/row)=>'USE' in row)[0].USE,
                                res:    0,
                                token:  null,
                                ip:     ip,
                                ua:     user_agent,
                                long:   data.client_longitude,
                                lat:    data.client_latitude,
                                created: new Date().toISOString()
                            };
            if (result_signin.length > 0) {        
                const jwt_data_exists = iamTokenAuthorize(app_id, 'APP_ACCESS', {id:result_signin[0].id, name:result_signin[0].username, ip:ip, scope:'USER'});
                data_login.token = jwt_data_exists.token;
                data_login.res = 1;
                data_login.id = result_signin[0].id;
                fileFsAppend('IAM_USER_LOGIN', data_login, '')
                .then(()=>{
                    service.updateSigninProvider(app_id, result_signin[0].id, data_user)
                    .then(()=>{
                        createUserAccountApp(app_id, result_signin[0].id)
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
                            .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
                        })
                        .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
                    })
                    .catch((/**@type{import('../../types.js').server_server_error}*/error)=>{
                        dbCommonCheckedError(app_id, query.get('lang_code'), error, res).then((/**@type{string}*/message)=>reject(message));
                    });    
                })
                .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
            }
            else{
                //if provider user not found then create user and one user setting
                //avatar not used by providers, set default null
                data_user.avatar = data.avatar ?? null;
                data_user.provider_image = data.provider_image ?? null;
                //generate local username for provider 1
                data_user.username = `${data_user.provider_first_name}${Date.now()}`;
                
                service.create(app_id, data_user)
                .then(result_create=>{
                    const jwt_data_new = iamTokenAuthorize(app_id, 'APP_ACCESS', {id:result_create.insertId, name:data_user.username ?? '', ip:ip, scope:'USER'});
                    data_login.token = jwt_data_new.token;
                    data_login.res = 1;
                    data_login.id = result_create.insertId;
                    fileFsAppend('IAM_USER_LOGIN', data_login, '')
                    .then(()=>{
                        createUserAccountApp(app_id, result_create.insertId)
                        .then(()=>{
                            service.providerSignIn(app_id, serverUtilNumberValue(data.identity_provider_id), resource_id)
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
                                .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
                            })
                            .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
                        })
                        .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
                    })
                    .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
                })
                .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
            }
        })
        .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
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
 * @param {import('../../types.js').server_server_res} res 
 * @return {Promise.<{
 *              accessToken:string|null,
 *              exp:number,
 *              iat:number,
 *              tokentimestamp:number,
 *              id:number,
 *              data:import('../../types.js').server_db_sql_result_user_account_create}>}
 */
const signup = (app_id, ip, user_agent, accept_language, query, data, res) =>{
    return new Promise((resolve, reject)=>{
        /**@type{import('../../types.js').server_db_sql_parameter_user_account_create} */
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
        service.create(app_id, data_body)
        .then(result_create=>{
            if (data.provider_id == null ) {
                //send email for local users only
                //send email SIGNUP
                sendUserEmail(  app_id, 
                                configAppGet(app_id, serverUtilNumberValue(configGet('SERVER', 'APP_COMMON_APP_ID')),'SECRETS').SERVICE_MAIL_TYPE_SIGNUP,
                                ip, 
                                user_agent,
                                accept_language,
                                result_create.insertId, 
                                data_body.verification_code, 
                                data_body.email ?? '')
                .then(()=>{
                    const jwt_data = iamTokenAuthorize(app_id, 'APP_ACCESS', {id:result_create.insertId, name:data.username, ip:ip, scope:'USER'});
                    resolve({
                        accessToken: jwt_data.token,
                        exp:jwt_data.exp,
                        iat:jwt_data.iat,
                        tokentimestamp:jwt_data.tokentimestamp,
                        id: result_create.insertId,
                        data: result_create
                    });
                })
                .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
            }
            else{
                const jwt_data = iamTokenAuthorize(app_id, 'APP_ACCESS', {id:result_create.insertId, name:data.username, ip:ip, scope:'USER'});
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
        .catch((/**@type{import('../../types.js').server_server_error}*/error)=>{
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
 * @param {import('../../types.js').server_server_res} res
 * @return {Promise.<{
 *              count: number,
 *              auth: string|null,
 *              accessToken: string|null,
 *              exp:number|null,
 *              iat:number|null,
 *              tokentimestamp:number|null,
 *              items: import('../../types.js').server_db_sql_result_user_account_activateUser[]}>}
 */
const activate = (app_id, resource_id, ip, user_agent, accept_language, host, query, data, res) =>{
    return new Promise((resolve, reject)=>{
        /**@type{string|null} */
        let auth_password_new = null;
        if (serverUtilNumberValue(data.verification_type) == 3){
            //reset password
            auth_password_new = service.verification_code();
        }
        service.activateUser(app_id, resource_id, serverUtilNumberValue(data.verification_type), data.verification_code, auth_password_new)
        .then(result_activate=>{
            if (auth_password_new == null){
                if (result_activate.affectedRows==1 && serverUtilNumberValue(data.verification_type)==4){
                    //new email verified
                    /**@type{import('../../types.js').server_db_sql_parameter_user_account_event_insertUserEvent}*/
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
                    .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
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
                const jwt_data = iamTokenAuthorize(app_id, 'APP_ACCESS', {id:resource_id, name:'', ip:ip, scope:'USER'});
                //return accessToken since PASSWORD_RESET is in progress
                //email was verified and activated with id token, but now the password will be updated
                //using accessToken and authentication code
                /**@type{import('../../types.js').server_iam_user_login_record} */
                const data_body = { 
                    id:         resource_id,
                    app_id:     app_id,
                    user:       '',
                    db:         fileCache('CONFIG_SERVER').SERVICEDB.filter((/**@type{*}*/row)=>'USE' in row)[0].USE,
                    res:        1,
                    token:      jwt_data.token,
                    ip:         ip,
                    ua:         user_agent,
                    long:       data.client_longitude ?? null,
                    lat:        data.client_latitude ?? null,
                    created:    new Date().toISOString()};
                fileFsAppend('IAM_USER_LOGIN', data_body, '')
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
                .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
            }
        })
        .catch((/**@type{import('../../types.js').server_server_error}*/error)=>{
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
const forgot = (app_id, ip, user_agent, accept_language, host, data) =>{
    return new Promise((resolve, reject)=>{
        const email = data.email ?? '';
        if (email !='')
            service.getEmailUser(app_id, email)
            .then(result_emailuser=>{
                if (result_emailuser[0]){
                    getLastUserEvent(app_id, serverUtilNumberValue(result_emailuser[0].id), 'PASSWORD_RESET')
                    .then(result_user_event=>{
                        if (result_user_event[0] &&
                            result_user_event[0].status_name == 'INPROGRESS' &&
                            (+ new Date(result_user_event[0].current_timestamp) - + new Date(result_user_event[0].date_created))/ (1000 * 60 * 60 * 24) < 1)
                            resolve({sent: 0});
                        else{
                            /**@type{import('../../types.js').server_db_sql_parameter_user_account_event_insertUserEvent}*/
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
                                                    configAppGet(app_id, serverUtilNumberValue(configGet('SERVER', 'APP_COMMON_APP_ID')),'SECRETS').SERVICE_MAIL_TYPE_PASSWORD_RESET,
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
                                    .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
                                })
                                .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
                            })
                            .catch(()=> {
                                resolve({sent: 0});
                            });
                        }
                    })
                    .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));         
                }
                else
                    resolve({sent: 0});
            })
            .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
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
 * @param {import('../../types.js').server_server_res} res
 * @returns {Promise.<import('../../types.js').server_db_sql_result_user_account_getProfileUser[]>}
 */
const getProfile = (app_id, resource_id_number, resource_id_name, ip, user_agent, query, data, res) =>{
    return new Promise((resolve, reject)=>{
        /**
         * Clear private data if private
         * @param {import('../../types.js').server_db_sql_result_user_account_getProfileUser[]} result_getProfileUser 
         * @returns {import('../../types.js').server_db_sql_result_user_account_getProfileUser[]}
         */
        const clear_private = result_getProfileUser =>
            result_getProfileUser.map(row=>{
                if (row.id ==resource_id_number){
                    //profile of current logged in user should always be displayed
                    row.private = null;
                }
                else
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
        service.getProfileUser(app_id, resource_id_number, resource_id_name, query.get('search'), serverUtilNumberValue(query.get('id')))
        .then(result_getProfileUser=>{
            if (query.get('search')){
                //searching, return result
                import(`file://${process.cwd()}/server/db/sql/app_data_stat.service.js`)
                .then((/**@type{import('../sql/app_data_stat.service.js')} */{ post }) => {
                    /**@type{import('../../types.js').server_db_sql_parameter_app_data_stat_post} */
                    const data_insert = {json_data:                                         {   search:             query.get('search') ?? resource_id_number ?? resource_id_name,
                                                                                                client_ip:          ip,
                                                                                                client_user_agent:  user_agent,
                                                                                                client_longitude:   query.get('client_longitude'),
                                                                                                client_latitude:    query.get('client_latitude')},
                                        //if user logged not logged in then save resource on app
                                        app_id:                                             serverUtilNumberValue(query.get('id'))?null:app_id,
                                        user_account_id:                                    null,
                                        //save user account if logged in else set null in both user account app columns
                                        user_account_app_user_account_id:                   serverUtilNumberValue(query.get('id')) ?? null,
                                        user_account_app_app_id:                            serverUtilNumberValue(query.get('id'))?app_id:null,
                                        app_data_resource_master_id:                        null,
                                        app_data_entity_resource_id:                        1,  //PROFILE_SEARCH
                                        app_data_entity_resource_app_data_entity_app_id:    serverUtilNumberValue(configGet('SERVER', 'APP_COMMON_APP_ID')) ?? 0,
                                        app_data_entity_resource_app_data_entity_id:        0   //COMMON
                                        };
                    post(app_id, data_insert)
                    .then(()=>{
                        resolve(clear_private(result_getProfileUser));
                    })
                    .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
                });
            }
            else
                if (result_getProfileUser[0]){
                    //always save stat who is viewing, same user, none or someone else
                    import(`file://${process.cwd()}/server/db/sql/user_account_view.service.js`)
                    .then((/**@type{import('../sql/user_account_view.service.js')} */{ insertUserAccountView }) => {
                        const data_body = { user_account_id:        serverUtilNumberValue(query.get('id')),    //who views
                                            user_account_id_view:   serverUtilNumberValue(query.get('POST_ID')) ?? result_getProfileUser[0].id, //viewed account
                                            client_ip:              ip,
                                            client_user_agent:      user_agent,
                                            client_longitude:       query.get('client_longitude'),
                                            client_latitude:        query.get('client_latitude')};
                        insertUserAccountView(app_id, data_body)
                        .then(()=>{
                            resolve(clear_private(result_getProfileUser));
                        })
                        .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
                    });
                }
                else{
                    import(`file://${process.cwd()}/server/db/common.service.js`)
                    .then((/**@type{import('../../db/common.service.js')} */{dbCommonRecordNotFound}) => {
                        dbCommonRecordNotFound(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                    });
                }
        })
        .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {*} query
 */
const getProfileStat = (app_id, query) => service.getProfileStat(app_id, serverUtilNumberValue(query.get('statchoice')))
                                                    .catch((/**@type{import('../../types.js').server_server_error}*/error)=>{throw error;});

/**
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} query 
 * @param {*} data
 * @param {import('../../types.js').server_server_res} res
 * @returns {Promise.<import('../../types.js').server_db_sql_result_user_account_updateAdmin>}
 */
const updateAdmin =(app_id, resource_id, query, data, res) =>{
    return new Promise((resolve, reject)=>{
        // get avatar and provider column used to validate
        service.getUserByUserId(app_id, resource_id)
        .then(result_user=>{
            if (result_user[0]) {
                /**@type{import('../../types.js').server_db_sql_parameter_user_account_updateAdmin} */
                const body = {  active:             serverUtilNumberValue(data.active),
                                user_level:         serverUtilNumberValue(data.user_level),
                                private:            serverUtilNumberValue(data.private),
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
                service.updateAdmin(app_id, resource_id, body)
                .then(result_update=>{
                    resolve(result_update);
                })
                .catch((/**@type{import('../../types.js').server_server_error}*/error)=>{
                    dbCommonCheckedError(app_id, query.get('lang_code'), error, res).then((/**@type{string}*/message)=>reject(message));
                });
            }
            else{
                import(`file://${process.cwd()}/server/db/common.service.js`)
                .then((/**@type{import('../../db/common.service.js')} */{dbCommonRecordNotFound}) => {
                    dbCommonRecordNotFound(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
            }
        })
        .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 */
const getUsersAdmin = (app_id, query) => service.getUsersAdmin(app_id, query.get('search'), query.get('sort'), query.get('order_by'), serverUtilNumberValue(query.get('offset')), serverUtilNumberValue(query.get('limit')))
                                            .catch((/**@type{import('../../types.js').server_server_error}*/error)=>{throw error;});

/**
 * 
 * @param {number} app_id 
 */
const getStatCountAdmin = (app_id) => service.getStatCountAdmin(app_id).catch((/**@type{import('../../types.js').server_server_error}*/error)=>{throw error;});
 
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
 * @param {import('../../types.js').server_server_res} res
 * @returns {Promise.<import('../../types.js').server_db_sql_result_user_account_updatePassword|{sent: number}>}
 */
 const updatePassword = (app_id, resource_id, ip, user_agent, host, accept_language, query, data, res) => {
    return new Promise((resolve, reject)=>{
        /**@type{import('../../types.js').server_db_sql_parameter_user_account_updatePassword} */
        const data_update = {   password_new:   data.password_new,
                                auth:           data.auth};
        service.updatePassword(app_id, resource_id, data_update)
        .then(result_update=>{
            if (result_update) {
                /**@type{import('../../types.js').server_db_sql_parameter_user_account_event_insertUserEvent}*/
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
                .then((/**@type{import('../../db/common.service.js')} */{dbCommonRecordNotFound}) => {
                    dbCommonRecordNotFound(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
            }
        })
        .catch((/**@type{import('../../types.js').server_server_error}*/error)=>{
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
 * @param {string} host
 * @param {string} accept_language
 * @param {*} query 
 * @param {*} data 
 * @param {import('../../types.js').server_server_res} res 
 * @returns {Promise.<{sent_change_email: number}>}
 */
 const updateUserLocal = async (app_id, resource_id, ip, user_agent, host, accept_language, query, data, res) => {
    /**@type{import('../../types.js').server_db_sql_result_user_account_getUserByUserId[]}*/
    const result_user = await service.getUserByUserId(app_id, resource_id);
    /**@type{import('../../types.js').server_db_sql_result_user_account_event_getLastUserEvent[]}*/
    const result_user_event = await getLastUserEvent(app_id, resource_id, 'EMAIL_VERIFIED_CHANGE_EMAIL');
    return new Promise((resolve, reject)=>{
        if (result_user[0]) {
            securityPasswordCompare(data.password, result_user[0].password ?? '').then((result_compare)=>{
                if (result_compare){
                    let send_email=false;
                    if (data.new_email && data.new_email!=''){
                        if ((result_user_event[0] && 
                            (+ new Date(result_user_event[0].current_timestamp) - + new Date(result_user_event[0].date_created))/ (1000 * 60 * 60 * 24) >= 1)||
                                result_user_event.length == 0)
                            send_email=true;
                    }
                    /**@type{import('../../types.js').server_db_sql_parameter_user_account_updateUserLocal} */
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
                    .then(result_update=>{
                        if (result_update){
                            if (send_email){
                                //no change email in progress or older than at least 1 day
                                /**@type{import('../../types.js').server_db_sql_parameter_user_account_event_insertUserEvent}*/
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
                                                    configAppGet(app_id, serverUtilNumberValue(configGet('SERVER', 'APP_COMMON_APP_ID')),'SECRETS').SERVICE_MAIL_TYPE_CHANGE_EMAIL,
                                                    ip, 
                                                    user_agent,
                                                    accept_language,
                                                    resource_id,
                                                    data.verification_code, 
                                                    data.new_email)
                                    .then(()=>{
                                        resolve({sent_change_email: 1});
                                    })
                                    .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
                                })
                                .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
                            }
                            else
                                resolve({sent_change_email: 0});
                        }
                        else{
                            import(`file://${process.cwd()}/server/db/common.service.js`)
                            .then((/**@type{import('../../db/common.service.js')} */{dbCommonRecordNotFound}) => {
                                dbCommonRecordNotFound(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                            });
                        }
                    })
                    .catch((/**@type{import('../../types.js').server_server_error}*/error)=>{
                        dbCommonCheckedError(app_id, query.get('lang_code'), error, res).then((/**@type{string}*/message)=>reject(message));
                    });
                } 
                else {
                    res.statusCode=400;
                    res.statusMessage = 'invalid password attempt for user id:' + resource_id;
                    //invalid password
                    getSettingDisplayData(  app_id,
                                            serverUtilNumberValue(configGet('SERVER', 'APP_COMMON_APP_ID')), 
                                            'MESSAGE',
                                            '20401')
                    .then(result_message=>{
                        reject(result_message[0].display_data);
                    })
                    .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
                }
            });
        } 
        else {
            //user not found
            res.statusCode=404;
            getSettingDisplayData(  app_id,
                                    serverUtilNumberValue(configGet('SERVER', 'APP_COMMON_APP_ID')), 
                                    'MESSAGE',
                                    '20305')
            .then(result_message=>{
                reject(result_message[0].display_data);
            })
            .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
        }
    });
};
/**
 * 
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*} query
 * @param {*} data
 * @param {import('../../types.js').server_server_res} res
 * @returns {Promise.<import('../../types.js').server_db_sql_result_user_account_updateUserCommon>}
 */
 const updateUserCommon = (app_id, resource_id, query, data, res) => {
    return new Promise((resolve, reject)=>{
        /**@type{import('../../types.js').server_db_sql_parameter_user_account_updateUserCommon} */
        const data_update = {   username:   data.username,
                                bio:        data.bio,
                                private:    data.private};
        service.updateUserCommon(app_id, data_update, resource_id)
        .then(result_update=>{
            if (result_update)
                resolve(result_update);
            else{
                import(`file://${process.cwd()}/server/db/common.service.js`)
                .then((/**@type{import('../../db/common.service.js')} */{dbCommonRecordNotFound}) => {
                    dbCommonRecordNotFound(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
            }
        })
        .catch((/**@type{import('../../types.js').server_server_error}*/error)=>{
            dbCommonCheckedError(app_id, query.get('lang_code'), error, res).then((/**@type{string}*/message)=>reject(message));
        });
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} query 
 * @param {import('../../types.js').server_server_res} res 
 * @returns {Promise.<import('../../types.js').server_db_sql_result_user_account_getUserByUserId[]|{last_logontime:string|null}>}
 */
const getUserByUserId = (app_id, resource_id, query, res) => {
    return new Promise((resolve, reject)=>{
        service.getUserByUserId(app_id, resource_id)
        .then(result=>{
            if (result[0]){
                fileFsReadLog('IAM_USER_LOGIN', null, '')
                    .then(result=>result
                    .filter((/**@type{import('../../types.js').server_iam_user_login_record}*/row)=>
                        row.id==resource_id &&  row.id==app_id && row.res==1)[0])
                .then((/**@type{import('../../types.js').server_iam_user_login_record}*/iam_user_login)=>{
                    //concat db result with IAM last logon time
                    resolve({...result[0], ...{last_logontime:iam_user_login?iam_user_login.created:null}});
                })
                .catch((/**@type{import('../../types.js').server_server_error}*/error)=>{throw error;});
            }
                
            else{
                import(`file://${process.cwd()}/server/db/common.service.js`)
                .then((/**@type{import('../../db/common.service.js')} */{dbCommonRecordNotFound}) => {
                    dbCommonRecordNotFound(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
            }
        })
        .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
    });
};
/**
 * 
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*} query
 * @param {*} data
 * @param {import('../../types.js').server_server_res} res 
 * @returns {Promise.<import('../../types.js').server_db_sql_result_user_account_deleteUser>}
 */
 const deleteUser = (app_id, resource_id, query, data, res) => {
    return new Promise((resolve, reject)=>{
        service.getUserByUserId(app_id, resource_id)
        .then(result_user=>{
            if (result_user[0]) {
                if (result_user[0].provider_id !=null){
                    service.deleteUser(app_id, resource_id)
                    .then(result_delete=>{
                        if (result_delete)
                            resolve(result_delete);
                        else{
                            import(`file://${process.cwd()}/server/db/common.service.js`)
                            .then((/**@type{import('../../db/common.service.js')} */{dbCommonRecordNotFound}) => {
                                dbCommonRecordNotFound(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                            });
                        }
                    })
                    .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
                }
                else{
                    service.checkPassword(app_id, resource_id)
                    .then(result_password=>{
                        if (result_password[0]) {
                            securityPasswordCompare(data.password, result_password[0].password).then((result_password)=>{
                                if (result_password){
                                    service.deleteUser(app_id, resource_id)
                                    .then(result_delete=>{
                                        if (result_delete)
                                            resolve(result_delete);
                                        else{
                                            import(`file://${process.cwd()}/server/db/common.service.js`)
                                            .then((/**@type{import('../../db/common.service.js')} */{dbCommonRecordNotFound}) => {
                                                dbCommonRecordNotFound(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                                            });
                                        }
                                    })
                                    .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
                                }
                                else{
                                    res.statusMessage = 'invalid password attempt for user id:' + resource_id;
                                    res.statusCode = 400;
                                    //invalid password
                                    getSettingDisplayData(  app_id,
                                                            serverUtilNumberValue(configGet('SERVER', 'APP_COMMON_APP_ID')), 
                                                            'MESSAGE',
                                                            '20401')
                                    .then(result_message=>{
                                        reject(result_message[0].display_data);
                                    })
                                    .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
                                } 
                            });
                            
                        }
                        else{
                            //user not found
                            res.statusCode = 404;
                            getSettingDisplayData(  app_id,
                                                    serverUtilNumberValue(configGet('SERVER', 'APP_COMMON_APP_ID')), 
                                                    'MESSAGE',
                                                    '20305')
                            .then(result_message=>{
                                reject(result_message[0].display_data);
                            })
                            .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
                        }
                    })
                    .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
                }
            }
            else{
                //user not found
                res.statusCode = 404;
                getSettingDisplayData(  app_id,
                                        serverUtilNumberValue(configGet('SERVER', 'APP_COMMON_APP_ID')), 
                                        'MESSAGE',
                                        '20305')
                .then(result_message=>{
                    reject(result_message[0].display_data);
                });
            }
        })
        .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
    });
};
/**
 * 
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*} query
 * @param {import('../../types.js').server_server_res} res 
 */
 const getProfileDetail = (app_id, resource_id, query, res) => {
    return new Promise((resolve, reject)=>{
        service.getProfileDetail(app_id, resource_id, serverUtilNumberValue(query.get('detailchoice')))
        .then(result=>{
            if (result)
                resolve(result);
            else {
                import(`file://${process.cwd()}/server/db/common.service.js`)
                .then((/**@type{import('../../db/common.service.js')} */{dbCommonRecordNotFound}) => {
                    dbCommonRecordNotFound(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
            }
        })
        .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
    });
    
};
/**
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*} data
 */
const follow = (app_id, resource_id, data) => user_account_follow_service.follow(app_id, resource_id, serverUtilNumberValue(data.user_account_id))
                                            .catch((/**@type{import('../../types.js').server_server_error}*/error)=>{throw error;});
/**
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*} data
 */
const unfollow = (app_id, resource_id, data) => user_account_follow_service.unfollow(app_id, resource_id, serverUtilNumberValue(data.user_account_id))
                                            .catch((/**@type{import('../../types.js').server_server_error}*/error)=>{throw error;});

/**
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} data
 */
const like = (app_id, resource_id, data) => user_account_like_service.like(app_id, resource_id, serverUtilNumberValue(data.user_account_id))
                                            .catch((/**@type{import('../../types.js').server_server_error}*/error)=>{throw error;});

/**
 * 
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*} data
 */
const unlike = (app_id, resource_id, data) => user_account_like_service.unlike(app_id, resource_id, serverUtilNumberValue(data.user_account_id))
                                            .catch((/**@type{import('../../types.js').server_server_error}*/error)=>{throw error;});

export {/*DATA_LOGIN*/
        login, login_provider, 
        /*DATA_SIGNUP*/
        signup, 
        /*DATA*/
        activate, forgot, getProfile, getProfileStat,
        /*ADMIN*/
        updateAdmin, getUsersAdmin, getStatCountAdmin,
        /*ACCESS*/
        updatePassword, updateUserLocal, updateUserCommon, getUserByUserId, deleteUser, getProfileDetail,
        follow, unfollow,
        like, unlike};
