/** 
 * Microservice geolocation server
 * @module serviceregistry/microservice/geolocation/server 
 */

/**
 * @import {request, response, geolocation_data} from './types.js'
 */

const service = await import('./service.js');
const {iamAuthenticateApp } = await import('../../microservice.js');
const { registryConfigServices } = await import('../../registry.js');

/**
 * @name ClassServerProcess
 * @description process methods
 * @class
 */
class ClassServerProcess {
    cwd = () => process.cwd();
    /**
     * @param {string|symbol} event
     * @param {(...args: any[]) => void} listener
     */
    on = (event, listener) => process.on(event, listener);
}
const serverProcess = new ClassServerProcess();

/**
 * @name serverRoute
 * @description Route match
 * @function
 * @param {string} route_path
 * @param {string} route_method
 * @param {string} request_path
 * @param {string} request_method 
 * @returns {boolean}
 */
const serverRoute = (route_path, route_method, request_path , request_method) => 
    (route_path.indexOf('/:RESOURCE_ID')>-1?route_path. replace('/:RESOURCE_ID', request_path.substring(request_path.lastIndexOf('/'))):route_path) == request_path && 
     route_method == request_method;
  
/**
 * @name serverReturn
 * @description Return result
 * @function
 * @param {number} code 
 * @param {string|null} error 
 * @param {*} result 
 * @param {response} res
 * @returns {void}
 */
const serverReturn = (code, error, result, res)=>{
    res.statusCode = code;
    if (error){
        console.log(error);
        //ISO20022 error format
        const message = JSON.stringify({error:{
                                        http:code, 
                                        code:'MICROSERVICE',
                                        text:error, 
                                        developer_text:null, 
                                        more_info:null}});
        res.write(message, 'utf8');
    }
    else{
        res.setHeader('Content-Type',  'application/json; charset=utf-8');
        res.write(JSON.stringify(result), 'utf8');
    }
    res.end();
};

/**
 * @name serverStart
 * @description Starts the server
 * @function
 * @returns {Promise.<void>}
 */
const serverStart = async () =>{
    const fs = await import('node:fs');
    const ServiceRegistry = await registryConfigServices('GEOLOCATION');
   
    const request = ServiceRegistry?.https_enable==1?
                        {
                            server  : await import('node:https'),
                            port	: ServiceRegistry.https_port,
                            options : {
                                key: ServiceRegistry.https_key?
                                        await fs.promises.readFile(serverProcess.cwd() + ServiceRegistry.https_key, 'utf8'):
                                            null,
                                cert: ServiceRegistry.https_key?
                                        await fs.promises.readFile(serverProcess.cwd() + ServiceRegistry.https_cert, 'utf8'):
                                            null
                            }
                        }:
                        {
                            server  : await import('node:http'),
                            port 	: ServiceRegistry.port
                        };
	request.server.createServer(request.options, (/**@type{request}*/req, /**@type{response}*/res) => {
		res.setHeader('Access-Control-Allow-Methods', 'GET');
		res.setHeader('Access-Control-Allow-Origin', '*');
		const URI_query = Buffer.from(req.url.substring(req.url.indexOf('?')), 'base64').toString('utf-8');
		const URI_path = req.url.substring(0, req.url.indexOf('?'));
		const app_query = new URLSearchParams(URI_query);
		/**@type{geolocation_data} */
		const data = {	latitude:	app_query.get('latitude') ?? '',
						longitude:	app_query.get('longitude') ?? '',
						ip: 		app_query.get('ip')};
		req.query = {	app_id:	    (app_query.get('app_id')==null||app_query.get('app_id')===undefined||app_query.get('app_id')==='')?
                                        null:
                                            Number(app_query.get('app_id')),
						data:	data};
		iamAuthenticateApp(req.query.app_id, req.headers.authorization).then((/**@type{boolean}*/authenticate)=>{
			if (authenticate){
				switch (true){
					case serverRoute('/api/v1/geolocation/place' , 'GET', URI_path, req.method):{
						if(	(req.query.data.latitude !=null && req.query.data.latitude!='') ||
							(req.query.data.longitude !=null && req.query.data.longitude!='')){
							service.getPlace(req.query.data.latitude, req.query.data.longitude, req.headers['accept-language'])
							.then((result)=>result?.length>0?serverReturn(200, null, JSON.parse(result), res):'')
							.catch((error) =>serverReturn(500, error, null, res));
						}
						else
							serverReturn(400, '⛔', null, res);
						break;
					}
					case serverRoute('/api/v1/geolocation/ip' , 'GET', URI_path, req.method):{
						//no v6 support
						service.getIp(req.query.data.ip.replace('::ffff:',''), req.headers['accept-language'])
						.then((result)=>serverReturn(200, null, JSON.parse(result), res))
						.catch((error) =>serverReturn(500, error, null, res));
						break;
					}
					default:{
						serverReturn(401, '⛔', null, res);
					}
				}
			}
			else
				serverReturn(401, '⛔', null, res);
		});
	}).listen(request.port, ()=>{
		console.log(`MICROSERVICE GEOLOCATION PORT ${request.port} `);
	});

	serverProcess.on('uncaughtException', (err) =>{
		console.log(err);
	});
};
serverStart();
export {serverStart, serverProcess};