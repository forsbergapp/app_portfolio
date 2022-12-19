function pm2log(log){
    console.log(log);
}
    
async function remote_log(log){
    return await new Promise(function (resolve){ 
        if (process.env.SERVICE_LOG_DESTINATION==1 ||
            process.env.SERVICE_LOG_DESTINATION==2){
            //url destination
            const axios = require('axios');
            const headers = { 
                'Authorization': 'Basic ' + btoa(process.env.SERVICE_LOG_URL_DESTINATION_USERNAME + ':' + process.env.SERVICE_LOG_URL_DESTINATION_PASSWORD)
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
            axios.post(process.env.SERVICE_LOG_URL_DESTINATION, url_log)
            .then(function(){
                resolve();
            })
        }   
        else
            resolve();
    })
    
}
async function sendLog(logscope, loglevel, log){
    return await new Promise(function (resolve){ 
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
        if (process.env.SERVICE_LOG_FILE_INTERVAL=='1D')
            filename = `${logscope}_${loglevel}_${logdate.getFullYear()}${month}${day}.log`;
        else
            if (process.env.SERVICE_LOG_FILE_INTERVAL=='1M')
                filename = `${logscope}_${loglevel}_${logdate.getFullYear()}${month}.log`;
            else
                filename = `${logscope}_${loglevel}_${logdate.getFullYear()}${month}.log`;
        if (process.env.SERVICE_LOG_DESTINATION==0 ||
            process.env.SERVICE_LOG_DESTINATION==2){
            //file destination
            let fs = require('fs');
            fs.appendFile(global.SERVER_ROOT + process.env.SERVICE_LOG_FILE_PATH_SERVER + filename, log + '\r\n', 'utf8', (err) => {
                if (err) {
                    //if error here ignore and continue, where else should log file be saved?
                    pm2log(err);
                    resolve();
                }
                else
                    resolve(remote_log(log));
            });
        }
        else
            resolve(remote_log(log));
    })
}
function logdate(){
    let logdate = new Date();
    if (process.env.SERVICE_LOG_DATE_FORMAT!='' &&
        typeof process.env.SERVICE_LOG_DATE_FORMAT!='undefined'){
        //ex ISO8601 format: "yyyy'-'MM'-'dd'T'HH':'mm':'ss'Z'"
        logdate.format(process.env.SERVICE_LOG_DATE_FORMAT);
    }
    else
        logdate = logdate.toISOString();
    return logdate;
}
module.exports = {
	setLogVariables:() =>{
		//global declaration
        Object.defineProperty(global, '__stack', {
            get: function() {
                    var orig = Error.prepareStackTrace;
                    Error.prepareStackTrace = function(_, stack) {
                        return stack;
                    };
                    var err = new Error;
                    Error.captureStackTrace(err, arguments.callee);
                    var stack = err.stack;
                    Error.prepareStackTrace = orig;
                    return stack;
                }
        });
        Object.defineProperty(global, '__appline', {
            get: function() {
                    return __stack[1].getLineNumber();
                }
        });
        Object.defineProperty(global, '__appfunction', {
            get: function() {
                    return __stack[1].getFunctionName();
                }
        });
        Object.defineProperty(global, '__appfilename', {
            get: function() {
                let filename = __stack[1].getFileName();
                return filename.substring(__dirname.length).replace(/\\/g, '/');
                } 
        });
	},
    createLogServerE: async (ip, host, protocol, originalUrl, method, statusCode, 
					   user_agent, accept_language, referer, err) =>{
        return await new Promise(function (resolve){ 
            let log_json_server;
            log_json_server = `{"logdate": "${logdate()}",
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
            resolve(sendLog(process.env.SERVICE_LOG_SCOPE_SERVER, process.env.SERVICE_LOG_LEVEL_ERROR, log_json_server));
        })
    },
	createLogServerI: async (info=null,
                             ip, host, protocol, originalUrl, method, 
                             statusCode, statusMessage,
                             user_agent, accept_language, referer) =>{
        return await new Promise(function (resolve){ 
            let log_level;
            let log_json_server;  
            let logtext;  
            if(process.env.SERVICE_LOG_ENABLE_SERVER_VERBOSE==1)
                log_level = process.env.SERVICE_LOG_LEVEL_VERBOSE;
            else
                log_level = process.env.SERVICE_LOG_LEVEL_INFO;
            if (info!=null){
                log_json_server = `{"logdate": "${logdate()}",
                                    "ip":"",
                                    "host": "${require('os').hostname()}",
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
                                    "logtext": ${JSON.stringify(info)}
                                    }`;
            }
            else{
                if (typeof statusMessage=='undefined' || statusMessage=='')
                    logtext = '""';
                else
                    logtext = JSON.stringify(statusMessage);
                log_json_server = `{"logdate": "${logdate()}",
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
            resolve(sendLog(process.env.SERVICE_LOG_SCOPE_SERVER, log_level, log_json_server));
        })
    },
    createLogDB: async (app_id, logtext) =>{
        return await new Promise(function (resolve){ 
            if (process.env.SERVICE_LOG_ENABLE_DB==1){
                let log_json_db = `{"logdate": "${logdate()}",
                                    "ip":"",
                                    "host": "${require('os').hostname()}",
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
                resolve(sendLog(process.env.SERVICE_LOG_SCOPE_DB, process.env.SERVICE_LOG_LEVEL_INFO, log_json_db));
            }
            else
                resolve();
        })
    },
    createLogAppS: async (level_info, app_id, app_filename, app_function_name, app_line, logtext)=>{
        return await new Promise(function (resolve){ 
            let log_json =`{"logdate": "${logdate()}",
                            "ip":"",
                            "host": "${require('os').hostname()}",
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
            resolve(sendLog(process.env.SERVICE_LOG_SCOPE_SERVICE, level_info, log_json));
        })
    },    
    createLogAppC: async (app_id, level_info, app_filename, app_function_name, app_line, logtext,
                    ip, host, protocol, originalUrl, method, statusCode, 
                    user_agent, accept_language, referer) =>{
        return await new Promise(function (resolve){ 
            let log_json =`{"logdate": "${logdate()}",
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
            resolve(sendLog(process.env.SERVICE_LOG_SCOPE_CONTROLLER, level_info, log_json));
        })
    },
    createLogAppRI: async (app_id, app_filename, app_function_name, app_line, logtext,
                     ip, host, protocol, originalUrl, method, statusCode, 
                    user_agent, accept_language, referer) => {
        return await new Promise(function (resolve){  
            if (process.env.SERVICE_LOG_ENABLE_ROUTER==1){
                let log_json =`{"logdate": "${logdate()}",
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
                                "logtext": ${JSON.stringify(logtext)}
                                }`;
                resolve(sendLog(process.env.SERVICE_LOG_SCOPE_ROUTER, process.env.SERVICE_LOG_LEVEL_INFO, log_json));
            }
            else
                resolve();
        })
	},
    getParameters: (app_id, callBack) => {
        let results = {};
        results.SERVICE_LOG_SCOPE_SERVER = process.env.SERVICE_LOG_SCOPE_SERVER;
        results.SERVICE_LOG_SCOPE_SERVICE = process.env.SERVICE_LOG_SCOPE_SERVICE;
        results.SERVICE_LOG_SCOPE_DB = process.env.SERVICE_LOG_SCOPE_DB;
        results.SERVICE_LOG_SCOPE_ROUTER = process.env.SERVICE_LOG_SCOPE_ROUTER;
        results.SERVICE_LOG_SCOPE_CONTROLLER = process.env.SERVICE_LOG_SCOPE_CONTROLLER;
        results.SERVICE_LOG_ENABLE_SERVER_INFO = process.env.SERVICE_LOG_ENABLE_SERVER_INFO;
        results.SERVICE_LOG_ENABLE_SERVER_VERBOSE = process.env.SERVICE_LOG_ENABLE_SERVER_VERBOSE;
        
        results.SERVICE_LOG_ENABLE_DB = process.env.SERVICE_LOG_ENABLE_DB;
        results.SERVICE_LOG_ENABLE_ROUTER = process.env.SERVICE_LOG_ENABLE_ROUTER;
        results.SERVICE_LOG_LEVEL_VERBOSE = process.env.SERVICE_LOG_LEVEL_VERBOSE;
        results.SERVICE_LOG_LEVEL_ERROR = process.env.SERVICE_LOG_LEVEL_ERROR;
        results.SERVICE_LOG_LEVEL_INFO = process.env.SERVICE_LOG_LEVEL_INFO;
        
        results.SERVICE_LOG_FILE_INTERVAL = process.env.SERVICE_LOG_FILE_INTERVAL;
        results.SERVICE_LOG_PM2_FILE = process.env.SERVICE_LOG_PM2_FILE;
        return callBack(null, results);
    },
    getLogs: (app_id, data, callBack) => {
        let fs = require('fs');
        let filename;

        if (parseInt(data.month) <10)
            data.month = '0' + data.month;
        if (process.env.SERVICE_LOG_FILE_INTERVAL=='1D'){
            if (parseInt(data.day) <10)
                data.day = '0' + data.day;
            filename = `${data.logscope}_${data.loglevel}_${data.year}${data.month}${data.day}.log`;
        }
        else
            if (process.env.SERVICE_LOG_FILE_INTERVAL=='1M')
                filename = `${data.logscope}_${data.loglevel}_${data.year}${data.month}.log`;
            else
                filename = `${data.logscope}_${data.loglevel}_${data.year}${data.month}.log`;
        let fixed_log = [];
        let loggerror = 0;
        try {
            loggerror = 1;
            fs.readFile(global.SERVER_ROOT + process.env.SERVICE_LOG_FILE_PATH_SERVER + filename, 'utf8', (error, fileBuffer) => {
                loggerror = 2;
                if (error)
                    return callBack(null, fixed_log);
                else{
                    fileBuffer.toString().split('\r\n').forEach(function (record) {
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
                function sortByProperty(property, order_by){
                    return function(a,b){  
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
        } catch (error) {
            if (loggerror == 2)
                return callBack(error.message);
        }
    },
    getFiles: (app_id, callBack) => {
        let fs = require('fs');
        let logfiles =[];
        fs.readdir(global.SERVER_ROOT + process.env.SERVICE_LOG_FILE_PATH_SERVER, (err, files) => {
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
    },
    getPM2Logs: (app_id, callBack) => {
        let fs = require('fs');
        try {
            let fixed_log = [];
            fs.readFile(global.SERVER_ROOT + process.env.SERVICE_LOG_FILE_PATH_SERVER + process.env.SERVICE_LOG_PM2_FILE, 'utf8', (error, fileBuffer) => {
                fileBuffer.split('\n').forEach(function (record) {
                    if (record.length>0)
                        fixed_log.push(JSON.parse(record));
                })
                return callBack(null, fixed_log);
            });    
        } catch (error) {
            return callBack(error.message);
        }
    }
};