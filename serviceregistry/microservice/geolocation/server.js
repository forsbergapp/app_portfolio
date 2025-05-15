/** 
 * Microservice geolocation server
 * @module serviceregistry/microservice/geolocation/server 
 */

/**
 * @import {microservice_geolocation_data} from './types.js'
 * @import {microservice_req, microservice_res} from '../types.js'
 */

/**@type{import('./service.js')} */
const service = await import('./service.js');
/**@type{import('../../microservice.js')} */
const { microserviceRouteMatch, microserviceUtilNumberValue, microserviceResultReturn, iamAuthenticateApp } = await import(`file://${process.cwd()}/serviceregistry/microservice.js`);
/**@type{import('../../registry.js')} */
const { registryMicroServiceServer } = await import(`file://${process.cwd()}/serviceregistry/registry.js`);


/**
 * @name serverStart
 * @description Starts the server
 * @function
 * @returns {Promise.<void>}
 */
const serverStart = async () =>{
	const request = await registryMicroServiceServer('GEOLOCATION');
	request.server.createServer(request.options, (/**@type{microservice_req}*/req, /**@type{microservice_res}*/res) => {
		res.setHeader('Access-Control-Allow-Methods', 'GET');
		res.setHeader('Access-Control-Allow-Origin', '*');
		const URI_query = Buffer.from(req.url.substring(req.url.indexOf('?')), 'base64').toString('utf-8');
		const URI_path = req.url.substring(0, req.url.indexOf('?'));
		const app_query = new URLSearchParams(URI_query);
		/**@type{microservice_geolocation_data} */
		const data = {	latitude:	app_query.get('latitude') ?? '',
						longitude:	app_query.get('longitude') ?? '',
						ip: 		app_query.get('ip')};
		req.query = {	app_id:	microserviceUtilNumberValue(app_query.get('app_id')),
						data:	data};
		iamAuthenticateApp(req.query.app_id, req.headers.authorization).then((/**@type{boolean}*/authenticate)=>{
			if (authenticate){
				switch (true){
					case microserviceRouteMatch('/api/v1/geolocation/place' , 'GET', URI_path, req.method):{
						if(	(req.query.data.latitude !=null && req.query.data.latitude!='') ||
							(req.query.data.longitude !=null && req.query.data.longitude!='')){
							service.getPlace(req.query.data.latitude, req.query.data.longitude, req.headers['accept-language'])
							.then((result)=>result?.length>0?microserviceResultReturn(200, null, JSON.parse(result), res):'')
							.catch((error) =>microserviceResultReturn(500, error, null, res));
						}
						else
							microserviceResultReturn(400, '⛔', null, res);
						break;
					}
					case microserviceRouteMatch('/api/v1/geolocation/ip' , 'GET', URI_path, req.method):{
						//no v6 support
						service.getIp(req.query.data.ip.replace('::ffff:',''), req.headers['accept-language'])
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