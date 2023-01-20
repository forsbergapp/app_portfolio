const service = await import("./app_log.service.js");
const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);

function createLog(req, res){
		const body = req.body;
		body.server_remote_addr 		 = req.ip;
		body.server_user_agent 			 = req.headers["user-agent"];
		body.server_http_host 			 = req.headers["host"];
		body.server_http_accept_language = req.headers["accept-language"];	
		if (ConfigGet(1, 'SERVICE_AUTH', 'ENABLE_DBLOG')=='1')
			service.createLog(req.query.app_id, body, (err,results) => {
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
	}
function createLogAdmin(req, res){
		const body = req.body;
		body.server_remote_addr 		 = req.ip;
		body.server_user_agent 			 = req.headers["user-agent"];
		body.server_http_host 			 = req.headers["host"];
		body.server_http_accept_language = req.headers["accept-language"];	
		if (ConfigGet(1, 'SERVICE_AUTH', 'ENABLE_DBLOG')=='1')
			service.createLogAdmin(req.query.app_id, body, (err,results) => {
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
	}
function getLogsAdmin(req, res){
		let year = parseInt(req.query.year);
		let month = parseInt(req.query.month);
		let sort = parseInt(req.query.sort);
		let order_by = req.query.order_by;
		let offset = parseInt(req.query.offset);
		let limit = parseInt(req.query.limit);
		
		service.getLogsAdmin(req.query.app_id, req.query.select_app_id, year, month, sort, order_by, offset, limit, (err, results) =>{
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
					import(`file://${process.cwd()}/service/db/common/common.service.js`).then(function({record_not_found}){
						return record_not_found(req.query.app_id, req.query.lang_code);
					})
				}
			}
		});
	}
function getStatUniqueVisitorAdmin(req, res){
		if (req.query.select_app_id=='')
			req.query.select_app_id = null;
		else
			req.query.select_app_id = parseInt(req.query.select_app_id);
		req.query.statchoice = parseInt(req.query.statchoice);
		req.query.year = parseInt(req.query.year);
		req.query.month = parseInt(req.query.month);
		service.getStatUniqueVisitorAdmin(req.query.app_id, req.query.select_app_id, req.query.statchoice, req.query.year, req.query.month,  (err, results)=>{
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
					import(`file://${process.cwd()}/service/db/common/common.service.js`).then(function({record_not_found}){
						return record_not_found(req.query.app_id, req.query.lang_code);
					})
				}
			}
		})
	}
export{createLog, createLogAdmin, getLogsAdmin, getStatUniqueVisitorAdmin}