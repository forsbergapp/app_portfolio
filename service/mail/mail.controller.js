const { sendEmailService } = require("./mail.service");
const { getIp} = require ("../../service/geolocation/geolocation.controller");
const { createLog} = require ("../../service/db/app_portfolio/app_log/app_log.service");
const { getParameters_server} = require ("../../service/db/app_portfolio/app_parameter/app_parameter.service");
const { createLogAppSE } = require("../../service/log/log.controller");
module.exports = {
    getLogo: (req, res) => {
        if (typeof req.query.id == 'undefined'){
            req.query.app_id = process.env.COMMON_APP_ID;
        }
        else{
            req.query.app_id = req.query.id;
        }
        if (typeof req.query.app_user_id == 'undefined')
            req.query.app_user_id = null;
        if (typeof req.query.et == 'undefined') {
            //image called direct without parameters
            req.query.et = null;
        }
        let path = require('path');
        res.sendFile(path.resolve(__dirname + `/../../apps/app${req.query.app_id}/mail/logo.png`), (err) =>{
            if (err){
                createLogAppSE(req.query.app_id, __appfilename, __appfunction, __appline, err, (err_log, result_log)=>{
                    return res.send(null);
                })
            }
            else {
                req.query.callback = 1;
                getIp(req, res, (err, result)=>{
                    createLog(req.query.app_id,
                              { app_id : req.query.app_id,
                                app_module : 'MAIL',
                                app_module_type : 'READ',
                                app_module_request : req.protocol + '://' + req.get('host') + req.originalUrl,
                                app_module_result : result.geoplugin_city + ', ' +
                                                    result.geoplugin_regionName + ', ' +
                                                    result.geoplugin_countryName,
                                app_user_id : req.query.app_user_id,
                                user_language : null,
                                user_timezone : null,
                                user_number_system : null,
                                user_platform : null,
                                server_remote_addr : req.ip,
                                server_user_agent : req.headers["user-agent"],
                                server_http_host : req.headers["host"],
                                server_http_accept_language : req.headers["accept-language"],
                                client_latitude : result.geoplugin_latitude,
                                client_longitude : result.geoplugin_longitude
                                }, (err,results)  => {
                                    null;
                    });
                })
            }
        });
    },
    sendEmail: (req, data, callBack) => {
        let emailData;
        let db_SERVICE_MAIL_TYPE_CHANGE_EMAIL_FROM_NAME;
        let db_SERVICE_MAIL_TYPE_PASSWORD_RESET_FROM_NAME;
        let db_SERVICE_MAIL_TYPE_SIGNUP_FROM_NAME;
        let db_SERVICE_MAIL_TYPE_UNVERIFIED_FROM_NAME;
        let db_SERVICE_MAIL_HOST;
        let db_SERVICE_MAIL_PORT;
        let db_SERVICE_MAIL_SECURE;
        let db_SERVICE_MAIL_USERNAME;
        let db_SERVICE_MAIL_PASSWORD;
        
        //set variables for image link in email
        data.protocol = req.protocol;
        data.host = req.get('host');
        // return /service/mail not the full OS path and with forward slash
        const baseUrl = __dirname.substring(process.cwd().length).replace(/\\/g, "/");

        const { getMail} = require(`../../apps/`);
        
        getParameters_server(req.query.app_id, data.app_id, (err, result)=>{
            if (err) {                
                createLogAppSE(req.query.app_id, __appfilename, __appfunction, __appline, err, (err_log, result_log)=>{
                    return callBack(err, null);
                })
            }
            else{
                let json = JSON.parse(JSON.stringify(result));
                for (let i = 0; i < json.length; i++){
                    if (json[i].parameter_name=='SERVICE_MAIL_TYPE_CHANGE_EMAIL_FROM_NAME')
                        db_SERVICE_MAIL_TYPE_CHANGE_EMAIL_FROM_NAME = json[i].parameter_value;
                    if (json[i].parameter_name=='SERVICE_MAIL_TYPE_PASSWORD_RESET_FROM_NAME')
                        db_SERVICE_MAIL_TYPE_PASSWORD_RESET_FROM_NAME = json[i].parameter_value;
                    if (json[i].parameter_name=='SERVICE_MAIL_TYPE_SIGNUP_FROM_NAME')
                        db_SERVICE_MAIL_TYPE_SIGNUP_FROM_NAME = json[i].parameter_value;
                    if (json[i].parameter_name=='SERVICE_MAIL_TYPE_UNVERIFIED_FROM_NAME')
                        db_SERVICE_MAIL_TYPE_UNVERIFIED_FROM_NAME = json[i].parameter_value;
                    if (json[i].parameter_name=='SERVICE_MAIL_HOST')
                        db_SERVICE_MAIL_HOST = json[i].parameter_value;
                    if (json[i].parameter_name=='SERVICE_MAIL_PORT')
                        db_SERVICE_MAIL_PORT = json[i].parameter_value;
                    if (json[i].parameter_name=='SERVICE_MAIL_SECURE')
                        db_SERVICE_MAIL_SECURE = json[i].parameter_value;
                    if (json[i].parameter_name=='SERVICE_MAIL_USERNAME')
                        db_SERVICE_MAIL_USERNAME = json[i].parameter_value;
                    if (json[i].parameter_name=='SERVICE_MAIL_PASSWORD')
                        db_SERVICE_MAIL_PASSWORD = json[i].parameter_value;                                        
                }
                let email_from;
                switch (parseInt(data.emailType)){
                    case 1:{
                        email_from = db_SERVICE_MAIL_TYPE_SIGNUP_FROM_NAME;
                        break;
                    }
                    case 2:{
                        email_from = db_SERVICE_MAIL_TYPE_SIGNUP_FROM_NAME;
                        break;
                    }
                    case 3:{
                        email_from = db_SERVICE_MAIL_TYPE_SIGNUP_FROM_NAME;
                        break;
                    }
                    case 4:{
                        email_from = db_SERVICE_MAIL_TYPE_SIGNUP_FROM_NAME;
                        break;
                    }
                }
                let mail = getMail(data.app_id, data, baseUrl)
                .then(function(mail_result){
                    emailData =  {
                        email_host:         db_SERVICE_MAIL_HOST,
                        email_port:         db_SERVICE_MAIL_PORT,
                        email_secure:       db_SERVICE_MAIL_SECURE,
                        email_auth_user:    db_SERVICE_MAIL_USERNAME,
                        email_auth_pass:    db_SERVICE_MAIL_PASSWORD,
                        from:               email_from,
                        to:                 data.toEmail,
                        subject:            mail_result.subject,
                        html:               mail_result.html		
                        };
                    sendEmailService(emailData, (err, result) => {
                        if (err)
                            return callBack(err, result);
                        else
                            createLog(req.query.app_id,
                                    { app_id : data.app_id,
                                        app_module : 'MAIL',
                                        app_module_type : 'SEND',
                                        app_module_request : `mailhost: ${emailData.email_host}, type: ${data.emailType}, from: ${emailData.from} (${emailData.email_auth_user}), to: ${data.toEmail}, subject: ${emailData.subject}`,
                                        app_module_result : `${(err)?JSON.stringify(err):JSON.stringify(result)}`,
                                        app_user_id : data.app_user_id,
                                        user_language : req.body.user_language,
                                        user_timezone : req.body.user_timezone,
                                        user_number_system : req.body.user_number_system,
                                        user_platform : req.body.user_platform,
                                        server_remote_addr : req.ip,
                                        server_user_agent : req.headers["user-agent"],
                                        server_http_host : req.headers["host"],
                                        server_http_accept_language : req.headers["accept-language"],
                                        client_latitude : req.body.client_latitude,
                                        client_longitude : req.body.client_longitude
                                        }, (err,results)  => {
                                            //email is sent ignore any error here
                                            return callBack(null, result);
                            });
                    });
                }) 
            }
        })
    }
};