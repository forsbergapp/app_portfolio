/** 
 * Backend for frontend (BFF)
 * 
 * Contains BFF controller functions for routes
 * All requests must pass BFF controllers and first controller is bffInit
 * IAM middleware are called before except for bffInit, bffStart and bffApp
 * See server routes for more info
 * 
 * @module server/bff 
 */

/**@type{import('./bff.service.js')} */
const bffService = await import('./bff.service.js');

/**
 * Backend for frontend (BFF) init for all methods
 * 
 * @param {import('./types.js').server_server_req} req
 * @param {import('./types.js').server_server_res} res
 * @param {function} next
 */
 const bffInit = async (req, res, next) =>{
    const result = await bffService.bffInit(req, res);
    if (result.reason == null)
        next();
    else
        res.end();
};
/**
 * Backend for frontend (BFF) start for get method
 * 
 * @param {import('./types.js').server_server_req} req
 * @param {import('./types.js').server_server_res} res
 * @param {function} next
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
 * Backend for frontend (BFF) common
 * 
 * @param {import('./types.js').server_server_req} req
 * @param {import('./types.js').server_server_res} res
 * returns {{}}
 */
 const bffCommon = (req, res) =>{

    return {
        //request
        host: req.headers.host, 
        url:req.originalUrl,
        route_path: req.originalUrl.substring(req.route.path.indexOf('*'), req.originalUrl.indexOf('?')>-1?req.originalUrl.indexOf('?'):req.originalUrl.length),
        method: req.method,
        query: req.query.parameters ?? '',
        body: req.body, 
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
 * Backend for frontend (BFF) APP including assets, report and info pages
 * 
 * @param {import('./types.js').server_server_req} req
 * @param {import('./types.js').server_server_res} res
 */
 const bffApp = (req, res) =>{
    /**@type{import('./types.js').server_bff_parameters} */
    const bff_parameters = {endpoint:'APP', 
                            ...bffCommon(req, res)
                            };
    bffService.bff(bff_parameters);
};
/**
 * Backend for frontend (BFF) APP_DATA
 * 
 * @param {import('./types.js').server_server_req} req - Request
 * @param {import('./types.js').server_server_res} res
 */
 const bffAppData = (req, res) =>{
    /**@type{import('./types.js').server_bff_parameters} */
    const bff_parameters = {endpoint:'APP_DATA', 
                            ...bffCommon(req, res)
                            };
    bffService.bff(bff_parameters);
};
/**
 * Backend for frontend (BFF) APP_SIGNUP
 * 
 * @param {import('./types.js').server_server_req} req - Request
 * @param {import('./types.js').server_server_res} res
 */
 const bffAppSignup = (req, res) =>{
    /**@type{import('./types.js').server_bff_parameters} */
    const bff_parameters = {endpoint:'APP_SIGNUP', 
                            ...bffCommon(req, res)
                            };
    bffService.bff(bff_parameters);
};
/**
 * Backend for frontend (BFF) APP_ACCESS
 * 
 * @param {import('./types.js').server_server_req} req - Request
 * @param {import('./types.js').server_server_res} res
 */
 const bffAppAccess = (req, res) =>{
    /**@type{import('./types.js').server_bff_parameters} */
    const bff_parameters = {endpoint:'APP_ACCESS', 
                            ...bffCommon(req, res)
                            };
    bffService.bff(bff_parameters);
};
/**
 * Backend for frontend (BFF) APP_EXTERNAL
 * 
 * @param {import('./types.js').server_server_req} req - Request
 * @param {import('./types.js').server_server_res} res
 */
const bffAppExternal = (req, res) =>{
    /**@type{import('./types.js').server_bff_parameters} */
    const bff_parameters = {endpoint:'APP_EXTERNAL', 
                            ...bffCommon(req, res)
                            };
    bffService.bff(bff_parameters);
};
/**
 * Backend for frontend (BFF) ADMIN
 * 
 * @param {import('./types.js').server_server_req} req - Request
 * @param {import('./types.js').server_server_res} res
 */
 const bffAdmin = (req, res) =>{
    /**@type{import('./types.js').server_bff_parameters} */
    const bff_parameters = {endpoint:'ADMIN', 
                            ...bffCommon(req, res)
                            };
    bffService.bff(bff_parameters);
};

/**
 * Backend for frontend (BFF) socket
 * 
 * @param {import('./types.js').server_server_req} req - Request
 * @param {import('./types.js').server_server_res} res
 */
const bffSocket = (req, res) =>{
    /**@type{import('./types.js').server_bff_parameters} */
    const bff_parameters = {endpoint:'SOCKET', 
                            ...bffCommon(req, res)
                            };
    bffService.bff(bff_parameters);
};
/**
 * Backend for frontend (BFF) IAM_ADMIN
 * 
 * @param {import('./types.js').server_server_req} req - Request
 * @param {import('./types.js').server_server_res} res
 */
const bffIAMAdmin = (req, res) =>{
    /**@type{import('./types.js').server_bff_parameters} */
    const bff_parameters = {endpoint:'IAM_ADMIN', 
                            ...bffCommon(req, res)
                            };
    bffService.bff(bff_parameters);
};
/**
 * Backend for frontend (BFF) IAM_USER
 * 
 * @param {import('./types.js').server_server_req} req - Request
 * @param {import('./types.js').server_server_res} res
 */
 const bffIAMUser = (req, res) =>{
    /**@type{import('./types.js').server_bff_parameters} */
    const bff_parameters = {endpoint:'IAM_USER', 
                            ...bffCommon(req, res)
                            };
    bffService.bff(bff_parameters);
};
/**
 * Backend for frontend (BFF) IAM_PROVIDER
 * 
 * @param {import('./types.js').server_server_req} req - Request
 * @param {import('./types.js').server_server_res} res
 */
 const bffIAMProvider = (req, res) =>{
    /**@type{import('./types.js').server_bff_parameters} */
    const bff_parameters = {endpoint:'IAM_PROVIDER', 
                            ...bffCommon(req, res)
                            };
    bffService.bff(bff_parameters);
};

export{ bffInit, bffStart, bffApp, bffAppData, bffAppSignup, bffAppAccess, bffAppExternal, bffAdmin, bffSocket, 
        bffIAMAdmin, bffIAMUser, bffIAMProvider};