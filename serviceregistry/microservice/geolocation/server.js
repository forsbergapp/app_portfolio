/** 
 * Microservice geolocation server
 * @module serviceregistry/microservice/geolocation/server 
 */

/**
 * @import {common, config, request, response, geolocation_data} from './types.js'
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
    const common = await import(serverProcess.cwd() + '/data/microservice/common.js');
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
		res.setHeader('Access-Control-Allow-Methods', 'GET');
		res.setHeader('Access-Control-Allow-Origin', '*');
		const URI_query = Buffer.from(req.url.substring(req.url.indexOf('?')), 'base64').toString('utf-8');
		const URI_path = req.url.substring(0, req.url.indexOf('?'));
		const app_query = new URLSearchParams(URI_query);
		/**@type{geolocation_data} */
		const data = {	latitude:	app_query.get('latitude') ?? '',
						longitude:	app_query.get('longitude') ?? '',
						ip: 		app_query.get('ip')};
		req.query = {	service:    app_query.get('service'),
                        app_id:	    (app_query.get('app_id')==null||app_query.get('app_id')===undefined||app_query.get('app_id')==='')?
                                        null:
                                            Number(app_query.get('app_id')),
						data:	    data};
                        
		common.commonIamAuthenticateApp({app_id:req.query.app_id,
                                        token:auth.token,
                                        iam_auth_app_url:Config.iam_auth_app_url,
                                        iam_auth_app_method:Config.iam_auth_app_method,
                                        uuid:Config.uuid,
                                        secret:Config.secret,
                                        'app-id':req.query.app_id,
                                        'app-signature':''}).then((/**@type{boolean}*/authenticate)=>{
			if (authenticate){
				switch (true){
					case URI_path == '/api/v1' && req.query.service == 'PLACE' && req.method =='GET':{
						if(	(req.query.data.latitude !=null && req.query.data.latitude!='') ||
							(req.query.data.longitude !=null && req.query.data.longitude!='')){
							service.getPlace(common, Config, req.query.data.latitude, req.query.data.longitude, req.headers['accept-language'])
                            
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
							.catch(error =>common.commonServerReturn({
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
                    case URI_path == '/api/v1' && req.query.service == 'IP' && req.method =='GET':{
						//no v6 support
						service.getIp(common, Config, req.query.data.ip.replace('::ffff:',''), req.headers['accept-language'])
						.then(result=>common.commonServerReturn({
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
						.catch(error =>common.commonServerReturn({
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