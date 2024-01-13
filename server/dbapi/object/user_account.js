/** @module server/dbapi/object/user_account */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const service = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account.service.js`);


const { default: {compare} } = await import('bcrypt');
const { ConfigGet } = await import(`file://${process.cwd()}/server/config.service.js`);
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);
const { AuthorizeToken } = await import(`file://${process.cwd()}/server/iam.service.js`);

const { getParameter } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_parameter.service.js`);
const { getMessage } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_message.service.js`);
const { createUserAccountApp} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_app.service.js`);

const { insertUserAccountLogon, getUserAccountLogonAdmin } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_logon.service.js`);
const { getLastUserEvent, insertUserEvent } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_event.service.js`);

const user_account_follow_service = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_follow.service.js`);
const user_account_like_service = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_like.service.js`);
const { checked_error } = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);

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
    const { createMail} = await import(`file://${process.cwd()}/apps/apps.service.js`);
    const {BFF_microservices} = await import(`file://${process.cwd()}/server/bff.service.js`);
    
    /**@type{Types.email_return_data}*/
    const email_rendered = await createMail( app_id, 
                                    {
                                        'emailtype':        emailtype,
                                        'host':             ConfigGet('SERVER', 'HOST'),
                                        'app_user_id':      userid,
                                        'verificationCode': verification_code,
                                        'to':               email,
                                    })
                                    .catch((/**@type{Types.error}*/error)=>{throw error;});
        
        
    const data = {  app_id:app_id, 
                    service:'MAIL', 
                    ip:ip,
                    method:'POST', 
                    user_agent:user_agent,
                    accept_language:accept_language,
                    parameters:new Buffer('/sendemail?').toString('base64'),
                    body:email_rendered};
    return await BFF_microservices(data);
};

/**
 * 
 * @param {number} app_id
 * @param {string} ip
 * @param {string} user_agent
 * @param {string} accept_language
 * @param {*} query
 * @param {*} data
 * @param {Types.res} res
 */
