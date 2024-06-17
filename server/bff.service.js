/** @module apps */

/**@type{import('./server.service.js')} */
const {response_send_error, getNumberValue, serverRoutes} = await import(`file://${process.cwd()}/server/server.service.js`);
/**@type{import('./config.service.js')} */
const {ConfigGet, ConfigGetAppHost} = await import(`file://${process.cwd()}/server/config.service.js`);
/**@type{import('./log.service.js')} */
const {LogServiceI, LogServiceE} = await import(`file://${process.cwd()}/server/log.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {import('../types.js').bff_parameters} bff_parameters
 * @param {string} service
 * @param {import('../types.js').error} error 
 */
const BFF_log_error = (app_id, bff_parameters, service, error) =>{
    LogServiceE(app_id, service, bff_parameters.query, error).then(() => {
        if (bff_parameters.res){
            const statusCode = bff_parameters.res.statusCode==200?503:bff_parameters.res.statusCode ?? 503;
            if (error.error && error.error.code=='MICROSERVICE')
                response_send_error( bff_parameters.res, 
                                error.error.http,
                                error.error.code, 
                                `MICROSERVICE ${bff_parameters.route_path.split('/')[1].toUpperCase()} ERROR`, 
                                error.error.developer_text, 
                                error.error.more_info);
            else
                response_send_error( bff_parameters.res, 
                                statusCode, 
                                null, 
                                error, 
                                null, 
                                null);
        }
    });
};

/**
 * Backend for frontend (BFF) called from client
 * 
 * @param {import('../types.js').bff_parameters} bff_parameters
 */
 const BFF = (bff_parameters) =>{
    const service = (bff_parameters.route_path?bff_parameters.route_path.split('/')[1]:'').toUpperCase();
    const app_id = ConfigGetAppHost(bff_parameters.host ?? '');
    
    if (app_id !=null){
        let decodedquery = '';
        if ((bff_parameters.endpoint=='APP')){
            //App route for app asset, common asset, app info page, app report (using query) and app
            decodedquery = bff_parameters.route_path;
        }
        else{
            //REST API requests from client are encoded
            decodedquery = bff_parameters.query?Buffer.from(bff_parameters.query, 'base64').toString('utf-8').toString():'';
        }
        serverRoutes({  app_id:app_id, 
                        endpoint:bff_parameters.endpoint,
                        method:bff_parameters.method.toUpperCase(), 
                        ip:bff_parameters.ip, 
                        host:bff_parameters.host ?? '', 
                        url:bff_parameters.url ?? '',
                        route_path:bff_parameters.route_path,
                        user_agent:bff_parameters.user_agent, 
                        accept_language:bff_parameters.accept_language, 
                        authorization:bff_parameters.authorization ?? '', 
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
                LogServiceI(app_id, service, bff_parameters.query, log_result).then(()=>{
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
                                else{
                                    if (bff_parameters.method.toUpperCase() == 'POST')
                                        bff_parameters.res.status(201).send(result_service);
                                    else{
                                        if (decodedquery && new URLSearchParams(decodedquery).get('fields')){
                                            if (result_service.rows){
                                                //limit fields/keys in rows
                                                const limit_fields = result_service.rows.map((/**@type{*}*/row)=>{
                                                    const row_new = {};
                                                    /**@ts-ignore */
                                                    for (const field of new URLSearchParams(decodedquery).get('fields').split(',')){
                                                        /**@ts-ignore */
                                                        row_new[field] = row[field];
                                                    }
                                                    return row_new;
                                                });
                                                result_service.rows = limit_fields;
                                                bff_parameters.res.status(200).send(result_service);
                                            }
                                            else{
                                                //limit fields/keys in object
                                                const result_service_fields = {};
                                                /**@ts-ignore */
                                                for (const field of new URLSearchParams(decodedquery).get('fields').split(',')){
                                                    /**@ts-ignore */
                                                    result_service_fields[field] = result_service[field];
                                                }
                                                bff_parameters.res.status(200).send(result_service_fields);
                                            }
                                        }
                                        else
                                            bff_parameters.res.status(200).send(result_service);
                                    }
                                        
                                }
                        }
                        else{
                            //function called from server return result
                            return result_service;
                        }
                    }  
                });
            }
        })
        .catch((/**@type{import('../types.js').error}*/error) => {
            BFF_log_error(app_id, bff_parameters, service, error);
        });
    }
    else{
        //unknown appid, domain or subdomain, redirect to hostname
        if (ConfigGet('SERVER', 'HTTPS_ENABLE')=='1')
            bff_parameters.res?bff_parameters.res.redirect(`https://${ConfigGet('SERVER', 'HOST')}`):null;
        else
            bff_parameters.res?bff_parameters.res.redirect(`http://${ConfigGet('SERVER', 'HOST')}`):null;
    }
};
/**
 * BFF called from server
 * @param {number|null} app_id
 * @param {import('../types.js').bff_parameters} bff_parameters
 * @returns {Promise<(*)>}
 */
 const BFF_server = async (app_id, bff_parameters) => {
    return new Promise((resolve, reject) => {
        const service = (bff_parameters.route_path?bff_parameters.route_path.split('/')[1]:'').toUpperCase();
        if (app_id !=null && bff_parameters.endpoint){
            serverRoutes({  app_id:app_id, 
                            endpoint:bff_parameters.endpoint,
                            method:bff_parameters.method.toUpperCase(), 
                            ip:bff_parameters.ip, 
                            host:bff_parameters.host ?? '', 
                            url:bff_parameters.url ?? '',
                            route_path:bff_parameters.route_path,
                            user_agent:bff_parameters.user_agent, 
                            accept_language:bff_parameters.accept_language, 
                            authorization:bff_parameters.authorization ?? '', 
                            parameters:bff_parameters.query, 
                            body:bff_parameters.body, 
                            res:bff_parameters.res})
            .then((/**@type{string}*/result)=>resolve(result))
            .catch((/**@type{import('../types.js').error}*/error)=>{
                LogServiceE(app_id, service, bff_parameters.query, error).then(() => {
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
export{response_send_error, BFF, BFF_server};