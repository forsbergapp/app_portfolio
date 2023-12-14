/** @module server/express/server */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../types.js';

const {ConfigGet, ConfigGetSaved} = await import(`file://${process.cwd()}/server/config.service.js`);
/**
 * Calculate responsetime
 * @param {Types.res} res
 * @returns {number}
 */
 const responsetime = (res) => {
    const diff = process.hrtime(res.getHeader('X-Response-Time'));
    return diff[0] * 1e3 + diff[1] * 1e-6;
};    

/**
 * Returns parameters for log
 * @param {Types.req} req
 * @returns {Types.req_log_parameters|Types.req|null} 
 */
const req_log = (req) => {  switch (ConfigGet('SERVICE_LOG', 'REQUEST_LEVEL')){
                                //INFO
                                case '1':{
                                    return {host:           req.headers.host,
                                            ip:             req.ip,
                                            protocol:       req.protocol,
                                            httpVersion:    req.httpVersion,
                                            originalUrl:    req.originalUrl,
                                            method:         req.method,
                                            headers:        {   'X-Request-Id':       req.headers['X-Request-Id'],
                                                                'X-Correlation-Id':   req.headers['X-Correlation-Id'],
                                                                'user-agent':         req.headers['user-agent'], 
                                                                'accept-language':    req.headers['accept-language'], 
                                                                referer:              req.headers.referer},
                                            socket:         {   bytesRead:          req.socket.bytesRead,
                                                                bytesWritten:       req.socket.bytesWritten}};
                                }
                                //VERBOSE
                                case '2':{
                                    return req;
                                }
                                //NONE
                                case '0':
                                default:{
                                    return null;
                                }
                            }};

/**
 * server Express Log error
 * @param {Types.express} app
 */
 const serverExpressLogError = (app) =>{
    import(`file://${process.cwd()}/server/log.service.js`).then(({LogRequestE}) => {
        //ERROR LOGGING
        app.use((/**@type{Types.error}*/err,/**@type{Types.req}*/req,/**@type{Types.res}*/res, /**@type{function}*/next) => {
            LogRequestE(req_log(req), res.statusCode, res.statusMessage, responsetime(res), err).then(() => {
                next();
            });
        });    
    });
};
/**
 * server Express Routes
 * @param {Types.express} app
 */
 const serverExpressRoutes = async (app) => {
    //apps
    const { BFF_data, BFF_data_login, BFF_data_signup, BFF_access, BFF_admin, BFF_superadmin, BFF_systemadmin, BFF_socket, BFF_iam} = await import(`file://${process.cwd()}/server/bff.js`);
    
    //auth
    const iam = await import(`file://${process.cwd()}/server/iam.js`);
    
    app.route('/server/bff/data').delete          (iam.AuthenticateDataToken, BFF_data);
    app.route('/server/bff/data').get             (iam.AuthenticateDataToken, BFF_data);
    app.route('/server/bff/data').patch           (iam.AuthenticateDataToken, BFF_data);
    app.route('/server/bff/data').post            (iam.AuthenticateDataToken, BFF_data);
    app.route('/server/bff/data').put             (iam.AuthenticateDataToken, BFF_data);
    app.route('/server/bff/data_login').put       (iam.AuthenticateDataTokenLogin, BFF_data_login);
    app.route('/server/bff/data_signup').post     (iam.AuthenticateDataTokenRegistration, BFF_data_signup);
    app.route('/server/bff/access').delete        (iam.AuthenticateAccessToken, BFF_access);
    app.route('/server/bff/access').get           (iam.AuthenticateAccessToken, BFF_access);
    app.route('/server/bff/access').patch         (iam.AuthenticateAccessToken, BFF_access);
    app.route('/server/bff/access').post          (iam.AuthenticateAccessToken, BFF_access);
    app.route('/server/bff/access').put           (iam.AuthenticateAccessToken, BFF_access);
    app.route('/server/bff/admin').delete         (iam.AuthenticateAccessTokenAdmin, BFF_admin);
    app.route('/server/bff/admin').get            (iam.AuthenticateAccessTokenAdmin, BFF_admin);
    app.route('/server/bff/admin').patch          (iam.AuthenticateAccessTokenAdmin, BFF_admin);
    app.route('/server/bff/admin').post           (iam.AuthenticateAccessTokenAdmin, BFF_admin);
    app.route('/server/bff/admin').put            (iam.AuthenticateAccessTokenAdmin, BFF_admin);
    app.route('/server/bff/superadmin').put       (iam.AuthenticateAccessTokenSuperAdmin, BFF_superadmin);
    app.route('/server/bff/systemadmin').delete   (iam.AuthenticateAccessTokenSystemAdmin, BFF_systemadmin);
    app.route('/server/bff/systemadmin').get      (iam.AuthenticateAccessTokenSystemAdmin, BFF_systemadmin);
    app.route('/server/bff/systemadmin').patch    (iam.AuthenticateAccessTokenSystemAdmin, BFF_systemadmin);
    app.route('/server/bff/systemadmin').post     (iam.AuthenticateAccessTokenSystemAdmin, BFF_systemadmin);
    app.route('/server/bff/systemadmin').put      (iam.AuthenticateAccessTokenSystemAdmin, BFF_systemadmin);    
    app.route('/server/bff/socket').get           (iam.AuthenticateSocket, BFF_socket);
    app.route('/server/bff/iam').post             (iam.AuthenticateIAM, BFF_iam);

};
/**
 * server Express
 * @async
 * @returns {Promise<Types.express>} app
 */
