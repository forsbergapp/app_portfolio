/** 
 * Microservice batch server
 * @module serviceregistry/microservice/batch/server 
 */

/**
 * @import {microservice_req, microservice_res} from '../../types.js'
 */

const service = await import('./service.js');
const { microserviceResultReturn } = await import('../../microservice.js');
const { registryMicroServiceServer } = await import('../../registry.js');

class ClassServerProcess {
    cwd = () => process.cwd();
    /**
     * @param {string|symbol} event
     * @param {(...args: any[]) => void} listener
     */
    on = (event, listener) => process.on(event, listener);
    env = process.env;
}
const serverProcess = new ClassServerProcess();
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
	serverProcess.on('uncaughtException', (err) =>{
		console.log(err);
	});
};
serverStart();
export {serverStart, serverProcess};