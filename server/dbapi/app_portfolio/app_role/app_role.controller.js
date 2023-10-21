const service = await import('./app_role.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

const getAppRoleAdmin = (req, res) => {
	service.getAppRoleAdmin(getNumberValue(req.query.app_id), getNumberValue(req.query.id), (err, result) =>{
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
export{getAppRoleAdmin};