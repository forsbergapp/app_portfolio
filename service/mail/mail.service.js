const nodemailer = require('nodemailer');
module.exports = {
    sendEmailService: (data, callBack) => {
        var email_host;
        var email_port;
        var email_secure;
        var email_auth_user;
        var email_auth_pass;

        if (data.app_id == process.env.APP1_ID) {
            email_host = process.env.APP1_EMAIL_HOST;
            email_port = process.env.APP1_EMAIL_PORT;
            email_secure = process.env.APP1_EMAIL_SECURE;
            email_auth_user = process.env.APP1_EMAIL_USERNAME;
            email_auth_pass = process.env.APP1_EMAIL_PASSWORD;
            data.from = email_auth_user;
        }
        let transporter = nodemailer.createTransport({
            host: email_host,
            port: email_port,
            secure: email_secure,
            auth: {
                user: email_auth_user,
                pass: email_auth_pass
            },
            debug: false,
            logger: false
        });

        const message = {
            from: `"${process.env.APP1_NAME}" <${email_auth_user}>`,
            to: data.to,
            subject: data.subject,
            html: data.html,
            encoding: 'utf-8',
            textEncoding: 'quoted-printable'
        };

        transporter.sendMail(message, function(err, result) {
            if (err) {
                return callBack(err, err);
            } else {
                return callBack(null, result[0]);
            }
        });
    }
}