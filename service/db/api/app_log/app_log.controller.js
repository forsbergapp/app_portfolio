const { createLog, getLogs } = require ("./app_log.service");

module.exports = {
	createLog: (req, res) =>{
		const body = req.body;
		body.server_remote_addr 		 = req.ip;
		body.server_user_agent 			 = req.headers["user-agent"];
		body.server_http_host 			 = req.headers["host"];
		body.server_http_accept_language = req.headers["accept-language"];	
		createLog(body, (err,results) => {
			if (err) {
				return res.status(500).send({
					success:0,
					message: err
				});
			}
			return res.status(200).json({
				success: 1,
				data: results
			})
		});
	},
	getLogs: (req, res) => {
		getLogs((err, results) =>{
			if (err) {
				return res.status(500).send({
					success: 0,
					data: err
				});
			}
			return res.status(200).json({
				success: 1,
				data: results
			});
		});
	}
}