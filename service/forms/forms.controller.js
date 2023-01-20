const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);

function getForm(req, res, app_id, params, callBack){
    //getIp and createLog needs app_id
    req.query.app_id = app_id;
    req.query.app_user_id = null;
    req.query.callback=1;
    import(`file://${process.cwd()}/service/geolocation/geolocation.controller.js`).then(function({getIp}){
        getIp(req, res, (err, result)=>{
            let gps_place = result.geoplugin_city + ', ' +
                            result.geoplugin_regionName + ', ' +
                            result.geoplugin_countryName;
            //check if maintenance
            if (ConfigGet(0, null, 'MAINTENANCE')=='1'){
                import(`file://${process.cwd()}/apps/index.js`).then(function({ getMaintenance }){
                    const app = getMaintenance(app_id,
                        result.geoplugin_latitude,
                        result.geoplugin_longitude,
                        gps_place)
                    .then(function(app_result){
                    return callBack(null, app_result);
                    });
                });
            }
            else{
                import(`file://${process.cwd()}/apps/app${app_id}/client.js`).then(function({ getApp }){
                    const app = getApp(app_id, 
                        params,
                        result.geoplugin_latitude,
                        result.geoplugin_longitude, 
                        gps_place)
                    .then(function(app_result){
                        import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/app_log/app_log.service.js`).then(function({createLog}){
                            createLog(req.query.app_id,
                                        { app_id : app_id,
                                        app_module : 'FORMS',
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
function getFormAdmin(req, res, app_id, callBack){
    //getIp and createLog needs app_id
    req.query.app_id = app_id;
    req.query.app_user_id = null;
    req.query.callback=1;
    if (ConfigGet(1, 'SERVICE_DB', 'START')=='1'){
        import(`file://${process.cwd()}/service/geolocation/geolocation.controller.js`).then(function({getIpAdmin}){
            getIpAdmin(req, res, (err, result)=>{
                let gps_place = result.geoplugin_city + ', ' +
                                result.geoplugin_regionName + ', ' +
                                result.geoplugin_countryName;
                import(`file://${process.cwd()}/apps/admin/client.js`).then(function({ getAdmin }){
                    const app = getAdmin(app_id,
                                         result.geoplugin_latitude,
                                         result.geoplugin_longitude, 
                                         gps_place).then(function(app_result){
                                            import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/app_log/app_log.service.js`).then(function({createLogAdmin}){
                                                createLogAdmin(req.query.app_id,
                                                                { app_id : app_id,
                                                                    app_module : 'FORMS',
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
        import(`file://${process.cwd()}/service/geolocation/geolocation.controller.js`).then(function({getIpSystemAdmin}){
            getIpSystemAdmin(req, res, (err, result)=>{
                let gps_place = result.geoplugin_city + ', ' +
                                result.geoplugin_regionName + ', ' +
                                result.geoplugin_countryName;
                import(`file://${process.cwd()}/apps/admin/client.js`).then(function({ getAdmin }){
                    const app = getAdmin(app_id,
                                         result.geoplugin_latitude,
                                         result.geoplugin_longitude, 
                                         gps_place).then(function(app_result){
                                            let stack = new Error().stack;
                                            import(`file://${process.cwd()}/service/log/log.controller.js`).then(function({ createLogAppCI }){
                                                import(`file://${process.cwd()}/service/common/common.service.js`).then(function({COMMON}){
                                                    createLogAppCI(req, res, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), 'SYSTEM ADMIN Forms Admin').then(function(){
                                                        return callBack(null, app_result);
                                                    })
                                                })
                                            })
                                         })
                })
                
            })
        })
    }
}
function getFormAdminSecure(req, res){
    try {
        let stack = new Error().stack;
        import(`file://${process.cwd()}/apps/admin/src/secure/index.js`).then(function({ getAdminSecure }){
            const app = getAdminSecure(req.query.app_id,
                1,      //system admin=1
                null,
                null,
                null, 
                null)
            .then(function(app_result){
                import(`file://${process.cwd()}/service/log/log.controller.js`).then(function({ createLogAppCI }){
                    import(`file://${process.cwd()}/service/common/common.service.js`).then(function({COMMON}){
                        createLogAppCI(req, res, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), 'SYSTEM ADMIN Forms admin secure').then(function(){
                            return res.status(200).json({
                                app: app_result
                            });
                        })
                    })
                })
            })    
        })
    } catch (error) {
        return res.status(500).json({
            error
        });
    }     
}

export {getForm, getFormAdmin, getFormAdminSecure}