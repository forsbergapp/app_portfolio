/** @module server/log */

// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

const {ConfigGet, ConfigGetInit} = await import(`file://${process.cwd()}/server/config.service.js`);
const fs = await import('node:fs');
/**
 * Get log parameters
 */
 const getLogParameters = () => {
    /**@type{Types.admin_log_parameters} */
    const result = {};
    result.SERVICE_LOG_SCOPE_REQUEST = ConfigGet('SERVICE_LOG', 'SCOPE_REQUEST');
    result.SERVICE_LOG_SCOPE_SERVER = ConfigGet('SERVICE_LOG', 'SCOPE_SERVER');
    result.SERVICE_LOG_SCOPE_SERVICE = ConfigGet('SERVICE_LOG', 'SCOPE_SERVICE');
    result.SERVICE_LOG_SCOPE_APP = ConfigGet('SERVICE_LOG', 'SCOPE_APP');
    result.SERVICE_LOG_SCOPE_DB = ConfigGet('SERVICE_LOG', 'SCOPE_DB');
    result.SERVICE_LOG_REQUEST_LEVEL = ConfigGet('SERVICE_LOG', 'REQUEST_LEVEL');
    result.SERVICE_LOG_SERVICE_LEVEL = ConfigGet('SERVICE_LOG', 'SERVICE_LEVEL');
    result.SERVICE_LOG_DB_LEVEL = ConfigGet('SERVICE_LOG', 'DB_LEVEL');
    result.SERVICE_LOG_LEVEL_VERBOSE = ConfigGet('SERVICE_LOG', 'LEVEL_VERBOSE');
    result.SERVICE_LOG_LEVEL_ERROR = ConfigGet('SERVICE_LOG', 'LEVEL_ERROR');
    result.SERVICE_LOG_LEVEL_INFO = ConfigGet('SERVICE_LOG', 'LEVEL_INFO');  
    result.SERVICE_LOG_FILE_INTERVAL = ConfigGet('SERVICE_LOG', 'FILE_INTERVAL');
    return result;
};
/**
 * Send log
 * @param {string} logscope 
 * @param {string} loglevel 
 * @param {object} log 
 * @returns {Promise.<null>}
 */
 const sendLog = async (logscope, loglevel, log) => {
    return await new Promise((resolve) => {
        try{        
            let filename = '';
            const logdate = new Date();
            const log_json = JSON.stringify(log);
            const month = logdate.toLocaleString('en-US', { month: '2-digit'});
            const day   = logdate.toLocaleString('en-US', { day: '2-digit'});
            const config_file_interval = ConfigGet('SERVICE_LOG', 'FILE_INTERVAL');
            if (config_file_interval=='1D')
                filename = `${logscope}_${loglevel}_${logdate.getFullYear()}${month}${day}.log`;
            else{
                if (config_file_interval=='1M')
                    filename = `${logscope}_${loglevel}_${logdate.getFullYear()}${month}.log`;
                else
                    filename = `${logscope}_${loglevel}_${logdate.getFullYear()}${month}.log`;
            }
            fs.appendFile(process.cwd() + ConfigGetInit('PATH_LOG') + filename, log_json + '\r\n', 'utf8', (err) => {
                if (err) {
                    console.log(err);
                    console.log(log);
                    resolve(null);
                }
                else
                    resolve(null);
            });
        }
        catch(err){
            console.log(err);
            console.log(log);
            resolve(null);
        }
    });
};
/**
 * Log date format
 * @param {string} date_format 
 * @returns {string}
 */
const logdate = (date_format) => {
    const logdate = new Date();
    if (date_format!='' && typeof date_format!='undefined'){
        //ex ISO8601 format: "yyyy'-'MM'-'dd'T'HH':'mm':'ss'Z'"
        /**@ts-ignore */
        return logdate.format(date_format);
    }
    else
        return logdate.toISOString();
};
/**
 * Log request error
 * @param {Types.req} req 
 * @param {number} statusCode 
 * @param {string} statusMessage 
 * @param {number} responsetime 
 * @param {Types.error} err 
 * @returns 
 */
