const service = await import('./user_account_like.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

const likeUser = (req, res) => {
	service.likeUser(getNumberValue(req.query.app_id), getNumberValue(req.params.id),getNumberValue(req.body.user_account_id), (err,results) => {
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
const unlikeUser = (req, res) => {
	service.unlikeUser(getNumberValue(req.query.app_id), getNumberValue(req.params.id),getNumberValue(req.body.user_account_id), (err,results) => {
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
export{likeUser, unlikeUser};