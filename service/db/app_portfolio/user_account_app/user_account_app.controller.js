const { createUserAccountApp, getUserAccountApps, getUserAccountApp, updateUserAccountApp, deleteUserAccountApps} = require ("./user_account_app.service");

module.exports = {
	
	createUserAccountApp: (req, res) => {
		createUserAccountApp(req.query.app_id, req.body.user_account_id, (err,results) => {
			if (err) {
				return res.status(500).send(
					err
				);
			}
			return res.status(200).json({
				count: results.changedRows,
				items: Array(results)
			});
		});
	},
	getUserAccountApps: (req, res) => {
		req.params.user_account_id = parseInt(req.params.user_account_id);
		getUserAccountApps(req.query.app_id, req.params.user_account_id, (err,results) => {
			if (err) {
				return res.status(500).send(
					err
				);
			}
			return res.status(200).json({
				count: results.length,
				items: results
			});
		});
	},
	getUserAccountApp: (req, res) => {
		req.params.user_account_id = parseInt(req.params.user_account_id);
		getUserAccountApp(req.query.app_id, req.params.user_account_id, (err,results) => {
			if (err) {
				return res.status(500).send(
					err
				);
			}
			return res.status(200).json({
				items: results
			});
		});
	},
	updateUserAccountApp: (req, res) => {
		req.params.user_account_id = parseInt(req.params.user_account_id);
		updateUserAccountApp(req.query.app_id, req.params.user_account_id, req.body, (err,results) => {
			if (err) {
				return res.status(500).send(
					err
				);
			}
			else
				return res.status(200).json({
					items: results
				});
		});
	},
	deleteUserAccountApps: (req, res) => {
		req.params.user_account_id = parseInt(req.params.user_account_id);
		req.params.app_id = parseInt(req.params.app_id);
		deleteUserAccountApps(req.query.app_id, req.params.user_account_id, req.params.app_id, (err,results) => {
			if (err) {
				return res.status(500).send(
					err
				);
			}
			else
				return res.status(200).send(
					results
				);
		});
	}
}