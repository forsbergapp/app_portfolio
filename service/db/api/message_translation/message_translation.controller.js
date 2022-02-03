const { getMessage } = require ("./message_translation.service");

module.exports = {
	getMessage: (req, res) => {
		var code = req.params.code;
		var app_id = req.query.app_id; 
		var lang_code = req.query.lang_code;
		getMessage(code, app_id, lang_code, (err, results) =>{
			if (err) {
				console.log(err);
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