const { getParameterTypeAdmin} = require ("./parameter_type.service");

module.exports = {
	getParameterTypeAdmin: (req, res) => {
		if (typeof req.query.id == 'undefined')
			req.query.id = null;
		getParameterTypeAdmin(req.query.app_id, req.query.id, req.query.lang_code, (err, results) =>{
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
	}
}