const service = await import("./identity_provider.service.js");

function getIdentityProviders(req, res){
	service.getIdentityProviders(req.query.app_id, (err,results) => {
		if (err) {
			return res.status(500).send(
				err
			);
		}
		return res.status(200).json({
			items: results
		});
	});
}
export{getIdentityProviders};