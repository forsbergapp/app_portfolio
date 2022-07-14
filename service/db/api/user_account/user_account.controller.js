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
    getStatCount,
    getEmailUser
} = require("./user_account.service");

const { genSaltSync, hashSync, compareSync } = require("bcryptjs");
const { getMessage } = require("../message_translation/message_translation.service");
const { insertProfileSearch } = require("../profile_search/profile_search.controller");
const { createUserAccountApp } = require("../user_account_app/user_account_app.service");
const { getLastUserEvent, insertUserEvent } = require("../user_account_event/user_account_event.service");
const { insertUserAccountLogon } = require("../user_account_logon/user_account_logon.controller");
const { insertUserAccountView } = require("../user_account_view/user_account_view.controller");
const { getParameter } = require ("../app_parameter/app_parameter.service");
const { sendEmail } = require("../../../../service/mail/mail.controller");
const { createLogAppCI } = require("../../../../service/log/log.service");
const { accessToken } = require("../../../../service/auth/auth.controller");

module.exports = {
    
    userSignup: (req, res) => {
        let body = req.body;
        const salt = genSaltSync(10);
        if (typeof body.provider1_id == 'undefined' &&
            typeof body.provider2_id == 'undefined') {
            //generate verification code for local users only
            body.verification_code = verification_code();
        }
        if (password_length_wrong(body.password))
            getMessage(20106, 
                       process.env.MAIN_APP_ID, 
                       req.query.lang_code, (err2,results2)  => {
                            return res.status(500).send(
                                results2.text
                            );
                       });
        else{
            if (body.password)
                body.password = hashSync(body.password, salt);
            create(req.query.app_id, body, (err, results) => {
                if (err) {
                    var app_code = get_app_code(err.errorNum, 
                                                err.message, 
                                                err.code, 
                                                err.errno, 
                                                err.sqlMessage);
                    if (app_code != null){
                        getMessage(app_code, 
                                process.env.MAIN_APP_ID, 
                                req.query.lang_code, (err2,results2)  => {
                                        return res.status(500).send(
                                            results2.text
                                        );
                                });
                    }
                    else
                        return res.status(500).send(
                            err
                        );
                }
                else{
                    //set variable for accesstoken
                    req.body.app_id = req.query.app_id;
                    if (typeof req.body.provider1_id == 'undefined' &&
                        typeof req.body.provider2_id == 'undefined') {
                        getParameter(process.env.MAIN_APP_ID,'SERVICE_MAIL_TYPE_SIGNUP', (err3, parameter_value)=>{
                            //send email for local users only
                            const emailData = {
                                lang_code : req.query.lang_code,
                                app_id : process.env.MAIN_APP_ID,
                                app_user_id : results.insertId,
                                emailType : parameter_value,
                                toEmail : req.body.email,
                                verificationCode : body.verification_code,
                                user_language: body.user_language,
                                user_timezone: body.user_timezone,
                                user_number_system: body.user_number_system,
                                user_platform: body.user_platform,
                                server_remote_addr : req.ip,
                                server_user_agent : req.headers["user-agent"],
                                server_http_host : req.headers["host"],
                                server_http_accept_language : req.headers["accept-language"],
                                client_latitude : req.body.client_latitude,
                                client_longitude : req.body.client_longitude,
                                protocol : req.protocol,
                                host : req.get('host')
                            }
                            //send email SIGNUP
                            sendEmail(emailData, (err4, result4) => {
                                if (err4) {
                                    //return res from userSignup
                                    return res.status(500).send(
                                        err4
                                    );
                                } 
                                else
                                    accessToken(req, (err5, Token)=>{
                                        return res.status(200).json({
                                            success: 1,
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
                                success: 1,
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
        const id = req.params.id;
        let auth_new_password;
        if (req.body.verification_type==3)
            auth_new_password = verification_code();
        else
            auth_new_password = null;
        activateUser(req.query.app_id, id, verification_code_to_check, auth_new_password, (err, results) => {
            if (err) {
                return res.status(500).send(
                    err
                );
            }
            else
                if (auth_new_password == null)
                    return res.status(200).json({
                        count: results.changedRows,
                        success: 1,
                        items: Array(results)
                    });
                else{
                    //return accessToken since PASSWORD_RESET is in progress
                    //email was verified and activated with data token, but now the password will be updated
                    //using accessToken and authentication code
                    req.body.app_id = req.query.app_id
                    accessToken(req, (err, Token)=>{
                        return res.status(200).json({
                            count: results.changedRows,
                            success: 1,
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
                                    success: 1,
                                    sent: 0
                                });
                            else
                                if (result_user_event &&
                                    result_user_event.status_name == 'INPROGRESS' &&
                                    result_user_event.event_days < 1)
                                    return res.status(200).json({
                                        success: 1,
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
                                    insertUserEvent(eventData, (err, result_new_user_event)=>{
                                        if (err)
                                            return res.status(200).json({
                                                success: 1,
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
                                                    getParameter(process.env.MAIN_APP_ID,'SERVICE_MAIL_TYPE_PASSWORD_RESET', (err3, parameter_value)=>{
                                                        const emailData = {
                                                            lang_code : req.query.lang_code,
                                                            app_id : process.env.MAIN_APP_ID,
                                                            app_user_id : results.id,
                                                            emailType : parameter_value,
                                                            toEmail : email,
                                                            verificationCode : new_code,
                                                            user_language: req.body.user_language,
                                                            user_timezone: req.body.user_timezone,
                                                            user_number_system: req.body.user_number_system,
                                                            user_platform: req.body.user_platform,
                                                            server_remote_addr : req.ip,
                                                            server_user_agent : req.headers["user-agent"],
                                                            server_http_host : req.headers["host"],
                                                            server_http_accept_language : req.headers["accept-language"],
                                                            client_latitude : req.body.client_latitude,
                                                            client_longitude : req.body.client_longitude,
                                                            protocol : req.protocol,
                                                            host : req.get('host')
                                                        }
                                                        //send email PASSWORD_RESET
                                                        sendEmail(emailData, (err4, result_sendemail) => {
                                                            if (err4) {
                                                                return res.status(500).send(
                                                                    err4
                                                                );
                                                            } 
                                                            else
                                                                return res.status(200).json({
                                                                    success: 1,
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
                            success: 1,
                            sent: 0
                        });
            })
        else
            return res.status(200).json({
                success: 1,
                sent: 0
            });
        
    },
    getUserByUserId: (req, res) => {
        const id = req.params.id;
        getUserByUserId(req.query.app_id, id, (err, results) => {
            if (err) {
                return res.status(500).send(
                    err
                );
            }
            else
                if (!results) {
                    //Record not found
                    getMessage(20400, 
                                process.env.MAIN_APP_ID, 
                                req.query.lang_code, (err2,results2)  => {
                                    return res.status(500).send(
                                        results2.text
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
        const id = req.params.id;
        const username = req.params.username;
        var id_current_user;

        if (typeof req.query.id !== 'undefined')
            id_current_user = req.query.id;

        if (id_current_user == '')
            id_current_user = null;
        else
            id_current_user = parseInt(id_current_user);
        req.body.user_account_id = id_current_user;
        req.body.user_account_id_view = id;
        req.body.client_ip = req.ip;
        req.body.client_user_agent = req.headers["user-agent"];
        req.body.client_longitude = req.body.client_longitude;
        req.body.client_latitude = req.body.client_latitude;

        getProfileUser(req.query.app_id, id, username, id_current_user, (err, results) => {
            if (err) {
                return res.status(500).send(
                    err
                );
            }
            else{
                if (!results){
                    //Record not found
                    getMessage(20400, 
                                process.env.MAIN_APP_ID, 
                                req.query.lang_code, (err2,results2)  => {
                                    return res.status(500).send(
                                        results2.text
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
                    getMessage(20400, 
                                process.env.MAIN_APP_ID, 
                                req.query.lang_code, (err2,results2)  => {
                                    return res.status(500).send(
                                        results2.text
                                    );
                                });
                }
                else
                    return res.status(200).json({
                        count: results.length,
                        success: 1,
                        items: results
                    });
            }
        });
    },
    getProfileDetail: (req, res) => {
        const id = req.params.id;
        var detailchoice;
        if (typeof req.query.detailchoice !== 'undefined')
            detailchoice = req.query.detailchoice;

        getProfileDetail(req.query.app_id, id, detailchoice, (err, results) => {
            if (err) {
                return res.status(500).send(
                    err
                );
            }
            else{
                if (!results) {
                    //Record not found
                    //return ok even if records not found
                    getMessage(20400, 
                                process.env.MAIN_APP_ID, 
                                req.query.lang_code, (err2,results2)  => {
                                    return res.status(200).json({
                                            count: 0,
                                            message: results2.text
                                        });
                                });
                }
                else
                    return res.status(200).json({
                        count: results.length,
                        success: 1,
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
                    //return ok even if records not found
                    getMessage(20400, 
                                process.env.MAIN_APP_ID, 
                                req.query.lang_code, (err2,results2)  => {
                                    return res.status(200).json({
                                            count: 0,
                                            message: results2.text
                                        });
                                });
                }
                else
                    return res.status(200).json({
                        count: results.length,
                        success: 1,
                        items: results
                    });
            }
        });
    },
    updateUserLocal: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        const id = req.params.id;
        checkPassword(req.query.app_id, id, (err, results) => {
            if (err) {
                return res.status(500).send(
                    err
                );
            }
            else {
                if (results) {
                    const result = compareSync(body.password, results.password);
                    if (result) {
                        if (typeof body.new_password !== 'undefined' && 
                            body.new_password != '' &&
                            password_length_wrong(body.new_password))
                                getMessage(20106, 
                                        process.env.MAIN_APP_ID, 
                                        req.query.lang_code, (err2,results2)  => {
                                                return res.status(500).send(
                                                    results2.text
                                                );
                                        });
                        else{
                            if (typeof body.new_password !== 'undefined' && body.new_password != '') {
                                body.password = hashSync(body.new_password, salt);
                            } else {
                                if (body.password)
                                    body.password = hashSync(body.password, salt);
                            }
                            updateUserLocal(req.query.app_id, body, id, (err_update, results_update) => {
                                if (err_update) {
                                    var app_code = get_app_code(err_update.errorNum, 
                                                                err_update.message, 
                                                                err_update.code, 
                                                                err_update.errno, 
                                                                err_update.sqlMessage);
                                    if (app_code != null)
                                        getMessage(app_code, 
                                                    process.env.MAIN_APP_ID, 
                                                    req.query.lang_code, (err2,results2)  => {
                                                        return res.status(500).send(
                                                            results2.text
                                                        );
                                                    });
                                    else
                                        return res.status(500).send(
                                            err_update
                                        );
                                }
                                else{
                                    if (!results_update) {
                                        //"Failed to update user"
                                        getMessage(20402, 
                                                    process.env.MAIN_APP_ID, 
                                                    req.query.lang_code, (err2,results2)  => {
                                                        return res.status(500).send(
                                                            results2.text
                                                        );
                                                    });
                                    }
                                    else
                                        return res.status(200).json({
                                            success: 1
                                        });
                                }
                            });
                        }
                    } else {
                        createLogAppCI(req, res, req.query.app_id, __appfilename, __appfunction, __appline, 'invalid password attempt for user id:' + id);
                        //invalid password
                        getMessage(20403, 
                                    process.env.MAIN_APP_ID, 
                                    req.query.lang_code, (err2,results2)  => {
                                        return res.status(500).send(
                                            results2.text
                                        );
                                    });
                    }
                } else {
                    //user not found
                    getMessage(20305, 
                                process.env.MAIN_APP_ID, 
                                req.query.lang_code, (err2,results2)  => {
                                    return res.status(500).send(
                                        results2.text
                                    );
                                });
                }
            }
        });
    },
    updatePassword: (req, res) =>{
        if (password_length_wrong(req.body.new_password))
            getMessage(20106, 
                       process.env.MAIN_APP_ID, 
                       req.query.lang_code, (err2,results2)  => {
                            return res.status(500).send(
                                results2.text
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
                        getMessage(app_code, 
                                   process.env.MAIN_APP_ID, 
                                   req.query.lang_code, (err2,results2)  => {
                                        return res.status(500).send(
                                            results2.text
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
                        getMessage(20400, 
                                    process.env.MAIN_APP_ID, 
                                    req.query.lang_code, (err2,results2)  => {
                                        return res.status(500).send(
                                            results2.text
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
                        insertUserEvent(eventData, (err, result_new_user_event)=>{
                            if (err)
                                return res.status(200).json({
                                    success: 1,
                                    sent: 0
                                });
                            else
                                return res.status(200).json({
                                    success: 1
                                });
                        })
                    }
                }
            });
        }
    },
    updateUserCommon: (req, res) => {
        const id = req.params.id;
        updateUserCommon(req.query.app_id, req.body, id, (err, results) => {
            if (err) {
                return res.status(500).send(
                    err
                );
            }
            else {
                if (!results) {
                    //record not found
                    getMessage(20400, 
                                process.env.MAIN_APP_ID, 
                                req.query.lang_code, (err2,results2)  => {
                                    return res.status(500).send(
                                        results2.text
                                    );
                                });
                }
                else
                    return res.status(200).json({
                        success: 1
                    });
            }
        });
    },
    deleteUser: (req, res) => {
        const id = req.params.id;
        getUserByUserId(req.query.app_id, id, (err, results) => {
            if (err) {
                return res.status(500).send(
                    err
                );
            }
            else {
                if (results) {
                    if (results.provider1_id !=null || results.provider2_id !=null){
                        deleteUser(req.query.app_id, id, (err, results) => {
                            if (err) {
                                return res.status(500).send(
                                    err
                                );
                            }
                            else{
                                if (!results) {
                                    //record not found
                                    getMessage(20400, 
                                                process.env.MAIN_APP_ID, 
                                                req.query.lang_code, (err2,results2)  => {
                                                    return res.status(500).send(
                                                        results2.text
                                                    );
                                                });
                                }
                                else{
                                    return res.status(200).json({
                                        success: 1
                                    });
                                }
                            }
                        });
                    }
                    else{
                        const salt = genSaltSync(10);
                        checkPassword(req.query.app_id, id, (err, results) => {
                            if (err) {
                                return res.status(500).send(
                                    err
                                );
                            }
                            else {
                                if (results) {
                                    if (compareSync(req.body.password, results.password)){
                                        deleteUser(req.query.app_id, id, (err, results) => {
                                            if (err) {
                                                return res.status(500).send(
                                                    err
                                                );
                                            }
                                            else{
                                                if (!results) {
                                                    //record not found
                                                    getMessage(20400, 
                                                                process.env.MAIN_APP_ID, 
                                                                req.query.lang_code, (err2,results2)  => {
                                                                    return res.status(500).send(
                                                                        results2.text
                                                                    );
                                                                });
                                                }
                                                else{
                                                    return res.status(200).json({
                                                        success: 1
                                                    });
                                                }
                                            }
                                        });
                                    }
                                    else{
                                        createLogAppCI(req, res, req.query.app_id, __appfilename, __appfunction, __appline, 'invalid password attempt for user id:' + id);
                                        //invalid password
                                        getMessage(20403, 
                                                    process.env.MAIN_APP_ID, 
                                                    req.query.lang_code, (err2,results2)  => {
                                                        return res.status(500).send(
                                                            results2.text
                                                        );
                                                    });
                                    } 
                                }
                                else{
                                    //user not found
                                    getMessage(20305, 
                                                process.env.MAIN_APP_ID, 
                                                req.query.lang_code, (err2,results2)  => {
                                                    return res.status(500).send(
                                                        results2.text
                                                    );
                                                });
                                }
                            }
                        });
                    }
                }
                else{
                    //user not found
                    getMessage(20305, 
                               process.env.MAIN_APP_ID, 
                               req.query.lang_code, (err2,results2)  => {
                                    return res.status(500).send(
                                        results2.text
                                    );
                               });
                }
            }
        })

    },
    userLogin: (req, res) => {
        const body = req.body;
        var result_pw;
        userLogin(body, (err, results) => {
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
                    const result = compareSync(body.password, results.password);
                    if (result) {
                        result_pw = 1;
                        req.body.result = 1;
                    } else {
                        result_pw = 0;
                        req.body.result = 0;
                    }
                    insertUserAccountLogon(req.body, (err2, results2) => {
                        if (err2) {
                            return res.status(500).send(
                                err2
                            );
                        }
                    });
                    createUserAccountApp(req.body.app_id, results.id, (err3, results3) => {
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
                            updateUserVerificationCode(req.body.app_id, results.id, new_code, (err_verification,result_verification) => {
                                if (err_verification)
                                    return res.status(500),send(
                                        err_verification
                                    );
                                else{
                                    getParameter(process.env.MAIN_APP_ID,'SERVICE_MAIL_TYPE_UNVERIFIED', (err3, parameter_value)=>{
                                        const emailData = {
                                            lang_code : req.query.lang_code,
                                            app_id : process.env.MAIN_APP_ID,
                                            app_user_id : results.id,
                                            emailType : parameter_value,
                                            toEmail : results.email,
                                            verificationCode : new_code,
                                            user_language: req.body.user_language,
                                            user_timezone: req.body.user_timezone,
                                            user_number_system: req.body.user_number_system,
                                            user_platform: req.body.user_platform,
                                            server_remote_addr : req.ip,
                                            server_user_agent : req.headers["user-agent"],
                                            server_http_host : req.headers["host"],
                                            server_http_accept_language : req.headers["accept-language"],
                                            client_latitude : req.body.client_latitude,
                                            client_longitude : req.body.client_longitude,
                                            protocol : req.protocol,
                                            host : req.get('host')
                                        }
                                        //send email UNVERIFIED
                                        sendEmail(emailData, (err_email, result_email) => {
                                            if (err_email) {
                                                return res.status(500).send(
                                                    err_email
                                                );
                                            }
                                            else{
                                                accessToken(req, (err, Token)=>{
                                                    return res.status(200).json({
                                                        count: Array(results.items).length,
                                                        success: 1,
                                                        accessToken: Token,
                                                        items: Array(results)
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
                                return res.status(200).json({
                                    count: Array(results.items).length,
                                    success: 1,
                                    accessToken: Token,
                                    items: Array(results)
                                });
                            });
                        }           
                    } else {
                        //Username or password not found
                        createLogAppCI(req, res, req.body.app_id, __appfilename, __appfunction, __appline, 'invalid password attempt for user id:' + req.body.user_account_id + ', username:' + req.body.username);
                        getMessage(20300, 
                                   process.env.MAIN_APP_ID, 
                                   req.query.lang_code, (err2,results2)  => {
                                        return res.status(500).send(
                                            results2.text
                                        );
                                   });
                    }
                } else{
                    //User not found
                    createLogAppCI(req, res, req.body.app_id, __appfilename, __appfunction, __appline, 'user not found:' + req.body.username);
                    getMessage(20305, 
                                process.env.MAIN_APP_ID, 
                                req.query.lang_code, (err2,results2)  => {
                                    return res.status(500).send(
                                        results2.text
                                    );
                                });
                }
            }
        });
    },
    getUserByProviderId: (req, res) => {
        const provider_id = req.params.id;
        req.body.result = 1;
        req.body.client_ip = req.ip;
        req.body.client_user_agent = req.headers["user-agent"];
        req.body.client_longitude = req.body.client_longitude;
        req.body.client_latitude = req.body.client_latitude;
        getUserByProviderId(req.body.app_id, req.body.provider_no, provider_id, (err, results) => {
            if (err) {
                return res.status(500).send(
                    err
                );
            }
            else{
                if (results.length > 0) {
                    updateSigninProvider(req.body.app_id, req.body.provider_no, results[0].id, req.body, (err2, results2) => {
                        if (err2) {
                            return res.status(500).send(
                                err2
                            );
                        }
                        else{
                            req.body.user_account_id = results[0].id;
                            insertUserAccountLogon(req.body, (err3, results3) => {
                                if (err3) {
                                    return res.status(500).send(
                                        err3
                                    );
                                }
                            });
                            createUserAccountApp(req.body.app_id, results[0].id, (err4, results4) => {
                                if (err4) {
                                    return res.status(500).send(
                                        err4
                                    );
                                }
                            });        
                            accessToken(req, (err5, Token)=>{
                                return res.status(200).json({
                                    count: results.length,
                                    success: 1,
                                    accessToken: Token,
                                    items: results,
                                    userCreated: 0
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
                    if (typeof req.body.provider1_image == 'undefined')
                        req.body.provider1_image = null;
                    if (typeof req.body.provider2_image == 'undefined')
                        req.body.provider2_image = null;

                    create(req.body.app_id, req.body, (err4, results4) => {
                        if (err4) {
                            return res.status(500).send(
                                err4
                            );
                        }
                        else{
                            req.body.user_account_id = results4.insertId;
                            insertUserAccountLogon(req.body, (err5, results5) => {
                                if (err5) {
                                    return res.status(500).send(
                                        err5
                                    );
                                }
                            });
                            createUserAccountApp(req.body.app_id, results4.insertId, (err6, results6) => {
                                if (err6) {
                                    return res.status(500).send(
                                        err6
                                    );
                                }
                            });        
                            getUserByProviderId(req.body.app_id, req.body.provider_no, provider_id, (err7, results7) => {
                                if (err7) {
                                    return res.status(500).send(
                                        err7
                                    );
                                }
                                else{
                                    accessToken(req, (err8, Token)=>{
                                        return res.status(200).json({
                                            count: results7.length,
                                            success: 1,
                                            accessToken: Token,
                                            items: results7,
                                            userCreated: 1
                                        });
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    },
    getStatCount: (req, res) => {
        getStatCount((err, results) => {
            if (err) {
                return res.status(500).send(
                    err
                );
            }
            else{
                return res.status(200).json({
                    success: 1,
                    data: results
                });
            }
        });
    },
}