const service = await import('./app.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

const getApp = (req, res) => {
	service.getApp(getNumberValue(req.query.app_id), getNumberValue(req.query.id), req.query.lang_code, (err, results) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: results
		});
	});
};
const getAppsAdmin = (req, res) => {
	service.getAppsAdmin(getNumberValue(req.query.app_id), req.query.lang_code, (err, results) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: results
		});
	});
};
const updateAppAdmin = (req, res) => {
	service.updateAppAdmin(getNumberValue(req.query.app_id), getNumberValue(req.params.id), req.body, (err, results) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: results
		});
	});
};
export{getApp, getAppsAdmin, updateAppAdmin};