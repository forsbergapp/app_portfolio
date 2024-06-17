/** @module apps */

/**@type{import('./bff.service.js')} */
const service = await import('./bff.service.js');
/**@type{import('./server.service.js')} */
const {responsetime} = await import(`file://${process.cwd()}/server/server.service.js`);
/**@type{import('./log.service.js')} */
const {LogRequestI} = await import(`file://${process.cwd()}/server/log.service.js`);
/**@type{import('./iam.service.js')} */
const {AuthenticateRequest} = await import(`file://${process.cwd()}/server/iam.service.js`);
/**@type{import('./config.service.js')} */
const {CheckFirstTime, ConfigGet, ConfigFileGet} = await import(`file://${process.cwd()}/server/config.service.js`);
/**@type{import('./security.service.js')} */
const {createUUID, createRequestId, createCorrelationId}= await import(`file://${process.cwd()}/server/security.service.js`);

const fs = await import('node:fs');
/**
 * Backend for frontend (BFF) init for all methods
 * 
 * @param {import('../types.js').req} req
 * @param {import('../types.js').res} res
 * @param {function} next
 */
 const BFF_init = async (req, res, next) =>{
    if (req.headers.accept == 'text/event-stream'){
        //Eventsource, log since response is open and log again when closing
        LogRequestI(req, res.statusCode, typeof res.statusMessage == 'string'?res.statusMessage:JSON.stringify(res.statusMessage)??'', responsetime(res));
    }
    res.on('close',()=>{	
        //eventsource response time will be time connected until disconnected
        LogRequestI(req, res.statusCode, typeof res.statusMessage == 'string'?res.statusMessage:JSON.stringify(res.statusMessage)??'', responsetime(res)).then(() => {
            res.end();
        });
    });
    //access control that stops request if not passing controls
    /**@type{import('../types.js').authenticate_request}*/
    const result = await AuthenticateRequest(req.ip, req.headers.host, req.method, req.headers['user-agent'], req.headers['accept-language'], req.path)
                        .catch((/**@type{import('../types.js').error}*/error)=>{return { statusCode: 500, statusMessage: error};});
    if (result != null){                                        
        res.statusCode = result.statusCode;
        res.statusMessage = 'access control: ' + result.statusMessage;
        res.send('⛔');
        res.end();
    }
    else{
        //set headers
        res.setHeader('X-Response-Time', process.hrtime());
        req.headers['X-Request-Id'] =  createUUID().replaceAll('-','');
        if (req.headers.authorization)
            req.headers['X-Correlation-Id'] = createRequestId();
        else
            req.headers['X-Correlation-Id'] = createCorrelationId(req.hostname +  req.ip + req.method);
        res.setHeader('Access-Control-Max-Age','5');
        res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, Content-Type, Accept');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        if (ConfigGet('SERVICE_IAM', 'ENABLE_CONTENT_SECURITY_POLICY') == '1')
            res.setHeader('content-security-policy', await ConfigFileGet('IAM_POLICY', false).then((/**@type{*}*/row)=>row['content-security-policy']));
        res.setHeader('cross-origin-opener-policy','same-origin');
        res.setHeader('cross-origin-resource-policy',	'same-origin');
        res.setHeader('referrer-policy', 'strict-origin-when-cross-origin');
        res.setHeader('strict-transport-security', `max-age=${180 * 24 * 60 * 60}; includeSubDomains`);
        res.setHeader('x-content-type-options', 'nosniff');
        res.setHeader('x-dns-prefetch-control', 'off');
        res.setHeader('x-download-options', 'noopen');
        res.setHeader('x-frame-options', 'SAMEORIGIN');
        res.setHeader('x-permitted-cross-domain-policies', 'none');
        res.setHeader('x-xss-protection', '0');
        res.removeHeader('X-Powered-By');
        //check robots.txt
        if (req.originalUrl=='/robots.txt'){
            res.type('text/plain');
            res.send('User-agent: *\nDisallow: /');
        }
        else{
            //browser favorite icon to ignore
            if (req.originalUrl=='/favicon.ico'){
                res.send('');
            }
            else{
                next();
            }
        }
    }
};
/**
 * Backend for frontend (BFF) start for get method
 * 
 * @param {import('../types.js').req} req
 * @param {import('../types.js').res} res
 * @param {function} next
 */
 const BFF_start = async (req, res, next) =>{
    const check_redirect = () =>{
        //redirect naked domain to www except for localhost
        if (req.headers.host.startsWith(ConfigGet('SERVER','HOST') ?? '') && req.headers.host.indexOf('localhost')==-1)
            if (req.protocol=='http' && ConfigGet('SERVER', 'HTTPS_ENABLE')=='1')
                res.redirect(`https://www.${req.headers.host}${req.originalUrl}`);
            else
                res.redirect(`http://www.${req.headers.host}${req.originalUrl}`);
        else{
            //redirect from http to https if https enabled
            if (req.protocol=='http' && ConfigGet('SERVER', 'HTTPS_ENABLE')=='1')
                res.redirect(`https://${req.headers.host}${req.originalUrl}`);
            else
                next();
        }
    };
    //if first time, when no system admin exists, then redirect everything to admin
    if (CheckFirstTime() && req.headers.host.startsWith('admin') == false && req.headers.referer==undefined)
        res.redirect(`http://admin.${ConfigGet('SERVER','HOST')}`);
    else{
        //check if SSL verification using letsencrypt should be enabled when validating domains
        if (ConfigGet('SERVER', 'HTTPS_SSL_VERIFICATION')=='1'){
            if (req.originalUrl.startsWith(ConfigGet('SERVER', 'HTTPS_SSL_VERIFICATION_PATH') ?? '')){
                res.type('text/plain');
                res.send(await fs.promises.readFile(`${process.cwd()}${req.originalUrl}`, 'utf8'));
            }
            else
                check_redirect();
        }
        else
            check_redirect();
        
    }
};
/**
 * Backend for frontend (BFF) common
 * 
 * @param {import('../types.js').req} req
 * @param {import('../types.js').res} res
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
 * @param {import('../types.js').req} req
 * @param {import('../types.js').res} res
 */
 const BFF_app = (req, res) =>{
    /**@type{import('../types.js').bff_parameters} */
    const bff_parameters = {endpoint:'APP', 
                            ...BFF_common(req, res)
                            };
    service.BFF(bff_parameters);
};
/**
 * Backend for frontend (BFF) APP_DATA
 * 
 * @param {import('../types.js').req} req - Request
 * @param {import('../types.js').res} res
 */
 const BFF_app_data = (req, res) =>{
    /**@type{import('../types.js').bff_parameters} */
    const bff_parameters = {endpoint:'APP_DATA', 
                            ...BFF_common(req, res)
                            };
    service.BFF(bff_parameters);
};
/**
 * Backend for frontend (BFF) APP_SIGNUP
 * 
 * @param {import('../types.js').req} req - Request
 * @param {import('../types.js').res} res
 */
 const BFF_app_signup = (req, res) =>{
    /**@type{import('../types.js').bff_parameters} */
    const bff_parameters = {endpoint:'APP_SIGNUP', 
                            ...BFF_common(req, res)
                            };
    service.BFF(bff_parameters);
};
/**
 * Backend for frontend (BFF) APP_ACCESS
 * 
 * @param {import('../types.js').req} req - Request
 * @param {import('../types.js').res} res
 */
 const BFF_app_access = (req, res) =>{
    /**@type{import('../types.js').bff_parameters} */
    const bff_parameters = {endpoint:'APP_ACCESS', 
                            ...BFF_common(req, res)
                            };
    service.BFF(bff_parameters);
};
/**
 * Backend for frontend (BFF) ADMIN
 * 
 * @param {import('../types.js').req} req - Request
 * @param {import('../types.js').res} res
 */
 const BFF_admin = (req, res) =>{
    /**@type{import('../types.js').bff_parameters} */
    const bff_parameters = {endpoint:'ADMIN', 
                            ...BFF_common(req, res)
                            };
    service.BFF(bff_parameters);
};
/**
 * Backend for frontend (BFF) SUPERADMIN
 * 
 * @param {import('../types.js').req} req - Request
 * @param {import('../types.js').res} res
 */
 const BFF_superadmin = (req, res) =>{
    /**@type{import('../types.js').bff_parameters} */
    const bff_parameters = {endpoint:'SUPERADMIN', 
                            ...BFF_common(req, res)
                            };
    service.BFF(bff_parameters);
};

