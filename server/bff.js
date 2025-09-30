/** @module server/bff */

/**
 * @import {server} from './types.js'
 */
const {server} = await import('./server.js');
const {registryConfigServices} = await import('../serviceregistry/registry.js');
const {default:worldcities} = await import('../apps/common/src/functions/common_worldcities.js');
const {default:ComponentCreate} = await import('../apps/common/src/component/common_maintenance.js');
const {getIP} = await import('../apps/common/src/functions/common_geolocation.js');
/**
 * @name bffConnect
 * @description Initial request from app, connects to socket, sends SSE message with common library and parameters
 * @function 
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:string|null,
 *          ip:string,
 *          idToken:string,
 *          user_agent:string,
 *          accept_language:string,
 *          response:server['server']['res'],
 *          locale:string}} parameters
 * @returns {Promise.<void>}
 */
const bffConnect = async parameters =>{
    /**@type{server['ORM']['ConfigServer']} */
    const configServer = server.ORM.db.ConfigServer.get({app_id:parameters.app_id}).result;

    const common_app_id = server.ORM.UtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID)??0;

    //connect socket for common app id
    const connectUserData = await server.socket.socketPost({  app_id:common_app_id,
                            idToken:parameters.idToken,
                            authorization:'',
                            uuid:parameters.resource_id,
                            user_agent:parameters.user_agent,
                            ip:parameters.ip,
                            response:parameters.response
                            });
    //send SSE CONNECTINFO
    server.socket.socketClientPostMessage({app_id:common_app_id, 
                                    resource_id:connectUserData.insertId, 
                                    data:{  data_app_id:null, 
                                            iam_user_id: null,
                                            idToken:null,
                                            message: JSON.stringify({ 
                                                        latitude: connectUserData.latitude,
                                                        longitude: connectUserData.longitude,
                                                        place: connectUserData.place,
                                                        timezone: connectUserData.timezone}),
                                            message_type:'CONNECTINFO'}});
};
/**
 * @name bffExternal
 * @description External request with JSON
 * @function
 * @param {{app_id:number,
*          url:string,
*          method:string,
*          body:*,
*          user_agent:string,
*          ip:string,
*          'app-id': number,
*          authorization:string|null,
*          locale:string}} parameters
* @returns {Promise.<server['server']['response']>}
*/
const bffExternal = async parameters =>{
   if (parameters.url.toLowerCase().startsWith('http://')){
       /**@type{server['ORM']['ConfigServer']} */
       const CONFIG_SERVER = server.ORM.db.ConfigServer.get({app_id:0}).result;
       return await server.serverCircuitBreakerBFE.serverRequest( 
           {
               request_function:   server.serverRequest,
               service:            'BFE',
               protocol:           'http',
               url:                parameters.url,
               host:               null,
               port:               null,
               admin:              parameters.app_id == server.ORM.UtilNumberValue(CONFIG_SERVER.SERVICE_APP.filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID),
               path:               null,
               body:               parameters.body,
               method:             parameters.method,
               client_ip:          parameters.ip,
               authorization:      parameters.authorization??'',
               user_agent:         parameters.user_agent,
               accept_language:    parameters.locale,
               encryption_type:    'BFE',
               'app-id':           parameters['app-id'],
               endpoint:           null
           })
           .then((/**@type{*}*/result)=>{
               return result.http?result:{result:JSON.parse(result), type:'JSON'};
           })
           .catch((/**@type{*}*/error)=>{
               return {http:500, 
                   code:'bffExternal', 
                   text:error, 
                   developerText:null, 
                   moreInfo:null,
                   type:'JSON'};
           });
   }
   else{
       throw server.iam.iamUtilMessageNotAuthorized();
   }
};
/**
 * @name bffMicroservice
 * @description Request microservice using circuitbreaker
 *              Uses client_id and client_secret defined for given app
 *              microservice REST API syntax:
 *              [microservice protocol]://[microservice host]:[microservice port]/api/v[microservice API version]/[resource]/[optional resource id]?[base64 encoded URI query]
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
*          microservice:string, 
*          service:string, 
*          method:server['server']['req']['method'],
*          data:*,
*          ip:string,
*          user_agent:string,
*          accept_language:string,
*          endpoint:server['bff']['parameters']['endpoint']
*       }} parameters
* @returns {Promise.<server['server']['response']>}
*/
const bffMicroservice = async parameters =>{
                 
    //convert data object to string if method=GET, add always app_id parameter for authentication and send as base64 encoded
    const query = Buffer.from((parameters.method=='GET'?Object.entries({...parameters.data, ...{service:parameters.service}}).reduce((query, param)=>query += `${param[0]}=${param[1]}&`, ''):'')
                                + `app_id=${parameters.app_id}`
                            ).toString('base64');
    const ServiceRegistry = await registryConfigServices(parameters.microservice);
    return await server.serverCircuitBreakerMicroService.serverRequest( 
                {
                    request_function:   server.serverRequest,
                    service:            parameters.microservice,
                    protocol:           'http',
                    url:                null,
                    host:               ServiceRegistry.server_host,
                    port:               ServiceRegistry.server_port,
                    admin:              parameters.app_id == server.ORM.UtilNumberValue(
                                                    server.ORM.db.ConfigServer.get({  app_id:parameters.app_id, 
                                                                        data:{  config_group:'SERVICE_APP', 
                                                                                parameter:'APP_COMMON_APP_ID'}}).result
                                                ),
                    path:               `/api/v${ServiceRegistry.rest_api_version}?${query}`,
                    body:               parameters.data,
                    method:             parameters.method,
                    client_ip:          parameters.ip,
                    user_agent:         parameters.user_agent,
                    accept_language:    parameters.accept_language,
                    authorization:      null,
                    encryption_type:    'MICROSERVICE',
                    'app-id':           parameters.app_id,
                    endpoint:           parameters.endpoint
                })
                .then((/**@type{*}*/result)=>{
                    return result.http?result:{result:JSON.parse(result), type:'JSON'};
                })
                .catch((/**@type{*}*/error)=>{
                    return {http:500, 
                            code:'MICROSERVICE', 
                            text:error, 
                            developerText:null, 
                            moreInfo:null,
                            type:'JSON'};
                });
}; 
/**
 * @name bffGeodata
 * @description Returns geodata
 * @function
 * @param {{app_id:number,
*          endpoint:server['bff']['parameters']['endpoint'],
*          ip:string,
*          user_agent:string,
*          accept_language:string}} parameters
* @returns {Promise.<*>}
*/
const bffGeodata = async parameters =>{
   const result_gps = getIP({ app_id:parameters.app_id,
                                    data:{ip:parameters.ip},
                                    ip:parameters.ip,
                                    locale:'en'
                                }).result;
   const result_geodata = {};
   if (result_gps){
       result_geodata.latitude =   result_gps.latitude;
       result_geodata.longitude=   result_gps.longitude;
       result_geodata.place    =   result_gps.place;
       result_geodata.timezone =   result_gps.timezone;
   }
   else{
       const result_city = await worldcities({ app_id:parameters.app_id,
                                               data:{searchType:'RANDOM'},
                                               user_agent:parameters.user_agent,
                                               ip:parameters.ip,
                                               host:'',
                                               idToken:'', 
                                               authorization:'',
                                               locale:parameters.accept_language})
                                   .then(result=>{if (result.http) throw result; else return result.result;})
                                   .catch((/**@type{server['server']['error']}*/error)=>{throw error;});
       result_geodata.latitude =   result_city.lat;
       result_geodata.longitude=   result_city.lng;
       result_geodata.place    =   result_city.city + ', ' + result_city.admin_name + ', ' + result_city.country;
       result_geodata.timezone =   null;
   }
   return result_geodata;
};
/**
 * @name bffGeodataUser
 * @description Get geodata and user account data
 * @function
 * @param {number} app_id 
 * @param {string} ip
 * @returns {Promise.<{  latitude:string,
*              longitude:string,
*               place:string,
*               timezone:string}>}
*/
const bffGeodataUser = async (app_id, ip) =>{
   //get GPS from IP
   const {getIP} = await import('../apps/common/src/functions/common_geolocation.js');
   const result_geodata = getIP({ app_id:app_id,
                                    data:{ip:ip},
                                    ip:ip,
                                    locale:'en'
                                }).result;   
   const place = result_geodata?result_geodata.place:'';
   return {latitude:result_geodata?result_geodata.latitude ?? '':'',
           longitude:result_geodata?result_geodata.longitude ?? '':'',
           place:place,
           timezone:result_geodata?result_geodata.timezone ?? '':''};
};


