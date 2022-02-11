const { getParameters } = require ("./app_parameter.service");

module.exports = {
	getParameters: (req, res) => {
		getParameters(req.params.app_id,(err, results) =>{
			if (err) {
				console.log(err);
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