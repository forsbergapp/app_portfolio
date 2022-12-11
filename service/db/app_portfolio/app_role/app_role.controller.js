const { getAppRoleAdmin } = require ("./app_role.service");

module.exports = {
	getAppRoleAdmin: (req, res) => {
		getAppRoleAdmin(req.query.app_id, req.query.id, req.query.lang_code, (err, results) =>{
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
}