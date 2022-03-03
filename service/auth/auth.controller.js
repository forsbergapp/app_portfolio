const { sign } = require("jsonwebtoken");
const { verify } = require("jsonwebtoken");
const { createLog} = require ("../../service/db/api/app_log/app_log.service");
const { getParameter, getParameters_server } = require ("../db/api/app_parameter/app_parameter.service");
const { createLogAppSE } = require("../../service/log/log.service");
module.exports = {
    checkAccessToken: (req, res, next) => {
		let token = req.get("authorization");
		if (token){
            getParameter(0,'SERVICE_AUTH_TOKEN_ACCESS_SECRET', (err, db_SERVICE_AUTH_TOKEN_ACCESS_SECRET)=>{
				if (err) {
                    createLogAppSE(req.query.app_id, __appfilename, __appfunction, __appline, err);
                }
                else{
                    token = token.slice(7);
                    verify(token, db_SERVICE_AUTH_TOKEN_ACCESS_SECRET, (err, decoded) => {
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
    checkDataToken: (req, res, next) => {
		let token = req.get("authorization");
		if (token){
            getParameter(0,'SERVICE_AUTH_TOKEN_DATA_SECRET', (err, db_SERVICE_AUTH_TOKEN_DATA_SECRET)=>{
				if (err) {
                    createLogAppSE(req.query.app_id, __appfilename, __appfunction, __appline, err);
                }
                else{
                    token = token.slice(7);
                    verify(token, db_SERVICE_AUTH_TOKEN_DATA_SECRET, (err, decoded) => {
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
    dataToken: (req, res) => {
        if(req.headers.authorization){
            getParameters_server(0, (err, result)=>{
                if (err) {
                    createLogAppSE(req.query.app_id, __appfilename, __appfunction, __appline, err);
                }
                else{
                    let json = JSON.parse(JSON.stringify(result));
                    let db_APP_REST_CLIENT_ID;
                    let db_APP_REST_CLIENT_SECRET;
                    let db_SERVICE_AUTH_TOKEN_DATA_SECRET;
                    let db_SERVICE_AUTH_TOKEN_DATA_EXPIRE;
                    for (var i = 0; i < json.length; i++){
                        if (json[i].parameter_name=='APP_REST_CLIENT_ID')
                            db_APP_REST_CLIENT_ID = json[i].parameter_value;
                        if (json[i].parameter_name=='APP_REST_CLIENT_SECRET')
                            db_APP_REST_CLIENT_SECRET = json[i].parameter_value;
                        if (json[i].parameter_name=='SERVICE_AUTH_TOKEN_DATA_SECRET')
                            db_SERVICE_AUTH_TOKEN_DATA_SECRET = json[i].parameter_value;
                        if (json[i].parameter_name=='SERVICE_AUTH_TOKEN_DATA_EXPIRE')
                            db_SERVICE_AUTH_TOKEN_DATA_EXPIRE = json[i].parameter_value;
                    }                    
                    var userpass = new Buffer.from((req.headers.authorization || '').split(' ')[1] || '', 'base64').toString();
                    if (userpass !== db_APP_REST_CLIENT_ID + ':' + db_APP_REST_CLIENT_SECRET) {
                        return res.status(401).send({ 
                            success: 0,
                            message: "HTTP Error 401 Unauthorized: Access is denied."
                        });
                    } 
                    var jsontoken_dt;
                    
                    jsontoken_dt = sign ({tokentimstamp: Date.now()}, 
                                        db_SERVICE_AUTH_TOKEN_DATA_SECRET, 
                                        {
                                        expiresIn: db_SERVICE_AUTH_TOKEN_DATA_EXPIRE
                                        });
                    req.body.app_id 					= req.query.app_id;
                    req.body.app_module				    = 'AUTH';
                    req.body.app_module_type			= 'AUTH_TOKEN_GET';
                    req.body.app_module_request		    = req.baseUrl;
                    req.body.app_module_result			= 'DT:' + jsontoken_dt;
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
    },
    accessToken: (req, callBack) => {
        getParameters_server(0, (err, result)=>{
            if (err) {
                createLogAppSE(req.body.app_id, __appfilename, __appfunction, __appline, err);
                return  callBack(err);
            }
            else{
                let json = JSON.parse(JSON.stringify(result));
                let db_SERVICE_AUTH_TOKEN_ACCESS_SECRET;
                let db_SERVICE_AUTH_TOKEN_ACCESS_EXPIRE;
                for (var i = 0; i < json.length; i++){
                    if (json[i].parameter_name=='SERVICE_AUTH_TOKEN_ACCESS_SECRET')
                        db_SERVICE_AUTH_TOKEN_ACCESS_SECRET = json[i].parameter_value;
                    if (json[i].parameter_name=='SERVICE_AUTH_TOKEN_ACCESS_EXPIRE')
                        db_SERVICE_AUTH_TOKEN_ACCESS_EXPIRE = json[i].parameter_value;
                }                    
                var jsontoken_at;                    
                jsontoken_at = sign ({tokentimstamp: Date.now()}, 
                                    db_SERVICE_AUTH_TOKEN_ACCESS_SECRET, 
                                    {
                                    expiresIn: db_SERVICE_AUTH_TOKEN_ACCESS_EXPIRE
                                    });

                req.body.app_id 					= req.body.app_id;
                req.body.app_module				    = 'AUTH';
                req.body.app_module_type			= 'AUTH_TOKEN_GET';
                req.body.app_module_request		    = req.baseUrl;
                req.body.app_module_result			= 'AT:' + jsontoken_at;
                req.body.app_user_id				= req.body.user_account_id;
                req.body.server_remote_addr 		= req.ip;
                req.body.server_user_agent 		    = req.headers["user-agent"];
                req.body.server_http_host 			= req.headers["host"];
                req.body.server_http_accept_language= req.headers["accept-language"];
                createLog(req.body, (err2,results2) => {
                    null;
                }); 
                return  callBack(null,jsontoken_at);
            }
        })
    }
}