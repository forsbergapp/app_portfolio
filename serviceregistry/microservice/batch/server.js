/** 
 * Microservice batch server
 * @module serviceregistry/microservice/batch/server 
 */

/**
 * @import {config, request, response} from './types.js'
 */

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
 * @name serverStart
 * @description Starts the server
 * @function
 * @returns {Promise.<void>}
 */
const serverStart = async () =>{
    const service = await import('./service.js');
    const fs = await import('node:fs');
    const Crypto = await import('node:crypto');

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
            log('MICROSERVICE_ERROR', error);
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
     * @description log
     * @param {'MICROSERVICE_LOG'|'MICROSERVICE_ERROR'} type
     * @param {string} message
     */
    const log = (type, message) =>{
        service.requestUrl({url:Config.message_queue_url, 
            method:Config.message_queue_method, 
            body:{data:Buffer.from(
                            JSON.stringify({IAM_service:'BATCH', 
                                            type: type, 
                                            message:message})).toString('base64')
                },
            authorization:'Bearer ' + jwt_data.token,
            language:'en'})
        .catch(error=>
            console.log(`MICROSERVICE ERROR ${error}`)
        );
    };

    /**
     * @param 
     * @param {{id:number|null,
     *          message:{}}} message
     * @returns {string}
     */
   const encryptMessage = message => 
       Buffer.from(JSON.stringify(
           {
           id:message.id,
           message:Crypto.publicEncrypt(  Config.public_key,
                   Buffer.from(JSON.stringify(message.message))).toString('base64')
           })).toString('base64');
    
    /**@type{config} */
    const Config = JSON.parse(await fs.promises.readFile(serverProcess.cwd() + '/data/microservice/BATCH.json', 'utf8'));

    const auth = async attempt =>{
        const attempts = 10;
        /**
         * @type{{  token:string,
         *           exp:number,
         *           iat:number}}
         */
        const jwt_data = await service.requestUrl({url:Config.service_registry_auth_url, 
                                method:Config.service_registry_auth_method, 
                                body:{data:encryptMessage({id:null, message: {message:null}})
                                    },
                                language:'en'})
                                .catch(()=>null);
        if (jwt_data == null && ((attempt??1) <=attempts) )
                await new Promise ((resolve)=>{setTimeout(()=>{auth((attempt??1) +1).then(()=>resolve(null));}, 5000);});
        else
            return jwt_data;
    };
    //wait 5 seconds to start server first time
    await new Promise ((resolve)=>{setTimeout(()=>resolve(null), 5000);});
    const jwt_data = await auth();
    if (jwt_data == null)
        throw '⛔';

    /**
     * @type{{  server: import('node:http') ,
     *          port:   number,
     *          options:{key?:string, cert?:string}}}
     */
    const request =     {
        server  : await import(`node:${Config.server_protocol}`),
        port	: Config.server_port,
        options : Config.server_protocol=='https'?{
            key: await fs.promises.readFile(serverProcess.cwd() + Config.server_https_key, 'utf8'),
            cert: await fs.promises.readFile(serverProcess.cwd() + Config.server_https_cert, 'utf8')
        }:{}
    };

	request.server.createServer(request.options, (/**@type{request}*/req, /**@type{response}*/res) => {
		serverReturn(401, '⛔', null, res);
	}).listen(request.port, ()=>{
		log('MICROSERVICE_LOG', `MICROSERVICE START PORT ${request.port}`);
	});
	service.startJobs(Config, log);
	serverProcess.on('uncaughtException', (err) =>{
		log('MICROSERVICE_ERROR', err.stack ?? err.message ?? err);
	});
};
serverStart();
export {serverStart, serverProcess};