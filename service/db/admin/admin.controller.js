const { getDBInfo, getDBInfoSpace, getDBInfoSpaceSum } = require ("./admin.service");

module.exports = {
	getDBInfo: (req, res) => {
		getDBInfo(req.query.app_id, (err, results) =>{
			if (err) {
				return res.status(500).send({
					data: err
				});
			}
			return res.status(200).json({
				data: results
			});
		});
	},
	getDBInfoSpace: (req, res) => {
		getDBInfoSpace(req.query.app_id, (err, results) =>{
			if (err) {
				return res.status(500).send({
					data: err
				});
			}
			return res.status(200).json({
				data: results
			});
		});
	},
    getDBInfoSpaceSum: (req, res) => {
		getDBInfoSpaceSum(req.query.app_id, (err, results) =>{
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
}