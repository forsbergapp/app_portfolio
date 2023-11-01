/** @module server/dbapi/app_portfolio/user_account */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../../types.js';

const service = await import('./user_account.service.js');
const { default: {compareSync} } = await import('bcryptjs');
const { ConfigGet } = await import(`file://${process.cwd()}/server/server.service.js`);
const { getMessage } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/message_translation/message_translation.service.js`);
const { createUserAccountApp } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_app/user_account_app.service.js`);
const { getLastUserEvent, insertUserEvent } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_event/user_account_event.service.js`);
const { insertUserAccountLogon } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_logon/user_account_logon.service.js`);
const { getParameter } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_parameter/app_parameter.service.js`);

const { accessToken } = await import(`file://${process.cwd()}/server/auth/auth.service.js`);
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {string} emailtype 
 * @param {string} host 
 * @param {number} userid 
 * @param {string|null} verification_code 
 * @param {string} email 
 * @param {Types.callBack} callBack 
 */
const sendUserEmail = async (app_id, emailtype, host, userid, verification_code, email, callBack) => {
    const { createMail} = await import(`file://${process.cwd()}/apps/apps.service.js`);
    const { MessageQueue } = await import(`file://${process.cwd()}/service/service.service.js`);
    
    createMail(app_id, 
        {
            'emailtype':        emailtype,
            'host':             host,
            'app_user_id':      userid,
            'verificationCode': verification_code,
            'to':               email,
        }).then((/**@type{Types.email_return_data}*/email)=>{
            MessageQueue('MAIL', 'PUBLISH', email, null)
            .then(()=>{
                callBack(null, null);
            })
            .catch((/**@type{Types.error}*/error)=>{
                callBack(error, null);
            });
        })
        .catch((/**@type{Types.error}*/error)=>{
            callBack(error, null);
        });
};
/**
 * 
 * @param {number} app_id 
 * @param {string} lang_code 
 * @param {Types.error} err 
 * @param {Types.res} res 
 */
 const checked_error = (app_id, lang_code, err, res) =>{
    import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({ get_app_code }) => {
        const app_code = get_app_code(  err.errorNum, 
                                        err.message, 
                                        err.code, 
                                        err.errno, 
                                        err.sqlMessage);
        if (app_code != null){
            getMessage( app_id,
                        getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                        app_code, 
                        lang_code)
            .then((/**@type{Types.db_result_message_translation_getMessage[]}*/result_message)=>{
                res.status(400).send(
                    result_message[0].text
                );
            })
            .catch((/**@type{Types.error}*/error)=>{
                res.status(500).send(
                    error
                );
            });
        }
        else
            res.status(500).send(
                err
            );
    });
};
/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const getUsersAdmin = (req, res) => {
    service.getUsersAdmin(getNumberValue(req.query.app_id), req.query.search, getNumberValue(req.query.sort), req.query.order_by, getNumberValue(req.query.offset), getNumberValue(req.query.limit))
    .then((/**@type{Types.db_result_user_account_getUsersAdmin[]}*/result)=>{
        res.status(200).json({
            data: result
        });
    })
    .catch((/**@type{Types.error}*/error)=>{
        res.status(500).send(
            error
        );
    });
};
/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const getStatCountAdmin = (req, res) => {
    service.getStatCountAdmin(getNumberValue(req.query.app_id))
    .then((/**@type{Types.db_result_user_account_getStatCountAdmin[]}*/result)=>{
        res.status(200).json({
            data: result
        });
    })
    .catch((/**@type{Types.error}*/error)=>{
        res.status(500).send(
            error
        );
    });
};

