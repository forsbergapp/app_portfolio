const service = await import('./broadcast.service.js');

const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);

function BroadcastConnect(req, res){
    req.params.clientId = parseInt(req.params.clientId);
    service.ClientConnect(res);
    req.query.app_user_id ='';
    let res_not_used;
    req.query.callback=1;
    let stack = new Error().stack;
    if (req.query.system_admin=='1'){
        import(`file://${process.cwd()}/service/geolocation/geolocation.controller.js`).then(function({getIpSystemAdmin}){
            getIpSystemAdmin(req, res, (err, geodata) =>{
                const newClient = {
                    id: req.params.clientId,
                    app_id: req.query.app_id,
                    user_account_id: null,
                    system_admin: 1,
                    user_agent: req.headers["user-agent"],
                    connection_date: new Date().toISOString(),
                    ip: req.ip,
                    gps_latitude: geodata.geoplugin_latitude,
                    gps_longitude: geodata.geoplugin_longitude,
                    identity_provider_id: req.query.identity_provider_id,
                    response: res
                };
                service.ClientAdd(newClient);
                import(`file://${process.cwd()}/service/common/common.service.js`).then(function({COMMON}){
                    import(`file://${process.cwd()}/service/log/log.service.js`).then(function({createLogAppC}){
                        createLogAppC(req.query.app_id, ConfigGet(1, 'SERVICE_LOG', 'LEVEL_INFO'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), 
                                      'SYSTEM ADMIN Broadcast connect',
                                      req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, 
                                      res.statusCode, 
                                      req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(function(){
                            service.ClientClose(res, req.params.clientId);
                        })
                    });
                })
            })
        })
    }
    else
        if (req.query.app_id ==ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID')){
            import(`file://${process.cwd()}/service/geolocation/geolocation.controller.js`).then(function({getIpAdmin}){
                getIpAdmin(req, res_not_used, (err, geodata) =>{
                    const newClient = {
                        id: req.params.clientId,
                        app_id: req.query.app_id,
                        user_account_id: req.query.user_account_id,
                        system_admin: 0,
                        user_agent: req.headers["user-agent"],
                        connection_date: new Date().toISOString(),
                        ip: req.ip,
                        gps_latitude: geodata.geoplugin_latitude,
                        gps_longitude: geodata.geoplugin_longitude,
                        identity_provider_id: req.query.identity_provider_id,
                        response: res
                    };
                    service.ClientAdd(newClient);
                    import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/app_log/app_log.service.js`).then(function({createLogAdmin}){
                        createLogAdmin(req.query.app_id,
                            { app_id : req.query.app_id,
                                app_module : 'BROADCAST',
                                app_module_type : 'CONNECT',
                                app_module_request : req.originalUrl,
                                app_module_result : JSON.stringify(geodata),
                                app_user_id : null,
                                user_language : null,
                                user_timezone : null,
                                user_number_system : null,
                                user_platform : null,
                                server_remote_addr : req.ip,
                                server_user_agent : req.headers["user-agent"],
                                server_http_host : req.headers["host"],
                                server_http_accept_language : req.headers["accept-language"],
                                client_latitude : geodata.geoplugin_latitude,
                                client_longitude : geodata.geoplugin_longitude
                                }, (err,results)  => {
                                    service.ClientClose(res, req.params.clientId);
                            });
                    })
                })
            })
        }
        else{
            import(`file://${process.cwd()}/service/geolocation/geolocation.controller.js`).then(function({getIp}){
                getIp(req, res_not_used, (err, geodata) =>{
                    const newClient = {
                        id: req.params.clientId,
                        app_id: req.query.app_id,
                        user_account_id: req.query.user_account_id,
                        system_admin: 0,
                        user_agent: req.headers["user-agent"],
                        connection_date: new Date().toISOString(),
                        ip: req.ip,
                        gps_latitude: geodata.geoplugin_latitude,
                        gps_longitude: geodata.geoplugin_longitude,
                        identity_provider_id: req.query.identity_provider_id,
                        response: res
                    };
                    service.ClientAdd(newClient);
                    import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/app_log/app_log.service.js`).then(function({createLog}){
                        createLog(req.query.app_id,
                                { app_id : req.query.app_id,
                                    app_module : 'BROADCAST',
                                    app_module_type : 'CONNECT',
                                    app_module_request : req.originalUrl,
                                    app_module_result : JSON.stringify(geodata),
                                    app_user_id : req.query.user_account_id,
                                    user_language : null,
                                    user_timezone : null,
                                    user_number_system : null,
                                    user_platform : null,
                                    server_remote_addr : req.ip,
                                    server_user_agent : req.headers["user-agent"],
                                    server_http_host : req.headers["host"],
                                    server_http_accept_language : req.headers["accept-language"],
                                    client_latitude : geodata.geoplugin_latitude,
                                    client_longitude : geodata.geoplugin_longitude
                                    }, (err,results)  => {
                                        service.ClientClose(res, req.params.clientId);
                        });
                    })
                })
            })
        }
}
function BroadcastSendSystemAdmin(req, res){
    if (req.body.app_id)
        req.body.app_id = parseInt(req.body.app_id);
    if (req.body.client_id)
        req.body.client_id = parseInt(req.body.client_id);
    req.body.client_id_current = parseInt(req.body.client_id_current);
    service.BroadcastSendSystemAdmin(req.body.app_id, req.body.client_id, req.body.client_id_current,
                                        req.body.broadcast_type, req.body.broadcast_message, (err, result) =>{
        return res.status(200).send(
            err ?? result
        );
    });
}
function BroadcastSendAdmin(req, res){
    if (req.body.app_id)
        req.body.app_id = parseInt(req.body.app_id);
    if (req.body.client_id)        
        req.body.client_id = parseInt(req.body.client_id);
    req.body.client_id_current = parseInt(req.body.client_id_current);
    service.BroadcastSendAdmin(req.body.app_id, req.body.client_id, req.body.client_id_current,
                                req.body.broadcast_type, req.body.broadcast_message, (err, result) =>{
        return res.status(200).send(
            err ?? result
        );
    });
}
function ConnectedList(req, res){
    service.ConnectedList(req.query.app_id, req.query.select_app_id, req.query.limit, req.query.year, req.query.month, 
                            req.query.order_by, req.query.sort,  (err, result) => {
        if (err) {
            return res.status(500).send({
                data: err
            });
        }
        else{
            if (result && result.length>0)
                return res.status(200).json({
                    data: result
                });
            else{
                import(`file://${process.cwd()}/service/db/common/common.service.js`).then(function({record_not_found}){
                    return record_not_found(res, req.query.app_id, req.query.lang_code);
                })
            }
        }
    })
}
function ConnectedListSystemAdmin(req, res){
    service.ConnectedList(req.query.app_id, req.query.select_app_id, req.query.limit, req.query.year, req.query.month, 
                            req.query.order_by, req.query.sort,  (err, result) => {
        if (err) {
            return res.status(500).send({
                data: err
            });
        }
        else{
            if (result && result.length>0)
                return res.status(200).json({
                    data: result
                });
            else{
                return res.status(404).send(
                    'Record not found'
                );
            }
        }
    })
}
function ConnectedCount(req, res){
    service.ConnectedCount(req.query.identity_provider_id, req.query.count_logged_in, (err, count_connected) => {
        return res.status(200).json({
            data: count_connected
        });
    })
}
function ConnectedUpdate(req, res){
    service.ConnectedUpdate(req.query.client_id, req.query.user_account_id, req.query.system_admin, req.query.identity_provider_id, (err, result) =>{
        return res.status(200).json(
            err ?? result
        );
    })
}
function ConnectedCheck(req, res){
    req.params.user_account_id = parseInt(req.params.user_account_id);
    service.ConnectedCheck(req.params.user_account_id, (err, result_connected)=>{
        return res.status(200).json({
            online: result_connected
        });
    })
}
export {BroadcastConnect, BroadcastSendSystemAdmin, BroadcastSendAdmin, 
        ConnectedList, ConnectedListSystemAdmin, ConnectedCount, ConnectedUpdate, ConnectedCheck}