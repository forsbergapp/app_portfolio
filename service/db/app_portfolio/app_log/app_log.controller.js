const {ConfigGet} = require(global.SERVER_ROOT + '/server/server.service');
const { createLog, createLogAdmin, getLogsAdmin, getStatUniqueVisitorAdmin } = require ("./app_log.service");

module.exports = {
	createLog: (req, res) =>{
		const body = req.body;
		body.server_remote_addr 		 = req.ip;
		body.server_user_agent 			 = req.headers["user-agent"];
		body.server_http_host 			 = req.headers["host"];
		body.server_http_accept_language = req.headers["accept-language"];	
		if (ConfigGet(1, 'SERVICE_AUTH', 'ENABLE_DBLOG')==1)
			createLog(req.query.app_id, body, (err,results) => {
				if (err)
					return res.status(500).send({
						message: err
					});
				else
					return res.status(200).json({
						data: results
					})
			});
		else
			return res.status(200).json({
				data: null
			})
	},
	createLogAdmin: (req, res) =>{
		const body = req.body;
		body.server_remote_addr 		 = req.ip;
		body.server_user_agent 			 = req.headers["user-agent"];
		body.server_http_host 			 = req.headers["host"];
		body.server_http_accept_language = req.headers["accept-language"];	
		if (ConfigGet(1, 'SERVICE_AUTH', 'ENABLE_DBLOG')==1)
			createLogAdmin(req.query.app_id, body, (err,results) => {
				if (err)
					return res.status(500).send({
						message: err
					});
				else
					return res.status(200).json({
						data: results
					})
			});
		else
			return res.status(200).json({
				data: null
			})
	},
	getLogsAdmin: (req, res) => {
		let year = parseInt(req.query.year);
		let month = parseInt(req.query.month);
		let sort = parseInt(req.query.sort);
		let order_by = req.query.order_by;
		let offset = parseInt(req.query.offset);
		let limit = parseInt(req.query.limit);
		
		getLogsAdmin(req.query.app_id, req.query.select_app_id, year, month, sort, order_by, offset, limit, (err, results) =>{
			if (err) {
				return res.status(500).send({
					data: err
				});
			}
			else{
				if (results.length>0)
					return res.status(200).json({
						data: results
					});
				else{
					const { getMessage_admin } = require(global.SERVER_ROOT + ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH') +"/message_translation/message_translation.service");
					//Record not found
					getMessage_admin(req.query.app_id, 
									 ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'),
									 20400, 
									 req.query.lang_code, (err,result_message)  => {
											return res.status(404).send(
													err ?? result_message.text
											);
									 });
				}
			}
		});
	},
	getStatUniqueVisitorAdmin: (req, res) =>{
		getStatUniqueVisitorAdmin(req.query.app_id, req.query.select_app_id, req.query.statchoice, req.query.year, req.query.month,  (err, results)=>{
			if (err) {
				return res.status(500).send({
					data: err
				});
			}
			else{
				if (results.length>0)
					return res.status(200).json({
						data: results
					});
				else{
					const { getMessage_admin } = require(global.SERVER_ROOT + ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH') +"/message_translation/message_translation.service");
					//Record not found
					getMessage_admin(req.query.app_id,
									 ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'),
									 20400,
									 req.query.lang_code, (err,result_message)  => {
										return res.status(404).send(
												err ?? result_message.text
										);
									 });
				}
			}
		})
	}
}