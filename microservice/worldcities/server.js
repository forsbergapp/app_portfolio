/** @module microservice/worldcities */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../types.js';

const service = await import('./service.js');
const { resource_id_string, resource_id_get, route, getNumberValue, return_result, MicroServiceServer } = await import(`file://${process.cwd()}/microservice/microservice.service.js`);
const { AuthenticateApp } = await import(`file://${process.cwd()}/server/iam.service.js`);
/**
 * Starts the server
 */
const startserver = async () =>{
	const request = await MicroServiceServer('WORLDCITIES');
	request.server.createServer(request.options, (/**@type{Types.req_microservice}*/req, /**@type{Types.res_microservice}*/res) => {
		res.setHeader('Access-Control-Allow-Methods', 'GET');
		res.setHeader('Access-Control-Allow-Origin', '*');
		const URI_query = Buffer.from(req.url.substring(req.url.indexOf('?')), 'base64').toString('utf-8');
		const URI_path = req.url.substring(0, req.url.indexOf('?'));
		const app_query = new URLSearchParams(URI_query);
		req.query = {	app_id:getNumberValue(app_query.get('app_id')),
						data:{	limit:	app_query.get('limit')?Number(app_query.get('limit')):0,
								search: app_query.get('search') ?? ''}
					};
		AuthenticateApp(req.query.app_id, req.headers.authorization).then((/**@type{boolean}*/authenticate)=>{
			if (authenticate){
				switch (true){
					case route('/worldcities/v1/worldcities/city' , 'GET', URI_path, req.method):{
						service.getCitySearch(decodeURI(req.query.data.search), req.query.data.limit)
						.then((result)=>return_result(200, null, result, null, res))
						.catch((error) =>return_result(500, error, null, null, res));
						break;
					}
					case route('/worldcities/v1/worldcities/city-random' , 'GET', URI_path, req.method):{
						service.getCityRandom()
						.then((result)=>return_result(200, null, result, null, res))
						.catch((error) =>return_result(500, error, null, null, res));
						break;
					}
					case route(`/worldcities/v1/worldcities/country/${resource_id_string}` , 'GET', URI_path, req.method):{
						service.getCities(resource_id_get(URI_path))
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
		console.log(`MICROSERVICE WORLDCITIES PORT ${request.port} `);
	});

	process.on('uncaughtException', (err) =>{
		console.log(err);
	});
};
startserver();
export{startserver};