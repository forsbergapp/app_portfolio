/** @module server/dbapi/app_portfolio/user_account */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../../types.js';

const service = await import('./user_account.service.js');
const { default: {genSaltSync, hashSync, compareSync} } = await import('bcryptjs');
const { ConfigGet } = await import(`file://${process.cwd()}/server/server.service.js`);
const { getMessage } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/message_translation/message_translation.service.js`);
const { createUserAccountApp } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_app/user_account_app.service.js`);
const { getLastUserEvent, insertUserEvent } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_event/user_account_event.service.js`);
const { insertUserAccountLogon } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_logon/user_account_logon.service.js`);
const { getParameter } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_parameter/app_parameter.service.js`);

const { accessToken } = await import(`file://${process.cwd()}/server/auth/auth.service.js`);
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

const sendUserEmail = async (app_id, emailtype, host, userid, verification_code, email, 
                             ip, authorization, headers_user_agent, headers_accept_language, callBack) => {
    const { createMail} = await import(`file://${process.cwd()}/apps/apps.service.js`);
    const { MessageQueue } = await import(`file://${process.cwd()}/service/service.service.js`);
    
    createMail(app_id, 
        {
            'emailtype':        emailtype,
            'host':             host,
            'app_user_id':      userid,
            'verificationCode': verification_code,
            'to':               email,
        }).then((email)=>{
            MessageQueue('MAIL', 'PUBLISH', email, null)
            .then(()=>{
                callBack(null, null);
            })
            .catch((error)=>{
                callBack(error, null);
            });
        })
        .catch((error)=>{
            callBack(error, null);
        });
};
const getUsersAdmin = (req, res) => {
    service.getUsersAdmin(getNumberValue(req.query.app_id), req.query.search, getNumberValue(req.query.sort), req.query.order_by, getNumberValue(req.query.offset), getNumberValue(req.query.limit), (err, result) => {
        if (err) {
            return res.status(500).send(
                err
            );
        }
        else{
            return res.status(200).json({
                data: result
            });
        }
    });
};
const getStatCountAdmin = (req, res) => {
    service.getStatCountAdmin(getNumberValue(req.query.app_id), (err, result) => {
        if (err) {
            return res.status(500).send(
                err
            );
        }
        else{
            return res.status(200).json({
                data: result
            });
        }
    });
};
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
                        lang_code, (err,result_message)  => {
                                    return res.status(400).send(
                                        err ?? result_message[0].text
                                    );
                        });
            }
        else
            return res.status(500).send(
                err
            );
    });
};
const updateUserSuperAdmin = (req, res) => {
    const data = {  app_role_id:        getNumberValue(req.body.app_role_id),
                    active:             getNumberValue(req.body.active),
                    user_level:         getNumberValue(req.body.user_level),
                    private:            getNumberValue(req.body.private),
                    username:           req.body.username,
                    bio:                req.body.bio,
                    email:              req.body.email,
                    email_unverified:   req.body.email_unverified,
                    password:           req.body.password,
                    password_reminder:  req.body.password_reminder,
                    verification_code:  req.body.verification_code};
    service.updateUserSuperAdmin(getNumberValue(req.query.app_id), getNumberValue(req.params.id), data, (err, result) => {
        if (err) {
            return checked_error(getNumberValue(req.query.app_id), req.query.lang_code, err, res);
        }
        else{
            if (req.body.app_role_id!=0 && req.body.app_role_id!=1)
                //delete admin app from user if user is not an admin anymore
                import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_app/user_account_app.service.js`).then(({ deleteUserAccountApps }) => {
                    deleteUserAccountApps(getNumberValue(req.query.app_id), getNumberValue(req.params.id), getNumberValue(req.query.app_id), (err) =>{
                        if (err)
                            return res.status(500).send(
                                err
                            );
                        else
                            return res.status(200).json({
                                data: result
                            });
                    });
                });
            else
                return res.status(200).json({
                    data: result
                });
        }
    });
};
const userSignup = (req, res) => {
    const salt = genSaltSync(10);
    if (typeof req.body.provider_id == 'undefined') {
        req.body.provider_id = null;
        //generate verification code for local users only
        req.body.verification_code = service.verification_code();
    }
    if (service.password_length_wrong(req.body.password))
        getMessage(getNumberValue(req.query.app_id),
                    getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),
                    20106, 
                    req.query.lang_code, (err,result_message)  => {
                        return res.status(400).send(
                            err ?? result_message[0].text
                        );
                    });
    else{
        if (req.body.password)
            req.body.password = hashSync(req.body.password, salt);
        service.create(getNumberValue(req.query.app_id), req.body, (err, result) => {
            if (err) {
                return checked_error(getNumberValue(req.query.app_id), req.query.lang_code, err, res);
            }
            else{
                if (req.body.provider_id == null ) {
                    //send email for local users only
                    getParameter(getNumberValue(req.query.app_id), getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),'SERVICE_MAIL_TYPE_SIGNUP')
                    .then((/**@type{Types.db_result_app_parameter_getParameter[]}*/parameter)=>{
                        //send email SIGNUP
                        sendUserEmail(getNumberValue(req.query.app_id), parameter[0].parameter_value, req.headers['host'], result.insertId, req.body.verification_code, req.body.email, 
                                      req.ip, req.headers.authorization, req.headers['user-agent'], req.headers['accept-language'], (err)=>{
                            if (err) {
                                return res.status(500).send(
                                    err
                                );
                            } 
                            else
                                return res.status(200).json({
                                    accessToken: accessToken(getNumberValue(req.query.app_id)),
                                    id: result.insertId,
                                    data: result
                                });
                        });  
                    })
                    .catch((/**@type{Types.error}*/error)=>{
                        return res.status(500).send(
                            error
                        );
                    });
                }
                else
                    return res.status(200).json({
                        accessToken: accessToken(getNumberValue(req.query.app_id)),
                        id: result.insertId,
                        data: result
                    });
            }
        });
    }
};
const activateUser = (req, res) => {
    let auth_new_password = null;
    if (getNumberValue(req.body.verification_type) == 3){
        //reset password
        auth_new_password = service.verification_code();
    }
    service.activateUser(getNumberValue(req.query.app_id), getNumberValue(req.params.id), getNumberValue(req.body.verification_type), req.body.verification_code, auth_new_password, (err, result) => {
        if (err) {
            return checked_error(getNumberValue(req.query.app_id), req.query.lang_code, err, res);
        }
        else
            if (auth_new_password == null){
                if (result.affectedRows==1 && getNumberValue(req.body.verification_type)==4){
                    //new email verified
                    const eventData = {
                        app_id : getNumberValue(req.query.app_id),
                        user_account_id: getNumberValue(req.params.id),
                        event: 'EMAIL_VERIFIED_CHANGE_EMAIL',
                        event_status: 'SUCCESSFUL',
                        user_language: req.body.user_language,
                        user_timezone: req.body.user_timezone,
                        user_number_system: req.body.user_number_system,
                        user_platform: req.body.user_platform,
                        server_remote_addr : req.ip,
                        server_user_agent : req.headers['user-agent'],
                        server_http_host : req.headers['host'],
                        server_http_accept_language : req.headers['accept-language'],
                        client_latitude : req.body.client_latitude,
                        client_longitude : req.body.client_longitude
                    };
                    insertUserEvent(getNumberValue(req.query.app_id), eventData, (err)=>{
                        if (err)
                            return res.status(500).send(
                                err
                            );
                        else
                            return res.status(200).json({
                                count: result.affectedRows,
                                items: Array(result)
                            });
                    });
                }
                else
                    return res.status(200).json({
                        count: result.affectedRows,
                        items: Array(result)
                    });
            }
            else{
                //return accessToken since PASSWORD_RESET is in progress
                //email was verified and activated with data token, but now the password will be updated
                //using accessToken and authentication code
                return res.status(200).json({
                    count: result.affectedRows,
                    auth: auth_new_password,
                    accessToken: accessToken(getNumberValue(req.query.app_id)),
                    items: Array(result)
                });
            }
    });
};
const passwordResetUser = (req, res) => {
    const email = req.body.email ?? '';
    if (email !='')
        service.getEmailUser(getNumberValue(req.query.app_id), email, (err, result) => {
            if (err) {
                return res.status(500).send(
                    err
                );
            }
            else
                if (result[0]){
                    getLastUserEvent(getNumberValue(req.query.app_id), getNumberValue(result[0].id), 'PASSWORD_RESET', (err, result_user_event)=>{
                        if (err)
                            return res.status(200).json({
                                sent: 0
                            });
                        else
                            if (result_user_event &&
                                result_user_event.status_name == 'INPROGRESS' &&
                                (result_user_event.current_timestamp - result_user_event.date_created)/ (1000 * 60 * 60 * 24) < 1)
                                return res.status(200).json({
                                    sent: 0
                                });
                            else{
                                const eventData = {
                                    app_id : getNumberValue(req.query.app_id),
                                    user_account_id: result[0].id,
                                    event: 'PASSWORD_RESET',
                                    event_status: 'INPROGRESS',
                                    user_language: req.body.user_language,
                                    user_timezone: req.body.user_timezone,
                                    user_number_system: req.body.user_number_system,
                                    user_platform: req.body.user_platform,
                                    server_remote_addr : req.ip,
                                    server_user_agent : req.headers['user-agent'],
                                    server_http_host : req.headers['host'],
                                    server_http_accept_language : req.headers['accept-language'],
                                    client_latitude : req.body.client_latitude,
                                    client_longitude : req.body.client_longitude
                                };
                                insertUserEvent(getNumberValue(req.query.app_id), eventData, (err)=>{
                                    if (err)
                                        return res.status(200).json({
                                            sent: 0
                                        });
                                    else{
                                        const new_code = service.verification_code();
                                        service.updateUserVerificationCode(getNumberValue(req.query.app_id), result[0].id, new_code, (err) => {
                                            if (err)
                                                return res.status(500).send(
                                                    err
                                                );
                                            else{
                                                getParameter(getNumberValue(req.query.app_id), getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),'SERVICE_MAIL_TYPE_PASSWORD_RESET')
                                                .then((/**@type{Types.db_result_app_parameter_getParameter[]}*/parameter)=>{
                                                    //send email PASSWORD_RESET
                                                    sendUserEmail(getNumberValue(req.query.app_id), parameter[0].parameter_value, req.headers['host'], result[0].id, new_code, email, 
                                                                  req.ip, req.headers.authorization, req.headers['user-agent'], req.headers['accept-language'], (err)=>{
                                                        if (err) {
                                                            return res.status(500).send(
                                                                err
                                                            );
                                                        } 
                                                        else
                                                            return res.status(200).json({
                                                                sent: 1,
                                                                id: result[0].id
                                                            });  
                                                    });
                                                })
                                                .catch((/**@type{Types.error}*/error)=>{
                                                    return res.status(500).send(
                                                        error
                                                    );
                                                });
                                            }
                                        });
                                    }
                                });
                            }    
                    });
                }
                else
                    return res.status(200).json({
                        sent: 0
                    });
        });
    else
        return res.status(200).json({
            sent: 0
        });
    
};
const getUserByUserId = (req, res) => {
    service.getUserByUserId(getNumberValue(req.query.app_id), getNumberValue(req.params.id), (err, result) => {
        if (err) {
            return res.status(500).send(
                err
            );
        }
        else
            if (result[0]) {
                //send without {} so the variablename is not sent
                return res.status(200).json(
                    result[0]
                );
            }
            else{
                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                    return record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
                });
            }
    });
};
const getProfileUser = (req, res) => {
    service.getProfileUser(getNumberValue(req.query.app_id), getNumberValue(req.params.id), getNumberValue(req.params.id)==null?req.query.search:null, getNumberValue(req.query.id), (err, result) => {
        if (err) {
            return res.status(500).send(
                err
            );
        }
        else{
            if (result[0]){
                if (result[0].id == getNumberValue(req.query.id)) {
                    //send without {} so the variablename is not sent
                    return res.status(200).json(
                        result[0]
                    );
                }
                else{
                    import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_view/user_account_view.service.js`).then(({ insertUserAccountView }) => {
                        const data = {  user_account_id:        getNumberValue(req.params.id),
                                                                //set user id when username is searched
                                        user_account_id_view:   getNumberValue(req.params.id) ?? result[0].id,
                                        client_ip:              req.ip,
                                        client_user_agent:      req.headers['user-agent'],
                                        client_longitude:       req.body.client_longitude,
                                        client_latitude:        req.body.client_latitude};
                        insertUserAccountView(getNumberValue(req.query.app_id), data, (err) => {
                            if (err) {
                                return res.status(500).send(
                                    err
                                );
                            }
                            else{
                                //send without {} so the variablename is not sent
                                return res.status(200).json(
                                    result[0]
                                );
                            }
                        });
                    });
                }
            }
            else{
                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                    return record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
                });
            }
        }            
    });
};
const searchProfileUser = (req, res) => {
    service.searchProfileUser(getNumberValue(req.query.app_id), req.query.search, (err, result) => {
        if (err) {
            return res.status(500).send(
                err
            );
        }
        else{
            import(`file://${process.cwd()}/server/dbapi/app_portfolio/profile_search/profile_search.service.js`).then(({ insertProfileSearch }) => {
                const data = {  user_account_id:    req.body.user_account_id,
                                search:             req.query.search,
                                client_ip:          req.ip,
                                client_user_agent:  req.headers['user-agent'],
                                client_longitude:   req.body.client_longitude,
                                client_latitude:    req.body.client_latitude};
                insertProfileSearch(getNumberValue(req.query.app_id), data, (err) => {
                    if (err) {
                        return res.status(500).send(
                            err
                        );
                    }
                    else{
                        if (result)
                            return res.status(200).json({
                                count: result.length,
                                items: result
                            });
                        else {
                            import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                                return record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
                            });
                        }
                    }
                });
            });
        }
    });
};
const getProfileDetail = (req, res) => {
    service.getProfileDetail(getNumberValue(req.query.app_id), getNumberValue(req.params.id), getNumberValue(req.query.detailchoice), (err, result) => {
        if (err) {
            return res.status(500).send(
                err
            );
        }
        else{
            if (result)
                return res.status(200).json({
                    count: result.length,
                    items: result
                });
            else {
                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                    return record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
                });
            }
        }
    });
};
const getProfileTop = (req, res) => {
    service.getProfileTop(getNumberValue(req.query.app_id), getNumberValue(req.params.statchoice), (err, result) => {
        if (err) {
            return res.status(500).send(
                err
            );
        }
        else{
            if (result)
                return res.status(200).json({
                    count: result.length,
                    items: result
                });
            else {
                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                    return record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
                });
            }                    
        }
    });
};
const updateUserLocal = (req, res) => {
    const salt = genSaltSync(10);
    service.checkPassword(getNumberValue(req.query.app_id), getNumberValue(req.params.id), (err, result_password) => {
        if (err) {
            return res.status(500).send(
                err
            );
        }
        else {
            if (result_password[0]) {
                const result = compareSync(req.body.password, result_password[0].password);
                if (result) {
                    if (typeof req.body.new_password !== 'undefined' && 
                        req.body.new_password != '' &&
                        service.password_length_wrong(req.body.new_password))
                            getMessage( getNumberValue(req.query.app_id),
                                        getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                                        20106, 
                                        req.query.lang_code, (err,result_message)  => {
                                                return res.status(400).send(
                                                    err ?? result_message[0].text
                                                );
                                        });
                    else{
                        if (typeof req.body.new_password !== 'undefined' && req.body.new_password != '') {
                            req.body.password = hashSync(req.body.new_password, salt);
                        } else {
                            if (req.body.password)
                                req.body.password = hashSync(req.body.password, salt);
                        }
                        const updateLocal = (send_email) => {
                            const data = {  bio:                req.body.bio,
                                            private:            req.body.private,
                                            username:           req.body.username,
                                            password:           req.body.password,
                                            password_reminder:  req.body.password_reminder,
                                            email:              req.body.email,
                                            new_email:          req.body.new_email,
                                            avatar:             req.body.avatar,
                                            verification_code:  req.body.verification_code};
                            service.updateUserLocal(getNumberValue(req.query.app_id), data, getNumberValue(req.params.id), (err, results_update) => {
                                if (err) {
                                    return checked_error(req.query.app_id, req.query.lang_code, err, res);
                                }
                                else{
                                    if (results_update){
                                        if (send_email){
                                            getParameter(getNumberValue(req.query.app_id), getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),'SERVICE_MAIL_TYPE_CHANGE_EMAIL')
                                            .then((/**@type{Types.db_result_app_parameter_getParameter[]}*/parameter)=>{
                                                //send email SERVICE_MAIL_TYPE_CHANGE_EMAIL
                                                sendUserEmail(getNumberValue(req.query.app_id), parameter[0].parameter_value, req.headers['host'], getNumberValue(req.params.id), req.body.verification_code, req.body.new_email, 
                                                              req.ip, req.headers.authorization, req.headers['user-agent'], req.headers['accept-language'], (err)=>{
                                                    if (err) {
                                                        return res.status(500).send(
                                                            err
                                                        );
                                                    } 
                                                    else
                                                        return res.status(200).json({
                                                            sent_change_email: 1
                                                        });
                                                });
                                            })
                                            .catch((/**@type{Types.error}*/error)=> {
                                                return res.status(500).send(
                                                    error
                                                );
                                            });
                                        }
                                        else    
                                            return res.status(200).json({
                                                sent_change_email: 0
                                            });
                                    } 
                                    else{
                                        import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                                            return record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
                                        });
                                    }
                                }
                            });
                        };
                        if (typeof req.body.new_email != 'undefined' && 
                            req.body.new_email!='' &&
                            req.body.new_email!= null)
                            getLastUserEvent(getNumberValue(req.query.app_id), getNumberValue(req.params.id), 'EMAIL_VERIFIED_CHANGE_EMAIL', (err, result_user_event)=>{
                                if (err)
                                    return res.status(500).json({
                                        err
                                    });
                                else
                                    if ((result_user_event && (result_user_event.current_timestamp - result_user_event.date_created)/ (1000 * 60 * 60 * 24) >= 1)||
                                        typeof result_user_event == 'undefined'){
                                        //no change email in progress or older than at least 1 day
                                        const eventData = {
                                            app_id : getNumberValue(req.query.app_id),
                                            user_account_id: getNumberValue(req.params.id),
                                            event: 'EMAIL_VERIFIED_CHANGE_EMAIL',
                                            event_status: 'INPROGRESS',
                                            user_language: req.body.user_language,
                                            user_timezone: req.body.user_timezone,
                                            user_number_system: req.body.user_number_system,
                                            user_platform: req.body.user_platform,
                                            server_remote_addr : req.ip,
                                            server_user_agent : req.headers['user-agent'],
                                            server_http_host : req.headers['host'],
                                            server_http_accept_language : req.headers['accept-language'],
                                            client_latitude : req.body.client_latitude,
                                            client_longitude : req.body.client_longitude
                                        };
                                        insertUserEvent(getNumberValue(req.query.app_id), eventData, (err)=>{
                                            if (err)
                                                return res.status(500).json({
                                                    err
                                                });
                                            else{
                                                req.body.verification_code = service.verification_code();
                                                updateLocal(true);
                                            }
                                        });
                                    }
                                    else
                                        updateLocal();
                            });
                        else
                            updateLocal();
                    }
                } 
                else {
                    res.statusMessage = 'invalid password attempt for user id:' + req.params.id;
                    //invalid password
                    getMessage(getNumberValue(req.query.app_id),
                                getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                                20401, 
                                req.query.lang_code, (err,result_message)  => {
                                    return res.status(400).send(
                                        err ?? result_message[0].text
                                    );
                                });
                }
            } 
            else {
                //user not found
                getMessage( getNumberValue(req.query.app_id),
                            getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                            20305, 
                            req.query.lang_code, (err,result_message)  => {
                                return res.status(404).send(
                                    err ?? result_message[0].text
                                );
                            });
            }
        }
    });
};
const updatePassword = (req, res) => {
    if (service.password_length_wrong(req.body.new_password))
        getMessage(getNumberValue(req.query.app_id),
                    getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                    20106, 
                    req.query.lang_code, (err,result_message)  => {
                        return res.status(400).send(
                            err ?? result_message[0].text
                        );
                    });
    else{
        const salt = genSaltSync(10);
        const data = {  new_password:   hashSync(req.body.new_password, salt),
                        auth:           req.body.auth};
        service.updatePassword(getNumberValue(req.query.app_id), getNumberValue(req.params.id), data, (err, result) => {
            if (err) {
                return checked_error(getNumberValue(req.query.app_id), req.query.lang_code, err, res);
            }
            else {
                if (result) {
                    const eventData = {
                        app_id : getNumberValue(req.query.app_id),
                        user_account_id: getNumberValue(req.params.id),
                        event: 'PASSWORD_RESET',
                        event_status: 'SUCCESSFUL',
                        user_language: req.body.user_language,
                        user_timezone: req.body.user_timezone,
                        user_number_system: req.body.user_number_system,
                        user_platform: req.body.user_platform,
                        server_remote_addr : req.ip,
                        server_user_agent : req.headers['user-agent'],
                        server_http_host : req.headers['host'],
                        server_http_accept_language : req.headers['accept-language'],
                        client_latitude : req.body.client_latitude,
                        client_longitude : req.body.client_longitude
                    };
                    insertUserEvent(getNumberValue(req.query.app_id), eventData, (err)=>{
                        if (err)
                            return res.status(200).json({
                                sent: 0
                            });
                        else
                            return res.status(200).send(
                                result
                            );
                    });
                }
                else{
                    import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                        return record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
                    });
                }
            }
        });
    }
};
const updateUserCommon = (req, res) => {
    const data = {  username:   req.body.username,
                    bio:        req.body.bio,
                    private:    req.body.private,};
    service.updateUserCommon(getNumberValue(req.query.app_id), data, getNumberValue(req.params.id), (err, result) => {
        if (err) {
            return checked_error(getNumberValue(req.query.app_id), req.query.lang_code, err, res);
        }
        else {
            if (result) {
                return res.status(200).send(
                    result
                );
            }
            else{
                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                    return record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
                });
            }
        }
    });
};
const deleteUser = (req, res) => {
    service.getUserByUserId(getNumberValue(req.query.app_id), getNumberValue(req.params.id), (err, result_user) => {
        if (err) {
            return res.status(500).send(
                err
            );
        }
        else {
            if (result_user[0]) {
                if (result_user[0].provider_id !=null){
                    service.deleteUser(getNumberValue(req.query.app_id), getNumberValue(req.params.id), (err, result_delete) => {
                        if (err) {
                            return res.status(500).send(
                                err
                            );
                        }
                        else{
                            if (result_delete) {
                                return res.status(200).send(
                                    result_delete
                                );
                            }
                            else{
                                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                                    return record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
                                });
                            }
                        }
                    });
                }
                else{
                    service.checkPassword(getNumberValue(req.query.app_id), getNumberValue(req.params.id), (err, result_password) => {
                        if (err) {
                            return res.status(500).send(
                                err
                            );
                        }
                        else {
                            if (result_password[0]) {
                                if (compareSync(req.body.password, result_password[0].password)){
                                    service.deleteUser(getNumberValue(req.query.app_id), getNumberValue(req.params.id), (err, result_delete) => {
                                        if (err) {
                                            return res.status(500).send(
                                                err
                                            );
                                        }
                                        else{
                                            if (result_delete) {
                                                return res.status(200).send(
                                                    result_delete
                                                );
                                            }
                                            else{
                                                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                                                    return record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
                                                });
                                            }
                                        }
                                    });
                                }
                                else{
                                    res.statusMessage = 'invalid password attempt for user id:' + req.params.id;
                                    //invalid password
                                    getMessage( getNumberValue(req.query.app_id),
                                                getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                                                20401, 
                                                req.query.lang_code, (err,result_message)  => {
                                                        return res.status(400).send(
                                                            err ?? result_message[0].text
                                                        );
                                                });
                                } 
                            }
                            else{
                                //user not found
                                getMessage( getNumberValue(req.query.app_id),
                                            getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                                            20305, 
                                            req.query.lang_code, (err,result_message)  => {
                                                return res.status(404).send(
                                                    err ?? result_message[0].text
                                                );
                                            });
                            }
                        }
                    });
                }
            }
            else{
                //user not found
                getMessage(getNumberValue(req.query.app_id),
                            getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                            20305, 
                            req.query.lang_code, (err,result_message)  => {
                                return res.status(404).send(
                                    err ?? result_message[0].text
                                );
                            });
            }
        }
    });

};
const userLogin = (req, res) => {
    const data =    {   username: req.body.username};
    service.userLogin(getNumberValue(req.query.app_id), data, (err, result_login) => {
        if (err) {
            return res.status(500).send(
                err
            );
        }
        else{
            if (result_login[0]) {
                const data = {  user_account_id:    getNumberValue(result_login[0].id),
                                app_id:             getNumberValue(req.body.app_id),
                                result:             Number(compareSync(req.body.password, result_login[0].password)),
                                client_ip:          req.ip,
                                client_user_agent:  req.headers['user-agent'],
                                client_longitude:   req.body.client_longitude ?? null,
                                client_latitude:    req.body.client_latitude ?? null};
                if (compareSync(req.body.password, result_login[0].password)) {
                    if ((getNumberValue(req.query.app_id) == getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')) && (result_login[0].app_role_id == 0 || result_login[0].app_role_id == 1))||
                            getNumberValue(req.query.app_id) != ConfigGet('SERVER', 'APP_COMMON_APP_ID')){
                        createUserAccountApp(getNumberValue(req.query.app_id), result_login[0].id, (err) => {
                            if (err) {
                                return res.status(500).send(
                                    err
                                );
                            }
                            else{
                                //if user not activated then send email with new verification code
                                const new_code = service.verification_code();
                                if (result_login[0].active == 0){
                                    service.updateUserVerificationCode(getNumberValue(req.query.app_id), result_login[0].id, new_code, (err) => {
                                        if (err)
                                            return res.status(500).send(
                                                err
                                            );
                                        else{
                                            getParameter(getNumberValue(req.query.app_id), getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),'SERVICE_MAIL_TYPE_UNVERIFIED')
                                            .then((/**@type{Types.db_result_app_parameter_getParameter[]}*/parameter)=>{
                                                //send email UNVERIFIED
                                                sendUserEmail(getNumberValue(req.query.app_id), parameter[0].parameter_value, req.headers['host'], result_login[0].id, new_code, result_login[0].email, 
                                                              req.ip, req.headers.authorization, req.headers['user-agent'], req.headers['accept-language'], (err)=>{
                                                    if (err) {
                                                        return res.status(500).send(
                                                            err
                                                        );
                                                    }
                                                    else{
                                                        data.access_token = accessToken(req.query.app_id);
                                                        insertUserAccountLogon(getNumberValue(req.query.app_id), data, (err) => {
                                                            if (err)
                                                                return res.status(500).send(
                                                                    err
                                                                );
                                                            else
                                                                return res.status(200).json({
                                                                    accessToken: data.access_token,
                                                                    items: Array(result_login[0])
                                                                });
                                                        });
                                                    }
                                                });
                                            })
                                            .catch((/**@type{Types.error}*/error)=> {
                                                return res.status(500).send(
                                                    error
                                                );
                                            });
                                        }
                                    });
                                }
                                else{
                                    data.access_token = accessToken(req.query.app_id);
                                    insertUserAccountLogon(getNumberValue(req.query.app_id), data, (err) => {
                                        if (err)
                                            return res.status(500).send(
                                                err
                                            );
                                        else
                                            return res.status(200).json({
                                                accessToken: data.access_token,
                                                items: Array(result_login[0])
                                            });
                                    });
                                }
                            }
                        });
                    }
                    else{
                        res.statusMessage = 'unauthorized admin login attempt for user id:' + getNumberValue(result_login[0].id) + ', username:' + req.body.username;
                        //unauthorized, only admin allowed to log in to admin
                        return res.status(401).send(
                            '⛔'
                        );
                    }
                    
                } else {
                    insertUserAccountLogon(getNumberValue(req.query.app_id), data, (err) => {
                        if (err) {
                            return res.status(500).send(
                                err
                            );
                        }
                        else{
                            res.statusMessage = 'invalid password attempt for user id:' + getNumberValue(result_login[0].id) + ', username:' + req.body.username;
                            //Username or password not found
                            getMessage( getNumberValue(req.query.app_id),
                                        getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                                        20300, 
                                        req.query.lang_code, (err,result_message)  => {
                                                return res.status(400).send(
                                                    err ?? result_message[0].text
                                                );
                            });
                        }
                    });
                }
            } else{
                res.statusMessage = 'user not found:' + req.body.username;
                //User not found
                getMessage( getNumberValue(req.query.app_id),
                            getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                            20305, 
                            req.query.lang_code, (err,result_message)  => {
                                return res.status(404).send(
                                    err ?? result_message[0].text
                                );
                });
            }
        }
    });
};
const providerSignIn = (req, res) => {
    service.providerSignIn(getNumberValue(req.query.app_id), req.body.identity_provider_id, getNumberValue(req.params.id), (err, result_signin) => {
        if (err) {
            return res.status(500).send(
                err
            );
        }
        else{
            const data_user = { identity_provider_id:   req.body.identity_provider_id,
                                provider_id:            req.body.provider_id,
                                provider_first_name:    req.body.provider_first_name,
                                provider_last_name:     req.body.provider_last_name,
                                provider_image:         req.body.provider_image,
                                provider_image_url:     req.body.provider_image_url,
                                provider_email:         req.body.provider_email};
            const data_login = {user_account_id:        req.body.user_account_id,
                                app_id:                 req.body.app_id,
                                result:                 1,
                                client_ip:              req.ip,
                                client_user_agent:      req.headers['user-agent'],
                                client_longitude:       req.body.client_longitude,
                                client_latitude:        req.body.client_latitude};
            if (result_signin.length > 0) {
                service.updateSigninProvider(getNumberValue(req.query.app_id), result_signin[0].id, data_user, (err) => {
                    if (err) {
                        return checked_error(getNumberValue(req.query.app_id), req.query.lang_code, err, res);
                    }
                    else{
                        data_login.user_account_id = result_signin[0].id;
                        createUserAccountApp(getNumberValue(req.query.app_id), result_signin[0].id, (err) => {
                            if (err) {
                                return res.status(500).send(
                                    err
                                );
                            }
                            else{
                                data_login.access_token = accessToken(req.query.app_id);
                                insertUserAccountLogon(getNumberValue(req.query.app_id), data_login, (err) => {
                                    if (err) {
                                        return res.status(500).send(
                                            err
                                        );
                                    }
                                    else
                                        return res.status(200).json({
                                            count: result_signin.length,
                                            accessToken: data_login.access_token,
                                            items: result_signin,
                                            userCreated: 0
                                        });
                                });
                            }
                        });        
                    }
                });
                
            } else {
                //if provider user not found then create user and one user setting
                //avatar not used by providers, set default null
                data_user.avatar = req.body.avatar ?? null;
                data_user.provider_image = req.body.provider_image ?? null;
                service.create(getNumberValue(req.query.app_id), data_user, (err, results_create) => {
                    if (err) {
                        return res.status(500).send(
                            err
                        );
                    }
                    else{
                        data_login.user_account_id = results_create.insertId;
                        createUserAccountApp(getNumberValue(req.query.app_id), results_create.insertId, (err) => {
                            if (err) {
                                return res.status(500).send(
                                    err
                                );
                            }
                            else{
                                service.providerSignIn(getNumberValue(req.query.app_id), req.body.identity_provider_id, getNumberValue(req.params.id), (err, result_signin2) => {
                                    if (err) {
                                        return res.status(500).send(
                                            err
                                        );
                                    }
                                    else{
                                        data_login.access_token = accessToken(getNumberValue(req.query.app_id));
                                        insertUserAccountLogon(getNumberValue(req.query.app_id), data_login, (err) => {
                                            if (err) {
                                                return res.status(500).send(
                                                    err
                                                );
                                            }
                                            else
                                                return res.status(200).json({
                                                    count: result_signin2.length,
                                                    accessToken: data_login.access_token,
                                                    items: result_signin2,
                                                    userCreated: 1
                                                });
                                        });
                                    }
                                });
                            }
                        });        
                    }
                });
            }
        }
    });
};
export{getUsersAdmin, getStatCountAdmin, checked_error, updateUserSuperAdmin, userSignup, activateUser, 
       passwordResetUser, getUserByUserId, getProfileUser, searchProfileUser, getProfileDetail,
       getProfileTop, updateUserLocal, updatePassword, updateUserCommon,deleteUser, userLogin, providerSignIn};