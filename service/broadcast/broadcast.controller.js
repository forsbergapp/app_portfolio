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
                                          "broadcast_message":"Maintenance, connected:" + clients.length};
                        res.write (`data: ${btoa(JSON.stringify(broadcast))}\n\n`);
                    }
                }
            })
        }, 5000);
        const clientId = Date.now();
        const newClient = {
            id: clientId,
            res
        };
        clients.push(newClient);
        res.on('close', ()=>{
            clients = clients.filter(client => client.id !== clientId);
            clearInterval(intervalId);
            res.end();
        })
          
    }
}