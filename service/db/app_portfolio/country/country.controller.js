const { getCountries } = require ("./country.service");

module.exports = {
	getCountries: (req, res) => {
        var lang_code;
        if (typeof req.params.lang_code == 'undefined')
            lang_code ='en';
        else
            lang_code = req.params.lang_code;
		getCountries(req.query.app_id, lang_code,(err, results) =>{
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
}