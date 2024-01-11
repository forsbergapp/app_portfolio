/** @module microservice/geolocation */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../types.js';

const service = await import('./service.js');
const { getNumberValue, return_result, MicroServiceServer } = await import(`file://${process.cwd()}/microservice/microservice.service.js`);
const { AuthenticateApp } = await import(`file://${process.cwd()}/server/iam.service.js`);
/**
 * Starts the server
 */
const startserver = async () =>{
	const request = await MicroServiceServer('GEOLOCATION');
	request.server.createServer(request.options, (/**@type{Types.req_microservice}*/req, /**@type{Types.res_microservice}*/res) => {
		res.setHeader('Access-Control-Allow-Methods', 'GET');
		res.setHeader('Access-Control-Allow-Origin', '*');
		const query = new URLSearchParams(req.url.substring(req.url.indexOf('?')));
		/**@type{Types.microservice_data_geolocation} */
		const data = {	latitude:	query.get('latitude') ?? '',
						longitude:	query.get('longitude') ?? '',
						ip: 		query.get('ip')};
		req.query = {	app_id:	getNumberValue(query.get('app_id')),
						data:	data};
		switch (req.method + '_' + req.url.substring(0, req.url.indexOf('?'))){
			case 'GET_/geolocation/place':{
				AuthenticateApp(req.query.app_id, req.headers.authorization).then((/**@type{boolean}*/authenticate)=>{
					if (authenticate)
						service.getPlace(req.query.data.latitude, req.query.data.longitude, req.headers['accept-language'])
						.then((result)=>return_result(200, null, JSON.parse(result), null, res))
						.catch((error) =>return_result(500, error, null, null, res));
					else
						return_result(401, '⛔', null, null, res);
				});
				break;
			}
			case 'GET_/geolocation/ip':{
				AuthenticateApp(req.query.app_id, req.headers.authorization).then((/**@type{boolean}*/authenticate)=>{
					if (authenticate)
						service.getIp(req.query.data.ip, req.headers['accept-language'])
						.then((result)=>return_result(200, null, JSON.parse(result), null, res))
						.catch((error) =>return_result(500, error, null, null, res));
					else
						return_result(401, '⛔', null, null, res);
				});
				break;
			}
			default:{
				return_result(401, '⛔', null, null, res);
			}
		}
		
	}).listen(request.port, ()=>{
		console.log(`MICROSERVICE GEOLOCATION PORT ${request.port} `);
	});

	process.on('uncaughtException', (err) =>{
		console.log(err);
	});
};
startserver();
export {startserver};