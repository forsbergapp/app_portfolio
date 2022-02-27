const { sign } = require("jsonwebtoken");
const { verify } = require("jsonwebtoken");
const { createLog} = require ("../../service/db/api/app_log/app_log.service");
const { getParameter, getParameters_server } = require ("../db/api/app_parameter/app_parameter.service");
module.exports = {
    checkToken: (req, res, next) => {
		let token = req.get("authorization");
		if (token){
            getParameter(0,'SERVICE_AUTH_TOKEN_SECRET', (err, db_SERVICE_AUTH_TOKEN_SECRET)=>{
				if (err) {
                    console.log(err);
                }
                else{
                    token = token.slice(7);
                    verify(token, db_SERVICE_AUTH_TOKEN_SECRET, (err, decoded) => {
                        if (err){
                            res.status(401).send({
                                succes: 0,
                                message: "Invalid token"
                            });
                        } else {
                            next();
                        }
                    });
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
        if(req.headers.authorization){
            getParameters_server(0, (err, result)=>{
                if (err) {
                    console.log(err);
                }
                else{
                    let json = JSON.parse(JSON.stringify(result));
                    let db_APP_REST_CLIENT_ID;
                    let db_APP_REST_CLIENT_SECRET;
                    let db_SERVICE_AUTH_TOKEN_SECRET;
                    let db_SERVICE_AUTH_TOKEN_EXPIRE_ACCESS;
                    let db_SERVICE_AUTH_TOKEN_EXPIRE_DATA;
                    for (var i = 0; i < json.length; i++){
                        if (json[i].parameter_name=='APP_REST_CLIENT_ID')
                            db_APP_REST_CLIENT_ID = json[i].parameter_value;
                        if (json[i].parameter_name=='APP_REST_CLIENT_SECRET')
                            db_APP_REST_CLIENT_SECRET = json[i].parameter_value;
                        if (json[i].parameter_name=='SERVICE_AUTH_TOKEN_SECRET')
                            db_SERVICE_AUTH_TOKEN_SECRET = json[i].parameter_value;
                        if (json[i].parameter_name=='SERVICE_AUTH_TOKEN_EXPIRE_ACCESS')
                            db_SERVICE_AUTH_TOKEN_EXPIRE_ACCESS = json[i].parameter_value;
                        if (json[i].parameter_name=='SERVICE_AUTH_TOKEN_EXPIRE_DATA')
                            db_SERVICE_AUTH_TOKEN_EXPIRE_DATA = json[i].parameter_value;
                    }                    
                    var userpass = new Buffer.from((req.headers.authorization || '').split(' ')[1] || '', 'base64').toString();
                    if (userpass !== db_APP_REST_CLIENT_ID + ':' + db_APP_REST_CLIENT_SECRET) {
                        return res.status(401).send({ 
                            success: 0,
                            message: "HTTP Error 401 Unauthorized: Access is denied."
                        });
                    } 
                    var jsontoken_at;
                    var jsontoken_dt;
                    
                    jsontoken_at = sign ({tokentimstamp: Date.now()}, db_SERVICE_AUTH_TOKEN_SECRET, {
                                        expiresIn: db_SERVICE_AUTH_TOKEN_EXPIRE_ACCESS
                                        });

                    jsontoken_dt = sign ({tokentimstamp: Date.now()}, db_SERVICE_AUTH_TOKEN_SECRET, {
                                        expiresIn: db_SERVICE_AUTH_TOKEN_EXPIRE_DATA
                                        });
                    req.body.app_id 					= req.query.app_id;
                    req.body.app_module				    = 'AUTH';
                    req.body.app_module_type			= 'AUTH_TOKEN_GET';
                    req.body.app_module_request		    = req.baseUrl;
                    req.body.app_module_result			= 'AT:' + jsontoken_at + ',DT:' + jsontoken_dt;
                    req.body.app_user_id				= req.query.app_user_id;
                    req.body.server_remote_addr 		= req.ip;
                    req.body.server_user_agent 		    = req.headers["user-agent"];
                    req.body.server_http_host 			= req.headers["host"];
                    req.body.server_http_accept_language= req.headers["accept-language"];
                    createLog(req.body, (err2,results2) => {
                        null;
                    }); 
                    return res.status(200).json({ 
                            success: 1,
                            message: "OK",
                            token_at: jsontoken_at,
                            token_dt: jsontoken_dt
                    });
                }
            })
        }
        else{
            return res.status(401).send({ 
                success: 0,
                message: "HTTP Error 401 Unauthorized: Access is denied"
            });
        }
    }
}