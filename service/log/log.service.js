/*
        SERVICE_LOG_SCOPE_SERVER='SERVER'		    access log error/info
	    SERVICE_LOG_SCOPE_SERVICE='SERVICE'		    sql error
	    SERVICE_LOG_SCOPE_DB='DB'			        all mysql sql in db can be logged from NodeJS
                                                    oracle sql only available in V$ views
                                                    EXECUTE dbms_monitor.session_trace_enable (binds=>true);
                                                    or
                                                    ALTER SESSION SET EVENTS
                                                    '10046 trace name context forever, level 4';

                                                    To enable event 10046, level 4 trace (bind variables) in a session with SID 9, serial number 29 use:
                                                    EXECUTE dbms_monitor.session_trace_enable (9, 29, binds=>true);
                                                    or
                                                    EXECUTE dbms_system.set_ev (9, 29, 10046, 1, '');

                                                    SELECT sql_id, sql_fulltext, optimizer_mode, optimizer_cost, parsing_schema_name,module,cpu_time,sqltype, last_load_time,bind_data
                                                    FROM v$sql
                                                    WHERE parsing_schema_name IN ({APP0_USER}, {APP1_USER}, {APP2_USER});

                                                    SELECT address, sql_id,name, position, datatype, datatype_string, value_string,con_id
                                                    FROM v$sql_bind_capture
                                                    ORDER BY sql_id, position;

        SERVICE_LOG_SCOPE_ROUTER='ROUTER'		    all calls t0 REST API
        SERVICE_LOG_SCOPE_CONTROLLER='CONTROLLER'	info log
        SERVICE_LOG_ENABLE_DB=0                     0=no, 1=yes
        SERVICE_LOG_ENABLE_ROUTER=0                 0=no, 1=yes
	    SERVICE_LOG_LEVEL_ERROR='ERROR'
	    SERVICE_LOG_LEVEL_INFO='INFO'
        SERVICE_LOG_DESTINATION=0                   0=file only
                                                    1=url only POST REST API
                                                    2=file and url
        SERVICE_LOG_URL_DESTINATION=https://hostname/REST_API_POST
        SERVICE_LOG_FILE_INTERVAL=1D                1D, 1M
	    SERVICE_LOG_FILE_PATH_SERVER=/app_portfolio/logs/
        SERVICE_LOG_DATE_FORMAT="yyyy'-'MM'-'dd'T'HH':'mm':'ss'Z'"

        createLog('ROUTER',     'ERROR',    err,    req,    res,   text='router error');
        createLog('ROUTER',     'INFO',     null,   req,    res,   text='router info');

*/
function sendLog(logscope, loglevel, log){
    let filename;
    let logdate = new Date();
    if (process.env.SERVICE_LOG_FILE_INTERVAL=='1D')
        filename = `${logscope}_${loglevel}_${logdate.getFullYear()}${logdate.getMonth()+1}${logdate.getDate()}.log`;
    else
        if (process.env.SERVICE_LOG_FILE_INTERVAL=='1M')
            filename = `${logscope}_${loglevel}_${logdate.getFullYear()}${logdate.getMonth()+1}.log`;
        else
            filename = `${logscope}_${loglevel}_${logdate.getFullYear()}${logdate.getMonth()+1}.log`;
    //ex
    //server_error_202202.log
    //server_info_202202.log
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
            `{"logscope": "${process.env.SERVICE_LOG_SCOPE_SERVER}",` +
             `"loglevel": "${log_level}",` +
             `"logdate": ${logdate},` +
             `"ip":"",` +
             `"host": "${require('os').hostname()}",` +
             `"protocol": "",` +
             `"url": "",` +
             `"method":"",` +
             `"statusCode": "",` +
             `"user-agent": "",` +
             `"accept-language": "",` +
             `"http_referer": "",` +
             `"error_status": "",` + 
             `"error_message": "",` +
             `"info": "${info}"` +
            `}`;
        }
        else{
            log_json_server  =
            `{"logscope": "${process.env.SERVICE_LOG_SCOPE_SERVER}",` +
             `"loglevel": "${log_level}",` +
             `"logdate": ${logdate},` +
             `"ip":"${req.ip}",` +
             `"host": "${req.get('host')}",` +
             `"protocol": "${req.protocol}",` +
             `"url": "${req.originalUrl}",` +
             `"method":"${req.method}",` +
             `"statusCode": ${res.statusCode},` +
             `"user-agent": "${req.headers["user-agent"]}",` +
             `"accept-language": "${req.headers["accept-language"]}",` +
             `"http_referer": "${req.headers["referer"]}",` +
             `"error_status": "${log_error_status}",` + 
             `"error_message": "${log_error_message}",` +
             `"info": ""` +
            `}`;
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
            let log_json_db = `{"logscope": "${process.env.SERVICE_LOG_SCOPE_DB}",` +
                                `"loglevel": "${process.env.SERVICE_LOG_LEVEL_INFO}",` +
                                `"logdate": ${logdate},`+ 
                                `"app_id": ${app_id},` +
                                `"logtext": "${logtext}"` + 
                                `}`;
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
                        "logdate": ${logdate},
                        "app_id": ${app_id},
                        "app_filename": "${app_filename}",
                        "app_function_name": "${app_function_name}",
                        "app_app_line": ${app_line},
                        "logtext": "${logtext}"
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
                        "logdate": ${logdate},
                        "app_id": ${app_id},
                        "app_filename": "${app_filename}",
                        "app_function_name": "${app_function_name}",
                        "app_app_line": ${app_line},
                        "logtext": "${logtext}"
                        }`;
        sendLog(process.env.SERVICE_LOG_SCOPE_SERVICE, process.env.SERVICE_LOG_LEVEL_ERROR, log_json);
	},
    createLogAppCI: (req, app_id, app_filename, app_function_name, app_line, logtext) => {
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
                        "logdate": ${logdate.toISOString()},
                        "ip":"${req.ip}",
                        "host": "${req.get('host')}",
                        "protocol": "${req.protocol}",
                        "protocol_version": "${req.versionMajor + '.' + req.versionMinor}",
                        "url": "${req.originalUrl}",
                        "method":"${req.method}",
                        "status_code": ${res.status}
                        "user-agent": "${req.headers["user-agent"]}",
                        "accept-language": "${req.headers["accept-language"]}",
                        "http_referer": "${req.headers.referer}",
                        "app_id": ${app_id},
                        "app_filename": "${app_filename}",
                        "app_function_name": "${app_function_name}",
                        "app_app_line": ${app_line},
                        "logtext": "${logtext}"
                        }`;
        sendLog(process.env.SERVICE_LOG_SCOPE_CONTROLLER, process.env.SERVICE_LOG_LEVEL_INFO, log_json);
	},
    createLogAppCE: (req, app_id, app_filename, app_function_name, app_line, logtext) => {
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
                            "logdate": ${logdate.toISOString()},
                            "ip":"${req.ip}",
                            "host": "${req.get('host')}",
                            "protocol": "${req.protocol}",
                            "protocol_version": "${req.versionMajor + '.' + req.versionMinor}",
                            "url": "${req.originalUrl}",
                            "method":"${req.method}",
                            "status_code": ${res.status}
                            "user-agent": "${req.headers["user-agent"]}",
                            "accept-language": "${req.headers["accept-language"]}",
                            "http_referer": "${req.headers.referer}",
                            "app_id": ${app_id},
                            "app_filename": "${app_filename}",
                            "app_function_name": "${app_function_name}",
                            "app_app_line": ${app_line},
                            "logtext": "${logtext}"
                            }`;
            sendLog(process.env.SERVICE_LOG_SCOPE_CONTROLLER, process.env.SERVICE_LOG_LEVEL_ERROR, log_json);
	}
};