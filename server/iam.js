/** @module server/iam */

// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

const service = await import(`file://${process.cwd()}/server/iam.service.js`);

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * Middleware authenticates system admin login
 * @param {number} app_id 
 * @param {string} ip 
 * @param {string} authorization 
 * @param {Types.res} res 
 */
const AuthenticateSystemadmin = (app_id, ip, authorization, res) => service.AuthenticateSystemadmin(app_id, authorization, ip, res);

/**
 * Middleware authenticates system admin token
 * @param {Types.req} req
 * @param {Types.res} res
 * @param {function} next
 */
 const AuthenticateAccessTokenSystemAdmin = (req, res, next) => service.AuthenticateAccessTokenSystemAdmin(req.query.iam, req.get('authorization'), req.ip, res, next);

/**
 * Middleware authenticates data token
 * @param {Types.req} req
 * @param {Types.res} res
 * @param {function} next
 */
const AuthenticateDataToken = (req, res, next) => service.AuthenticateDataToken(req.query.iam, req.get('authorization'), req.ip, res, next);

/**
 * Middleware authenticates data token registration
 * @param {Types.req} req
 * @param {Types.res} res
 * @param {function} next
 */
const AuthenticateDataTokenRegistration = (req, res, next) => service.AuthenticateDataTokenRegistration(req.query.iam, req.get('authorization'), req.ip, res, next);

/**
 * Middleware authenticates data token login
 * @param {Types.req} req
 * @param {Types.res} res
 * @param {function} next
 */
const AuthenticateDataTokenLogin = (req, res, next) => service.AuthenticateDataTokenLogin(req.query.iam, req.get('authorization'), req.ip, res, next);

/**
 * Middleware authenticates access token superadmin
 * @param {Types.req} req
 * @param {Types.res} res
 * @param {function} next
 */
const AuthenticateAccessTokenSuperAdmin = (req, res, next) => service.AuthenticateAccessTokenSuperAdmin(req.query.iam, req.get('authorization'), req.ip, res, next);
    
/**
 * Middleware authenticates access token admin
 * @param {Types.req} req
 * @param {Types.res} res
 * @param {function} next
 */
const AuthenticateAccessTokenAdmin = (req, res, next) => service.AuthenticateAccessTokenAdmin(req.query.iam, req.get('authorization'), req.ip, res, next);
    
/**
 * Middleware authenticates access token
 * @param {Types.req} req
 * @param {Types.res} res
 * @param {function} next
 */
const AuthenticateAccessToken = (req, res, next) => service.AuthenticateAccessToken(req.query.iam, req.get('authorization'), req.ip, res, next);    

/**
 * Middleware authenticates socket used for EventSource
 * @param {Types.req} req
 * @param {Types.res} res
 * @param {function} next
 */
 const AuthenticateSocket = (req, res, next) => service.AuthenticateSocket(req.query.iam, req.originalUrl.substring(req.route.path.indexOf('*')), res, next);    

/**
 * Middleware authenticates IAM 
 * @param {Types.req} req
 * @param {Types.res} res
 * @param {function} next
 */
const AuthenticateIAM = (req, res, next) => service.AuthenticateIAM(req.query.iam, req.headers.authorization, res, next);    

export{ AuthenticateSystemadmin, AuthenticateAccessTokenSystemAdmin, 
        AuthenticateDataToken, AuthenticateDataTokenRegistration, AuthenticateDataTokenLogin,
        AuthenticateAccessTokenSuperAdmin, AuthenticateAccessTokenAdmin, AuthenticateAccessToken,
        AuthenticateSocket,
        AuthenticateIAM};