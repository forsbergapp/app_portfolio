const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);
const service = await import('./apps.service.js')
const client_locale = (accept_language) =>{
    let locale;
    if (accept_language.startsWith('text') || accept_language=='*')
        locale = 'en';
    else{
        //check first lang ex syntax 'en-US,en;'
        locale = accept_language.split(',')[0].toLowerCase();
        if (locale.length==0){
            //check first lang ex syntax 'en;'
            locale = accept_language.split(';')[0].toLowerCase();
            if (locale.length==0 && accept_language.length>0)
                //check first lang ex syntax 'en' or 'zh-cn'
                locale = accept_language.toLowerCase();
            else{
                locale = 'en';
            }
        }
    }
    return locale;
}
const getApp = (req, res, app_id, params, callBack) => {
    //getIp and createLog needs app_id
    req.query.app_id = app_id;
    req.query.app_user_id = null;
    req.query.callback=1;
    import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/geolocation/geolocation.controller.js`).then(({getIp}) => {
        getIp(req, res, (err, result)=>{
            let gps_place = result.geoplugin_city + ', ' +
                            result.geoplugin_regionName + ', ' +
                            result.geoplugin_countryName;
            //check if maintenance
            if (ConfigGet(0, null, 'MAINTENANCE')=='1'){
                service.getMaintenance(app_id,
                    result.geoplugin_latitude,
                    result.geoplugin_longitude,
                    gps_place).then((app_result) => {
                    return callBack(null, app_result);
                });
            }
            else{
                import(`file://${process.cwd()}/apps/app${app_id}/client.js`).then(({ createApp }) => {
                    createApp(app_id, 
                              params,
                              result.geoplugin_latitude,
                              result.geoplugin_longitude, 
                              gps_place,
                              client_locale(req.headers['accept-language'])).then((app_result) => {
                                import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/app_log/app_log.service.js`).then(({createLog}) => {
                                    createLog(req.query.app_id,
                                                { app_id : app_id,
                                                app_module : 'APPS',
                                                app_module_type : 'APP',
                                                app_module_request : params,
                                                app_module_result : gps_place,
                                                app_user_id : null,
                                                user_language : null,
                                                user_timezone : null,
                                                user_number_system : null,
                                                user_platform : null,
                                                server_remote_addr : req.ip,
                                                server_user_agent : req.headers["user-agent"],
                                                server_http_host : req.headers["host"],
                                                server_http_accept_language : req.headers["accept-language"],
                                                client_latitude : result.geoplugin_latitude,
                                                client_longitude : result.geoplugin_longitude
                                                }, (err,results)  => {
                                                    return callBack(null, app_result)
                                    });
                                })
                    });
                })
            }
        })
    })
}
const getAppAdmin = (req, res, app_id, callBack) => {
    //getIp and createLog needs app_id
    req.query.app_id = app_id;
    req.query.app_user_id = null;
    req.query.callback=1;
    let stack = new Error().stack;
    if (ConfigGet(1, 'SERVICE_DB', 'START')=='1'){
        import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/geolocation/geolocation.controller.js`).then(({getIpAdmin}) => {
            getIpAdmin(req, res, (err, result)=>{
                let gps_place = result.geoplugin_city + ', ' +
                                result.geoplugin_regionName + ', ' +
                                result.geoplugin_countryName;
                import(`file://${process.cwd()}/apps/admin/client.js`).then(({ createAdmin }) => {
                    createAdmin(app_id,
                                result.geoplugin_latitude,
                                result.geoplugin_longitude, 
                                gps_place,
                                client_locale(req.headers['accept-language'])).then((app_result) => {
                                import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/app_log/app_log.service.js`).then(({createLogAdmin}) => {
                                    createLogAdmin(req.query.app_id,
                                                    { app_id : app_id,
                                                        app_module : 'APPS',
                                                        app_module_type : 'ADMIN',
                                                        app_module_request : null,
                                                        app_module_result : gps_place,
                                                        app_user_id : null,
                                                        user_language : null,
                                                        user_timezone : null,
                                                        user_number_system : null,
                                                        user_platform : null,
                                                        server_remote_addr : req.ip,
                                                        server_user_agent : req.headers["user-agent"],
                                                        server_http_host : req.headers["host"],
                                                        server_http_accept_language : req.headers["accept-language"],
                                                        client_latitude : result.geoplugin_latitude,
                                                        client_longitude : result.geoplugin_longitude
                                                        }, (err,results)  => {
                                                            return callBack(null, app_result);
                                                    });
                                    })
                                })
                })          
            })
        })
    }
    else{
        import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/geolocation/geolocation.controller.js`).then(({getIpSystemAdmin}) => {
            getIpSystemAdmin(req, res, (err, result)=>{
                let gps_place = result.geoplugin_city + ', ' +
                                result.geoplugin_regionName + ', ' +
                                result.geoplugin_countryName;
                import(`file://${process.cwd()}/apps/admin/client.js`).then(({ createAdmin }) => {
                    createAdmin(app_id,
                                result.geoplugin_latitude,
                                result.geoplugin_longitude, 
                                gps_place,
                                client_locale(req.headers['accept-language'])).then((app_result) => {
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
                
            })
        })
    }
}
const getAppAdminSecure = (req, res) => {
    try {
        let stack = new Error().stack;
        import(`file://${process.cwd()}/apps/admin/src/secure/index.js`).then(({ createAdminSecure }) => {
            const app = createAdminSecure(req.query.app_id,
                1,      //system admin=1
                null,
                null,
                null, 
                null)
            .then((app_result) => {
                import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
                    import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogAppC}) => {
                        createLogAppC(req.query.app_id, ConfigGet(1, 'SERVICE_LOG', 'LEVEL_INFO'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), 
                                      'SYSTEM ADMIN Forms admin secure',
                                      req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, 
                                      res.statusCode, 
                                      req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(() => {
                            return res.status(200).json({
                                app: app_result
                            });
                        })
                    });
                })
            })    
        })
    } catch (error) {
        return res.status(500).json({
            error
        });
    }     
}
export{getApp, getAppAdmin, getAppAdminSecure}