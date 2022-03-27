const { createLog, getLogs, getStatUniqueVisitor } = require ("./app_log.service");

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
		let year = parseInt(req.query.year);
		let month = parseInt(req.query.month);
		let sort = parseInt(req.query.sort);
		let order_by = req.query.order_by;
		let offset = parseInt(req.query.offset);
		let limit = parseInt(req.query.limit);
		
		getLogs(req.query.app_id, year, month, sort, order_by, offset, limit, (err, results) =>{
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
	},
	getStatUniqueVisitor: (req, res) =>{
		getStatUniqueVisitor(req.query.app_id, req.query.statchoice, req.query.year, req.query.month, (err, results)=>{
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
		})
	}
}