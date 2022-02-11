const nodemailer = require('nodemailer');
module.exports = {
    sendEmailService: (data, callBack) => {
        
        let transporter = nodemailer.createTransport({
            host: data.email_host,
            port: data.email_port,
            secure: data.email_secure,
            auth: {
                user: data.email_auth_user,
                pass: data.email_auth_pass
            },
            debug: false,
            logger: false
        });

        const message = {
            from: `"${data.from}" <${data.email_auth_user}>`,
            to: data.to,
            subject: data.subject,
            html: data.html,
            encoding: 'utf-8',
            textEncoding: 'quoted-printable'
        };

        transporter.sendMail(message, function(err, result) {
            if (err) {
                return callBack(err, null);
            } else {
                return callBack(null, result);
            }
        });
    }
}