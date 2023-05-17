const service = await import('./app_category.service.js');

const getAppCategoryAdmin = (req, res) => {
	service.getAppCategoryAdmin(req.query.app_id, req.query.id, req.query.lang_code, (err, results) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: results
		});
	});
}
export{getAppCategoryAdmin}