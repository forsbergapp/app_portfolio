const service = await import("./country.service.js");

function getCountries(req, res){
	let lang_code;
	if (typeof req.params.lang_code == 'undefined')
		lang_code ='en';
	else
		lang_code = req.params.lang_code;
	service.getCountries(req.query.app_id, lang_code,(err, results) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			countries: results
		});
	});
}
export{getCountries};