const { sendEmailService } = require("./mail.service");
const { createLog} = require ("../../service/db/api/app_log/app_log.service");
const { getMessage } = require("../db/api/message_translation/message_translation.service");
const { getParameters, getParameters_server } = require ("../db/api/app_parameter/app_parameter.service");
const { createLogAppSE } = require("../../service/log/log.service");
module.exports = {
    getLogo: (req, res) => {
        if (typeof req.query.app_id == 'undefined')
            req.query.app_id = 0;
        if (typeof req.query.app_user_id == 'undefined')
            req.query.app_user_id = null;
        if (typeof req.query.emailType == 'undefined') {
            //image called direct without parameters
            req.query.emailType = null;
            req.body.app_module_type = 'MAIL_LOGO_READ';
        }
        res.sendFile(__dirname + '/logo.png');
        if (req.query.app_id == process.env.APP1_ID){
            getParameters(req.query.app_id, (err, result)=>{
                if (err) {
                    createLogAppSE(req.query.app_id, __appfilename, __appfunction, __appline, err);
                }
                else{
                    let json = JSON.parse(JSON.stringify(result));
                    let db_SERVICE_MAIL_TYPE_CHANGE_EMAIL;
                    let db_SERVICE_MAIL_TYPE_RESET_PASSWORD;
                    let db_SERVICE_MAIL_TYPE_SIGNUP;
                    let db_SERVICE_MAIL_TYPE_UNVERIFIED;
                    for (var i = 0; i < json.length; i++){
                        //app 0 variables
                        if (json[i].parameter_name=='SERVICE_MAIL_TYPE_CHANGE_EMAIL')
                            db_SERVICE_MAIL_TYPE_CHANGE_EMAIL = json[i].parameter_value;
                        if (json[i].parameter_name=='SERVICE_MAIL_TYPE_RESET_PASSWORD')
                            db_SERVICE_MAIL_TYPE_RESET_PASSWORD = json[i].parameter_value;
                        if (json[i].parameter_name=='SERVICE_MAIL_TYPE_SIGNUP')
                            db_SERVICE_MAIL_TYPE_SIGNUP = json[i].parameter_value;
                        if (json[i].parameter_name=='SERVICE_MAIL_TYPE_UNVERIFIED')
                            db_SERVICE_MAIL_TYPE_UNVERIFIED = json[i].parameter_value;
                    }
                    req.body.app_id = req.query.app_id;
                    req.body.app_module = 'MAIL';
                    if (req.query.emailType == db_SERVICE_MAIL_TYPE_SIGNUP)
                        req.body.app_module_type = 'MAIL_SIGNUP_READ';
                    if (req.query.emailType == db_SERVICE_MAIL_TYPE_UNVERIFIED)
                        req.body.app_module_type = 'MAIL_UNVERIFIED_READ';
                    if (req.query.emailType == db_SERVICE_MAIL_TYPE_RESET_PASSWORD)
                        req.body.app_module_type = 'MAIL_RESET_PASSWORD_READ';
                    if (req.query.emailType == db_SERVICE_MAIL_TYPE_CHANGE_EMAIL)
                        req.body.app_module_type = 'MAIL_CHANGE_EMAIL_READ';
                    req.body.app_module_request = req.protocol + '://' + req.get('host') + req.originalUrl;
                    req.body.app_module_result = '';
                    req.body.app_user_id = req.query.app_user_id;
    
                    req.body.server_remote_addr = req.ip;
                    req.body.server_user_agent = req.headers["user-agent"];
                    req.body.server_http_host = req.headers["host"];
                    req.body.server_http_accept_language = req.headers["accept-language"];
                    createLog(req.body, (err2, results2) => {
                        null;
                    });
                }
            }) 
        }
        
    },
    sendEmail: (data, callBack) => {
        /*
        inparameters:
        data.lang_code
        data.app_id
        data.app_user_id
        data.emailType
        data.toEmail
        data.validationCode
        data.user_language
        data.user_timezone
        data.user_number_system
        data.user_platform
        data.server_remote_addr
        data.server_user_agent
        data.server_http_host
        data.server_http_accept_language
        data.user_gps_latitude
		data.user_gps_longitude
        data.protocol
        data.host
        */ 
        // return /service/mail not the full OS path and with forward slash
        let email_subject;
        let verification_title;

        let db_SERVICE_MAIL_TYPE_CHANGE_EMAIL;
        let db_SERVICE_MAIL_TYPE_RESET_PASSWORD;
        let db_SERVICE_MAIL_TYPE_SIGNUP;
        let db_SERVICE_MAIL_TYPE_UNVERIFIED;
        let db_SERVICE_MAIL_TYPE_CHANGE_EMAIL_FROM_NAME;
        let db_SERVICE_MAIL_TYPE_RESET_PASSWORD_FROM_NAME;
        let db_SERVICE_MAIL_TYPE_SIGNUP_FROM_NAME;
        let db_SERVICE_MAIL_TYPE_UNVERIFIED_FROM_NAME;
        let db_SERVICE_MAIL_HOST;
        let db_SERVICE_MAIL_PORT;
        let db_SERVICE_MAIL_SECURE;
        let db_SERVICE_MAIL_USERNAME;
        let db_SERVICE_MAIL_PASSWORD;
    
        function main_function(){
            var baseUrl = __dirname.substring(process.cwd().length).replace(/\\/g, "/");
            let email_from;
            let html_template;
            let email_host;
            let email_port;
            let email_secure;
            let email_auth_user;
            let email_auth_pass;
            let app_module_type;
            
            if (data.app_id == process.env.APP1_ID) {
                // Read css
                const fs = require('fs');
                const css = fs.readFileSync(__dirname + '/mail_app_' + data.app_id + '.css', 'utf8');                
                if (data.emailType == db_SERVICE_MAIL_TYPE_SIGNUP){
                    app_module_type = 'MAIL_SIGNUP';
                    email_from = db_SERVICE_MAIL_TYPE_SIGNUP_FROM_NAME;
                    html_template = fs.readFileSync(__dirname + `/mail_app_${data.app_id}_signup.html`, 'utf8');
                    html_template = html_template.replace('<Css/>', `<style>${css}</style>`);
                    html_template = html_template.replace('<Logo/>', 
                                                          `<img id='app_logo' src='${data.protocol}://${data.host}${baseUrl}/logo?id=${data.app_id}&uid=${data.app_user_id}&emailType=${data.emailType}'>`);
                    html_template = html_template.replace('<Validation_code_title/>', `${verification_title}`);
                    html_template = html_template.replace('<Validation_code/>', `${data.validationCode}`);
                    html_template = html_template.replace('<Footer/>', 
                                                          `<a target='_blank' href='${data.protocol}://${data.host}'>${data.protocol}://${data.host}</a>`);
                }
                if (data.emailType == db_SERVICE_MAIL_TYPE_UNVERIFIED){
                    app_module_type = 'MAIL_UNVERIFIED';
                    email_from = db_SERVICE_MAIL_TYPE_UNVERIFIED_FROM_NAME;
                }
                if (data.emailType == db_SERVICE_MAIL_TYPE_RESET_PASSWORD){
                    app_module_type = 'MAIL_RESET_PASSWORD';
                    email_from = db_SERVICE_MAIL_TYPE_RESET_PASSWORD_FROM_NAME;
                }
                if (data.emailType == db_SERVICE_MAIL_TYPE_CHANGE_EMAIL){
                    app_module_type = 'MAIL_CHANGE_EMAIL';
                    email_from = db_SERVICE_MAIL_TYPE_CHANGE_EMAIL_FROM_NAME;
                }
                email_host = db_SERVICE_MAIL_HOST;
                email_port = db_SERVICE_MAIL_PORT;
                email_secure = db_SERVICE_MAIL_SECURE;
                email_auth_user = db_SERVICE_MAIL_USERNAME;
                email_auth_pass = db_SERVICE_MAIL_PASSWORD;
            }
            const emailData = {
                email_host: email_host,
                email_port: email_port,
                email_secure: email_secure,
                email_auth_user: email_auth_user,
                email_auth_pass: email_auth_pass,
                app_id: data.app_id,
                app_user_id: data.app_user_id,
                from: email_from,
                to: data.toEmail,
                subject: email_subject,
                html: html_template
            };
            sendEmailService(emailData, (err, result) => {
                const logData ={
                    app_id : emailData.app_id,
                    app_module : 'MAIL',
                    app_module_type : app_module_type,
                    app_module_request : emailData.to,
                    app_module_result : `${(err)?JSON.stringify(err):JSON.stringify(result)}`,
                    app_user_id : emailData.app_user_id,
                    user_language : data.user_language,
                    user_timezone : data.user_timezone,
                    user_number_system : data.user_number_system,
                    user_platform : data.user_platform,
                    server_remote_addr : data.server_remote_addr,
                    server_user_agent : data.server_user_agent,
                    server_http_host : data.server_http_host,
                    server_http_accept_language : data.server_http_accept_language,
                    user_gps_latitude : data.user_gps_latitude,
                    user_gps_longitude : data.user_gps_longitude
                }
                createLog(logData, (err2, results2) => {
                    null;
                });
                if (err) {    
                    return callBack(err, result);
                } else
                    return callBack(null, result);
            });
        }
        //Signup text
        getMessage(20501, 
                data.app_id, 
                data.lang_code, (err,results)  => {
                if (err)
                    createLogAppSE(data.app_id, __appfilename, __appfunction, __appline, err);
                else{
                    email_subject = results.text;
                    //Verification code text
                    getMessage(20502, 
                            data.app_id, 
                            data.lang_code, (err,results)  => {
                            if (err)
                                createLogAppSE(data.app_id, __appfilename, __appfunction, __appline, err);
                            else{
                                verification_title = results.text;
                                getParameters_server(data.app_id, (err, result)=>{
                                    if (err) {
                                        createLogAppSE(data.app_id, __appfilename, __appfunction, __appline, err);
                                    }
                                    else{
                                        let json = JSON.parse(JSON.stringify(result));
                                        for (var i = 0; i < json.length; i++){
                                            //app 0 variables
                                            if (json[i].parameter_name=='SERVICE_MAIL_TYPE_CHANGE_EMAIL')
                                                db_SERVICE_MAIL_TYPE_CHANGE_EMAIL = json[i].parameter_value;
                                            if (json[i].parameter_name=='SERVICE_MAIL_TYPE_RESET_PASSWORD')
                                                db_SERVICE_MAIL_TYPE_RESET_PASSWORD = json[i].parameter_value;
                                            if (json[i].parameter_name=='SERVICE_MAIL_TYPE_SIGNUP')
                                                db_SERVICE_MAIL_TYPE_SIGNUP = json[i].parameter_value;
                                            if (json[i].parameter_name=='SERVICE_MAIL_TYPE_UNVERIFIED')
                                                db_SERVICE_MAIL_TYPE_UNVERIFIED = json[i].parameter_value;
                                            //app 1 variables
                                            if (json[i].parameter_name=='SERVICE_MAIL_TYPE_CHANGE_EMAIL_FROM_NAME')
                                                db_SERVICE_MAIL_TYPE_CHANGE_EMAIL_FROM_NAME = json[i].parameter_value;
                                            if (json[i].parameter_name=='SERVICE_MAIL_TYPE_RESET_PASSWORD_FROM_NAME')
                                                db_SERVICE_MAIL_TYPE_RESET_PASSWORD_FROM_NAME = json[i].parameter_value;
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
                                        main_function();
                                    }
                                })
                            }
                    });
                }
            });        
    }
};