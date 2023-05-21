const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);

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
const CreateDataToken = async (app_id, callBack)=>{
    const {default:{sign}} = await import("jsonwebtoken");
    let jsontoken_dt;
    jsontoken_dt = sign ({tokentimstamp: Date.now()}, 
                            ConfigGet(7, app_id, 'DATA_SECRET'), 
                            {
                            expiresIn: ConfigGet(7, app_id, 'DATA_EXPIRE')
                            });
    callBack(null, jsontoken_dt);
}
const checkClientAccess = async (app_id, authorization) =>{
    let userpass = new Buffer.from((authorization || '').split(' ')[1] || '', 'base64').toString();
    if (userpass == ConfigGet(7, app_id, 'CLIENT_ID') + ':' + ConfigGet(7, app_id, 'CLIENT_SECRET'))
        return 1;
    else
        return 0;
}
export {block_ip_control, safe_user_agents, check_internet, CreateDataToken, checkClientAccess}
