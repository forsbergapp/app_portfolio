const service = await import('./user_account_like.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

const likeUser = (req, res) => {
	service.likeUser(getNumberValue(req.query.app_id), getNumberValue(req.params.id),getNumberValue(req.body.user_account_id), (err,result) => {
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
const unlikeUser = (req, res) => {
	service.unlikeUser(getNumberValue(req.query.app_id), getNumberValue(req.params.id),getNumberValue(req.body.user_account_id), (err,result) => {
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
export{likeUser, unlikeUser};