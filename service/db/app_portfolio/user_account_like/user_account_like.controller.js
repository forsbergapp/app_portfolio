const { likeUser,
	    unlikeUser} = require ("./user_account_like.service");

module.exports = {

likeUser: (req, res) => {
	const id   = req.params.id;
	const id_like   = req.body.user_account_id;
	likeUser(req.query.app_id, id,id_like, (err,results) => {
		if (err) {
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
unlikeUser: (req, res) => {
	const id   = req.params.id;
	const id_unlike   = req.body.user_account_id;
	unlikeUser(req.query.app_id, id,id_unlike, (err,results) => {
		if (err) {
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