const { getReportService} = require ("./report.service");
const { createLog} = require ("../../service/db/api/app_log/app_log.service");

module.exports = {
	getReport: async (data, res) => {
		let db_APP_REPORT_PATH;
		async function main_function(){
			var pdf;
			//generate url to return as html or PDF
			if (data.query.format == 'pdf' && typeof data.query.service == "undefined" ){
				const url = data.protocol + ':/' + data.get('host') + data.originalUrl + '&service=1';
				//PDF
				pdf = await getReportService('', 
											url, 
											data.query.ps, 			//papersize		A4, Letter
											(data.query.hf==1));	//headerfooter	1/0
				res.type('application/pdf');
				res.send(pdf);
			}
			else{
				//HTML
				//called if format=html or not PDF or puppeteer creating PDF
				const fs = require('fs');
				fs.readFile(__dirname + '/../..' + db_APP_REPORT_PATH + data.query.module, 'utf8', (error, fileBuffer) => {
					res.send(fileBuffer.toString());
				});
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
		const { getParameters} = require ("../../service/db/api/app_parameter/app_parameter.service");
		getParameters(data.query.app_id, (err, results)=>{
			if (err) {
				createLogAppSE(data.query.app_id, __appfilename, __appfunction, __appline, err);
			}
			else{
				let json = JSON.parse(JSON.stringify(results));
				for (var i = 0; i < json.length; i++) {
					if (json[i].parameter_name == 'APP_REPORT_PATH')
						db_APP_REPORT_PATH = json[i].parameter_value;
				}
				main_function();
			}
		})
	}		
};