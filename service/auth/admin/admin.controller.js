const { sign } = require("jsonwebtoken");
const { verify } = require("jsonwebtoken");
module.exports = {
    checkAdmin: (req, res, next) => {
		let token = req.get("authorization");
		if (token){
            token = token.slice(7);
            verify(token, process.env.SERVICE_AUTH_ADMIN_TOKEN_SECRET, (err, decoded) => {
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
    authAdmin: (req, res) => {
        if(req.headers.authorization){                
            var userpass = new Buffer.from((req.headers.authorization || '').split(' ')[1] || '', 'base64').toString();
            if (userpass !== process.env.SERVER_ADMIN_NAME + ':' + process.env.SERVER_ADMIN_PASSWORD) {
                return res.status(401).send({ 
                    success: 0,
                    message: "HTTP Error 401 Unauthorized: Access is denied."
                });
            } 
            var jsontoken_at;
            jsontoken_at = sign ({tokentimstamp: Date.now()}, process.env.SERVICE_AUTH_ADMIN_TOKEN_SECRET, {
                                expiresIn: process.env.SERVICE_AUTH_ADMIN_TOKEN_EXPIRE_ACCESS
                                });
            return res.status(200).json({ 
                    success: 1,
                    message: "OK",
                    token_at: jsontoken_at
            });
        }
        else{
            return res.status(401).send({ 
                success: 0,
                message: "HTTP Error 401 Unauthorized: Access is denied"
            });
        }
    }
}