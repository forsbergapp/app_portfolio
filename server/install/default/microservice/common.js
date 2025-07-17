/** @module server/install/default/microservice/common */


const zlib = await import('node:zlib');
const fs = await import('node:fs');
const Crypto = await import('./crypto.js');
class ClassServerProcess {
    cwd = () => process.cwd().replaceAll('\\','/');
}
const serverProcess = new ClassServerProcess();

/**
 * @name commonFromBase64
 * @description Convert base64 containing unicode to string
 * @function
 * @param {string} str 
 * @returns {string}
 */
const commonFromBase64 = str => {
    const binary_string = atob(str);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return new TextDecoder('utf-8').decode(bytes);
};


/**
 * @name commonConfig
 * @description config
 * @function
 * @param {string} service
 * @returns {Promise.<{
 *   name:                              string,
 *   server_protocol:	                string,
 *   server_host:		                string,
 *   server_port:                       number,
 *   server_https_key:                  string,
 *   server_https_cert:                 string,
 *   server_https_ssl_verification:     0|1,
 *   server_https_ssl_verification_path:string,
 *   path_data:                         string,
 *   service_registry_auth_url:		    string,
 *   service_registry_auth_method:      'POST',
 *   message_queue_url:	                string,
 *   message_queue_method:	            'POST',
 *   uuid:                              string,
 *   secret:                            string,
 *   config:                            *,
 *   server:                            import('node:http') ,
 *   port:                              number,
 *   options:                           {key?:string, cert?:string}}>}
 */
const commonConfig = async service =>{
    const Config = JSON.parse(await fs.promises.readFile(serverProcess.cwd() + `/data/microservice/${service}.json`, 'utf8'));
    return {
        name:                               Config.name,
        server_protocol:                    Config.server_protocol,
        server_host:                        Config.server_host,
        server_port:                        Config.server_port,
        server_https_key:                   Config.server_https_key,
        server_https_cert:                  Config.server_https_cert,
        server_https_ssl_verification:      Config.server_https_ssl_verification,
        server_https_ssl_verification_path: Config.server_https_ssl_verification_path,
        path_data:                          Config.path_data,
        service_registry_auth_url:          Config.service_registry_auth_url,
        service_registry_auth_method:       Config.service_registry_auth_method,
        message_queue_url:                  Config.message_queue_url,
        message_queue_method:               Config.message_queue_method,
        uuid:                               Config.uuid,
        secret:                             Config.secret,
        config:                             Config.config,
        //server start info:
        server:                             await import(`node:${Config.server_protocol}`),
        port:                               Config.server_port,
        options:                            Config.server_protocol=='https'?{
                                                key: await fs.promises.readFile(serverProcess.cwd() + Config.server_https_key, 'utf8'),
                                                cert: await fs.promises.readFile(serverProcess.cwd() + Config.server_https_cert, 'utf8')
                                            }:{}
        };
};

/**
 * @name commonAuth
 * @description authenticate access for microservice and returns a token
 * @function
 * @param {{service_registry_auth_url:string,
 *          service_registry_auth_method:'POST'|'GET',
 *          uuid:string,
 *          secret:string}} parameters
 * @returns {Promise.<{ token:  string,
 *                      exp:    number,
 *                      iat:    number,
 *                      }|null>}
 */
const commonAuth = async parameters =>{
    const attempts = 10;
    /**
     * @param {number|null} attempt
     * @returns {Promise.<{ 
     *                       token: string;
     *                       exp:   number;
     *                       iat:   number;
     *                   }|null>}
     */
    const auth = async (attempt=null) =>{
        /**
         * @type{{  token:string,
         *          exp:number,
         *          iat:number}}
         */
        const jwt_data = await commonRequestUrl({
                                url:parameters.service_registry_auth_url, 
                                external:false,
                                uuid:parameters.uuid,
                                secret:parameters.secret,
                                method:parameters.service_registry_auth_method, 
                                body:null,
                                language:'en'})
                                .then(result=>JSON.parse(result))
                                .catch(()=>null);
        if (jwt_data == null && ((attempt??1) <=attempts) )
            return await new Promise ((resolve)=>{setTimeout(()=>{auth((attempt??1) +1).then(()=>resolve(null));}, 5000);});
        else
            return jwt_data;
    };
    //wait 5 seconds first time
    await new Promise ((resolve)=>{setTimeout(()=>resolve(null), 5000);});
    return await auth().then(result=>{
        if (result == null)
            throw '⛔';
        else
            return result;
    });
};
/**
 * @name commonServerReturn
 * @description returns result using ISO20022 format
 * @function
 * @param {{code:string,
 *          token:string,
 *          uuid:string,
 *          secret:string,
 *          message_queue_url:string,
 *          message_queue_method:'POST'|'GET',
 *          error:*,
 *          result:*,
 *          res:import('node:http')['IncomingMessage'] & {  statusCode:string, 
 *                                                          write:function, 
 *                                                          setHeader:function, 
 *                                                          end:function}}} parameters
 * @returns {Promise.<void>}
 */
