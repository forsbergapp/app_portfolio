const { getPlace } = require ("./app_timetables_place.service");

module.exports = {
	getPlace: (req, res) => {
		getPlace((err, results) =>{
			if (err) {
				console.log(err);
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