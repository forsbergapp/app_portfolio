/** 
 * Microservice batch server
 * @module serviceregistry/microservice/batch/server 
 */

/**
 * @import {request, response} from './types.js'
 */

const service = await import('./service.js');
const { registryMicroServiceServer } = await import('../../registry.js');

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
    env = process.env;
}
const serverProcess = new ClassServerProcess();

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
	
	const request = await registryMicroServiceServer('BATCH');
		
	request.server.createServer(request.options, (/**@type{request}*/req, /**@type{response}*/res) => {
		serverReturn(401, '⛔', null, res);
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