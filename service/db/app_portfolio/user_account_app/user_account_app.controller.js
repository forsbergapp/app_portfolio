const { createUserAccountApp, getUserAccountApps, getUserAccountApp, updateUserAccountApp, deleteUserAccountApps} = require ("./user_account_app.service");

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
	},
	getUserAccountApps: (req, res) => {
		getUserAccountApps(req.query.app_id, req.params.user_account_id, (err,results) => {
			if (err) {
				return res.status(500).send(
					err
				);
			}
			return res.status(200).json({
				count: results.length,
				success: 1,
				items: results
			});
		});
	},
	getUserAccountApp: (req, res) => {
		getUserAccountApp(req.query.app_id, req.params.user_account_id, (err,results) => {
			if (err) {
				return res.status(500).send(
					err
				);
			}
			return res.status(200).json({
				success: 1,
				items: results
			});
		});
	},
	updateUserAccountApp: (req, res) => {
		updateUserAccountApp(req.query.app_id, req.params.user_account_id, req.body, (err,results) => {
			if (err) {
				return res.status(500).send(
					err
				);
			}
			return res.status(200).json({
				success: 1,
				items: results
			});
		});
	},
	deleteUserAccountApps: (req, res) => {
		deleteUserAccountApps(req.query.app_id, req.params.user_account_id, req.params.app_id, (err,results) => {
			if (err) {
				return res.status(500).send(
					err
				);
			}
			return res.status(200).json({
				success: 1
			});
		});
	}
}