const serverExpress = async () => {
    const {default:express} = await import('express');
    const {CheckFirstTime, ConfigGet} = await import(`file://${process.cwd()}/server/config.service.js`);
    const {default:compression} = await import('compression');
    const {AuthenticateRequest} = await import(`file://${process.cwd()}/server/iam.service.js`);
    const {LogRequestI} = await import(`file://${process.cwd()}/server/log.service.js`);    
    const ContentSecurityPolicy = ConfigGetSaved(4)['content-security-policy'];
    const {randomUUID, createHash} = await import('node:crypto');
    return new Promise((resolve) =>{
        /**@type{Types.express} */
        const app = express();
        //
        //MIDDLEWARES
        //
        //use compression for better performance
        const shouldCompress = (/**@type{Types.req}*/req) => {
            //exclude broadcast messages using socket
            if (req.originalUrl.toUpperCase().startsWith('/SERVER/BFF/SOCKET'))
                return false;
            else
                return true;
            };
        app.set('trust proxy', true);
        /* Ignore compression typescript error:
            Type '(req: Types.req) => boolean' is not assignable to type 'CompressionFilter'.
            Types of parameters 'req' and 'req' are incompatible.
            Type 'Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>' is not assignable to type 'req'.
            Types of property 'params' are incompatible.
            Type 'ParamsDictionary' is missing the following properties from type '{ sub: string; info: string; }': sub, info
        */
        /**@ts-ignore */
        app.use(compression({ filter: shouldCompress }));
        app.use((/**@type{Types.req}*/req, /**@type{Types.res}*/ res, /**@type{function}*/ next) => {
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
                res.setHeader('content-security-policy', ContentSecurityPolicy);
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
            next();
        });
        // set JSON maximum size
        app.use(express.json({ limit: ConfigGet('SERVER', 'JSON_LIMIT') }));
        
        app.use((/**@type{Types.req}*/req, /**@type{Types.res}*/ res, /**@type{function}*/ next) => {
            //access control that stops request if not passing controls
            if (ConfigGet('SERVICE_IAM', 'AUTHENTICATE_REQUEST_ENABLE')=='1'){
                AuthenticateRequest(req.ip, req.headers.host, req.headers['user-agent'], req.headers['accept-language'], req.path)
                .then((/**@type{Types.authenticate_request}*/result)=>{
                    if (result == null){                            
                        next();
                    }
                    else{
                        //update response, will be logged in request log
                        res.statusCode = result.statusCode;
                        res.statusMessage = 'access control: ' + result.statusMessage;
                        res.send('⛔');
                        res.end();
                    }
                })
                .catch((/**@type{Types.error}*/error)=>{
                    //authorize request caused unknown error, continue, will be logged when response closed
                    res.statusCode = 500;
                    res.statusMessage = error;
                    next();
                });
            }
            else
                next();
        });
        
        //logs after response is finished
        app.use((/**@type{Types.req}*/req, /**@type{Types.res}*/ res, /**@type{function}*/ next) => {
            if (req.headers.accept == 'text/event-stream'){
                //Eventsource, log since response is open and log again when closing
                LogRequestI(req_log(req), res.statusCode, res.statusMessage, responsetime(res));
            }
            res.on('close',()=>{
                //eventsource response time will be time connected until disconnected
                LogRequestI(req_log(req), res.statusCode, res.statusMessage, responsetime(res)).then(() => {
                    res.end();
                });
            });
            next();
        });
        //check if SSL verification using letsencrypt should be enabled when validating domains
        if (ConfigGet('SERVER', 'HTTPS_SSL_VERIFICATION')=='1'){
            const ssl_verification_path = ConfigGet('SERVER', 'HTTPS_SSL_VERIFICATION_PATH');
            app.use(ssl_verification_path,express.static(process.cwd() + ssl_verification_path));
            app.use(express.static(process.cwd() + ssl_verification_path, { dotfiles: 'allow' }));
        }
        //
        //ROUTES
        //
        //get before apps code
        //info for search bots
        app.get('/robots.txt',  (/**@type{Types.req}*/req, /**@type{Types.res}*/ res) => {
            res.type('text/plain');
            res.send('User-agent: *\nDisallow: /');
        });
        //browser favorite icon to ignore
        app.get('/favicon.ico', (/**@type{Types.req}*/req, /**@type{Types.res}*/ res) => {
            res.send('');
        });
        //change all requests from http to https and naked domains with prefix https://www. except localhost
        app.get('*', (/**@type{Types.req}*/req, /**@type{Types.res}*/ res, /**@type{function}*/ next) => {
            //if first time, when no system admin exists, then redirect everything to admin
            if (CheckFirstTime() && req.headers.host.startsWith('admin') == false && req.headers.referer==undefined)
                res.redirect(`http://admin.${req.headers.host.lastIndexOf('.')==-1?req.headers.host:req.headers.host.lastIndexOf('.')}`);
            else{
            //redirect naked domain to www except for localhost
            if (((req.headers.host.split('.').length - 1) == 1) &&
                req.headers.host.indexOf('localhost')==-1)
                if (req.protocol=='http' && ConfigGet('SERVER', 'HTTPS_ENABLE')=='1')
                    res.redirect('https://' + 'www.' + req.headers.host + req.originalUrl);
                else
                    res.redirect('http://' + 'www.' + req.headers.host + req.originalUrl);
            else{
                //redirect from http to https if https enabled
                if (req.protocol=='http' && ConfigGet('SERVER', 'HTTPS_ENABLE')=='1')
                    res.redirect('https://' + req.headers.host + req.originalUrl);
                else{
                    next();
                }
            }
            }
        });
        serverExpressRoutes(app).then(() =>{
            resolve(app);
        });
    });
};
export {serverExpressLogError, serverExpressRoutes, serverExpress};