const { getParameters, getLogs, getFiles, getPM2Logs,
	    createLogServer, createLogAppS, createLogAppRI, createLogAppC} = require ("./log.service");

module.exports = {
	getParameters: (req, res) => {
		getParameters(req.query_app_id, (err, results) =>{
			if (err)
				return res.status(500).send({
					data: err
				});
			else
				return res.status(200).json({
					data: results
				});
		});
	},
	getLogs: (req, res) => {
		getLogs(req.query_app_id, req.query, (err, results) =>{
			if (err)
				return res.status(500).send(
                    err
                );
			else{
				if (results.length>0)
					return res.status(200).json({
						data: results
					});
				else{
					return res.status(404).send(
						'Record not found'
					);
				}
			}
		});
	},
	getFiles: (req, res) => {
		getFiles(req.query_app_id, (err, results) =>{
			if (err)
				return res.status(500).send(
                    err
                );
			else{
                if (results.length>0)
                    return res.status(200).json({
						data: results
					});
                else{
                    return res.status(404).send(
						'Record not found'
					);
                }
            }
		});
	},
	getPM2Logs: (req, res) => {
		getPM2Logs(req.query_app_id, (err, results) =>{
			if (err)
				return res.status(500).send(
                    err
                );
			else{
				if (results.length>0)
					return res.status(200).json({
						path: process.env.SERVICE_LOG_FILE_PATH_SERVER,
						file: process.env.SERVICE_LOG_PM2_FILE,
						data: results
					});
				else{
					return res.status(404).send(
						'Record not found'
					);
				}
			}
		});
	},
	createLogServer: (req, res, info, err) =>{
		if (res)
			createLogServer(info, err, 
							req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, res.statusCode, 
							req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']);
		else
			createLogServer(info, err, 
							null, null, null, null, null, null, 
							null, null, null);
	},
	createLogAppRI:(req, res, app_filename, app_function_name, app_line, logtext) =>{
		createLogAppRI(req.query.app_id, app_filename, app_function_name, app_line, logtext,
					   req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, res.statusCode, 
					   req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']);
	},
	createLogAppSI: (app_id, app_filename, app_function_name, app_line, logtext, callBack) => {
        createLogAppS(process.env.SERVICE_LOG_LEVEL_INFO, app_id, app_filename, app_function_name, app_line, logtext, (err, result)=>{
			callBack(null, result);
		});
	},
    createLogAppSE: (app_id, app_filename, app_function_name, app_line, logtext, callBack) => {
        createLogAppS(process.env.SERVICE_LOG_LEVEL_ERROR, app_id, app_filename, app_function_name, app_line, logtext, (err, result)=>{
			callBack(null, result);
		});
	},
	createLogAppCI: async (req, res, app_filename, app_function_name, app_line, logtext) => {
		return new Promise(function (resolve){ 
			createLogAppC(req.query.app_id, process.env.SERVICE_LOG_LEVEL_INFO, app_filename, app_function_name, app_line, logtext,
							req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, res.statusCode, 
							req.headers['user-agent'], req.headers['accept-language'], req.headers['referer'],(err, res)=>{
				resolve();
			});
		})
	},
	createLogAppCE: async (req, res, app_filename, app_function_name, app_line, logtext) => {
		return await new Promise(function (resolve){ 
			createLogAppC(req.query.app_id, process.env.SERVICE_LOG_LEVEL_ERROR, app_filename, app_function_name, app_line, logtext,
						req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, res.statusCode, 
						req.headers['user-agent'], req.headers['accept-language'], req.headers['referer'], (err, res) =>{
				resolve();
			});
		})
	}
}