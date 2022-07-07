const { sign } = require("jsonwebtoken");
const { verify } = require("jsonwebtoken");
const { createLog} = require ("../../../service/db/api/app_log/app_log.service");
function app_log(app_id, app_module_type, request, result, app_user_id,
                 user_language, user_timezone,user_number_system,user_platform,
                 server_remote_addr, server_user_agent, server_http_host,server_http_accept_language,
                 client_latitude,client_longitude){
    const logData ={
        app_id : app_id,
        app_module : 'AUTH',
        app_module_type : app_module_type,
        app_module_request : request,
        app_module_result : result,
        app_user_id : app_user_id,
        user_language : user_language,
        user_timezone : user_timezone,
        user_number_system : user_number_system,
        user_platform : user_platform,
        server_remote_addr : server_remote_addr,
        server_user_agent : server_user_agent,
        server_http_host : server_http_host,
        server_http_accept_language : server_http_accept_language,
        client_latitude : client_latitude,
        client_longitude : client_longitude
    }
    createLog(logData, (err,results)  => {
        null;
    }); 
}

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
                app_log(process.env.MAIN_APP_ID,
                        'ADMINTOKEN_FAIL',
                        req.baseUrl,
                        'Unauthorized: Access is denied.',
                        '',
                        req.body.user_language,
                        req.body.user_timezone,
                        req.body.user_number_system,
                        req.body.user_platform,
                        req.ip,
                        req.headers["user-agent"],
                        req.headers["host"],
                        req.headers["accept-language"],
                        req.body.client_latitude,
                        req.body.client_longitude);
                return res.status(401).send({ 
                    success: 0,
                    message: "Unauthorized: Access is denied."
                });
            } 
            var jsontoken_at;
            jsontoken_at = sign ({tokentimstamp: Date.now()}, process.env.SERVICE_AUTH_ADMIN_TOKEN_SECRET, {
                                expiresIn: process.env.SERVICE_AUTH_ADMIN_TOKEN_EXPIRE_ACCESS
                                });
            app_log(process.env.MAIN_APP_ID,
                    'ADMINTOKEN_OK',
                    req.baseUrl,
                    'AT:' + jsontoken_at,
                    '',
                    req.body.user_language,
                    req.body.user_timezone,
                    req.body.user_number_system,
                    req.body.user_platform,
                    req.ip,
                    req.headers["user-agent"],
                    req.headers["host"],
                    req.headers["accept-language"],
                    req.body.client_latitude,
                    req.body.client_longitude);
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