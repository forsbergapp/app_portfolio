/** @module apps */
// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

const {microservice_api_version, microserviceRequest}= await import(`file://${process.cwd()}/microservice/microservice.service.js`);
const {ConfigGet, ConfigGetApp} = await import(`file://${process.cwd()}/server/config.service.js`);
const {send_iso_error, getNumberValue, serverRoutes} = await import(`file://${process.cwd()}/server/server.service.js`);
const {LogServiceI, LogServiceE} = await import(`file://${process.cwd()}/server/log.service.js`);
const {iam_decode} = await import(`file://${process.cwd()}/server/iam.service.js`);

/**
 * Backend for frontend BFF microservice
 * @param {number} app_id
 * @param {Types.bff_parameters_microservices} microservice_parameters
 * @returns {Promise<(*)>}
 */
 const BFF_microservices = async (app_id, microservice_parameters) => {
    return new Promise((resolve, reject) => {
        if (app_id !=null && microservice_parameters.service && microservice_parameters.path){
            let microservice_path = '';
            const call_microservice = async (/**@type{string}*/microservice_path, /**@type{string}*/service) => {
                //use app id, CLIENT_ID and CLIENT_SECRET for microservice IAM
                const authorization = `Basic ${Buffer.from(ConfigGetApp(app_id, app_id, 'SECRETS').CLIENT_ID + ':' + ConfigGetApp(app_id, app_id, 'SECRETS').CLIENT_SECRET,'utf-8').toString('base64')}`;
                microserviceRequest(app_id == getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), //if appid = APP_COMMON_APP_ID then send true
                                    microservice_path,service, microservice_parameters.method,microservice_parameters.ip, authorization, microservice_parameters.user_agent, microservice_parameters.accept_language, microservice_parameters.body?microservice_parameters.body:null)
                .then((/**@type{string}*/result)=>resolve(result))
                .catch((/**@type{Types.error}*/error)=>reject(error));
            };
            
            
            switch (microservice_parameters.service){
                case 'GEOLOCATION':{
                    //ENABLE_GEOLOCATION control is for ip to geodata service /place and /timezone should be allowed
                    if ((ConfigGet('SERVICE_IAM', 'ENABLE_GEOLOCATION')=='1' || microservice_parameters.query.startsWith('/ip')==false)){
                        //set ip from client in case ip query parameter is missing
                        if (microservice_parameters.path.startsWith('/geolocation/ip')){    
                            const params = microservice_parameters.query.split('&');
                            //if ip parameter does not exist
                            if (params.filter(parm=>parm.includes('ip=')).length==0 )
                                params.push(`ip=${microservice_parameters.ip}`);
                            else{
                                //if empty ip parameter
                                if (params.filter(parm=>parm == 'ip=').length==1)
                                    params.map(parm=>parm = parm.replace('ip=', `ip=${microservice_parameters.ip}`));
                            }
                            microservice_parameters.query = `${params.reduce((param_sum,param)=>param_sum += '&' + param)}`;
                        }
                        microservice_path = `/geolocation/v${microservice_api_version('GEOLOCATION')}${microservice_parameters.path}?${microservice_parameters.query}`;
                        
                    }
                    else
                        return resolve('');
                    break;
                }
                case 'WORLDCITIES':{
                    //limit records here in server for this service:
                    if (microservice_parameters.path.startsWith('/worldcities/city/search'))
                        microservice_parameters.query = microservice_parameters.query + `&limit=${ConfigGet('SERVICE_DB', 'LIMIT_LIST_SEARCH')}`;
                    microservice_path = `/worldcities/v${microservice_api_version('WORLDCITIES')}${microservice_parameters.path}?${microservice_parameters.query}`;
                    break;
                }
                case 'MAIL':{
                    microservice_path = `/mail/v${microservice_api_version('MAIL')}${microservice_parameters.path}?${microservice_parameters.query}`;
                    break;
                }
                case 'PDF':{
                    microservice_path = `/pdf/v${microservice_api_version('PDF')}${microservice_parameters.path}?${microservice_parameters.query}`;
                    break;
                }
                default:{
                    return reject ('⛔');
                }
            }
            //Microservice URI : [protocol]://[subdomain.][domain]:[port]/[service]/v[version]/[resource (servicename lowercase)]/[path]?[query]
            return call_microservice(`${microservice_path}&app_id=${app_id}`, microservice_parameters.service);
        }
        else
            return reject ('⛔');
    });
 };
