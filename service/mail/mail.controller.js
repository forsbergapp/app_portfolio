const service = await import("./mail.service.js");

const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);

const sendEmail = async (req, res) => {
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
    service.sendEmail(req.body).then((result_email)=>{
        return res.status(200).json(
            result_email
        );
    })
    .catch((error)=>{
        return res.status(500).json(
            error
        );
    })
}
export{sendEmail};