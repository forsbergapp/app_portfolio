const { sign } = require("jsonwebtoken");
const { verify } = require("jsonwebtoken");
const { createLog} = require ("../../../service/db/app_portfolio/app_log/app_log.service");
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
                createLog({ app_id : process.env.MAIN_APP_ID,
                            app_module : 'AUTH',
                            app_module_type : 'ADMINTOKEN_FAIL',
                            app_module_request : req.baseUrl,
                            app_module_result : 'Unauthorized: Access is denied.',
                            app_user_id : '',
                            user_language : req.body.user_language,
                            user_timezone : req.body.user_timezone,
                            user_number_system : req.body.user_number_system,
                            user_platform : req.body.user_platform,
                            server_remote_addr : req.ip,
                            server_user_agent : req.headers["user-agent"],
                            server_http_host : req.headers["host"],
                            server_http_accept_language : req.headers["accept-language"],
                            client_latitude : req.body.client_latitude,
                            client_longitude : req.body.client_longitude
                            }, (err,results)  => {
                                null;
                });
                return res.status(401).send({ 
                    success: 0,
                    message: "Unauthorized: Access is denied."
                });
            } 
            var jsontoken_at;
            jsontoken_at = sign ({tokentimstamp: Date.now()}, process.env.SERVICE_AUTH_ADMIN_TOKEN_SECRET, {
                                expiresIn: process.env.SERVICE_AUTH_ADMIN_TOKEN_EXPIRE_ACCESS
                                });
            createLog({ app_id : process.env.MAIN_APP_ID,
                        app_module : 'AUTH',
                        app_module_type : 'ADMINTOKEN_OK',
                        app_module_request : req.baseUrl,
                        app_module_result : 'AT:' + jsontoken_at,
                        app_user_id : '',
                        user_language : req.body.user_language,
                        user_timezone : req.body.user_timezone,
                        user_number_system : req.body.user_number_system,
                        user_platform : req.body.user_platform,
                        server_remote_addr : req.ip,
                        server_user_agent : req.headers["user-agent"],
                        server_http_host : req.headers["host"],
                        server_http_accept_language : req.headers["accept-language"],
                        client_latitude : req.body.client_latitude,
                        client_longitude : req.body.client_longitude
                        }, (err,results)  => {
                            null;
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
                message: "Unauthorized: Access is denied"
            });
        }
    }
}