/**
 * @name bffInit
 * @description Backend for frontend (BFF) init
 *              Logs if the request is from SSE
 *              Logs when the response is closed
 *              Authenticates the request
 *              Sets header values on both on the response and on the request
 *              Checks robots.txt and favicon.ico
 *              Returns a reason if response should be closed
 * @function
 * @param {server['server']['req']} req
 * @param {server['server']['res']} res
 * @returns Promise.<{  reason:'ROBOT'|'FAVICON'|'REQUEST'|null}>
 */
const bffInit = async (req, res) =>{
    if (req.headers.accept == 'text/event-stream'){
        //SSE, log since response is open and log again when closing
        server.ORM.db.Log.post({  app_id:0, 
            data:{  object:'LogRequestInfo', 
                    request:{   req:req,
                                responsetime:server.UtilResponseTime(res),
                                statusCode:res.statusCode,
                                statusMessage:typeof res.statusMessage == 'string'?res.statusMessage:JSON.stringify(res.statusMessage)??''
                            },
                    log:''
                }
            });
    }
    else{
        //set default no cache response header and close connection request header
        res.setHeader('Cache-Control', 'no-store');
        req.headers.connection = 'close';
    }
        
    res.on('close',()=>{	
        //SSE response time will be time connected until disconnected
        server.ORM.db.Log.post({  app_id:0, 
            data:{  object:'LogRequestInfo', 
                    request:{   req:req,
                                responsetime:server.UtilResponseTime(res),
                                statusCode:res.statusCode,
                                statusMessage:typeof res.statusMessage == 'string'?res.statusMessage:JSON.stringify(res.statusMessage)??''
                            },
                    log:''
                }
            }).then(() => {
            // do not return any StatusMessage to client, this is only used for logging purpose
            res.statusMessage = '';
            res.end();
        });
    });
    //access control that stops request if not passing controls
    /**@type{server['iam']['iam_authenticate_request']}*/
    const result = await server.iam.iamAuthenticateRequest({ip:req.ip, 
                                                host:req.headers.host ?? '', 
                                                method: req.method, 
                                                'user-agent': req.headers['user-agent'], 
                                                'accept-language':req.headers['accept-language'], 
                                                path:req.path})
                        .catch((/**@type{server['server']['error']}*/error)=>{return { statusCode: 500, statusMessage: error};});
    if (result != null){
        res.statusCode = result.statusCode;
        res.statusMessage = ' ';
        res.writeHead(res.statusCode, {
            'Content-Type': 'text/plain;charset=utf-8',
            'Content-length':0
        });
        return {reason:'REQUEST'};
    }
    else{

        //check robots.txt
        if (req.originalUrl=='/robots.txt'){
            res.statusMessage = ' ';
            res.type('text/plain');
            res.write('User-agent: *\nDisallow: /');
            return {reason:'ROBOT'};
        }
        else{
            //browser favorite icon to ignore
            if (req.originalUrl=='/favicon.ico'){
                res.statusMessage = ' ';
                res.write('');
                return {reason:'FAVICON'};
            }
            else{
                return {reason:null};
            }
        }
    }
};
/**
 *  Returns response to client
 *  Uses host parameter for errors in requests or unknown route paths
 *  Returns result using ISO20022 format
 *  Error
 *           http:          statusCode,
 *           code:          optional app Code,
 *           text:          error,
 *           developerText: optional text,
 *           moreInfo:      optionlal text
 *  Result
 *          Single resource format supported return types
 *             JSON, resource of any kind
 *             returned as result with resource key and type JSON
 *             HTML
 *             used by initial APP and maintenance
 * 
 *          Multiple resources in JSON format:
 *              list_header : {	total_count:	number of records,
 *                              offset: 		offset parameter or 0,
 *                              count:			limit parameter or number of records
 *                            }
 *              rows        : array of anything
 *          Pagination result
 *              page_header : {	total_count:	number of records or 0,
 *								offset: 		offset parameter or 0,
 *								count:			least number of limit parameter and number of records
 *                            }
 *              rows        : array of anything
 * 
 *  @param {{app_id?:number|null,
 *           result_request:{   http?:number|null,
 *                              code?:number|string|null,
 *                              text?:*,
 *                              developerText?:string|null,
 *                              moreInfo?:string|null,
 *                              result?:*,
 *                              type:server['server']['response']['type'],
 *                              singleResource?:boolean},
 *           host?:string|null,
 *           route:'APP'|'REST_API'|null,
 *           method?:server['server']['req']['method'],
 *           decodedquery?:string|null,
 *           jwk?:JsonWebKey|null,
 *           iv?:string|null,
 *           res:server['server']['res']}} parameters
 *  @returns {Promise.<void>}
 */
