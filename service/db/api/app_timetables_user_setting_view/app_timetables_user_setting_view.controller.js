const { insertUserSettingView} = require ("./app_timetables_user_setting_view.service");

module.exports = {

    insertUserSettingView: (req, res) => {
		req.body.client_ip = req.ip;
		req.body.client_user_agent = req.headers["user-agent"];
        insertUserSettingView(req.query.app_id, req.body, (err,results) => {
            if (err) {
                return res.status(500).send(
                    err
                );
            }
            return res.status(200).json({
                count: results.changedRows,
                success: 1,
                items: Array(results)
            });
        });
    }
}