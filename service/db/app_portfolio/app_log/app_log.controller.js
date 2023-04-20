const service = await import("./app_log.service.js");

const getLogsAdmin = (req, res) => {
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
				import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db/common/common.service.js`).then(({record_not_found}) => {
					return record_not_found(res, req.query.app_id, req.query.lang_code);
				})
			}
		}
	});
}
const getStatUniqueVisitorAdmin = (req, res) => {
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
				import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db/common/common.service.js`).then(({record_not_found}) => {
					return record_not_found(res, req.query.app_id, req.query.lang_code);
				})
			}
		}
	})
}
export{getLogsAdmin, getStatUniqueVisitorAdmin}