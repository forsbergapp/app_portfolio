/** @module apps */

// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

const service = await import('./apps.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * Backend for frontend (BFF)
 * 
 * res.status(200), res.status(401) or res.status(503). Does not return anything if EventSource url is used
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
const BFF = (req, res) =>{
    //check inparameters
    if (!getNumberValue(req.query.app_id) &&
        !req.query.service &&
        !req.query.parameters)
        //required parameters not provided
        //use common app id to get message and use first lang_code form app or if missing use language in headers
        res.status(401).send({
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
        if (getNumberValue(req.query.user_account_logon_user_account_id))
            parameters = decodedparameters + `&user_account_logon_user_account_id=${getNumberValue(req.query.user_account_logon_user_account_id)}`;
        else
            parameters = decodedparameters;
        service.BFF(getNumberValue(req.query.app_id), service_called, parameters, req.ip, req.method, req.headers.authorization, req.headers['user-agent'], req.headers['accept-language'], req.body, res)
        .then(result_service => {
            import(`file://${process.cwd()}/server/log/log.service.js`).then(({LogServiceI})=>{
                const log_text = message_queue==true?null:result_service;
                LogServiceI(getNumberValue(req.query.app_id), service_called, parameters, log_text).then(()=>{
                    //message queue saves result there
                    if (parameters.startsWith('/broadcast/connection/connect')){
                        //EventSource requested so no more update of response
                        null;
                    }
                    else
                        if (message_queue)
                            res.status(200).send('✅');
                        else
                            res.status(200).send(result_service);
                });
            });
        })
        .catch(error => {
            import(`file://${process.cwd()}/server/log/log.service.js`).then(({LogServiceE})=>{
                //log ERROR to module log and to files
                LogServiceE(getNumberValue(req.query.app_id), service_called, parameters, error).then(() => {
                    //return service unavailable and error message
                    res.status(503).send(error);
                });
            });
        });
    }
};
/**
 * Backend for frontend (BFF) without authorization
 * 
 * res.status(200), res.status(401) or res.status(503). Does not return anything if EventSource url is used
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
const BFF_noauth = (req, res) =>{
    //check inparameters
    if (req.query.service.toUpperCase()=='BROADCAST' && 
        Buffer.from(req.query.parameters, 'base64').toString('utf-8').startsWith('/broadcast/connection/connect')){
            BFF(req,res);
        }
    else{
        //required parameters not provided
        //use common app id to get message and use first lang_code form app or if missing use language in headers
        res.status(401).send({
            message: '⛔'
        });
    }
};
/**
 * Backend for frontend (BFF) with basic authorization and no middleware
 * 
 * res.status(200), res.status(401) or res.status(503). Does not return anything if EventSource url is used
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
const BFF_auth = (req, res) =>{
    //check inparameters
    if (req.query.service.toUpperCase()=='AUTH' && req.headers.authorization.toUpperCase().startsWith('BASIC'))
        BFF(req,res);
    else{
        //required parameters not provided
        //use common app id to get message and use first lang_code form app or if missing use language in headers
        res.status(401).send({
            message: '⛔'
        });
    }
};
export{BFF, BFF_noauth, BFF_auth};