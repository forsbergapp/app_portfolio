const service = await import("./user_account_like.service.js");

const likeUser = (req, res) => {
	req.params.id = parseInt(req.params.id);
	const id_like = parseInt(req.body.user_account_id);
	service.likeUser(req.query.app_id, req.params.id,id_like, (err,results) => {
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
const unlikeUser = (req, res) => {
	req.params.id   = parseInt(req.params.id);
	const id_unlike = parseInt(req.body.user_account_id);
	service.unlikeUser(req.query.app_id, req.params.id,id_unlike, (err,results) => {
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
export{likeUser, unlikeUser};