/** 
 * Microservice mail server
 * @module microservice/mail/server 
 */

/**
 * @import {microservice_req, microservice_res} from '../types.js'
 */

/**@type{import('./service.js')} */
const service = await import('./service.js');
/**@type{import('../../microservice/microservice.js')} */
const { microserviceRouteMatch, microserviceUtilNumberValue, microserviceResultReturn, iamAuthenticateApp } = await import(`file://${process.cwd()}/microservice/microservice.js`);
/**@type{import('../../microservice/registry.js')} */
const { registryMicroServiceServer } = await import(`file://${process.cwd()}/microservice/registry.js`);

/**
 * Starts the server
 * @function
 * @returns {Promise.<void>}
 */
const serverStart = async () =>{
	const request = await registryMicroServiceServer('MAIL');
	request.server.createServer(request.options, (/**@type{microservice_req}*/req, /**@type{microservice_res}*/res) => {
		res.setHeader('Access-Control-Allow-Methods', 'POST');
		res.setHeader('Access-Control-Allow-Origin', '*');
		const URI_query = Buffer.from(req.url.substring(req.url.indexOf('?')), 'base64').toString('utf-8');
		const URI_path = req.url.substring(0, req.url.indexOf('?'));
		const app_query = new URLSearchParams(URI_query);
		
		req.query = {	app_id:	microserviceUtilNumberValue(app_query.get('app_id')),
						data: 	null};
		iamAuthenticateApp(req.query.app_id, req.headers.authorization).then((/**@type{boolean}*/authenticate)=>{
			if (authenticate){
				switch (true){
					case microserviceRouteMatch('/mail/v1/mail/sendemail' , 'POST', URI_path, req.method):{
						if (app_query.get('email_host') && 
							microserviceUtilNumberValue(app_query.get('email_port')) && 
							microserviceUtilNumberValue(app_query.get('email_secure')) &&
							app_query.get('email_auth_user') && 
							app_query.get('email_auth_pass') &&
							app_query.get('email_from') &&
							app_query.get('email_to') && 
							app_query.get('email_subject') &&
							app_query.get('email_html')){
							/**@type{import('./types.js').microservice_mail_data} */
							const data = {
								/**@ts-ignore */
								email_host:         app_query.get('email_host'),
								/**@ts-ignore */
								email_port:         microserviceUtilNumberValue(app_query.get('email_port')),
								/**@ts-ignore */
								email_secure:       microserviceUtilNumberValue(app_query.get('email_secure')),
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
							.then((result)=>microserviceResultReturn(200, null, result, res))
							.catch((error) =>microserviceResultReturn(500, error, null, res));
						}
						else
							microserviceResultReturn(400, '⛔', null, res);
						break;
					}
					default:{
						microserviceResultReturn(401, '⛔', null, res);
					}
				}
			}
			else
				microserviceResultReturn(401, '⛔', null, res);
		});
		
	}).listen(request.port, ()=>{
		console.log(`MICROSERVICE MAIL PORT ${request.port} `);
	});

	process.on('uncaughtException', (err) =>{
		console.log(err);
	});
};
serverStart();
export {serverStart};