const login = (app_id, ip, user_agent, accept_language, query, data, res) =>{
    return new Promise((resolve, reject)=>{
        /**@type{Types.db_parameter_user_account_userLogin} */
        const data_login =    {   username: data.username};
        service.userLogin(app_id, data_login)
        .then((/**@type{Types.db_result_user_account_userLogin[]}*/result_login)=>{
            if (result_login[0]) {
                compare(data.password, result_login[0].password).then((result_password)=>{
                    const data_body = { user_account_id:    getNumberValue(result_login[0].id),
                                        app_id:             app_id,
                                        result:             Number(result_password),
                                        client_ip:          ip,
                                        client_user_agent:  user_agent,
                                        client_longitude:   data.client_longitude ?? null,
                                        client_latitude:    data.client_latitude ?? null,
                                        access_token:       null};
                    if (result_password) {
                        if ((app_id == getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')) && (result_login[0].app_role_id == 0 || result_login[0].app_role_id == 1))||
                                app_id != ConfigGet('SERVER', 'APP_COMMON_APP_ID')){
                            createUserAccountApp(app_id, result_login[0].id)
                            .then(()=>{
                                //if user not activated then send email with new verification code
                                const new_code = service.verification_code();
                                if (result_login[0].active == 0){
                                    service.updateUserVerificationCode(app_id, result_login[0].id, new_code)
                                    .then(()=>{
                                        getParameter(app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),'SERVICE_MAIL_TYPE_UNVERIFIED')
                                        .then((/**@type{Types.db_result_app_parameter_getParameter[]}*/parameter)=>{
                                            //send email UNVERIFIED
                                            sendUserEmail(  app_id, 
                                                            parameter[0].parameter_value, 
                                                            ip, 
                                                            user_agent,
                                                            accept_language,
                                                            result_login[0].id, 
                                                            new_code, 
                                                            result_login[0].email)
                                            .then(()=>{
                                                data_body.access_token = AuthorizeToken(app_id, null, 'APP_ACCESS');
                                                insertUserAccountLogon(app_id, data_body)
                                                .then(()=>{
                                                    resolve({
                                                        accessToken: data_body.access_token,
                                                        items: Array(result_login[0])
                                                    });
                                                })
                                                .catch((/**@type{Types.error}*/error)=>reject(error));
                                            })
                                            .catch((/**@type{Types.error}*/error)=>reject(error));
                                        })
                                        .catch((/**@type{Types.error}*/error)=>reject(error));
                                    });
                                }
                                else{
                                    data_body.access_token = AuthorizeToken(app_id, null, 'APP_ACCESS');
                                    insertUserAccountLogon(app_id, data_body)
                                    .then(()=>{
                                        resolve({
                                            accessToken: data_body.access_token,
                                            items: Array(result_login[0])
                                        });
                                    })
                                    .catch((/**@type{Types.error}*/error)=>reject(error));
                                }
                            })
                            .catch((/**@type{Types.error}*/error)=>reject(error));
                        }
                        else{
                            res.statusMessage = 'unauthorized admin login attempt for user id:' + getNumberValue(result_login[0].id) + ', username:' + data_login.username;
                            res.statusCode = 401;
                            //unauthorized, only admin allowed to log in to admin
                            reject('⛔');
                        }
                        
                    } else {
                        insertUserAccountLogon(app_id, data_body)
                        .then(()=>{
                            res.statusMessage = 'invalid password attempt for user id:' + getNumberValue(result_login[0].id) + ', username:' + data_login.username;
                            res.statusCode = 400;
                            //Username or password not found
                            getMessage( app_id,
                                        getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                                        '20300',
                                        query.get('lang_code'))
                            .then((/**@type{Types.db_result_message_getMessage[]}*/result_message)=>{
                                reject(result_message[0].text);
                            })
                            .catch((/**@type{Types.error}*/error)=>reject(error));
                        })
                        .catch((/**@type{Types.error}*/error)=>reject(error));
                    }
                });
            } else{
                if (app_id == getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')))
                    res.statusMessage = 'admin user not found:' + data_login.username;
                else
                    res.statusMessage = 'user not found:' + data_login.username;
                res.statusCode = 404;
                //User not found
                getMessage( app_id,
                            getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                            '20305',
                            query.get('lang_code'))
                .then((/**@type{Types.db_result_message_getMessage[]}*/result_message)=>{
                    reject(result_message[0].text);
                })
                .catch((/**@type{Types.error}*/error)=>reject(error));
            }
        })
        .catch((/**@type{Types.error}*/error)=>reject(error));
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {string} ip 
 * @param {string} user_agent 
 * @param {*} query 
 * @param {*} data 
 * @param {Types.res} res
 */
const login_provider = (app_id, ip, user_agent, query, data, res) =>{
    return new Promise((resolve, reject)=>{
        service.providerSignIn(app_id, getNumberValue(data.identity_provider_id), getNumberValue(query.get('PUT_ID')))
        .then((/**@type{Types.db_result_user_account_providerSignIn[]}*/result_signin)=>{
            /** @type{Types.db_parameter_user_account_create} */
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
            const data_login = {user_account_id:        data.user_account_id,
                                result:                 1,
                                client_ip:              ip,
                                client_user_agent:      user_agent,
                                client_longitude:       data.client_longitude,
                                client_latitude:        data.client_latitude,
                                access_token:           null};
            if (result_signin.length > 0) {
                service.updateSigninProvider(app_id, result_signin[0].id, data_user)
                .then(()=>{
                    data_login.user_account_id = result_signin[0].id;
                    createUserAccountApp(app_id, result_signin[0].id)
                    .then(()=>{
                        data_login.access_token = AuthorizeToken(app_id, null, 'APP_ACCESS');
                        insertUserAccountLogon(app_id, data_login)
                        .then(()=>{
                            resolve({
                                accessToken: data_login.access_token,
                                items: result_signin,
                                userCreated: 0
                            });
                        })
                        .catch((/**@type{Types.error}*/error)=>reject(error));
                    })
                    .catch((/**@type{Types.error}*/error)=>reject(error));
                })
                .catch((/**@type{Types.error}*/error)=>{
                    checked_error(app_id, query.get('lang_code'), error, res).then((/**@type{string}*/message)=>reject(message));
                });            
            } else {
                //if provider user not found then create user and one user setting
                //avatar not used by providers, set default null
                data_user.avatar = data.avatar ?? null;
                data_user.provider_image = data.provider_image ?? null;
                service.create(app_id, data_user)
                .then((/**@type{Types.db_result_user_account_create} */result_create)=>{
                    data_login.user_account_id = result_create.insertId;
                        createUserAccountApp(app_id, result_create.insertId)
                        .then(()=>{
                            service.providerSignIn(app_id, getNumberValue(data.identity_provider_id), getNumberValue(query.get('PUT_ID')))
                            .then((/**@type{Types.db_result_user_account_providerSignIn[]}*/result_signin2)=>{
                                data_login.access_token = AuthorizeToken(app_id, null, 'APP_ACCESS');
                                insertUserAccountLogon(app_id, data_login)
                                .then(()=>{
                                    resolve({
                                        accessToken: data_login.access_token,
                                        items: result_signin2,
                                        userCreated: 1
                                    });
                                })
                                .catch((/**@type{Types.error}*/error)=>reject(error));
                            })
                            .catch((/**@type{Types.error}*/error)=>reject(error));
                        })
                        .catch((/**@type{Types.error}*/error)=>reject(error));
                })
                .catch((/**@type{Types.error}*/error)=>reject(error));
            }
        })
        .catch((/**@type{Types.error}*/error)=>reject(error));
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
 * @param {Types.res} res 
 * @returns 
 */
const signup = (app_id, ip, user_agent, accept_language, query, data, res) =>{
    return new Promise((resolve, reject)=>{
        /**@type{Types.db_parameter_user_account_create} */
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
        .then((/**@type{Types.db_result_user_account_create}*/result_create)=>{
            if (data.provider_id == null ) {
                //send email for local users only
                getParameter(app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),'SERVICE_MAIL_TYPE_SIGNUP')
                .then((/**@type{Types.db_result_app_parameter_getParameter[]}*/parameter)=>{
                    //send email SIGNUP
                    sendUserEmail(  app_id, 
                                    parameter[0].parameter_value, 
                                    ip, 
                                    user_agent,
                                    accept_language,
                                    result_create.insertId, 
                                    data_body.verification_code, 
                                    data_body.email ?? '')
                    .then(()=>{
                        resolve({
                            accessToken: AuthorizeToken(app_id, null, 'APP_ACCESS'),
                            id: result_create.insertId,
                            data: result_create
                        });
                    })
                    .catch((/**@type{Types.error}*/error)=>reject(error));
                })
                .catch((/**@type{Types.error}*/error)=>reject(error));
            }
            else
                resolve({
                    accessToken: AuthorizeToken(app_id, null, 'APP_ACCESS'),
                    id: result_create.insertId,
                    data: result_create
                });
        })
        .catch((/**@type{Types.error}*/error)=>{
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
 * @param {string} host 
 * @param {*} query 
 * @param {*} data 
 * @param {Types.res} res
 */
const activate = (app_id, ip, user_agent, accept_language, host, query, data, res) =>{
    return new Promise((resolve, reject)=>{
        /**@type{string|null} */
        let auth_password_new = null;
        if (getNumberValue(data.verification_type) == 3){
            //reset password
            auth_password_new = service.verification_code();
        }
        service.activateUser(app_id, getNumberValue(query.get('PUT_ID')), getNumberValue(data.verification_type), data.verification_code, auth_password_new)
        .then((/**@type{Types.db_result_user_account_activateUser}*/result_activate)=>{
            if (auth_password_new == null){
                if (result_activate.affectedRows==1 && getNumberValue(data.verification_type)==4){
                    //new email verified
                    /**@type{Types.db_parameter_user_account_event_insertUserEvent}*/
                    const eventData = {
                        user_account_id: getNumberValue(query.get('PUT_ID')) ?? 0,
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
                    .then((/**@type{Types.db_result_user_account_event_insertUserEvent}*/result_insert)=>{
                        resolve({
                            count: result_insert.affectedRows,
                            items: Array(result_insert)
                        });
                    })
                    .catch((/**@type{Types.error}*/error)=>reject(error));
                }
                else
                    resolve({
                        count: result_activate.affectedRows,
                        items: Array(result_activate)
                    });
            }
            else{
                //return accessToken since PASSWORD_RESET is in progress
                //email was verified and activated with data token, but now the password will be updated
                //using accessToken and authentication code
                resolve({
                    count: result_activate.affectedRows,
                    auth: auth_password_new,
                    accessToken: AuthorizeToken(app_id, null, 'APP_ACCESS'),
                    items: Array(result_activate)
                });
            }
        })
        .catch((/**@type{Types.error}*/error)=>{
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
            .then((/**@type{Types.db_result_user_account_getEmailUser[]}*/result_emailuser)=>{
                if (result_emailuser[0]){
                    getLastUserEvent(app_id, getNumberValue(result_emailuser[0].id), 'PASSWORD_RESET')
                    .then((/**@type{Types.db_result_user_account_event_getLastUserEvent[]}*/result_user_event)=>{
                        if (result_user_event[0] &&
                            result_user_event[0].status_name == 'INPROGRESS' &&
                            (+ new Date(result_user_event[0].current_timestamp) - + new Date(result_user_event[0].date_created))/ (1000 * 60 * 60 * 24) < 1)
                            resolve({sent: 0});
                        else{
                            /**@type{Types.db_parameter_user_account_event_insertUserEvent}*/
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
                                    getParameter(app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),'SERVICE_MAIL_TYPE_PASSWORD_RESET')
                                    .then((/**@type{Types.db_result_app_parameter_getParameter[]}*/parameter)=>{
                                        //send email PASSWORD_RESET
                                        sendUserEmail(  app_id, 
                                                        parameter[0].parameter_value, 
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
                                        .catch((/**@type{Types.error}*/error)=>reject(error));
                                    })
                                    .catch((/**@type{Types.error}*/error)=>reject(error));
                                })
                                .catch((/**@type{Types.error}*/error)=>reject(error));
                            })
                            .catch(()=> {
                                resolve({sent: 0});
                            });
                        }
                    })
                    .catch((/**@type{Types.error}*/error)=>reject(error));         
                }
                else
                    resolve({sent: 0});
            })
            .catch((/**@type{Types.error}*/error)=>reject(error));
        else
            resolve({sent: 0});
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {string} ip 
 * @param {string} user_agent 
 * @param {*} query 
 * @param {*} data
 * @param {Types.res} res
 * @returns 
 */
const getProfile = (app_id, ip, user_agent, query, data, res) =>{
    return new Promise((resolve, reject)=>{
        service.getProfileUser(app_id, getNumberValue(query.get('POST_ID')), getNumberValue(query.get('POST_ID'))==null?query.get('search'):null, getNumberValue(query.get('id')))
        .then((/**@type{Types.db_result_user_account_getProfileUser[]}*/result_getProfileUser)=>{
            if (result_getProfileUser[0]){
                if (result_getProfileUser[0].id == getNumberValue(query.get('id'))) {
                    //send without {} so the variablename is not sent
                    resolve(result_getProfileUser[0]);
                }
                else{
                    import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_view.service.js`).then(({ insertUserAccountView }) => {
                        const data_body = { user_account_id:        getNumberValue(query.get('POST_ID')),
                                                                    //set user id when username is searched
                                            user_account_id_view:   getNumberValue(query.get('POST_ID')) ?? result_getProfileUser[0].id,
                                            client_ip:              ip,
                                            client_user_agent:      user_agent,
                                            client_longitude:       data.client_longitude,
                                            client_latitude:        data.client_latitude};
                        insertUserAccountView(app_id, data_body)
                        .then(()=>{
                            //send without {} so the variablename is not sent
                            resolve(result_getProfileUser[0]);
                        })
                        .catch((/**@type{Types.error}*/error)=>reject(error));
                    });
                }
            }
            else{
                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
            }
        })
        .catch((/**@type{Types.error}*/error)=>reject(error));
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @param {Types.res} res
 */
const getProfileTop = (app_id, query, res) =>{
    return new Promise((resolve, reject)=>{
        service.getProfileTop(app_id, getNumberValue(query.get('statchoice')))
        .then((/**@type{Types.db_result_user_account_getProfileTop[]}*/result)=>{
            if (result)
                resolve(result);
            else {
                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
            }
        })
        .catch((/**@type{Types.error}*/error)=>reject(error));
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {string} ip 
 * @param {string} user_agent 
 * @param {*} query 
 * @param {*} data 
 * @returns 
 */
const searchProfile = (app_id, ip, user_agent, query, data) =>{
    return new Promise((resolve, reject)=>{
        service.searchProfileUser(app_id, query.get('search'))
        .then((/**@type{Types.db_result_user_account_searchProfileUser[]}*/result_search)=>{
            import(`file://${process.cwd()}/server/dbapi/app_portfolio/profile_search.service.js`).then(({ insertProfileSearch }) => {
                /**@type{Types.db_parameter_profile_search_insertProfileSearch} */
                const data_insert = {   user_account_id:    data.user_account_id,
                                        search:             query.get('search'),
                                        client_ip:          ip,
                                        client_user_agent:  user_agent,
                                        client_longitude:   data.client_longitude,
                                        client_latitude:    data.client_latitude};
                insertProfileSearch(app_id, data_insert)
                .then(()=>{
                    resolve(result_search);
                })
                .catch((/**@type{Types.error}*/error)=>reject(error));
            });
        })
        .catch((/**@type{Types.error}*/error)=>reject(error));
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @param {*} data
 * @param {Types.res} res
 */
const updateAdmin =(app_id, query, data, res) =>{
    return new Promise((resolve, reject)=>{
        // get avatar and provider column used to validate
        service.getUserByUserId(app_id, getNumberValue(query.get('PUT_ID')))
        .then((/**@type{Types.db_result_user_account_getUserByUserId[]}*/result_user)=>{
            if (result_user[0]) {
                /**@type{Types.db_parameter_user_account_updateUserSuperAdmin} */
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
                service.updateUserSuperAdmin(app_id, getNumberValue(query.get('PUT_ID')), body)
                .then((/**@type{Types.db_result_user_account_updateUserSuperAdmin}*/result_update)=>{
                    if (data.app_role_id!=0 && data.app_role_id!=1){
                        //delete admin app from user if user is not an admin anymore
                        import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_app.service.js`).then(({ deleteUserAccountApps }) => {
                            deleteUserAccountApps(app_id, getNumberValue(query.get('PUT_ID')), app_id)
                            .then(()=>{
                                resolve(result_update);
                            });
                        });
                    }
                    else
                        resolve(result_update);
                })
                .catch((/**@type{Types.error}*/error)=>{
                    checked_error(app_id, query.get('lang_code'), error, res).then((/**@type{string}*/message)=>reject(message));
                });
            }
            else{
                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
            }
        })
        .catch((/**@type{Types.error}*/error)=>reject(error));
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 */
const getUsersAdmin = (app_id, query) => service.getUsersAdmin(app_id, query.get('search'), query.get('sort'), query.get('order_by'), getNumberValue(query.get('offset')), getNumberValue(query.get('limit')))
                                            .catch((/**@type{Types.error}*/error)=>{throw error;});

/**
 * 
 * @param {number} app_id 
 * @returns 
 */
const getStatCountAdmin = (app_id) => service.getStatCountAdmin(app_id).catch((/**@type{Types.error}*/error)=>{throw error;});

/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 */
const getLogonAdmin =(app_id, query) => getUserAccountLogonAdmin(app_id, getNumberValue(query.get('data_user_account_id')), getNumberValue(query.get('data_app_id')=='\'\''?'':query.get('data_app_id')))
                                            .catch((/**@type{Types.error}*/error)=>{throw error;});
    
/**
 * 
 * @param {number} app_id 
 * @param {string} ip 
 * @param {string} user_agent 
 * @param {string} host 
 * @param {string} accept_language 
 * @param {*} query 
 * @param {*} data 
 * @param {Types.res} res
 */
 const updatePassword = (app_id, ip, user_agent, host, accept_language, query, data, res) => {
    return new Promise((resolve, reject)=>{
        /**@type{Types.db_parameter_user_account_updatePassword} */
        const data_update = {   password_new:   data.password_new,
                                auth:           data.auth};
        service.updatePassword(app_id, getNumberValue(query.get('PUT_ID')), data_update)
        .then((/**@type{Types.db_result_user_account_updatePassword}*/result_update)=>{
            if (result_update) {
                /**@type{Types.db_parameter_user_account_event_insertUserEvent}*/
                const eventData = {
                    user_account_id: getNumberValue(query.get('PUT_ID')),
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
                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
            }
        })
        .catch((/**@type{Types.error}*/error)=>{
            checked_error(app_id, query.get('lang_code'), error, res).then((/**@type{string}*/message)=>reject(message));
        });
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {string} ip
 * @param {string} user_agent
 * @param {string} host
 * @param {string} accept_language
 * @param {*} query 
 * @param {*} data 
 * @param {Types.res} res 
 */
 const updateUserLocal = async (app_id, ip, user_agent, host, accept_language, query, data, res) => {
    /**@type{Types.db_result_user_account_getUserByUserId[]}*/
    const result_user = await service.getUserByUserId(app_id, getNumberValue(query.get('PUT_ID')));
    /**@type{Types.db_result_user_account_event_getLastUserEvent[]}*/
    const result_user_event = await getLastUserEvent(app_id, getNumberValue(query.get('PUT_ID')), 'EMAIL_VERIFIED_CHANGE_EMAIL');
    return new Promise((resolve, reject)=>{
        if (result_user[0]) {
            compare(data.password, result_user[0].password ?? '').then((result_compare)=>{
                if (result_compare){
                    let send_email=false;
                    if (data.new_email && data.new_email!=''){
                        if ((result_user_event[0] && 
                            (+ new Date(result_user_event[0].current_timestamp) - + new Date(result_user_event[0].date_created))/ (1000 * 60 * 60 * 24) >= 1)||
                                result_user_event.length == 0)
                            send_email=true;
                    }
                    /**@type{Types.db_parameter_user_account_updateUserLocal} */
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
                    service.updateUserLocal(app_id, data_update, getNumberValue(query.get('PUT_ID')))
                    .then((/**@type{Types.db_result_user_account_updateUserLocal}*/result_update)=>{
                        if (result_update){
                            if (send_email){
                                //no change email in progress or older than at least 1 day
                                /**@type{Types.db_parameter_user_account_event_insertUserEvent}*/
                                const eventData = {
                                    user_account_id: getNumberValue(query.get('PUT_ID')),
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
                                    getParameter(app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),'SERVICE_MAIL_TYPE_CHANGE_EMAIL')
                                    .then((/**@type{Types.db_result_app_parameter_getParameter[]}*/parameter)=>{
                                        //send email SERVICE_MAIL_TYPE_CHANGE_EMAIL
                                        sendUserEmail(  app_id, 
                                                        parameter[0].parameter_value, 
                                                        ip, 
                                                        user_agent,
                                                        accept_language,
                                                        getNumberValue(query.get('PUT_ID')),
                                                        data.verification_code, 
                                                        data.new_email)
                                        .then(()=>{
                                            resolve({sent_change_email: 1});
                                        })
                                        .catch((/**@type{Types.error}*/error)=>reject(error));
                                    })
                                    .catch((/**@type{Types.error}*/error)=>reject(error));
                                })
                                .catch((/**@type{Types.error}*/error)=>reject(error));
                            }
                            else
                                resolve({sent_change_email: 0});
                        }
                        else{
                            import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                                record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                            });
                        }
                    })
                    .catch((/**@type{Types.error}*/error)=>{
                        checked_error(app_id, query.get('lang_code'), error, res).then((/**@type{string}*/message)=>reject(message));
                    });
                } 
                else {
                    res.statusCode=400;
                    res.statusMessage = 'invalid password attempt for user id:' + getNumberValue(query.get('PUT_ID'));
                    //invalid password
                    getMessage( app_id,
                                getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                                '20401',
                                query.get('lang_code'))
                    .then((/**@type{Types.db_result_message_getMessage[]}*/result_message)=>{
                        reject(result_message[0].text);
                    })
                    .catch((/**@type{Types.error}*/error)=>reject(error));
                }
            });
        } 
        else {
            //user not found
            res.statusCode=404;
            getMessage( app_id,
                        getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                        '20305',
                        query.get('lang_code'))
            .then((/**@type{Types.db_result_message_getMessage[]}*/result_message)=>{
                reject(result_message[0].text);
            })
            .catch((/**@type{Types.error}*/error)=>reject(error));
        }
    });
};
/**
 * 
 * @param {number} app_id
 * @param {*} query
 * @param {*} data
 * @param {Types.res} res
 */
 const updateUserCommon = (app_id, query, data, res) => {
    return new Promise((resolve, reject)=>{
        /**@type{Types.db_parameter_user_account_updateUserCommon} */
        const data_update = {   username:   data.username,
                                bio:        data.bio,
                                private:    data.private};
        service.updateUserCommon(app_id, data_update, getNumberValue(query.get('PUT_ID')))
        .then((/**@type{Types.db_result_user_account_updateUserCommon}*/result_update)=>{
            if (result_update)
                resolve(result_update);
            else{
                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
            }
        })
        .catch((/**@type{Types.error}*/error)=>{
            checked_error(app_id, query.get('lang_code'), error, res).then((/**@type{string}*/message)=>reject(message));
        });
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @param {Types.res} res 
 */
const getUserByUserId = (app_id, query, res) => {
    return new Promise((resolve, reject)=>{
        service.getUserByUserId(app_id, getNumberValue(query.get('user_account_id')))
        .then((/**@type{Types.db_result_user_account_getUserByUserId[]}*/result)=>{
            if (result[0])
                resolve(result[0]);
            else{
                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
            }
        })
        .catch((/**@type{Types.error}*/error)=>reject(error));
    });
};
/**
 * 
 * @param {number} app_id
 * @param {*} query
 * @param {*} data
 * @param {Types.res} res 
 */
 const deleteUser = (app_id, query, data, res) => {
    return new Promise((resolve, reject)=>{
        service.getUserByUserId(app_id, getNumberValue(query.get('DELETE_ID')))
        .then((/**@type{Types.db_result_user_account_getUserByUserId[]}*/result_user)=>{
            if (result_user[0]) {
                if (result_user[0].provider_id !=null){
                    service.deleteUser(app_id, getNumberValue(query.get('DELETE_ID')))
                    .then((/**@type{Types.db_result_user_account_deleteUser}*/result_delete)=>{
                        if (result_delete)
                            resolve(result_delete);
                        else{
                            import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                                record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                            });
                        }
                    })
                    .catch((/**@type{Types.error}*/error)=>reject(error));
                }
                else{
                    service.checkPassword(app_id, getNumberValue(query.get('DELETE_ID')))
                    .then((/**@type{Types.db_result_user_account_checkPassword[]}*/result_password)=>{
                        if (result_password[0]) {
                            compare(data.password, result_password[0].password).then((result_password)=>{
                                if (result_password){
                                    service.deleteUser(app_id, getNumberValue(query.get('DELETE_ID')))
                                    .then((/**@type{Types.db_result_user_account_deleteUser}*/result_delete)=>{
                                        if (result_delete)
                                            resolve(result_delete);
                                        else{
                                            import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                                                record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                                            });
                                        }
                                    })
                                    .catch((/**@type{Types.error}*/error)=>reject(error));
                                }
                                else{
                                    res.statusMessage = 'invalid password attempt for user id:' + getNumberValue(query.get('DELETE_ID'));
                                    res.statusCode = 400;
                                    //invalid password
                                    getMessage( app_id,
                                                getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                                                '20401',
                                                query.get('lang_code'))
                                    .then((/**@type{Types.db_result_message_getMessage[]}*/result_message)=>{
                                        reject(result_message[0].text);
                                    })
                                    .catch((/**@type{Types.error}*/error)=>reject(error));
                                } 
                            });
                            
                        }
                        else{
                            //user not found
                            res.statusCode = 404;
                            getMessage( app_id,
                                        getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                                        '20305',
                                        query.get('lang_code'))
                            .then((/**@type{Types.db_result_message_getMessage[]}*/result_message)=>{
                                reject(result_message[0].text);
                            })
                            .catch((/**@type{Types.error}*/error)=>reject(error));
                        }
                    })
                    .catch((/**@type{Types.error}*/error)=>reject(error));
                }
            }
            else{
                //user not found
                res.statusCode = 404;
                getMessage( app_id,
                            getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                            '20305',
                            query.get('lang_code'))
                .then((/**@type{Types.db_result_message_getMessage[]}*/result_message)=>{
                    reject(result_message[0].text);
                });
            }
        })
        .catch((/**@type{Types.error}*/error)=>reject(error));
    });
};
/**
 * 
 * @param {number} app_id
 * @param {*} query
 * @param {Types.res} res 
 */
 const getProfileDetail = (app_id, query, res) => {
    return new Promise((resolve, reject)=>{
        service.getProfileDetail(app_id, getNumberValue(query.get('user_account_id')), getNumberValue(query.get('detailchoice')))
        .then((/**@type{Types.db_result_user_account_getProfileDetail[]}*/result)=>{
            if (result)
                resolve(result);
            else {
                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
            }
        })
        .catch((/**@type{Types.error}*/error)=>reject(error));
    });
    
};
/**
 * @param {number} app_id
 * @param {*} query 
 * @param {*} data
 */
const follow = (app_id, query, data) => user_account_follow_service.follow(app_id, getNumberValue(query.get('POST_ID')),getNumberValue(data.user_account_id))
                                            .catch((/**@type{Types.error}*/error)=>{throw error;});
/**
 * @param {number} app_id
 * @param {*} query 
 * @param {*} data
 */
const unfollow = (app_id, query, data) => user_account_follow_service.unfollow(app_id, getNumberValue(query.get('DELETE_ID')),getNumberValue(data.user_account_id))
                                            .catch((/**@type{Types.error}*/error)=>{throw error;});

/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @param {*} data
 */
const like = (app_id, query, data) => user_account_like_service.like(app_id, getNumberValue(query.get('POST_ID')), getNumberValue(data.user_account_id))
                                            .catch((/**@type{Types.error}*/error)=>{throw error;});

/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @param {*} data
 */
const unlike = (app_id, query, data) => user_account_like_service.unlike(app_id, getNumberValue(query.get('DELETE_ID')), getNumberValue(data.user_account_id))
                                            .catch((/**@type{Types.error}*/error)=>{throw error;});

export {/*DATA_LOGIN*/
        login, login_provider, 
        /*DATA_SIGNUP*/
        signup, 
        /*DATA*/
        activate, forgot, getProfile, getProfileTop, 
        /*DATA + ACCESS*/
        searchProfile, 
        /*ADMIN*/
        updateAdmin, getUsersAdmin, getStatCountAdmin, getLogonAdmin,
        /*ACCESS*/
        updatePassword, updateUserLocal, updateUserCommon, getUserByUserId, deleteUser, getProfileDetail,
        follow, unfollow,
        like, unlike};
