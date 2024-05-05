/** @module apps */

// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

const service = await import('./bff.service.js');

const {responsetime} = await import(`file://${process.cwd()}/server/server.service.js`);
const {LogRequestI} = await import(`file://${process.cwd()}/server/log.service.js`);
const {iam_decode, AuthenticateRequest} = await import(`file://${process.cwd()}/server/iam.service.js`);
const {randomUUID, createHash} = await import('node:crypto');
const {CheckFirstTime, ConfigGet, ConfigGetSaved} = await import(`file://${process.cwd()}/server/config.service.js`);
const fs = await import('node:fs');
/**
 * Backend for frontend (BFF) init for all methods
 * 
 * @param {Types.req} req
 * @param {Types.res} res
 * @param {function} next
 */
 const BFF_init = async (req, res, next) =>{
    if (req.headers.accept == 'text/event-stream'){
        //Eventsource, log since response is open and log again when closing
        LogRequestI(req, res.statusCode, res.statusMessage, responsetime(res));
    }
    res.on('close',()=>{	
        //eventsource response time will be time connected until disconnected
        LogRequestI(req, res.statusCode, res.statusMessage, responsetime(res)).then(() => {
            res.end();
        });
    });
    //access control that stops request if not passing controls
    /**@type{Types.authenticate_request}*/
    const result = await AuthenticateRequest(req.ip, req.headers.host, req.method, req.headers['user-agent'], req.headers['accept-language'], req.path)
                        .catch((/**@type{Types.error}*/error)=>{return { statusCode: 500, statusMessage: error};});
    if (result != null){                                        
        res.statusCode = result.statusCode;
        res.statusMessage = 'access control: ' + result.statusMessage;
        res.send('⛔');
        res.end();
    }
    else{
        //set headers
        res.setHeader('X-Response-Time', process.hrtime());
        req.headers['X-Request-Id'] =  randomUUID().replaceAll('-','');
        if (req.headers.authorization)
            req.headers['X-Correlation-Id'] = createHash('md5').update(req.headers.authorization).digest('hex');
        else
            req.headers['X-Correlation-Id'] = createHash('md5').update(req.hostname +  req.ip + req.method).digest('hex');
        res.setHeader('Access-Control-Max-Age','5');
        res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, Content-Type, Accept');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        if (ConfigGet('SERVICE_IAM', 'ENABLE_CONTENT_SECURITY_POLICY') == '1')
            res.setHeader('content-security-policy', ConfigGetSaved('IAM_POLICY')['content-security-policy']);
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
 * @param {Types.req} req
 * @param {Types.res} res
 * @param {function} next
 */
 const BFF_start = async (req, res, next) =>{
    const check_redirect = () =>{
        //redirect naked domain to www except for localhost
        if (req.headers.host.startsWith(ConfigGet('SERVER','HOST')) && req.headers.host.indexOf('localhost')==-1)
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
        res.redirect(`http://admin.${ConfigGet('SERVER','HOST')}`)
    else{
        //check if SSL verification using letsencrypt should be enabled when validating domains
        if (ConfigGet('SERVER', 'HTTPS_SSL_VERIFICATION')=='1'){
            const ssl_verification_path = ConfigGet('SERVER', 'HTTPS_SSL_VERIFICATION_PATH');
            if (req.originalUrl.startsWith(ssl_verification_path)){
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
 * @param {Types.req} req
 * @param {Types.res} res
 * returns {{}}
 */
 const BFF_common = (req, res) =>{

    return {
        //request
        host: req.headers.host, 
        url:req.originalUrl.substring(req.route.path.indexOf('*')),
        method: req.method,
        iam: req.query.iam,
        query: req.query.parameters,
        body: req.body, 
        authorization:  req.headers.authorization, 
        //metadata
        ip: req.ip, 
        user_agent: req.headers['user-agent'], 
        accept_language: req.headers['accept-language'], 
        //response
        res: res
    };
 }
/**
 * Backend for frontend (BFF) APP including assets, report and info pages
 * 
 * @param {Types.req} req
 * @param {Types.res} res
 */
 const BFF_app = (req, res) =>{
    /**@type{Types.bff_parameters} */
    const bff_parameters = {endpoint:'APP', 
                            service: 'APP', 
                            ...BFF_common(req, res)
                            };
    service.BFF(bff_parameters);
};
/**
 * Backend for frontend (BFF) APP_DATA
 * 
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
 const BFF_app_data = (req, res) =>{
    /**@type{Types.bff_parameters} */
    const bff_parameters = {endpoint:'APP_DATA', 
                            service: iam_decode(req.query.iam).get('service'), 
                            ...BFF_common(req, res)
                            };
    service.BFF(bff_parameters);
};
/**
 * Backend for frontend (BFF) APP_SIGNUP
 * 
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
 const BFF_app_signup = (req, res) =>{
    /**@type{Types.bff_parameters} */
    const bff_parameters = {endpoint:'APP_SIGNUP', 
                            service: iam_decode(req.query.iam).get('service'), 
                            ...BFF_common(req, res)
                            };
    service.BFF(bff_parameters);
};
/**
 * Backend for frontend (BFF) APP_ACCESS
 * 
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
 const BFF_app_access = (req, res) =>{
    /**@type{Types.bff_parameters} */
    const bff_parameters = {endpoint:'APP_ACCESS', 
                            service: iam_decode(req.query.iam).get('service'), 
                            ...BFF_common(req, res)
                            };
    service.BFF(bff_parameters);
};
/**
 * Backend for frontend (BFF) ADMIN
 * 
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
 const BFF_admin = (req, res) =>{
    /**@type{Types.bff_parameters} */
    const bff_parameters = {endpoint:'ADMIN', 
                            service: iam_decode(req.query.iam).get('service'), 
                            ...BFF_common(req, res)
                            };
    service.BFF(bff_parameters);
};
/**
 * Backend for frontend (BFF) SUPERADMIN
 * 
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
 const BFF_superadmin = (req, res) =>{
    /**@type{Types.bff_parameters} */
    const bff_parameters = {endpoint:'SUPERADMIN', 
                            service: iam_decode(req.query.iam).get('service'), 
                            ...BFF_common(req, res)
                            };
    service.BFF(bff_parameters);
};

/**
 * Backend for frontend (BFF) SYSTEMADMIN
 * 
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
 const BFF_systemadmin = (req, res) =>{
    /**@type{Types.bff_parameters} */
    const bff_parameters = {endpoint:'SYSTEMADMIN', 
                            service: iam_decode(req.query.iam).get('service'), 
                            ...BFF_common(req, res)
                            };
    service.BFF(bff_parameters);
};

/**
 * Backend for frontend (BFF) socket
 * 
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
const BFF_socket = (req, res) =>{
    /**@type{Types.bff_parameters} */
    const bff_parameters = {endpoint:'SOCKET', 
                            service: iam_decode(req.query.iam).get('service'), 
                            ...BFF_common(req, res)
                            };
    service.BFF(bff_parameters);
};
/**
 * Backend for frontend (BFF) IAM
 * 
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
const BFF_iam = (req, res) =>{
    /**@type{Types.bff_parameters} */
    const bff_parameters = {endpoint:'IAM', 
                            service: iam_decode(req.query.iam).get('service'), 
                            ...BFF_common(req, res)
                            };
    service.BFF(bff_parameters);
};

export{BFF_init, BFF_start, BFF_app, BFF_app_data, BFF_app_signup, BFF_app_access, BFF_admin, BFF_superadmin, BFF_systemadmin, BFF_socket, BFF_iam};