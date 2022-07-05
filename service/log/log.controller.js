const { getParameters, getLogs, getFiles, getPM2Logs} = require ("./log.service");
module.exports = {
	getParameters: (req, res) => {
		getParameters((err, results) =>{
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
	},
	getLogs: (req, res) => {
		getLogs(req.query, (err, results) =>{
			if (err) {
				return res.status(500).send(
                    err
                );
			}
			return res.status(200).json({
				success: 1,
				data: results
			});
		});
	},
	getFiles: (req, res) => {
		getFiles((err, results) =>{
			if (err) {
				return res.status(500).send(
                    err
                );
			}
			return res.status(200).send(
				results
			);
		});
	},
	getPM2Logs: (req, res) => {
		getPM2Logs((err, results) =>{
			if (err) {
				return res.status(500).send(
                    err
                );
			}
			return res.status(200).json({
				success: 1,
				path: process.env.SERVICE_LOG_FILE_PATH_SERVER,
				file: process.env.SERVICE_LOG_PM2_FILE,
				data: results
			});
		});
	}
}