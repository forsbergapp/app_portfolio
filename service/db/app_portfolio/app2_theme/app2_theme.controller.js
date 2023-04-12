const sercice = await import("./app2_theme.service.js");

const getThemes = (req, res) => {
	service.getThemes(req.query.app_id,(err, results) =>{
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
export{getThemes};