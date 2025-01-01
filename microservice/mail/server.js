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
 * @name serverStart
 * @description Starts the server
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
		const read_body = async () =>{
			return new Promise((resolve,reject)=>{
				let body= '';
				/**@ts-ignore */
				req.on('data', chunk =>{
					body += chunk.toString();
				});
				/**@ts-ignore */
				req.on('end', ()=>{
					try {
						req.body = JSON.parse(body);
						resolve(null);
					} catch (error) {
						/**@ts-ignore */
						req.body = {};
						reject(null);
					}
					
				});
			});
			
		};
		read_body()
		.then(()=>{
			iamAuthenticateApp(req.query.app_id, req.headers.authorization).then((/**@type{boolean}*/authenticate)=>{
				if (authenticate){
					switch (true){
						case microserviceRouteMatch('/api/v1/mail/sendemail' , 'POST', URI_path, req.method):{
							if (req.body.email_host && 
								microserviceUtilNumberValue(req.body.email_port) && 
								microserviceUtilNumberValue(req.body.email_secure) &&
								req.body.email_auth_user && 
								req.body.email_auth_pass &&
								req.body.email_from &&
								req.body.email_to && 
								req.body.email_subject &&
								req.body.email_html){
								/**@type{import('./types.js').microservice_mail_data} */
								const data = {
									email_host:         req.body.email_host,
									/**@ts-ignore */
									email_port:         microserviceUtilNumberValue(req.body.email_port),
									/**@ts-ignore */
									email_secure:       microserviceUtilNumberValue(req.body.email_secure),
									email_auth_user:    req.body.email_auth_user,
									email_auth_pass:    req.body.email_auth_pass,
									from:               req.body.email_from,
									to:                 req.body.email_to,
									subject:            req.body.email_subject,
									html:               req.body.email_html};
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