const bffResponse = async parameters =>{
    /**
     * @param {string} data
     * @returns {Promise.<string>}
     */
    const encrypt = async data => (parameters.jwk && parameters.iv)?
                                    server.security.securityTransportEncrypt({app_id:parameters.app_id??0, data:data, jwk:parameters.jwk, iv:parameters.iv }):
                                        data;

    /**@type{server['ORM']['ConfigServer']['SERVICE_APP']} */
    const CONFIG_SERVICE_APP = server.ORM.db.ConfigServer.get({app_id:parameters.app_id??0,data:{ config_group:'SERVICE_APP'}}).result;

    const admin_app_id = server.ORM.UtilNumberValue(CONFIG_SERVICE_APP.filter(parameter=>'APP_ADMIN_APP_ID' in parameter)[0].APP_ADMIN_APP_ID);
    if (parameters.result_request.http){    
        //ISO20022 error format
        const message = {error:{
                                http:parameters.result_request.http, 
                                code:parameters.result_request.code, 
                                //return SERVER ERROR if status code starts with 5
                                text:(admin_app_id!=parameters.app_id && parameters.result_request.http.toString().startsWith('5'))?
                                        'SERVER ERROR':
                                            parameters.result_request.text?.code=='DB'?
                                                parameters.result_request.text.text:
                                                    parameters.result_request.text?.message?
                                                        parameters.result_request.text?.message:
                                                            parameters.result_request.text, 
                                developer_text:parameters.result_request.developerText, 
                                more_info:parameters.result_request.moreInfo}};
        //remove statusMessage or [ERR_INVALID_CHAR] might occur and is moved to inside message
        server.response({app_id:parameters.app_id,
                       type:'JSON',
                       result:await encrypt(JSON.stringify(message)),
                       route:parameters.route,
                       method:parameters.method,
                       statusMessage: '',
                       statusCode: parameters.result_request.http ?? 500,
                       res:parameters.res});
    }
    else{
        if (parameters.res.getHeader('Content-Type')?.startsWith('text/event-stream')){
            //For SSE so no more update of response
            null;
        }
        else{
            if(parameters.result_request.type){
                if (parameters.result_request?.type == 'HTML' || parameters.result_request.result?.resource){
                    //resource or html
                    server.response({app_id:parameters.app_id,
                                    type:parameters.result_request?.type,
                                    result:await encrypt(parameters.result_request.result.resource?
                                            JSON.stringify(parameters.result_request.result):
                                                parameters.result_request.result),
                                    route:parameters.route,
                                    method:parameters.method,
                                    statusMessage: '',
                                    statusCode: parameters.method?.toUpperCase() == 'POST'?201:200,
                                    res:parameters.res});
                }
                else{
                    if (parameters.decodedquery && new URLSearchParams(parameters.decodedquery).get('fields')){
                        if (parameters.result_request.result[0]){
                            //limit fields/keys in rows
                            const limit_fields = parameters.result_request.result.map((/**@type{*}*/row)=>{
                                const row_new = {};
                                /**@ts-ignore */
                                for (const field of new URLSearchParams(parameters.decodedquery).get('fields').split(',')){
                                    /**@ts-ignore */
                                    row_new[field] = row[field];
                                }
                                return row_new;
                            });
                            parameters.result_request.result = limit_fields;
                        }
                        else{
                            //limit fields/keys in object
                            const result_service_fields = {};
                            /**@ts-ignore */
                            for (const field of new URLSearchParams(parameters.decodedquery).get('fields').split(',')){
                                /**@ts-ignore */
                                result_service_fields[field] = parameters.result_request.result[field];
                            }
                            parameters.result_request.result = result_service_fields;
                        }
                    }
                    //records limit in controlled by server, apps can not set limits                                                     
                    const limit = server.ORM.UtilNumberValue(CONFIG_SERVICE_APP.filter(parameter=>'APP_LIMIT_RECORDS' in parameter)[0].APP_LIMIT_RECORDS??0);
                    //Admin shows all records except for pagination, apps use always APP_LIMIT_RECORDS
                    const admin_limit = parameters.app_id == server.ORM.UtilNumberValue(CONFIG_SERVICE_APP.filter(parameter=>'APP_ADMIN_APP_ID' in parameter)[0].APP_ADMIN_APP_ID)?
                                                                null:
                                                                    limit;
                    if (parameters.result_request.singleResource){
                        //limit rows if single resource response contains rows
                        server.response({app_id:parameters.app_id,
                                        type:parameters.result_request?.type,
                                        result:await encrypt(JSON.stringify((typeof parameters.result_request.result!='string' && parameters.result_request.result?.length>0)?
                                                    parameters.result_request.result
                                                    .filter((/**@type{*}*/row, /**@type{number}*/index)=>(admin_limit??0)>0?
                                                    (index+1)<=(admin_limit??0)
                                                        :true):
                                                        parameters.result_request.result)),
                                        route:parameters.route,
                                        method:parameters.method,
                                        statusMessage: '',
                                        statusCode: parameters.method?.toUpperCase() == 'POST'?201:200,
                                        res:parameters.res});
                    }
                    else{
                        
                        let result;
                        if (parameters.decodedquery && new URLSearchParams(parameters.decodedquery).has('offset')){
                            const offset = server.ORM.UtilNumberValue(new URLSearchParams(parameters.decodedquery).get('offset'));
                            //return pagination format
                            result = {  
                                        page_header:
                                            {	total_count:	parameters.result_request.result?.length??0,
                                                offset: 		offset??0,
                                                count:			(parameters.result_request.result??[])
                                                                .filter((/**@type{*}*/row, /**@type{number}*/index)=>(offset??0)>0?
                                                                                                                        (index+1)>=(offset??0):
                                                                                                                            true)
                                                                .filter((/**@type{*}*/row, /**@type{number}*/index)=>(limit??0)>0?
                                                                                                                        (index+1)<=(limit??0)
                                                                                                                            :true).length
                                            },
                                        rows:               (parameters.result_request.result??[])
                                                            .filter((/**@type{*}*/row, /**@type{number}*/index)=>(offset??0)>0?
                                                                                                                    (index+1)>=(offset??0):
                                                                                                                        true)
                                                            .filter((/**@type{*}*/row, /**@type{number}*/index)=>(limit??0)>0?
                                                                                                                    (index+1)<=(limit??0)
                                                                                                                        :true)
                            };
                        }
                        else{
                            //return list header format
                            result = {  
                                        list_header:
                                            {	
                                                total_count:	parameters.result_request.result?.length??0,
                                                offset: 		0,
                                                count:			Math.min(admin_limit??0,parameters.result_request.result?.length??0)
                                            },
                                        rows:               (typeof parameters.result_request.result!='string' && parameters.result_request.result?.length>0)?
                                                                (parameters.result_request.result??[])
                                                                .filter((/**@type{*}*/row, /**@type{number}*/index)=>(admin_limit??0)>0?
                                                                                                                        (index+1)<=(admin_limit??0)
                                                                                                                            :true):
                                                                    parameters.result_request.result
                                    };
                        }
                        server.response({app_id:parameters.app_id,
                                        type:parameters.result_request?.type,
                                        result:await encrypt(JSON.stringify(result)),
                                        route:parameters.route,
                                        method:parameters.method,
                                        statusMessage: '',
                                        statusCode: parameters.method?.toUpperCase() == 'POST'?201:200,
                                        res:parameters.res});
                    }
                }
            }
            else{
                server.response({app_id:parameters.app_id,
                                type:parameters.result_request?.type,
                                result:await encrypt(server.iam.iamUtilMessageNotAuthorized()),
                                route:parameters.route,
                                method:parameters.method,
                                statusMessage: '',
                                statusCode: 500,
                                res:parameters.res});
            }
        }   
    }
};
/**
 * @name bff
 * @namespace ROUTE_APP
 * @description Backend for frontend (BFF) called from client
 * @function
 * @param {server['server']['req']} req
 * @param {server['server']['res']} res
 * @returns {Promise<*>}
 */
 const bff = async (req, res) =>{
    /**@type{server['ORM']['ConfigServer']} */
    const configServer = server.ORM.db.ConfigServer.get({app_id:0}).result;
    // check JSON maximum size, parameter uses megabytes (MB)
    if (req.body && JSON.stringify(req.body).length/1024/1024 > 
            (server.ORM.UtilNumberValue((configServer.SERVER.filter(parameter=>'JSON_LIMIT' in parameter)[0].JSON_LIMIT ?? '0').replace('MB',''))??0)){
        //log error                                        
        server.ORM.db.Log.post({  app_id:0, 
                    data:{  object:'LogRequestError', 
                            request:{   req:req,
                                        responsetime:server.UtilResponseTime(res),
                                        statusCode:res.statusCode,
                                        statusMessage:res.statusMessage
                                    },
                            log:'PayloadTooLargeError'
                        }
                    }).then(() => {
            bffResponse({
                            result_request:{http:400, 
                                            code:null, 
                                            text:server.iam.iamUtilMessageNotAuthorized(), 
                                            developerText:'',
                                            moreInfo:'',
                                            type:'JSON'},
                            host:req.headers.host,
                            route:null,
                            res:res});
        });
    }
    else{
        const resultbffInit =   await bffInit(req, res);
        const common_app_id = server.ORM.UtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID)??0;
        /**
         * @returns {Promise.<server['bff']['parameters']|null|1>}
         */
        const parameters = async () =>{
            //if not start url and method='POST and path starts with /bff/x/
            if (req.url !='/'){
                //fonts use GET all others use POST
                if (['POST', 'GET'].includes(req.method) && req.url.startsWith('/bff/x/') && req.url.length>'/bff/x/'.length){
                    //lookup uuid in IamEncryption or ServiceRegistry for microservice
                    /**@type{server['ORM']['IamEncryption']}*/
                    const encryptionData = (server.ORM.db.IamEncryption.get({app_id:common_app_id, resource_id:null, data:{data_app_id:null}}).result ?? [])
                                            .filter((/**@type{server['ORM']['IamEncryption']}*/encryption)=>
                                                    encryption.uuid==(req.url.substring('/bff/x/'.length).split('~')[0])
                                            )[0] ?? (server.ORM.db.ServiceRegistry.get({app_id:common_app_id, resource_id:null, data:{name:null}}).result ?? [])
                                            .filter((/**@type{server['ORM']['ServiceRegistry']}*/service)=>service.uuid==(req.url.substring('/bff/x/'.length).split('~')[0]))
                                            .map((/**@type{server['ORM']['ServiceRegistry']}*/service)=>{
                                                return {
                                                    id:                 null,
                                                    app_id:             0,
                                                    iam_app_id_token_id:null,
                                                    uuid:               service.uuid,
                                                    secret:             service.secret,
                                                    url:                null,
                                                    type:               'MICROSERVICE',
                                                    created:            null};})[0];
                                            
                    if (encryptionData){
                        if(encryptionData.type=='FONT'){
                            const token = server.ORM.db.IamAppIdToken.get({ app_id:common_app_id, 
                                            resource_id:(server.ORM.db.IamEncryption.get({app_id:common_app_id, resource_id:null, data:{data_app_id:null}}).result ?? [])
                                                            .filter((/**@type{server['ORM']['IamEncryption']}*/encryption)=>
                                                                    encryption.uuid==(req.url.substring('/bff/x/'.length).split('~')[1])
                                                            )[0].iam_app_id_token_id, 
                                            data:{data_app_id:null}}).result[0].token;
                            if (token){
                                server.socket.socketClientPostMessage({app_id:common_app_id,
                                                                resource_id:null,
                                                                data:{  data_app_id:null,
                                                                        iam_user_id:null,
                                                                        idToken:token,
                                                                        message:JSON.stringify({
                                                                                    uuid:req.url.substring('/bff/x/'.length).split('~')[0],
                                                                                    url: encryptionData.url
                                                                                }),
                                                                        message_type:'FONT_URL'
                                                                    }
                                                            });
                                return 1;
                            }
                            else
                                return null;
                        }
                        else{
                            const jwk = JSON.parse(Buffer.from(encryptionData.secret, 'base64').toString('utf-8')).jwk;
                            const iv  = JSON.parse(Buffer.from(encryptionData.secret, 'base64').toString('utf-8')).iv;
                            /**
                             * @type {{headers:{
                             *                 'app-id':       number,
                             *                 'app-signature':string,
                             *                 'app-id-token': string,
                             *                 Authorization?: string,
                             *                 'Content-Type': string,
                             *                 },
                             *         method: string,
                             *         url:    string,
                             *         body:   *}}}
                             */
                            return await server.security.securityTransportDecrypt({ 
                                        app_id:0,
                                        encrypted:  req.body.x,
                                        jwk:        jwk,
                                        iv:         iv})
                                        .then(result=>{
                                            const decrypted = JSON.parse(result);
                                            const endpoint = decrypted.url.startsWith(configServer.SERVER
                                                .filter(parameter=>'REST_RESOURCE_BFF' in parameter)[0].REST_RESOURCE_BFF + '/')?
                                                    (decrypted.url.split('/')[2]?.toUpperCase()):
                                                        'APP';
                                            const idToken = //All external roles and microservice do not use AppId Token
                                                                (endpoint.indexOf('EXTERNAL')>-1 ||
                                                                endpoint.indexOf('MICROSERVICE')>-1)?
                                                                        '':
                                                                        decrypted.headers['app-id-token']?.replace('Bearer ',''); 
                                    
                                            return server.iam.iamAuthenticateCommon({
                                                    idToken: idToken, 
                                                    endpoint:endpoint,
                                                    authorization: decrypted.headers.Authorization??'', 
                                                    host: req.headers.host ?? '', 
                                                    security:{
                                                                IamEncryption:encryptionData,
                                                                idToken:idToken,
                                                                AppId:decrypted.headers['app-id'], 
                                                                AppSignature: decrypted.headers['app-signature'],
                                                    },
                                                    ip: req.headers['x-forwarded-for'] || req.ip,
                                                    res:res
                                                    })
                                                    .then(authenticate=>{
                                                        //save decrypted info for logs
                                                        req.headers.x = {   app_id:     decrypted?.headers['app-id']??null, 
                                                                            app_id_auth:authenticate.app_id !=null?1:0, 
                                                                            method:     decrypted?.method??null, 
                                                                            url:        decrypted?.url??null};
                                                        return  (authenticate.app_id !=null && decrypted)?
                                                                    {
                                                                    app_id:         authenticate.app_id,
                                                                    endpoint:       endpoint,
                                                                    //request
                                                                    host:           req.headers.host ?? '', 
                                                                    url:            decrypted.url,
                                                                    method:         decrypted.method,
                                                                    query:          (decrypted.url.indexOf('?')>-1?
                                                                                        Array.from(new URLSearchParams(decrypted.url
                                                                                        .substring(decrypted.url.indexOf('?')+1)))
                                                                                        .reduce((query, param)=>{
                                                                                            const key = {[param[0]] : decodeURIComponent(param[1])};
                                                                                            return {...query, ...key};
                                                                                                        /**@ts-ignore */
                                                                                        }, {}):null)?.parameters ?? '',
                                                                    body:           decrypted.body?JSON.parse(decrypted.body):null,
                                                                    security_app:   { 
                                                                                    AppId: decrypted.headers['Content-Type'] =='text/event-stream'?
                                                                                        0:
                                                                                            decrypted.headers['app-id']??null,
                                                                                    AppSignature: decrypted.headers['app-signature']??null,
                                                                                    AppIdToken: decrypted.headers['app-id-token']?.replace('Bearer ','')??null
                                                                                    },
                                                                    authorization:  decrypted.headers.Authorization??null, 
                                                                    //metadata
                                                                    ip:             req.headers['x-forwarded-for'] || req.ip, 
                                                                    user_agent:     req.headers['user-agent'], 
                                                                    accept_language:req.headers['accept-language'], 
                                                                    //response
                                                                    jwk:            jwk,
                                                                    iv:             iv,
                                                                    res:            res}:
                                                                        null;
                                                    });
                                        })
                                        .catch(()=>
                                            //decrypt failed
                                            null
                                        );
                        }
                        
                    }
                    else{
                        //no encryption data
                        return null;
                    }
                }
                else{
                    //request not using method POST and url that starts with /bff/x/
                    return  {
                            app_id:         0,
                            endpoint:       'APP',
                            host:           req.headers.host ?? '', 
                            url:            req.url,
                            method:         req.method,
                            query:          '',
                            body:           null,
                            security_app:   null,
                            authorization:  null, 
                            ip:             req.headers['x-forwarded-for'] || req.ip, 
                            user_agent:     req.headers['user-agent'], 
                            accept_language:req.headers['accept-language'], 
                            //response
                            jwk:            null,
                            iv:             null,
                            res:            res};
                }
            }
            else{
                //start url
                /**@type{server['bff']['parameters']['endpoint'] | string} */
                const endpoint = req.url.startsWith(configServer.SERVER.filter(parameter=>'REST_RESOURCE_BFF' in parameter)[0].REST_RESOURCE_BFF + '/')?
                                        (req.url.split('/')[2]?.toUpperCase()):
                                            'APP';
                const idToken = //All external roles and microservice do not use AppId Token
                                (endpoint.indexOf('EXTERNAL')>-1 ||
                                    endpoint.indexOf('MICROSERVICE')>-1)?
                                        '':
                                        req.headers['app-id-token']?.replace('Bearer ',''); 
    
                const authenticate = endpoint=='APP'?
                                        null:
                                            await server.iam.iamAuthenticateCommon({
                                                idToken: idToken, 
                                                /**@ts-ignore */
                                                endpoint:endpoint,
                                                authorization: req.headers.authorization??'', 
                                                host: req.headers.host??'', 
                                                security:{
                                                    IamEncryption:null,
                                                    idToken:null,
                                                    AppId:req.headers['app-id'], 
                                                    AppSignature: null,
                                                },
                                                ip: req.headers['x-forwarded-for'] || req.ip, 
                                                res:res
                                                });
                //save info for logs
                req.headers.x = {   app_id:     req.headers['app-id']??null, 
                                    app_id_auth:null, 
                                    method:     req.method, 
                                    url:        req.url};
                return (endpoint=='APP' ||authenticate?.app_id != null)?{
                        app_id:         authenticate?.app_id??0,
                        /**@ts-ignore */
                        endpoint:       endpoint,
                        //request
                        host:           req.headers.host ?? '', 
                        url:            req.originalUrl,
                        method:         req.method,
                        query:          req.query?.parameters ?? '',
                        body:           req.body,
                        security_app:   { 
                                        AppId: req.headers['content-type'] =='text/event-stream'?
                                            0:
                                                req.headers['app-id']??null,
                                        AppSignature: req.headers['app-signature']??null,
                                        AppIdToken: req.headers['app-id-token']?.replace('Bearer ','')??null
                                        },
                        authorization:  req.headers.authorization, 
                        //metadata
                        ip:             req.headers['x-forwarded-for'] || req.ip, 
                        user_agent:     req.headers['user-agent'], 
                        accept_language:req.headers['accept-language'], 
                        //response
                        jwk:            null,
                        iv:             null,
                        res:            res
                    }:null;
            }
        };
        if (resultbffInit.reason == null){
            //If first time, when no admin exists, then display maintenance for users
            if (server.ORM.db.IamUser.get(0, null).result.length==0 && (await server.app_common.commonAppIam(req.headers.host)).admin == false){
                return bffResponse({
                                        result_request:{result:await ComponentCreate({  data:   null,
                                                                    methods:{commonResourceFile:server.app_common.commonResourceFile}
                                                                }), 
                                                        type:'HTML'},
                                        host:req.headers.host,
                                        route:null,
                                        res:res});
            }
            else{
                /**@type{server['bff']['parameters']|null|1} */
                const bff_parameters = await parameters();
                //if decrypt failed, authentication failed or font
                if (bff_parameters==null || bff_parameters==1){
                    if (bff_parameters==1){
                        //respond with empty font, fonts are fetched using REST API
                        bffResponse({
                                    result_request:{result:{resource:`data:font/woff2;base64,${btoa('')}`}, type:'JSON'},
                                    route:null,
                                    res:res
                        });
                    }
                    else{
                        return bffResponse({result_request:{http:401, 
                                                            code:null,
                                                            text:server.iam.iamUtilMessageNotAuthorized(), 
                                                            developerText:'bff',
                                                            moreInfo:null, 
                                                            type:'JSON'},
                                            route:null,
                                            res:res});
                    }
                } 
                else  
                    if (bff_parameters.endpoint == 'APP' && 
                        bff_parameters.method.toUpperCase() == 'GET' && 
                        !bff_parameters.url?.startsWith(configServer.SERVER.filter(row=>'REST_RESOURCE_BFF' in row)[0].REST_RESOURCE_BFF + '/')){
                        //use common app id for APP since no app id decided
                        switch (true){
                            case bff_parameters.url == '/':{
                                //App route
                                return bffResponse({app_id:common_app_id,
                                                    result_request:await server.app_common.commonApp({  app_id:common_app_id,
                                                                                ip:bff_parameters.ip, 
                                                                                host:bff_parameters.host ?? '', 
                                                                                user_agent:bff_parameters.user_agent, 
                                                                                accept_language:bff_parameters.accept_language})
                                                                            .then(result=>result?.http == 301?bff_parameters.res.redirect('/'):result),
                                                    host:bff_parameters.host,
                                                    route : 'APP',
                                                    res:bff_parameters.res})
                                .catch((error)=>
                                                /**@ts-ignore */
                                    server.ORM.db.Log.post({  app_id:common_app_id, 
                                        data:{  object:'LogServiceError', 
                                                service:{   service:bff_parameters.endpoint,
                                                            parameters:bff_parameters.query
                                                        },
                                                log:error
                                            }
                                        }).then(() =>server.app_common.commonAppError())
                                );
                            } 
                            default:{
                                //unknown path, redirect to hostname
                                bff_parameters.res?
                                bff_parameters.res.redirect(`http://${configServer.SERVER.filter(row=>'HOST' in row)[0].HOST}:${configServer.SERVER.filter(row=>'HTTP_PORT' in row)[0].HTTP_PORT}`):
                                    null;
                            }
                        }
                    }
                    else{
                        //REST API route
                        //REST API requests from client are encoded using base64
                        const decodedquery = bff_parameters.query?decodeURIComponent(Buffer.from(bff_parameters.query, 'base64').toString('utf-8')):'';   
                        const decodedbody = bff_parameters.body?.data?JSON.parse(decodeURIComponent(Buffer.from(bff_parameters.body.data, 'base64').toString('utf-8'))):'';   
                        
                        return await bffRestApi({  
                                                app_id:bff_parameters.app_id,
                                                endpoint:bff_parameters.endpoint,
                                                /**@ts-ignore */
                                                method:bff_parameters.method.toUpperCase(), 
                                                ip:bff_parameters.ip, 
                                                host:bff_parameters.host ?? '', 
                                                url:bff_parameters.url ?? '',
                                                user_agent:bff_parameters.user_agent, 
                                                accept_language:bff_parameters.accept_language, 
                                                idToken:bff_parameters.security_app?.AppIdToken??'', 
                                                authorization:bff_parameters.authorization ?? '', 
                                                parameters:decodedquery, 
                                                body:decodedbody,
                                                res:bff_parameters.res})
                                .then((/**@type{*}*/result_service) => {
                                    const log_result = server.ORM.UtilNumberValue(configServer.SERVICE_LOG.filter(row=>'REQUEST_LEVEL' in row)[0].REQUEST_LEVEL)==2?result_service:'✅';
                                                        /**@ts-ignore */
                                    return server.ORM.db.Log.post({  app_id:bff_parameters.app_id, 
                                        data:{  object:'LogServiceInfo', 
                                                service:{   service:bff_parameters.endpoint,
                                                            parameters:bff_parameters.query
                                                        },
                                                log:log_result
                                            }
                                            
                                        }).then((/**@type{*}*/result_log)=>result_log.http?
                                                                result_log:
                                                                bffResponse({   app_id:bff_parameters.app_id,
                                                                                result_request:result_service, 
                                                                                host:bff_parameters.host,
                                                                                route:'REST_API',
                                                                                /**@ts-ignore */
                                                                                method:bff_parameters.method, 
                                                                                decodedquery:decodedquery, 
                                                                                jwk:bff_parameters.jwk,
                                                                                iv:bff_parameters.iv,
                                                                                res:bff_parameters.res})
                                                                    );
                                })
                                .catch((/**@type{server['server']['error']}*/error) => {
                                    //log with app id 0 if app id still not authenticated
                                    return server.ORM.db.Log.post({  app_id:0, 
                                        data:{  object:'LogServiceError', 
                                                service:{   service:bff_parameters.endpoint,
                                                            parameters:bff_parameters.query
                                                        },
                                                log:error
                                            }
                                        }).then(() => 
                                            bffResponse({result_request:{http:500, code:null,text:error, developerText:'bff',moreInfo:null, type:'JSON'},
                                                            route:null,
                                                            jwk:bff_parameters.jwk,
                                                            iv:bff_parameters.iv,
                                                            res:bff_parameters.res}));  
                                });
                    }
             }
        }
        else
            res.end();
    }
};