const LogRequestE = async (req, statusCode, statusMessage, responsetime, err) => {
    return await new Promise((resolve) => {
        const log_json_server = {   logdate:            logdate(ConfigGet('SERVICE_LOG', 'DATE_FORMAT')),
                                    host:               req.host,
                                    ip:                 req.ip,
                                    requestid:          req.headers['X-Request-Id'],
                                    correlationid:      req.headers['X-Correlation-Id'],
                                    url:                req.originalUrl,
                                    method:             req.method,
                                    statusCode:         statusCode,
                                    statusMessage:      statusMessage,
                                    ['user-agent']:     req.headers['user-agent'], 
                                    ['accept-language']:req.headers['accept-language'], 
                                    referer:            req.headers.referer,
                                    size_received:      req.socket.bytesRead,
                                    size_sent:          req.socket.bytesWritten,
                                    responsetime:       responsetime,
                                    logtext:            err.status + '-' + err.message
                                };
        resolve(sendLog(ConfigGet('SERVICE_LOG', 'SCOPE_REQUEST'), ConfigGet('SERVICE_LOG', 'LEVEL_ERROR'), log_json_server));
    });
};
/**
 * Log request Info
 * @param {Types.req} req 
 * @param {number} statusCode 
 * @param {string} statusMessage 
 * @param {number} responsetime 
 * @returns {Promise.<null>}
 */
