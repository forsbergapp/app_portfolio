const service = await import("./report.service.js");
const {client_locale} = await import(`file://${process.cwd()}/apps/apps.service.js`);
const getReport = async (req, res) => {
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

	if (req.query.format.toUpperCase() == 'PDF' && typeof req.query.service == "undefined" ){		
		const url = req.protocol + '://' + req.get('host') + req.originalUrl + '&service=1';
		//PDF
		service.getReportService(url, 
								 req.query.ps, 			//papersize		A4, Letter
								 (req.query.hf==1))		//headerfooter	1/0
		.then((pdf) => {
			res.type('application/pdf');
			res.send(pdf);
		})
	}
	else{
		import(`file://${process.cwd()}/apps/app${req.query.app_id}/report/index.js`).then(({createReport}) => {
			createReport(req.query.app_id, req.query.module, client_locale(req.headers['accept-language'])).then((report_result) => {
				res.send(report_result);
			})	
		})
	}
}		
export{getReport};