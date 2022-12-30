const { getParameters, getParameters_server, getParametersAllAdmin, setParameter_admin, setParameterValue_admin } = require ("./app_parameter.service");

module.exports = {
	getParameters_server: (req, res) => {
		req.params.app_id = parseInt(req.params.app_id);
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
	getParametersAllAdmin: (req, res) => {
		req.params.app_id = parseInt(req.params.app_id);
		getParametersAllAdmin(req.query.app_id, req.params.app_id, req.query.lang_code, (err, results) =>{
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
	},
	getParametersAdmin: (req, res) => {
		req.params.app_id = parseInt(req.params.app_id);
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
	getParameters: (req, res) => {
		req.params.app_id = parseInt(req.params.app_id);
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
	}

}