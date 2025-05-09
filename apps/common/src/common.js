/** @module apps/common/src/common/service */

/**
 * @import {server_db_table_App,
 *          server_db_table_AppModule,
 *          server_db_app_parameter_common,
 *          server_db_table_IamUser,
 *          server_apps_report_create_parameters,
 *          server_apps_app_service_parameters,
 *          server_apps_module_with_metadata,
 *          server_apps_module_metadata,
 *          APP_server_apps_module_common_type,
 *          server_server_res,
 *          server_bff_endpoint_type,
 *          server_bff_parameters,
 *          server_server_error,
 *          server_server_response} from '../../../server/types.js'
 * 
 */

/**@type{import('../../../server/db/App.js')} */
const App = await import(`file://${process.cwd()}/server/db/App.js`);

/**@type{import('../../../server/db/AppModule.js')} */
const AppModule = await import(`file://${process.cwd()}/server/db/AppModule.js`);

/**@type{import('../../../server/db/AppParameter.js')} */
const AppParameter = await import(`file://${process.cwd()}/server/db/AppParameter.js`);

/**@type{import('../../../server/db/Config.js')} */
const Config = await import(`file://${process.cwd()}/server/db/Config.js`);

/**@type{import('../../../server/db/IamUser.js')} */
const IamUser = await import(`file://${process.cwd()}/server/db/IamUser.js`);

/**@type{import('../../../server/db/Log.js')} */
const Log = await import(`file://${process.cwd()}/server/db/Log.js`);

