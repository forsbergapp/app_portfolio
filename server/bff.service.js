/** @module apps */
// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

const {microserviceRequest}= await import(`file://${process.cwd()}/microservice/microservice.service.js`);
const {ConfigGet, ConfigGetApp} = await import(`file://${process.cwd()}/server/config.service.js`);
const {getNumberValue, serverRoutes} = await import(`file://${process.cwd()}/server/server.service.js`);
const {LogServiceI, LogServiceE} = await import(`file://${process.cwd()}/server/log.service.js`);


/**
 * Backend for frontend BFF microservice
 * @param {Types.bff_parameters_microservices} bff_parameters
 * @returns {Promise<(*)>}
 */
 const BFF_microservices = async (bff_parameters) => {
    return new Promise((resolve, reject) => {
        if (bff_parameters.app_id !=null && bff_parameters.service && bff_parameters.parameters){
            let path = '';
            const call_microservice = (/**@type{string}*/path, /**@type{string}*/service) => {
                //use app id, CLIENT_ID and CLIENT_SECRET for microservice IAM
                const authorization = `Basic ${Buffer.from(ConfigGetApp(bff_parameters.app_id, 'CLIENT_ID') + ':' + ConfigGetApp(bff_parameters.app_id, 'CLIENT_SECRET'),'utf-8').toString('base64')}`;
                microserviceRequest(bff_parameters.app_id == getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), //if appid = APP_COMMON_APP_ID then send true
                                    path,service, bff_parameters.method,bff_parameters.ip, authorization, bff_parameters.user_agent, bff_parameters.accept_language, bff_parameters.body?bff_parameters.body:null)
                .then((/**@type{string}*/result)=>resolve(result))
                .catch((/**@type{Types.error}*/error)=>reject(error));
            };
            let decodedparameters = null;
            if (bff_parameters.parameters){
                decodedparameters = Buffer.from(bff_parameters.parameters, 'base64').toString('utf-8').toString();
            }
            if (decodedparameters !=null){
                switch (bff_parameters.service){
                    case 'GEOLOCATION':{
                        //ENABLE_GEOLOCATION control is for ip to geodata service /place and /timezone should be allowed
                        if ((ConfigGet('SERVICE_IAM', 'ENABLE_GEOLOCATION')=='1' || decodedparameters.startsWith('/ip')==false)){
                            //set ip from client in case ip query parameter is missing
                            const basepath = decodedparameters.split('?')[0];
                            if (decodedparameters.startsWith('/ip')){    
                                const params = decodedparameters.split('?')[1].split('&');
                                //if ip parameter does not exist
                                if (params.filter(parm=>parm.includes('ip=')).length==0 )
                                    params.push(`ip=${bff_parameters.ip}`);
                                else{
                                    //if empty ip parameter
                                    if (params.filter(parm=>parm == 'ip=').length==1)
                                        params.map(parm=>parm = parm.replace('ip=', `ip=${bff_parameters.ip}`));
                                }
                                decodedparameters = `${basepath}?${params.reduce((param_sum,param)=>param_sum += '&' + param)}`;
                            }
                            
                            path = `/geolocation${decodedparameters}&app_id=${bff_parameters.app_id}`;
                            call_microservice(path, bff_parameters.service);
                        }
                        else
                            return resolve('');
                        break;
                    }
                    case 'WORLDCITIES':{
                        //limit records here in server for this service:
                        if (decodedparameters.startsWith('/city/search'))
                            decodedparameters = decodedparameters + `&limit=${ConfigGet('SERVICE_DB', 'LIMIT_LIST_SEARCH')}`;
                        path = `/worldcities${decodedparameters}&app_id=${bff_parameters.app_id}`;
                        call_microservice(path, bff_parameters.service);
                        break;
                    }
                    case 'MAIL':{
                        path = `/mail${decodedparameters}&app_id=${bff_parameters.app_id}`;
                        call_microservice(path, bff_parameters.service);
                        break;
                    }
                    case 'PDF':{
                        path = `/pdf${decodedparameters}&app_id=${bff_parameters.app_id}`;
                        call_microservice(path, bff_parameters.service);
                        break;
                    }
                    default:{
                        return reject ('⛔');
                    }
                }
            }
            else
                return reject ('⛔');
        }
        else
            return reject ('⛔');
    });
 };
