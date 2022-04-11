function sendLog(logscope, loglevel, log){
    let filename;
    let logdate = new Date();
    //make log nice and compact
    try{
        log = JSON.stringify(JSON.parse(log));
    }
    catch(err){
        console.log(err)
        console.log(log);
    }
    
    if (process.env.SERVICE_LOG_FILE_INTERVAL=='1D')
        filename = `${logscope}_${loglevel}_${logdate.getFullYear()}${logdate.getMonth()+1}${logdate.toLocaleString("en-US", { day: "2-digit"})}.log`;
    else
        if (process.env.SERVICE_LOG_FILE_INTERVAL=='1M')
            filename = `${logscope}_${loglevel}_${logdate.getFullYear()}${logdate.getMonth()+1}.log`;
        else
            filename = `${logscope}_${loglevel}_${logdate.getFullYear()}${logdate.getMonth()+1}.log`;
    if (process.env.SERVICE_LOG_DESTINATION==0 ||
        process.env.SERVICE_LOG_DESTINATION==2){
        //file destination
        var fs = require('fs');
        fs.appendFile(process.env.SERVICE_LOG_FILE_PATH_SERVER + filename, log + '\r\n', 'utf8', (err) => {
            if (err) {
              console.log(err);
            }
        });
    }
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
        axios.post(process.env.SERVICE_LOG_URL_DESTINATION, url_log);
        
    }   
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
function createLogAppS(level_info, app_id, app_filename, app_function_name, app_line, logtext){
    
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
    sendLog(process.env.SERVICE_LOG_SCOPE_SERVICE, level_info, log_json);
}
function createLogAppC(level_info, req, res, app_id, app_filename, app_function_name, app_line, logtext){
    let log_json =`{"logdate": "${logdate()}",
                    "ip":"${req.ip}",
                    "host": "${req.get('host')}",
                    "protocol": "${req.protocol}",
                    "url": "${req.originalUrl}",
                    "method":"${req.method}",
                    "status_code": ${res.statusCode},
                    "user-agent": "${req.headers["user-agent"]}",
                    "accept-language": "${req.headers["accept-language"]}",
                    "http_referer": "${req.headers.referer}",
                    "app_id": ${app_id},
                    "app_filename": "${app_filename}",
                    "app_function_name": "${app_function_name}",
                    "app_app_line": ${app_line},
                    "logtext": ${JSON.stringify(logtext)}
                    }`;
    sendLog(process.env.SERVICE_LOG_SCOPE_CONTROLLER, level_info, log_json);
}
module.exports = {

	createLogServer: (err=null, req, res, info=null) =>{
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
             "ip":"${req.ip}",
             "host": "${req.get('host')}",
             "protocol": "${req.protocol}",
             "url": "${JSON.stringify(req.originalUrl).replaceAll('"', '\'')}",
             "method":"${req.method}",
             "statusCode": ${res.statusCode},
             "user-agent": "${req.headers["user-agent"]}",
             "accept-language": "${req.headers["accept-language"]}",
             "http_referer": "${req.headers["referer"]}",
             "app_id": "",
             "app_filename": "",
             "app_function_name": "",
             "app_app_line": "",
             "logtext": ${JSON.stringify(log_error_status + '-' + log_error_message)}
            }`;
        }
        sendLog(process.env.SERVICE_LOG_SCOPE_SERVER, log_level, log_json_server);
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
            sendLog(process.env.SERVICE_LOG_SCOPE_DB, process.env.SERVICE_LOG_LEVEL_INFO, log_json_db);
        }
    },
    createLogAppSI: (app_id, app_filename, app_function_name, app_line, logtext) => {
        createLogAppS(process.env.SERVICE_LOG_LEVEL_INFO, app_id, app_filename, app_function_name, app_line, logtext);
	},
    createLogAppSE: (app_id, app_filename, app_function_name, app_line, logtext) => {
        createLogAppS(process.env.SERVICE_LOG_LEVEL_ERROR, app_id, app_filename, app_function_name, app_line, logtext);
	},
    createLogAppCI: (req, res, app_id, app_filename, app_function_name, app_line, logtext) => {
        createLogAppC(process.env.SERVICE_LOG_LEVEL_INFO, req, res, app_id, app_filename, app_function_name, app_line, logtext);
	},
    createLogAppCE: (req, res, app_id, app_filename, app_function_name, app_line, logtext) => {
        createLogAppC(process.env.SERVICE_LOG_LEVEL_ERROR, req, res, app_id, app_filename, app_function_name, app_line, logtext);
	},
    createLogAppRI: (req, res, app_id, app_filename, app_function_name, app_line, logtext) => {
        if (process.env.SERVICE_LOG_ENABLE_ROUTER==1){
            let log_json =`{"logdate": "${logdate()}",
                            "ip":"${req.ip}",
                            "host": "${req.get('host')}",
                            "protocol": "${req.protocol}",
                            "url": "${req.originalUrl}",
                            "method":"${req.method}",
                            "status_code": ${res.statusCode},
                            "user-agent": "${req.headers["user-agent"]}",
                            "accept-language": "${req.headers["accept-language"]}",
                            "http_referer": "${req.headers.referer}",
                            "app_id": "${app_id}",
                            "app_filename": "${app_filename}",
                            "app_function_name": "${app_function_name}",
                            "app_app_line": ${app_line},
                            "logtext": ${JSON.stringify(logtext)}
                            }`;
            sendLog(process.env.SERVICE_LOG_SCOPE_ROUTER, process.env.SERVICE_LOG_LEVEL_INFO, log_json);
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
        
        return callBack(null, results);
    },
    getLogs: (data, callBack) => {
        var fs = require('fs');
        let filename;
        if (process.env.SERVICE_LOG_FILE_INTERVAL=='1D')
            filename = `${data.logscope}_${data.loglevel}_${data.year}${data.month}${data.day}.log`;
        else
            if (process.env.SERVICE_LOG_FILE_INTERVAL=='1M')
                filename = `${data.logscope}_${data.loglevel}_${data.year}${data.month}.log`;
            else
                filename = `${data.logscope}_${data.loglevel}_${data.year}${data.month}.log`;
        let log; 
        try {
            log = fs.readFileSync(process.env.SERVICE_LOG_FILE_PATH_SERVER + filename , 'utf8');    
            //logs save with in JSON format {}\r\n for each row, replace \r\n with ,
            log = log.replace(/\r\n/g,',');
            //remove last ,
            log = log.substring(0, log.length - 1);
        } catch (error) {
            log = '';
        }
        
        return callBack(null, log);
    }
};