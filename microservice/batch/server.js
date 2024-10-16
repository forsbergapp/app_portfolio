/** @module microservice/batch/server */

/**@type{import('./service.js')} */
const service = await import('./service.js');
/**@type{import('../../microservice/microservice.js')} */
const { microserviceResultReturn } = await import(`file://${process.cwd()}/microservice/microservice.js`);
/**@type{import('../../microservice/registry.js')} */
const { MicroServiceServer } = await import(`file://${process.cwd()}/microservice/registry.js`);


/**
 * Starts the server
 */
const serverStart = async () =>{
	
	const request = await MicroServiceServer('BATCH');
		
	request.server.createServer(request.options, (/**@type{import('../types').microservice_req}*/req, /**@type{import('../types').microservice_res}*/res) => {
		microserviceResultReturn(401, '⛔', null, res);
	}).listen(request.port, ()=>{
		console.log(`MICROSERVICE BATCH PORT ${request.port} `);
	});
	service.start_jobs();
	process.on('uncaughtException', (err) =>{
		console.log(err);
	});
};
serverStart();
export {serverStart};