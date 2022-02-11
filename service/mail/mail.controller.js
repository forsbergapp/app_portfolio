const { sendEmailService } = require("./mail.service");
const { createLog} = require ("../../service/db/api/app_log/app_log.service");

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
        req.body.app_id = req.query.app_id;
        req.body.app_module = 'MAIL';
        if (req.query.emailType == process.env.APP1_SERVICE_EMAILTYPE_SIGNUP)
            req.body.app_module_type = 'MAIL_SIGNUP_READ';
        if (req.query.emailType == process.env.APP1_SERVICE_EMAILTYPE_UNVERIFIED)
            req.body.app_module_type = 'MAIL_UNVERIFIED_READ';
        if (req.query.emailType == process.env.APP1_SERVICE_EMAILTYPE_RESET_PASSWORD)
            req.body.app_module_type = 'MAIL_RESET_PASSWORD_READ';
        if (req.query.emailType == process.env.APP1_SERVICE_EMAILTYPE_CHANGE_EMAIL)
            req.body.app_module_type = 'MAIL_CHANGE_EMAIL_READ';
        req.body.app_module_request = req.protocol + '://' + req.get('host') + req.originalUrl;
        req.body.app_module_result = '';
        req.body.app_user_id = req.query.app_user_id;

        req.body.server_remote_addr = req.ip;
        req.body.server_user_agent = req.headers["user-agent"];
        req.body.server_http_host = req.headers["host"];
        req.body.server_http_accept_language = req.headers["accept-language"];
        createLog(req.body, (err2, results2) => {
            if (err2) {
                console.log(err2);
            }
        });

    },
    sendEmail: (data, callBack) => {
        /*
        inparameters:
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
        var baseUrl = __dirname.substring(process.cwd().length).replace(/\\/g, "/");
        
        let email_from;
        let email_subject;
        let html_template;
        let email_host;
        let email_port;
        let email_secure;
        let email_auth_user;
        let email_auth_pass;

        if (data.app_id == process.env.APP1_ID) {
            // Read css
            const fs = require('fs');
            const css = fs.readFileSync(__dirname + '/mail_app_' + data.app_id + '.css', 'utf8');

            if (data.emailType == process.env.APP1_SERVICE_EMAILTYPE_SIGNUP){
                email_from = process.env.APP1_SERVICE_EMAILTYPE_SIGNUP_FROM_NAME;
                email_subject = `Signup`;
                html_template = fs.readFileSync(__dirname + `/mail_app_${data.app_id}_signup.html`, 'utf8');
                html_template = html_template.replace('<Css/>', `<style>${css}</style>`);
                html_template = html_template.replace('<Logo/>', 
                                                      `<img id='app_logo' src='${data.protocol}://${data.host}${baseUrl}/logo?id=${data.app_id}&uid=${data.app_user_id}&emailType=${data.emailType}'>`);
                html_template = html_template.replace('<Validation_code_title/>', `Your validation code`);
                html_template = html_template.replace('<Validation_code/>', `${data.validationCode}`);
                html_template = html_template.replace('<Footer/>', 
                                                      `<a target='_blank' href='${data.protocol}://${data.host}'>${data.protocol}://${data.host}</a>`);
            }
            if (data.emailType == process.env.APP1_SERVICE_EMAILTYPE_UNVERIFIED)
                email_from = process.env.APP1_SERVICE_EMAILTYPE_UNVERIFIED_FROM_NAME;
            if (data.emailType == process.env.APP1_SERVICE_EMAILTYPE_RESET_PASSWORD)
                email_from = process.env.APP1_SERVICE_EMAILTYPE_RESET_PASSWORD_FROM_NAME;
            if (data.emailType == process.env.APP1_SERVICE_EMAILTYPE_CHANGE_EMAIL)
                email_from = process.env.APP1_SERVICE_EMAILTYPE_CHANGE_EMAIL_FROM_NAME;
            
            email_host = process.env.APP1_SERVICE_EMAIL_HOST;
            email_port = process.env.APP1_SERVICE_EMAIL_PORT;
            email_secure = process.env.APP1_SERVICE_EMAIL_SECURE;
            email_auth_user = process.env.APP1_SERVICE_EMAIL_USERNAME;
            email_auth_pass = process.env.APP1_SERVICE_EMAIL_PASSWORD;
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
                app_module_type : '',
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
            if (data.emailType == process.env.APP1_SERVICE_EMAILTYPE_SIGNUP)
                logData.app_module_type = 'MAIL_SIGNUP';
            if (data.emailType == process.env.APP1_SERVICE_EMAILTYPE_UNVERIFIED)
                logData.app_module_type = 'MAIL_UNVERIFIED';
            if (data.emailType == process.env.APP1_SERVICE_EMAILTYPE_RESET_PASSWORD)
                logData.app_module_type = 'MAIL_RESET_PASSWORD';
            if (data.emailType == process.env.APP1_SERVICE_EMAILTYPE_CHANGE_EMAIL)
                logData.app_module_type = 'MAIL_CHANGE_EMAIL';
            createLog(logData, (err2, results2) => {
                if (err2)
                    console.log('mail createLog err:' + err2);
            });
            if (err) {
                console.log(err);
                return callBack(err, result);
            } else
                return callBack(null, result);
        });
    }
};