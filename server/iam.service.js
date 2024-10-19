/** @module server/iam/service */

/**@type{import('./server.js')} */
const {serverResponseErrorSend, serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
/**@type{import('./config.js')} */
const {configGet, configFileGet, configCheckFirstTime, configAdminCreate} = await import(`file://${process.cwd()}/server/config.js`);

/**@type{import('./db/file.js')} */
const {fileFsReadLog, fileFsAppend, fileCache} = await import(`file://${process.cwd()}/server/db/file.js`);

/**@type{import('../apps/common/src/common.js')} */
const {commonAppHost, commonRegistryAppSecret, commonRegistryAppSecretFile}= await import(`file://${process.cwd()}/apps/common/src/common.js`);

const {default:jwt} = await import('jsonwebtoken');

/**
 * 
 * @param {string} query 
 * @returns {URLSearchParams}
 */
 const iamUtilDecode = query =>{
    return new URLSearchParams(atob(query));
};
/**
 * @param {number|null}  app_id
 * @param {'APP_ACCESS'|'APP_DATA'|'ADMIN'} token_type 
 * @param {string} token 
 * @returns {boolean}
 */
const iamUtilTokenExpired = (app_id, token_type, token) =>{
    switch (token_type){
        case 'APP_ACCESS':{
            //exp, iat, tokentimestamp on token
            try {
                /**@ts-ignore*/
                return ((jwt.verify(token, commonRegistryAppSecret(app_id).COMMON_APP_ACCESS_SECRET).exp ?? 0) * 1000) - Date.now()<0;    
            } catch (error) {
                return true;
            }
            
        }
        case 'ADMIN':{
            //exp, iat, tokentimestamp on token
            try {
                /**@ts-ignore*/
                return ((jwt.verify(token, configGet('SERVICE_IAM', 'ADMIN_TOKEN_SECRET')).exp ?? 0) * 1000) - Date.now()<0;    
            } catch (error) {
                return true;
            }
        }
        default:
            return false;
    }
};
/**
 * @param {import('./types.js').server_server_res} res
 * @param {number} status
 * @param {string} reason
 * @param {boolean} bff
 * @returns {string|null|void}
 */
 const iamUtilResponseNotAuthorized = (res, status, reason, bff=false) => {
    if (bff){
        res.statusCode = status;
        res.statusMessage = reason;
        return '⛔';
    }
    else
        return serverResponseErrorSend(res, status, null, '⛔', null, reason);
};

/**
 * Middleware authenticates system admin login
 * @param {number} app_id
 * @param {string} iam
 * @param {string} authorization
 * @param {string} ip
 * @param {string} user_agent
 * @param {string} accept_language
 * @param {import('./types.js').server_server_res} res 
 * @return {Promise.<{
 *                  username:string,
 *                  token_at:string,
 *                  exp:number,
 *                  iat:number,
 *                  tokentimestamp:number}>}
 */
const iamAdminAuthenticate = async (app_id, iam, authorization, ip, user_agent, accept_language, res)=>{
    /**@type{import('./socket.js')} */
    const {socketConnectedUpdate} = await import(`file://${process.cwd()}/server/socket.js`);
    return new Promise((resolve, reject)=>{
        const check_user = async (/**@type{string}*/username, /**@type{string}*/password) => {
            /**@type{import('./security.js')} */
            const {securityPasswordCompare}= await import(`file://${process.cwd()}/server/security.js`);
            /**@type{import('./types.js').server_iam_user_record}*/
            const user =  fileCache('IAM_USER').USER.filter((/**@type{import('./types.js').server_iam_user_record}*/user)=>user.username == username)[0];
            /**@type{0|1} */
            let result = 0;
            if (user && user.username == username && await securityPasswordCompare(password, user.password) && app_id == serverUtilNumberValue(configGet('SERVER','APP_COMMON_APP_ID')))
                result = 1;
            else
                result = 0;
            const jwt_data = iamTokenAuthorize(app_id, 'ADMIN', {id:null, name:username, ip:ip, scope:'USER'});
            /**@type{import('./types.js').server_iam_admin_login_record} */
            const file_content = {	id:         app_id,
                                    user:		username,
                                    res:		result,
                                    token:      jwt_data.token,
                                    ip:         ip,
                                    ua:         null,
                                    long:       null,
                                    lat:        null,
                                    created:    new Date().toISOString()};
            await fileFsAppend('IAM_ADMIN_LOGIN', file_content, '')
            .then(()=>{
                if (result == 1){
                    socketConnectedUpdate(app_id, 
                        {   iam:iam,
                            user_account_id:null,
                            admin:username,
                            token_access:null,
                            token_admin:jwt_data.token,
                            ip:ip,
                            headers_user_agent:user_agent,
                            headers_accept_language:accept_language,
                            res: res})
                    .then(()=>{
                        resolve({   username:username,
                                    token_at: jwt_data.token,
                                    exp:jwt_data.exp,
                                    iat:jwt_data.iat,
                                    tokentimestamp:jwt_data.tokentimestamp});
                                })
                    .catch((/**@type{import('./types.js').server_server_error}*/error)=>reject(error));
                }
                else
                    reject (iamUtilResponseNotAuthorized(res, 401, 'iamAdminAuthenticate, fileFsAppend', true));
            });
        };
        if(authorization){       
            const userpass =  Buffer.from((authorization || '').split(' ')[1] || '', 'base64').toString();
            const username = userpass.split(':')[0];
            const password = userpass.split(':')[1];
            if (configCheckFirstTime())
                configAdminCreate(username, password)
                .then(()=>check_user(username, password));
            else
                check_user(username, password);
        }
        else{
            reject (iamUtilResponseNotAuthorized(res, 401, 'iamAdminAuthenticate, authorization', true));
        }
    });
    
};

/**
 * Middleware authenticate socket used for EventSource
 * @param {string} path
 * @param {string} host
 * @param {string} iam
 * @param {string} ip
 * @param {import('./types.js').server_server_res} res
 * @param {function} next
 */
const iamSocketAuthenticate = (iam, path, host, ip, res, next) =>{
    if (iam && iamUtilDecode(iam).get('authorization_bearer') && path.startsWith('/server-socket')){
        iamUserCommonAuthenticate(iam, 'APP_DATA', iamUtilDecode(iam).get('authorization_bearer')??'', host, ip, res, next);
    }
    else
        iamUtilResponseNotAuthorized(res, 401, 'iamSocketAuthenticate');
};
/**
 * Middleware authenticate IAM users
 * @param {string} iam
 * @param {'AUTH_ADMIN'|'AUTH_USER'|'AUTH_PROVIDER'|'APP_ADMIN'|'APP_ACCESS'|'APP_DATA'|'APP_DATA_REGISTRATION'} scope
 * @param {string} authorization
 * @param {string} host
 * @param {string} ip
 * @param {import('./types.js').server_server_res} res
 * @param {function} next
 */
 const iamUserCommonAuthenticate = async (iam, scope, authorization, host, ip, res, next) =>{
    const app_id_host = serverUtilNumberValue(commonAppHost(host));
    //iam required for SOCKET update using iam.client_id that can be changed any moment and not validated here
    if (iam && scope && authorization && app_id_host !=null){
        const app_id_admin = serverUtilNumberValue(configGet('SERVER','APP_COMMON_APP_ID'));
        // APP_DATA uses req.headers.authorization ID token except for SOCKET where ID token is in iam.authorization_bearer
        // other requests uses BASIC or BEARER access token in req.headers.authorization and ID token in iam.authorization_bearer
        const id_token = scope=='APP_DATA'?authorization?.split(' ')[1] ?? '':iamUtilDecode(iam).get('authorization_bearer')?.split(' ')[1] ?? '';
        try {
            //authenticate id token
            /**@type{{app_id:number, ip:string, scope:string, exp:number, iat:number, tokentimestamp:number}|*} */
            const id_token_decoded = jwt.verify(id_token, commonRegistryAppSecret(app_id_host).COMMON_APP_ID_SECRET);
            /**@type{import('./types.js').server_iam_app_token_record}*/
            const log_id_token = await fileFsReadLog('IAM_APP_TOKEN', '').then(result=>result.filter((/**@type{import('./types.js').server_iam_app_token_record}*/row)=> 
                                                                                row.id == app_id_host && row.ip == ip && row.token == id_token
                                                                                )[0]);
            if (id_token_decoded.app_id == app_id_host && 
                id_token_decoded.scope == 'APP' && 
                id_token_decoded.ip == ip &&
                log_id_token){
                if (scope=='APP_DATA')
                    next();
                else{
                    //validate scope, app_id and authorization
                    switch (true){
                        case (scope=='AUTH_ADMIN') && app_id_host== app_id_admin && authorization.toUpperCase().startsWith('BASIC'):{
                            next();
                            break;
                        }
                        case (scope=='AUTH_USER' || scope=='AUTH_PROVIDER') && app_id_host!= app_id_admin && authorization.toUpperCase().startsWith('BASIC'):{
                            if (serverUtilNumberValue(configGet('SERVICE_IAM', 'ENABLE_USER_LOGIN'))==1){
                                next();
                            }
                            else
                                iamUtilResponseNotAuthorized(res, 403, 'iamUserCommonAuthenticate, user login disabled');
                            break;
                        }
                        case scope=='APP_ADMIN' && app_id_host== app_id_admin && authorization.toUpperCase().startsWith('BEARER'):{
                            //authenticate access token
                            const access_token = authorization?.split(' ')[1] ?? '';
                            /**@type{{app_id:number, id:number, name:string, ip:string, scope:string, exp:number, iat:number, tokentimestamp:number}|*} */
                            const access_token_decoded = jwt.verify(access_token, configGet('SERVICE_IAM', 'ADMIN_TOKEN_SECRET') ?? '');
                            /**@type{import('./types.js').server_iam_admin_login_record[]}*/
                            if (access_token_decoded.app_id == app_id_host && 
                                access_token_decoded.scope == 'USER' && 
                                access_token_decoded.ip == ip &&
                                access_token_decoded.name == iamUtilDecode(iam).get('admin'))
                                await fileFsReadLog('IAM_ADMIN_LOGIN', null,'')
                                .then(result=>{
                                    /**@type{import('./types.js').server_iam_admin_login_record}*/
                                    const iam_admin_login = result.filter((/**@type{import('./types.js').server_iam_admin_login_record}*/row)=>
                                                                            row.id      == app_id_host && 
                                                                            row.user    == access_token_decoded.name && 
                                                                            row.res     == 1 &&
                                                                            row.ip      == ip &&
                                                                            row.token   == access_token
                                                                        )[0];
                                    if (iam_admin_login)
                                        next();
                                    else
                                    iamUtilResponseNotAuthorized(res, 401, 'iamUserCommonAuthenticate');
                                });
                            else
                                iamUtilResponseNotAuthorized(res, 401, 'iamUserCommonAuthenticate');
                            break;
                        }
                        case scope=='APP_DATA_REGISTRATION' && serverUtilNumberValue(configGet('SERVICE_IAM', 'ENABLE_USER_REGISTRATION'))==1 && app_id_host!= app_id_admin && authorization.toUpperCase().startsWith('BEARER'):{
                            next();
                            break;
                        }
                        case scope=='APP_ACCESS' && serverUtilNumberValue(configGet('SERVICE_IAM', 'ENABLE_USER_LOGIN'))==1 && authorization.toUpperCase().startsWith('BEARER'):{
                            //authenticate access token
                            const access_token = authorization?.split(' ')[1] ?? '';
                            /**@type{{app_id:number, id:number, name:string, ip:string, scope:string, exp:number, iat:number, tokentimestamp:number}|*} */
                            const access_token_decoded = jwt.verify(access_token, commonRegistryAppSecret(app_id_host).COMMON_APP_ACCESS_SECRET ?? '');
                            const user_id = serverUtilNumberValue(iamUtilDecode(iam).get('user_id'));
                            if (access_token_decoded.app_id == app_id_host && 
                                access_token_decoded.scope == 'USER' && 
                                access_token_decoded.ip == ip &&
                                access_token_decoded.id == user_id )
                                //check access token belongs to user_account.id, app_id and ip saved when logged in
                                //and if app_id=0 then check user is admin
                                await fileFsReadLog('IAM_USER_LOGIN', null,'')
                                .then(result=>{
                                    /**@type{import('./types.js').server_iam_user_login_record}*/
                                    const iam_user_login = result.filter((/**@type{import('./types.js').server_iam_user_login_record}*/row)=>
                                                                            row.id      == user_id && 
                                                                            row.res     == 1 &&
                                                                            row.app_id  == app_id_host &&
                                                                            row.token   == access_token &&
                                                                            row.ip      == ip
                                                                        )[0];
                                    if (iam_user_login)
                                        next();
                                    else
                                        iamUtilResponseNotAuthorized(res, 401, 'iamUserCommonAuthenticate, no record APP_ACCESS');
                                });
                            else
                                iamUtilResponseNotAuthorized(res, 401, 'iamUserCommonAuthenticate, token claim error');
                            break;
                        }
                        default:{
                            iamUtilResponseNotAuthorized(res, 401, 'iamUserCommonAuthenticate, scope error or wrong app or wrong header authorization');
                            break;
                        }
                    }
                }
            }
            else
                iamUtilResponseNotAuthorized(res, 401, 'iamUserCommonAuthenticate, not IAM or no authorization');
        } catch (error) {
            iamUtilResponseNotAuthorized(res, 401, 'iamUserCommonAuthenticate, token error');
        }
    }
    else
        iamUtilResponseNotAuthorized(res, 401, 'iamUserCommonAuthenticate, not IAM or no authorization');
};

/**
 * 
 * @param {'APP_EXTERNAL'} endpoint 
 * @param {string} host 
 * @param {string} user_agent 
 * @param {string} accept_language 
 * @param {string} ip 
 * @param {*} body
 * @param {import('./types.js').server_server_res} res
 * @param {function} next
 */
const iamExternalAuthenticate = (endpoint, host, user_agent, accept_language, ip, body, res, next) => {
    //add host, user_agent, accept_language and ip validation if needed
    if (endpoint =='APP_EXTERNAL' && ('id' in body) && ('message' in body))
        next();
    else
        iamUtilResponseNotAuthorized(res, 401, 'iamExternalAuthenticate');
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
 const iamRequestAuthenticate = (ip, host, method, user_agent, accept_language, path) => {
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
     * @returns {Promise.<import('./types.js').server_iam_authenticate_request|null>}
     */
    const block_ip_control = async (ip_v4) => {
        if (configGet('SERVICE_IAM', 'AUTHENTICATE_REQUEST_IP') == '1'){
            /**@type{import('./types.js').server_config_iam_blockip} */
            const ranges = await configFileGet('CONFIG_IAM_BLOCKIP');
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
        if (configGet('SERVICE_IAM', 'AUTHENTICATE_REQUEST_USER_AGENT') == '1'){
            /**@type{import('./types.js').server_config_iam_useragent} */
            const {user_agents} = await configFileGet('CONFIG_IAM_USERAGENT');
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
        if (configGet('SERVICE_IAM', 'AUTHENTICATE_REQUEST_ENABLE')=='1'){
            const ip_v4 = ip.replace('::ffff:','');
            block_ip_control(ip_v4).then((/**@type{import('./types.js').server_iam_authenticate_request}*/result_range)=>{
                if (result_range){
                    resolve({   statusCode:result_range.statusCode,
                                statusMessage: `ip ${ip_v4} blocked, range: ${result_range.statusMessage}`});
                }
                else{
                    //check if host exists
                    if (configGet('SERVICE_IAM', 'AUTHENTICATE_REQUEST_HOST_EXIST')=='1' &&
                        typeof host=='undefined'){
                        //406 Not Acceptable
                        resolve({   statusCode: 406, 
                                    statusMessage: `ip ${ip_v4} blocked, no host`});
                    }
                    else{
                        //check if accessed from domain and not os hostname
                        import('node:os').then(({hostname}) =>{
                            if (configGet('SERVICE_IAM', 'AUTHENTICATE_REQUEST_ACCESS_FROM')=='1' &&
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
                                        if(configGet('SERVICE_IAM', 'AUTHENTICATE_REQUEST_USER_AGENT_EXIST')=='1' &&
                                            typeof user_agent=='undefined'){
                                            //406 Not Acceptable
                                            resolve({   statusCode: 406, 
                                                        statusMessage: `ip ${ip_v4} blocked, no user-agent`});
                                        }
                                        else{
                                            //check if accept-language exists
                                            if (configGet('SERVICE_IAM', 'AUTHENTICATE_REQUEST_ACCEPT_LANGUAGE')=='1' &&
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
 * Authenticate app in microservice
 * file must be read from file, not file cache as main server
 * since microservices run in separate processes and servers
 * @param {number|null} app_id 
 * @param {string} authorization 
 * @returns {Promise.<boolean>}
 */
 const iamAppAuthenticate = async (app_id, authorization) =>{
    if (app_id == null)
        return false;
    else{
        const app_secret = await commonRegistryAppSecretFile(app_id);
        const CLIENT_ID = app_secret.COMMON_CLIENT_ID;
        const CLIENT_SECRET = app_secret.COMMON_CLIENT_SECRET;
        const userpass = Buffer.from((authorization || '').split(' ')[1] || '', 'base64').toString();
        if (userpass == CLIENT_ID + ':' + CLIENT_SECRET)
            return true;
        else
            return false;
    }    
};
/**
 * Authenticate resource
 * @param { {app_id:number|null,
 *           ip:string,
 *           authorization:string,
 *           resource_id:string|number|null,
 *           scope: 'USER'|'APP',
 *           claim_key:string}} parameters
 */
const iamResourceAuthenticate = parameters =>  {
    //authenticate access token
    try {
        if (parameters.app_id == null)
            return false;
        else{
            /**@type{{app_id:number, id:number|null, name:string, ip:string, scope:string, exp:number, iat:number, tokentimestamp:number}|*} */
            const access_token_decoded = jwt.verify(parameters.authorization.split(' ')[1], commonRegistryAppSecret(parameters.app_id).COMMON_APP_ACCESS_SECRET);
            return  parameters.resource_id && 
                    access_token_decoded[parameters.claim_key] == parameters.resource_id &&
                    access_token_decoded.app_id == parameters.app_id &&
                    access_token_decoded.scope == parameters.scope &&
                    access_token_decoded.ip == parameters.ip;    
        }
    } catch (error) {
        return false;
    }
};
                                            
/**
 * Authorize token app
 * 
 * @param {number} app_id
 * @param {string|null} ip
 * @returns {Promise.<string>}
 */
 const iamIdTokenAuthorize = async (app_id, ip)=>{
    const jwt_data = iamTokenAuthorize(app_id, 'APP_ID', { id: null, 
                                                        ip:ip ?? '', 
                                                        name:'', 
                                                        scope:'APP'});

    /**@type{import('./types.js').server_iam_app_token_record} */
    const file_content = {	id:         app_id,
                            res:		1,
                            token:   	jwt_data.token,
                            ip:         ip ?? '',
                            ua:         null,
                            long:       null,
                            lat:        null,
                            created:    new Date().toISOString()};
    return await fileFsAppend('IAM_APP_TOKEN', file_content, '').then(()=>jwt_data.token);
 };
/**
 * Authorize token
 * 
 * @param {number} app_id
 * @param {'APP_ID'|'APP_ACCESS'|'ADMIN'|'APP_CUSTOM'} endpoint
 * @param {{id:number|string|null, 
 *          name:string, 
 *          ip:string, 
 *          scope:'USER'|'APP'|'APP_CUSTOM'}} claim
 * @param {string|null} app_custom_expire
 * @returns {{
 *              token:string, 
 *              exp:number,             //expires at
 *              iat:number,             //issued at
 *              tokentimestamp:number}}
 */
 const iamTokenAuthorize = (app_id, endpoint, claim, app_custom_expire=null)=>{

    let secret = '';
    let expiresin = '';
    switch (endpoint){
        //APP ID Token
        case 'APP_ID':{
            secret = commonRegistryAppSecret(app_id).COMMON_APP_ID_SECRET;
            expiresin = commonRegistryAppSecret(app_id).COMMON_APP_ID_EXPIRE;
            break;
        }
        //USER Access token
        case 'APP_ACCESS':{
            secret = commonRegistryAppSecret(app_id).COMMON_APP_ACCESS_SECRET;
            expiresin = commonRegistryAppSecret(app_id).COMMON_APP_ACCESS_EXPIRE;
            break;
        }
        //Admin Access token
        case 'ADMIN':{
            secret = configGet('SERVICE_IAM', 'ADMIN_TOKEN_SECRET') ?? '';
            expiresin = configGet('SERVICE_IAM', 'ADMIN_TOKEN_EXPIRE_ACCESS') ?? '';
            break;
        }
        //APP custom token
        case 'APP_CUSTOM':{
            secret = commonRegistryAppSecret(app_id).COMMON_APP_ID_SECRET;
            expiresin = app_custom_expire ?? '';
            break;
        }
    }
    /**@type{import('./types.js').server_iam_access_token_claim_type} */
    const access_token_claim = {app_id:         app_id,
                                id:             claim.id,
                                name:           claim.name,
                                ip:             claim.ip,
                                scope:          claim.scope,
                                tokentimestamp: Date.now()};
    const token = jwt.sign (access_token_claim, secret, {expiresIn: expiresin});
    return {token:token,
            /**@ts-ignore */
            exp:jwt.decode(token, { complete: true }).payload.exp,
            /**@ts-ignore */
            iat:jwt.decode(token, { complete: true }).payload.iat,
            /**@ts-ignore */
            tokentimestamp:jwt.decode(token, { complete: true }).payload.tokentimestamp};
};

/**
 * @param {number} app_id
 * @param {*} query
 */
const iamUserLogin = async (app_id, query) => {const rows = await fileFsReadLog('IAM_USER_LOGIN', null, '')
                                                    .then(result=>result
                                                    .filter((/**@type{import('./types.js').server_iam_user_login_record}*/row)=>
                                                        row.id==serverUtilNumberValue(query.get('data_user_account_id')) &&  
                                                        row.id==(serverUtilNumberValue(query.get('data_app_id')==''?null:query.get('data_app_id')) ?? row.id)))
                                                    .catch(()=>
                                                        null
                                                    );
                                                return rows?rows.sort(( /**@type{import('./types.js').server_iam_user_login_record}*/a,
                                                    /**@type{import('./types.js').server_iam_user_login_record}*/b)=> 
                                                        //sort descending on created
                                                        a.created.localeCompare(b.created)==1?-1:1):[];
                                            };
                                                    

export{ iamUtilDecode,
        iamUtilTokenExpired,
        iamUtilResponseNotAuthorized,
        iamAdminAuthenticate,
        iamSocketAuthenticate,
        iamUserCommonAuthenticate,
        iamExternalAuthenticate,
        iamRequestAuthenticate,
        iamAppAuthenticate,
        iamResourceAuthenticate,
        iamIdTokenAuthorize,
        iamTokenAuthorize,
        iamUserLogin}; 