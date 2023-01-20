const service = await import('./auth.service.js')

const {default:{sign, verify}} = await import("jsonwebtoken");

const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);
const {getParameter, getParameters_server} = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/app_parameter/app_parameter.service.js`);
const {createLogAppSE, createLogAppCI} = await import(`file://${process.cwd()}/service/log/log.controller.js`);

function access_control (req, res, callBack) {
    if (typeof req.query.app_id=='undefined' || req.query.app_id=='')
        req.query.app_id = ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID');
    if (ConfigGet(1, 'SERVICE_AUTH', 'ACCESS_CONTROL_ENABLE')=='1'){
        let ip_v4 = req.ip.replace('::ffff:','');
        service.block_ip_control(ip_v4, (err, result_range) =>{
            if (err){
                let stack = new Error().stack;
                import(`file://${process.cwd()}/service/common/common.service.js`).then(function({COMMON}){
                    createLogAppSE(req.query.app_id, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), err).then(function(){
                        res.status(500).send(
                            err
                        );
                    })
                })
            }
            else{
                if (result_range){
                    res.statusCode = result_range.statusCode;
                    res.statusMessage = `ip ${ip_v4} blocked, range: ${result_range.statusMessage}, tried URL: ${req.originalUrl}`;
                    let stack = new Error().stack;
                    import(`file://${process.cwd()}/service/common/common.service.js`).then(function({COMMON}){
                        createLogAppCI(req, res, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), res.statusMessage)
                        .then(function(){
                            return callBack(null,result_range);
                        })
                    })
                }
                else{
                    //check if host exists
                    if (ConfigGet(1, 'SERVICE_AUTH', 'ACCESS_CONTROL_HOST_EXIST')=='1' &&
                        typeof req.headers.host=='undefined'){
                        res.statusCode = 406;
                        res.statusMessage = `ip ${ip_v4} blocked, no host, tried URL: ${req.originalUrl}`;
                        let stack = new Error().stack;
                        import(`file://${process.cwd()}/service/common/common.service.js`).then(function({COMMON}){
                            createLogAppCI(req, res, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), res.statusMessage)
                            .then(function(){
                                //406 Not Acceptable
                                return callBack(null, 406);
                            })
                        })
                    }
                    else{
                        //check if accessed from domain and not os hostname
                        import('node:os').then(function({hostname}){
                            let this_hostname = hostname();
                            if (ConfigGet(1, 'SERVICE_AUTH', 'ACCESS_CONTROL_ACCESS_FROM')=='1' &&
                                req.headers.host==this_hostname){
                                res.statusCode = 406;
                                res.statusMessage = `ip ${ip_v4} blocked, accessed from hostname ${this_hostname} not domain, tried URL: ${req.originalUrl}`;
                                let stack = new Error().stack;
                                import(`file://${process.cwd()}/service/common/common.service.js`).then(function({COMMON}){
                                    createLogAppCI(req, res, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), res.statusMessage)
                                    .then(function(){
                                        //406 Not Acceptable
                                        return callBack(null, 406);
                                    })
                                })
                            }
                            else{
                                service.safe_user_agents(req.headers["user-agent"], (err, safe)=>{
                                    if (err){
                                        return callBack(err, null);
                                    }
                                    else{
                                        if (safe==true)
                                            return callBack(null,null);
                                        else{
                                            //check if user-agent exists
                                            if(ConfigGet(1, 'SERVICE_AUTH', 'ACCESS_CONTROL_USER_AGENT_EXIST')==1 &&
                                                typeof req.headers["user-agent"]=='undefined'){
                                                res.statusCode = 406;
                                                res.statusMessage = `ip ${ip_v4} blocked, no user-agent, tried URL: ${req.originalUrl}`;
                                                let stack = new Error().stack;
                                                import(`file://${process.cwd()}/service/common/common.service.js`).then(function({COMMON}){
                                                    createLogAppCI(req, res, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), res.statusMessage)
                                                    .then(function(){
                                                        //406 Not Acceptable
                                                        return callBack(null,406);
                                                    })
                                                })
                                            }
                                            else{
                                                //check if accept-language exists
                                                if (ConfigGet(1, 'SERVICE_AUTH', 'ACCESS_CONTROL_ACCEPT_LANGUAGE')=='1' &&
                                                    typeof req.headers["accept-language"]=='undefined'){
                                                    res.statusCode = 406;
                                                    res.statusMessage = `ip ${ip_v4} blocked, no accept-language, tried URL: ${req.originalUrl}`;
                                                    let stack = new Error().stack;
                                                    import(`file://${process.cwd()}/service/common/common.service.js`).then(function({COMMON}){
                                                        createLogAppCI(req, res, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), res.statusMessage)
                                                        .then(function(){
                                                            //406 Not Acceptable
                                                            return callBack(null,406);
                                                        })
                                                    })
                                                }
                                                else
                                                    return callBack(null,null);
                                            }
                                        }
                                    }
                                })
                            }
                        })
                    }
                }
            }
        })
    }
    else
        return callBack(null,null);
}
function checkAccessTokenCommon (req, res, next) {
    let token = req.get("authorization");
    if (token){
        getParameter(req.query.app_id, ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'),'SERVICE_AUTH_TOKEN_ACCESS_SECRET', (err, db_SERVICE_AUTH_TOKEN_ACCESS_SECRET)=>{
            if (err) {
                let stack = new Error().stack;
                import(`file://${process.cwd()}/service/common/common.service.js`).then(function({COMMON}){
                    createLogAppSE(req.query.app_id, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), err).then(function(){
                        res.status(500).send(
                            err
                        );
                    })
                })
            }
            else{
                token = token.slice(7);
                verify(token, db_SERVICE_AUTH_TOKEN_ACCESS_SECRET, (err, decoded) => {
                    if (err){
                        res.status(401).send({
                            message: "Invalid token"
                        });
                    } else {
                        //check access token belongs to user_account.id, app_id and ip saved when logged in
                        //and if app_id=0 then check user is admin
                        import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/user_account_logon/user_account_logon.service.js`).then(function({checkLogin}){
                            checkLogin(req.query.app_id, req.query.user_account_logon_user_account_id, req.headers.authorization.replace('Bearer ',''), req.ip, (err, result)=>{
                                if (err){
                                    let stack = new Error().stack;
                                    import(`file://${process.cwd()}/service/common/common.service.js`).then(function({COMMON}){
                                        createLogAppSE(req.query.app_id, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), err).then(function(){
                                            res.status(500).send(
                                                err
                                            );
                                        })
                                    })
                                }
                                else{
                                    if (result.length==1)
                                        next();
                                    else{
                                        let stack = new Error().stack;
                                        import(`file://${process.cwd()}/service/common/common.service.js`).then(function({COMMON}){
                                            createLogAppCI(req, res, null, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), `user  ${req.query.user_account_logon_user_account_id} app_id ${req.query.app_id} with ip ${req.ip} accesstoken unauthorized`)
                                            .then(function(){
                                                res.status(401).send({
                                                    message: 'Not authorized'
                                                });
                                            })
                                        })
                                    }
                                }
                            })
                        })
                    }
                });
            }
        });
        
    }else{
        res.status(401).json({
            message: 'Not authorized'
        });
    }

}
function checkAccessTokenSuperAdmin (req, res, next) {
    if (req.query.app_id==0)
        import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/user_account/user_account.service.js`).then(function({getUserAppRoleAdmin}){
            getUserAppRoleAdmin(req.query.app_id, req.query.user_account_logon_user_account_id, (err, result)=>{
                if (result[0].app_role_id == 0){
                    checkAccessTokenCommon(req, res, next);
                }
                else
                    res.status(401).json({
                        message: '⛔'
                    });
            })
        })
    else
        res.status(401).json({
            message: '⛔'
        });
}
function checkAccessTokenAdmin (req, res, next) {
    if (req.query.app_id==0){
        checkAccessTokenCommon(req, res, next);
    }
    else
        res.status(401).json({
            message: '⛔'
        });
}
function checkAccessToken (req, res, next) {
    //if user login is disabled then check also current logged in user
    //so they can't modify anything anymore with current accesstoken
    if (ConfigGet(1, 'SERVICE_AUTH', 'ENABLE_USER_LOGIN')=='1'){
        checkAccessTokenCommon(req, res, next);
    }
    else{
        //return 401 Not authorized here instead of 403 Forbidden
        //so a user will be logged out instead of getting a message
        res.status(401).json({
            message: '⛔'
        });
    }

}
function checkDataToken (req, res, next){
    let token = req.get("authorization");
    if (token){
        getParameter(req.query.app_id, ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'),'SERVICE_AUTH_TOKEN_DATA_SECRET', (err, db_SERVICE_AUTH_TOKEN_DATA_SECRET)=>{
            if (err) {
                let stack = new Error().stack;
                import(`file://${process.cwd()}/service/common/common.service.js`).then(function({COMMON}){
                    createLogAppSE(req.query.app_id, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), err).then(function(){
                        res.status(500).send(
                            err
                        );
                    })
                })
            }
            else{
                token = token.slice(7);
                verify(token, db_SERVICE_AUTH_TOKEN_DATA_SECRET, (err, decoded) => {
                    if (err){
                        res.status(401).send({
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
            message: 'Not authorized'
        });
    }
}
function checkDataTokenRegistration (req, res, next) {
    if (ConfigGet(1, 'SERVICE_AUTH', 'ENABLE_USER_REGISTRATION')=='1')
        checkDataToken(req, res, next);
    else{
        //return 403 Forbidden
        res.status(403).json({
            message: '⛔'
        });
    }
        
}
function checkDataTokenLogin (req, res, next) {
    if (ConfigGet(1, 'SERVICE_AUTH', 'ENABLE_USER_LOGIN')=='1')
        checkDataToken(req, res, next);
    else{
        //return 403 Forbidden
        res.status(403).json({
            message: '⛔'
        });
    }
}
function dataToken (req, res) {
    if(req.headers.authorization){
        getParameters_server(req.query.app_id, ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'),  (err, result)=>{
            if (err) {
                let stack = new Error().stack;
                import(`file://${process.cwd()}/service/common/common.service.js`).then(function({COMMON}){
                    createLogAppSE(req.query.app_id, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), err).then(function(){
                        res.status(500).send(
                            err
                        );
                    })
                })
            }
            else{
                let json = JSON.parse(JSON.stringify(result));
                let db_APP_REST_CLIENT_ID;
                let db_APP_REST_CLIENT_SECRET;
                let db_SERVICE_AUTH_TOKEN_DATA_SECRET;
                let db_SERVICE_AUTH_TOKEN_DATA_EXPIRE;
                for (let i = 0; i < json.length; i++){
                    if (json[i].parameter_name=='APP_REST_CLIENT_ID')
                        db_APP_REST_CLIENT_ID = json[i].parameter_value;
                    if (json[i].parameter_name=='APP_REST_CLIENT_SECRET')
                        db_APP_REST_CLIENT_SECRET = json[i].parameter_value;
                    if (json[i].parameter_name=='SERVICE_AUTH_TOKEN_DATA_SECRET')
                        db_SERVICE_AUTH_TOKEN_DATA_SECRET = json[i].parameter_value;
                    if (json[i].parameter_name=='SERVICE_AUTH_TOKEN_DATA_EXPIRE')
                        db_SERVICE_AUTH_TOKEN_DATA_EXPIRE = json[i].parameter_value;
                }                    
                let userpass = new Buffer.from((req.headers.authorization || '').split(' ')[1] || '', 'base64').toString();
                if (userpass !== db_APP_REST_CLIENT_ID + ':' + db_APP_REST_CLIENT_SECRET) {
                    import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/app_log/app_log.service.js`).then(function({createLog}){
                        createLog(req.query.app_id,
                            { app_id : req.query.app_id,
                            app_module : 'AUTH',
                            app_module_type : 'DATATOKEN_FAIL',
                            app_module_request : req.baseUrl,
                            app_module_result : 'HTTP Error 401 Unauthorized: Access is denied.',
                            app_user_id : req.query.app_user_id,
                            user_language : null,
                            user_stimezone : null,
                            user_number_system : null,
                            user_platform : null,
                            server_remote_addr : req.ip,
                            server_user_agent : req.headers["user-agent"],
                            server_http_host : req.headers["host"],
                            server_http_accept_language : req.headers["accept-language"],
                            client_latitude : null,
                            client_longitude : null
                            }, (err,results)  => {
                                return res.status(401).send({ 
                                    message: "HTTP Error 401 Unauthorized: Access is denied."
                                });
                        }); 
                    })
                } 
                else{
                    let jsontoken_dt;
                    jsontoken_dt = sign ({tokentimstamp: Date.now()}, 
                                        db_SERVICE_AUTH_TOKEN_DATA_SECRET, 
                                        {
                                        expiresIn: db_SERVICE_AUTH_TOKEN_DATA_EXPIRE
                                        });
                    import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/app_log/app_log.service.js`).then(function({createLog}){
                        createLog(req.query.app_id,
                                    { app_id : req.query.app_id,
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
                                        return res.status(200).json({ 
                                            token_dt: jsontoken_dt
                                    });
                        }); 
                    })
                }
            }
        })
    }
    else{
        return res.status(401).send({ 
            message: "HTTP Error 401 Unauthorized: Access is denied"
        });
    }
}
function accessToken (req, callBack) {
    getParameters_server(req.query.app_id, ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'),  (err, result)=>{
        if (err) {
            let stack = new Error().stack;
            import(`file://${process.cwd()}/service/common/common.service.js`).then(function({COMMON}){
                createLogAppSE(req.query.app_id, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), err).then(function(){
                    callBack(err);
                })
            })
        }
        else{
            let json = JSON.parse(JSON.stringify(result));
            let db_SERVICE_AUTH_TOKEN_ACCESS_SECRET;
            let db_SERVICE_AUTH_TOKEN_ACCESS_EXPIRE;
            for (let i = 0; i < json.length; i++){
                if (json[i].parameter_name=='SERVICE_AUTH_TOKEN_ACCESS_SECRET')
                    db_SERVICE_AUTH_TOKEN_ACCESS_SECRET = json[i].parameter_value;
                if (json[i].parameter_name=='SERVICE_AUTH_TOKEN_ACCESS_EXPIRE')
                    db_SERVICE_AUTH_TOKEN_ACCESS_EXPIRE = json[i].parameter_value;
            }                    
            let jsontoken_at;                    
            jsontoken_at = sign ({tokentimstamp: Date.now()}, 
                                db_SERVICE_AUTH_TOKEN_ACCESS_SECRET, 
                                {
                                expiresIn: db_SERVICE_AUTH_TOKEN_ACCESS_EXPIRE
                                });
            import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/app_log/app_log.service.js`).then(function({createLog}){
                createLog(req.query.app_id,
                            { app_id : req.query.app_id,
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
                                callBack(null,jsontoken_at);
                });
            })
        }
    })
}
function policy_directives(callBack){
    service.policy_directives((err, result)=>{
        callBack(null, result);
    })
}
async function check_internet (req){
    return await new Promise(function (resolve){
        //test connection with localhost
        //no need to specify other domain to test internet
        let stack = new Error().stack;
        import('node:dns').then(function({resolve: dns_resolve}){
            dns_resolve('localhost', 'A', function (err, result) {
                /*  error if disconnected internet:
                code:       'ECONNREFUSED'
                errno:      undefined
                hostname:   'localhost'
                syscall:    'queryA'
                message:    'queryA ECONNREFUSED localhost'
                stack:      'Error: queryA ECONNREFUSED localhost\n    
                                at QueryReqWrap.onresolve [as oncomplete] (node:dns:256:19)\n    
                                at QueryReqWrap.callbackTrampoline (node:internal/async_hooks:130:17)'
                
                error if not found              
                code:       'ENOTFOUND'
                errno:      undefined
                hostname:   'localhost'
                syscall:    'queryA'
                message:    'queryA ENOTFOUND localhost'
                stack:      'Error: queryA ENOTFOUND localhost\n    
                            at QueryReqWrap.onresolve [as oncomplete] (node:dns:256:19)\n    
                            at QueryReqWrap.callbackTrampoline (node:internal/async_hooks:130:17)'
                */
                //use only resolve here, no reject to avoid .catch statement in calling function
                if ((err) && err.code=='ECONNREFUSED') {
                    
                    import(`file://${process.cwd()}/service/common/common.service.js`).then(function({COMMON}){
                        createLogAppSE(req.query.app_id, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), err).then(function(){
                            resolve(0);
                        })
                    })
                } else {
                    resolve(1);
                }
            })
        })
    })
}
function check_request (req, callBack){
    let err = null;
    try {
        decodeURIComponent(req.path)
    }
    catch(e) {
        err = e;
    }
    if (err){
        callBack(err, null)
    }
    else
        callBack(null, null)
}
export {access_control, checkAccessTokenCommon, checkAccessTokenSuperAdmin, checkAccessTokenAdmin, checkAccessToken,
        checkDataToken, checkDataTokenRegistration, checkDataTokenLogin, dataToken, accessToken, policy_directives, 
        check_internet, check_request}