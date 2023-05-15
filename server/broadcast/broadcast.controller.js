const service = await import('./broadcast.service.js');

const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);

const BroadcastConnect = (req, res) => {
    
    let client_id = Date.now();
    
    service.ClientConnect(res);
    service.ClientOnClose(res, client_id);
    const newClient = {
        id: client_id,
        app_id: req.query.app_id,
        user_account_id: req.query.user_account_logon_user_account_id ?? null,
        system_admin: req.query.system_admin=='null'?'':req.query.system_admin,
        user_agent: req.headers["user-agent"],
        connection_date: new Date().toISOString(),
        ip: req.ip,
        gps_latitude: req.query.latitude,
        gps_longitude: req.query.longitude,
        identity_provider_id: req.query.identity_provider_id,
        response: res
    };
    service.ClientAdd(newClient);
    service.ClientSend(res, `{\\"client_id\\": ${client_id}}`, 'CONNECTINFO');
}
const BroadcastSendSystemAdmin = (req, res) => {
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
const BroadcastSendAdmin = (req, res) => {
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
const ConnectedList = (req, res) => {
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
                import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db/common/common.service.js`).then(({record_not_found}) => {
                    return record_not_found(res, req.query.app_id, req.query.lang_code);
                })
            }
        }
    })
}
const ConnectedListSystemAdmin = (req, res) => {
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
const ConnectedCount = (req, res) => {
    service.ConnectedCount(req.query.identity_provider_id, req.query.count_logged_in, (err, count_connected) => {
        return res.status(200).json({
            data: count_connected
        });
    })
}
const ConnectedUpdate = (req, res) => {
    service.ConnectedUpdate(req.query.client_id, req.query.user_account_logon_user_account_id, req.query.system_admin, req.query.identity_provider_id, 
                            req.query.latitude, req.query.longitude,
                            (err, result) =>{
        return res.status(200).json(
            err ?? result
        );
    })
}
const ConnectedCheck = (req, res) => {
    req.params.user_account_id = parseInt(req.params.user_account_id);
    service.ConnectedCheck(req.params.user_account_id, (err, result_connected)=>{
        return res.status(200).json({
            online: result_connected
        });
    })
}
export {BroadcastConnect, BroadcastSendSystemAdmin, BroadcastSendAdmin, 
        ConnectedList, ConnectedListSystemAdmin, ConnectedCount, ConnectedUpdate, ConnectedCheck}