const { getMessage } = require ("./message_translation.service");

module.exports = {
	getMessage: (req, res) => {
		getMessage(req.params.code, req.query.data_app_id, req.query.app_id, req.query.lang_code, (err, results) =>{
			if (err) {
				return res.status(500).send({
					success: 0,
					data: err
				});
			}
			return res.status(200).json({
				success: 1,
				data: results
			});
		});
	}
}