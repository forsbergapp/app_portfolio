/** @module server/iam */

// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

const service = await import(`file://${process.cwd()}/server/iam.service.js`);

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * Middleware authenticates system admin login
 * @param {number} app_id 
 * @param {string} authorization 
 * @param {Types.res} res 
 */
const AuthenticateSystemadmin = (app_id, authorization, res) => service.AuthenticateSystemadmin(app_id, authorization, res);

/**
 * Middleware authenticates system admin token
 * @param {Types.req} req
 * @param {Types.res} res
 * @param {function} next
 */
 const AuthenticateAccessTokenSystemAdmin = (req, res, next) => service.AuthenticateAccessTokenSystemAdmin(req.get('authorization'), res, next);

/**
 * Middleware authenticates data token
 * @param {Types.req} req
 * @param {Types.res} res
 * @param {function} next
 */
const AuthenticateDataToken = (req, res, next) => service.AuthenticateDataToken(getNumberValue(req.query.app_id), req.get('authorization'), res, next);

/**
 * Middleware authenticates data token registration
 * @param {Types.req} req
 * @param {Types.res} res
 * @param {function} next
 */
const AuthenticateDataTokenRegistration = (req, res, next) => service.AuthenticateDataTokenRegistration(getNumberValue(req.query.app_id), req.get('authorization'), res, next);

/**
 * Middleware authenticates data token login
 * @param {Types.req} req
 * @param {Types.res} res
 * @param {function} next
 */
const AuthenticateDataTokenLogin = (req, res, next) => service.AuthenticateDataTokenLogin(getNumberValue(req.query.app_id), req.get('authorization'), res, next);

/**
 * Middleware authenticates access token superadmin
 * @param {Types.req} req
 * @param {Types.res} res
 * @param {function} next
 */
const AuthenticateAccessTokenSuperAdmin = (req, res, next) => service.AuthenticateAccessTokenSuperAdmin(getNumberValue(req.query.app_id), req.get('authorization'), req.ip, getNumberValue(req.query.user_account_logon_user_account_id), res, next);
    
/**
 * Middleware authenticates access token admin
 * @param {Types.req} req
 * @param {Types.res} res
 * @param {function} next
 */
const AuthenticateAccessTokenAdmin = (req, res, next) => service.AuthenticateAccessTokenAdmin(getNumberValue(req.query.app_id), req.get('authorization'), req.ip, getNumberValue(req.query.user_account_logon_user_account_id), res, next);
    
/**
 * Middleware authenticates access token
 * @param {Types.req} req
 * @param {Types.res} res
 * @param {function} next
 */
const AuthenticateAccessToken = (req, res, next) => service.AuthenticateAccessToken(getNumberValue(req.query.app_id), req.get('authorization'), req.ip, getNumberValue(req.query.user_account_logon_user_account_id), res, next);    

/**
 * Middleware authenticates socket used for EventSource
 * @param {Types.req} req
 * @param {Types.res} res
 * @param {function} next
 */
 const AuthenticateSocket = (req, res, next) => service.AuthenticateSocket(req.query.service, req.query.parameters, res, next);    

/**
 * Middleware authenticates IAM 
 * @param {Types.req} req
 * @param {Types.res} res
 * @param {function} next
 */
const AuthenticateIAM = (req, res, next) => service.AuthenticateIAM(req.query.service, req.headers.authorization, res, next);    

export{ AuthenticateSystemadmin, AuthenticateAccessTokenSystemAdmin, 
        AuthenticateDataToken, AuthenticateDataTokenRegistration, AuthenticateDataTokenLogin,
        AuthenticateAccessTokenSuperAdmin, AuthenticateAccessTokenAdmin, AuthenticateAccessToken,
        AuthenticateSocket,
        AuthenticateIAM};