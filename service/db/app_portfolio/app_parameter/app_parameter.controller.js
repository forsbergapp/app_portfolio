const { getParameters, getParameters_server, getParameters_admin, getParameter_admin, setParameter_admin, setParameterValue_admin } = require ("./app_parameter.service");

module.exports = {
	getParameters: (req, res) => {
		getParameters(req.query.app_id, req.params.app_id, (err, results) =>{
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
	getParameters_server: (req, res) => {
		getParameters_server(req.query.app_id, req.params.app_id, (err, results) =>{
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
	getParameters_admin: (req, res) => {
		getParameters_admin(req.query.app_id, req.params.app_id, req.query.lang_code, (err, results) =>{
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
	getParameter_admin: (req, res) => {
		getParameter_admin(req.query.app_id, req.params.app_id, req.query.parameter_name, (err, results) =>{
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
	getParameter: (req, res) => {
		getParameter(req.query.app_id, req.params.app_id, req.query.parameter_name, (err, results) =>{
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
	setParameter_admin: (req, res) => {
		setParameter_admin(req.query.app_id, req.body, (err, results) =>{
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
	setParameterValue_admin: (req, res) => {
		setParameterValue_admin(req.query.app_id, req.body, (err, results) =>{
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