/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const updateUserSuperAdmin = (req, res) => {
    // get avatar and provider column used to validate
    service.getUserByUserId(getNumberValue(req.query.app_id), getNumberValue(req.params.id))
    .then((/**@type{Types.db_result_user_account_getUserByUserId[]}*/result_user)=>{
        if (result_user[0]) {
            /**@type{Types.db_parameter_user_account_updateUserSuperAdmin} */
            const data = {  app_role_id:        getNumberValue(req.body.app_role_id),
                            active:             getNumberValue(req.body.active),
                            user_level:         getNumberValue(req.body.user_level),
                            private:            getNumberValue(req.body.private),
                            username:           req.body.username,
                            bio:                req.body.bio,
                            email:              req.body.email,
                            email_unverified:   req.body.email_unverified,
                            password:           null,
                            password_new:       req.body.password_new==''?null:req.body.password_new,
                            password_reminder:  req.body.password_reminder,
                            verification_code:  req.body.verification_code,
                            provider_id:        result_user[0].provider_id,
                            avatar:             result_user[0].avatar,
                            admin:              1};
            service.updateUserSuperAdmin(getNumberValue(req.query.app_id), getNumberValue(req.params.id), data)
            .then((/**@type{Types.db_result_user_account_updateUserSuperAdmin}*/result_update)=>{
                if (req.body.app_role_id!=0 && req.body.app_role_id!=1){
                    //delete admin app from user if user is not an admin anymore
                    import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_app/user_account_app.service.js`).then(({ deleteUserAccountApps }) => {
                        deleteUserAccountApps(getNumberValue(req.query.app_id), getNumberValue(req.params.id), getNumberValue(req.query.app_id))
                        .then(()=>{
                            res.status(200).json({
                                data: result_update
                            });
                        })
                        .catch((/**@type{Types.error}*/error)=>{
                            res.status(500).send(
                                error
                            );
                        }); 
                    });
                }
                else
                    res.status(200).json({
                        data: result_update
                    });
            })
            .catch((/**@type{Types.error}*/error)=>{
                checked_error(getNumberValue(req.query.app_id), req.query.lang_code, error, res);
            });
        }
        else
            import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
            });
    })
    .catch((/**@type{Types.error}*/error)=>{
        res.status(500).send(
            error
        );
    });
    
};
/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const userSignup = (req, res) => {
    /**@type{string|null} */
    let verification_code = null;
    if (typeof req.body.provider_id == 'undefined') {
        //generate verification code for local users only
        verification_code = service.verification_code();
    }
    /**@type{Types.db_parameter_user_account_create} */
    const data = {  bio:                    req.body.bio,
                    private:                req.body.private,
                    user_level:             req.body.user_level,
                    username:               req.body.username,
                    password:               null,
                    password_new:           req.body.password,
                    password_reminder:      req.body.password_reminder,
                    email:                  req.body.email,
                    email_unverified:       null,
                    avatar:                 req.body.avatar,
                    verification_code:      verification_code,
                    active:                 getNumberValue(req.body.active),
                    identity_provider_id:   getNumberValue(req.body.identity_provider_id),
                    provider_id:            req.body.provider_id ?? null,
                    provider_first_name:    req.body.provider_first_name,
                    provider_last_name:     req.body.provider_last_name,
                    provider_image:         req.body.provider_image,
                    provider_image_url:     req.body.provider_image_url,
                    provider_email:         req.body.provider_email,
                    admin:                  0
                };
    service.create(getNumberValue(req.query.app_id), data)
    .then((/**@type{Types.db_result_user_account_create}*/result_create)=>{
        if (data.provider_id == null ) {
            //send email for local users only
            getParameter(getNumberValue(req.query.app_id), getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),'SERVICE_MAIL_TYPE_SIGNUP')
            .then((/**@type{Types.db_result_app_parameter_getParameter[]}*/parameter)=>{
                //send email SIGNUP
                sendUserEmail(  getNumberValue(req.query.app_id), 
                                parameter[0].parameter_value, 
                                req.headers.host, 
                                result_create.insertId, 
                                verification_code, 
                                req.body.email, 
                                (/**@type{Types.error}*/err)=>{
                    if (err) {
                        res.status(500).send(
                            err
                        );
                    } 
                    else
                        res.status(200).json({
                            accessToken: accessToken(getNumberValue(req.query.app_id)),
                            id: result_create.insertId,
                            data: result_create
                        });
                });  
            })
            .catch((/**@type{Types.error}*/error)=>{
                res.status(500).send(
                    error
                );
            });
        }
        else
            res.status(200).json({
                accessToken: accessToken(getNumberValue(req.query.app_id)),
                id: result_create.insertId,
                data: result_create
            });
    })
    .catch((/**@type{Types.error}*/error)=>{
        checked_error(getNumberValue(req.query.app_id), req.query.lang_code, error, res);
    });
};
/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const activateUser = (req, res) => {
    /**@type{string|null} */
    let auth_password_new = null;
    if (getNumberValue(req.body.verification_type) == 3){
        //reset password
        auth_password_new = service.verification_code();
    }
    service.activateUser(getNumberValue(req.query.app_id), getNumberValue(req.params.id), getNumberValue(req.body.verification_type), req.body.verification_code, auth_password_new)
    .then((/**@type{Types.db_result_user_account_activateUser}*/result_activate)=>{
        if (auth_password_new == null){
            if (result_activate.affectedRows==1 && getNumberValue(req.body.verification_type)==4){
                //new email verified
                /**@type{Types.db_parameter_user_account_event_insertUserEvent}*/
                const eventData = {
                    user_account_id: getNumberValue(req.params.id),
                    event: 'EMAIL_VERIFIED_CHANGE_EMAIL',
                    event_status: 'SUCCESSFUL',
                    user_language: req.body.user_language,
                    user_timezone: req.body.user_timezone,
                    user_number_system: req.body.user_number_system,
                    user_platform: req.body.user_platform,
                    server_remote_addr : req.ip,
                    server_user_agent : req.headers['user-agent'],
                    server_http_host : req.headers.host,
                    server_http_accept_language : req.headers['accept-language'],
                    client_latitude : req.body.client_latitude,
                    client_longitude : req.body.client_longitude
                };
                insertUserEvent(getNumberValue(req.query.app_id), eventData)
                .then((/**@type{Types.db_result_user_account_event_insertUserEvent}*/result_insert)=>{
                    res.status(200).json({
                        count: result_insert.affectedRows,
                        items: Array(result_insert)
                    });
                })
                .catch((/**@type{Types.error}*/error)=> {
                    res.status(500).send(
                        error
                    );
                });
            }
            else
                res.status(200).json({
                    count: result_activate.affectedRows,
                    items: Array(result_activate)
                });
        }
        else{
            //return accessToken since PASSWORD_RESET is in progress
            //email was verified and activated with data token, but now the password will be updated
            //using accessToken and authentication code
            res.status(200).json({
                count: result_activate.affectedRows,
                auth: auth_password_new,
                accessToken: accessToken(getNumberValue(req.query.app_id)),
                items: Array(result_activate)
            });
        }
    })
    .catch((/**@type{Types.error}*/error)=>{
        checked_error(getNumberValue(req.query.app_id), req.query.lang_code, error, res);
    });        
};
/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const passwordResetUser = async (req, res) => {
    const email = req.body.email ?? '';
    if (email !='')
        service.getEmailUser(getNumberValue(req.query.app_id), email)
        .then((/**@type{Types.db_result_user_account_getEmailUser[]}*/result_emailuser)=>{
            if (result_emailuser[0]){
                getLastUserEvent(getNumberValue(req.query.app_id), getNumberValue(result_emailuser[0].id), 'PASSWORD_RESET')
                .then((/**@type{Types.db_result_user_account_event_getLastUserEvent[]}*/result_user_event)=>{
                    if (result_user_event[0] &&
                        result_user_event[0].status_name == 'INPROGRESS' &&
                        (+ new Date(result_user_event[0].current_timestamp) - + new Date(result_user_event[0].date_created))/ (1000 * 60 * 60 * 24) < 1)
                        res.status(200).json({
                            sent: 0
                        });
                    else{
                        /**@type{Types.db_parameter_user_account_event_insertUserEvent}*/
                        const eventData = {
                                            user_account_id: result_emailuser[0].id,
                                            event: 'PASSWORD_RESET',
                                            event_status: 'INPROGRESS',
                                            user_language: req.body.user_language,
                                            user_timezone: req.body.user_timezone,
                                            user_number_system: req.body.user_number_system,
                                            user_platform: req.body.user_platform,
                                            server_remote_addr : req.ip,
                                            server_user_agent : req.headers['user-agent'],
                                            server_http_host : req.headers.host,
                                            server_http_accept_language : req.headers['accept-language'],
                                            client_latitude : req.body.client_latitude,
                                            client_longitude : req.body.client_longitude
                                        };
                        insertUserEvent(getNumberValue(req.query.app_id), eventData)
                        .then(()=>{
                            const new_code = service.verification_code();
                            service.updateUserVerificationCode(getNumberValue(req.query.app_id), result_emailuser[0].id, new_code)
                            .then(()=>{
                                getParameter(getNumberValue(req.query.app_id), getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),'SERVICE_MAIL_TYPE_PASSWORD_RESET')
                                .then((/**@type{Types.db_result_app_parameter_getParameter[]}*/parameter)=>{
                                    //send email PASSWORD_RESET
                                    sendUserEmail(  getNumberValue(req.query.app_id), 
                                                    parameter[0].parameter_value, 
                                                    req.headers.host, 
                                                    result_emailuser[0].id, 
                                                    new_code, 
                                                    email, 
                                                    (/**@type{Types.error}*/err)=>{
                                        if (err) {
                                            res.status(500).send(
                                                err
                                            );
                                        } 
                                        else
                                            res.status(200).json({
                                                sent: 1,
                                                id: result_emailuser[0].id
                                            });  
                                    });
                                })
                                .catch((/**@type{Types.error}*/error)=>{
                                    res.status(500).send(
                                        error
                                    );
                                });
                            })
                            .catch((/**@type{Types.error}*/error)=>{
                                res.status(500).send(
                                    error
                                );
                            });
                        })
                        .catch(()=> {
                            res.status(200).json({
                                sent: 0
                            });
                        });
                    }
                })            
                .catch((/**@type{Types.error}*/error)=>{
                    res.status(500).send(
                        error
                    );
                });
            }
            else
                res.status(200).json({
                    sent: 0
                });
        })
        .catch((/**@type{Types.error}*/error)=>{
            res.status(500).send(
                error
            );
        });            
    else
        res.status(200).json({
            sent: 0
        });
    
};
/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const getUserByUserId = (req, res) => {
    service.getUserByUserId(getNumberValue(req.query.app_id), getNumberValue(req.params.id))
    .then((/**@type{Types.db_result_user_account_getUserByUserId[]}*/result)=>{
        if (result[0]) {
            //send without {} so the variablename is not sent
            res.status(200).json(
                result[0]
            );
        }
        else{
            import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
            });
        }
    })
    .catch((/**@type{Types.error}*/error)=>{
        res.status(500).send(
            error
        );
    });
};
/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const getProfileUser = (req, res) => {
    service.getProfileUser(getNumberValue(req.query.app_id), getNumberValue(req.params.id), getNumberValue(req.params.id)==null?req.query.search:null, getNumberValue(req.query.id))
    .then((/**@type{Types.db_result_user_account_getProfileUser[]}*/result_getProfileUser)=>{
        if (result_getProfileUser[0]){
            if (result_getProfileUser[0].id == getNumberValue(req.query.id)) {
                //send without {} so the variablename is not sent
                res.status(200).json(
                    result_getProfileUser[0]
                );
            }
            else{
                import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_view/user_account_view.service.js`).then(({ insertUserAccountView }) => {
                    const data = {  user_account_id:        getNumberValue(req.params.id),
                                                            //set user id when username is searched
                                    user_account_id_view:   getNumberValue(req.params.id) ?? result_getProfileUser[0].id,
                                    client_ip:              req.ip,
                                    client_user_agent:      req.headers['user-agent'],
                                    client_longitude:       req.body.client_longitude,
                                    client_latitude:        req.body.client_latitude};
                    insertUserAccountView(getNumberValue(req.query.app_id), data)
                    .then(()=>{
                        //send without {} so the variablename is not sent
                        res.status(200).json(
                            result_getProfileUser[0]
                        );
                    })
                    .catch((/**@type{Types.error}*/error)=>{
                        res.status(500).send(
                            error
                        );
                    });
                });
            }
        }
        else{
            import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
            });
        }
    })
    .catch((/**@type{Types.error}*/error)=>{
        res.status(500).send(
            error
        );
    });
};
/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const searchProfileUser = (req, res) => {
    service.searchProfileUser(getNumberValue(req.query.app_id), req.query.search)
    .then((/**@type{Types.db_result_user_account_searchProfileUser[]}*/result_search)=>{
        import(`file://${process.cwd()}/server/dbapi/app_portfolio/profile_search/profile_search.service.js`).then(({ insertProfileSearch }) => {
            /**@type{Types.db_parameter_profile_search_insertProfileSearch} */
            const data = {  user_account_id:    req.body.user_account_id,
                            search:             req.query.search,
                            client_ip:          req.ip,
                            client_user_agent:  req.headers['user-agent'],
                            client_longitude:   req.body.client_longitude,
                            client_latitude:    req.body.client_latitude};
            insertProfileSearch(getNumberValue(req.query.app_id), data)
            .then(()=>{
                if (result_search.length>0)
                    res.status(200).json({
                        count: result_search.length,
                        items: result_search
                    });
                else {
                    //return silent message if not found, no popup message
                    res.status(200).json({
                        count: 0,
                        items: null
                    });
                }
            })
            .catch((/**@type{Types.error}*/error)=>{
                res.status(500).send(
                    error
                );
            });
        });
    })
    .catch((/**@type{Types.error}*/error)=>{
        res.status(500).send(
            error
        );
    });
};
/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const getProfileDetail = (req, res) => {
    service.getProfileDetail(getNumberValue(req.query.app_id), getNumberValue(req.params.id), getNumberValue(req.query.detailchoice))
    .then((/**@type{Types.db_result_user_account_getProfileDetail[]}*/result)=>{
        if (result)
            res.status(200).json({
                count: result.length,
                items: result
            });
        else {
            import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
            });
        }
    })
    .catch((/**@type{Types.error}*/error)=>{
        res.status(500).send(
            error
        );
    });
};
/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const getProfileTop = (req, res) => {
    service.getProfileTop(getNumberValue(req.query.app_id), getNumberValue(req.params.statchoice))
    .then((/**@type{Types.db_result_user_account_getProfileTop[]}*/result)=>{
        if (result)
            res.status(200).json({
                count: result.length,
                items: result
            });
        else {
            import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
            });
        }
    })
    .catch((/**@type{Types.error}*/error)=>{
        res.status(500).send(
            error
        );
    });
};
/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const updateUserLocal = async (req, res) => {
    try{
        // get provider column used to validate and password to compare
        /**@type{Types.db_result_user_account_getUserByUserId[]}*/
        const result_user = await service.getUserByUserId(getNumberValue(req.query.app_id), getNumberValue(req.params.id));
        if (result_user[0]) {
            if (compareSync(req.body.password, result_user[0].password ?? '')){
                let send_email=false;
                if (req.body.new_email && req.body.new_email!=''){
                    /**@type{Types.db_result_user_account_event_getLastUserEvent[]}*/
                    const result_user_event = await getLastUserEvent(getNumberValue(req.query.app_id), getNumberValue(req.params.id), 'EMAIL_VERIFIED_CHANGE_EMAIL');
                    if ((result_user_event[0] && 
                        (+ new Date(result_user_event[0].current_timestamp) - + new Date(result_user_event[0].date_created))/ (1000 * 60 * 60 * 24) >= 1)||
                            result_user_event.length == 0)
                        send_email=true;
                }
                /**@type{Types.db_parameter_user_account_updateUserLocal} */
                const data = {  bio:                req.body.bio,
                                private:            req.body.private,
                                username:           req.body.username,
                                password:           req.body.password,
                                password_new:       (req.body.password_new && req.body.password_new!='')==true?req.body.password_new:null,
                                password_reminder:  (req.body.password_reminder && req.body.password_reminder!='')==true?req.body.password_reminder:null,
                                email:              req.body.email,
                                email_unverified:   (req.body.new_email && req.body.new_email!='')==true?req.body.new_email:null,
                                avatar:             req.body.avatar,
                                verification_code:  send_email==true?service.verification_code():null,
                                provider_id:        result_user[0].provider_id,
                                admin:              0
                            };
                service.updateUserLocal(getNumberValue(req.query.app_id), data, getNumberValue(req.params.id))
                .then((/**@type{Types.db_result_user_account_updateUserLocal}*/result_update)=>{
                    if (result_update){
                        if (send_email){
                            //no change email in progress or older than at least 1 day
                            /**@type{Types.db_parameter_user_account_event_insertUserEvent}*/
                            const eventData = {
                                user_account_id: getNumberValue(req.params.id),
                                event: 'EMAIL_VERIFIED_CHANGE_EMAIL',
                                event_status: 'INPROGRESS',
                                user_language: req.body.user_language,
                                user_timezone: req.body.user_timezone,
                                user_number_system: req.body.user_number_system,
                                user_platform: req.body.user_platform,
                                server_remote_addr : req.ip,
                                server_user_agent : req.headers['user-agent'],
                                server_http_host : req.headers.host,
                                server_http_accept_language : req.headers['accept-language'],
                                client_latitude : req.body.client_latitude,
                                client_longitude : req.body.client_longitude
                            };
                            insertUserEvent(getNumberValue(req.query.app_id), eventData)
                            .then(()=>{
                                getParameter(getNumberValue(req.query.app_id), getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),'SERVICE_MAIL_TYPE_CHANGE_EMAIL')
                                .then((/**@type{Types.db_result_app_parameter_getParameter[]}*/parameter)=>{
                                    //send email SERVICE_MAIL_TYPE_CHANGE_EMAIL
                                    sendUserEmail(  getNumberValue(req.query.app_id), 
                                                    parameter[0].parameter_value, 
                                                    req.headers.host, 
                                                    getNumberValue(req.params.id), 
                                                    data.verification_code, 
                                                    req.body.new_email, 
                                                    (/**@type{Types.error}*/err)=>{
                                        if (err)
                                            res.status(500).send(
                                                err
                                            );
                                        else
                                            res.status(200).json({
                                                sent_change_email: 1
                                            });
                                    });
                                });
                            });
                        }
                        else
                            res.status(200).json({
                                sent_change_email: 0
                            });
                    }
                    else{
                        import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                            record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
                        });
                    }
                })
                .catch((/**@type{Types.error}*/error)=>{
                    checked_error(req.query.app_id, req.query.lang_code, error, res);
                });
            } 
            else {
                res.statusMessage = 'invalid password attempt for user id:' + req.params.id;
                //invalid password
                getMessage( getNumberValue(req.query.app_id),
                            getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                            '20401',
                            req.query.lang_code)
                .then((/**@type{Types.db_result_message_translation_getMessage[]}*/result_message)=>{
                    res.status(400).send(
                        result_message[0].text
                    );
                });
            }
        } 
        else {
            //user not found
            getMessage( getNumberValue(req.query.app_id),
                        getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                        '20305',
                        req.query.lang_code)
            .then((/**@type{Types.db_result_message_translation_getMessage[]}*/result_message)=>{
                res.status(404).send(
                    result_message[0].text
                );
            });
        }    
    }
    catch (/**@type{Types.error}*/error){
        res.status(500).send(
            error
        );
    }
};
/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const updatePassword = (req, res) => {    
    /**@type{Types.db_parameter_user_account_updatePassword} */
    const data = {                  
                    password_new:   req.body.password_new,
                    auth:           req.body.auth};
    service.updatePassword(getNumberValue(req.query.app_id), getNumberValue(req.params.id), data)
    .then((/**@type{Types.db_result_user_account_updatePassword}*/result_update)=>{
        if (result_update) {
            /**@type{Types.db_parameter_user_account_event_insertUserEvent}*/
            const eventData = {
                user_account_id: getNumberValue(req.params.id),
                event: 'PASSWORD_RESET',
                event_status: 'SUCCESSFUL',
                user_language: req.body.user_language,
                user_timezone: req.body.user_timezone,
                user_number_system: req.body.user_number_system,
                user_platform: req.body.user_platform,
                server_remote_addr : req.ip,
                server_user_agent : req.headers['user-agent'],
                server_http_host : req.headers.host,
                server_http_accept_language : req.headers['accept-language'],
                client_latitude : req.body.client_latitude,
                client_longitude : req.body.client_longitude
            };
            insertUserEvent(getNumberValue(req.query.app_id), eventData)
            .then(()=>{
                res.status(200).send(
                    result_update
                );
            })
            .catch(()=> {
                res.status(200).json({
                    sent: 0
                });
            });
        }
        else{
            import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
            });
        }
    })
    .catch((/**@type{Types.error}*/error)=>{
        checked_error(req.query.app_id, req.query.lang_code, error, res);
    });
};
/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const updateUserCommon = (req, res) => {
    /**@type{Types.db_parameter_user_account_updateUserCommon} */
    const data = {  username:   req.body.username,
                    bio:        req.body.bio,
                    private:    req.body.private};
    service.updateUserCommon(getNumberValue(req.query.app_id), data, getNumberValue(req.params.id))
    .then((/**@type{Types.db_result_user_account_updateUserCommon}*/result_update)=>{
        if (result_update) {
            res.status(200).send(
                result_update
            );
        }
        else{
            import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
            });
        }
    })
    .catch((/**@type{Types.error}*/error)=>{
        checked_error(req.query.app_id, req.query.lang_code, error, res);
    });
};
/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const deleteUser = (req, res) => {
    service.getUserByUserId(getNumberValue(req.query.app_id), getNumberValue(req.params.id))
    .then((/**@type{Types.db_result_user_account_getUserByUserId[]}*/result_user)=>{
        if (result_user[0]) {
            if (result_user[0].provider_id !=null){
                service.deleteUser(getNumberValue(req.query.app_id), getNumberValue(req.params.id))
                .then((/**@type{Types.db_result_user_account_deleteUser}*/result_delete)=>{
                    if (result_delete) {
                        res.status(200).send(
                            result_delete
                        );
                    }
                    else{
                        import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                            record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
                        });
                    }
                })
                .catch((/**@type{Types.error}*/error)=>{
                    res.status(500).send(
                        error
                    );
                });
            }
            else{
                service.checkPassword(getNumberValue(req.query.app_id), getNumberValue(req.params.id))
                .then((/**@type{Types.db_result_user_account_checkPassword[]}*/result_password)=>{
                    if (result_password[0]) {
                        if (compareSync(req.body.password, result_password[0].password)){
                            service.deleteUser(getNumberValue(req.query.app_id), getNumberValue(req.params.id))
                            .then((/**@type{Types.db_result_user_account_deleteUser}*/result_delete)=>{
                                if (result_delete) {
                                    res.status(200).send(
                                        result_delete
                                    );
                                }
                                else{
                                    import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                                        record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
                                    });
                                }
                            })
                            .catch((/**@type{Types.error}*/error)=>{
                                res.status(500).send(
                                    error
                                );
                            });
                        }
                        else{
                            res.statusMessage = 'invalid password attempt for user id:' + req.params.id;
                            //invalid password
                            getMessage( getNumberValue(req.query.app_id),
                                        getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                                        '20401',
                                        req.query.lang_code)
                            .then((/**@type{Types.db_result_message_translation_getMessage[]}*/result_message)=>{
                                res.status(400).send(
                                    result_message[0].text
                                );
                            })
                            .catch((/**@type{Types.error}*/error)=>{
                                res.status(500).send(
                                    error
                                );
                            });
                        } 
                    }
                    else{
                        //user not found
                        getMessage( getNumberValue(req.query.app_id),
                                    getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                                    '20305',
                                    req.query.lang_code)
                        .then((/**@type{Types.db_result_message_translation_getMessage[]}*/result_message)=>{
                            res.status(404).send(
                                result_message[0].text
                            );
                        })
                        .catch((/**@type{Types.error}*/error)=>{
                            res.status(500).send(
                                error
                            );
                        });
                    }
                })
                .catch((/**@type{Types.error}*/error)=>{
                    res.status(500).send(
                        error
                    );
                });
            }
        }
        else{
            //user not found
            getMessage( getNumberValue(req.query.app_id),
                        getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                        '20305',
                        req.query.lang_code)
            .then((/**@type{Types.db_result_message_translation_getMessage[]}*/result_message)=>{
                res.status(404).send(
                    result_message[0].text
                );
            })
            .catch((/**@type{Types.error}*/error)=>{
                res.status(500).send(
                    error
                );
            });
        }
    })
    .catch((/**@type{Types.error}*/error)=>{
        res.status(500).send(
            error
        );
    });
};
/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const userLogin = (req, res) => {
    /**@type{Types.db_parameter_user_account_userLogin} */
    const data =    {   username: req.body.username};
    service.userLogin(getNumberValue(req.query.app_id), data)
    .then((/**@type{Types.db_result_user_account_userLogin[]}*/result_login)=>{
        if (result_login[0]) {
            const data = {  user_account_id:    getNumberValue(result_login[0].id),
                            app_id:             getNumberValue(req.body.app_id),
                            result:             Number(compareSync(req.body.password, result_login[0].password)),
                            client_ip:          req.ip,
                            client_user_agent:  req.headers['user-agent'],
                            client_longitude:   req.body.client_longitude ?? null,
                            client_latitude:    req.body.client_latitude ?? null,
                            access_token:       null};
            if (compareSync(req.body.password, result_login[0].password)) {
                if ((getNumberValue(req.query.app_id) == getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')) && (result_login[0].app_role_id == 0 || result_login[0].app_role_id == 1))||
                        getNumberValue(req.query.app_id) != ConfigGet('SERVER', 'APP_COMMON_APP_ID')){
                    createUserAccountApp(getNumberValue(req.query.app_id), result_login[0].id)
                    .then(()=>{
                        //if user not activated then send email with new verification code
                        const new_code = service.verification_code();
                        if (result_login[0].active == 0){
                            service.updateUserVerificationCode(getNumberValue(req.query.app_id), result_login[0].id, new_code)
                            .then(()=>{
                                getParameter(getNumberValue(req.query.app_id), getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),'SERVICE_MAIL_TYPE_UNVERIFIED')
                                    .then((/**@type{Types.db_result_app_parameter_getParameter[]}*/parameter)=>{
                                        //send email UNVERIFIED
                                        sendUserEmail(  getNumberValue(req.query.app_id), 
                                                        parameter[0].parameter_value, 
                                                        req.headers.host, 
                                                        result_login[0].id, 
                                                        new_code, 
                                                        result_login[0].email, 
                                                        (/**@type{Types.error}*/err)=>{
                                            if (err) {
                                                res.status(500).send(
                                                    err
                                                );
                                            }
                                            else{
                                                data.access_token = accessToken(req.query.app_id);
                                                insertUserAccountLogon(getNumberValue(req.query.app_id), data)
                                                .then(()=>{
                                                    res.status(200).json({
                                                        accessToken: data.access_token,
                                                        items: Array(result_login[0])
                                                    });
                                                })
                                                .catch((/**@type{Types.error}*/error)=>{
                                                    res.status(500).send(
                                                        error
                                                    );
                                                });
                                            }
                                        });
                                    })
                                    .catch((/**@type{Types.error}*/error)=> {
                                        res.status(500).send(
                                            error
                                        );
                                    });
                            })
                            .catch((/**@type{Types.error}*/error)=>{
                                res.status(500).send(
                                    error
                                );
                            });
                        }
                        else{
                            data.access_token = accessToken(req.query.app_id);
                            insertUserAccountLogon(getNumberValue(req.query.app_id), data)
                            .then(()=>{
                                res.status(200).json({
                                    accessToken: data.access_token,
                                    items: Array(result_login[0])
                                });
                            })
                            .catch((/**@type{Types.error}*/error)=>{
                                res.status(500).send(
                                    error
                                );
                            });
                        }
                     })
                     .catch((/**@type{Types.error}*/error)=>{
                        res.status(500).send(
                            error
                        );
                     });
                }
                else{
                    res.statusMessage = 'unauthorized admin login attempt for user id:' + getNumberValue(result_login[0].id) + ', username:' + req.body.username;
                    //unauthorized, only admin allowed to log in to admin
                    res.status(401).send(
                        '⛔'
                    );
                }
                
            } else {
                insertUserAccountLogon(getNumberValue(req.query.app_id), data)
                .then(()=>{
                    res.statusMessage = 'invalid password attempt for user id:' + getNumberValue(result_login[0].id) + ', username:' + req.body.username;
                        //Username or password not found
                        getMessage( getNumberValue(req.query.app_id),
                                    getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                                    '20300',
                                    req.query.lang_code)
                        .then((/**@type{Types.db_result_message_translation_getMessage[]}*/result_message)=>{
                            res.status(400).send(
                                result_message[0].text
                            );
                        })
                        .catch((/**@type{Types.error}*/error)=>{
                            res.status(500).send(
                                error
                            );
                        });
                })
                .catch((/**@type{Types.error}*/error)=>{
                    res.status(500).send(
                        error
                    );
                });
            }
        } else{
            res.statusMessage = 'user not found:' + req.body.username;
            //User not found
            getMessage( getNumberValue(req.query.app_id),
                        getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                        '20305',
                        req.query.lang_code)
            .then((/**@type{Types.db_result_message_translation_getMessage[]}*/result_message)=>{
                res.status(404).send(
                    result_message[0].text
                );
            })
            .catch((/**@type{Types.error}*/error)=>{
                res.status(500).send(
                    error
                );
            });
        }
    })
    .catch((/**@type{Types.error}*/error)=>{
        res.status(500).send(
            error
        );
    });
};
/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const providerSignIn = (req, res) => {
    service.providerSignIn(getNumberValue(req.query.app_id), getNumberValue(req.body.identity_provider_id), getNumberValue(req.params.id))
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
                            identity_provider_id:   getNumberValue(req.body.identity_provider_id),
                            provider_id:            req.body.provider_id,
                            provider_first_name:    req.body.provider_first_name,
                            provider_last_name:     req.body.provider_last_name,
                            provider_image:         req.body.provider_image,
                            provider_image_url:     req.body.provider_image_url,
                            provider_email:         req.body.provider_email,
                            admin:                  0};
        const data_login = {user_account_id:        req.body.user_account_id,
                            app_id:                 req.body.app_id,
                            result:                 1,
                            client_ip:              req.ip,
                            client_user_agent:      req.headers['user-agent'],
                            client_longitude:       req.body.client_longitude,
                            client_latitude:        req.body.client_latitude,
                            access_token:           null};
        if (result_signin.length > 0) {
            service.updateSigninProvider(getNumberValue(req.query.app_id), result_signin[0].id, data_user)
            .then(()=>{
                data_login.user_account_id = result_signin[0].id;
                createUserAccountApp(getNumberValue(req.query.app_id), result_signin[0].id)
                .then(()=>{
                    data_login.access_token = accessToken(req.query.app_id);
                    insertUserAccountLogon(getNumberValue(req.query.app_id), data_login)
                    .then(()=>{
                        res.status(200).json({
                            count: result_signin.length,
                            accessToken: data_login.access_token,
                            items: result_signin,
                            userCreated: 0
                        });
                    })
                    .catch((/**@type{Types.error}*/error)=>{
                        res.status(500).send(
                            error
                        );
                    });
                })
                .catch((/**@type{Types.error}*/error)=>{
                    res.status(500).send(
                        error
                    );
                });
            })
            .catch((/**@type{Types.error}*/error)=>{
                checked_error(getNumberValue(req.query.app_id), req.query.lang_code, error, res);
            });            
        } else {
            //if provider user not found then create user and one user setting
            //avatar not used by providers, set default null
            data_user.avatar = req.body.avatar ?? null;
            data_user.provider_image = req.body.provider_image ?? null;
            service.create(getNumberValue(req.query.app_id), data_user)
            .then((/**@type{Types.db_result_user_account_create} */result_create)=>{
                data_login.user_account_id = result_create.insertId;
                    createUserAccountApp(getNumberValue(req.query.app_id), result_create.insertId)
                    .then(()=>{
                        service.providerSignIn(getNumberValue(req.query.app_id), getNumberValue(req.body.identity_provider_id), getNumberValue(req.params.id))
                            .then((/**@type{Types.db_result_user_account_providerSignIn[]}*/result_signin2)=>{
                                data_login.access_token = accessToken(getNumberValue(req.query.app_id));
                                    insertUserAccountLogon(getNumberValue(req.query.app_id), data_login)
                                    .then(()=>{
                                        res.status(200).json({
                                            count: result_signin2.length,
                                            accessToken: data_login.access_token,
                                            items: result_signin2,
                                            userCreated: 1
                                        });
                                    })
                                    .catch((/**@type{Types.error}*/error)=>{
                                        res.status(500).send(
                                            error
                                        );
                                    });
                            })
                            .catch((/**@type{Types.error}*/error)=>{
                                res.status(500).send(
                                    error
                                );
                            });
                    })
                    .catch((/**@type{Types.error}*/error)=>{
                        res.status(500).send(
                            error
                        );
                    });
            })
            .catch((/**@type{Types.error}*/error)=>{
                res.status(500).send(
                    error
                );
            });  
        }
    })
    .catch((/**@type{Types.error}*/error)=>{
        res.status(500).send(
            error
        );
    });
};
export{getUsersAdmin, getStatCountAdmin, checked_error, updateUserSuperAdmin, userSignup, activateUser, 
       passwordResetUser, getUserByUserId, getProfileUser, searchProfileUser, getProfileDetail,
       getProfileTop, updateUserLocal, updatePassword, updateUserCommon,deleteUser, userLogin, providerSignIn};