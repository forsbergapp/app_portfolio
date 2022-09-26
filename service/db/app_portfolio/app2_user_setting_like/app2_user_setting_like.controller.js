const { likeUserSetting,
	    unlikeUserSetting} = require ("./app2_user_setting_like.service");

module.exports = {

likeUserSetting: (req, res) => {
	const id   = req.params.id;
	const id_like   = req.body.app2_user_setting_id;
	likeUserSetting(req.query.app_id, id,id_like, (err,results) => {
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
unlikeUserSetting: (req, res) => {
	const id   = req.params.id;
	const id_unlike   = req.body.app2_user_setting_id;
	unlikeUserSetting(req.query.app_id, id,id_unlike, (err,results) => {
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
}