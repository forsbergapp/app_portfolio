const service = await import('./log.service.js');
const getLogParameters = (req, res) => {
	service.getLogParameters(req.query_app_id, (err, results) =>{
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
	service.getLogs(req.query_app_id, req.query, (err, results) =>{
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
	service.getFiles(req.query_app_id, (err, results) =>{
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
export {getLogParameters,getLogs, getFiles};