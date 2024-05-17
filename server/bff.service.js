/** @module apps */
// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

const {ConfigGet} = await import(`file://${process.cwd()}/server/config.service.js`);
const {send_iso_error, getNumberValue, serverRoutes} = await import(`file://${process.cwd()}/server/server.service.js`);
const {LogServiceI, LogServiceE} = await import(`file://${process.cwd()}/server/log.service.js`);

/**
 * 
 * @param {Types.req_id_number} app_id 
 * @param {Types.bff_parameters} bff_parameters
 * @param {string} service
 * @param {Types.error} error 
 */
const BFF_log_error = (app_id, bff_parameters, service, error) =>{
    LogServiceE(app_id ?? null, service, bff_parameters.query ?? null, error).then(() => {
        if (bff_parameters.res){
            const statusCode = bff_parameters.res.statusCode==200?503:bff_parameters.res.statusCode ?? 503;
            send_iso_error( bff_parameters.res, 
                            statusCode, 
                            null, 
                            (typeof error === 'string' && error.startsWith('MICROSERVICE ERROR'))?'MICROSERVICE ERROR':error, 
                            null, 
                            null);
        }
    });
}

/**
 * Backend for frontend (BFF) called from client
 * 
 * @param {Types.bff_parameters} bff_parameters
 */
 const BFF = (bff_parameters) =>{
    const service = (bff_parameters.route_path?bff_parameters.route_path.split('/')[1]:'').toUpperCase();
    /**
     * @param {number|null} app_id
     * @param {Types.error} error 
     */
    let decodedquery = '';
    if ((bff_parameters.endpoint=='APP')){
        //App route for app asset, common asset, app info page, app report (using query) and app
        decodedquery = bff_parameters.route_path;
    }
    else{
        //REST API requests from client are encoded
        decodedquery = bff_parameters.query?Buffer.from(bff_parameters.query, 'base64').toString('utf-8').toString():'';
    }
    if ((bff_parameters.endpoint=='APP') ||
        (bff_parameters.app_id !=null && bff_parameters.endpoint))
        serverRoutes({  app_id:bff_parameters.app_id, 
            endpoint:bff_parameters.endpoint,
            method:bff_parameters.method.toUpperCase(), 
            ip:bff_parameters.ip, 
            host:bff_parameters.host, 
            url:bff_parameters.url,
            route_path:bff_parameters.route_path,
            user_agent:bff_parameters.user_agent, 
            accept_language:bff_parameters.accept_language, 
            authorization:bff_parameters.authorization, 
            parameters:decodedquery, 
            body:bff_parameters.body, 
            res:bff_parameters.res})
        .then((/**@type{*}*/result_service) => {
            if (bff_parameters.endpoint=='APP' && result_service!=null && result_service.STATIC){
                if (result_service.SENDFILE){
                    bff_parameters.res?bff_parameters.res.sendFile(result_service.SENDFILE):null;
                    bff_parameters.res?bff_parameters.res.status(200):null;
                }
                else
                    bff_parameters.res?bff_parameters.res.status(200).send(result_service.SENDCONTENT):null;
            }
            else{
                const log_result = getNumberValue(ConfigGet('SERVICE_LOG', 'REQUEST_LEVEL'))==2?result_service:'✅';
                LogServiceI(bff_parameters.app_id, service, bff_parameters.query, log_result).then(()=>{
                    if (bff_parameters.endpoint=='SOCKET'){
                        //This endpoint only allowed for EventSource so no more update of response
                        null;
                    }
                    else{
                        if (bff_parameters.res){
                            //result from APP can request to redirect
                            if (bff_parameters.endpoint=='APP' && bff_parameters.res.statusCode==301)
                                bff_parameters.res.redirect('/');
                            else 
                                if (bff_parameters.endpoint=='APP' && bff_parameters.res.statusCode==404){
                                    if (ConfigGet('SERVER', 'HTTPS_ENABLE')=='1')
                                        bff_parameters.res.redirect(`https://${ConfigGet('SERVER', 'HOST')}`);
                                    else
                                        bff_parameters.res.redirect(`http://${ConfigGet('SERVER', 'HOST')}`);
                                }
                                else
                                    bff_parameters.res.status(200).send(result_service);
                        }
                        else{
                            //function called from server return result
                            return result_service;
                        }
                    }  
                })
            }
        })
        .catch((/**@type{Types.error}*/error) => {
            BFF_log_error(bff_parameters.app_id, bff_parameters, service, error);
        });
    else{
        //required parameters not provided
        BFF_log_error(bff_parameters.app_id, bff_parameters, service, '⛔');
    }
};
/**
 * BFF called from server
 * @param {Types.bff_parameters} bff_parameters
 * @returns {Promise<(*)>}
 */
 const BFF_server = async (bff_parameters) => {
    return new Promise((resolve, reject) => {
        const service = (bff_parameters.route_path?bff_parameters.route_path.split('/')[1]:'').toUpperCase();
        if (bff_parameters.app_id !=null && bff_parameters.endpoint){
            serverRoutes({  app_id:bff_parameters.app_id, 
                            endpoint:bff_parameters.endpoint,
                            method:bff_parameters.method.toUpperCase(), 
                            ip:bff_parameters.ip, 
                            host:bff_parameters.host, 
                            url:bff_parameters.url,
                            route_path:bff_parameters.route_path,
                            user_agent:bff_parameters.user_agent, 
                            accept_language:bff_parameters.accept_language, 
                            authorization:bff_parameters.authorization, 
                            parameters:bff_parameters.query, 
                            body:bff_parameters.body, 
                            res:bff_parameters.res})
            .then((/**@type{string}*/result)=>resolve(result))
            .catch((/**@type{Types.error}*/error)=>{
                LogServiceE(bff_parameters.app_id ?? null, service, bff_parameters.query ?? null, error).then(() => {
                    reject(error);
                });
            });
        }
        else{
            //required parameters not provided
            reject({
                message: '⛔'
            });
        }
    });
};
export{send_iso_error, BFF, BFF_server};