const { getParameters, getParameters_server, getParameters_admin, getParameter_admin, setParameter_admin, setParameterValue_admin } = require ("./app_parameter.service");

module.exports = {
	getParameters: (req, res) => {
		getParameters(req.params.app_id, req.query.app_id, (err, results) =>{
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
	getParameters_server: (req, res) => {
		getParameters_server(req.params.app_id, req.query.app_id, (err, results) =>{
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
	getParameters_admin: (req, res) => {
		getParameters_admin(req.params.app_id, (err, results) =>{
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
	getParameter_admin: (req, res) => {
		getParameter_admin(req.params.app_id, req.query.parameter_name, (err, results) =>{
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
	getParameter: (req, res) => {
		getParameter(req.params.app_id, req.query.parameter_name, req.query.app_id, (err, results) =>{
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
	setParameter_admin: (req, res) => {
		setParameter_admin(req.body, (err, results) =>{
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
	setParameterValue_admin: (req, res) => {
		setParameterValue_admin(req.body, (err, results) =>{
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