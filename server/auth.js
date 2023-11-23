/** @module server/auth */

// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

const service = await import(`file://${process.cwd()}/server/auth.service.js`);

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {string} authorization 
 * @param {Types.res} res 
 */
const login_systemadmin = (authorization, res) => service.login_systemadmin(authorization, res);

/**
 * Middleware checks system admin token
 * @param {Types.req} req
 * @param {Types.res} res
 * @param {function} next
 */
 const checkSystemAdmin = (req, res, next) => service.checkSystemAdmin(req.get('authorization'), res, next);

/**
 * Middleware check data token
 * @param {Types.req} req
 * @param {Types.res} res
 * @param {function} next
 */
const checkDataToken = (req, res, next) => service.checkDataToken(getNumberValue(req.query.app_id), req.get('authorization'), res, next);

/**
 * Middleware check data token registration
 * @param {Types.req} req
 * @param {Types.res} res
 * @param {function} next
 */
const checkDataTokenRegistration = (req, res, next) => service.checkDataTokenRegistration(getNumberValue(req.query.app_id), req.get('authorization'), res, next);

/**
 * Middleware check data token login
 * @param {Types.req} req
 * @param {Types.res} res
 * @param {function} next
 */
const checkDataTokenLogin = (req, res, next) => service.checkDataTokenLogin(getNumberValue(req.query.app_id), req.get('authorization'), res, next);

/**
 * Middleware check access token superadmin
 * @param {Types.req} req
 * @param {Types.res} res
 * @param {function} next
 */
const checkAccessTokenSuperAdmin = (req, res, next) => service.checkAccessTokenSuperAdmin(getNumberValue(req.query.app_id), req.get('authorization'), req.ip, getNumberValue(req.query.user_account_logon_user_account_id), res, next);
    
/**
 * Middleware check access token admin
 * @param {Types.req} req
 * @param {Types.res} res
 * @param {function} next
 */
const checkAccessTokenAdmin = (req, res, next) => service.checkAccessTokenAdmin(getNumberValue(req.query.app_id), req.get('authorization'), req.ip, getNumberValue(req.query.user_account_logon_user_account_id), res, next);
    
/**
 * Middleware check access token
 * @param {Types.req} req
 * @param {Types.res} res
 * @param {function} next
 */
const checkAccessToken = (req, res, next) => service.checkAccessToken(getNumberValue(req.query.app_id), req.get('authorization'), req.ip, getNumberValue(req.query.user_account_logon_user_account_id), res, next);    
export{ login_systemadmin, checkSystemAdmin, 
        checkDataToken, checkDataTokenRegistration, checkDataTokenLogin,
        checkAccessTokenSuperAdmin, checkAccessTokenAdmin, checkAccessToken};