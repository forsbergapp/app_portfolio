/** 
 * Microservice geolocation server
 * @module serviceregistry/microservice/geolocation/server 
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
    const Config = await common.commonConfig('GEOLOCATION');
    
    const auth = await common.commonAuth({service_registry_auth_method:Config.service_registry_auth_method,
                                    service_registry_auth_url:Config.service_registry_auth_url,
                                    uuid:Config.uuid,
                                    secret:Config.secret
    });

	Config.server.createServer(Config.options, (/**@type{request}*/req, /**@type{response}*/res) => {
		res.setHeader('Access-Control-Allow-Methods', 'GET', 'POST');
		res.setHeader('Access-Control-Allow-Origin', '*');
        common.commonRequestData({ req:req, secret:Config.secret})
        .then(resultAuthenticateApp=>{
            if (resultAuthenticateApp.authenticated){
                switch (true){
                    case resultAuthenticateApp.data.service == 'PLACE':{
                        if(	(resultAuthenticateApp.data.latitude !=null && resultAuthenticateApp.data.latitude!='') ||
                            (resultAuthenticateApp.data.longitude !=null && resultAuthenticateApp.data.longitude!='')){
                            service.getPlace(   common, 
                                                Config, 
                                                resultAuthenticateApp.data.latitude, 
                                                resultAuthenticateApp.data.longitude, 
                                                resultAuthenticateApp.data['Accept-Language'])
                            
                            .then(result=>result?.length>0?
                                            common.commonServerReturn({
                                                            service: 'GEOLOCATION',
                                                            token: auth.token,
                                                            uuid: Config.uuid,
                                                            secret: Config.secret,
                                                            message_queue_url: Config.message_queue_url,
                                                            message_queue_method: Config.message_queue_method,
                                                            code: 200,
                                                            error: null,
                                                            result: JSON.parse(result),
                                                            res:res}):
                                                '')
                            .catch(error =>
                                common.commonServerReturn({
                                service: 'GEOLOCATION',
                                token: auth.token,
                                uuid: Config.uuid,
                                secret: Config.secret,
                                message_queue_url: Config.message_queue_url,
                                message_queue_method: Config.message_queue_method,
                                code: 500,
                                error: error,
                                result: null,
                                res:res}));
                        }
                        else
                            common.commonServerReturn({
                                service: 'GEOLOCATION',
                                token: auth.token,
                                uuid: Config.uuid,
                                secret: Config.secret,
                                message_queue_url: Config.message_queue_url,
                                message_queue_method: Config.message_queue_method,
                                code: 400,
                                error: '⛔',
                                result: null,
                                res:res});
                        break;
                    }
                    case resultAuthenticateApp.data.service == 'IP':{
                        //no v6 support
                        service.getIp(  common, 
                                        Config, 
                                        resultAuthenticateApp.data.ip.replace('::ffff:',''), 
                                        resultAuthenticateApp.data['Accept-Language'])
                        .then(result=>
                            common.commonServerReturn({
                            service: 'GEOLOCATION',
                            token: auth.token,
                            uuid: Config.uuid,
                            secret: Config.secret,
                            message_queue_url: Config.message_queue_url,
                            message_queue_method: Config.message_queue_method,
                            code: 200,
                            error: null,
                            result: JSON.parse(result),
                            res:res}))
                        .catch(error =>
                            common.commonServerReturn({
                            service: 'GEOLOCATION',
                            token: auth.token,
                            uuid: Config.uuid,
                            secret: Config.secret,
                            message_queue_url: Config.message_queue_url,
                            message_queue_method: Config.message_queue_method,
                            code: 500,
                            error: error,
                            result: null,
                            res:res}));
                        break;
                    }
                    default:{
                        common.commonServerReturn({
                            service: 'GEOLOCATION',
                            token: auth.token,
                            uuid: Config.uuid,
                            secret: Config.secret,
                            message_queue_url: Config.message_queue_url,
                            message_queue_method: Config.message_queue_method,
                            code: 401,
                            error: '⛔',
                            result: null,
                            res:res});
                    }
                }
            }
            else
                common.commonServerReturn({
                    service: 'GEOLOCATION',
                    token: auth.token,
                    uuid: Config.uuid,
                    secret: Config.secret,
                    message_queue_url: Config.message_queue_url,
                    message_queue_method: Config.message_queue_method,
                    code: 401,
                    error: '⛔',
                    result: null,
                    res:res});
        });
		
	}).listen(Config.port, ()=>{
        common.commonLog({
            type:'MICROSERVICE_LOG',
            service:'GEOLOCATION',
            message:`MICROSERVICE START PORT ${Config.port}`,
            token:auth.token,
            message_queue_url:Config.message_queue_url,
            message_queue_method:Config.message_queue_method,
            uuid:Config.uuid,
            secret:Config.secret});
	});

	serverProcess.on('uncaughtException', err =>{
        common.commonLog({
            type:'MICROSERVICE_ERROR',
            service:'GEOLOCATION',
            message:err,
            token:auth.token,
            message_queue_url:Config.message_queue_url,
            message_queue_method:Config.message_queue_method,
            uuid:Config.uuid,
            secret:Config.secret});
	});
};
serverStart();
export {serverStart, serverProcess};