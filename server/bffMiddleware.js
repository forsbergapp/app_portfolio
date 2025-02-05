/** 
 * Middleware for   Backend for frontend (BFF)
 * 
 * Contains BFF controller functions for routes
 * All requests must pass BFF controllers and first controller is bffInit
 * IAM middleware are called before except for bffInit, bffStart and bffApp
 * See server routes for more info
 * 
 * @module server/bffMiddleware
 */
/**
 * @import {server_server_req, server_server_res} from './types.js'
 */
/**@type{import('./bff.js')} */
const bffService = await import('./bff.js');

/**
 * @name bffInit
 * @description Backend for frontend (BFF) init for all methods
 * @function
 * @param {server_server_req} req
 * @param {server_server_res} res
 * @param {function} next
 * @returns {Promise.<void>}
 */
 const bffInit = async (req, res, next) =>{
    const result = await bffService.bffInit(req, res);
    if (result.reason == null)
        next();
    else
        if (result.redirect)
            res.redirect(result.redirect);
        else
            res.end();
};
/**
 * @name bffStart
 * @description Backend for frontend (BFF) start for get method
 * @function
 * @param {server_server_req} req
 * @param {server_server_res} res
 * @param {function} next
 * @returns {Promise.<void>}
 */
 const bffStart = async (req, res, next) =>{
    const result = await bffService.bffStart(req, res);
    switch (result.reason){
        case 'REDIRECT':{
            res.redirect(result.redirect);
            break;
        }
        case 'SEND':{
            res.end();
            break;
        }
        default:{
            next();
        }
    }
};
/**
 * @name bffCommon
 * @description Backend for frontend (BFF) common
 * @function
 * @param {server_server_req} req
 * @param {server_server_res} res
 * @returns {{host:string,
 *          url:string,
 *          route_path:string,
 *          method:string,
 *          query:string,
 *          body:server_server_req['body'],
 *          idToken:string,
 *          authorization:string|null,
 *          ip:string,
 *          user_agent:string,
 *          accept_language:string,
 *          res:server_server_res}}
 */
 const bffCommon = (req, res) =>{

    return {
        //request
        host: req.headers.host, 
        url:req.originalUrl,
        route_path: req.originalUrl.substring(req.route.path.indexOf('*'), req.originalUrl.indexOf('?')>-1?req.originalUrl.indexOf('?'):req.originalUrl.length),
        method: req.method,
        query: req.query?.parameters ?? '',
        body: req.body,
        idToken:  req.headers['id-token']?.replace('Bearer ',''), 
        authorization:  req.headers.authorization, 
        //metadata
        ip: req.ip, 
        user_agent: req.headers['user-agent'], 
        accept_language: req.headers['accept-language'], 
        //response
        res: res
    };
 };
/**
 * @name bffApp
 * @description Backend for frontend (BFF) APP including assets, report and info pages
 * @function
 * @param {server_server_req} req
 * @param {server_server_res} res
 * @returns {*}
 */
 const bffApp = (req, res) =>{
    /**@type{import('./types.js').server_bff_parameters} */
    const bff_parameters = {endpoint:'APP', 
                            ...bffCommon(req, res)
                            };
    bffService.bff(bff_parameters);
};
/**
 * @name bffAppId
 * @description Backend for frontend (BFF) APP_ID
 * @function
 * @param {server_server_req} req - Request
 * @param {server_server_res} res
 * @returns {*}
 */
 const bffAppId = (req, res) =>{
    /**@type{import('./types.js').server_bff_parameters} */
    const bff_parameters = {endpoint:'APP_ID', 
                            ...bffCommon(req, res)
                            };
    bffService.bff(bff_parameters);
};
/**
 * @name bffAppIdSignup
 * @description Backend for frontend (BFF) APP_ID_SIGNUP
 * @function
 * @param {server_server_req} req - Request
 * @param {server_server_res} res
 * @returns {*}
 */
 const bffAppIdSignup = (req, res) =>{
    /**@type{import('./types.js').server_bff_parameters} */
    const bff_parameters = {endpoint:'APP_ID_SIGNUP', 
                            ...bffCommon(req, res)
                            };
    bffService.bff(bff_parameters);
};
/**
 * @name bffAppAccess
 * @description Backend for frontend (BFF) APP_ACCESS
 * @function
 * @param {server_server_req} req - Request
 * @param {server_server_res} res
 * @returns {*}
 */
 const bffAppAccess = (req, res) =>{
    /**@type{import('./types.js').server_bff_parameters} */
    const bff_parameters = {endpoint:'APP_ACCESS', 
                            ...bffCommon(req, res)
                            };
    bffService.bff(bff_parameters);
};
/**
 * @name bffAppAccessVerification
 * @description Backend for frontend (BFF) APP_ACCESS_VERIFICATION
 * @function
 * @param {server_server_req} req - Request
 * @param {server_server_res} res
 * @returns {*}
 */
const bffAppAccessVerification = (req, res) =>{
    /**@type{import('./types.js').server_bff_parameters} */
    const bff_parameters = {endpoint:'APP_ACCESS_VERIFICATION', 
                            ...bffCommon(req, res)
                            };
    bffService.bff(bff_parameters);
};

/**
 * @name bffAppExternal
 * @description Backend for frontend (BFF) APP_EXTERNAL
 * @function
 * @param {server_server_req} req - Request
 * @param {server_server_res} res
 * @returns {*}
 */
const bffAppExternal = (req, res) =>{
    /**@type{import('./types.js').server_bff_parameters} */
    const bff_parameters = {endpoint:'APP_EXTERNAL', 
                            ...bffCommon(req, res)
                            };
    bffService.bff(bff_parameters);
};
/**
 * @name bffAdmin
 * @description Backend for frontend (BFF) ADMIN
 * @function
 * @param {server_server_req} req - Request
 * @param {server_server_res} res
 * @returns {*}
 */
 const bffAdmin = (req, res) =>{
    /**@type{import('./types.js').server_bff_parameters} */
    const bff_parameters = {endpoint:'ADMIN', 
                            ...bffCommon(req, res)
                            };
    bffService.bff(bff_parameters);
};
/**
 * @name bffIAM
 * @description Backend for frontend (BFF) IAM
 * @function
 * @param {server_server_req} req - Request
 * @param {server_server_res} res
 * @returns {*}
 */
const bffIAM = (req, res) =>{
    /**@type{import('./types.js').server_bff_parameters} */
    const bff_parameters = {endpoint:'IAM', 
                            ...bffCommon(req, res)
                            };
    bffService.bff(bff_parameters);
};


export{ bffInit, bffStart, bffApp, bffAppId, bffAppIdSignup, bffAppAccess, bffAppAccessVerification, bffAppExternal, bffAdmin, 
        bffIAM};