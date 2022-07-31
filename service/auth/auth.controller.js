const { sign } = require("jsonwebtoken");
const { verify } = require("jsonwebtoken");
const { createLog} = require ("../../service/db/api/app_log/app_log.service");
const { getParameter, getParameters_server } = require ("../../service/db/api/app_parameter/app_parameter.service");
const { createLogAppSE, createLogAppCI } = require("../../service/log/log.controller");
const { checkLogin } = require("../../service/db/api/user_account_logon/user_account_logon.service");
const {block_ip_control, safe_user_agents, policy_directives} = require ("./auth.service");
module.exports = {
    access_control: (req, res, callBack) => {
        if (process.env.SERVICE_AUTH_ACCESS_CONTROL_ENABLE==1){
            let ip_v4 = req.ip.replace('::ffff:','');
            block_ip_control(ip_v4, (err, result_range) =>{
                if (err){
                    createLogAppCI(req, res, null, __appfilename, __appfunction, __appline, `ip ${ip_v4} blocked, range: ${result_range}, tried URL: ${req.originalUrl}`, (err_log, result_log)=>{
                        return callBack(err,null);
                    })
                }
                else{
                    if (process.env.SERVICE_AUTH_ACCESS_CONTROL_HOST_EXIST==1){
                        //check if host exists
                        if (typeof req.headers.host=='undefined'){
                            createLogAppCI(req, res, null, __appfilename, __appfunction, __appline, `ip ${ip_v4} blocked, no host, tried URL: ${req.originalUrl}`, (err_log, result_log)=>{
                                //406 Not Acceptable
                                return callBack(406,null);
                            })
                        }
                    }
                    if (process.env.SERVICE_AUTH_ACCESS_CONTROL_ACCESS_FROM==1){
                        //check if accessed from domain and not os hostname
                        var os = require("os");
                        if (req.headers.host==os.hostname()){
                            createLogAppCI(req, res, null, __appfilename, __appfunction, __appline, `ip ${ip_v4} blocked, accessed from hostname ${os.hostname()} not domain, tried URL: ${req.originalUrl}`, (err_log, result_log)=>{
                                //406 Not Acceptable
                                return callBack(406,null);
                            })
                        }
                    }
                    safe_user_agents(req.headers["user-agent"], (err, safe)=>{
                        if (err)
                            null;
                        else{
                            if (safe==true)
                                return callBack(null,1);
                            else{
                                if(process.env.SERVICE_AUTH_ACCESS_CONTROL_USER_AGENT_EXIST==1){
                                    //check if user-agent exists
                                    if (typeof req.headers["user-agent"]=='undefined'){
                                        createLogAppCI(req, res, null, __appfilename, __appfunction, __appline, `ip ${ip_v4} blocked, no user-agent, tried URL: ${req.originalUrl}`, (err_log, result_log)=>{
                                            //406 Not Acceptable
                                            return callBack(406,null);
                                        })
                                    }
                                }
                                if (process.env.SERVICE_AUTH_ACCESS_CONTROL_ACCEPT_LANGUAGE==1){
                                    //check if accept-language exists
                                    if (typeof req.headers["accept-language"]=='undefined'){
                                        createLogAppCI(req, res, null, __appfilename, __appfunction, __appline, `ip ${ip_v4} blocked, no accept-language, tried URL: ${req.originalUrl}`, (err_log, result_log)=>{
                                            //406 Not Acceptable
                                            return callBack(406,null);
                                        })
                                    }
                                }
                                return callBack(null,1);
                            }
                        }
                    })
                }
            })
        }
        else
            return callBack(null,1);
    },
    checkAccessToken: (req, res, next) => {
		let token = req.get("authorization");
		if (token){
            getParameter(process.env.MAIN_APP_ID,'SERVICE_AUTH_TOKEN_ACCESS_SECRET', (err, db_SERVICE_AUTH_TOKEN_ACCESS_SECRET)=>{
				if (err) {
                    createLogAppSE(req.query.app_id, __appfilename, __appfunction, __appline, err, (err_log, result_log)=>{
                        null;
                    })
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
                            //check access token belongs to user_account.id, app_id and ip saved when logged in
                            checkLogin(req.query.user_account_logon_user_account_id, req.query.app_id, req.headers.authorization.replace('Bearer ',''), req.ip, (err, result)=>{
                                if (err)
                                    createLogAppSE(req.query.app_id, __appfilename, __appfunction, __appline, err, (err_log, result_log)=>{
                                        res.status(500).send(
                                            err
                                        );
                                    })
                                else{
                                    if (result.length==1)
                                        next();
                                    else
                                        createLogAppCI(req, res, null, __appfilename, __appfunction, __appline, `user  ${req.query.user_account_id} app_id ${req.query.app_id} with ip ${req.ip} accesstoken unauthorized`, (err_log, result_log)=>{
                                            res.status(401).send({
                                                success: 0,
				                                message: 'Not authorized'
                                            });
                                        })
                                        
                                }
                            })
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
            getParameter(process.env.MAIN_APP_ID,'SERVICE_AUTH_TOKEN_DATA_SECRET', (err, db_SERVICE_AUTH_TOKEN_DATA_SECRET)=>{
				if (err) {
                    createLogAppSE(req.query.app_id, __appfilename, __appfunction, __appline, err, (err_log, result_log)=>{
                        null;
                    })
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
            getParameters_server(process.env.MAIN_APP_ID, (err, result)=>{
                if (err) {
                    createLogAppSE(req.query.app_id, __appfilename, __appfunction, __appline, err, (err_log, result_log)=>{
                        null;
                    })
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
                        createLog({ app_id : req.query.app_id,
                                    app_module : 'AUTH',
                                    app_module_type : 'DATATOKEN_FAIL',
                                    app_module_request : req.baseUrl,
                                    app_module_result : 'HTTP Error 401 Unauthorized: Access is denied.',
                                    app_user_id : req.query.app_user_id,
                                    user_language : null,
                                    user_timezone : null,
                                    user_number_system : null,
                                    user_platform : null,
                                    server_remote_addr : req.ip,
                                    server_user_agent : req.headers["user-agent"],
                                    server_http_host : req.headers["host"],
                                    server_http_accept_language : req.headers["accept-language"],
                                    client_latitude : null,
                                    client_longitude : null
                                    }, (err,results)  => {
                                        null;
                                }); 
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
                    createLog({ app_id : req.query.app_id,
                                app_module : 'AUTH',
                                app_module_type : 'DATATOKEN_OK',
                                app_module_request : req.baseUrl,
                                app_module_result : 'DT:' + jsontoken_dt,
                                app_user_id : req.query.app_user_id,
                                user_language : null,
                                user_timezone : null,
                                user_number_system : null,
                                user_platform : null,
                                server_remote_addr : req.ip,
                                server_user_agent : req.headers["user-agent"],
                                server_http_host : req.headers["host"],
                                server_http_accept_language : req.headers["accept-language"],
                                client_latitude : null,
                                client_longitude : null
                                }, (err,results)  => {
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
        getParameters_server(process.env.MAIN_APP_ID, (err, result)=>{
            if (err) {
                createLogAppSE(req.body.app_id, __appfilename, __appfunction, __appline, err, (err_log, result_log)=>{
                    callBack(err);
                })
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
                createLog({ app_id : req.body.app_id,
                            app_module : 'AUTH',
                            app_module_type : 'ACCESSTOKEN_OK',
                            app_module_request : req.baseUrl,
                            app_module_result : 'AT:' + jsontoken_at,
                            app_user_id : req.body.user_account_id,
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
                callBack(null,jsontoken_at);
            }
        })
    },
    policy_directives:(callBack)=>{
        policy_directives((err, result)=>{
            callBack(null, result);
        })
    }
}