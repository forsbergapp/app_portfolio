const { sendEmailService } = require("./mail.service");
const { createLog } = require("../../service/db/api/app_log/app_log.service");

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
        if (req.query.emailType == process.env.APP1_EMAILTYPE_SIGNUP)
            req.body.app_module_type = 'MAIL_SIGNUP_READ';
        if (req.query.emailType == process.env.APP1_EMAILTYPE_UNVERIFIED)
            req.body.app_module_type = 'MAIL_UNVERIFIED_READ';
        if (req.query.emailType == process.env.APP1_EMAILTYPE_RESET_PASSWORD)
            req.body.app_module_type = 'MAIL_RESET_PASSWORD_READ';
        if (req.query.emailType == process.env.APP1_EMAILTYPE_CHANGE_EMAIL)
            req.body.app_module_type = 'MAIL_CHANGE_EMAIL_READ';
        req.body.app_module_request = 'logo';
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
        var email_subject;
        var html_template;
        if (data.body.app_id == process.env.APP1_ID) {
            // Read css
            const fs = require('fs');
            const css = fs.readFileSync(__dirname + '/mail_app_' + data.body.app_id + '.css');

            if (data.body.emailType == process.env.APP1_EMAILTYPE_SIGNUP) {
                email_subject = `Signup`;
                //all css in external css except image so query variables
                //can be added to help logging
                html_template =
                    `<html>
				<head>
				<style>
				${css}
				</style>
				</head>
			<body>
				<table id=table_header>
					<tbody>
						<tr>
							<td>
								<table id=table_validation>
									<tbody>
									<tr>
										<td >
											<img id='app_logo' src='${process.env.APP_HOSTNAME}${process.env.APP_SERVICE_MAIL}/logo?id=${data.body.app_id}&uid=${data.body.app_user_id}&emailType=${data.body.emailType}'>
										</td>
									</tr>
									<tr>
										<td id='validation_code_title'>Your validation code
										</td>
									</tr>
									<tr>
										<td id='validation_code' >
											<p> ${data.body.validationCode} </p>
										</td>
									</tr>
									</tbody>
								</table>
							</td>
						</tr>
					</tbody>
				</table>
				<table id=table_footer>
					<tbody>
					<tr>
						<td id='footer'>
						<a target="_blank" href="${process.env.APP_HOSTNAME}">${process.env.APP_URL}</a>
						</td>
					</tr>
					</tbody>
				</table>
			</body>
			</html>`;
            }
        }
        const emailData = {
            app_id: data.body.app_id,
            to: data.body.toEmail,
            subject: email_subject,
            html: html_template
        };

        //console.log('html_template:' + html_template);

        sendEmailService(emailData, (err, result) => {
            data.body.app_module = 'MAIL';
            if (data.body.emailType == process.env.APP1_EMAILTYPE_SIGNUP)
                data.body.app_module_type = 'MAIL_SIGNUP';
            if (data.body.emailType == process.env.APP1_EMAILTYPE_UNVERIFIED)
                data.body.app_module_type = 'MAIL_UNVERIFIED';
            if (data.body.emailType == process.env.APP1_EMAILTYPE_RESET_PASSWORD)
                data.body.app_module_type = 'MAIL_RESET_PASSWORD';
            if (data.body.emailType == process.env.APP1_EMAILTYPE_CHANGE_EMAIL)
                data.body.app_module_type = 'MAIL_CHANGE_EMAIL';
            data.body.app_module_request = data.body.toEmail;
            if (err)
                data.body.app_module_result = JSON.stringify(err);
            else
                data.body.app_module_result = JSON.stringify(result);
            createLog(data.body, (err2, results2) => {
                null;
            });
            if (err) {
                console.log(err);
                return callBack(err, result);
            } else
                return callBack(null, result);
        });
    }
};