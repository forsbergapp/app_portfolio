/** 
 * Microservice batch server
 * @module serviceregistry/microservice/batch/server 
 */

/**
 * @import {request, response} from './types.js'
 */

const service = await import('./service.js');
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
    const fs = await import('node:fs');
    const ServiceRegistry = await registryConfigServices('BATCH');
   
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