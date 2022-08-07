const { getIdentityProviders} = require ("./identity_provider.service");

module.exports = {

	getIdentityProviders: (req, res) => {
		getIdentityProviders(req.query.app_id, (err,results) => {
			if (err) {
				return res.status(500).send(
					err
				);
			}
			return res.status(200).json({
				success: 1,
				items: results
			});
		});
	}
}