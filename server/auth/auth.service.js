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
const policy_directives = (callBack) => {
    /* format json with directives:
        {"directives":
            [
                { "type": "script",
                "domain": "'self', 'unsafe-inline', 'unsafe-eval', domain1, domain2"
                },
                { "type": "style",
                "domain": "'self', 'unsafe-inline', domain1, domain2"
                },
                { "type": "font",
                "domain": "self, domain1, domain2"
                },
                { "type": "frame",
                "domain": "'self', data:, domain1, domain2"
                }
            ]
        }
    */
    import('node:fs').then((fs) =>{
        if (ConfigGet(1, 'SERVICE_AUTH', 'ENABLE_POLICY') == '1'){
            let json;
            let script_src = '';
            let style_src = '';
            let font_src = '';
            let frame_src = '';
            fs.readFile(process.cwd() + ConfigGet(0, null, 'FILE_CONFIG_AUTH_POLICY'), 'utf8', (err, fileBuffer) => {
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
                    for (let i = 0; i < json.directives.length; i++){
                        json.directives[i].domain = json.directives[i].domain.replace(' ','');
                        let arr = json.directives[i].domain.split(",");
                        for (let i=0;i<=arr.length-1;i++){
                            arr[i] = arr[i].replace(' ','');
                        }
                        switch (json.directives[i].type){
                            case 'script':{
                                script_src = arr;
                                break;
                            }
                            case 'style':{
                                style_src = arr;
                                break;
                            }
                            case 'font':{
                                font_src = arr;
                                break;
                            }
                            case 'frame':{
                                frame_src = arr;
                                break;
                            }
                        }
                    }
                    return callBack(null, {
                                            "default-src": ["'self'"], 
                                            "script-src": script_src,
                                            "script-src-attr": ["'self'", "'unsafe-inline'"],
                                            "style-src": style_src,
                                            "font-src": font_src,
                                            "img-src": ["*", 'data:', 'blob:'],
                                            connectSrc: ["*"],
                                            childSrc: ["'self'", 'blob:'],
                                            "object-src": ["'self'", 'data:'],
                                            frameSrc: frame_src
                                            } );
                }
            })
        }
        else
            return callBack(null, null);
    });
}
export {block_ip_control, safe_user_agents, policy_directives}