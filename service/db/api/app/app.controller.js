const { getApp } = require ("./app.service");

module.exports = {
	getApp: (req, res) => {
		const id = req.query.id;
		getApp(id, (err, results) =>{
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