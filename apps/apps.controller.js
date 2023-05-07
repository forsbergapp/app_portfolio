const microservice = await import(`file://${process.cwd()}/service/service.service.js`);
const microservice_circuitbreak = new microservice.CircuitBreaker();
const {ConfigGet, COMMON} = await import(`file://${process.cwd()}/server/server.service.js`);
const service = await import('./apps.service.js')
const { check_internet } = await import(`file://${process.cwd()}/server/auth/auth.controller.js`);

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
        //usage /service?parameters=[base64]
        //parameters content: 'app_id=[app_id]&service=[SERVICENAME]&lang_code=[LANG_CODE]&parameters=[BASE64]
        let stack = new Error().stack;
        let decodedparameters = Buffer.from(req.query.parameters, 'base64').toString('utf-8');
        let log_result=false;
        const rest_resource_service = ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE');
        const service_called = req.query.service.toUpperCase();
        let result_internet = await check_internet(req.query.app_id);
        // called from app req.originalUrl: '/service?parameters=[base64]
        const callServiceResult = async () => {
            return new Promise((resolve, reject) => {
                try {
                    switch (service_called){
                        case 'DB':{
                            const rest_resource_service_db_schema = ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA');
                            let db_url = `${url}${rest_resource_service}/db/${rest_resource_service_db_schema}${decodedparameters}&proxy_ip=${req_ip}`;
                            switch (req.method){
                                // parameters ex:
                                // /user_account/profile/id/[:param]?id=&app_id=[id]&lang_code=en'
                                case 'GET':
                                case 'POST':
                                case 'PUT':
                                case 'PATCH':
                                case 'DELETE':{
                                    resolve(microservice_circuitbreak.callService(req.hostname,
                                                                                  db_url, 
                                                                                  service_called, 
                                                                                  req.method,
                                                                                  req.headers.authorization, 
                                                                                  req.headers["accept-language"], 
                                                                                  req.body));
                                    break;
                                }
                                default:{
                                    resolve('service DB GET, POST, PUT, PATCH or DELETE only');
                                }
                            }
                            break;
                        }
                        case 'GEOLOCATION':{
                            // parameters ex:
                            // /ip?app_id=[id]&lang_code=en
                            // /place?latitude[latitude]&longitude=[longitude]
                            if (ConfigGet(1, 'SERVICE_AUTH', 'ENABLE_GEOLOCATION')=='1' && result_internet==1){
                                if (req.method=='GET'){
                                    //set req.ip from client in case ip query parameter is missing
                                    let basepath = decodedparameters.split('?')[0];
                                    // /ip, /ip/admin or /systemadmin
                                    if (decodedparameters.startsWith('/ip')){    
                                        let params = decodedparameters.split('?')[1].split('&');
                                        //if ip parameter does not exist
	                                    if (params.filter(parm=>parm.includes('ip=')).length==0 )
                                            params.push(`&ip=${req.ip}`);
                                        else{
                                            //if empty ip parameter
                                            if (params.filter(parm=>parm == 'ip=').length==1)
                                                params.map(parm=>parm = parm.replace('ip=', `ip=${req.ip}`));
                                        }
                                        decodedparameters = `${basepath}?${params.reduce((param_sum,param)=>param_sum += param)}`;
                                    }
                                    //replace input path 
                                    resolve(microservice_circuitbreak.callService(req.hostname,
                                                                                  `${rest_resource_service}/geolocation${decodedparameters}` +
                                                                                  `&app_id=${req.query.app_id}&user_account_logon_user_account_id=${req.query.user_account_logon_user_account_id}&lang_code=${req.query.lang_code}&proxy_ip=${req.ip}`, 
                                                                                  service_called, 
                                                                                  req.method,
                                                                                  req.headers.authorization, 
                                                                                  req.headers["accept-language"], 
                                                                                  req.body));
                                }
                                else
                                    resolve('service GEOLOCATION GET only');
                            }
                            else
                                resolve();
                            break;

                        }
                        case 'MAIL':{
                            // parameters ex:
                            // ?&app_id=[id]&lang_code=en
                            log_result = true;
                            if (req.method=='POST')
                                resolve(microservice_circuitbreak.callService( req.hostname,
                                                                               `${rest_resource_service}/mail${decodedparameters}&proxy_ip=${req.ip}`, 
                                                                               service_called, 
                                                                               req.method,
                                                                               req.headers.authorization, 
                                                                               req.headers["accept-language"], 
                                                                               req.body));
                            else
                                resolve('service MAIL POST only')
                            break;
                        }
                        case 'REPORT':{
                            // parameter ex
                            // app_id=[id]&service=REPORT&reportid=[base64]
                            // decode
                            // ?reportid=[base64]
                            // req.headers.authorization not used for this service
                            //check if maintenance
                            if (ConfigGet(0, null, 'MAINTENANCE')=='1'){
                                import(`file://${process.cwd()}/apps/apps.service.js`).then(({getMaintenance}) => {
                                    getMaintenance(req.query.app_id)
                                    .then((app_result) => {
                                        resolve(app_result);
                                    });
                                })
                            }
                            else
                                if (req.method=='GET')
                                    resolve(microservice_circuitbreak.callService(req.hostname,
                                                                                  `${rest_resource_service}/report${decodedparameters}&proxy_ip=${req.ip}`, 
                                                                                  service_called, 
                                                                                  req.method,
                                                                                  null, 
                                                                                  req.headers["accept-language"], 
                                                                                  req.body));
                                else
                                    resolve('service REPORT GET only')
                            break;
                        }
                        case 'WORLDCITIES':{
                            //from app req.originalUrl:
                            //  '/service?parameters=[base64]
                            // parameters ex:
                            // /[countrycode]?app_user_id=[id]&app_id=[id]&lang_code=en
                            if (req.method=='GET')
                                resolve(microservice_circuitbreak.callService(req.hostname,
                                                                              `${rest_resource_service}/worldcities${decodedparameters}&proxy_ip=${req.ip}`,
                                                                              service_called, 
                                                                              req.method,
                                                                              req.headers.authorization, 
                                                                              req.headers["accept-language"], 
                                                                              req.body));
                            else
                                resolve('service WORLDCITIES GET only')
                            break;
                        }
                        default:{
                            resolve(`service ${req.query.service} does not exist`);
                        }
                    }
                } catch (error) {
                    reject(error);
                }
            })
        }
        callServiceResult()
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
                        res.send(result_service);
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