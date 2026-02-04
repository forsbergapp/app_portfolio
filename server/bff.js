/** @module server/bff */

/**
 * @import {server} from './types.js'
 */
const {server} = await import('./server.js');
const {registryConfigServices} = await import('../serviceregistry/registry.js')
const {default:ComponentMaintenance} = await import('../apps/common/src/component/common_maintenance.js');

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
 *          response:server['server']['res']}} parameters
 * @returns {Promise.<void>}
 */
const bffConnect = async parameters =>{
    const common_app_id = server.ORM.UtilNumberValue(server.ORM.OpenApiComponentParameters.config.APP_COMMON_APP_ID.default)??0;
    await server.socket.socketPost({
        app_id:common_app_id,
        idToken:parameters.idToken,
        uuid:parameters.resource_id,
        user_agent:parameters.user_agent,
        ip:parameters.ip,
        response:parameters.response
    })
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
*          accept_language:string}} parameters
* @returns {Promise.<server['server']['response']>}
*/
const bffExternal = async parameters =>{
   if (parameters.url.toLowerCase().startsWith('http://')){
       return await server.serverCircuitBreakerBFE.serverRequest( 
           {
               request_function:   server.serverRequest,
               service:            'BFE',
               protocol:           'http',
               url:                parameters.url,
               host:               null,
               port:               null,
               admin:              parameters.app_id == server.ORM.UtilNumberValue(server.ORM.OpenApiComponentParameters.config.APP_ADMIN_APP_ID.default),
               path:               null,
               body:               parameters.body,
               method:             parameters.method,
               client_ip:          parameters.ip,
               authorization:      parameters.authorization??'',
               user_agent:         parameters.user_agent,
               accept_language:    parameters.accept_language,
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
*          microservice:server['serviceregistry']['microservice_local_config']['name'], 
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
                    host:               ServiceRegistry.ServerHost,
                    port:               ServiceRegistry.ServerPort,
                    admin:              parameters.app_id == server.ORM.UtilNumberValue(server.ORM.OpenApiComponentParameters.config.APP_ADMIN_APP_ID.default),
                    path:               `/api/v${ServiceRegistry.RestApiVersion}?${query}`,
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
 * @description Returns response to client
 *              Uses host parameter for errors in requests or unknown route paths
 *              Returns result using ISO20022 format
 *              Error
 *                  http:          statusCode,
 *                  code:          optional app Code,
 *                  text:          error,
 *                  developerText: optional text,
 *                  moreInfo:      optionlal text
 *              Result
 *                  Single resource format supported return types
 *                  JSON, resource of any kind
 *                  returned as result with resource key and type JSON
 *                  HTML
 *                  used by initial APP and maintenance
 * 
 *              Multiple resources in JSON format:
 *                  list_header : {	total_count:	number of records,
 *                                  offset: 		offset parameter or 0,
 *                                  count:			limit parameter or number of records
 *                                }
 *                  rows        : array of anything
 *              Pagination result
 *                  page_header : {	total_count:	number of records or 0,
 *					    			offset: 		offset parameter or 0,
 *						    		count:			least number of limit parameter and number of records
 *                                }
 *                  rows        : array of anything
 * @function
 * @param {{app_id?:number|null,
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
 * @returns {Promise.<void>}
 */
const bffResponse = async parameters =>{
    /**
     * @param {string} data
     * @returns {string}
     */
    const encrypt = data => (parameters.jwk && parameters.iv)?
                                    server.security.securityTransportEncrypt({app_id:parameters.app_id??0, data:data, jwk:parameters.jwk, iv:parameters.iv }):
                                        data;

    const admin_app_id = server.ORM.UtilNumberValue(server.ORM.OpenApiComponentParameters.config.APP_ADMIN_APP_ID.default);
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
                       result: encrypt(JSON.stringify(message)),
                       route:parameters.route,
                       statusMessage: '',
                       statusCode: parameters.result_request.http ?? 500,
                       res:parameters.res});
    }
    else{
        if (parameters.res.getHeader('Content-Type') == server.CONTENT_TYPE_SSE){
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
                    const limit = server.ORM.UtilNumberValue(server.ORM.OpenApiComponentParameters.config.APP_LIMIT_RECORDS.default??0);
                    //Admin shows all records except for pagination, apps use always APP_LIMIT_RECORDS
                    const admin_limit = parameters.app_id == server.ORM.UtilNumberValue(server.ORM.OpenApiComponentParameters.config.APP_ADMIN_APP_ID.default)?
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
                                statusMessage: '',
                                statusCode: 500,
                                res:parameters.res});
            }
        }   
    }
};
/**
 * @description get paths and components keys in OpenApi
 * @param {{URI_path:string}} parameters
 * @returns {{
 *              paths: [string, *]
 *          }}
 */
