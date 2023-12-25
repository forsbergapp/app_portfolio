/** @module apps */

// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

const service = await import('./bff.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * Backend for frontend (BFF) common
 * 
 * @param {Types.bff_parameters} bff_parameters
 */
const BFF = (bff_parameters) =>{

    service.BFF(bff_parameters);
};
/**
 * Backend for frontend (BFF) APP including assets, report and info pages
 * 
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
 const BFF_app = (req, res) =>{
    /**@type{Types.bff_parameters} */
    const bff_parameters = {
        app_id: getNumberValue(req.query.app_id), 
        endpoint:'APP', 
        service: 'APP', 
        ip: req.ip, 
        host: req.headers.host, 
        method: req.method, 
        authorization:  req.headers.authorization, 
        user_agent: req.headers['user-agent'], 
        accept_language: req.headers['accept-language'], 
        url:req.originalUrl,
        parameters: '', 
        body: req.body, 
        user_account_logon_user_account_id: getNumberValue(req.query.user_account_logon_user_account_id), 
        res: res
    };
    BFF(bff_parameters);
};

/**
 * Backend for frontend (BFF) APP_DATA
 * 
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
 const BFF_app_data = (req, res) =>{
    /**@type{Types.bff_parameters} */
    const bff_parameters = {
        app_id: getNumberValue(req.query.app_id), 
        endpoint:'APP_DATA', 
        service: req.query.service, 
        ip: req.ip, 
        host: req.headers.host, 
        method: req.method, 
        authorization:  req.headers.authorization, 
        user_agent: req.headers['user-agent'], 
        accept_language: req.headers['accept-language'], 
        url:req.originalUrl,
        parameters: req.query.parameters, 
        body: req.body, 
        user_account_logon_user_account_id: getNumberValue(req.query.user_account_logon_user_account_id), 
        res: res
    };
    BFF(bff_parameters);
};
/**
 * Backend for frontend (BFF) APP_SIGNUP
 * 
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
 const BFF_app_signup = (req, res) =>{
    /**@type{Types.bff_parameters} */
    const bff_parameters = {
        app_id: getNumberValue(req.query.app_id), 
        endpoint:'APP_SIGNUP', 
        service: req.query.service, 
        ip: req.ip, 
        host: req.headers.host, 
        method: req.method, 
        authorization:  req.headers.authorization, 
        user_agent: req.headers['user-agent'], 
        accept_language: req.headers['accept-language'], 
        url:req.originalUrl,
        parameters: req.query.parameters, 
        body: req.body, 
        user_account_logon_user_account_id: getNumberValue(req.query.user_account_logon_user_account_id), 
        res: res
    };
    BFF(bff_parameters);
};
/**
 * Backend for frontend (BFF) APP_ACCESS
 * 
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
 const BFF_app_access = (req, res) =>{
    /**@type{Types.bff_parameters} */
    const bff_parameters = {
        app_id: getNumberValue(req.query.app_id), 
        endpoint:'APP_ACCESS', 
        service: req.query.service, 
        ip: req.ip, 
        host: req.headers.host, 
        method: req.method, 
        authorization:  req.headers.authorization, 
        user_agent: req.headers['user-agent'], 
        accept_language: req.headers['accept-language'], 
        url:req.originalUrl,
        parameters: req.query.parameters, 
        body: req.body, 
        user_account_logon_user_account_id: getNumberValue(req.query.user_account_logon_user_account_id), 
        res: res
    };
    BFF(bff_parameters);
};
/**
 * Backend for frontend (BFF) ADMIN
 * 
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
 const BFF_admin = (req, res) =>{
    /**@type{Types.bff_parameters} */
    const bff_parameters = {
        app_id: getNumberValue(req.query.app_id), 
        endpoint:'ADMIN', 
        service: req.query.service, 
        ip: req.ip, 
        host: req.headers.host, 
        method: req.method, 
        authorization:  req.headers.authorization, 
        user_agent: req.headers['user-agent'], 
        accept_language: req.headers['accept-language'], 
        url:req.originalUrl,
        parameters: req.query.parameters, 
        body: req.body, 
        user_account_logon_user_account_id: getNumberValue(req.query.user_account_logon_user_account_id), 
        res: res
    };
    BFF(bff_parameters);
};
/**
 * Backend for frontend (BFF) SUPERADMIN
 * 
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
 const BFF_superadmin = (req, res) =>{
    /**@type{Types.bff_parameters} */
    const bff_parameters = {
        app_id: getNumberValue(req.query.app_id), 
        endpoint:'SUPERADMIN', 
        service: req.query.service, 
        ip: req.ip, 
        host: req.headers.host, 
        method: req.method, 
        authorization:  req.headers.authorization, 
        user_agent: req.headers['user-agent'], 
        accept_language: req.headers['accept-language'], 
        url:req.originalUrl,
        parameters: req.query.parameters, 
        body: req.body, 
        user_account_logon_user_account_id: getNumberValue(req.query.user_account_logon_user_account_id), 
        res: res
    };
    BFF(bff_parameters);
};

/**
 * Backend for frontend (BFF) SYSTEMADMIN
 * 
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
 const BFF_systemadmin = (req, res) =>{
    /**@type{Types.bff_parameters} */
    const bff_parameters = {
        app_id: getNumberValue(req.query.app_id), 
        endpoint:'SYSTEMADMIN', 
        service: req.query.service, 
        ip: req.ip, 
        host: req.headers.host, 
        method: req.method, 
        authorization:  req.headers.authorization, 
        user_agent: req.headers['user-agent'], 
        accept_language: req.headers['accept-language'], 
        url:req.originalUrl,
        parameters: req.query.parameters, 
        body: req.body, 
        user_account_logon_user_account_id: getNumberValue(req.query.user_account_logon_user_account_id), 
        res: res
    };
    BFF(bff_parameters);
};

/**
 * Backend for frontend (BFF) socket
 * 
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
const BFF_socket = (req, res) =>{
    /**@type{Types.bff_parameters} */
    const bff_parameters = {
        app_id: getNumberValue(req.query.app_id), 
        endpoint:'SOCKET', 
        service: req.query.service, 
        ip: req.ip, 
        host: req.headers.host, 
        method: req.method, 
        authorization:  req.headers.authorization, 
        user_agent: req.headers['user-agent'], 
        accept_language: req.headers['accept-language'], 
        url:req.originalUrl,
        parameters: req.query.parameters, 
        body: req.body, 
        user_account_logon_user_account_id: getNumberValue(req.query.user_account_logon_user_account_id), 
        res: res
    };
    BFF(bff_parameters);
};
/**
 * Backend for frontend (BFF) IAM
 * 
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
const BFF_iam = (req, res) =>{
    /**@type{Types.bff_parameters} */
    const bff_parameters = {
        app_id: getNumberValue(req.query.app_id), 
        endpoint:'IAM', 
        service: req.query.service, 
        ip: req.ip, 
        host: req.headers.host, 
        method: req.method, 
        authorization:  req.headers.authorization, 
        user_agent: req.headers['user-agent'], 
        accept_language: req.headers['accept-language'], 
        url:req.originalUrl,
        parameters: req.query.parameters, 
        body: req.body, 
        user_account_logon_user_account_id: getNumberValue(req.query.user_account_logon_user_account_id), 
        res: res
    };
    BFF(bff_parameters);
};

export{BFF_app, BFF_app_data, BFF_app_signup, BFF_app_access, BFF_admin, BFF_superadmin, BFF_systemadmin, BFF_socket, BFF_iam};