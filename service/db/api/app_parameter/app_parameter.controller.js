const { getParameters, getParameter, setParameter } = require ("./app_parameter.service");

module.exports = {
	getParameters: (req, res) => {
		getParameters(req.params.app_id,(err, results) =>{
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
		getParameter(req.params.app_id, req.query.parameter_name, (err, results) =>{
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
	setParameter: (req, res) => {
		setParameter(req.params.app_id, req.body, (err, results) =>{
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