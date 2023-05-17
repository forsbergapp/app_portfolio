const service = await import('./app.service.js');

const getApp = (req, res) => {
	service.getApp(req.query.app_id, req.query.id, req.query.lang_code, (err, results) =>{
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
const getAppsAdmin = (req, res) => {
	service.getAppsAdmin(req.query.app_id, req.query.lang_code, (err, results) =>{
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
const updateAppAdmin = (req, res) => {
	req.params.id = parseInt(req.params.id);
	service.updateAppAdmin(req.query.app_id, req.params.id, req.body, (err, results) =>{
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
export{getApp, getAppsAdmin, updateAppAdmin}