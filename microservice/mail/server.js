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
							if (req.body.host && 
								microserviceUtilNumberValue(req.body.port) && 
								microserviceUtilNumberValue(req.body.secure) &&
								req.body.auth_user && 
								req.body.auth_pass &&
								req.body.from &&
								req.body.to && 
								req.body.subject &&
								req.body.html){
								/**@type{import('./types.js').microservice_mail_data} */
								const data = {
									email_host:         req.body.host,
									/**@ts-ignore */
									email_port:         microserviceUtilNumberValue(req.body.port),
									/**@ts-ignore */
									email_secure:       microserviceUtilNumberValue(req.body.secure),
									email_auth_user:    req.body.auth_user,
									email_auth_pass:    req.body.auth_pass,
									from:               req.body.from,
									to:                 req.body.to,
									subject:            req.body.subject,
									html:               req.body.html};
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