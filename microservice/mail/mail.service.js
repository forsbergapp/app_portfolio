/** @module microservice/mail */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../types.js';

const nodemailer = await import('nodemailer');
/**
 * 
 * @param {{
 *          email_host:         string,
 *          email_port:         number,
 *          email_secure:       boolean,
 *          email_auth_user:    string,
 *          email_auth_pass:    string,
 *          from:               string,
 *          to:                 string,
 *          subject:            string,
 *          html:               string
 *      }} data 
 * @returns {Promise.<object>}
 */
const sendEmail = async (data) => {
    return new Promise((resolve, reject)=>{
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
        /**@type{{  from:string,
         *          to:string,
         *          subject:string,
         *          html:string,
         *          encoding:string,
         *          textEncoding:*}} */
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