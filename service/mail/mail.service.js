const nodemailer = await import('nodemailer');

const sendEmail = async (data) => {
    return new Promise((resolve, reject)=>{
        /*
        {
            "email_host":         [host],
            "email_port":         [port],
            "email_secure":       [secure],
            "email_auth_user":    [user],
            "email_auth_pass":    [password],
            "from":               [email from ],
            "to":                 [email to],
            "subject":            [subject],
            "html":               [html email]
        };
        */
        const transporter = nodemailer.createTransport({
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

        transporter.sendMail(message, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};
export{sendEmail};