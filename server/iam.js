/** @module server/iam */

/**@type{import('./iam.service.js')} */
const service = await import(`file://${process.cwd()}/server/iam.service.js`);

/**
 * Middleware authenticates system admin login
 * @param {number} app_id 
 * @param {string} iam
 * @param {string} authorization 
 * @param {string} ip 
 * @param {string} user_agent
 * @param {string} accept_language
 * @param {import('../types.js').res} res 
 */
const AuthenticateSystemadmin = (app_id, iam, authorization, ip, user_agent, accept_language, res) => service.AuthenticateSystemadmin(app_id, iam, authorization, ip, user_agent, accept_language, res);

/**
 * Middleware authenticates system admin token
 * @param {import('../types.js').req} req
 * @param {import('../types.js').res} res
 * @param {function} next
 */
 const AuthenticateAccessTokenSystemAdmin = (req, res, next) => service.AuthenticateAccessTokenSystemAdmin(req.query.iam, req.headers.authorization, req.ip, res, next);

/**
 * Middleware authenticates data token
 * @param {import('../types.js').req} req
 * @param {import('../types.js').res} res
 * @param {function} next
 */
const AuthenticateDataToken = (req, res, next) => service.AuthenticateDataToken(req.query.iam, req.headers.authorization, req.ip, res, next);

/**
 * Middleware authenticates data token registration
 * @param {import('../types.js').req} req
 * @param {import('../types.js').res} res
 * @param {function} next
 */
const AuthenticateDataTokenRegistration = (req, res, next) => service.AuthenticateDataTokenRegistration(req.query.iam, req.headers.authorization, req.ip, res, next);

/**
 * Middleware authenticates data token login
 * @param {import('../types.js').req} req
 * @param {import('../types.js').res} res
 * @param {function} next
 */
const AuthenticateDataTokenLogin = (req, res, next) => service.AuthenticateDataTokenLogin(req.query.iam, req.headers.authorization, req.ip, res, next);

/**
 * Middleware authenticates access token superadmin
 * @param {import('../types.js').req} req
 * @param {import('../types.js').res} res
 * @param {function} next
 */
const AuthenticateAccessTokenSuperAdmin = (req, res, next) => service.AuthenticateAccessTokenSuperAdmin(req.query.iam, req.headers.authorization, req.ip, res, next);
    
/**
 * Middleware authenticates access token admin
 * @param {import('../types.js').req} req
 * @param {import('../types.js').res} res
 * @param {function} next
 */
const AuthenticateAccessTokenAdmin = (req, res, next) => service.AuthenticateAccessTokenAdmin(req.query.iam, req.headers.authorization, req.ip, res, next);
    
/**
 * Middleware authenticates access token
 * @param {import('../types.js').req} req
 * @param {import('../types.js').res} res
 * @param {function} next
 */
const AuthenticateAccessToken = (req, res, next) => service.AuthenticateAccessToken(req.query.iam, req.headers.authorization, req.ip, res, next);    

/**
 * Middleware authenticates socket used for EventSource
 * @param {import('../types.js').req} req
 * @param {import('../types.js').res} res
 * @param {function} next
 */
 const AuthenticateSocket = (req, res, next) => service.AuthenticateSocket(req.query.iam, req.originalUrl.substring(req.route.path.indexOf('*')), req.ip, res, next);    

/**
 * Middleware authenticates IAM 
 * @param {import('../types.js').req} req
 * @param {import('../types.js').res} res
 * @param {function} next
 */
const AuthenticateIAM = (req, res, next) => service.AuthenticateIAM(req.query.iam, req.headers.authorization, req.ip, res, next);    

export{ AuthenticateSystemadmin, AuthenticateAccessTokenSystemAdmin, 
        AuthenticateDataToken, AuthenticateDataTokenRegistration, AuthenticateDataTokenLogin,
        AuthenticateAccessTokenSuperAdmin, AuthenticateAccessTokenAdmin, AuthenticateAccessToken,
        AuthenticateSocket,
        AuthenticateIAM};