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
        const fetch = require('node-fetch');
        fetch(process.env.SERVICE_LOG_URL_DESTINATION,{method: 'POST', body:log})
        .then(function(){
            null;
        })
    }   
}
module.exports = {

	createLogServer: (err=null, req, res, info=null) =>{
        let logdate = new Date();
        let log_error_status = '';
        let log_error_message = '';
        let log_level;
        let log_json_server;
        if (process.env.SERVICE_LOG_DATE_FORMAT!='' &&
            typeof process.env.SERVICE_LOG_DATE_FORMAT!='undefined'){
            //ex ISO8601 format: "yyyy'-'MM'-'dd'T'HH':'mm':'ss'Z'"
            logdate.format(process.env.SERVICE_LOG_DATE_FORMAT);
        }
        else
            logdate = logdate.toISOString();
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
            `{"logscope": "${process.env.SERVICE_LOG_SCOPE_SERVER}",
             "loglevel": "${log_level}",
             "logdate": "${logdate}",
             "ip":"",
             "host": "${require('os').hostname()}",
             "protocol": "",
             "url": "",
             "method":"",
             "statusCode": "",
             "user-agent": "",
             "accept-language": "",
             "http_referer": "",
             "error_status": "", 
             "error_message": "",
             "info": "${JSON.stringify(info).replaceAll('"', '\'')}"
             }`;
        }
        else{
            log_json_server  =
            `{"logscope": "${process.env.SERVICE_LOG_SCOPE_SERVER}",
             "loglevel": "${log_level}",
             "logdate": "${logdate}",
             "ip":"${req.ip}",
             "host": "${req.get('host')}",
             "protocol": "${req.protocol}",
             "url": "${req.originalUrl}",
             "method":"${req.method}",
             "statusCode": ${res.statusCode},
             "user-agent": "${req.headers["user-agent"]}",
             "accept-language": "${req.headers["accept-language"]}",
             "http_referer": "${req.headers["referer"]}",
             "error_status": "${log_error_status}",
             "error_message": "${JSON.stringify(log_error_message).replaceAll('"', '\'')}", 
             "info": ""
            }`;
        }
        sendLog(process.env.SERVICE_LOG_SCOPE_SERVER, log_level, log_json_server);
    },
    createLogDB: (app_id, logtext) =>{
        if (process.env.SERVICE_LOG_ENABLE_DB==1){
            let logdate = new Date();
            if (process.env.SERVICE_LOG_DATE_FORMAT!='' &&
                typeof process.env.SERVICE_LOG_DATE_FORMAT!='undefined'){
                //ex ISO8601 format: "yyyy'-'MM'-'dd'T'HH':'mm':'ss'Z'"
                logdate.format(process.env.SERVICE_LOG_DATE_FORMAT);
            }
            else
                logdate = logdate.toISOString();
            let log_json_db = `{"logscope": "${process.env.SERVICE_LOG_SCOPE_DB}",
                                "loglevel": "${process.env.SERVICE_LOG_LEVEL_INFO}",
                                "logdate": "${logdate}",
                                "app_id": ${app_id},
                                "logtext": "${JSON.stringify(logtext).replaceAll('"', '\'')}"
                                }`;
            sendLog(logscope, loglevel, log_json_db);
        }
    },
    createLogAppSI: (app_id, app_filename, app_function_name, app_line, logtext) => {
        let logdate = new Date();
        if (process.env.SERVICE_LOG_DATE_FORMAT!='' &&
            typeof process.env.SERVICE_LOG_DATE_FORMAT!='undefined'){
            //ex ISO8601 format: "yyyy'-'MM'-'dd'T'HH':'mm':'ss'Z'"
            logdate.format(process.env.SERVICE_LOG_DATE_FORMAT);
        }
        else
            logdate = logdate.toISOString();	
        let log_json =`{"logscope": "${process.env.SERVICE_LOG_SCOPE_SERVICE}",
                        "loglevel": "${process.env.SERVICE_LOG_LEVEL_INFO}",
                        "logdate": "${logdate}",
                        "app_id": ${app_id},
                        "app_filename": "${app_filename}",
                        "app_function_name": "${app_function_name}",
                        "app_app_line": ${app_line},
                        "logtext": "${JSON.stringify(logtext).replaceAll('"', '\'')}"
                        }`;
        sendLog(process.env.SERVICE_LOG_SCOPE_SERVICE, process.env.SERVICE_LOG_LEVEL_INFO, log_json);
	},
    createLogAppSE: (app_id, app_filename, app_function_name, app_line, logtext) => {
        let logdate = new Date();
        if (process.env.SERVICE_LOG_DATE_FORMAT!='' &&
            typeof process.env.SERVICE_LOG_DATE_FORMAT!='undefined'){
            //ex ISO8601 format: "yyyy'-'MM'-'dd'T'HH':'mm':'ss'Z'"
            logdate.format(process.env.SERVICE_LOG_DATE_FORMAT);
        }
        else
            logdate = logdate.toISOString();	
        let log_json =`{"logscope": "${process.env.SERVICE_LOG_SCOPE_SERVICE}",
                        "loglevel": "${process.env.SERVICE_LOG_LEVEL_ERROR}",
                        "logdate": "${logdate}",
                        "app_id": ${app_id},
                        "app_filename": "${app_filename}",
                        "app_function_name": "${app_function_name}",
                        "app_app_line": ${app_line},
                        "logtext": "${JSON.stringify(logtext).replaceAll('"', '\'')}"
                        }`;
        sendLog(process.env.SERVICE_LOG_SCOPE_SERVICE, process.env.SERVICE_LOG_LEVEL_ERROR, log_json);
	},
    createLogAppCI: (req, res, app_id, app_filename, app_function_name, app_line, logtext) => {
        let logdate = new Date();
        if (process.env.SERVICE_LOG_DATE_FORMAT!='' &&
            typeof process.env.SERVICE_LOG_DATE_FORMAT!='undefined'){
            //ex ISO8601 format: "yyyy'-'MM'-'dd'T'HH':'mm':'ss'Z'"
            logdate.format(process.env.SERVICE_LOG_DATE_FORMAT);
        }
        else
            logdate = logdate.toISOString();	
        let log_json =`{"logscope": "${process.env.SERVICE_LOG_SCOPE_CONTROLLER}",
                        "loglevel": "${process.env.SERVICE_LOG_LEVEL_INFO}",
                        "logdate": "${logdate}",
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
        sendLog(process.env.SERVICE_LOG_SCOPE_CONTROLLER, process.env.SERVICE_LOG_LEVEL_INFO, log_json);
	},
    createLogAppCE: (req, res, app_id, app_filename, app_function_name, app_line, logtext) => {
        let logdate = new Date();
        if (process.env.SERVICE_LOG_DATE_FORMAT!='' &&
            typeof process.env.SERVICE_LOG_DATE_FORMAT!='undefined'){
            //ex ISO8601 format: "yyyy'-'MM'-'dd'T'HH':'mm':'ss'Z'"
            logdate.format(process.env.SERVICE_LOG_DATE_FORMAT);
        }
        else
            logdate = logdate.toISOString();	
        let log_json =`{"logscope": "${process.env.SERVICE_LOG_SCOPE_CONTROLLER}",
                        "loglevel": "${process.env.SERVICE_LOG_LEVEL_ERROR}",
                        "logdate": "${logdate}",
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
        sendLog(process.env.SERVICE_LOG_SCOPE_CONTROLLER, process.env.SERVICE_LOG_LEVEL_ERROR, log_json);
	},
    createLogAppRI: (req, res, app_id, app_filename, app_function_name, app_line, logtext) => {
        if (process.env.SERVICE_LOG_ENABLE_ROUTER==1){
            let logdate = new Date();
            if (process.env.SERVICE_LOG_DATE_FORMAT!='' &&
                typeof process.env.SERVICE_LOG_DATE_FORMAT!='undefined'){
                //ex ISO8601 format: "yyyy'-'MM'-'dd'T'HH':'mm':'ss'Z'"
                logdate.format(process.env.SERVICE_LOG_DATE_FORMAT);
            }
            else
                logdate = logdate.toISOString();	
            let log_json =`{"logscope": "${process.env.SERVICE_LOG_SCOPE_ROUTER}",
                            "loglevel": "${process.env.SERVICE_LOG_LEVEL_INFO}",
                            "logdate": "${logdate}",
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