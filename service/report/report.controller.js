const { getReportService} = require ("./report.service");
const { createLog} = require ("../../service/db/api/app_log/app_log.service");

module.exports = {
	getReport: async (data, res) => {
		//ex arguments för timetables app
		//data.url			?app_id=1&id=44&sid=30&ps=A4&hf=0&format=html&type=0
		//data.protocol		https
		//data.get('host'))	localhost:443
		//data.baseUrl		/report
		//data.path			/
		//data.originalUrl	/report/?app_id=1&id=44&sid=30&ps=A4&hf=0&format=html&type=0
		//full url			data.protocol + ':/' + data.get('host') + data.originalUrl
		var pdf;
		if (data.query.app_id == process.env.APP1_ID){
			//timetable app
			//generate url to return as html or PDF
			const url = data.protocol + ':/' + data.get('host') + data.baseUrl + 
						'/?app_id=' + data.query.app_id +	//app id
						'&id=' + data.query.id +			//user account id
						'&sid=' + data.query.sid +			//user setting id
						'&type=' + data.query.type; 		//0=day, 1=month, 2=year
			if (data.query.format == 'pdf'){
				//PDF
				pdf = await getReportService('', 
											 url, 
											 data.query.ps, 		//papersize		A4 etc
											(data.query.hf==1));	//headerfooter	1/0
				res.type('application/pdf');
				res.send(pdf);
			}
			else{
				//HTML
				//called if format=html or not PDF or puppeteer creating PDF
				const fs = require('fs');
				const html = fs.readFileSync(__dirname + '/timetable.html', 'utf8');
				res.send(html);
			}
		}
		else{
			res.status(500).send({
				success: 0,
				data: 'not supported'
			});
		}
		data.body.app_id = data.query.app_id;
		data.body.app_module= 'REPORT';
		if (data.query.type==0)
			data.body.app_module_type= 'REPORT_TIMETABLE_DAY';
		if (data.query.type==1)
			data.body.app_module_type= 'REPORT_TIMETABLE_MONTH';
		if (data.query.type==2)
			data.body.app_module_type= 'REPORT_TIMETABLE_YEAR';
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