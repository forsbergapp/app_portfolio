const { getParameters, getLogs, getFiles, getPM2Logs,
	    createLogServer, createLogAppS, createLogAppRI, createLogAppC} = require ("./log.service");
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
	},
	createLogServer: (req, res, app_id, info, err) =>{
		if (req && res)
			createLogServer(app_id, info, err, 
							req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, res.statusCode, 
							req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']);
		else
			createLogServer(app_id, info, err, 
							null, null, null, null, null, null, 
							null, null, null);
	},
	createLogAppRI:(req, res, app_id, app_filename, app_function_name, app_line, logtext) =>{
		createLogAppRI(app_id, app_filename, app_function_name, app_line, logtext,
					   req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, res.statusCode, 
					   req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']);
	},
	createLogAppSI: (app_id, app_filename, app_function_name, app_line, logtext) => {
        createLogAppS(process.env.SERVICE_LOG_LEVEL_INFO, app_id, app_filename, app_function_name, app_line, logtext);
	},
    createLogAppSE: (app_id, app_filename, app_function_name, app_line, logtext) => {
        createLogAppS(process.env.SERVICE_LOG_LEVEL_ERROR, app_id, app_filename, app_function_name, app_line, logtext);
	},
	createLogAppCI: (req, res, app_id, app_filename, app_function_name, app_line, logtext) => {
		createLogAppC(app_id, process.env.SERVICE_LOG_LEVEL_INFO, app_filename, app_function_name, app_line, logtext,
					   req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, res.statusCode, 
			           req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']);
	},
	createLogAppCE: (req, res, app_id, app_filename, app_function_name, app_line, logtext) => {
		createLogAppC(app_id, process.env.SERVICE_LOG_LEVEL_ERROR, app_filename, app_function_name, app_line, logtext,
					   req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, res.statusCode, 
			           req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']);
	}
}