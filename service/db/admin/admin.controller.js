const { DBInfo, DBInfoSpace, DBInfoSpaceSum, DBStart, DBStop } = require ("./admin.service");

module.exports = {
	DBInfo: (req, res) => {
		DBInfo(req.query.app_id, (err, results) =>{
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
	DBInfoSpace: (req, res) => {
		DBInfoSpace(req.query.app_id, (err, results) =>{
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
    DBInfoSpaceSum: (req, res) => {
		DBInfoSpaceSum(req.query.app_id, (err, results) =>{
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
	DBStart: async (req, res, callBack) => {
		DBStart(req.query.app_id, (err, results) =>{
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
	DBStop: (req, res) => {
		DBStop(req.query.app_id, (err, results) =>{
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