/** @module server/iam */

// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

const {ConfigGet, ConfigGetApp, ConfigGetUser, CheckFirstTime, CreateSystemAdmin} = await import(`file://${process.cwd()}/server/config.service.js`);
const {default:{sign, verify}} = await import('jsonwebtoken');
/**
 * Middleware authenticates system admin login
 * @param {number} app_id
 * @param {string} authorization
 * @param {Types.res} res 
 */
const AuthenticateSystemadmin =(app_id, authorization, res)=>{
    return new Promise((resolve,reject)=>{
        const check_user = async (/**@type{string}*/username, /**@type{string}*/password) => {
            const { default: {compare} } = await import('bcrypt');
            const config_username = ConfigGetUser('username');
            const config_password = ConfigGetUser('password');
            if (username == config_username && await compare(password, config_password)) {
                const jsontoken_at = AuthorizeToken(app_id, 'SYSTEMADMIN');
                resolve({token_at: jsontoken_at});
            }
            else{
                res.statusMessage = 'unauthorized system admin login attempt for username:' + username;
                res.statusCode =401;
                reject('⛔');
            }            
        };
        if(authorization){       
            const userpass =  Buffer.from((authorization || '').split(' ')[1] || '', 'base64').toString();
            const username = userpass.split(':')[0];
            const password = userpass.split(':')[1];
            if (CheckFirstTime())
                CreateSystemAdmin(username, password, () =>{
                    check_user(username, password);
                });
            else
                check_user(username, password);
        }
        else{
            res.statusCode =401;
            reject('⛔');
        }
    });
};
/**
 * Middleware authenticates system admin access token
 * @param {string} token
 * @param {Types.res} res
 * @param {function} next
 */
 const AuthenticateAccessTokenSystemAdmin = (token, res, next) => {
    if (token){
        token = token.slice(7);
        verify(token, ConfigGet('SERVICE_IAM', 'ADMIN_TOKEN_SECRET'), (/**@type{Types.error}*/err) => {
            if (err)
                res.status(401).send('⛔');
            else
                next();
        });
    }else
        res.status(401).send('⛔');
};
/**
 * Middleware authenticates data token
 * @param {number} app_id
 * @param {string} token
 * @param {Types.res} res
 * @param {function} next
 */
 const AuthenticateDataToken = async (app_id, token, res, next) =>{
    if (token){
        token = token.slice(7);
        verify(token, ConfigGetApp(app_id, 'APP_DATA_SECRET'), (/**@type{Types.error}*/err) => {
            if (err){
                res.status(401).send('⛔');
            } else {
                next();
            }
        });    
    }
    else{
        res.status(401).send('⛔');
    } 
};

/**
 * Middleware authenticates data token registration
 * @param {number} app_id 
 * @param {string} token 
 * @param {Types.res} res 
 * @param {function} next 
 */
const AuthenticateDataTokenRegistration = (app_id, token, res, next) =>{
    if (ConfigGet('SERVICE_IAM', 'ENABLE_USER_REGISTRATION')=='1')
        AuthenticateDataToken(app_id, token, res, next);
    else{
        //return 403 Forbidden
        res.status(403).send('⛔');
    }
};
/**
 * Middleware authenticates data token login
 * @param {number} app_id 
 * @param {string} token 
 * @param {Types.res} res 
 * @param {function} next 
 */
 const AuthenticateDataTokenLogin = (app_id, token, res, next) =>{
    if (ConfigGet('SERVICE_IAM', 'ENABLE_USER_LOGIN')=='1')
        AuthenticateDataToken(app_id, token, res, next);
    else{
        //return 403 Forbidden
        res.status(403).send('⛔');
    }
};

