const { sendEmailService } = require("./mail.service");
const { getIp} = require ("../../service/geolocation/geolocation.controller");
const { createLog} = require ("../../service/db/api/app_log/app_log.service");
const { getMessage } = require("../db/api/message_translation/message_translation.service");
const { getParameters, getParameters_server } = require ("../db/api/app_parameter/app_parameter.service");
const { createLogAppSE } = require("../../service/log/log.service");
function app_log(app_id, app_module_type, request, result, app_user_id,
                 user_language, user_timezone,user_number_system,user_platform,
                 server_remote_addr, server_user_agent, server_http_host,server_http_accept_language,
                 user_gps_latitude,user_gps_longitude){
    const logData ={
        app_id : app_id,
        app_module : 'MAIL',
        app_module_type : app_module_type,
        app_module_request : request,
        app_module_result : result,
        app_user_id : app_user_id,
        user_language : user_language,
        user_timezone : user_timezone,
        user_number_system : user_number_system,
        user_platform : user_platform,
        server_remote_addr : server_remote_addr,
        server_user_agent : server_user_agent,
        server_http_host : server_http_host,
        server_http_accept_language : server_http_accept_language,
        user_gps_latitude : user_gps_latitude,
        user_gps_longitude : user_gps_longitude
    }
    createLog(logData, (err,results)  => {
        null;
    }); 
}
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
                switch (req.query.emailType){
                    case db_SERVICE_MAIL_TYPE_SIGNUP:{
                        req.body.app_module_type = 'MAIL_SIGNUP_READ';
                        break;
                    }
                    case db_SERVICE_MAIL_TYPE_UNVERIFIED:{
                        req.body.app_module_type = 'MAIL_UNVERIFIED_READ';
                        break;
                    }
                    case db_SERVICE_MAIL_TYPE_RESET_PASSWORD:{
                        req.body.app_module_type = 'MAIL_RESET_PASSWORD_READ';
                        break;
                    }
                    case db_SERVICE_MAIL_TYPE_CHANGE_EMAIL:{
                        req.body.app_module_type = 'MAIL_CHANGE_EMAIL_READ';
                        break;
                    }
                }
                getIp(req, res, (err, result)=>{
                    app_log(req.query.app_id,
                            req.body.app_module_type,
                            req.protocol + '://' + req.get('host') + req.originalUrl,
                            result.geoplugin_city + ', ' +
                            result.geoplugin_regionName + ', ' +
                            result.geoplugin_countryName,
                            req.query.app_user_id,
                            null,
                            null,
                            null,
                            null,
                            req.ip,
                            req.headers["user-agent"],
                            req.headers["host"],
                            req.headers["accept-language"],
                            result.geoplugin_latitude,
                            result.geoplugin_longitude);
                })
            }
        }) 
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
        const fs = require('fs');
        let emailData;

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
            sendEmailService(emailData, (err, result) => {
                app_log(emailData.app_id,
                        emailData.app_module_type,
                        emailData.to,
                        `${(err)?JSON.stringify(err):JSON.stringify(result)}`,
                        emailData.app_user_id,
                        data.user_language,
                        data.user_timezone,
                        data.user_number_system,
                        data.user_platform,
                        data.server_remote_addr,
                        data.server_user_agent,
                        data.server_http_host,
                        data.server_http_accept_language,
                        data.user_gps_latitude,
                        data.user_gps_longitude);
                if (err) {    
                    return callBack(err, result);
                } else
                    return callBack(null, result);
            });
        }
        async function get_mail_data(emailType, app_id, app_user_id, toEmail) {
            // return /service/mail not the full OS path and with forward slash
            const baseUrl = __dirname.substring(process.cwd().length).replace(/\\/g, "/");
            let html_template;
            let email_subject;
            let verification_title;
            let css;
            fs.readFile(__dirname + '/mail.css', 'utf8', (error, fileBuffer) => {
                css = fileBuffer.toString();
                switch (emailType){
                    case db_SERVICE_MAIL_TYPE_SIGNUP:{
                        //Signup text
                        getMessage(20501, 
                            process.env.MAIN_APP_ID, 
                            data.lang_code, (err,results)  => {
                            if (err)
                                createLogAppSE(data.app_id, __appfilename, __appfunction, __appline, err);
                            else{
                                email_subject = results.text;
                                //Verification code text
                                getMessage(20502, 
                                        process.env.MAIN_APP_ID, 
                                        data.lang_code, (err,results)  => {
                                                if (err)
                                                    createLogAppSE(data.app_id, __appfilename, __appfunction, __appline, err);
                                                else{
                                                    verification_title = results.text;

                                                    fs.readFile(__dirname + `/mail_signup.html`, 'utf8', (error, fileBuffer) => {
                                                        html_template = fileBuffer.toString();
                                                        html_template = html_template.replace('<Css/>', `<style>${css}</style>`);
                                                        html_template = html_template.replace('<Logo/>', 
                                                                                              `<img id='app_logo' src='${data.protocol}://${data.host}${baseUrl}/logo?id=${data.app_id}&uid=${data.app_user_id}&emailType=${data.emailType}'>`);
                                                        html_template = html_template.replace('<Validation_code_title/>', `${verification_title}`);
                                                        html_template = html_template.replace('<Validation_code/>', `${data.validationCode}`);
                                                        html_template = html_template.replace('<Footer/>', 
                                                                                              `<a target='_blank' href='${data.protocol}://${data.host}'>${data.protocol}://${data.host}</a>`);
                                                        emailData =  {
                                                            email_host: db_SERVICE_MAIL_HOST,
                                                            email_port: db_SERVICE_MAIL_PORT,
                                                            email_secure: db_SERVICE_MAIL_SECURE,
                                                            email_auth_user: db_SERVICE_MAIL_USERNAME,
                                                            email_auth_pass: db_SERVICE_MAIL_PASSWORD,
                                                            app_id: app_id,
                                                            app_user_id: app_user_id,
                                                            app_module_type: 'MAIL_SIGNUP',
                                                            from: db_SERVICE_MAIL_TYPE_SIGNUP_FROM_NAME,
                                                            to: toEmail,
                                                            subject: email_subject,
                                                            html: html_template
                                                        };
                                                        main_function();
                                                    });
                                                }
                                            })
                                }
                            })
                        break;
                    }
                    case db_SERVICE_MAIL_TYPE_UNVERIFIED:{
                        //to be implemented
                        html_template = null;
                        emailData =  {
                            email_host: db_SERVICE_MAIL_HOST,
                            email_port: db_SERVICE_MAIL_PORT,
                            email_secure: db_SERVICE_MAIL_SECURE,
                            email_auth_user: db_SERVICE_MAIL_USERNAME,
                            email_auth_pass: db_SERVICE_MAIL_PASSWORD,
                            app_id: app_id,
                            app_user_id: app_user_id,
                            app_module_type: 'MAIL_UNVERIFIED',
                            from: db_SERVICE_MAIL_TYPE_UNVERIFIED_FROM_NAME,
                            to: toEmail,
                            subject: email_subject,
                            html: html_template
                        };
                        main_function();
                        break;
                    }
                    case db_SERVICE_MAIL_TYPE_RESET_PASSWORD:{
                        //to be implemented
                        html_template = null;
                        emailData =  {
                            email_host: db_SERVICE_MAIL_HOST,
                            email_port: db_SERVICE_MAIL_PORT,
                            email_secure: db_SERVICE_MAIL_SECURE,
                            email_auth_user: db_SERVICE_MAIL_USERNAME,
                            email_auth_pass: db_SERVICE_MAIL_PASSWORD,
                            app_id: app_id,
                            app_user_id: app_user_id,
                            app_module_type: 'MAIL_RESET_PASSWORD',
                            from: db_SERVICE_MAIL_TYPE_RESET_PASSWORD_FROM_NAME,
                            to: toEmail,
                            subject: email_subject,
                            html: html_template
                        };
                        main_function();
                        break;
                    }
                    case db_SERVICE_MAIL_TYPE_CHANGE_EMAIL:{
                        //to be implemented
                        html_template = null;
                        emailData =  {
                            email_host: db_SERVICE_MAIL_HOST,
                            email_port: db_SERVICE_MAIL_PORT,
                            email_secure: db_SERVICE_MAIL_SECURE,
                            email_auth_user: db_SERVICE_MAIL_USERNAME,
                            email_auth_pass: db_SERVICE_MAIL_PASSWORD,
                            app_id: app_id,
                            app_user_id: app_user_id,
                            app_module_type: 'MAIL_CHANGE_EMAIL',
                            from: db_SERVICE_MAIL_TYPE_CHANGE_EMAIL_FROM_NAME,
                            to: toEmail,
                            subject: email_subject,
                            html: html_template
                        };
                        main_function();
                        break;
                    }
                }  
            });
                 
        }
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
                get_mail_data(data.emailType, data.app_id, data.app_user_id, data.toEmail);
            }
        })
    }
};