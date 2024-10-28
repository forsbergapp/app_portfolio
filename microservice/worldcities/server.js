/** 
 * Microservice worldcities server
 * @module microservice/worldcities/server 
 */
/**
 * @import {microservice_req, microservice_res} from '../types.js'
 */

/**@type{import('./service.js')} */
const service = await import('./service.js');
/**@type{import('../../microservice/microservice.js')} */
const { MICROSERVICE_RESOURCE_ID_STRING, microserviceUtilResourceIdStringGet, microserviceRouteMatch, microserviceUtilNumberValue, microserviceResultReturn, iamAuthenticateApp} = await import(`file://${process.cwd()}/microservice/microservice.js`);
/**@type{import('../../microservice/registry.js')} */
const { registryMicroServiceServer } = await import(`file://${process.cwd()}/microservice/registry.js`);

/**
 * Starts the server
 * @function
 * @returns {Promise.<void>}
 */
const serverStart = async () =>{
	const request = await registryMicroServiceServer('WORLDCITIES');
	request.server.createServer(request.options, (/**@type{microservice_req}*/req, /**@type{microservice_res}*/res) => {
		res.setHeader('Access-Control-Allow-Methods', 'GET');
		res.setHeader('Access-Control-Allow-Origin', '*');
		const URI_query = Buffer.from(req.url.substring(req.url.indexOf('?')), 'base64').toString('utf-8');
		const URI_path = req.url.substring(0, req.url.indexOf('?'));
		const app_query = new URLSearchParams(URI_query);
		req.query = {	app_id:microserviceUtilNumberValue(app_query.get('app_id')),
						data:{	limit:	app_query.get('limit')?Number(app_query.get('limit')):0,
								search: app_query.get('search') ?? ''}
					};
		iamAuthenticateApp(req.query.app_id, req.headers.authorization).then((/**@type{boolean}*/authenticate)=>{
			if (authenticate){
				switch (true){
					case microserviceRouteMatch('/worldcities/v1/worldcities/city' , 'GET', URI_path, req.method):{
						service.getCitySearch(decodeURI(req.query.data.search), req.query.data.limit)
						.then((result)=>microserviceResultReturn(200, null, result, res))
						.catch((error) =>microserviceResultReturn(500, error, null, res));
						break;
					}
					case microserviceRouteMatch('/worldcities/v1/worldcities/city-random' , 'GET', URI_path, req.method):{
						service.getCityRandom()
						.then((result)=>microserviceResultReturn(200, null, result, res))
						.catch((error) =>microserviceResultReturn(500, error, null, res));
						break;
					}
					case microserviceRouteMatch(`/worldcities/v1/worldcities/country/${MICROSERVICE_RESOURCE_ID_STRING}` , 'GET', URI_path, req.method):{
						service.getCities(microserviceUtilResourceIdStringGet(URI_path))
						.then((result)=>microserviceResultReturn(200, null, result, res))
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
		console.log(`MICROSERVICE WORLDCITIES PORT ${request.port} `);
	});

	process.on('uncaughtException', (err) =>{
		console.log(err);
	});
};
serverStart();
export{serverStart};