const { getApp, getAppsAdmin, updateApp } = require ("./app.service");

module.exports = {
	getApp: (req, res) => {
		const id = req.query.id;
		getApp(id, (err, results) =>{
			if (err) {
				return res.status(500).send({
					success: 0,
					data: err
				});
			}
			return res.status(200).json({
				success: 1,
				data: results
			});
		});
	},
	getAppsAdmin: (req, res) => {
		const id = req.query.id;
		getAppsAdmin(id, (err, results) =>{
			if (err) {
				return res.status(500).send({
					success: 0,
					data: err
				});
			}
			return res.status(200).json({
				success: 1,
				data: results
			});
		});
	},
	updateApp: (req, res) => {
		updateApp(req.params.id, req.body, (err, results) =>{
			if (err) {
				return res.status(500).send({
					success: 0,
					data: err
				});
			}
			return res.status(200).json({
				success: 1,
				data: results
			});
		});
	}
}