/** @module apps */
// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

const {microserviceRequest}= await import(`file://${process.cwd()}/microservice/microservice.service.js`);
const {ConfigGet, ConfigGetApp} = await import(`file://${process.cwd()}/server/config.service.js`);

/**
 * Backend for frontend BFF
 * @param {Types.bff_parameters} bff_parameters
 * @returns {Promise<(string)>}
 */
 const BFF = async (bff_parameters) => {
    const {serverRoutes} = await import(`file://${process.cwd()}/server/server.service.js`);
    const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);
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
                    //add user account id logged on if applicable to parameters
                    decodedparameters += (bff_parameters.user_account_logon_user_account_id)?`&user_account_logon_user_account_id=${bff_parameters.user_account_logon_user_account_id}`:'';                                     
                }
                let path = '';
                const call_service = (/**@type{string}*/path, /**@type{string}*/service) => {
                    microserviceRequest(bff_parameters.app_id == getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), //if appid = APP_COMMON_APP_ID then send true
                                        path,service, bff_parameters.method,bff_parameters.ip,bff_parameters.authorization, bff_parameters.user_agent, bff_parameters.accept_language, bff_parameters.body?bff_parameters.body:null)
                    .then((/**@type{string}*/result)=>resolve(result))
                    .catch((/**@type{Types.error}*/error)=>reject(error));
                };
                switch (bff_parameters.service){
                    case 'APP':
                    case 'IAM':
                    case 'DB_API':
                    case 'SOCKET':{
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
                    }
                    case 'LOG':{
                        if (bff_parameters.endpoint=='SYSTEMADMIN')
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
                        else
                            return reject ('⛔');
                        break;
                    }
                    case 'SERVER':{
                        if (bff_parameters.endpoint=='ADMIN' || bff_parameters.endpoint=='SYSTEMADMIN')
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
                        else
                            return reject ('⛔');
                        break;
                    }
                    case 'GEOLOCATION':{
                        // decodedparameters ex:
                        // /ip?app_id=[id]&lang_code=en
                        // /place?latitude[latitude]&longitude=[longitude]
                        //ENABLE_GEOLOCATION control is for ip to geodata service /place and /timezone should be allowed
                        if (decodedparameters !=null && (ConfigGet('SERVICE_IAM', 'ENABLE_GEOLOCATION')=='1' || decodedparameters.startsWith('/ip')==false)){
                            if (bff_parameters.method=='GET'){
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
                                //use app id, CLIENT_ID and CLIENT_SECRET for microservice IAM
                                bff_parameters.authorization = `Basic ${Buffer.from(ConfigGetApp(bff_parameters.app_id, 'CLIENT_ID') + ':' + ConfigGetApp(bff_parameters.app_id, 'CLIENT_SECRET'),'utf-8').toString('base64')}`;
                                path = `/geolocation${decodedparameters}&app_id=${bff_parameters.app_id}`;
                                call_service(path, bff_parameters.service);
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
                        if (decodedparameters !=null && bff_parameters.method=='GET'){
                            //use app, id, CLIENT_ID and CLIENT_SECRET for microservice IAM
                            bff_parameters.authorization = `Basic ${Buffer.from(ConfigGetApp(bff_parameters.app_id, 'CLIENT_ID') + ':' + ConfigGetApp(bff_parameters.app_id, 'CLIENT_SECRET'),'utf-8').toString('base64')}`;
                            //limit records here in server for this service:
                            if (decodedparameters.startsWith('/city/search'))
                                decodedparameters = decodedparameters + `&limit=${ConfigGet('SERVICE_DB', 'LIMIT_LIST_SEARCH')}`;
                            path = `/worldcities${decodedparameters}&app_id=${bff_parameters.app_id}`;
                            call_service(path, bff_parameters.service);
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
        else{
            //required parameters not provided
            reject({
                message: '⛔'
            });
        }
    });
};
export{BFF};