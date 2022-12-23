const {ConfigGet} = require(global.SERVER_ROOT + '/server/server.service');
const { createLog, createLogAdmin} = require (global.SERVER_ROOT +  ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH') + "/app_log/app_log.service");
const { createLogAppCI } = require(global.SERVER_ROOT + "/service/log/log.controller");
const { ClientConnect, ClientClose, ClientAdd, BroadcastSendSystemAdmin, BroadcastSendAdmin, ConnectedList, ConnectedCount, ConnectedUpdate, ConnectedCheck} = require ("./broadcast.service");
module.exports = {
	BroadcastConnect: (req, res) => {
        ClientConnect(res);
        req.query.app_user_id ='';
        let res_not_used;
        req.query.callback=1;
        if (req.query.system_admin=='1'){
            const { getIpSystemAdmin} = require (global.SERVER_ROOT + "/service/geolocation/geolocation.controller");
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
                ClientAdd(newClient);
                createLogAppCI(req, res, __appfilename, __appfunction, __appline, 'SYSTEM ADMIN Broadcast connect').then(function(){
                    ClientClose(res, req.params.clientId);
                })
            })
        }
        else
            if (req.query.app_id ==ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID')){
                const { getIpAdmin} = require (global.SERVER_ROOT + "/service/geolocation/geolocation.controller");
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
                    ClientAdd(newClient);
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
                                            ClientClose(res, req.params.clientId);
                                    });
                })
            }
            else{
                const { getIp} = require (global.SERVER_ROOT + "/service/geolocation/geolocation.controller");
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
                    ClientAdd(newClient);
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
                                    ClientClose(res, req.params.clientId);
                    });
                })
            }
    },
    BroadcastSendSystemAdmin: (req, res) => {
        BroadcastSendSystemAdmin(req.body.app_id, req.body.client_id, req.body.client_id_current,
                      req.body.broadcast_type, req.body.broadcast_message, (err, result) =>{
            return res.status(200).send(
                err ?? result
            );
        });
    },
    BroadcastSendAdmin: (req, res) => {
        BroadcastSendAdmin(req.body.app_id, req.body.client_id, req.body.client_id_current,
                      req.body.broadcast_type, req.body.broadcast_message, (err, result) =>{
            return res.status(200).send(
                err ?? result
            );
        });
    },
    ConnectedList: (req, res) => {
        ConnectedList(req.query.app_id, req.query.select_app_id, req.query.limit, req.query.year, req.query.month, 
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
                    const { getMessage_admin } = require(global.SERVER_ROOT +  ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH') + "/message_translation/message_translation.service");
                    //Record not found
                    getMessage_admin(req.query.app_id,
                                     ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'),
                                     20400,
                                     req.query.lang_code, (err,result_message)  => {
                                        return res.status(404).send(
                                                err ?? result_message.text
                                        );
                                    });
                }
            }
        })
    },
    ConnectedListSystemAdmin: (req, res) => {
        ConnectedList(req.query.app_id, req.query.select_app_id, req.query.limit, req.query.year, req.query.month, 
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
    },
    ConnectedCount: (req, res) => {
        ConnectedCount(req.query.identity_provider_id, req.query.count_logged_in, (err, count_connected) => {
            return res.status(200).json({
                data: count_connected
            });
        })
    },
    ConnectedUpdate: (req, res) => {
        ConnectedUpdate(req.query.client_id, req.query.user_account_id, req.query.system_admin, req.query.identity_provider_id, (err, result) =>{
            return res.status(200).json(
                err ?? result
            );
        })
    },
    ConnectedCheck: (req, res) => {
        ConnectedCheck(req.params.user_account_id, (err, result_connected)=>{
            return res.status(200).json({
                online: result_connected
            });
        })
    }
}