const bffOpenApiPathMatch = parameters => { 
    return {
        paths:      Object.entries(server.ORM.OpenApiPaths).filter(path=>   
                        //match with resource id string             
                        (path[0].indexOf('${')>-1 && path[0].substring(0,path[0].lastIndexOf('${')) == parameters.URI_path.substring(0,parameters.URI_path.lastIndexOf('/')+1)) ||
                        //match without resource id string
                        path[0].indexOf('${')==-1 && path[0] == parameters.URI_path
                        )[0]};
};
/**
 * @name
 * @description Returns APP data for start url or decrypts data for REST API or sends SSE font message
 *              
 * @function
 * @param {{common_app_id:number,
 *          URI_path:string,
 *          basePathRESTAPI:string,
 *          req:server['server']['req'],
 *          res:server['server']['res']}} parameters
 * @returns {Promise.<server['bff']['parameters']|null|1>}
 */
const bffDecryptRequest = async parameters =>{
    /**
     * @description Adds observation record for given type
     * @param {server['ORM']['Object']['IamControlObserve']['Type']} type 
     */
    const bffObserveRecord = async type => {
            /**@ts-ignore @type{server['ORM']['Object']['IamControlObserve']} */
            const recordObserve = { IamUserId:null,
                                    AppId:parameters.common_app_id,
                                    Ip:parameters.req.socket.remoteAddress.replace('::ffff:',''), 
                                    UserAgent:parameters.req.headers['user-agent'], 
                                    Host:parameters.req.headers.host, 
                                    AcceptLanguage:parameters.req.headers['accept-language'], 
                                    Method:parameters.req.method,
                                    Url:parameters.req.path,
                                    Status:0, 
                                    Type:type};
            await server.ORM.db.IamControlObserve.post(parameters.common_app_id, recordObserve);
    }
    /**
     * @name bffAuthenticateRequestKeys
     * @description OWASP 3.2.1 requirement
     *              Authenticates request headers keys for APP/ADMIN, font or browser CSS font url
     *              Values must be as specified in openApi config or request headers can be missing
     *              Creates observe record REQUEST_KEY if authentication fails
     * @param {{headers:            server['server']['req']['headers'], 
     *          openApiConfigKey:  'IAM_AUTHENTICATE_REQUEST_KEY_VALUES_APP'|
     *                              'IAM_AUTHENTICATE_REQUEST_KEY_VALUES_FONT'|
     *                              'IAM_AUTHENTICATE_REQUEST_KEY_VALUES_REST_API'}} params
     * @returns {Promise.<boolean>}
     */
    const bffAuthenticateRequestKeys = async params =>{
        const keysOk = Object.entries(JSON.parse(server.ORM.OpenApiComponentParameters.config[params.openApiConfigKey].default))
            .filter(key=>
                //Accept always same-origin or value in OpenApi for sec-fetch-site
                (key[0]=='sec-fetch-site' && ['same-origin',key[1]].includes((params.headers[key[0]]??key[1])) ||
                /**@ts-ignore */
                 key[0]!='sec-fetch-site' && ((params.headers[key[0]]??key[1])==key[1]))
            )
            .length == Object.keys(JSON.parse(server.ORM.OpenApiComponentParameters.config[params.openApiConfigKey].default)).length;
        if (!keysOk){
            //Add observe record
            await bffObserveRecord('REQUEST_KEY')
        }
        return keysOk;
    }
        

    if (server.ORM.OpenApiServers.filter(row=>['APP', 'ADMIN'].includes(row['x-type'].default) && row.variables.basePath.default == parameters.req.url)[0] &&
        parameters.req.method.toUpperCase() == 'GET'){
        //APP or ADMIN server start url
        //Apply OWASP 3.2.1 requirement for APP/ADMIN, accept missing or correct values
        if (await bffAuthenticateRequestKeys({headers:parameters.req.headers, 
                                        openApiConfigKey:'IAM_AUTHENTICATE_REQUEST_KEY_VALUES_APP'})){
            return {
                    app_id:         0,
                    endpoint:       'APP',
                    //request
                    host:           parameters.req.headers.host ?? '', 
                    url:            parameters.req.url,
                    uuid:           parameters.req.url.substring(parameters.basePathRESTAPI.length).split('~')[0],
                    method:         parameters.req.method,
                    URI_path:       parameters.URI_path,
                    query:          parameters.req.query?.parameters ?? '',
                    body:           parameters.req.body,
                    security_app:   null,
                    authorization:  null, 
                    //metadata
                    ip:             parameters.req.socket.remoteAddress, 
                    user_agent:     parameters.req.headers['user-agent'], 
                    accept_language:parameters.req.headers['accept-language'], 
                    //response
                    jwk:            null,
                    iv:             null,
                    res:            parameters.res,
                    //x
                    XAppId:         null,
                    XAppIdAuth:     null,
                    XMethod:        null,
                    XUrl:           null
                }
            }
        else
            //invalid request
            return null;
    }
    else{
        //lookup uuid in IamEncryption or ServiceRegistry for microservice
        /**@type{server['ORM']['Object']['IamEncryption']}*/
        const encryptionData = (server.ORM.db.IamEncryption.get({app_id:parameters.common_app_id, resource_id:null, data:{data_app_id:null}}).result ?? [])
                                .filter((/**@type{server['ORM']['Object']['IamEncryption']}*/encryption)=>
                                        encryption.Uuid==(parameters.req.url.substring(parameters.basePathRESTAPI.length).split('~')[0])
                                )[0] ?? (server.ORM.db.ServiceRegistry.get({app_id:parameters.common_app_id, resource_id:null, data:{name:null}}).result ?? [])
                                .filter((/**@type{server['ORM']['Object']['ServiceRegistry']}*/service)=>service.Uuid==(parameters.req.url.substring(parameters.basePathRESTAPI.length).split('~')[0]))
                                .map((/**@type{server['ORM']['Object']['ServiceRegistry']}*/service)=>{
                                    return {
                                        Id:                 null,
                                        Uuid:               service.Uuid,
                                        AppId:             0,
                                        IamAppIdTokenId:null,
                                        Secret:             service.Secret,
                                        Url:                null,
                                        Type:               'MICROSERVICE',
                                        Created:            null};})[0];
                                
        if (encryptionData){
            if(encryptionData.Type=='FONT'){
                //Apply OWASP 3.2.1 requirement for browser CSS font url request, accept missing or correct values
                if (await bffAuthenticateRequestKeys({headers:parameters.req.headers, 
                                                openApiConfigKey:'IAM_AUTHENTICATE_REQUEST_KEY_VALUES_FONT'})){
                    //font request
                    const token = server.ORM.db.IamAppIdToken.get({ app_id:parameters.common_app_id, 
                                    resource_id:(server.ORM.db.IamEncryption.get({app_id:parameters.common_app_id, resource_id:null, data:{data_app_id:null}}).result ?? [])
                                                    .filter((/**@type{server['ORM']['Object']['IamEncryption']}*/encryption)=>
                                                            encryption.Uuid==(parameters.req.url.substring(parameters.basePathRESTAPI.length).split('~')[1])
                                                    )[0].IamAppIdTokenId, 
                                    data:{data_app_id:null}}).result[0].Token;
                    if (token){
                        server.socket.socketClientPostMessage({app_id:parameters.common_app_id,
                                                        resource_id:null,
                                                        data:{  data_app_id:null,
                                                                iam_user_id:null,
                                                                idToken:token,
                                                                message:JSON.stringify({
                                                                            uuid:parameters.req.url.substring(parameters.basePathRESTAPI.length).split('~')[0],
                                                                            url: encryptionData.Url
                                                                        }),
                                                                message_type:'FONT_URL'
                                                            }
                                                    });
                        return 1;
                    }
                    else
                        return null;
                }
                else
                    //invalid request
                    return null;
                
            }
            else{
                //Apply OWASP 3.2.1 requirement for REST API, accept missing or correct values
                if (await bffAuthenticateRequestKeys({headers:parameters.req.headers, 
                                                openApiConfigKey:'IAM_AUTHENTICATE_REQUEST_KEY_VALUES_REST_API'})){
                    //REST API request
                    const jwk = JSON.parse(Buffer.from(encryptionData.Secret, 'base64').toString('utf-8')).jwk;
                    const iv  = JSON.parse(Buffer.from(encryptionData.Secret, 'base64').toString('utf-8')).iv;
                    try {
                        const decrypted = JSON.parse(server.security.securityTransportDecrypt({ 
                                            app_id:0,
                                            encrypted:  parameters.req.body.x,
                                            jwk:        jwk,
                                            iv:         iv}));
                        const endpoint = decrypted.url.startsWith(server.ORM.OpenApiComponentParameters.config.SERVER_REST_RESOURCE_BFF.default + '/')?
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
                                host: parameters.req.headers.host ?? '', 
                                security:{
                                            IamEncryption:encryptionData,
                                            idToken:idToken,
                                            AppId:decrypted.headers['app-id'], 
                                            AppSignature: decrypted.headers['app-signature'],
                                },
                                ip: parameters.req.headers['x-forwarded-for'] || parameters.req.socket.remoteAddress,
                                res:parameters.res
                                })
                                .then(authenticate=>{
                                    
                                    return  (authenticate.app_id !=null && decrypted)?
                                                {
                                                app_id:         authenticate.app_id,
                                                endpoint:       endpoint,
                                                //request
                                                host:           parameters.req.headers.host ?? '', 
                                                url:            decrypted.url,
                                                uuid:           parameters.req.url.substring(parameters.basePathRESTAPI.length).split('~')[0],
                                                method:         decrypted.method,
                                                URI_path:       decrypted.url.indexOf('?')>-1?
                                                                    decrypted.url.substring(0, decrypted.url.indexOf('?')):
                                                                        decrypted.url,
                                                query:          (decrypted.url.indexOf('?')>-1?
                                                                    Array.from(new URLSearchParams(decrypted.url
                                                                    .substring(decrypted.url.indexOf('?')+1)))
                                                                    .reduce((query, param)=>{
                                                                        const key = {[param[0]] : param[1]};
                                                                        return {...query, ...key};
                                                                                    /**@ts-ignore */
                                                                    }, {}):null)?.parameters ?? '',
                                                body:           decrypted.body?JSON.parse(decrypted.body):null,
                                                security_app:   { 
                                                                AppId: decrypted.headers['Content-Type'] ==server.CONTENT_TYPE_SSE?
                                                                    0:
                                                                        decrypted.headers['app-id']??null,
                                                                AppSignature: decrypted.headers['app-signature']??null,
                                                                AppIdToken: decrypted.headers['app-id-token']?.replace('Bearer ','')??null
                                                                },
                                                authorization:  decrypted.headers.Authorization??null, 
                                                //metadata
                                                ip:             parameters.req.headers['x-forwarded-for'] || parameters.req.socket.remoteAddress, 
                                                user_agent:     parameters.req.headers['user-agent'], 
                                                accept_language:parameters.req.headers['accept-language'], 
                                                //response
                                                jwk:            jwk,
                                                iv:             iv,
                                                res:            parameters.res,
                                                //x
                                                XAppId:         decrypted?.headers['app-id'],
                                                XAppIdAuth:     authenticate.app_id !=null?1:0,
                                                XMethod:        decrypted?.method??null,
                                                XUrl:           decrypted?.url??null}:
                                                    null;
                                });
                    } catch (error) {
                       //decrypt failed
                        return null;
                    }
                }
                else
                    //invalid request
                    return null;
            }
            
        }
        else{
            //invalid request
            //no encryption data
            //Add observe record
            await bffObserveRecord('DECRYPTION_FAIL')
            return null;
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
 * @param {{Id:string,
 *          CorrelationId:string,
 *          RequestStart:number,
 *          XAppId:server['ORM']['Object']['App']['Id']|null,
 *          XAppIdAuth:server['ORM']['Object']['App']['Id']|null,
 *          XUrl:server['server']['req']['url']|null,
 *          XMethod:server['server']['req']['method']|null}} RequestData
 * @returns {Promise<*>}
 */
 const bff = async (req, res, RequestData) =>{
    const common_app_id = server.ORM.UtilNumberValue(server.ORM.OpenApiComponentParameters.config.APP_COMMON_APP_ID.default)??0;
    
    // check JSON maximum size, parameter uses megabytes (MB)
    if (req.body && JSON.stringify(req.body).length/1024/1024 > 
            (server.ORM.UtilNumberValue((server.ORM.OpenApiComponentParameters.config.SERVER_JSON_LIMIT.default ?? '0').replace('MB',''))??0)){
        //log error                                        
        server.ORM.db.Log.post({  app_id:0, 
                    data:{  object:'LogRequestError', 
                            request:{   Host:req.headers.host,
                                        Ip:req.socket.remoteAddress,
                                        RequestId: RequestData.Id,
                                        CorrelationId:RequestData.CorrelationId,
                                        Url:req.url,
                                        HttpInfo:req.httpVersion,
                                        Method:req.method,
                                        StatusCode:res.statusCode,
                                        StatusMessage:res.statusMessage,
                                        UserAgent:req.headers['user-agent'],
                                        AcceptLanguage:req.headers['accept-language'],
                                        Referer:req.headers.referer,
                                        SizeReceived:req.socket.bytesRead,
                                        SizeSent:req.socket.bytesWritten,
                                        ResponseTime:Date.now() - RequestData.RequestStart,
                                        XAppId:RequestData.XAppId,
                                        XAppIdAuth:RequestData.XAppIdAuth,
                                        XUrl:RequestData.XUrl,
                                        XMethod:RequestData.XMethod,
                                        Req:null
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
        
        //If first time, when no admin exists, then display maintenance for users
        if (server.ORM.db.IamUser.get(0, null).result.length==0 && (await server.app_common.commonAppIam(req.headers.host)).admin == false){
            return bffResponse({
                                    result_request:{result:await ComponentMaintenance({  data:   null,
                                                                methods:{commonResourceFile:server.app_common.commonResourceFile}
                                                            }), 
                                                    type:'HTML'},
                                    host:req.headers.host,
                                    route:null,
                                    res:res});
        }
        else{
            //Encrypted or App/Admin path
            const URI_path = req.url.indexOf('?')>-1?
                                req.url.substring(0, req.url.indexOf('?')):
                                    req.url;
            //check if REST API or css font url request, that both are (should be) the only declared public paths in OpenApi
            const basePathRESTAPI = server.ORM.OpenApiServers.filter(server=>server['x-type'].default=='REST_API')[0].variables.basePath.default;
            
            //access control that stops request if not passing controls
            if (await server.iam.iamAuthenticateRequest({ip:req.socket.remoteAddress, 
                                                        common_app_id:common_app_id,
                                                        OpenApiPathsMatchPublic:bffOpenApiPathMatch({URI_path:URI_path.replace(basePathRESTAPI,'')}).paths,
                                                        req:req,
                                                        res:res})
                    .catch((/**@type{server['server']['error']}*/error)=>{
                        return bffResponse({result_request:{
                                                http:500, 
                                                code:null,
                                                text:error, 
                                                developerText:'bff',
                                                moreInfo:null, 
                                                type:'JSON'},
                                            route:null,
                                            res:res})
                    })){
                //decrypt request
                /**@type{server['bff']['parameters']|null|1} */
                const bff_parameters = await bffDecryptRequest({common_app_id:common_app_id, 
                                                                URI_path:URI_path,
                                                                basePathRESTAPI:basePathRESTAPI,
                                                                req:req, 
                                                                res:res});
                /**@ts-ignore */
                RequestData.XAppId = bff_parameters?.XAppId;
                /**@ts-ignore */
                RequestData.XAppIdAuth = bff_parameters?.XAppIdAuth;
                /**@ts-ignore */
                RequestData.XMethod = bff_parameters?.XMethod;
                /**@ts-ignore */
                RequestData.XUrl = bff_parameters?.XUrl;
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
                    //control rate limiter using decrypted url
                    if (server.iam.iamAuthenticateRequestRateLimiter({  app_id:common_app_id, 
                                                                        ip:req.socket.remoteAddress, 
                                                                        path:bff_parameters.url})){
                        const match = bffOpenApiPathMatch({ URI_path: bff_parameters.URI_path});
                        if (bff_parameters.endpoint != 'APP' && match.paths &&match.paths[1][bff_parameters.method.toLowerCase()]?.requestBody?.content['text/event-stream']){
                            //SSE, log since response is open and log again when closing
                            server.ORM.db.Log.post({  app_id:0, 
                                data:{  object:'LogRequestInfo', 
                                        request:{   Host:req.headers.host,
                                                    Ip:req.socket.remoteAddress,
                                                    RequestId: RequestData.Id,
                                                    CorrelationId:RequestData.CorrelationId,
                                                    Url:req.url,
                                                    HttpInfo:req.httpVersion,
                                                    Method:req.method,
                                                    StatusCode:res.statusCode,
                                                    StatusMessage:'SSE',
                                                    UserAgent:req.headers['user-agent'],
                                                    AcceptLanguage:req.headers['accept-language'],
                                                    Referer:req.headers.referer,
                                                    SizeReceived:req.socket.bytesRead,
                                                    SizeSent:req.socket.bytesWritten,
                                                    ResponseTime:Date.now() - RequestData.RequestStart,
                                                    XAppId:RequestData.XAppId,
                                                    XAppIdAuth:RequestData.XAppIdAuth,
                                                    XUrl:RequestData.XUrl,
                                                    XMethod:RequestData.XMethod,
                                                    Req:server.ORM.UtilNumberValue(server.ORM.OpenApiComponentParameters.config.LOG_REQUEST_LEVEL.default)==2?req:null
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
                            
                        
                        if (bff_parameters.endpoint == 'APP'){
                            //use common app id for APP since no app id decided
                            //App route
                            return bffResponse({app_id:common_app_id,
                                                result_request:await server.app_common.getAppInit({  app_id:common_app_id,
                                                                            ip:bff_parameters.ip, 
                                                                            host:bff_parameters.host ?? '', 
                                                                            user_agent:bff_parameters.user_agent, 
                                                                            accept_language:bff_parameters.accept_language}),
                                                host:bff_parameters.host,
                                                route : 'APP',
                                                res:bff_parameters.res})
                            .catch((error)=>
                                server.ORM.db.Log.post({  app_id:common_app_id, 
                                    data:{  object:'LogBffError', 
                                            bff:{   Service:'APP',
                                                    Method:bff_parameters.method,
                                                    Url:bff_parameters.url,
                                                    Operation:null,
                                                    Parameters:bff_parameters.query
                                                },
                                            log:error
                                        }
                                    }).then(() =>server.app_common.commonAppError())
                            );
                        }
                        else{
                            //REST API route
                            //REST API requests from client are encoded using base64
                            const decodedquery = bff_parameters.query?Buffer.from(bff_parameters.query, 'base64').toString('utf-8'):'';   
                            return await bffRestApi({  
                                                    app_id:bff_parameters.app_id,
                                                    endpoint:bff_parameters.endpoint,
                                                    host:bff_parameters.host ?? '', 
                                                    url:bff_parameters.url ?? '',
                                                    uuid:bff_parameters.uuid,
                                                    /**@ts-ignore */
                                                    method:bff_parameters.method.toUpperCase(),
                                                    URI_path:bff_parameters.URI_path,
                                                    app_query: decodedquery?
                                                                new URLSearchParams(decodedquery):
                                                                    null,
                                                    body:bff_parameters.body?.data?
                                                            JSON.parse(Buffer.from(bff_parameters.body.data, 'base64').toString('utf-8')):
                                                                '',
                                                    idToken:bff_parameters.security_app?.AppIdToken??'', 
                                                    authorization:bff_parameters.authorization ?? '', 
                                                    ip:bff_parameters.ip, 
                                                    user_agent:bff_parameters.user_agent, 
                                                    accept_language:bff_parameters.accept_language, 
                                                    res:bff_parameters.res})
                                    .then(result_service => {
                                        const log_result = server.ORM.UtilNumberValue(server.ORM.OpenApiComponentParameters.config.LOG_REQUEST_LEVEL.default)==2?result_service:'✅';
                                        return server.ORM.db.Log.post({  app_id:bff_parameters.app_id, 
                                            data:{  object:'LogBffInfo', 
                                                    bff:{   Service:'RESTAPI',
                                                            Method:bff_parameters.method,
                                                            Url: bff_parameters.url.indexOf('?')>-1?
                                                                    bff_parameters.url.substring(0, bff_parameters.url.indexOf('?')):
                                                                        bff_parameters.url,
                                                            Operation:result_service.operation??null,
                                                            Parameters:decodedquery
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
                                            data:{  object:'LogBffError', 
                                                    bff:{   Service:'RESTAPI',
                                                            Method:bff_parameters.method,
                                                            Url:bff_parameters.url,
                                                            Operation:null,
                                                            Parameters:bff_parameters.query
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
                    else
                        //too many requests
                        return bffResponse({result_request:{http:429, 
                                                            code:null,
                                                            text:server.iam.iamUtilMessageNotAuthorized(), 
                                                            developerText:'bff',
                                                            moreInfo:null, 
                                                            type:'JSON'},
                                                route:null,
                                                res:res});
            }
            else{
                res.end();
            }
            
        }
    }
};

/**
 * @name bffRestApi
 * @namespace ROUTE_REST_API
 * @description Routes using openAPI where paths, methods, validation rules, operationId and function parameters are defined
 *              OperationId syntax: [path].[filename].[functioname] or [path]_[path].[filename].[functioname]
 *              Returns single resource result format or ISO20022 format with either list header or page header metadata
 * @function
 * @param {server['bff']['RestApi_parameters']} parameters
 * @returns {Promise.<server['server']['response'] & {singleResource?:boolean, operation?:string}>}
 */
const bffRestApi = async parameters =>{
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
            if (server.iam.iamAuthenticateResource({app_id:                     params.app_id_authenticated, 
                                                    ip:                         parameters.ip, 
                                                    idToken:                    parameters.idToken,
                                                    endpoint:                   parameters.endpoint,
                                                    authorization:              parameters.authorization, 
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
     * @description returns resource id name and value if used using OpentApi and URI path
     * @param {*} paths
     * @returns {Object.<string, string|number|null>|null}
     */
    const openApiResourceId =paths =>
        paths[0].indexOf('${')>-1?
            paths[1][Object.keys(paths[1])[0]].parameters
            .filter((/**@type{*}*/parameter)=>
                parameter.in=='path'
            )[0]==null?null:
            {[paths[0].substring(paths[0].indexOf('${')+'${'.length).replace('}','')]:
                (server.ORM.OpenApiComponentParameters.paths[paths[0].substring(paths[0].indexOf('${')+'${'.length).replace('}','')]?.schema.type == 'number'?
                    server.ORM.UtilNumberValue(parameters.URI_path.substring(parameters.URI_path.lastIndexOf('/')+1)):
                        parameters.URI_path.substring(parameters.URI_path.lastIndexOf('/')+1))
            }:
                //no resource id string in defined path
                null;
    const OpenApiPaths = bffOpenApiPathMatch({  URI_path:   parameters.URI_path}).paths;
    if (OpenApiPaths){
        /**
         * @description get parameter in path
         * @param{string} key
         * @returns {*}
         */
        const getParameter = key => methodObj.parameters.filter((/**@type{*}*/parameter)=>
                                                                        Object.keys(parameter)[0]=='$ref' && Object.values(parameter)[0]=='#/components/parameters/paths/' + key)[0];
                   
        const methodObj = OpenApiPaths[1][parameters.method.toLowerCase()];
        if (methodObj){   
            /**
             * @param {{}} keys
             * @param {[string,*]} key
             */
            const addBodyKey = (keys, key )=>{
                return {...keys, ...{   [key[0]]:{  
                                                    data:       parameters.body[key[0]],
                                                    //IAM parameters are required by default
                                                    required:   key[1]?.required ?? (key[0].startsWith('IAM')?true:false),
                                                    type:       'BODY',
                                                }
                                    }
                                };
            };
            const CONTENT_TYPE_JSON_OPENAPI = 'application/json';

            //add parameters using tree shaking pattern
            //so only defined parameters defined using openAPI pattern are sent to functions
            const parametersIn = 
                                    {...parameters.method=='GET'?
                                        //QUERY
                                        {...methodObj.parameters
                                                        //include all parameters.in=query
                                                        .filter((/**@type{*}*/parameter)=>
                                                            parameter.in == 'query'|| 
                                                            //component parameter that has in=query
                                                            (   '$ref' in parameter && 
                                                                'required' in parameter && 
                                                                server.ORM.OpenApiComponentParameters.paths[parameter['$ref'].split('#/components/parameters/paths/')[1]].in == 'query')
                                                        )
                                                        .reduce((/**@type{*}*/keys, /**@type{*}*/key)=>{
                                                            if ('$ref' in key )
                                                                return {...keys, ...{   
                                                                                    [key['$ref'].split('#/components/parameters/paths/')[1]]:
                                                                                    {
                                                                                        data:       parameters.app_query?.get(key['$ref'].split('#/components/parameters/paths/')[1]),
                                                                                        //IAM parameters are required by default
                                                                                        required:   (key?.required ?? (key['$ref'].split('#/components/parameters/paths/')[1].startsWith('IAM')?true:false)),
                                                                                        type:       'QUERY',
                                                                                    }
                                                                                }
                                                                        };
                                                            else
                                                                return {...keys, ...{   
                                                                                    [key.name]:{
                                                                                        data:       parameters.app_query?.get(key.name),
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
                                        (methodObj.requestBody?.content && methodObj.requestBody?.content[CONTENT_TYPE_JSON_OPENAPI]?.schema?.additionalProperties)?
                                            {...parameters.body,...Object.entries(methodObj.requestBody?.content[CONTENT_TYPE_JSON_OPENAPI]?.schema?.properties)
                                                                            .reduce((/**@type{*}*/keys, /**@type{*}*/key)=>addBodyKey(keys,key),{})}:
                                                        Object.entries(methodObj.requestBody?.content[CONTENT_TYPE_JSON_OPENAPI]?.schema?.properties??[])
                                                        .reduce((/**@type{*}*/keys, /**@type{*}*/key)=>addBodyKey(keys,key),{})??{},
                                    ...methodObj.parameters
                                    //PATH
                                    //include parameters.in=path, one resource id in path supported
                                    //all path parameters should be defined in #/components/parameters
                                    .filter((/**@type{*}*/parameter)=>
                                        parameter.in=='path' && '$ref' in parameter) 
                                    .reduce((/**@type{*}*/keys, /**@type{*}*/key)=>{
                                            return {...keys, ...{   
                                                                [key['$ref'].split('#/components/parameters/paths/')[1]]:
                                                                {
                                                                    data:       openApiResourceId(  OpenApiPaths)?.[key['$ref'].split('#/components/parameters/paths/')[1]],
                                                                    //IAM parameters are required by default
                                                                    required:   (key?.required ?? (key['$ref'].split('#/components/parameters/paths/')[1].startsWith('IAM')?true:false)),
                                                                    type:       'PATH',
                                                                }
                                                            }
                                                    };
                                    },{})
                                    };
            if (AuthenticateIAM({   app_id_authenticated:   parameters.app_id,
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
                                            parameters.method=='GET'?
                                            ((parameters.app_query?.has(parameter)??false)==false):
                                                (parameter in parameters.body)==false)
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
                if ('IAM_module_app_id' in parametersIn ||['APP_EXTERNAL','APP_ACCESS_EXTERNAL'].includes(parameters.endpoint)){
                    //APP_ACCESS_EXTERNAL can only run function using same appid used by host and access data for same app id
                    parametersIn.module_app_id = ['APP_EXTERNAL','APP_ACCESS_EXTERNAL'].includes(parameters.endpoint)?
                                                    parameters.app_id:
                                                        parametersIn.IAM_module_app_id!=null?
                                                            server.ORM.UtilNumberValue(parametersIn.IAM_module_app_id):
                                                                null;
                }
                if ('IAM_data_app_id' in parametersIn ||['APP_EXTERNAL','APP_ACCESS_EXTERNAL'].includes(parameters.endpoint)){
                    //APP_ACCESS_EXTERNAL can only run function using same appid used by host and access data for same app id
                    parametersIn.data_app_id = ['APP_EXTERNAL','APP_ACCESS_EXTERNAL'].includes(parameters.endpoint)?
                                                    parameters.app_id:
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
                                                    (parameters.method!='GET' ||functionRESTAPI=='microserviceRequest')?
                                                        true: ( Object.keys(openApiResourceId(OpenApiPaths)??{}).length==1 && 
                                                                Object.values(openApiResourceId(OpenApiPaths)??{})[0]!=null);
                //return result using ISO20022 format
                //send only parameters to the function if declared true
                const result = await  moduleRESTAPI[functionRESTAPI]({
                                ...(getParameter('server_app_id')               && {app_id:             parameters.app_id}),
                                ...(getParameter('server_idtoken')              && {idToken:            parameters.idToken}),
                                ...(getParameter('server_authorization')        && {authorization:      parameters.authorization}),
                                ...(getParameter('server_user_agent')           && {user_agent:         parameters.user_agent}),
                                ...(getParameter('server_accept_language')      && {accept_language:    parameters.accept_language}),
                                ...(getParameter('server_response')             && {response:           parameters.res}),
                                ...(getParameter('server_host')                 && {host:               parameters.host}),
                                ...(getParameter('server_ip')                   && {ip:                 parameters.ip}),
                                ...(getParameter('server_microservice')         && {microservice:       getParameter('server_microservice').default}),
                                ...(getParameter('server_microservice_service') && {service:            getParameter('server_microservice_service').default}),
                                ...(getParameter('server_message_queue_type')   && {message_queue_type: getParameter('server_message_queue_type').default}),
                                ...(getParameter('server_url')                  && {url:                parameters.url}),
                                ...(getParameter('server_uuid')                 && {uuid:               parameters.uuid}),
                                ...(getParameter('server_method')               && {method:             parameters.method}),
                                ...(Object.keys(parametersIn)?.length>0         && {data:               {...parametersIn}}),
                                ...(getParameter('server_endpoint')             && {endpoint:           parameters.endpoint}),
                                ...(openApiResourceId(  OpenApiPaths)           && {resource_id:        Object.values(openApiResourceId(  OpenApiPaths)??{})[0]})
                                });
                return { singleResource:singleResource(),
                         operation:methodObj.operationId,
                         ...result
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

export{bffConnect, bffExternal, bffMicroservice, bffResponse, bff};