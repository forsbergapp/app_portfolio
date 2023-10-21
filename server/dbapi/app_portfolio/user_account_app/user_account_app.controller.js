const service = await import('./user_account_app.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

const createUserAccountApp = (req, res) => {
	service.createUserAccountApp(getNumberValue(req.query.app_id), getNumberValue(req.body.user_account_id), (err,result) => {
		if (err) {
			return res.status(500).send(
				err
			);
		}
		return res.status(200).json({
			count: result.affectedRows,
			items: Array(result)
		});
	});
};
const getUserAccountApps = (req, res) => {
	service.getUserAccountApps(getNumberValue(req.query.app_id), getNumberValue(req.params.user_account_id), (err,result) => {
		if (err) {
			return res.status(500).send(
				err
			);
		}
		return res.status(200).json({
			count: result.length,
			items: result
		});
	});
};
const getUserAccountApp = (req, res) => {
	service.getUserAccountApp(getNumberValue(req.query.app_id), getNumberValue(req.params.user_account_id), (err,result) => {
		if (err) {
			return res.status(500).send(
				err
			);
		}
		return res.status(200).json({
			items: result
		});
	});
};
const updateUserAccountApp = (req, res) => {
	const data = {	setting_preference_direction_id: 	getNumberValue(req.body.setting_preference_direction_id),
					setting_preference_arabic_script_id:getNumberValue(req.body.setting_preference_arabic_script_id),
					setting_preference_timezone_id: 	getNumberValue(req.body.setting_preference_timezone_id),
					preference_locale:					req.body.preference_locale
				};
	service.updateUserAccountApp(getNumberValue(req.query.app_id), getNumberValue(req.params.user_account_id), data, (err,result) => {
		if (err) {
			return res.status(500).send(
				err
			);
		}
		else
			return res.status(200).json({
				items: result
			});
	});
};
const deleteUserAccountApps = (req, res) => {
	service.deleteUserAccountApps(getNumberValue(req.query.app_id), getNumberValue(req.params.user_account_id), getNumberValue(req.params.app_id), (err,result) => {
		if (err) {
			return res.status(500).send(
				err
			);
		}
		else
			return res.status(200).send(
				result
			);
	});
};
export{createUserAccountApp, getUserAccountApps, getUserAccountApp, updateUserAccountApp, deleteUserAccountApps};