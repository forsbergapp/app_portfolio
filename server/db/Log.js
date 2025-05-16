/** @module server/db/Log */

/**
 * @import {server_server_response,server_db_common_result_insert,
 *          server_DbObject, 
 *          server_db_table_LogRequestInfo, 
 *          server_db_table_LogServerInfo,
 *          server_db_table_LogDbError,
 *          server_db_table_LogServiceInfo,
 *          server_db_tables_log,
 *          server_db_table_LogAppInfo,
 *          server_log_data_parameter_getLogStats, server_log_result_logStatGet, server_log_data_parameter_logGet,
 *          server_server_error, server_server_req} from '../types.js'
 */

/**
 * @name get
 * @description Get logs with page navigation support using limit and offset parameters
 *              and returns in ISO20022 format
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
*          data:{  data_app_id?:string|null,
*                  logobject?:server_db_tables_log,
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
    const ORM = await import('./ORM.js');
    const {serverUtilNumberValue} = await import('../server.js');

    /**@type{server_log_data_parameter_logGet} */
    const data = {  app_id:			parameters.app_id,
                   data_app_id:	    serverUtilNumberValue(parameters.data.data_app_id),
                   /**@ts-ignore */
                   logobject:		parameters.data.logobject,
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

       const partition = `${data.year}${data.month.toString().padStart(2,'0')}${data.day.toString().padStart(2,'0')}`;
       
       ORM.Execute({app_id:parameters.app_id, dml:'GET', object:data.logobject, get:{resource_id:null, partition:partition}})
       .then(log_rows_array_obj=>{
           data.search = data.search=='null'?'':data.search;
           data.search = data.search==null?'':data.search;
           if (!data.logobject.startsWith('LogApp') && !data.logobject.startsWith('LogService') && !data.logobject.startsWith('LogDb'))
               data.data_app_id = null;
           //filter records
           log_rows_array_obj.rows = log_rows_array_obj.rows.filter((/**@type{*}*/record) => {
                   return (
                           (record.app_id == data.data_app_id ||data.data_app_id ==null)
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
* @description Get log stat, returns base64 string with server_log_result_logStatGet[] to avoid record limit issue
* @function
* @memberof ROUTE_REST_API
* @param {{app_id:number,
*          data:{  data_app_id?:string|null,
*                  statGroup?:string|null,
*                  unique?:string|null,
*                  statValue?:string|null,
*                  year?:string|null,
*                  month?:string|null}}} parameters
* @returns{Promise.<server_server_response & {result?:string|[]}>}
*/
const getStat = async parameters => {
    const {serverUtilNumberValue} = await import('../server.js');
    const Config = await import('./Config.js');
    const ORM = await import('./ORM.js');

    /**@type{server_log_data_parameter_getLogStats} */
    const data = {	app_id:			serverUtilNumberValue(parameters.data.data_app_id),
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

   const {commonAppHost}= await import('../../apps/common/src/common.js');
   
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
           await ORM.Execute({app_id:parameters.app_id, dml:'GET', object:file.name.startsWith('LogRequestInfo')?'LogRequestInfo':'LogRequestVerbose', get:{resource_id:null, partition:sample}})
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
   return {result:Buffer.from (JSON.stringify(logstat)).toString('base64'), type:'JSON'};
};
/**
* @name getFiles
* @description Get log files
* @function
* @memberof ROUTE_REST_API
* @returns{Promise.<server_server_response & {result?:{id:number, filename:string}[]|[]}>}
*/
const getFiles = async () => {
    const ORM = await import('./ORM.js');

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
 * @param {{app_id:number,
 *          data:{  object:     server_db_tables_log,
 *                  request?:{  req:server_server_req,
 *                              responsetime:number,
 *                              statusCode:number,
 *                              statusMessage:string | number | object | Error | null},
 *                  service?:{  service:string,
 *                              parameters:string},
 *                  db?:{       object:server_DbObject,
 *                              dml:string,
 *                              parameters:*},
 *                  app?:{      app_filename:string,
 *                              app_function_name:string,
 *                              app_line:number},
 *                  log:        *
 *              }
 *          }} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async parameters => {
    const ORM = await import('./ORM.js');
    const Config = await import('./Config.js');

    let log;
    /**@type{server_db_tables_log|null}*/
    let log_object = null;
    switch (parameters.data.object){
        case 'LogServerError':
        case 'LogServerInfo':{
            /**@type{server_db_table_LogServerInfo} */
            log = {logtext:parameters.data.log};
            log_object = parameters.data.object;
            break;
        }
        case 'LogServiceError':
        case 'LogServiceInfo':{
            const service_level = Config.get({app_id:parameters.app_id, data:{object:'ConfigServer',config_group:'SERVICE_LOG', parameter:'SERVICE_LEVEL'}});
            /**@type{server_db_table_LogServiceInfo}*/
            log = (service_level=='1' ||service_level=='2')?
                    {app_id:    parameters.app_id,
                    service:    parameters.data.service?.service,
                    parameters: parameters.data.service?.parameters,
                    logtext:    parameters.data.log
                    }:null;
            log_object = parameters.data.object;
            break;
        }
        case 'LogAppError':
        case 'LogAppInfo':{
            const app_level = Config.get({app_id:parameters.app_id, data:{object:'ConfigServer',config_group:'SERVICE_LOG', parameter:'APP_LEVEL'}});
            if (app_level=='1'||app_level=='2'){
                /**@type{server_db_table_LogAppInfo} */
                log ={
                    app_id:             parameters.app_id,
                    app_filename:       parameters.data.app?.app_filename,
                    app_function_name:  parameters.data.app?.app_function_name,
                    app_app_line:       parameters.data.app?.app_line,
                    logtext:            parameters.data.log
                    };
                log_object = parameters.data.object;
            }
            else
                log = null;
            break;
        }
        case 'LogDbError':
        case 'LogDbInfo':{
            const db_level = Config.get({app_id:parameters.app_id, data:{object:'ConfigServer',config_group:'SERVICE_LOG', parameter:'DB_LEVEL'}});            
            if (db_level=='1'||db_level=='2'){
                log_object = (db_level=='2' && parameters.data.object=='LogDbInfo')?'LogDbVerbose':parameters.data.object;
                /**@type{server_db_table_LogDbError} */
                log = {
                        app_id:         parameters.app_id,
                        object:         parameters.data.db?.object,
                        dml:            parameters.data.db?.dml,
                        parameters:     parameters.data.db?.parameters,
                        logtext:        db_level=='1'?
                                            `Rows:${parameters.data.log.affectedRows?parameters.data.log.affectedRows:parameters.data.log.length}`:
                                            typeof parameters.data.log=='object'?JSON.stringify(parameters.data.log):parameters.data.log
                        };
            }
            else{
                log = null;
            }
            break;
        }
        case 'LogRequestError':
        case 'LogRequestInfo':{
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
            const request_level = Config.get({app_id:parameters.app_id, data:{object:'ConfigServer',config_group:'SERVICE_LOG', parameter:'REQUEST_LEVEL'}}); 
            if (request_level=='1'||request_level=='2'){
                log = { host:               parameters.data.request?.req.headers.host,
                        ip:                 parameters.data.request?.req.ip,
                        requestid:          parameters.data.request?.req.headers['x-request-id'],
                        correlationid:      parameters.data.request?.req.headers['x-correlation-id'],
                        url:                parameters.data.request?.req.originalUrl,
                        http_info:          parameters.data.request?.req.protocol + '/' + parameters.data.request?.req.httpVersion,
                        method:             parameters.data.request?.req.method,
                        statusCode:         parameters.data.request?.statusCode,
                        statusMessage:      parameters.data.request?.statusMessage,
                        ['user-agent']:     parameters.data.request?.req.headers['user-agent'], 
                        ['accept-language']:parameters.data.request?.req.headers['accept-language'], 
                        referer:            parameters.data.request?.req.headers.referer,
                        size_received:      parameters.data.request?.req.socket.bytesRead,
                        size_sent:          parameters.data.request?.req.socket.bytesWritten,
                        responsetime:       parameters.data.request?.responsetime,
                        logtext:            parameters.data.object=='LogRequestInfo'?
                                                (request_level=='1'?
                                                    '':
                                                        'req:' + JSON.stringify(Object.assign({}, parameters.data.request?.req), getCircularReplacer())): 
                                            parameters.data.object=='LogRequestError'?
                                                (parameters.data.log.status + '-' + parameters.data.log.message):
                                                    ''
                    };
                log_object = parameters.data.object;
            }
            else
                log=null;
            break;
        }
        default:{
            log=null;
        }
    }
    if (log==null || log_object==null)
        return {result:{affectedRows:0}, type:'JSON'};
    else{
        await ORM.Execute({ app_id:parameters.app_id, 
                            dml:'POST',object:log_object, 
                            post:{data:{...{id:Date.now()}, 
                                        ...log, 
                                        ...{created:new Date().toISOString()}
                                        }
                                }
                            })
        .catch((/**@type{server_server_error}*/error)=>{
            console.log(error);
            console.log(parameters.data.log);
            throw error;
        });
    
        return {result:{affectedRows:1}, type:'JSON'};
    }
    
};


export {get, getStatusCodes, getStat, getFiles, post};
