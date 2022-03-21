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
        const clientId = Date.now();
        const newClient = {
            id: clientId,
            app_id: req.query.app_id,
            user_agent: req.headers["user-agent"],
            connection_date: new Date().toISOString(),
            ip: req.ip
        };
        broadcast_clients.push(newClient);
        res.on('close', ()=>{
            broadcast_clients = broadcast_clients.filter(client => client.id !== clientId);
            clearInterval(intervalId);
            res.end();
        })
          
    },
    getConnected: (req, res) => {
        return res.status(200).json({
            success: 1,
            data: broadcast_clients
        });
    }
}