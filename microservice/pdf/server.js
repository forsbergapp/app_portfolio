/** @module microservice/pdf */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../types.js';

const service = await import('./service.js');
const { route, getNumberValue, return_result, MicroServiceServer } = await import(`file://${process.cwd()}/microservice/microservice.service.js`);
const { AuthenticateApp } = await import(`file://${process.cwd()}/server/iam.service.js`);
/**
 * Starts the server
 */
const startserver = async () =>{
	const request = await MicroServiceServer('PDF');
	request.server.createServer(request.options, (/**@type{Types.req_microservice}*/req, /**@type{Types.res_microservice}*/res) => {
		res.setHeader('Access-Control-Allow-Methods', 'GET');
		res.setHeader('Access-Control-Allow-Origin', '*');
		const URI_query = req.url.substring(req.url.indexOf('?'));
		const URI_path = req.url.substring(0, req.url.indexOf('?'));
		const app_query = new URLSearchParams(URI_query);
		/**@type{Types.microservice_data_pdf} */
		const data = {	ps:	app_query.get('ps') ?? '',
						hf:	(getNumberValue(app_query.get('hf'))==1) ?? false,
						/**@ts-ignore */
						url: Buffer.from(app_query.get('url'), 'base64').toString('utf-8') ?? ''};
		req.query = {	app_id:	getNumberValue(app_query.get('app_id')),
						data:	data};
		AuthenticateApp(req.query.app_id, req.headers.authorization).then((/**@type{boolean}*/authenticate)=>{
			if (authenticate){
				switch (true){
					case route('/pdf/v1' , 'GET', URI_path, req.method):{
						service.getPDF(req.query.data)
						.then((pdf)=>return_result(200, null, null, pdf, res))
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
		console.log(`MICROSERVICE PDF PORT ${request.port} `);
	});

	process.on('uncaughtException', (err) =>{
		console.log(err);
	});
};
startserver();
export {startserver};