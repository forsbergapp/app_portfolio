const service = await import("./locale.service.js");

const getLocales = (req, res) => {
	let lang_code;
	if (typeof req.params.lang_code == 'undefined')
		lang_code ='en';
	else
		lang_code = req.params.lang_code;
	service.getLocales(req.query.app_id, lang_code,(err, results) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			locales: results
		});
	});
}
export{getLocales};