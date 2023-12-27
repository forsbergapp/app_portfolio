/** @module microservice/worldcities */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../types.js';

const service = await import('./service.js');
const { getNumberValue, return_result, MicroServiceServer } = await import(`file://${process.cwd()}/microservice/microservice.service.js`);
const { AuthenticateApp } = await import(`file://${process.cwd()}/server/iam.service.js`);
/**
 * Starts the server
 */
const startserver = async () =>{
	const request = await MicroServiceServer('WORLDCITIES');
	request.server.createServer(request.options, (/**@type{Types.req_microservice}*/req, /**@type{Types.res_microservice}*/res) => {
		res.setHeader('Access-Control-Allow-Methods', 'GET');
		res.setHeader('Access-Control-Allow-Origin', '*');
		const query = new URLSearchParams(req.url.substring(req.url.indexOf('?')));
		req.query = {	app_id:getNumberValue(query.get('app_id')),
						data:{	limit:	query.get('limit')?Number(query.get('limit')):0,
								search: query.get('search') ?? '',
								country:query.get('country') ?? ''}
					};
		switch (true){
			case req.url.startsWith('/worldcities/city/search'):{
				AuthenticateApp(req.query.app_id, req.headers.authorization).then((/**@type{boolean}*/authenticate)=>{
					if (authenticate)
						service.getCitySearch(decodeURI(req.query.data.search), req.query.data.limit)
						.then((result)=>return_result(200, null, result, null, res))
						.catch((error) =>return_result(500, error, null, res));
					else
						return_result(401, '⛔', null, res);
				});
				break;
			}
			case req.url.startsWith('/worldcities/city/random'):{
				AuthenticateApp(req.query.app_id, req.headers.authorization).then((/**@type{boolean}*/authenticate)=>{
					if (authenticate)
						service.getCityRandom()
						.then((result)=>return_result(200, null, result, null, res))
						.catch((error) =>return_result(500, error, null, res));
					else
						return_result(401, '⛔', null, res);
				});
				break;
			}
			case req.url.startsWith('/worldcities/country'):{
				AuthenticateApp(req.query.app_id, req.headers.authorization).then((/**@type{boolean}*/authenticate)=>{
					if (authenticate)
						service.getCities(req.query.data.country)
						.then((result)=>return_result(200, null, result, null, res))
						.catch((error) =>return_result(500, error, null, res));
					else
						return_result(401, '⛔', null, res);
				});
				break;
			}
			default:
				res.end();
				break;
		}

	}).listen(request.port, ()=>{
		console.log(`MICROSERVICE WORLDCITIES PORT ${request.port} `);
	});

	process.on('uncaughtException', (err) =>{
		console.log(err);
	});
};
startserver();
export{startserver};