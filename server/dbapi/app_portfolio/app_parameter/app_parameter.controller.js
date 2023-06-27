const service = await import('./app_parameter.service.js');

const getParameters_server = (req, res) => {
	req.params.app_id = parseInt(req.params.app_id);
	service.getParameters_server(req.query.app_id, req.params.app_id, (err, results) =>{
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
const getParametersAllAdmin = (req, res) => {
	req.params.app_id = parseInt(req.params.app_id);
	service.getParametersAllAdmin(req.query.app_id, req.params.app_id, req.query.lang_code, (err, results) =>{
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
const setParameter_admin = (req, res) => {
	service.setParameter_admin(req.query.app_id, req.body, (err, results) =>{
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
const setParameterValue_admin = (req, res) => {
	service.setParameterValue_admin(req.query.app_id, req.body, (err, results) =>{
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
const getParametersAdmin = (req, res) => {
	req.params.app_id = parseInt(req.params.app_id);
	service.getParameters(req.query.app_id, req.params.app_id, (err, results) =>{
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
const getParameters = (req, res) => {
	req.params.app_id = parseInt(req.params.app_id);
	service.getParameters(req.query.app_id, req.params.app_id, (err, results) =>{
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
export{getParameters_server, getParametersAllAdmin, setParameter_admin, setParameterValue_admin, getParametersAdmin, getParameters};