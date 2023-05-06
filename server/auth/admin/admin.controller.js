const {default:{sign, verify}} = await import("jsonwebtoken");

const {CheckFirstTime, ConfigGet, CreateSystemAdmin} = await import(`file://${process.cwd()}/server/server.service.js`);

const checkSystemAdmin = (req, res, next) => {
    let token = req.get("authorization");
    if (token){
        token = token.slice(7);
        verify(token, ConfigGet(1, 'SERVICE_AUTH', 'ADMIN_TOKEN_SECRET'), (err, decoded) => {
            if (err){
                let stack = new Error().stack;
                import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
                    import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogAppC}) => {
                        createLogAppC(req.query.app_id, ConfigGet(1, 'SERVICE_LOG', 'LEVEL_INFO'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), 
                                      'SYSTEM ADMIN CheckSystemAdmin token verify error: ' + err,
                                      req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, 
                                      res.statusCode, 
                                      req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(() => {
                            res.status(401).send({
                                message: '⛔'
                            });
                        })
                    });
                })
            } else {
                next();
            }
        });
        
    }else{
        let stack = new Error().stack;
        import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
            import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogAppC}) => {
                createLogAppC(req.query.app_id, ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), 
                              'SYSTEM ADMIN CheckSystemAdmin token missing',
                              req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, 
                              res.statusCode, 
                              req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(() => {
                    res.status(401).send({
                        message: '⛔'
                    });
                })
            });
        })
    }
}
const authSystemAdmin = (req, res) => {
    const check_user = (username, password) => {
        let config_username = ConfigGet(6)['username'];
        let config_password = ConfigGet(6)['password'];
        if (username == config_username &&
            password == config_password) {
            let jsontoken_at;
            jsontoken_at = sign ({tokentimstamp: Date.now()}, ConfigGet(1, 'SERVICE_AUTH', 'ADMIN_TOKEN_SECRET'), {
                                expiresIn: ConfigGet(1, 'SERVICE_AUTH', 'ADMIN_TOKEN_EXPIRE_ACCESS')
                                });
            let stack = new Error().stack;
            import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
                import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogAppC}) => {
                    createLogAppC(req.query.app_id, ConfigGet(1, 'SERVICE_LOG', 'LEVEL_INFO'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), 
                                  'SYSTEM ADMIN login OK:' + ConfigGet(1, 'SERVER', 'ADMIN_NAME'),
                                  req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, 
                                  res.statusCode, 
                                  req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(() => {
                        return res.status(200).json({ 
                            token_at: jsontoken_at
                        });
                    })
                });
            })
        }
        else{
            let stack = new Error().stack;
            import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
                import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogAppC}) => {
                    createLogAppC(req.query.app_id, ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), 
                                  'SYSTEM ADMIN login FAIL:' + ConfigGet(1, 'SERVER', 'ADMIN_NAME'),
                                  req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, 
                                  res.statusCode, 
                                  req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(()=> {
                        return res.status(401).send({ 
                            message: '⛔'
                        });
                    })
                });
            })
        }            
    }
    if(req.headers.authorization){                
        let userpass = new Buffer.from((req.headers.authorization || '').split(' ')[1] || '', 'base64').toString();
        let username = userpass.split(':')[0];
        let password = userpass.split(':')[1];
        if (CheckFirstTime())
            CreateSystemAdmin(username, password, (err, result) =>{
                check_user(username, password);
            })
        else
            check_user(username, password);
    }
    else
        return res.status(401).send({ 
            message: '⛔'
        });
}
export {checkSystemAdmin, authSystemAdmin}
