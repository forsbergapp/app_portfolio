function pm2log(log){
    console.log(log);
}
    
async function remote_log(log, callBack){
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
            callBack(null, 1);
        })
    }   
    else
        callBack(null, 1);
}
async function sendLog(logscope, loglevel, log, callBack){
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
        var fs = require('fs');
        fs.appendFile(process.env.SERVICE_LOG_FILE_PATH_SERVER + filename, log + '\r\n', 'utf8', (err) => {
            if (err) {
                pm2log(err);
            }
            else
                remote_log(log, (err, result)=>{
                    callBack(null, result);
                });
        });
    }
    else
        remote_log(log, (err, result)=>{
            callBack(null, result);
        });
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

	createLogServer: (app_id, info=null, err=null,
                      ip, host, protocol, originalUrl, method, statusCode, 
					  user_agent, accept_language, referer) =>{
        let log_error_status = '';
        let log_error_message = '';
        let log_level;
        let log_json_server;

        if (err==null){
            if(process.env.SERVICE_LOG_ENABLE_SERVER_VERBOSE==1)
                log_level = process.env.SERVICE_LOG_LEVEL_VERBOSE;
            else
                log_level = process.env.SERVICE_LOG_LEVEL_INFO;
        }
        else{
            log_error_status = err.status;
            log_error_message = err.message;
            log_level = process.env.SERVICE_LOG_LEVEL_ERROR;
        }
        if (info!=null){
            log_json_server = 
            `{"logdate": "${logdate()}",
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
            log_json_server  =
            `{"logdate": "${logdate()}",
             "ip":"${ip}",
             "host": "${host}",
             "protocol": "${protocol}",
             "url": "${JSON.stringify(originalUrl).replaceAll('"', '\'')}",
             "method":"${method}",
             "statusCode": ${statusCode},
             "user-agent": "${user_agent}",
             "accept-language": "${accept_language}",
             "http_referer": "${referer}",
             "app_id": "",
             "app_filename": "",
             "app_function_name": "",
             "app_app_line": "",
             "logtext": ${JSON.stringify(log_error_status + '-' + log_error_message)}
            }`;
        }
        sendLog(process.env.SERVICE_LOG_SCOPE_SERVER, log_level, log_json_server, (err, result)=>{
            null;
        });
    },
    createLogDB: (app_id, logtext) =>{
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
            sendLog(process.env.SERVICE_LOG_SCOPE_DB, process.env.SERVICE_LOG_LEVEL_INFO, log_json_db, (err, result)=>{
                null;
            });
        }
    },
    createLogAppS: (level_info, app_id, app_filename, app_function_name, app_line, logtext, callBack)=>{
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
        sendLog(process.env.SERVICE_LOG_SCOPE_SERVICE, level_info, log_json, (err, result)=>{
            callBack(null, 1);
        });
    },    
    createLogAppC: (app_id, level_info, app_filename, app_function_name, app_line, logtext,
                    ip, host, protocol, originalUrl, method, statusCode, 
                    user_agent, accept_language, referer, callBack) =>{
        let log_json =`{"logdate": "${logdate()}",
            "ip":"${ip}",
            "host": "${host}",
            "protocol": "${protocol}",
            "url": "${originalUrl}",
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
        sendLog(process.env.SERVICE_LOG_SCOPE_CONTROLLER, level_info, log_json, (err, result)=>{
            callBack(null, 1);
        });
    },
    createLogAppRI: (app_id, app_filename, app_function_name, app_line, logtext,
                     ip, host, protocol, originalUrl, method, statusCode, 
                    user_agent, accept_language, referer) => {
        if (process.env.SERVICE_LOG_ENABLE_ROUTER==1){
            let log_json =`{"logdate": "${logdate()}",
                            "ip":"${ip}",
                            "host": "${host}",
                            "protocol": "${protocol}",
                            "url": "${originalUrl}",
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
            sendLog(process.env.SERVICE_LOG_SCOPE_ROUTER, process.env.SERVICE_LOG_LEVEL_INFO, log_json, (err, result)=>{
               null;
            });
        }
	},
    getParameters: (callBack) => {
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
    getLogs: (data, callBack) => {
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
            fs.readFile(process.env.SERVICE_LOG_FILE_PATH_SERVER + filename, 'utf8', (error, fileBuffer) => {
                loggerror = 2;
                if (error)
                    return callBack(null, fixed_log);
                else{
                    fileBuffer.toString().split('\r\n').forEach(function (record) {
                        if (record.length>0){
                            let log_app_id = JSON.parse(record).app_id;
                            if (log_app_id == parseInt(data.select_app_id) || data.select_app_id=='')
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
    getFiles: (callBack) => {
        let fs = require('fs');
        let logfiles =[];
        fs.readdir(process.env.SERVICE_LOG_FILE_PATH_SERVER, (err, files) => {
            if (err) {
                return callBack(err, null);
            }
            files.forEach(file => {
                if (file.indexOf('CONTROLLER_INFO_')==0||
                    file.indexOf('DB_INFO_')==0||
                    file.indexOf('ROUTER_INFO_')==0||
                    file.indexOf('SERVER_ERROR_')==0||
                    file.indexOf('SERVER_INFO_')==0||
                    file.indexOf('SERVER_VERBOSE_')==0||
                    file.indexOf('SERVICE_ERROR_')==0||
                    file.indexOf('SERVICE_INFO_')==0)
                logfiles.push(file);
            });
            return callBack(null, logfiles);
        });
    },
    getPM2Logs: (callBack) => {
        let fs = require('fs');
        try {
            let fixed_log = [];
            fs.readFile(process.env.SERVICE_LOG_FILE_PATH_SERVER + process.env.SERVICE_LOG_PM2_FILE, 'utf8', (error, fileBuffer) => {
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