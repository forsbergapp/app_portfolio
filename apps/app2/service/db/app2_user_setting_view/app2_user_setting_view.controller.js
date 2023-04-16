const service = await import("./app2_user_setting_view.service.js");

const insertUserSettingView = (req, res) => {
    req.body.client_ip = req.ip;
    req.body.client_user_agent = req.headers["user-agent"];
    service.insertUserSettingView(req.query.app_id, req.body, (err,results) => {
        if (err) {
            return res.status(500).send(
                err
            );
        }
        return res.status(200).json({
            count: results.changedRows,
            items: Array(results)
        });
    });
}
export{insertUserSettingView};