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
        filename = `${logscope}_${loglevel}_${logdate.getFullYear()}${logdate.getMonth()+1}${logdate.getDate()}.log`;
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
        axios.post(process.env.SERVICE_LOG_URL_DESTINATION, log);
        
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
                    "logtext": "${JSON.stringify(logtext).replaceAll('"', '\'')}"
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
                    "logtext": "${JSON.stringify(logtext).replaceAll('"', '\'')}"
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
             "logtext": "${JSON.stringify(info).replaceAll('"', '\'')}"
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
             "logtext": "${log_error_status}-${JSON.stringify(log_error_message).replaceAll('"', '\'')}"
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
                                "logtext": "${JSON.stringify(logtext).replaceAll('"', '\'')}"
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
                            "logtext": "${JSON.stringify(logtext).replaceAll('"', '\'')}"
                            }`;
            sendLog(process.env.SERVICE_LOG_SCOPE_ROUTER, process.env.SERVICE_LOG_LEVEL_INFO, log_json);
        }
	}
};