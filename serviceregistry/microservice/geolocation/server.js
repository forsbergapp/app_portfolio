/** 
 * Microservice geolocation server
 * @module serviceregistry/microservice/geolocation/server 
 */

/**
 * @import {config, request, response, geolocation_data} from './types.js'
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
                            JSON.stringify({IAM_service:'GEOLOCATION', 
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
            
    /**
     * @description Authenticates app using IAM and sends query encoded with base64
     * @param {number} app_id
     * @param {string} authorization
     * @returns {Promise.<boolean>}
     */
    const iamAuthenticateApp = async (app_id, authorization) =>{
        const [auth_client_id, auth_client_secret] = Buffer.from((authorization.replace('Basic ','') || ''), 'base64').toString().split(':');
        return await service.requestUrl({   url:Config.iam_auth_app_url, 
                                            method:Config.iam_auth_app_method, 
                                            body:{data:encryptMessage({ id:null, 
                                                                        message: {
                                                                                    app_id:app_id, 
                                                                                    client_id:auth_client_id,
                                                                                    client_secret:auth_client_secret
                                                                                }})
                                                },
                                            authorization:'Bearer ' + jwt_data.token,
                                            language:'en'})
                    .then(result=>
                        result.error?false:true
                    )
                    .catch(()=>
                        false
                    );
    };
    /**
     * @description Get config
     * @type{config} 
     */
    const Config = JSON.parse(await fs.promises.readFile(serverProcess.cwd() + '/data/microservice/GEOLOCATION.json', 'utf8'));

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
    //wait 5 seconds first time
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
                            server  :   await import(`node:${Config.server_protocol}`),
                            port	: Config.server_port,
                            options : Config.server_protocol=='https'?{
                                            key: await fs.promises.readFile(serverProcess.cwd() + Config.server_https_key, 'utf8'),
                                            cert: await fs.promises.readFile(serverProcess.cwd() + Config.server_https_cert, 'utf8')
                                        }:{}
                        };
    
	request.server.createServer(request.options, (/**@type{request}*/req, /**@type{response}*/res) => {
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
		iamAuthenticateApp(req.query.app_id, req.headers.authorization).then((/**@type{boolean}*/authenticate)=>{
			if (authenticate){
				switch (true){
					case URI_path == '/api/v1' && req.query.service == 'PLACE' && req.method =='GET':{
						if(	(req.query.data.latitude !=null && req.query.data.latitude!='') ||
							(req.query.data.longitude !=null && req.query.data.longitude!='')){
							service.getPlace(Config, req.query.data.latitude, req.query.data.longitude, req.headers['accept-language'])
							.then(result=>result?.length>0?serverReturn(200, null, JSON.parse(result), res):'')
							.catch(error =>serverReturn(500, error, null, res));
						}
						else
							serverReturn(400, '⛔', null, res);
						break;
					}
                    case URI_path == '/api/v1' && req.query.service == 'IP' && req.method =='GET':{
						//no v6 support
						service.getIp(Config, req.query.data.ip.replace('::ffff:',''), req.headers['accept-language'])
						.then(result=>serverReturn(200, null, JSON.parse(result), res))
						.catch(error =>serverReturn(500, error, null, res));
						break;
					}
					default:{
						serverReturn(401, '⛔', null, res);
					}
				}
			}
			else
				serverReturn(401, '⛔', null, res);
		});
	}).listen(request.port, ()=>{
        log('MICROSERVICE_LOG', `MICROSERVICE START PORT ${request.port}`);
	});

	serverProcess.on('uncaughtException', (err) =>{
        log('MICROSERVICE_ERROR', err);
	});
};
serverStart();
export {serverStart, serverProcess};