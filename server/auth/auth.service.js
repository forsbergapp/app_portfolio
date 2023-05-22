const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);
const {default:{sign, verify}} = await import("jsonwebtoken");
const IPtoNum = (ip) => {
    return Number(
        ip.split(".")
        .map(d => ("000"+d).substr(-3) )
        .join("")
    );
}

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
        })
    }
    else
        return callBack(null, null);
}
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
                    let stack = new Error().stack;
                    import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
                        import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogAppS}) => {
                            createLogAppS(ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), err).then(() => {
                                return callBack(err, null);
                            })
                        });
                    })
                }
                else{
                    json = JSON.parse(fileBuffer.toString());
                    for (let i = 0; i < json.user_agent.length; i++){
                        if (json.user_agent[i].user_agent == user_agent)
                            return callBack(null, true);
                    }
                    return callBack(null, false);
                }
            })
        })
    }
    else
        return callBack(null, false);
}
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
            })
        })
    })
}

//ENDPOINT MIDDLEWARE
const checkAccessToken = async (app_id, user_account_id, ip, authorization)=>{
    return new Promise((resolve, reject)=>{
        if (authorization){
            let token = authorization.slice(7);
            verify(token, ConfigGet(7, app_id, 'ACCESS_SECRET'), (err, decoded) => {
                if (err)
                   resolve(false);
                else {
                    //check access token belongs to user_account.id, app_id and ip saved when logged in
                    //and if app_id=0 then check user is admin
                    import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_logon/user_account_logon.service.js`).then(({checkLogin}) => {
                        checkLogin(app_id, user_account_id, authorization.replace('Bearer ',''), ip, (err, result)=>{
                            if (err)
                                reject(err)
                            else{
                                if (result.length==1)
                                    resolve(true);
                                else
                                    resolve(false);
                            }
                        })
                    })
                }
            })
        }
        else
            resolve(false);
    })
}
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
    })
    
}
const accessToken = (app_id)=>{
    let jsontoken_at;                    
    jsontoken_at = sign ({tokentimstamp: Date.now()}, 
                          ConfigGet(7, app_id, 'ACCESS_SECRET'), 
                         {
                          expiresIn: ConfigGet(7, app_id, 'ACCESS_EXPIRE')
                         });
    return jsontoken_at;
}
const CreateDataToken = (app_id)=>{
    let jsontoken_dt;
    jsontoken_dt = sign ({tokentimstamp: Date.now()}, 
                            ConfigGet(7, app_id, 'DATA_SECRET'), 
                            {
                            expiresIn: ConfigGet(7, app_id, 'DATA_EXPIRE')
                            });
    return jsontoken_dt;
}
const checkClientAccess = (app_id, authorization) =>{
    let userpass = new Buffer.from((authorization || '').split(' ')[1] || '', 'base64').toString();
    if (userpass == ConfigGet(7, app_id, 'CLIENT_ID') + ':' + ConfigGet(7, app_id, 'CLIENT_SECRET'))
        return 1;
    else
        return 0;
}
export {block_ip_control, safe_user_agents, check_internet, 
        checkAccessToken,checkDataToken, 
        accessToken,CreateDataToken,
        checkClientAccess}
