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
 * @name iamCommon
 * @description iam common parameters
 * @function
 * @param {server_server_req} req
 * @param {server_server_res} res
 * @returns {{  host:string,
 *              authorization:string,
 *              ip:string,
 *              res:server_server_res}}
 */
const iamCommon = (req, res) =>{
   return {
    authorization: req.headers.authorization, 
    host: req.headers.host.split(':')[0] ?? '', 
    ip: req.ip, 
    res:res
   };
};
/**
 * @name iamAuthenticateAccessTokenAdmin
 * @description Middleware authenticates admin token
 * @function
 * @param {server_server_req} req
 * @param {server_server_res} res
 * @param {function} next
 * @returns {Promise.<void>}
 */
 const iamAuthenticateAccessTokenAdmin = (req, res, next) => iamService.iamAuthenticateUserCommon({idToken:req.headers[ID_TOKEN_KEY].replace('Bearer ',''), endpoint:'ADMIN', ...iamCommon(req, res), next:next});

/**
 * @name iamAuthenticateIdToken
 * @description Middleware authenticates id token
 * @function
 * @param {server_server_req} req
 * @param {server_server_res} res
 * @param {function} next
 * @returns {Promise.<void>}
 */
const iamAuthenticateIdToken = (req, res, next) => iamService.iamAuthenticateUserCommon({idToken: req.headers[ID_TOKEN_KEY].replace('Bearer ',''), endpoint:'APP_ID', ...iamCommon(req, res), next:next});

/**
 * @name iamAuthenticateIdTokenRegistration
 * @description Middleware authenticates id token registration
 * @function
 * @param {server_server_req} req
 * @param {server_server_res} res
 * @param {function} next
 * @returns {Promise.<void>}
 */
const iamAuthenticateIAMSignup = (req, res, next) => iamService.iamAuthenticateUserCommon({idToken: req.headers[ID_TOKEN_KEY].replace('Bearer ',''), endpoint:'IAM_SIGNUP', ...iamCommon(req, res), next:next});

/**
 * @name iamAuthenticateAccessToken
 * @description Middleware authenticates access token
 * @function
 * @param {server_server_req} req
 * @param {server_server_res} res
 * @param {function} next
 * @returns {Promise.<void>}
 */
const iamAuthenticateAccessToken = (req, res, next) => iamService.iamAuthenticateUserCommon({idToken:req.headers[ID_TOKEN_KEY].replace('Bearer ',''), endpoint:'APP_ACCESS', ...iamCommon(req, res), next:next});
/**
 * @name iamAuthenticateAccessVerificationToken
 * @description Middleware authenticates access verification token
 * @function
 * @param {server_server_req} req
 * @param {server_server_res} res
 * @param {function} next
 * @returns {Promise.<void>}
 */
const iamAuthenticateAccessVerificationToken = (req, res, next) => iamService.iamAuthenticateUserCommon({idToken:req.headers[ID_TOKEN_KEY].replace('Bearer ',''), endpoint:'APP_ACCESS_VERIFICATION', ...iamCommon(req, res), next:next});

/**
 * @name iamAuthenticateExternal
 * @description Middleware authenticates app external request without token
 * @function
 * @param {server_server_req} req
 * @param {server_server_res} res
 * @param {function} next
 * @returns {Promise.<void>}
 */
const iamAuthenticateExternal = (req, res, next) => iamService.iamAuthenticateUserCommon({idToken:'', endpoint:'APP_EXTERNAL', ...iamCommon(req, res), next:next});

/**
 * @name iamAuthenticateAccessExternal
 * @description Middleware authenticates app access external request with token
 * @function
 * @param {server_server_req} req
 * @param {server_server_res} res
 * @param {function} next
 * @returns {Promise.<void>}
 */
const iamAuthenticateAccessExternal = (req, res, next) => iamService.iamAuthenticateUserCommon({idToken:'', endpoint:'APP_ACCESS_EXTERNAL', ...iamCommon(req, res), next:next});

/**
 * @name iamAuthenticateIAM
 * @description Middleware authenticates IAM login
 * @function
 * @param {server_server_req} req
 * @param {server_server_res} res
 * @param {function} next
 * @returns {Promise.<void>}
 */
const iamAuthenticateIAM = (req, res, next)  => iamService.iamAuthenticateUserCommon({idToken: req.headers[ID_TOKEN_KEY].replace('Bearer ',''), endpoint:'IAM', ...iamCommon(req, res), next:next});

export{ iamAuthenticateIdToken, iamAuthenticateIAMSignup,
        iamAuthenticateAccessTokenAdmin, iamAuthenticateAccessToken, iamAuthenticateAccessVerificationToken,
        iamAuthenticateExternal, iamAuthenticateAccessExternal,
        iamAuthenticateIAM};