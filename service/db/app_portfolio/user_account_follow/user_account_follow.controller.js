const { followUser,
		unfollowUser} = require ("./user_account_follow.service");

module.exports = {
	
	followUser: (req, res) => {
		req.params.id = parseInt(req.params.id);
		const id_follow   = parseInt(req.body.user_account_id);
		followUser(req.query.app_id, req.params.id,id_follow, (err,results) => {
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
	unfollowUser: (req, res) => {
		req.params.id = parseInt(req.params.id);
		const id_unfollow   = parseInt(req.body.user_account_id);
		unfollowUser(req.query.app_id, req.params.id,id_unfollow, (err,results) => {
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