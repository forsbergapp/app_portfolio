const { getThemes } = require ("./app_timetables_theme.service");

module.exports = {
	getThemes: (req, res) => {
		getThemes(req.query.app_id,(err, results) =>{
			if (err) {
				console.log(err);
				return res.status(500).send({
					success: 0,
					data: err
				});
			}
			return res.status(200).json({
				success: 1,
				themes: results
			});
		});
	}
}