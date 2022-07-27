global.broadcast_clients = [];
const { createLog} = require ("../../service/db/api/app_log/app_log.service");
const { getListConnected, getCountConnected, sendBroadcast, updateConnected, checkConnected} = require ("./broadcast.service");
module.exports = {
	connectBroadcast: (req, res) => {
        const headers = {
            "Content-Type": "text/event-stream",
            "Connection": "keep-alive",
          };
        res.writeHead(200, headers);
        const intervalId = setInterval(() => {
            const { getParameter } = require ("../db/api/app_parameter/app_parameter.service");
            getParameter(process.env.MAIN_APP_ID,'SERVER_MAINTENANCE', (err, db_SERVER_MAINTENANCE)=>{
                if (err){
                    const {createLogAppSE} = require("../log/log.controller");
                    createLogAppSE(process.env.MAIN_APP_ID, __appfilename, __appfunction, __appline, err, (err_log, result_log)=>{
                        null;
                    })
                }
                else{
                    if (db_SERVER_MAINTENANCE==1){
                        const broadcast =`{"broadcast_type" :"MAINTENANCE", 
                                          "broadcast_message":""}`;
                        res.write (`data: ${btoa(broadcast)}\n\n`);
                    }
                }
            })
        }, 5000);
        const { getIp} = require ("../geolocation/geolocation.controller");
        req.query.app_user_id ='';
        let app_id = req.query.app_id;
        if (req.query.app_id ==''){
            //use MAIN_APP_ID to use in log if this is called from admin without app_id
            req.query.app_id = process.env.MAIN_APP_ID;
        }
        let res2;
        req.query.callback=1;
        getIp(req, res2, (err, geodata) =>{
            const newClient = {
                id: req.params.clientId,
                app_id: app_id,
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
            createLog({ app_id : req.query.app_id,
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
                            null;
            });
            res.on('close', ()=>{
                broadcast_clients = broadcast_clients.filter(client => client.id !== req.params.clientId);
                clearInterval(intervalId);
                res.end();
            })
        })
    },
    getListConnected: (req, res) => {
        getListConnected(req.query.app_id, req.query.limit, req.query.year, req.query.month, 
                         req.query.order_by, req.query.sort,  (err, result) => {
            return res.status(200).json({
                success: 1,
                data: result
            });
        })
    },
    getCountConnected: (req, res) => {
        getCountConnected(req.query.identity_provider_id, req.query.count_logged_in, (err, count_connected) => {
            return res.status(200).json({
                success: 1,
                data: count_connected
            });
        })
    },
    sendBroadcast: (req, res) => {
        sendBroadcast(req.body.app_id, req.body.client_id, req.body.destination_app, 
                      req.body.broadcast_type, req.body.broadcast_message, (err, result) =>{
            return res.status(200).json({
                success: 1
            });
        });
    },
    updateConnected: (req, res) => {
        updateConnected(req.query.client_id, req.query.user_account_id, req.query.identity_provider_id, (err, result) =>{
            return res.status(200).json({
                success: 1
            });
        })
    },
    checkConnected: (req, res) => {
        checkConnected(req.params.user_account_id, (err, result_connected)=>{
            return res.status(200).json({
                online: result_connected
            });
        })
    }
}