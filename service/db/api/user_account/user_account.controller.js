const {
    create,
    activateUser,
    getUserByUserId,
    getProfileUserId,
    getProfileUsername,
    searchProfileUser,
    getProfileDetail,
    getProfileTop,
    checkPassword,
    updateUserLocal,
    updateUserCommon,
    deleteUser,
    userLogin,
    updateSigninProvider,
    getUserByProviderId,
    getStatCount
} = require("./user_account.service");

const { genSaltSync, hashSync, compareSync } = require("bcryptjs");
const { createLog } = require("../app_log/app_log.controller");
const { getMessage } = require("../message_translation/message_translation.service");
const { insertProfileSearch } = require("../profile_search/profile_search.controller");
const { insertUserAccountLogon } = require("../user_account_logon/user_account_logon.controller");
const { insertUserAccountView } = require("../user_account_view/user_account_view.controller");
const { createUserSetting, deleteUserSettingsByUserId } = require("../app1_user_setting/app1_user_setting.service");
const { getParameter } = require ("../app_parameter/app_parameter.service");
const { sendEmail } = require("../../../../service/mail/mail.controller");
const { createLogAppCI } = require("../../../../service/log/log.service");
const { accessToken } = require("../../../../service/auth/auth.controller");
function get_app_code (app_id, errorNum, message, code, errno, sqlMessage){
    var app_error_code = parseInt((JSON.stringify(errno) ?? JSON.stringify(errorNum)));
    //check if user defined exception
    if (app_error_code >= 20000){
        return app_error_code;
    } 
    else{
        //if known sql error
        if (errorNum ==1 || code == "ER_DUP_ENTRY") {
            var text_check;
            if (sqlMessage)
                text_check = JSON.stringify(sqlMessage);
            else
                text_check = JSON.stringify(message);
            var app_message_code = '';
            //check constraints errors, must be same name in mySQL and Oracle
            if (text_check.toUpperCase().includes("USER_ACCOUNT_EMAIL_UN"))
                app_message_code = 20200;
            if (text_check.toUpperCase().includes("USER_ACCOUNT_PROVIDER1_ID_UN"))
                app_message_code = 20201;
            if (text_check.toUpperCase().includes("USER_ACCOUNT_PROVIDER2_ID_UN"))
                app_message_code = 20202;
            if (text_check.toUpperCase().includes("USER_ACCOUNT_USERNAME_UN"))
                app_message_code = 20203;
            if (app_message_code != ''){
                return app_message_code;
            }
            else
                return null;	
        }
        else
            //Oracle: value too large for column...
            //returns errorNum, message and offset 
            //mySQL:  gives more info
            //"code":"ER_DATA_TOO_LONG",
            //"errno":1406,
            //"sqlMessage":"Data too long for column 'password_reminder' at row 1",
            //"sqlState":"22001"
            if (errorNum ==12899 || errno==1406)
                return 20204;
            else
                return null;
    }
};
module.exports = {
    
    userSignup: (req, res) => {
        let body = req.body;
        const salt = genSaltSync(10);
        if (typeof body.provider1_id == 'undefined' &&
            typeof body.provider2_id == 'undefined') {
            //generate validation code for local users only
            body.validation_code = Math.floor(100000 + Math.random() * 900000);
        }
        if (body.password)
            body.password = hashSync(body.password, salt);
        create(req.query.app_id, body, (err, results) => {
            if (err) {
                var app_code = get_app_code(req.query.app_id, 
                            err.errorNum, 
                            err.message, 
                            err.code, 
                            err.errno, 
                            err.sqlMessage);
                if (app_code != null){
                    getMessage(app_code, 
                                req.query.app_id, 
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
                body.user_account_id = results.insertId;
                body.server_remote_addr = req.ip,
                body.server_user_agent = req.headers["user-agent"],
                body.server_http_host = req.headers["host"],
                body.server_http_accept_language = req.headers["accept-language"]
                createUserSetting(req.query.app_id, body, (err2, results2) => {
                    if (err2) {
                        return res.status(500).send(
                            err2
                        );
                    }
                    else
                        if (typeof req.body.provider1_id == 'undefined' &&
                        typeof req.body.provider2_id == 'undefined') {
                            getParameter(0,'SERVICE_MAIL_TYPE_SIGNUP', (err, parameter_value)=>{
                                //send email for local users only
                                const emailData = {
                                    lang_code : req.query.lang_code,
                                    app_id : req.query.app_id,
                                    app_user_id : req.body.user_account_id,
                                    emailType : parameter_value,
                                    toEmail : req.body.email,
                                    validationCode : body.validation_code,
                                    user_language:body.user_language,
                                    user_timezone:body.user_timezone,
                                    user_number_system:body.user_number_system,
                                    user_platform:body.user_platform,
                                    server_remote_addr : req.body.server_remote_addr,
                                    server_user_agent : req.body.server_user_agent,
                                    server_http_host : req.body.server_http_host,
                                    server_http_accept_language : req.body.server_http_accept_language,
                                    user_gps_latitude : req.body.gps_lat_text,
                                    user_gps_longitude : req.body.gps_long_text,
                                    protocol : req.protocol,
                                    host : req.get('host')
                                }
                                sendEmail(emailData, (err3, result3) => {
                                    if (err3) {
                                        //return res from userSignup
                                        return res.status(500).send(
                                            err3
                                        );
                                    } 
                                    else
                                        return res.status(200).json({
                                            success: 1,
                                            id: results.insertId,
                                            data: results
                                        });
                                });  
                            })
                        }
                    else
                        return res.status(200).json({
                            success: 1,
                            id: results.insertId,
                            data: results
                        });
                });
            }
        });
    },
    activateUser: (req, res) => {
        const validation_code = req.body.validation_code;
        const id = req.params.id;
        activateUser(req.query.app_id, id, validation_code, (err, results) => {
            if (err) {
                return res.status(500).send(
                    err
                );
            }
            else
                return res.status(200).json({
                    count: results.changedRows,
                    success: 1,
                    items: Array(results)
                });
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
                        req.query.app_id, 
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
    getProfileUserId: (req, res) => {
        const id = req.params.id;
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

        getProfileUserId(req.query.app_id, id, id_current_user, (err, results) => {
            if (err) {
                return res.status(500).send(
                    err
                );
            }
            else{
                if (!results){
                    //Record not found
                    getMessage(20400, 
                        req.query.app_id, 
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
    getProfileUsername: (req, res) => {
        const username = req.params.username;
        var id_current_user;
        if (typeof req.query.id !== 'undefined')
            id_current_user = req.query.id;
        if (id_current_user == '')
            id_current_user = null;
        else
            id_current_user = parseInt(id_current_user);
        req.body.user_account_id = id_current_user;
        req.body.client_ip = req.ip;
        req.body.client_user_agent = req.headers["user-agent"];
        req.body.client_longitude = req.body.client_longitude;
        req.body.client_latitude = req.body.client_latitude;
        getProfileUsername(req.query.app_id, username, id_current_user, (err, results) => {
            if (err) {
                return res.status(500).send(
                    err
                );
            }
            if (!results)
                //Record not found
				getMessage(20400, 
					req.query.app_id, 
                    req.query.lang_code, (err2,results2)  => {
						return res.status(500).send(
                            results2.text
						);
					});
            else{
                req.body.user_account_id_view = results.id;
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
                        req.body.app_id, 
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
                        req.query.app_id, 
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
                        req.query.app_id, 
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
                        if (typeof body.new_password !== 'undefined' && body.new_password != '') {
                            body.password = hashSync(body.new_password, salt);
                        } else {
                            if (body.password)
                                body.password = hashSync(body.password, salt);
                        }
                        updateUserLocal(req.query.app_id, body, id, (err_update, results_update) => {
                            if (err_update) {
                                var app_code = get_app_code(req.body.app_id, 
                                    err_update.errorNum, 
                                    err_update.message, 
                                    err_update.code, 
                                    err_update.errno, 
                                    err_update.sqlMessage);
                                if (app_code != null)
                                    getMessage(app_code, 
                                                req.query.app_id, 
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
                                        req.query.app_id, 
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
                    } else {
                        createLogAppCI(req, res, req.query.app_id, __appfilename, __appfunction, __appline, 'invalid password attempt for user id:' + id);
                        //invalid password
                        getMessage(20403, 
                                    req.query.app_id, 
                                    req.query.lang_code, (err2,results2)  => {
                                        return res.status(500).send(
                                            results2.text
                                        );
                                    });
                    }
                } else {
                    //user not found
                    getMessage(20305, 
                        req.query.app_id, 
                        req.query.lang_code, (err2,results2)  => {
                            return res.status(500).send(
                                results2.text
                            );
                        });
                }
            }
        });
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
                        req.query.app_id, 
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
                        deleteUserSettingsByUserId(req.query.app_id, id, (err, results) => {
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
                                            req.query.app_id, 
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
                                        deleteUserSettingsByUserId(req.query.app_id, id, (err, results) => {
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
                                                            req.query.app_id, 
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
                                        });
                                    }
                                    else{
                                        createLogAppCI(req, res, req.query.app_id, __appfilename, __appfunction, __appline, 'invalid password attempt for user id:' + id);
                                        //invalid password
                                        getMessage(20403, 
                                                    req.query.app_id, 
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
                                        req.query.app_id, 
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
                        req.query.app_id, 
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
                    if (result_pw == 1) {
                        accessToken(req, (err, Token)=>{
                            return res.status(200).json({
                                count: Array(results.items).length,
                                success: 1,
                                accessToken: Token,
                                items: Array(results)
                            });
                        });
                    } else {
                        //Username or password not found
                        createLogAppCI(req, res, req.body.app_id, __appfilename, __appfunction, __appline, 'invalid password attempt for user id:' + req.body.user_account_id + ', username:' + req.body.username);
                        getMessage(20300, 
                            req.body.app_id, 
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
                        req.body.app_id, 
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
                    updateSigninProvider(req.body.app_id, req.body.provider_no, results[0].id, req.body, (err, results2) => {
                        if (err) {
                            return res.status(500).send(
                                err
                            );
                        }
                        else{
                            req.body.user_account_id = results[0].id;
                            insertUserAccountLogon(req.body, (err, results3) => {
                                if (err) {
                                    return res.status(500).send(
                                        err
                                    );
                                }
                            });
                        }
                    });
                    accessToken(req, (err, Token)=>{
                        return res.status(200).json({
                            count: results.length,
                            success: 1,
                            accessToken: Token,
                            items: results
                        });
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

                    create(req.body.app_id, req.body, (err, results4) => {
                        if (err) {
                            return res.status(500).send(
                                err
                            );
                        }
                        req.body.user_account_id = results4.insertId;
                        createUserSetting(req.body.app_id, req.body, (err, results5) => {
                            if (err) {
                                return res.status(500).send(
                                    err
                                );
                            }
                            else{
                                insertUserAccountLogon(req.body, (err, results6) => {
                                    if (err) {
                                        return res.status(500).send(
                                            err
                                        );
                                    }
                                });
                            }
                        });
                        getUserByProviderId(req.body.app_id, req.body.provider_no, provider_id, (err, results7) => {
                            if (err) {
                                return res.status(500).send(
                                    err
                                );
                            }
                            else{
                                accessToken(req, (err, Token)=>{
                                    return res.status(200).json({
                                        count: results7.length,
                                        success: 1,
                                        accessToken: Token,
                                        items: results7
                                    });
                                });
                            }
                        });
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