/**@type{import('../../../server/server.js')} */
const {serverUtilAppFilename, serverUtilAppLine, serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

const fs = await import('node:fs');

/**
 * @name commonSearchMatch
 * @description Searches for text in given variables without diacrites
 * @param {string} col
 * @param {string} search
 * @returns {boolean}
 */
const commonSearchMatch = (col, search) =>{
    const col_check = col.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    const search_check = search.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();            
    return col_check.search(search_check)>-1;
};

/**
 * @name commonAppStart
 * @description Checks if ok to start app
 * @function
 * @param {number} app_id
 * @returns {Promise.<boolean>}
 */
const commonAppStart = async (app_id) =>{
    if (serverUtilNumberValue(Config.get({app_id:app_id,data:{object:'ConfigServer',config_group:'SERVER', parameter:'APP_COMMON_APP_ID'}}))!=null &&
        Config.get({app_id:app_id??0,data:{object:'ConfigServer',config_group:'METADATA',parameter:'MAINTENANCE'}})==0 &&
        App.get({app_id:app_id, resource_id:app_id}).result[0].status =='ONLINE')
            return true;
    else
        return false;
};

/**
 * @name commonClientLocale
 * @description Get client locale from accept language from request
 * @function
 * @param {string} accept_language  - Accept language from request
 * @returns {string}                - lowercase locale, can be default 'en' or with syntax 'en-us' or 'zh-hant-cn'
 */
const commonClientLocale = accept_language =>{
    let locale;
    if (!accept_language || accept_language.startsWith('text') || accept_language=='*')
        locale = 'en';
    else{
        //check first lang ex syntax 'en-US,en;'
        locale = accept_language.split(',')[0].toLowerCase();
        if (locale.length==0){
            //check first lang ex syntax 'en;'
            locale = accept_language.split(';')[0].toLowerCase();
            if (locale.length==0 && accept_language.length>0)
                //check first lang ex syntax 'en' or 'zh-cn'
                locale = accept_language.toLowerCase();
            else{
                locale = 'en';
            }
        }
    }
    return locale;
};
/**
 * @name commonGeodata
 * @description Returns geodata
 * @function
 * @param {{app_id:number,
 *          endpoint:server_bff_endpoint_type,
 *          ip:string,
 *          user_agent:string,
 *          accept_language:string}} parameters
 * @returns {Promise.<*>}
 */
const commonGeodata = async parameters =>{
    /**@type{import('../../../server/bff.js')} */
    const { bffServer } = await import(`file://${process.cwd()}/server/bff.js`);
    //get GPS from IP
    /**@type{server_bff_parameters}*/
    const parametersBFF = { endpoint:parameters.endpoint,
                            host:null,
                            url:'/bff/app_id/v1/geolocation/ip',
                            route_path:'/geolocation/ip',
                            method:'GET', 
                            query:`ip=${parameters.ip}`,
                            body:{},
                            authorization:null,
                            ip:parameters.ip, 
                            user_agent:parameters.user_agent, 
                            accept_language:parameters.accept_language,
                            /**@ts-ignore */
                            res:null};
    //ignore error in this case and fetch random geolocation using WORLDCITIES service instead if GEOLOCATION is not available
    const result_gps = await bffServer(parameters.app_id, parametersBFF)
    .catch(()=>null);
    const result_geodata = {};
    if (result_gps?.result){
        result_geodata.latitude =   result_gps.result.latitude;
        result_geodata.longitude=   result_gps.result.longitude;
        result_geodata.place    =   result_gps.result.city + ', ' +
                                    result_gps.result.regionName + ', ' +
                                    result_gps.result.countryName;
        result_geodata.timezone =   result_gps.result.timezone;
    }
    else{
        /**@type{server_bff_parameters}*/
        const parametersBFF = { endpoint:'APP_ID',
                                host:null,
                                url:'/bff/app_id/v1/app-common-module/COMMON_WORLDCITIES_CITY_RANDOM',
                                route_path:'/app-common-module/COMMON_WORLDCITIES_CITY_RANDOM',
                                method:'POST', 
                                query:'',
                                body:{type:'FUNCTION',IAM_data_app_id:serverUtilNumberValue(Config.get({app_id:parameters.app_id, data:{object:'ConfigServer',config_group:'SERVER',parameter:'APP_COMMON_APP_ID'}}))},
                                authorization:null,
                                ip:parameters.ip, 
                                user_agent:parameters.user_agent, 
                                accept_language:parameters.accept_language,
                                /**@ts-ignore */
                                res:{}};
        const result_city = await bffServer(parameters.app_id, parametersBFF)
                                    .then(result=>{if (result.http) throw result; else return result.result;})
                                    .catch((/**@type{server_server_error}*/error)=>{throw error;});
        result_geodata.latitude =   result_city.lat;
        result_geodata.longitude=   result_city.lng;
        result_geodata.place    =   result_city.city + ', ' + result_city.admin_name + ', ' + result_city.country;
        result_geodata.timezone =   null;
    }
    return result_geodata;
};

/**
 * @name commonBFE
 * @description External request with JSON
 * @function
 * @param {{url:string,
 *          method:string,
 *          body:*,
 *          user_agent:string,
 *          ip:string,
 *          authorization:string|null,
 *          locale:string}} parameters
 * @returns {Promise.<server_server_response>}
 */
const commonBFE = async parameters =>{
    if (parameters.url.toLowerCase().startsWith('https://') || parameters.url.toLowerCase().startsWith('http://')){
        const zlib = await import('node:zlib');
        const request_protocol = parameters.url.toLowerCase().startsWith('https')?await import('node:https'):await import('node:http');
        const timeout_message = '🗺⛔?';
        const timeout = 500000;
        return new Promise((resolve)=>{           
            const options = {
                method: parameters.method,
                timeout: timeout,
                headers : {
                    'User-Agent': parameters.user_agent,
                    'Accept-Language': parameters.locale,
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(JSON.stringify(parameters.body)),
                    'Authorization': parameters.authorization ?? '',
                    'x-forwarded-For': parameters.ip
                },
                rejectUnauthorized: false
            };
            const request = request_protocol.request(new URL(parameters.url),options, res =>{
                let responseBody = '';
                if (res.headers['content-encoding'] == 'gzip'){
                    const gunzip = zlib.createGunzip();
                    res.pipe(gunzip);
                    gunzip.on('data', (chunk) =>responseBody += chunk);
                    gunzip.on('end', () => resolve ({result:JSON.parse(responseBody), type:'JSON'}));
                }
                else{
                    res.setEncoding('utf8');
                    res.on('data', (chunk) =>{
                        responseBody += chunk;
                    });
                    res.on('end', ()=>{
                        resolve ({result:JSON.parse(responseBody), type:'JSON'});
                    });
                }
                
            });
            
            if (parameters.method !='GET')
                request.write(JSON.stringify(parameters.body));
            request.on('error', error => {
                resolve({http:500,
                        code:'APP',
                        /**@ts-ignore */
                        text:error,
                        developerText:'commonBFE',
                        moreInfo:null,
                        type:'JSON'
                    });
            });
            request.on('timeout', () => {
                resolve({http:503,
                    code:'APP',
                    text:timeout_message,
                    developerText:'commonBFE',
                    moreInfo:null,
                    type:'JSON'
                });
            });
            request.end();
        });
    }
    else{
        /**@type{import('../../../server/iam.js')} */
        const { iamUtilMessageNotAuthorized } = await import(`file://${process.cwd()}/server/iam.js`);
        throw iamUtilMessageNotAuthorized();
    }
};

/**
 * @name commonAssetfile
 * @memberof ROUTE_APP
 * @description Get asset file
 *              Supported
 *              .css files
 *              .js files       
 *                  modifies at request:
 *                  /modules/react/react-dom.development.js
 *                      makes ECMAScript module adding export
 *                  /modules/react/react.development.js
 *                      makes ECMAScript module adding export
 *                  /modules/leaflet/leaflet-src.esm.js
 *                      removes sourceMappingURL
 *                  /modules/easy.qrcode/easy.qrcode.js
 *                      makes ECMAScript module adding variables, canvas2svg, minimal modifications and export
 *                  /modules/easy.qrcode/canvas2svg.js
 *                      makes ECMAScript module adding minimal modifications and export
 *                  /apps/common_types.js
 *                      used to display common_types.js since developer path is different
 *              .html files
 *              .webp files
 *              .png files
 *              .woff2 files
 *              .ttf files
 *              .json
 * @function
 * @param {{app_id:Number,
 *          url:String,
 *          basepath:string}} parameters
 * @returns {Promise.<server_server_response>}
 */
const commonAssetfile = parameters =>{
    return new Promise((resolve)=>{
                                                            
        const common_app_id = serverUtilNumberValue(Config.get({app_id:parameters.app_id, data:{object:'ConfigServer',config_group:'SERVER',parameter:'APP_COMMON_APP_ID'}}));
        if (common_app_id!=null){
            switch (parameters.url.toLowerCase().substring(parameters.url.lastIndexOf('.'))){
                case '.css':{
                    resolve({type:'CSS', sendfile:`${process.cwd()}${parameters.basepath}${parameters.url}`});
                    break;
                }
                case '.js':{
                    switch (parameters.url){
                        case '/modules/react/react-dom.development.js':
                        case '/modules/react/react.development.js':{
                            fs.promises.readFile(`${process.cwd()}${parameters.basepath}${parameters.url}`, 'utf8').then((modulefile)=>{
                                if (parameters.url == '/modules/react/react-dom.development.js'){
                                    modulefile = 'let ReactDOM;\r\n' + modulefile;                                
                                    modulefile = modulefile.replace(  'exports.version = ReactVersion;',
                                                                    'exports.version = ReactVersion;\r\n  ReactDOM=exports;');
                                    modulefile = modulefile + 'export {ReactDOM}';
                                }
                                else{
                                    modulefile = 'let React;\r\n' + modulefile;
                                    modulefile = modulefile.replace(  'exports.version = ReactVersion;',
                                                                    'exports.version = ReactVersion;\r\n  React=exports;');
                                    modulefile = modulefile + 'export {React}';
                                }
                                
                                resolve({type:'JS', result:modulefile});
                            });
                            break;
                        }
                        case '/modules/leaflet/leaflet-src.esm.js':{
                            fs.promises.readFile(`${process.cwd()}${parameters.basepath}${parameters.url}`, 'utf8').then((modulefile)=>{
                                modulefile = modulefile.replace(  '//# sourceMappingURL=','//');
                                resolve({type:'JS', result:modulefile});
                            });
                            break;
                        }
                        case '/modules/easy.qrcode/easy.qrcode.js':{
                            fs.promises.readFile(`${process.cwd()}${parameters.basepath}${parameters.url}`, 'utf8').then((modulefile)=>{
                                modulefile = modulefile.replace(  'var QRCode;','');
    
                                modulefile =    'let {ctx} = await import("./canvas2svg.js");\r\n' +
                                                'let C2S = ctx;\r\n' + 
                                                'var QRCode;\r\n' +
                                                modulefile;
                                modulefile = modulefile.replace(  'if (typeof define == \'function\' && (define.amd || define.cmd))','if (1==2)');
                                modulefile = modulefile.replace(  'else if (freeModule)','else if (1==2)');
                                modulefile = modulefile.replace(  'root.QRCode = QRCode;','null;');
                                
    
                                modulefile = modulefile + 'export{QRCode}';
                                resolve({type:'JS', result:modulefile});
                            });
                            break;
                        }
                        case '/modules/easy.qrcode/canvas2svg.js':{
                            fs.promises.readFile(`${process.cwd()}${parameters.basepath}${parameters.url}`, 'utf8').then((modulefile)=>{
                                modulefile =  'let ctx;\r\n' + modulefile;
                                modulefile = modulefile.replace('var STYLES, ctx, CanvasGradient, CanvasPattern, namedEntities;',
                                                                'var STYLES, CanvasGradient, CanvasPattern, namedEntities;');
                                modulefile = modulefile.replace(  'if (typeof window === "object")','if (1==2)');
                                modulefile = modulefile.replace(  'if (typeof module === "object" && typeof module.exports === "object")','if (1==2)');
                                modulefile = modulefile + 'export{ctx}';
                                resolve({type:'JS', result:modulefile});
                            });
                            break;
                        }
                        case '/apps/common_types.js':{
                            //in development another path is used, return correct path in app
                            resolve({type:'JS', sendfile:`${process.cwd()}/apps/common_types.js`});
                            break;
                        }
                        default:
                            resolve({type:'JS', sendfile:`${process.cwd()}${parameters.basepath}${parameters.url}`});
                    }
                    break;
                }
                case '.html':{
                    resolve({type:'HTML', sendfile:`${process.cwd()}${parameters.basepath}${parameters.url}`});
                    break;
                }
                case '.webp':{
                    resolve({type:'WEBP', sendfile:`${process.cwd()}${parameters.basepath}${parameters.url}`});
                    break;
                }
                case '.png':{
                    resolve({type:'PNG', sendfile:`${process.cwd()}${parameters.basepath}${parameters.url}`});
                    break;
                }
                case '.woff2':{
                    resolve({type:'WOFF', sendfile:`${process.cwd()}${parameters.basepath}${parameters.url}`});
                    break;
                }
                case '.ttf':{
                    resolve({type:'TTF', sendfile:`${process.cwd()}${parameters.basepath}${parameters.url}`});
                    break;
                }
                case '.json':{
                    resolve({type:'JSON', sendfile:`${process.cwd()}${parameters.basepath}${parameters.url}`});
                    break;
                }
                default:{
                    Log.post({  app_id:parameters.app_id, 
                        data:{  object:'LogAppError', 
                                app:{   app_filename:serverUtilAppFilename(import.meta.url),
                                        app_function_name:'commonAssetfile()',
                                        app_line:serverUtilAppLine()
                                },
                                log:`Invalid file type ${parameters.url}`
                            }
                        })
                    .then(()=>{
                        resolve({http:404, code:'APP', text:null, developerText:null, moreInfo:null, type:'JSON'});

                    });
                }
            }
        }
        else{
            resolve({http:500, code:'APP', text:null, developerText:null, moreInfo:null, type:'JSON'});
        }
    });
};

/**
 * @name commonModuleAsset
 * @description Get asset using commonModuleRun since assets are not using idToken or authorization
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
*          resource_id:string,
*          data: {},
*          user_agent:string,
*          ip:string,
*          host:string,
*          locale:string,
*          endpoint:server_bff_endpoint_type}} parameters
* @returns {Promise.<server_server_response>}
*/
const commonModuleAsset = async parameters => {
    return commonModuleRun({app_id:         parameters.app_id,
                            resource_id:    parameters.resource_id,
                            data:           {
                                                type:'ASSET', 
                                                data_app_id:parameters.app_id
                                            },
                            user_agent:     parameters.user_agent,
                            ip:             parameters.ip,
                            host:           '',
                            locale:         parameters.locale,
                            idToken:        '',
                            authorization:  '',
                            endpoint:       parameters.endpoint});
};
/**
 * @name commonModuleRun
 * @description Run function for given app and role
 *              Parameters in data should be requried data_app_id plus additional keys
 *              Can return anything specified by the function and supported by the server
 *              JSON, HTML, CSS, JS, WEBP, PNG, WOFF, TTF
 *              Response JSON format can be single resource format, list format or pagination format
 *              that the app should be responisble of
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:string,
 *          data: { type?:APP_server_apps_module_common_type,
 *                  data_app_id?:number|null},   //can accept more parameters if defined
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          locale:string,
 *          idToken:string,
 *          authorization:string,
 *          endpoint:server_bff_endpoint_type}} parameters
 * @returns {Promise.<server_server_response>}
 */
const commonModuleRun = async parameters => {
    /**@type{import('../../../server/iam.js')} */
    const {iamUtilMessageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);
    const modules = AppModule.get({app_id:parameters.app_id, 
                                            resource_id:null, 
                                            data:{data_app_id:parameters.data.data_app_id}});
    if (modules.result){
        if (parameters.data?.type =='ASSET'|| parameters.data?.type =='FUNCTION'||parameters.endpoint=='APP_EXTERNAL'||parameters.endpoint=='APP_ACCESS_EXTERNAL'){
            const module = modules.result.filter((/**@type{server_db_table_AppModule}*/app)=>
                                                                                                //APP EXTERNAL only uses id and message keys, add function type
                                                                                                app.common_type==((parameters.endpoint=='APP_EXTERNAL' ||parameters.endpoint=='APP_ACCESS_EXTERNAL')?'FUNCTION':parameters.data.type) && 
                                                                                                app.common_name==parameters.resource_id && 
                                                                                                app.common_role == parameters.endpoint)[0];
            if (module){
                const {default:RunFunction} = await import(`file://${process.cwd()}${module.common_path}`);
                return await RunFunction({  app_id:parameters.app_id, 
                                            data:parameters.data, 
                                            ip:parameters.ip, 
                                            host:parameters.host, 
                                            idToken:parameters.idToken, 
                                            authorization:parameters.authorization, 
                                            user_agent:parameters.user_agent, 
                                            locale:parameters.locale});
            }
            else{
                return Log.post({   app_id:parameters.app_id, 
                                    data:{  object:'LogAppError', 
                                            app:{   app_filename:serverUtilAppFilename(import.meta.url),
                                                    app_function_name:'commonModuleRun()',
                                                    app_line:serverUtilAppLine()
                                            },
                                            log:`Module ${parameters.resource_id} not found`
                                        }
                                    })
                .then((result)=>{          
                    return result.http?result:{http:404,
                        code:'APP',
                        text:iamUtilMessageNotAuthorized(),
                        developerText:'commonModuleRun',
                        moreInfo:null,
                        type:'JSON'
                    };
                });
            }
        }
        else
            return {http:400,
                code:'APP',
                text:iamUtilMessageNotAuthorized(),
                developerText:'commonModuleRun',
                moreInfo:null,
                type:'JSON'
            };
    }
    else
        return modules;
};

/**
 * @name commonAppReport
 * @description Get module of type REPORT for given role
 *              REPORT returns component template with specified report using with parameters from app or report queue
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:Number,
*          resource_id:string,
*          data:{
*                  ps?:'A4'|'Letter', 
*                  type:'REPORT', 
*                  reportid?:string,
*                  queue_parameters?:{appModuleQueueId:number}},
*          user_agent:string, 
*          ip:string,
*          locale:string,
*          endpoint:server_bff_endpoint_type|''}} parameters
* @returns {Promise.<server_server_response>}
*/
const commonAppReport = async parameters => {
    /**@type{import('../../../server/iam.js')} */
    const {iamUtilMessageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);
    /**@type{import('../../../server/db/AppModuleQueue.js')} */
    const AppModuleQueue = await import(`file://${process.cwd()}/server/db/AppModuleQueue.js`);
    if (parameters.data?.type =='REPORT'){
        const modules = AppModule.get({app_id:parameters.app_id, resource_id:null, data:{data_app_id:parameters.app_id}})                                           ;
        if (modules.result){
            const module = modules.result.filter((/**@type{server_db_table_AppModule}*/app)=>
                                                                                            app.common_type==parameters.data.type && 
                                                                                            app.common_name==parameters.resource_id && 
                                                                                            app.common_role == parameters.endpoint)[0];
            if (module){
                //report
                /**@type{import('../../../server/iam.js')} */
                const { iamAuthorizeIdToken } = await import(`file://${process.cwd()}/server/iam.js`);
                //ID token is created but not used in report
                await iamAuthorizeIdToken(parameters.app_id, parameters.ip, 'REPORT');
                const {default:ComponentCreate} = await import('./component/common_report.js');
                
                const {default:RunReport} = await import(`file://${process.cwd()}${module.common_path}`);
    
                const pagesize = parameters.data.ps ?? new URLSearchParams(Buffer.from(parameters.data.reportid ?? '', 'base64').toString('utf-8')).get('ps');
                /**@type{server_apps_report_create_parameters} */
                const data = {  app_id:         parameters.app_id,
                                queue_parameters:parameters.data.queue_parameters,
                                reportid:       parameters.data.reportid ?? '',
                                ip:             parameters.ip,
                                user_agent:     parameters.user_agent ?? '',
                                accept_language:parameters.locale ?? ''
                                };
                if (parameters.data.queue_parameters){
                    //do not wait for the report result when using report queue and the result is saved and not returned here
                    ComponentCreate({data:   {
                                                    CONFIG_APP: {...App.get({app_id:parameters.app_id, resource_id:parameters.app_id}).result[0]},
                                                    data:       data,
                                                    /**@ts-ignore */
                                                    papersize:  (pagesize=='' ||pagesize==null)?'A4':pagesize
                                                    },
                                            methods:{function_report:RunReport}})
                                            .then(result_queue=>{
                                                //update report result
                                                AppModuleQueue.postResult( parameters.app_id, 
                                                                                    parameters.data.queue_parameters?.appModuleQueueId??0, 
                                                                                    result_queue)
                                                .then((result_AppModuleQueue)=>
                                                    result_AppModuleQueue.http?
                                                        result_AppModuleQueue:
                                                            AppModuleQueue.update( parameters.app_id, 
                                                                                            parameters.data.queue_parameters?.appModuleQueueId??0, 
                                                                                            {   end:new Date().toISOString(), 
                                                                                                progress:1, 
                                                                                                status:'SUCCESS'}));
                                                    
                                            })
                                            .catch(error=>{
                                                //update report fail
                                                AppModuleQueue.update( parameters.app_id, 
                                                                                parameters.data.queue_parameters?.appModuleQueueId??0, 
                                                                                {   end:new Date().toISOString(), 
                                                                                    progress:1, 
                                                                                    status:'FAIL',
                                                                                    message:typeof error == 'string'?
                                                                                                error:JSON.stringify(error.message ?? error)});
                                            });
                    return {result:'', type:'HTML'};
                }
                else
                    return {result:await ComponentCreate({data:   {
                                                    CONFIG_APP: {...App.get({app_id:parameters.app_id, resource_id:parameters.app_id}).result[0]},
                                                    data:       data,
                                                    /**@ts-ignore */
                                                    papersize:  (pagesize=='' ||pagesize==null)?'A4':pagesize
                                                    },
                                            methods:{function_report:RunReport}}), type:'HTML'};
            }
            else{
                return Log.post({   app_id:parameters.app_id, 
                    data:{  object:'LogAppError', 
                            app:{   app_filename:serverUtilAppFilename(import.meta.url),
                                    app_function_name:'commonAppReport()',
                                    app_line:serverUtilAppLine()
                            },
                            log:`Module ${parameters.resource_id} not found`
                        }
                    })
                .then((result)=>{          
                    return result.http?result:{http:404,
                        code:'APP',
                        text:iamUtilMessageNotAuthorized(),
                        developerText:null,
                        moreInfo:null,
                        type:'JSON'
                    };
                });
            }
        }
        else
            return modules;
    }
    else
        return {http:400,
            code:'APP',
            text:iamUtilMessageNotAuthorized(),
            developerText:null,
            moreInfo:null,
            type:'JSON'
        };
};
/**
 * @name commonAppReportQueue
 * @description Runs report in queue
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          authorization:string,
 *          data:{  ps:'A4', 
 *                  report_parameters:string},
 *          user_agent:string,
 *          ip:string,
 *          locale:string,
 *          endpoint:server_bff_endpoint_type|'',
 *          res:server_server_res}} parameters
 * @returns {Promise.<server_server_response|void>}
 */
const commonAppReportQueue = async parameters =>{
    /**@type{import('../../../server/db/AppModuleQueue.js')} */
    const AppModuleQueue = await import(`file://${process.cwd()}/server/db/AppModuleQueue.js`);

    /**@type{import('../../../server/db/IamUser.js')} */
    const IamUser = await import(`file://${process.cwd()}/server/db/IamUser.js`);

    /**@type{import('../../../server/iam.js')} */
    const { iamUtilTokenGet } = await import(`file://${process.cwd()}/server/iam.js`);
    /**@type{import('../../../server/iam.js')} */
    const {iamUtilMessageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);

    const report = AppModule.get({app_id:parameters.app_id, resource_id:parameters.resource_id, data:{data_app_id:null}});
    if (report.result){
        /**@type{server_db_table_IamUser} */
        const user = IamUser.get(  parameters.app_id, 
                                            serverUtilNumberValue(iamUtilTokenGet(  parameters.app_id, 
                                                                                    parameters.authorization, 
                                                                                    parameters.app_id==serverUtilNumberValue(Config.get({app_id:parameters.app_id, data:{object:'ConfigServer',config_group:'SERVER',parameter:'APP_ADMIN_APP_ID'}}))?
                                                                                                                                                    'ADMIN':
                                                                                                                                                        'APP_ACCESS').iam_user_id)).result[0];
        const result_post = await AppModuleQueue.post(parameters.app_id, 
                                                            {
                                                            type:'REPORT',
                                                            /**@ts-ignore */
                                                            iam_user_id:user.id,
                                                            app_module_id:parameters.resource_id,
                                                            name:report.result[0].common_name,
                                                            parameters:`ps:${parameters.data.ps}, report:${parameters.data.report_parameters}`,
                                                            status:'PENDING',
                                                            user:user.username
                                                            });
        if (result_post.result){
            await AppModuleQueue.update(parameters.app_id, result_post.result.insertId, { start:new Date().toISOString(),
                                                                    progress:0, 
                                                                    status:'RUNNING'});
            //report can update progress and only progress if necessary
            //add queue id and parameters from parameter from origin
            commonAppReport({   app_id:             parameters.app_id,
                                resource_id:        report.result[0].common_name,
                                data:               {type:'REPORT', 
                                                        ...{ps:parameters.data.ps}, 
                                                        ...{queue_parameters:{appModuleQueueId:result_post.result.insertId,
                                                                                ...Object.fromEntries(Array.from(new URLSearchParams(parameters.data.report_parameters)).map(param=>[param[0],param[1]]))}
                                                            }
                                                    },
                                user_agent:         parameters.user_agent,
                                ip:                 parameters.ip,
                                locale:             parameters.locale,
                                endpoint:           parameters.endpoint});
            //do not wait for submitted report
            return {result:null, type:'JSON'};
        }
        else
            return result_post;
    }
    else
        return Log.post({   app_id:parameters.app_id, 
                            data:{  object:'LogAppError', 
                                    app:{   app_filename:serverUtilAppFilename(import.meta.url),
                                            app_function_name:'commonAppReportQueue()',
                                            app_line:serverUtilAppLine()
                                    },
                                    log:`Module ${parameters.resource_id} not found`
                                }
                            })
                .then((result)=>{          
                    return result.http?result:{http:404,
                        code:'APP',
                        text:iamUtilMessageNotAuthorized(),
                        developerText:'commonAppReportQueue',
                        moreInfo:null,
                        type:'JSON'
                    };
                });
};

/**
 * @name commonModuleMetaDataGet
 * @description Returns all modules with metadata
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:Number,
 *          data:{type:'REPORT'|'MODULE'|'FUNCTION'},
 *          resource_id:number}} parameters
 * @returns {Promise.<server_server_response & {result?:server_apps_module_with_metadata[] }>}
 */
const commonModuleMetaDataGet = async parameters =>{
    /**@type{import('../../../server/iam.js')} */
    const {iamUtilMessageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);
    if (parameters.data.type=='REPORT'||parameters.data.type=='MODULE'||parameters.data.type=='FUNCTION'){
        const modules = AppModule.get({app_id:parameters.app_id, resource_id:parameters.resource_id,data:{data_app_id:parameters.app_id}});
        if (modules.result){
            const module_reports = modules.result.filter((/**@type{server_db_table_AppModule}*/row)=>row.common_type==parameters.data.type);
            if (module_reports){
                for (const row of module_reports){
                    const module = await import(`file://${process.cwd()}${row.common_path}`);
                    /**@type{server_apps_module_metadata[]}*/
                    const metadata = module.metadata;
                    row.common_metadata = metadata;
                }
                return {result:module_reports, type:'JSON'};
            }
            else
                return Log.post({   app_id:parameters.app_id, 
                                    data:{  object:'LogAppError', 
                                            app:{   app_filename:serverUtilAppFilename(import.meta.url),
                                                    app_function_name:'commonModuleMetaDataGet()',
                                                    app_line:serverUtilAppLine()
                                            },
                                            log:`Module ${parameters.resource_id} not found`
                                        }
                                    })
                    .then((result)=>{          
                        return result.http?result:{http:404,
                            code:'APP',
                            text:iamUtilMessageNotAuthorized(),
                            developerText:'commonModuleMetaDataGet',
                            moreInfo:null,
                            type:'JSON'
                        };
                    });
        }
        else
            return modules;
    }
    else{
        return {http:400,
            code:'APP',
            text:iamUtilMessageNotAuthorized(),
            developerText:null,
            moreInfo:null,
            type:'JSON'
        };
    }
}; 
/**
 * @name commonComponentCreate
 * @memberof ROUTE_APP
 * @description Creates server component and returns to client
 *              app
 *              reports
 *              maintenance
 *              info disclaimer
 *              info privacy policy
 *              info terms
 *              server error
 * @function
 * @param {{app_id:number, 
 *          componentParameters:{   param?:             string|null,
 *                                  ip:                 string, 
 *                                  user_agent?:        string,
 *                                  locale?:            string,
 *                                  reportid?:          string,
 *                                  host?:              string},
 *          type:'APP'|'MAINTENANCE'|'INFO_DISCLAIMER'|'INFO_PRIVACY_POLICY'|'INFO_TERMS'}} parameters
 * @returns {Promise.<server_server_response & {result?:string }>}
 */
const commonComponentCreate = async parameters =>{
    /**@type{import('../../../server/iam.js')} */
    const { iamAuthorizeIdToken } = await import(`file://${process.cwd()}/server/iam.js`);

    const common_app_id = serverUtilNumberValue(Config.get({app_id:parameters.app_id, data:{object:'ConfigServer',config_group:'SERVER',parameter:'APP_COMMON_APP_ID'}}));
    const admin_app_id = serverUtilNumberValue(Config.get({app_id:parameters.app_id, data:{object:'ConfigServer',config_group:'SERVER',parameter:'APP_ADMIN_APP_ID'}}));
    //id token for APP and MAINTENANCE
    const idtoken = (parameters.type=='APP' ||parameters.type=='MAINTENANCE')?
                        await iamAuthorizeIdToken(parameters.app_id, parameters.componentParameters.ip, parameters.type):
                            null;
    //geodata for APP
    const result_geodata = parameters.type=='APP'?
                                await commonGeodata({   app_id:parameters.app_id, 
                                                        endpoint:'SERVER', 
                                                        ip:parameters.componentParameters.ip, 
                                                        user_agent:parameters.componentParameters.user_agent ??'', 
                                                        accept_language:parameters.componentParameters.locale??''}):
                                    null;
    const count_user = IamUser.get(parameters.app_id, null).result.length;
    const admin_only = (await commonAppStart(parameters.app_id)==true?false:true) && count_user==0;
    
    switch (parameters.type){
        case 'APP':{
            /**@type{server_apps_app_service_parameters} */
            const app_service_parameters = {   
                app_id:                 parameters.app_id,
                app_logo:               App.get({app_id:parameters.app_id, resource_id:parameters.app_id}).result[0].logo,
                app_idtoken:            idtoken ?? '',
                locale:                 parameters.componentParameters.locale ?? '',
                admin_only:             admin_only?1:0,
                client_latitude:        result_geodata?.latitude,
                client_longitude:       result_geodata?.longitude,
                client_place:           result_geodata?.place ?? '',
                client_timezone:        result_geodata?.timezone,
                common_app_id:          common_app_id,
                admin_app_id:           admin_app_id,
                framework:              Config.get({app_id:parameters.app_id, data:{object:'ConfigServer',config_group:'SERVICE_APP',   parameter:'FRAMEWORK'}}),
                framework_messages:     Config.get({app_id:parameters.app_id, data:{object:'ConfigServer',config_group:'SERVICE_APP',   parameter:'FRAMEWORK_MESSAGES'}}),
                rest_resource_bff:      Config.get({app_id:parameters.app_id, data:{object:'ConfigServer',config_group:'SERVER',        parameter:'REST_RESOURCE_BFF'}}),
                rest_api_version:       Config.get({app_id:parameters.app_id, data:{object:'ConfigServer',config_group:'SERVER',        parameter:'REST_API_VERSION'}}),
                first_time:             count_user==0?1:0
            };
            /**@type{server_db_app_parameter_common} */
            const common_parameter = AppParameter.get({app_id:parameters.app_id, resource_id:common_app_id}).result[0];

            /**@type{server_db_table_App} */
            const app = App.get({app_id:parameters.app_id, resource_id:parameters.app_id}).result[0];
            const APP_PARAMETERS  = {   APP:        {...AppParameter.get({app_id:parameters.app_id, resource_id:parameters.app_id}).result?.[0]??{},
                                                     ...{
                                                        app_text_edit:  app.text_edit,
                                                        app_copyright:  app.copyright,
                                                        app_email:      app.email,
                                                        app_link_title: app.link_title,
                                                        app_link_url:   app.link_url
                                                        }
                                                     }, 
                                        COMMON:     common_parameter,
                                        INFO:       app_service_parameters};
            const componentParameter = {data:   {
                                                    APP:            app,
                                                    APP_PARAMETERS: Buffer.from(JSON.stringify(APP_PARAMETERS)).toString('base64')
                                                },
                                        methods:null};

            const {default:ComponentCreate} = await import('./component/common_app.js');
            return {result:await ComponentCreate(componentParameter), type:'HTML'};
        }
        case 'MAINTENANCE':{
            //maintenance can be used from all app_id
            const data = JSON.stringify({   
                app_id:         parameters.app_id,
                common_app_id:  common_app_id,
                admin_app_id:   admin_app_id,
                app_idtoken:    idtoken,
                rest_resource_bff: Config.get({app_id:parameters.app_id, data:{object:'ConfigServer',config_group:'SERVER',parameter:'REST_RESOURCE_BFF'}})
            });

            const {default:ComponentCreate} = await import('./component/common_maintenance.js');
            return {result:await ComponentCreate({data:   {
                                            CONFIG_APP:             {...App.get({app_id:parameters.app_id, resource_id:parameters.app_id}).result[0]},
                                            ITEM_COMMON_PARAMETERS: Buffer.from(data).toString('base64')},
                                    methods:null
                                    }), type:'HTML'};
        }
        case 'INFO_DISCLAIMER':
        case 'INFO_PRIVACY_POLICY':
        case 'INFO_TERMS':{
            const {default:ComponentCreate} = await import('./component/common_info.js');
            return {result:await ComponentCreate({data: {app_name:App.get({app_id:parameters.app_id, resource_id:parameters.app_id}).result[0].name,
                                                        type:parameters.type},
                                    methods:null}), type:'HTML'};
        }
        default:{
            return {result:'',type:'HTML'};
        }
    }
};

/**
 * @name commonAppHost
 * @description Returns app id for given host
 *              Checks if host matches configured host or starts with www or is a valid subdomain
 * @param {string} host 
 * @returns {number|null}
 */
const commonAppHost = host =>{
    switch (host.toString().split('.')[0]){
                        
        case Config.get({app_id:0, data:{object:'ConfigServer',config_group:'SERVER',parameter:'HOST'}}):
        case 'www':{
            //localhost
            return App.get({app_id:serverUtilNumberValue(Config.get({app_id:0, data:{object:'ConfigServer',config_group:'SERVER',parameter:'APP_COMMON_APP_ID'}}))??0, 
                            resource_id:null}).result.filter((/**@type{server_db_table_App}*/app)=>app.subdomain == 'www')[0].id;
        }
        default:{
            try {
                return App.get({app_id:serverUtilNumberValue(Config.get({app_id:0, data:{object:'ConfigServer',config_group:'SERVER',parameter:'APP_COMMON_APP_ID'}}))??0, 
                                resource_id:null}).result.filter((/**@type{server_db_table_App}*/app)=>host.toString().split('.')[0] == app.subdomain)[0].id;
            } catch (error) {
                return null;
            }
        }
    }
 };
/**
 * @name commonApp
 * @namespace ROUTE_APP
 * @description Get app asset, common asset, app info page, app report, app module or app
 * @function
 * @param {{app_id:number|null,
 *          ip:string,
 *          host:string,
 *          user_agent:string,
 *          accept_language:string,
 *          url:string,
 *          query:*}} parameters
 * @returns {Promise.<server_server_response>}
 */
const commonApp = async parameters =>{

    if (parameters.app_id==null)
        return {http:404,
                code:null,
                text:null,
                developerText:'commonApp',
                moreInfo:null,
                result:null,
                sendfile:null,
                type:'JSON'};
    else
        switch (true){
            case (parameters.url.toLowerCase().startsWith('/maintenance')):{
                return await commonAssetfile({app_id:parameters.app_id, url: parameters.url.substring('/maintenance'.length), basepath:'/apps/common/public'});
            } 
            case (  parameters.app_id != serverUtilNumberValue(Config.get({app_id:0, data:{object:'ConfigServer',config_group:'SERVER',parameter:'APP_ADMIN_APP_ID'}})) && 
                    await commonAppStart(parameters.app_id) ==false):{
                return await commonComponentCreate({app_id:parameters.app_id, componentParameters:{ip:parameters.ip},type:'MAINTENANCE'});
            }
            case (parameters.url.toLowerCase().startsWith('/common')):{
                return await commonAssetfile({app_id:parameters.app_id, url:parameters.url.substring('/common'.length), basepath:'/apps/common/public'});
            }
            case (parameters.url == '/sw.js'):{
                return await commonAssetfile({app_id:parameters.app_id, url:parameters.url, basepath:'/apps/common/public'});
            }
            case (parameters.url.toLowerCase().startsWith('/css')):
            case (parameters.url.toLowerCase().startsWith('/component')):
            case (parameters.url.toLowerCase().startsWith('/images')):
            case (parameters.url.toLowerCase().startsWith('/js')):
            case (parameters.url == '/apps/common_types.js'): {
                return await commonAssetfile({app_id:parameters.app_id, url:parameters.url, basepath:App.get({app_id:parameters.app_id, resource_id:parameters.app_id}).result[0].path});
            }
            case (parameters.url.toLowerCase().startsWith('/info/about')):{
                return {result:'', type:'HTML'};
            }
            case (parameters.url.toLowerCase().startsWith('/info/disclaimer')):{
                return await commonComponentCreate({app_id:parameters.app_id, componentParameters:{ip:parameters.ip},type:'INFO_DISCLAIMER'});
            }
            case (parameters.url.toLowerCase().startsWith('/info/privacy_policy')):{
                return await commonComponentCreate({app_id:parameters.app_id, componentParameters:{ip:parameters.ip},type:'INFO_PRIVACY_POLICY'});
            }
            case (parameters.url.toLowerCase().startsWith('/info/terms')):{
                return await commonComponentCreate({app_id:parameters.app_id, componentParameters:{ip:parameters.ip},type:'INFO_TERMS'});
            }
            case (parameters.url == '/'):
            case ((App.get({app_id:parameters.app_id, resource_id:parameters.app_id}).result[0].showparam == 1 && parameters.url.split('/profile/')[1]?.length>1)):{
                return await commonComponentCreate({app_id:parameters.app_id, componentParameters:{param: parameters.url.split('/profile/')[1]?.length>1?parameters.url.split('/profile/')[1]:null,
                                                    ip:             parameters.ip, 
                                                    user_agent:     parameters.user_agent,
                                                    locale:         commonClientLocale(parameters.accept_language),
                                                    host:           parameters.host},type:'APP'})
                                    .then(app=>{
                                        /**@type{server_server_response} */
                                        const redirect = {http:301, type:'HTML'};
                                        return app.result==null?redirect:app;})
                                    .catch((error)=>{
                                                            /**@ts-ignore */
                                        return Log.post({   app_id:parameters.app_id, 
                                            data:{  object:'LogAppError', 
                                                    app:{   app_filename:serverUtilAppFilename(import.meta.url),
                                                            app_function_name:'commonApp()',
                                                            app_line:serverUtilAppLine()
                                                    },
                                                    log:error
                                                }
                                            })
                                        .then(()=>{
                                            return import('./component/common_server_error.js')
                                                .then(({default:serverError})=>{
                                                    return {result:serverError({data:null, methods:null}), type:'HTML'};
                                                });
                                        });
                                    });
            }
            default:{
                return {http:301, code:null, text:null, developerText:'commonApp', moreInfo:null, type:'JSON'};
            }
        }
};

/**
 * @name commonRegistryAppModule
 * @description App registry APP MODULE
 *              Modules that are shared by apps and server
 * @function
 * @param {number} app_id
 * @param {{type:string,
 *          name:string,
 *          role:string|null}} parameters
 * @returns {server_db_table_AppModule}
 */
const commonRegistryAppModule = (app_id, parameters) => AppModule.get({app_id:app_id, resource_id:null, data:{data_app_id:app_id}}).result
                                                           .filter((/**@type{server_db_table_AppModule}*/app)=>
                                                               app.common_type==parameters.type && 
                                                               app.common_name==parameters.name && 
                                                               app.common_role == parameters.role)[0];

export {commonSearchMatch,
        commonAppStart, commonAppHost, commonAssetfile,
        commonModuleAsset,commonModuleRun,commonAppReport, commonAppReportQueue, commonModuleMetaDataGet, 
        commonApp, commonBFE,
        commonRegistryAppModule};