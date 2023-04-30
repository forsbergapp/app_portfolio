const service = await import("./user_account.service.js");
const { default: {genSaltSync, hashSync, compareSync} } = await import("bcryptjs");
const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);
const { getMessage } = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/message_translation/message_translation.service.js`);
const { createUserAccountApp } = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/user_account_app/user_account_app.service.js`);
const { getLastUserEvent, insertUserEvent } = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/user_account_event/user_account_event.service.js`);
const { insertUserAccountLogon } = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/user_account_logon/user_account_logon.service.js`);
const { getParameter } = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/app_parameter/app_parameter.service.js`);
const { sendEmail } = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/mail/mail.controller.js`);
const { accessToken } = await import(`file://${process.cwd()}/server/auth/auth.controller.js`);

const getUsersAdmin = (req, res) => {
    service.getUsersAdmin(req.query.app_id, req.query.search, req.query.sort, req.query.order_by, req.query.offset, req.query.limit, (err, results) => {
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
}
const getStatCountAdmin = (req, res) => {
    service.getStatCountAdmin(req.query.app_id, (err, results) => {
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
}
const checked_error = (app_id, lang_code, err, res) =>{
    import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db/common/common.service.js`).then(({ get_app_code }) => {
        let app_code = get_app_code(err.errorNum, 
            err.message, 
            err.code, 
            err.errno, 
            err.sqlMessage);
        if (app_code != null){
            getMessage(app_id,
                ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'), 
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
    })
}
const updateUserSuperAdmin = (req, res) => {
    req.params.id = parseInt(req.params.id);
    service.updateUserSuperAdmin(req.query.app_id, req.params.id, req.body, (err, results) => {
        if (err) {
            return checked_error(req.query.app_id, req.query.lang_code, err, res);
        }
        else{
            if (req.body.app_role_id!=0 && req.body.app_role_id!=1)
                //delete admin app from user if user is not an admin anymore
                import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/user_account_app/user_account_app.service.js`).then(({ deleteUserAccountApps }) => {
                    deleteUserAccountApps(req.query.app_id, req.params.id, req.query.app_id, (err, result_delete_user_acccount_app) =>{
                        if (err)
                            return res.status(500).send(
                                err
                            );
                        else
                            return res.status(200).json({
                                data: results
                            });
                    })
                })
            else
                return res.status(200).json({
                    data: results
                });
        }
    });
}
const userSignup = (req, res) => {
    const salt = genSaltSync(10);
    if (typeof req.body.provider_id == 'undefined') {
        req.body.provider_id = null;
        //generate verification code for local users only
        req.body.verification_code = service.verification_code();
    }
    if (service.password_length_wrong(req.body.password))
        getMessage(req.query.app_id, 
                    ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'),
                    20106, 
                    req.query.lang_code, (err,results_message)  => {
                        return res.status(400).send(
                            err ?? results_message.text
                        );
                    });
    else{
        if (req.body.password)
            req.body.password = hashSync(req.body.password, salt);
        service.create(req.query.app_id, req.body, (err, results) => {
            if (err) {
                return checked_error(req.query.app_id, req.query.lang_code, err, res);
            }
            else{
                if (req.body.provider_id == null ) {
                    getParameter(req.query.app_id, ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'),'SERVICE_MAIL_TYPE_SIGNUP', (err, parameter_value)=>{
                        //send email for local users only
                        const emailData = {
                            lang_code : req.query.lang_code,
                            app_user_id : results.insertId,
                            emailType : parameter_value,
                            toEmail : req.body.email,
                            verificationCode : req.body.verification_code
                        }
                        //send email SIGNUP
                        sendEmail(req, emailData, (err, result_sendemail) => {
                            if (err) {
                                //return res from userSignup
                                return res.status(500).send(
                                    err
                                );
                            } 
                            else
                                accessToken(req, (err, Token)=>{
                                    return res.status(200).json({
                                        accessToken: Token,
                                        id: results.insertId,
                                        data: results
                                    });
                                });
                        });  
                    })
                }
                else
                    accessToken(req, (err, Token)=>{
                        return res.status(200).json({
                            accessToken: Token,
                            id: results.insertId,
                            data: results
                        });
                    });
            }
        });
    }
}
const activateUser = (req, res) => {
    req.params.id = parseInt(req.params.id);
    const verification_code_to_check = req.body.verification_code;
    let auth_new_password = null;
    if (req.body.verification_type == 3){
        //reset password
        auth_new_password = service.verification_code();
    }
    service.activateUser(req.query.app_id, req.params.id, req.body.verification_type, verification_code_to_check, auth_new_password, (err, results) => {
        if (err) {
            return checked_error(req.query.app_id, req.query.lang_code, err, res);
        }
        else
            if (auth_new_password == null){
                if (results.affectedRows==1 && req.body.verification_type==4){
                    //new email verified
                    const eventData = {
                        app_id : req.query.app_id,
                        user_account_id: req.params.id,
                        event: 'EMAIL_VERIFIED_CHANGE_EMAIL',
                        event_status: 'SUCCESSFUL',
                        user_language: req.body.user_language,
                        user_timezone: req.body.user_timezone,
                        user_number_system: req.body.user_number_system,
                        user_platform: req.body.user_platform,
                        server_remote_addr : req.ip,
                        server_user_agent : req.headers["user-agent"],
                        server_http_host : req.headers["host"],
                        server_http_accept_language : req.headers["accept-language"],
                        client_latitude : req.body.client_latitude,
                        client_longitude : req.body.client_longitude
                    }
                    insertUserEvent(req.query.app_id, eventData, (err, result_new_user_event)=>{
                        if (err)
                            return res.status(500).send(
                                err
                            );
                        else
                            return res.status(200).json({
                                count: results.changedRows,
                                items: Array(results)
                            });
                    })
                }
                else
                    return res.status(200).json({
                        count: results.changedRows,
                        items: Array(results)
                    });
            }
            else{
                //return accessToken since PASSWORD_RESET is in progress
                //email was verified and activated with data token, but now the password will be updated
                //using accessToken and authentication code
                accessToken(req, (err, Token)=>{
                    return res.status(200).json({
                        count: results.changedRows,
                        auth: auth_new_password,
                        accessToken: Token,
                        items: Array(results)
                    });
                });
            }
    });
}
const passwordResetUser = (req, res) => {
    let email = req.body.email ?? '';
    if (email !='')
        service.getEmailUser(req.query.app_id, email, (err, results) => {
            if (err) {
                return res.status(500).send(
                    err
                );
            }
            else
                if (results){
                    getLastUserEvent(req.query.app_id, results.id, 'PASSWORD_RESET', (err, result_user_event)=>{
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
                                    app_id : req.query.app_id,
                                    user_account_id: results.id,
                                    event: 'PASSWORD_RESET',
                                    event_status: 'INPROGRESS',
                                    user_language: req.body.user_language,
                                    user_timezone: req.body.user_timezone,
                                    user_number_system: req.body.user_number_system,
                                    user_platform: req.body.user_platform,
                                    server_remote_addr : req.ip,
                                    server_user_agent : req.headers["user-agent"],
                                    server_http_host : req.headers["host"],
                                    server_http_accept_language : req.headers["accept-language"],
                                    client_latitude : req.body.client_latitude,
                                    client_longitude : req.body.client_longitude
                                }
                                insertUserEvent(req.query.app_id, eventData, (err, result_new_user_event)=>{
                                    if (err)
                                        return res.status(200).json({
                                            sent: 0
                                        });
                                    else{
                                        let new_code = service.verification_code();
                                        service.updateUserVerificationCode(req.query.app_id, results.id, new_code, (err,result_verification) => {
                                            if (err)
                                                return res.status(500),send(
                                                    err
                                                );
                                            else{
                                                getParameter(req.query.app_id, ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'),'SERVICE_MAIL_TYPE_PASSWORD_RESET', (err, parameter_value)=>{
                                                    const emailData = {
                                                        lang_code : req.query.lang_code,
                                                        app_user_id : results.id,
                                                        emailType : parameter_value,
                                                        toEmail : email,
                                                        verificationCode : new_code
                                                    }
                                                    //send email PASSWORD_RESET
                                                    sendEmail(req, emailData, (err, result_sendemail) => {
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
                                                    })
                                                })
                                            }
                                        })
                                    }
                                })
                            }    
                    })
                }
                else
                    return res.status(200).json({
                        sent: 0
                    });
        })
    else
        return res.status(200).json({
            sent: 0
        });
    
}
const getUserByUserId = (req, res) => {
    req.params.id = parseInt(req.params.id);
    service.getUserByUserId(req.query.app_id, req.params.id, (err, results) => {
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
                import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db/common/common.service.js`).then(({record_not_found}) => {
                    return record_not_found(res, req.query.app_id, req.query.lang_code);
                })
            }
    });
}
const getProfileUser = (req, res) => {
    if (typeof req.params.id == 'undefined' || req.params.id=='' || req.params.id==null){
        //searching for username
        //user not logged in
        req.params.id = null;
        req.query.id = null;
        req.body.user_account_id = null;
        req.body.user_account_id_view = null;
    }
    else
        if (typeof req.query.search == 'undefined' ||req.query.search=='' ||req.query.search==null){
            //searching for user id, ignore username search
            //user logged in
            req.query.search = null;
            if (typeof req.query.id=='undefined' ||req.query.id == '' ||req.query.id == null){
                //user not logged in searching for profile id
                req.query.id = null;
            }
            else{
                //user logged in searching for profile id
                req.query.id = parseInt(req.query.id);
            }
            req.body.user_account_id = req.query.id;
            req.body.user_account_id_view = parseInt(req.params.id);
        }
    req.body.client_ip = req.ip;
    req.body.client_user_agent = req.headers["user-agent"];
    req.body.client_longitude = req.body.client_longitude;
    req.body.client_latitude = req.body.client_latitude;

    service.getProfileUser(req.query.app_id, req.params.id, req.query.search, req.query.id, (err, results) => {
        if (err) {
            return res.status(500).send(
                err
            );
        }
        else{
            if (results){
                if (results.id == req.query.id) {
                    //send without {} so the variablename is not sent
                    return res.status(200).json(
                        results
                    );
                }
                else{
                    //set user id when username is searched
                    if (req.body.user_account_id_view==null)
                        req.body.user_account_id_view = results.id;
                    import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/user_account_view/user_account_view.service.js`).then(({ insertUserAccountView }) => {
                        insertUserAccountView(req.query.app_id, req.body, (err, results_insert) => {
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
                    })
                }
            }
            else{
                import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db/common/common.service.js`).then(({record_not_found}) => {
                    return record_not_found(res, req.query.app_id, req.query.lang_code);
                })
            }
        }            
    });
}
const searchProfileUser = (req, res) => {
    const username = req.query.search;
    service.searchProfileUser(req.query.app_id, username, (err, results) => {
        if (err) {
            return res.status(500).send(
                err
            );
        }
        else{
            req.body.search = username;
            req.body.client_ip = req.ip;
            req.body.client_user_agent = req.headers["user-agent"];
            req.body.client_longitude = req.body.client_longitude;
            req.body.client_latitude = req.body.client_latitude;
            import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/profile_search/profile_search.service.js`).then(({ insertProfileSearch }) => {
                insertProfileSearch(req.query.app_id, req.body, (err, results_insert) => {
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
                            import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db/common/common.service.js`).then(({record_not_found}) => {
                                return record_not_found(res, req.query.app_id, req.query.lang_code);
                            })
                        }
                    }
                });
            })
        }
    });
}
const getProfileDetail = (req, res) => {
    req.params.id = parseInt(req.params.id);
    let detailchoice;
    if (typeof req.query.detailchoice !== 'undefined')
        detailchoice = req.query.detailchoice;

    service.getProfileDetail(req.query.app_id, req.params.id, detailchoice, (err, results) => {
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
                return record_not_found(res, req.query.app_id, req.query.lang_code);
            }
        }
    });
}
const getProfileTop = (req, res) => {
    if (typeof req.params.statchoice !== 'undefined')
        req.params.statchoice = parseInt(req.params.statchoice);
    service.getProfileTop(req.query.app_id, req.params.statchoice, (err, results) => {
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
                return record_not_found(res, req.query.app_id, req.query.lang_code);
            }                    
        }
    });
}
const updateUserLocal = (req, res) => {
    req.params.id = parseInt(req.params.id);
    const salt = genSaltSync(10);
    service.checkPassword(req.query.app_id, req.params.id, (err, results) => {
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
                            getMessage( req.query.app_id,
                                        ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'), 
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
                            service.updateUserLocal(req.query.app_id, req.body, req.params.id, (err, results_update) => {
                                if (err) {
                                    return checked_error(req.query.app_id, req.query.lang_code, err, res);
                                }
                                else{
                                    if (results_update){
                                        if (send_email){
                                            getParameter(req.query.app_id, ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'),'SERVICE_MAIL_TYPE_CHANGE_EMAIL',  (err, parameter_value)=>{
                                                const emailData = {
                                                    lang_code : req.query.lang_code,
                                                    app_user_id : req.params.id,
                                                    emailType : parameter_value,
                                                    toEmail : req.body.new_email,
                                                    verificationCode : req.body.verification_code
                                                }
                                                //send email SERVICE_MAIL_TYPE_CHANGE_EMAIL
                                                sendEmail(req, emailData, (err, result_sendemail) => {
                                                    if (err) {
                                                        return res.status(500).send(
                                                            err
                                                        );
                                                    } 
                                                    else
                                                        return res.status(200).json({
                                                            sent_change_email: 1
                                                        });
                                                })
                                            })
                                        }
                                        else    
                                            return res.status(200).json({
                                                sent_change_email: 0
                                            });
                                    } 
                                    else{
                                        import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db/common/common.service.js`).then(({record_not_found}) => {
                                            return record_not_found(res, req.query.app_id, req.query.lang_code);
                                        })
                                    }
                                }
                            });
                        }
                        if (typeof req.body.new_email != 'undefined' && 
                            req.body.new_email!='' &&
                            req.body.new_email!= null)
                            getLastUserEvent(req.query.app_id, req.params.id, 'EMAIL_VERIFIED_CHANGE_EMAIL', (err, result_user_event)=>{
                                if (err)
                                    return res.status(500).json({
                                        err
                                    });
                                else
                                    if ((result_user_event && (result_user_event.current_timestamp - result_user_event.date_created)/ (1000 * 60 * 60 * 24) >= 1)||
                                        typeof result_user_event == 'undefined'){
                                        //no change email in progress or older than at least 1 day
                                        const eventData = {
                                            app_id : req.query.app_id,
                                            user_account_id: req.params.id,
                                            event: 'EMAIL_VERIFIED_CHANGE_EMAIL',
                                            event_status: 'INPROGRESS',
                                            user_language: req.body.user_language,
                                            user_timezone: req.body.user_timezone,
                                            user_number_system: req.body.user_number_system,
                                            user_platform: req.body.user_platform,
                                            server_remote_addr : req.ip,
                                            server_user_agent : req.headers["user-agent"],
                                            server_http_host : req.headers["host"],
                                            server_http_accept_language : req.headers["accept-language"],
                                            client_latitude : req.body.client_latitude,
                                            client_longitude : req.body.client_longitude
                                        }
                                        insertUserEvent(req.query.app_id, eventData, (err, result_new_user_event)=>{
                                            if (err)
                                                return res.status(500).json({
                                                    err
                                                });
                                            else{
                                                req.body.verification_code = service.verification_code();
                                                updateLocal(true);
                                            }
                                        })
                                    }
                                    else
                                        updateLocal();
                            })
                        else
                            updateLocal();
                    }
                } else {
                    let stack = new Error().stack;
                    import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
                        import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogAppC}) => {
                            createLogAppC(req.query.app_id, ConfigGet(1, 'SERVICE_LOG', 'LEVEL_INFO'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), 
                                          'invalid password attempt for user id:' + req.params.id,
                                          req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, 
                                          res.statusCode, 
                                          req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(() => {
                                //invalid password
                                getMessage(req.query.app_id,
                                           ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'), 
                                           20401, 
                                           req.query.lang_code, (err,results_message)  => {
                                                return res.status(400).send(
                                                    err ?? results_message.text
                                                );
                                           });
                                })
                        });
                    })
                    
                }
            } else {
                //user not found
                getMessage( req.query.app_id,
                            ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'), 
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
const updatePassword = (req, res) => {
    req.params.id = parseInt(req.params.id);
    if (service.password_length_wrong(req.body.new_password))
        getMessage(req.query.app_id,
                    ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'), 
                    20106, 
                    req.query.lang_code, (err,results_message)  => {
                        return res.status(400).send(
                            err ?? results_message.text
                        );
                    });
    else{
        const salt = genSaltSync(10);
        req.body.new_password = hashSync(req.body.new_password, salt);
        service.updatePassword(req.query.app_id, req.params.id, req.body, (err, results) => {
            if (err) {
                return checked_error(req.query.app_id, req.query.lang_code, err, res);
            }
            else {
                if (results) {
                    const eventData = {
                        app_id : req.query.app_id,
                        user_account_id: req.params.id,
                        event: 'PASSWORD_RESET',
                        event_status: 'SUCCESSFUL',
                        user_language: req.body.user_language,
                        user_timezone: req.body.user_timezone,
                        user_number_system: req.body.user_number_system,
                        user_platform: req.body.user_platform,
                        server_remote_addr : req.ip,
                        server_user_agent : req.headers["user-agent"],
                        server_http_host : req.headers["host"],
                        server_http_accept_language : req.headers["accept-language"],
                        client_latitude : req.body.client_latitude,
                        client_longitude : req.body.client_longitude
                    }
                    insertUserEvent(req.query.app_id, eventData, (err, result_insert)=>{
                        if (err)
                            return res.status(200).json({
                                sent: 0
                            });
                        else
                            return res.status(200).send(
                                results
                            );
                    })
                }
                else{
                    import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db/common/common.service.js`).then(({record_not_found}) => {
                        return record_not_found(res, req.query.app_id, req.query.lang_code);
                    })
                }
            }
        });
    }
}
const updateUserCommon = (req, res) => {
    req.params.id = parseInt(req.params.id);
    service.updateUserCommon(req.query.app_id, req.body, req.params.id, (err, results) => {
        if (err) {
            return checked_error(req.query.app_id, req.query.lang_code, err, res);
        }
        else {
            if (results) {
                return res.status(200).send(
                    results
                );
            }
            else{
                import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db/common/common.service.js`).then(({record_not_found}) => {
                    return record_not_found(res, req.query.app_id, req.query.lang_code);
                })
            }
        }
    });
}
const deleteUser = (req, res) => {
    req.params.id = parseInt(req.params.id);
    service.getUserByUserId(req.query.app_id, req.params.id, (err, results) => {
        if (err) {
            return res.status(500).send(
                err
            );
        }
        else {
            if (results) {
                if (results.provider_id !=null){
                    service.deleteUser(req.query.app_id, req.params.id, (err, results_delete) => {
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
                                import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db/common/common.service.js`).then(({record_not_found}) => {
                                    return record_not_found(res, req.query.app_id, req.query.lang_code);
                                })
                            }
                        }
                    });
                }
                else{
                    const salt = genSaltSync(10);
                    service.checkPassword(req.query.app_id, req.params.id, (err, results) => {
                        if (err) {
                            return res.status(500).send(
                                err
                            );
                        }
                        else {
                            if (results) {
                                if (compareSync(req.body.password, results.password)){
                                    service.deleteUser(req.query.app_id, req.params.id, (err, results_delete) => {
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
                                                import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db/common/common.service.js`).then(({record_not_found}) => {
                                                    return record_not_found(res, req.query.app_id, req.query.lang_code);
                                                })
                                            }
                                        }
                                    });
                                }
                                else{
                                    let stack = new Error().stack;
                                    import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
                                        import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogAppC}) => {
                                            createLogAppC(req.query.app_id, ConfigGet(1, 'SERVICE_LOG', 'LEVEL_INFO'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), 
                                                        'invalid password attempt for user id:' + req.params.id,
                                                        req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, 
                                                        res.statusCode, 
                                                        req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(() => {
                                                //invalid password
                                                getMessage(req.query.app_id,
                                                        ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'), 
                                                        20401, 
                                                        req.query.lang_code, (err,results_message)  => {
                                                                return res.status(400).send(
                                                                    err ?? results_message.text
                                                                );
                                                        });
                                                })
                                        });
                                    })
                                } 
                            }
                            else{
                                //user not found
                                getMessage( req.query.app_id,
                                            ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'), 
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
                getMessage(req.query.app_id,
                            ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'), 
                            20305, 
                            req.query.lang_code, (err,results_message)  => {
                                return res.status(404).send(
                                    err ?? results_message.text
                                );
                            });
            }
        }
    })

}
const userLogin = (req, res) => {
    let result_pw;
    let stack = new Error().stack;
    service.userLogin(req.query.app_id, req.body, (err, results) => {
        if (err) {
            return res.status(500).send(
                err
            );
        }
        else{
            req.body.client_ip = req.ip;
            req.body.client_user_agent = req.headers["user-agent"];
            if (typeof req.body.client_longitude == 'undefined')
                req.body.client_longitude = '';
            if (typeof req.body.client_latitude == 'undefined')
                req.body.client_latitude = '';
            if (typeof req.body.client_place == 'undefined')
                req.body.client_place = '';
            if (results) {
                req.body.user_account_id = results.id;
                const result = compareSync(req.body.password, results.password);
                if (result) {
                    result_pw = 1;
                    req.body.result = 1;
                } else {
                    result_pw = 0;
                    req.body.result = 0;
                }
                
                if (result_pw == 1) {
                    if ((req.query.app_id == ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID') && (results.app_role_id == 0 || results.app_role_id == 1))||
                            req.query.app_id != ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID')){
                        createUserAccountApp(req.query.app_id, results.id, (err, results_create) => {
                            if (err) {
                                return res.status(500).send(
                                    err
                                );
                            }
                            else{
                                //if user not activated then send email with new verification code
                                let new_code = service.verification_code();
                                if (results.active == 0){
                                    service.updateUserVerificationCode(req.query.app_id, results.id, new_code, (err,result_verification) => {
                                        if (err)
                                            return res.status(500),send(
                                                err
                                            );
                                        else{
                                            getParameter(req.query.app_id, ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'),'SERVICE_MAIL_TYPE_UNVERIFIED',  (err, parameter_value)=>{
                                                const emailData = {
                                                    lang_code : req.query.lang_code,
                                                    app_user_id : results.id,
                                                    emailType : parameter_value,
                                                    toEmail : results.email,
                                                    verificationCode : new_code
                                                }
                                                //send email UNVERIFIED
                                                sendEmail(req, emailData, (err, result_email) => {
                                                    if (err) {
                                                        return res.status(500).send(
                                                            err
                                                        );
                                                    }
                                                    else{
                                                        accessToken(req, (err, Token)=>{
                                                            req.body.access_token = Token;
                                                            insertUserAccountLogon(req.query.app_id, req.body, (err, result_user_account_logon) => {
                                                                if (err) {
                                                                    return res.status(500).send(
                                                                        err
                                                                    );
                                                                }
                                                                else
                                                                    if (req.query.app_id == 0)
                                                                        import(`file://${process.cwd()}/apps/admin/src/secure/index.js`).then(({ createAdminSecure }) => {
                                                                            createAdminSecure(req.query.app_id, 
                                                                                null,
                                                                                results.id,
                                                                                req.body.client_latitude,
                                                                                req.body.client_longitude, 
                                                                                req.body.client_place)
                                                                            .then((app_result) => {
                                                                                return res.status(200).json({
                                                                                    count: Array(results.items).length,
                                                                                    accessToken: Token,
                                                                                    items: Array(results),
                                                                                    app: app_result
                                                                                });
                                                                            })
                                                                        })
                                                                    else
                                                                        return res.status(200).json({
                                                                            count: Array(results.items).length,
                                                                            accessToken: Token,
                                                                            items: Array(results)
                                                                        });
                                                            });
                                                        });
                                                    }
                                                })
                                            })
                                        }
                                    })
                                }
                                else{
                                    accessToken(req, (err, Token)=>{
                                        req.body.access_token = Token;
                                        insertUserAccountLogon(req.query.app_id, req.body, (err, result_user_account_logon) => {
                                            if (err) {
                                                return res.status(500).send(
                                                    err
                                                );
                                            }
                                            else
                                            if (req.query.app_id == 0)
                                                import(`file://${process.cwd()}/apps/admin/src/secure/index.js`).then(({ createAdminSecure }) => {
                                                    createAdminSecure(req.query.app_id, 
                                                        null,
                                                        results.id,
                                                        req.body.client_latitude,
                                                        req.body.client_longitude, 
                                                        req.body.client_place)
                                                    .then((app_result) => {
                                                        return res.status(200).json({
                                                            count: Array(results.items).length,
                                                            accessToken: Token,
                                                            items: Array(results),
                                                            app: app_result
                                                        });
                                                    })
                                                })
                                            else
                                                return res.status(200).json({
                                                    count: Array(results.items).length,
                                                    accessToken: Token,
                                                    items: Array(results)
                                                });
                                            })
                                    });
                                }
                            }
                        });
                    }
                    else{
                        //unauthorized, only admin allowed to log in to admin
                        import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
                            import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogAppC}) => {
                                createLogAppC(req.query.app_id, ConfigGet(1, 'SERVICE_LOG', 'LEVEL_INFO'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), 
                                                'unauthorized admin login attempt for user id:' + req.body.user_account_id + ', username:' + req.body.username,
                                                req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, 
                                                res.statusCode, 
                                                req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(() => {
                                    return res.status(401).send(
                                        '⛔'
                                    );
                                })
                            });
                        })
                    }
                    
                } else {
                    insertUserAccountLogon(req.query.app_id, req.body, (err, result_user_account_logon) => {
                        if (err) {
                            return res.status(500).send(
                                err
                            );
                        }
                        else{
                            //Username or password not found
                            import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
                                import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogAppC}) => {
                                    createLogAppC(req.query.app_id, ConfigGet(1, 'SERVICE_LOG', 'LEVEL_INFO'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), 
                                                  'invalid password attempt for user id:' + req.body.user_account_id + ', username:' + req.body.username,
                                                  req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, 
                                                  res.statusCode, 
                                                  req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(() => {
                                        getMessage( req.query.app_id,
                                                    ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'), 
                                                    20300, 
                                                    req.query.lang_code, (err,results_message)  => {
                                                            return res.status(400).send(
                                                                err ?? results_message.text
                                                            );
                                                    });
                                    })
                                });
                            })
                        }
                    })
                }
            } else{
                //User not found
                import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
                    import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogAppC}) => {
                        createLogAppC(req.query.app_id, ConfigGet(1, 'SERVICE_LOG', 'LEVEL_INFO'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), 
                                      'user not found:' + req.body.username,
                                      req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, 
                                      res.statusCode, 
                                      req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(() => {
                            getMessage( req.query.app_id,
                                        ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'), 
                                        20305, 
                                        req.query.lang_code, (err,results_message)  => {
                                            return res.status(404).send(
                                                err ?? results_message.text
                                            );
                                        });
                        })
                    });
                })
            }
        }
    });
}
const providerSignIn = (req, res) => {
    req.body.result = 1;
    req.body.client_ip = req.ip;
    req.body.client_user_agent = req.headers["user-agent"];
    req.body.client_longitude = req.body.client_longitude;
    req.body.client_latitude = req.body.client_latitude;
    req.params.id = parseInt(req.params.id);
    service.providerSignIn(req.query.app_id, req.body.identity_provider_id, req.params.id, (err, results) => {
        if (err) {
            return res.status(500).send(
                err
            );
        }
        else{
            if (results.length > 0) {
                service.updateSigninProvider(req.query.app_id, results[0].id, req.body, (err, results_update) => {
                    if (err) {
                        return checked_error(req.query.app_id, req.query.lang_code, err, res);
                    }
                    else{
                        req.body.user_account_id = results[0].id;
                        createUserAccountApp(req.query.app_id, results[0].id, (err, results_create_useraccountapp) => {
                            if (err) {
                                return res.status(500).send(
                                    err
                                );
                            }
                            else{
                                accessToken(req, (err, Token)=>{
                                    req.body.access_token = Token;
                                    insertUserAccountLogon(req.query.app_id, req.body, (err, results_insert_user_account_logon) => {
                                        if (err) {
                                            return res.status(500).send(
                                                err
                                            );
                                        }
                                        else
                                            return res.status(200).json({
                                                count: results.length,
                                                accessToken: Token,
                                                items: results,
                                                userCreated: 0
                                            });
                                    });
                                });
                            }
                        });        
                    }
                });
                
            } else {
                //if provider user not found then create user and one user setting
                //avatar not used by providers, set default null
                if (typeof req.body.avatar == 'undefined')
                    req.body.avatar = null;
                //one of the images should be empty, set defaul null
                if (typeof req.body.provider_image == 'undefined')
                    req.body.provider_image = null;

                service.create(req.query.app_id, req.body, (err, results_create) => {
                    if (err) {
                        return res.status(500).send(
                            err
                        );
                    }
                    else{
                        req.body.user_account_id = results_create.insertId;
                        createUserAccountApp(req.query.app_id, results_create.insertId, (err, results_create_useraccountapp) => {
                            if (err) {
                                return res.status(500).send(
                                    err
                                );
                            }
                            else{
                                service.providerSignIn(req.query.app_id, req.body.identity_provider_id, req.params.id, (err, results) => {
                                    if (err) {
                                        return res.status(500).send(
                                            err
                                        );
                                    }
                                    else{
                                        accessToken(req, (err, Token)=>{
                                            req.body.access_token = Token;
                                            insertUserAccountLogon(req.query.app_id, req.body, (err, results_user_account_logon) => {
                                                if (err) {
                                                    return res.status(500).send(
                                                        err
                                                    );
                                                }
                                                else
                                                    return res.status(200).json({
                                                        count: results.length,
                                                        accessToken: Token,
                                                        items: results,
                                                        userCreated: 1
                                                    });
                                            })
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
}
export{getUsersAdmin, getStatCountAdmin, checked_error, updateUserSuperAdmin, userSignup, activateUser, 
       passwordResetUser, getUserByUserId, getProfileUser, searchProfileUser, getProfileDetail,
       getProfileTop, updateUserLocal, updatePassword, updateUserCommon,deleteUser, userLogin, providerSignIn};