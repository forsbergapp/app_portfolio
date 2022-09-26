const { getThemes } = require ("./app2_theme.service");

module.exports = {
	getThemes: (req, res) => {
		getThemes(req.query.app_id,(err, results) =>{
			if (err) {
				return res.status(500).send({
					data: err
				});
			}
			return res.status(200).json({
				themes: results
			});
		});
	}
}