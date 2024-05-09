/** @module microservice/mail */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../types.js';

const service = await import('./service.js');
const { route, getNumberValue, return_result, MicroServiceServer } = await import(`file://${process.cwd()}/microservice/microservice.service.js`);
const { AuthenticateApp } = await import(`file://${process.cwd()}/server/iam.service.js`);
/**
 * Starts the server
 */
const startserver = async () =>{
	const request = await MicroServiceServer('MAIL');
	request.server.createServer(request.options, (/**@type{Types.req_microservice}*/req, /**@type{Types.res_microservice}*/res) => {
		res.setHeader('Access-Control-Allow-Methods', 'POST');
		res.setHeader('Access-Control-Allow-Origin', '*');
		const URI_query = req.url.substring(req.url.indexOf('?'));
		const URI_path = req.url.substring(0, req.url.indexOf('?'));
		const app_query = new URLSearchParams(URI_query);
		/**@type{Types.microservice_data_mail} */
		const data = {
						email_host:         app_query.get('email_host') ?? '',
						email_port:         getNumberValue(app_query.get('email_port')),
						email_secure:       getNumberValue(app_query.get('email_secure')),
						email_auth_user:    app_query.get('email_auth_user') ?? '',
						email_auth_pass:    app_query.get('email_auth_pass') ?? '',
						from:               app_query.get('email_from') ?? '',
						to:                 app_query.get('email_to') ?? '',
						subject:            app_query.get('email_subject') ?? '',
						html:               app_query.get('email_html') ?? ''};
		req.query = {	app_id:	getNumberValue(app_query.get('app_id')),
						data:	data};
		AuthenticateApp(req.query.app_id, req.headers.authorization).then((/**@type{boolean}*/authenticate)=>{
			if (authenticate){
				switch (true){
					case route('/mail/v1/mail/sendemail' , 'POST', URI_path, req.method):{
						req.query.data = app_query.get('data') ?? '';
						service.sendEmail(req.query.data)
						.then((result)=>return_result(200, null, result, null, res))
						.catch((error) =>return_result(500, error, null, null, res));
						break;
					}
					default:{
						return_result(401, '⛔', null, null, res);
					}
				}
			}
			else
				return_result(401, '⛔', null, null, res);
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