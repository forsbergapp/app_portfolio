/** @module server/db/Log */

/**
 * @import {server_server_response,server_db_common_result_insert,
 *          server_db_table_LogRequestInfo, server_db_table_LogRequestError, 
 *          server_db_table_LogServerInfo,
 *          server_db_table_LogDbInfo,server_db_table_LogDbError,
 *          server_db_table_LogServiceInfo,server_db_table_LogServiceError,
 *          server_db_tables_log,
 *          server_db_table_LogAppInfo,
 *          server_log_scope, server_log_level,
 *          server_log_data_parameter_getLogStats, server_log_result_logStatGet, server_log_data_parameter_logGet,
 *          server_server_error, server_server_req, server_server_req_verbose, 
 *          server_db_common_result} from '../types.js'
 */
/**@type{import('./Config.js')} */
const Config = await import(`file://${process.cwd()}/server/db/Config.js`);

/**@type{import('./ORM.js')} */
const ORM = await import(`file://${process.cwd()}/server/db/ORM.js`);

/**
 * @name get
 * @description Get logs with page navigation support using limit and offset parameters
 *              and returns in ISO20022 format
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
*          data:{  select_app_id?:string|null,
*                  logscope?:server_log_scope,
*                  loglevel?:server_log_level,
*                  search?:string|null,
*                  sort?:string|null,
*                  order_by?:string|null,
*                  year?:string|null,
*                  month?:string|null,
*                  day?:string|null,
*                  offset?:string|null}}} parameters
* @returns{Promise.<server_server_response & {result?:[]}>}
*/
const get = async parameters => {
   /**@type{import('../server.js')} */
   const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

   /**@type{server_log_data_parameter_logGet} */
   const data = {  app_id:			parameters.app_id,
                   select_app_id:	serverUtilNumberValue(parameters.data.select_app_id),
                   /**@ts-ignore */
                   logscope:		parameters.data.logscope,
                   /**@ts-ignore */
                   loglevel:		parameters.data.loglevel,
                   /**@ts-ignore */
                   search:			parameters.data.search,
                   /**@ts-ignore */
                   sort:			parameters.data.sort,
                   /**@ts-ignore */
                   order_by:		parameters.data.order_by,
                   /**@ts-ignore */
                   year: 			parameters.data.year?.toString(),
                   /**@ts-ignore */
                   month:			parameters.data.month?.toString(),
                   /**@ts-ignore */
                   day:			parameters.data.day
   };
   return new Promise (resolve=>{
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
       /**@type{server_db_tables_log} */
       const file = `Log${data.logscope}${data.loglevel}`;
       const sample = `${data.year}${data.month.toString().padStart(2,'0')}${data.day.toString().padStart(2,'0')}`;
       
       ORM.getFsLog(parameters.app_id, file, null, null, sample)
       .then(log_rows_array_obj=>{
           data.search = data.search=='null'?'':data.search;
           data.search = data.search==null?'':data.search;
           if (data.logscope!='App' && data.logscope!='Service' && data.logscope!='Db')
               data.select_app_id = null;
           //filter records
           log_rows_array_obj.rows = log_rows_array_obj.rows.filter((/**@type{*}*/record) => {
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
           log_rows_array_obj.rows = log_rows_array_obj.rows.sort((/**@type{[object]}*/first, /**@type{[object]}*/second)=>{
               let first_sort, second_sort;
               //sort default is connection_date if sort missing as argument
               /**@ts-ignore */
               if (typeof first[data.sort==null?'created':data.sort] == 'number'){
                   //number sort
                   /**@ts-ignore */
                   first_sort = first[data.sort==null?'created':data.sort];
                   /**@ts-ignore */
                   second_sort = second[data.sort==null?'created':data.sort];
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
                   first_sort = first[data.sort==null?'created':data.sort];
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
           /**@ts-ignore */
           resolve({result:log_rows_array_obj.rows,
                   type:'JSON'});
           
       })
       //return empty and not error
       /**@ts-ignore */
       .catch(()=> resolve({  result:[],
                               type:'JSON'}));
   });
   
};
/**
* @name getStatusCodes
* @description Get status codes
*                  Status codes
*                  Informational responses (100 – 199)
*                  Successful responses    (200 – 299)
*                  Redirection messages    (300 – 399)
*                  Client error responses  (400 – 499)
*                  Server error responses  (500 – 599)
*                  NodeJS codes:
*                  100-103, 200-208, 226, 300-305, 307-308, 400-418, 421-426, 428-429, 431,451, 500-511
*                  same as used according to https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
* @function
* @memberof ROUTE_REST_API
* @returns {Promise.<server_server_response & {result?:object}>}
*/
const getStatusCodes = async () =>{
   const {STATUS_CODES} = await import('node:http');
   return {result:{status_codes: STATUS_CODES}, type:'JSON'};
};
/**
* @name getStat
* @description Get log stat
* @function
* @memberof ROUTE_REST_API
* @param {{app_id:number,
*          data:{  select_app_id?:string|null,
*                  statGroup?:string|null,
*                  unique?:string|null,
*                  statValue?:string|null,
*                  year?:string|null,
*                  month?:string|null}}} parameters
* @returns{Promise.<server_server_response & {result?:server_log_result_logStatGet[]|[]}>}
*/
const getStat = async parameters => {
   /**@type{import('../server.js')} */
   const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

   /**@type{server_log_data_parameter_getLogStats} */
   const data = {	app_id:			serverUtilNumberValue(parameters.data.select_app_id),
                   /**@ts-ignore */
                   statGroup:		parameters.data.statGroup==''?null:parameters.data.statGroup,
                   unique:		    serverUtilNumberValue(parameters.data.unique),
                   statValue:		serverUtilNumberValue(parameters.data.statValue),
                   year: 			serverUtilNumberValue(parameters.data.year) ?? new Date().getFullYear(),
                   month:			serverUtilNumberValue(parameters.data.month) ?? new Date().getMonth() +1
                   };
   /**@type{server_log_result_logStatGet[]|[]} */
   const logfiles = [];
   /**@type{server_log_result_logStatGet[]|[]} */
   const logstat = [];

   /**@type{import('../../apps/common/src/common.js')} */
   const {commonAppHost}= await import(`file://${process.cwd()}/apps/common/src/common.js`);
   
   const files = await ORM.getFsDir().then(files=>files.filter(file=>file.isDirectory()==false));
   /**@type{string} */
   let sample;
   let day = '';
   //declare ES6 Set to save unique status codes and days
   const log_stat_value = new Set();
   const log_days = new Set();
   const regexp_request_day = /LogRequestInfo_\d\d\d\d\d\d\d\d.json/g;
   const regexp_verbose_day = /LogRequestVerbose_\d\d\d\d\d\d\d\d.json/g;
   const regexp_request_month = /LogRequestInfo_\d\d\d\d\d\d.json/g;
   const regexp_verbose_month = /LogRequestVerbose_\d\d\d\d\d\d.json/g;
   for (const file of files){
       if ((file.name.startsWith(`LogRequestInfo_${data.year}${data.month.toString().padStart(2,'0')}`)&& 
           (regexp_request_day.exec(file.name)!=null||regexp_request_month.exec(file.name)!=null)) ||
           (file.name.startsWith(`LogRequestVerbose_${data.year}${data.month.toString().padStart(2,'0')}`)&& 
           (regexp_verbose_day.exec(file.name)!=null||regexp_verbose_month.exec(file.name)!=null))){
           //filename format: log_request_info_YYYMMDD.json
           if (Config.get({app_id:parameters.app_id, data:{object:'ConfigServer',config_group:'SERVICE_LOG', parameter:'FILE_INTERVAL'}})=='1D'){
               //return DD
               day = file.name.slice(-7).substring(0,2);
               sample = `${data.year}${data.month.toString().padStart(2,'0')}${day}`;
           }
           else
               sample = `${data.year}${data.month.toString().padStart(2,'0')}`;
           await ORM.getFsLog(parameters.app_id, file.name.startsWith('LogRequestInfo')?'LogRequestInfo':'LogRequestVerbose', null, null, sample)
           .then((logs)=>{
               logs.rows.forEach((/**@type{server_db_table_LogRequestInfo|''}*/record) => {
                   if (record != ''){
                       if (data.statGroup != null){
                           const domain_app_id = record.host?commonAppHost(record.host):null;
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
                               const domain_app_id = record.host?commonAppHost(record.host):null;
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
               return ORM.getError(parameters.app_id, 500, `${file}: ${error}`);
           });
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
   return {result:logstat, type:'JSON'};
};
/**
* @name getFiles
* @description Get log files
* @function
* @memberof ROUTE_REST_API
* @returns{Promise.<server_server_response & {result?:{id:number, filename:string}[]|[]}>}
*/
const getFiles = async () => {
   return {result:await ORM.getFsDir()
                   .then(result=>
                       result
                       .filter(row=>row.name.startsWith('Log') && row.isDirectory()==false)
                       .map((file, index)=>{return {id: index, 
                                                   filename:file.name
                                                   };
                                           })
                   ),
           type:'JSON'};
};

/**
 * @name post
 * @description Write log
 * @function
 * @param {server_log_scope} logscope 
 * @param {server_log_level} loglevel 
 * @param {object & {id?:number, created?:string}} log 
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
 const post = async (logscope, loglevel, log) => {
    const config_file_interval = Config.get({app_id:0, data:{object:'ConfigServer',config_group:'SERVICE_LOG', parameter:'FILE_INTERVAL'}});
    log.id = Date.now();
    log.created = new Date().toISOString();
    await ORM.postFsLog(null, `Log${logscope}${loglevel}`, log, config_file_interval=='1D'?'YYYYMMDD':'YYYYMM')
            .catch((/**@type{server_server_error}*/error)=>{
                console.log(error);
                console.log(log);
                throw error;
            });
    return {result:{affectedRows:1}, type:'JSON'};
};
/**
 * @name postRequestE
 * @description Log request error
 * @param {server_server_req} req 
 * @param {number} statusCode 
 * @param {*} statusMessage 
 * @param {number} responsetime 
 * @param {server_server_error} err 
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const postRequestE = async (req, statusCode, statusMessage, responsetime, err) => {
    /**@type{server_db_table_LogRequestError}*/
    const log_json_server = {   host:               req.headers.host,
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
                                logtext:            err.status + '-' + err.message
                            };
    return post(Config.get({app_id:0, data:{object:'ConfigServer',config_group:'SERVICE_LOG', parameter:'SCOPE_REQUEST'}}), 
                Config.get({app_id:0, data:{object:'ConfigServer',config_group:'SERVICE_LOG', parameter:'LEVEL_ERROR'}}), log_json_server);
};
/**
 * @name postRequestI
 * @description Log request Info
 * @function
 * @param {server_server_req} req 
 * @param {number} statusCode 
 * @param {string} statusMessage 
 * @param {number} responsetime 
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const postRequestI = async (req, statusCode, statusMessage, responsetime) => {
    let log_level;
    /**@type{server_db_table_LogRequestInfo}*/
    let log_json_server;
    switch (Config.get({app_id:0, data:{object:'ConfigServer',config_group:'SERVICE_LOG', parameter:'REQUEST_LEVEL'}})){
        case '1':{
            log_level = Config.get({app_id:0, data:{object:'ConfigServer',config_group:'SERVICE_LOG', parameter:'LEVEL_INFO'}});
            log_json_server = { host:               req.headers.host,
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
            log_level = Config.get({app_id:0, data:{object:'ConfigServer',config_group:'SERVICE_LOG', parameter:'LEVEL_VERBOSE'}});
            /**@type{server_server_req_verbose} */
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
            log_json_server = { host:               req.headers.host,
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
            return {result:{affectedRows:0}, type:'JSON'};
        }
    }   
    return post(Config.get({app_id:0, data:{object:'ConfigServer',config_group:'SERVICE_LOG', parameter:'SCOPE_REQUEST'}}), log_level, log_json_server);
};
/**
 * @name postServer
 * @description Log server
 * @function
 * @param {server_log_level} log_level 
 * @param {string} logtext 
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const postServer = async (log_level, logtext) =>{
    /**@type{server_db_table_LogServerInfo} */
    const log_json_server = {
                            logtext: logtext
                            };
    return post(Config.get({app_id:0, data:{object:'ConfigServer',config_group:'SERVICE_LOG', parameter:'SCOPE_SERVER'}}), log_level, log_json_server);
};
/**
 * @name postServerI
 * @description Log server Info
 * @function
 * @param {string} logtext 
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const postServerI = async (logtext)=>{
    return postServer(Config.get({app_id:0, data:{object:'ConfigServer',config_group:'SERVICE_LOG', parameter:'LEVEL_INFO'}}), logtext);
};
/**
 * @name postServerE
 * @description Log server error
 * @function
 * @param {string} logtext 
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const postServerE = async (logtext)=>{
    return postServer(Config.get({app_id:0, data:{object:'ConfigServer',config_group:'SERVICE_LOG', parameter:'LEVEL_ERROR'}}), logtext);
};
/**
 * @name postDBI
 * @description Log DB Info
 * @function
 * @param {number} app_id 
 * @param {string} object
 * @param {string} dml
 * @param {object} parameters 
 * @param {server_db_common_result} result 
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const postDBI = async (app_id, object, dml, parameters, result) => {
    /**@type{server_db_table_LogDbInfo} */
    let log_json_db;
    let level_info;
    switch (Config.get({app_id:app_id, data:{object:'ConfigServer',config_group:'SERVICE_LOG', parameter:'DB_LEVEL'}})){
        case '1':{
            level_info = Config.get({app_id:app_id, data:{object:'ConfigServer',config_group:'SERVICE_LOG', parameter:'LEVEL_INFO'}});
            log_json_db = {
                            app_id:         app_id,
                            object:         object,
                            dml:            dml,
                            parameters:     parameters,
                            /**@ts-ignore */
                            logtext:        `Rows:${result.affectedRows?result.affectedRows:result.length}`
                            };
            break;
        }
        case '2':{
            level_info = Config.get({app_id:app_id, data:{object:'ConfigServer',config_group:'SERVICE_LOG', parameter:'LEVEL_VERBOSE'}});
            log_json_db = {
                            app_id:         app_id,
                            object:         object,
                            dml:            dml,
                            parameters:     parameters,
                            logtext:        JSON.stringify(result)
                            };
            break;
        }
        default:{
            //0 is default, other levels not implemented
            return {result:{affectedRows:0}, type:'JSON'};
        }
    }
    return post(Config.get({app_id:app_id, data:{object:'ConfigServer',config_group:'SERVICE_LOG', parameter:'SCOPE_DB'}}), level_info, log_json_db);
};
/**
 * @name postDBE
 * @description Log DB error
 * @function
 * @param {number} app_id 
 * @param {string} object
 * @param {string} dml
 * @param {object} parameters 
 * @param {*} result 
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const postDBE = async (app_id, object, dml, parameters, result) => {
    /**@type{server_db_table_LogDbError} */
    const log_json_db = {
        app_id:         app_id,
        object:         object,
        dml:            dml,
        parameters:     parameters,
        logtext:        result
        };
    return post(Config.get({app_id:app_id, data:{object:'ConfigServer',config_group:'SERVICE_LOG', parameter:'SCOPE_DB'}}), Config.get({app_id:app_id, data:{object:'ConfigServer',config_group:'SERVICE_LOG', parameter:'LEVEL_ERROR'}}), log_json_db);
};
/**
 * @name postServiceI
 * @description Log service Info
 * @function
 * @param {number} app_id 
 * @param {string} service 
 * @param {string} parameters 
 * @param {string} logtext 
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const postServiceI = async (app_id, service, parameters, logtext) => {
    /**@type{server_db_table_LogServiceInfo}*/
    let log_json;
    let level_info;
    switch (Config.get({app_id:app_id, data:{object:'ConfigServer',config_group:'SERVICE_LOG', parameter:'SERVICE_LEVEL'}})){
        case '1':{
            level_info = Config.get({app_id:app_id, data:{object:'ConfigServer',config_group:'SERVICE_LOG', parameter:'LEVEL_INFO'}});
            log_json = {app_id:     app_id,
                        service:    service,
                        parameters: parameters,
                        logtext:    logtext
                        };    
            break;
        }
        case '2':{
            level_info = Config.get({app_id:app_id, data:{object:'ConfigServer',config_group:'SERVICE_LOG', parameter:'LEVEL_VERBOSE'}});
            log_json = {app_id:     app_id,
                        service:    service,
                        parameters: parameters,
                        logtext:    logtext
                        };    
            break;
        }
        default:{
            //0 is default, other levels not implemented
            return {result:{affectedRows:0}, type:'JSON'};
        }
    }
    return post(Config.get({app_id:app_id, data:{object:'ConfigServer',config_group:'SERVICE_LOG', parameter:'SCOPE_SERVICE'}}), level_info, log_json);
};
/**
 * @name postServiceE
 * @description Log service error
 * @function
 * @param {number} app_id 
 * @param {string} service 
 * @param {string} parameters 
 * @param {*} logtext 
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const postServiceE = async (app_id, service, parameters, logtext) => {
    /**@type{server_db_table_LogServiceError}*/   
    const log_json = {
                    app_id:     app_id,
                    service:    service,
                    parameters: parameters,
                    logtext:    logtext.stack??logtext
                    };
    return post(Config.get({app_id:app_id, data:{object:'ConfigServer',config_group:'SERVICE_LOG', parameter:'SCOPE_SERVICE'}}), Config.get({app_id:app_id, data:{object:'ConfigServer',config_group:'SERVICE_LOG', parameter:'LEVEL_ERROR'}}), log_json);
};
/**
 * @name postApp
 * @description Log app
 * @function
 * @param {number} app_id 
 * @param {'Info'|'Error'} level_info 
 * @param {string} app_filename 
 * @param {string} app_function_name 
 * @param {number} app_line 
 * @param {string} logtext 
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const postApp = async (app_id, level_info, app_filename, app_function_name, app_line, logtext) => {
    /**@type{server_db_table_LogAppInfo} */
    const log_json ={
                    app_id:             app_id,
                    app_filename:       app_filename,
                    app_function_name:  app_function_name,
                    app_app_line:       app_line,
                    logtext:            logtext
                    };
    
    return post(Config.get({app_id:app_id, data:{object:'ConfigServer',config_group:'SERVICE_LOG', parameter:'SCOPE_APP'}}), level_info, log_json);
};
/**
 * @name postAppI
 * @description Log app info
 * @function
 * @param {number} app_id 
 * @param {string} app_filename 
 * @param {string} app_function_name 
 * @param {number} app_line 
 * @param {string} logtext 
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const postAppI = async (app_id, app_filename, app_function_name, app_line, logtext) => {
    //log if INFO or VERBOSE level
    if (Config.get({app_id:app_id, data:{object:'ConfigServer',config_group:'SERVICE_LOG', parameter:'APP_LEVEL'}})=='1' || 
        Config.get({app_id:app_id, data:{object:'ConfigServer',config_group:'SERVICE_LOG', parameter:'APP_LEVEL'}})=='2')
        return postApp(app_id, Config.get({app_id:app_id, data:{object:'ConfigServer',config_group:'SERVICE_LOG', parameter:'LEVEL_INFO'}}), app_filename, app_function_name, app_line, logtext);
    else
        return {result:{affectedRows:0}, type:'JSON'};
};
/**
 * @name postAppE
 * @description Log app error
 * @function
 * @param {number} app_id 
 * @param {string} app_filename 
 * @param {string} app_function_name 
 * @param {number} app_line 
 * @param {*} logtext 
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const postAppE = async (app_id, app_filename, app_function_name, app_line, logtext) => postApp( app_id, 
                                                                                                Config.get({app_id:app_id, data:{object:'ConfigServer',config_group:'SERVICE_LOG', parameter:'LEVEL_ERROR'}}),
                                                                                                app_filename, 
                                                                                                app_function_name, 
                                                                                                app_line, 
                                                                                                logtext);

export {get, getStatusCodes, getStat, getFiles, postRequestE, postRequestI, postServerI, postServerE, postDBI, postDBE, postServiceI, postServiceE, postAppI, postAppE};
