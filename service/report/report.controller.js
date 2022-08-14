const { createLog} = require ("../../service/db/app_portfolio/app_log/app_log.service");
module.exports = {
	getReport: async (req, res) => {
		let decodedparameters = Buffer.from(req.query.reportid, 'base64').toString('utf-8')
		const querystring = require('querystring');
		req.query.app_id = querystring.parse(decodedparameters).app_id;
		req.query.module = querystring.parse(decodedparameters).module;
		req.query.format = querystring.parse(decodedparameters).format;
		req.query.ps = querystring.parse(decodedparameters).ps;
		req.query.hf = querystring.parse(decodedparameters).hf;
		//called if format=html or not PDF or puppeteer creating PDF
		req.query.callback=1;
		const { getIp} = require ("../../service/geolocation/geolocation.controller");
		getIp(req, res, (err, result)=>{
			let gps_place = result.geoplugin_city + ', ' +
							result.geoplugin_regionName + ', ' +
							result.geoplugin_countryName;
			//check if maintenance
			const { getParameter} = require ("../../service/db/app_portfolio/app_parameter/app_parameter.service");
			getParameter(process.env.COMMON_APP_ID,'SERVER_MAINTENANCE', req.query.app_id, (err, db_SERVER_MAINTENANCE)=>{
				if (err)
					createLogAppSE(req.query.app_id, __appfilename, __appfunction, __appline, err, (err_log, result_log)=>{
						return res.send(null);
					})
				else{
					if (db_SERVER_MAINTENANCE==1){
						const { getMaintenance } = require("../../apps");
						const app = getMaintenance(req.query.app_id,
													result.geoplugin_latitude,
													result.geoplugin_longitude,
													gps_place)
						.then(function(app_result){
							createLog({ app_id : req.query.app_id,
										app_module : 'REPORT',
										app_module_type : 'MAINTENANCE',
										app_module_request : null,
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
										}, req.query.app_id, (err,results)  => {
											null;
							});
							res.send(app_result);
						});
					}
					else{
						const { getReport} = require(`../../apps/app${req.query.app_id}/report`);
						const report = getReport(req.query.app_id, 
												req.query.module, 
												result.geoplugin_latitude, 
												result.geoplugin_longitude, 
												gps_place)
						.then(function(report_result){
							if (typeof req.query.service == "undefined")
								createLog({ app_id : req.query.app_id,
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
											}, req.query.app_id, (err,results)  => {
												null;
								});
							if (req.query.format.toUpperCase() == 'PDF' && typeof req.query.service == "undefined" ){		
								const url = req.protocol + ':/' + req.get('host') + req.originalUrl + '&service=1';
								//PDF
								const { getReportService} = require ("./report.service");
								let pdf_result = getReportService(  url, 
																	req.query.ps, 			//papersize		A4, Letter
																	(req.query.hf==1))		//headerfooter	1/0
													.then(function(pdf){
														res.type('application/pdf');
														res.send(pdf);
													})
							}
							else
								res.send(report_result);
						})
					}								
				}
			})
		})
	}		
};