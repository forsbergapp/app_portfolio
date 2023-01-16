const service = await import("./report.service.js");
const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);

async function getReport(req, res){
	let decodedparameters = Buffer.from(req.query.reportid, 'base64').toString('utf-8');
	//example string:
	//'app_id=2&module=timetable.html&id=1&sid=1&type=0&lang_code=en-us&format=PDF&ps=A4&hf=0'
	let query_parameters = '{';
	decodedparameters.split('&').forEach((parameter, index)=>{
		query_parameters += `"${parameter.split('=')[0]}": "${parameter.split('=')[1]}"`;
		if (index < decodedparameters.split('&').length - 1)
			query_parameters += ',';
	});
	query_parameters += '}';
	query_parameters = JSON.parse(query_parameters);
	req.query.app_id = query_parameters.app_id;
	req.query.module = query_parameters.module;
	req.query.format = query_parameters.format;
	req.query.ps = query_parameters.ps;
	req.query.hf = query_parameters.hf;
	//called if format=html or not PDF or puppeteer creating PDF
	req.query.callback=1;
	import(`file://${process.cwd()}/service/geolocation/geolocation.controller.js`).then(function({getIp}){
		getIp(req, res, (err, result)=>{
			let gps_place = result.geoplugin_city + ', ' +
							result.geoplugin_regionName + ', ' +
							result.geoplugin_countryName;
			//check if maintenance
			if (ConfigGet(0, null, 'MAINTENANCE')=='1'){
				import(`file://${process.cwd()}/apps/index.js`).then(function({getMaintenance}){
					const app = getMaintenance(req.query.app_id,
												result.geoplugin_latitude,
												result.geoplugin_longitude,
												gps_place)
					.then(function(app_result){
						res.send(app_result);
					});
				})
			}
			else{
				if (req.query.format.toUpperCase() == 'PDF' && typeof req.query.service == "undefined" ){		
					const url = req.protocol + ':/' + req.get('host') + req.originalUrl + '&service=1';
					//PDF
					let pdf_result = service.getReportService(  url, 
														req.query.ps, 			//papersize		A4, Letter
														(req.query.hf==1))		//headerfooter	1/0
										.then(function(pdf){
											res.type('application/pdf');
											res.send(pdf);
										})
				}
				else{
					import(`file://${process.cwd()}/apps/app${req.query.app_id}/report/index.js`).then(function({getReport}){
						const report = getReport(req.query.app_id, 
											req.query.module, 
											result.geoplugin_latitude, 
											result.geoplugin_longitude, 
											gps_place)
						.then(function(report_result){
							import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/app_log/app_log.service.js`).then(function({createLog}){
								createLog(req.query.app_id,
											{ app_id : req.query.app_id,
											app_module : 'REPORT',
											app_module_type : req.query.format.toUpperCase(), //HTML or PDF
											app_module_request : req.protocol + '://' + req.get('host') + req.originalUrl,
											app_module_result : gps_place,
											app_user_id : null,
											user_language : null,
											user_timezone : null,
											user_number_system : null,
											user_platform : null,
											server_remote_addr : req.ip,
											server_user_agent : req.headers["user-agent"],
											server_http_host : req.headers["host"],
											server_http_accept_language : req.headers["accept-language"],
											client_latitude : result.geoplugin_latitude,
											client_longitude : result.geoplugin_longitude
											}, (err,results)  => {
												res.send(report_result);
								});
							})
						})	
					})
				}	
			}
		})
	})
}		
export{getReport};