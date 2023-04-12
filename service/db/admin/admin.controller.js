const service = await import('./admin.service.js');

const DBInfo = (req, res) => {
	service.DBInfo(req.query.app_id, (err, results) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: results
		});
	});
}
const DBInfoSpace = (req, res) => {
	service.DBInfoSpace(req.query.app_id, (err, results) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: results
		});
	});
}
const DBInfoSpaceSum = (req, res) => {
	service.DBInfoSpaceSum(req.query.app_id, (err, results) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: results
		});
	});
}
const DBStart = async (req, res, callBack) => {
	service.DBStart(req.query.app_id, (err, results) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: results
		});
	});
}
const DBStop = (req, res) => {
	service.DBStop(req.query.app_id, (err, results) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: results
		});
	});
}

export{DBInfo, DBInfoSpace, DBInfoSpaceSum, DBStart, DBStop}