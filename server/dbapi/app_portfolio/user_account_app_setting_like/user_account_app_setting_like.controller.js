const service = await import('./user_account_app_setting_like.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

const likeUserSetting = (req, res) => {
	service.likeUserSetting(getNumberValue(req.query.app_id), getNumberValue(req.params.id), getNumberValue(req.body.user_setting_id), (err,results) => {
		if (err) {
			return res.status(500).send(
				err
			);
		}
		return res.status(200).json({
			count: results.affectedRows,
			items: Array(results)
		});
	});
};
const unlikeUserSetting = (req, res) => {
	service.unlikeUserSetting(getNumberValue(req.query.app_id), getNumberValue(req.params.id), getNumberValue(req.body.user_setting_id), (err,results) => {
		if (err) {
			return res.status(500).send(
				err
			);
		}
		return res.status(200).json({
			count: results.affectedRows,
			items: Array(results)
		});
	});
};
export{likeUserSetting, unlikeUserSetting};