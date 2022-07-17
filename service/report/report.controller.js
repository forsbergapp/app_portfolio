const { createLog} = require ("../../service/db/api/app_log/app_log.service");
function app_log(app_id, app_module_type, request, result, app_user_id,
				 user_language, user_timezone,user_number_system,user_platform,
				 server_remote_addr, server_user_agent, server_http_host,server_http_accept_language,
				 client_latitude,client_longitude){
	const logData ={
		app_id : app_id,
		app_module : 'REPORT',
		app_module_type : app_module_type,
		app_module_request : request,
		app_module_result : result,
		app_user_id : app_user_id,
		user_language : user_language,
		user_timezone : user_timezone,
		user_number_system : user_number_system,
		user_platform : user_platform,
		server_remote_addr : server_remote_addr,
		server_user_agent : server_user_agent,
		server_http_host : server_http_host,
		server_http_accept_language : server_http_accept_language,
		client_latitude : client_latitude,
		client_longitude : client_longitude
    }
    createLog(logData, (err,results)  => {
        null;
    }); 
}
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
			const { getParameter} = require ("../../service/db/api/app_parameter/app_parameter.service");
			getParameter(process.env.MAIN_APP_ID,'SERVER_MAINTENANCE', (err, db_SERVER_MAINTENANCE)=>{
				if (err)
					createLogAppSE(req.query.app_id, __appfilename, __appfunction, __appline, err);      
				else{
					if (db_SERVER_MAINTENANCE==1){
						const { getMaintenance } = require("../../apps");
						const app = getMaintenance(req.query.app_id,
													result.geoplugin_latitude,
													result.geoplugin_longitude,
													gps_place)
						.then(function(app_result){
							app_log(req.query.app_id, 
									'MAINTENANCE',
									null,
									gps_place,
									null,
									null,
									null,
									null,
									null,
									req.ip,
									req.headers["user-agent"],
									req.headers["host"],
									req.headers["accept-language"],
									result.geoplugin_latitude, 
									result.geoplugin_longitude);
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
								app_log(req.query.app_id,
										req.query.format.toUpperCase(), //HTML or PDF
										req.protocol + '://' + req.get('host') + req.originalUrl,
										gps_place,
										null,
										null,
										null,
										null,
										null,
										req.ip,
										req.headers["user-agent"],
										req.headers["host"],
										req.headers["accept-language"],
										result.geoplugin_latitude, 
										result.geoplugin_longitude);
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