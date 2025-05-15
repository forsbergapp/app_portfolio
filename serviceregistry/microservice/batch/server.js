/** 
 * Microservice batch server
 * @module serviceregistry/microservice/batch/server 
 */

/**
 * @import {microservice_req, microservice_res} from '../types.js'
 */

/**@type{import('./service.js')} */
const service = await import('./service.js');
/**@type{import('../microservice.js')} */
const { microserviceResultReturn } = await import(`file://${process.cwd()}/serviceregistry/microservice/microservice.js`);
/**@type{import('../registry.js')} */
const { registryMicroServiceServer } = await import(`file://${process.cwd()}/serviceregistry/microservice/registry.js`);


/**
 * @name serverStart
 * @description Starts the server
 * @function
 * @returns {Promise.<void>}
 */
const serverStart = async () =>{
	
	const request = await registryMicroServiceServer('BATCH');
		
	request.server.createServer(request.options, (/**@type{microservice_req}*/req, /**@type{microservice_res}*/res) => {
		microserviceResultReturn(401, '⛔', null, res);
	}).listen(request.port, ()=>{
		console.log(`MICROSERVICE BATCH PORT ${request.port} `);
	});
	service.startJobs();
	process.on('uncaughtException', (err) =>{
		console.log(err);
	});
};
serverStart();
export {serverStart};