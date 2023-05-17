const service = await import('./auth.service.js')
const {default:{sign, verify}} = await import("jsonwebtoken");
const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);

//SERVER MIDDLEWARE
const access_control = (req, res, callBack) => {
    let app_id = null;
    if (req.query.app_id)
        app_id =  req.query.app_id;
    let stack = new Error().stack;
    if (ConfigGet(1, 'SERVICE_AUTH', 'ACCESS_CONTROL_ENABLE')=='1'){
        let ip_v4 = req.ip.replace('::ffff:','');
        service.block_ip_control(ip_v4, (err, result_range) =>{
            if (err){
                import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
                    import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogAppS}) => {
                        createLogAppS(ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), app_id, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), err).then(() => {
                            res.status(500).send(
                                err
                            );
                        })
                    });
                })
            }
            else{
                if (result_range){
                    res.statusCode = result_range.statusCode;
                    res.statusMessage = `ip ${ip_v4} blocked, range: ${result_range.statusMessage}, tried URL: ${req.originalUrl}`;
                    import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
                        import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogAppC}) => {
                            createLogAppC(app_id, ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), res.statusMessage,
										  req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, 
										  res.statusCode, 
										  req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(() => {
                                return callBack(null,result_range);
                            })
                        });
                    })
                }
                else{
                    //check if host exists
                    if (ConfigGet(1, 'SERVICE_AUTH', 'ACCESS_CONTROL_HOST_EXIST')=='1' &&
                        typeof req.headers.host=='undefined'){
                        res.statusCode = 406;
                        res.statusMessage = `ip ${ip_v4} blocked, no host, tried URL: ${req.originalUrl}`;
                        import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
                            import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogAppC}) => {
                                createLogAppC(app_id, ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), res.statusMessage,
                                            req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, 
                                            res.statusCode, 
                                            req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(() => {
                                    //406 Not Acceptable
                                    return callBack(null, 406);
                                })
                            });
                        })
                    }
                    else{
                        //check if accessed from domain and not os hostname
                        import('node:os').then(({hostname}) =>{
                            let this_hostname = hostname();
                            if (ConfigGet(1, 'SERVICE_AUTH', 'ACCESS_CONTROL_ACCESS_FROM')=='1' &&
                                req.headers.host==this_hostname){
                                res.statusCode = 406;
                                res.statusMessage = `ip ${ip_v4} blocked, accessed from hostname ${this_hostname} not domain, tried URL: ${req.originalUrl}`;
                                import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
                                    import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogAppC}) => {
                                        createLogAppC(app_id, ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), res.statusMessage,
                                                    req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, 
                                                    res.statusCode, 
                                                    req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(() => {
                                            //406 Not Acceptable
                                            return callBack(null, 406);
                                        })
                                    });
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
                                                import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
                                                    import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogAppC}) => {
                                                        createLogAppC(app_id, ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), res.statusMessage,
                                                                    req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, 
                                                                    res.statusCode, 
                                                                    req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(() => {
                                                            //406 Not Acceptable
                                                            return callBack(null, 406);
                                                        })
                                                    });
                                                })
                                            }
                                            else{
                                                //check if accept-language exists
                                                if (ConfigGet(1, 'SERVICE_AUTH', 'ACCESS_CONTROL_ACCEPT_LANGUAGE')=='1' &&
                                                    typeof req.headers["accept-language"]=='undefined'){
                                                    res.statusCode = 406;
                                                    res.statusMessage = `ip ${ip_v4} blocked, no accept-language, tried URL: ${req.originalUrl}`;
                                                    import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
                                                        import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogAppC}) => {
                                                            createLogAppC(app_id, ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), res.statusMessage,
                                                                        req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, 
                                                                        res.statusCode, 
                                                                        req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(() => {
                                                                //406 Not Acceptable
                                                                return callBack(null, 406);
                                                            })
                                                        });
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
const policy_directives = (callBack) => {
    service.policy_directives((err, result)=>{
        callBack(null, result);
    })
}
const check_request = (req, callBack) =>{
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
//SERVER ROUTER
const CreateDataToken = (req, res) => {
    let stack = new Error().stack;
    if(req.headers.authorization){
        service.CreateDataToken(req.query.app_id, req.headers.authorization, (err, jsontoken_dt) =>{
            if (err)
                import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
                    import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogAppS}) => {
                        createLogAppS(ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), req.query.app_id, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), err).then(() => {
                            res.status(500).send(err);
                        })
                    });
                })
            else
                if (jsontoken_dt == null)
                    import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_log/app_log.service.js`).then(({createLog}) => {
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
                                    return res.status(401).send('⛔');
                            }); 
                        })
                else
                    import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_log/app_log.service.js`).then(({createLog}) => {
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
        })
    }
    else{
        return res.status(401).send('⛔');
    }
}
//ENDPOINT MIDDLEWARE
const checkAccessTokenCommon = (req, res, next) => {
    let token = req.get("authorization");
    let stack = new Error().stack;
    if (token){
        token = token.slice(7);
        verify(token, ConfigGet(7, req.query.app_id, 'ACCESS_SECRET'), (err, decoded) => {
            if (err){
                import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
                    import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogAppC}) => {
                        createLogAppC(req.query.app_id, ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), 
                                        `user  ${req.query.user_account_logon_user_account_id} app_id ${req.query.app_id} with ip ${req.ip} invalid token`,
                                        req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, 
                                        res.statusCode, 
                                        req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(() => {
                            res.status(401).send('⛔');
                        })
                    });
                })
            } else {
                //check access token belongs to user_account.id, app_id and ip saved when logged in
                //and if app_id=0 then check user is admin
                import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_logon/user_account_logon.service.js`).then(({checkLogin}) => {
                    checkLogin(req.query.app_id, req.query.user_account_logon_user_account_id, req.headers.authorization.replace('Bearer ',''), req.ip, (err, result)=>{
                        if (err){
                            import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
                                import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogAppS}) => {
                                    createLogAppS(ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), req.query.app_id, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), err).then(() => {
                                        res.status(500).send(err);
                                    })
                                });
                            })
                        }
                        else{
                            if (result.length==1)
                                next();
                            else{
                                import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
                                    import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogAppC}) => {
                                        createLogAppC(req.query.app_id, ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), 
                                                        `user  ${req.query.user_account_logon_user_account_id} app_id ${req.query.app_id} with ip ${req.ip} accesstoken unauthorized`,
                                                        req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, 
                                                        res.statusCode, 
                                                        req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(() => {
                                            res.status(401).send('⛔');
                                        })
                                    });
                                })
                            }
                        }
                    })
                })
            }
        });
    }
    else{
        res.status(401).send('⛔');
    }

}
const checkAccessTokenSuperAdmin = (req, res, next) => {
    if (req.query.app_id==0)
        import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account/user_account.service.js`).then(({getUserAppRoleAdmin}) => {
            getUserAppRoleAdmin(req.query.app_id, req.query.user_account_logon_user_account_id, (err, result)=>{
                if (result[0].app_role_id == 0){
                    checkAccessTokenCommon(req, res, next);
                }
                else
                    res.status(401).send('⛔');
            })
        })
    else
        res.status(401).send('⛔');
}
const checkAccessTokenAdmin = (req, res, next) => {
    if (req.query.app_id==0){
        checkAccessTokenCommon(req, res, next);
    }
    else
        res.status(401).send('⛔');
}
const checkAccessToken = (req, res, next) => {
    //if user login is disabled then check also current logged in user
    //so they can't modify anything anymore with current accesstoken
    if (ConfigGet(1, 'SERVICE_AUTH', 'ENABLE_USER_LOGIN')=='1'){
        checkAccessTokenCommon(req, res, next);
    }
    else{
        //return 401 Not authorized here instead of 403 Forbidden
        //so a user will be logged out instead of getting a message
        res.status(401).send('⛔');
    }

}
const checkDataToken = (req, res, next) => {
    let token = req.get("authorization");
    let stack = new Error().stack;
    if (token){
        token = token.slice(7);
        verify(token, ConfigGet(7, req.query.app_id, 'DATA_SECRET'), (err, decoded) => {
            if (err){
                res.status(401).send('⛔');
            } else {
                next();
            }
        });    
    }
    else{
        res.status(401).send('⛔');
    }
}
const checkDataTokenRegistration = (req, res, next) => {
    if (ConfigGet(1, 'SERVICE_AUTH', 'ENABLE_USER_REGISTRATION')=='1')
        checkDataToken(req, res, next);
    else{
        //return 403 Forbidden
        res.status(403).send('⛔');
    }
        
}
const checkDataTokenLogin = (req, res, next) => {
    if (ConfigGet(1, 'SERVICE_AUTH', 'ENABLE_USER_LOGIN')=='1')
        checkDataToken(req, res, next);
    else{
        //return 403 Forbidden
        res.status(403).send('⛔');
    }
}

const accessToken = (req, callBack) => {
    let stack = new Error().stack;   
    let jsontoken_at;                    
    jsontoken_at = sign ({tokentimstamp: Date.now()}, 
                          ConfigGet(7, req.query.app_id, 'ACCESS_SECRET'), 
                         {
                          expiresIn: ConfigGet(7, req.query.app_id, 'ACCESS_EXPIRE')
                         });
    import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_log/app_log.service.js`).then(({createLog}) => {
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

export {access_control, checkAccessTokenCommon, checkAccessTokenSuperAdmin, checkAccessTokenAdmin, checkAccessToken,
        checkDataToken, checkDataTokenRegistration, checkDataTokenLogin, CreateDataToken, accessToken, policy_directives, 
        check_request}