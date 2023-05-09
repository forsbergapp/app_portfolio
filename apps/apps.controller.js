const {ConfigGet, COMMON} = await import(`file://${process.cwd()}/server/server.service.js`);
const service = await import('./apps.service.js')
const getApp = async (req, res, app_id, params, callBack) => {
    //createLog needs app_id
    req.query.app_id = app_id;
    req.query.app_user_id = null;
    req.query.callback=1;
    //check if maintenance
    if (ConfigGet(0, null, 'MAINTENANCE')=='1'){
        service.getMaintenance(app_id, null, null,null).then((app_result) => {
            return callBack(null, app_result);
        });
    }
    else{
        import(`file://${process.cwd()}/apps/app${app_id}/client.js`).then(({ createApp }) => {
            createApp(app_id, params,service.client_locale(req.headers['accept-language'])).then((app_result) => {
                import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/app_log/app_log.service.js`).then(({createLog}) => {
                    createLog(req.query.app_id,
                                { app_id : app_id,
                                app_module : 'APPS',
                                app_module_type : 'APP',
                                app_module_request : params,
                                app_module_result : null,
                                app_user_id : null,
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
                                    return callBack(null, app_result)
                    });
                })
            });
        })
    }
}
const getAppAdmin = async (req, res, app_id, callBack) => {
    //createLog needs app_id
    req.query.app_id = app_id;
    req.query.app_user_id = null;
    req.query.callback=1;
    let stack = new Error().stack;
    if (ConfigGet(1, 'SERVICE_DB', 'START')=='1'){
        import(`file://${process.cwd()}/apps/admin/client.js`).then(({ createAdmin }) => {
            createAdmin(app_id,service.client_locale(req.headers['accept-language'])).then((app_result) => {
            import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/app_log/app_log.service.js`).then(({createLogAdmin}) => {
                createLogAdmin(req.query.app_id,
                                { app_id : app_id,
                                app_module : 'APPS',
                                app_module_type : 'ADMIN',
                                app_module_request : null,
                                app_module_result : null,
                                app_user_id : null,
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
                                        return callBack(null, app_result);
                                });
                })
            })
        })
    }
    else{
        import(`file://${process.cwd()}/apps/admin/client.js`).then(({ createAdmin }) => {
            createAdmin(app_id,service.client_locale(req.headers['accept-language'])).then((app_result) => {
                import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
                    import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogAppC}) => {
                        createLogAppC(req.query.app_id, ConfigGet(1, 'SERVICE_LOG', 'LEVEL_INFO'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), 
                                    'SYSTEM ADMIN APPS Admin',
                                    req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, 
                                    res.statusCode, 
                                    req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(() => {
                            return callBack(null, app_result);
                        })
                    });
                })
            })
        })
    }
}
//backend for frontend
//returns status 401 (parameter errors), 503(ANY error in called service) or 200 if ok
//together with error or result
const BFF = async (req, res) =>{
    //check inparameters
    if (!req.query.app_id &&
        !req.query.service &&
        !req.query.parameters)
        //required parameters not provided
        //use common app id to get message and use first lang_code form app or if missing use language in headers
        return res.status(401).send({
            message: '⛔'
        });
    else{
        let stack = new Error().stack;
        let decodedparameters = Buffer.from(req.query.parameters, 'base64').toString('utf-8');
        let log_result=false;
        const service_called = req.query.service.toUpperCase();
        let parameters;
        if (req.query.user_account_logon_user_account_id)
            parameters = decodedparameters + `&user_account_logon_user_account_id=${req.query.user_account_logon_user_account_id}`
        else
            parameters = decodedparameters;
        service.BFF(req.query.app_id, service_called, parameters, req.ip, req.hostname, req.method, req.headers.authorization, req.headers["user-agent"], req.headers["accept-language"], req.body)
        .then(result_service => {
            //log INFO to module log and to files
            import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogAppC}) => {
                createLogAppC(req.query.app_id, ConfigGet(1, 'SERVICE_LOG', 'LEVEL_INFO'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), 
                            `SERVICE ${service_called} ${log_result==true?log_result:''}`,
                            req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, 
                            res.statusCode, 
                            req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(() => {
                    if (log_result)
                        return res.status(200).send();
                    else
                        if (result_service.startsWith('%PDF')){
                            res.type('application/pdf');
			                return res.send(result_service);
                        }
                        else
                            return res.status(200).send(result_service);
                })
            });
        })
        .catch(error => {
            //log ERROR to module log and to files
            import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogAppC}) => {
                createLogAppC(req.query.app_id, ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), 
                            `SERVICE ${service_called} error: ${error}`,
                            req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, 
                            res.statusCode, 
                            req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(() => {
                    //return service unavailable and error message
                    return res.status(503).json(
                        error
                    );
                })
            });
        })
    }
}
//backend for frontend report without token
const BFF_report = async (req, res) =>{
    //check inparameters
    if (req.query.service.toUpperCase()=='REPORT')
        return BFF(req,res);
    else{
        //required parameters not provided
        //use common app id to get message and use first lang_code form app or if missing use language in headers
        return res.status(401).send({
            message: '⛔'
        });
    }
}
export{getApp, getAppAdmin, BFF, BFF_report}