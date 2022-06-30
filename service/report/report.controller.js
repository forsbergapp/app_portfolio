const { createLog} = require ("../../service/db/api/app_log/app_log.service");

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
					res.send(report_result);
				})
			})
		}
		data.body.app_id 					  = data.query.app_id;
		data.body.app_module 				  = 'REPORT';
		data.body.app_module_type 			  = data.query.type_desc;
		data.body.app_module_request		  = data.protocol + '://' + data.get('host') + data.originalUrl;
		data.body.app_module_result			  = '';
		data.body.app_user_id				  = data.query.id;
		data.body.server_remote_addr 		  = data.ip;
		data.body.server_user_agent 		  = data.headers["user-agent"];
		data.body.server_http_host 			  = data.headers["host"];
		data.body.server_http_accept_language = data.headers["accept-language"];
		createLog(data.body, (err2,results2)  => {
			null;
		}); 
	}		
};