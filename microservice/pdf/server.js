/** @module microservice/pdf */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../types.js';

const service = await import('./service.js');
const { getNumberValue, return_result, MicroServiceServer } = await import(`file://${process.cwd()}/microservice/microservice.service.js`);
const { AuthenticateApp } = await import(`file://${process.cwd()}/server/iam.service.js`);
/**
 * Starts the server
 */
const startserver = async () =>{
	const request = await MicroServiceServer('PDF');
	request.server.createServer(request.options, (/**@type{Types.req_microservice}*/req, /**@type{Types.res_microservice}*/res) => {
		res.setHeader('Access-Control-Allow-Methods', 'GET');
		res.setHeader('Access-Control-Allow-Origin', '*');
		const query = new URLSearchParams(req.url.substring(req.url.indexOf('?')));
		/**@type{Types.microservice_data_pdf} */
		const data = {	ps:	query.get('ps') ?? '',
						hf:	getNumberValue(query.get('hf')) ?? false,
						url:query.get('url') ?? ''};
		req.query = {	app_id:	getNumberValue(query.get('app_id')),
						data:	data};
		switch (req.url.substring(0, req.url.indexOf('?'))){
			case '/pdf':{
				AuthenticateApp(req.query.app_id, req.headers.authorization).then((/**@type{boolean}*/authenticate)=>{
					if (authenticate)
						service.getPDF(req.query.data)
						.then((pdf)=>return_result(200, null, null, pdf, res))
						.catch((error) =>return_result(500, error, null, res));
					else
						return_result(401, '⛔', null, null, res);
				});
				break;
			}
		}
		
	}).listen(request.port, ()=>{
		console.log(`MICROSERVICE PDF PORT ${request.port} `);
	});

	process.on('uncaughtException', (err) =>{
		console.log(err);
	});
};
startserver();
export {startserver};