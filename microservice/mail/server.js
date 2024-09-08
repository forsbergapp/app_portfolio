/** @module microservice/mail/server */

/**@type{import('./service.js')} */
const service = await import('./service.js');
/**@type{import('../../microservice/microservice.service.js')} */
const { route, getNumberValue, return_result, AuthenticateApp } = await import(`file://${process.cwd()}/microservice/microservice.service.js`);
/**@type{import('../../microservice/registry.service.js')} */
const { MicroServiceServer } = await import(`file://${process.cwd()}/microservice/registry.service.js`);

/**
 * Starts the server
 */
const startserver = async () =>{
	const request = await MicroServiceServer('MAIL');
	request.server.createServer(request.options, (/**@type{import('../../types.js').microservice_req}*/req, /**@type{import('../../types.js').microservice_res}*/res) => {
		res.setHeader('Access-Control-Allow-Methods', 'POST');
		res.setHeader('Access-Control-Allow-Origin', '*');
		const URI_query = Buffer.from(req.url.substring(req.url.indexOf('?')), 'base64').toString('utf-8');
		const URI_path = req.url.substring(0, req.url.indexOf('?'));
		const app_query = new URLSearchParams(URI_query);
		
		req.query = {	app_id:	getNumberValue(app_query.get('app_id')),
						data: 	null};
		AuthenticateApp(req.query.app_id, req.headers.authorization).then((/**@type{boolean}*/authenticate)=>{
			if (authenticate){
				switch (true){
					case route('/mail/v1/mail/sendemail' , 'POST', URI_path, req.method):{
						if (app_query.get('email_host') && 
							getNumberValue(app_query.get('email_port')) && 
							getNumberValue(app_query.get('email_secure')) &&
							app_query.get('email_auth_user') && 
							app_query.get('email_auth_pass') &&
							app_query.get('email_from') &&
							app_query.get('email_to') && 
							app_query.get('email_subject') &&
							app_query.get('email_html')){
							/**@type{import('../../types.js').microservice_mail_data} */
							const data = {
								/**@ts-ignore */
								email_host:         app_query.get('email_host'),
								/**@ts-ignore */
								email_port:         getNumberValue(app_query.get('email_port')),
								/**@ts-ignore */
								email_secure:       getNumberValue(app_query.get('email_secure')),
								/**@ts-ignore */
								email_auth_user:    app_query.get('email_auth_user'),
								/**@ts-ignore */
								email_auth_pass:    app_query.get('email_auth_pass'),
								/**@ts-ignore */
								from:               app_query.get('email_from'),
								/**@ts-ignore */
								to:                 app_query.get('email_to'),
								/**@ts-ignore */
								subject:            app_query.get('email_subject'),
								/**@ts-ignore */
								html:               app_query.get('email_html')};
							service.sendEmail(data)
							.then((result)=>return_result(200, null, result, res))
							.catch((error) =>return_result(500, error, null, res));
						}
						else
							return_result(400, '⛔', null, res);
						break;
					}
					default:{
						return_result(401, '⛔', null, res);
					}
				}
			}
			else
				return_result(401, '⛔', null, res);
		});
		
	}).listen(request.port, ()=>{
		console.log(`MICROSERVICE MAIL PORT ${request.port} `);
	});

	process.on('uncaughtException', (err) =>{
		console.log(err);
	});
};
startserver();
export {startserver};