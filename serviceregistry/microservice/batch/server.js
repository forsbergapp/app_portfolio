/** 
 * Microservice batch server
 * @module serviceregistry/microservice/batch/server 
 */

/**
 * @import {config, request, response} from './types.js'
 */

const service = await import('./service.js');

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
    /**@type{config} */
    const Config = JSON.parse(await fs.promises.readFile(serverProcess.cwd() + '/data/microservice/GEOLOCATION.json', 'utf8'));
   //request token from service registry
    /**
     * @type{{  token:string,
     *           exp:number,
     *           iat:number}}
     */
    const result = await service.requestUrl({   url:Config.service_registry_auth_url, 
        method:Config.service_registry_auth_method, 
        body:{data:Buffer.from(JSON.stringify(
                                    {
                                    id:null,
                                    message:Crypto.publicEncrypt(  Config.public_key,
                                            Buffer.from(JSON.stringify({message:null}))).toString('base64')
                                    })).toString('base64')
            },
        language:'en'})
        .catch(error=>
            {throw error;}
        );
    const request =     {
        server  : await import(`node:${Config.server_protocol}`),
        port	: Config.server_protocol,
        options : Config.server_protocol=='https'?{
                        key: await fs.promises.readFile(serverProcess.cwd() + Config.server_https_key, 'utf8'),
                        cert: await fs.promises.readFile(serverProcess.cwd() + Config.server_https_cert, 'utf8')
                    }:{}
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