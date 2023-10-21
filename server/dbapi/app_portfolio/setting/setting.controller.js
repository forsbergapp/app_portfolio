const service = await import('./setting.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

const getSettings = (req, res) => {
	service.getSettings(getNumberValue(req.query.app_id), req.query.lang_code, req.query.setting_type, (err, result) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			settings: result
		});
	});
};
export{getSettings};