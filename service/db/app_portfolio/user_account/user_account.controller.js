const {
    password_length_wrong, 
    get_app_code,
    verification_code,
    create,
    activateUser,
    updateUserVerificationCode,
    getUserByUserId,
    getProfileUser,
    searchProfileUser,
    getProfileDetail,
    getProfileTop,
    checkPassword,
    updatePassword,
    updateUserLocal,
    updateUserCommon,
    deleteUser,
    userLogin,
    updateSigninProvider,
    providerSignIn,
    getStatCountAdmin,
    getEmailUser
} = require("./user_account.service");

const { genSaltSync, hashSync, compareSync } = require("bcryptjs");
const { getMessage } = require("../message_translation/message_translation.service");
const { insertProfileSearch } = require("../profile_search/profile_search.service");
const { createUserAccountApp } = require("../user_account_app/user_account_app.service");
const { getLastUserEvent, insertUserEvent } = require("../user_account_event/user_account_event.service");
const { insertUserAccountLogon } = require("../user_account_logon/user_account_logon.service");
const { insertUserAccountView } = require("../user_account_view/user_account_view.service");
const { getParameter } = require ("../app_parameter/app_parameter.service");
const { sendEmail } = require("../../../../service/mail/mail.controller");
const { createLogAppCI } = require("../../../../service/log/log.controller");
const { accessToken } = require("../../../../service/auth/auth.controller");

