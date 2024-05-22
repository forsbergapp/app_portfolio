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
 const AuthenticateAccessTokenSystemAdmin = (req, res, next) => service.AuthenticateUserCommon(req.query.iam, 'APP_SYSTEMADMIN', req.headers.authorization, req.headers.host, req.ip, res, next);

/**
 * Middleware authenticates data token
 * @param {import('../types.js').req} req
 * @param {import('../types.js').res} res
 * @param {function} next
 */
const AuthenticateDataToken = (req, res, next) => service.AuthenticateUserCommon(req.query.iam, 'APP_DATA', req.headers.authorization, req.headers.host, req.ip, res, next);

/**
 * Middleware authenticates data token registration
 * @param {import('../types.js').req} req
 * @param {import('../types.js').res} res
 * @param {function} next
 */
const AuthenticateDataTokenRegistration = (req, res, next) => service.AuthenticateUserCommon(req.query.iam, 'APP_DATA_REGISTRATION', req.headers.authorization, req.headers.host, req.ip, res, next);

/**
 * Middleware authenticates access token superadmin
 * @param {import('../types.js').req} req
 * @param {import('../types.js').res} res
 * @param {function} next
 */
const AuthenticateAccessTokenSuperAdmin = (req, res, next) => service.AuthenticateUserCommon(req.query.iam, 'APP_ACCESS_SUPERADMIN', req.headers.authorization, req.headers.host, req.ip, res, next);
    
/**
 * Middleware authenticates access token admin
 * @param {import('../types.js').req} req
 * @param {import('../types.js').res} res
 * @param {function} next
 */
const AuthenticateAccessTokenAdmin = (req, res, next) => service.AuthenticateUserCommon(req.query.iam, 'APP_ACCESS_ADMIN', req.headers.authorization, req.headers.host, req.ip, res, next);
    
/**
 * Middleware authenticates access token
 * @param {import('../types.js').req} req
 * @param {import('../types.js').res} res
 * @param {function} next
 */
const AuthenticateAccessToken = (req, res, next) => service.AuthenticateUserCommon(req.query.iam, 'APP_ACCESS', req.headers.authorization, req.headers.host, req.ip, res, next);    

/**
 * Middleware authenticates socket used for EventSource
 * @param {import('../types.js').req} req
 * @param {import('../types.js').res} res
 * @param {function} next
 */
 const AuthenticateSocket = (req, res, next) => service.AuthenticateSocket(req.query.iam, req.originalUrl.substring(req.route.path.indexOf('*')), req.headers.host, req.ip, res, next);    

/**
 * Middleware authenticates IAM System Admin
 * @param {import('../types.js').req} req
 * @param {import('../types.js').res} res
 * @param {function} next
 */
const AuthenticateIAMSystemAdmin = (req, res, next)  => service.AuthenticateUserCommon(req.query.iam, 'SYSTEMADMIN', req.headers.authorization, req.headers.host, req.ip, res, next);

/**
 * Middleware authenticates IAM Admin
 * @param {import('../types.js').req} req
 * @param {import('../types.js').res} res
 * @param {function} next
 */
const AuthenticateIAMAdmin = (req, res, next) => service.AuthenticateUserCommon(req.query.iam, 'ADMIN', req.headers.authorization, req.headers.host, req.ip, res, next);

/**
 * Middleware authenticates IAM User
 * @param {import('../types.js').req} req
 * @param {import('../types.js').res} res
 * @param {function} next
 */
const AuthenticateIAMUser = (req, res, next) => service.AuthenticateUserCommon(req.query.iam, 'USER', req.headers.authorization, req.headers.host, req.ip, res, next);

 /**
 * Middleware authenticates IAM System Admin
 * @param {import('../types.js').req} req
 * @param {import('../types.js').res} res
 * @param {function} next
 */
const AuthenticateIAMProvider = (req, res, next) => service.AuthenticateUserCommon(req.query.iam, 'PROVIDER', req.headers.authorization, req.headers.host, req.ip, res, next);

export{ AuthenticateSystemadmin, AuthenticateAccessTokenSystemAdmin, 
        AuthenticateDataToken, AuthenticateDataTokenRegistration,
        AuthenticateAccessTokenSuperAdmin, AuthenticateAccessTokenAdmin, AuthenticateAccessToken,
        AuthenticateSocket,
        AuthenticateIAMSystemAdmin, AuthenticateIAMAdmin, AuthenticateIAMUser,AuthenticateIAMProvider};