const commonServerReturn = async parameters=>{
    parameters.res.statusCode = parameters.code;
    if (parameters.error){
        commonLog({type:'MICROSERVICE_ERROR', 
                   message:parameters.error,
                   token:parameters.token,
                   message_queue_url:parameters.message_queue_url,
                   message_queue_method:parameters.message_queue_method,
                   uuid:parameters.uuid,
                   secret:parameters.secret});
        //ISO20022 error format
        const message = JSON.stringify({error:{
                                        http:parameters.code, 
                                        code:'MICROSERVICE',
                                        text:parameters.error, 
                                        developer_text:null, 
                                        more_info:null}});
        parameters.res.write(commonEncrypt({secret:parameters.secret, data:message}), 'utf8');
    }
    else{
        parameters.res.setHeader('Content-Type',  'application/json; charset=utf-8');
        parameters.res.write(commonEncrypt({secret:parameters.secret, data:JSON.stringify(parameters.result)}), 'utf8');
    }
    parameters.res.end();
};

/**
 * @name commonLog
 * @description Logs info or error in message queue
 * @param {{type:'MICROSERVICE_LOG'|'MICROSERVICE_ERROR',
 *          message:string,
 *          token:string,
 *          message_queue_url:string,
 *          message_queue_method:'POST'|'GET',
 *          uuid:string,
 *          secret:string}} parameters
 * @returns {void}
 */
const commonLog = parameters =>{
    commonRequestUrl({
        url:parameters.message_queue_url, 
        external:false,
        uuid:parameters.uuid,
        secret:parameters.secret,
        method:parameters.message_queue_method, 
        body:{data:Buffer.from(
                        JSON.stringify({IAM_service:'GEOLOCATION', 
                                        type: parameters.type, 
                                        message:parameters.message})).toString('base64')
            },
        authorization:'Bearer ' + parameters.token,
        language:'en'})
    .catch(error=>
        console.log(`MICROSERVICE ERROR ${error}`)
    );
};

/**
 * @name commonEncrypt
 * @description Encrypts data
 * @param {{secret:string,
 *          data:string}} parameters
 * @returns {string}
 */
const commonEncrypt = parameters =>{
	return Crypto.subtle.encrypt({	
                        iv:     JSON.parse(commonFromBase64(parameters.secret)).iv,
						key:    JSON.parse(commonFromBase64(parameters.secret)).jwk.k,
						data:   parameters.data, 
						});


};
/**
 * @name commonDecrypt
 * @description Decrypts data
 * @function
 * @param {{secret:string,
 *          data:string}} parameters
 * @returns {string}
*/
const commonDecrypt = parameters =>{
    return Crypto.subtle.decrypt({	
                iv: JSON.parse(Buffer.from(parameters.secret, 'base64').toString('utf-8')).iv,
                key:JSON.parse(Buffer.from(parameters.secret, 'base64').toString('utf-8')).jwk.k,
                ciphertext:parameters.data});
};

/**
 * @name commonRequestUrl
 * @description Returns result from request
 *              Url external third party does not use any custom headers
 *              Url external third party can use http or https
 *              Url external third party does not use encryption 
 *              Url external third party does not use parameters encrypt, uuid, secret, app-id, app-signature and autorization
 *              Url to main server uses custom headers
 *              Url to main server can use http or https
 *              Url to main server can use encryption or not
 * @function
 * @param {{url:string,
 *          external:boolean,
 *          uuid:string,
 *          secret:string,
 *          method:'GET'|'POST',
 *          authorization?:string|null,
 *          body:{}|null,
 *          language:string}} parameters
 * @returns {Promise.<*>}
 */
