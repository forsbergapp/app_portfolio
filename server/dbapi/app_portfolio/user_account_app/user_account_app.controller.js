const service = await import("./user_account_app.service.js");

const createUserAccountApp = (req, res) => {
	service.createUserAccountApp(req.query.app_id, req.body.user_account_id, (err,results) => {
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
}
const getUserAccountApps = (req, res) => {
	req.params.user_account_id = parseInt(req.params.user_account_id);
	service.getUserAccountApps(req.query.app_id, req.params.user_account_id, (err,results) => {
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
}
const getUserAccountApp = (req, res) => {
	req.params.user_account_id = parseInt(req.params.user_account_id);
	service.getUserAccountApp(req.query.app_id, req.params.user_account_id, (err,results) => {
		if (err) {
			return res.status(500).send(
				err
			);
		}
		return res.status(200).json({
			items: results
		});
	});
}
const updateUserAccountApp = (req, res) => {
	req.params.user_account_id = parseInt(req.params.user_account_id);
	service.updateUserAccountApp(req.query.app_id, req.params.user_account_id, req.body, (err,results) => {
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
}
const deleteUserAccountApps = (req, res) => {
	req.params.user_account_id = parseInt(req.params.user_account_id);
	req.params.app_id = parseInt(req.params.app_id);
	service.deleteUserAccountApps(req.query.app_id, req.params.user_account_id, req.params.app_id, (err,results) => {
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
export{createUserAccountApp, getUserAccountApps, getUserAccountApp, updateUserAccountApp, deleteUserAccountApps};