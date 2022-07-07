const { createLog} = require ("../../service/db/api/app_log/app_log.service");
function app_log(app_id, app_module_type, request, result, app_user_id,
				 user_language, user_timezone,user_number_system,user_platform,
				 server_remote_addr, server_user_agent, server_http_host,server_http_accept_language,
				 user_gps_latitude,user_gps_longitude){
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
		user_gps_latitude : user_gps_latitude,
		user_gps_longitude : user_gps_longitude
    }
    createLog(logData, (err,results)  => {
        null;
    }); 
}
module.exports = {
	getReport: async (data, res) => {
		var pdf;
		//generate url to return as html or PDF
		if (data.query.format == 'pdf' && typeof data.query.service == "undefined" ){
			const url = data.protocol + ':/' + data.get('host') + data.originalUrl + '&service=1';
			//PDF
			const { getReportService} = require ("./report.service");
			pdf = await getReportService(url, 
											data.query.ps, 			//papersize		A4, Letter
											(data.query.hf==1));	//headerfooter	1/0
			res.type('application/pdf');
			res.send(pdf);
		}
		else{
			//HTML
			//called if format=html or not PDF or puppeteer creating PDF
			data.query.callback=1;
			const { getIp} = require ("../../service/geolocation/geolocation.controller");
			getIp(data, res, (err, result)=>{
				let gps_place = result.geoplugin_city + ', ' +
								result.geoplugin_regionName + ', ' +
								result.geoplugin_countryName;
				const { getReport} = require(`../../apps/app${data.query.app_id}/report`);
				const report = getReport(data.query.app_id, 
										 data.query.module, 
										 result.gps_latitude, 
										 result.gps_longitude, 
										 gps_place)
				.then(function(report_result){
					app_log(data.query.app_id,
							data.query.type_desc, 
							data.protocol + '://' + data.get('host') + data.originalUrl,
							gps_place,
							null,
							null,
							null,
							null,
							null,
							data.ip,
							data.headers["user-agent"],
							data.headers["host"],
							data.headers["accept-language"],
							result.geoplugin_latitude, 
							result.geoplugin_longitude);
					res.send(report_result);
				})
			})
		}
	}		
};