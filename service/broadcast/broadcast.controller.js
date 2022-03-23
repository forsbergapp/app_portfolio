global.broadcast_clients = [];
module.exports = {
	getBroadcast: (req, res) => {
        res.setHeader('Content-type', 'text/event-stream');
        const intervalId = setInterval(() => {
            const { getParameter } = require ("../db/api/app_parameter/app_parameter.service");
            getParameter(process.env.APP0_ID,'SERVER_MAINTENANCE', (err, db_SERVER_MAINTENANCE)=>{
                if (err){
                    const {createLogAppSE} = require("../log/log.service");
                    createLogAppSE(process.env.APP0_ID, __appfilename, __appfunction, __appline, err);
                }
                else{
                    if (db_SERVER_MAINTENANCE==1){
                        const broadcast ={"broadcast_type" :"MAINTENANCE", 
                                          "broadcast_message":"Maintenance, connected:" + broadcast_clients.length};
                        res.write (`data: ${btoa(JSON.stringify(broadcast))}\n\n`);
                    }
                }
            })
        }, 5000);
        const { getIp} = require ("../geolocation/geolocation.controller");
        req.query.app_user_id ='';
        let app_id = req.query.app_id;
        if (req.query.app_id ==''){
            //use APP0_ID to use in log if this is called from admin without app_id
            req.query.app_id = process.env.APP0_ID;
        }
        let res2;
        getIp(req, res2, (err, geodata) =>{
            const clientId = Date.now();
            const newClient = {
                id: clientId,
                app_id: app_id,
                user_agent: req.headers["user-agent"],
                connection_date: new Date().toISOString(),
                ip: req.ip,
                gps_latitude: geodata.geoplugin_latitude,
                gps_longitude: geodata.geoplugin_longitude,
                response: res
            };
            broadcast_clients.push(newClient);
            res.on('close', ()=>{
                broadcast_clients = broadcast_clients.filter(client => client.id !== clientId);
                clearInterval(intervalId);
                res.end();
            })
        })
    },
    getConnected: (req, res) => {
        let broadcast_clients_no_res = [];
        broadcast_clients.forEach(client=>{
            if (client.app_id == req.query.app_id || req.query.app_id == ''){
                const copyClient = {
                    id: client.id,
                    app_id: client.app_id,
                    user_agent: client.user_agent,
                    connection_date: client.connection_date,
                    ip: client.ip,
                    gps_latitude: client.gps_latitude,
                    gps_longitude: client.gps_longitude
                };
                broadcast_clients_no_res.push(copyClient);
            }
        })
        return res.status(200).json({
            success: 1,
            data: broadcast_clients_no_res
        });
    },
    sendBroadcast: (req, res) => {
        if (req.body.app_id !==''){
            //broadcast to all connected to given app_id
            broadcast_clients.forEach(client=>{
                if (client.app_id == req.body.app_id){
                    const broadcast ={"broadcast_type" :"INFO", 
                                      "broadcast_message":`App ${req.body.app_id} only message, connected:` + broadcast_clients.length};
                    client.response.write (`data: ${btoa(JSON.stringify(broadcast))}\n\n`);
                }
            })
        }
            
        if (req.body.clientId !==''){
            //broadcast to specific client
            broadcast_clients.forEach(client=>{
                if (client.clientId == req.body.clientId){
                    const broadcast ={"broadcast_type" :"INFO", 
                                      "broadcast_message":"Client message, connected:" + broadcast_clients.length};
                    client.response.write (`data: ${btoa(JSON.stringify(broadcast))}\n\n`);
                    return res.status(200).json({
                        success: 1
                    });
                }
            })
        }
        return res.status(200).json({
            success: 1
        });           
    }
}