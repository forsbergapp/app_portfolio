const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);
const sendLog = async (logscope, loglevel, log) => {
    return await new Promise((resolve) => {
        let filename;
        let logdate = new Date();
        try{        
            log = JSON.stringify(log);
        }
        catch(err){
            console.log(err);
            console.log(log);
        }
        let month = logdate.toLocaleString("en-US", { month: "2-digit"});
        let day   = logdate.toLocaleString("en-US", { day: "2-digit"});
        let config_file_interval = ConfigGet(1, 'SERVICE_LOG', 'FILE_INTERVAL')
        if (config_file_interval=='1D')
            filename = `${logscope}_${loglevel}_${logdate.getFullYear()}${month}${day}.log`;
        else{
            if (config_file_interval=='1M')
                filename = `${logscope}_${loglevel}_${logdate.getFullYear()}${month}.log`;
            else
                filename = `${logscope}_${loglevel}_${logdate.getFullYear()}${month}.log`;
        }
        import('node:fs').then((fs) =>{
            fs.appendFile(process.cwd() + ConfigGet(0, null, 'PATH_LOG') + filename, log + '\r\n', 'utf8', (err) => {
                if (err) {
                    //if error here log to console and continue
                    console.log(err);
                    resolve();
                }
                else
                    resolve();
            });
        })
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
const LogRequestE = async (req, statusCode, statusMessage, responsetime, err) => {
    return await new Promise((resolve) => {
        let log_json_server;
        log_json_server = {logdate:             logdate(ConfigGet(1, 'SERVICE_LOG', 'DATE_FORMAT')),
                            host:               req.get('host'),
                            ip:                 req.ip,
                            requestid:          req.headers['X-Request-Id'],
                            correlationid:      req.headers['X-Correlation-Id'],
                            url:                req.originalUrl,
                            method:             req.method,
                            statusCode:         statusCode,
                            statusMessage:      statusMessage,
                            ['user-agent']:     req.headers['user-agent'], 
                            ['accept-language']:req.headers['accept-language'], 
                            referer:            req.headers['referer'],
                            size_received:      req.socket.bytesRead,
                            size_sent:          req.socket.bytesWritten,
                            responsetime:       responsetime,
                            logtext:            err.status + '-' + err.message
                        };
        resolve(sendLog(ConfigGet(1, 'SERVICE_LOG', 'SCOPE_REQUEST'), ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), log_json_server));
    })
}
const LogRequestI = async (req, statusCode, statusMessage, responsetime) => {
    return await new Promise((resolve) => {
        let log_level;
        let log_json_server;  
        let logtext;
        switch (ConfigGet(1, 'SERVICE_LOG', 'REQUEST_LEVEL')){
            case '1':{
                log_level = ConfigGet(1, 'SERVICE_LOG', 'LEVEL_INFO');
                log_json_server = {logdate: logdate(ConfigGet(1, 'SERVICE_LOG', 'DATE_FORMAT')),
                                    host:                   req.get('host'),
                                    ip:                     req.ip,
                                    requestid:              req.headers['X-Request-Id'],
                                    correlationid:          req.headers['X-Correlation-Id'],
                                    url:                    req.originalUrl,
                                    http_info:              req.protocol + '/' + req.httpVersion,
                                    method:                 req.method,
                                    statusCode:             statusCode,
                                    statusMessage:          statusMessage,
                                    ['user-agent']:         req.headers['user-agent'], 
                                    ['accept-language']:    req.headers['accept-language'], 
                                    referer:                req.headers['referer'],
                                    size_received:          req.socket.bytesRead,
                                    size_sent:              req.socket.bytesWritten,
                                    responsetime:           responsetime,
                                    logtext:                ''
                                  };
                break;
            }
            case '2':{
                log_level = ConfigGet(1, 'SERVICE_LOG', 'LEVEL_VERBOSE');
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
                log_json_server = {logdate:             logdate(ConfigGet(1, 'SERVICE_LOG', 'DATE_FORMAT')),
                                    host:               req.get('host'),
                                    ip:                 req.ip,
                                    requestid:          req.headers['X-Request-Id'],
                                    correlationid:      req.headers['X-Correlation-Id'],
                                    url:                req.originalUrl,
                                    http_info:          req.protocol + '/' + req.httpVersion,
                                    method:             req.method,
                                    statusCode:         statusCode,
                                    statusMessage:      statusMessage,
                                    ['user-agent']:     req.headers['user-agent'], 
                                    ['accept-language']:req.headers['accept-language'], 
                                    referer:            req.headers['referer'],
                                    size_received:      req.socket.bytesRead,
                                    size_sent:          req.socket.bytesWritten,
                                    responsetime:       responsetime,
                                    logtext:            logtext
                                    };
                break;
            }
            default:{
                //0 is default, other levels not implemented
                return resolve();
                break;
            }
        }   
        return resolve(sendLog(ConfigGet(1, 'SERVICE_LOG', 'SCOPE_REQUEST'), log_level, log_json_server));     
    })
}
const LogServer = async (log_level, logtext) =>{
    return await new Promise((resolve) => {
        let log_json_server = {
                                logdate: logdate(ConfigGet(1, 'SERVICE_LOG', 'DATE_FORMAT')),
                                logtext: logtext
                              };
        resolve(sendLog(ConfigGet(1, 'SERVICE_LOG', 'SCOPE_SERVER'), log_level, log_json_server));
    })
}
const LogServerI = async (logtext)=>{
    return await new Promise((resolve) => {
        resolve(LogServer(ConfigGet(1, 'SERVICE_LOG', 'LEVEL_INFO'), logtext));
    })
}
const LogServerE = async (logtext)=>{
    return await new Promise((resolve) => {
        resolve(LogServer(ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), logtext));
    })
}
const LogDBI = async (app_id, db, sql, parameters, result) => {
    return await new Promise((resolve) => {
        let log_json_db;
        let level_info;
        switch (ConfigGet(1, 'SERVICE_LOG', 'DB_LEVEL')){
            case '1':{
                level_info = ConfigGet(1, 'SERVICE_LOG', 'LEVEL_INFO');
                log_json_db = {
                                logdate:        logdate(ConfigGet(1, 'SERVICE_LOG', 'DATE_FORMAT')),
                                app_id:         app_id,
                                db:             db,
                                sql:            sql,
                                parameters:     JSON.stringify(parameters),
                                logtext:        `Rows:${result.rows==undefined?result.length:result.rows.length}`
                                };
                break;
            }
            case '2':{
                level_info = ConfigGet(1, 'SERVICE_LOG', 'LEVEL_VERBOSE');
                log_json_db = {
                                logdate:        logdate(ConfigGet(1, 'SERVICE_LOG', 'DATE_FORMAT')),
                                app_id:         app_id,
                                db:             db,
                                sql:            sql,
                                parameters:     JSON.stringify(parameters),
                                logtext:        result
                                };
                break;
            }
            default:{
                //0 is default, other levels not implemented
                return resolve();
                break;
            }
        }
        return resolve(sendLog(ConfigGet(1, 'SERVICE_LOG', 'SCOPE_DB'), ConfigGet(1, 'SERVICE_LOG', 'LEVEL_INFO'), log_json_db));
    })
}

const LogDBE = async (app_id, db, sql, parameters, result) => {
    return await new Promise((resolve) => {
        let log_json_db = {
            logdate:        logdate(ConfigGet(1, 'SERVICE_LOG', 'DATE_FORMAT')),
            app_id:         app_id,
            db:             db,
            sql:            sql,
            parameters:     JSON.stringify(parameters),
            logtext:        result
            };
        resolve(sendLog(ConfigGet(1, 'SERVICE_LOG', 'SCOPE_DB'), ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), log_json_db));
    })
}
const LogServiceI = async (app_id, service, parameters, logtext) => {
    return await new Promise((resolve) => {         
        let log_json;
        let level_info;
        switch (ConfigGet(1, 'SERVICE_LOG', 'SERVICE_LEVEL')){
            case '1':{
                level_info = ConfigGet(1, 'SERVICE_LOG', 'LEVEL_INFO')
                log_json = {logdate:    logdate(ConfigGet(1, 'SERVICE_LOG', 'DATE_FORMAT')),
                            app_id:     app_id,
                            service:    service,
                            parameters: parameters,
                            logtext:    logtext.length
                            };    
                break;
            }
            case '2':{
                level_info = ConfigGet(1, 'SERVICE_LOG', 'LEVEL_VERBOSE')
                log_json = {logdate:    logdate(ConfigGet(1, 'SERVICE_LOG', 'DATE_FORMAT')),
                            app_id:     app_id,
                            service:    service,
                            parameters: parameters,
                            logtext:    logtext
                            };    
                break;
            }
            default:{
                //0 is default, other levels not implemented
                return resolve();
                break;
            }
        }
        return resolve(sendLog(ConfigGet(1, 'SERVICE_LOG', 'SCOPE_SERVICE'), level_info, log_json));
    })
}
const LogServiceE = async (app_id, service, parameters, logtext) => {
    return await new Promise((resolve) => {    
        let log_json = {
                        logdate:    logdate(ConfigGet(1, 'SERVICE_LOG', 'DATE_FORMAT')),
                        app_id:     app_id,
                        service:    service,
                        parameters: parameters,
                        logtext:    logtext
                       };
        return resolve(sendLog(ConfigGet(1, 'SERVICE_LOG', 'SCOPE_SERVICE'), ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), log_json));
    })
}
const LogApp = async (app_id, level_info, app_filename, app_function_name, app_line, logtext) => {
    return await new Promise((resolve) => {
    let log_json ={
                    logdate:            logdate(ConfigGet(1, 'SERVICE_LOG', 'DATE_FORMAT')),
                    app_id:             app_id,
                    app_filename:       app_filename,
                    app_function_name:  app_function_name,
                    app_app_line:       app_line,
                    logtext:            logtext
                    };
    resolve(sendLog(ConfigGet(1, 'SERVICE_LOG', 'SCOPE_APP'), level_info, log_json));
    })
}
const LogAppI = async (app_id, app_filename, app_function_name, app_line, logtext) => {
    return await new Promise((resolve) => {
        resolve(LogApp(app_id, ConfigGet(1, 'SERVICE_LOG', 'LEVEL_INFO'), app_filename, app_function_name, app_line, logtext));
    })
}

