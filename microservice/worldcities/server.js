/** @module microservice/worldcities/server */

/**@type{import('./service.js')} */
const service = await import('./service.js');
/**@type{import('../../microservice/microservice.service.js')} */
const { resource_id_string, resource_id_get_string, route, getNumberValue, return_result, AuthenticateApp} = await import(`file://${process.cwd()}/microservice/microservice.service.js`);
/**@type{import('../../microservice/registry.service.js')} */
const { MicroServiceServer } = await import(`file://${process.cwd()}/microservice/registry.service.js`);

/**
 * Starts the server
 */
const startserver = async () =>{
	const request = await MicroServiceServer('WORLDCITIES');
	request.server.createServer(request.options, (/**@type{import('../../types.js').req_microservice}*/req, /**@type{import('../../types.js').res_microservice}*/res) => {
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
						.then((result)=>return_result(200, null, result, res))
						.catch((error) =>return_result(500, error, null, res));
						break;
					}
					case route('/worldcities/v1/worldcities/city-random' , 'GET', URI_path, req.method):{
						service.getCityRandom()
						.then((result)=>return_result(200, null, result, res))
						.catch((error) =>return_result(500, error, null, res));
						break;
					}
					case route(`/worldcities/v1/worldcities/country/${resource_id_string}` , 'GET', URI_path, req.method):{
						service.getCities(resource_id_get_string(URI_path))
						.then((result)=>return_result(200, null, result, res))
						.catch((error) =>return_result(500, error, null, res));
						break;
					}
					default:{
						return_result(401, '⛔', null, res);
					}
				}
			}
			else
				return_result(401, '⛔', null, res);
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