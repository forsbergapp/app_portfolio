global.broadcast_clients = [];
const { createLog} = require ("../../service/db/api/app_log/app_log.service");
function app_log(app_id, app_module_type, request, result, app_user_id,
				 user_language, user_timezone,user_number_system,user_platform,
				 server_remote_addr, server_user_agent, server_http_host,server_http_accept_language,
				 client_latitude,client_longitude){
    const logData ={
        app_id : app_id,
        app_module : 'BROADCAST',
        app_module_type : app_module_type,
        app_module_request : request,
        app_module_result : result,
        app_user_id : app_user_id,
        user_language : user_language,
        user_timezone : user_timezone,
        user_number_system : user_number_system,
        user_platform : user_platform,
        server_remote_addr : server_remote_addr,
        server_user_agent : server_user_agent,
        server_http_host : server_http_host,
        server_http_accept_language : server_http_accept_language,
        client_latitude : client_latitude,
        client_longitude : client_longitude
    }
    createLog(logData, (err,results)  => {
        null;
    }); 
}
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
                    const {createLogAppSE} = require("../log/log.service");
                    createLogAppSE(process.env.MAIN_APP_ID, __appfilename, __appfunction, __appline, err);
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
                response: res
            };
            broadcast_clients.push(newClient);
            app_log(req.query.app_id,
                    'CONNECT',
                    req.originalUrl,
                    JSON.stringify(geodata),
                    req.query.user_account_id,
                    null,
                    null,
                    null,
                    null,
                    req.ip,
                    req.headers["user-agent"],
                    req.headers["host"],
                    req.headers["accept-language"],
                    geodata.geoplugin_latitude,
                    geodata.geoplugin_longitude);
            res.on('close', ()=>{
                broadcast_clients = broadcast_clients.filter(client => client.id !== req.params.clientId);
                clearInterval(intervalId);
                res.end();
            })
        })
    },
    getListConnected: (req, res) => {
        let broadcast_clients_no_res = [];
        let i=0;
        broadcast_clients.forEach(client=>{
            if (client.app_id == req.query.app_id || req.query.app_id == ''){
                i++;
                let copyClient;
                if (typeof req.query.limit=='undefined' || (typeof req.query.limit!='undefined' && i<=req.query.limit)){
                    //connection date in ISO8601 format: "yyyy'-'MM'-'dd'T'HH':'mm':'ss'Z'"
                    //return selected year and month
                    if (parseInt(client.connection_date.substring(0,4)) == parseInt(req.query.year) && 
                        parseInt(client.connection_date.substring(6,7)) == parseInt(req.query.month)){
                            copyClient = {
                                id: client.id,
                                app_id: client.app_id,
                                user_account_id: client.user_account_id,
                                user_agent: client.user_agent,
                                connection_date: client.connection_date,
                                ip: client.ip,
                                gps_latitude: client.gps_latitude,
                                gps_longitude: client.gps_longitude
                            };
                            broadcast_clients_no_res.push(copyClient);
                        }
                }
            }
        })
        function sortByProperty(property, order_by){
            return function(a,b){  
               if(a[property] > b[property])  
                  return 1 * order_by;
               else if(a[property] < b[property])  
                  return -1 * order_by;
           
               return 0;  
            }  
        }
        let column_sort;
        let order_by;
        if (req.query.order_by =='asc')
            order_by = 1;
        else   
            order_by = -1;
        switch (parseInt(req.query.sort)){
            case 1:{
                column_sort = 'id';
                break;
            }
            case 2:{
                column_sort = 'app_id';
                break;
            }
            case 3:{
                column_sort = 'user_account_id';
                break;
            }
            case 4:{
                column_sort = 'user_agent';
                break;
            }
            case 5:{
                column_sort = 'connection_date';
                break;
            }
            case 6:{
                column_sort = 'ip';
                break;
            }
            case 7:{
                column_sort = 'gps_latitude';
                break;
            }
            case 8:{
                column_sort = 'gps_longitude';
                break;
            }
            default:{
                column_sort = 'connection_date';
            }
        }
        broadcast_clients_no_res.sort(sortByProperty(column_sort, order_by))
        return res.status(200).json({
            success: 1,
            data: broadcast_clients_no_res
        });
    },
    sendBroadcast: (req, res) => {
        let broadcast;
        if (req.body.destination_app ==true){
            //broadcast to all connected to given app_id
            broadcast_clients.forEach(client=>{
                if (client.app_id == req.body.app_id || req.body.app_id == null){
                    broadcast =`{"broadcast_type"   : "${req.body.broadcast_type}", 
                                 "broadcast_message": "${req.body.broadcast_message}"}`;
                    client.response.write (`data: ${btoa(broadcast)}\n\n`);
                }
            })
        }
            
        if (req.body.client_id !==null){
            //broadcast to specific client
            broadcast_clients.forEach(client=>{
                if (client.id == req.body.client_id){
                    broadcast =`{"broadcast_type"   : "${req.body.broadcast_type}", 
                                 "broadcast_message": "${req.body.broadcast_message}"}`;
                    client.response.write (`data: ${btoa(broadcast)}\n\n`);
                    
                }
            })
        }
        return res.status(200).json({
            success: 1
        });
    },
    updateConnected: (req, res) => {
        
        let i=0;
        for (let i = 0; i < broadcast_clients.length; i++){
            if (broadcast_clients[i].id==req.query.client_id){
                broadcast_clients[i].user_account_id = req.query.user_account_id;
                broadcast_clients[i].connection_date = new Date().toISOString();
                return res.status(200).json({
                    success: 1
                });
            }
        }
        return res.status(200).json({
            success: 1
        });
    },
    checkConnected: (req, res) => {
        
        let i=0;
        for (let i = 0; i < broadcast_clients.length; i++){
            if (broadcast_clients[i].user_account_id == req.params.user_account_id){
                return res.status(200).json({
                    online: 1
                });
            }
        }
        return res.status(200).json({
            online: 0
        });
    }
}