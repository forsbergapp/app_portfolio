const { createUserAccountApp} = require ("./user_account_app.service");

module.exports = {
	
	createUserAccountApp: (req, res) => {
		createUserAccountApp(req.body.app_id, req.body.user_account_id, (err,results) => {
			if (err) {
				return res.status(500).send(
					err
				);
			}
			return res.status(200).json({
				count: results.changedRows,
				success: 1,
				items: Array(results)
			});
		});
	}
}