/** @module apps */
// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

const microservice = await import(`file://${process.cwd()}/microservice/microservice.service.js`);
const microservice_circuitbreak = new microservice.CircuitBreaker();
const {ConfigGet, ConfigGetApp} = await import(`file://${process.cwd()}/server/config.service.js`);

/**
 * Backend for frontend BFF
 * @async
 * @param {Types.req_id_number} app_id
 * @param {string|null} endpoint
 * @param {string} service
 * @param {string} parameters
 * @param {string} ip
 * @param {string} method
 * @param {string} authorization
 * @param {string} host
 * @param {string} headers_user_agent
 * @param {string} headers_accept_language
 * @param {object} data
 * @param {number|null} user_account_logon_user_account_id
 * @param {Types.res|null} res
 * @returns {Promise<(string)>}
 */
 const BFF = async (app_id, endpoint, service, parameters, ip, method, authorization, host, headers_user_agent, headers_accept_language, data, user_account_logon_user_account_id=null, res=null) => {
    const {serverRoutes} = await import(`file://${process.cwd()}/server/server.service.js`);
    return new Promise((resolve, reject) => {
        if (!app_id && !service && !parameters){
            //required parameters not provided
            //use common app id to get message and use first lang_code form app or if missing use language in headers
            reject({
                message: '⛔'
            });
        }
        else{
            try {
                let decodedparameters = Buffer.from(parameters, 'base64').toString('utf-8').toString();
                //add user account id logged on if applicable to parameters
                decodedparameters += (user_account_logon_user_account_id)?`&user_account_logon_user_account_id=${user_account_logon_user_account_id}`:'';
                let path = '';
                const call_service = (/**@type{string}*/path, /**@type{string}*/service) => {
                    microservice_circuitbreak.MicroServiceCall(app_id,path,service, method,ip,authorization, headers_user_agent, headers_accept_language, data?data:null)
                    .then((/**@type{string}*/result)=>resolve(result))
                    .catch((/**@type{Types.error}*/error)=>reject(error));
                };
                switch (service){
                    case 'APP':
                    case 'AUTH':
                    case 'DB_API':
                    case 'SOCKET':{
                        serverRoutes(app_id, service, endpoint, method.toUpperCase(), ip, headers_user_agent, headers_accept_language, authorization, host, decodedparameters, data, res)
                        .then((/**@type{string}*/result)=>resolve(result))
                        .catch((/**@type{Types.error}*/error)=>reject(error));
                        break;
                    }
                    case 'LOG':{
                        if (endpoint=='SYSTEMADMIN')
                            serverRoutes(app_id, service, endpoint, method.toUpperCase(), ip, headers_user_agent, headers_accept_language, authorization, host, decodedparameters, data, res)
                            .then((/**@type{string}*/result)=>resolve(result))
                            .catch((/**@type{Types.error}*/error)=>reject(error));
                        else
                            return reject ('⛔');
                        break;
                    }
                    case 'SERVER':{
                        if (endpoint=='ADMIN' || endpoint=='SYSTEMADMIN')
                            serverRoutes(app_id, service, endpoint, method.toUpperCase(), ip, headers_user_agent, headers_accept_language, authorization, host, decodedparameters, data, res)
                            .then((/**@type{string}*/result)=>resolve(result))
                            .catch((/**@type{Types.error}*/error)=>reject(error));
                        else
                            return reject ('⛔');
                        break;
                    }
                    case 'GEOLOCATION':{
                        // decodedparameters ex:
                        // /ip?app_id=[id]&lang_code=en
                        // /place?latitude[latitude]&longitude=[longitude]
                        //ENABLE_GEOLOCATION control is for ip to geodata service /place and /timezone should be allowed
                        if (ConfigGet('SERVICE_AUTH', 'ENABLE_GEOLOCATION')=='1' || decodedparameters.startsWith('/ip')==false){
                            if (method=='GET'){
                                //set ip from client in case ip query parameter is missing
                                const basepath = decodedparameters.split('?')[0];
                                if (decodedparameters.startsWith('/ip')){    
                                    const params = decodedparameters.split('?')[1].split('&');
                                    //if ip parameter does not exist
                                    if (params.filter(parm=>parm.includes('ip=')).length==0 )
                                        params.push(`ip=${ip}`);
                                    else{
                                        //if empty ip parameter
                                        if (params.filter(parm=>parm == 'ip=').length==1)
                                            params.map(parm=>parm = parm.replace('ip=', `ip=${ip}`));
                                    }
                                    decodedparameters = `${basepath}?${params.reduce((param_sum,param)=>param_sum += '&' + param)}`;
                                }
                                //use app, id, CLIENT_ID and CLIENT_SECRET for microservice IAM
                                authorization = `Basic ${Buffer.from(ConfigGetApp(app_id, 'CLIENT_ID') + ':' + ConfigGetApp(app_id, 'CLIENT_SECRET'),'utf-8').toString('base64')}`;
                                path = `/geolocation${decodedparameters}&app_id=${app_id}`;
                                call_service(path, service);
                            }
                            else
                                return reject ('⛔');
                        }
                        else
                            return resolve('');
                        break;
                    }
                    case 'WORLDCITIES':{
                        // decodedparameters ex:
                        // /[countrycode]?app_user_id=[id]&app_id=[id]&lang_code=en
                        // /city/random?&app_id=[id]
                        if (method=='GET'){
                            //use app, id, CLIENT_ID and CLIENT_SECRET for microservice IAM
                            authorization = `Basic ${Buffer.from(ConfigGetApp(app_id, 'CLIENT_ID') + ':' + ConfigGetApp(app_id, 'CLIENT_SECRET'),'utf-8').toString('base64')}`;
                            //limit records here in server for this service:
                            if (decodedparameters.startsWith('/city/search'))
                                decodedparameters = decodedparameters + `&limit=${ConfigGet('SERVICE_DB', 'LIMIT_LIST_SEARCH')}`;
                            path = `/worldcities${decodedparameters}&app_id=${app_id}`;
                            call_service(path, service);
                        }
                            
                        else
                            return reject ('⛔');
                        break;
                    }
                    default:{
                        return reject ('⛔');
                    }
                }
            } catch (error) {
                return reject(error);
            }
        }
    });
};
export{BFF};