module.exports = {
    
    userSignup: (req, res) => {
        const salt = genSaltSync(10);
        if (typeof req.body.provider_id == 'undefined') {
            //generate verification code for local users only
            req.body.verification_code = verification_code();
        }
        if (password_length_wrong(req.body.password))
            getMessage(req.query.app_id, 
                       process.env.COMMON_APP_ID,
                       20106, 
                       req.query.lang_code, (err,results_message)  => {
                            return res.status(400).send(
                                err ?? results_message.text
                            );
                       });
        else{
            if (req.body.password)
                req.body.password = hashSync(req.body.password, salt);
            create(req.query.app_id, req.body, (err, results) => {
                if (err) {
                    var app_code = get_app_code(err.errorNum, 
                                                err.message, 
                                                err.code, 
                                                err.errno, 
                                                err.sqlMessage);
                    if (app_code != null){
                        getMessage(req.query.app_id,
                                   process.env.COMMON_APP_ID, 
                                   app_code, 
                                   req.query.lang_code, (err,results_message)  => {
                                            return res.status(400).send(
                                                err ?? results_message.text
                                            );
                                   });
                    }
                    else
                        return res.status(500).send(
                            err
                        );
                }
                else{
                    if (typeof req.body.provider_id == 'undefined' ) {
                        getParameter(req.query.app_id, process.env.COMMON_APP_ID,'SERVICE_MAIL_TYPE_SIGNUP', (err, parameter_value)=>{
                            //send email for local users only
                            const emailData = {
                                lang_code : req.query.lang_code,
                                app_id : process.env.COMMON_APP_ID,
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
    },
    activateUser: (req, res) => {
        const verification_code_to_check = req.body.verification_code;
        let auth_new_password = null;
        if (req.body.verification_type == 3){
            //reset password
            auth_new_password = verification_code();
        }
        activateUser(req.query.app_id, req.params.id, req.body.verification_type, verification_code_to_check, auth_new_password, (err, results) => {
            if (err) {
                var app_code = get_app_code(err.errorNum, 
                    err.message, 
                    err.code, 
                    err.errno, 
                    err.sqlMessage);
                if (app_code != null){
                    getMessage(req.query.app_id,
                        process.env.COMMON_APP_ID, 
                        app_code, 
                        req.query.lang_code, (err,results_message)  => {
                                    return res.status(400).send(
                                        err ?? results_message.text
                                    );
                        });
                }
                else
                    return res.status(500).send(
                        err
                    );
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
    },
    passwordResetUser: (req, res) => {
        let email = req.body.email ?? '';
        if (email !='')
            getEmailUser(req.query.app_id, email, (err, results) => {
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
                                            let new_code = verification_code();
                                            updateUserVerificationCode(req.query.app_id, results.id, new_code, (err,result_verification) => {
                                                if (err)
                                                    return res.status(500),send(
                                                        err
                                                    );
                                                else{
                                                    getParameter(req.query.app_id, process.env.COMMON_APP_ID,'SERVICE_MAIL_TYPE_PASSWORD_RESET', (err, parameter_value)=>{
                                                        const emailData = {
                                                            lang_code : req.query.lang_code,
                                                            app_id : process.env.COMMON_APP_ID,
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
        
    },
    getUserByUserId: (req, res) => {
        getUserByUserId(req.query.app_id, req.params.id, (err, results) => {
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
                    //Record not found
                    getMessage( req.query.app_id,
                                process.env.COMMON_APP_ID, 
                                20400, 
                                req.query.lang_code, (err,results_message)  => {
                                    return res.status(404).send(
                                        err ?? results_message.text
                                        );
                                });
                }
        });
    },
    getProfileUser: (req, res) => {
        if (typeof req.params.id == 'undefined' || req.params.id=='' || req.params.id==null){
            //searching for username
            //user not logged in
            req.params.id = null;
            req.query.id = null;
            req.body.user_account_id = null;
            req.body.user_account_id_view = null;
        }
        else
            if (typeof req.params.username == 'undefined' ||req.params.username=='' ||req.params.username==null){
                //searching for user id, ignore username search
                //user logged in
                req.params.username = null;
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

        getProfileUser(req.query.app_id, req.params.id, req.params.username, req.query.id, (err, results) => {
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
                    }
                }
                else{
                    //Record not found
                    getMessage( req.query.app_id,
                                process.env.COMMON_APP_ID, 
                                20400, 
                                req.query.lang_code, (err,results_message)  => {
                                    return res.status(404).send(
                                        err ?? results_message.text
                                    );
                                });
                }
            }            
        });
    },
    searchProfileUser: (req, res) => {
        const username = req.params.username;
        searchProfileUser(req.query.app_id, username, (err, results) => {
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
                            //Record not found
                            getMessage( req.query.app_id,
                                        process.env.COMMON_APP_ID, 
                                        20400, 
                                        req.query.lang_code, (err,results_message)  => {
                                            return res.status(404).send(
                                                err ?? results_message.text
                                            );
                                        });
                        }
                    }
                });
            }
        });
    },
    getProfileDetail: (req, res) => {
        var detailchoice;
        if (typeof req.query.detailchoice !== 'undefined')
            detailchoice = req.query.detailchoice;

        getProfileDetail(req.query.app_id, req.params.id, detailchoice, (err, results) => {
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
                    //Record not found
                    getMessage( req.query.app_id,
                                process.env.COMMON_APP_ID, 
                                20400, 
                                req.query.lang_code, (err,results_message)  => {
                                    return res.status(404).json({
                                            count: 0,
                                            message: err ?? results_message.text
                                        });
                                });
                }
            }
        });
    },
    getProfileTop: (req, res) => {
        var statchoice;
        if (typeof req.params.statchoice !== 'undefined')
            statchoice = req.params.statchoice;
        getProfileTop(req.query.app_id, statchoice, (err, results) => {
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
                    //Record not found
                    getMessage( req.query.app_id,
                                process.env.COMMON_APP_ID, 
                                20400, 
                                req.query.lang_code, (err,results_message)  => {
                                    return res.status(404).json({
                                            count: 0,
                                            message: err ?? results_message.text
                                        });
                                });
                }                    
            }
        });
    },
    updateUserLocal: (req, res) => {
        const salt = genSaltSync(10);
        checkPassword(req.query.app_id, req.params.id, (err, results) => {
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
                            password_length_wrong(req.body.new_password))
                                getMessage( req.query.app_id,
                                            process.env.COMMON_APP_ID, 
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
                            function updateLocal(send_email){
                                updateUserLocal(req.query.app_id, req.body, req.params.id, (err, results_update) => {
                                    if (err) {
                                        var app_code = get_app_code(err.errorNum, 
                                                                    err.message, 
                                                                    err.code, 
                                                                    err.errno, 
                                                                    err.sqlMessage);
                                        if (app_code != null)
                                            getMessage( req.query.app_id,
                                                        process.env.COMMON_APP_ID, 
                                                        app_code, 
                                                        req.query.lang_code, (err,results_message)  => {
                                                            return res.status(400).send(
                                                                err ?? results_message.text
                                                            );
                                                        });
                                        else
                                            return res.status(500).send(
                                                err
                                            );
                                    }
                                    else{
                                        if (results_update){
                                            if (send_email){
                                                getParameter(req.query.app_id, process.env.COMMON_APP_ID,'SERVICE_MAIL_TYPE_CHANGE_EMAIL',  (err, parameter_value)=>{
                                                    const emailData = {
                                                        lang_code : req.query.lang_code,
                                                        app_id : process.env.COMMON_APP_ID,
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
                                            //record not found
                                            getMessage( req.query.app_id,
                                                        process.env.COMMON_APP_ID, 
                                                        20400, 
                                                        req.query.lang_code, (err,results_message)  => {
                                                            return res.status(404).send(
                                                                err ?? results_message.text
                                                            );
                                                        });
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
                                                    req.body.verification_code = verification_code();
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
                        createLogAppCI(req, res, __appfilename, __appfunction, __appline, 
                                       'invalid password attempt for user id:' + req.params.id, (err, result_log)=>{
                            //invalid password
                            getMessage(req.query.app_id,
                                       process.env.COMMON_APP_ID, 
                                       20401, 
                                       req.query.lang_code, (err,results_message)  => {
                                            return res.status(400).send(
                                                err ?? results_message.text
                                            );
                                       });
                        })
                        
                    }
                } else {
                    //user not found
                    getMessage( req.query.app_id,
                                process.env.COMMON_APP_ID, 
                                20305, 
                                req.query.lang_code, (err,results_message)  => {
                                    return res.status(404).send(
                                        err ?? results_message.text
                                    );
                                });
                }
            }
        });
    },
    updatePassword: (req, res) =>{
        if (password_length_wrong(req.body.new_password))
            getMessage(req.query.app_id,
                       process.env.COMMON_APP_ID, 
                       20106, 
                       req.query.lang_code, (err,results_message)  => {
                            return res.status(400).send(
                                err ?? results_message.text
                            );
                       });
        else{
            const salt = genSaltSync(10);
            req.body.new_password = hashSync(req.body.new_password, salt);
            updatePassword(req.query.app_id, req.params.id, req.body, (err, results) => {
                if (err) {
                    var app_code = get_app_code(err.errorNum, 
                                                err.message, 
                                                err.code, 
                                                err.errno, 
                                                err.sqlMessage);
                    if (app_code != null){
                        getMessage(req.query.app_id,
                                   process.env.COMMON_APP_ID, 
                                   app_code, 
                                   req.query.lang_code, (err,results_message)  => {
                                        return res.status(500).send(
                                            err ?? results_message.text
                                        );
                                   });
                    }
                    else
                        return res.status(500).send(
                            err
                        );
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
                        //record not found
                        getMessage( req.query.app_id,
                                    process.env.COMMON_APP_ID, 
                                    20400, 
                                    req.query.lang_code, (err,results_message)  => {
                                        return res.status(404).send(
                                            err ?? results_message.text
                                        );
                                    });
                    }
                }
            });
        }
    },
    updateUserCommon: (req, res) => {
        updateUserCommon(req.query.app_id, req.body, req.params.id, (err, results) => {
            if (err) {
                var app_code = get_app_code(err.errorNum, 
                    err.message, 
                    err.code, 
                    err.errno, 
                    err.sqlMessage);
                if (app_code != null){
                    getMessage(req.query.app_id,
                        process.env.COMMON_APP_ID, 
                        app_code, 
                        req.query.lang_code, (err,results_message)  => {
                                    return res.status(400).send(
                                        err ?? results_message.text
                                    );
                        });
                }
                else
                    return res.status(500).send(
                        err
                    );
            }
            else {
                if (results) {
                    return res.status(200).send(
                        results
                    );
                }
                else{
                    //record not found
                    getMessage( req.query.app_id,
                        process.env.COMMON_APP_ID, 
                        20400, 
                        req.query.lang_code, (err,results_message)  => {
                            return res.status(404).send(
                                err ?? results_message.text
                            );
                        });
                }
            }
        });
    },
    deleteUser: (req, res) => {
        getUserByUserId(req.query.app_id, req.params.id, (err, results) => {
            if (err) {
                return res.status(500).send(
                    err
                );
            }
            else {
                if (results) {
                    if (results.provider_id !=null){
                        deleteUser(req.query.app_id, req.params.id, (err, results_delete) => {
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
                                    //record not found
                                    getMessage( req.query.app_id,
                                        process.env.COMMON_APP_ID, 
                                        20400, 
                                        req.query.lang_code, (err,results_message)  => {
                                            return res.status(404).send(
                                                err ?? results_message.text
                                            );
                                        });
                                }
                            }
                        });
                    }
                    else{
                        const salt = genSaltSync(10);
                        checkPassword(req.query.app_id, req.params.id, (err, results) => {
                            if (err) {
                                return res.status(500).send(
                                    err
                                );
                            }
                            else {
                                if (results) {
                                    if (compareSync(req.body.password, results.password)){
                                        deleteUser(req.query.app_id, req.params.id, (err, results_delete) => {
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
                                                    //record not found
                                                    getMessage( req.query.app_id,
                                                        process.env.COMMON_APP_ID, 
                                                        20400, 
                                                        req.query.lang_code, (err,results_message)  => {
                                                            return res.status(404).send(
                                                                err ?? results_message.text
                                                            );
                                                        });
                                                }
                                            }
                                        });
                                    }
                                    else{
                                        createLogAppCI(req, res, __appfilename, __appfunction, __appline, 
                                                       'invalid password attempt for user id:' + req.params.id, (err, result_log)=>{
                                            //invalid password
                                            getMessage( req.query.app_id,
                                                        process.env.COMMON_APP_ID, 
                                                        20401, 
                                                        req.query.lang_code, (err,results_message)  => {
                                                            return res.status(400).send(
                                                                err ?? results_message.text
                                                            );
                                                        });
                                        })
                                    } 
                                }
                                else{
                                    //user not found
                                    getMessage( req.query.app_id,
                                                process.env.COMMON_APP_ID, 
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
                               process.env.COMMON_APP_ID, 
                               20305, 
                               req.query.lang_code, (err,results_message)  => {
                                    return res.status(404).send(
                                        err ?? results_message.text
                                    );
                               });
                }
            }
        })

    },
    userLogin: (req, res) => {
        var result_pw;
        userLogin(req.query.app_id, req.body, (err, results) => {
            if (err) {
                return res.status(500).send(
                    err
                );
            }
            else{
                req.body.client_ip = req.ip;
                req.body.client_user_agent = req.headers["user-agent"];
                if (req.body.client_longitude == 'undefined')
                    req.body.client_longitude = '';
                if (req.body.client_latitude == 'undefined')
                    req.body.client_latitude = '';

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
                    createUserAccountApp(req.query.app_id, results.id, (err, results_create) => {
                        if (err) {
                            return res.status(500).send(
                                err
                            );
                        }
                        else{
                            if (result_pw == 1) {
                                //if user not activated then send email with new verification code
                                let new_code = verification_code();
                                if (results.active == 0){
                                    updateUserVerificationCode(req.query.app_id, results.id, new_code, (err,result_verification) => {
                                        if (err)
                                            return res.status(500),send(
                                                err
                                            );
                                        else{
                                            getParameter(req.query.app_id, process.env.COMMON_APP_ID,'SERVICE_MAIL_TYPE_UNVERIFIED',  (err, parameter_value)=>{
                                                const emailData = {
                                                    lang_code : req.query.lang_code,
                                                    app_id : process.env.COMMON_APP_ID,
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
                                                return res.status(200).json({
                                                    count: Array(results.items).length,
                                                    accessToken: Token,
                                                    items: Array(results)
                                                });
                                        })
                                    });
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
                                        createLogAppCI(req, res, __appfilename, __appfunction, __appline, 
                                            'invalid password attempt for user id:' + req.body.user_account_id + ', username:' + req.body.username, (err, result_log)=>{
                                            getMessage( req.query.app_id,
                                                        process.env.COMMON_APP_ID, 
                                                        20300, 
                                                        req.query.lang_code, (err,results_message)  => {
                                                                return res.status(400).send(
                                                                    err ?? results_message.text
                                                                );
                                                        });
                                        })
                                    }
                                })
                            }
                        }
                    });
                } else{
                    //User not found
                    createLogAppCI(req, res, __appfilename, __appfunction, __appline, 
                                   'user not found:' + req.body.username, (err, result_log)=>{
                        getMessage( req.query.app_id,
                                    process.env.COMMON_APP_ID, 
                                    20305, 
                                    req.query.lang_code, (err,results_message)  => {
                                        return res.status(404).send(
                                            err ?? results_message.text
                                        );
                                    });
                    })
                }
            }
        });
    },
    providerSignIn: (req, res) => {
        req.body.result = 1;
        req.body.client_ip = req.ip;
        req.body.client_user_agent = req.headers["user-agent"];
        req.body.client_longitude = req.body.client_longitude;
        req.body.client_latitude = req.body.client_latitude;
        providerSignIn(req.query.app_id, req.body.identity_provider_id, req.params.id, (err, results) => {
            if (err) {
                return res.status(500).send(
                    err
                );
            }
            else{
                if (results.length > 0) {
                    updateSigninProvider(req.query.app_id, results[0].id, req.body, (err, results_update) => {
                        if (err) {
                            var app_code = get_app_code(err.errorNum, 
                                err.message, 
                                err.code, 
                                err.errno, 
                                err.sqlMessage);
                            if (app_code != null){
                                getMessage(req.query.app_id,
                                    process.env.COMMON_APP_ID, 
                                    app_code, 
                                    req.query.lang_code, (err,results_message)  => {
                                                return res.status(400).send(
                                                    err ?? results_message.text
                                                );
                                    });
                            }
                            else
                                return res.status(500).send(
                                    err
                                );
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

                    create(req.query.app_id, req.body, (err, results_create) => {
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
                                    getUserByProviderId(req.query.app_id, req.body.identity_provider_id, req.params.id, (err, results) => {
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
    },
    getStatCountAdmin: (req, res) => {
        getStatCountAdmin(req.query.app_id, (err, results) => {
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
    },
}