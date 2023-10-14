const service = await import('./log.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

const getLogParameters = (req, res) => {
	service.getLogParameters(getNumberValue(req.query_app_id), (err, results) =>{
		if (err)
			return res.status(500).send({
				data: err
			});
		else
			return res.status(200).json({
				data: results
			});
	});
};
const getLogs = (req, res) => {
	const data = {	app_id:			getNumberValue(req.query.app_id),
					select_app_id:	getNumberValue(req.query.select_app_id),
					logscope:		req.query.logscope,
					loglevel:		req.query.loglevel,
					search:			req.query.search,
					sort:			req.query.sort,
					order_by:		req.query.order_by,
					year: 			getNumberValue(req.query.year),
					month:			getNumberValue(req.query.month),
					day:			getNumberValue(req.query.day),
					};
	service.getLogs(getNumberValue(req.query_app_id), data, (err, results) =>{
		if (err)
			return res.status(500).send(
				err
			);
		else{
			if (results.length>0)
				return res.status(200).json({
					data: results
				});
			else{
				return res.status(404).send(
					'Record not found'
				);
			}
		}
	});
};
const getStatusCodes = async (req, res) =>{
	const status_codes = await service.getStatusCodes();
	service.getStatusCodes().then(()=>{
		return res.status(200).json({
			status_codes: status_codes
		});
	});

};
const getLogsStats = async (req, res) => {
	const data = {	code:			getNumberValue(req.query.code),
					year: 			getNumberValue(req.query.year),
					month:			getNumberValue(req.query.month)
					};
	service.getLogsStats(getNumberValue(req.query_app_id), data, (err, results) =>{
		if (err)
			return res.status(500).send(
				err
			);
		else{
			if (results.length>0)
				return res.status(200).json({
					data: results
				});
			else{
				return res.status(404).send(
					'Record not found'
				);
			}
		}
	});
};
const getFiles = (req, res) => {
	service.getFiles(getNumberValue(req.query_app_id), (err, results) =>{
		if (err)
			return res.status(500).send(
				err
			);
		else{
			if (results.length>0)
				return res.status(200).json({
					data: results
				});
			else{
				return res.status(404).send(
					'Record not found'
				);
			}
		}
	});
};
export {getLogParameters,getLogs, getStatusCodes, getLogsStats, getFiles};