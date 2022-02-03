const { getLocales } = require ("./locale.service");

module.exports = {
	getLocales: (req, res) => {
        var lang_code;
        if (typeof req.params.lang_code == 'undefined')
			lang_code ='en';
		else
			lang_code = req.params.lang_code;
		getLocales(lang_code,(err, results) =>{
			if (err) {
				console.log(err);
				return res.status(500).send({
					success: 0,
					data: err
				});
			}
			return res.status(200).json({
				success: 1,
				locales: results
			});
		});
	}
}