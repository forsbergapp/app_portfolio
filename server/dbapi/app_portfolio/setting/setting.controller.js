const service = await import("./setting.service.js");

const getSettings = (req, res) => {
	service.getSettings(req.query.app_id, req.query.lang_code, req.query.setting_type, (err, results) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			settings: results
		});
	});
}
export{getSettings};