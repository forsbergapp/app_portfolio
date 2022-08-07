const { getObjects } = require ("./app_object.service");

module.exports = {
	getObjects: (req, res) => {
		getObjects(req.query.app_id, req.params.lang_code, (err, results) =>{
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