/** 
 * Middleware functions for REST API
 * @module server/iam 
 */

/**
 * @import {server_server_req, server_server_res} from './types.js'
 */

/**@type{import('./iam.service.js')} */
const iamService = await import(`file://${process.cwd()}/server/iam.service.js`);

/**
 * @name iamAuthenticateAccessTokenAdmin
 * @description Middleware authenticates admin token
 * @function
 * @param {server_server_req} req
 * @param {server_server_res} res
 * @param {function} next
 * @returns {Promise.<void>}
 */
 const iamAuthenticateAccessTokenAdmin = (req, res, next) => iamService.iamAuthenticateUserCommon(req.query.iam, 'ADMIN', req.headers.authorization, req.headers.host, req.ip, res, next);

/**
 * @name iamAuthenticateIdToken
 * @description Middleware authenticates id token
 * @function
 * @param {server_server_req} req
 * @param {server_server_res} res
 * @param {function} next
 * @returns {Promise.<void>}
 */
const iamAuthenticateIdToken = (req, res, next) => iamService.iamAuthenticateUserCommon(req.query.iam, 'APP_ID', req.headers.authorization, req.headers.host, req.ip, res, next);

/**
 * @name iamAuthenticateIdTokenRegistration
 * @description Middleware authenticates id token registration
 * @function
 * @param {server_server_req} req
 * @param {server_server_res} res
 * @param {function} next
 * @returns {Promise.<void>}
 */
const iamAuthenticateIdTokenRegistration = (req, res, next) => iamService.iamAuthenticateUserCommon(req.query.iam, 'APP_ID_REGISTRATION', req.headers.authorization, req.headers.host, req.ip, res, next);

/**
 * @name iamAuthenticateAccessToken
 * @description Middleware authenticates access token
 * @function
 * @param {server_server_req} req
 * @param {server_server_res} res
 * @param {function} next
 * @returns {Promise.<void>}
 */
const iamAuthenticateAccessToken = (req, res, next) => iamService.iamAuthenticateUserCommon(req.query.iam, 'APP_ACCESS', req.headers.authorization, req.headers.host, req.ip, res, next);    

/**
 * @name iamAuthenticateExternal
 * @description Middleware authenticates external request
 * @function
 * @param {server_server_req} req
 * @param {server_server_res} res
 * @param {function} next
 * @returns {void}
 */
const iamAuthenticateExternal = (req, res, next) => iamService.iamAuthenticateExternal('APP_EXTERNAL', req.headers.host, req.headers['user-agent'], req.headers['accept-language'], req.ip, req.body, res, next);    
/**
 * @name iamAuthenticateSocket
 * @description Middleware authenticates socket used for EventSource
 * @function
 * @param {server_server_req} req
 * @param {server_server_res} res
 * @param {function} next
 * @returns {void}
 */
 const iamAuthenticateSocket = (req, res, next) => iamService.iamAuthenticateSocket(req.query.iam, req.originalUrl.substring(req.route.path.indexOf('*')), req.headers.host, req.ip, res, next);    

/**
 * @name iamAuthenticateAdmin
 * @description Middleware authenticates IAM Admin
 * @function
 * @param {server_server_req} req
 * @param {server_server_res} res
 * @param {function} next
 * @returns {Promise.<void>}
 */
const iamAuthenticateAdmin = (req, res, next)  => iamService.iamAuthenticateUserCommon(req.query.iam, 'AUTH_ADMIN', req.headers.authorization, req.headers.host, req.ip, res, next);

/**
 * @name iamAuthenticateUser
 * @description Middleware authenticates IAM User
 * @function
 * @param {server_server_req} req
 * @param {server_server_res} res
 * @param {function} next
 * @returns {Promise.<void>}
 */
const iamAuthenticateUser = (req, res, next) => iamService.iamAuthenticateUserCommon(req.query.iam, 'AUTH_USER', req.headers.authorization, req.headers.host, req.ip, res, next);

 /**
  * @name iamAuthenticateProvider
  * @description Middleware authenticates IAM Provider
  * @function
  * @param {server_server_req} req
  * @param {server_server_res} res
  * @param {function} next
  * @returns {Promise.<void>}
  */
const iamAuthenticateProvider = (req, res, next) => iamService.iamAuthenticateUserCommon(req.query.iam, 'AUTH_PROVIDER', req.headers.authorization, req.headers.host, req.ip, res, next);

export{ iamAuthenticateIdToken, iamAuthenticateIdTokenRegistration,
        iamAuthenticateAccessTokenAdmin, iamAuthenticateAccessToken, 
        iamAuthenticateExternal,
        iamAuthenticateSocket,
        iamAuthenticateAdmin, 
        iamAuthenticateUser,
        iamAuthenticateProvider};