const service = await import("./message_translation.service.js");

const getMessage = (req, res) => {
	service.getMessage(req.query.app_id, req.query.data_app_id, req.params.code, req.query.lang_code, (err, results) =>{
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
export{getMessage};