/**
 * @name bffRestApi
 * @namespace ROUTE_REST_API
 * @description Routes using openAPI where paths, methods, validation rules, operationId and function parameters are defined
 *              OperationId syntax: [path].[filename].[functioname] or [path]_[path].[filename].[functioname]
 *              Returns single resource result format or ISO20022 format with either list header or page header metadata
 * @function
 * @param {server['bff']['RestApi_parameters']} routesparameters
 * @returns {Promise.<server['server']['response']>}
 */
const bffRestApi = async (routesparameters) =>{        
    const URI_query = routesparameters.parameters;
    const URI_path = routesparameters.url.indexOf('?')>-1?routesparameters.url.substring(0, routesparameters.url.indexOf('?')):routesparameters.url;
    const app_query = URI_query?new URLSearchParams(URI_query):null;
    /**@type{server['ORM']['ConfigServer']} */
    const configServer = server.ORM.db.ConfigServer.get({app_id:0}).result;

    
    /**
     * Authenticates if user has access to given resource
     * Authenticates IAM parameters using IAM token claims if path requires
     * @param {{app_id_authenticated:number,
     *          IAM_iam_user_app_id:number|null,
     *          IAM_iam_user_id:number|null,
     *          IAM_module_app_id:number|null,
     *          IAM_data_app_id:number|null,
     *          IAM_service:string|null}} params
     * @returns {boolean}
     */
    const AuthenticateIAM = params =>{
        //Authencate IAM keys in the tokens if one of them used
        if (params.IAM_iam_user_app_id || 
            params.IAM_iam_user_id || 
            params.IAM_module_app_id || 
            params.IAM_data_app_id ||
            params.IAM_service){
            if (server.iam.iamAuthenticateResource({   app_id:                     params.app_id_authenticated, 
                                                ip:                         routesparameters.ip, 
                                                idToken:                    routesparameters.idToken,
                                                endpoint:                   routesparameters.endpoint,
                                                authorization:              routesparameters.authorization, 
                                                claim_iam_user_app_id:      server.ORM.UtilNumberValue(params.IAM_iam_user_app_id),
                                                claim_iam_user_id:          server.ORM.UtilNumberValue(params.IAM_iam_user_id),
                                                claim_iam_module_app_id:    server.ORM.UtilNumberValue(params.IAM_module_app_id),
                                                claim_iam_data_app_id:      server.ORM.UtilNumberValue(params.IAM_data_app_id),
                                                claim_iam_service:          params.IAM_service}))
                return true;
            else
                return false;
        }
        else
            return true;
    };

    /**
     * @description returns resource id name and value if used using ConfigRestApi and URI path
     * @param {*} paths
     * @param {*} components
     * @returns {Object.<string, string|number|null>|null}
     */
    const resourceId =(paths, components) =>
        paths[0].indexOf('${')>-1?
            paths[1][Object.keys(paths[1])[0]].parameters
            .filter((/**@type{*}*/parameter)=>
                parameter.in=='path'
            )[0]==null?null:
            {[paths[0].substring(paths[0].indexOf('${')+'${'.length).replace('}','')]:
                (components.parameters[paths[0].substring(paths[0].indexOf('${')+'${'.length).replace('}','')]?.schema.type == 'number'?
                    server.ORM.UtilNumberValue(URI_path.substring(URI_path.lastIndexOf('/')+1)):
                        URI_path.substring(URI_path.lastIndexOf('/')+1))
            }:
                //no resource id string in defined path
                null;

    //get paths and components keys in ConfigRestApi
    const configPath = (() => { 
        const { paths, components } = server.ORM.db.ConfigRestApi.get({app_id:server.ORM.UtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID) ?? 0}).result; 
            return {paths:Object.entries(paths).filter(path=>   
                //match with resource id string             
                (path[0].indexOf('${')>-1 && path[0].substring(0,path[0].lastIndexOf('${')) == URI_path.substring(0,URI_path.lastIndexOf('/')+1)) ||
                //match without resource id string
                path[0].indexOf('${')==-1 && path[0] == URI_path
                )[0],
                components};    
        
    })();

    if (configPath.paths){
        /**
         * @description get parameter in path
         * @param{string} key
         * @returns {*}
         */
        const getParameter = key => methodObj.parameters.filter((/**@type{*}*/parameter)=>
                                                                        Object.keys(parameter)[0]=='$ref' && Object.values(parameter)[0]=='#/components/parameters/' + key)[0];

        const methodObj = configPath.paths[1][routesparameters.method.toLowerCase()];
        if (methodObj){   
            /**
             * @param {{}} keys
             * @param {[string,*]} key
             */
            const addBodyKey = (keys, key )=>{
                return {...keys, ...{   [key[0]]:{  
                                                    data:       routesparameters.body[key[0]],
                                                    //IAM parameters are required by default
                                                    required:   key[1]?.required ?? (key[0].startsWith('IAM')?true:false),
                                                    type:       'BODY',
                                                }
                                    }
                                };
            };
            //add parameters using tree shaking pattern
            //so only defined parameters defined using openAPI pattern are sent to functions
            const parametersIn = 
                                    {...routesparameters.method=='GET'?
                                        //QUERY
                                        {...methodObj.parameters
                                                        //include all parameters.in=query
                                                        .filter((/**@type{*}*/parameter)=>
                                                            parameter.in == 'query'|| 
                                                            //component parameter that has in=query
                                                            (   '$ref' in parameter && 
                                                                'required' in parameter && 
                                                                configPath.components.parameters[parameter['$ref'].split('#/components/parameters/')[1]].in == 'query')
                                                        )
                                                        .reduce((/**@type{*}*/keys, /**@type{*}*/key)=>{
                                                            if ('$ref' in key )
                                                                return {...keys, ...{   
                                                                                    [key['$ref'].split('#/components/parameters/')[1]]:
                                                                                    {
                                                                                        data:       app_query?.get(key['$ref'].split('#/components/parameters/')[1]),
                                                                                        //IAM parameters are required by default
                                                                                        required:   (key?.required ?? (key['$ref'].split('#/components/parameters/')[1].startsWith('IAM')?true:false)),
                                                                                        type:       'QUERY',
                                                                                    }
                                                                                }
                                                                        };
                                                            else
                                                                return {...keys, ...{   
                                                                                    [key.name]:{
                                                                                        data:       app_query?.get(key.name),
                                                                                        //IAM parameters are required by default
                                                                                        required:   (key?.required ?? (key.name.startsWith('IAM')?true:false)),
                                                                                        type:       'QUERY',
                                                                                    }
                                                                                }
                                                                    };
                                                        },{})
                                        }:
                                        //BODY:
                                        //all other methods use body to send data
                                        //if additional properties allowed then add to defined parameters or only parameters matching defined parameters
                                        (methodObj.requestBody?.content && methodObj.requestBody?.content['application/json']?.schema?.additionalProperties)?
                                            {...routesparameters.body,...Object.entries(methodObj.requestBody?.content['application/json']?.schema?.properties)
                                                                            .reduce((/**@type{*}*/keys, /**@type{*}*/key)=>addBodyKey(keys,key),{})}:
                                                        Object.entries(methodObj.requestBody?.content['application/json']?.schema?.properties??[])
                                                        .reduce((/**@type{*}*/keys, /**@type{*}*/key)=>addBodyKey(keys,key),{})??{},
                                    ...methodObj.parameters
                                    //PATH
                                    //include parameters.in=path, one resource id in path supported
                                    //all path parameters should be defined in #/components/parameters
                                    .filter((/**@type{*}*/parameter)=>
                                        parameter.in=='path' && '$ref' in parameter) 
                                    .reduce((/**@type{*}*/keys, /**@type{*}*/key)=>{
                                            return {...keys, ...{   
                                                                [key['$ref'].split('#/components/parameters/')[1]]:
                                                                {
                                                                    data:       resourceId(configPath.paths, configPath.components)?.[key['$ref'].split('#/components/parameters/')[1]],
                                                                    //IAM parameters are required by default
                                                                    required:   (key?.required ?? (key['$ref'].split('#/components/parameters/')[1].startsWith('IAM')?true:false)),
                                                                    type:       'PATH',
                                                                }
                                                            }
                                                    };
                                    },{})
                                    };
            if (AuthenticateIAM({   app_id_authenticated:   routesparameters.app_id,
                                    IAM_iam_user_app_id:    parametersIn.IAM_iam_user_app_id?.data,
                                    IAM_iam_user_id:        parametersIn.IAM_iam_user_id?.data,
                                    IAM_module_app_id:      parametersIn.IAM_module_app_id?.data,
                                    IAM_data_app_id:        parametersIn.IAM_data_app_id?.data,
                                    IAM_service:            parametersIn.IAM_service?.data
                                }) &&
                            //there is no missing required parameter in the request
                            //no authentication of value in a required query or body parameter
                            //a required path parameter means a value must be provided
                            Object.keys(parametersIn).filter(parameter=> 
                                        ((typeof parametersIn[parameter] == 'object') &&
                                        parametersIn[parameter]?.required && 
                                        (parametersIn[parameter].type == 'PATH'?
                                            parametersIn[parameter].data == null:
                                            routesparameters.method=='GET'?
                                            ((app_query?.has(parameter)??false)==false):
                                                (parameter in routesparameters.body)==false)
                                        )).length==0){ 
                //remove path parameter not used for data parameter
                for (const key of Object.entries(parametersIn))
                    if (key[1]?.type == 'PATH')
                        delete parametersIn[key[0]];
                //replace temporary metadata with value
                Object.keys(parametersIn).forEach(key=>
                    parametersIn[key]= (typeof parametersIn[key] == 'object' && parametersIn[key]?.constructor.name !='Array' && parametersIn[key]!=null)?
                                            parametersIn[key].data:
                                                parametersIn[key]
                );
                //rename IAM parameter names with common names as admin parameter names
                //admin sends parameters without IAM_ to access "anything"
                if ('IAM_module_app_id' in parametersIn ||routesparameters.endpoint=='APP_ACCESS_EXTERNAL'){
                    //APP_ACCESS_EXTERNAL can only run function using same appid used by host and access data for same app id
                    parametersIn.module_app_id = routesparameters.endpoint=='APP_ACCESS_EXTERNAL'?
                                                    routesparameters.app_id:
                                                        parametersIn.IAM_module_app_id!=null?
                                                            server.ORM.UtilNumberValue(parametersIn.IAM_module_app_id):
                                                                null;
                }
                if ('IAM_data_app_id' in parametersIn ||routesparameters.endpoint=='APP_ACCESS_EXTERNAL'){
                    //APP_ACCESS_EXTERNAL can only run function using same appid used by host and access data for same app id
                    parametersIn.data_app_id = routesparameters.endpoint=='APP_ACCESS_EXTERNAL'?
                                                    routesparameters.app_id:
                                                        parametersIn.IAM_data_app_id!=null?
                                                            server.ORM.UtilNumberValue(parametersIn.IAM_data_app_id):
                                                                null;
                }
                if ('IAM_iam_user_app_id' in parametersIn){
                    parametersIn.iam_user_app_id = parametersIn.IAM_iam_user_app_id!=null?
                                                        server.ORM.UtilNumberValue(parametersIn.IAM_iam_user_app_id):
                                                            null;
                }
                if ('IAM_iam_user_id' in parametersIn){
                    parametersIn.iam_user_id = parametersIn.IAM_iam_user_id!=null?
                                                    server.ORM.UtilNumberValue(parametersIn.IAM_iam_user_id):
                                                        null;
                }
                if ('IAM_service' in parametersIn){
                    parametersIn.service = parametersIn.IAM_service;
                }
                for (const key of Object.keys(parametersIn))
                    if (key.startsWith('IAM_'))
                        delete parametersIn[key];
                
                //read operationId what file to import and what function to execute
                //syntax: [path].[filename].[functioname] or [path]_[path].[filename].[functioname]
                const filePath = '/' + methodObj.operationId.split('.')[0].replaceAll('_','/') + '/' +
                                        methodObj.operationId.split('.')[1] + '.js';
                const functionRESTAPI = methodObj.operationId.split('.')[2];
                const moduleRESTAPI = await import('../' + filePath);

                /**
                 *  Return single resource in result object or multiple resource in rows keys
                 *  Rules: 
                 *  server functions: return false
                 *  method not GET or microservice request: true
                 *  method GET: if resource id (string or number) is empty return false else true
                 * @returns {boolean}
                 */
                const singleResource = () => functionRESTAPI=='commonModuleRun'?
                                                false:
                                                    (routesparameters.method!='GET' ||functionRESTAPI=='microserviceRequest')?
                                                        true: (Object.keys(resourceId(configPath.paths, configPath.components)??{}).length==1 && Object.values(resourceId(configPath.paths, configPath.components)??{})[0]!=null);
                //return result using ISO20022 format
                //send only parameters to the function if declared true
                const result = await  moduleRESTAPI[functionRESTAPI]({
                                ...(getParameter('server_app_id')               && {app_id:             routesparameters.app_id}),
                                ...(getParameter('server_idtoken')              && {idToken:            routesparameters.idToken}),
                                ...(getParameter('server_authorization')        && {authorization:      routesparameters.authorization}),
                                ...(getParameter('server_user_agent')           && {user_agent:         routesparameters.user_agent}),
                                ...(getParameter('server_accept_language')      && {accept_language:    routesparameters.accept_language}),
                                ...(getParameter('server_response')             && {response:           routesparameters.res}),
                                ...(getParameter('server_host')                 && {host:               routesparameters.host}),
                                ...(getParameter('locale')                      && {locale:             app_query?.get('locale') ??server.app_common.commonClientLocale(routesparameters.accept_language)}),
                                ...(getParameter('server_ip')                   && {ip:                 routesparameters.ip}),
                                ...(getParameter('server_microservice')         && {microservice:       getParameter('server_microservice').default}),
                                ...(getParameter('server_microservice_service') && {service:            getParameter('server_microservice_service').default}),
                                ...(getParameter('server_message_queue_type')   && {message_queue_type: getParameter('server_message_queue_type').default}),
                                ...(getParameter('server_method')               && {method:             routesparameters.method}),
                                ...(Object.keys(parametersIn)?.length>0       && {data:               {...parametersIn}}),
                                ...(getParameter('server_endpoint')             && {endpoint:           routesparameters.endpoint}),
                                ...(resourceId( configPath.paths, 
                                                configPath.components)          && {resource_id:        Object.values(
                                                                                                            resourceId( configPath.paths, 
                                                                                                                        configPath.components)??{}
                                                                                                        )[0]})
                                });
                return { ...result,
                            ...{singleResource:singleResource()
                                }
                        };
            }
            else{
                //unknown appid
                return 	{http:401,
                    code:'SERVER',
                    text:server.iam.iamUtilMessageNotAuthorized(),
                    developerText:'bffRestApi',
                    moreInfo:null,
                    type:'JSON'};
            } 
        }
        else                
            return 	{http:404,
                    code:'SERVER',
                    text:server.iam.iamUtilMessageNotAuthorized(),
                    developerText:'bffRestApi',
                    moreInfo:null,
                    type:'JSON'};
    }
    else
        return 	{http:404,
                code:'SERVER',
                text:server.iam.iamUtilMessageNotAuthorized(),
                developerText:'bffRestApi',
                moreInfo:null,
                type:'JSON'};
};

export{bffConnect, bffExternal, bffMicroservice, bffGeodata, bffGeodataUser, bffResponse, bff};