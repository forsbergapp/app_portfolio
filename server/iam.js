/** 
 * Middleware functions for REST API
 * @module server/iam 
 */

/**@type{import('./iam.service.js')} */
const iamService = await import(`file://${process.cwd()}/server/iam.service.js`);

/**
 * Middleware authenticates admin token
 * @param {import('./types.js').server_server_req} req
 * @param {import('./types.js').server_server_res} res
 * @param {function} next
 */
 const iamAccessTokenAuthenticateAdmin = (req, res, next) => iamService.iamUserCommonAuthenticate(req.query.iam, 'ADMIN', req.headers.authorization, req.headers.host, req.ip, res, next);

/**
 * Middleware authenticates id token
 * @param {import('./types.js').server_server_req} req
 * @param {import('./types.js').server_server_res} res
 * @param {function} next
 */
const iamIdTokenAuthenticate = (req, res, next) => iamService.iamUserCommonAuthenticate(req.query.iam, 'APP_DATA', req.headers.authorization, req.headers.host, req.ip, res, next);

/**
 * Middleware authenticates id token registration
 * @param {import('./types.js').server_server_req} req
 * @param {import('./types.js').server_server_res} res
 * @param {function} next
 */
const iamIdTokenAuthenticateRegistration = (req, res, next) => iamService.iamUserCommonAuthenticate(req.query.iam, 'APP_DATA_REGISTRATION', req.headers.authorization, req.headers.host, req.ip, res, next);

/**
 * Middleware authenticates access token
 * @param {import('./types.js').server_server_req} req
 * @param {import('./types.js').server_server_res} res
 * @param {function} next
 */
const iamAccessTokenAuthenticate = (req, res, next) => iamService.iamUserCommonAuthenticate(req.query.iam, 'APP_ACCESS', req.headers.authorization, req.headers.host, req.ip, res, next);    

/**
 * Middleware authenticates external request
 * @param {import('./types.js').server_server_req} req
 * @param {import('./types.js').server_server_res} res
 * @param {function} next
 */
const iamExternalAuthenticate = (req, res, next) => iamService.iamExternalAuthenticate('APP_EXTERNAL', req.headers.host, req.headers['user-agent'], req.headers['accept-language'], req.ip, req.body, res, next);    
/**
 * Middleware authenticates socket used for EventSource
 * @param {import('./types.js').server_server_req} req
 * @param {import('./types.js').server_server_res} res
 * @param {function} next
 */
 const iamSocketAuthenticate = (req, res, next) => iamService.iamSocketAuthenticate(req.query.iam, req.originalUrl.substring(req.route.path.indexOf('*')), req.headers.host, req.ip, res, next);    

/**
 * Middleware authenticates IAM Admin
 * @param {import('./types.js').server_server_req} req
 * @param {import('./types.js').server_server_res} res
 * @param {function} next
 */
const iamAdminAuthenticate = (req, res, next)  => iamService.iamUserCommonAuthenticate(req.query.iam, 'AUTH_ADMIN', req.headers.authorization, req.headers.host, req.ip, res, next);

/**
 * Middleware authenticates IAM User
 * @param {import('./types.js').server_server_req} req
 * @param {import('./types.js').server_server_res} res
 * @param {function} next
 */
const iamUserAuthenticate = (req, res, next) => iamService.iamUserCommonAuthenticate(req.query.iam, 'AUTH_USER', req.headers.authorization, req.headers.host, req.ip, res, next);

 /**
 * Middleware authenticates IAM Provider
 * @param {import('./types.js').server_server_req} req
 * @param {import('./types.js').server_server_res} res
 * @param {function} next
 */
const iamProviderAuthenticate = (req, res, next) => iamService.iamUserCommonAuthenticate(req.query.iam, 'AUTH_PROVIDER', req.headers.authorization, req.headers.host, req.ip, res, next);

export{ iamIdTokenAuthenticate, iamIdTokenAuthenticateRegistration,
        iamAccessTokenAuthenticateAdmin, iamAccessTokenAuthenticate, 
        iamExternalAuthenticate,
        iamSocketAuthenticate,
        iamAdminAuthenticate, 
        iamUserAuthenticate,
        iamProviderAuthenticate};