const service = await import('./app_category.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

const getAppCategoryAdmin = (req, res) => {
	service.getAppCategoryAdmin(getNumberValue(req.query.app_id), getNumberValue(req.query.id), req.query.lang_code, (err, result) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: result
		});
	});
};
export{getAppCategoryAdmin};