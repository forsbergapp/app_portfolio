/** 
 * Microservice batch server
 * @module serviceregistry/microservice/batch/server 
 */


/**
 * @import {config} from './types.js'
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
    /**@type{import('../../../sdk/server/serviceregistry.js')} */
    const serviceregistry = await import(`${serverProcess.cwd()}/sdk/server/serviceregistry.js`);
    /**
     * @description Get config
     * @type{config} 
     */
    const Config = await serviceregistry.commonConfig({service:'BATCH', path:serverProcess.cwd()});

    const auth = await serviceregistry.commonAuth({  service_registry_auth_method:Config.service_registry_auth_method,
                                            service_registry_auth_url:Config.service_registry_auth_url,
                                            uuid:Config.uuid,
                                            secret:Config.secret
    });
	Config.server.createServer((req, res) => {
		serviceregistry.commonServerReturn({
            service: 'BATCH',
            token: auth?.token??'',
            uuid: Config.uuid,
            secret: Config.secret,
            message_queue_url: Config.message_queue_url,
            message_queue_method: Config.message_queue_method,
            code: 401,
            error: '⛔',
            result: null,
            res:res});
	}).listen(Config.server_port, async ()=>{
		await serviceregistry.commonLog({
            type:'MICROSERVICE_LOG',
            service:'BATCH',
            message:`MICROSERVICE START PORT ${Config.server_port}`,
            token:auth?.token??'',
            message_queue_url:Config.message_queue_url,
            message_queue_method:Config.message_queue_method,
            uuid:Config.uuid,
            secret:Config.secret});
        service.startJobs(serviceregistry, Config, auth?.token??'');
	});
	serverProcess.on('uncaughtException', async err =>{
        console.log('uncaughtException:' + err);
        await serviceregistry.commonLog({
            type:'MICROSERVICE_ERROR',
            service:'BATCH',
            message:'uncaughtException:' + (err.stack ?? err.message ?? err),
            token:auth?.token??'',
            message_queue_url:Config.message_queue_url,
            message_queue_method:Config.message_queue_method,
            uuid:Config.uuid,
            secret:Config.secret});
	});
    serverProcess.on('unhandledRejection', async (/**@type{*}*/reason) =>{
        console.log('unhandledRejection:' + (reason?.stack ?? reason?.message ?? reason ?? new Error().stack));
        await serviceregistry.commonLog({
            type:'MICROSERVICE_ERROR',
            service:'BATCH',
            message:'unhandledRejection:' + (reason?.stack ?? reason?.message ?? reason ?? new Error().stack),
            token:auth?.token??'',
            message_queue_url:Config.message_queue_url,
            message_queue_method:Config.message_queue_method,
            uuid:Config.uuid,
            secret:Config.secret});
	});
};
serverStart();
export {serverStart, serverProcess};