/** @module apps/common/src/common */

/**
 * @import {server_db_table_App,
 *          server_db_table_AppModule,
 *          server_db_table_IamEncryption,
 *          server_db_table_IamUser,
 *          server_apps_report_create_parameters,
 *          server_apps_module_with_metadata,
 *          server_apps_module_metadata,
 *          APP_server_apps_module_common_type,
 *          server_server_res,
 *          server_bff_endpoint_type,
 *          server_db_document_ConfigServer,
 *          server_server_error,
 *          server_server_response} from '../../../server/types.js'
 * 
 */

const App = await import('../../../server/db/App.js');
const AppModule = await import('../../../server/db/AppModule.js');
const AppParameter = await import('../../../server/db/AppParameter.js');
const ConfigServer = await import('../../../server/db/ConfigServer.js');
const IamAppIdToken = await import('../../../server/db/IamAppIdToken.js');
const Log = await import('../../../server/db/Log.js');
const Security = await import('../../../server/security.js');
const {serverProcess, serverUtilAppFilename, serverUtilAppLine, serverUtilNumberValue} = await import('../../../server/server.js');
const {serverCircuitBreakerBFE, serverRequest} = await import('../../../server/server.js');

const fs = await import('node:fs');

const circuitBreaker = await serverCircuitBreakerBFE();
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
    /**@type{server_db_document_ConfigServer} */
    const configServer = ConfigServer.get({app_id:app_id}).result;
    if (serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID)!=null &&
        configServer.METADATA.MAINTENANCE==0 &&
        App.get({   app_id:app_id, 
                    resource_id:serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_START_APP_ID' in parameter)[0].APP_START_APP_ID)??0}).result[0].status =='ONLINE')
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
    
    const {microserviceRequest} = await import('../../../serviceregistry/microservice.js');

    //get GPS from IP
    const result_gps = await microserviceRequest({  app_id:parameters.app_id,
                                                    microservice:'GEOLOCATION',
                                                    service:'IP', 
                                                    method:'GET',
                                                    data:{ip:parameters.ip},
                                                    ip:parameters.ip,
                                                    user_agent:parameters.user_agent,
                                                    accept_language:parameters.user_agent,
                                                    endpoint:'SERVER'
                                                })
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
        const {default:worldcities} = await import('./functions/common_worldcities_city_random.js');
        
        const result_city = await worldcities({ app_id:parameters.app_id,
                                                data:null,
                                                user_agent:parameters.user_agent,
                                                ip:parameters.ip,
                                                host:'',
                                                idToken:'', 
                                                authorization:'',
                                                locale:parameters.accept_language})
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
 * @param {{app_id:number,
 *          url:string,
 *          method:string,
 *          body:*,
 *          user_agent:string,
 *          ip:string,
 *          'app-id': number,
 *          authorization:string|null,
 *          locale:string}} parameters
 * @returns {Promise.<server_server_response>}
 */
const commonBFE = async parameters =>{
    if (parameters.url.toLowerCase().startsWith('https://') || parameters.url.toLowerCase().startsWith('http://')){
        /**@type{server_db_document_ConfigServer} */
        const CONFIG_SERVER = ConfigServer.get({app_id:0}).result;
        return await circuitBreaker.serverRequest( 
            {
                request_function:   serverRequest,
                service:            'BFE',
                protocol:           parameters.url.toLowerCase().startsWith('https')?'https':'http',
                url:                parameters.url,
                host:               null,
                port:               null,
                admin:              parameters.app_id == serverUtilNumberValue(CONFIG_SERVER.SERVICE_APP.filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID),
                path:               null,
                body:               parameters.body,
                method:             parameters.method,
                client_ip:          parameters.ip,
                authorization:      parameters.authorization??'',
                user_agent:         parameters.user_agent,
                accept_language:    parameters.locale,
                encryption_type:    'BFE',
                'app-id':           parameters['app-id'],
                endpoint:           null
            })
            .then((/**@type{*}*/result)=>{
                return result.http?result:{result:JSON.parse(result), type:'JSON'};
            })
            .catch((/**@type{*}*/error)=>{
                return {http:500, 
                    code:'commonBFE', 
                    text:error, 
                    developerText:null, 
                    moreInfo:null,
                    type:'JSON'};
            });
    }
    else{
        const { iamUtilMessageNotAuthorized } = await import('../../../server/iam.js');
        throw iamUtilMessageNotAuthorized();
    }
};

/**
 * @name commonResourceFile
 * @memberof ROUTE_APP
 * @description Get resource
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
 *              .html files
 *              .webp files
 *              .png files
 *              .woff2 files
 *              .ttf files
 *              .json
 * @function
 * @param {{app_id:number,
 *          resource_id:string, 
 *          content_type:   string,
 *          data_app_id:number}} parameters
 * @returns {Promise.<server_server_response>}
 */
const commonResourceFile = parameters =>{

    /**
     * @param {string} content_type
     * @param {string} path
     * @returns {Promise.<server_server_response>}
     */
    const convertBinary = async (content_type, path) =>
        fs.promises.readFile(`${serverProcess.cwd()}${path}`)
                .then(image=> {
                    return {type:'JSON', 
                            result:{resource:
                                    /**@ts-ignore */                
                                    `data:${content_type};base64,${Buffer.from(image, 'binary').toString('base64')}`}};
                });
    
   
   const resource_directory = App.get({app_id:parameters.app_id, resource_id:parameters.data_app_id}).result[0].path;
   const resource_path = parameters.data_app_id==serverUtilNumberValue(ConfigServer.get({app_id:parameters.app_id,data:{config_group:'SERVICE_APP', parameter:'APP_COMMON_APP_ID'}}).result)?
                           parameters.resource_id.replace('/common', ''):
                               parameters.resource_id;
   return new Promise((resolve)=>{
       switch (true){
           case parameters.content_type == 'text/css':{
               resolve({type:'CSS', sendfile:`${serverProcess.cwd()}${resource_directory}${resource_path}`});
               break;
           }
           case parameters.content_type == 'application/json':{
               resolve({type:'JSON', sendfile:`${serverProcess.cwd()}${resource_directory}${resource_path}`});
               break;
           }
           case parameters.content_type == 'text/javascript':{
               switch (resource_path){
                   case '/modules/react/react-dom.development.js':
                   case '/modules/react/react.development.js':{
                       fs.promises.readFile(`${serverProcess.cwd()}${resource_directory}${resource_path}`, 'utf8').then((modulefile)=>{
                           if (resource_path == '/modules/react/react-dom.development.js'){
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
                   //case '/modules/vue/vue.esm-browser.js':{
                   //     resolve({type:'JS', sendfile:`${serverProcess.cwd()}${resource_directory}/modules/vue/${parameters.resource_id}`});
                   //     break;
                   // }
                   case '/modules/leaflet/leaflet-src.esm.js':{
                       fs.promises.readFile(`${serverProcess.cwd()}${resource_directory}${resource_path}`, 'utf8').then((modulefile)=>{
                           modulefile = modulefile.replace(  '//# sourceMappingURL=','//');
                           resolve({type:'JS', result:modulefile});
                       });
                       break;
                   }
                   default:
                       resolve({type:'JS', sendfile:`${serverProcess.cwd()}${resource_directory}${resource_path}`});
               }
               
               break;
           }
           case parameters.content_type == 'image/webp':
           case parameters.content_type == 'image/png':{
               resolve(convertBinary(parameters.content_type, `${resource_directory}/${resource_path}`));
               break;
           }
           case ['WOFF2','TTF'].includes(resource_path.toUpperCase().substring(resource_path.lastIndexOf('.')+1)):{
               //fonts loaded in css, replace 'common' in path
               /**@type {'WOFF2'|'TTF'|*} */
               const type = resource_path.toUpperCase().substring(resource_path.lastIndexOf('.')+1);
               resolve({type:type.replace('WOFF2','WOFF'), sendfile:`${serverProcess.cwd()}${resource_directory}${resource_path}`});
               break;
           }
           default:{
               Log.post({  app_id:parameters.app_id, 
                   data:{  object:'LogAppError', 
                           app:{   app_filename:serverUtilAppFilename(import.meta.url),
                                   app_function_name:'commonResourceFile()',
                                   app_line:serverUtilAppLine()
                           },
                           log:`Invalid resource ${parameters.resource_id}`
                       }
                   })
               .then(()=>{
                   resolve({http:404, code:'APP', text:null, developerText:null, moreInfo:null, type:'JSON'});

               });
           }
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
                                                module_app_id:parameters.app_id,
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
 *                  module_app_id?:number|null,
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
    const {iamUtilMessageNotAuthorized} = await import('../../../server/iam.js');
    //Module can be defined in module_app_id and can run data in data_app_id or be defined and run in same data_app_id
    const modules = AppModule.get({app_id:parameters.app_id, 
                                            resource_id:null, 
                                            data:{data_app_id:parameters.data.module_app_id ?? parameters.data.data_app_id}});
    if (modules.result){
        if (parameters.data?.type =='ASSET'|| parameters.data?.type =='FUNCTION'||parameters.endpoint=='APP_EXTERNAL'||parameters.endpoint=='APP_ACCESS_EXTERNAL'){
            const module = modules.result.filter((/**@type{server_db_table_AppModule}*/app)=>
                                                                                                //APP EXTERNAL only uses id and message keys, add function type
                                                                                                app.common_type==((parameters.endpoint=='APP_EXTERNAL' ||parameters.endpoint=='APP_ACCESS_EXTERNAL')?'FUNCTION':parameters.data.type) && 
                                                                                                app.common_name==parameters.resource_id && 
                                                                                                app.common_role == parameters.endpoint)[0];
            if (module){
                const {default:RunFunction} = await import('../../..' + module.common_path);
                return await RunFunction({  app_id:parameters.app_id, 
                                            resource_id: parameters.resource_id,
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
    const {iamUtilMessageNotAuthorized} = await import('../../../server/iam.js');
    const AppModuleQueue = await import('../../../server/db/AppModuleQueue.js');
    if (parameters.data?.type =='REPORT'){
        const modules = AppModule.get({app_id:parameters.app_id, resource_id:null, data:{data_app_id:parameters.app_id}})                                           ;
        if (modules.result){
            const module = modules.result.filter((/**@type{server_db_table_AppModule}*/app)=>
                                                                                            app.common_type==parameters.data.type && 
                                                                                            app.common_name==parameters.resource_id && 
                                                                                            app.common_role == parameters.endpoint)[0];
            if (module){
                //report
                const { iamAuthorizeIdToken } = await import('../../../server/iam.js');
                //ID token is created but not used in report
                await iamAuthorizeIdToken(parameters.app_id, parameters.ip, 'REPORT');
                const {default:ComponentCreate} = await import('./component/common_report.js');
                
                const {default:RunReport} = await import('../../..' + module.common_path);
    
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
                    ComponentCreate({   data:  {
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
    const AppModuleQueue = await import('../../../server/db/AppModuleQueue.js');
    const IamUser = await import('../../../server/db/IamUser.js');
    const { iamUtilTokenGet } = await import('../../../server/iam.js');
    const {iamUtilMessageNotAuthorized} = await import('../../../server/iam.js');

    const report = AppModule.get({app_id:parameters.app_id, resource_id:parameters.resource_id, data:{data_app_id:null}});
    if (report.result){
        /**@type{server_db_table_IamUser} */
        const user = IamUser.get(  parameters.app_id, 
                                            serverUtilNumberValue(iamUtilTokenGet(  parameters.app_id, 
                                                                                    parameters.authorization, 
                                                                                    parameters.app_id==serverUtilNumberValue(ConfigServer.get({app_id:parameters.app_id, data:{config_group:'SERVICE_APP',parameter:'APP_ADMIN_APP_ID'}}).result)?
                                                                                                                                                    'ADMIN':
                                                                                                                                                        /**@ts-ignore */
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
            AppModuleQueue.update(parameters.app_id, result_post.result.insertId, { start:new Date().toISOString(),
                                                                    progress:0, 
                                                                    status:'RUNNING'})
            .then(()=>{
                //report can update progress and only progress if necessary
                //add queue id and parameters from parameter from origin
                //do not wait for submitted report
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
            });
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
    const {iamUtilMessageNotAuthorized} = await import('../../../server/iam.js');
    if (parameters.data.type=='REPORT'||parameters.data.type=='MODULE'||parameters.data.type=='FUNCTION'){
        const modules = AppModule.get({app_id:parameters.app_id, resource_id:parameters.resource_id,data:{data_app_id:parameters.app_id}});
        if (modules.result){
            const module_reports = modules.result.filter((/**@type{server_db_table_AppModule}*/row)=>row.common_type==parameters.data.type);
            if (module_reports){
                for (const row of module_reports){
                    const module = await import('../../..' + row.common_path);
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
 * @name commonAppIam
 * @description Returns authenticated app id 
 * @param {string} host 
 * @param {server_bff_endpoint_type|null} endpoint
 * @param {{
 *          IamEncryption:  server_db_table_IamEncryption|null,
 *          idToken:        string|null,
 *          AppId:          number, 
 *          AppSignature:   string|null
 *          }|null} security
 * @returns {Promise.<{ admin:boolean,
 *                      app_id:number|null,
 *                      app_id_token:number|null,
 *                      apps:server_db_table_App['id'][]}>}
 */
const commonAppIam = async (host, endpoint=null, security=null) =>{
    //authenticate:
    //app_id 
    //decrypted app id = [app id for uuid]
    //decrypted token = [token for uuid]
    //decrypted Appsignature can be decrypted using 
    //  secret found in IamEncryption for decrypted app id, token and for uuid used in request
    if (security?.IamEncryption && 
        (
        security?.AppId == security?.IamEncryption?.app_id  &&
        security?.idToken?.replace('Bearer ','') == IamAppIdToken.get({  app_id:0, 
                                                                        resource_id:security?.IamEncryption.iam_app_id_token_id??null, 
                                                                        data:{data_app_id:null}}).result[0].token &&
        await Security.securityTransportDecrypt({ 
            app_id:0,
            encrypted:  security.AppSignature??'',
            jwk:        JSON.parse(Buffer.from(security.IamEncryption.secret, 'base64').toString('utf-8')).jwk,
            iv:         JSON.parse(Buffer.from(security.IamEncryption.secret, 'base64').toString('utf-8')).iv})
            .then(()=>
                1)
            .catch(()=>
                0
            )==1)==false){
            return {admin:false, 
                    app_id:null,
                    app_id_token:null,
                    apps:[]};
    }
    else{
        /**@type{server_db_document_ConfigServer} */
        const configServer = ConfigServer.get({app_id:0}).result;
        /**@type{server_db_table_App['id'][]} */
        const apps = App.get({app_id:serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID)??0, resource_id:null})
                    .result.map((/**@type{server_db_table_App}*/app)=>{return app.id;});
        if (endpoint !=null && ['MICROSERVICE', 'MICROSERVICE_AUTH'].includes(endpoint))
            return {admin:false, 
                    app_id:serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID),
                    app_id_token:serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID),
                    //all apps
                    apps:apps};
        else
            if ([configServer.SERVER.filter(parameter=>'HTTP_PORT_ADMIN' in parameter)[0].HTTP_PORT_ADMIN,
                configServer.SERVER.filter(parameter=>'HTTPS_PORT_ADMIN' in parameter)[0].HTTPS_PORT_ADMIN]
                                    .includes(host.split(':')[host.split(':').length-1]))
                return {
                        admin:true,
                        app_id:serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_ADMIN_APP_ID' in parameter)[0].APP_ADMIN_APP_ID),
                        app_id_token:serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_ADMIN_APP_ID' in parameter)[0].APP_ADMIN_APP_ID),
                        //all apps
                        apps:apps
                };
            else        
                if (endpoint==null)
                    return {
                        admin:false,
                        app_id:serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID),
                        app_id_token:serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID),
                        //no apps
                        apps:[]
                    };
                else        
                    return {
                            admin:false,
                            app_id:serverUtilNumberValue(security?.AppId)??0,
                            app_id_token:serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID),
                            //all apps except admin
                            apps:apps.filter(id=>id != serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_ADMIN_APP_ID' in parameter)[0].APP_ADMIN_APP_ID))
                    };
    }
    
 };
 /**
  * @name commonAppInit
  * @memberof ROUTE_REST_API
  * @description Get app 
  * @function
  * @param {{app_id:number,
  *          resource_id:number,
  *          ip:string,
  *          host:string,
  *          user_agent:string,
  *          accept_language:string,
  *          idToken:string, 
  *          data:{ locale:string } } } parameters
  * @returns {Promise.<server_server_response & {result?:{App:{id:server_db_table_App['id'],
  *                                                            name:server_db_table_App['name'],
  *                                                            js:server_db_table_App['js'],
  *                                                            js_content:string|null,
  *                                                            css:server_db_table_App['css'],
  *                                                            css_content:string|null,
  *                                                            css_report:server_db_table_App['css_report'],
  *                                                            css_report_content:string|null,
  *                                                            favicon_32x32:server_db_table_App['favicon_32x32'],
  *                                                            favicon_32x32_content:string|null,
  *                                                            favicon_192x192:server_db_table_App['favicon_192x192'],
  *                                                            favicon_192x192_content:string|null,
  *                                                            logo:server_db_table_App['logo'],
  *                                                            logo_content:string|null,
  *                                                            copyright:server_db_table_App['copyright'],
  *                                                            link_url:server_db_table_App['link_url'],
  *                                                            link_title:server_db_table_App['link_title'],
  *                                                            text_edit:server_db_table_App['text_edit']},
  *                                                       AppParameter:server_db_table_AppParameter | {} } }>}
  */
const commonAppInit = async parameters =>{
    /**@type{server_db_document_ConfigServer} */
    const configServer = ConfigServer.get({app_id:parameters.app_id}).result;
    if (parameters.resource_id == serverUtilNumberValue(configServer.SERVICE_APP
                                                        .filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID))
        return {http:400,
            code:null,
            text:null,
            developerText:'commonAppInit',
            moreInfo:null,
            sendfile:null,
            type:'JSON'};
    else{
        /**@type{server_db_table_App} */
        const app = App.get({app_id:parameters.app_id, resource_id:parameters.resource_id}).result[0];
        const {socketConnectedUpdate} = await import ('../../../server/socket.js');
        const fs = await import('node:fs');
        
        /**
         * @param {string} path
         * @param {string} content_type
         * @returns {Promise.<string|null>}
         */
        const fetchResource = async (path, content_type) =>{
            const resource = await commonResourceFile({app_id:parameters.app_id, 
                                    resource_id:path, 
                                    content_type:content_type,
                                    data_app_id: parameters.app_id});
            if (content_type.startsWith('image'))
                return resource.result.resource ?? null;
            else{
                /**@ts-ignore */
                return resource?fs.promises.readFile(resource.sendfile, 'utf8'):null;
            }
        };
        if (app)
            return {result:{App:{   id:                     app.id,
                                    name:                   app.name,
                                    js:                     app.js,
                                    js_content:             app.js?
                                                                await fetchResource(app.js, 'text/javascript'):
                                                                    null,
                                    css:                    app.css,
                                    css_content:            app.css?
                                                                await fetchResource(app.css, 'text/css'):
                                                                    null,
                                    css_report:             app.css_report,
                                    css_report_content:     app.css_report?
                                                                await fetchResource(app.css_report, 'text/css'):
                                                                    null,
                                    favicon_32x32:          app.favicon_32x32,
                                    favicon_32x32_content:  app.favicon_32x32?
                                                                await fetchResource(app.favicon_32x32, 'image/png'):
                                                                    null,
                                    favicon_192x192:        app.favicon_192x192,
                                    favicon_192x192_content:app.favicon_192x192?
                                                                await fetchResource(app.favicon_192x192, 'image/png'):
                                                                    null,
                                    logo:                   app.logo,
                                    logo_content:           app.logo?
                                                                await fetchResource(app.logo, 'image/png'):
                                                                    null,
                                    copyright:              app.copyright,
                                    link_url:               app.link_url,
                                    link_title:             app.link_title,
                                    text_edit:              app.text_edit
                                },
                            AppParameter:AppParameter.get({  app_id:parameters.app_id, resource_id:parameters.resource_id}).result?.[0]??{},
                            ...(await socketConnectedUpdate(parameters.app_id, 
                                                            {idToken:parameters.idToken, 
                                                             app_only:true,
                                                             iam_user_id:null,
                                                             iam_user_username:null,
                                                             iam_user_type:null,
                                                             token_access:null,
                                                             token_admin:null,
                                                             ip:parameters.ip,
                                                             headers_user_agent:parameters.user_agent,
                                                             headers_accept_language:parameters.accept_language})).result
                            }, 
                    type:'JSON'};
        else
            return {http:404,
                code:null,
                text:null,
                developerText:'commonAppInit',
                moreInfo:null,
                sendfile:null,
                type:'JSON'};
    }
};

 /**
 * @name commonApp
 * @memberof ROUTE_APP
 * @description Get app 
 * @function
 * @param {{app_id:number,
 *          ip:string,
 *          host:string,
 *          user_agent:string,
 *          accept_language:string}} parameters
 * @returns {Promise.<server_server_response>}
 */
const commonApp = async parameters =>{

    if (parameters.app_id==null)
        return {http:404,
                code:null,
                text:null,
                developerText:'commonApp',
                moreInfo:null,
                sendfile:null,
                type:'JSON'};
    else
        if  ((await commonAppIam(parameters.host, 'APP')).admin == false && 
                await commonAppStart(parameters.app_id) ==false){
            const {default:ComponentCreate} = await import('./component/common_maintenance.js');
            return {result:await ComponentCreate({  data:   null,
                                                    methods:null
                                                }), type:'HTML'};
        }
        else{
            const {default:ComponentCreate} = await import('./component/common_app.js');
            const { iamAuthorizeIdToken } = await import('../../../server/iam.js');
            /**@type{server_db_document_ConfigServer} */
            const configServer = ConfigServer.get({app_id:parameters.app_id}).result;
            const Security = await import('../../../server/security.js');
            const IamEncryption = await import ('../../../server/db/IamEncryption.js');
            const admin_app_id = serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_ADMIN_APP_ID' in parameter)[0].APP_ADMIN_APP_ID)??1;
            const common_app_id = serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID)??0;
            //save UUID, secret and idToken (ADD FK) in IamEncryption
            const app_id = (await commonAppIam(parameters.host, 'APP')).admin?
                                admin_app_id:
                                    common_app_id;
            const uuid = Security.securityUUIDCreate();
            //save token in admin appid for admin or in commmon app id for users
            const idToken = await iamAuthorizeIdToken(app_id,parameters.ip, 'APP');
            //create secrets key and iv inside base64 string
            const secret = Buffer.from(JSON.stringify(await Security.securityTransportCreateSecrets()),'utf-8').toString('base64');
            //Insert encryption metadata record 
            IamEncryption.post(app_id,
                                {app_id:app_id, uuid:uuid, secret:secret, iam_app_id_token_id:idToken.id, type:'SERVER'});
            return {result:await ComponentCreate({data:     {
                                                            app_id:                             app_id,
                                                            app_admin_app_id:                   admin_app_id,
                                                            rest_resource_bff:                  configServer.SERVER.filter(parameter=>'REST_RESOURCE_BFF' in parameter)[0].REST_RESOURCE_BFF,
                                                            app_rest_api_version:               configServer.SERVER.filter(parameter=>'REST_API_VERSION' in parameter)[0].REST_API_VERSION,
                                                            app_request_timeout_seconds:        serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_REQUESTTIMEOUT_SECONDS' in parameter)[0].APP_REQUESTTIMEOUT_SECONDS)??5,
                                                            app_requesttimeout_admin_minutes:   serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_REQUESTTIMEOUT_ADMIN_MINUTES' in parameter)[0].APP_REQUESTTIMEOUT_ADMIN_MINUTES)??60,
                                                            idToken:                            idToken.token,
                                                            uuid:                               uuid,
                                                            secret:                             secret,
                                                            encrypt_transport:                  serverUtilNumberValue(configServer.SERVICE_IAM
                                                                                                .filter(parameter=>'ENCRYPT_TRANSPORT' in parameter)[0].ENCRYPT_TRANSPORT)??0
                                                            },
                                                methods:    {   
                                                            securityTransportEncrypt:Security.securityTransportEncrypt
                                                            }})
                                .catch(error=>{
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
                            }),
                    type:'HTML'};
                                
        }
            
};

/**
 * @name commonAppResource
 * @memberof ROUTE_REST_API
 * @description Get app resources
 *              resource id:            
 *                  privacy_policy
 *                  disclaimer
 *                  terms
 *                  about
 *		            filename in /apps/app[app_id]|common/public/component
 *		            filename in /apps/app[app_id]|common/public/css
 *		            filename in /apps/app[app_id]|common/public/images
 *		            filename in /apps/app[app_id]|common/public/js
 *                  filename in /apps/app[app_id]|common/public/modules/react
 *                  filename in /apps/app[app_id]|common/public/modules/leaflet
 *                  filename in /apps/app[app_id]|common/public/modules/vue
 * @function
 * @param {{app_id:number|null,
 *          resource_id:string,
 *          ip:string,
 *          host:string,
 *          user_agent:string,
 *          accept_language:string,
 *          data:{data_app_id:number,
 *                type: 'INFO'|'RESOURCE',
 *                content_type: string}
 *          }} parameters
 * @returns {Promise.<server_server_response>}
 */
const commonAppResource = async parameters =>{
   
    if (parameters.app_id==null)
        return {http:404,
                code:null,
                text:null,
                developerText:'commonApp',
                moreInfo:null,
                sendfile:null,
                type:'JSON'};
    else
        switch (true){
            case (parameters.data.type == 'INFO' && parameters.resource_id.toLowerCase() == 'disclaimer'):
            case (parameters.data.type == 'INFO' && parameters.resource_id.toLowerCase() == 'privacy_policy'):
            case (parameters.data.type == 'INFO' && parameters.resource_id.toLowerCase() == 'terms'):{
                const {default:ComponentCreate} = await import('./component/common_info.js');
                return {result:await ComponentCreate({  data: { app_name:   App.get({   app_id:parameters.app_id, 
                                                                                        resource_id:parameters.app_id}).result[0].name,
                                                                                        /**@ts-ignore */
                                                                type:       'INFO_' + parameters.resource_id.toUpperCase()},
                                                        methods:null}), 
                        type:'HTML'};
            }
            case parameters.data.content_type == 'text/css':
            case parameters.data.content_type == 'text/javascript':
            case parameters.data.content_type == 'image/webp':
            case parameters.data.content_type == 'image/png':
            case parameters.data.content_type == 'application/json':{
                return await commonResourceFile({   app_id:parameters.app_id, 
                                                    resource_id:parameters.resource_id.replaceAll('~','/'), 
                                                    content_type:parameters.data.content_type,
                                                    data_app_id: parameters.data.data_app_id});
            }
            default:{
                return {http:401, code:null, text:null, developerText:'commonAppResource', moreInfo:null, type:'JSON'};
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
        commonAppStart, commonClientLocale,
        commonAppIam, commonResourceFile,
        commonModuleAsset,commonModuleRun,commonAppReport, commonAppReportQueue, commonModuleMetaDataGet, 
        commonAppInit,
        commonApp,
        commonAppResource,
        commonGeodata,
        commonBFE,
        commonRegistryAppModule};