const service = await import('./parameter_type.service.js');

const getParameterTypeAdmin = (req, res) => {
	if (typeof req.query.id == 'undefined')
		req.query.id = null;
	service.getParameterTypeAdmin(req.query.app_id, req.query.id, req.query.lang_code, (err, results) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		else
			return res.status(200).json({
				data: results
			});
	});
};
export{getParameterTypeAdmin};