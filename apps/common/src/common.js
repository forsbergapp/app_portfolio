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

const Security = await import('../../../server/security.js');
const {ORM, serverCircuitBreakerBFE, serverRequest, serverUtilAppFilename, serverUtilAppLine} = await import('../../../server/server.js');
const {microserviceRequest} = await import('../../../serviceregistry/microservice.js');
const fs = await import('node:fs');

const FILES= {data:[]};

/**
 * @name commonConvertBinary
 * @description  converts binary file to base64 url string
 * @param {string} content_type
 * @param {string} path
 * @returns {Promise.<server_server_response>}
 */
const commonConvertBinary = async (content_type, path) =>
    fs.promises.readFile(`${ORM.serverProcess.cwd()}${path}`)
            .then(file=> {
                return {type:'JSON', 
                        result:{resource:
                                content_type.startsWith('font/woff')? 
                                    /**@ts-ignore */
                                    `data:font/woff2;charset=utf8;base64,${Buffer.from(file, 'binary').toString('base64')}`:
                                        /**@ts-ignore */
                                        `data:${content_type};base64,${Buffer.from(file, 'binary').toString('base64')}`
                                }
                        };
            });

/**
 * @name commonGetFile
 * @description Returns file from cache in FILES variable or reads from disk, saves in variable and returns file content.
 *              Modify function parameter can be used to modify original content.
 *              Comment rows are removed from all css and javascript except common third party modules before modify function.
 * @function
 * @param{{ app_id:number,
 *          path:string,
 *          content_type:string,
 *          modify?:(arg0:string)=>string }} parameters
 * @returns {Promise.<*>}
 */
const commonGetFile = async parameters =>{
    /**
     * @param {{path:string,
     *          file:string
     *          content_type:string,
     *          }} parameters
     */
    const adjustResult = parameters =>{
        // remove comment rows for text/css and text/javascript and except third party modules
        return  (parameters.path.startsWith('/apps/') && 
                !parameters.path.startsWith('/apps/common/public/modules/') &&
                ['text/css','text/javascript'].includes(parameters.content_type))?
                parameters.file
                .replaceAll('\r','\n')
                .split('\n')
                .filter(row=>
                            !row.trimStart().toLowerCase().startsWith('/*') &&
                            !row.trimStart().toLowerCase().startsWith('*') &&
                            !row.trimStart().toLowerCase().startsWith('//') &&
                            row!='')
                .join('\n'):
                    parameters.file;
    };
    
    return FILES.data.filter(row=>row[0]==parameters.path)[0]?.[1] ??
            (['font/woff2','image/png', 'image/webp'].includes(parameters.content_type)?
                fs.promises.readFile(`${ORM.serverProcess.cwd()}${parameters.path}`):
                    fs.promises.readFile(`${ORM.serverProcess.cwd()}${parameters.path}`, 'utf8'))
            .then(result=>{
                const file = ['font/woff2','image/png', 'image/webp'].includes(parameters.content_type)?
                                parameters.content_type == 'font/woff2'? 
                                            /**@ts-ignore */
                                            `data:font/woff2;charset=utf8;base64,${Buffer.from(result, 'binary').toString('base64')}`:
                                                /**@ts-ignore */
                                                `data:${parameters.content_type};base64,${Buffer.from(result, 'binary').toString('base64')}`
                                        :
                                    (parameters.modify?
                                        parameters.modify(adjustResult({  
                                                                path:parameters.path,
                                                                content_type:parameters.content_type,
                                                                file:result.toString()})):
                                            adjustResult({  
                                                path:parameters.path,
                                                content_type:parameters.content_type,
                                                file:result.toString()}));
                /**@ts-ignore */
                FILES.data.push([parameters.path, file]);
                return file;
            })
            .catch(error=>{
                ORM.db.log.post({app_id:parameters.app_id, 
                                        data:{  object:'LogServiceInfo', 
                                                app:{   app_filename:serverUtilAppFilename(import.meta.url),
                                                        app_function_name:'commonGetFile()',
                                                        app_line:serverUtilAppLine()
                                                },
                                                log:`Resource ${parameters.path}, error:${error}`
                                            }
                                        })
                                        /**@ts-ignore */
                                        .then(result=>{
                                            return result.http?
                                                result:
                                                    import('../../../server/iam.js')
                                                    .then(({iamUtilMessageNotAuthorized})=>{
                                                        return {http:400,
                                                                code:'APP',
                                                                text:iamUtilMessageNotAuthorized(),
                                                                developerText:'commonGetFile',
                                                                moreInfo:null,
                                                                type:'JSON'
                                                                };
                                                    });
                                        });
            });
};

