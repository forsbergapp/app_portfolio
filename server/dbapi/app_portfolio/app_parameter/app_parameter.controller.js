const service = await import('./app_parameter.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

const getParameters_server = (req, res) => {
	service.getParameters_server(getNumberValue(req.query.app_id), getNumberValue(req.params.app_id), (err, result) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: result
		});
	});
};
const getParametersAllAdmin = (req, res) => {
	service.getParametersAllAdmin(getNumberValue(req.query.app_id), getNumberValue(req.params.app_id), req.query.lang_code, (err, result) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: result
		});
	});
};
const setParameter_admin = (req, res) => {
	const data = {	parameter_type_id: 	req.body.parameter_type_id,
					parameter_value: 	req.body.parameter_value, 
					parameter_comment: 	req.body.parameter_comment,
					app_id: 			getNumberValue(req.body.app_id),
					parameter_name: 	req.body.parameter_name};
	service.setParameter_admin(getNumberValue(req.query.app_id), data, (err, result) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: result
		});
	});
};
const setParameterValue_admin = (req, res) => {
	const data = {	app_id: 			getNumberValue(req.body.app_id),
					parameter_value: 	req.body.parameter_value,
					parameter_name: 	req.body.parameter_name};
	service.setParameterValue_admin(getNumberValue(req.query.app_id), data, (err, result) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: result
		});
	});
};
export{getParameters_server, getParametersAllAdmin, setParameter_admin, setParameterValue_admin};