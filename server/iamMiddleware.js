/** 
 * Middleware functions for REST API
 * @module server/iamMiddleware
 */

/**
 * @import {server_server_req, server_server_res} from './types.js'
 */

const ID_TOKEN_KEY ='id-token';

/**@type{import('./iam.js')} */
const iamService = await import(`file://${process.cwd()}/server/iam.js`);

/**
 * @name iamAuthenticateAccessTokenAdmin
 * @description Middleware authenticates admin token
 * @function
 * @param {server_server_req} req
 * @param {server_server_res} res
 * @param {function} next
 * @returns {Promise.<void>}
 */
 const iamAuthenticateAccessTokenAdmin = (req, res, next) => iamService.iamAuthenticateUserCommon(req.headers[ID_TOKEN_KEY].replace('Bearer ',''), 'ADMIN', req.headers.authorization, req.headers.host, req.ip, res, next);

/**
 * @name iamAuthenticateIdToken
 * @description Middleware authenticates id token
 * @function
 * @param {server_server_req} req
 * @param {server_server_res} res
 * @param {function} next
 * @returns {Promise.<void>}
 */
const iamAuthenticateIdToken = (req, res, next) => iamService.iamAuthenticateUserCommon(req.headers[ID_TOKEN_KEY].replace('Bearer ',''), 'APP_ID', req.headers.authorization, req.headers.host, req.ip, res, next);

/**
 * @name iamAuthenticateIdTokenRegistration
 * @description Middleware authenticates id token registration
 * @function
 * @param {server_server_req} req
 * @param {server_server_res} res
 * @param {function} next
 * @returns {Promise.<void>}
 */
const iamAuthenticateIdTokenRegistration = (req, res, next) => iamService.iamAuthenticateUserCommon(req.headers[ID_TOKEN_KEY].replace('Bearer ',''), 'APP_ID_SIGNUP', req.headers.authorization, req.headers.host, req.ip, res, next);

/**
 * @name iamAuthenticateAccessToken
 * @description Middleware authenticates access token
 * @function
 * @param {server_server_req} req
 * @param {server_server_res} res
 * @param {function} next
 * @returns {Promise.<void>}
 */
const iamAuthenticateAccessToken = (req, res, next) => iamService.iamAuthenticateUserCommon(req.headers[ID_TOKEN_KEY].replace('Bearer ',''), 'APP_ACCESS', req.headers.authorization, req.headers.host, req.ip, res, next);    
/**
 * @name iamAuthenticateAccessVerificationToken
 * @description Middleware authenticates access verification token
 * @function
 * @param {server_server_req} req
 * @param {server_server_res} res
 * @param {function} next
 * @returns {Promise.<void>}
 */
const iamAuthenticateAccessVerificationToken = (req, res, next) => iamService.iamAuthenticateUserCommon(req.headers[ID_TOKEN_KEY].replace('Bearer ',''), 'APP_ACCESS_VERIFICATION', req.headers.authorization, req.headers.host, req.ip, res, next);    

/**
 * @name iamAuthenticateExternal
 * @description Middleware authenticates external request
 * @function
 * @param {server_server_req} req
 * @param {server_server_res} res
 * @param {function} next
 * @returns {void}
 */
const iamAuthenticateExternal = (req, res, next) => iamService.iamAuthenticateExternal('APP_EXTERNAL', req.body, res, next);    

/**
 * @name iamAuthenticateIAM
 * @description Middleware authenticates IAM login
 * @function
 * @param {server_server_req} req
 * @param {server_server_res} res
 * @param {function} next
 * @returns {Promise.<void>}
 */
const iamAuthenticateIAM = (req, res, next)  => iamService.iamAuthenticateUserCommon(req.headers[ID_TOKEN_KEY].replace('Bearer ',''), 'IAM', req.headers.authorization, req.headers.host, req.ip, res, next);

export{ iamAuthenticateIdToken, iamAuthenticateIdTokenRegistration,
        iamAuthenticateAccessTokenAdmin, iamAuthenticateAccessToken, iamAuthenticateAccessVerificationToken,
        iamAuthenticateExternal,
        iamAuthenticateIAM};