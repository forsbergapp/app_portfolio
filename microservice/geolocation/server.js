/** @module microservice/geolocation/server */

/**@type{import('./service.js')} */
const service = await import('./service.js');
/**@type{import('../../microservice/microservice.js')} */
const { microserviceRouteMatch, microserviceUtilNumberValue, microserviceResultReturn, iamAppAuthenticate } = await import(`file://${process.cwd()}/microservice/microservice.js`);
/**@type{import('../../microservice/registry.js')} */
const { MicroServiceServer } = await import(`file://${process.cwd()}/microservice/registry.js`);


/**
 * Starts the server
 */
const serverStart = async () =>{
	const request = await MicroServiceServer('GEOLOCATION');
	request.server.createServer(request.options, (/**@type{import('../types.js').microservice_req}*/req, /**@type{import('../types.js').microservice_res}*/res) => {
		res.setHeader('Access-Control-Allow-Methods', 'GET');
		res.setHeader('Access-Control-Allow-Origin', '*');
		const URI_query = Buffer.from(req.url.substring(req.url.indexOf('?')), 'base64').toString('utf-8');
		const URI_path = req.url.substring(0, req.url.indexOf('?'));
		const app_query = new URLSearchParams(URI_query);
		/**@type{import('./types.js').microservice_geolocation_data} */
		const data = {	latitude:	app_query.get('latitude') ?? '',
						longitude:	app_query.get('longitude') ?? '',
						ip: 		app_query.get('ip')};
		req.query = {	app_id:	microserviceUtilNumberValue(app_query.get('app_id')),
						data:	data};
		iamAppAuthenticate(req.query.app_id, req.headers.authorization).then((/**@type{boolean}*/authenticate)=>{
			if (authenticate){
				switch (true){
					case microserviceRouteMatch('/geolocation/v1/geolocation/place' , 'GET', URI_path, req.method):{
						service.getPlace(req.query.data.latitude, req.query.data.longitude, req.headers['accept-language'])
						.then((result)=>microserviceResultReturn(200, null, JSON.parse(result), res))
						.catch((error) =>microserviceResultReturn(500, error, null, res));
						break;
					}
					case microserviceRouteMatch('/geolocation/v1/geolocation/ip' , 'GET', URI_path, req.method):{
						service.getIp(req.query.data.ip, req.headers['accept-language'])
						.then((result)=>microserviceResultReturn(200, null, JSON.parse(result), res))
						.catch((error) =>microserviceResultReturn(500, error, null, res));
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
	}).listen(request.port, ()=>{
		console.log(`MICROSERVICE GEOLOCATION PORT ${request.port} `);
	});

	process.on('uncaughtException', (err) =>{
		console.log(err);
	});
};
serverStart();
export {serverStart};