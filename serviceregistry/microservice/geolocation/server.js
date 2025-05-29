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
    const service = await import('./service.js');
    const Crypto = await import('node:crypto');

    //get config
    /**@type{config} */
    const Config = JSON.parse(await fs.promises.readFile(serverProcess.cwd() + '/data/microservice/GEOLOCATION.json', 'utf8'));

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
     * @type{{  token:string,
     *           exp:number,
     *           iat:number}}
     */
    const jwt_data = (await service.requestUrl({url:Config.service_registry_auth_url, 
                                                method:Config.service_registry_auth_method, 
                                                body:{data:encryptMessage({id:null, message: {message:null}})
                                                    },
                                                language:'en'})).result;
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
                        result.result.error?false:true
                    )
                    .catch(()=>
                        false
                    );
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
						data:	data};
		iamAuthenticateApp(req.query.app_id, req.headers.authorization).then((/**@type{boolean}*/authenticate)=>{
			if (authenticate){
				switch (true){
					case URI_path == '/api/v1' && req.query.service == 'PLACE' && req.method =='GET':{
						if(	(req.query.data.latitude !=null && req.query.data.latitude!='') ||
							(req.query.data.longitude !=null && req.query.data.longitude!='')){
							service.getPlace(Config, req.query.data.latitude, req.query.data.longitude, req.headers['accept-language'])
							.then((result)=>result?.length>0?serverReturn(200, null, JSON.parse(result), res):'')
							.catch((error) =>serverReturn(500, error, null, res));
						}
						else
							serverReturn(400, '⛔', null, res);
						break;
					}
                    case URI_path == '/api/v1' && req.query.service == 'IP' && req.method =='GET':{
						//no v6 support
						service.getIp(Config, req.query.data.ip.replace('::ffff:',''), req.headers['accept-language'])
						.then((result)=>serverReturn(200, null, JSON.parse(result), res))
						.catch((error) =>serverReturn(500, error, null, res));
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
		console.log(`MICROSERVICE GEOLOCATION PORT ${request.port} `);
	});

	serverProcess.on('uncaughtException', (err) =>{
		console.log(err);
	});
};
serverStart();
export {serverStart, serverProcess};