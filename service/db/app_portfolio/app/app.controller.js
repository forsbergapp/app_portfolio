const { getApp, getAppsAdmin, updateAppAdmin } = require ("./app.service");

module.exports = {
	getApp: (req, res) => {
		getApp(req.query.app_id, req.query.id, req.query.lang_code, (err, results) =>{
			if (err) {
				return res.status(500).send({
					data: err
				});
			}
			return res.status(200).json({
				data: results
			});
		});
	},
	getAppsAdmin: (req, res) => {
		getAppsAdmin(req.query.app_id, req.query.lang_code, (err, results) =>{
			if (err) {
				return res.status(500).send({
					data: err
				});
			}
			return res.status(200).json({
				data: results
			});
		});
	},
	updateAppAdmin: (req, res) => {
		req.params.id = parseInt(req.params.id);
		updateAppAdmin(req.query.app_id, req.params.id, req.body, (err, results) =>{
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
}