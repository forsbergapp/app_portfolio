/** @module server/iam */

/**@type{import('./server.service.js')} */
const {send_iso_error, getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);
/**@type{import('./config.service.js')} */
const {ConfigGet, ConfigFileGet, ConfigGetApp, ConfigGetAppHost, ConfigGetUser, CheckFirstTime, CreateSystemAdmin} = await import(`file://${process.cwd()}/server/config.service.js`);
/**@type{import('./db/file.service.js')} */
const {file_get, file_get_log, file_append_log} = await import(`file://${process.cwd()}/server/db/file.service.js`);

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
 * @param {number|null}  app_id
 * @param {'APP_ACCESS'|'APP_DATA'|'SYSTEMADMIN'} token_type 
 * @param {string} token 
 * @returns {boolean}
 */
const expired_token = (app_id, token_type, token) =>{
    switch (token_type){
        case 'APP_ACCESS':{
            //exp, iat, tokentimestamp on token
            try {
                /**@ts-ignore*/
                return ((jwt.verify(token, ConfigGetApp(app_id, app_id, 'SECRETS').APP_ACCESS_SECRET).exp ?? 0) * 1000) - Date.now()<0;    
            } catch (error) {
                return true;
            }
            
        }
        case 'SYSTEMADMIN':{
            //exp, iat, tokentimestamp on token
            try {
                /**@ts-ignore*/
                return ((jwt.verify(token, ConfigGet('SERVICE_IAM', 'ADMIN_TOKEN_SECRET')).exp ?? 0) * 1000) - Date.now()<0;    
            } catch (error) {
                return true;
            }
        }
        default:
            return false;
    }
}
/**
 * @param {import('../types.js').res} res
 * @param {number} status
 * @param {string} reason
 * @param {boolean} bff
 * @returns {string|null|void}
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
 * @param {string} iam
 * @param {string} authorization
 * @param {string} ip
 * @param {string} user_agent
 * @param {string} accept_language
 * @param {import('../types.js').res} res 
 * @return {Promise.<{
 *                  username:string,
 *                  token_at:string,
 *                  exp:number,
 *                  iat:number,
 *                  tokentimestamp:number}>}
 */
