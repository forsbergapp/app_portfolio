const { sendEmailService } = require("./mail.service");
const { getIp} = require ("../../service/geolocation/geolocation.controller");
const { createLog} = require ("../../service/db/api/app_log/app_log.service");
const { getParameters_server} = require ("../db/api/app_parameter/app_parameter.service");
const { createLogAppSE } = require("../../service/log/log.service");
function app_log(app_id, app_module_type, request, result, app_user_id,
                 user_language, user_timezone,user_number_system,user_platform,
                 server_remote_addr, server_user_agent, server_http_host,server_http_accept_language,
                 client_latitude,client_longitude){
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
        client_latitude : client_latitude,
        client_longitude : client_longitude
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
        res.sendFile(__dirname + `../../apps/app${app_id}/mail/logo.png`);
        req.body.app_id = req.query.app_id;
        getIp(req, res, (err, result)=>{
            app_log(req.query.app_id,
                    'READ',
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
    },
    sendEmail: (data, callBack) => {
        let emailData;
        let db_SERVICE_MAIL_TYPE_CHANGE_EMAIL_FROM_NAME;
        let db_SERVICE_MAIL_TYPE_RESET_PASSWORD_FROM_NAME;
        let db_SERVICE_MAIL_TYPE_SIGNUP_FROM_NAME;
        let db_SERVICE_MAIL_TYPE_UNVERIFIED_FROM_NAME;
        let db_SERVICE_MAIL_HOST;
        let db_SERVICE_MAIL_PORT;
        let db_SERVICE_MAIL_SECURE;
        let db_SERVICE_MAIL_USERNAME;
        let db_SERVICE_MAIL_PASSWORD;
        const { getMail} = require(`../../apps/`);
        // return /service/mail not the full OS path and with forward slash
        const baseUrl = __dirname.substring(process.cwd().length).replace(/\\/g, "/");
        getParameters_server(data.app_id, (err, result)=>{
            if (err) {
                createLogAppSE(data.app_id, __appfilename, __appfunction, __appline, err);
                reject(err);
            }
            else{
                let json = JSON.parse(JSON.stringify(result));
                for (var i = 0; i < json.length; i++){
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
                        app_log(data.app_id,
                                'SEND',
                                data.toEmail,
                                `${(err)?JSON.stringify(err):JSON.stringify(result)}`,
                                data.app_user_id,
                                data.user_language,
                                data.user_timezone,
                                data.user_number_system,
                                data.user_platform,
                                data.server_remote_addr,
                                data.server_user_agent,
                                data.server_http_host,
                                data.server_http_accept_language,
                                data.client_latitude,
                                data.client_longitude);
                        if (err) {    
                            return callBack(err, result);
                        } else
                            return callBack(null, result);
                    });
                }) 
            }
        })
    }
};