/** @module apps */

// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

const service = await import('./apps.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * Backend for frontend (BFF) common
 * 
 * res.status(200), res.status(401) or res.status(503). Does not return anything if EventSource url is used
 * @param {Types.req_id_number} app_id
 * @param {string|null} endpoint
 * @param {string} service_called
 * @param {string} parameters
 * @param {string} ip
 * @param {string} method
 * @param {string} authorization
 * @param {string} host
 * @param {string} user_agent
 * @param {string} accept_language
 * @param {object} body
 * @param {number|null} user_account_logon_user_account_id
 * @param {Types.res} res
 */
const BFF = (app_id, endpoint, service_called, parameters, ip, method, authorization, host, user_agent, accept_language, body, user_account_logon_user_account_id, res) =>{

    service.BFF(app_id, endpoint, service_called, parameters, ip, method, authorization, host, user_agent, accept_language, body, user_account_logon_user_account_id, res)
    .then((/**@type{*}*/result_service) => {
        import(`file://${process.cwd()}/server/log/log.service.js`).then(({LogServiceI})=>{
            const log_result = service_called.toUpperCase()=='MAIL'?'✅':result_service;
            LogServiceI(app_id, service_called, parameters, log_result).then(()=>{
                if (endpoint=='SOCKET'){
                    //This endpoint only allowed for EventSource so no more update of response
                    null;
                }
                else
                    res.status(200).send(log_result);
            });
        });
    })
    .catch((/**@type{Types.error}*/error) => {
        import(`file://${process.cwd()}/server/log/log.service.js`).then(({LogServiceE})=>{
            //log ERROR to module log and to files
            LogServiceE(app_id ?? null, service_called ?? null, parameters ?? null, error).then(() => {
                //return service unavailable and error message
                //return any statuscode not being 200 specified by error or use 503 service unavailable
                const statusCode = res.statusCode==200?503:res.statusCode ?? 503;
                res.status(statusCode).send(error);
            });
        });
    });
};
/**
 * Backend for frontend (BFF) data
 * 
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
 const BFF_data = (req, res) =>{
    BFF(getNumberValue(req.query.app_id), 'DATA', req.query.service, req.query.parameters, req.ip, req.method, req.headers.authorization, req.headers.host, req.headers['user-agent'], req.headers['accept-language'], req.body, getNumberValue(req.query.user_account_logon_user_account_id), res);
};
/**
 * Backend for frontend (BFF) data login
 * 
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
 const BFF_data_login = (req, res) =>{
    BFF(getNumberValue(req.query.app_id), 'DATA_LOGIN', req.query.service, req.query.parameters, req.ip, req.method, req.headers.authorization, req.headers.host, req.headers['user-agent'], req.headers['accept-language'], req.body, getNumberValue(req.query.user_account_logon_user_account_id), res);
};
/**
 * Backend for frontend (BFF) data signup
 * 
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
 const BFF_data_signup = (req, res) =>{
    BFF(getNumberValue(req.query.app_id), 'DATA_SIGNUP', req.query.service, req.query.parameters, req.ip, req.method, req.headers.authorization, req.headers.host, req.headers['user-agent'], req.headers['accept-language'], req.body, getNumberValue(req.query.user_account_logon_user_account_id), res);
};
/**
 * Backend for frontend (BFF) access
 * 
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
 const BFF_access = (req, res) =>{
    BFF(getNumberValue(req.query.app_id), 'ACCESS', req.query.service, req.query.parameters, req.ip, req.method, req.headers.authorization, req.headers.host, req.headers['user-agent'], req.headers['accept-language'], req.body, getNumberValue(req.query.user_account_logon_user_account_id), res);
};
/**
 * Backend for frontend (BFF) admin
 * 
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
 const BFF_admin = (req, res) =>{
    BFF(getNumberValue(req.query.app_id), 'ADMIN', req.query.service, req.query.parameters, req.ip, req.method, req.headers.authorization, req.headers.host, req.headers['user-agent'], req.headers['accept-language'], req.body, getNumberValue(req.query.user_account_logon_user_account_id), res);
};
/**
 * Backend for frontend (BFF) superadmin
 * 
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
 const BFF_superadmin = (req, res) =>{
    BFF(getNumberValue(req.query.app_id), 'SUPERADMIN', req.query.service, req.query.parameters, req.ip, req.method, req.headers.authorization, req.headers.host, req.headers['user-agent'], req.headers['accept-language'], req.body, getNumberValue(req.query.user_account_logon_user_account_id), res);
};

/**
 * Backend for frontend (BFF) systemadmin
 * 
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
 const BFF_systemadmin = (req, res) =>{
    BFF(getNumberValue(req.query.app_id), 'SYSTEMADMIN', req.query.service, req.query.parameters, req.ip, req.method, req.headers.authorization, req.headers.host, req.headers['user-agent'], req.headers['accept-language'], req.body, getNumberValue(req.query.user_account_logon_user_account_id), res);
};

/**
 * Backend for frontend (BFF) without authorization
 * 
 * res.status(200), res.status(401) or res.status(503). Does not return anything if EventSource url is used
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
const BFF_socket = (req, res) =>{
    //check inparameters
    if (req.query.service.toUpperCase()=='BROADCAST' && 
        Buffer.from(req.query.parameters, 'base64').toString('utf-8').startsWith('/broadcast/connection/connect')){
            BFF(getNumberValue(req.query.app_id), 'SOCKET', req.query.service, req.query.parameters, req.ip, req.method, req.headers.authorization, req.headers.host, req.headers['user-agent'], req.headers['accept-language'], req.body, getNumberValue(req.query.user_account_logon_user_account_id), res);
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
        BFF(getNumberValue(req.query.app_id), 'AUTH', req.query.service, req.query.parameters, req.ip, req.method, req.headers.authorization, req.headers.host, req.headers['user-agent'], req.headers['accept-language'], req.body, getNumberValue(req.query.user_account_logon_user_account_id), res);
    else{
        //required parameters not provided
        //use common app id to get message and use first lang_code form app or if missing use language in headers
        res.status(401).send({
            message: '⛔'
        });
    }
};
export{BFF_data, BFF_data_login, BFF_data_signup, BFF_access, BFF_admin, BFF_superadmin, BFF_systemadmin, BFF_socket, BFF_auth};