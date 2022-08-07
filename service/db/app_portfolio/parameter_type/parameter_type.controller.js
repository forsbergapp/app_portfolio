const { getParameterType} = require ("./parameter_type.service");

module.exports = {
	getParameterType: (req, res) => {
		if (typeof req.query.id == 'undefined')
			req.query.id = null;
		getParameterType(req.query.id,(err, results) =>{
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