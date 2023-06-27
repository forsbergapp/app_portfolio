const service = await import('./app_role.service.js');

const getAppRoleAdmin = (req, res) => {
	service.getAppRoleAdmin(req.query.app_id, req.query.id, (err, results) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: results
		});
	});
};
export{getAppRoleAdmin};