const { getPlace } = require ("./app1_place.service");

module.exports = {
	getPlace: (req, res) => {
		getPlace(req.query.app_id, (err, results) =>{
			if (err) {
				return res.status(500).send({
					success: 0,
					data: err
				});
			}
			return res.status(200).json({
				success: 1,
				places: results
			});
		});
	}
}