global.broadcast_clients = [];
const { createLog, createLogAdmin} = require ("../../service/db/app_portfolio/app_log/app_log.service");
const { BroadcastSend, ConnectedList, ConnectedCount, ConnectedUpdate, ConnectedCheck} = require ("./broadcast.service");
module.exports = {
	BroadcastConnect: (req, res) => {
        const headers = {
            "Content-Type": "text/event-stream",
            "Connection": "keep-alive",
          };
        res.writeHead(200, headers);
        req.query.app_user_id ='';
        let res2;
        req.query.callback=1;
        if (req.query.admin =='true'){
            const { getIpAdmin} = require ("../geolocation/geolocation.controller");
            getIpAdmin(req, res2, (err, geodata) =>{
                const newClient = {
                    id: req.params.clientId,
                    app_id: req.query.app_id,
                    user_account_id: req.query.user_account_id,
                    user_agent: req.headers["user-agent"],
                    connection_date: new Date().toISOString(),
                    ip: req.ip,
                    gps_latitude: geodata.geoplugin_latitude,
                    gps_longitude: geodata.geoplugin_longitude,
                    identity_provider_id: req.query.identity_provider_id,
                    response: res
                };
                broadcast_clients.push(newClient);
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
                                        res.on('close', ()=>{
                                            broadcast_clients = broadcast_clients.filter(client => client.id !== req.params.clientId);
                                            res.end();
                                        })                        
                                });
            })
        }
        else{
            const intervalId = setInterval(() => {
                if (process.env.SERVER_MAINTENANCE==1){
                    const broadcast =`{"broadcast_type" :"MAINTENANCE", 
                                      "broadcast_message":""}`;
                    res.write (`data: ${btoa(broadcast)}\n\n`);
                }
            }, 5000);
            const { getIp} = require ("../geolocation/geolocation.controller");
            getIp(req, res2, (err, geodata) =>{
                const newClient = {
                    id: req.params.clientId,
                    app_id: req.query.app_id,
                    user_account_id: req.query.user_account_id,
                    user_agent: req.headers["user-agent"],
                    connection_date: new Date().toISOString(),
                    ip: req.ip,
                    gps_latitude: geodata.geoplugin_latitude,
                    gps_longitude: geodata.geoplugin_longitude,
                    identity_provider_id: req.query.identity_provider_id,
                    response: res
                };
                broadcast_clients.push(newClient);
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
                                res.on('close', ()=>{
                                    broadcast_clients = broadcast_clients.filter(client => client.id !== req.params.clientId);              
                                    clearInterval(intervalId);
                                    res.end();
                                })
                });
            })
        }
    },
    BroadcastSend: (req, res) => {
        BroadcastSend(req.body.app_id, req.body.client_id, req.body.client_id_current, req.body.destination_app, 
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
                    const { getMessage_admin } = require("../../service/db/app_portfolio/message_translation/message_translation.service");
                    //Record not found
                    getMessage_admin(req.query.app_id,
                                     process.env.COMMON_APP_ID,
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
    ConnectedCount: (req, res) => {
        ConnectedCount(req.query.identity_provider_id, req.query.count_logged_in, (err, count_connected) => {
            return res.status(200).json({
                data: count_connected
            });
        })
    },
    ConnectedUpdate: (req, res) => {
        ConnectedUpdate(req.query.client_id, req.query.user_account_id, req.query.identity_provider_id, (err, result) =>{
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