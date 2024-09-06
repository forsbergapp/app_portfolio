/** @module microservice/batch/server */

/**@type{import('./service.js')} */
const service = await import('./service.js');
/**@type{import('../../microservice/microservice.service.js')} */
const { return_result, MicroServiceServer } = await import(`file://${process.cwd()}/microservice/microservice.service.js`);

/**
 * Starts the server
 */
const startserver = async () =>{
	
	const request = await MicroServiceServer('BATCH');
		
	request.server.createServer(request.options, (/**@type{import('../../types').req_microservice}*/req, /**@type{import('../../types').res_microservice}*/res) => {
		return_result(401, '⛔', null, res);
	}).listen(request.port, ()=>{
		console.log(`MICROSERVICE BATCH PORT ${request.port} `);
	});
	service.start_jobs();
	process.on('uncaughtException', (err) =>{
		console.log(err);
	});
};
startserver();
export {startserver};