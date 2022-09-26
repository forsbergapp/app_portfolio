const { getPlace } = require ("./app2_place.service");

module.exports = {
	getPlace: (req, res) => {
		getPlace(req.query.app_id, (err, results) =>{
			if (err) {
				return res.status(500).send({
					data: err
				});
			}
			return res.status(200).json({
				places: results
			});
		});
	}
}