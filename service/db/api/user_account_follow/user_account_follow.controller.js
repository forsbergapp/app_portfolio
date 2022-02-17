const { followUser,
		unfollowUser} = require ("./user_account_follow.service");

module.exports = {
	
	followUser: (req, res) => {
		const id   = req.params.id;
		const id_follow   = req.body.user_account_id;
		followUser(req.query.app_id, id,id_follow, (err,results) => {
			if (err) {
				console.log(err);
				return res.status(500).send(
					err
				);
			}
			return res.status(200).json({
				count: results.changedRows,
				success: 1,
				items: Array(results)
			});
		});
	},
	unfollowUser: (req, res) => {
		const id   = req.params.id;
		const id_unfollow   = req.body.user_account_id;
		unfollowUser(req.query.app_id, id,id_unfollow, (err,results) => {
			if (err) {
				console.log(err);
				return res.status(500).send(
					err
				);
			}
			return res.status(200).json({
				count: results.changedRows,
				success: 1,
				items: Array(results)
			});
		});
	}
}