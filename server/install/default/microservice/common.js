/** @module server/install/default/microservice/common */

const zlib = await import('node:zlib');
const fs = await import('node:fs');
const Crypto = await import('node:crypto');
class ClassServerProcess {
    cwd = () => process.cwd().replaceAll('\\','/');
}
const serverProcess = new ClassServerProcess();
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
 *   iam_auth_app_url:	                string,
 *   iam_auth_app_method:	            'POST',
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
        iam_auth_app_url:                   Config.iam_auth_app_url,
        iam_auth_app_method:                Config.iam_auth_app_method,
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
 * @returns {void}
 */
const commonServerReturn = parameters=>{
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
        parameters.res.write(message, 'utf8');
    }
    else{
        parameters.res.setHeader('Content-Type',  'application/json; charset=utf-8');
        parameters.res.write(JSON.stringify(parameters.result), 'utf8');
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
 * @returns {Promise.<string>}
 */
const commonEncrypt = async parameters =>{
    const jwk = JSON.parse(Buffer.from(parameters.secret, 'base64').toString('utf-8')).jwk;
    const iv = JSON.parse(Buffer.from(parameters.secret, 'base64').toString('utf-8')).iv;
    const key = await Crypto.webcrypto.subtle.importKey( 
        'jwk', 
        jwk, 
        {   name: 'AES-GCM', 
            length: 256, 
        }, 
        true,
        ['encrypt', 'decrypt'] 
    );
    return Buffer.from(await Crypto.webcrypto.subtle.encrypt(
                        {
                            name: 'AES-GCM',
                            iv: Buffer.from(iv,'base64')
                        },
                        key,
                        new TextEncoder().encode(parameters.data)
                        )).toString('base64');
};
/**
 * @name commonDecrypt
 * @description Decrypts data
 * @function
 * @param {{secret:string,
 *          data:string}} parameters
 * @returns {Promise.<*>} 
*/
const commonDecrypt = async parameters =>{
    const jwk = JSON.parse(Buffer.from(parameters.secret, 'base64').toString('utf-8')).jwk;
    const iv = JSON.parse(Buffer.from(parameters.secret, 'base64').toString('utf-8')).iv;
    const key = await Crypto.webcrypto.subtle.importKey( 
                    'jwk', 
                    jwk, 
                    { 
                        name: 'AES-GCM', 
                        length: 256, 
                    }, 
                    true,
                    ['encrypt', 'decrypt'] );

    return new TextDecoder().decode(await Crypto.webcrypto.subtle.decrypt(
                    {
                        name: 'AES-GCM',
                        /**@ts-ignore */
                        iv: new Uint8Array(Buffer.from(iv,'base64').toString().split(','))
                    },
                    key,
                    /**@ts-ignore */
                    new Uint8Array(Buffer.from(parameters.data,'base64').toString().split(','))
                ));
};
/**
 * @name commonIamAuthenticateApp
 * @description Authenticates app using IAM and sends query encoded with base64
 * @function
 * @param {{token:string,
 *          iam_auth_app_url:string,
 *          iam_auth_app_method:'POST'|'GET',
 *          uuid:string,
 *          req:import('node:http').IncomingMessage & {headers:{'app-id':number, 'app-signature':string}},
 *          secret:string}} parameters
 * @returns {Promise.<{authenticated:boolean,
 *                      data:*}>}
 */
const commonIamAuthenticateApp = async parameters =>{
    return await commonRequestUrl({ url:parameters.iam_auth_app_url, 
                                    external:false,
                                    uuid:parameters.uuid,
                                    secret:parameters.secret,
                                    method:parameters.iam_auth_app_method, 
                                    body:commonRequestData(parameters.req),
                                    authorization:'Bearer ' + parameters.token,
                                    language:'en'})
                .then(result=>{return {authenticated:true, data:JSON.parse(result)};})
                .catch(()=>
                    {return {authenticated:false, data:null};}
                );
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
    const protocol = parameters.url.split('://')[0];
    const protocolRequest = (await import(`node:${protocol}`));
    
    //url should use syntax protocol://[host][optional port]/[path]
    const url = encrypt?
                    (parameters.url.split('/')[2] + '/bff/x/' + parameters.uuid):
                        parameters.url;
    const options = encrypt?
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
    const body =    encrypt?
                        JSON.stringify({
                            x: await commonEncrypt({
                                        secret:parameters.secret??'',
                                        data:JSON.stringify({  
                                                headers:{
                                                        ...(parameters.external==false &&  {'app-id':       0}),
                                                        ...(parameters.external==false &&  {'app-signature':await commonEncrypt({   secret:parameters.secret,
                                                                                                                                    data:'FFB'})}),
                                                        ...(parameters.external==false && parameters.authorization && {Authorization: parameters.authorization}),
                                                        ...(parameters.method!='GET' && {'Content-Type':  'application/json'}),
                                                        },
                                                method: parameters.method,
                                                url:    url,
                                                body:   parameters.body?
                                                            JSON.stringify(parameters.body):
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
                        resolve (responseBody);
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
                        resolve (responseBody);
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
 * @description Get data from request, microservice dno't need to know if encryption is used or not
 * @param {import('node:http').IncomingMessage & {headers:{'app-id':number, 'app-signature':string}}} req
 * @returns {Promise.<{ header:{'app-id':number|null, 
 *                              'app-signature':string}|null,
 *                      url:string,
 *                      body:{}}>}
 */
const commonRequestData = async req =>{

    const read_body = async () =>{
        return new Promise((resolve,reject)=>{
            if (req.headers['content-type'] =='application/json'){
                let body= '';
                req.on('data', chunk =>{
                    body += chunk.toString();
                });
                req.on('end', ()=>{
                    try {
                        resolve(JSON.parse(body));
                    } catch (error) {
                        reject(null);
                    }
                    
                });
            }
            else{
                resolve({});
            }
        });
    };
    
    return {
        header:{
            'app-id' : req.headers['app-id'] ?? null,
            'app-signature' : req.headers['app-signature'] ?? null
        },
        url: req.url??'',
        body:await read_body().catch(()=>null)
    };
};
                   
export {commonConfig,
        commonAuth, 
        commonServerReturn,
        commonLog, 
        commonEncrypt, 
        commonDecrypt,
        commonIamAuthenticateApp, 
        commonRequestUrl};