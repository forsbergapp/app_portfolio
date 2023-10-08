/** @module apps */

// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

const service = await import('./apps.service.js');

/**
 * Backend for frontend (BFF)
 * @async
 * @param {Types.req} req - Request
 * @param {Types.res} res
 * @returns {Types.res|*} res res.status(200), res.status(401) or res.status(503). Does not return anything if EventSource url is used
  */
const BFF = (req, res) =>{
    //check inparameters
    if (!req.query.app_id &&
        !req.query.service &&
        !req.query.parameters)
        //required parameters not provided
        //use common app id to get message and use first lang_code form app or if missing use language in headers
        return res.status(401).send({
            message: '⛔'
        });
    else{
        const decodedparameters = Buffer.from(req.query.parameters, 'base64').toString('utf-8');
        let message_queue=false;
        const service_called = req.query.service.toUpperCase();
        if (service_called=='MAIL')
            message_queue=true;
        /** @type {string} */
        let parameters;
        if (req.query.user_account_logon_user_account_id)
            parameters = decodedparameters + `&user_account_logon_user_account_id=${req.query.user_account_logon_user_account_id}`;
        else
            parameters = decodedparameters;
        if (service_called=='BROADCAST' && decodedparameters.startsWith('/broadcast/connection/connect')){
            // return broadcast stream
            // ex path and query parameters: /broadcast/connection/connect?identity_provider_id=&system_admin=null&lang_code=en
            const query_parameters = parameters.toLowerCase().split('?')[1].split('&');
            req.query.system_admin = query_parameters.filter(query=>{ 
                                                                return query.startsWith('system_admin');}
                                                            )[0].split('=')[1];
            req.query.identity_provider_id = query_parameters.filter(query=>{ 
                                                                     return query.startsWith('identity_provider_id');}
                                                                     )[0].split('=')[1];
            delete req.query.parameters;
            delete req.query.service;
            import(`file://${process.cwd()}/server/broadcast/broadcast.controller.js`).then(({BroadcastConnect})=>{
                BroadcastConnect(req,res);
            });
        }
        else
            service.BFF(req.query.app_id, service_called, parameters, req.ip, req.method, req.headers.authorization, req.headers['user-agent'], req.headers['accept-language'], req.body)
            .then(result_service => {
                import(`file://${process.cwd()}/server/log/log.service.js`).then(({LogServiceI})=>{
                    const log_text = message_queue==true?null:result_service;
                    LogServiceI(req.query.app_id, service_called, parameters, log_text).then(()=>{
                        //message queue saves result there
                        if (message_queue)
                            return res.status(200).send('✅');
                        else
                            return res.status(200).send(result_service);
                    });
                });
            })
            .catch(error => {
                import(`file://${process.cwd()}/server/log/log.service.js`).then(({LogServiceE})=>{
                    //log ERROR to module log and to files
                    LogServiceE(req.query.app_id, service_called, parameters, error).then(() => {
                        //return service unavailable and error message
                        return res.status(503).send(error);
                    });
                });
            });
    }
};
/**
 * Backend for frontend (BFF) without authorization
 * @async
 * @param {Types.req} req - Request
 * @param {Types.res} res
 * @returns {Types.res} res res.status(200), res.status(401) or res.status(503). Does not return anything if EventSource url is used
 */
const BFF_noauth = (req, res) =>{
    //check inparameters
    if (req.query.service.toUpperCase()=='BROADCAST' && 
        Buffer.from(req.query.parameters, 'base64').toString('utf-8').startsWith('/broadcast/connection/connect')){
            return BFF(req,res);
        }
    else{
        //required parameters not provided
        //use common app id to get message and use first lang_code form app or if missing use language in headers
        return res.status(401).send({
            message: '⛔'
        });
    }
};
/**
 * Backend for frontend (BFF) with basic authorization and no middleware
 * @async
 * @param {Types.req} req - Request
 * @param {Types.res} res
 * @returns {Types.res} res res.status(200), res.status(401) or res.status(503). Does not return anything if EventSource url is used
 */
const BFF_auth = (req, res) =>{
    //check inparameters
    if (req.query.service.toUpperCase()=='AUTH' && req.headers.authorization.toUpperCase().startsWith('BASIC'))
        return BFF(req,res);
    else{
        //required parameters not provided
        //use common app id to get message and use first lang_code form app or if missing use language in headers
        return res.status(401).send({
            message: '⛔'
        });
    }
};
export{BFF, BFF_noauth, BFF_auth};