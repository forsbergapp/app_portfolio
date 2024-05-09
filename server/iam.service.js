/** @module server/iam */

// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

const {ConfigGet, ConfigGetApp, ConfigGetUser, CheckFirstTime, CreateSystemAdmin} = await import(`file://${process.cwd()}/server/config.service.js`);
const {file_get_log, file_append_log} = await import(`file://${process.cwd()}/server/db/file.service.js`);
const {send_iso_error, getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);
const {default:jwt} = await import('jsonwebtoken');
/**
 * 
 * @param {string} query 
 * @returns {URLSearchParams}
 */
 const iam_decode = query =>{
    return new URLSearchParams(atob(query))
}
/**
 * @param {Types.res} res
 * @param {number} status
 * @param {string} reason
 * @param {boolean} bff
 * @returns {string|null}
 */
 const not_authorized = (res, status, reason, bff=false) => {
    if (bff){
        res.statusCode = status;
        res.statusMessage = reason;
        return '⛔'
    }
    else
        return send_iso_error(res, status, null, '⛔', null, reason);
};

/**
 * Middleware authenticates system admin login
 * @param {number} app_id
 * @param {string} authorization
 * @param {string} ip
 * @param {Types.res} res 
 * @return {Promise.<{
 *                  username:string,
 *                  token_at:string,
 *                  exp:number,
 *                  iat:number,
 *                  tokentimestamp:number}>}
 */
const AuthenticateSystemadmin = async (app_id, authorization, ip,res)=>{
    return new Promise((resolve, reject)=>{
        const check_user = async (/**@type{string}*/username, /**@type{string}*/password) => {
            const { default: {compare} } = await import('bcrypt');
            const config_username = ConfigGetUser('username');
            const config_password = ConfigGetUser('password');
            let result = 0;
            if (username == config_username && await compare(password, config_password) && app_id == getNumberValue(ConfigGet('SERVER','APP_COMMON_APP_ID')))
                result = 1;
            else
                result = 0;
            const jwt_data = AuthorizeToken(app_id, 'SYSTEMADMIN');
            /**@type{Types.iam_systemadmin_login_record} */
            const file_content = {	app_id:             app_id,
                                    username:		    username,
                                    result:				1,
                                    systemadmin_token:  jwt_data.token,
                                    client_ip:          ip,
                                    client_user_agent:  null,
                                    client_longitude:   null,
                                    client_latitude:    null,
                                    date_created:       new Date().toISOString()};
            await file_append_log('IAM_SYSTEMADMIN_LOGIN', file_content, 'YYYYMMDD')
            .then(()=>{
                if (result == 1)
                    resolve({   username:username,
                                token_at: jwt_data.token,
                                exp:jwt_data.exp,
                                iat:jwt_data.iat,
                                tokentimestamp:jwt_data.tokentimestamp});
                else
                    reject (not_authorized(res, 401, 'AuthenticateSystemadmin, file_append_log', true));
            });
        };
        if(authorization){       
            const userpass =  Buffer.from((authorization || '').split(' ')[1] || '', 'base64').toString();
            const username = userpass.split(':')[0];
            const password = userpass.split(':')[1];
            if (CheckFirstTime())
                CreateSystemAdmin(username, password)
                .then(()=>check_user(username, password));
            else
                check_user(username, password);
        }
        else{
            reject (not_authorized(res, 401, 'AuthenticateSystemadmin, authorization', true));
        }
    });
    
};
/**
 * Middleware authenticates system admin access token
 * @param {string} iam
 * @param {string} ip
 * @param {string} token
 * @param {Types.res} res
 * @param {function} next
 */
 const AuthenticateAccessTokenSystemAdmin = (iam, token, ip, res, next) => {
    AuthenticateTokenCommon(getNumberValue(iam_decode(iam).get('app_id')), 'SYSTEMADMIN', token, ip, iam_decode(iam).get('system_admin'), null, res, next);
};
/**
 * Middleware authenticates data token
 * @param {string} iam
 * @param {string} token
 * @param {string} ip
 * @param {Types.res} res
 * @param {function} next
 */
 const AuthenticateDataToken = async (iam, token, ip, res, next) =>{
    AuthenticateTokenCommon(getNumberValue(iam_decode(iam).get('app_id')), 'APP_DATA', token, ip, null, null, res, next);
};

/**
 * Middleware authenticates data token registration
 * @param {string} iam
 * @param {string} token 
 * @param {string} ip 
 * @param {Types.res} res 
 * @param {function} next 
 */
