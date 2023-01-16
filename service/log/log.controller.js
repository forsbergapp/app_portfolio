const service = await import('./log.service.js')
const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);
function getParameters(req, res) {
	service.getParameters(req.query_app_id, (err, results) =>{
		if (err)
			return res.status(500).send({
				data: err
			});
		else
			return res.status(200).json({
				data: results
			});
	});
}
function getLogs (req, res) {
	service.getLogs(req.query_app_id, req.query, (err, results) =>{
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
}
function getFiles (req, res){
	service.getFiles(req.query_app_id, (err, results) =>{
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
}
function getPM2Logs (req, res) {
	service.getPM2Logs(req.query_app_id, (err, results) =>{
		if (err)
			return res.status(500).send(
				err
			);
		else{
			if (results.length>0)
				import(`file://${process.cwd()}/server/server.service.js`).then(function({ConfigGet}){
					return res.status(200).json({
						path: process.cwd() + ConfigGet(0, null, 'PATH_LOG'),
						file: ConfigGet(1, 'SERVICE_LOG', 'PM2_FILE'),
						data: results
					});
				})
			else{
				return res.status(404).send(
					'Record not found'
				);
			}
		}
	});
}
async function createLogServerE (req, res, err){
	return await new Promise(function (resolve){ 
		resolve(service.createLogServerE(req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, res.statusCode, 
						req.headers['user-agent'], req.headers['accept-language'], req.headers['referer'], err));
	})
}
async function createLogServerI (info, req, res) {
	return await new Promise(function (resolve){ 
		if (info)
			resolve(service.createLogServerI(info));
		else
			import(`file://${process.cwd()}/server/server.service.js`).then(function({ConfigGet}){
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
					resolve(service.createLogServerI('res:' + JSON.stringify(res, getCircularReplacer())));
				}
				else
					if (ConfigGet(1, 'SERVICE_LOG', 'ENABLE_SERVER_INFO')=='1'){
						resolve(service.createLogServerI(null,
													req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, 
													res.statusCode, res.statusMessage, 
													req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']));
					}
			})
	})
	
}
async function createLogAppRI (req, res, app_filename, app_function_name, app_line, logtext){
	return await new Promise(function (resolve){ 
		resolve(service.createLogAppRI(req.query.app_id, app_filename, app_function_name, app_line, logtext,
								req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, res.statusCode, 
								req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']));
	})
}
async function createLogAppSI (app_id, app_filename, app_function_name, app_line, logtext) {
	return await new Promise(function (resolve){
		import(`file://${process.cwd()}/server/server.service.js`).then(function({ConfigGet}){
			resolve(service.createLogAppS(ConfigGet(1, 'SERVICE_LOG', 'LEVEL_INFO'), app_id, app_filename, app_function_name, app_line, logtext));
		})
	})
}
async function createLogAppSE (app_id, app_filename, app_function_name, app_line, logtext){
	return await new Promise(function (resolve){ 
		import(`file://${process.cwd()}/server/server.service.js`).then(function({ConfigGet}){
			resolve(service.createLogAppS(ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), app_id, app_filename, app_function_name, app_line, logtext));
		})
	})
}
async function createLogAppCI (req, res, app_filename, app_function_name, app_line, logtext){
	return await new Promise(function (resolve){ 
		import(`file://${process.cwd()}/server/server.service.js`).then(function({ConfigGet}){
			resolve(service.createLogAppC(req.query.app_id, ConfigGet(1, 'SERVICE_LOG', 'LEVEL_INFO'), app_filename, app_function_name, app_line, logtext,
									req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, 
									res.statusCode, 
									req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']));
		})
	})
}
async function createLogAppCE (req, res, app_filename, app_function_name, app_line, logtext){
	return await new Promise(function (resolve){ 
		import(`file://${process.cwd()}/server/server.service.js`).then(function({ConfigGet}){
			service.createLogAppC(req.query.app_id, ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), app_filename, app_function_name, app_line, logtext,
						req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, 
						res.statusCode, 
						req.headers['user-agent'], req.headers['accept-language'], req.headers['referer'], (err, res) =>{
				resolve();
			});
		})
	})
}

export {getParameters,getLogs, getFiles,getPM2Logs, 
        createLogServerE, createLogServerI, createLogAppRI, createLogAppSI, createLogAppSE, createLogAppCI, createLogAppCE};