const LogRequestI = async (req, statusCode, statusMessage, responsetime) => {
    return await new Promise((resolve) => {
        let log_level = '';
        let log_json_server = {};
        switch (ConfigGet('SERVICE_LOG', 'REQUEST_LEVEL')){
            case '1':{
                log_level = ConfigGet('SERVICE_LOG', 'LEVEL_INFO');
                log_json_server = { logdate:            logdate(ConfigGet('SERVICE_LOG', 'DATE_FORMAT')),
                                    host:               req.host,
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
                                    referer:            req.headers.referer,
                                    size_received:      req.socket.bytesRead,
                                    size_sent:          req.socket.bytesWritten,
                                    responsetime:       responsetime,
                                    logtext:            ''
                                  };
                break;
            }
            case '2':{
                log_level = ConfigGet('SERVICE_LOG', 'LEVEL_VERBOSE');
                /**@type{Types.req_verbose} */
                const logtext_req = Object.assign({}, req);
                const getCircularReplacer = () => {
                    const seen = new WeakSet();
                    return (/**@type{*}*/key, /**@type{*}*/value) => {
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
                if (logtext_req.body.password)
                    logtext_req.body.password = null;
                //remove Basic authorization with password
                logtext_req.rawHeaders.forEach((/**@type{string}*/rawheader,/**@type{number}*/index)=>{
                    if (rawheader.startsWith('Basic'))
                        logtext_req.rawHeaders[index] = 'Basic ...';
                });
                log_json_server = { logdate:            logdate(ConfigGet('SERVICE_LOG', 'DATE_FORMAT')),
                                    host:               req.host,
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
                                    referer:            req.headers.referer,
                                    size_received:      req.socket.bytesRead,
                                    size_sent:          req.socket.bytesWritten,
                                    responsetime:       responsetime,
                                    logtext:            'req:' + JSON.stringify(logtext_req, getCircularReplacer())
                                    };
                break;
            }
            default:{
                //0 is default, other levels not implemented
                return resolve(null);
            }
        }   
        return resolve(sendLog(ConfigGet('SERVICE_LOG', 'SCOPE_REQUEST'), log_level, log_json_server));     
    });
};
/**
 *  Log server
 * @param {string} log_level 
 * @param {string} logtext 
 * @returns {Promise.<null>}
 */
const LogServer = async (log_level, logtext) =>{
    return await new Promise((resolve) => {
        const log_json_server = {
                                logdate: logdate(ConfigGet('SERVICE_LOG', 'DATE_FORMAT')),
                                logtext: logtext
                              };
        resolve(sendLog(ConfigGet('SERVICE_LOG', 'SCOPE_SERVER'), log_level, log_json_server));
    });
};
/**
 * Log server Info
 * @param {*} logtext 
 * @returns {Promise.<null>}
 */
const LogServerI = async (logtext)=>{
    return await new Promise((resolve) => {
        resolve(LogServer(ConfigGet('SERVICE_LOG', 'LEVEL_INFO'), logtext));
    });
};
/**
 * Log server error
 * @param {*} logtext 
 * @returns {Promise.<null>}
 */
const LogServerE = async (logtext)=>{
    return await new Promise((resolve) => {
        resolve(LogServer(ConfigGet('SERVICE_LOG', 'LEVEL_ERROR'), logtext));
    });
};
/**
 * Log DB Info
 * @param {number} app_id 
 * @param {number} db 
 * @param {string} sql 
 * @param {object} parameters 
 * @param {Types.db_query_result} result 
 * @returns {Promise.<null>}
 */
const LogDBI = async (app_id, db, sql, parameters, result) => {
    return await new Promise((resolve) => {
        let log_json_db;
        let level_info;
        switch (ConfigGet('SERVICE_LOG', 'DB_LEVEL')){
            case '1':{
                level_info = ConfigGet('SERVICE_LOG', 'LEVEL_INFO');
                log_json_db = {
                                logdate:        logdate(ConfigGet('SERVICE_LOG', 'DATE_FORMAT')),
                                app_id:         app_id,
                                db:             db,
                                sql:            sql,
                                parameters:     JSON.stringify(parameters),
                                logtext:        `Rows:${result.affectedRows?result.affectedRows:result.length}`
                                };
                break;
            }
            case '2':{
                level_info = ConfigGet('SERVICE_LOG', 'LEVEL_VERBOSE');
                log_json_db = {
                                logdate:        logdate(ConfigGet('SERVICE_LOG', 'DATE_FORMAT')),
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
                return resolve(null);
            }
        }
        return resolve(sendLog(ConfigGet('SERVICE_LOG', 'SCOPE_DB'), level_info, log_json_db));
    });
};
/**
 * Log DB Error
 * @param {number} app_id 
 * @param {number} db 
 * @param {string} sql 
 * @param {object} parameters 
 * @param {Types.db_query_result_error} result 
 * @returns {Promise.<null>}
 */
const LogDBE = async (app_id, db, sql, parameters, result) => {
    return await new Promise((resolve) => {
        const log_json_db = {
            logdate:        logdate(ConfigGet('SERVICE_LOG', 'DATE_FORMAT')),
            app_id:         app_id,
            db:             db,
            sql:            sql,
            parameters:     JSON.stringify(parameters),
            logtext:        result
            };
        resolve(sendLog(ConfigGet('SERVICE_LOG', 'SCOPE_DB'), ConfigGet('SERVICE_LOG', 'LEVEL_ERROR'), log_json_db));
    });
};
/**
 * Log service Info
 * @param {number} app_id 
 * @param {string} service 
 * @param {object} parameters 
 * @param {string} logtext 
 * @returns {Promise.<null>}
 */
const LogServiceI = async (app_id, service, parameters, logtext) => {
    return await new Promise((resolve) => {         
        let log_json;
        let level_info;
        switch (ConfigGet('SERVICE_LOG', 'SERVICE_LEVEL')){
            case '1':{
                level_info = ConfigGet('SERVICE_LOG', 'LEVEL_INFO');
                log_json = {logdate:    logdate(ConfigGet('SERVICE_LOG', 'DATE_FORMAT')),
                            app_id:     app_id,
                            service:    service,
                            parameters: parameters,
                            logtext:    logtext
                            };    
                break;
            }
            case '2':{
                level_info = ConfigGet('SERVICE_LOG', 'LEVEL_VERBOSE');
                log_json = {logdate:    logdate(ConfigGet('SERVICE_LOG', 'DATE_FORMAT')),
                            app_id:     app_id,
                            service:    service,
                            parameters: parameters,
                            logtext:    logtext
                            };    
                break;
            }
            default:{
                //0 is default, other levels not implemented
                return resolve(null);
            }
        }
        return resolve(sendLog(ConfigGet('SERVICE_LOG', 'SCOPE_SERVICE'), level_info, log_json));
    });
};
/**
 * Log service Error
 * @param {number} app_id 
 * @param {string} service 
 * @param {object} parameters 
 * @param {string} logtext 
 * @returns {Promise.<null>}
 */
const LogServiceE = async (app_id, service, parameters, logtext) => {
    return await new Promise((resolve) => {    
        const log_json = {
                        logdate:    logdate(ConfigGet('SERVICE_LOG', 'DATE_FORMAT')),
                        app_id:     app_id,
                        service:    service,
                        parameters: parameters,
                        logtext:    logtext
                       };
        return resolve(sendLog(ConfigGet('SERVICE_LOG', 'SCOPE_SERVICE'), ConfigGet('SERVICE_LOG', 'LEVEL_ERROR'), log_json));
    });
};
/**
 * Log App
 * @param {number} app_id 
 * @param {string} level_info 
 * @param {string} app_filename 
 * @param {string} app_function_name 
 * @param {number} app_line 
 * @param {string} logtext 
 * @returns {Promise.<null>}
 */
const LogApp = async (app_id, level_info, app_filename, app_function_name, app_line, logtext) => {
    return await new Promise((resolve) => {
    const log_json ={
                    logdate:            logdate(ConfigGet('SERVICE_LOG', 'DATE_FORMAT')),
                    app_id:             app_id,
                    app_filename:       app_filename,
                    app_function_name:  app_function_name,
                    app_app_line:       app_line,
                    logtext:            logtext
                    };
    resolve(sendLog(ConfigGet('SERVICE_LOG', 'SCOPE_APP'), level_info, log_json));
    });
};
/**
 * Log App Info
 * @param {number} app_id 
 * @param {string} app_filename 
 * @param {string} app_function_name 
 * @param {number} app_line 
 * @param {string} logtext 
 * @returns {Promise.<null>}
 */
const LogAppI = async (app_id, app_filename, app_function_name, app_line, logtext) => {
    return await new Promise((resolve) => {
        if (ConfigGet('SERVICE_AUTH', 'ENABLE_APPLOG')=='1')
            resolve(LogApp(app_id, ConfigGet('SERVICE_LOG', 'LEVEL_INFO'), app_filename, app_function_name, app_line, logtext));
        else
            resolve(null);
    });
};
/**
 * Logg App Error
 * @param {number} app_id 
 * @param {string} app_filename 
 * @param {string} app_function_name 
 * @param {number} app_line 
 * @param {string} logtext 
 * @returns {Promise.<null>}
 */
const LogAppE = async (app_id, app_filename, app_function_name, app_line, logtext) => {
    return await new Promise((resolve) => {
        resolve(LogApp(app_id, ConfigGet('SERVICE_LOG', 'LEVEL_ERROR'), app_filename, app_function_name, app_line, logtext));
    });
};

/**
 * Get logs
 * @param {Types.admin_log_data_parameters} data
 */
const getLogs = async (data) => {
    const fs = await import('node:fs');
    return new Promise ((resolve)=>{
        let filename;
        if (Number(data.month) <10)
            data.month = '0' + data.month;
        if (ConfigGet('SERVICE_LOG', 'FILE_INTERVAL')=='1D'){
            if (Number(data.day) <10)
                data.day = '0' + data.day;
            filename = `${data.logscope}_${data.loglevel}_${data.year}${data.month}${data.day}.log`;
        }
        else
            if (ConfigGet('SERVICE_LOG', 'FILE_INTERVAL')=='1M')
                filename = `${data.logscope}_${data.loglevel}_${data.year}${data.month}.log`;
            else
                filename = `${data.logscope}_${data.loglevel}_${data.year}${data.month}.log`;
        /**
         * 
         * @param {object} record 
         * @param {string} search 
         * @returns 
         */
        const match = (record, search) =>{
            for (const value of Object.values(record)){
                if (!value.toString().toLowerCase().startsWith('/server/log/logs') && 
                    !value.toString().toLowerCase().startsWith('/log/logs')){
                        const col_check = value.toString().normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
                        const search_check = search.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
                        if (col_check.search(search_check)>-1)
                            return true;
                    }
            }
            return false;
        };
        //read log file
        fs.promises.readFile(`${process.cwd()}${ConfigGetInit('PATH_LOG')}${filename}`, 'utf8')
        .then(fileBuffer=>{
            //read log records in the file
            /**@type{string[]} */
            const log_rows_array = fileBuffer.toString().split('\r\n');
            //remove empty row and parse records to object
            /**@type{object[]} */
            let log_rows_array_obj = log_rows_array.filter(record=>record.length>0).map(record=>{if (record.length>0)
                                                return JSON.parse(record);
                                              });
            //filter records
            log_rows_array_obj = log_rows_array_obj.filter(record => {
                    return (
                            (
                                (
                                 (data.logscope=='APP' || data.logscope=='SERVICE' || data.logscope=='DB') && (data.app_id == data.select_app_id ||data.select_app_id ==null))||
                                 (data.logscope!='APP' && data.logscope!='SERVICE' && data.logscope!='DB')
                                ) &&
                             ((data.search==null || data.search=='null' || data.search=='')|| 
                              ((data.search!=null || data.search!='null' || data.search!='') && match(record, data.search)))
                        );
            });
            //sort 
            /**@type{number} */
            let order_by_num;
            if (data.order_by =='asc')
                order_by_num = 1;
            else   
                order_by_num = -1;
            log_rows_array_obj = log_rows_array_obj.sort((first, second)=>{
                let first_sort, second_sort;
                //sort default is connection_date if sort missing as argument
                /**@ts-ignore */
                if (typeof first[data.sort==null?'logdate':data.sort] == 'number'){
                    //number sort
                    /**@ts-ignore */
                    first_sort = first[data.sort==null?'logdate':data.sort];
                    /**@ts-ignore */
                    second_sort = second[data.sort==null?'logdate':data.sort];
                    if (first_sort< second_sort )
                        return -1 * order_by_num;
                    else if (first_sort> second_sort)
                        return 1 * order_by_num;
                    else
                        return 0;
                }
                else{
                    //string sort with lowercase and localcompare
                    /**@ts-ignore */
                    first_sort = first[data.sort==null?'logdate':data.sort];
                    if (first_sort == undefined)
                        first_sort = 'undefined';
                    else
                        first_sort = first_sort.toLowerCase();
                    if (second_sort == undefined)
                        second_sort = 'undefined';
                    else{
                        /**@ts-ignore */
                        second_sort = second_sort.toLowerCase();
                    }
                    //using localeCompare as collation method
                    if (first_sort.localeCompare(second_sort)<0 )
                        return -1 * order_by_num;
                    else if (first_sort.localeCompare(second_sort)>0 )
                        return 1 * order_by_num;
                    else
                        return 0;
                }
            });
            resolve(log_rows_array_obj);
        })
        //return empty and not error
        .catch(()=> resolve([]));
    });
    
};
/**
 * Get status codes
 * 
 *  Status codes
 *  Informational responses (100 – 199)
 *  Successful responses    (200 – 299)
 *  Redirection messages    (300 – 399)
 *  Client error responses  (400 – 499)
 *  Server error responses  (500 – 599)
 *
 *  nodejs codes:
 *  100-103, 200-208, 226, 300-305, 307-308, 400-418, 421-426, 428-429, 431,451, 500-511
 *  same as used according to https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 *  @returns {Promise.<object>}
 */
const getStatusCodes = async () =>{
    const {STATUS_CODES} = await import('node:http');
    return {
        status_codes: STATUS_CODES
    };
    
};
/**
 * Get log stat
 * @param {Types.log_parameter_getLogStats} data 
 */
const getLogsStats = async (data) => {
    /**@type{[Types.admin_log_stats_data]|[]} */
    const logfiles = [];
    /**@type{[Types.admin_log_stats_data]|[]} */
    const logstat = [];
    
    const fs = await import('node:fs');
    if (data.month <10)
        data.month = 0 + data.month;
    const files = await fs.promises.readdir(`${process.cwd()}${ConfigGetInit('PATH_LOG')}`);
    let sample;
    let day = '';
    //declare ES6 Set to save unique status codes and days
    const log_status_codes = new Set();
    const log_days = new Set();
    for (const file of files){
        if (file.startsWith(`REQUEST_INFO_${data.year}${data.month}`)){
            //filename format: REQUEST_INFO_YYYMMDD.log
            if (ConfigGet('SERVICE_LOG', 'FILE_INTERVAL')=='1D'){
                day = file.substring(19,21);
                sample = `${data.year}${data.month}${day}`;
            }
            else
                sample = `${data.year}${data.month}`;
            const {ConfigGetApp} = await import(`file://${process.cwd()}/server/config.service.js`);
            const fileBuffer = await fs.promises.readFile(`${process.cwd() + ConfigGetInit('PATH_LOG') + `REQUEST_INFO_${sample}.log`}`, 'utf8');
            fileBuffer.toString().split('\r\n').forEach((record) => {
                if (record != ''){
                    const  record_obj = JSON.parse(record);
                    //add for given status code or all status codes if all should be returned
                    //save this as chart 2 with days
                    if (data.code == null || data.code == record_obj.statusCode){
                        const domain_app_id = record_obj.host?ConfigGetApp(record_obj.host, 'SUBDOMAIN'):null;
                        if (data.app_id == null || data.app_id == domain_app_id){
                            //add unique status codes to a set
                            log_status_codes.add(record_obj.statusCode);
                            log_days.add(day);
                            /**@ts-ignore */
                            logfiles.push({ 
                                chart:null,
                                statusCode: record_obj.statusCode,
                                year: data.year,
                                month: data.month,
                                day: Number(day),
                                amount: null});
                        }                        
                    }
                }
            });
        }
    }
    //loop unique status codes used in log
    //sort the set using ES6 spread operator
    [...log_status_codes].sort().forEach(code=>{
        //save chart 1 without days and sum amount per month
        /**@ts-ignore */
        logstat.push({
            chart: 1,
            statusCode: code,
            year: data.year,
            month: data.month,
            day: null,
            /**@ts-ignore */
            amount: logfiles.filter(log=>log.statusCode==code).length
        });
    });
    [...log_days].sort().forEach(day=>{
        //save chart2 with days and sum amount per day
        /**@ts-ignore */
        logstat.push({
            chart: 2,
            statusCode: null,
            year: data.year,
            month: data.month,
            day: day,
            /**@ts-ignore */
            amount: logfiles.filter(log=>log.day == day).length
        });
    });
    return logstat;
};
/**
 * Get log files
 */
const getFiles = async () => {
    /**@type{[Types.admin_log_files]|[]} */
    const logfiles =[];
    const fs = await import('node:fs');
    const files = await fs.promises.readdir(process.cwd() + ConfigGetInit('PATH_LOG'));
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
        /**@ts-ignore */
        logfiles.push({id: i++, filename:file});
    });
    return logfiles;
};

export {getLogParameters, LogRequestE, LogRequestI, LogServerI, LogServerE, LogDBI, LogDBE, LogServiceI, LogServiceE, LogAppI, LogAppE, getLogs, getStatusCodes, getLogsStats, getFiles};