/**
 * Backend for frontend BFF server
 * @param {number} app_id
 * @param {Types.bff_parameters} bff_parameters
 * @param {string} app_query
 * @returns {Promise<(*)>}
 */
 const BFF_server = async (app_id, bff_parameters, app_query) => {
    return new Promise((resolve, reject) => {
        if ((bff_parameters.endpoint=='APP' && bff_parameters.service=='APP') ||
            (app_id !=null && bff_parameters.endpoint && bff_parameters.service)){
            serverRoutes({  app_id:app_id, 
                            service:bff_parameters.service, 
                            endpoint:bff_parameters.endpoint,
                            method:bff_parameters.method.toUpperCase(), 
                            ip:bff_parameters.ip, 
                            host:bff_parameters.host, 
                            url:bff_parameters.url,
                            route_path:bff_parameters.route_path,
                            user_agent:bff_parameters.user_agent, 
                            accept_language:bff_parameters.accept_language, 
                            authorization:bff_parameters.authorization, 
                            parameters:app_query, 
                            body:bff_parameters.body, 
                            res:bff_parameters.res})
            .then((/**@type{string}*/result)=>resolve(result))
            .catch((/**@type{Types.error}*/error)=>reject(error));
        }
        else{
            //required parameters not provided
            reject({
                message: '⛔'
            });
        }
    });
};
/**
 * Backend for frontend (BFF) common
 * 
 * @param {Types.bff_parameters} bff_parameters
 */
 const BFF = (bff_parameters) =>{
    
    /**
     * @param {number} app_id
     * @param {Types.error} error 
     */
    const log_error = (app_id, error) =>{
        LogServiceE(app_id ?? null, bff_parameters.service ?? null, bff_parameters.query ?? null, error).then(() => {
            const statusCode = bff_parameters.res.statusCode==200?503:bff_parameters.res.statusCode ?? 503;
            send_iso_error( bff_parameters.res, 
                            statusCode, 
                            null, 
                            (typeof error === 'string' && error.startsWith('MICROSERVICE ERROR'))?'MICROSERVICE ERROR':error, 
                            null, 
                            null);
            
        });
    }
    const app_id = bff_parameters.iam?getNumberValue(iam_decode(bff_parameters.iam).get('app_id')):null;
    let decodedquery = '';
    if ((bff_parameters.endpoint=='APP' && bff_parameters.service=='APP'))
        decodedquery = bff_parameters.route_path;
    else
        decodedquery = bff_parameters.query?Buffer.from(bff_parameters.query, 'base64').toString('utf-8').toString():'';
    
    if (bff_parameters.service == 'GEOLOCATION' || 
        bff_parameters.service == 'MAIL' || 
        bff_parameters.service == 'PDF' || 
        bff_parameters.service == 'WORLDCITIES'){
        /**@type {Types.bff_parameters_microservices} */
        const parameters = {
            //app control
            service: bff_parameters.service, 
            //request
            path:bff_parameters.route_path,
            body: bff_parameters.body,
            query: decodedquery, 
            method: bff_parameters.method,
            //metadata
            ip: bff_parameters.ip, 
            user_agent: bff_parameters.user_agent, 
            accept_language: bff_parameters.accept_language
        };
        BFF_microservices(app_id, parameters)
        .then((/**@type{*}*/result_service) => {
            const log_result = getNumberValue(ConfigGet('SERVICE_LOG', 'REQUEST_LEVEL'))==2?result_service:'✅';
            LogServiceI(app_id, bff_parameters.service, bff_parameters.query, log_result).then(()=>{
                bff_parameters.res.status(200).send(result_service);
            });
        })
        .catch((/**@type{Types.error}*/error) => {
            log_error(app_id, error);
            
        });
    }        
    else{
        BFF_server(app_id, bff_parameters, decodedquery)
        .then((/**@type{*}*/result_service) => {
            if (bff_parameters.endpoint=='APP' && bff_parameters.service=='APP' && result_service!=null && result_service.STATIC){
                if (result_service.SENDFILE){
                    bff_parameters.res.sendFile(result_service.SENDFILE);
                    bff_parameters.res.status(200);
                }
                else
                    bff_parameters.res.status(200).send(result_service.SENDCONTENT);
            }
            else{
                const log_result = getNumberValue(ConfigGet('SERVICE_LOG', 'REQUEST_LEVEL'))==2?result_service:'✅';
                LogServiceI(app_id, bff_parameters.service, bff_parameters.query, log_result).then(()=>{
                    if (bff_parameters.endpoint=='SOCKET'){
                        //This endpoint only allowed for EventSource so no more update of response
                        null;
                    }
                    else{
                        //result from APP can request to redirect
                        if (bff_parameters.service=='APP' && bff_parameters.res.statusCode==301)
                            bff_parameters.res.redirect('/');
                        else 
                            if (bff_parameters.service=='APP' && bff_parameters.res.statusCode==404){
                                if (ConfigGet('SERVER', 'HTTPS_ENABLE')=='1')
                                    bff_parameters.res.redirect(`https://${ConfigGet('SERVER', 'HOST')}`);
                                else
                                    bff_parameters.res.redirect(`http://${ConfigGet('SERVER', 'HOST')}`);
                            }
                            else
                                bff_parameters.res.status(200).send(result_service);
                    }  
                })
            }
        })
        .catch((/**@type{Types.error}*/error) => {
            log_error(app_id, error);
        });
    }
};
export{send_iso_error, BFF, BFF_microservices};