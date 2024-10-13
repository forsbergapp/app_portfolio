/** 
 * Middleware functions for REST API
 * @module server/iam 
 */

/**@type{import('./iam.service.js')} */
const service = await import(`file://${process.cwd()}/server/iam.service.js`);

/**
 * Middleware authenticates system admin token
 * @param {import('./types.js').server_server_req} req
 * @param {import('./types.js').server_server_res} res
 * @param {function} next
 */
 const AuthenticateAccessTokenAdmin = (req, res, next) => service.AuthenticateUserCommon(req.query.iam, 'APP_ADMIN', req.headers.authorization, req.headers.host, req.ip, res, next);

/**
 * Middleware authenticates id token
 * @param {import('./types.js').server_server_req} req
 * @param {import('./types.js').server_server_res} res
 * @param {function} next
 */
const AuthenticateIdToken = (req, res, next) => service.AuthenticateUserCommon(req.query.iam, 'APP_DATA', req.headers.authorization, req.headers.host, req.ip, res, next);

/**
 * Middleware authenticates id token registration
 * @param {import('./types.js').server_server_req} req
 * @param {import('./types.js').server_server_res} res
 * @param {function} next
 */
const AuthenticateIdTokenRegistration = (req, res, next) => service.AuthenticateUserCommon(req.query.iam, 'APP_DATA_REGISTRATION', req.headers.authorization, req.headers.host, req.ip, res, next);

/**
 * Middleware authenticates access token
 * @param {import('./types.js').server_server_req} req
 * @param {import('./types.js').server_server_res} res
 * @param {function} next
 */
const AuthenticateAccessToken = (req, res, next) => service.AuthenticateUserCommon(req.query.iam, 'APP_ACCESS', req.headers.authorization, req.headers.host, req.ip, res, next);    

/**
 * Middleware authenticates external request
 * @param {import('./types.js').server_server_req} req
 * @param {import('./types.js').server_server_res} res
 * @param {function} next
 */
const AuthenticateExternal = (req, res, next) => service.AuthenticateExternal('APP_EXTERNAL', req.headers.host, req.headers['user-agent'], req.headers['accept-language'], req.ip, req.body, res, next);    
/**
 * Middleware authenticates socket used for EventSource
 * @param {import('./types.js').server_server_req} req
 * @param {import('./types.js').server_server_res} res
 * @param {function} next
 */
 const AuthenticateSocket = (req, res, next) => service.AuthenticateSocket(req.query.iam, req.originalUrl.substring(req.route.path.indexOf('*')), req.headers.host, req.ip, res, next);    

/**
 * Middleware authenticates IAM Admin
 * @param {import('./types.js').server_server_req} req
 * @param {import('./types.js').server_server_res} res
 * @param {function} next
 */
const AuthenticateIAMAdmin = (req, res, next)  => service.AuthenticateUserCommon(req.query.iam, 'AUTH_ADMIN', req.headers.authorization, req.headers.host, req.ip, res, next);

/**
 * Middleware authenticates IAM User
 * @param {import('./types.js').server_server_req} req
 * @param {import('./types.js').server_server_res} res
 * @param {function} next
 */
const AuthenticateIAMUser = (req, res, next) => service.AuthenticateUserCommon(req.query.iam, 'AUTH_USER', req.headers.authorization, req.headers.host, req.ip, res, next);

 /**
 * Middleware authenticates IAM System Admin
 * @param {import('./types.js').server_server_req} req
 * @param {import('./types.js').server_server_res} res
 * @param {function} next
 */
const AuthenticateIAMProvider = (req, res, next) => service.AuthenticateUserCommon(req.query.iam, 'AUTH_PROVIDER', req.headers.authorization, req.headers.host, req.ip, res, next);

export{ AuthenticateIdToken, AuthenticateIdTokenRegistration,
        AuthenticateAccessTokenAdmin, AuthenticateAccessToken, AuthenticateExternal,
        AuthenticateSocket,
        AuthenticateIAMAdmin, AuthenticateIAMUser,AuthenticateIAMProvider};