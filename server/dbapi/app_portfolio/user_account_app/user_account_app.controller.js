const service = await import('./user_account_app.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

const createUserAccountApp = (req, res) => {
	service.createUserAccountApp(getNumberValue(req.query.app_id), getNumberValue(req.body.user_account_id), (err,results) => {
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
};
const getUserAccountApps = (req, res) => {
	service.getUserAccountApps(getNumberValue(req.query.app_id), getNumberValue(req.params.user_account_id), (err,results) => {
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
};
const getUserAccountApp = (req, res) => {
	service.getUserAccountApp(getNumberValue(req.query.app_id), getNumberValue(req.params.user_account_id), (err,results) => {
		if (err) {
			return res.status(500).send(
				err
			);
		}
		return res.status(200).json({
			items: results
		});
	});
};
const updateUserAccountApp = (req, res) => {
	const data = {	setting_preference_direction_id: 	getNumberValue(req.body.setting_preference_direction_id),
					setting_preference_arabic_script_id:getNumberValue(req.body.setting_preference_arabic_script_id),
					setting_preference_timezone_id: 	getNumberValue(req.body.setting_preference_timezone_id),
					preference_locale:					req.body.preference_locale
				};
	service.updateUserAccountApp(getNumberValue(req.query.app_id), getNumberValue(req.params.user_account_id), data, (err,results) => {
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
};
const deleteUserAccountApps = (req, res) => {
	service.deleteUserAccountApps(getNumberValue(req.query.app_id), getNumberValue(req.params.user_account_id), getNumberValue(req.params.app_id), (err,results) => {
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
};
export{createUserAccountApp, getUserAccountApps, getUserAccountApp, updateUserAccountApp, deleteUserAccountApps};