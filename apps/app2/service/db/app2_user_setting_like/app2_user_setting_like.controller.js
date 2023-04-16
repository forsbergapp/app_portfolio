const service = await import("./app2_user_setting_like.service.js");

const likeUserSetting = (req, res) => {
	req.params.id = parseInt(req.params.id);
	const id_like = parseInt(req.body.app2_user_setting_id);
	service.likeUserSetting(req.query.app_id, req.params.id, id_like, (err,results) => {
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
const unlikeUserSetting = (req, res) => {
	req.params.id   = parseInt(req.params.id);
	const id_unlike = parseInt(req.body.app2_user_setting_id);
	service.unlikeUserSetting(req.query.app_id, req.params.id, id_unlike, (err,results) => {
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
export{likeUserSetting, unlikeUserSetting};