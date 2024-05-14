/** @module server/log */

// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';
import { file_get_log } from './db/file.service.js';

const {ConfigGet} = await import(`file://${process.cwd()}/server/config.service.js`);
const {file_get_log_dir, file_append_log} = await import(`file://${process.cwd()}/server/db/file.service.js`);

/**
 * Send log
 * @param {string} logscope 
 * @param {string} loglevel 
 * @param {object} log 
 * @returns {Promise.<null>}
 */
 const sendLog = async (logscope, loglevel, log) => {
    return await new Promise((resolve) => {
        const config_file_interval = ConfigGet('SERVICE_LOG', 'FILE_INTERVAL');
        file_append_log(`LOG_${logscope}_${loglevel}`, log, config_file_interval=='1D'?'YYYYMMDD':'YYYYMM')
        .then(()=>resolve(null))
        .catch((/**@type{Types.error}*/error)=>{
            console.log(error);
            console.log(log);
            resolve(null);});
    });
};
/**
 * Log date format
 * @returns {string}
 */
const logdate = () => new Date().toISOString();
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
        const log_json_server = {   logdate:            logdate(),
                                    host:               req.headers.host,
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
                log_json_server = { logdate:            logdate(),
                                    host:               req.headers.host,
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
                log_json_server = { logdate:            logdate(),
                                    host:               req.headers.host,
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
                                logdate: logdate(),
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
                                logdate:        logdate(),
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
                                logdate:        logdate(),
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
            logdate:        logdate(),
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
                log_json = {logdate:    logdate(),
                            app_id:     app_id,
                            service:    service,
                            parameters: parameters,
                            logtext:    logtext
                            };    
                break;
            }
            case '2':{
                level_info = ConfigGet('SERVICE_LOG', 'LEVEL_VERBOSE');
                log_json = {logdate:    logdate(),
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
                        logdate:    logdate(),
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
                    logdate:            logdate(),
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
        //log if INFO or VERBOSE level
        if (ConfigGet('SERVICE_LOG', 'APP_LEVEL')=='1' || ConfigGet('SERVICE_LOG', 'APP_LEVEL')=='2')
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
    return new Promise ((resolve)=>{
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
        const file = `LOG_${data.logscope}_${data.loglevel}`;
        const sample = `${data.year}${data.month.toString().padStart(2,'0')}${data.day.toString().padStart(2,'0')}`;
        /**@ts-ignore*/
        file_get_log(file, null, sample)
        .then(log_rows_array_obj=>{
            data.search = data.search=='null'?'':data.search;
            data.search = data.search==null?'':data.search;
            if (data.logscope!='APP' && data.logscope!='SERVICE' && data.logscope!='SERVER-DB')
                data.select_app_id = null;
            //filter records
            log_rows_array_obj = log_rows_array_obj.filter((/**@type{*}*/record) => {
                    return (
                            (record.app_id == data.select_app_id ||data.select_app_id ==null)
                                &&
                            (data.search==''|| (data.search!='' && match(record, data.search)))
                        );
            });
            //sort 
            /**@type{number} */
            let order_by_num;
            if (data.order_by =='asc')
                order_by_num = 1;
            else   
                order_by_num = -1;
            log_rows_array_obj = log_rows_array_obj.sort((/**@type{[object]}*/first, /**@type{[object]}*/second)=>{
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
    /**@type{Types.admin_log_stats_data[]|[]} */
    const logfiles = [];
    /**@type{Types.admin_log_stats_data[]|[]} */
    const logstat = [];
    
    const files = await file_get_log_dir();
    /**@type{string} */
    let sample;
    let day = '';
    //declare ES6 Set to save unique status codes and days
    const log_stat_value = new Set();
    const log_days = new Set();
    for (const file of files){
        if (file.startsWith(`REQUEST_INFO_${data.year}${data.month.toString().padStart(2,'0')}`) ||
            file.startsWith(`REQUEST_VERBOSE_${data.year}${data.month.toString().padStart(2,'0')}`)){
            //filename format: REQUEST_INFO_YYYMMDD.log
            if (ConfigGet('SERVICE_LOG', 'FILE_INTERVAL')=='1D'){
                //return DD
                day = file.slice(-6).substring(0,2)
                sample = `${data.year}${data.month.toString().padStart(2,'0')}${day}`;
            }
            else
                sample = `${data.year}${data.month.toString().padStart(2,'0')}`;
            const {ConfigGetAppHost} = await import(`file://${process.cwd()}/server/config.service.js`);
            await file_get_log(file.startsWith('REQUEST_INFO')?'LOG_REQUEST_INFO':'LOG_REQUEST_VERBOSE', null, sample)
            .then((logs)=>{
                logs.forEach((/**@type{Types.server_log_request_record|''}*/record) => {
                    if (record != ''){
                        if (data.statGroup != null){
                            const domain_app_id = record.host?ConfigGetAppHost(record.host, 'SUBDOMAIN'):null;
                            if (data.app_id == null || data.app_id == domain_app_id){
                                const statGroupvalue = (data.statGroup=='url' && record[data.statGroup].indexOf('?')>0)?record[data.statGroup].substring(0,record[data.statGroup].indexOf('?')):record[data.statGroup];
                                //add unique statGroup to a set
                                log_stat_value.add(statGroupvalue);
                                log_days.add(day);
                                if (data.unique==0 ||(data.unique==1 && logfiles.filter(row=>row.statValue==statGroupvalue).length==0)){
                                    /**@ts-ignore */
                                    logfiles.push({ 
                                        chart:null,
                                        statValue: statGroupvalue,
                                        year: data.year,
                                        month: data.month,
                                        day: Number(day),
                                        amount: null});
                                }
                            }
                        }
                        else{
                            //add for given status code or all status codes if all should be returned
                            //save this as chart 2 with days
                            if (data.statValue == null || data.statValue == record.statusCode){
                                const domain_app_id = record.host?ConfigGetAppHost(record.host, 'SUBDOMAIN'):null;
                                if (data.app_id == null || data.app_id == domain_app_id){
                                    //add unique status codes to a set
                                    log_stat_value.add(record.statusCode);
                                    log_days.add(day);
                                    /**@ts-ignore */
                                    logfiles.push({ 
                                        chart:null,
                                        statValue: record.statusCode,
                                        year: data.year,
                                        month: data.month,
                                        day: Number(day),
                                        amount: null});
                                }
                            }
                        }
                        
                    }
                });
            })
            .catch((error)=>{
                throw `${file}: ${error}`;
            })
        }
    }

    //loop unique stat value used in log
    //sort the set using ES6 spread operator
    [...log_stat_value].sort().forEach(value=>{
        //save chart 1 without days and sum amount per month
        /**@ts-ignore */
        logstat.push({
            chart: 1,
            statValue: value,
            year: data.year,
            month: data.month,
            day: null,
            /**@ts-ignore */
            amount: logfiles.filter(log=>log.statValue==value).length
        });
    });
    [...log_days].sort().forEach(day=>{
        //save chart2 with days and sum amount per day
        /**@ts-ignore */
        logstat.push({
            chart: 2,
            statValue: null,
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
    const files = await file_get_log_dir();
    let i =1;
    files.forEach((/**@type{string}*/file) => {
        if (file.startsWith('REQUEST_INFO_')||
            file.startsWith('REQUEST_ERROR_')||
            file.startsWith('REQUEST_VERBOSE_')||
            file.startsWith('SERVER_INFO_')||
            file.startsWith('SERVER_ERROR_')||
            file.startsWith('APP_INFO_')||
            file.startsWith('APP_ERROR_')||
            file.startsWith('DB_INFO_')||
            file.startsWith('DB_ERROR_')||
            file.startsWith('SERVICE_ERROR_')||
            file.startsWith('SERVICE_INFO_'))
        /**@ts-ignore */
        logfiles.push({id: i++, filename:file});
    });
    return logfiles;
};

export {LogRequestE, LogRequestI, LogServerI, LogServerE, LogDBI, LogDBE, LogServiceI, LogServiceE, LogAppI, LogAppE, getLogs, getStatusCodes, getLogsStats, getFiles};
