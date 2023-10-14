const service = await import('./user_account_logon.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

const getUserAccountLogonAdmin = (req, res) => {
	service.getUserAccountLogonAdmin(getNumberValue(req.query.app_id), getNumberValue(req.params.user_account_id), getNumberValue(req.params.app_id), (err, results) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: results
		});
	});
};
export{getUserAccountLogonAdmin};