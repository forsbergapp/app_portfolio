const { getObjects } = require ("./app_object.service");

module.exports = {
	getObjects: (req, res) => {
		var lang_code = req.params.lang_code;
		var app_id = req.query.app_id; 
		getObjects(app_id, lang_code, (err, results) =>{
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