/** @module microservice/batch */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../types.js';

const service = await import('./service.js');
const { return_result, MicroServiceServer } = await import(`file://${process.cwd()}/microservice/microservice.service.js`);

/**
 * Starts the server
 */
const startserver = async () =>{
	
	const request = await MicroServiceServer('BATCH');
		
	request.server.createServer(request.options, (/**@type{Types.req_microservice}*/req, /**@type{Types.res_microservice}*/res) => {
		return_result(401, '⛔', null, null, res);
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