/**
 * Middleware authenticates access token common
 * @param {number} app_id
 * @param {string} authorization
 * @param {string} ip
 * @param {number} user_account_logon_user_account_id
 * @param {Types.res} res
 * @param {function} next
 */
 const AuthenticateAccessTokenCommon = (app_id, authorization, ip, user_account_logon_user_account_id, res, next) => {
    if (authorization){
        const token = authorization.slice(7);
        verify(token, ConfigGetApp(app_id, 'APP_ACCESS_SECRET'), (/**@type{Types.error}*/err) => {
            if (err)
                res.status(401).send('⛔');
            else {
                //check access token belongs to user_account.id, app_id and ip saved when logged in
                //and if app_id=0 then check user is admin
                import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_logon.service.js`).then(({checkLogin}) => {
                    checkLogin(app_id, user_account_logon_user_account_id, authorization.replace('Bearer ',''), ip)
                    .then((/**@type{Types.db_result_user_account_logon_Checklogin[]}*/result)=>{
                        if (result.length==1)
                            next();
                        else
                            res.status(401).send('⛔');
                        })
                    .catch((/**@type{Types.error}*/error)=>{
                        res.status(500).send(
                            error
                        );
                    });
                });
            }
        });
    }
    else
        res.status(401).send('⛔');
};
/**
 * Middleware authenticates access token superadmin
 * @param {number} app_id
 * @param {string} authorization
 * @param {string} ip
 * @param {number} user_account_logon_user_account_id
 * @param {Types.res} res
 * @param {function} next
 */
const AuthenticateAccessTokenSuperAdmin = (app_id, authorization, ip, user_account_logon_user_account_id, res, next) => {
    if (app_id==0)
        import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account.service.js`).then(({getUserAppRoleAdmin}) => {
            getUserAppRoleAdmin(app_id, user_account_logon_user_account_id)
            .then((/**@type{Types.db_result_user_account_getUserRoleAdmin[]}*/result)=>{
                if (result[0].app_role_id == 0){
                    AuthenticateAccessTokenCommon(app_id, authorization, ip, user_account_logon_user_account_id, res, next);
                }
                else
                    res.status(401).send('⛔');
            })
            .catch((/**@type{Types.error}*/error)=>{
                res.status(500).send(
                    error
                );
            });
        });
    else
        res.status(401).send('⛔');
};
/**
 * Middleware authenticates access token admin
 * @param {number} app_id 
 * @param {string} authorization
 * @param {string} ip
 * @param {number} user_account_logon_user_account_id
 * @param {Types.res} res
 * @param {function} next
 */
const AuthenticateAccessTokenAdmin = (app_id, authorization, ip, user_account_logon_user_account_id, res, next) => {
    if (app_id==0){
        AuthenticateAccessTokenCommon(app_id, authorization, ip, user_account_logon_user_account_id, res, next);
    }
    else
        res.status(401).send('⛔');
};
/**
 * Middleware authenticates access token
 * @param {number} app_id 
 * @param {string} authorization
 * @param {string} ip
 * @param {number} user_account_logon_user_account_id
 * @param {Types.res} res
 * @param {function} next
 */
const AuthenticateAccessToken = (app_id, authorization, ip, user_account_logon_user_account_id, res, next)  => {
    //if user login is disabled then check also current logged in user
    //so they can't modify anything anymore with current accesstoken
    if (ConfigGet('SERVICE_IAM', 'ENABLE_USER_LOGIN')=='1'){
        AuthenticateAccessTokenCommon(app_id, authorization, ip, user_account_logon_user_account_id, res, next);
    }
    else
        res.status(401).send('⛔');
};
/**
 * Middleware authenticate socket used for EventSource
 * @param {string} service
 * @param {string} parameters
 * @param {Types.res} res
 * @param {function} next
 */
const AuthenticateSocket = (service, parameters, res, next) =>{
    //check inparameters
    if (service.toUpperCase()=='SOCKET' && 
        Buffer.from(parameters, 'base64').toString('utf-8').startsWith('/socket/connection/connect')){
            next();
        }
    else
        res.status(401).send('⛔');
};
/**
 * Middleware authenticates data token socket
 * @param {number} app_id
 * @param {string} token

 */
 const AuthenticateDataTokenSocket = async (app_id, token) =>{
    if (token){
        token = token.slice(7);
        verify(token, ConfigGetApp(app_id, 'APP_DATA_SECRET'), (/**@type{Types.error}*/err) => {
            if (err){
                return false;
            } else {
                return true;
            }
        });    
    }
    else{
        return false;
    } 
};
/**
 * Middleware authenticate IAM
 * @param {string} service
 * @param {string} authorization
 * @param {Types.res} res
 * @param {function} next
 */
 const AuthenticateIAM = (service, authorization, res, next) =>{
    //check inparameters
    if (service.toUpperCase()=='IAM' && authorization.toUpperCase().startsWith('BASIC'))
        next();
    else
        res.status(401).send('⛔');
};

/**
 * Authorize request
 * Controls if AUTHENTICATE_REQUEST_ENABLE=1 else skips all checks
 *  if ip is blocked return 403
 *  if AUTHENTICATE_REQUEST_HOST_EXIST=1 then check if host exists else return 406
 *  if AUTHENTICATE_REQUEST_ACCESS_FROM=1 then check if request accessed from domain and not from os hostname else return 406
 *  if user agent is in safe list then return ok else continue checks:
 *  if AUTHENTICATE_REQUEST_USER_AGENT_EXIST=1 then check if user agent exists else return 406
 *  if AUTHENTICATE_REQUEST_ACCEPT_LANGUAGE=1 then check if accept language exists else return 406
 *  if decodeURIComponent() no error then return null else return 400
 * @param {string} ip
 * @param {string} host
 * @param {string} user_agent
 * @param {string} accept_language
 * @param {string} path
 */
 const AuthenticateRequest = (ip, host, user_agent, accept_language, path) => {
    /**
     * IP to number
     * @param {string} ip
     * @returns {number}
     */
    const IPtoNum = (ip) => {
        return Number(
            ip.split('.')
            .map(d => ('000'+d).substr(-3) )
            .join('')
        );
    };
    /**
     * Controls if ip is blocked
     *  if ip is blocked return 403
     * @param {string} ip_v4
     * @returns {Promise.<Types.authenticate_request|null>}
     */
    const block_ip_control = async (ip_v4) => {
        if (ConfigGet('SERVICE_IAM', 'AUTHENTICATE_REQUEST_IP') == '1'){
            const {ConfigGetSaved} = await import(`file://${process.cwd()}/server/config.service.js`);
            const ranges = ConfigGetSaved('IAM_BLOCKIP');
            //check if IP is blocked
            if ((ip_v4.match(/\./g)||[]).length==3){
                for (const element of ranges) {
                    if (IPtoNum(element[0]) <= IPtoNum(ip_v4) &&
                        IPtoNum(element[1]) >= IPtoNum(ip_v4)) {
                            //403 Forbidden
                            return {    statusCode: 403,
                                        statusMessage: `${IPtoNum(element[0])}-${IPtoNum(element[1])}`};
                    }
                }
            }
            return null;
        }
        else
            return null;
    };
    /**
     * Controls if user agent is safe
     * @param {string} client_user_agent
     * @returns {Promise.<boolean>}
     */
    const safe_user_agents = async (client_user_agent) => {
        if (ConfigGet('SERVICE_IAM', 'AUTHENTICATE_REQUEST_USER_AGENT') == '1'){
            const {ConfigGetSaved} = await import(`file://${process.cwd()}/server/config.service.js`);
            const {user_agents} = ConfigGetSaved('IAM_USERAGENT');
            for (const user_agent of user_agents){
                if (user_agent.user_agent == client_user_agent)
                    return true;
            }
            return false;
        }
        else
            return false;
    };
    return new Promise((resolve)=>{
        if (ConfigGet('SERVICE_IAM', 'AUTHENTICATE_REQUEST_ENABLE')=='1'){
            const ip_v4 = ip.replace('::ffff:','');
            block_ip_control(ip_v4).then((/**@type{Types.authenticate_request}*/result_range)=>{
                if (result_range){
                    resolve({   statusCode:result_range.statusCode,
                                statusMessage: `ip ${ip_v4} blocked, range: ${result_range.statusMessage}`});
                }
                else{
                    //check if host exists
                    if (ConfigGet('SERVICE_IAM', 'AUTHENTICATE_REQUEST_HOST_EXIST')=='1' &&
                        typeof host=='undefined'){
                        //406 Not Acceptable
                        resolve({   statusCode: 406, 
                                    statusMessage: `ip ${ip_v4} blocked, no host`});
                    }
                    else{
                        //check if accessed from domain and not os hostname
                        import('node:os').then(({hostname}) =>{
                            if (ConfigGet('SERVICE_IAM', 'AUTHENTICATE_REQUEST_ACCESS_FROM')=='1' &&
                                host==hostname()){
                                //406 Not Acceptable
                                resolve({   statusCode: 406, 
                                            statusMessage: `ip ${ip_v4} blocked, accessed from hostname ${host} not domain`});
                            }
                            else{
                                safe_user_agents(user_agent).then((/**@type{boolean}*/safe)=>{
                                    if (safe==true)
                                        resolve(null);
                                    else{
                                        //check if user-agent exists
                                        if(ConfigGet('SERVICE_IAM', 'AUTHENTICATE_REQUEST_USER_AGENT_EXIST')==1 &&
                                            typeof user_agent=='undefined'){
                                            //406 Not Acceptable
                                            resolve({   statusCode: 406, 
                                                        statusMessage: `ip ${ip_v4} blocked, no user-agent`});
                                        }
                                        else{
                                            //check if accept-language exists
                                            if (ConfigGet('SERVICE_IAM', 'AUTHENTICATE_REQUEST_ACCEPT_LANGUAGE')=='1' &&
                                                typeof accept_language=='undefined'){
                                                //406 Not Acceptable
                                                resolve({   statusCode: 406, 
                                                            statusMessage: `ip ${ip_v4} blocked, no accept-language`});
                                            }
                                            else{
                                                //check request
                                                let err = null;
                                                try {
                                                    decodeURIComponent(path);
                                                }
                                                catch(e) {
                                                    err = e;
                                                }
                                                if (err){
                                                    resolve({   statusCode: 400, 
                                                                statusMessage: 'decodeURIComponent error'});
                                                }
                                                else
                                                    resolve(null);
                                                
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
        else
            resolve(null);
    });
    
};

/**
 * 
 * @param {number} app_id 
 * @param {string} authorization 
 * @returns {Promise.<boolean>}
 */
 const AuthenticateApp = async (app_id, authorization) =>{
    const {file_get} = await import(`file://${process.cwd()}/server/db/file.service.js`);
    const file = await file_get('APPS');
    const CLIENT_ID = file.file_content.APPS.filter((/**@type{Types.config_apps_record}*/row)=>row.APP_ID == app_id)[0].CLIENT_ID;
    const CLIENT_SECRET = file.file_content.APPS.filter((/**@type{Types.config_apps_record}*/row)=>row.APP_ID == app_id)[0].CLIENT_SECRET;

    const userpass = Buffer.from((authorization || '').split(' ')[1] || '', 'base64').toString();
    if (userpass == CLIENT_ID + ':' + CLIENT_SECRET)
        return true;
    else
        return false;
};


/**
 * Authorize token
 * 
 * @param {number} app_id
 * @param {'APP_DATA'|'APP_ACCESS'|'SYSTEMADMIN'} tokentype
 * @returns {string}
 */
 const AuthorizeToken = (app_id, tokentype)=>{
    let secret = '';
    let expiresin = '';
    switch (tokentype){
        case 'APP_DATA':{
            secret = ConfigGetApp(app_id, 'APP_DATA_SECRET');
            expiresin = ConfigGetApp(app_id, 'APP_DATA_EXPIRE');
            break;
        }
        case 'APP_ACCESS':{
            secret = ConfigGetApp(app_id, 'APP_ACCESS_SECRET');
            expiresin = ConfigGetApp(app_id, 'APP_ACCESS_EXPIRE');
            break;
        }
        case 'SYSTEMADMIN':{
            secret = ConfigGet('SERVICE_IAM', 'ADMIN_TOKEN_SECRET');
            expiresin = ConfigGet('SERVICE_IAM', 'ADMIN_TOKEN_EXPIRE_ACCESS');
            break;
        }
    }
    const jsontoken_at = sign ({tokentimstamp: Date.now()}, secret, {expiresIn: expiresin});
    return jsontoken_at;
};

export{ AuthenticateSystemadmin, AuthenticateAccessTokenSystemAdmin, 
        AuthenticateDataToken, AuthenticateDataTokenRegistration, AuthenticateDataTokenLogin,
        AuthenticateAccessToken, AuthenticateAccessTokenSuperAdmin, AuthenticateAccessTokenAdmin,
        AuthenticateSocket,
        AuthenticateDataTokenSocket,
        AuthenticateIAM,
        AuthenticateRequest,
        AuthenticateApp,
        AuthorizeToken}; 