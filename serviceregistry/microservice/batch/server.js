/** 
 * Microservice batch server
 * @module serviceregistry/microservice/batch/server 
 */


/**
 * @import {config, request, response} from './types.js'
 */

/**
 * @import {common} from '../../../data/microservice/types.js'
 */

/**
 * @name ClassServerProcess
 * @description process methods
 * @class
 */
class ClassServerProcess {
    cwd = () => process.cwd().replaceAll('\\','/');
    /**
     * @param {string|symbol} event
     * @param {(...args: any[]) => void} listener
     */
    on = (event, listener) => process.on(event, listener);
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

    /**@type{common} */
    const common = await import('file://' + serverProcess.cwd() + '/data/microservice/common.js');
    /**
     * @description Get config
     * @type{config} 
     */
    const Config = await common.commonConfig('BATCH');

    const auth = await common.commonAuth({  service_registry_auth_method:Config.service_registry_auth_method,
                                            service_registry_auth_url:Config.service_registry_auth_url,
                                            uuid:Config.uuid,
                                            secret:Config.secret
    });
	Config.server.createServer(Config.options, (/**@type{request}*/req, /**@type{response}*/res) => {
		common.commonServerReturn({
            service: 'BATCH',
            token: auth.token,
            uuid: Config.uuid,
            secret: Config.secret,
            message_queue_url: Config.message_queue_url,
            message_queue_method: Config.message_queue_method,
            code: 401,
            error: '⛔',
            result: null,
            res:res});
	}).listen(Config.port, ()=>{
		common.commonLog({
            type:'MICROSERVICE_LOG',
            service:'BATCH',
            message:`MICROSERVICE START PORT ${Config.port}`,
            token:auth.token,
            message_queue_url:Config.message_queue_url,
            message_queue_method:Config.message_queue_method,
            uuid:Config.uuid,
            secret:Config.secret});
	});
	service.startJobs(common, Config, auth.token);
	serverProcess.on('uncaughtException', err =>{
        console.log('uncaughtException:' + err);
        common.commonLog({
            type:'MICROSERVICE_ERROR',
            service:'BATCH',
            message:'uncaughtException:' + err.stack ?? err.message ?? err,
            token:auth.token,
            message_queue_url:Config.message_queue_url,
            message_queue_method:Config.message_queue_method,
            uuid:Config.uuid,
            secret:Config.secret});
	});
    serverProcess.on('unhandledRejection', (/**@type{*}*/reason) =>{
        console.log('unhandledRejection:'|reason?.stack ?? reason?.message ?? reason ?? new Error().stack);
        common.commonLog({
            type:'MICROSERVICE_ERROR',
            service:'BATCH',
            message:'unhandledRejection:' + reason?.stack ?? reason?.message ?? reason ?? new Error().stack,
            token:auth.token,
            message_queue_url:Config.message_queue_url,
            message_queue_method:Config.message_queue_method,
            uuid:Config.uuid,
            secret:Config.secret});
	});
};
serverStart();
export {serverStart, serverProcess};