const service = await import("./user_account_follow.service.js");
	
function followUser(req, res){
	req.params.id   = parseInt(req.params.id);
	const id_follow = parseInt(req.body.user_account_id);
	service.followUser(req.query.app_id, req.params.id,id_follow, (err,results) => {
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
function unfollowUser(req, res){
	req.params.id     = parseInt(req.params.id);
	const id_unfollow = parseInt(req.body.user_account_id);
	service.unfollowUser(req.query.app_id, req.params.id,id_unfollow, (err,results) => {
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
export{followUser, unfollowUser};