/**
 * @name commonCssFonts
 * @description resource /common/css/font/fonts.css using IIFE to save as constant
 *              can return base64 url or secure url:
 *              secure url logic:
 *              replaces url with secure font url /bff/x/[uuid]
 *              returns array with data to create records in IamEncryption with old url for all font url
 *              returns {css:string, db_records:server_db_table_IamEncryption[]}
 * @constant
 */
const commonCssFonts = await (async base64=>{
    const cssFontFace = [];
    /**@type {{uuid:String, url:string}[]}} */
    const url_record = [];
    const db_records = [];
    const resource_directory = ORM.db.App.get({app_id:0, resource_id:0}).result[0].path;
    for (const fontFace of (await fs.promises
                            .readFile(`${ORM.serverProcess.cwd()}${ORM.db.App.get({app_id:0, resource_id:0}).result[0].path}/css/font/fonts.css`))
                            .toString('utf8')
                            .replaceAll('\r','\n')
                            .split('@')){
        //Filter font most used or set * for all
        if (['*'].filter(font=>font=='*'?true:fontFace.indexOf(`font-family: '${font}'`)>-1).length>0){
                const css = [];
                for (const row of fontFace.split('\n'))
                    if (row.trimStart().toLowerCase().startsWith('src')){
                        const startString = 'src: url(';
                        const endString = ') format';
                        const url = row.substring(
                                                    row.indexOf(startString) + startString.length,
                                                    row.indexOf(endString)
                                                );
                        if (base64)
                            //save url as base64 without link
                            css.push(   row.substring(0, row.indexOf(startString) + startString.length) +
                                        (await commonConvertBinary('font/woff2',`${resource_directory}${url.replace('/common','')}`)).result.resource + 
                                        row.substring(row.indexOf(endString)));
                        else{
                            //save url as secure url link
                            //font url can be repeated in css
                            if (url_record.filter(row=>row.url == url).length==0){
                                const uuid  = Security.securityUUIDCreate(); 
                                url_record.push({uuid:uuid, url:url});
                                const secret= Buffer.from(JSON.stringify(await Security.securityTransportCreateSecrets()),'utf-8')
                                                .toString('base64');
                                db_records.push({id:                Date.now(),
                                                app_id:             0, 
                                                iam_app_id_token_id:null, 
                                                uuid:               uuid, 
                                                secret:             secret, 
                                                url:                url,
                                                type:               'FONT',
                                                created:            new Date().toISOString()});
                                css.push(row.substring(0, row.indexOf(startString) + startString.length) +
                                                `/bff/x/${uuid}` + row.substring(row.indexOf(endString)));
                            }
                            else
                                css.push(row.substring(0, row.indexOf(startString) + startString.length) +
                                                `/bff/x/${url_record.filter(row=>row.url == url)[0].uuid}` + row.substring(row.indexOf(endString)));

                        }                        
                            
                    }
                    else
                        css.push(row);
                cssFontFace.push(css.join('').substring(0, css.join('').indexOf('}')+1));
        }
    }
    return {css:cssFontFace.join('\n@'), db_records:db_records};
})(false);

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
    const configServer = ORM.db.ConfigServer.get({app_id:app_id}).result;
    if (ORM.serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID)!=null &&
        configServer.METADATA.MAINTENANCE==0 &&
        ORM.db.App.get({ app_id:app_id, 
                                resource_id:ORM.serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_START_APP_ID' in parameter)[0].APP_START_APP_ID)??0}).result[0].status =='ONLINE')
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
    if (parameters.url.toLowerCase().startsWith('http://')){
        /**@type{server_db_document_ConfigServer} */
        const CONFIG_SERVER = ORM.db.ConfigServer.get({app_id:0}).result;
        return await circuitBreaker.serverRequest( 
            {
                request_function:   serverRequest,
                service:            'BFE',
                protocol:           'http',
                url:                parameters.url,
                host:               null,
                port:               null,
                admin:              parameters.app_id == ORM.serverUtilNumberValue(CONFIG_SERVER.SERVICE_APP.filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID),
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
 * @description Get resource from file or from cached file in FILES variable to avoid disk read
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
 *              .json
 * @function
 * @param {{app_id:number,
 *          resource_id:string, 
 *          content_type:   string,
 *          data_app_id:number}} parameters
 * @returns {Promise.<server_server_response & {result?:{resource:*}}>}
 */
const commonResourceFile = async parameters =>{
    const resource_directory = ORM.db.App.get({app_id:parameters.app_id, resource_id:parameters.data_app_id}).result[0].path;
    const resource_path = parameters.data_app_id==ORM.serverUtilNumberValue(ORM.db.ConfigServer.get({app_id:parameters.app_id,data:{config_group:'SERVICE_APP', parameter:'APP_COMMON_APP_ID'}}).result)?
                            parameters.resource_id.replace('/common', ''):
                                parameters.resource_id;
    switch (true){
        case parameters.content_type == 'text/css' && parameters.resource_id=='/common/css/font/fonts.css':{
            //loaded at server start with font url replaced with secure url and about 1700 IamEncryption records
            return {result:{resource:commonCssFonts.css}, type:'JSON'};
        }
        case parameters.content_type == 'text/css' && parameters.resource_id == '/common/modules/leaflet/leaflet.css':{
            /**
             * @description Remove third party fonts
             * @param {string} file
             */
            const modify = file =>{
                return  file
                        .replaceAll('\r','\n')
                        .split('\n')
                        .map(row=> {
                            const match = /font-family:[\s\S]*?;/g.exec(row);
                            if (match)
                                return row.replace(match[0], '');
                            else
                                return row;
                        })
                        .join('\n');
            };
            return {type:'JSON', 
                    result:{
                            resource:await commonGetFile({  app_id:parameters.app_id, 
                                                            path:`${resource_directory}${resource_path}`, 
                                                            content_type:'text/css',
                                                            modify:modify})
                            }
                    };
        }
        case parameters.content_type == 'text/css':
        case parameters.content_type == 'application/json':
        case parameters.content_type == 'image/webp':
        case parameters.content_type == 'image/png':
        case parameters.content_type == 'font/woff2':{        
            return {type:'JSON', 
                    result:{
                            resource: await commonGetFile({ app_id:parameters.app_id, 
                                                            path:`${resource_directory}${resource_path}`,
                                                            content_type:parameters.content_type})
                            }
                    };
        }
        case parameters.content_type == 'text/javascript':{
            switch (resource_path){
                case '/modules/react/react-dom.development.js':
                case '/modules/react/react.development.js':{
                    /**
                     * @description Make ESM module
                     * @param {string} file
                     */
                    const modify = file =>{
                        if (resource_path == '/modules/react/react-dom.development.js'){
                            file = 'let ReactDOM;\r\n' + file;
                            file = file.replace(  'exports.version = ReactVersion;',
                                                            'exports.version = ReactVersion;\r\n  ReactDOM=exports;');
                            file = file + 'export {ReactDOM}';
                        }
                        else{
                            file = 'let React;\r\n' + file;
                            file = file.replace(  'exports.version = ReactVersion;',
                                                            'exports.version = ReactVersion;\r\n  React=exports;');
                            file = file + 'export {React}';
                        }  
                        return file;
                    };
                    return {type:'JSON', 
                            result:{
                                    resource:await commonGetFile({  app_id:parameters.app_id, 
                                                                    path:`${resource_directory}${resource_path}`, 
                                                                    content_type:parameters.content_type,
                                                                    modify:modify})
                                    }
                            };
                }
                case '/modules/leaflet/leaflet-src.esm.js':{
                    /**
                     * @description Replace sourceMappingUrl
                     * @param {string} file
                     */
                    const modify = file =>{
                        return file.replace(  '//# sourceMappingURL=','//');
                    };
                    return {type:'JSON', 
                            result:{
                                    resource:await commonGetFile({  app_id:parameters.app_id, 
                                                                    path:`${resource_directory}${resource_path}`, 
                                                                    content_type:parameters.content_type,
                                                                    modify:modify})
                                    }
                            };
                }
                default:
                    return {type:'JSON', 
                            result:{resource:await commonGetFile({  app_id:parameters.app_id, 
                                                                    path:`${resource_directory}${resource_path}`,
                                                                    content_type:parameters.content_type})
                                    }
                            };
            }
        }
        default:{
            return ORM.db.Log.post({ app_id:parameters.app_id, 
                                            data:{  object:'LogAppError', 
                                                    app:{   app_filename:serverUtilAppFilename(import.meta.url),
                                                            app_function_name:'commonResourceFile()',
                                                            app_line:serverUtilAppLine()
                                                    },
                                                    log:`Invalid resource ${parameters.resource_id}`
                                                }
                                            })
            .then(()=>{
                return {http:404, code:'APP', text:null, developerText:null, moreInfo:null, type:'JSON'};
            });
        }
    }
};
/**
 * @name commonModuleRun
 * @description Run function for given app and role
 *              Parameters in data should be requried data_app_id plus additional keys
 *              Can return anything specified by the function and supported by the server
 *              JSON, HTML, CSS, JS, WEBP, PNG, WOFF
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
    const modules = ORM.db.AppModule.get({app_id:parameters.app_id, 
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
                return ORM.db.Log.post({ app_id:parameters.app_id, 
                                                data:{  object:'LogAppError', 
                                                        app:{   app_filename:serverUtilAppFilename(import.meta.url),
                                                                app_function_name:'commonModuleRun()',
                                                                app_line:serverUtilAppLine()
                                                        },
                                                        log:`Module ${parameters.resource_id} not found`
                                                    }
                                                })
                .then((/**@type{server_server_response}*/result)=>{          
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
    if (parameters.data?.type =='REPORT'){
        const modules = ORM.db.AppModule.get({app_id:parameters.app_id, resource_id:null, data:{data_app_id:parameters.app_id}});
        if (modules.result){
            const module = modules.result.filter((/**@type{server_db_table_AppModule}*/app)=>
                                                                                            app.common_type==parameters.data.type && 
                                                                                            app.common_name==parameters.resource_id && 
                                                                                            app.common_role == parameters.endpoint)[0];
            if (module){
                const {iamAuthorizeIdToken} = await import('../../../server/iam.js');
                //report
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
                                            ORM.db.AppModuleQueue.postResult( parameters.app_id, 
                                                                                parameters.data.queue_parameters?.appModuleQueueId??0, 
                                                                                result_queue)
                                            .then((/**@type{server_server_response}*/result_AppModuleQueue)=>
                                                result_AppModuleQueue.http?
                                                    result_AppModuleQueue:
                                                        ORM.db.AppModuleQueue.update( parameters.app_id, 
                                                                                        parameters.data.queue_parameters?.appModuleQueueId??0, 
                                                                                        {   end:new Date().toISOString(), 
                                                                                            progress:1, 
                                                                                            status:'SUCCESS'}));
                                                
                                        })
                                        .catch(error=>{
                                            //update report fail
                                            ORM.db.AppModuleQueue.update( parameters.app_id, 
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
                    return {result:{resource:await ComponentCreate({data:   {
                                                    CONFIG_APP: {...ORM.db.App.get({app_id:parameters.app_id, resource_id:parameters.app_id}).result[0]},
                                                    data:       data,
                                                    /**@ts-ignore */
                                                    papersize:  (pagesize=='' ||pagesize==null)?'A4':pagesize
                                                    },
                                            methods:{function_report:RunReport}})}, type:'JSON'};
            }
            else{
                return ORM.db.Log.post({   app_id:parameters.app_id, 
                    data:{  object:'LogAppError', 
                            app:{   app_filename:serverUtilAppFilename(import.meta.url),
                                    app_function_name:'commonAppReport()',
                                    app_line:serverUtilAppLine()
                            },
                            log:`Module ${parameters.resource_id} not found`
                        }
                    })
                .then((/**@type{server_server_response}*/result)=>{
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
    const { iamUtilTokenGet } = await import('../../../server/iam.js');
    const {iamUtilMessageNotAuthorized} = await import('../../../server/iam.js');

    const report = ORM.db.AppModule.get({app_id:parameters.app_id, resource_id:parameters.resource_id, data:{data_app_id:null}});
    if (report.result){
        /**@type{server_db_table_IamUser} */
        const user = ORM.db.IamUser.get(  parameters.app_id, 
                                            ORM.serverUtilNumberValue(iamUtilTokenGet(  parameters.app_id, 
                                                                                        parameters.authorization, 
                                                                                        parameters.app_id==ORM.serverUtilNumberValue(ORM.db.ConfigServer.get({app_id:parameters.app_id, data:{config_group:'SERVICE_APP',parameter:'APP_ADMIN_APP_ID'}}).result)?
                                                                                                                                                        'ADMIN':
                                                                                                                                                            /**@ts-ignore */
                                                                                                                                                            'APP_ACCESS').iam_user_id)).result[0];
        const result_post = await ORM.db.AppModuleQueue.post(parameters.app_id, 
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
            ORM.db.AppModuleQueue.update(parameters.app_id, result_post.result.insertId, { start:new Date().toISOString(),
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
        return ORM.db.Log.post({ app_id:parameters.app_id, 
                                        data:{  object:'LogAppError', 
                                                app:{   app_filename:serverUtilAppFilename(import.meta.url),
                                                        app_function_name:'commonAppReportQueue()',
                                                        app_line:serverUtilAppLine()
                                                },
                                                log:`Module ${parameters.resource_id} not found`
                                            }
                                        })
                .then((/**@type{server_server_response}*/result)=>{
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
        const modules = ORM.db.AppModule.get({app_id:parameters.app_id, resource_id:parameters.resource_id,data:{data_app_id:parameters.app_id}});
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
                return ORM.db.Log.post({ app_id:parameters.app_id, 
                                                data:{  object:'LogAppError', 
                                                        app:{   app_filename:serverUtilAppFilename(import.meta.url),
                                                                app_function_name:'commonModuleMetaDataGet()',
                                                                app_line:serverUtilAppLine()
                                                        },
                                                        log:`Module ${parameters.resource_id} not found`
                                                    }
                                                })
                    .then((/**@type{server_server_response}*/result)=>{
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
    //encryption data exists
    //MICROSERVICE, APP_EXTERNAL, APP_ACESS_EXTERNAL or token exists
    //decrypted Appsignature contains app_id = AppId
    if (security?.IamEncryption && 
        (
        //external can use encryption without idToken
        (endpoint?.startsWith('MICROSERVICE') ||endpoint == 'APP_EXTERNAL' || endpoint=='APP_ACCESS_EXTERNAL' ||
        security?.idToken?.replace('Bearer ','') == ORM.db.IamAppIdToken.get({  app_id:0, 
                                                                        resource_id:security?.IamEncryption.iam_app_id_token_id??null, 
                                                                        data:{data_app_id:null}}).result[0].token) &&
        await Security.securityTransportDecrypt({ 
            app_id:0,
            encrypted:  security.AppSignature??'',
            jwk:        JSON.parse(Buffer.from(security.IamEncryption.secret, 'base64').toString('utf-8')).jwk,
            iv:         JSON.parse(Buffer.from(security.IamEncryption.secret, 'base64').toString('utf-8')).iv})
            .then(result=>
                (JSON.parse(result).app_id == security?.AppId)?1:0)
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
        const configServer = ORM.db.ConfigServer.get({app_id:0}).result;
        /**@type{server_db_table_App['id'][]} */
        const apps = ORM.db.App.get({app_id:ORM.serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID)??0, resource_id:null})
                    .result.map((/**@type{server_db_table_App}*/app)=>{return app.id;});
        if (endpoint !=null && ['MICROSERVICE', 'MICROSERVICE_AUTH'].includes(endpoint))
            return {admin:false, 
                    app_id:ORM.serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID),
                    app_id_token:ORM.serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID),
                    //all apps
                    apps:apps};
        else
            if ([configServer.SERVER.filter(parameter=>'HTTP_PORT_ADMIN' in parameter)[0].HTTP_PORT_ADMIN]
                                    .includes(host.split(':')[host.split(':').length-1]))
                return {
                        admin:true,
                        app_id:ORM.serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_ADMIN_APP_ID' in parameter)[0].APP_ADMIN_APP_ID),
                        app_id_token:ORM.serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_ADMIN_APP_ID' in parameter)[0].APP_ADMIN_APP_ID),
                        //all apps
                        apps:apps
                };
            else        
                if (endpoint==null)
                    return {
                        admin:false,
                        app_id:ORM.serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID),
                        app_id_token:ORM.serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID),
                        //no apps
                        apps:[]
                    };
                else        
                    return {
                            admin:false,
                            app_id:ORM.serverUtilNumberValue(security?.AppId)??0,
                            app_id_token:ORM.serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID),
                            //all apps except admin
                            apps:apps.filter(id=>id != ORM.serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_ADMIN_APP_ID' in parameter)[0].APP_ADMIN_APP_ID))
                    };
    }
    
 };
 /**
  * @name commonAppMount
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
const commonAppMount = async parameters =>{
    /**@type{server_db_document_ConfigServer} */
    const configServer = ORM.db.ConfigServer.get({app_id:parameters.app_id}).result;
    if (parameters.resource_id == ORM.serverUtilNumberValue(configServer.SERVICE_APP
                                                        .filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID))
        return {http:400,
            code:null,
            text:null,
            developerText:'commonAppInit',
            moreInfo:null,
            type:'JSON'};
    else{
        /**@type{server_db_table_App} */
        const app = ORM.db.App.get({app_id:parameters.app_id, resource_id:parameters.resource_id}).result[0];
        const {socketConnectedUpdate} = await import ('../../../server/socket.js');
        
        if (app)
            return {result:{App:{   id:                     app.id,
                                    name:                   app.name,
                                    js:                     app.js,
                                    js_content:             (app.js && app.js!='')?
                                                                (await commonResourceFile({ app_id:parameters.app_id, 
                                                                                            resource_id:app.js,
                                                                                            content_type:'text/javascript', 
                                                                                            data_app_id:parameters.app_id})).result.resource:
                                                                    null,
                                    css:                    app.css,
                                    css_content:            (app.css && app.css!='')?
                                                                (await commonResourceFile({ app_id:parameters.app_id, 
                                                                                            resource_id:app.css,
                                                                                            content_type:'text/css', 
                                                                                            data_app_id:parameters.app_id})).result.resource:
                                                                    null,
                                    css_report:             app.css_report,
                                    css_report_content:     (app.css_report && app.css_report!='')?
                                                                (await commonResourceFile({ app_id:parameters.app_id, 
                                                                                            resource_id:app.css_report,
                                                                                            content_type:'text/css', 
                                                                                            data_app_id:parameters.app_id})).result.resource:
                                                                    null,
                                    favicon_32x32:          app.favicon_32x32,
                                    favicon_32x32_content:  app.favicon_32x32?
                                                                (await commonResourceFile({ app_id:parameters.app_id, 
                                                                                            resource_id:app.favicon_32x32,
                                                                                            content_type:'image/png', 
                                                                                            data_app_id:parameters.app_id})).result.resource:
                                                                    null,
                                    favicon_192x192:        app.favicon_192x192,
                                    favicon_192x192_content:app.favicon_192x192?
                                                                (await commonResourceFile({ app_id:parameters.app_id, 
                                                                                            resource_id:app.favicon_192x192,
                                                                                            content_type:'image/png', 
                                                                                            data_app_id:parameters.app_id})).result.resource:
                                                                    null,
                                    logo:                   app.logo,
                                    logo_content:           app.logo?
                                                                (await commonResourceFile({ app_id:parameters.app_id, 
                                                                                            resource_id:app.logo,
                                                                                            content_type:'image/png', 
                                                                                            data_app_id:parameters.app_id})).result.resource:
                                                                    null,
                                    copyright:              app.copyright,
                                    link_url:               app.link_url,
                                    link_title:             app.link_title,
                                    text_edit:              app.text_edit
                                },
                            AppParameter:ORM.db.AppParameter.get({  app_id:parameters.app_id, resource_id:parameters.resource_id}).result?.[0]??{},
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
                type:'JSON'};
    else
        if  ((await commonAppIam(parameters.host, 'APP')).admin == false && 
                await commonAppStart(parameters.app_id) ==false){
            const {default:ComponentCreate} = await import('./component/common_maintenance.js');
            return {result:await ComponentCreate({  data:   null,
                                                    methods:{commonResourceFile:commonResourceFile}
                                                }), type:'HTML'};
        }
        else{
            const {iamAuthorizeIdToken} = await import('../../../server/iam.js');
            const {default:ComponentCreate} = await import('./component/common_app.js');
            /**@type{server_db_document_ConfigServer} */
            const configServer = ORM.db.ConfigServer.get({app_id:parameters.app_id}).result;
            
            const admin_app_id = ORM.serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_ADMIN_APP_ID' in parameter)[0].APP_ADMIN_APP_ID)??1;
            const common_app_id = ORM.serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID)??0;
            
            const app_id = (await commonAppIam(parameters.host, 'APP')).admin?
                                admin_app_id:
                                    common_app_id;
            
            return {result:await ComponentCreate({data:     {
                                                            app_id:                             app_id,
                                                            app_admin_app_id:                   admin_app_id,
                                                            ip:                                 parameters.ip, 
                                                            user_agent:                         parameters.user_agent ??'', 
                                                            accept_language:                    parameters.accept_language??'',
                                                            configServer:                       configServer
                                                            },
                                                methods:    {
                                                            commonAppStart:commonAppStart,
                                                            commonGeodata:commonGeodata,
                                                            AppParameter:ORM.db.AppParameter,
                                                            IamEncryption:ORM.db.IamEncryption,
                                                            IamUser:ORM.db.IamUser,
                                                            iamAuthorizeIdToken:iamAuthorizeIdToken,
                                                            serverProcess:ORM.serverProcess,
                                                            serverUtilNumberValue:ORM.serverUtilNumberValue,
                                                            Security:Security,
                                                            commonResourceFile:commonResourceFile,
                                                            commonGetFile:commonGetFile
                                                            }})
                                .catch(error=>{
                                    return ORM.db.Log.post({ app_id:parameters.app_id, 
                                                                    data:{  object:'LogAppError', 
                                                                            app:{   app_filename:serverUtilAppFilename(import.meta.url),
                                                                                    app_function_name:'commonApp()',
                                                                                    app_line:serverUtilAppLine()
                                                                            },
                                                                            log:error
                                                                        }
                                                                    })
                                    .then(()=>{
                                        return commonAppError();
                                    });
                            }),
                    type:'HTML'};
        }
};
/**
 * @name commonAppError
 * @description Get server error
 * @function
* @returns {Promise.<string>}
*/
const commonAppError = async () =>{
    const {default:serverError} = await import('./component/common_server_error.js');
    return serverError({data:null, methods:null});
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
 * @returns {Promise.<server_server_response & {result?:{resource:string}}>}
 */
const commonAppResource = async parameters =>{
    
    if (parameters.app_id==null)
        return {http:404,
                code:null,
                text:null,
                developerText:'commonApp',
                moreInfo:null,
                type:'JSON'};
    else
        switch (true){
            case (parameters.data.type == 'INFO' && parameters.resource_id.toLowerCase() == 'disclaimer'):
            case (parameters.data.type == 'INFO' && parameters.resource_id.toLowerCase() == 'privacy_policy'):
            case (parameters.data.type == 'INFO' && parameters.resource_id.toLowerCase() == 'terms'):{
                const {default:ComponentCreate} = await import('./component/common_info.js');
                return {result:{resource:await ComponentCreate({  data: { app_name:   ORM.db.App.get({   
                                                                                        app_id:parameters.app_id, 
                                                                                        resource_id:parameters.app_id}).result[0].name,
                                                                                        /**@ts-ignore */
                                                                type:       'INFO_' + parameters.resource_id.toUpperCase()},
                                                        methods:null})
                                }, 
                        type:'JSON'};
            }
            case parameters.data.content_type == 'text/css':
            case parameters.data.content_type == 'font/woff2':
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
const commonRegistryAppModule = (app_id, parameters) => ORM.db.AppModule.get({app_id:app_id, resource_id:null, data:{data_app_id:app_id}}).result
                                                           .filter((/**@type{server_db_table_AppModule}*/app)=>
                                                               app.common_type==parameters.type && 
                                                               app.common_name==parameters.name && 
                                                               app.common_role == parameters.role)[0];

export {commonGetFile,
        commonCssFonts,
        commonSearchMatch,
        commonAppStart, commonClientLocale,
        commonAppIam, commonResourceFile,
        commonModuleRun,commonAppReport, commonAppReportQueue, commonModuleMetaDataGet, 
        commonAppMount,
        commonApp,
        commonAppError,
        commonAppResource,
        commonGeodata,
        commonBFE,
        commonRegistryAppModule};