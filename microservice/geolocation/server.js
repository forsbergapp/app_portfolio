/** @module microservice/geolocation */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../types.js';

const service = await import('./service.js');
const { route, getNumberValue, return_result, MicroServiceServer } = await import(`file://${process.cwd()}/microservice/microservice.service.js`);
const { AuthenticateApp } = await import(`file://${process.cwd()}/server/iam.service.js`);
/**
 * Starts the server
 */
const startserver = async () =>{
	const request = await MicroServiceServer('GEOLOCATION');
	request.server.createServer(request.options, (/**@type{Types.req_microservice}*/req, /**@type{Types.res_microservice}*/res) => {
		res.setHeader('Access-Control-Allow-Methods', 'GET');
		res.setHeader('Access-Control-Allow-Origin', '*');
		const URI_query = req.url.substring(req.url.indexOf('?'));
		const URI_path = req.url.substring(0, req.url.indexOf('?'));
		const app_query = new URLSearchParams(URI_query);
		/**@type{Types.microservice_data_geolocation} */
		const data = {	latitude:	app_query.get('latitude') ?? '',
						longitude:	app_query.get('longitude') ?? '',
						ip: 		app_query.get('ip')};
		req.query = {	app_id:	getNumberValue(app_query.get('app_id')),
						data:	data};
		AuthenticateApp(req.query.app_id, req.headers.authorization).then((/**@type{boolean}*/authenticate)=>{
			if (authenticate){
				switch (true){
					case route('/geolocation/v1/geolocation/place' , 'GET', URI_path, req.method):{
						service.getPlace(req.query.data.latitude, req.query.data.longitude, req.headers['accept-language'])
						.then((result)=>return_result(200, null, JSON.parse(result), null, res))
						.catch((error) =>return_result(500, error, null, null, res));
						break;
					}
					case route('/geolocation/v1/geolocation/ip' , 'GET', URI_path, req.method):{
						service.getIp(req.query.data.ip, req.headers['accept-language'])
						.then((result)=>return_result(200, null, JSON.parse(result), null, res))
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
		console.log(`MICROSERVICE GEOLOCATION PORT ${request.port} `);
	});

	process.on('uncaughtException', (err) =>{
		console.log(err);
	});
};
startserver();
export {startserver};