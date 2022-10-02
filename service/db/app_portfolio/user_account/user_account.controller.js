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
    getUserByProviderId,
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
                       req.query.lang_code, (err2,results2)  => {
                            return res.status(400).send(
                                err2 ?? results2.text
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
                                   req.query.lang_code, (err2,results2)  => {
                                            return res.status(400).send(
                                                err2 ?? results2.text
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
                        getParameter(req.query.app_id, process.env.COMMON_APP_ID,'SERVICE_MAIL_TYPE_SIGNUP', (err3, parameter_value)=>{
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
                            sendEmail(req, emailData, (err4, result4) => {
                                if (err4) {
                                    //return res from userSignup
                                    return res.status(500).send(
                                        err4
                                    );
                                } 
                                else
                                    accessToken(req, (err5, Token)=>{
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
                        accessToken(req, (err6, Token)=>{
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
                                    result_user_event.event_days < 1)
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
                                            updateUserVerificationCode(req.query.app_id, results.id, new_code, (err_verification,result_verification) => {
                                                if (err_verification)
                                                    return res.status(500),send(
                                                        err_verification
                                                    );
                                                else{
                                                    getParameter(req.query.app_id, process.env.COMMON_APP_ID,'SERVICE_MAIL_TYPE_PASSWORD_RESET', (err3, parameter_value)=>{
                                                        const emailData = {
                                                            lang_code : req.query.lang_code,
                                                            app_id : process.env.COMMON_APP_ID,
                                                            app_user_id : results.id,
                                                            emailType : parameter_value,
                                                            toEmail : email,
                                                            verificationCode : new_code
                                                        }
                                                        //send email PASSWORD_RESET
                                                        sendEmail(req, emailData, (err4, result_sendemail) => {
                                                            if (err4) {
                                                                return res.status(500).send(
                                                                    err4
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
                if (!results) {
                    //Record not found
                    getMessage( req.query.app_id,
                                process.env.COMMON_APP_ID, 
                                20400, 
                                req.query.lang_code, (err2,results2)  => {
                                    return res.status(404).send(
                                        err2 ?? results2.text
                                        );
                                });
                }
                else{
                    //send without {} so the variablename is not sent
                    return res.status(200).json(
                        results
                    );
                }
        });
    },
    getProfileUser: (req, res) => {
        if (typeof req.params.id == 'undefined')
            req.params.id = null;
        if (typeof req.params.username == 'undefined')
            req.params.username = null;
        const username = req.params.username;
        var id_current_user;

        if (typeof req.query.id !== 'undefined')
            id_current_user = req.query.id;

        if (id_current_user == '')
            id_current_user = null;
        else
            id_current_user = parseInt(id_current_user);
        req.body.user_account_id = id_current_user;
        req.body.user_account_id_view = req.params.id;
        req.body.client_ip = req.ip;
        req.body.client_user_agent = req.headers["user-agent"];
        req.body.client_longitude = req.body.client_longitude;
        req.body.client_latitude = req.body.client_latitude;

        getProfileUser(req.query.app_id, req.params.id, username, id_current_user, (err, results) => {
            if (err) {
                return res.status(500).send(
                    err
                );
            }
            else{
                if (!results){
                    //Record not found
                    getMessage( req.query.app_id,
                                process.env.COMMON_APP_ID, 
                                20400, 
                                req.query.lang_code, (err2,results2)  => {
                                    return res.status(404).send(
                                        err2 ?? results2.text
                                    );
                                });
                }
                else{
                    if ((results.id == id_current_user) == false) {
                        insertUserAccountView(req.query.app_id, req.body, (err, results) => {
                            if (err) {
                                return res.status(500).send(
                                    err
                                );
                            }
                        });
                    }
                    //send without {} so the variablename is not sent
                    return res.status(200).json(
                        results
                    );
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
                insertProfileSearch(req.query.app_id, req.body, (err, results2) => {
                    if (err) {
                        return res.status(500).send(
                            err
                        );
                    }
                });

                if (!results) {
                    //Record not found
                    getMessage( req.query.app_id,
                                process.env.COMMON_APP_ID, 
                                20400, 
                                req.query.lang_code, (err2,results2)  => {
                                    return res.status(404).send(
                                        err2 ?? results2.text
                                    );
                                });
                }
                else
                    return res.status(200).json({
                        count: results.length,
                        items: results
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
                if (!results) {
                    //Record not found
                    getMessage( req.query.app_id,
                                process.env.COMMON_APP_ID, 
                                20400, 
                                req.query.lang_code, (err2,results2)  => {
                                    return res.status(404).json({
                                            count: 0,
                                            message: err2 ?? results2.text
                                        });
                                });
                }
                else
                    return res.status(200).json({
                        count: results.length,
                        items: results
                    });
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
                if (!results) {
                    //Record not found
                    getMessage( req.query.app_id,
                                process.env.COMMON_APP_ID, 
                                20400, 
                                req.query.lang_code, (err2,results2)  => {
                                    return res.status(404).json({
                                            count: 0,
                                            message: err2 ?? results2.text
                                        });
                                });
                }
                else
                    return res.status(200).json({
                        count: results.length,
                        items: results
                    });
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
                                            req.query.lang_code, (err2,results2)  => {
                                                    return res.status(400).send(
                                                        err2 ?? results2.text
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
                                updateUserLocal(req.query.app_id, req.body, req.params.id, (err_update, results_update) => {
                                    if (err_update) {
                                        var app_code = get_app_code(err_update.errorNum, 
                                                                    err_update.message, 
                                                                    err_update.code, 
                                                                    err_update.errno, 
                                                                    err_update.sqlMessage);
                                        if (app_code != null)
                                            getMessage( req.query.app_id,
                                                        process.env.COMMON_APP_ID, 
                                                        app_code, 
                                                        req.query.lang_code, (err2,results2)  => {
                                                            return res.status(400).send(
                                                                err2 ?? results2.text
                                                            );
                                                        });
                                        else
                                            return res.status(500).send(
                                                err_update
                                            );
                                    }
                                    else{
                                        if (!results_update) {
                                            //record not found
                                            getMessage( req.query.app_id,
                                                        process.env.COMMON_APP_ID, 
                                                        20400, 
                                                        req.query.lang_code, (err2,results2)  => {
                                                            return res.status(404).send(
                                                                err2 ?? results2.text
                                                            );
                                                        });
                                        }
                                        else
                                            if (send_email){
                                                getParameter(req.query.app_id, process.env.COMMON_APP_ID,'SERVICE_MAIL_TYPE_CHANGE_EMAIL',  (err3, parameter_value)=>{
                                                    const emailData = {
                                                        lang_code : req.query.lang_code,
                                                        app_id : process.env.COMMON_APP_ID,
                                                        app_user_id : req.params.id,
                                                        emailType : parameter_value,
                                                        toEmail : req.body.new_email,
                                                        verificationCode : req.body.verification_code
                                                    }
                                                    //send email SERVICE_MAIL_TYPE_CHANGE_EMAIL
                                                    sendEmail(req, emailData, (err4, result_sendemail) => {
                                                        if (err4) {
                                                            return res.status(500).send(
                                                                err4
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
                                        if ((result_user_event && result_user_event.event_days >= 1)||
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
                                       'invalid password attempt for user id:' + req.params.id, (err_log, result_log)=>{
                            //invalid password
                            getMessage(req.query.app_id,
                                       process.env.COMMON_APP_ID, 
                                       20401, 
                                       req.query.lang_code, (err2,results2)  => {
                                            return res.status(400).send(
                                                err2 ?? results2.text
                                            );
                                       });
                        })
                        
                    }
                } else {
                    //user not found
                    getMessage( req.query.app_id,
                                process.env.COMMON_APP_ID, 
                                20305, 
                                req.query.lang_code, (err2,results2)  => {
                                    return res.status(404).send(
                                        err2 ?? results2.text
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
                       req.query.lang_code, (err2,results2)  => {
                            return res.status(400).send(
                                err2 ?? results2.text
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
                                   req.query.lang_code, (err2,results2)  => {
                                        return res.status(500).send(
                                            err2 ?? results2.text
                                        );
                                   });
                    }
                    else
                        return res.status(500).send(
                            err
                        );
                }
                else {
                    if (!results) {
                        //record not found
                        getMessage( req.query.app_id,
                                    process.env.COMMON_APP_ID, 
                                    20400, 
                                    req.query.lang_code, (err2,results2)  => {
                                        return res.status(404).send(
                                            err2 ?? results2.text
                                        );
                                    });
                    }
                    else{
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
                        insertUserEvent(req.query.app_id, eventData, (err, result_new_user_event)=>{
                            if (err)
                                return res.status(200).json({
                                    sent: 0
                                });
                            else
                                return res.status(200).send(
                                    null
                                );
                        })
                    }
                }
            });
        }
    },
    updateUserCommon: (req, res) => {
        updateUserCommon(req.query.app_id, req.body, req.params.id, (err, results) => {
            if (err) {
                return res.status(500).send(
                    err
                );
            }
            else {
                if (!results) {
                    //record not found
                    getMessage( req.query.app_id,
                                process.env.COMMON_APP_ID, 
                                20400, 
                                req.query.lang_code, (err2,results2)  => {
                                    return res.status(404).send(
                                        err2 ?? results2.text
                                    );
                                });
                }
                else
                    return res.status(200).send(
                        null
                    );
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
                        deleteUser(req.query.app_id, req.params.id, (err, results) => {
                            if (err) {
                                return res.status(500).send(
                                    err
                                );
                            }
                            else{
                                if (!results) {
                                    //record not found
                                    getMessage( req.query.app_id,
                                                process.env.COMMON_APP_ID, 
                                                20400, 
                                                req.query.lang_code, (err2,results2)  => {
                                                    return res.status(404).send(
                                                        err2 ?? results2.text
                                                    );
                                                });
                                }
                                else{
                                    return res.status(200).send(
                                        null
                                    );
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
                                        deleteUser(req.query.app_id, req.params.id, (err, results) => {
                                            if (err) {
                                                return res.status(500).send(
                                                    err
                                                );
                                            }
                                            else{
                                                if (!results) {
                                                    //record not found
                                                    getMessage( req.query.app_id,
                                                                process.env.COMMON_APP_ID, 
                                                                20400, 
                                                                req.query.lang_code, (err2,results2)  => {
                                                                    return res.status(404).send(
                                                                        err2 ?? results2.text
                                                                    );
                                                                });
                                                }
                                                else{
                                                    return res.status(200).send(
                                                        null
                                                    );
                                                }
                                            }
                                        });
                                    }
                                    else{
                                        createLogAppCI(req, res, __appfilename, __appfunction, __appline, 
                                                       'invalid password attempt for user id:' + req.params.id, (err_log, result_log)=>{
                                            //invalid password
                                            getMessage( req.query.app_id,
                                                        process.env.COMMON_APP_ID, 
                                                        20401, 
                                                        req.query.lang_code, (err2,results2)  => {
                                                            return res.status(400).send(
                                                                err2 ?? results2.text
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
                                                req.query.lang_code, (err2,results2)  => {
                                                    return res.status(404).send(
                                                        err2 ?? results2.text
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
                               req.query.lang_code, (err2,results2)  => {
                                    return res.status(404).send(
                                        err2 ?? results2.text
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
                    createUserAccountApp(req.query.app_id, results.id, (err3, results3) => {
                        if (err3) {
                            return res.status(500).send(
                                err3
                            );
                        }
                    });
                    if (result_pw == 1) {
                        //if user not activated then send email with new verification code
                        let new_code = verification_code();
                        if (results.active == 0){
                            updateUserVerificationCode(req.query.app_id, results.id, new_code, (err_verification,result_verification) => {
                                if (err_verification)
                                    return res.status(500),send(
                                        err_verification
                                    );
                                else{
                                    getParameter(req.query.app_id, process.env.COMMON_APP_ID,'SERVICE_MAIL_TYPE_UNVERIFIED',  (err3, parameter_value)=>{
                                        const emailData = {
                                            lang_code : req.query.lang_code,
                                            app_id : process.env.COMMON_APP_ID,
                                            app_user_id : results.id,
                                            emailType : parameter_value,
                                            toEmail : results.email,
                                            verificationCode : new_code
                                        }
                                        //send email UNVERIFIED
                                        sendEmail(req, emailData, (err_email, result_email) => {
                                            if (err_email) {
                                                return res.status(500).send(
                                                    err_email
                                                );
                                            }
                                            else{
                                                accessToken(req, (err, Token)=>{
                                                    req.body.access_token = Token;
                                                    insertUserAccountLogon(req.query.app_id, req.body, (err_user_account_logon, result_user_account_logon) => {
                                                        if (err_user_account_logon) {
                                                            return res.status(500).send(
                                                                err_user_account_logon
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
                                insertUserAccountLogon(req.query.app_id, req.body, (err_user_account_logon, result_user_account_logon) => {
                                    if (err_user_account_logon) {
                                        return res.status(500).send(
                                            err_user_account_logon
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
                        insertUserAccountLogon(req.query.app_id, req.body, (err_user_account_logon, result_user_account_logon) => {
                            if (err_user_account_logon) {
                                return res.status(500).send(
                                    err_user_account_logon
                                );
                            }
                            else{
                                //Username or password not found
                                createLogAppCI(req, res, __appfilename, __appfunction, __appline, 
                                    'invalid password attempt for user id:' + req.body.user_account_id + ', username:' + req.body.username, (err_log, result_log)=>{
                                    getMessage( req.query.app_id,
                                                process.env.COMMON_APP_ID, 
                                                20300, 
                                                req.query.lang_code, (err2,results2)  => {
                                                        return res.status(400).send(
                                                            err2 ?? results2.text
                                                        );
                                                });
                                })
                            }
                        })
                    }
                } else{
                    //User not found
                    createLogAppCI(req, res, __appfilename, __appfunction, __appline, 
                                   'user not found:' + req.body.username, (err_log, result_log)=>{
                        getMessage( req.query.app_id,
                                    process.env.COMMON_APP_ID, 
                                    20305, 
                                    req.query.lang_code, (err2,results2)  => {
                                        return res.status(404).send(
                                            err2 ?? results2.text
                                        );
                                    });
                    })
                }
            }
        });
    },
    getUserByProviderId: (req, res) => {
        req.body.result = 1;
        req.body.client_ip = req.ip;
        req.body.client_user_agent = req.headers["user-agent"];
        req.body.client_longitude = req.body.client_longitude;
        req.body.client_latitude = req.body.client_latitude;
        getUserByProviderId(req.query.app_id, req.body.identity_provider_id, req.params.id, (err, results) => {
            if (err) {
                return res.status(500).send(
                    err
                );
            }
            else{
                if (results.length > 0) {
                    updateSigninProvider(req.query.app_id, results[0].id, req.body, (err2, results2) => {
                        if (err2) {
                            return res.status(500).send(
                                err2
                            );
                        }
                        else{
                            req.body.user_account_id = results[0].id;
                            createUserAccountApp(req.query.app_id, results[0].id, (err4, results4) => {
                                if (err4) {
                                    return res.status(500).send(
                                        err4
                                    );
                                }
                            });        
                            accessToken(req, (err5, Token)=>{
                                req.body.access_token = Token;
                                insertUserAccountLogon(req.query.app_id, req.body, (err_user_account_logon, results_user_account_logon) => {
                                    if (err_user_account_logon) {
                                        return res.status(500).send(
                                            err_user_account_logon
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
                    
                } else {
                    //if provider user not found then create user and one user setting
                    //avatar not used by providers, set default null
                    if (typeof req.body.avatar == 'undefined')
                        req.body.avatar = null;
                    //one of the images should be empty, set defaul null
                    if (typeof req.body.provider_image == 'undefined')
                        req.body.provider_image = null;

                    create(req.query.app_id, req.body, (err4, results4) => {
                        if (err4) {
                            return res.status(500).send(
                                err4
                            );
                        }
                        else{
                            req.body.user_account_id = results4.insertId;
                            createUserAccountApp(req.query.app_id, results4.insertId, (err6, results6) => {
                                if (err6) {
                                    return res.status(500).send(
                                        err6
                                    );
                                }
                            });        
                            getUserByProviderId(req.query.app_id, req.body.identity_provider_id, req.params.id, (err7, results7) => {
                                if (err7) {
                                    return res.status(500).send(
                                        err7
                                    );
                                }
                                else{
                                    accessToken(req, (err8, Token)=>{
                                        req.body.access_token = Token;
                                        insertUserAccountLogon(req.query.app_id, req.body, (err_user_account_logon, results_user_account_logon) => {
                                            if (err_user_account_logon) {
                                                return res.status(500).send(
                                                    err_user_account_logon
                                                );
                                            }
                                            else
                                                return res.status(200).json({
                                                    count: results7.length,
                                                    accessToken: Token,
                                                    items: results7,
                                                    userCreated: 1
                                                });
                                        })
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