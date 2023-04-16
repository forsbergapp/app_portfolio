const pm2log = (log) => {
    console.log(log);
}
    
const remote_log = async (ConfigGet, config_destination, log) => {
    return await new Promise((resolve) => {
        if (config_destination=='1' || config_destination=='2'){
            //url destination
            const headers = { 
                'Authorization': 'Basic ' + btoa(ConfigGet(1, 'SERVICE_LOG', 'URL_DESTINATION_USERNAME') + ':' + ConfigGet(1, 'SERVICE_LOG', 'URL_DESTINATION_PASSWORD'))
            };
            //add logscope and loglevel first and as all logfiles will be sent to same url
            let url_old  = JSON.parse(log);
            let url_log  = {};
            url_log.logscope = logscope;
            url_log.loglevel = loglevel;
            url_log.logdate = url_old.logdate;
            url_log.ip = url_old.ip;
            url_log.host = url_old.host;
            url_log.protocol = url_old.protocol;
            url_log.url = url_old.url;
            url_log.method = url_old.method;
            url_log.statusCode = url_old.statusCode;
            url_log['user-agent'] = url_old['user-agent'];
            url_log['accept-language'] = url_old['accept-language'];
            url_log.http_referer = url_old.http_referer;
            url_log.app_id = url_old.app_id;
            url_log.app_filename = url_old.app_filename;
            url_log.app_function_name = url_old.app_function_name;
            url_log.app_line = url_old.app_line;
            url_log.logtext = url_old.logtext;
    
            url_log = JSON.stringify(url_log);
            import('axios').then(({default: axios}) => {
                axios.post(ConfigGet(1, 'SERVICE_LOG', 'URL_DESTINATION'), url_log).then(() => {
                    resolve();
                })
            });
        }   
        else
            resolve();
    })
}
const sendLog = async (ConfigGet, logscope, loglevel, log) => {
    return await new Promise((resolve) => {
        let filename;
        let logdate = new Date();
        //make log nice and compact
        try{        
            log = JSON.stringify(JSON.parse(log));
        }
        catch(err){
            pm2log(err)
            pm2log(log);
        }
        let month = logdate.toLocaleString("en-US", { month: "2-digit"});
        let day   = logdate.toLocaleString("en-US", { day: "2-digit"});
        let config_file_interval = ConfigGet(1, 'SERVICE_LOG', 'FILE_INTERVAL')
        if (config_file_interval=='1D')
            filename = `${logscope}_${loglevel}_${logdate.getFullYear()}${month}${day}.log`;
        else
            if (config_file_interval=='1M')
                filename = `${logscope}_${loglevel}_${logdate.getFullYear()}${month}.log`;
            else
                filename = `${logscope}_${loglevel}_${logdate.getFullYear()}${month}.log`;
        let config_destination = ConfigGet(1, 'SERVICE_LOG', 'DESTINATION')
        if (config_destination=='0' || config_destination=='2'){
            //file destination
            import('node:fs').then((fs) =>{
                fs.appendFile(process.cwd() + ConfigGet(0, null, 'PATH_LOG') + filename, log + '\r\n', 'utf8', (err) => {
                    if (err) {
                        //if error here ignore and continue, where else should log file be saved?
                        pm2log(err);
                        resolve();
                    }
                    else
                        resolve(remote_log(ConfigGet, config_destination, log));
                });
            })
        }
        else
            resolve(remote_log(ConfigGet, config_destination, log));
    })
}
const logdate = (date_format) => {
    let logdate = new Date();
    if (date_format!='' && typeof date_format!='undefined'){
        //ex ISO8601 format: "yyyy'-'MM'-'dd'T'HH':'mm':'ss'Z'"
        logdate.format(date_format);
    }
    else
        logdate = logdate.toISOString();
    return logdate;
}
const createLogServerE = async (ip, host, protocol, originalUrl, method, statusCode, 
                                user_agent, accept_language, referer, err) => {
    return await new Promise((resolve) => {
        let log_json_server;
        import(`file://${process.cwd()}/server/server.service.js`).then(({ConfigGet}) => {
            log_json_server = `{"logdate": "${logdate(ConfigGet(1, 'SERVICE_LOG', 'DATE_FORMAT'))}",
                                "ip":"${ip}",
                                "host": "${host}",
                                "protocol": "${protocol}",
                                "url": ${JSON.stringify(originalUrl.replaceAll('"', '\''))},
                                "method":"${method}",
                                "statusCode": ${statusCode},
                                "user-agent": "${user_agent}",
                                "accept-language": "${accept_language}",
                                "http_referer": "${referer}",
                                "app_id": "",
                                "app_filename": "",
                                "app_function_name": "",
                                "app_app_line": "",
                                "logtext": ${JSON.stringify(err.status + '-' + err.message)}
                            }`;
            resolve(sendLog(ConfigGet, ConfigGet(1, 'SERVICE_LOG', 'SCOPE_SERVER'), ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), log_json_server));
        })
    })
}
const createLogServerI = async (info=null,req=null,
                                ip, host, protocol, originalUrl, method, 
                                statusCode, statusMessage,
                                user_agent, accept_language, referer) => {
    return await new Promise((resolve) => {
        let log_level;
        let log_json_server;  
        let logtext;
        import(`file://${process.cwd()}/server/server.service.js`).then(({ConfigGet}) => {
            if(ConfigGet(1, 'SERVICE_LOG', 'ENABLE_SERVER_VERBOSE')=='1'){
                log_level = ConfigGet(1, 'SERVICE_LOG', 'LEVEL_VERBOSE');
                if (info ==null){
                    //log verbose log with request 
                    logtext = Object.assign({}, req);
                    const getCircularReplacer = () => {
                        const seen = new WeakSet();
                        return (key, value) => {
                            if (typeof value === 'object' && value !== null) {
                            if (seen.has(value)) {
                                return;
                            }
                            seen.add(value);
                            }
                            return value;
                        };
                    };
                    //remove password
                    if (logtext.body.password)
                        logtext.body.password = null;
                    //remove Basic authorization with password
                    logtext.rawHeaders.forEach((rawheader,index)=>{
                        if (rawheader.startsWith('Basic'))
                            logtext.rawHeaders[index] = 'Basic ...';
                    })
                    logtext = 'req:' + JSON.stringify(logtext, getCircularReplacer());
                    log_json_server = `{"logdate": "${logdate(ConfigGet(1, 'SERVICE_LOG', 'DATE_FORMAT'))}",
                                        "ip":"${ip}",
                                        "host": "${host}",
                                        "protocol": "${protocol}",
                                        "url": ${JSON.stringify(originalUrl.replaceAll('"', '\''))},
                                        "method":"${method}",
                                        "statusCode": ${statusCode},
                                        "user-agent": "${user_agent}",
                                        "accept-language": "${accept_language}",
                                        "http_referer": "${referer}",
                                        "app_id": "",
                                        "app_filename": "",
                                        "app_function_name": "",
                                        "app_app_line": "",
                                        "logtext": ${JSON.stringify(logtext)}
                                        }`;
                }
                else{
                    logtext = info;
                    log_json_server = `{"logdate": "${logdate(ConfigGet(1, 'SERVICE_LOG', 'DATE_FORMAT'))}",
                                        "ip":"",
                                        "host": "",
                                        "protocol": "",
                                        "url": "",
                                        "method":"",
                                        "statusCode": "",
                                        "user-agent": "",
                                        "accept-language": "",
                                        "http_referer": "",
                                        "app_id": "",
                                        "app_filename": "",
                                        "app_function_name": "",
                                        "app_app_line": "",
                                        "logtext": ${JSON.stringify(logtext)}
                                        }`;
                }                
                resolve(sendLog(ConfigGet, ConfigGet(1, 'SERVICE_LOG', 'SCOPE_SERVER'), log_level, log_json_server));
            }
            else{
                if (ConfigGet(1, 'SERVICE_LOG', 'ENABLE_SERVER_INFO')=='1'){
                    log_level = ConfigGet(1, 'SERVICE_LOG', 'LEVEL_INFO');
                    if (info ==null){
                        if (typeof statusMessage=='undefined' || statusMessage=='')
                            logtext = '""';
                        else
                            logtext = JSON.stringify(statusMessage);
                        log_json_server = `{"logdate": "${logdate(ConfigGet(1, 'SERVICE_LOG', 'DATE_FORMAT'))}",
                                            "ip":"${ip}",
                                            "host": "${host}",
                                            "protocol": "${protocol}",
                                            "url": ${JSON.stringify(originalUrl.replaceAll('"', '\''))},
                                            "method":"${method}",
                                            "statusCode": ${statusCode},
                                            "user-agent": "${user_agent}",
                                            "accept-language": "${accept_language}",
                                            "http_referer": "${referer}",
                                            "app_id": "",
                                            "app_filename": "",
                                            "app_function_name": "",
                                            "app_app_line": "",
                                            "logtext": ${logtext}
                                            }`;
                    }
                    else{
                        logtext = info;
                        log_json_server = `{"logdate": "${logdate(ConfigGet(1, 'SERVICE_LOG', 'DATE_FORMAT'))}",
                                            "ip":"",
                                            "host": "",
                                            "protocol": "",
                                            "url": "",
                                            "method":"",
                                            "statusCode": "",
                                            "user-agent": "",
                                            "accept-language": "",
                                            "http_referer": "",
                                            "app_id": "",
                                            "app_filename": "",
                                            "app_function_name": "",
                                            "app_app_line": "",
                                            "logtext": ${JSON.stringify(logtext)}
                                            }`;
                    }
                    resolve(sendLog(ConfigGet, ConfigGet(1, 'SERVICE_LOG', 'SCOPE_SERVER'), log_level, log_json_server));
                }
                else
                    resolve();
            }
        })
    })
}
const createLogDB = async (app_id, logtext) => {
    return await new Promise((resolve) => {
        import(`file://${process.cwd()}/server/server.service.js`).then(({ConfigGet}) => {
            if (ConfigGet(1, 'SERVICE_LOG', 'ENABLE_DB')=='1'){
                import('node:os').then(({hostname}) => {
                    let log_json_db = `{"logdate": "${logdate(ConfigGet(1, 'SERVICE_LOG', 'DATE_FORMAT'))}",
                                        "ip":"",
                                        "host": "${hostname()}",
                                        "protocol": "",
                                        "url": "",
                                        "method":"",
                                        "statusCode": "",
                                        "user-agent": "",
                                        "accept-language": "",
                                        "http_referer": "",
                                        "app_id": ${app_id},
                                        "app_filename": "",
                                        "app_function_name": "",
                                        "app_app_line": "",
                                        "logtext": ${JSON.stringify(logtext)}
                                        }`;
                    resolve(sendLog(ConfigGet, ConfigGet(1, 'SERVICE_LOG', 'SCOPE_DB'), ConfigGet(1, 'SERVICE_LOG', 'LEVEL_INFO'), log_json_db));
                })
            }
            else
                resolve();
        })
    })
}
const createLogAppS = async (level_info, app_id, app_filename, app_function_name, app_line, logtext) => {
    return await new Promise((resolve) => { 
        import('node:os').then(({hostname}) => {
            import(`file://${process.cwd()}/server/server.service.js`).then(({ConfigGet}) => {
                let log_json =`{"logdate": "${logdate(ConfigGet(1, 'SERVICE_LOG', 'DATE_FORMAT'))}",
                                "ip":"",
                                "host": "${hostname()}",
                                "protocol": "",
                                "url": "",
                                "method":"",
                                "statusCode": "",
                                "user-agent": "",
                                "accept-language": "",
                                "http_referer": "",
                                "app_id": ${app_id},
                                "app_filename": "${app_filename}",
                                "app_function_name": "${app_function_name}",
                                "app_app_line": ${app_line},
                                "logtext": ${JSON.stringify(logtext)}
                                }`;    
                resolve(sendLog(ConfigGet, ConfigGet(1, 'SERVICE_LOG', 'SCOPE_SERVICE'), level_info, log_json));
            })
        })
    })
}
const createLogAppC = async (app_id, level_info, app_filename, app_function_name, app_line, logtext,
                             ip, host, protocol, originalUrl, method, statusCode, 
                             user_agent, accept_language, referer) => {
    return await new Promise((resolve) => {
        import(`file://${process.cwd()}/server/server.service.js`).then(({ConfigGet}) => {
            let log_json =`{"logdate": "${logdate(ConfigGet(1, 'SERVICE_LOG', 'DATE_FORMAT'))}",
                            "ip":"${ip}",
                            "host": "${host}",
                            "protocol": "${protocol}",
                            "url": ${JSON.stringify(originalUrl.replaceAll('"', '\''))},
                            "method":"${method}",
                            "status_code": ${statusCode},
                            "user-agent": "${user_agent}",
                            "accept-language": "${accept_language}",
                            "http_referer": "${referer}",
                            "app_id": ${app_id},
                            "app_filename": "${app_filename}",
                            "app_function_name": "${app_function_name}",
                            "app_app_line": ${app_line},
                            "logtext": ${JSON.stringify(logtext)}
                            }`;
            resolve(sendLog(ConfigGet, ConfigGet(1, 'SERVICE_LOG', 'SCOPE_CONTROLLER'), level_info, log_json));
        })
    })
}
const createLogAppRI = async (app_id, app_filename, app_function_name, app_line, logtext,
                              ip, host, protocol, originalUrl, method, statusCode, 
                              user_agent, accept_language, referer) => {
    return await new Promise((resolve) => {
        //remove sensitive data without modifying original log
        //ES6 Object.assign clone 
        let router_logtext = Object.assign({}, logtext);
        if (router_logtext.password)
            router_logtext.password = null;
        import(`file://${process.cwd()}/server/server.service.js`).then(({ConfigGet}) => {
            if (ConfigGet(1, 'SERVICE_LOG', 'ENABLE_ROUTER')=='1'){
                let log_json =`{"logdate": "${logdate(ConfigGet(1, 'SERVICE_LOG', 'DATE_FORMAT'))}",
                                "ip":"${ip}",
                                "host": "${host}",
                                "protocol": "${protocol}",
                                "url": ${JSON.stringify(originalUrl.replaceAll('"', '\''))},
                                "method":"${method}",
                                "status_code": ${statusCode},
                                "user-agent": "${user_agent}",
                                "accept-language": "${accept_language}",
                                "http_referer": "${referer}",
                                "app_id": "${app_id}",
                                "app_filename": "${app_filename}",
                                "app_function_name": "${app_function_name}",
                                "app_app_line": ${app_line},
                                "logtext": ${JSON.stringify(router_logtext)}
                                }`;
                resolve(sendLog(ConfigGet, ConfigGet(1, 'SERVICE_LOG', 'SCOPE_ROUTER'), ConfigGet(1, 'SERVICE_LOG', 'LEVEL_INFO'), log_json));
            }
            else
                resolve();
        })
    })
}
const getLogParameters = (app_id, callBack) => {
    let results = {};
    import(`file://${process.cwd()}/server/server.service.js`).then(({ConfigGet}) => {
        results.SERVICE_LOG_SCOPE_SERVER = ConfigGet(1, 'SERVICE_LOG', 'SCOPE_SERVER');
        results.SERVICE_LOG_SCOPE_SERVICE = ConfigGet(1, 'SERVICE_LOG', 'SCOPE_SERVICE');
        results.SERVICE_LOG_SCOPE_DB = ConfigGet(1, 'SERVICE_LOG', 'SCOPE_DB');
        results.SERVICE_LOG_SCOPE_ROUTER = ConfigGet(1, 'SERVICE_LOG', 'SCOPE_ROUTER');
        results.SERVICE_LOG_SCOPE_CONTROLLER = ConfigGet(1, 'SERVICE_LOG', 'SCOPE_CONTROLLER');
        results.SERVICE_LOG_ENABLE_SERVER_INFO = ConfigGet(1, 'SERVICE_LOG', 'ENABLE_SERVER_INFO');
        results.SERVICE_LOG_ENABLE_SERVER_VERBOSE = ConfigGet(1, 'SERVICE_LOG', 'ENABLE_SERVER_VERBOSE');
        
        results.SERVICE_LOG_ENABLE_DB = ConfigGet(1, 'SERVICE_LOG', 'ENABLE_DB');
        results.SERVICE_LOG_ENABLE_ROUTER = ConfigGet(1, 'SERVICE_LOG', 'ENABLE_ROUTER');
        results.SERVICE_LOG_LEVEL_VERBOSE = ConfigGet(1, 'SERVICE_LOG', 'LEVEL_VERBOSE');
        results.SERVICE_LOG_LEVEL_ERROR = ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR');
        results.SERVICE_LOG_LEVEL_INFO = ConfigGet(1, 'SERVICE_LOG', 'LEVEL_INFO');
        
        results.SERVICE_LOG_FILE_INTERVAL = ConfigGet(1, 'SERVICE_LOG', 'FILE_INTERVAL');
        results.SERVICE_LOG_PM2_FILE = ConfigGet(1, 'SERVICE_LOG', 'PM2_FILE');
        return callBack(null, results);
    })
}
const getLogs = (app_id, data, callBack) => {
    let filename;
    import(`file://${process.cwd()}/server/server.service.js`).then(({ConfigGet}) => {
        if (parseInt(data.month) <10)
            data.month = '0' + data.month;
        if (ConfigGet(1, 'SERVICE_LOG', 'FILE_INTERVAL')=='1D'){
            if (parseInt(data.day) <10)
                data.day = '0' + data.day;
            filename = `${data.logscope}_${data.loglevel}_${data.year}${data.month}${data.day}.log`;
        }
        else
            if (ConfigGet(1, 'SERVICE_LOG', 'FILE_INTERVAL')=='1M')
                filename = `${data.logscope}_${data.loglevel}_${data.year}${data.month}.log`;
            else
                filename = `${data.logscope}_${data.loglevel}_${data.year}${data.month}.log`;
        let fixed_log = [];
        let loggerror = 0;
        try {
            loggerror = 1;
            import('node:fs').then((fs) =>{
                fs.readFile(process.cwd() + ConfigGet(0, null, 'PATH_LOG') + filename, 'utf8', (error, fileBuffer) => {
                    loggerror = 2;
                    if (error)
                        return callBack(null, fixed_log);
                    else{
                        fileBuffer.toString().split('\r\n').forEach((record) => {
                            if (record.length>0){
                                if (data.select_app_id=='')
                                    fixed_log.push(JSON.parse(record));
                                else
                                    if (JSON.parse(record).app_id =='ADMIN' && data.select_app_id=='ADMIN')
                                        fixed_log.push(JSON.parse(record));
                                    else
                                        if (JSON.parse(record).app_id == parseInt(data.select_app_id))
                                            fixed_log.push(JSON.parse(record));
                            }
                        })
                    }
                    const sortByProperty = (property, order_by) => {
                        return (a,b) => {
                            if(a[property] > b[property])  
                                return 1 * order_by;
                            else if(a[property] < b[property])  
                                return -1 * order_by;
                        
                            return 0;  
                        }  
                    }
                    let column_sort;
                    let order_by;
                    if (data.order_by =='asc')
                        order_by = 1;
                    else   
                        order_by = -1;
                    switch (parseInt(data.sort)){
                        case 1:{
                            column_sort = 'logdate';
                            break;
                        }
                        case 2:{
                            column_sort = 'ip';
                            break;
                        }
                        case 3:{
                            column_sort = 'host';
                            break;
                        }
                        case 4:{
                            column_sort = 'protocol';
                            break;
                        }
                        case 5:{
                            column_sort = 'url';
                            break;
                        }
                        case 6:{
                            column_sort = 'method';
                            break;
                        }
                        case 7:{
                            column_sort = 'statusCode';
                            break;
                        }
                        case 8:{
                            column_sort = '["user-agent"]';
                            break;
                        }
                        case 9:{
                            column_sort = '["accept-language"]';
                            break;
                        }
                        case 10:{
                            column_sort = 'http_referer';
                            break;
                        }
                        case 11:{
                            column_sort = 'app_id';
                            break;
                        }
                        case 12:{
                            column_sort = 'app_filename';
                            break;
                        }
                        case 13:{
                            column_sort = 'app_function_name';
                            break;
                        }
                        case 14:{
                            column_sort = 'app_app_line';
                            break;
                        }
                        case 15:{
                            column_sort = 'logdate';
                            break;
                        }
                        default:{
                            column_sort = 'logdate';
                        }
                    }
                    fixed_log.sort(sortByProperty(column_sort, order_by))
                    return callBack(null, fixed_log);
                });
            })
        } catch (error) {
            if (loggerror == 2)
                return callBack(error.message);
        }
    })
}
const getFiles = (app_id, callBack) => {
    let logfiles =[];
    import(`file://${process.cwd()}/server/server.service.js`).then(({ConfigGet}) => {
        import('node:fs').then((fs) =>{
            fs.readdir(process.cwd() + ConfigGet(0, null, 'PATH_LOG'), (err, files) => {
                if (err) {
                    return callBack(err, null);
                }
                let i =1;
                files.forEach(file => {
                    if (file.indexOf('CONTROLLER_INFO_')==0||
                        file.indexOf('DB_INFO_')==0||
                        file.indexOf('ROUTER_INFO_')==0||
                        file.indexOf('SERVER_ERROR_')==0||
                        file.indexOf('SERVER_INFO_')==0||
                        file.indexOf('SERVER_VERBOSE_')==0||
                        file.indexOf('SERVICE_ERROR_')==0||
                        file.indexOf('SERVICE_INFO_')==0)
                    logfiles.push({"id": i++, "filename":file});
                });
                return callBack(null, logfiles);
            });
        })
    })
}
const getPM2Logs = (app_id, callBack) => {
    try {
        let fixed_log = [];
        import(`file://${process.cwd()}/server/server.service.js`).then(({ConfigGet}) => {
            import('node:fs').then((fs) =>{
                fs.readFile(process.cwd() + ConfigGet(0, null, 'PATH_LOG') + ConfigGet(1, 'SERVICE_LOG', 'PM2_FILE'), 'utf8', (error, fileBuffer) => {
                    fileBuffer.split('\n').forEach((record) => {
                        if (record.length>0)
                            fixed_log.push(JSON.parse(record));
                    })
                    return callBack(null, fixed_log);
                });
            })
        })
    } catch (error) {
        return callBack(error.message);
    }
}
export {createLogServerE, createLogServerI, createLogDB, createLogAppS, createLogAppC, createLogAppRI, getLogParameters, getLogs, getFiles, getPM2Logs}