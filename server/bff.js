/** 
 * Backend for frontend (BFF)
 * 
 * Contains BFF controller functions for routes
 * All requests must pass BFF controllers and first controller is BFF_init
 * IAM middleware are called before except for BFF_init, BFF_start and BFF_app
 * See server routes for more info
 * 
 * @module server/bff 
 */

/**@type{import('./bff.service.js')} */
const service = await import('./bff.service.js');

/**
 * Backend for frontend (BFF) init for all methods
 * 
 * @param {import('../types.js').server_server_req} req
 * @param {import('../types.js').server_server_res} res
 * @param {function} next
 */
 const BFF_init = async (req, res, next) =>{
    const result = await service.BFF_init(req, res);
    if (result.reason == null)
        next();
    else
        res.end();
};
/**
 * Backend for frontend (BFF) start for get method
 * 
 * @param {import('../types.js').server_server_req} req
 * @param {import('../types.js').server_server_res} res
 * @param {function} next
 */
 const BFF_start = async (req, res, next) =>{
    const result = await service.BFF_start(req, res);
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
 * @param {import('../types.js').server_server_req} req
 * @param {import('../types.js').server_server_res} res
 * returns {{}}
 */
 const BFF_common = (req, res) =>{

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
 * @param {import('../types.js').server_server_req} req
 * @param {import('../types.js').server_server_res} res
 */
 const BFF_app = (req, res) =>{
    /**@type{import('../types.js').server_bff_parameters} */
    const bff_parameters = {endpoint:'APP', 
                            ...BFF_common(req, res)
                            };
    service.BFF(bff_parameters);
};
/**
 * Backend for frontend (BFF) APP_DATA
 * 
 * @param {import('../types.js').server_server_req} req - Request
 * @param {import('../types.js').server_server_res} res
 */
 const BFF_app_data = (req, res) =>{
    /**@type{import('../types.js').server_bff_parameters} */
    const bff_parameters = {endpoint:'APP_DATA', 
                            ...BFF_common(req, res)
                            };
    service.BFF(bff_parameters);
};
/**
 * Backend for frontend (BFF) APP_SIGNUP
 * 
 * @param {import('../types.js').server_server_req} req - Request
 * @param {import('../types.js').server_server_res} res
 */
 const BFF_app_signup = (req, res) =>{
    /**@type{import('../types.js').server_bff_parameters} */
    const bff_parameters = {endpoint:'APP_SIGNUP', 
                            ...BFF_common(req, res)
                            };
    service.BFF(bff_parameters);
};
/**
 * Backend for frontend (BFF) APP_ACCESS
 * 
 * @param {import('../types.js').server_server_req} req - Request
 * @param {import('../types.js').server_server_res} res
 */
 const BFF_app_access = (req, res) =>{
    /**@type{import('../types.js').server_bff_parameters} */
    const bff_parameters = {endpoint:'APP_ACCESS', 
                            ...BFF_common(req, res)
                            };
    service.BFF(bff_parameters);
};
/**
 * Backend for frontend (BFF) APP_EXTERNAL
 * 
 * @param {import('../types.js').server_server_req} req - Request
 * @param {import('../types.js').server_server_res} res
 */
const BFF_app_external = (req, res) =>{
    /**@type{import('../types.js').server_bff_parameters} */
    const bff_parameters = {endpoint:'APP_EXTERNAL', 
                            ...BFF_common(req, res)
                            };
    service.BFF(bff_parameters);
};
/**
 * Backend for frontend (BFF) ADMIN
 * 
 * @param {import('../types.js').server_server_req} req - Request
 * @param {import('../types.js').server_server_res} res
 */
 const BFF_admin = (req, res) =>{
    /**@type{import('../types.js').server_bff_parameters} */
    const bff_parameters = {endpoint:'ADMIN', 
                            ...BFF_common(req, res)
                            };
    service.BFF(bff_parameters);
};
/**
 * Backend for frontend (BFF) SUPERADMIN
 * 
 * @param {import('../types.js').server_server_req} req - Request
 * @param {import('../types.js').server_server_res} res
 */
 const BFF_superadmin = (req, res) =>{
    /**@type{import('../types.js').server_bff_parameters} */
    const bff_parameters = {endpoint:'SUPERADMIN', 
                            ...BFF_common(req, res)
                            };
    service.BFF(bff_parameters);
};

/**
 * Backend for frontend (BFF) SYSTEMADMIN
 * 
 * @param {import('../types.js').server_server_req} req - Request
 * @param {import('../types.js').server_server_res} res
 */
 const BFF_systemadmin = (req, res) =>{
    /**@type{import('../types.js').server_bff_parameters} */
    const bff_parameters = {endpoint:'SYSTEMADMIN', 
                            ...BFF_common(req, res)
                            };
    service.BFF(bff_parameters);
};

/**
 * Backend for frontend (BFF) socket
 * 
 * @param {import('../types.js').server_server_req} req - Request
 * @param {import('../types.js').server_server_res} res
 */
const BFF_socket = (req, res) =>{
    /**@type{import('../types.js').server_bff_parameters} */
    const bff_parameters = {endpoint:'SOCKET', 
                            ...BFF_common(req, res)
                            };
    service.BFF(bff_parameters);
};
/**
 * Backend for frontend (BFF) IAM_SYSTEMADMIN
 * 
 * @param {import('../types.js').server_server_req} req - Request
 * @param {import('../types.js').server_server_res} res
 */
const BFF_iam_systemadmin = (req, res) =>{
    /**@type{import('../types.js').server_bff_parameters} */
    const bff_parameters = {endpoint:'IAM_SYSTEMADMIN', 
                            ...BFF_common(req, res)
                            };
    service.BFF(bff_parameters);
};
/**
 * Backend for frontend (BFF) IAM_ADMIN
 * 
 * @param {import('../types.js').server_server_req} req - Request
 * @param {import('../types.js').server_server_res} res
 */
 const BFF_iam_admin = (req, res) =>{
    /**@type{import('../types.js').server_bff_parameters} */
    const bff_parameters = {endpoint:'IAM_ADMIN', 
                            ...BFF_common(req, res)
                            };
    service.BFF(bff_parameters);
};
/**
 * Backend for frontend (BFF) IAM_USER
 * 
 * @param {import('../types.js').server_server_req} req - Request
 * @param {import('../types.js').server_server_res} res
 */
 const BFF_iam_user = (req, res) =>{
    /**@type{import('../types.js').server_bff_parameters} */
    const bff_parameters = {endpoint:'IAM_USER', 
                            ...BFF_common(req, res)
                            };
    service.BFF(bff_parameters);
};
/**
 * Backend for frontend (BFF) IAM_PROVIDER
 * 
 * @param {import('../types.js').server_server_req} req - Request
 * @param {import('../types.js').server_server_res} res
 */
 const BFF_iam_provider = (req, res) =>{
    /**@type{import('../types.js').server_bff_parameters} */
    const bff_parameters = {endpoint:'IAM_PROVIDER', 
                            ...BFF_common(req, res)
                            };
    service.BFF(bff_parameters);
};

export{ BFF_init, BFF_start, BFF_app, BFF_app_data, BFF_app_signup, BFF_app_access, BFF_app_external, BFF_admin, BFF_superadmin, BFF_systemadmin, BFF_socket, 
        BFF_iam_systemadmin, BFF_iam_admin, BFF_iam_user, BFF_iam_provider};