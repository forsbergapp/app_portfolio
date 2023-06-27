const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);
const {default:{sign, verify}} = await import('jsonwebtoken');
const IPtoNum = (ip) => {
    return Number(
        ip.split('.')
        .map(d => ('000'+d).substr(-3) )
        .join('')
    );
};
const access_control = (ip, host, user_agent, accept_language, callBack) => {

    if (ConfigGet(1, 'SERVICE_AUTH', 'ACCESS_CONTROL_ENABLE')=='1'){
        const ip_v4 = ip.replace('::ffff:','');
        block_ip_control(ip_v4, (err, result_range) =>{
            if (err){
                callBack(err, null);
            }
            else{
                if (result_range){
                    return callBack(null,{statusCode:result_range.statusCode,
                                          statusMessage: `ip ${ip_v4} blocked, range: ${result_range.statusMessage}`});
                }
                else{
                    //check if host exists
                    if (ConfigGet(1, 'SERVICE_AUTH', 'ACCESS_CONTROL_HOST_EXIST')=='1' &&
                        typeof host=='undefined'){
                        //406 Not Acceptable
                        return callBack(null, {statusCode: 406, 
                                               statusMessage: `ip ${ip_v4} blocked, no host`});
                    }
                    else{
                        //check if accessed from domain and not os hostname
                        import('node:os').then(({hostname}) =>{
                            if (ConfigGet(1, 'SERVICE_AUTH', 'ACCESS_CONTROL_ACCESS_FROM')=='1' &&
                                host==hostname()){
                                //406 Not Acceptable
                                return callBack(null, {statusCode: 406, 
                                                       statusMessage: `ip ${ip_v4} blocked, accessed from hostname ${host} not domain`});
                            }
                            else{
                                safe_user_agents(user_agent, (err, safe)=>{
                                    if (err){
                                        return callBack(err, null);
                                    }
                                    else{
                                        if (safe==true)
                                            return callBack(null,null);
                                        else{
                                            //check if user-agent exists
                                            if(ConfigGet(1, 'SERVICE_AUTH', 'ACCESS_CONTROL_USER_AGENT_EXIST')==1 &&
                                                typeof user_agent=='undefined'){
                                                //406 Not Acceptable
                                                return callBack(null, {statusCode: 406, 
                                                                       statusMessage: `ip ${ip_v4} blocked, no user-agent`});
                                            }
                                            else{
                                                //check if accept-language exists
                                                if (ConfigGet(1, 'SERVICE_AUTH', 'ACCESS_CONTROL_ACCEPT_LANGUAGE')=='1' &&
                                                    typeof accept_language=='undefined'){
                                                    //406 Not Acceptable
                                                    return callBack(null, {statusCode: 406, 
                                                                           statusMessage: `ip ${ip_v4} blocked, no accept-language`});
                                                }
                                                else
                                                    return callBack(null,null);
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            }
        });
    }
    else
        return callBack(null,null);
};
const block_ip_control = async (ip_v4, callBack) => {
    if (ConfigGet(1, 'SERVICE_AUTH', 'ACCESS_CONTROL_IP') == '1'){
        let ranges;
        import('node:fs').then((fs) =>{
            fs.readFile(process.cwd() + ConfigGet(0, null, 'FILE_CONFIG_AUTH_BLOCKIP'), 'utf8', (err, fileBuffer) => {
                if (err)
                    return callBack(err, null);
                else{
                    ranges = fileBuffer.toString();
                    //check if IP is blocked
                    if ((ip_v4.match(/\./g)||[]).length==3){
                        for (const element of JSON.parse(ranges)) {
                            if (IPtoNum(element[0]) <= IPtoNum(ip_v4) &&
                                IPtoNum(element[1]) >= IPtoNum(ip_v4)) {
                                    //403 Forbidden
                                    return callBack(null,{statusCode: 403,
                                                            statusMessage: `${IPtoNum(element[0])}-${IPtoNum(element[1])}`});
                            }
                        }
                    }
                }
                return callBack(null, null);
            });
        });
    }
    else
        return callBack(null, null);
};
const safe_user_agents = async (user_agent, callBack) => {
    /*format file
        {"user_agent": [
                        {"Name": "ID", 
                            "user_agent": "[user agent]"},
                            {"Name": "OtherSafe", 
                            "user_agent": "Some known user agent description with missing accept_language"}
                        ]
        }
    */
    if (ConfigGet(1, 'SERVICE_AUTH', 'ACCESS_CONTROL_USER_AGENT') == '1'){
        let json;  
        import('node:fs').then((fs) =>{
            fs.readFile(process.cwd() + ConfigGet(0, null, 'FILE_CONFIG_AUTH_USERAGENT'), 'utf8', (err, fileBuffer) => {
                if (err){
                    return callBack(err, null);
                }
                else{
                    json = JSON.parse(fileBuffer.toString());
                    for (let i = 0; i < json.user_agent.length; i++){
                        if (json.user_agent[i].user_agent == user_agent)
                            return callBack(null, true);
                    }
                    return callBack(null, false);
                }
            });
        });
    }
    else
        return callBack(null, false);
};
const check_request = (req_path, callBack) =>{
    let err = null;
    try {
        decodeURIComponent(req_path);
    }
    catch(e) {
        err = e;
    }
    if (err){
        callBack(err, null);
    }
    else
        callBack(null, null);
};

const check_internet = async () => {
    return new Promise(resolve =>{
        //test connection with localhost
        //no need to specify other domain to test internet
        import('node:dns').then(({resolve: dns_resolve}) => {
            dns_resolve('localhost', 'A', (err, result) => {
                /*  error if disconnected internet:
                code:       'ECONNREFUSED'
                errno:      undefined
                hostname:   'localhost'
                syscall:    'queryA'
                message:    'queryA ECONNREFUSED localhost'
                stack:      'Error: queryA ECONNREFUSED localhost\n    
                                at QueryReqWrap.onresolve [as oncomplete] (node:dns:256:19)\n    
                                at QueryReqWrap.callbackTrampoline (node:internal/async_hooks:130:17)'
                
                error if not found              
                code:       'ENOTFOUND'
                errno:      undefined
                hostname:   'localhost'
                syscall:    'queryA'
                message:    'queryA ENOTFOUND localhost'
                stack:      'Error: queryA ENOTFOUND localhost\n    
                            at QueryReqWrap.onresolve [as oncomplete] (node:dns:256:19)\n    
                            at QueryReqWrap.callbackTrampoline (node:internal/async_hooks:130:17)'
                */
                //use only resolve here, no reject to avoid .catch statement in calling function
                if ((err) && err.code=='ECONNREFUSED')
                    resolve(0);
                else 
                    resolve(1);
            });
        });
    });
};

//ENDPOINT MIDDLEWARE
const checkAccessToken = async (app_id, user_account_id, ip, authorization)=>{
    return new Promise((resolve, reject)=>{
        if (authorization){
            const token = authorization.slice(7);
            verify(token, ConfigGet(7, app_id, 'ACCESS_SECRET'), (err, decoded) => {
                if (err)
                   resolve(false);
                else {
                    //check access token belongs to user_account.id, app_id and ip saved when logged in
                    //and if app_id=0 then check user is admin
                    import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_logon/user_account_logon.service.js`).then(({checkLogin}) => {
                        checkLogin(app_id, user_account_id, authorization.replace('Bearer ',''), ip, (err, result)=>{
                            if (err)
                                reject(err);
                            else{
                                if (result.length==1)
                                    resolve(true);
                                else
                                    resolve(false);
                            }
                        });
                    });
                }
            });
        }
        else
            resolve(false);
    });
};
const checkDataToken = async (app_id, token) =>{
    return new Promise(resolve =>{
        if (token){
            token = token.slice(7);
            verify(token, ConfigGet(7, app_id, 'DATA_SECRET'), (err, decoded) => {
                if (err){
                    resolve(false);
                } else {
                    resolve(true);
                }
            });    
        }
        else{
            resolve(false);
        }    
    });
    
};
const accessToken = (app_id)=>{
    const jsontoken_at = sign ({tokentimstamp: Date.now()}, 
                          ConfigGet(7, app_id, 'ACCESS_SECRET'), 
                         {
                          expiresIn: ConfigGet(7, app_id, 'ACCESS_EXPIRE')
                         });
    return jsontoken_at;
};
const CreateDataToken = (app_id)=>{
    const jsontoken_dt = sign ({tokentimstamp: Date.now()}, 
                            ConfigGet(7, app_id, 'DATA_SECRET'), 
                            {
                            expiresIn: ConfigGet(7, app_id, 'DATA_EXPIRE')
                            });
    return jsontoken_dt;
};
export {access_control, block_ip_control, safe_user_agents, check_request, check_internet, 
        checkAccessToken,checkDataToken, 
        accessToken,CreateDataToken};
