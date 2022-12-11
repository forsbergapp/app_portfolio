const { getUserAccountLogonAdmin } = require ("./user_account_logon.service");

module.exports = {
	getUserAccountLogonAdmin: (req, res) => {
		getUserAccountLogonAdmin(req.query.app_id, req.params.user_account_id, req.params.app_id, (err, results) =>{
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