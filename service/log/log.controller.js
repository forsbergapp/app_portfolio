const { getParameters, getLogs, getFiles, getPM2Logs,
		createLogServerI, createLogServerE, createLogAppS, createLogAppRI, createLogAppC} = require ("./log.service");

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
			const {ConfigGet} = require(global.SERVER_ROOT + '/server/server.service');
			if (err)
				return res.status(500).send(
                    err
                );
			else{
				if (results.length>0)
					return res.status(200).json({
						path: global.SERVER_ROOT + ConfigGet(0, null, 'PATH_LOG'),
						file: ConfigGet(1, 'SERVICE_LOG', 'PM2_FILE'),
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
	createLogServerE:async (req, res, err) =>{
		return await new Promise(function (resolve){ 
			resolve(createLogServerE(req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, res.statusCode, 
							req.headers['user-agent'], req.headers['accept-language'], req.headers['referer'], err));
		})
	},
	createLogServerI: async (info, req, res) =>{
		return await new Promise(function (resolve){ 
			const {ConfigGet} = require(global.SERVER_ROOT + '/server/server.service');
			if (info)
				resolve(createLogServerI(info));
			else
				if (ConfigGet(1, 'SERVICE_LOG', 'ENABLE_SERVER_VERBOSE')=='1'){
					const getCircularReplacer = () => {
						const seen = new WeakSet();
						return (key, value) => {
							if (typeof value === 'object' && value !== null) {
							if (seen.has(value)) {
								return;
							}
							seen.add(value);
							}
							return value;
						};
					};
					resolve(createLogServerI('res:' + JSON.stringify(res, getCircularReplacer())));
				}
				else
					if (ConfigGet(1, 'SERVICE_LOG', 'ENABLE_SERVER_INFO')=='1'){
						resolve(createLogServerI(null,
												 req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, 
												 res.statusCode, res.statusMessage, 
												 req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']));
					}
		})
		
	},
	createLogAppRI: async (req, res, app_filename, app_function_name, app_line, logtext) =>{
		return await new Promise(function (resolve){ 
			resolve(createLogAppRI(req.query.app_id, app_filename, app_function_name, app_line, logtext,
						           req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, res.statusCode, 
						           req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']));
		})
	},
	createLogAppSI: async (app_id, app_filename, app_function_name, app_line, logtext) => {
		return await new Promise(function (resolve){ 
			const {ConfigGet} = require(global.SERVER_ROOT + '/server/server.service');
			resolve(createLogAppS(ConfigGet(1, 'SERVICE_LOG', 'LEVEL_INFO'), app_id, app_filename, app_function_name, app_line, logtext));
		})
	},
    createLogAppSE: async (app_id, app_filename, app_function_name, app_line, logtext) => {
		return await new Promise(function (resolve){ 
			const {ConfigGet} = require(global.SERVER_ROOT + '/server/server.service');
        	resolve(createLogAppS(ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), app_id, app_filename, app_function_name, app_line, logtext));
		})
	},
	createLogAppCI: async (req, res, app_filename, app_function_name, app_line, logtext) => {
		return await new Promise(function (resolve){ 
			const {ConfigGet} = require(global.SERVER_ROOT + '/server/server.service');
			resolve(createLogAppC(req.query.app_id, ConfigGet(1, 'SERVICE_LOG', 'LEVEL_INFO'), app_filename, app_function_name, app_line, logtext,
							      req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, 
								  res.statusCode, 
							      req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']));
		})
	},
	createLogAppCE: async (req, res, app_filename, app_function_name, app_line, logtext) => {
		return await new Promise(function (resolve){ 
			const {ConfigGet} = require(global.SERVER_ROOT + '/server/server.service');
			createLogAppC(req.query.app_id, ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), app_filename, app_function_name, app_line, logtext,
						req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, 
						res.statusCode, 
						req.headers['user-agent'], req.headers['accept-language'], req.headers['referer'], (err, res) =>{
				resolve();
			});
		})
	}
}