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
    service.getUsersAdmin(getNumberValue(req.query.app_id), req.query.search, getNumberValue(req.query.sort), getNumberValue(req.query.order_by), getNumberValue(req.query.offset), getNumberValue(req.query.limit), (err, results) => {
        if (err) {
            return res.status(500).send(
                err
            );
        }
        else{
            return res.status(200).json({
                data: results
            });
        }
    });
};
const getStatCountAdmin = (req, res) => {
    service.getStatCountAdmin(getNumberValue(req.query.app_id), (err, results) => {
        if (err) {
            return res.status(500).send(
                err
            );
        }
        else{
            return res.status(200).json({
                data: results
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
                        lang_code, (err,results_message)  => {
                                    return res.status(400).send(
                                        err ?? results_message.text
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
    service.updateUserSuperAdmin(getNumberValue(req.query.app_id), getNumberValue(req.params.id), data, (err, results) => {
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
                                data: results
                            });
                    });
                });
            else
                return res.status(200).json({
                    data: results
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
                    req.query.lang_code, (err,results_message)  => {
                        return res.status(400).send(
                            err ?? results_message.text
                        );
                    });
    else{
        if (req.body.password)
            req.body.password = hashSync(req.body.password, salt);
        service.create(getNumberValue(req.query.app_id), req.body, (err, results) => {
            if (err) {
                return checked_error(getNumberValue(req.query.app_id), req.query.lang_code, err, res);
            }
            else{
                if (req.body.provider_id == null ) {
                    //send email for local users only
                    getParameter(getNumberValue(req.query.app_id), getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),'SERVICE_MAIL_TYPE_SIGNUP', (err, parameter_value)=>{
                        //send email SIGNUP
                        sendUserEmail(getNumberValue(req.query.app_id), parameter_value, req.headers['host'], results.insertId, req.body.verification_code, req.body.email, 
                                      req.ip, req.headers.authorization, req.headers['user-agent'], req.headers['accept-language'], (err)=>{
                            if (err) {
                                //return res from userSignup
                                return res.status(500).send(
                                    err
                                );
                            } 
                            else
                                return res.status(200).json({
                                    accessToken: accessToken(getNumberValue(req.query.app_id)),
                                    id: results.insertId,
                                    data: results
                                });
                        });  
                    });
                }
                else
                    return res.status(200).json({
                        accessToken: accessToken(getNumberValue(req.query.app_id)),
                        id: results.insertId,
                        data: results
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
    service.activateUser(getNumberValue(req.query.app_id), getNumberValue(req.params.id), getNumberValue(req.body.verification_type), req.body.verification_code, auth_new_password, (err, results) => {
        if (err) {
            return checked_error(getNumberValue(req.query.app_id), req.query.lang_code, err, res);
        }
        else
            if (auth_new_password == null){
                if (results.affectedRows==1 && getNumberValue(req.body.verification_type)==4){
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
                                count: results.affectedRows,
                                items: Array(results)
                            });
                    });
                }
                else
                    return res.status(200).json({
                        count: results.affectedRows,
                        items: Array(results)
                    });
            }
            else{
                //return accessToken since PASSWORD_RESET is in progress
                //email was verified and activated with data token, but now the password will be updated
                //using accessToken and authentication code
                return res.status(200).json({
                    count: results.affectedRows,
                    auth: auth_new_password,
                    accessToken: accessToken(getNumberValue(req.query.app_id)),
                    items: Array(results)
                });
            }
    });
};
const passwordResetUser = (req, res) => {
    const email = req.body.email ?? '';
    if (email !='')
        service.getEmailUser(getNumberValue(req.query.app_id), email, (err, results) => {
            if (err) {
                return res.status(500).send(
                    err
                );
            }
            else
                if (results){
                    getLastUserEvent(getNumberValue(req.query.app_id), getNumberValue(results.id), 'PASSWORD_RESET', (err, result_user_event)=>{
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
                                    user_account_id: results.id,
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
                                        service.updateUserVerificationCode(getNumberValue(req.query.app_id), results.id, new_code, (err) => {
                                            if (err)
                                                return res.status(500).send(
                                                    err
                                                );
                                            else{
                                                getParameter(getNumberValue(req.query.app_id), getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),'SERVICE_MAIL_TYPE_PASSWORD_RESET', (err, parameter_value)=>{
                                                    //send email PASSWORD_RESET
                                                    sendUserEmail(getNumberValue(req.query.app_id), parameter_value, req.headers['host'], results.id, new_code, email, 
                                                                  req.ip, req.headers.authorization, req.headers['user-agent'], req.headers['accept-language'], (err)=>{
                                                        if (err) {
                                                            return res.status(500).send(
                                                                err
                                                            );
                                                        } 
                                                        else
                                                            return res.status(200).json({
                                                                sent: 1,
                                                                id: results.id
                                                            });  
                                                    });
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
    service.getUserByUserId(getNumberValue(req.query.app_id), getNumberValue(req.params.id), (err, results) => {
        if (err) {
            return res.status(500).send(
                err
            );
        }
        else
            if (results) {
                //send without {} so the variablename is not sent
                return res.status(200).json(
                    results
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
    service.getProfileUser(getNumberValue(req.query.app_id), getNumberValue(req.params.id), getNumberValue(req.params.id)==null?req.query.search:null, getNumberValue(req.query.id), (err, results) => {
        if (err) {
            return res.status(500).send(
                err
            );
        }
        else{
            if (results){
                if (results.id == getNumberValue(req.query.id)) {
                    //send without {} so the variablename is not sent
                    return res.status(200).json(
                        results
                    );
                }
                else{
                    import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_view/user_account_view.service.js`).then(({ insertUserAccountView }) => {
                        const data = {  user_account_id:        getNumberValue(req.params.id),
                                                                //set user id when username is searched
                                        user_account_id_view:   getNumberValue(req.params.id) ?? results.id,
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
                                    results
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
    service.searchProfileUser(getNumberValue(req.query.app_id), req.query.search, (err, results) => {
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
                        if (results)
                            return res.status(200).json({
                                count: results.length,
                                items: results
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
    service.getProfileDetail(getNumberValue(req.query.app_id), getNumberValue(req.params.id), getNumberValue(req.query.detailchoice), (err, results) => {
        if (err) {
            return res.status(500).send(
                err
            );
        }
        else{
            if (results)
                return res.status(200).json({
                    count: results.length,
                    items: results
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
    service.getProfileTop(getNumberValue(req.query.app_id), getNumberValue(req.params.statchoice), (err, results) => {
        if (err) {
            return res.status(500).send(
                err
            );
        }
        else{
            if (results)
                return res.status(200).json({
                    count: results.length,
                    items: results
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
    service.checkPassword(getNumberValue(req.query.app_id), getNumberValue(req.params.id), (err, results) => {
        if (err) {
            return res.status(500).send(
                err
            );
        }
        else {
            if (results) {
                const result = compareSync(req.body.password, results.password);
                if (result) {
                    if (typeof req.body.new_password !== 'undefined' && 
                        req.body.new_password != '' &&
                        service.password_length_wrong(req.body.new_password))
                            getMessage( getNumberValue(req.query.app_id),
                                        getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                                        20106, 
                                        req.query.lang_code, (err,results_message)  => {
                                                return res.status(400).send(
                                                    err ?? results_message.text
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
                            const data = {  biod:               req.body.bio,
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
                                            getParameter(req.query.app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),'SERVICE_MAIL_TYPE_CHANGE_EMAIL',  (err, parameter_value)=>{
                                                //send email SERVICE_MAIL_TYPE_CHANGE_EMAIL
                                                sendUserEmail(getNumberValue(req.query.app_id), parameter_value, req.headers['host'], getNumberValue(req.params.id), req.body.verification_code, req.body.new_email, 
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
                                req.query.lang_code, (err,results_message)  => {
                                    return res.status(400).send(
                                        err ?? results_message.text
                                    );
                                });
                }
            } 
            else {
                //user not found
                getMessage( getNumberValue(req.query.app_id),
                            getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                            20305, 
                            req.query.lang_code, (err,results_message)  => {
                                return res.status(404).send(
                                    err ?? results_message.text
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
                    req.query.lang_code, (err,results_message)  => {
                        return res.status(400).send(
                            err ?? results_message.text
                        );
                    });
    else{
        const salt = genSaltSync(10);
        const data = {  new_password:   hashSync(req.body.new_password, salt),
                        auth:           req.body.auth};
        service.updatePassword(getNumberValue(req.query.app_id), getNumberValue(req.params.id), data, (err, results) => {
            if (err) {
                return checked_error(getNumberValue(req.query.app_id), req.query.lang_code, err, res);
            }
            else {
                if (results) {
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
                                results
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
    service.updateUserCommon(getNumberValue(req.query.app_id), data, getNumberValue(req.params.id), (err, results) => {
        if (err) {
            return checked_error(getNumberValue(req.query.app_id), req.query.lang_code, err, res);
        }
        else {
            if (results) {
                return res.status(200).send(
                    results
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
    service.getUserByUserId(getNumberValue(req.query.app_id), getNumberValue(req.params.id), (err, results) => {
        if (err) {
            return res.status(500).send(
                err
            );
        }
        else {
            if (results) {
                if (results.provider_id !=null){
                    service.deleteUser(getNumberValue(req.query.app_id), getNumberValue(req.params.id), (err, results_delete) => {
                        if (err) {
                            return res.status(500).send(
                                err
                            );
                        }
                        else{
                            if (results_delete) {
                                return res.status(200).send(
                                    results_delete
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
                    service.checkPassword(getNumberValue(req.query.app_id), getNumberValue(req.params.id), (err, results) => {
                        if (err) {
                            return res.status(500).send(
                                err
                            );
                        }
                        else {
                            if (results) {
                                if (compareSync(req.body.password, results.password)){
                                    service.deleteUser(getNumberValue(req.query.app_id), getNumberValue(req.params.id), (err, results_delete) => {
                                        if (err) {
                                            return res.status(500).send(
                                                err
                                            );
                                        }
                                        else{
                                            if (results_delete) {
                                                return res.status(200).send(
                                                    results_delete
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
                                                req.query.lang_code, (err,results_message)  => {
                                                        return res.status(400).send(
                                                            err ?? results_message.text
                                                        );
                                                });
                                } 
                            }
                            else{
                                //user not found
                                getMessage( getNumberValue(req.query.app_id),
                                            getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                                            20305, 
                                            req.query.lang_code, (err,results_message)  => {
                                                return res.status(404).send(
                                                    err ?? results_message.text
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
                            req.query.lang_code, (err,results_message)  => {
                                return res.status(404).send(
                                    err ?? results_message.text
                                );
                            });
            }
        }
    });

};
const userLogin = (req, res) => {
    const data =    {   username: req.body.username};
    service.userLogin(getNumberValue(req.query.app_id), data, (err, results) => {
        if (err) {
            return res.status(500).send(
                err
            );
        }
        else{
            if (results) {
                const data = {  user_account_id:    getNumberValue(results.id),
                                app_id:             getNumberValue(req.body.app_id),
                                result:             Number(compareSync(req.body.password, results.password)),
                                client_ip:          req.ip,
                                client_user_agent:  req.headers['user-agent'],
                                client_longitude:   req.body.client_longitude ?? null,
                                client_latitude:    req.body.client_latitude ?? null};
                if (compareSync(req.body.password, results.password)) {
                    if ((getNumberValue(req.query.app_id) == getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')) && (results.app_role_id == 0 || results.app_role_id == 1))||
                            getNumberValue(req.query.app_id) != ConfigGet('SERVER', 'APP_COMMON_APP_ID')){
                        createUserAccountApp(getNumberValue(req.query.app_id), results.id, (err) => {
                            if (err) {
                                return res.status(500).send(
                                    err
                                );
                            }
                            else{
                                //if user not activated then send email with new verification code
                                const new_code = service.verification_code();
                                if (results.active == 0){
                                    service.updateUserVerificationCode(getNumberValue(req.query.app_id), results.id, new_code, (err) => {
                                        if (err)
                                            return res.status(500).send(
                                                err
                                            );
                                        else{
                                            getParameter(req.query.app_id, ConfigGet('SERVER', 'APP_COMMON_APP_ID'),'SERVICE_MAIL_TYPE_UNVERIFIED',  (err, parameter_value)=>{
                                                //send email UNVERIFIED
                                                sendUserEmail(getNumberValue(req.query.app_id), parameter_value, req.headers['host'], results.id, new_code, results.email, 
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
                                                                    count: Array(results.items).length,
                                                                    accessToken: data.access_token,
                                                                    items: Array(results)
                                                                });
                                                        });
                                                    }
                                                });
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
                                                count: Array(results.items).length,
                                                accessToken: data.access_token,
                                                items: Array(results)
                                            });
                                    });
                                }
                            }
                        });
                    }
                    else{
                        res.statusMessage = 'unauthorized admin login attempt for user id:' + getNumberValue(results.id) + ', username:' + req.body.username;
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
                            res.statusMessage = 'invalid password attempt for user id:' + getNumberValue(results.id) + ', username:' + req.body.username;
                            //Username or password not found
                            getMessage( getNumberValue(req.query.app_id),
                                        getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                                        20300, 
                                        req.query.lang_code, (err,results_message)  => {
                                                return res.status(400).send(
                                                    err ?? results_message.text
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
                            req.query.lang_code, (err,results_message)  => {
                                return res.status(404).send(
                                    err ?? results_message.text
                                );
                });
            }
        }
    });
};
const providerSignIn = (req, res) => {
    service.providerSignIn(getNumberValue(req.query.app_id), req.body.identity_provider_id, getNumberValue(req.params.id), (err, results) => {
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
            if (results.length > 0) {
                service.updateSigninProvider(getNumberValue(req.query.app_id), results[0].id, data_user, (err) => {
                    if (err) {
                        return checked_error(getNumberValue(req.query.app_id), req.query.lang_code, err, res);
                    }
                    else{
                        data_login.user_account_id = results[0].id;
                        createUserAccountApp(getNumberValue(req.query.app_id), results[0].id, (err) => {
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
                                            count: results.length,
                                            accessToken: data_login.access_token,
                                            items: results,
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
                data_user.avatar = req.body.provider_image ?? null;
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
                                service.providerSignIn(getNumberValue(req.query.app_id), req.body.identity_provider_id, getNumberValue(req.params.id), (err, results) => {
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
                                                    count: results.length,
                                                    accessToken: data_login.access_token,
                                                    items: results,
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