/**
 * Backend for frontend BFF server
 * @param {Types.bff_parameters_server} bff_parameters
 * @returns {Promise<(*)>}
 */
 const BFF_server = async (bff_parameters) => {
    return new Promise((resolve, reject) => {
        if ((bff_parameters.endpoint=='APP' && bff_parameters.service=='APP') ||
            (bff_parameters.app_id !=null && bff_parameters.endpoint && bff_parameters.service && bff_parameters.parameters)){
            try {
                let decodedparameters = null;
                if (bff_parameters.parameters){
                    if ((bff_parameters.endpoint=='APP' && bff_parameters.service=='APP'))
                        decodedparameters = bff_parameters.url;
                    else
                        decodedparameters = Buffer.from(bff_parameters.parameters, 'base64').toString('utf-8').toString();
                    //add user account id if logged on
                    decodedparameters += bff_parameters.user_account_logon_user_account_id?`&user_account_logon_user_account_id=${bff_parameters.user_account_logon_user_account_id}`:'';
                    //add system admin if logged on
                    decodedparameters += bff_parameters.system_admin?`&system_admin=${bff_parameters.system_admin}`:'';
                }
                switch (bff_parameters.endpoint + '_' + bff_parameters.service){
                    case 'APP_APP':
                    case 'APP_DATA_APP':
                    case 'APP_DATA_SOCKET':
                    case 'APP_DATA_DB_API':
                    case 'APP_SIGNUP_DB_API':
                    case 'APP_ACCESS_DB_API':
                    case 'ADMIN_SOCKET':
                    case 'ADMIN_SERVER':
                    case 'ADMIN_DB_API':
                    case 'ADMIN_APP':
                    case 'SUPER_ADMIN_DB_API':
                    case 'SYSTEMADMIN_SOCKET':
                    case 'SYSTEMADMIN_SERVER':
                    case 'SYSTEMADMIN_DB_API':
                    case 'SYSTEMADMIN_LOG':
                    case 'SOCKET_SOCKET':
                    case 'IAM_IAM':
                        serverRoutes({  app_id:bff_parameters.app_id, 
                                        service:bff_parameters.service, 
                                        endpoint:bff_parameters.endpoint, 
                                        method:bff_parameters.method.toUpperCase(), 
                                        ip:bff_parameters.ip, 
                                        host:bff_parameters.host, 
                                        url:bff_parameters.url,
                                        user_agent:bff_parameters.user_agent, 
                                        accept_language:bff_parameters.accept_language, 
                                        authorization:bff_parameters.authorization, 
                                        parameters:decodedparameters, 
                                        body:bff_parameters.body, 
                                        res:bff_parameters.res})
                        .then((/**@type{string}*/result)=>resolve(result))
                        .catch((/**@type{Types.error}*/error)=>reject(error));
                        break;
                    default:
                        return reject ('⛔');
                }
            } catch (error) {
                return reject(error);
            }
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
    if (bff_parameters.service == 'GEOLOCATION' || 
        bff_parameters.service == 'MAIL' || 
        bff_parameters.service == 'PDF' || 
        bff_parameters.service == 'WORLDCITIES'){
        /**@type {Types.bff_parameters_microservices} */
        const parameters = {
            app_id: bff_parameters.app_id, 
            endpoint:bff_parameters.endpoint, 
            service: bff_parameters.service, 
            ip: bff_parameters.ip, 
            method: bff_parameters.method,
            user_agent: bff_parameters.user_agent, 
            accept_language: bff_parameters.accept_language, 
            parameters: bff_parameters.parameters, 
            body: bff_parameters.body
        };
        BFF_microservices(parameters)
        .then((/**@type{*}*/result_service) => {
            const log_result = getNumberValue(ConfigGet('SERVICE_LOG', 'REQUEST_LEVEL'))==2?result_service:'✅';
            LogServiceI(bff_parameters.app_id, bff_parameters.service, bff_parameters.parameters, log_result).then(()=>{
                bff_parameters.res.status(200).send(result_service);
            });
        })
        .catch((/**@type{Types.error}*/error) => {
            LogServiceE(bff_parameters.app_id ?? null, bff_parameters.service ?? null, bff_parameters.parameters ?? null, error).then(() => {
                const statusCode = bff_parameters.res.statusCode==200?503:bff_parameters.res.statusCode ?? 503;
                bff_parameters.res.status(statusCode).send(error);
            });
        });
    }        
    else{
        /**@type {Types.bff_parameters_server} */
        const parameters = {
            app_id: bff_parameters.app_id, 
            endpoint:bff_parameters.endpoint, 
            service: bff_parameters.service, 
            ip: bff_parameters.ip, 
            host: bff_parameters.host, 
            method: bff_parameters.method, 
            authorization:  bff_parameters.authorization, 
            user_agent: bff_parameters.user_agent, 
            accept_language: bff_parameters.accept_language, 
            url:bff_parameters.url,
            parameters: bff_parameters.parameters, 
            body: bff_parameters.body, 
            system_admin: bff_parameters.system_admin,
            user_account_logon_user_account_id: bff_parameters.user_account_logon_user_account_id, 
            res: bff_parameters.res
        };
        BFF_server(parameters)
        .then((/**@type{*}*/result_service) => {
            const log_result = getNumberValue(ConfigGet('SERVICE_LOG', 'REQUEST_LEVEL'))==2?result_service:'✅';
            LogServiceI(bff_parameters.app_id, bff_parameters.service, bff_parameters.parameters, log_result).then(()=>{
                if (bff_parameters.endpoint=='SOCKET'){
                    //This endpoint only allowed for EventSource so no more update of response
                    null;
                }
                else{
                    //result from APP can request to redirect
                    if (bff_parameters.res.statusCode==301)
                        bff_parameters.res.redirect('/');
                    else
                        bff_parameters.res.status(200).send(result_service);
                }
            });
        })
        .catch((/**@type{Types.error}*/error) => {
            LogServiceE(bff_parameters.app_id ?? null, bff_parameters.service ?? null, bff_parameters.parameters ?? null, error).then(() => {
                const statusCode = bff_parameters.res.statusCode==200?503:bff_parameters.res.statusCode ?? 503;
                bff_parameters.res.status(statusCode).send(error);
            });
        });
    }
};
export{BFF, BFF_microservices};