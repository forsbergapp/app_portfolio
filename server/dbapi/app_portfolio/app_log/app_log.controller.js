const service = await import('./app_log.service.js');

const getLogsAdmin = (req, res) => {
	const year = parseInt(req.query.year);
	const month = parseInt(req.query.month);
	const sort = parseInt(req.query.sort);
	const order_by = req.query.order_by;
	const offset = parseInt(req.query.offset);
	const limit = parseInt(req.query.limit);
	
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
				import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
					return record_not_found(res, req.query.app_id, req.query.lang_code);
				});
			}
		}
	});
};
const getStatUniqueVisitorAdmin = (req, res) => {
	if (req.query.select_app_id=='')
		req.query.select_app_id = null;
	else
		req.query.select_app_id = parseInt(req.query.select_app_id);
	req.query.year = parseInt(req.query.year);
	req.query.month = parseInt(req.query.month);
	service.getStatUniqueVisitorAdmin(req.query.app_id, req.query.select_app_id, req.query.year, req.query.month,  (err, results)=>{
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
				import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
					return record_not_found(res, req.query.app_id, req.query.lang_code);
				});
			}
		}
	});
};
export{getLogsAdmin, getStatUniqueVisitorAdmin};