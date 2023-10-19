const service = await import('./user_account_app_setting_view.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

const insertUserSettingView = (req, res) => {
    const data = {  client_ip:          req.ip,
                    client_user_agent:  req.headers['user-agent'],
                    client_longitude:   req.body.client_longitude,
                    client_latitude:    req.body.client_latitude,
                    user_account_id:    getNumberValue(req.body.user_account_id),
                    user_setting_id:    getNumberValue(req.body.user_setting_id)};
    service.insertUserSettingView(getNumberValue(req.query.app_id), data, (err,results) => {
        if (err) {
            return res.status(500).send(
                err
            );
        }
        return res.status(200).json({
            count: results.affectedRows,
            items: Array(results)
        });
    });
};
export{insertUserSettingView};