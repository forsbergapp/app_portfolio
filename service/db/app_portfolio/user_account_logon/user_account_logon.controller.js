const service = await import("./user_account_logon.service.js");

function getUserAccountLogonAdmin(req, res){
	req.params.user_account_id = parseInt(req.params.user_account_id);
	service.getUserAccountLogonAdmin(req.query.app_id, req.params.user_account_id, req.params.app_id, (err, results) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: results
		});
	});
}
export{getUserAccountLogonAdmin};