/** @module server/express/service/batch */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../types.js';

const service = await import('./service.js');
const { MicroserviceServer } = await import(`file://${process.cwd()}/service/service.service.js`);

/**
 * Starts the server
 */
const startserver = async () =>{
	
	const request = await MicroserviceServer('BATCH');
		
	request.server.createServer(request.options, (/**@type{Types.req_service}*/req, /**@type{Types.res_service}*/res) => {
		res.statusCode = 401;
		res.write('⛔', 'utf-8');
		res.end();
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