/**
 * Backend for frontend (BFF) SYSTEMADMIN
 * 
 * @param {import('../types.js').req} req - Request
 * @param {import('../types.js').res} res
 */
 const BFF_systemadmin = (req, res) =>{
    /**@type{import('../types.js').bff_parameters} */
    const bff_parameters = {endpoint:'SYSTEMADMIN', 
                            ...BFF_common(req, res)
                            };
    service.BFF(bff_parameters);
};

/**
 * Backend for frontend (BFF) socket
 * 
 * @param {import('../types.js').req} req - Request
 * @param {import('../types.js').res} res
 */
const BFF_socket = (req, res) =>{
    /**@type{import('../types.js').bff_parameters} */
    const bff_parameters = {endpoint:'SOCKET', 
                            ...BFF_common(req, res)
                            };
    service.BFF(bff_parameters);
};
/**
 * Backend for frontend (BFF) IAM_SYSTEMADMIN
 * 
 * @param {import('../types.js').req} req - Request
 * @param {import('../types.js').res} res
 */
const BFF_iam_systemadmin = (req, res) =>{
    /**@type{import('../types.js').bff_parameters} */
    const bff_parameters = {endpoint:'IAM_SYSTEMADMIN', 
                            ...BFF_common(req, res)
                            };
    service.BFF(bff_parameters);
};
/**
 * Backend for frontend (BFF) IAM_ADMIN
 * 
 * @param {import('../types.js').req} req - Request
 * @param {import('../types.js').res} res
 */
 const BFF_iam_admin = (req, res) =>{
    /**@type{import('../types.js').bff_parameters} */
    const bff_parameters = {endpoint:'IAM_ADMIN', 
                            ...BFF_common(req, res)
                            };
    service.BFF(bff_parameters);
};
/**
 * Backend for frontend (BFF) IAM_USER
 * 
 * @param {import('../types.js').req} req - Request
 * @param {import('../types.js').res} res
 */
 const BFF_iam_user = (req, res) =>{
    /**@type{import('../types.js').bff_parameters} */
    const bff_parameters = {endpoint:'IAM_USER', 
                            ...BFF_common(req, res)
                            };
    service.BFF(bff_parameters);
};
/**
 * Backend for frontend (BFF) IAM_PROVIDER
 * 
 * @param {import('../types.js').req} req - Request
 * @param {import('../types.js').res} res
 */
 const BFF_iam_provider = (req, res) =>{
    /**@type{import('../types.js').bff_parameters} */
    const bff_parameters = {endpoint:'IAM_PROVIDER', 
                            ...BFF_common(req, res)
                            };
    service.BFF(bff_parameters);
};

export{ BFF_init, BFF_start, BFF_app, BFF_app_data, BFF_app_signup, BFF_app_access, BFF_admin, BFF_superadmin, BFF_systemadmin, BFF_socket, 
        BFF_iam_systemadmin, BFF_iam_admin, BFF_iam_user, BFF_iam_provider};