const AuthenticateDataTokenRegistration = (iam, token, ip, res, next) =>{
    if (ConfigGet('SERVICE_IAM', 'ENABLE_USER_REGISTRATION')=='1')
        AuthenticateTokenCommon(getNumberValue(iam_decode(iam).get('app_id')), 'APP_DATA', token, ip, null, null, res, next);
    else
        not_authorized(res, 403, 'AuthenticateDataTokenRegistration');
};
/**
 * Middleware authenticates access token common
 * 
 * APP_ACCESS   : token is valid for giver user account id and ip
 * APP_DATA     : token is valid for given app id and ip
 * SYSTEM_ADMIN : token is valid for admin app, given system admin username and ip
 * 
 * @param {number} app_id
 * @param {'APP_ACCESS'|'APP_DATA'|'SYSTEMADMIN'} token_type
 * @param {string} authorization
 * @param {string} ip
 * @param {string|null} system_admin
 * @param {number|null} user_account_logon_user_account_id
 * @param {Types.res} res
 * @param {function} next
 */
 const AuthenticateTokenCommon = (app_id, token_type, authorization, ip, system_admin, user_account_logon_user_account_id, res, next) => {
    if (authorization){
        const token = authorization.substring(authorization.lastIndexOf(' ')+1);
        switch (token_type){
            case 'APP_ACCESS':{
                jwt.verify(token, ConfigGetApp(app_id, app_id, 'SECRETS').APP_ACCESS_SECRET, (/**@type{Types.error}*/err) => {
                    if (err)
                        not_authorized(res, 401, 'AuthenticateTokenCommon, jwt APP_ACCESS');
                    else {
                        //check access token belongs to user_account.id, app_id and ip saved when logged in
                        //and if app_id=0 then check user is admin
                        import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_logon.service.js`).then(({checkLogin}) => {
                            checkLogin(app_id, user_account_logon_user_account_id, authorization.replace('Bearer ',''), ip)
                            .then((/**@type{Types.db_result_user_account_logon_Checklogin[]}*/result)=>{
                                if (result.filter(row=>
                                    JSON.parse(row.json_data).result==1 && 
                                    JSON.parse(row.json_data).access_token == token && 
                                    JSON.parse(row.json_data).client_ip == ip).length==1)
                                    next();
                                else
                                    not_authorized(res, 401, 'AuthenticateTokenCommon, no record APP_ACCESS');
                            })
                            .catch((/**@type{Types.error}*/error)=>{
                                res.status(500).send(
                                    error
                                );
                            });
                        });
                    }
                });
                break;
            }
            case 'APP_DATA':{
				jwt.verify(token, ConfigGetApp(app_id, app_id, 'SECRETS').APP_DATA_SECRET, (/**@type{Types.error}*/err) => {
                    if (err)
                        not_authorized(res, 401, 'AuthenticateTokenCommon, jwt APP_DATA');
                    else{
                        file_get_log('IAM_APP_TOKEN', 'YYYYMMDD')
                        .then((/**@type{Types.iam_app_token_record[]}*/file)=>{
                            if (file.filter((/**@type{Types.iam_app_token_record}*/row)=> 
                                    row.app_id == app_id
                                    &&
                                    row.client_ip == ip
                                    &&
                                    row.app_token == token).length==1)
                                next();
                            else
                                not_authorized(res, 401, 'AuthenticateTokenCommon, no record APP_DATA');
                        });
                    }
                });
                break;
            }
            case 'SYSTEMADMIN':{
                jwt.verify(token, ConfigGet('SERVICE_IAM', 'ADMIN_TOKEN_SECRET'), (/**@type{Types.error}*/err) => {
                    if (err)
                        not_authorized(res, 401, 'AuthenticateTokenCommon, jwt SYSTEM_ADMIN');
                    else{
                        file_get_log('IAM_SYSTEMADMIN_LOGIN', 'YYYYMMDD')
                        .then((/**@type{Types.iam_systemadmin_login_record[]}*/file)=>{
                            if (file.filter((/**@type{Types.iam_systemadmin_login_record}*/row)=> 
                                    row.app_id == getNumberValue(ConfigGet('SERVER','APP_COMMON_APP_ID'))
                                    &&
                                    row.username == system_admin
                                    &&
                                    row.client_ip == ip
                                    &&
                                    row.systemadmin_token == token).length==1)
                                next();
                            else
                                not_authorized(res, 401, 'AuthenticateTokenCommon, no record SYSTEM_ADMIN');
                        });
                    }
                });
                break;
            }
            default:{
                not_authorized(res, 401, 'AuthenticateTokenCommon, unknown token type:' + token_type);
            }
        }
    }
    else
        not_authorized(res, 401, 'AuthenticateTokenCommon, no authorization header');
};
/**
 * Middleware authenticates access token superadmin
 * @param {string} iam
 * @param {string} authorization
 * @param {string} ip
 * @param {Types.res} res
 * @param {function} next
 */
const AuthenticateAccessTokenSuperAdmin = (iam, authorization, ip, res, next) => {
    if (getNumberValue(iam_decode(iam).get('app_id'))==0)
        import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account.service.js`).then(({getUserAppRoleAdmin}) => {
            getUserAppRoleAdmin(getNumberValue(iam_decode(iam).get('app_id')), getNumberValue(iam_decode(iam).get('user_account_logon_user_account_id')))
            .then((/**@type{Types.db_result_user_account_getUserRoleAdmin[]}*/result)=>{
                if (result[0].app_role_id == 0){
                    AuthenticateTokenCommon(getNumberValue(iam_decode(iam).get('app_id')), 'APP_ACCESS', authorization, ip, null, getNumberValue(iam_decode(iam).get('user_account_logon_user_account_id')), res, next);
                }
                else
                    not_authorized(res, 401, 'AuthenticateAccessTokenSuperAdmin, not superadmin');
            })
            .catch((/**@type{Types.error}*/error)=>{
                res.status(500).send(
                    error
                );
            });
        });
    else
        not_authorized(res, 401, 'AuthenticateAccessTokenSuperAdmin, not using admin app');
};
/**
 * Middleware authenticates access token admin
 * @param {string} iam
 * @param {string} authorization
 * @param {string} ip
 * @param {Types.res} res
 * @param {function} next
 */
const AuthenticateAccessTokenAdmin = (iam, authorization, ip, res, next) => {
    if (getNumberValue(iam_decode(iam).get('app_id'))==0){
        AuthenticateTokenCommon(getNumberValue(iam_decode(iam).get('app_id')), 'APP_ACCESS', authorization, ip, null, getNumberValue(iam_decode(iam).get('user_account_logon_user_account_id')), res, next);
    }
    else
        not_authorized(res, 401, 'AuthenticateAccessTokenAdmin, not admin app');
};
/**
 * Middleware authenticates access token
 * @param {string} iam
 * @param {string} authorization
 * @param {string} ip
 * @param {Types.res} res
 * @param {function} next
 */
const AuthenticateAccessToken = (iam, authorization, ip, res, next)  => {
    //if user login is disabled then check also current logged in user
    //so they can't modify anything anymore with current accesstoken
    if (ConfigGet('SERVICE_IAM', 'ENABLE_USER_LOGIN')=='1'){
        AuthenticateTokenCommon(getNumberValue(iam_decode(iam).get('app_id')), 'APP_ACCESS', authorization, ip, null, getNumberValue(iam_decode(iam).get('user_account_logon_user_account_id')), res, next);
    }
    else
        not_authorized(res, 401, 'AuthenticateAccessToken, user login disabled');
};
/**
 * Middleware authenticate socket used for EventSource
 * @param {string} path
 * @param {string} iam
 * @param {string} ip
 * @param {Types.res} res
 * @param {function} next
 */
const AuthenticateSocket = (iam, path, ip, res, next) =>{
    if (path.startsWith('/server/socket')){
        //validate Bearer autorization
        AuthenticateTokenCommon(getNumberValue(iam_decode(iam).get('app_id')), 'APP_DATA', iam_decode(iam).get('authorization_bearer')??'', ip, null, null, res, next);
    }
    else
        not_authorized(res, 401, 'AuthenticateSocket');
};
/**
 * Middleware authenticate IAM
 * @param {string} iam
 * @param {string} authorization
 * @param {string} ip
 * @param {Types.res} res
 * @param {function} next
 */
 const AuthenticateIAM = (iam, authorization, ip, res, next) =>{
    //check inparameters and Basic authorization
    if ((iam_decode(iam).get('service')??'').toUpperCase()=='IAM' && authorization.toUpperCase().startsWith('BASIC'))
        if (getNumberValue(iam_decode(iam).get('app_id'))==getNumberValue(ConfigGet('SERVER','APP_COMMON_APP_ID'))){
            //validate Bearer authorization
            AuthenticateTokenCommon(getNumberValue(iam_decode(iam).get('app_id')), 'APP_DATA', iam_decode(iam).get('authorization_bearer')??'', ip, null, null, res, next);
        }
        else
            if (getNumberValue(ConfigGet('SERVICE_IAM', 'ENABLE_USER_LOGIN'))==1){
                //validate Bearer authorization
                AuthenticateTokenCommon(getNumberValue(iam_decode(iam).get('app_id')), 'APP_DATA', iam_decode(iam).get('authorization_bearer')??'', ip, null, null, res, next);
            }
            else
                not_authorized(res, 403, 'AuthenticateIAM, user login disabled');
    else
        not_authorized(res, 401, 'AuthenticateIAM, not IAM or no authorization');
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
 * @param {string} method
 * @param {string} user_agent
 * @param {string} accept_language
 * @param {string} path
 */
 const AuthenticateRequest = (ip, host, method, user_agent, accept_language, path) => {
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
                                                else{
                                                    //check method
                                                    if (['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].filter(allowed=>allowed==method).length==0)
                                                        resolve({   statusCode: 405, 
                                                                    statusMessage: 'method error'});
                                                    else    
                                                        resolve(null);
                                                }
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
    const CLIENT_ID = file.file_content.APPS.filter((/**@type{Types.config_apps_record}*/row)=>row.APP_ID == app_id)[0].SECRETS.CLIENT_ID;
    const CLIENT_SECRET = file.file_content.APPS.filter((/**@type{Types.config_apps_record}*/row)=>row.APP_ID == app_id)[0].SECRETS.CLIENT_SECRET;

    const userpass = Buffer.from((authorization || '').split(' ')[1] || '', 'base64').toString();
    if (userpass == CLIENT_ID + ':' + CLIENT_SECRET)
        return true;
    else
        return false;
};

/**
 * Authorize token app
 * 
 * @param {number} app_id
 * @param {string|null} ip
 * @returns {Promise.<string>}
 */
 const AuthorizeTokenApp = async (app_id, ip)=>{
    const secret = ConfigGetApp(app_id, app_id, 'SECRETS').APP_DATA_SECRET;
    const expiresin = ConfigGetApp(app_id, app_id, 'SECRETS').APP_DATA_EXPIRE;
    const jsontoken_at = jwt.sign ({tokentimestamp: Date.now()}, secret, {expiresIn: expiresin});
    /**@type{Types.iam_app_token_record} */
    const file_content = {	app_id:             app_id,
                            result:				1,
                            app_token:   	    jsontoken_at,
                            client_ip:          ip ?? '',
                            client_user_agent:  null,
                            client_longitude:   null,
                            client_latitude:    null,
                            date_created:       new Date().toISOString()};
    return await file_append_log('IAM_APP_TOKEN', file_content, 'YYYYMMDD').then(()=>jsontoken_at);
 };
/**
 * Authorize token
 * 
 * @param {number} app_id
 * @param {'APP_ACCESS'|'SYSTEMADMIN'} tokentype
 * @returns {{
 *              token:string, 
 *              exp:number,             //expires at
 *              iat:number,             //issued at
 *              tokentimestamp:number}}
 */
 const AuthorizeToken = (app_id, tokentype)=>{
    let secret = '';
    let expiresin = '';
    switch (tokentype){
        case 'APP_ACCESS':{
            secret = ConfigGetApp(app_id, app_id, 'SECRETS').APP_ACCESS_SECRET;
            expiresin = ConfigGetApp(app_id, app_id, 'SECRETS').APP_ACCESS_EXPIRE;
            break;
        }
        case 'SYSTEMADMIN':{
            secret = ConfigGet('SERVICE_IAM', 'ADMIN_TOKEN_SECRET');
            expiresin = ConfigGet('SERVICE_IAM', 'ADMIN_TOKEN_EXPIRE_ACCESS');
            break;
        }
    }
    const token = jwt.sign ({tokentimestamp: Date.now()}, secret, {expiresIn: expiresin});
    return {token:token,
            /**@ts-ignore */
            exp:jwt.decode(token, { complete: true }).payload.exp,
            /**@ts-ignore */
            iat:jwt.decode(token, { complete: true }).payload.iat,
            /**@ts-ignore */
            tokentimestamp:jwt.decode(token, { complete: true }).payload.tokentimestamp};
};

export{ iam_decode,
        AuthenticateSystemadmin, AuthenticateAccessTokenSystemAdmin, 
        AuthenticateDataToken, AuthenticateDataTokenRegistration,
        AuthenticateAccessToken, AuthenticateAccessTokenSuperAdmin, AuthenticateAccessTokenAdmin,
        AuthenticateSocket,
        AuthenticateIAM,
        AuthenticateRequest,
        AuthenticateApp,
        AuthorizeTokenApp,
        AuthorizeToken}; 