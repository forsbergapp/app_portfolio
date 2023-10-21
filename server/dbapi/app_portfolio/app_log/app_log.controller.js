const service = await import('./app_log.service.js');
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);
const getLogsAdmin = (req, res) => {	
	service.getLogsAdmin(getNumberValue(req.query.app_id), getNumberValue(req.query.select_app_id), getNumberValue(req.query.year), getNumberValue(req.query.month), getNumberValue(req.query.sort), req.query.order_by, getNumberValue(req.query.offset), getNumberValue(req.query.limit), (err, result) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		else{
			if (result.length>0)
				return res.status(200).json({
					data: result
				});
			else{
				import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
					return record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
				});
			}
		}
	});
};
const getStatUniqueVisitorAdmin = (req, res) => {
	service.getStatUniqueVisitorAdmin(getNumberValue(req.query.app_id), getNumberValue(req.query.select_app_id), getNumberValue(req.query.year), getNumberValue(req.query.month),  (err, result)=>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		else{
			if (result.length>0)
				return res.status(200).json({
					data: result
				});
			else{
				import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
					return record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
				});
			}
		}
	});
};
export{getLogsAdmin, getStatUniqueVisitorAdmin};