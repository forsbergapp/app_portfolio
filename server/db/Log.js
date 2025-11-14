/** @module server/db/Log */

/**
 * @import {server} from '../types.js'
 */
const {server} = await import ('../server.js');
const {STATUS_CODES} = await import('node:http');
/**
 * @name get
 * @description Get 
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
*          data:{   data_app_id:string|null,
*                   logobject:Extract<server['ORM']['MetaData']['DbObject'],
*                   'LogAppInfo'|
*                   'LogAppError'|
*                   'LogDbInfo'|
*                   'LogDbVerbose'|
*                   'LogDbError'|
*                   'LogRequestInfo'|
*                   'LogRequestVerbose'|
*                   'LogRequestError'|
*                   'LogServerInfo'|
*                   'LogServerError'|
*                   'LogBffInfo'|
*                   'LogBffVerbose'|
*                   'LogBffError'>,
*                   search:string|null,
*                   sort:string|null,
*                   order_by:string|null,
*                   year:string,
*                   month:string,
*                   day:string|null}}} parameters
* @returns{Promise.<server['server']['response'] & {result?:[]}>}
*/
const get = async parameters => {
    /** 
     * @type {{ app_id:number,
     *          data_app_id:number|null,
     *          logobject:Extract<server['ORM']['MetaData']['DbObject']['Name'], 
     *             'LogAppInfo'|
     *             'LogAppError'|
     *             'LogDbInfo'|
     *             'LogDbVerbose'|
     *             'LogDbError'|
     *             'LogRequestInfo'|
     *             'LogRequestVerbose'|
     *             'LogRequestError'|
     *             'LogServerInfo'|
     *             'LogServerError'|
     *             'LogBffInfo'|
     *             'LogBffVerbose'|
     *             'LogBffError'>,
     *              search:string|null,
     *              sort:string|null,
     *              order_by:string|null,
     *              year:string,
     *              month:string,
     *              day:string|null}}
     */
    const data = { app_id:			parameters.app_id,
                   data_app_id:	    server.ORM.UtilNumberValue(parameters.data.data_app_id),
                   logobject:		parameters.data.logobject,
                   search:			parameters.data.search,
                   sort:			parameters.data.sort,
                   order_by:		parameters.data.order_by,
                   year: 			parameters.data.year?parameters.data.year.toString():'',
                   month:			parameters.data.month?parameters.data.month.toString():'',
                   day:			    parameters.data.day
    };
    return new Promise (resolve=>{
       const partition = `${data.year}${data.month.toString().padStart(2,'0')}${data.day?data.day.toString().padStart(2,'0'):''}`;
       
       server.ORM.Execute({app_id:parameters.app_id, dml:'GET', object:data.logobject, get:{resource_id:null, partition:partition}})
       .then(log_rows_array_obj=>{
           data.search = data.search=='null'?'':data.search;
           data.search = data.search==null?'':data.search;
           if (!data.logobject.startsWith('LogApp') && !data.logobject.startsWith('LogBff') && !data.logobject.startsWith('LogDb'))
               data.data_app_id = null;
           //filter records
           log_rows_array_obj.rows = log_rows_array_obj.rows.filter((/**@type{*}*/record) => {
                   return (
                           (record.AppId == data.data_app_id ||data.data_app_id ==null)
                               &&
                           (data.search==''|| ( data.search!='' && 
                                                data.search!=null && 
                                                Object.values(record).some(value=>value!=null?server.ORM.UtilSearchMatch(value.toString(), data.search??''):null)))
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
* @returns {Promise.<server['server']['response'] & {result?:object}>}
*/
const getStatusCodes = async () =>{
   return {result:{status_codes: STATUS_CODES}, type:'JSON'};
};
/**
* @name getStat
* @description Get Request log stat, returns base64 string with server['ORM']['View']['LogGetStat'][] to avoid record limit issue
* @function
* @memberof ROUTE_REST_API
* @param {{app_id:number,
*          data:{  data_app_id?:string|null,
*                  statGroup?:string|null,
*                  unique?:string|null,
*                  statValue?:string|null,
*                  year?:string|null,
*                  month?:string|null}}} parameters
* @returns{Promise.<server['server']['response'] & {result?:string}>}
*/
const getStat = async parameters => {
    /** 
     * @type {{ app_id:number|null,
     *          statGroup:keyof server['ORM']['Object']['LogRequestInfo'],
     *          unique:number|null,
     *          statValue:string|number|null,
     *          year:number,
     *          month:number}}
     */
    const data = {	app_id:			server.ORM.UtilNumberValue(parameters.data.data_app_id),
                   /**@ts-ignore */
                   statGroup:		parameters.data.statGroup==''?null:parameters.data.statGroup,
                   unique:		    server.ORM.UtilNumberValue(parameters.data.unique),
                   statValue:		server.ORM.UtilNumberValue(parameters.data.statValue),
                   year: 			server.ORM.UtilNumberValue(parameters.data.year) ?? new Date().getFullYear(),
                   month:			server.ORM.UtilNumberValue(parameters.data.month) ?? new Date().getMonth() +1
                   };
   /**@type{server['ORM']['View']['LogGetStat'][]} */
   const logfiles = [];
   /**@type{server['ORM']['View']['LogGetStat'][]} */
   const logstat = [];
   
   const files = await server.ORM.getFsDir().then(files=>files.filter(file=>file.isDirectory()==false));
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
           if (server.ORM.db.OpenApi.getViewConfig({app_id:0, data:{parameter:'LOG_FILE_INTERVAL'}}).result=='1D'){
               //return DD
               day = file.name.slice(-7).substring(0,2);
               sample = `${data.year}${data.month.toString().padStart(2,'0')}${day}`;
           }
           else
               sample = `${data.year}${data.month.toString().padStart(2,'0')}`;
           await server.ORM.Execute({app_id:parameters.app_id, dml:'GET', object:file.name.startsWith('LogRequestInfo')?'LogRequestInfo':'LogRequestVerbose', get:{resource_id:null, partition:sample}})
           .then((logs)=>{
               logs.rows.forEach((/**@type{server['ORM']['Object']['LogRequestInfo']|''}*/record) => {
                   if (record != ''){
                       if (data.statGroup != null){
                           if (data.app_id == null || data.app_id == record?.AppId){
                               const statGroupvalue = (data.statGroup=='Url' && record[data.statGroup].indexOf('?')>0)?record[data.statGroup].substring(0,record[data.statGroup].indexOf('?')):record[data.statGroup];
                               //add unique statGroup to a set
                               log_stat_value.add(statGroupvalue);
                               log_days.add(day);
                               if (data.unique==0 ||(data.unique==1 && logfiles.filter(row=>row.StatValue==statGroupvalue).length==0)){
                                   logfiles.push({ 
                                       Chart:null,
                                       StatValue: statGroupvalue??null,
                                       Year: data.year,
                                       Month: data.month,
                                       Day: Number(day),
                                       Amount: null});
                               }
                           }
                       }
                       else{
                           //add for given status code or all status codes if all should be returned
                           //save this as chart 2 with days
                           if (data.statValue == null || data.statValue == record.StatusCode){
                               if (data.app_id == null || data.app_id == record?.AppId){
                                   //add unique status codes to a set
                                   log_stat_value.add(record.StatusCode);
                                   log_days.add(day);
                                   logfiles.push({ 
                                       Chart:null,
                                       StatValue: record.StatusCode,
                                       Year: data.year,
                                       Month: data.month,
                                       Day: Number(day),
                                       Amount: null});
                               }
                           }
                       }
                       
                   }
               });
           })
           .catch((error)=>{
               return server.ORM.getError(parameters.app_id, 500, `${file}: ${error}`);
           });
       }
   }

   //loop unique stat value used in log
   //sort the set using ES6 spread operator
   [...log_stat_value].sort().forEach(value=>{
       //save chart 1 without days and sum amount per month
       logstat.push({
           Chart: 1,
           StatValue: value,
           Year: data.year,
           Month: data.month,
           Day: null,
           Amount: logfiles.filter(log=>log.StatValue==value).length
       });
   });
   [...log_days].sort().forEach(day=>{
       //save chart2 with days and sum amount per day
       logstat.push({
           Chart: 2,
           StatValue: null,
           Year: data.year,
           Month: data.month,
           Day: day,
           Amount: logfiles.filter(log=>log.Day == day).length
       });
   });
   return {result:Buffer.from (JSON.stringify(logstat)).toString('base64'), type:'JSON'};
};
/**
* @name getFiles
* @description Get log files
* @function
* @memberof ROUTE_REST_API
* @returns{Promise.<server['server']['response'] & {result?:{Id:number, Filename:string}[]|[]}>}
*/
const getFiles = async () => {
    return {result:await server.ORM.getFsDir()
                   .then(result=>
                       result
                       .filter(row=>row.name.startsWith('Log') && row.isDirectory()==false)
                       .map((file, index)=>{return {Id: index, 
                                                    Filename:file.name
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
 *          data:{  object:     Extract<server['ORM']['MetaData']['DbObject']['Name'],
 *                                  'LogAppInfo'|
 *                                  'LogAppError'|
 *                                  'LogDbInfo'|
 *                                  'LogDbError'|
 *                                  'LogRequestInfo'|
 *                                  'LogRequestVerbose'|
 *                                  'LogRequestError'|
 *                                  'LogServerInfo'|
 *                                  'LogServerError'|
 *                                  'LogBffInfo'|
 *                                  'LogBffError'>,
 *                  request?:{  Req:server['server']['req'],
 *                              ResponseTime:number,
 *                              StatusCode:number,
 *                              StatusMessage:string | number | object | Error | null},
 *                  bff?:{      Service:string,
 *                              Method:string,
 *                              Url:string,
 *                              Operation:string|null,
 *                              Parameters:string},
 *                  db?:{       Object:server['ORM']['MetaData']['DbObject']['Name'],
 *                              Dml:string,
 *                              Parameters:*},
 *                  app?:{      AppFilename:string,
 *                              AppFunctionName:string,
 *                              AppLine:number},
 *                  log:        *
 *              }
 *          }} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_insert'] }>}
 */
const post = async parameters => {
    let log;
    /**@type{Extract<server['ORM']['MetaData']['DbObject']['Name'],
     *              'LogAppInfo'|
     *              'LogAppError'|
     *              'LogDbInfo'|
     *              'LogDbError'|
     *              'LogRequestInfo'|
     *              'LogRequestVerbose'|
     *              'LogRequestError'|
     *              'LogServerInfo'|
     *              'LogServerError'|
     *              'LogBffInfo'|
     *              'LogBffError'>|null}
     */
    let log_object = null;
    switch (parameters.data.object){
        case 'LogServerError':
        case 'LogServerInfo':{
            /**@type{server['ORM']['Object']['LogServerInfo']} */
            log = {LogText:parameters.data.log};
            log_object = parameters.data.object;
            break;
        }
        case 'LogBffError':
        case 'LogBffInfo':{
            const service_level = server.ORM.db.OpenApi.getViewConfig({app_id:0, data:{parameter:'LOG_SERVICE_LEVEL'}}).result;
            /**@type{server['ORM']['Object']['LogBffInfo']}*/
            log = (service_level=='1' ||service_level=='2')?
                    {AppId:     parameters.app_id,
                    Service:    parameters.data.bff?.Service,
                    Method:     parameters.data.bff?.Method,
                    Url:        parameters.data.bff?.Url,
                    Operation:  parameters.data.bff?.Operation,
                    Parameters: parameters.data.bff?.Parameters,
                    Logtext:    parameters.data.log
                    }:null;
            log_object = parameters.data.object;
            break;
        }
        case 'LogAppError':
        case 'LogAppInfo':{
            const app_level = server.ORM.db.OpenApi.getViewConfig({app_id:0, data:{parameter:'LOG_APP_LEVEL'}}).result;
            if (app_level=='1'||app_level=='2'){
                /**@type{server['ORM']['Object']['LogAppInfo']} */
                log ={
                    AppId:            parameters.app_id,
                    AppFilename:      parameters.data.app?.AppFilename,
                    AppFunctionName:  parameters.data.app?.AppFunctionName,
                    AppAppLine:       parameters.data.app?.AppLine,
                    logtext:           parameters.data.log
                    };
                log_object = parameters.data.object;
            }
            else
                log = null;
            break;
        }
        case 'LogDbError':
        case 'LogDbInfo':{
            const db_level = server.ORM.db.OpenApi.getViewConfig({app_id:0, data:{parameter:'LOG_DB_LEVEL'}}).result;
            if (db_level=='1'||db_level=='2'){
                log_object = parameters.data.object;
                /**@type{server['ORM']['Object']['LogDbError']} */
                log = {
                        AppId:         parameters.app_id,
                        Object:         parameters.data.db?.Object,
                        Dml:            parameters.data.db?.Dml,
                        Parameters:     parameters.data.db?.Parameters,
                        Logtext:        db_level=='1'?
                                            `Rows:${parameters.data.log.AffectedRows?parameters.data.log.AffectedRows:parameters.data.log.length}`:
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
            const request_level = server.ORM.db.OpenApi.getViewConfig({app_id:0, data:{parameter:'LOG_REQUEST_LEVEL'}}).result; 
            if (request_level=='1'||request_level=='2'){
                log = { Host:               parameters.data.request?.Req.headers.host,
                        AppId:              parameters.data.request?.Req.headers.x?.app_id,
                        AppIdAuth:          parameters.data.request?.Req.headers.x?.app_id_auth,
                        Ip:                 parameters.data.request?.Req.ip,
                        RequestId:          parameters.data.request?.Req.headers['x-request-id'],
                        CorrelationId:      parameters.data.request?.Req.headers['x-correlation-id'],
                        Url:                parameters.data.request?.Req.originalUrl,
                        XUrl:               parameters.data.request?.Req.headers.x?.url,
                        HttpInfo:          'HTTP/' + parameters.data.request?.Req.httpVersion,
                        Method:             parameters.data.request?.Req.method,
                        XMethod:            parameters.data.request?.Req.headers.x?.method,
                        StatusCode:         parameters.data.request?.StatusCode,
                        StatusMessage:      parameters.data.request?.StatusMessage,
                        UserAgent:          parameters.data.request?.Req.headers['user-agent'], 
                        AcceptLanguage:     parameters.data.request?.Req.headers['accept-language'], 
                        Referer:            parameters.data.request?.Req.headers.referer,
                        SizeReceived:       parameters.data.request?.Req.socket.bytesRead,
                        SizeSent:           parameters.data.request?.Req.socket.bytesWritten,
                        ResponseTime:       parameters.data.request?.ResponseTime,
                        Logtext:            parameters.data.object=='LogRequestInfo'?
                                                (request_level=='1'?
                                                    '':
                                                        'req:' + JSON.stringify(Object.assign({}, parameters.data.request?.Req), getCircularReplacer())): 
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
        return {result:{AffectedRows:0}, type:'JSON'};
    else{
        const data_new = {  ...{Id:Date.now()}, 
                            ...log, 
                            ...{Created:new Date().toISOString()}
                        };
        /**@ts-ignore */
        return server.ORM.Execute({app_id:parameters.app_id, dml:'POST', object:log_object, post:{data:data_new}}).then((/**@type{server['ORMMetaData']['common_result_insert']}*/result)=>{
            if (result.AffectedRows>0){
                result.InsertId=data_new.Id;
                return {result:result, type:'JSON'};
            }
            else
                return server.ORM.getError(parameters.app_id, 404);
        })
        .catch((/**@type{server['server']['error']}*/error)=>{
            console.log(error);
            console.log(parameters.data.log);
            throw error;
        });
    }
};

export {get, getStatusCodes, getStat, getFiles, post};
