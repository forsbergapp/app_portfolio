const { sign } = require("jsonwebtoken");
const { verify } = require("jsonwebtoken");
const { createLog} = require ("../../service/db/api/app_log/app_log.service");
const { getParameter, getParameters_server } = require ("../db/api/app_parameter/app_parameter.service");
const { createLogAppSE, createLogAppCI } = require("../../service/log/log.service");
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
    access_control: (req, res, callBack) => {
        let ip_v4 = req.ip.replace('::ffff:','');
        async function block_ip_control(callBack){
            if (process.env.SERVICE_AUTH_BLOCK_IP_RANGE){
                const fs = require("fs");
                let ranges;
                fs.readFile(process.env.SERVICE_AUTH_BLOCK_IP_RANGE, 'utf8', (error, fileBuffer) => {
                    if (error)
                        ranges = null;
                    else{
                        ranges = fileBuffer.toString();
                        function IPtoNum(ip){
                            return Number(
                                ip.split(".")
                                .map(d => ("000"+d).substr(-3) )
                                .join("")
                            );
                        }
                        //check if IP is blocked
                        if ((ip_v4.match(/\./g)||[]).length==3){
                            for (const element of JSON.parse(ranges)) {
                                if (IPtoNum(element[0]) <= IPtoNum(ip_v4) &&
                                    IPtoNum(element[1]) >= IPtoNum(ip_v4)) {
                                        createLogAppCI(req, res, null, __appfilename, __appfunction, __appline, `ip ${ip_v4} blocked, range: ${IPtoNum(element[0])}-${IPtoNum(element[1])}, tried URL: ${req.originalUrl}`);
                                        //403 Forbidden
                                        return callBack(403,null);
                                }
                            }
                        }
                    }
                    return callBack(null, null);
                });
            }
            else
                return callBack(null, null);
        }
        block_ip_control((err, result) =>{
            if (err)
                return callBack(err,null);
            else{
                //check if host exists
                if (typeof req.headers.host=='undefined'){
                    createLogAppCI(req, res, null, __appfilename, __appfunction, __appline, `ip ${ip_v4} blocked, no host, tried URL: ${req.originalUrl}`);
                    //406 Not Acceptable
                    return callBack(406,null);
                }
                //check if accessed from domain and not os hostname
                var os = require("os");
                if (req.headers.host==os.hostname()){
                    createLogAppCI(req, res, null, __appfilename, __appfunction, __appline, `ip ${ip_v4} blocked, accessed from hostname ${os.hostname()} not domain, tried URL: ${req.originalUrl}`);
                    //406 Not Acceptable
                    return callBack(406,null);
                }
                //check if user-agent exists
                if (typeof req.headers["user-agent"]=='undefined'){
                    createLogAppCI(req, res, null, __appfilename, __appfunction, __appline, `ip ${ip_v4} blocked, no user-agent, tried URL: ${req.originalUrl}`);
                    //406 Not Acceptable
                    return callBack(406,null);
                }
                //check if accept-language exists
                if (typeof req.headers["accept-language"]=='undefined'){
                    createLogAppCI(req, res, null, __appfilename, __appfunction, __appline, `ip ${ip_v4} blocked, no accept-language, tried URL: ${req.originalUrl}`);
                    //406 Not Acceptable
                    return callBack(406,null);
                }
                return callBack(null,1);
            }
        })
    },
    checkAccessToken: (req, res, next) => {
		let token = req.get("authorization");
		if (token){
            getParameter(process.env.MAIN_APP_ID,'SERVICE_AUTH_TOKEN_ACCESS_SECRET', (err, db_SERVICE_AUTH_TOKEN_ACCESS_SECRET)=>{
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
            getParameter(process.env.MAIN_APP_ID,'SERVICE_AUTH_TOKEN_DATA_SECRET', (err, db_SERVICE_AUTH_TOKEN_DATA_SECRET)=>{
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
            getParameters_server(process.env.MAIN_APP_ID, (err, result)=>{
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
                        app_log(req.query.app_id,
                                'DATATOKEN_FAIL',
                                req.baseUrl,
                                'HTTP Error 401 Unauthorized: Access is denied.',
                                req.query.app_user_id,
                                null,
                                null,
                                null,
                                null,
                                req.ip,
                                req.headers["user-agent"],
                                req.headers["host"],
                                req.headers["accept-language"],
                                null,
                                null);
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
                    app_log(req.query.app_id,
                            'DATATOKEN_OK',
                            req.baseUrl,
                            'DT:' + jsontoken_dt,
                            req.query.app_user_id,
                            null,
                            null,
                            null,
                            null,
                            req.ip,
                            req.headers["user-agent"],
                            req.headers["host"],
                            req.headers["accept-language"],
                            null,
                            null);
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

                app_log(req.body.app_id,
                        'ACCESSTOKEN_OK',
                        req.baseUrl,
                        'AT:' + jsontoken_at,
                        req.body.user_account_id,
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
                return  callBack(null,jsontoken_at);
            }
        })
    }
}