const LogAppE = async (app_id, app_filename, app_function_name, app_line, logtext) => {
    return await new Promise((resolve) => {
        resolve(LogApp(app_id, ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), app_filename, app_function_name, app_line, logtext));
    })
}

const getLogParameters = (app_id, callBack) => {
    let results = {};
    results.SERVICE_LOG_SCOPE_REQUEST = ConfigGet(1, 'SERVICE_LOG', 'SCOPE_REQUEST');
    results.SERVICE_LOG_SCOPE_SERVER = ConfigGet(1, 'SERVICE_LOG', 'SCOPE_SERVER');
    results.SERVICE_LOG_SCOPE_SERVICE = ConfigGet(1, 'SERVICE_LOG', 'SCOPE_SERVICE');
    results.SERVICE_LOG_SCOPE_APP = ConfigGet(1, 'SERVICE_LOG', 'SCOPE_APP');
    results.SERVICE_LOG_SCOPE_DB = ConfigGet(1, 'SERVICE_LOG', 'SCOPE_DB');
    results.SERVICE_LOG_REQUEST_LEVEL = ConfigGet(1, 'SERVICE_LOG', 'REQUEST_LEVEL');
    results.SERVICE_LOG_SERVICE_LEVEL = ConfigGet(1, 'SERVICE_LOG', 'SERVICE_LEVEL');
    results.SERVICE_LOG_DB_LEVEL = ConfigGet(1, 'SERVICE_LOG', 'DB_LEVEL');
    results.SERVICE_LOG_LEVEL_VERBOSE = ConfigGet(1, 'SERVICE_LOG', 'LEVEL_VERBOSE');
    results.SERVICE_LOG_LEVEL_ERROR = ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR');
    results.SERVICE_LOG_LEVEL_INFO = ConfigGet(1, 'SERVICE_LOG', 'LEVEL_INFO');
    
    results.SERVICE_LOG_FILE_INTERVAL = ConfigGet(1, 'SERVICE_LOG', 'FILE_INTERVAL');
    results.SERVICE_LOG_PM2_FILE = ConfigGet(1, 'SERVICE_LOG', 'PM2_FILE');
    return callBack(null, results);
}
const getLogs = (app_id, data, callBack) => {
    let filename;
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
                switch (data.logscope){
                    case 'REQUEST':{
                        switch (parseInt(data.sort)){
                            case 0:{
                                column_sort = 'logdate';
                                break;
                            }
                            case 1:{
                                column_sort = 'host';
                                break;
                            }
                            case 2:{
                                column_sort = 'ip';
                                break;
                            }
                            case 3:{
                                column_sort = 'requestid';
                                break;
                            }
                            case 4:{
                                column_sort = 'correlationid';
                                break;
                            }
                            case 5:{
                                column_sort = 'url';
                                break;
                            }
                            case 6:{
                                column_sort = 'http_info';
                                break;
                            }
                            case 7:{
                                column_sort = 'method';
                                break;
                            }
                            case 8:{
                                column_sort = 'statusCode';
                                break;
                            }
                            case 9:{
                                column_sort = 'statusMessage';
                                break;
                            }
                            case 10:{
                                column_sort = '["user-agent"]';
                                break;
                            }
                            case 11:{
                                column_sort = '["accept-language"]';
                                break;
                            }
                            case 12:{
                                column_sort = 'referer';
                                break;
                            }
                            case 13:{
                                column_sort = 'size_received';
                                break;
                            }
                            case 14:{
                                column_sort = 'size_sent';
                                break;
                            }
                            case 15:{
                                column_sort = 'responsetime';
                                break;
                            }
                            case 16:{
                                column_sort = 'logtext';
                                break;
                            }
                            default:{
                                column_sort = 'logdate';
                            }
                        }
                        break;
                    } 
                    case 'SERVER':{
                        switch (parseInt(data.sort)){
                            case 0:{
                                column_sort = 'logdate';
                                break;
                            }
                            case 1:{
                                column_sort = 'logtext';
                                break;
                            }
                            default:{
                                column_sort = 'logdate';
                            }
                        }
                        break;
                    }
                    case 'APP':{
                        switch (parseInt(data.sort)){
                            case 0:{
                                column_sort = 'logdate';
                                break;
                            }
                            case 1:{
                                column_sort = 'app_id';
                                break;
                            }
                            case 2:{
                                column_sort = 'app_filename';
                                break;
                            }
                            case 3:{
                                column_sort = 'app_function_name';
                                break;
                            }
                            case 4:{
                                column_sort = 'app_app_line';
                                break;
                            }
                            case 5:{
                                column_sort = 'logtext';
                                break;
                            }
                            default:{
                                column_sort = 'logdate';
                            }
                        }
                        break;
                    }
                    case 'SERVICE':{
                        switch (parseInt(data.sort)){
                            case 0:{
                                column_sort = 'logdate';
                                break;
                            }
                            case 1:{
                                column_sort = 'app_id';
                                break;
                            }
                            case 2:{
                                column_sort = 'service';
                                break;
                            }
                            case 3:{
                                column_sort = 'parameters';
                                break;
                            }
                            case 4:{
                                column_sort = 'logtext';
                                break;
                            }
                            default:{
                                column_sort = 'logdate';
                            }
                        }
                        break;
                    }
                    case 'DB':{
                        switch (parseInt(data.sort)){
                            case 0:{
                                column_sort = 'logdate';
                                break;
                            }
                            case 1:{
                                column_sort = 'app_id';
                                break;
                            }
                            case 2:{
                                column_sort = 'db';
                                break;
                            }
                            case 3:{
                                column_sort = 'sql';
                                break;
                            }
                            case 4:{
                                column_sort = 'parameters';
                                break;
                            }
                            default:{
                                column_sort = 'logdate';
                            }
                        }
                        break;
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
}
const getFiles = (app_id, callBack) => {
    let logfiles =[];
    import('node:fs').then((fs) =>{
        fs.readdir(process.cwd() + ConfigGet(0, null, 'PATH_LOG'), (err, files) => {
            if (err) {
                return callBack(err, null);
            }
            let i =1;
            files.forEach(file => {
                if (file.indexOf('REQUEST_INFO_')==0||
                    file.indexOf('REQUEST_ERROR_')==0||
                    file.indexOf('REQUEST_VERBOSE_')==0||
                    file.indexOf('SERVER_INFO_')==0||
                    file.indexOf('SERVER_ERROR_')==0||
                    file.indexOf('APP_INFO_')==0||
                    file.indexOf('APP_ERROR_')==0||
                    file.indexOf('DB_INFO_')==0||
                    file.indexOf('DB_ERROR_')==0||
                    file.indexOf('SERVICE_ERROR_')==0||
                    file.indexOf('SERVICE_INFO_')==0)
                logfiles.push({"id": i++, "filename":file});
            });
            return callBack(null, logfiles);
        });
    })
}
const getPM2Logs = (app_id, callBack) => {
    try {
        let fixed_log = [];
        import('node:fs').then((fs) =>{
            fs.readFile(process.cwd() + ConfigGet(0, null, 'PATH_LOG') + ConfigGet(1, 'SERVICE_LOG', 'PM2_FILE'), 'utf8', (error, fileBuffer) => {
                fileBuffer.split('\n').forEach((record) => {
                    if (record.length>0)
                        fixed_log.push(JSON.parse(record));
                })
                return callBack(null, fixed_log);
            });
        })
    } catch (error) {
        return callBack(error.message);
    }
}
export {LogRequestE, LogRequestI, LogServerI, LogServerE, LogDBI, LogDBE, LogServiceI, LogServiceE, LogAppI, LogAppE, getLogParameters, getLogs, getFiles, getPM2Logs}