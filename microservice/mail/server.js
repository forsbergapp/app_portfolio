/** @module microservice/mail */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../types.js';

const service = await import('./service.js');
const { getNumberValue, return_result, MicroServiceServer } = await import(`file://${process.cwd()}/microservice/microservice.service.js`);
const { AuthenticateApp } = await import(`file://${process.cwd()}/server/iam.service.js`);
/**
 * Starts the server
 */
const startserver = async () =>{
	const request = await MicroServiceServer('MAIL');
	request.server.createServer(request.options, (/**@type{Types.req_microservice}*/req, /**@type{Types.res_microservice}*/res) => {
		res.setHeader('Access-Control-Allow-Methods', 'GET');
		res.setHeader('Access-Control-Allow-Origin', '*');
		const query = new URLSearchParams(req.url.substring(req.url.indexOf('?')));
		/**@type{Types.microservice_data_mail} */
		const data = {
						email_host:         query.get('email_host') ?? '',
						email_port:         getNumberValue(query.get('email_port')),
						email_secure:       getNumberValue(query.get('email_secure')),
						email_auth_user:    query.get('email_auth_user') ?? '',
						email_auth_pass:    query.get('email_auth_pass') ?? '',
						from:               query.get('email_from') ?? '',
						to:                 query.get('email_to') ?? '',
						subject:            query.get('email_subject') ?? '',
						html:               query.get('email_html') ?? ''};
		req.query = {	app_id:	getNumberValue(query.get('app_id')),
						data:	data};
		switch (req.url.substring(0, req.url.indexOf('?'))){
			case '/mail/sendemail':{
				req.query.data = query.get('data') ?? '';
				AuthenticateApp(req.query.app_id, req.headers.authorization).then((/**@type{boolean}*/authenticate)=>{
					if (authenticate)
						service.sendEmail(req.query.data)
						.then((result)=>return_result(200, null, result, null, res))
						.catch((error) =>return_result(500, error, null, null, res));
					else
						return_result(401, '⛔', null, null, res);
				});
				break;
			}
			default:{
				res.end();
			}
		}
		
	}).listen(request.port, ()=>{
		console.log(`MICROSERVICE MAIL PORT ${request.port} `);
	});

	process.on('uncaughtException', (err) =>{
		console.log(err);
	});
};
startserver();
export {startserver};