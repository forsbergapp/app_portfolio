const { sign } = require("jsonwebtoken");
const { verify } = require("jsonwebtoken");
module.exports = {
    checkToken: (req, res, next) => {
		let token = req.get("authorization");
		if (token){
			token = token.slice(7);
			verify(token, process.env.APP_TOKEN_SECRET, (err, decoded) => {
				if (err){
					res.status(401).send({
						succes: 0,
						message: "Invalid token"
					});
				} else {
					next();
				}
			});
		}else{
			res.status(401).json({
				success: 0,
				message: 'Not authorized'
			});
		}
	},
    accessToken: (req, res) => {
        var userpass = new Buffer.from((req.headers.authorization || '').split(' ')[1] || '', 'base64').toString();
        if (userpass !== process.env.APP_REST_CLIENT_ID + ':' + process.env.APP_REST_CLIENT_SECRET) {
            return res.status(401).send({ 
                success: 0,
                message: "HTTP Error 401 Unauthorized: Access is denied"
            });
        } 
        var tokendata;
        var jsontoken;
        var token_type = req.params.token_type;
        switch (parseInt(token_type)){
            case 1:{
                tokendata = {tokentimstamp: Date.now()};
                jsontoken = sign (tokendata, process.env.APP_TOKEN_SECRET, {
                    expiresIn: process.env.APP_TOKEN_EXPIRE_ACCESS
                    });
                break;
            }
            case 2:{
                tokendata = {tokentimstamp: Date.now()};
                jsontoken = sign (tokendata, process.env.APP_TOKEN_SECRET, {
                    expiresIn: process.env.APP_TOKEN_EXPIRE_DATA
                    });
                break;
            }
            default:
                break;
        }
        /*
        const logData = {
            app_id: process.env.APP1_ID,
            app_module: data.baseUrl,			// /api/user_account
            app_userid: '',
            app_user_type: 'token',
            app_user_request: jsontoken,
            app_user_result: ''
        };
        createLog(logData, result);
        if (err) {
            console.log(err);
        }
        */
        return res.status(200).json({ 
                success: 1,
                message: "login successfully",
                token: jsontoken
        });
    }
}