const AuthenticateSystemadmin = async (app_id, iam, authorization, ip, user_agent, accept_language, res)=>{
    /**@type{import('./socket.service.js')} */
    const {ConnectedUpdate} = await import(`file://${process.cwd()}/server/socket.service.js`);
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
            const jwt_data = AuthorizeToken(app_id, {id:null, name:username, ip:ip, scope:'USER', endpoint:'SYSTEMADMIN'});
            /**@type{import('../types.js').iam_systemadmin_login_record} */
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
                if (result == 1){
                    ConnectedUpdate(app_id, getNumberValue(iam_decode(iam).get('client_id')), null, username, iam_decode(iam).get('authorization_bearer'), null, jwt_data.token, ip, user_agent, accept_language, res)
                    .then(()=>{
                        resolve({   username:username,
                                    token_at: jwt_data.token,
                                    exp:jwt_data.exp,
                                    iat:jwt_data.iat,
                                    tokentimestamp:jwt_data.tokentimestamp});
                                })
                    .catch((/**@type{import('../types.js').error}*/error)=>reject(error));
                }
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
 * Middleware authenticate socket used for EventSource
 * @param {string} path
 * @param {string} host
 * @param {string} iam
 * @param {string} ip
 * @param {import('../types.js').res} res
 * @param {function} next
 */
const AuthenticateSocket = (iam, path, host, ip, res, next) =>{
    if (iam && iam_decode(iam).get('authorization_bearer') && path.startsWith('/server-socket')){
        AuthenticateUserCommon(iam, 'APP_DATA', iam_decode(iam).get('authorization_bearer')??'', host, ip, res, next);
    }
    else
        not_authorized(res, 401, 'AuthenticateSocket');
};
/**
 * Middleware authenticate IAM users
 * @param {string} iam
 * @param {'AUTH_SYSTEMADMIN'|'AUTH_ADMIN'|'AUTH_USER'|'AUTH_PROVIDER'|'APP_SYSTEMADMIN'|'APP_ACCESS'|'APP_ACCESS_ADMIN'|'APP_ACCESS_SUPERADMIN'|'APP_DATA'|'APP_DATA_REGISTRATION'} scope
 * @param {string} authorization
 * @param {string} host
 * @param {string} ip
 * @param {import('../types.js').res} res
 * @param {function} next
 */
 const AuthenticateUserCommon = async (iam, scope, authorization, host, ip, res, next) =>{
    const app_id_host = getNumberValue(ConfigGetAppHost(host));
    //iam required for SOCKET update using iam.client_id that can be changed any moment and not validated here
    if (iam && scope && authorization && app_id_host !=null){
        const app_id_admin = getNumberValue(ConfigGet('SERVER','APP_COMMON_APP_ID'));
        // APP_DATA uses req.headers.authorization ID token except for SOCKET where ID token is in iam.authorization_bearer
        // other requests uses BASIC or BEARER access token in req.headers.authorization and ID token in iam.authorization_bearer
        const id_token = scope=='APP_DATA'?authorization?.split(' ')[1] ?? '':iam_decode(iam).get('authorization_bearer')?.split(' ')[1] ?? '';
        try {
            //authenticate id token
            /**@type{{app_id:number, ip:string, scope:string, exp:number, iat:number, tokentimestamp:number}|*} */
            const id_token_decoded = jwt.verify(id_token, ConfigGetApp(app_id_host, app_id_host, 'SECRETS').APP_ID_SECRET);
            /**@type{import('../types.js').iam_app_token_record[]}*/
            const log_id_token = await file_get_log('IAM_APP_TOKEN', 'YYYYMMDD');
            if (id_token_decoded.app_id == app_id_host && 
                id_token_decoded.scope == 'APP' && 
                id_token_decoded.ip == ip &&
                log_id_token.filter((/**@type{import('../types.js').iam_app_token_record}*/row)=> 
                                    row.app_id == app_id_host && row.client_ip == ip && row.app_token == id_token).length==1){
                if (scope=='APP_DATA')
                    next();
                else{
                    /**
                     * 
                     * @param {number|null} user_id 
                     * @returns {Promise.<boolean>}
                     */
                    const superadmin = async (user_id) => {
                        if (user_id){
                            /**@type{import('./db/sql/user_account.service.js')} */
                            const {getUserAppRoleAdmin} = await import(`file://${process.cwd()}/server/db/sql/user_account.service.js`)
                            /**@type{import('../types.js').db_result_user_account_getUserAppRoleAdmin[]}*/
                            const result = await getUserAppRoleAdmin(app_id_host, user_id)
                                                    .catch((/**@type{import('../types.js').error}*/error)=>{
                                                        not_authorized(res, 500, error);
                                                        return [];
                                                    });
                            return result[0].app_role_id == 0;
                        }
                        else
                            return false;
                    }
                    //validate scope, app_id and authorization
                    switch (true){
                        case (scope=='AUTH_SYSTEMADMIN' || scope=='AUTH_ADMIN') && app_id_host== app_id_admin && authorization.toUpperCase().startsWith('BASIC'):{
                            next();
                            break;
                        }
                        case (scope=='AUTH_USER' || scope=='AUTH_PROVIDER') && app_id_host!= app_id_admin && authorization.toUpperCase().startsWith('BASIC'):{
                            if (getNumberValue(ConfigGet('SERVICE_IAM', 'ENABLE_USER_LOGIN'))==1){
                                next();
                            }
                            else
                                not_authorized(res, 403, 'AuthenticateUserCommon, user login disabled');
                            break;
                        }
                        case scope=='APP_SYSTEMADMIN' && app_id_host== app_id_admin && authorization.toUpperCase().startsWith('BEARER'):{
                            //authenticate access token
                            const access_token = authorization?.split(' ')[1] ?? '';
                            /**@type{{app_id:number, id:number, name:string, ip:string, scope:string, exp:number, iat:number, tokentimestamp:number}|*} */
                            const access_token_decoded = jwt.verify(access_token, ConfigGet('SERVICE_IAM', 'ADMIN_TOKEN_SECRET') ?? '');
                            /**@type{import('../types.js').iam_systemadmin_login_record[]}*/
                            const log_access_token = await file_get_log('IAM_SYSTEMADMIN_LOGIN', 'YYYYMMDD');

                            if (access_token_decoded.app_id == app_id_host && 
                                access_token_decoded.scope == 'USER' && 
                                access_token_decoded.ip == ip &&
                                access_token_decoded.name == iam_decode(iam).get('system_admin') &&
                                log_access_token.filter((/**@type{import('../types.js').iam_systemadmin_login_record}*/row)=>
                                    row.app_id == app_id_host && 
                                    row.username == access_token_decoded.name && 
                                    row.client_ip == ip && 
                                    row.systemadmin_token == access_token).length==1)
                                next();
                            else
                                not_authorized(res, 401, 'AuthenticateUserCommon');
                            break;
                        }
                        case scope=='APP_DATA_REGISTRATION' && getNumberValue(ConfigGet('SERVICE_IAM', 'ENABLE_USER_REGISTRATION'))==1 && app_id_host!= app_id_admin && authorization.toUpperCase().startsWith('BEARER'):{
                            next();
                            break;
                        }
                        
                        case scope=='APP_ACCESS_SUPERADMIN' && app_id_host== app_id_admin && authorization.toUpperCase().startsWith('BEARER'):
                        case scope=='APP_ACCESS_ADMIN' && app_id_host== app_id_admin && authorization.toUpperCase().startsWith('BEARER'):
                        case scope=='APP_ACCESS' && getNumberValue(ConfigGet('SERVICE_IAM', 'ENABLE_USER_LOGIN'))==1 && authorization.toUpperCase().startsWith('BEARER'):{
                            //authenticate access token
                            const access_token = authorization?.split(' ')[1] ?? '';
                            /**@type{{app_id:number, id:number, name:string, ip:string, scope:string, exp:number, iat:number, tokentimestamp:number}|*} */
                            const access_token_decoded = jwt.verify(access_token, ConfigGetApp(app_id_host, app_id_host, 'SECRETS').APP_ACCESS_SECRET ?? '');
                            const user_id = getNumberValue(iam_decode(iam).get('user_id'));
                            if (access_token_decoded.app_id == app_id_host && 
                                access_token_decoded.scope == 'USER' && 
                                access_token_decoded.ip == ip &&
                                access_token_decoded.id == user_id &&
                                ((scope=='APP_ACCESS_SUPERADMIN' && superadmin(user_id))|| scope!='APP_ACCESS_SUPERADMIN'))
                                //check access token belongs to user_account.id, app_id and ip saved when logged in
                                //and if app_id=0 then check user is admin
                                import(`file://${process.cwd()}/server/db/sql/user_account_logon.service.js`)
                                .then((/**@type{import('./db/sql/user_account_logon.service.js')} */{checkLogin}) => {
                                    checkLogin(app_id_host, user_id)
                                    .then((/**@type{import('../types.js').db_result_user_account_logon_Checklogin[]}*/result)=>{
                                        if (result.filter(row=>
                                            JSON.parse(row.json_data).result==1 && 
                                            JSON.parse(row.json_data).access_token == access_token && 
                                            JSON.parse(row.json_data).client_ip == ip).length==1)
                                            next();
                                        else
                                            not_authorized(res, 401, 'AuthenticateUserCommon, no record APP_ACCESS');
                                    })
                                    .catch((/**@type{import('../types.js').error}*/error)=>{
                                        res.status(500).send(
                                            error
                                        );
                                    });
                                })
                            else
                                not_authorized(res, 401, 'AuthenticateUserCommon, token claim error');
                            break;
                        }
                        default:{
                            not_authorized(res, 401, 'AuthenticateUserCommon, scope error or wrong app or wrong header authorization');
                            break;
                        }
                    }
                }
            }
            else
                not_authorized(res, 401, 'AuthenticateUserCommon, not IAM or no authorization');
        } catch (error) {
            not_authorized(res, 401, 'AuthenticateUserCommon, token error');
        }
    }
    else
        not_authorized(res, 401, 'AuthenticateUserCommon, not IAM or no authorization');
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
     * @returns {Promise.<import('../types.js').authenticate_request|null>}
     */
    const block_ip_control = async (ip_v4) => {
        if (ConfigGet('SERVICE_IAM', 'AUTHENTICATE_REQUEST_IP') == '1'){
            const ranges = await ConfigFileGet('IAM_BLOCKIP');
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
            const {user_agents} = await ConfigFileGet('IAM_USERAGENT');
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
            block_ip_control(ip_v4).then((/**@type{import('../types.js').authenticate_request}*/result_range)=>{
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
                                        if(ConfigGet('SERVICE_IAM', 'AUTHENTICATE_REQUEST_USER_AGENT_EXIST')=='1' &&
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
    const file = await file_get('APPS');
    if (app_id != null){
        const CLIENT_ID = file.file_content.APPS.filter((/**@type{import('../types.js').config_apps_record}*/row)=>row.APP_ID == app_id)[0].SECRETS.CLIENT_ID;
        const CLIENT_SECRET = file.file_content.APPS.filter((/**@type{import('../types.js').config_apps_record}*/row)=>row.APP_ID == app_id)[0].SECRETS.CLIENT_SECRET;
        const userpass = Buffer.from((authorization || '').split(' ')[1] || '', 'base64').toString();
        if (userpass == CLIENT_ID + ':' + CLIENT_SECRET)
            return true;
        else
            return false;
    }
    else
        return false;
    
};

/**
 * Authenticate resource
 * @param { {iam:string,
 *           resource_id:number|null,
 *           resource_type:string}} parameters
 */
const AuthenticateResource = parameters =>  parameters.resource_id && 
                                            getNumberValue(iam_decode(parameters.iam).get(parameters.resource_type)) == parameters.resource_id;
                                            
/**
 * Authorize token app
 * 
 * @param {number} app_id
 * @param {string|null} ip
 * @returns {Promise.<string>}
 */
 const AuthorizeTokenApp = async (app_id, ip)=>{
    const secret = ConfigGetApp(app_id, app_id, 'SECRETS').APP_ID_SECRET;
    const expiresin = ConfigGetApp(app_id, app_id, 'SECRETS').APP_ID_EXPIRE;
    const jsontoken_at = jwt.sign ({scope:'APP',
                                    app_id:app_id,
                                    ip:ip,
                                    tokentimestamp: Date.now()}, secret, {expiresIn: expiresin});
    /**@type{import('../types.js').iam_app_token_record} */
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
 * @param {{id:number|null, 
 *          name:string, 
 *          ip:string, 
 *          scope:'USER', 
 *          endpoint:'APP_ACCESS'|'SYSTEMADMIN'}} claim
 * @returns {{
 *              token:string, 
 *              exp:number,             //expires at
 *              iat:number,             //issued at
 *              tokentimestamp:number}}
 */
 const AuthorizeToken = (app_id, claim)=>{
    let secret = '';
    let expiresin = '';
    switch (claim.endpoint){
        case 'APP_ACCESS':{
            secret = ConfigGetApp(app_id, app_id, 'SECRETS').APP_ACCESS_SECRET;
            expiresin = ConfigGetApp(app_id, app_id, 'SECRETS').APP_ACCESS_EXPIRE;
            break;
        }
        case 'SYSTEMADMIN':{
            secret = ConfigGet('SERVICE_IAM', 'ADMIN_TOKEN_SECRET') ?? '';
            expiresin = ConfigGet('SERVICE_IAM', 'ADMIN_TOKEN_EXPIRE_ACCESS') ?? '';
            break;
        }
    }
    const token = jwt.sign ({   app_id:         app_id,
                                id:             claim.id,
                                name:           claim.name,
                                ip:             claim.ip,
                                scope:          claim.scope,
                                tokentimestamp: Date.now()}, secret, {expiresIn: expiresin});
    return {token:token,
            /**@ts-ignore */
            exp:jwt.decode(token, { complete: true }).payload.exp,
            /**@ts-ignore */
            iat:jwt.decode(token, { complete: true }).payload.iat,
            /**@ts-ignore */
            tokentimestamp:jwt.decode(token, { complete: true }).payload.tokentimestamp};
};

export{ iam_decode,
        expired_token,
        not_authorized,
        AuthenticateSystemadmin,
        AuthenticateSocket,
        AuthenticateUserCommon,
        AuthenticateRequest,
        AuthenticateApp,
        AuthenticateResource,
        AuthorizeTokenApp,
        AuthorizeToken}; 