const commonRequestUrl = async parameters => {
    const encrypt = 1;
    const restAPIPath = '/bff';
    const restAPIPathEncrypted = restAPIPath + '/x/';
    const protocol = parameters.url.split('://')[0];
    const protocolRequest = (await import(`node:${protocol}`));
    
    //url should use syntax protocol://[host][optional port]/[path]
    const url = (parameters.external ==false && encrypt)?
                    (protocol + '://' + parameters.url.split('/')[2] + restAPIPathEncrypted + parameters.uuid):
                        parameters.url;
    const options = (parameters.external ==false && encrypt)?
                        //encrypted options
                        {
                        family: 4,
                        cache:  'no-store',
                        method: 'POST',
                        headers:{
                                    'User-Agent': 'Server',
                                    'Accept-Language': parameters.language,
                                    'Content-Type':  'application/json',
                                    'Connection':   'close',
                                },
                        ...(protocol=='https' && {rejectUnauthorized: false})
                        }
                    :
                        //not encrypted options
                        {
                        family: 4,
                        cache: 'no-store',
                        method: parameters.method,
                        headers:{   
                                    'User-Agent': 'Server',
                                    'Accept-Language': parameters.language,
                                    ...(parameters.external==false && {'app-id':       0}),
                                    ...(parameters.external==false && {'app-signature':'commonRequestUrl'}),
                                    ...(parameters.external==false && parameters.authorization && {Authorization: parameters.authorization}),
                                    ...(parameters.method!='GET' && {'Content-Type':  'application/json'}),
                                    'Connection':   'close'
                                },
                        ...(protocol=='https' && {rejectUnauthorized: false})
                        };
    const body =    (parameters.external ==false && encrypt)?
                        JSON.stringify({
                            x: commonEncrypt({
                                    secret:parameters.secret??'',
                                    data:JSON.stringify(
                                            {
                                                headers:{
                                                    ...(parameters.external==false &&  {'app-id':       0}),
                                                    ...(parameters.external==false &&  {'app-signature':commonEncrypt({ secret:parameters.secret,
                                                                                                                        data:'FFB'})}),
                                                    ...(parameters.external==false && parameters.authorization && {Authorization: parameters.authorization}),
                                                    ...(parameters.method!='GET' && {'Content-Type':  'application/json'}),
                                                    },
                                                method: parameters.method,
                                                url:    restAPIPath + parameters.url.split(restAPIPath)[1],
                                                body:   parameters.body?
                                                            JSON.stringify({data:btoa(JSON.stringify(parameters.body))}):
                                                                ''
                                        })
                                })
                        }):
                            ((parameters.body && parameters.external==false)?
                                JSON.stringify({data:btoa(JSON.stringify(parameters.body))}):
                                            '');

    return new Promise((resolve, reject) =>{

        const request = protocolRequest.request(url, options, (/**@type{import('node:http').IncomingMessage}*/res) =>{
            let responseBody = '';
            if (res.headers['content-encoding'] == 'gzip'){
                const gunzip = zlib.createGunzip();
                res.pipe(gunzip);
                gunzip.on('data', (chunk) =>responseBody += chunk);
                gunzip.on('end', () => {
                    if (res.statusCode == 200 ||res.statusCode == 201)
                        resolve((parameters.external ==false && encrypt)?
                                    commonDecrypt({ 
                                        data:  responseBody,
                                        secret: parameters.secret
                                        }):
                                        responseBody);
                    else
                        reject(res.statusCode);
                });
            }
            else{
                res.setEncoding('utf8');
                res.on('data', (/**@type{*}*/chunk) =>{
                    responseBody += chunk;
                });
                res.on('end', ()=>{
                    if (res.statusCode == 200 ||res.statusCode == 201)
                        resolve((parameters.external ==false && encrypt)?
                                    commonDecrypt({ 
                                        data:  responseBody,
                                        secret:  parameters.secret
                                        }):
                                    responseBody);
                    else
                        reject(res.statusCode);
                });
            }
        });
        request.on('error', (/**@type{Error}*/error) => {
            reject(error);
        });
        if (parameters.method !='GET')
            request.write(body);
        request.end();        
    });
};
/**
 * @name commonRequestData
 * @description Get data from request
 * @param {{req:import('node:http').IncomingMessage,
 *         secret:string }} parameters
 * @returns {Promise.<Object.<string,*>>}
 */
const commonRequestData = async parameters =>{
    const read_body = async () =>{
        return new Promise((resolve)=>{
            if (parameters.req.headers['content-type'] =='application/json'){
                let body= '';
                parameters.req.on('data', chunk =>{
                    body += chunk.toString();
                });
                parameters.req.on('end', ()=>{
                    try {
                        resolve(JSON.parse(body).x);
                    } catch (error) {
                        resolve(null);
                    }
                    
                });
            }
            else
                resolve(null);
        });
    
    };
    const data = JSON.parse(commonDecrypt({secret:parameters.secret, data:await read_body()??''}));
    return {...Buffer.from(data.url.substring(data.url.indexOf('?')+1), 'base64').toString('utf-8')
                .split('&')
                .map(key=>{
                    return {[key.split('=')[0]]:key.split('=')[1]};
                })
                .reduce((/**@type{*}*/keys, /**@type{*}*/key)=>{
                    return {...keys, ...key};
                }),
            'Accept-Language':  data.headers['Accept-Language'],
            'User-Agent':       data.headers['User-Agent']
            };   
};
                   
export {commonConfig,
        commonAuth, 
        commonServerReturn,
        commonLog, 
        commonEncrypt, 
        commonDecrypt,
        commonRequestUrl,
        commonRequestData};